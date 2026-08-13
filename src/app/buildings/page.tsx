import type { Metadata } from "next";
import { Coins, TreePine, Wrench, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  buildRequirements,
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
    <div className="max-w-4xl mx-auto space-y-4">
      <PageHeader
        emoji="🏕️"
        title="캠프 업그레이드"
        description="캠프 레벨 2~30까지 업그레이드에 필요한 자격 요건, 자원, 시간을 정리했어요."
        meta={<>최종 업데이트: {buildMeta.updatedAt}</>}
      />

      <div className="rounded-xl bg-muted p-3 text-xs text-fg-muted">
        📌 {buildMeta.note}
      </div>

      <div className="space-y-3">
        {buildRequirements.map((b) => (
          <LevelRow key={b.level} b={b} />
        ))}
      </div>
    </div>
  );
}

function LevelRow({ b }: { b: BuildRequirement }) {
  return (
    <article className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5">
      <div className="flex items-start gap-3 md:gap-4">
        {/* 레벨 뱃지 */}
        <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl bg-gradient-palmon flex flex-col items-center justify-center text-white shadow-soft">
          <span className="text-[9px] uppercase tracking-wider opacity-80 leading-none">
            Lv
          </span>
          <span className="text-2xl md:text-3xl font-bold tabular-nums leading-none mt-0.5">
            {b.level}
          </span>
        </div>

        {/* 본문 */}
        <div className="flex-1 min-w-0 space-y-2.5">
          {/* 자격 요건 + 시간 */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-fg-subtle uppercase tracking-wider mb-1">
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
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs shrink-0">
              <Clock size={13} className="text-palmon-primary" />
              <span className="tabular-nums">{formatDuration(b.seconds)}</span>
            </div>
          </div>

          {/* 자원 */}
          <div className="grid grid-cols-3 gap-2">
            <ResourceCell
              icon={<Coins size={13} />}
              label="골드"
              value={b.gold}
              color="text-yellow-500"
            />
            <ResourceCell
              icon={<TreePine size={13} />}
              label="목판"
              value={b.wood}
              color="text-emerald-500"
            />
            <ResourceCell
              icon={<Wrench size={13} />}
              label="강철"
              value={b.steel}
              color="text-slate-400"
            />
          </div>
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
