"use client";

import { useEffect, useState } from "react";
import { createPost } from "@/lib/supabase/board";
import {
  getSavedNickname,
  saveNickname,
  validatePassword,
} from "@/lib/supabase/anon";

export function PostComposer({ onCreated }: { onCreated: (id: string) => void }) {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNickname(getSavedNickname());
  }, []);

  async function submit() {
    setError(null);
    const nick = nickname.trim();
    const pwd = password;
    const t = title.trim();
    const c = content.trim();
    if (nick.length < 1 || nick.length > 20) {
      setError("닉네임은 1~20자로 입력해주세요.");
      return;
    }
    const pwdErr = validatePassword(pwd);
    if (pwdErr) {
      setError(pwdErr);
      return;
    }
    if (t.length < 1 || t.length > 100) {
      setError("제목은 1~100자로 입력해주세요.");
      return;
    }
    if (c.length < 1 || c.length > 5000) {
      setError("본문은 1~5000자로 입력해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const post = await createPost({
        nickname: nick,
        password: pwd,
        title: t,
        content: c,
      });
      saveNickname(nick);
      setTitle("");
      setContent("");
      setPassword("");
      onCreated(post.id);
    } catch (e) {
      console.error("[board] createPost failed:", e);
      setError(formatSupabaseError(e));
    } finally {
      setSubmitting(false);
    }
  }

  function formatSupabaseError(e: unknown): string {
    if (!e) return "글 작성에 실패했습니다.";
    if (typeof e === "object") {
      const obj = e as Record<string, unknown>;
      const parts = [
        obj.message && `${obj.message}`,
        obj.code && `(code: ${obj.code})`,
        obj.hint && `hint: ${obj.hint}`,
        obj.details && `details: ${obj.details}`,
      ].filter(Boolean);
      if (parts.length) return parts.join(" · ");
    }
    return String(e);
  }

  return (
    <div className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5 space-y-3">
      <div className="text-sm font-bold">✍️ 새 글 쓰기</div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          placeholder="닉네임"
          className="px-3 py-2 rounded-xl bg-muted border border-app text-sm focus:outline-none focus:ring-2 focus:ring-palmon-primary/40"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={20}
          placeholder="비밀번호 (삭제 시 필요)"
          className="px-3 py-2 rounded-xl bg-muted border border-app text-sm focus:outline-none focus:ring-2 focus:ring-palmon-primary/40"
        />
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        placeholder="제목 (1~100자)"
        className="w-full px-3 py-2 rounded-xl bg-muted border border-app text-sm focus:outline-none focus:ring-2 focus:ring-palmon-primary/40"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={5000}
        rows={5}
        placeholder="본문 (@닉네임 으로 멘션 가능)"
        className="w-full px-3 py-2 rounded-xl bg-muted border border-app text-sm resize-y focus:outline-none focus:ring-2 focus:ring-palmon-primary/40"
      />
      {error && <div className="text-xs text-red-500">{error}</div>}
      <div className="flex items-center justify-between">
        <div className="text-[11px] text-fg-subtle">{content.length} / 5000</div>
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-palmon text-white disabled:opacity-50"
        >
          {submitting ? "작성 중…" : "등록"}
        </button>
      </div>
    </div>
  );
}
