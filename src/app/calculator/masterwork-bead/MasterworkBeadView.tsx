"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { StarRankBadge } from "@/components/StarRankBadge";
import { useCalcLang } from "@/components/calculator/CalcLangProvider";
import { calcDict } from "@/lib/i18n/calculator";
import { formatNum } from "@/lib/format";
import {
  MASTERWORK_BEAD_IMAGE,
  BEAD_MAX_RANK,
  BEAD_PER_WEAPON,
  BEAD_RANKS,
  BEAD_RANK_INFO,
  masterworkBeadMeta,
} from "@/lib/data/calculators/masterwork-bead";
import { MasterworkBeadCalc } from "./MasterworkBeadCalc";

export function MasterworkBeadView() {
  const { lang } = useCalcLang();
  const t = calcDict[lang];
  const tx = t.masterworkBead;
  const n = (v: number) => formatNum(v, lang);

  const bullets = [
    tx.bullets.weapon(
      n(BEAD_PER_WEAPON),
      BEAD_MAX_RANK,
      n(BEAD_RANK_INFO[BEAD_MAX_RANK].cumulativeCost)
    ),
    tx.bullets.reset,
    tx.bullets.separate,
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={tx.title}
        description={tx.description}
        meta={
          <>
            {t.ui.lastUpdated}: {masterworkBeadMeta.updatedAt}
          </>
        }
      />

      <Section emoji="📐" title={t.ui.howTo}>
        <div className="space-y-4">
          {/* 아이템 소개 */}
          <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
            <Image
              src={MASTERWORK_BEAD_IMAGE}
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

          {/* 성급별 필요량 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-app text-fg-subtle text-xs">
                  <th className="text-left py-2 px-2 font-normal">
                    {t.rankTable.rankHeader}
                  </th>
                  <th className="text-right py-2 px-2 font-normal">
                    {t.rankTable.stepHeader}
                  </th>
                  <th className="text-right py-2 px-2 font-normal">
                    {t.rankTable.cumulativeHeader}
                  </th>
                </tr>
              </thead>
              <tbody>
                {BEAD_RANKS.map((r) => {
                  const info = BEAD_RANK_INFO[r];
                  return (
                    <tr key={r} className="border-b border-app/50 last:border-0">
                      <td className="py-2 px-2">
                        <span className="flex items-center gap-2">
                          <StarRankBadge rank={r} max={BEAD_MAX_RANK} />
                          <span className="whitespace-nowrap">
                            {tx.rankLabel(r)}
                          </span>
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right tabular-nums text-fg-muted">
                        +{n(info.stepCost)}
                      </td>
                      <td className="py-2 px-2 text-right tabular-nums font-bold text-palmon-primary">
                        {n(info.cumulativeCost)}
                      </td>
                    </tr>
                  );
                })}
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
        <MasterworkBeadCalc />
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
