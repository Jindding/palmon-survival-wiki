"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { StarRankBadge } from "@/components/StarRankBadge";
import { ResultRow } from "@/components/calculator/ResultRow";
import { useCalcLang } from "@/components/calculator/CalcLangProvider";
import { calcDict } from "@/lib/i18n/calculator";
import {
  MASTERWORK_BEAD_IMAGE,
  BEAD_MAX_RANK,
  BEAD_RANKS,
  BEAD_RANK_INFO,
  calcMasterworkBead,
} from "@/lib/data/calculators/masterwork-bead";
import { formatNum } from "@/lib/format";

// 입력은 문자열로 들고 있다가 계산 직전에 숫자로 바꾼다.
// 그래야 사용자가 값을 지웠을 때 0이 강제로 남지 않는다.
type RankInputs = Record<number, string>;

const EMPTY_INPUTS: RankInputs = Object.fromEntries(
  BEAD_RANKS.map((r) => [r, ""])
);

function toNum(v: string): number {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function MasterworkBeadCalc() {
  const { lang } = useCalcLang();
  const t = calcDict[lang];
  const tx = t.masterworkBead;
  const n = (v: number) => formatNum(v, lang);

  const [owned, setOwned] = useState("");
  const [target, setTarget] = useState(5);
  const [resets, setResets] = useState<RankInputs>(EMPTY_INPUTS);

  const result = useMemo(() => {
    const resetCounts: Record<number, number> = {};
    for (const r of BEAD_RANKS) resetCounts[r] = toNum(resets[r] ?? "");
    return calcMasterworkBead({ owned: toNum(owned), resetCounts, target });
  }, [owned, resets, target]);

  const hasInput = result.total > 0;
  const isShort = hasInput && result.count === 0;

  const reset = () => {
    setOwned("");
    setResets(EMPTY_INPUTS);
    setTarget(5);
  };

  return (
    <div className="space-y-4">
      {/* ── 입력 ── */}
      <div className="bg-card rounded-2xl border border-app shadow-soft p-5 md:p-6 space-y-5">
        <label className="block">
          <span className="flex items-center gap-1.5 text-sm font-bold">
            <Image
              src={MASTERWORK_BEAD_IMAGE}
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
            placeholder={t.ui.ownedPlaceholder}
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-app bg-app text-base tabular-nums focus:outline-none focus:border-palmon-primary"
          />
        </label>

        {/* 목표 성급 */}
        <div>
          <span className="text-sm font-bold">{tx.targetRank}</span>
          <div className="mt-1.5 grid grid-cols-3 sm:grid-cols-5 gap-2">
            {BEAD_RANKS.map((r) => {
              const info = BEAD_RANK_INFO[r];
              const active = target === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTarget(r)}
                  className={`flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2 transition-all ${
                    active
                      ? "bg-gradient-palmon text-white border-palmon-primary shadow-soft"
                      : "bg-muted border-app text-fg-muted hover:border-palmon-primary/50"
                  }`}
                >
                  <StarRankBadge rank={r} max={BEAD_MAX_RANK} size={9} />
                  <div className="text-sm font-bold">{tx.rankLabel(r)}</div>
                  <div
                    className={`text-[11px] tabular-nums ${active ? "text-white/80" : "text-fg-subtle"}`}
                  >
                    {n(info.cumulativeCost)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 초기화 환급 */}
        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold">{tx.resetSectionLabel}</span>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-app text-fg-muted hover:bg-muted transition-colors"
            >
              <RotateCcw size={13} />
              {t.ui.resetAll}
            </button>
          </div>
          <p className="text-xs text-fg-muted mt-1 leading-relaxed">
            {tx.resetHint}
          </p>
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-2">
            {BEAD_RANKS.map((r) => (
              <label key={r} className="block">
                <span className="text-[11px] text-fg-subtle">
                  {tx.resetPerUnit(r, n(BEAD_RANK_INFO[r].cumulativeCost))}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={resets[r] ?? ""}
                  onChange={(e) =>
                    setResets((prev) => ({ ...prev, [r]: e.target.value }))
                  }
                  placeholder="0"
                  className="mt-1 w-full px-2 py-2 rounded-lg border border-app bg-app text-sm tabular-nums focus:outline-none focus:border-palmon-primary"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ── 결과 ── */}
      <div
        className={`rounded-2xl border-2 shadow-soft p-5 md:p-6 transition-colors ${
          !hasInput
            ? "border-app bg-card"
            : isShort
              ? "border-red-500/40 bg-red-500/5 dark:bg-red-500/10"
              : "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10"
        }`}
      >
        {!hasInput ? (
          <p className="text-sm text-fg-muted py-4 text-center">
            {t.ui.emptyHint}
          </p>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3 py-2">
              <Image
                src={MASTERWORK_BEAD_IMAGE}
                alt=""
                width={48}
                height={48}
                aria-hidden
                className="w-12 h-12 object-contain rounded-lg shrink-0"
              />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-fg-muted mb-0.5">
                  <StarRankBadge rank={target} max={BEAD_MAX_RANK} size={12} />
                  {t.ui.targetBasis(tx.rankLabel(target))}
                </div>
                {isShort ? (
                  <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 tabular-nums">
                    {t.ui.shortBig(n(result.shortage))}
                  </div>
                ) : (
                  <div className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {n(result.count)}
                    {tx.countUnit && (
                      <span className="text-xl md:text-2xl ml-1">
                        {tx.countUnit}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-card/70 border border-app divide-y divide-app text-sm">
              <ResultRow label={t.ui.owned} value={n(toNum(owned))} />
              {result.refundRows.map((r) => (
                <ResultRow
                  key={r.rank}
                  label={t.ui.refundRow(tx.rankLabel(r.rank))}
                  value={t.ui.refundCalc(
                    n(r.count),
                    tx.countUnit,
                    n(r.unitRefund),
                    n(r.subtotal)
                  )}
                  tone="accent"
                />
              ))}
              <ResultRow
                label={t.ui.usableTotal}
                value={n(result.total)}
                bold
              />
              <ResultRow
                label={tx.needPerOne(target)}
                value={n(result.perOne)}
              />
              {isShort ? (
                <ResultRow
                  label={t.ui.shortLabel}
                  value={n(result.shortage)}
                  tone="danger"
                  bold
                />
              ) : (
                <ResultRow
                  label={t.ui.leftOver}
                  value={n(result.remain)}
                  tone="accent"
                />
              )}
              <ResultRow
                label={t.ui.toNext}
                value={t.ui.toNextValue(n(result.toNext))}
              />
            </div>

            {/* 남은 구슬 활용 */}
            {result.alternatives.length > 0 && (
              <div className="mt-3 rounded-xl bg-muted p-3 text-xs text-fg-muted leading-relaxed">
                💡 {t.ui.leftoverHint(n(result.remain))} —{" "}
                {result.alternatives.map((a, i) => (
                  <span key={a.rank}>
                    {i > 0 && " / "}
                    {tx.rankLabel(a.rank)}{" "}
                    <b className="text-fg">
                      {n(a.count)}
                      {tx.countUnit}
                    </b>
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
