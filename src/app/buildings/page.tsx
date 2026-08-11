import type { Metadata } from "next";
import { Coins, TreePine, Wrench, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  buildRequirements,
  buildStages,
  buildMeta,
  type BuildRequirement,
} from "@/lib/data/build";
import { formatKrNum, formatDuration } from "@/lib/format";

export const metadata: Metadata = {
  title: "캠프 업그레이드 요구사항",
  description: "캠프 레벨 2~30 업그레이드 자격, 자원, 시간 정리",
};

export default function BuildingsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        emoji="🏕️"
        title="캠프 업그레이드"
        description="캠프 레벨 2~30까지 업그레이드에 필요한 자격 요건, 자원, 시간을 정리했어요."
        meta={<>최종 업데이트: {buildMeta.updatedAt}</>}
      />

      {/* 스테이지 목차 */}
      <nav
        aria-label="스테이지"
        className="bg-card rounded-2xl p-3 border border-app shadow-soft sticky top-16 z-20 backdrop-blur bg-card/90"
      >
        <div className="flex gap-2 overflow-x-auto">
          {buildStages.map((s) => (
            <a
              key={s.key}
              href={`#${s.key}`}
              className="flex-shrink-0 text-sm px-3 py-1.5 rounded-full bg-muted hover:bg-gradient-palmon hover:text-white transition-colors"
            >
              {s.emoji} {s.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="rounded-xl bg-muted p-3 text-xs text-fg-muted">
        📌 {buildMeta.note}
      </div>

      {buildStages.map((stage) => {
        const items = buildRequirements.filter(
          (b) => b.level >= stage.range[0] && b.level <= stage.range[1]
        );
        return (
          <section
            key={stage.key}
            id={stage.key}
            className="scroll-mt-32 space-y-4"
          >
            <div className="flex items-center gap-2 px-1">
              <span className="text-2xl">{stage.emoji}</span>
              <h2 className="text-xl md:text-2xl">{stage.label}</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((b) => (
                <LevelCard key={b.level} b={b} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function LevelCard({ b }: { b: BuildRequirement }) {
  return (
    <article className="bg-card rounded-2xl p-4 md:p-5 border border-app shadow-soft">
      {/* 헤더: 레벨 뱃지 + 시간 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-fg-subtle">Lv.</span>
          <span className="text-3xl font-bold bg-gradient-palmon bg-clip-text text-transparent tabular-nums">
            {b.level}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs">
          <Clock size={13} className="text-palmon-primary" />
          <span className="tabular-nums">{formatDuration(b.seconds)}</span>
        </div>
      </div>

      {/* 자격 요건 */}
      <div className="mb-3">
        <div className="text-[10px] text-fg-subtle uppercase tracking-wider mb-1.5">
          자격 요건
        </div>
        {b.prereqs.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {b.prereqs.map((p) => (
              <span
                key={p}
                className="text-xs px-2 py-1 rounded-md bg-muted border border-app/60"
              >
                {p}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-xs text-fg-subtle italic">없음</div>
        )}
      </div>

      {/* 자원 */}
      <div>
        <div className="text-[10px] text-fg-subtle uppercase tracking-wider mb-1.5">
          자원
        </div>
        <div className="grid grid-cols-3 gap-2">
          <ResourceCell
            icon={<Coins size={14} />}
            label="골드"
            value={b.gold}
            color="text-yellow-500"
          />
          <ResourceCell
            icon={<TreePine size={14} />}
            label="목판"
            value={b.wood}
            color="text-emerald-500"
          />
          <ResourceCell
            icon={<Wrench size={14} />}
            label="강철"
            value={b.steel}
            color="text-slate-400"
          />
        </div>
      </div>
    </article>
  );
}

function ResourceCell({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  color: string;
}) {
  return (
    <div className="flex flex-col p-2 rounded-lg bg-muted">
      <div className={`flex items-center gap-1 text-[10px] ${color}`}>
        {icon}
        <span className="text-fg-subtle">{label}</span>
      </div>
      <div
        className={`text-sm font-bold tabular-nums mt-0.5 ${
          value === null ? "text-fg-subtle" : ""
        }`}
      >
        {formatKrNum(value)}
      </div>
    </div>
  );
}
