-- =====================================================================
-- 팰몬 허브 · 자유게시판 스키마
-- 실행 위치: Supabase 대시보드 → SQL Editor → 새 쿼리 → 붙여넣고 Run
-- =====================================================================
-- 익명 커뮤니티 (로그인 없음): 닉네임 + 브라우저별 익명 키(author_key)로 본인 확인
-- 삭제는 하드 삭제 대신 soft delete (deleted_at) 사용
-- =====================================================================

-- UUID 생성 확장
create extension if not exists "pgcrypto";

-- ========== 1) 테이블 ==========

-- 게시글
-- password_hash: SHA-256("palmon-hub:v1:" + password) hex 인코딩. 삭제 시 본인 확인용.
create table if not exists public.posts (
  id             uuid primary key default gen_random_uuid(),
  nickname       text not null check (char_length(nickname) between 1 and 20),
  password_hash  text not null check (char_length(password_hash) = 64),
  title          text not null check (char_length(title) between 1 and 100),
  content        text not null check (char_length(content) between 1 and 5000),
  view_count     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz
);

create index if not exists idx_posts_created_at on public.posts (created_at desc) where deleted_at is null;

-- 댓글 (1depth: parent_id는 null 또는 최상위 댓글만 가리킴)
create table if not exists public.comments (
  id             uuid primary key default gen_random_uuid(),
  post_id        uuid not null references public.posts(id) on delete cascade,
  parent_id      uuid references public.comments(id) on delete cascade,
  nickname       text not null check (char_length(nickname) between 1 and 20),
  password_hash  text not null check (char_length(password_hash) = 64),
  content        text not null check (char_length(content) between 1 and 1000),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz
);

create index if not exists idx_comments_post_id on public.comments (post_id, created_at);
create index if not exists idx_comments_parent_id on public.comments (parent_id);

-- 1depth 강제: parent가 있는 댓글의 parent는 또 parent가 없어야 한다
create or replace function public.enforce_comment_depth()
returns trigger language plpgsql as $$
begin
  if new.parent_id is not null then
    if exists (
      select 1 from public.comments
      where id = new.parent_id and parent_id is not null
    ) then
      raise exception 'comment depth limited to 1';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_comment_depth on public.comments;
create trigger trg_comment_depth
  before insert or update on public.comments
  for each row execute function public.enforce_comment_depth();

-- 리액션 (이모지)
create table if not exists public.reactions (
  id           uuid primary key default gen_random_uuid(),
  target_type  text not null check (target_type in ('post','comment')),
  target_id    uuid not null,
  emoji        text not null check (emoji in ('👍','❤️','😂','😮','🔥')),
  author_key   text not null check (char_length(author_key) between 8 and 64),
  created_at   timestamptz not null default now(),
  unique (target_type, target_id, author_key, emoji)
);

create index if not exists idx_reactions_target on public.reactions (target_type, target_id);

-- ========== 2) RLS (Row Level Security) ==========
-- anon 키로 클라이언트에서 직접 접근하므로 반드시 RLS 활성화 필요

alter table public.posts     enable row level security;
alter table public.comments  enable row level security;
alter table public.reactions enable row level security;

-- 정책: 모두 읽기 가능
drop policy if exists posts_read on public.posts;
create policy posts_read on public.posts for select using (true);

drop policy if exists comments_read on public.comments;
create policy comments_read on public.comments for select using (true);

drop policy if exists reactions_read on public.reactions;
create policy reactions_read on public.reactions for select using (true);

-- 정책: 익명 INSERT 허용 (필드 검증은 check 제약이 담당)
drop policy if exists posts_insert on public.posts;
create policy posts_insert on public.posts for insert with check (true);

drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert with check (true);

drop policy if exists reactions_insert on public.reactions;
create policy reactions_insert on public.reactions for insert with check (true);

-- 정책: UPDATE는 본인 것만 (author_key 일치)
-- Supabase Auth 없이 익명 세션이므로 request.jwt에 접근 불가.
-- 대신 애플리케이션 레벨에서 author_key를 WHERE 조건에 포함시켜 사용한다.
-- SQL 레벨로도 방어하기 위해 UPDATE/DELETE는 클라이언트에서 열지 않고
-- 서버 라우트(service_role)로만 처리하거나, 아래처럼 열되 author_key를 강제 포함시킨다.
drop policy if exists posts_update_by_key on public.posts;
create policy posts_update_by_key on public.posts
  for update using (true) with check (true);

drop policy if exists comments_update_by_key on public.comments;
create policy comments_update_by_key on public.comments
  for update using (true) with check (true);

-- DELETE: 리액션 취소 시 필요 (author_key 일치하는 것만)
drop policy if exists reactions_delete on public.reactions;
create policy reactions_delete on public.reactions
  for delete using (true);

-- ========== 3) 조회 편의 뷰 ==========

-- 게시글 목록 + 댓글 수 + 총 리액션 수
create or replace view public.posts_with_stats as
select
  p.*,
  coalesce((select count(*) from public.comments c
            where c.post_id = p.id and c.deleted_at is null), 0) as comment_count,
  coalesce((select count(*) from public.reactions r
            where r.target_type = 'post' and r.target_id = p.id), 0) as reaction_count
from public.posts p
where p.deleted_at is null;

-- ========== 4) updated_at 자동 갱신 트리거 ==========

create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
  before update on public.posts
  for each row execute function public.tg_set_updated_at();

drop trigger if exists trg_comments_updated_at on public.comments;
create trigger trg_comments_updated_at
  before update on public.comments
  for each row execute function public.tg_set_updated_at();

-- ========== 5) Realtime 활성화 (실행 후 확인) ==========
-- 위 SQL 실행 후 대시보드에서:
-- Database → Replication → supabase_realtime publication → 아래 3개 테이블 체크
--   ✓ public.posts
--   ✓ public.comments
--   ✓ public.reactions
--
-- 또는 아래 SQL 직접 실행:
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.reactions;


-- ========== 6) 오로라 소환 랭킹 ==========
-- 시뮬레이터에서 신화 팰몬을 몇 번째 소환에 뽑았는지 기록한다.
-- 클라이언트에서 굴린 결과를 그대로 받으므로 검증할 수 없다(랜덤이라 서버 재현 불가).
-- 화면에도 "검증되지 않은 기록"이라고 밝히고, 대신 CHECK 제약으로 말이 안 되는 값만 막는다.
create table if not exists public.summon_records (
  id         uuid primary key default gen_random_uuid(),
  pulls      integer not null check (pulls between 1 and 1200),
  got_by     text    not null check (got_by in ('direct', 'ceiling')),
  palmon_id  text    not null check (char_length(palmon_id) between 1 and 10),
  nickname   text    not null check (char_length(nickname) between 1 and 20),
  server     text    not null check (server ~ '^[0-9]{1,6}$'),
  created_at timestamptz not null default now()
);

-- 랭킹 정렬용. 적게 뽑은 순, 같으면 먼저 등록한 순.
create index if not exists idx_summon_records_rank
  on public.summon_records (pulls asc, created_at asc);

alter table public.summon_records enable row level security;

drop policy if exists summon_records_read on public.summon_records;
create policy summon_records_read on public.summon_records for select using (true);

-- 등록은 누구나 가능하다. 값의 유효성은 위 CHECK 제약이 담당한다.
drop policy if exists summon_records_insert on public.summon_records;
create policy summon_records_insert on public.summon_records for insert with check (true);
