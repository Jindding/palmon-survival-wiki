"use client";

import { useEffect, useState } from "react";
import { gvgSchedule, type GvGDay, type Mission, type MissionGroup } from "@/lib/data/gvg";

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
