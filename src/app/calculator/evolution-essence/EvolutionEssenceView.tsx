"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { Section } from "@/components/Section";
import { EvolutionStageBadge } from "@/components/EvolutionStageBadge";
import { useCalcLang } from "@/components/calculator/CalcLangProvider";
import { calcDict } from "@/lib/i18n/calculator";
import { formatNum } from "@/lib/format";
import {
  EVO_STAGES,
  EVO_STAGE_INFO,
  EVO_ESSENCE_IMAGE,
  evolutionEssenceMeta,
} from "@/lib/data/calculators/evolution-essence";
import { EvolutionEssenceCalc } from "./EvolutionEssenceCalc";

// 언어 전환이 클라이언트 상태라 페이지 본문 전체가 클라이언트 컴포넌트다.
// page.tsx에는 metadata만 남긴다.

export function EvolutionEssenceView() {
  const { lang } = useCalcLang();
  const t = calcDict[lang];
  const tx = t.evolutionEssence;
  const n = (v: number) => formatNum(v, lang);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={tx.title}
        description={tx.description}
        meta={
          <>
            {t.ui.lastUpdated}: {evolutionEssenceMeta.updatedAt} ·{" "}
            <SourceBadge name={evolutionEssenceMeta.updatedBy} />
          </>
        }
      />

      <Section emoji="📐" title={t.ui.howTo}>
        <div className="space-y-4">
          {/* 아이템 소개 */}
          <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
            <Image
              src={EVO_ESSENCE_IMAGE}
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

          {/* 단계별 비용 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-app text-fg-subtle text-xs">
                  <th className="text-left py-2 px-2 font-normal">
                    {t.rankTable.stageHeader}
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
                {EVO_STAGES.map((s) => {
                  const info = EVO_STAGE_INFO[s];
                  return (
                    <tr key={s} className="border-b border-app/50 last:border-0">
                      <td className="py-2 px-2">
                        <span className="flex items-center gap-2">
                          <EvolutionStageBadge stage={s} size={32} />
                          <span className="whitespace-nowrap">
                            {tx.stageLabel(s)}
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
            {[tx.bullets.reset, tx.bullets.season, tx.bullets.mega].map(
              ([head, body]) => (
                <li key={head}>
                  <b className="text-fg">{head}</b> — {body}
                </li>
              )
            )}
          </ul>
        </div>
      </Section>

      <Section emoji="🧮" title={t.ui.calculator}>
        <EvolutionEssenceCalc />
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
