import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { Section } from "@/components/Section";
import {
  currencyRates,
  dollarComparison,
  spendingPriority,
  spendingTips,
  spendingTiers,
  eventEfficiency,
  economyMeta,
} from "@/lib/data/economy";

export const metadata: Metadata = {
  title: "재화 · 과금 가이드",
  description: "팰몬 서바이벌 재화 환율표와 과금 우선순위 가이드",
};

const krw = new Intl.NumberFormat("ko-KR");

export default function EconomyPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        emoji="💰"
        title="재화 · 과금 가이드"
        description="초보자 필독. 재화의 실제 가치와 효율적인 과금 순서를 정리했어요."
        meta={
          <>
            최종 업데이트: {economyMeta.updatedAt} · <SourceBadge name={economyMeta.updatedBy} /> · {economyMeta.source}
          </>
        }
      />

      <Section emoji="🧮" title="아이템 환율표" description="1달러 기준 각 재화의 원화 환산 가치.">
        <div className="mb-3 p-3 rounded-xl bg-muted text-xs md:text-sm text-fg-muted">
          {dollarComparison}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-app text-left text-fg-subtle text-xs uppercase">
                <th className="py-2 px-3">재화</th>
                <th className="py-2 px-3 text-right">환율 (원)</th>
                <th className="py-2 px-3 text-center">우선순위</th>
              </tr>
            </thead>
            <tbody>
              {currencyRates.map((c) => (
                <tr key={c.name} className="border-b border-app/50">
                  <td className="py-2 px-3">{c.name}</td>
                  <td className="py-2 px-3 text-right tabular-nums">
                    ₩{krw.format(c.krw)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {c.priority ? (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-gradient-palmon text-white">
                        {c.priority}순위
                      </span>
                    ) : (
                      <span className="text-fg-subtle">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        emoji="🎯"
        title="끝없이 필요한 재화 우선순위"
        description="스펙업에 반복적으로 소모되는 재화 5종."
      >
        <ol className="grid sm:grid-cols-5 gap-2">
          {spendingPriority.map((s, i) => (
            <li
              key={s}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted text-center"
            >
              <span className="text-xs px-2 py-0.5 rounded-md bg-gradient-gold text-white font-bold">
                {i + 1}순위
              </span>
              <span className="text-sm mt-1">{s}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section emoji="📌" title="재화 사용 기초">
        <ul className="space-y-2">
          {spendingTips.map((t, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="text-fg-subtle flex-shrink-0">{i + 1}.</span>
              <span className="text-fg-muted">{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        emoji="💳"
        title="과금 정도별 시즌1 가이드"
        description="시즌1 진입 후 목표에 맞춰 구매할 패키지."
      >
        <div className="grid md:grid-cols-3 gap-3">
          {spendingTiers.map((t) => (
            <div
              key={t.level}
              className="p-4 rounded-xl bg-muted border border-app"
            >
              <div className="text-sm px-2 py-0.5 rounded-md bg-gradient-palmon text-white inline-block mb-2">
                {t.level}
              </div>
              <div className="text-sm text-fg-muted mb-3">{t.goal}</div>
              <ul className="space-y-1 text-sm">
                {t.packages.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-palmon-primary">✦</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        emoji="🎉"
        title="이벤트 효율 극대화"
        description="행운의 룰렛 · 블랙잭 핵심 요령."
      >
        <div className="grid md:grid-cols-2 gap-3">
          {eventEfficiency.map((e) => (
            <div
              key={e.name}
              className="p-4 rounded-xl bg-muted border border-app"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{e.emoji}</span>
                <h3 className="text-lg">{e.name}</h3>
              </div>
              <ul className="space-y-1.5 text-sm">
                {e.tips.map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-palmon-secondary">▸</span>
                    <span className="text-fg-muted">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
