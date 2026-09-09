"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Dropdown, type DropdownOption } from "@/components/Dropdown";
import { ResultRow } from "@/components/calculator/ResultRow";
import { useCalcLang } from "@/components/calculator/CalcLangProvider";
import { calcDict } from "@/lib/i18n/calculator";
import {
  ENERGY_BEAD_IMAGE,
  ENERGY_STEPS,
  ENERGY_STEP_OPTIONS,
  ENERGY_START_INDEX,
  calcEnergyBeads,
} from "@/lib/data/calculators/energy-bead";
import { formatNum } from "@/lib/format";

// 입력은 문자열로 들고 있다가 계산 직전에 숫자로 바꾼다.
// 그래야 사용자가 값을 지웠을 때 0이 강제로 남지 않는다.
function toNum(v: string): number {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

const LAST_INDEX = ENERGY_STEPS.length - 1;

export function EnergyBeadCalc() {
  const { lang } = useCalcLang();
  const t = calcDict[lang];
  const tx = t.energyBead;
  const n = (v: number) => formatNum(v, lang);

  const [currentIndex, setCurrentIndex] = useState(ENERGY_START_INDEX);
  const [targetIndex, setTargetIndex] = useState(LAST_INDEX);
  const [owned, setOwned] = useState("");

  // 드롭다운 라벨은 언어를 따라간다.
  // "현재"는 완료 지점을 고르는 것이라 "처음 시작"이 앞에 하나 더 붙는다.
  const { currentOptions, targetOptions } = useMemo(() => {
    const steps: DropdownOption<number>[] = ENERGY_STEP_OPTIONS.map((o) => ({
      value: o.index,
      label: tx.stepLabel(o.stepNo),
      hint: n(o.cost),
      group: tx.groupLabels[o.groupLabel] ?? o.groupLabel,
    }));
    return {
      currentOptions: [
        {
          value: ENERGY_START_INDEX,
          label: tx.startFromScratch,
          group: tx.beforeStartGroup,
        },
        ...steps.map((o) => ({
          ...o,
          label: tx.completedSuffix(o.label),
          hint: undefined,
        })),
      ] as DropdownOption<number>[],
      targetOptions: steps,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const result = useMemo(
    () => calcEnergyBeads({ currentIndex, targetIndex, owned: toNum(owned) }),
    [currentIndex, targetIndex, owned]
  );

  const enough = result.owned >= result.needed;

  const stepFullLabel = (index: number) => {
    const o = ENERGY_STEP_OPTIONS[index];
    const group = tx.groupLabels[o.groupLabel] ?? o.groupLabel;
    return `${group} ${tx.stepLabel(o.stepNo)}`;
  };

  const currentLabel =
    currentIndex === ENERGY_START_INDEX
      ? tx.startFromScratch
      : tx.completedSuffix(stepFullLabel(currentIndex));

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
              {tx.currentLabel}
            </label>
            <Dropdown
              id="energy-current"
              value={currentIndex}
              options={currentOptions}
              onChange={setCurrentIndex}
            />
          </div>

          <div>
            <label
              htmlFor="energy-target"
              className="text-sm font-bold block mb-1.5"
            >
              {tx.targetLabel}
            </label>
            <Dropdown
              id="energy-target"
              value={targetIndex}
              options={targetOptions}
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
            {tx.ownedLabel}
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={owned}
            onChange={(e) => setOwned(e.target.value)}
            placeholder={tx.ownedPlaceholder}
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
            {tx.alreadyDone}
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
                  {currentLabel} → {stepFullLabel(targetIndex)}
                </div>
                {result.owned > 0 && !enough ? (
                  <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 tabular-nums">
                    {t.ui.shortBig(n(result.shortage))}
                  </div>
                ) : (
                  <div className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {n(result.needed)}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-card/70 border border-app divide-y divide-app text-sm">
              <ResultRow label={tx.totalNeed} value={n(result.needed)} bold />
              {result.owned > 0 && (
                <>
                  <ResultRow label={t.ui.owned} value={n(result.owned)} />
                  {enough ? (
                    <ResultRow
                      label={t.ui.leftOver}
                      value={n(result.surplus)}
                      tone="accent"
                    />
                  ) : (
                    <ResultRow
                      label={t.ui.shortLabel}
                      value={n(result.shortage)}
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
                📊 {tx.breakdown} —{" "}
                {result.byGroup.map((g, i) => (
                  <span key={g.key}>
                    {i > 0 && " / "}
                    {tx.groupLabels[g.label] ?? g.label}{" "}
                    <b className="text-fg">{n(g.need)}</b>
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
