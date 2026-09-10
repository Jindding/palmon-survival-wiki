import { getSupabase, isSupabaseConfigured } from "./client";

// 오로라 소환 랭킹.
//
// 조회는 브라우저에서 바로 읽고(공개 데이터라 숨길 게 없다),
// 등록은 /api/summon-record 를 거친다. 레이트리밋과 입력 검증을 한곳에 모으기 위해서다.
//
// 클라이언트에서 굴린 결과를 그대로 받으므로 조작을 완전히 막을 수는 없다.
// 랜덤이라 서버가 재현할 수 없기 때문이다. 화면에 "검증되지 않은 기록"이라고 밝혀 둔다.

export const RANKING_LIMIT = 10;

export interface SummonRecord {
  id: string;
  pulls: number;
  got_by: "direct" | "ceiling";
  palmon_id: string;
  nickname: string;
  server: string;
  created_at: string;
}

export interface SubmitRecordInput {
  pulls: number;
  gotBy: "direct" | "ceiling";
  palmonId: string;
  nickname: string;
  server: string;
}

/** 적게 뽑은 순 상위 기록. 같으면 먼저 등록한 쪽이 위로 간다. */
export async function listTopRecords(
  limit = RANKING_LIMIT
): Promise<SummonRecord[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await getSupabase()
    .from("summon_records")
    .select("*")
    .order("pulls", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) {
    // 랭킹은 부가 기능이라 실패해도 시뮬레이터를 막지 않는다.
    console.warn("[summon-records] list failed:", error.message, error);
    return [];
  }
  return (data ?? []) as SummonRecord[];
}

export type SubmitResult =
  | { ok: true; rank: number }
  | { ok: false; message: string };

export async function submitRecord(
  input: SubmitRecordInput
): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/summon-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const body = (await res.json()) as { rank?: number; error?: string };
    if (!res.ok) {
      return { ok: false, message: body.error ?? "등록에 실패했습니다." };
    }
    return { ok: true, rank: body.rank ?? 0 };
  } catch {
    return { ok: false, message: "등록에 실패했습니다." };
  }
}
