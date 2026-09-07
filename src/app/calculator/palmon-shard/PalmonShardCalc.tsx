"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { StarRankBadge } from "@/components/StarRankBadge";
import {
  PALMON_SHARD_IMAGE,
  STAR_RANKS,
  STAR_RANK_INFO,
  calcPalmonShard,
  type StarRank,
} from "@/lib/data/calculators/palmon-shard";
import { formatKrNum } from "@/lib/format";

// 입력은 문자열로 들고 있다가 계산 직전에 숫자로 바꾼다.
// 그래야 사용자가 값을 지웠을 때 0이 강제로 남지 않는다.
function toNum(v: string): number {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function PalmonShardCalc() {
  const [owned, setOwned] = useState("");
  const [target, setTarget] = useState<StarRank>(5);

  const result = useMemo(
    () => calcPalmonShard({ owned: toNum(owned), target }),
    [owned, target]
  );

  const hasInput = result.owned > 0;
  const isShort = hasInput && result.count === 0;

  return (
    <div className="space-y-4">
      {/* ── 입력 ── */}
      <div className="bg-card rounded-2xl border border-app shadow-soft p-5 md:p-6 space-y-5">
        <label className="block">
          <span className="flex items-center gap-1.5 text-sm font-bold">
            <Image
              src={PALMON_SHARD_IMAGE}
              alt=""
              width={20}
              height={20}
              aria-hidden
              className="w-5 h-5 object-contain rounded"
            />
            보유 UR 만능 팰몬조각
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={owned}
            onChange={(e) => setOwned(e.target.value)}
            placeholder="지금 가진 개수"
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-app bg-app text-base tabular-nums focus:outline-none focus:border-palmon-primary"
          />
        </label>

        {/* 목표 성급 */}
        <div>
          <span className="text-sm font-bold">🎯 목표 성급</span>
          <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-5 gap-2">
            {STAR_RANKS.map((r) => {
              const info = STAR_RANK_INFO[r];
              const active = target === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTarget(r)}
                  className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 transition-all ${
                    active
                      ? "bg-gradient-palmon text-white border-palmon-primary shadow-soft"
                      : "bg-muted border-app text-fg-muted hover:border-palmon-primary/50"
                  }`}
                >
                  <StarRankBadge rank={r} size={11} />
                  <div className="text-sm font-bold">{r}성</div>
                  <div
                    className={`text-[11px] tabular-nums ${active ? "text-white/80" : "text-fg-subtle"}`}
                  >
                    {formatKrNum(info.cumulativeCost)}개
                  </div>
                </button>
              );
            })}
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
            보유 개수를 입력하면 결과가 바로 나와요.
          </p>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3 py-2">
              <Image
                src={PALMON_SHARD_IMAGE}
                alt=""
                width={48}
                height={48}
                aria-hidden
                className="w-12 h-12 object-contain rounded-lg shrink-0"
              />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-fg-muted mb-0.5">
                  <StarRankBadge rank={target} size={11} />
                  {target}성 기준
                </div>
                {isShort ? (
                  <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 tabular-nums">
                    {formatKrNum(result.shortage)}개 부족
                  </div>
                ) : (
                  <div className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatKrNum(result.count)}
                    <span className="text-xl md:text-2xl ml-1">마리</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-card/70 border border-app divide-y divide-app text-sm">
              <Row label="보유" value={formatKrNum(result.owned)} />
              <Row
                label={`${target}성 1마리 필요`}
                value={formatKrNum(result.perOne)}
              />
              {isShort ? (
                <Row
                  label="모자란 양"
                  value={formatKrNum(result.shortage)}
                  tone="danger"
                  bold
                />
              ) : (
                <Row
                  label="승급 후 남는 양"
                  value={formatKrNum(result.remain)}
                  tone="accent"
                />
              )}
              <Row
                label="다음 1마리까지"
                value={`${formatKrNum(result.toNext)}개 더`}
              />
            </div>

            {/* 남은 조각 활용 */}
            {result.alternatives.length > 0 && (
              <div className="mt-3 rounded-xl bg-muted p-3 text-xs text-fg-muted leading-relaxed">
                💡 남은 <b>{formatKrNum(result.remain)}</b>개로 추가 완성 가능 —{" "}
                {result.alternatives.map((a, i) => (
                  <span key={a.rank}>
                    {i > 0 && " / "}
                    {a.rank}성 <b className="text-fg">{formatKrNum(a.count)}마리</b>
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
