import { getSupabase, isSupabaseConfigured } from "./client";

// 유저가 직접 올리는 한줄팁.
//
// 조회는 브라우저에서 바로 읽고(공개 데이터라 숨길 게 없다),
// 등록은 /api/tip 을 거친다. 레이트리밋과 입력 검증을 한곳에 모으기 위해서다.

export const TIP_CONTENT_MAX = 300;
export const TIP_NICKNAME_MAX = 30;
export const TIP_LIST_LIMIT = 200;

export interface UserTip {
  id: string;
  content: string;
  /** Storage 경로. 첨부하지 않았으면 null. */
  image_path: string | null;
  nickname: string | null;
  server: string | null;
  is_anonymous: boolean;
  created_at: string;
}

export interface SubmitTipInput {
  content: string;
  /** 업로드를 마친 뒤의 Storage 경로. */
  imagePath?: string | null;
  /** 익명이면 서버·닉네임을 보내지 않는다. */
  anonymous: boolean;
  nickname?: string;
  server?: string;
  /** 허니팟. 봇이 채우면 서버에서 조용히 버린다. */
  hp?: string;
}

/** 최신순 팁 목록. */
export async function listUserTips(
  limit = TIP_LIST_LIMIT
): Promise<UserTip[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await getSupabase()
    .from("user_tips")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    // 유저 팁을 못 불러와도 기존 정리본은 보여야 하므로 페이지를 막지 않는다.
    console.warn("[user-tips] list failed:", error.message, error);
    return [];
  }
  return (data ?? []) as UserTip[];
}

export type SubmitTipResult =
  | { ok: true }
  | { ok: false; message: string };

export async function submitTip(
  input: SubmitTipInput
): Promise<SubmitTipResult> {
  try {
    const res = await fetch("/api/tip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const body = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };
    if (!res.ok || !body.ok) {
      return { ok: false, message: body.error ?? "등록에 실패했습니다." };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}
