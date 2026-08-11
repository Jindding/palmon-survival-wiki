"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Palmon } from "@/lib/data/palmons";
import {
  elementStyles,
  rankStyles,
  type PalmonAttribute,
  type PalmonElement,
  type WorkRank,
} from "@/lib/data/palmon-attributes";

interface PalmonWithAttr extends Palmon {
  attr: PalmonAttribute;
}

type ElementFilter = "전체" | PalmonElement;
type RankFilter = "전체" | WorkRank | "미보유";

const ELEMENT_OPTIONS: ElementFilter[] = ["전체", "물", "불", "바위", "전기"];
const RANK_OPTIONS: RankFilter[] = ["전체", "S", "A", "B", "미보유"];

export function PalmonListClient({ items }: { items: PalmonWithAttr[] }) {
  const [element, setElement] = useState<ElementFilter>("전체");
  const [rank, setRank] = useState<RankFilter>("전체");

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (element !== "전체" && p.attr.element !== element) return false;
      if (rank === "전체") return true;
      if (rank === "미보유") return !p.attr.workRank;
      return p.attr.workRank === rank;
    });
  }, [items, element, rank]);

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl border border-app shadow-soft p-3 md:p-4 space-y-3">
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
        <FilterRow
          label="작업 랭크"
          options={RANK_OPTIONS}
          value={rank}
          onChange={setRank}
          renderChip={(opt) => {
            if (opt === "전체") return { text: "전체", cls: "" };
            if (opt === "미보유") return { text: "미보유", cls: "bg-muted text-fg-muted border-app" };
            const s = rankStyles[opt];
            return { text: `${s.label} · ${s.desc}`, cls: s.badge };
          }}
        />
        <div className="text-xs text-fg-muted px-1">
          결과 {filtered.length}종
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {filtered.map((p) => (
          <PalmonCard key={p.objectId} p={p} />
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
      <span className="text-xs text-fg-subtle w-16 shrink-0">{label}</span>
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

function PalmonCard({ p }: { p: PalmonWithAttr }) {
  const hasDetail = p.skills.length > 0;
  const es = elementStyles[p.attr.element];
  const rs = p.attr.workRank ? rankStyles[p.attr.workRank] : null;

  return (
    <Link href={`/palmon/${p.objectId}`} className="group block">
      <div className="bg-card rounded-2xl border border-app overflow-hidden shadow-soft group-hover:border-palmon-primary group-hover:shadow-lg transition-all">
        <div className="relative aspect-square flex items-center justify-center bg-gradient-to-br from-palmon-primary/10 via-palmon-accent/5 to-palmon-secondary/10 dark:from-palmon-primary/20 dark:via-palmon-accent/10 dark:to-palmon-secondary/15">
          <Image
            src={p.imageUrl}
            alt={p.name}
            width={200}
            height={200}
            className="object-contain w-3/4 h-3/4 group-hover:scale-110 transition-transform duration-300"
            unoptimized
          />
          <span className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded-full border backdrop-blur ${es.badge}`}>
            {es.emoji} {es.label}
          </span>
          {rs && (
            <span className={`absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full border font-bold ${rs.badge}`}>
              {rs.label}
            </span>
          )}
          {!hasDetail && (
            <span className="absolute bottom-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur">
              정보 준비중
            </span>
          )}
        </div>
        <div className="p-2.5 md:p-3 text-center">
          <div className="text-sm md:text-base truncate">{p.name}</div>
          {p.attr.workSkill && (
            <div className="text-[10px] text-fg-subtle truncate mt-0.5">
              {p.attr.workSkill}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
