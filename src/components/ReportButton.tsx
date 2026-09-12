"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Flag, Loader2, X } from "lucide-react";

// 신고 버튼 + 사유 입력 팝업.
// 접수된 신고는 DB에 쌓이지 않고 운영자 메일로 바로 간다 (/api/report).

export type ReportTarget = "post" | "comment" | "tip";

const LABEL: Record<ReportTarget, string> = {
  post: "게시글",
  comment: "댓글",
  tip: "한줄팁",
};

const REASON_PRESETS = [
  "부적절한 이미지",
  "욕설 · 비방",
  "광고 · 도배",
  "개인정보 노출",
  "기타",
];

export function ReportButton({
  targetType,
  targetId,
  excerpt,
}: {
  targetType: ReportTarget;
  targetId: string;
  /** 메일에 함께 보낼 내용 일부. 어떤 글인지 바로 알아보게 한다. */
  excerpt?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-fg-subtle hover:text-red-500 hover:bg-muted transition-colors"
        title={`${LABEL[targetType]} 신고`}
      >
        <Flag size={12} /> 신고
      </button>
      {open && (
        <ReportModal
          targetType={targetType}
          targetId={targetId}
          excerpt={excerpt}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string };

function ReportModal({
  targetType,
  targetId,
  excerpt,
  onClose,
}: {
  targetType: ReportTarget;
  targetId: string;
  excerpt?: string;
  onClose: () => void;
}) {
  const [preset, setPreset] = useState(REASON_PRESETS[0]);
  const [detail, setDetail] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status.kind !== "sending") onClose();
    };
    document.addEventListener("keydown", onEsc);
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = orig;
    };
  }, [onClose, status.kind]);

  async function submit() {
    if (status.kind === "sending") return;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          excerpt,
          reason: detail.trim() ? `${preset} — ${detail.trim()}` : preset,
          hp,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !body.ok) {
        setStatus({
          kind: "error",
          message: body.error ?? "신고 접수에 실패했습니다.",
        });
        return;
      }
      setStatus({ kind: "success" });
    } catch {
      setStatus({
        kind: "error",
        message: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => status.kind !== "sending" && onClose()}
      />
      <div className="relative bg-card rounded-2xl border border-app shadow-lg w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-app">
          <h2 id="report-title" className="text-base font-bold">
            🚨 {LABEL[targetType]} 신고
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

        <div className="p-4 space-y-3">
          {status.kind === "success" ? (
            <div
              role="status"
              className="flex items-start gap-2 p-3 rounded-xl text-sm border border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300"
            >
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <div>신고해주셔서 감사합니다. 운영자가 확인 후 조치할게요.</div>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <div className="text-xs font-semibold">신고 사유</div>
                <div className="flex flex-wrap gap-1.5">
                  {REASON_PRESETS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setPreset(r)}
                      disabled={status.kind === "sending"}
                      className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                        preset === r
                          ? "border-palmon-primary bg-palmon-primary/10 text-palmon-primary font-bold"
                          : "border-app text-fg-muted hover:border-palmon-primary/50"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={3}
                maxLength={300}
                placeholder="자세한 내용을 적어주시면 확인에 도움이 돼요. (선택)"
                disabled={status.kind === "sending"}
                className="w-full px-3 py-2 rounded-xl border border-app bg-card text-sm resize-y focus:outline-none focus:border-palmon-primary disabled:opacity-60"
              />

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

              {status.kind === "error" && (
                <div
                  role="alert"
                  className="flex items-start gap-2 p-3 rounded-xl text-sm border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div>{status.message}</div>
                </div>
              )}
            </>
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
                type="button"
                onClick={submit}
                disabled={status.kind === "sending"}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white shadow-soft disabled:opacity-50"
              >
                {status.kind === "sending" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> 접수 중…
                  </>
                ) : (
                  <>
                    <Flag size={16} /> 신고하기
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
