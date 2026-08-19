"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function ContactForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.kind === "sending") return;

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), hp }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus({
          kind: "error",
          message: data.error ?? "발송에 실패했습니다.",
        });
        return;
      }
      setStatus({ kind: "success" });
      setTitle("");
      setBody("");
    } catch {
      setStatus({
        kind: "error",
        message: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  };

  const canSubmit =
    title.trim().length > 0 &&
    body.trim().length > 0 &&
    status.kind !== "sending";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="contact-title" className="text-sm font-semibold">
          제목
        </label>
        <input
          id="contact-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예) 팰몬 도감 오탈자 제보"
          maxLength={100}
          required
          disabled={status.kind === "sending"}
          className="w-full px-3 py-2 rounded-xl border border-app bg-card text-sm focus:outline-none focus:border-palmon-primary disabled:opacity-60"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="contact-body" className="text-sm font-semibold">
          내용
        </label>
        <textarea
          id="contact-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="문의하실 내용을 자세히 적어주세요."
          rows={10}
          maxLength={4000}
          required
          disabled={status.kind === "sending"}
          className="w-full px-3 py-2 rounded-xl border border-app bg-card text-sm focus:outline-none focus:border-palmon-primary resize-y disabled:opacity-60"
        />
        <div className="text-[11px] text-fg-subtle text-right">
          {body.length} / 4000
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label>
          웹사이트
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
          />
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-palmon text-white shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status.kind === "sending" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> 발송 중...
            </>
          ) : (
            <>
              <Send size={16} /> 문의 보내기
            </>
          )}
        </button>
      </div>

      {status.kind === "success" && (
        <div
          role="status"
          className="flex items-start gap-2 p-3 rounded-xl text-sm border border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300"
        >
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          <div>
            문의가 정상적으로 전달되었습니다. 확인 후 순차적으로 검토할게요.
          </div>
        </div>
      )}

      {status.kind === "error" && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 rounded-xl text-sm border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div>{status.message}</div>
        </div>
      )}

      <div
        className="p-4 rounded-xl text-xs text-fg-muted"
        style={{ backgroundColor: "rgb(var(--muted))" }}
      >
        <div className="mb-1 font-semibold">📮 안내</div>
        <p>
          문의는 관리자에게 이메일로 전달됩니다. 스팸 방지를 위해 1분에 5회까지
          전송할 수 있어요.
        </p>
      </div>
    </form>
  );
}
