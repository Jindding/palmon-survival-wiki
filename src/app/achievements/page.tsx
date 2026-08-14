import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { Section } from "@/components/Section";
import {
  achievementsWhy,
  earlyRoute,
  followUpTips,
  specialNotes,
  achievementsMeta,
} from "@/lib/data/achievements";

export const metadata: Metadata = {
  title: "업적 가이드",
  description: "전투력 상승을 극대화하는 업적 우선순위 루트",
};

export default function AchievementsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        emoji="🏆"
        title="업적 가이드"
        description="업적은 전투력의 핵심. 우선순위와 요령을 정리했어요."
        meta={
          <>
            최종 업데이트: {achievementsMeta.updatedAt} · <SourceBadge name={achievementsMeta.updatedBy} />
          </>
        }
      />

      <Section emoji="💡" title="왜 업적이 중요한가">
        <p className="text-sm text-fg-muted leading-relaxed">{achievementsWhy}</p>
      </Section>

      <Section
        emoji="🚀"
        title="초반 우선순위 루트"
        description="업적 해제 후 이 순서로 올리세요."
      >
        <ol className="space-y-2">
          {earlyRoute.map((step) => (
            <li key={step.order} className="flex items-start gap-3 p-3 rounded-xl bg-muted">
              <div className="w-8 h-8 rounded-full bg-gradient-palmon text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step.order}
              </div>
              <div className="flex-1">
                <div className="text-sm">{step.name}</div>
                {step.note && (
                  <div className="text-xs text-fg-subtle mt-0.5">{step.note}</div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        emoji="📋"
        title="우선순위 루트 이후"
        description="이후에는 골고루 레벨을 올리는 편이 스트레스가 덜하고 효율적입니다."
      >
        <ul className="space-y-2">
          {followUpTips.map((tip, i) => (
            <li key={i} className="flex gap-3 p-3 rounded-xl bg-muted">
              <span className="text-palmon-secondary flex-shrink-0">▸</span>
              <span className="text-sm text-fg-muted">{tip}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section emoji="⚠️" title="조합별 특이사항">
        <div className="space-y-3">
          {specialNotes.map((n) => (
            <div
              key={n.title}
              className="p-4 rounded-xl border border-app bg-gradient-to-r from-palmon-accent/10 to-palmon-primary/10"
            >
              <div className="text-sm font-bold mb-1">{n.title}</div>
              <div className="text-sm text-fg-muted">{n.body}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
