import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { Section } from "@/components/Section";
import { equipmentGuide, equipmentMeta } from "@/lib/data/equipment";

export const metadata: Metadata = {
  title: "장비 업그레이드 가이드",
  description: "강화와 승급 순서, 역할별 장비 우선순위",
};

export default function EquipmentPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        emoji="⚔️"
        title="장비 업그레이드 가이드"
        description="한정된 자원으로 조합력을 극대화하려면 강화와 승급의 우선순위를 정확히 지켜야 합니다."
        meta={
          <>
            최종 업데이트: {equipmentMeta.updatedAt} · <SourceBadge name={equipmentMeta.updatedBy} />
          </>
        }
      />

      {equipmentGuide.map((sec) => (
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
