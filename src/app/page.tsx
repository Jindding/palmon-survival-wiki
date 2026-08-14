import Link from "next/link";
import { Coins, Sword, Sparkles, Trophy, Swords, Castle, Snowflake, Building2, BookOpen, Lightbulb, ArrowRight } from "lucide-react";
import { SourceBadge } from "@/components/SourceBadge";
import { tips } from "@/lib/data/tips";

const cards = [
  {
    href: "/economy",
    icon: Coins,
    title: "재화 · 과금 가이드",
    desc: "환율표와 과금 정도별 추천",
  },
  {
    href: "/equipment",
    icon: Sword,
    title: "장비 업그레이드",
    desc: "강화 · 승급 우선순위",
  },
  {
    href: "/traits",
    icon: Sparkles,
    title: "특성 가이드",
    desc: "팰몬 유형별 추천 특성",
  },
  {
    href: "/achievements",
    icon: Trophy,
    title: "업적 가이드",
    desc: "전투력 극대화 루트",
  },
  {
    href: "/team-comps",
    icon: Swords,
    title: "속성별 조합",
    desc: "시즌2 실전 조합 모음",
  },
  {
    href: "/gvg",
    icon: Castle,
    title: "GvG 주간 미션",
    desc: "요일별 미션 · 점수 정리",
  },
  {
    href: "/season1",
    icon: Snowflake,
    title: "시즌 1 가이드",
    desc: "얼음 시대의 시작 · 시스템/이벤트 전략",
  },
  {
    href: "/buildings",
    icon: Building2,
    title: "캠프 업그레이드",
    desc: "Lv.2~30 자격 · 자원 · 시간",
  },
  {
    href: "/palmon",
    icon: BookOpen,
    title: "팰몬 도감",
    desc: "전체 팰몬 스킬 · 특성",
  },
];

export default function HomePage() {
  const featuredTips = tips.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto">
      <section className="text-center py-10 md:py-16">
        <div className="text-6xl md:text-7xl mb-4">🐾</div>
        <h1 className="text-3xl md:text-5xl mb-3">
          팰몬 허브에 오신 걸 환영해요!
        </h1>
        <p className="text-fg-muted md:text-lg max-w-xl mx-auto">
          팰몬 서바이벌을 즐기는 모두를 위한 비공식 가이드 · 위키
        </p>
      </section>

      {featuredTips.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-lg md:text-xl flex items-center gap-2">
              <Lightbulb size={20} className="text-palmon-secondary" />
              최근 유저 팁
            </h2>
            <Link
              href="/tips"
              className="text-xs md:text-sm text-fg-muted hover:text-palmon-primary inline-flex items-center gap-1"
            >
              전체 보기 <ArrowRight size={14} />
            </Link>
          </div>
          <ul className="grid gap-3 md:grid-cols-2">
            {featuredTips.map((tip, i) => (
              <li
                key={i}
                className="rounded-2xl p-4 border shadow-soft"
                style={{
                  backgroundColor: "rgb(var(--secondary) / 0.10)",
                  borderColor: "rgb(var(--secondary) / 0.35)",
                }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg leading-tight" aria-hidden>
                    💡
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base leading-relaxed">
                      {tip.content}
                    </p>
                    {tip.by && (
                      <div className="mt-2">
                        <SourceBadge name={tip.by} />
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href} className="block group">
              <div className="p-5 md:p-6 rounded-2xl bg-card border border-app hover:border-palmon-primary group-hover:shadow-soft transition-all h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-palmon flex items-center justify-center text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg">{c.title}</h3>
                </div>
                <p className="text-sm text-fg-muted">{c.desc}</p>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
