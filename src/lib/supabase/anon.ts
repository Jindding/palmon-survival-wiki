// 리액션(이모지) 전용 익명 식별자: localStorage 기반.
// 게시글/댓글은 별도로 nickname + password_hash 방식이므로 여기 로직 사용 안 함.
// 리액션은 "같은 사람이 같은 이모지 두 번 못 누르게" 만 하면 되므로 이 정도로 충분.

const AUTHOR_KEY_STORAGE = "palmon-hub:reaction-key";
const NICKNAME_STORAGE = "palmon-hub:nickname"; // 프리필 편의용 (본인 확인 아님)

function generateAuthorKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// 리액션 전용 익명 키. 로컬 저장소 삭제 시 새로 발급됨.
export function getReactionKey(): string {
  if (typeof window === "undefined") return "";
  let key = localStorage.getItem(AUTHOR_KEY_STORAGE);
  if (!key) {
    key = generateAuthorKey();
    localStorage.setItem(AUTHOR_KEY_STORAGE, key);
  }
  return key;
}

// 닉네임 프리필: 편의성만, 신원 검증 아님.
export function getSavedNickname(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(NICKNAME_STORAGE) ?? "";
}

export function saveNickname(name: string): void {
  if (typeof window === "undefined") return;
  const trimmed = name.trim();
  if (!trimmed) return;
  localStorage.setItem(NICKNAME_STORAGE, trimmed.slice(0, 20));
}

// SHA-256 해시. password_hash 계산 및 삭제 시 검증에 사용.
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`palmon-hub:v1:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 비밀번호 정책: 4~20자
export function validatePassword(password: string): string | null {
  const len = password.length;
  if (len < 4) return "비밀번호는 최소 4자 이상이어야 합니다.";
  if (len > 20) return "비밀번호는 최대 20자입니다.";
  return null;
}
