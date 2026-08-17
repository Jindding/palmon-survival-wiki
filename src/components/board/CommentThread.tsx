"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, CornerDownRight } from "lucide-react";
import {
  createComment,
  deleteComment,
  type Comment,
  type Reaction,
} from "@/lib/supabase/board";
import {
  getSavedNickname,
  saveNickname,
  validatePassword,
} from "@/lib/supabase/anon";
import { MentionText } from "./MentionText";
import { PasswordPrompt } from "./PasswordPrompt";
import { ReactionBar } from "./ReactionBar";
import { formatWhen } from "./format";

export function CommentThread({
  postId,
  comments,
  reactions,
  onChanged,
}: {
  postId: string;
  comments: Comment[];
  reactions: Reaction[];
  onChanged: () => void;
}) {
  const { roots, repliesOf } = useMemo(() => {
    const roots: Comment[] = [];
    const repliesOf: Record<string, Comment[]> = {};
    for (const c of comments) {
      if (c.parent_id) {
        (repliesOf[c.parent_id] ??= []).push(c);
      } else {
        roots.push(c);
      }
    }
    return { roots, repliesOf };
  }, [comments]);

  return (
    <div className="space-y-4">
      <div className="text-sm text-fg-muted">💬 {comments.length}개의 댓글</div>

      <CommentForm postId={postId} parentId={null} onCreated={onChanged} />

      <ul className="space-y-3">
        {roots.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            replies={repliesOf[c.id] ?? []}
            reactions={reactions}
            postId={postId}
            onChanged={onChanged}
          />
        ))}
      </ul>
    </div>
  );
}

function CommentItem({
  comment,
  replies,
  reactions,
  postId,
  onChanged,
}: {
  comment: Comment;
  replies: Comment[];
  reactions: Reaction[];
  postId: string;
  onChanged: () => void;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <li className="bg-card rounded-2xl border border-app p-4 space-y-2">
      <CommentBody comment={comment} onDeleted={onChanged} />
      <ReactionBar
        targetType="comment"
        targetId={comment.id}
        reactions={reactions}
        onChange={onChanged}
      />
      <div className="flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setReplying((v) => !v)}
          className="text-palmon-primary hover:underline"
        >
          {replying ? "취소" : "답글"}
        </button>
      </div>
      {replying && (
        <CommentForm
          postId={postId}
          parentId={comment.id}
          defaultText={`@${comment.nickname} `}
          onCreated={() => {
            setReplying(false);
            onChanged();
          }}
        />
      )}
      {replies.length > 0 && (
        <ul className="mt-2 pl-4 border-l-2 border-app space-y-2">
          {replies.map((r) => (
            <li key={r.id} className="pt-2">
              <div className="flex items-start gap-2">
                <CornerDownRight
                  size={14}
                  className="mt-1 text-fg-subtle shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <CommentBody comment={r} onDeleted={onChanged} />
                  <div className="mt-1">
                    <ReactionBar
                      targetType="comment"
                      targetId={r.id}
                      reactions={reactions}
                      onChange={onChanged}
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function CommentBody({
  comment,
  onDeleted,
}: {
  comment: Comment;
  onDeleted: () => void;
}) {
  const [prompt, setPrompt] = useState(false);

  async function handleConfirm(password: string) {
    const ok = await deleteComment(comment.id, password);
    if (!ok) throw new Error("비밀번호가 일치하지 않습니다.");
    setPrompt(false);
    onDeleted();
  }

  return (
    <>
      <div className="flex items-center gap-2 text-xs text-fg-subtle">
        <span className="font-bold text-fg">{comment.nickname}</span>
        <span>·</span>
        <span>{formatWhen(comment.created_at)}</span>
        <button
          type="button"
          onClick={() => setPrompt(true)}
          aria-label="삭제"
          className="ml-auto p-1 rounded hover:bg-muted text-fg-subtle"
          title="본인만 삭제 가능"
        >
          <Trash2 size={12} />
        </button>
      </div>
      <div className="text-sm whitespace-pre-wrap break-words">
        <MentionText text={comment.content} />
      </div>
      <PasswordPrompt
        open={prompt}
        title="댓글 삭제"
        message="댓글 작성 시 입력한 비밀번호를 입력하세요."
        onClose={() => setPrompt(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function CommentForm({
  postId,
  parentId,
  defaultText = "",
  onCreated,
}: {
  postId: string;
  parentId: string | null;
  defaultText?: string;
  onCreated: () => void;
}) {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [text, setText] = useState(defaultText);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNickname(getSavedNickname());
  }, []);

  async function submit() {
    setError(null);
    const nick = nickname.trim();
    const t = text.trim();
    if (nick.length < 1 || nick.length > 20) {
      setError("닉네임은 1~20자로 입력해주세요.");
      return;
    }
    const pwdErr = validatePassword(password);
    if (pwdErr) {
      setError(pwdErr);
      return;
    }
    if (t.length < 1 || t.length > 1000) {
      setError("댓글은 1~1000자로 입력해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      await createComment({
        post_id: postId,
        parent_id: parentId,
        nickname: nick,
        password,
        content: t,
      });
      saveNickname(nick);
      setText("");
      setPassword("");
      onCreated();
    } catch (e) {
      console.error("[board] createComment failed:", e);
      if (e && typeof e === "object") {
        const obj = e as Record<string, unknown>;
        const parts = [
          obj.message && `${obj.message}`,
          obj.code && `(code: ${obj.code})`,
          obj.hint && `hint: ${obj.hint}`,
        ].filter(Boolean);
        setError(parts.length ? parts.join(" · ") : "댓글 작성 실패");
      } else {
        setError("댓글 작성 실패");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          placeholder="닉네임"
          className="px-3 py-1.5 rounded-xl bg-muted border border-app text-xs focus:outline-none focus:ring-2 focus:ring-palmon-primary/40"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={20}
          placeholder="비밀번호"
          className="px-3 py-1.5 rounded-xl bg-muted border border-app text-xs focus:outline-none focus:ring-2 focus:ring-palmon-primary/40"
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1000}
        rows={parentId ? 2 : 3}
        placeholder={parentId ? "답글 쓰기" : "댓글 쓰기 (@닉네임 으로 멘션 가능)"}
        className="w-full px-3 py-2 rounded-xl bg-muted border border-app text-sm resize-y focus:outline-none focus:ring-2 focus:ring-palmon-primary/40"
      />
      {error && <div className="text-xs text-red-500">{error}</div>}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={submitting || text.trim().length === 0}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-palmon text-white disabled:opacity-50"
        >
          {submitting ? "작성 중…" : parentId ? "답글 등록" : "댓글 등록"}
        </button>
      </div>
    </div>
  );
}
