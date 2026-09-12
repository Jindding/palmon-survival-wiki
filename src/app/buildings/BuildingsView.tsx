"use client";

import { useMemo, useState } from "react";
import {
  Coins,
  TreePine,
  Wrench,
  Stamp,
  Clock,
  RotateCcw,
  CheckCheck,
  HelpCircle,
} from "lucide-react";
import {
  buildRequirements,
  buildLevelLabel,
  type BuildRequirement,
} from "@/lib/data/build";
import {
  RESOURCE_TOGGLES,
  SEASON_TOGGLES,
  TIME_CHOICES,
  TIME_TOGGLES,
  allBuffSelections,
  applyResourceBuff,
  applyTimeBuff,
  sumBuffs,
  type BuffToggle,
} from "@/lib/data/build-buffs";
import { formatKrCompact, formatKrExact, formatDuration } from "@/lib/format";

// 레벨이 34개라 카드로 늘어놓으면 스크롤이 끝없이 길다. 한 줄에 한 레벨씩 표로 훑어보게 한다.
// 자원은 아이콘만 두면 무슨 자원인지 알기 어려워 골드 · 목판 · 강철 · 마스터 인장을 각각 이름으로 적는다.
//
// 높은 레벨부터 내려온다. 찾아보는 사람은 대부분 상위 구간을 보기 때문이다.
// Lv 30 세부 단계도 30-5가 맨 위로 오도록 단계 역순으로 붙인다.
const LEVELS = [...buildRequirements].sort(
  (a, b) => b.level - a.level || (b.step ?? 0) - (a.step ?? 0)
);

export function BuildingsView() {
  // 버프를 켜고 끌 때마다 표가 바로 다시 계산된다.
  const [toggles, setToggles] = useState<Set<string>>(new Set());
  const [choices, setChoices] = useState<Record<string, string | null>>({});

  const totals = useMemo(() => sumBuffs(toggles, choices), [toggles, choices]);
  const active =
    toggles.size > 0 || Object.values(choices).some((v) => v !== null);

  function toggle(id: string) {
    setToggles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function choose(groupId: string, optionId: string) {
    setChoices((prev) => ({
      ...prev,
      // 같은 것을 다시 누르면 해제한다.
      [groupId]: prev[groupId] === optionId ? null : optionId,
    }));
  }

  function reset() {
    setToggles(new Set());
    setChoices({});
  }

  function selectAll() {
    const all = allBuffSelections();
    setToggles(all.toggles);
    setChoices(all.choices);
  }

  return (
    <div className="space-y-4">
      {/* ───── 버프 선택 ───── */}
      <section className="bg-card rounded-2xl border border-app shadow-soft overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-palmon-primary/5 border-b border-app flex-wrap">
          <div className="min-w-0">
            <h2 className="text-sm font-bold">⚡ 단축 버프 적용</h2>
            <p className="text-[11px] text-fg-subtle mt-0.5">
              가지고 있는 것을 누르면 아래 표가 바로 다시 계산돼요. 누르면 해당
              범주의 최대 수치가 적용됩니다.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1.5">
            <button
              type="button"
              onClick={selectAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs border border-app text-fg-muted hover:border-palmon-primary/50 transition-colors"
            >
              <CheckCheck size={12} /> 전체 선택
            </button>
            {active && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs border border-app text-fg-muted hover:border-palmon-primary/50 transition-colors"
              >
                <RotateCcw size={12} /> 초기화
              </button>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <BuffSection title="⏱️ 건설 시간" tone="time">
            {TIME_TOGGLES.map((b) => (
              <BuffChip
                key={b.id}
                buff={b}
                on={toggles.has(b.id)}
                tone="time"
                onClick={() => toggle(b.id)}
              />
            ))}
          </BuffSection>

          {TIME_CHOICES.map((g) => (
            <BuffSection key={g.id} title={`👑 ${g.label}`} hint={g.detail} tone="time">
              {g.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => choose(g.id, o.id)}
                  title={`${g.label} · ${o.label} — 건설 속도 +${Math.round(
                    o.rate * 100
                  )}% (${g.detail})`}
                  className={chipClass(choices[g.id] === o.id, "time")}
                >
                  <span className="font-bold">{o.label}</span>
                  <span className="opacity-70">+{Math.round(o.rate * 100)}%</span>
                  {!g.selfEvident && <HelpMark />}
                </button>
              ))}
            </BuffSection>
          ))}

          <BuffSection title="🌟 시즌 스킬" tone="time">
            {SEASON_TOGGLES.map((b) => (
              <BuffChip
                key={b.id}
                buff={b}
                on={toggles.has(b.id)}
                tone="time"
                onClick={() => toggle(b.id)}
              />
            ))}
          </BuffSection>

          <BuffSection title="📦 자원 절감" tone="resource">
            {RESOURCE_TOGGLES.map((b) => (
              <BuffChip
                key={b.id}
                buff={b}
                on={toggles.has(b.id)}
                tone="resource"
                onClick={() => toggle(b.id)}
              />
            ))}
          </BuffSection>

          {/* 적용 결과 요약 */}
          <div className="flex items-center gap-2 flex-wrap text-xs border-t border-app/60 mt-1 pt-3">
            <span className="text-fg-subtle">적용 합계</span>
            <span
              className={`px-2.5 py-1 rounded-full font-bold tabular-nums ${TONE.time.pill}`}
            >
              건설 속도 +{Math.round(totals.speedSum * 100)}%
            </span>
            {totals.fixedSeconds > 0 && (
              <span
                className={`px-2.5 py-1 rounded-full font-bold tabular-nums ${TONE.time.pill}`}
              >
                고정 단축 {formatDuration(totals.fixedSeconds)}
              </span>
            )}
            <span
              className={`px-2.5 py-1 rounded-full font-bold tabular-nums ${TONE.resource.pill}`}
            >
              자원 {(totals.resourceSum * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </section>

      {/* ───── 요구 사항 표 ───── */}
      <section className="bg-card rounded-2xl border border-app shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-palmon-primary/5 border-b border-app text-xs">
                <th className="text-left py-2.5 px-3 font-bold text-fg-muted w-14 whitespace-nowrap">
                  레벨
                </th>
                <ResourceHead
                  icon={<Coins size={13} aria-hidden />}
                  label="골드"
                  color="text-amber-500"
                />
                <ResourceHead
                  icon={<TreePine size={13} aria-hidden />}
                  label="목판"
                  color="text-emerald-500"
                />
                <ResourceHead
                  icon={<Wrench size={13} aria-hidden />}
                  label="강철"
                  color="text-sky-500"
                />
                <ResourceHead
                  icon={<Stamp size={13} aria-hidden />}
                  label="마스터 인장"
                  color="text-palmon-accent"
                />
                <ResourceHead
                  icon={<Clock size={13} aria-hidden />}
                  label="시간"
                  color="text-palmon-primary"
                />
                <th className="text-left py-2.5 px-3 font-bold text-fg-muted whitespace-nowrap">
                  자격 요건
                </th>
              </tr>
            </thead>
            <tbody>
              {LEVELS.map((b) => (
                <LevelRow
                  key={buildLevelLabel(b)}
                  b={b}
                  totals={totals}
                  buffed={active}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/** 마우스를 올리면 설명이 나온다는 표시. 눈에 띄도록 강조색을 준다. */
function HelpMark() {
  return (
    <HelpCircle
      size={13}
      className="shrink-0 text-palmon-accent"
      aria-label="설명 있음"
    />
  );
}

// 색으로 갈래를 구분한다. 건설 시간이 더 중요한 정보라 눈에 잘 띄는 초록을 준다.
type Tone = "time" | "resource";

const TONE = {
  time: {
    on: "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    off: "border-app text-fg-muted hover:border-emerald-500/50",
    title: "text-emerald-600 dark:text-emerald-400",
    value: "text-emerald-600 dark:text-emerald-300",
    pill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  },
  resource: {
    on: "border-palmon-primary bg-palmon-primary/10 text-palmon-primary",
    off: "border-app text-fg-muted hover:border-palmon-primary/50",
    title: "text-palmon-primary",
    value: "text-palmon-primary",
    pill: "bg-palmon-primary/10 text-palmon-primary",
  },
} as const;

function chipClass(on: boolean, tone: Tone): string {
  return [
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-colors text-left cursor-help",
    on ? TONE[tone].on : TONE[tone].off,
  ].join(" ");
}

function BuffSection({
  title,
  hint,
  tone,
  children,
}: {
  title: string;
  hint?: string;
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-xs font-bold ${TONE[tone].title}`}>{title}</span>
        {hint && <span className="text-[11px] text-fg-subtle">· {hint}</span>}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function BuffChip({
  buff,
  on,
  tone,
  onClick,
}: {
  buff: BuffToggle;
  on: boolean;
  tone: Tone;
  onClick: () => void;
}) {
  const amount =
    buff.fixedMinutes && buff.fixedMinutes > 0
      ? `-${buff.fixedMinutes}분`
      : `${buff.rate > 0 ? "+" : ""}${(buff.rate * 100).toFixed(
          Number.isInteger(buff.rate * 100) ? 0 : 1
        )}%`;

  return (
    <button
      type="button"
      onClick={onClick}
      title={buff.note ? `${buff.detail} — ${buff.note}` : buff.detail}
      className={chipClass(on, tone)}
    >
      <span className="font-bold">{buff.label}</span>
      <span className="opacity-70 tabular-nums">{amount}</span>
      {/* 마우스를 올리면 설명이 나온다는 표시. 이름만 봐도 아는 항목에는 달지 않는다. */}
      {!buff.selfEvident && <HelpMark />}
    </button>
  );
}

function ResourceHead({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <th className="text-right py-2.5 px-3 font-bold text-fg-muted whitespace-nowrap">
      <span className="inline-flex items-center gap-1">
        <span className={color}>{icon}</span>
        {label}
      </span>
    </th>
  );
}

function LevelRow({
  b,
  totals,
  buffed,
}: {
  b: BuildRequirement;
  totals: ReturnType<typeof sumBuffs>;
  /** 버프가 하나라도 켜져 있으면 값에 강조를 준다. */
  buffed: boolean;
}) {
  const seconds = applyTimeBuff(b.seconds, totals);

  return (
    <tr className="border-b border-app/50 last:border-0 hover:bg-muted/60 transition-colors">
      <td className="py-2 px-3">
        <span
          className={`inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-xl bg-muted border border-app font-bold tabular-nums whitespace-nowrap ${
            b.step ? "text-xs" : "text-sm"
          }`}
        >
          {buildLevelLabel(b)}
        </span>
      </td>
      <Amount
        value={applyResourceBuff(b.gold, totals)}
        base={b.gold}
        color="text-amber-600 dark:text-amber-300"
        buffed={buffed}
      />
      <Amount
        value={applyResourceBuff(b.wood, totals)}
        base={b.wood}
        color="text-emerald-600 dark:text-emerald-300"
        buffed={buffed}
      />
      <Amount
        value={applyResourceBuff(b.steel, totals)}
        base={b.steel}
        color="text-sky-600 dark:text-sky-300"
        buffed={buffed}
      />
      {/* 마스터 인장은 자원 절감 버프 대상이 아니다. */}
      <Amount
        value={b.masterSeal}
        base={b.masterSeal}
        color="text-palmon-accent"
        buffed={false}
      />
      <td
        className={`py-2 px-3 text-right text-[11px] tabular-nums whitespace-nowrap cursor-help ${
          buffed && seconds !== b.seconds
            ? `${TONE.time.value} font-bold`
            : "text-fg-muted"
        }`}
        title={
          buffed && seconds !== b.seconds
            ? `기본 ${formatDuration(b.seconds)}`
            : undefined
        }
      >
        {formatDuration(seconds)}
      </td>
      <td className="py-2 px-3 whitespace-nowrap">
        {b.prereqs.length > 0 ? (
          <span className="inline-flex gap-1">
            {b.prereqs.map((p) => (
              <span
                key={p}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-palmon-primary/10 text-palmon-primary text-[11px] font-bold"
              >
                {p}
              </span>
            ))}
          </span>
        ) : (
          <span className="text-[11px] text-fg-subtle">선행 조건 없음</span>
        )}
      </td>
    </tr>
  );
}

function Amount({
  value,
  base,
  color,
  buffed,
}: {
  value: number | null;
  base: number | null;
  color: string;
  buffed: boolean;
}) {
  if (value === null) {
    return <td className="py-2 px-3 text-right text-fg-subtle">—</td>;
  }
  const changed = buffed && value !== base;
  return (
    <td
      className={`py-2 px-3 text-right font-bold tabular-nums whitespace-nowrap cursor-help ${
        changed ? TONE.resource.value : color
      }`}
      title={
        changed && base !== null
          ? `${formatKrExact(value)} (기본 ${formatKrExact(base)})`
          : formatKrExact(value)
      }
    >
      {formatKrCompact(value)}
    </td>
  );
}
