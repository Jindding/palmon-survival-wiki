import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { HighlightCard } from "@/components/Highlight";
import {
  season1Hero,
  season1Sections,
  season1Meta,
  type SubBlock,
} from "@/lib/data/season1";

export const metadata: Metadata = {
  title: "시즌 1 가이드",
  description: `${season1Meta.season} '${season1Meta.seasonName}' 시즌 1 시스템·이벤트·전략 가이드`,
};

export default function Season1Page() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        emoji="❄️"
        title={`${season1Meta.season}: ${season1Hero.name}`}
        description={season1Hero.tagline}
        meta={<>최종 업데이트: {season1Meta.updatedAt}</>}
      />

      {/* 목차 */}
      <nav
        aria-label="목차"
        className="bg-card rounded-2xl p-4 border border-app shadow-soft"
      >
        <div className="text-xs text-fg-subtle uppercase tracking-wider mb-2 px-1">
          목차
        </div>
        <div className="flex flex-wrap gap-2">
          {season1Sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-gradient-palmon hover:text-white transition-colors"
            >
              {s.emoji} {s.title}
            </a>
          ))}
        </div>
      </nav>

      {season1Sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="bg-card rounded-2xl p-5 md:p-6 border border-app shadow-soft scroll-mt-32"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="text-3xl leading-none">{section.emoji}</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl">{section.title}</h2>
              {section.intro && (
                <p className="text-sm text-fg-muted mt-2 leading-relaxed">
                  {section.intro}
                </p>
              )}
            </div>
          </div>

          {section.bullets && (
            <ul className="space-y-1.5 mt-3">
              {section.bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-palmon-primary flex-shrink-0">◆</span>
                  <span className="text-fg-muted">{b}</span>
                </li>
              ))}
            </ul>
          )}

          {section.highlights && (
            <div className="mt-4 space-y-2">
              {section.highlights.map((h, i) => (
                <HighlightCard key={i} h={h} />
              ))}
            </div>
          )}

          {section.subs && (
            <div className="mt-4 grid gap-3">
              {section.subs.map((sub) => (
                <SubCard key={sub.title} sub={sub} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function SubCard({ sub }: { sub: SubBlock }) {
  return (
    <div className="p-4 rounded-xl bg-muted border border-app/50">
      <h3 className="text-base mb-1">{sub.title}</h3>
      {sub.intro && (
        <p className="text-xs text-fg-muted mb-2">{sub.intro}</p>
      )}
      {sub.bullets && (
        <ul className="space-y-1">
          {sub.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-palmon-secondary flex-shrink-0">▸</span>
              <span className="text-fg-muted">{b}</span>
            </li>
          ))}
        </ul>
      )}
      {sub.highlights && (
        <div className="mt-3 space-y-2">
          {sub.highlights.map((h, i) => (
            <HighlightCard key={i} h={h} />
          ))}
        </div>
      )}
    </div>
  );
}
