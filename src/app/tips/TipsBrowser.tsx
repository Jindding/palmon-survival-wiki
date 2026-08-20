"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageSquarePlus,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import type { Tip } from "@/lib/data/tips";
import { SourceBadge } from "@/components/SourceBadge";

export function TipsBrowser({ tips }: { tips: Tip[] }) {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tips;
    return tips.filter(
      (t) =>
        t.content.toLowerCase().includes(q) ||
        t.by.toLowerCase().includes(q)
    );
  }, [tips, query]);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl border-2 border-dashed hover:opacity-90 transition-opacity text-left group"
        style={{
          borderColor: "rgb(var(--primary) / 0.4)",
          backgroundImage:
            "linear-gradient(135deg, rgb(var(--primary) / 0.08), rgb(var(--accent) / 0.08))",
        }}
      >
        <div
          className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl text-white shadow-soft flex-shrink-0 bg-gradient-palmon"
          aria-hidden
        >
          💡
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm md:text-base font-bold flex items-center gap-1.5">
            알고 계신 팁이 있으신가요?
            <Sparkles
              size={14}
              className="opacity-70"
              style={{ color: "rgb(var(--accent))" }}
            />
          </div>
          <div className="text-xs md:text-sm text-fg-muted mt-0.5">
            제보해주시면 검토 후 이 페이지에 반영해드려요. 익명 제보도 가능해요!
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold bg-gradient-palmon text-white shadow-soft flex-shrink-0">
          <MessageSquarePlus size={16} />
          <span className="hidden sm:inline">팁 제보하기</span>
          <span className="sm:hidden">제보</span>
        </div>
      </button>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="팁 · 제보자 · 서버로 검색"
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-app bg-card text-sm focus:outline-none focus:border-palmon-primary"
        />
      </div>

      {query && (
        <div className="text-xs text-fg-subtle">
          검색 결과 {filtered.length}건
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-app text-center text-sm text-fg-muted">
          {query ? "검색 결과가 없어요." : "아직 등록된 팁이 없어요."}
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((tip, i) => (
            <li
              key={i}
              className="relative bg-card rounded-2xl p-5 md:p-6 border border-app shadow-soft"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    backgroundColor: "rgb(var(--secondary) / 0.25)",
                    color: "rgb(var(--fg))",
                  }}
                  aria-hidden
                >
                  💡
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base md:text-lg leading-relaxed">
                    {tip.content}
                  </p>
                  {tip.by && (
                    <div className="mt-3 text-xs text-fg-subtle">
                      <SourceBadge name={tip.by} />
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && <TipReportModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string };

function TipReportModal({ onClose }: { onClose: () => void }) {
  const [anonymous, setAnonymous] = useState(false);
  const [server, setServer] = useState("");
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status.kind !== "sending") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = origOverflow;
    };
  }, [onClose, status.kind]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.kind === "sending") return;

    setStatus({ kind: "sending" });
    try {
      const title = anonymous
        ? "[팁 제보] 익명"
        : `[팁 제보] ${server.trim()}서버 ${nickname.trim()}`.slice(0, 100);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body: content.trim(), hp }),
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
      setServer("");
      setNickname("");
      setContent("");
    } catch {
      setStatus({
        kind: "error",
        message: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  };

  const canSubmit =
    content.trim().length > 0 &&
    (anonymous ||
      (server.trim().length > 0 && nickname.trim().length > 0)) &&
    status.kind !== "sending";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tip-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => status.kind !== "sending" && onClose()}
      />
      <div className="relative bg-card rounded-2xl border border-app shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-app">
          <h2 id="tip-modal-title" className="text-base font-bold">
            💡 팁 제보
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={status.kind === "sending"}
            aria-label="닫기"
            className="p-1 rounded-lg hover:opacity-70 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <label
            className="flex items-center gap-2 cursor-pointer select-none p-2.5 rounded-xl border border-app hover:border-palmon-primary/50 transition-colors"
            style={
              anonymous
                ? {
                    backgroundColor: "rgb(var(--primary) / 0.08)",
                    borderColor: "rgb(var(--primary) / 0.4)",
                  }
                : undefined
            }
          >
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              disabled={status.kind === "sending"}
              className="w-4 h-4 accent-current"
              style={{ accentColor: "rgb(var(--primary))" }}
            />
            <span className="text-sm font-semibold">익명으로 제보</span>
            <span className="text-xs text-fg-subtle">
              (서버·닉네임 없이 제보)
            </span>
          </label>

          {!anonymous && (
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label htmlFor="tip-server" className="text-xs font-semibold">
                  서버
                </label>
                <input
                  id="tip-server"
                  type="text"
                  inputMode="numeric"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  placeholder="예) 201"
                  maxLength={10}
                  required
                  disabled={status.kind === "sending"}
                  className="w-full px-3 py-2 rounded-xl border border-app bg-card text-sm focus:outline-none focus:border-palmon-primary disabled:opacity-60"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label htmlFor="tip-nick" className="text-xs font-semibold">
                  닉네임
                </label>
                <input
                  id="tip-nick"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="예) Aiden Reed"
                  maxLength={30}
                  required
                  disabled={status.kind === "sending"}
                  className="w-full px-3 py-2 rounded-xl border border-app bg-card text-sm focus:outline-none focus:border-palmon-primary disabled:opacity-60"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="tip-content" className="text-xs font-semibold">
              내용
            </label>
            <textarea
              id="tip-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="공유하고 싶은 팁을 자세히 적어주세요."
              rows={6}
              maxLength={2000}
              required
              disabled={status.kind === "sending"}
              className="w-full px-3 py-2 rounded-xl border border-app bg-card text-sm focus:outline-none focus:border-palmon-primary resize-y disabled:opacity-60"
            />
            <div className="text-[11px] text-fg-subtle text-right">
              {content.length} / 2000
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

          {status.kind === "success" && (
            <div
              role="status"
              className="flex items-start gap-2 p-3 rounded-xl text-sm border border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300"
            >
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <div>제보해주셔서 감사합니다! 검토 후 반영할게요.</div>
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

          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={status.kind === "sending"}
              className="px-4 py-2 rounded-xl text-sm border border-app hover:border-palmon-primary/50 transition-colors disabled:opacity-50"
            >
              {status.kind === "success" ? "닫기" : "취소"}
            </button>
            {status.kind !== "success" && (
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-palmon text-white shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status.kind === "sending" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> 발송 중...
                  </>
                ) : (
                  <>
                    <Send size={16} /> 제보하기
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
