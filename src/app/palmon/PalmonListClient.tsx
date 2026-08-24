"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import {
  elementStyles,
  gradeStyles,
  type Palmon,
  type PalmonElement,
  type PalmonGrade,
} from "@/lib/data/palmons";

type GradeFilter = "전체" | PalmonGrade;
type ElementFilter = "전체" | PalmonElement;

const GRADE_OPTIONS: GradeFilter[] = ["전체", "SR", "SSR", "UR", "신화"];
const ELEMENT_OPTIONS: ElementFilter[] = ["전체", "물", "불", "바위", "전기"];

export function PalmonListClient({ items }: { items: Palmon[] }) {
  const [grade, setGrade] = useState<GradeFilter>("전체");
  const [element, setElement] = useState<ElementFilter>("전체");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      if (grade !== "전체" && p.grade !== grade) return false;
      if (element !== "전체" && p.element !== element) return false;
      if (!q) return true;
      // 이름 검색 (본체 + 진화형 모두)
      if (p.name.toLowerCase().includes(q)) return true;
      if (p.evolutions?.some((e) => e.name.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [items, grade, element, query]);

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
            placeholder="팰몬 이름으로 검색 (진화형 이름도 매칭)"
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-app bg-card text-sm focus:outline-none focus:border-palmon-primary"
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

        <FilterRow
          label="등급"
          options={GRADE_OPTIONS}
          value={grade}
          onChange={setGrade}
          renderChip={(opt) => {
            if (opt === "전체") return { text: "전체", cls: "" };
            const s = gradeStyles[opt];
            return { text: s.label, cls: s.badge };
          }}
        />

        <FilterRow
          label="속성"
          options={ELEMENT_OPTIONS}
          value={element}
          onChange={setElement}
          renderChip={(opt) => {
            if (opt === "전체") return { text: "전체", cls: "" };
            const s = elementStyles[opt];
            return { text: `${s.emoji} ${s.label}`, cls: s.badge };
          }}
        />

        <div className="text-xs text-fg-muted px-1">
          결과 {filtered.length}종
        </div>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {filtered.map((p) => (
          <PalmonCard key={p.id} p={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl bg-muted p-8 text-center text-sm text-fg-muted">
          조건에 맞는 팰몬이 없어요.
        </div>
      )}
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
  renderChip,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  renderChip: (opt: T) => { text: string; cls: string };
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-fg-subtle w-12 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const chip = renderChip(opt);
          const active = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                active
                  ? `${chip.cls || "bg-palmon-primary text-white border-palmon-primary"} ring-2 ring-offset-1 ring-offset-card ring-palmon-primary/50`
                  : `${chip.cls || "bg-muted text-fg-muted border-app"} opacity-70 hover:opacity-100`
              }`}
            >
              {chip.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PalmonCard({ p }: { p: Palmon }) {
  const gs = gradeStyles[p.grade];
  const es = elementStyles[p.element];
  const evolutions = p.evolutions ?? [];

  return (
    <Link href={`/palmon/${p.id}`} className="group block">
      <div className="bg-card rounded-2xl border border-app overflow-hidden shadow-soft group-hover:border-palmon-primary group-hover:shadow-lg transition-all h-full flex flex-col">
        <div className="relative aspect-square flex items-center justify-center bg-gradient-to-br from-palmon-primary/10 via-palmon-accent/5 to-palmon-secondary/10 dark:from-palmon-primary/20 dark:via-palmon-accent/10 dark:to-palmon-secondary/15">
          {p.imagePath ? (
            <Image
              src={p.imagePath}
              alt={p.name}
              width={200}
              height={200}
              className="object-contain w-3/4 h-3/4 group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="text-4xl opacity-30">🚧</div>
          )}
          <span
            className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded-full border font-bold backdrop-blur ${gs.badge}`}
          >
            {gs.label}
          </span>
          <span
            className={`absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full border backdrop-blur ${es.badge}`}
          >
            {es.emoji} {es.label}
          </span>
        </div>
        <div className="p-2.5 md:p-3 flex-1 flex flex-col gap-1.5">
          <div className="text-sm md:text-base truncate text-center">
            {p.name}
          </div>
          {evolutions.length > 0 && (
            <div className="flex flex-col gap-1 pt-1 border-t border-app/50">
              {evolutions.map((ev) => (
                <EvolutionChip key={ev.id} evo={ev} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function EvolutionChip({ evo }: { evo: NonNullable<Palmon["evolutions"]>[number] }) {
  const isSuper = evo.stage === "superEvolved";
  const label = isSuper ? "슈퍼 진화" : "진화";
  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg px-1.5 py-1 ${
        isSuper
          ? "bg-red-500/10 dark:bg-red-500/15 border border-red-500/40"
          : "bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/40"
      }`}
      title={evo.name}
    >
      <div className="w-6 h-6 rounded-full bg-card overflow-hidden flex items-center justify-center flex-shrink-0 border border-app/50">
        {evo.imagePath ? (
          <Image
            src={evo.imagePath}
            alt={evo.name}
            width={24}
            height={24}
            className="object-contain w-full h-full"
          />
        ) : (
          <span className="text-[9px]">🚧</span>
        )}
      </div>
      <div className="flex-1 min-w-0 flex items-center justify-between gap-1">
        <span
          className={`text-[9px] uppercase tracking-wider font-bold flex-shrink-0 ${
            isSuper
              ? "text-red-600 dark:text-red-400"
              : "text-orange-600 dark:text-orange-400"
          }`}
        >
          {label}
        </span>
        <span className="text-[10px] text-fg-muted truncate">{evo.name}</span>
      </div>
    </div>
  );
}
