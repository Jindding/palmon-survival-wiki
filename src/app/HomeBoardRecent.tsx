"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle, MessagesSquare } from "lucide-react";
import {
  listPosts,
  type PostWithStats,
} from "@/lib/supabase/board";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { formatWhen } from "@/components/board/format";

export function HomeBoardRecent() {
  const [posts, setPosts] = useState<PostWithStats[] | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setPosts([]);
      return;
    }
    listPosts(3, 0)
      .then(setPosts)
      .catch((e) => {
        console.error("[home board] failed:", e);
        setPosts([]);
      });
  }, []);

  return (
    <div className="p-5 rounded-2xl bg-card border border-app shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold flex items-center gap-2">
          <MessagesSquare
            size={16}
            style={{ color: "rgb(var(--primary))" }}
          />
          최근 자유게시판
        </h3>
        <Link
          href="/board"
          className="text-xs text-fg-subtle hover:text-palmon-primary transition-colors inline-flex items-center gap-0.5"
        >
          더보기 <ArrowRight size={12} />
        </Link>
      </div>

      {posts === null ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-11 rounded-lg bg-muted/60 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-xs text-fg-muted py-6 text-center">
          아직 게시글이 없어요.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/board/${p.id}`} className="block group">
                <div className="text-sm font-semibold truncate group-hover:text-palmon-primary transition-colors">
                  {p.title}
                </div>
                <div className="text-[11px] text-fg-subtle mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-fg-muted font-medium">
                    {p.nickname}
                  </span>
                  <span>·</span>
                  <span>{formatWhen(p.created_at)}</span>
                  {p.comment_count > 0 && (
                    <>
                      <span>·</span>
                      <span className="inline-flex items-center gap-0.5">
                        <MessageCircle size={10} /> {p.comment_count}
                      </span>
                    </>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
