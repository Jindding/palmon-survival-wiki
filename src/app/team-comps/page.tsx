import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import {
  elementGroups,
  teamCompsIntro,
  teamCompsMeta,
} from "@/lib/data/team-comps";

export const metadata: Metadata = {
  title: "속성별 추천 조합",
  description: "시즌2 기준 속성별 추천 조합과 세부 팁",
};

export default function TeamCompsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        emoji="⚔️"
        title="속성별 추천 조합"
        description={teamCompsIntro}
        meta={
          <>
            {teamCompsMeta.season} · 최종 업데이트: {teamCompsMeta.updatedAt} · <SourceBadge name={teamCompsMeta.updatedBy} />
          </>
        }
      />

      {elementGroups.map((group) => (
        <section key={group.id} className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center text-xl shadow-soft`}
            >
              {group.emoji}
            </div>
            <h2 className="text-2xl">{group.name}</h2>
          </div>

          <div className="grid gap-4">
            {group.comps.map((comp) => (
              <article
                key={comp.id}
                className="bg-card rounded-2xl p-5 md:p-6 border border-app shadow-soft"
              >
                <h3 className="text-lg md:text-xl mb-2">{comp.name}</h3>
                <p className="text-sm text-fg-muted mb-4 leading-relaxed">
                  {comp.concept}
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-muted">
                    <div className="text-xs text-fg-subtle mb-2">🛡️ 앞라인</div>
                    <div className="flex flex-wrap gap-1.5">
                      {comp.frontLine.map((p) => (
                        <span
                          key={p}
                          className="text-xs px-2 py-1 rounded-full bg-card border border-app"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted">
                    <div className="text-xs text-fg-subtle mb-2">🏹 뒷라인</div>
                    <div className="flex flex-wrap gap-1.5">
                      {comp.backLine.map((p) => (
                        <span
                          key={p}
                          className="text-xs px-2 py-1 rounded-full bg-card border border-app"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {comp.tips.length > 0 && (
                  <div>
                    <div className="text-xs text-fg-subtle mb-2">💡 세부 팁</div>
                    <ul className="space-y-1.5">
                      {comp.tips.map((tip, i) => (
                        <li key={i} className="flex gap-2 text-sm text-fg-muted">
                          <span className="text-palmon-secondary flex-shrink-0">
                            ▸
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
