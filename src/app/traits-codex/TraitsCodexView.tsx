"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  combatLines,
  subTraits,
  workGroups,
  type CombatLine,
  type SubTrait,
  type TraitTier,
  type WorkGroup,
} from "@/lib/data/traits-codex";

const tierBadge: Record<TraitTier, string> = {
  S: "bg-gradient-gold text-white",
  A: "bg-gradient-palmon text-white",
  B: "bg-gradient-to-br from-teal-500 to-emerald-600 text-white",
};

const priorityStyle: Record<
  1 | 2 | 3,
  { label: string; className: string }
> = {
  1: {
    label: "1순위",
    className: "bg-gradient-gold text-white",
  },
  2: {
    label: "2순위",
    className: "bg-gradient-palmon text-white",
  },
  3: {
    label: "3순위",
    className: "bg-muted text-fg-muted border border-app",
  },
};

export function TraitsCodexView() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filteredCombat = useMemo(() => {
    if (!q) return combatLines;
    return combatLines
      .map((line) => ({
        ...line,
        stats: line.stats
          .map((s) => ({
            ...s,
            traits: s.traits.filter(
              (t) =>
                t.name.toLowerCase().includes(q) ||
                s.stat.toLowerCase().includes(q),
            ),
          }))
          .filter((s) => s.traits.length > 0),
      }))
      .filter((line) => line.stats.length > 0);
  }, [q]);

  const filteredWork = useMemo(() => {
    if (!q) return workGroups;
    return workGroups
      .map((g) => ({
        ...g,
        traits: g.traits.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            g.work.toLowerCase().includes(q) ||
            g.facility?.toLowerCase().includes(q) ||
            false,
        ),
      }))
      .filter((g) => g.traits.length > 0);
  }, [q]);

  const filteredSub = useMemo(() => {
    if (!q) return subTraits;
    return subTraits.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.effect.toLowerCase().includes(q),
    );
  }, [q]);

  const empty =
    filteredCombat.length === 0 &&
    filteredWork.length === 0 &&
    filteredSub.length === 0 &&
    q.length > 0;

  return (
    <div className="space-y-8">
      {/* 검색 */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="특성명 · 작업 · 스탯 · 시설로 검색"
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-card border border-app text-sm md:text-base shadow-soft focus:outline-none focus:ring-2 focus:ring-palmon-primary/40"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="검색어 지우기"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted"
          >
            <X size={16} className="text-fg-subtle" />
          </button>
        )}
      </div>

      {empty && (
        <div className="p-8 rounded-2xl border border-dashed border-app text-center text-sm text-fg-muted">
          검색 결과가 없어요.
        </div>
      )}

      {/* 전투 특성 */}
      {filteredCombat.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            emoji="⚔️"
            title="전투 특성"
            subtitle="라인별로 스탯을 묶어 정리했어요. 모두 S 등급 기준."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredCombat.map((line) => (
              <CombatLineCard key={line.id} line={line} />
            ))}
          </div>
        </section>
      )}

      {/* 작업 특성 */}
      {filteredWork.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            emoji="🛠️"
            title="작업 특성"
            subtitle="캠프 시설과 자원 생산을 담당하는 특성. 작업(효과) 단위로 S / A / B 등급을 정리했어요."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWork.map((g) => (
              <WorkGroupCard key={g.id} group={g} />
            ))}
          </div>
        </section>
      )}

      {/* 작업 보조 특성 */}
      {filteredSub.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            emoji="🌟"
            title="작업 보조 특성"
            subtitle="팰몬 특성 슬롯 4개 중 주 작업 특성을 3개 채우고 남는 1슬롯에 넣기 좋은 부특성. 우선순위: 몽상가 → 필로우킹 → 나머지."
          />
          <ul className="space-y-3">
            {filteredSub.map((s) => (
              <SubTraitCard key={s.name} trait={s} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function SectionHeader({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3 px-1">
      <div className="text-3xl leading-none">{emoji}</div>
      <div>
        <h2 className="text-2xl md:text-3xl">{title}</h2>
        <p className="text-sm text-fg-muted mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function CombatLineCard({ line }: { line: CombatLine }) {
  return (
    <article className="bg-card rounded-2xl border border-app shadow-soft overflow-hidden">
      <div
        className={`bg-gradient-to-r ${line.color} px-5 py-4 flex items-center gap-3 text-white`}
      >
        <div className="text-3xl leading-none">{line.emoji}</div>
        <div>
          <div className="text-xl md:text-2xl font-bold leading-tight">
            {line.name}
          </div>
          <div className="text-xs md:text-sm opacity-90 mt-0.5">
            {line.role}
          </div>
        </div>
      </div>
      <div className="p-4 md:p-5 space-y-4">
        {line.stats.map((s) => (
          <div key={s.stat}>
            <div className="text-xs font-bold text-fg-subtle uppercase tracking-wider mb-2">
              {s.stat}
            </div>
            <ul className="space-y-1.5">
              {s.traits.map((t) => (
                <li
                  key={t.name}
                  className="flex items-center gap-3 py-2 px-3 rounded-xl bg-muted"
                >
                  <span className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold bg-gradient-gold text-white flex-shrink-0">
                    S
                  </span>
                  <span className="text-base font-bold flex-1 min-w-0 truncate">
                    {t.name}
                  </span>
                  <span className="text-base font-bold tabular-nums text-palmon-primary flex-shrink-0">
                    {t.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}

function WorkGroupCard({ group }: { group: WorkGroup }) {
  return (
    <article className="bg-card rounded-2xl border border-app shadow-soft overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-app bg-muted">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{group.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-base md:text-lg font-bold leading-tight">
              {group.work}
            </div>
            {group.facility && (
              <div className="text-[11px] text-fg-subtle mt-0.5 truncate">
                📍 {group.facility}
              </div>
            )}
          </div>
        </div>
      </div>
      <ul className="p-3 space-y-1.5">
        {group.traits.map((t, i) => (
          <li
            key={`${t.tier}-${t.name}-${i}`}
            className="flex items-center gap-3 py-2 px-3 rounded-xl bg-muted"
          >
            <span
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold flex-shrink-0 ${tierBadge[t.tier]}`}
            >
              {t.tier}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">{t.name}</div>
              {t.note && (
                <div className="text-[10px] text-fg-subtle">{t.note}</div>
              )}
            </div>
            <span className="text-sm font-bold tabular-nums text-palmon-primary flex-shrink-0">
              {t.value}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function SubTraitCard({ trait }: { trait: SubTrait }) {
  const pri = priorityStyle[trait.priority];
  return (
    <li className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-center md:gap-6">
        {/* 좌측: 순위 · 이름 · 효과 */}
        <div className="md:w-1/3 md:flex-shrink-0 mb-3 md:mb-0 flex items-start gap-3">
          <span
            className={`text-[11px] px-2 py-1 rounded-full font-bold flex-shrink-0 ${pri.className}`}
          >
            {pri.label}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-lg md:text-xl font-bold leading-tight">
              {trait.name}
            </div>
            <div className="text-xs md:text-sm text-fg-muted mt-1">
              {trait.effect}
            </div>
          </div>
        </div>

        {/* 우측: S/A/B 값 */}
        <div className="flex-1 grid grid-cols-3 gap-2">
          {trait.tiers.map((t) => (
            <div
              key={t.tier}
              className="flex flex-col items-center gap-1 py-2 px-2 rounded-xl bg-muted"
            >
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold ${tierBadge[t.tier]}`}
              >
                {t.tier}
              </span>
              <span className="text-sm tabular-nums text-center leading-tight">
                {t.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </li>
  );
}
