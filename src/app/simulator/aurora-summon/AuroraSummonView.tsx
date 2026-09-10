"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { useCalcLang } from "@/components/calculator/CalcLangProvider";
import { simulatorDict } from "@/lib/i18n/simulator";
import { formatNum } from "@/lib/format";
import {
  AURORA_ORB_IMAGE,
  INTIMACY_GOAL,
  AVG_INTIMACY_PER_PULL,
  expectedPullsToCeiling,
  auroraSummonMeta,
} from "@/lib/data/simulators/aurora-summon";
import { AuroraSummonSim } from "./AuroraSummonSim";

// 언어 전환이 클라이언트 상태라 페이지 본문 전체가 클라이언트 컴포넌트다.
// page.tsx에는 metadata만 남긴다.

export function AuroraSummonView() {
  const { lang } = useCalcLang();
  const t = simulatorDict[lang].auroraSummon;
  const n = (v: number) => formatNum(v, lang);

  const bullets = [
    t.rules.chance,
    t.rules.pity(
      n(INTIMACY_GOAL),
      AVG_INTIMACY_PER_PULL.toFixed(2),
      n(expectedPullsToCeiling(0)),
      n(INTIMACY_GOAL)
    ),
    t.rules.once,
    t.rules.target,
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        emoji="🔮"
        title={t.title}
        description={t.description}
        meta={
          <>
            {t.lastUpdated}: {auroraSummonMeta.updatedAt}
          </>
        }
      />

      <Section emoji="📐" title={t.howTo}>
        <div className="space-y-4">
          {/* 아이템 소개 */}
          <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
            <Image
              src={AURORA_ORB_IMAGE}
              alt={t.orbName}
              width={144}
              height={144}
              className="w-16 h-16 md:w-[72px] md:h-[72px] object-contain rounded-xl shrink-0"
              priority
            />
            <div className="min-w-0">
              <div className="font-bold">{t.orbName}</div>
              <p className="text-sm text-fg-muted mt-0.5 leading-relaxed">
                {t.orbDesc}
              </p>
            </div>
          </div>

          {/* 핵심 규칙 */}
          <ul className="text-xs text-fg-muted space-y-1.5 leading-relaxed">
            {bullets.map(([head, body]) => (
              <li key={head}>
                <b className="text-fg">{head}</b> — {body}
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-dashed border-app p-3.5 text-xs text-fg-muted leading-relaxed">
            {t.disclaimerBox}
          </div>
        </div>
      </Section>

      <Section emoji="🔮" title={t.simulate}>
        <AuroraSummonSim />
      </Section>

      <div className="rounded-xl bg-muted p-4 text-xs text-fg-muted leading-relaxed">
        📌 {t.footNote}{" "}
        <Link href="/contact" className="text-palmon-primary hover:underline">
          {t.contact}
        </Link>
        {t.footNoteTail}
      </div>
    </div>
  );
}
