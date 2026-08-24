import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { Section } from "@/components/Section";
import { mountsGuide, mountsMeta } from "@/lib/data/mounts";

export const metadata: Metadata = {
  title: "탈것 시스템 가이드",
  description:
    "탈것 초기화 · 스킬 · 육성 우선순위 · 스킬 레벨 해금까지 정리한 실전 가이드",
};

export default function MountsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        emoji="🐎"
        title="탈것 시스템 가이드"
        description="탈것 초기화 사이클, 각 탈것의 스킬, 육성 순서를 실전 관점에서 정리합니다."
        meta={
          <>
            최종 업데이트: {mountsMeta.updatedAt} ·{" "}
            <SourceBadge name={mountsMeta.updatedBy} />
          </>
        }
      />

      {mountsGuide.map((sec) => (
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
