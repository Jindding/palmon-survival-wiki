import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 관리자 전용 Supabase 클라이언트.
//
// service_role 키는 RLS를 통째로 우회한다. 절대 브라우저로 나가면 안 된다.
// NEXT_PUBLIC_ 접두사가 없는 환경변수만 읽으므로 클라이언트 번들에는 값이 들어가지 않고,
// 이 모듈은 오직 app/api/admin 라우트에서만 import한다.

// Supabase가 API 키 체계를 바꾸는 중이다.
//   신규: Secret API key (sb_secret_...)  ← 대시보드가 권장하는 쪽
//   구형: service_role JWT (eyJ...)       ← 여전히 동작하지만 deprecated
// 둘 다 createClient에 같은 방식으로 넘기면 되므로 있는 것을 쓴다.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

let cached: SupabaseClient | null = null;

export const isAdminConfigured = Boolean(
  url && serviceKey && process.env.ADMIN_PASSWORD
);

export function getAdminSupabase(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error(
      "관리자 기능 환경변수가 없습니다. SUPABASE_SECRET_KEY 또는 SUPABASE_SERVICE_ROLE_KEY 확인 필요."
    );
  }
  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
