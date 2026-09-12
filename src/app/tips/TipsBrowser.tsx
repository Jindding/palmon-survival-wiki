"use client";

import {
  useCallback,
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
  UserRound,
  X,
} from "lucide-react";
import type { Tip } from "@/lib/data/tips";
import { SourceBadge } from "@/components/SourceBadge";
import { ImageAttach } from "@/components/ImageAttach";
import { AttachedImage } from "@/components/AttachedImage";
import { ReportButton } from "@/components/ReportButton";
import { uploadImage } from "@/lib/supabase/uploads";
import { formatWhen } from "@/components/board/format";
import {
  listUserTips,
  submitTip,
  TIP_CONTENT_MAX,
  TIP_NICKNAME_MAX,
  type UserTip,
} from "@/lib/supabase/user-tips";

// 팁은 두 갈래에서 온다.
//  - curated: docs/sources 에 정리해 둔 기존 팁 (데이터 파일)
//  - user   : 유저가 이 페이지에서 직접 올린 팁 (Supabase)
// 방금 올린 글이 바로 보여야 쓰는 맛이 나므로 유저 팁을 위에 놓는다.
interface TipItem {
  key: string;
  content: string;
  /** "닉네임 #서버" 형식. 익명이거나 출처가 없으면 null. */
  by: string | null;
  anonymous: boolean;
  createdAt: string | null;
  imagePath: string | null;
  /** 유저가 올린 팁만 신고할 수 있다. 정리해 둔 기존 팁은 대상이 아니다. */
  reportId: string | null;
}

function toItem(t: UserTip): TipItem {
  return {
    key: t.id,
    content: t.content,
    by: t.is_anonymous ? null : `${t.nickname} #${t.server}`,
    anonymous: t.is_anonymous,
    createdAt: t.created_at,
    imagePath: t.image_path,
    reportId: t.id,
  };
}

export function TipsBrowser({ tips }: { tips: Tip[] }) {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [userTips, setUserTips] = useState<UserTip[]>([]);

  const refresh = useCallback(() => {
    listUserTips().then(setUserTips);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const items = useMemo<TipItem[]>(
    () => [
      ...userTips.map(toItem),
      ...tips.map((t, i) => ({
        key: `curated-${i}`,
        content: t.content,
        by: t.by || null,
        anonymous: false,
        createdAt: null,
        imagePath: null,
        reportId: null,
      })),
    ],
    [userTips, tips]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (t) =>
        t.content.toLowerCase().includes(q) ||
        (t.by ?? "").toLowerCase().includes(q)
    );
  }, [items, query]);

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
            작성하시면 이 페이지에 바로 올라가요. 익명으로도 쓸 수 있어요!
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold bg-gradient-palmon text-white shadow-soft flex-shrink-0">
          <MessageSquarePlus size={16} />
          <span className="hidden sm:inline">팁 작성하기</span>
          <span className="sm:hidden">작성</span>
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
          placeholder="팁 · 작성자 · 서버로 검색"
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
          {filtered.map((tip) => (
            <li
              key={tip.key}
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
                  <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words">
                    {tip.content}
                  </p>
                  {tip.imagePath && (
                    <div className="mt-3">
                      <AttachedImage path={tip.imagePath} alt="팁 첨부 이미지" />
                    </div>
                  )}
                  <div className="mt-3 text-xs text-fg-subtle flex items-center gap-2 flex-wrap">
                    {tip.anonymous ? (
                      <span className="inline-flex items-center gap-1 align-middle">
                        <UserRound size={12} className="opacity-70" aria-hidden />
                        익명
                      </span>
                    ) : (
                      tip.by && <SourceBadge name={tip.by} />
                    )}
                    {tip.createdAt && <span>{formatWhen(tip.createdAt)}</span>}
                    {tip.reportId && (
                      <span className="ml-auto">
                        <ReportButton
                          targetType="tip"
                          targetId={tip.reportId}
                          excerpt={tip.content}
                        />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <TipComposerModal
          onClose={() => setModalOpen(false)}
          onSubmitted={refresh}
        />
      )}
    </div>
  );
}

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string };

function TipComposerModal({
  onClose,
  onSubmitted,
}: {
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [anonymous, setAnonymous] = useState(false);
  const [server, setServer] = useState("");
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
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

    // 이미지는 등록을 확정하는 이 시점에만 올린다. 쓰다 만 글의 파일이 쌓이지 않게.
    let imagePath: string | null = null;
    if (image) {
      const uploaded = await uploadImage("tips", image);
      if (!uploaded.ok) {
        setStatus({ kind: "error", message: uploaded.message });
        return;
      }
      imagePath = uploaded.path;
    }

    const result = await submitTip({
      content: content.trim(),
      imagePath,
      anonymous,
      nickname: anonymous ? undefined : nickname.trim(),
      server: anonymous ? undefined : server.trim(),
      hp,
    });

    if (!result.ok) {
      setStatus({ kind: "error", message: result.message });
      return;
    }

    setStatus({ kind: "success" });
    setContent("");
    setImage(null);
    // 목록을 다시 불러와 방금 쓴 팁이 바로 보이게 한다.
    onSubmitted();
  };

  const canSubmit =
    content.trim().length > 0 &&
    (anonymous || (server.trim().length > 0 && nickname.trim().length > 0)) &&
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
            💡 팁 작성
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
            <span className="text-sm font-semibold">익명으로 작성</span>
            <span className="text-xs text-fg-subtle">
              (서버·닉네임 없이 작성)
            </span>
          </label>

          {!anonymous && (
            <div className="grid grid-cols-3 gap-2">
              <div className="min-w-0 space-y-1">
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
                  maxLength={6}
                  required
                  disabled={status.kind === "sending"}
                  className="w-full px-3 py-2 rounded-xl border border-app bg-card text-sm focus:outline-none focus:border-palmon-primary disabled:opacity-60"
                />
              </div>
              <div className="col-span-2 min-w-0 space-y-1">
                <label htmlFor="tip-nick" className="text-xs font-semibold">
                  닉네임
                </label>
                <input
                  id="tip-nick"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="예) Aiden Reed"
                  maxLength={TIP_NICKNAME_MAX}
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
              placeholder="한 줄이면 충분해요. 알고 계신 꿀팁을 적어주세요."
              rows={5}
              maxLength={TIP_CONTENT_MAX}
              required
              disabled={status.kind === "sending"}
              className="w-full px-3 py-2 rounded-xl border border-app bg-card text-sm focus:outline-none focus:border-palmon-primary resize-y disabled:opacity-60"
            />
            <div className="text-[11px] text-fg-subtle text-right">
              {content.length} / {TIP_CONTENT_MAX}
            </div>
          </div>

          <ImageAttach
            file={image}
            onChange={setImage}
            disabled={status.kind === "sending"}
            busy={status.kind === "sending" && image !== null}
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

          <p className="text-[11px] text-fg-subtle leading-relaxed">
            작성한 팁은 바로 공개돼요. 게임 화면 위주로 올려주시고, 타인의 사진이나
            외부 이미지는 올리지 말아주세요. 지우고 싶으시면 문의하기로 알려주세요.
          </p>

          {status.kind === "success" && (
            <div
              role="status"
              className="flex items-start gap-2 p-3 rounded-xl text-sm border border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300"
            >
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <div>등록되었어요! 목록 맨 위에서 확인하실 수 있어요.</div>
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
                    <Loader2 size={16} className="animate-spin" /> 등록 중...
                  </>
                ) : (
                  <>
                    <Send size={16} /> 등록하기
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
