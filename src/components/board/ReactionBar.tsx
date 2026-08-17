"use client";

import { useMemo, useState } from "react";
import {
  EMOJI_LIST,
  EMOJI_LABEL,
  toggleReaction,
  type EmojiKey,
  type Reaction,
} from "@/lib/supabase/board";
import { getReactionKey } from "@/lib/supabase/anon";

export function ReactionBar({
  targetType,
  targetId,
  reactions,
  onChange,
}: {
  targetType: "post" | "comment";
  targetId: string;
  reactions: Reaction[];
  onChange?: () => void;
}) {
  const [busy, setBusy] = useState<EmojiKey | null>(null);
  const myKey = typeof window !== "undefined" ? getReactionKey() : "";

  const { counts, mine } = useMemo(() => {
    const counts: Record<EmojiKey, number> = {
      "👍": 0,
      "❤️": 0,
      "😂": 0,
      "😮": 0,
      "🔥": 0,
    };
    const mine = new Set<EmojiKey>();
    for (const r of reactions) {
      if (r.target_type !== targetType || r.target_id !== targetId) continue;
      counts[r.emoji] = (counts[r.emoji] ?? 0) + 1;
      if (r.author_key === myKey) mine.add(r.emoji);
    }
    return { counts, mine };
  }, [reactions, targetType, targetId, myKey]);

  async function handleClick(emoji: EmojiKey) {
    if (busy) return;
    setBusy(emoji);
    try {
      await toggleReaction({
        target_type: targetType,
        target_id: targetId,
        emoji,
        author_key: myKey,
      });
      onChange?.();
    } catch (e) {
      console.error("reaction toggle failed", e);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {EMOJI_LIST.map((emoji) => {
        const active = mine.has(emoji);
        const count = counts[emoji];
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => handleClick(emoji)}
            aria-label={EMOJI_LABEL[emoji]}
            disabled={busy === emoji}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs transition-all ${
              active
                ? "bg-palmon-primary/15 border-palmon-primary/50 text-palmon-primary"
                : "bg-card border-app hover:border-palmon-primary/40 text-fg-muted"
            } ${busy === emoji ? "opacity-60" : ""}`}
          >
            <span className="text-sm leading-none">{emoji}</span>
            {count > 0 && (
              <span className="tabular-nums font-bold">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
