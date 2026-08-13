"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { gvgSchedule, type GvGDay, type Mission, type MissionGroup } from "@/lib/data/gvg";
import { getGoldenSlots, MVM_CATEGORIES } from "@/lib/data/mvm";

const num = new Intl.NumberFormat("ko-KR");

function getKstDayIndex(): number {
  const kstString = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });
  return new Date(kstString).getDay();
}

export function GvGView() {
  const [today, setToday] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const idx = getKstDayIndex();
    setToday(idx);
    const found = gvgSchedule.find((d) => d.dayIndex === idx);
    setSelected(found ? found.key : gvgSchedule[0].key);
  }, []);

  return (
    <>
      {/* 요일 탭 */}
      <div className="sticky top-16 -mx-4 md:-mx-8 px-4 md:px-8 py-3 backdrop-blur bg-app/80 border-b border-app z-20 mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {gvgSchedule.map((d) => {
            const isToday = today === d.dayIndex;
            const isSelected = selected === d.key;
            return (
              <button
                key={d.key}
                onClick={() => setSelected(d.key)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl border transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${d.color} text-white border-transparent shadow-soft`
                    : "bg-card border-app hover:border-palmon-primary"
                }`}
              >
                <span className="text-xs">
                  {d.short}
                  {isToday && (
                    <span
                      className={`ml-1 text-[9px] px-1 rounded ${
                        isSelected
                          ? "bg-white/25 text-white"
                          : "bg-palmon-accent text-white"
                      }`}
                    >
                      오늘
                    </span>
                  )}
                </span>
                <span className="text-[11px] whitespace-nowrap mt-0.5">
                  {d.theme}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택된 요일 상세 */}
      <div className="space-y-4">
        {gvgSchedule
          .filter((d) => d.key === selected)
          .map((day) => (
            <DayPanel key={day.key} day={day} isToday={today === day.dayIndex} />
          ))}
      </div>
    </>
  );
}

function DayPanel({ day, isToday }: { day: GvGDay; isToday: boolean }) {
  const goldenSlots = getGoldenSlots(day.key, day.dayIndex);

  return (
    <>
      <div className="bg-card rounded-2xl p-5 md:p-6 border border-app shadow-soft">
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${day.color} flex items-center justify-center text-3xl shadow-soft`}
          >
            {day.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl">{day.day}</h2>
              {isToday && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-palmon-accent text-white">
                  TODAY
                </span>
              )}
            </div>
            <p className="text-sm text-fg-muted">테마: {day.theme}</p>
          </div>
        </div>

        <MissionTable missions={day.missions} />
      </div>

      <GoldenTimeCard day={day} goldenSlots={goldenSlots} />

      {day.groups?.map((group) => (
        <div
          key={group.title}
          className="bg-card rounded-2xl p-5 md:p-6 border border-app shadow-soft"
        >
          <div className="mb-3">
            <h3 className="text-lg">{group.title}</h3>
            {group.note && (
              <p className="text-xs text-fg-subtle mt-0.5">{group.note}</p>
            )}
          </div>
          <MissionTable missions={group.missions} columns={group.columns} />
        </div>
      ))}
    </>
  );
}

function GoldenTimeCard({
  day,
  goldenSlots,
}: {
  day: GvGDay;
  goldenSlots: ReturnType<typeof getGoldenSlots>;
}) {
  if (goldenSlots.length === 0) {
    return (
      <div className="rounded-2xl border border-app bg-muted/40 p-4 md:p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">✨</span>
          <h3 className="text-base">모험가 대회와 겹치는 시간</h3>
        </div>
        <p className="text-xs text-fg-muted leading-relaxed">
          {day.day} <b>{day.theme}</b> 테마와 직접 겹치는 모험가 대회 카테고리가 없습니다.
          다만 하루 6개 시간대별로 카테고리가 순환하므로{" "}
          <Link
            href="/mvm"
            className="text-palmon-primary underline underline-offset-2 hover:text-palmon-secondary"
          >
            모험가 대회 페이지
          </Link>
          에서 오늘 스케줄을 확인해 활동을 조율하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10 dark:from-amber-500/15 dark:via-yellow-500/10 dark:to-orange-500/15 shadow-soft p-5 md:p-6">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">✨</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg">모험가 대회와 겹치는 시간</h3>
          <p className="text-xs text-fg-muted mt-0.5 leading-relaxed">
            이 시간대에는 <b>{day.theme}</b> 미션 활동이 그대로 모험가 대회 점수로도 잡히기
            때문에 <b>두 이벤트 점수를 동시에 획득</b>할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {goldenSlots.map((s) => {
          const cat = MVM_CATEGORIES[s.category];
          return (
            <div
              key={s.slot.key}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-card rounded-xl p-3 border border-app"
            >
              <div className="flex items-center gap-3 sm:w-64 shrink-0">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl shadow-soft`}
                >
                  {cat.emoji}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold tabular-nums">
                    {s.slot.timeRangeKst}{" "}
                    <span className="text-[10px] text-fg-subtle font-normal">KST</span>
                  </div>
                  <div className="text-[11px] text-fg-subtle">{s.slot.label}</div>
                </div>
              </div>
              <div className="flex-1 min-w-0 text-xs text-fg-muted">
                <div className="text-sm font-bold text-fg mb-0.5">{cat.label}</div>
                <div>{cat.actions.join(" · ")}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-[11px] text-fg-subtle">
        전체 시간대는{" "}
        <Link
          href="/mvm"
          className="text-palmon-primary underline underline-offset-2 hover:text-palmon-secondary"
        >
          모험가 대회 페이지
        </Link>
        에서 확인하세요.
      </div>
    </div>
  );
}

function MissionTable({
  missions,
  columns,
}: {
  missions: Mission[];
  columns?: MissionGroup["columns"];
}) {
  const hasAlt = missions.some((m) => m.scoreAlt !== undefined);

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-fg-subtle text-xs uppercase">
            <th className="py-2 px-2 font-normal">미션</th>
            <th className="py-2 px-2 font-normal text-right">
              {hasAlt ? columns?.[0] ?? "점수" : "점수"}
            </th>
            {hasAlt && (
              <th className="py-2 px-2 font-normal text-right">
                {columns?.[1] ?? "대체 점수"}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {missions.map((m, i) => (
            <tr key={i} className="border-t border-app/40">
              <td className="py-2 px-2">{m.name}</td>
              <td className="py-2 px-2 text-right tabular-nums font-bold text-palmon-primary dark:text-palmon-secondary">
                {num.format(m.score)}
              </td>
              {hasAlt && (
                <td className="py-2 px-2 text-right tabular-nums text-fg-muted">
                  {m.scoreAlt !== undefined ? num.format(m.scoreAlt) : "—"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
