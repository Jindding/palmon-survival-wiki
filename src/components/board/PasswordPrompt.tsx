"use client";

import { useEffect, useState } from "react";

export function PasswordPrompt({
  open,
  title = "비밀번호 확인",
  message = "작성 시 입력한 비밀번호를 입력하세요.",
  onClose,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void> | void;
}) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setPassword("");
      setError(null);
      setBusy(false);
    }
  }, [open]);

  if (!open) return null;

  async function submit() {
    if (!password) {
      setError("비밀번호를 입력하세요.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onConfirm(password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "확인 실패");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border border-app shadow-2xl p-5 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-xs text-fg-muted mb-4">{message}</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !busy && submit()}
          autoFocus
          maxLength={20}
          placeholder="비밀번호"
          className="w-full px-3 py-2 rounded-xl bg-muted border border-app text-sm focus:outline-none focus:ring-2 focus:ring-palmon-primary/40 mb-3"
        />
        {error && <div className="text-xs text-red-500 mb-2">{error}</div>}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-3 py-1.5 rounded-lg text-sm text-fg-muted hover:bg-muted disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="px-4 py-1.5 rounded-lg text-sm font-bold bg-gradient-palmon text-white disabled:opacity-50"
          >
            {busy ? "확인 중…" : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
