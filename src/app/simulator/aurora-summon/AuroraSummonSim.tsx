"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { RotateCcw, Sparkles, X } from "lucide-react";
import {
  AURORA_ORB_IMAGE,
  INTIMACY_GOAL,
  SUMMON_DROPS,
  expectedPullsToCeiling,
  pull,
  type DropTone,
  type PullOutcome,
  type SummonMode,
} from "@/lib/data/simulators/aurora-summon";
import { palmons, seasonStyles, elementStyles } from "@/lib/data/palmons";
import { useCalcLang } from "@/components/calculator/CalcLangProvider";
import { simulatorDict, type SimulatorDict } from "@/lib/i18n/simulator";
import { palmonName, elementName } from "@/lib/i18n/palmon-names";
import { submitRecord } from "@/lib/supabase/summon-records";
import { SummonRanking } from "./SummonRanking";
import { formatExact } from "@/lib/format";

// 게임과 같은 흐름으로 굴린다.
// 1회 / 10회 버튼을 누를 때마다 그 자리에서 결과가 나오고, 친밀도와 누적 통계가 함께 갱신된다.
//
// 신화 팰몬이 나오면 그 자리에서 배치를 끊고 팝업으로 다음 행동을 묻는다.
// 자동으로 오로라 정수 모드로 넘기지 않는다 — 대부분 신화 팰몬을 계속 노리기 때문이다.
// 팝업에서 [다시뽑기] / [오로라정수 뽑기] / [확인] 중에 고른다.

/** 소환으로 노릴 수 있는 팰몬. 지금은 시즌 1 신화만 다룬다. */
const TARGET_POOL = palmons.filter((p) => p.grade === "신화" && p.season === 1);

interface Tally {
  id: string;
  /** 번역 조회용 원본 드랍 id */
  dropId: string;
  label: string;
  emoji: string;
  tone: DropTone;
  hits: number;
  qty: number;
}

interface MythicInfo {
  atPull: number;
  by: "direct" | "ceiling";
  palmonId: string;
}

const TONE_CARD: Record<DropTone, string> = {
  mythic:
    "border-amber-400 bg-gradient-to-br from-amber-300/40 to-orange-400/30 dark:from-amber-400/30 dark:to-orange-500/25",
  aurora: "border-violet-400/60 bg-violet-400/15 dark:bg-violet-400/20",
  shard: "border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/15",
  normal: "border-app bg-muted",
};

const TONE_TEXT: Record<DropTone, string> = {
  mythic: "text-amber-700 dark:text-amber-300",
  aurora: "text-violet-700 dark:text-violet-300",
  shard: "text-amber-700 dark:text-amber-300",
  normal: "text-fg-muted",
};

export function AuroraSummonSim() {
  const { lang } = useCalcLang();
  const t = simulatorDict[lang].auroraSummon;
  const pname = (koName: string) => palmonName(koName, lang);
  const fx = (v: number) => formatExact(v, lang);

  const [targetId, setTargetId] = useState(TARGET_POOL[0]?.id ?? "");
  const [mode, setMode] = useState<SummonMode>("noMythic");
  const [intimacy, setIntimacy] = useState(0);
  const [pulls, setPulls] = useState(0);
  const [lastBatch, setLastBatch] = useState<PullOutcome[]>([]);
  const [tally, setTally] = useState<Record<string, Tally>>({});
  const [mythic, setMythic] = useState<MythicInfo | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  // 등록에 성공하면 올려서 랭킹 목록을 다시 불러오게 한다.
  const [rankingVersion, setRankingVersion] = useState(0);

  const target = useMemo(
    () => TARGET_POOL.find((p) => p.id === targetId) ?? TARGET_POOL[0],
    [targetId]
  );

  // 드랍 이름은 대상 팰몬에 따라 달라진다.
  // 신화 칸은 팰몬 이름 그 자체이고, 조각은 게임처럼 "<팰몬 이름> Token" 형태다.
  const dropName = (dropId: string, fallback: string) => {
    const targetName = target ? pname(target.name) : "";
    if (dropId === "mythic") return targetName || (t.dropLabels.mythic ?? fallback);
    if (dropId.startsWith("shard")) return t.shardLabel(targetName);
    return t.dropLabels[dropId] ?? fallback;
  };
  const wonPalmon = useMemo(
    () => (mythic ? TARGET_POOL.find((p) => p.id === mythic.palmonId) : null),
    [mythic]
  );

  // 팝업은 Esc로도 닫는다.
  useEffect(() => {
    if (!popupOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopupOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [popupOpen]);

  const runBatch = (count: number) => {
    // 직전에 신화를 뽑았다면 화면에 남아 있던 획득 표시를 지우고 새 판으로 시작한다.
    if (mythic) setMythic(null);

    // 배치 안에서도 친밀도가 바뀔 수 있어 지역 변수로 굴린다.
    const curMode = mode;
    let curIntimacy = intimacy;
    let curPulls = pulls;
    let newMythic: MythicInfo | null = null;

    const batch: PullOutcome[] = [];
    const nextTally = { ...tally };

    for (let i = 0; i < count; i++) {
      const outcome = pull(curMode, curIntimacy);
      curPulls += 1;
      curIntimacy = outcome.intimacy;
      batch.push(outcome);

      const key = `${outcome.drop.id}-${outcome.drop.qty}`;
      const prev = nextTally[key];
      nextTally[key] = {
        id: key,
        dropId: outcome.drop.id,
        label: outcome.drop.label,
        emoji: outcome.drop.emoji,
        tone: outcome.drop.tone,
        hits: (prev?.hits ?? 0) + 1,
        qty: (prev?.qty ?? 0) + outcome.drop.qty,
      };

      if (outcome.gotMythic) {
        newMythic = {
          atPull: curPulls,
          by: outcome.gotBy ?? "direct",
          palmonId: target?.id ?? "",
        };
        // 여기서 배치를 끊고 다음 행동을 사용자에게 묻는다.
        // 자동으로 오로라 정수 모드로 넘기지 않는다 — 대부분 신화 팰몬을 계속 노리기 때문이다.
        break;
      }
    }

    if (newMythic) {
      // 뽑았으면 판이 끝난 것이다. 소환 횟수·친밀도·누적 집계를 모두 비워
      // 다음 사냥이 1회부터 다시 세지도록 한다. 획득 정보는 팝업이 따로 들고 있다.
      setIntimacy(0);
      setPulls(0);
      setTally({});
      setLastBatch([]);
      setMythic(newMythic);
      setPopupOpen(true);
      return;
    }

    setIntimacy(curIntimacy);
    setPulls(curPulls);
    setLastBatch(batch);
    setTally(nextTally);
  };

  /** 친밀도만 0으로. 누적 통계와 소환 횟수는 그대로 둔다. */
  const resetIntimacy = () => setIntimacy(0);

  const clearRun = (nextMode: SummonMode) => {
    setMode(nextMode);
    setIntimacy(0);
    setPulls(0);
    setLastBatch([]);
    setTally({});
    setMythic(null);
    setPopupOpen(false);
  };

  const rows = useMemo(
    () =>
      Object.values(tally).sort((a, b) => {
        const order: DropTone[] = ["mythic", "aurora", "shard", "normal"];
        const d = order.indexOf(a.tone) - order.indexOf(b.tone);
        return d !== 0 ? d : b.hits - a.hits;
      }),
    [tally]
  );

  const showIntimacy = mode === "noMythic" || mythic !== null;
  const progress = Math.min(100, (intimacy / INTIMACY_GOAL) * 100);
  const remainPulls = expectedPullsToCeiling(intimacy);

  return (
    <div className="space-y-4">
      {/* ── 목표 팰몬 ── */}
      {mode === "noMythic" && target && (
        <div className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5">
          <span className="text-sm font-bold">{t.targetTitle}</span>
          <p className="text-xs text-fg-muted mt-1 leading-relaxed">
            {t.targetHint}
          </p>
          <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TARGET_POOL.map((p) => {
              const active = p.id === targetId;
              const es = elementStyles[p.element];
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setTargetId(p.id)}
                  className={`rounded-xl border p-2 transition-all ${
                    active
                      ? "border-palmon-primary bg-palmon-primary/10 ring-2 ring-palmon-primary/40"
                      : "border-app bg-muted hover:border-palmon-primary/50"
                  }`}
                >
                  <div className="aspect-square rounded-lg bg-card/60 flex items-center justify-center overflow-hidden">
                    {p.imagePath && (
                      <Image
                        src={p.imagePath}
                        alt={p.name}
                        width={200}
                        height={200}
                        className="object-contain w-full h-full"
                      />
                    )}
                  </div>
                  <div className="text-xs font-bold mt-1 truncate">
                    {pname(p.name)}
                  </div>
                  <div className="text-[10px] text-fg-subtle">
                    {es.emoji} {elementName(p.element, lang)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 모드 선택 ── */}
      <div className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5">
        <span className="text-sm font-bold">{t.ownershipTitle}</span>
        <p className="text-xs text-fg-muted mt-1 leading-relaxed">
          {t.ownershipHint}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(
            [
              ["noMythic", ...t.modeNoMythic],
              ["hasMythic", ...t.modeHasMythic],
            ] as const
          ).map(([value, label, desc]) => {
            const active = mode === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => clearRun(value)}
                className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                  active
                    ? "bg-gradient-palmon text-white border-palmon-primary shadow-soft"
                    : "bg-muted border-app text-fg-muted hover:border-palmon-primary/50"
                }`}
              >
                <div className="text-sm font-bold">{label}</div>
                <div
                  className={`text-[11px] ${active ? "text-white/80" : "text-fg-subtle"}`}
                >
                  {desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 소환 화면 ── */}
      <div className="rounded-2xl border-2 border-app bg-card shadow-soft overflow-hidden">
        <div className="relative bg-gradient-to-b from-palmon-primary/15 to-transparent p-5 md:p-6 text-center">
          {mythic && wonPalmon ? (
            <div className="py-2">
              <button
                type="button"
                onClick={() => setPopupOpen(true)}
                className="block mx-auto"
                aria-label={t.zoomLabel(pname(wonPalmon.name))}
              >
                {wonPalmon.imagePath && (
                  <Image
                    src={wonPalmon.imagePath}
                    alt={wonPalmon.name}
                    width={256}
                    height={256}
                    className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto drop-shadow-lg"
                  />
                )}
              </button>
              <div className="text-lg md:text-xl font-bold text-amber-600 dark:text-amber-300 mt-1">
                {t.obtainedTitle(pname(wonPalmon.name))}
              </div>
              <p className="text-xs text-fg-muted mt-1.5 leading-relaxed">
                {mythic.by === "direct"
                  ? t.byDirect(fx(mythic.atPull))
                  : t.byPity(
                      fx(INTIMACY_GOAL),
                      fx(mythic.atPull)
                    )}
                <br />
                {t.afterNote}
              </p>
            </div>
          ) : (
            <div className="py-2">
              <Image
                src={AURORA_ORB_IMAGE}
                alt={t.orbName}
                width={96}
                height={96}
                className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-2xl mx-auto"
                priority
              />
              <p className="text-xs text-fg-muted mt-2.5 leading-relaxed max-w-sm mx-auto">
                {mode === "noMythic" ? t.noticeNoMythic : t.noticeHasMythic}
              </p>
            </div>
          )}
        </div>

        {/* 친밀도 게이지 */}
        {showIntimacy && (
          <div className="px-5 md:px-6 pb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold flex items-center gap-1">
                <Sparkles size={12} className="text-palmon-accent" aria-hidden />
                {t.heart}
              </span>
              <span className="tabular-nums text-fg-muted">
                {fx(intimacy)} / {fx(INTIMACY_GOAL)}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-palmon transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between gap-2 mt-1.5">
              <p className="text-[11px] text-fg-subtle">
                {intimacy >= INTIMACY_GOAL
                  ? t.pityPassed
                  : t.pityRemain(fx(remainPulls))}
              </p>
              {/* 누적 통계는 남기고 친밀도만 0으로 돌린다. 천장 구간을 다시 체험해볼 때 쓴다. */}
              <button
                type="button"
                onClick={resetIntimacy}
                disabled={intimacy === 0}
                className="shrink-0 inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border border-app text-fg-muted hover:bg-muted transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <RotateCcw size={11} />
                {t.heartResetBtn}
              </button>
            </div>
          </div>
        )}

        {/* 소환 버튼 */}
        <div className="px-5 md:px-6 pb-5 grid grid-cols-2 gap-2 md:gap-3">
          <SummonButton
            label={t.summonBtn(1)}
            count={1}
            onClick={() => runBatch(1)}
          />
          <SummonButton
            label={t.summonBtn(10)}
            count={10}
            onClick={() => runBatch(10)}
          />
        </div>
      </div>

      {/* ── 이번 결과 ── */}
      {lastBatch.length > 0 && (
        <div className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <span className="text-sm font-bold">
              {t.thisBatch(lastBatch.length)}
            </span>
            <button
              type="button"
              onClick={() => clearRun("noMythic")}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-app text-fg-muted hover:bg-muted transition-colors"
            >
              <RotateCcw size={13} />
              {t.restartBtn}
            </button>
          </div>
          <div className="grid grid-cols-5 gap-1.5 md:gap-2">
            {lastBatch.map((o, i) => (
              <div
                key={i}
                className={`rounded-xl border p-2 text-center ${TONE_CARD[o.drop.tone]}`}
              >
                {o.drop.isMythic && target?.imagePath ? (
                  <Image
                    src={target.imagePath}
                    alt={target.name}
                    width={64}
                    height={64}
                    className="w-8 h-8 object-contain mx-auto"
                  />
                ) : (
                  <div className="text-lg leading-none h-8 flex items-center justify-center">
                    {o.drop.emoji}
                  </div>
                )}
                <div
                  className={`text-[10px] mt-1 leading-tight break-keep ${TONE_TEXT[o.drop.tone]}`}
                >
                  {dropName(o.drop.id, o.drop.label)}
                </div>
                <div className="text-[10px] font-bold tabular-nums">
                  ×{o.drop.qty}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 누적 결과 ── */}
      {pulls > 0 && (
        <div className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-sm font-bold">{t.totalTitle}</span>
            <span className="text-xs text-fg-muted tabular-nums">
              {t.totalSummary(fx(pulls))}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-app text-fg-subtle text-xs">
                  <th className="text-left py-2 px-2 font-normal">{t.colItem}</th>
                  <th className="text-right py-2 px-2 font-normal">{t.colHits}</th>
                  <th className="text-right py-2 px-2 font-normal">{t.colGained}</th>
                  <th className="text-right py-2 px-2 font-normal">{t.colActualRate}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-app/50 last:border-0">
                    <td className="py-2 px-2">
                      <span
                        className={`flex items-center gap-1.5 ${TONE_TEXT[r.tone]}`}
                      >
                        <span>{r.emoji}</span>
                        <span className="whitespace-nowrap">
                          {dropName(r.dropId, r.label)}
                          {r.qty / r.hits !== 1 && (
                            <span className="text-fg-subtle"> ×{r.qty / r.hits}</span>
                          )}
                        </span>
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums text-fg-muted">
                      {fx(r.hits)}
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums font-bold">
                      {fx(r.qty)}
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums text-fg-subtle">
                      {((r.hits / pulls) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 랭킹 ── */}
      <SummonRanking version={rankingVersion} />

      {/* ── 확률표 ── */}
      <div className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5">
        <span className="text-sm font-bold">
          {t.ratesTitle(
            mode === "noMythic" ? t.modeNoMythic[0] : t.modeHasMythic[0]
          )}
        </span>
        <div className="mt-2.5 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-app text-fg-subtle text-xs">
                <th className="text-left py-2 px-2 font-normal">{t.colItem}</th>
                <th className="text-right py-2 px-2 font-normal">{t.colRate}</th>
                {mode === "noMythic" && (
                  <th className="text-right py-2 px-2 font-normal">{t.colHeart}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {SUMMON_DROPS[mode].map((d) => (
                <tr
                  key={`${d.id}-${d.qty}`}
                  className="border-b border-app/50 last:border-0"
                >
                  <td className="py-2 px-2">
                    <span
                      className={`flex items-center gap-1.5 ${TONE_TEXT[d.tone]}`}
                    >
                      <span>{d.emoji}</span>
                      <span className="whitespace-nowrap">
                        {dropName(d.id, d.label)}
                        {d.qty > 1 && (
                          <span className="text-fg-subtle"> ×{d.qty}</span>
                        )}
                      </span>
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right tabular-nums font-bold text-palmon-primary">
                    {d.pct}%
                  </td>
                  {mode === "noMythic" && (
                    <td className="py-2 px-2 text-right tabular-nums text-fg-muted">
                      {d.isMythic ? "—" : `+${d.intimacy ?? 0}`}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 획득 팝업 ── */}
      {popupOpen && mythic && wonPalmon && (
        <MythicPopup
          palmon={wonPalmon}
          displayName={pname(wonPalmon.name)}
          elementLabel={elementName(wonPalmon.element, lang)}
          fx={fx}
          seasonLabel={
            wonPalmon.season
              ? lang === "ko"
                ? seasonStyles[wonPalmon.season].label
                : `Season ${wonPalmon.season}`
              : null
          }
          info={mythic}
          t={t}
          onClose={() => setPopupOpen(false)}
          onRestart={() => clearRun("noMythic")}
          onSwitchToEssence={() => clearRun("hasMythic")}
          onSubmitted={() => setRankingVersion((v) => v + 1)}
        />
      )}
    </div>
  );
}

function MythicPopup({
  palmon,
  displayName,
  elementLabel,
  seasonLabel,
  fx,
  info,
  t,
  onClose,
  onRestart,
  onSwitchToEssence,
  onSubmitted,
}: {
  palmon: (typeof TARGET_POOL)[number];
  displayName: string;
  elementLabel: string;
  seasonLabel: string | null;
  fx: (v: number) => string;
  info: MythicInfo;
  t: SimulatorDict["auroraSummon"];
  onClose: () => void;
  onRestart: () => void;
  onSwitchToEssence: () => void;
  onSubmitted: () => void;
}) {
  const ss = palmon.season ? seasonStyles[palmon.season] : null;
  const es = elementStyles[palmon.element];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t.obtainedTitle(displayName)}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border-2 border-amber-400 bg-card p-6 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.closeLabel}
          className="absolute right-3 top-3 p-1.5 rounded-lg text-fg-subtle hover:bg-muted"
        >
          <X size={18} />
        </button>

        <div className="text-xs font-bold tracking-wider text-amber-600 dark:text-amber-300">
          {t.popupBadge}
        </div>

        <div className="my-3 rounded-2xl bg-gradient-to-br from-amber-300/30 to-orange-400/20 dark:from-amber-400/20 dark:to-orange-500/15 p-3">
          {palmon.imagePath && (
            <Image
              src={palmon.imagePath}
              alt={displayName}
              width={416}
              height={416}
              className="w-40 h-40 md:w-52 md:h-52 object-contain mx-auto drop-shadow-xl"
              priority
            />
          )}
        </div>

        <h3 className="text-2xl font-bold">{displayName}</h3>
        <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full border ${es.badge}`}
          >
            {es.emoji} {elementLabel}
          </span>
          {ss && (
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full border font-bold ${ss.badge}`}
            >
              {ss.emoji} {seasonLabel}
            </span>
          )}
        </div>

        <p className="text-sm text-fg-muted mt-3 leading-relaxed">
          {info.by === "direct"
            ? t.byDirect(fx(info.atPull))
            : t.byPity(
                fx(INTIMACY_GOAL),
                fx(info.atPull)
              )}
        </p>

        <RankingForm
          palmonId={palmon.id}
          info={info}
          t={t}
          onSubmitted={onSubmitted}
        />

        {/* 다음 행동은 사용자가 고른다. 대부분 신화 팰몬을 계속 노리므로 자동 전환하지 않는다. */}
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onRestart}
              className="rounded-xl border border-app py-2 text-sm font-bold hover:bg-muted transition-colors"
            >
              {t.btnRestart}
            </button>
            <button
              type="button"
              onClick={onSwitchToEssence}
              className="rounded-xl border border-violet-400/60 text-violet-700 dark:text-violet-300 py-2 text-sm font-bold hover:bg-violet-400/10 transition-colors"
            >
              {t.btnEssence}
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-palmon text-white py-2 text-sm font-bold"
          >
            {t.btnConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummonButton({
  label,
  count,
  onClick,
}: {
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl bg-gradient-palmon text-white px-3 py-3 shadow-soft hover:brightness-110 active:scale-[0.98] transition-all"
    >
      <div className="text-base md:text-lg font-bold">{label}</div>
      <div className="flex items-center justify-center gap-1 mt-0.5">
        <Image
          src={AURORA_ORB_IMAGE}
          alt=""
          width={18}
          height={18}
          aria-hidden
          className="w-[18px] h-[18px] object-contain rounded"
        />
        <span className="text-xs tabular-nums text-white/90">×{count}</span>
      </div>
    </button>
  );
}

/**
 * 팝업 안의 랭킹 등록 폼.
 * 버튼이 늘어나 복잡해지지 않도록 평소엔 접어 두고, 누르면 서버·닉네임 입력이 펼쳐진다.
 * 한 기록당 한 번만 등록할 수 있다.
 */
function RankingForm({
  palmonId,
  info,
  t,
  onSubmitted,
}: {
  palmonId: string;
  info: MythicInfo;
  t: SimulatorDict["auroraSummon"];
  onSubmitted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [server, setServer] = useState("");
  const [nickname, setNickname] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [rank, setRank] = useState(0);
  const [error, setError] = useState("");

  const canSubmit =
    /^[0-9]{1,6}$/.test(server.trim()) &&
    nickname.trim().length > 0 &&
    state !== "sending";

  const send = async () => {
    setState("sending");
    setError("");
    const res = await submitRecord({
      pulls: info.atPull,
      gotBy: info.by,
      palmonId,
      nickname: nickname.trim(),
      server: server.trim(),
    });
    if (res.ok) {
      setRank(res.rank);
      setState("done");
      onSubmitted();
    } else {
      setError(res.message || t.submitFailed);
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        {t.submitted(String(rank))}
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 w-full rounded-xl border border-amber-400/60 py-2 text-sm font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-400/10 transition-colors"
      >
        {t.registerBtn}
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-amber-400/60 bg-amber-400/5 p-3 space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={server}
          onChange={(e) => setServer(e.target.value)}
          placeholder={t.serverPlaceholder}
          maxLength={6}
          className="w-20 shrink-0 px-2 py-2 rounded-lg border border-app bg-app text-sm tabular-nums focus:outline-none focus:border-palmon-primary"
        />
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={t.nicknamePlaceholder}
          maxLength={20}
          className="flex-1 min-w-0 px-2 py-2 rounded-lg border border-app bg-app text-sm focus:outline-none focus:border-palmon-primary"
        />
        <button
          type="button"
          onClick={send}
          disabled={!canSubmit}
          className="shrink-0 px-3 rounded-lg bg-gradient-palmon text-white text-sm font-bold disabled:opacity-40"
        >
          {state === "sending" ? t.submitting : t.submitBtn}
        </button>
      </div>
      {state === "error" && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
