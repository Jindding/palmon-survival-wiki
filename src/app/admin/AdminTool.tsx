"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ExternalLink,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  LogOut,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { AttachedImage } from "@/components/AttachedImage";
import { formatWhen } from "@/components/board/format";

// 비밀번호는 sessionStorage에만 둔다. 탭을 닫으면 사라지고, 다른 기기로 새지 않는다.
const STORAGE_KEY = "palmon-hub:admin-pw";

type Kind = "post" | "comment" | "tip";

interface AdminRow {
  kind: Kind;
  id: string;
  title: string;
  content: string;
  author: string;
  image_path: string | null;
  created_at: string;
  post_id?: string;
}

const KIND_LABEL: Record<Kind, string> = {
  post: "게시글",
  comment: "댓글",
  tip: "한줄팁",
};

const KIND_STYLE: Record<Kind, string> = {
  post: "bg-palmon-primary/10 text-palmon-primary",
  comment: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
  tip: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
};

const FILTERS: { key: "all" | Kind | "image"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "image", label: "이미지 있는 글" },
  { key: "post", label: "게시글" },
  { key: "comment", label: "댓글" },
  { key: "tip", label: "한줄팁" },
];

export function AdminTool() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | Kind | "image">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async (pw: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw, action: "list" }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        rows?: AdminRow[];
        warnings?: string[];
        error?: string;
      };
      if (!res.ok || !body.ok) {
        setError(body.error ?? "불러오기에 실패했습니다.");
        return false;
      }
      setRows(body.rows ?? []);
      setWarnings(body.warnings ?? []);
      return true;
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 새로고침해도 다시 로그인하지 않도록 세션에 남은 비밀번호로 자동 진입한다.
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    setPassword(saved);
    load(saved).then((ok) => {
      if (ok) setAuthed(true);
      else sessionStorage.removeItem(STORAGE_KEY);
    });
  }, [load]);

  async function signIn() {
    const ok = await load(password);
    if (ok) {
      sessionStorage.setItem(STORAGE_KEY, password);
      setAuthed(true);
    }
  }

  function signOut() {
    sessionStorage.removeItem(STORAGE_KEY);
    setPassword("");
    setAuthed(false);
    setRows([]);
  }

  async function remove(row: AdminRow) {
    const label = `${KIND_LABEL[row.kind]} "${row.title || row.content.slice(0, 20)}"`;
    if (!confirm(`${label} 을(를) 삭제할까요?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }
    setDeleting(row.id);
    setError(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          action: "delete",
          kind: row.kind,
          id: row.id,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        imageWarning?: string | null;
      };
      if (!res.ok || !body.ok) {
        setError(body.error ?? "삭제에 실패했습니다.");
        return;
      }
      if (body.imageWarning) {
        setError(`글은 삭제했지만 이미지 파일 삭제에 실패했어요: ${body.imageWarning}`);
      }
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } finally {
      setDeleting(null);
    }
  }

  if (!authed) {
    return (
      <div className="bg-card rounded-2xl border border-app shadow-soft p-5 max-w-sm space-y-3">
        <div className="text-sm font-bold flex items-center gap-1.5">
          <KeyRound size={14} /> 관리자 비밀번호
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && signIn()}
          placeholder="비밀번호"
          className="w-full px-3 py-2 rounded-xl bg-muted border border-app text-sm focus:outline-none focus:ring-2 focus:ring-palmon-primary/40"
        />
        {error && (
          <div className="flex items-start gap-1.5 text-xs text-red-500">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        <button
          type="button"
          onClick={signIn}
          disabled={loading || password.length === 0}
          className="w-full px-4 py-2 rounded-xl text-sm font-bold bg-gradient-palmon text-white disabled:opacity-50"
        >
          {loading ? "확인 중…" : "들어가기"}
        </button>
      </div>
    );
  }

  const filtered = rows.filter((r) => {
    if (filter === "all") return true;
    if (filter === "image") return r.image_path !== null;
    return r.kind === filter;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-xl text-xs border transition-colors ${
              filter === f.key
                ? "border-palmon-primary bg-palmon-primary/10 text-palmon-primary font-bold"
                : "border-app text-fg-muted hover:border-palmon-primary/50"
            }`}
          >
            {f.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => load(password)}
          disabled={loading}
          className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs border border-app text-fg-muted hover:border-palmon-primary/50 disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          새로고침
        </button>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs border border-app text-fg-muted hover:border-red-500/50"
        >
          <LogOut size={12} /> 나가기
        </button>
      </div>

      {warnings.length > 0 && (
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-300 space-y-1">
          {warnings.map((w) => (
            <div key={w}>⚠️ {w}</div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-500">
          {error}
        </div>
      )}

      <div className="text-xs text-fg-subtle">
        {filtered.length}건 · 최근 50건까지 보여줍니다
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-app text-center text-sm text-fg-muted">
          표시할 항목이 없어요.
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((row) => (
            <li
              key={`${row.kind}-${row.id}`}
              className="bg-card rounded-2xl border border-app shadow-soft p-4 space-y-2"
            >
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span
                  className={`px-2 py-0.5 rounded-full font-bold ${KIND_STYLE[row.kind]}`}
                >
                  {KIND_LABEL[row.kind]}
                </span>
                <span className="font-semibold">{row.author}</span>
                <span className="text-fg-subtle">
                  {formatWhen(row.created_at)}
                </span>
                {row.image_path && (
                  <span className="inline-flex items-center gap-0.5 text-fg-subtle">
                    <ImageIcon size={11} /> 이미지
                  </span>
                )}
                {(row.kind === "post" || row.post_id) && (
                  <Link
                    href={`/board/${row.post_id ?? row.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-0.5 text-palmon-primary hover:underline"
                  >
                    원글 <ExternalLink size={11} />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => remove(row)}
                  disabled={deleting === row.id}
                  className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border border-red-500/40 text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                >
                  {deleting === row.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  삭제
                </button>
              </div>

              {row.title && (
                <div className="text-sm font-bold break-words">{row.title}</div>
              )}
              <div className="text-sm text-fg-muted whitespace-pre-wrap break-words line-clamp-4">
                {row.content}
              </div>
              {row.image_path && (
                <AttachedImage path={row.image_path} alt="첨부 이미지" />
              )}
              <div className="text-[10px] text-fg-subtle font-mono break-all">
                {row.id}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
