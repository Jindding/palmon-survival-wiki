"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { gvgSchedule, type GvGDay } from "@/lib/data/gvg";
import {
  getGoldenSlots,
  MVM_CATEGORIES,
  type MvMDaySlot,
} from "@/lib/data/mvm";

function getKstDayIndex(): number {
  const kstString = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });
  return new Date(kstString).getDay();
}

// 오늘 MvM day 시작 시각(= KST 11:00) 의 UTC 밀리초
function getMvmDayStartUtcMs(now: Date): number {
  const kstStr = now.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  const kstDate = new Date(kstStr);
  return Date.UTC(
    kstDate.getFullYear(),
    kstDate.getMonth(),
    kstDate.getDate(),
    2, // 02:00 UTC = 11:00 KST
    0,
    0,
  );
}

const SLOT_OFFSET_HOURS: Record<string, number> = {
  lunch: 0,
  afternoon: 4,
  evening: 8,
  night: 12,
  dawn: 16,
  morning: 20,
};

type SlotStatus = "upcoming" | "active" | "past";

interface SlotTiming {
  status: SlotStatus;
  remainingMs: number;
}

function getSlotTiming(slotKey: string, now: Date): SlotTiming {
  const mvmDayStart = getMvmDayStartUtcMs(now);
  const offset = SLOT_OFFSET_HOURS[slotKey] ?? 0;
  const slotStart = mvmDayStart + offset * 3_600_000;
  const slotEnd = slotStart + 4 * 3_600_000;
  const t = now.getTime();
  if (t < slotStart) return { status: "upcoming", remainingMs: slotStart - t };
  if (t < slotEnd) return { status: "active", remainingMs: slotEnd - t };
  return { status: "past", remainingMs: 0 };
}

function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function HomeTodayOverlap() {
  const [day, setDay] = useState<GvGDay | null>(null);
  const [slots, setSlots] = useState<MvMDaySlot[]>([]);
  const [now, setNow] = useState<Date | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idx = getKstDayIndex();
    const d = gvgSchedule.find((x) => x.dayIndex === idx) ?? null;
    setDay(d);
    if (d) setSlots(getGoldenSlots(d.key, d.dayIndex, new Date()));
    setNow(new Date());
    setReady(true);
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!ready) {
    return (
      <div className="h-36 rounded-2xl bg-muted/40 animate-pulse border border-app" />
    );
  }

  // 일요일
  if (!day) {
    return (
      <div className="rounded-2xl border border-app bg-muted/40 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🌙</span>
          <h3 className="text-base md:text-lg font-bold">
            오늘은 GvG가 없는 날 (일요일)
          </h3>
        </div>
        <p className="text-xs md:text-sm text-fg-muted leading-relaxed">
          일요일은 GvG 미션이 진행되지 않습니다. 다음 GvG는 월요일부터 시작해요.{" "}
          <Link
            href="/mvm"
            className="text-palmon-primary underline underline-offset-2 hover:text-palmon-secondary"
          >
            모험가 대회
          </Link>
          는 그대로 진행됩니다.
        </p>
      </div>
    );
  }

  // 겹치는 카테고리 없음
  if (slots.length === 0) {
    return (
      <div className="rounded-2xl border border-app bg-muted/40 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">✨</span>
          <h3 className="text-base md:text-lg font-bold">
            오늘은 중복 시간이 없어요
          </h3>
        </div>
        <p className="text-xs md:text-sm text-fg-muted leading-relaxed">
          <b>{day.day}</b> · <b>{day.theme}</b> 테마와 직접 겹치는 모험가 대회
          카테고리가 없어요.{" "}
          <Link
            href="/mvm"
            className="text-palmon-primary underline underline-offset-2 hover:text-palmon-secondary"
          >
            모험가 대회 페이지
          </Link>
          에서 오늘 스케줄 확인 후 활동을 조율하세요.
        </p>
      </div>
    );
  }

  // 상태 분류
  const enriched = slots.map((s) => ({
    slot: s,
    timing: now ? getSlotTiming(s.slot.key, now) : null,
  }));
  const active = enriched.find((e) => e.timing?.status === "active");
  const upcoming = enriched.filter((e) => e.timing?.status === "upcoming");
  const past = enriched.filter((e) => e.timing?.status === "past");

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10 dark:from-amber-500/15 dark:via-yellow-500/10 dark:to-orange-500/15 shadow-soft p-4 md:p-5">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl md:text-2xl">✨</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-bold leading-tight">
            모험가 대회, 길드대결 중복 시간
          </h3>
          <div className="text-[11px] md:text-xs text-fg-subtle mt-0.5">
            {day.day} · {day.theme}
          </div>
        </div>
      </div>

      {/* 진행 중인 슬롯 - 강조 카드 */}
      {active && active.timing && (
        <ActiveCard slot={active.slot} timing={active.timing} />
      )}

      {/* 다음 시간대 리스트 */}
      {upcoming.length > 0 && (
        <>
          {active && (
            <div className="text-[10px] uppercase tracking-wider font-bold text-fg-subtle mt-4 mb-2 px-1">
              다음 시간대
            </div>
          )}
          <ul className="space-y-1.5">
            {upcoming.map((e) => (
              <UpcomingRow
                key={e.slot.slot.key}
                slot={e.slot}
                timing={e.timing!}
              />
            ))}
          </ul>
        </>
      )}

      {/* 완료된 시간대 */}
      {past.length > 0 && (
        <>
          <div className="text-[10px] uppercase tracking-wider font-bold text-fg-subtle mt-4 mb-2 px-1">
            완료된 시간대
          </div>
          <ul className="space-y-1.5">
            {past.map((e) => (
              <PastRow key={e.slot.slot.key} slot={e.slot} />
            ))}
          </ul>
        </>
      )}

      {/* 링크 */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-fg-subtle border-t border-amber-500/20 pt-3">
        <Link
          href="/gvg"
          className="text-palmon-primary hover:text-palmon-secondary underline underline-offset-2"
        >
          GvG 주간 미션 →
        </Link>
        <Link
          href="/mvm"
          className="text-palmon-primary hover:text-palmon-secondary underline underline-offset-2"
        >
          모험가 대회 →
        </Link>
      </div>
    </div>
  );
}

function ActiveCard({
  slot,
  timing,
}: {
  slot: MvMDaySlot;
  timing: SlotTiming;
}) {
  const cat = MVM_CATEGORIES[slot.category];
  return (
    <div className="rounded-xl border-2 border-green-500/60 bg-green-500/10 dark:bg-green-500/15 p-4 md:p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[11px] uppercase tracking-wider font-bold text-green-600 dark:text-green-400">
          지금 진행 중
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl md:text-3xl shadow-soft flex-shrink-0`}
        >
          {cat.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-lg md:text-xl font-bold">{cat.label}</div>
          <div className="text-xs text-fg-subtle tabular-nums mt-0.5">
            {slot.slot.timeRangeKst}{" "}
            <span className="text-[10px]">KST</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-green-500/25 text-center">
        <div className="text-3xl md:text-4xl font-bold tabular-nums text-green-700 dark:text-green-300 leading-none tracking-tight">
          {formatDuration(timing.remainingMs)}
        </div>
        <div className="text-[11px] text-fg-subtle mt-1.5">종료까지 남은 시간</div>
      </div>
    </div>
  );
}

function PastRow({ slot }: { slot: MvMDaySlot }) {
  const cat = MVM_CATEGORIES[slot.category];
  return (
    <li className="flex items-center gap-3 bg-card/60 border border-app rounded-lg px-3 py-2.5 opacity-55">
      <div
        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-lg shadow-soft flex-shrink-0 grayscale`}
      >
        {cat.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate">{cat.label}</div>
        <div className="text-[11px] text-fg-subtle tabular-nums">
          {slot.slot.timeRangeKst}{" "}
          <span className="text-[10px]">KST</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0 inline-flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400" />
        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">
          완료
        </span>
      </div>
    </li>
  );
}

function UpcomingRow({
  slot,
  timing,
}: {
  slot: MvMDaySlot;
  timing: SlotTiming;
}) {
  const cat = MVM_CATEGORIES[slot.category];
  return (
    <li className="flex items-center gap-3 bg-card border border-app rounded-lg px-3 py-2.5">
      <div
        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-lg shadow-soft flex-shrink-0`}
      >
        {cat.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate">{cat.label}</div>
        <div className="text-[11px] text-fg-subtle tabular-nums">
          {slot.slot.timeRangeKst}{" "}
          <span className="text-[10px]">KST</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-sm font-bold tabular-nums leading-none">
          {formatDuration(timing.remainingMs)}
        </div>
        <div className="mt-1.5 inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
            진행 예정
          </span>
        </div>
      </div>
    </li>
  );
}
