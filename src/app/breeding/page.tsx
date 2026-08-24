import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { Section } from "@/components/Section";
import { breedingGuide, breedingMeta } from "@/lib/data/breeding";

export const metadata: Metadata = {
  title: "번식 시스템 가이드",
  description:
    "부화장 · 특성 상속 · 속도 업 활용법까지, 팰몬 번식 시스템을 실전 중심으로 정리",
};

export default function BreedingPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        emoji="🥚"
        title="번식 시스템 가이드"
        description="원하는 특성을 자식 팰몬에게 물려주어 전투와 생산 효율을 극대화하는 방법을 정리합니다."
        meta={
          <>
            최종 업데이트: {breedingMeta.updatedAt} ·{" "}
            <SourceBadge name={breedingMeta.updatedBy} />
          </>
        }
      />

      {breedingGuide.map((sec) => (
        <Section
          key={sec.title}
          emoji={sec.emoji}
          title={sec.title}
          description={sec.intro}
        >
          <ul className="space-y-2">
            {sec.bullets.map((b, i) => (
              <li key={i} className="flex gap-3 p-3 rounded-xl bg-muted">
                <span className="text-palmon-primary flex-shrink-0">◆</span>
                <span className="text-sm text-fg-muted">{b}</span>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </div>
  );
}
