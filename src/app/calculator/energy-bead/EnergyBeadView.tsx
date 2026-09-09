"use client";

import Image from "next/image";
import Link from "next/link";
import { Sigma, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { Section } from "@/components/Section";
import {
  EvolutionStageBadge,
  TONE_COLORS,
} from "@/components/EvolutionStageBadge";
import { useCalcLang } from "@/components/calculator/CalcLangProvider";
import { calcDict, type CalcDict } from "@/lib/i18n/calculator";
import { formatNum } from "@/lib/format";
import {
  ENERGY_BEAD_IMAGE,
  ENERGY_EVO_GROUPS,
  ENERGY_MEGA_GROUPS,
  ENERGY_EVO_TOTAL,
  ENERGY_MEGA_TOTAL,
  ENERGY_TOTAL,
  ENERGY_UPGRADES_PER_STEP,
  energyBeadMeta,
  type EnergyGroupInfo,
} from "@/lib/data/calculators/energy-bead";
import { EnergyBeadCalc } from "./EnergyBeadCalc";

const BADGE_SIZE = 28;

export function EnergyBeadView() {
  const { lang } = useCalcLang();
  const t = calcDict[lang];
  const tx = t.energyBead;
  const n = (v: number) => formatNum(v, lang);

  const bullets = [
    tx.bullets.substep,
    tx.bullets.upgrades(ENERGY_UPGRADES_PER_STEP),
    tx.bullets.separate,
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={tx.title}
        description={tx.description}
        meta={
          <>
            {t.ui.lastUpdated}: {energyBeadMeta.updatedAt} ·{" "}
            <SourceBadge name={energyBeadMeta.updatedBy} />
          </>
        }
      />

      <Section emoji="📐" title={t.ui.howTo}>
        <div className="space-y-4">
          {/* 아이템 소개 */}
          <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
            <Image
              src={ENERGY_BEAD_IMAGE}
              alt={tx.item.name}
              width={72}
              height={72}
              className="w-16 h-16 md:w-[72px] md:h-[72px] object-contain rounded-xl shrink-0"
              priority
            />
            <div className="min-w-0">
              <div className="font-bold">{tx.item.name}</div>
              <p className="text-sm text-fg-muted mt-0.5 leading-relaxed">
                {tx.item.desc}
              </p>
            </div>
          </div>

          {/* 단계별 필요량 — 진화 / 메가진화 / 전체 세 덩어리로 묶어서 보여준다 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-app text-fg-subtle text-xs">
                  <th className="text-left py-2 px-2 font-normal">
                    {tx.stageHeader}
                  </th>
                  <th className="text-right py-2 px-2 font-normal">
                    {tx.stepCountHeader}
                  </th>
                  <th className="text-right py-2 px-2 font-normal">
                    {tx.needHeader}
                  </th>
                </tr>
              </thead>

              <tbody className="border-b-2 border-app">
                {ENERGY_EVO_GROUPS.map((g) => (
                  <GroupRow key={g.key} group={g} tx={tx} n={n} />
                ))}
                <TotalRow label={tx.evoTotal} value={n(ENERGY_EVO_TOTAL)} />
              </tbody>

              <tbody className="border-b-2 border-app">
                {ENERGY_MEGA_GROUPS.map((g) => (
                  <GroupRow key={g.key} group={g} tx={tx} n={n} />
                ))}
                <TotalRow label={tx.megaTotal} value={n(ENERGY_MEGA_TOTAL)} />
              </tbody>

              <tbody>
                <TotalRow label={tx.grandTotal} value={n(ENERGY_TOTAL)} grand />
              </tbody>
            </table>
          </div>

          {/* 짧은 보충 */}
          <ul className="text-xs text-fg-muted space-y-1.5 leading-relaxed">
            {bullets.map(([head, body]) => (
              <li key={head}>
                <b className="text-fg">{head}</b> — {body}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section emoji="🧮" title={t.ui.calculator}>
        <EnergyBeadCalc />
      </Section>

      <div className="rounded-xl bg-muted p-4 text-xs text-fg-muted leading-relaxed">
        📌 {t.ui.disclaimer}{" "}
        <Link href="/contact" className="text-palmon-primary hover:underline">
          {t.ui.contact}
        </Link>
        {t.ui.disclaimerTail}
      </div>
    </div>
  );
}

/** 단계 한 줄. 진화는 금색 표창, 메가진화는 붉은 표창, 스킬해금은 별 아이콘. */
function GroupRow({
  group,
  tx,
  n,
}: {
  group: EnergyGroupInfo;
  tx: CalcDict["energyBead"];
  n: (v: number) => string;
}) {
  const label = tx.groupLabels[group.label] ?? group.label;
  return (
    <tr className="border-b border-app/50">
      <td className="py-2 px-2">
        <span className="flex items-center gap-2">
          {group.bladeStage ? (
            <EvolutionStageBadge
              stage={group.bladeStage}
              size={BADGE_SIZE}
              tone={group.isMega ? "red" : "gold"}
              label={label}
            />
          ) : (
            <Sparkles
              size={BADGE_SIZE - 8}
              className="mx-1 shrink-0"
              style={{ color: TONE_COLORS.red.fill }}
              aria-hidden
            />
          )}
          <span className="whitespace-nowrap">{label}</span>
        </span>
      </td>
      <td className="py-2 px-2 text-right tabular-nums text-fg-muted">
        {group.steps}
      </td>
      <td className="py-2 px-2 text-right tabular-nums font-bold text-palmon-primary">
        {n(group.total)}
      </td>
    </tr>
  );
}

/** 합계 한 줄. grand는 전체 합계라 더 강조한다. */
function TotalRow({
  label,
  value,
  grand,
}: {
  label: string;
  value: string;
  grand?: boolean;
}) {
  return (
    <tr className={grand ? "bg-palmon-primary/10" : "bg-muted"}>
      <td className="py-2.5 px-2" colSpan={2}>
        <span className="flex items-center gap-2 font-bold">
          <Sigma
            size={BADGE_SIZE - 6}
            className="mx-0.5 shrink-0 text-fg-muted"
            aria-hidden
          />
          {label}
        </span>
      </td>
      <td
        className={`py-2.5 px-2 text-right tabular-nums font-bold ${
          grand ? "text-palmon-primary text-base" : ""
        }`}
      >
        {value}
      </td>
    </tr>
  );
}
