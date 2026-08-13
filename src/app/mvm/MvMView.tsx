"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  mvmSchedule,
  MVM_CATEGORIES,
  GVG_TO_MVM,
  resolveCurrentKstContext,
  mvmRewardsSummary,
  type MvMCategoryKey,
  type MvMDay,
  type MvMDaySlot,
} from "@/lib/data/mvm";

// GvG 요일 키 → 표시용 테마 이름 (겹치는 시간 배지에 사용).
const GVG_THEME: Record<string, string> = {
  mon: "GvG 첩보 특훈",
  tue: "GvG 캠프 건설",
  wed: "GvG 기술 연구",
  thu: "GvG 팰몬 육성",
  fri: "GvG 전투 준비",
  sat: "GvG 적군 처치",
};

// 한글 명사 뒤에 붙는 조사(와/과, 이/가 등)를 종성 유무로 결정.
function ko(word: string, withoutBatchim: string, withBatchim: string): string {
  const last = word.charCodeAt(word.length - 1);
  if (last < 0xac00 || last > 0xd7a3) return withBatchim;
  return (last - 0xac00) % 28 === 0 ? withoutBatchim : withBatchim;
}

function findGvgMatchForDay(dayIndex: number): string | null {
  // MvM 요일과 GvG 요일은 dayIndex(0=일 ~ 6=토)로 동일하게 정렬된다.
  const entry = mvmSchedule.find((d) => d.dayIndex === dayIndex);
  if (!entry) return null;
  const gvgKey = entry.key;
  const matched = GVG_TO_MVM[gvgKey];
  return matched && matched.length > 0 ? gvgKey : null;
}

export function MvMView() {
  const [context, setContext] = useState<{ dayIndex: number; slotIndex: number } | null>(
    null,
  );
  const [selected, setSelected] = useState<string>(mvmSchedule[0].key);

  useEffect(() => {
    const ctx = resolveCurrentKstContext();
    setContext(ctx);
    const found = mvmSchedule.find((d) => d.dayIndex === ctx.dayIndex);
    setSelected(found ? found.key : mvmSchedule[0].key);
    // 매 분 갱신하여 현재 슬롯 표시가 정확하도록.
    const timer = setInterval(() => setContext(resolveCurrentKstContext()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const selectedDay = useMemo(
    () => mvmSchedule.find((d) => d.key === selected) ?? mvmSchedule[0],
    [selected],
  );

  return (
    <>
      {/* 요일 탭 */}
      <div className="sticky top-16 -mx-4 md:-mx-8 px-4 md:px-8 py-3 backdrop-blur bg-app/80 border-b border-app z-20 mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {mvmSchedule.map((d) => {
            const isToday = context?.dayIndex === d.dayIndex;
            const isSelected = selected === d.key;
            return (
              <button
                key={d.key}
                onClick={() => setSelected(d.key)}
                className={`flex-shrink-0 flex items-center gap-1 px-4 py-2 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-gradient-palmon text-white border-transparent shadow-soft"
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
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택된 요일 상세 */}
      <div className="space-y-4">
        <DayPanel
          day={selectedDay}
          currentSlotIndex={
            context?.dayIndex === selectedDay.dayIndex ? context.slotIndex : null
          }
        />

        <CategoryReference />

        <RewardsCard />

        <ServerTimeNote />
      </div>
    </>
  );
}

function DayPanel({
  day,
  currentSlotIndex,
}: {
  day: MvMDay;
  currentSlotIndex: number | null;
}) {
  const gvgKey = findGvgMatchForDay(day.dayIndex);
  const goldenCategories = gvgKey ? GVG_TO_MVM[gvgKey] ?? [] : [];
  const gvgTheme = gvgKey ? GVG_THEME[gvgKey] : null;

  return (
    <div className="bg-card rounded-2xl p-5 md:p-6 border border-app shadow-soft">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-palmon flex items-center justify-center text-3xl shadow-soft">
          🏆
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl">{day.day}</h2>
            {currentSlotIndex !== null && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-palmon-accent text-white">
                TODAY
              </span>
            )}
          </div>
          <p className="text-sm text-fg-muted">
            6개 시간대 · 5개 카테고리 순환
            {gvgTheme && (
              <>
                {" "}
                · <span className="text-amber-600 dark:text-amber-400">{gvgTheme}</span>
                {ko(gvgTheme, "와", "과")} 겹치는 시간 있음
              </>
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        {day.slots.map((s, i) => {
          const isCurrent = currentSlotIndex === i;
          return (
            <div key={s.slot.key} className="flex items-stretch gap-2">
              <div className="w-10 md:w-12 flex flex-col items-center justify-center shrink-0">
                {isCurrent && (
                  <>
                    <ChevronRight
                      className="text-palmon-primary animate-pulse"
                      size={32}
                      strokeWidth={3}
                    />
                    <span className="text-[10px] font-bold text-palmon-primary tracking-wider mt-0.5">
                      NOW
                    </span>
                  </>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <SlotRow
                  entry={s}
                  isCurrent={isCurrent}
                  isGolden={goldenCategories.includes(s.category)}
                  gvgTheme={gvgTheme}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] text-fg-subtle leading-relaxed">
        시간은 한국 시간(KST) 기준입니다. 게임 서버는 UTC−2로 KST 대비 11시간 느립니다.
        하루의 시작은 KST 11:00 (서버 자정)입니다.
      </p>
    </div>
  );
}

function SlotRow({
  entry,
  isCurrent,
  isGolden,
  gvgTheme,
}: {
  entry: MvMDaySlot;
  isCurrent: boolean;
  isGolden: boolean;
  gvgTheme: string | null;
}) {
  const cat = MVM_CATEGORIES[entry.category];
  return (
    <div
      className={`rounded-xl border p-3 md:p-4 flex flex-col md:flex-row md:items-center md:gap-4 transition-all ${
        isGolden
          ? "border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10 dark:from-amber-500/15 dark:via-yellow-500/10 dark:to-orange-500/15"
          : "border-app bg-card"
      } ${isCurrent ? "ring-2 ring-palmon-primary shadow-lg" : ""}`}
    >
      <div className="flex items-center gap-3 md:w-56 shrink-0">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-soft`}
        >
          {cat.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="text-sm font-bold">{entry.slot.timeRangeKst}</div>
            {isCurrent && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-palmon-accent text-white">
                NOW
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0 mt-3 md:mt-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-bold">{cat.label}</span>
          {isGolden && gvgTheme && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
              ✨ {gvgTheme} 겹침
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryReference() {
  return (
    <div className="bg-card rounded-2xl p-5 md:p-6 border border-app shadow-soft">
      <h3 className="text-lg mb-3">📚 카테고리 안내</h3>
      <div className="grid gap-2 md:grid-cols-2">
        {Object.values(MVM_CATEGORIES).map((cat) => (
          <div
            key={cat.key}
            className="flex items-start gap-3 p-3 rounded-xl border border-app bg-muted/40"
          >
            <div
              className={`w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl shadow-soft`}
            >
              {cat.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold">{cat.label}</div>
              <div className="text-[11px] text-fg-muted mt-0.5">
                {cat.actions.join(" · ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RewardsCard() {
  return (
    <div className="bg-card rounded-2xl p-5 md:p-6 border border-app shadow-soft">
      <h3 className="text-lg mb-1">🎁 보상 요약</h3>
      <p className="text-xs text-fg-muted mb-3">
        누적 포인트로 상점에서 다음 자원과 교환할 수 있습니다.
      </p>
      <ul className="grid gap-2 md:grid-cols-2 text-sm text-fg-muted">
        {mvmRewardsSummary.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-palmon-primary shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ServerTimeNote() {
  return (
    <div className="rounded-xl bg-muted p-3 text-[11px] text-fg-subtle">
      ✨ 표시 안내 · 노란색으로 강조된 시간대는 <b>GvG 요일 테마</b>와 겹치는 시간으로,
      한 번의 활동으로 두 이벤트 점수를 동시에 얻을 수 있는 구간입니다. 일요일은 GvG가 없어
      겹치는 시간이 없습니다.
    </div>
  );
}
