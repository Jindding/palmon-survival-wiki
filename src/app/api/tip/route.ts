import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

// 유저 한줄팁 등록.
// contact · summon-record 라우트와 같은 방어선을 쓴다 — 허니팟 + 값 검증 + IP 레이트리밋.
// 값의 최종 유효성은 DB의 CHECK 제약이 한 번 더 잡는다.

export const runtime = "nodejs";

const CONTENT_MIN = 2;
const CONTENT_MAX = 300;
const NICKNAME_MAX = 30;
const SERVER_PATTERN = /^[0-9]{1,6}$/;
// uploads 버킷 안의 "posts/<uuid>.<ext>" · "tips/<uuid>.<ext>" 형태만 허용한다.
const IMAGE_PATH_PATTERN = /^(posts|tips)\/[0-9a-f-]{36}\.(jpg|png|webp|gif)$/;

// 팁은 게시글보다 짧고 가볍게 올리는 글이라 분당 3회로 묶는다.
const RATE_LIMIT = 3;
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

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: "팁 등록 기능이 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { content, anonymous, nickname, server, imagePath, hp } = (payload ??
    {}) as {
    content?: unknown;
    anonymous?: unknown;
    nickname?: unknown;
    server?: unknown;
    imagePath?: unknown;
    hp?: unknown;
  };

  // 허니팟에 값이 차 있으면 봇이다. 성공한 척하고 조용히 버린다.
  if (typeof hp === "string" && hp.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const cleanContent = typeof content === "string" ? content.trim() : "";
  const isAnonymous = anonymous === true;
  const cleanNickname =
    typeof nickname === "string" ? nickname.trim().slice(0, NICKNAME_MAX) : "";
  const cleanServer = typeof server === "string" ? server.trim() : "";
  // 업로드를 마친 Storage 경로만 받는다. 버킷 안의 경로 형식이 아니면 버린다.
  const cleanImagePath =
    typeof imagePath === "string" && IMAGE_PATH_PATTERN.test(imagePath)
      ? imagePath
      : null;

  if (
    cleanContent.length < CONTENT_MIN ||
    cleanContent.length > CONTENT_MAX
  ) {
    return NextResponse.json(
      { error: `팁 내용을 ${CONTENT_MIN}~${CONTENT_MAX}자로 적어주세요.` },
      { status: 400 }
    );
  }

  if (
    !isAnonymous &&
    (cleanNickname.length === 0 || !SERVER_PATTERN.test(cleanServer))
  ) {
    return NextResponse.json(
      { error: "서버 번호와 닉네임을 올바르게 입력해주세요." },
      { status: 400 }
    );
  }

  if (!checkRateLimit(getClientIp(req))) {
    return NextResponse.json(
      { error: "요청이 너무 잦습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const { error } = await getSupabase().from("user_tips").insert({
    content: cleanContent,
    nickname: isAnonymous ? null : cleanNickname,
    server: isAnonymous ? null : cleanServer,
    is_anonymous: isAnonymous,
    image_path: cleanImagePath,
  });

  if (error) {
    return NextResponse.json(
      { error: "등록에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
