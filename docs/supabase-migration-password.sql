-- =====================================================================
-- 마이그레이션: author_key(localStorage) → password_hash(익명 비밀번호)
-- 실행 위치: Supabase 대시보드 → SQL Editor
-- =====================================================================
-- 주의: posts / comments 기존 데이터는 삭제됩니다 (author_key 없이는 소유권 매핑 불가).
-- reactions 는 author_key 유지 (이모지 중복 방지 목적, 삭제 권한 아님).
-- =====================================================================

-- 뷰가 posts 컬럼을 참조하므로 먼저 제거 (컬럼 alter 이후 재생성)
drop view if exists public.posts_with_stats;

-- 기존 데이터 정리 (테스트 데이터만 있을 것으로 가정)
delete from public.comments;
delete from public.posts;

-- ========== posts ==========
alter table public.posts drop constraint if exists posts_author_key_check;
alter table public.posts drop column if exists author_key;

alter table public.posts
  add column if not exists password_hash text;

update public.posts set password_hash = '' where password_hash is null;

alter table public.posts
  alter column password_hash set not null;

alter table public.posts drop constraint if exists posts_password_hash_check;
alter table public.posts
  add constraint posts_password_hash_check check (char_length(password_hash) = 64);

-- ========== comments ==========
alter table public.comments drop constraint if exists comments_author_key_check;
alter table public.comments drop column if exists author_key;

alter table public.comments
  add column if not exists password_hash text;

update public.comments set password_hash = '' where password_hash is null;

alter table public.comments
  alter column password_hash set not null;

alter table public.comments drop constraint if exists comments_password_hash_check;
alter table public.comments
  add constraint comments_password_hash_check check (char_length(password_hash) = 64);

-- ========== 뷰 재생성 (author_key 참조 제거된 새 posts.* 사용) ==========
create or replace view public.posts_with_stats as
select
  p.*,
  coalesce((select count(*) from public.comments c
            where c.post_id = p.id and c.deleted_at is null), 0) as comment_count,
  coalesce((select count(*) from public.reactions r
            where r.target_type = 'post' and r.target_id = p.id), 0) as reaction_count
from public.posts p
where p.deleted_at is null;

-- PostgREST 스키마 캐시 갱신
notify pgrst, 'reload schema';
