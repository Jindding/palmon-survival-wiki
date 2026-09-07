"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Dropdown, type DropdownOption } from "@/components/Dropdown";
import {
  ENERGY_BEAD_IMAGE,
  ENERGY_STEPS,
  ENERGY_STEP_OPTIONS,
  ENERGY_START_INDEX,
  calcEnergyBeads,
} from "@/lib/data/calculators/energy-bead";
import { formatKrNum } from "@/lib/format";

// "현재"는 완료 지점을 고르는 것이라 "처음 시작"이 앞에 하나 더 붙는다.
const CURRENT_OPTIONS: DropdownOption<number>[] = [
  { value: ENERGY_START_INDEX, label: "처음 시작", group: "시작 전" },
  ...ENERGY_STEP_OPTIONS.map((o) => ({
    value: o.index,
    label: `${o.shortLabel} 완료`,
    group: o.groupLabel,
  })),
];

const TARGET_OPTIONS: DropdownOption<number>[] = ENERGY_STEP_OPTIONS.map((o) => ({
  value: o.index,
  label: o.shortLabel,
  hint: formatKrNum(o.cost),
  group: o.groupLabel,
}));

// 입력은 문자열로 들고 있다가 계산 직전에 숫자로 바꾼다.
// 그래야 사용자가 값을 지웠을 때 0이 강제로 남지 않는다.
function toNum(v: string): number {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

const LAST_INDEX = ENERGY_STEPS.length - 1;

export function EnergyBeadCalc() {
  const [currentIndex, setCurrentIndex] = useState(ENERGY_START_INDEX);
  const [targetIndex, setTargetIndex] = useState(LAST_INDEX);
  const [owned, setOwned] = useState("");

  const result = useMemo(
    () => calcEnergyBeads({ currentIndex, targetIndex, owned: toNum(owned) }),
    [currentIndex, targetIndex, owned]
  );

  const enough = result.owned >= result.needed;
  const currentLabel =
    currentIndex === ENERGY_START_INDEX
      ? "처음 시작"
      : `${ENERGY_STEPS[currentIndex].label} 완료`;

  return (
    <div className="space-y-4">
      {/* ── 입력 ── */}
      <div className="bg-card rounded-2xl border border-app shadow-soft p-5 md:p-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="energy-current"
              className="text-sm font-bold block mb-1.5"
            >
              📍 현재 (완료한 곳까지)
            </label>
            <Dropdown
              id="energy-current"
              value={currentIndex}
              options={CURRENT_OPTIONS}
              onChange={setCurrentIndex}
            />
          </div>

          <div>
            <label
              htmlFor="energy-target"
              className="text-sm font-bold block mb-1.5"
            >
              🎯 목표
            </label>
            <Dropdown
              id="energy-target"
              value={targetIndex}
              options={TARGET_OPTIONS}
              onChange={setTargetIndex}
            />
          </div>
        </div>

        <label className="block">
          <span className="flex items-center gap-1.5 text-sm font-bold">
            <Image
              src={ENERGY_BEAD_IMAGE}
              alt=""
              width={20}
              height={20}
              aria-hidden
              className="w-5 h-5 object-contain rounded"
            />
            보유 에너지 구슬
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={owned}
            onChange={(e) => setOwned(e.target.value)}
            placeholder="지금 가진 개수 (비워두면 필요량만 계산)"
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-app bg-app text-base tabular-nums focus:outline-none focus:border-palmon-primary"
          />
        </label>
      </div>

      {/* ── 결과 ── */}
      <div
        className={`rounded-2xl border-2 shadow-soft p-5 md:p-6 transition-colors ${
          result.alreadyDone || enough
            ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10"
            : "border-red-500/40 bg-red-500/5 dark:bg-red-500/10"
        }`}
      >
        {result.alreadyDone ? (
          <p className="text-sm text-fg-muted py-4 text-center">
            목표가 현재 진행도보다 앞이에요. 추가로 필요한 에너지 구슬이 없습니다.
          </p>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3 py-2">
              <Image
                src={ENERGY_BEAD_IMAGE}
                alt=""
                width={48}
                height={48}
                aria-hidden
                className="w-12 h-12 object-contain rounded-lg shrink-0"
              />
              <div className="text-center">
                <div className="text-xs text-fg-muted mb-0.5">
                  {currentLabel} → {ENERGY_STEPS[targetIndex].label}
                </div>
                {result.owned > 0 && !enough ? (
                  <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 tabular-nums">
                    {formatKrNum(result.shortage)}개 부족
                  </div>
                ) : (
                  <div className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatKrNum(result.needed)}
                    <span className="text-xl md:text-2xl ml-1">개</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-card/70 border border-app divide-y divide-app text-sm">
              <Row label="필요 합계" value={formatKrNum(result.needed)} bold />
              {result.owned > 0 && (
                <>
                  <Row label="보유" value={formatKrNum(result.owned)} />
                  {enough ? (
                    <Row
                      label="남는 양"
                      value={formatKrNum(result.surplus)}
                      tone="accent"
                    />
                  ) : (
                    <Row
                      label="모자란 양"
                      value={formatKrNum(result.shortage)}
                      tone="danger"
                      bold
                    />
                  )}
                </>
              )}
            </div>

            {/* 단계별 내역 */}
            {result.byGroup.length > 1 && (
              <div className="mt-3 rounded-xl bg-muted p-3 text-xs text-fg-muted leading-relaxed">
                📊 단계별 내역 —{" "}
                {result.byGroup.map((g, i) => (
                  <span key={g.key}>
                    {i > 0 && " / "}
                    {g.label}{" "}
                    <b className="text-fg">{formatKrNum(g.need)}</b>
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
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
