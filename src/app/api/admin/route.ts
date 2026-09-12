import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  getAdminSupabase,
  isAdminConfigured,
} from "@/lib/supabase/admin-client";
import { UPLOAD_BUCKET } from "@/lib/supabase/uploads";

// 관리자 도구 백엔드.
//
// 로그인 체계를 새로 만들지 않고 ADMIN_PASSWORD 환경변수 하나로 막는다.
// 이용자 규모가 작고, 하는 일이 "신고 들어온 글 지우기" 하나뿐이라 이 정도면 충분하다.
//
// 비밀번호는 매 요청 본문으로 받는다. 세션·쿠키를 두지 않으므로 탈취면이 좁고,
// 브라우저 쪽은 sessionStorage에만 들고 있다가 탭을 닫으면 사라진다.

export const runtime = "nodejs";

const LIST_LIMIT = 50;

// 무차별 대입 방지. 실패해도 성공해도 같은 창에서 센다.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** 길이 차이로 정답을 좁히지 못하도록 상수 시간 비교를 쓴다. */
function passwordMatches(input: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== "string") return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

interface AdminRow {
  kind: "post" | "comment" | "tip";
  id: string;
  title: string;
  content: string;
  author: string;
  image_path: string | null;
  created_at: string;
  /** 댓글이면 원글로 이동할 수 있게 남긴다. */
  post_id?: string;
}

export async function POST(req: NextRequest) {
  if (!isAdminConfigured) {
    return NextResponse.json(
      {
        error:
          "관리자 기능이 설정되지 않았습니다. ADMIN_PASSWORD 와 SUPABASE_SECRET_KEY(또는 SUPABASE_SERVICE_ROLE_KEY) 환경변수를 확인해주세요.",
      },
      { status: 500 }
    );
  }

  if (!checkRateLimit(getClientIp(req))) {
    return NextResponse.json(
      { error: "요청이 너무 잦습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { password, action, kind, id } = (payload ?? {}) as {
    password?: unknown;
    action?: unknown;
    kind?: unknown;
    id?: unknown;
  };

  if (!passwordMatches(password)) {
    return NextResponse.json(
      { error: "비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  const supabase = getAdminSupabase();

  if (action === "list") {
    const [posts, comments, tips] = await Promise.all([
      supabase
        .from("posts")
        .select("id, title, content, nickname, image_path, created_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(LIST_LIMIT),
      supabase
        .from("comments")
        .select("id, post_id, content, nickname, created_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(LIST_LIMIT),
      supabase
        .from("user_tips")
        .select("id, content, nickname, server, is_anonymous, image_path, created_at")
        .order("created_at", { ascending: false })
        .limit(LIST_LIMIT),
    ]);

    const rows: AdminRow[] = [
      ...(posts.data ?? []).map((p) => ({
        kind: "post" as const,
        id: p.id as string,
        title: p.title as string,
        content: p.content as string,
        author: p.nickname as string,
        image_path: (p.image_path as string | null) ?? null,
        created_at: p.created_at as string,
      })),
      ...(comments.data ?? []).map((c) => ({
        kind: "comment" as const,
        id: c.id as string,
        title: "",
        content: c.content as string,
        author: c.nickname as string,
        image_path: null,
        created_at: c.created_at as string,
        post_id: c.post_id as string,
      })),
      ...(tips.data ?? []).map((t) => ({
        kind: "tip" as const,
        id: t.id as string,
        title: "",
        content: t.content as string,
        author: t.is_anonymous
          ? "익명"
          : `${t.nickname as string} #${t.server as string}`,
        image_path: (t.image_path as string | null) ?? null,
        created_at: t.created_at as string,
      })),
    ].sort((a, b) => b.created_at.localeCompare(a.created_at));

    return NextResponse.json({
      ok: true,
      rows,
      // 테이블이 아직 없을 수도 있으니 조회 실패는 감추지 말고 알려 준다.
      warnings: [posts.error, comments.error, tips.error]
        .filter(Boolean)
        .map((e) =>
          /jwt|api key|invalid|unauthor/i.test(e!.message)
            ? `${e!.message} — Supabase 키가 거부됐습니다. Secret API key(sb_secret_...) 또는 service_role 키가 맞는지 확인해주세요.`
            : e!.message
        ),
    });
  }

  if (action === "delete") {
    if (
      typeof id !== "string" ||
      id.length === 0 ||
      (kind !== "post" && kind !== "comment" && kind !== "tip")
    ) {
      return NextResponse.json(
        { error: "삭제 대상이 올바르지 않습니다." },
        { status: 400 }
      );
    }

    // 첨부 이미지는 글을 지우기 전에 먼저 찾아 둔다. 행을 지운 뒤에는 경로를 알 수 없다.
    let imagePath: string | null = null;
    if (kind === "post" || kind === "tip") {
      const table = kind === "post" ? "posts" : "user_tips";
      const { data } = await supabase
        .from(table)
        .select("image_path")
        .eq("id", id)
        .maybeSingle();
      imagePath = (data?.image_path as string | null) ?? null;
    }

    // 게시글·댓글은 soft delete (기존 삭제 흐름과 동일), 팁은 행을 지운다.
    const { error } =
      kind === "tip"
        ? await supabase.from("user_tips").delete().eq("id", id)
        : await supabase
            .from(kind === "post" ? "posts" : "comments")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: `삭제에 실패했습니다: ${error.message}` },
        { status: 502 }
      );
    }

    // 파일까지 지워야 용량이 실제로 회수된다. 실패해도 글 삭제는 이미 끝났으므로 막지 않는다.
    let imageWarning: string | null = null;
    if (imagePath) {
      const { error: storageError } = await supabase.storage
        .from(UPLOAD_BUCKET)
        .remove([imagePath]);
      if (storageError) imageWarning = storageError.message;
    }

    return NextResponse.json({ ok: true, imageWarning });
  }

  return NextResponse.json(
    { error: "알 수 없는 요청입니다." },
    { status: 400 }
  );
}
