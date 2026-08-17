"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Trash2, Eye } from "lucide-react";
import {
  deletePost,
  getPost,
  incrementPostView,
  listComments,
  listReactions,
  subscribeToPostDetail,
  type Comment,
  type Post,
  type Reaction,
} from "@/lib/supabase/board";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { formatWhen } from "@/components/board/format";
import { MentionText } from "@/components/board/MentionText";
import { PasswordPrompt } from "@/components/board/PasswordPrompt";
import { ReactionBar } from "@/components/board/ReactionBar";
import { CommentThread } from "@/components/board/CommentThread";

export function PostView({ id }: { id: string }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletePrompt, setDeletePrompt] = useState(false);

  const reload = useCallback(async () => {
    try {
      const p = await getPost(id);
      setPost(p);
      if (!p) return;
      const cs = await listComments(id);
      const commentIds = cs.map((c) => c.id);
      const [postR, commentR] = await Promise.all([
        listReactions("post", [id]),
        commentIds.length > 0 ? listReactions("comment", commentIds) : Promise.resolve([]),
      ]);
      setComments(cs);
      setReactions([...postR, ...commentR]);
      setError(null);
    } catch (e) {
      console.error("[board] reload failed:", e);
      setError(e instanceof Error ? e.message : "불러오기 실패");
    }
  }, [id]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    reload();
    incrementPostView(id).catch(() => {});
    const unsub = subscribeToPostDetail(id, () => reload());
    return unsub;
  }, [id, reload]);

  if (!isSupabaseConfigured) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-app text-sm text-fg-muted">
        Supabase 환경변수 설정 필요.
      </div>
    );
  }

  if (post === undefined) {
    return <div className="p-8 text-center text-sm text-fg-muted">불러오는 중…</div>;
  }
  if (post === null) {
    return (
      <div className="p-8 rounded-2xl border border-dashed border-app text-center text-sm text-fg-muted">
        존재하지 않거나 삭제된 게시글이에요.
        <div className="mt-3">
          <Link href="/board" className="text-palmon-primary hover:underline">
            목록으로
          </Link>
        </div>
      </div>
    );
  }

  async function handleDeleteConfirm(password: string) {
    const ok = await deletePost(id, password);
    if (!ok) throw new Error("비밀번호가 일치하지 않습니다.");
    setDeletePrompt(false);
    router.push("/board");
  }

  return (
    <div className="space-y-4">
      <Link
        href="/board"
        className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-palmon-primary"
      >
        <ArrowLeft size={14} /> 목록
      </Link>

      {error && (
        <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-500">
          {error}
        </div>
      )}

      <article className="bg-card rounded-2xl border border-app shadow-soft p-5 md:p-6 space-y-4">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-2 text-xs text-fg-muted flex-wrap">
            <span className="font-bold text-fg">{post.nickname}</span>
            <span>·</span>
            <span>{formatWhen(post.created_at)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-0.5">
              <Eye size={12} /> {post.view_count}
            </span>
            <button
              type="button"
              onClick={() => setDeletePrompt(true)}
              className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-lg text-fg-subtle hover:bg-muted"
              title="본인만 삭제 가능"
            >
              <Trash2 size={12} /> 삭제
            </button>
          </div>
        </header>

        <div className="text-base whitespace-pre-wrap break-words leading-relaxed">
          <MentionText text={post.content} />
        </div>

        <ReactionBar
          targetType="post"
          targetId={post.id}
          reactions={reactions}
          onChange={reload}
        />
      </article>

      <CommentThread
        postId={post.id}
        comments={comments}
        reactions={reactions}
        onChanged={reload}
      />

      <PasswordPrompt
        open={deletePrompt}
        title="게시글 삭제"
        message="글 작성 시 입력한 비밀번호를 입력하세요."
        onClose={() => setDeletePrompt(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
