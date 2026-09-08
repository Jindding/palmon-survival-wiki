"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ChevronRight, HelpCircle } from "lucide-react";
import {
  glossary,
  GLOSSARY_CATEGORIES,
  type GlossaryCategory,
  type GlossaryTerm,
} from "@/lib/data/glossary";

type CategoryFilter = "전체" | GlossaryCategory;
const CATEGORY_OPTIONS: CategoryFilter[] = ["전체", ...GLOSSARY_CATEGORIES];

export function GlossaryView() {
  const [category, setCategory] = useState<CategoryFilter>("전체");
  const [onlyNeedsCheck, setOnlyNeedsCheck] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return glossary.filter((t) => {
      if (category !== "전체" && t.category !== category) return false;
      if (onlyNeedsCheck && t.status !== "needs-check") return false;
      if (!q) return true;
      // 표준 표기 · 다른 표기 · 영문 · 설명까지 검색 대상에 넣는다.
      // 사용자가 어떤 표기로 검색해도 찾을 수 있어야 용어집 구실을 한다.
      const haystack = [
        t.term,
        ...(t.aliases ?? []),
        t.english ?? "",
        t.description,
        t.note ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [category, onlyNeedsCheck, query]);

  // 카테고리 순서를 유지하면서 묶는다.
  const grouped = useMemo(() => {
    return GLOSSARY_CATEGORIES.map((cat) => ({
      category: cat,
      terms: filtered.filter((t) => t.category === cat),
    })).filter((g) => g.terms.length > 0);
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* 검색 + 필터 */}
      <div className="bg-card rounded-2xl border border-app shadow-soft p-3 md:p-4 space-y-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="용어 검색 (다른 표기·영문으로도 찾을 수 있어요)"
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-app bg-app text-sm focus:outline-none focus:border-palmon-primary"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="검색어 지우기"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted"
            >
              <X size={14} className="text-fg-subtle" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setCategory(opt)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                category === opt
                  ? "bg-gradient-palmon text-white border-palmon-primary"
                  : "bg-muted text-fg-muted border-app hover:border-palmon-primary/50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-fg-muted cursor-pointer">
            <input
              type="checkbox"
              checked={onlyNeedsCheck}
              onChange={(e) => setOnlyNeedsCheck(e.target.checked)}
              className="accent-palmon-primary"
            />
            보충이 필요한 용어만 보기
          </label>
          <span className="text-xs text-fg-subtle">{filtered.length}개</span>
        </div>
      </div>

      {/* 목록 */}
      {grouped.length === 0 ? (
        <div className="rounded-2xl bg-muted p-8 text-center text-sm text-fg-muted">
          조건에 맞는 용어가 없어요.
        </div>
      ) : (
        grouped.map((group) => (
          <section key={group.category} className="space-y-2">
            <h2 className="text-sm font-bold text-fg-subtle px-1">
              {group.category}
            </h2>
            <div className="space-y-2">
              {group.terms.map((t) => (
                <TermCard key={t.term} term={t} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function TermCard({ term }: { term: GlossaryTerm }) {
  const needsCheck = term.status === "needs-check";
  return (
    <article
      className={`rounded-2xl border shadow-soft p-4 md:p-5 ${
        needsCheck
          ? "border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10"
          : "border-app bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h3 className="text-base md:text-lg font-bold flex items-center gap-2 flex-wrap">
            {term.term}
            {term.english && (
              <span className="text-xs font-normal text-fg-subtle">
                {term.english}
              </span>
            )}
          </h3>
          {term.aliases && term.aliases.length > 0 && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              <span className="text-[11px] text-fg-subtle">이렇게도 불려요</span>
              {term.aliases.map((a) => (
                <span
                  key={a}
                  className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-fg-muted"
                >
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
        {needsCheck && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40 text-amber-700 dark:text-amber-300 shrink-0">
            <HelpCircle size={11} />
            보충 필요
          </span>
        )}
      </div>

      <p className="text-sm text-fg-muted mt-2.5 leading-relaxed">
        {term.description}
      </p>

      {term.note && (
        <p
          className={`text-xs mt-2 leading-relaxed rounded-lg px-3 py-2 ${
            needsCheck
              ? "bg-amber-500/10 text-amber-800 dark:text-amber-200"
              : "bg-muted text-fg-muted"
          }`}
        >
          {needsCheck ? "❓ " : "💡 "}
          {term.note}
        </p>
      )}

      {term.href && (
        <Link
          href={term.href}
          className="inline-flex items-center gap-0.5 text-xs text-palmon-primary hover:underline mt-2.5"
        >
          {term.hrefLabel ?? "자세히 보기"}
          <ChevronRight size={13} />
        </Link>
      )}
    </article>
  );
}
