import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

// 오로라 소환 랭킹 등록.
// contact 라우트와 같은 방어선을 쓴다 — 값 검증 + IP 레이트리밋.
//
// 시뮬레이터 결과를 그대로 받는 구조라 조작을 완전히 막지는 못한다.
// 다만 말이 안 되는 값과 도배는 여기서 걸러낸다. (DB에도 CHECK 제약이 걸려 있다)

export const runtime = "nodejs";

const NICKNAME_MAX = 20;
const SERVER_PATTERN = /^[0-9]{1,6}$/;
const MIN_PULLS = 1;
const MAX_PULLS = 1200;

const RATE_LIMIT = 5;
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
      { error: "랭킹 기능이 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { pulls, gotBy, palmonId, nickname, server } = (payload ?? {}) as {
    pulls?: unknown;
    gotBy?: unknown;
    palmonId?: unknown;
    nickname?: unknown;
    server?: unknown;
  };

  const cleanNickname =
    typeof nickname === "string" ? nickname.trim().slice(0, NICKNAME_MAX) : "";
  const cleanServer = typeof server === "string" ? server.trim() : "";

  if (
    typeof pulls !== "number" ||
    !Number.isInteger(pulls) ||
    pulls < MIN_PULLS ||
    pulls > MAX_PULLS ||
    (gotBy !== "direct" && gotBy !== "ceiling") ||
    typeof palmonId !== "string" ||
    palmonId.length === 0 ||
    palmonId.length > 10 ||
    cleanNickname.length === 0 ||
    !SERVER_PATTERN.test(cleanServer)
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

  const supabase = getSupabase();

  const { data: inserted, error } = await supabase
    .from("summon_records")
    .insert({
      pulls,
      got_by: gotBy,
      palmon_id: palmonId,
      nickname: cleanNickname,
      server: cleanServer,
    })
    .select("id, pulls, created_at")
    .single();

  if (error || !inserted) {
    return NextResponse.json(
      { error: "등록에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 502 }
    );
  }

  // 내 기록보다 앞선 기록 수 = 내 순위 - 1.
  // 적게 뽑은 쪽이 위, 같으면 먼저 등록한 쪽이 위다.
  const [{ count: fewer }, { count: sameButEarlier }] = await Promise.all([
    supabase
      .from("summon_records")
      .select("id", { count: "exact", head: true })
      .lt("pulls", inserted.pulls),
    supabase
      .from("summon_records")
      .select("id", { count: "exact", head: true })
      .eq("pulls", inserted.pulls)
      .lt("created_at", inserted.created_at),
  ]);

  return NextResponse.json({
    rank: (fewer ?? 0) + (sameButEarlier ?? 0) + 1,
  });
}
