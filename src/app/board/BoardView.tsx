"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MessageCircle, Eye, Smile, Sparkles } from "lucide-react";
import {
  listPosts,
  subscribeToPostChanges,
  type PostWithStats,
} from "@/lib/supabase/board";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { formatWhen } from "@/components/board/format";
import { PostComposer } from "@/components/board/PostComposer";

export function BoardView() {
  const [posts, setPosts] = useState<PostWithStats[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const reload = useCallback(async () => {
    try {
      const data = await listPosts(50, 0);
      setPosts(data);
      setError(null);
    } catch (e) {
      console.error("[board] reload failed:", e);
      const detail =
        e && typeof e === "object"
          ? // Supabase 에러: message + code + hint 등을 문자열로
            JSON.stringify(
              {
                message: (e as Error).message,
                ...(e as Record<string, unknown>),
              },
              null,
              2,
            )
          : String(e);
      setError(detail);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    reload();
    const unsubscribe = subscribeToPostChanges(() => reload());
    return unsubscribe;
  }, [reload]);

  if (!isSupabaseConfigured) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-app text-sm text-fg-muted">
        Supabase 환경변수가 설정되지 않았어요. <code>.env.local</code> 파일에{" "}
        <code>NEXT_PUBLIC_SUPABASE_URL</code> 과{" "}
        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> 를 입력한 뒤 재시작해주세요.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setComposerOpen((v) => !v)}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-palmon text-white shadow-soft"
        >
          <Sparkles size={16} /> {composerOpen ? "닫기" : "새 글"}
        </button>
      </div>

      {composerOpen && (
        <PostComposer
          onCreated={() => {
            setComposerOpen(false);
            reload();
          }}
        />
      )}

      {error && (
        <pre className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-[11px] text-red-500 whitespace-pre-wrap break-words overflow-x-auto">
          {error}
        </pre>
      )}

      {posts === null ? (
        <div className="p-8 text-center text-sm text-fg-muted">불러오는 중…</div>
      ) : posts.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-app text-center text-sm text-fg-muted">
          아직 게시글이 없어요. 첫 글을 남겨보세요!
        </div>
      ) : (
        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/board/${p.id}`}
                className="block bg-card rounded-2xl border border-app shadow-soft p-4 hover:border-palmon-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold truncate">{p.title}</h3>
                    <div className="text-xs text-fg-muted mt-1 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-fg">
                        {p.nickname}
                      </span>
                      <span>·</span>
                      <span>{formatWhen(p.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-fg-subtle shrink-0">
                    <span className="inline-flex items-center gap-0.5">
                      <MessageCircle size={12} /> {p.comment_count}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <Smile size={12} /> {p.reaction_count}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <Eye size={12} /> {p.view_count}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
