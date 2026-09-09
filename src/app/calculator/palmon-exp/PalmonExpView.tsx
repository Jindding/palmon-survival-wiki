"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { Section } from "@/components/Section";
import { useCalcLang } from "@/components/calculator/CalcLangProvider";
import { calcDict } from "@/lib/i18n/calculator";
import { formatExact } from "@/lib/format";
import { sumLevelRange } from "@/lib/data/calculators/level-cost";
import {
  PALMON_EXP_IMAGE,
  EXP_PER_LEVEL,
  EXP_MAX_LEVEL,
  EXP_MILESTONES,
  palmonExpMeta,
} from "@/lib/data/calculators/palmon-exp";
import { MilestoneTable } from "../MilestoneTable";
import { LevelCostCalc } from "../LevelCostCalc";

export function PalmonExpView() {
  const { lang } = useCalcLang();
  const t = calcDict[lang];
  const tx = t.palmonExp;

  const fullTotal = formatExact(
    sumLevelRange(EXP_PER_LEVEL, 1, EXP_MAX_LEVEL),
    lang
  );
  const bullets = [
    tx.bullets.max(EXP_MAX_LEVEL, fullTotal),
    tx.bullets.sum,
    tx.bullets.box,
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={tx.title}
        description={tx.description}
        meta={
          <>
            {t.ui.lastUpdated}: {palmonExpMeta.updatedAt} ·{" "}
            <SourceBadge name={palmonExpMeta.updatedBy} />
          </>
        }
      />

      <Section emoji="📐" title={t.ui.howTo}>
        <div className="space-y-4">
          {/* 아이템 소개 */}
          <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
            <Image
              src={PALMON_EXP_IMAGE}
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

          {/* 대표 구간 누적 */}
          <MilestoneTable costs={EXP_PER_LEVEL} milestones={EXP_MILESTONES} />

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
        <LevelCostCalc
          costs={EXP_PER_LEVEL}
          maxLevel={EXP_MAX_LEVEL}
          image={PALMON_EXP_IMAGE}
          itemName={tx.itemShort}
          defaultTarget={EXP_MAX_LEVEL}
        />
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
