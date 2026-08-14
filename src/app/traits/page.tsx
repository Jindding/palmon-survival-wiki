import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { traitCategories, traitGuideMeta, type TraitTier } from "@/lib/traits-data";

export const metadata: Metadata = {
  title: "특성 가이드",
  description: "팰몬 유형별 추천 특성 조합 정리",
};

const tierBadge: Record<TraitTier, string> = {
  "S+": "bg-gradient-gold text-white",
  S: "bg-gradient-palmon text-white",
};

export default function TraitsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        emoji="✨"
        title="특성 가이드"
        description="팰몬 유형별로 추천되는 특성 조합을 정리했어요. 아래는 실제 운용 기준 우선순위입니다."
        meta={
          <>
            최종 업데이트: {traitGuideMeta.updatedAt} · <SourceBadge name={traitGuideMeta.updatedBy} />
          </>
        }
      />

      <div className="grid gap-5 md:gap-6">
        {traitCategories.map((cat, idx) => (
          <section
            key={cat.id}
            className="bg-card rounded-2xl p-5 md:p-6 border border-app shadow-soft"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="text-4xl md:text-5xl leading-none">{cat.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-fg-subtle mb-1">유형 {idx + 1}</div>
                <h2 className="text-xl md:text-2xl mb-2">{cat.title}</h2>
                <p className="text-sm text-fg-muted mb-3">{cat.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-fg-subtle mr-1">예시:</span>
                  {cat.examples.map((ex) => (
                    <span
                      key={ex}
                      className="text-xs px-2 py-0.5 rounded-full bg-muted"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <ol className="grid sm:grid-cols-2 gap-2">
              {cat.recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted"
                >
                  <span className="text-xs text-fg-subtle w-4 text-center">
                    {i + 1}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-bold min-w-[36px] text-center ${tierBadge[rec.tier]}`}
                  >
                    {rec.tier}
                  </span>
                  <span className="flex-1 text-sm">{rec.stat}</span>
                  {rec.note && (
                    <span className="text-[11px] text-fg-subtle hidden sm:inline">
                      {rec.note}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-muted text-xs text-fg-muted">
        <div className="mb-1">📌 참고</div>
        <ul className="list-disc list-inside space-y-1">
          <li>본 가이드는 커뮤니티 경험에 기반한 참고용 자료입니다.</li>
          <li>동일 유형이라도 팰몬 스킬셋에 따라 우선순위는 달라질 수 있어요.</li>
        </ul>
      </div>
    </div>
  );
}
