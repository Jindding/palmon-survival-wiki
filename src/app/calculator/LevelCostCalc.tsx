"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { calcLevelCost } from "@/lib/data/calculators/level-cost";
import { formatKrCompact, formatKrExact } from "@/lib/format";

// 경험치 계산기와 스킬열매 계산기는 "레벨 구간 비용"이라는 같은 구조라 UI를 공유한다.
// 다른 건 비용 배열 · 최대 레벨 · 아이템 이미지 · 이름뿐이라 prop으로 받는다.
//
// 레벨 선택은 드롭다운 대신 숫자 입력을 쓴다. 경험치는 최대 300레벨이라
// 목록에서 찾는 것보다 직접 치는 편이 훨씬 빠르다.

export function LevelCostCalc({
  costs,
  maxLevel,
  image,
  itemName,
  defaultTarget,
}: {
  costs: readonly number[];
  maxLevel: number;
  image: string;
  itemName: string;
  defaultTarget: number;
}) {
  const [current, setCurrent] = useState("1");
  const [target, setTarget] = useState(String(defaultTarget));
  const [owned, setOwned] = useState("");

  const currentLv = clampLevel(current, maxLevel);
  const targetLv = clampLevel(target, maxLevel);

  const result = useMemo(
    () =>
      calcLevelCost(costs, maxLevel, {
        current: currentLv,
        target: targetLv,
        owned: parseInt(owned, 10) || 0,
      }),
    [costs, maxLevel, currentLv, targetLv, owned]
  );

  const hasOwned = result.owned > 0;
  const isShort = hasOwned && result.shortage > 0;

  return (
    <div className="space-y-4">
      {/* ── 입력 ── */}
      <div className="bg-card rounded-2xl border border-app shadow-soft p-5 md:p-6 space-y-5">
        <div className="flex items-end gap-2 sm:gap-3">
          <LevelInput
            id="level-current"
            label="현재 레벨"
            value={current}
            onChange={setCurrent}
            maxLevel={maxLevel}
          />
          <ArrowRight
            size={18}
            className="text-fg-subtle shrink-0 mb-3"
            aria-hidden
          />
          <LevelInput
            id="level-target"
            label="목표 레벨"
            value={target}
            onChange={setTarget}
            maxLevel={maxLevel}
          />
        </div>

        <label className="block">
          <span className="flex items-center gap-1.5 text-sm font-bold">
            <Image
              src={image}
              alt=""
              width={20}
              height={20}
              aria-hidden
              className="w-5 h-5 object-contain rounded"
            />
            보유 {itemName}
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={owned}
            onChange={(e) => setOwned(e.target.value)}
            placeholder="비워두면 필요량만 계산해요"
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-app bg-app text-base tabular-nums focus:outline-none focus:border-palmon-primary"
          />
        </label>
      </div>

      {/* ── 결과 ── */}
      <div
        className={`rounded-2xl border-2 shadow-soft p-5 md:p-6 transition-colors ${
          result.alreadyDone
            ? "border-app bg-card"
            : isShort
              ? "border-red-500/40 bg-red-500/5 dark:bg-red-500/10"
              : "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10"
        }`}
      >
        {result.alreadyDone ? (
          <p className="text-sm text-fg-muted py-4 text-center">
            목표 레벨이 현재 레벨보다 같거나 낮아요. 목표를 더 높게 잡아 보세요.
          </p>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3 py-2">
              <Image
                src={image}
                alt=""
                width={48}
                height={48}
                aria-hidden
                className="w-12 h-12 object-contain rounded-lg shrink-0"
              />
              <div className="text-center">
                <div className="text-xs text-fg-muted mb-0.5">
                  Lv {currentLv} → Lv {targetLv}
                </div>
                {isShort ? (
                  <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 tabular-nums">
                    {formatKrCompact(result.shortage)} 부족
                  </div>
                ) : (
                  <div className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatKrCompact(result.needed)}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-card/70 border border-app divide-y divide-app text-sm">
              <Row label="필요량" value={formatKrExact(result.needed)} bold />
              {hasOwned && (
                <>
                  <Row label="보유" value={formatKrExact(result.owned)} />
                  {isShort ? (
                    <Row
                      label="모자란 양"
                      value={formatKrExact(result.shortage)}
                      tone="danger"
                      bold
                    />
                  ) : (
                    <Row
                      label="남는 양"
                      value={formatKrExact(result.surplus)}
                      tone="accent"
                    />
                  )}
                </>
              )}
              <Row
                label={`Lv 1 → Lv ${targetLv} 전체 누적`}
                value={formatKrExact(result.totalToTarget)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** 입력 중 빈 칸을 허용하려고 문자열로 들고, 계산할 때만 범위 안으로 맞춘다. */
function clampLevel(raw: string, maxLevel: number): number {
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n)) return 1;
  return Math.min(Math.max(n, 1), maxLevel);
}

function LevelInput({
  id,
  label,
  value,
  onChange,
  maxLevel,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLevel: number;
}) {
  return (
    <label htmlFor={id} className="block flex-1 min-w-0">
      <span className="text-sm font-bold">{label}</span>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={1}
        max={maxLevel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-app bg-app text-base tabular-nums focus:outline-none focus:border-palmon-primary"
      />
      <span className="text-[11px] text-fg-subtle mt-1 block">1 ~ {maxLevel}</span>
    </label>
  );
}

function Row({
  label,
  value,
  tone,
  bold,
}: {
  label: string;
  value: string;
  tone?: "accent" | "danger";
  bold?: boolean;
}) {
  const toneCls =
    tone === "accent"
      ? "text-palmon-primary"
      : tone === "danger"
        ? "text-red-600 dark:text-red-400"
        : "text-fg";
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2">
      <span className="text-fg-muted text-[13px]">{label}</span>
      <span className={`tabular-nums ${toneCls} ${bold ? "font-bold" : ""}`}>
        {value}
      </span>
    </div>
  );
}
