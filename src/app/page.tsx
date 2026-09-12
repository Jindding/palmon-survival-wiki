import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Castle,
  Coins,
  Egg,
  Flame,
  Info,
  Lightbulb,
  Mail,
  Megaphone,
  Rabbit,
  Snowflake,
  Sparkles,
  Swords,
} from "lucide-react";
import { updates, type UpdateTag } from "@/lib/data/updates";
import { tips } from "@/lib/data/tips";
import { SourceBadge } from "@/components/SourceBadge";
import { HomeTodayOverlap } from "./HomeTodayOverlap";
import { HomeBoardRecent } from "./HomeBoardRecent";

const CATEGORIES: {
  title: string;
  emoji: string;
  items: {
    href: string;
    label: string;
    desc: string;
    Icon: typeof Coins;
  }[];
}[] = [
  {
    title: "시작하기",
    emoji: "🚀",
    items: [
      { href: "/overview", label: "게임 소개", desc: "기본 시스템 · 자원 · UI 개요", Icon: Info },
      { href: "/economy", label: "재화 · 과금", desc: "환율표 · 과금 정도별 추천", Icon: Coins },
      { href: "/buildings", label: "캠프 업그레이드", desc: "Lv.2~30 자원·시간표", Icon: Building2 },
    ],
  },
  {
    title: "팰몬 육성",
    emoji: "🐾",
    items: [
      { href: "/palmon", label: "팰몬 도감", desc: "전체 팰몬 스킬·특성", Icon: BookOpen },
      { href: "/traits", label: "특성 가이드", desc: "유형별 추천 특성", Icon: Sparkles },
      { href: "/breeding", label: "번식 시스템", desc: "특성 상속·재료 관리", Icon: Egg },
      { href: "/mounts", label: "탈것 시스템", desc: "우선순위·스킬 해금", Icon: Rabbit },
    ],
  },
  {
    title: "실전 & 시즌",
    emoji: "⚔️",
    items: [
      { href: "/team-comps", label: "속성별 조합", desc: "실전 팀 조합 모음", Icon: Swords },
      { href: "/gvg", label: "GvG 주간 미션", desc: "요일별 미션·점수 정리", Icon: Castle },
      { href: "/season1", label: "시즌 1 · 얼음 시대", desc: "시스템·이벤트 전략", Icon: Snowflake },
      { href: "/season2", label: "시즌 2 · 정복의 시대", desc: "Mega Evolution·자원 순환", Icon: Flame },
    ],
  },
];

const TAG_META: Record<UpdateTag, { label: string; className: string }> = {
  NEW: { label: "신규", className: "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30" },
  UPDATE: { label: "개선", className: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30" },
  FIX: { label: "수정", className: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30" },
  DATA: { label: "데이터", className: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30" },
};

export default function HomePage() {
  const recentUpdates = updates.slice(0, 3);
  const recentTips = tips.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero */}
      <section className="text-center pt-6 pb-4 md:pt-8 md:pb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lilithimage.lilithcdn.com/allgames-official-web/ptslg/en/imgaes/pc/logo.webp"
          alt="Palmon Survival"
          className="mx-auto h-16 md:h-24 w-auto object-contain mb-3"
        />
        <h1 className="text-3xl md:text-5xl mb-2">팰몬 허브</h1>
        <p className="text-fg-muted md:text-lg">
          팰몬 서바이벌을 즐기는 모두를 위한 비공식 가이드 · 위키
        </p>
      </section>

      {/* Today Overlap - 최상단 강조 */}
      <section>
        <HomeTodayOverlap />
      </section>

      {/* Recent activity: Board + Updates + Tips */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <HomeBoardRecent />

        {/* Updates */}
        <div className="min-w-0 p-5 rounded-2xl bg-card border border-app shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Megaphone
                size={16}
                style={{ color: "rgb(var(--primary))" }}
              />
              최근 업데이트
            </h3>
            <Link
              href="/updates"
              className="text-xs text-fg-subtle hover:text-palmon-primary transition-colors inline-flex items-center gap-0.5"
            >
              더보기 <ArrowRight size={12} />
            </Link>
          </div>
          {recentUpdates.length === 0 ? (
            <div className="text-xs text-fg-muted py-6 text-center">
              아직 업데이트가 없어요.
            </div>
          ) : (
            <ul className="space-y-2.5">
              {recentUpdates.map((u, i) => {
                const tag = TAG_META[u.tag];
                return (
                  <li key={i} className="text-sm">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${tag.className}`}
                      >
                        {tag.label}
                      </span>
                      <span className="text-[11px] text-fg-subtle">{u.date}</span>
                    </div>
                    <div className="leading-snug break-words">{u.title}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Tips */}
        <div className="min-w-0 p-5 rounded-2xl bg-card border border-app shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Lightbulb
                size={16}
                style={{ color: "rgb(var(--accent))" }}
              />
              최근 유저 팁
            </h3>
            <Link
              href="/tips"
              className="text-xs text-fg-subtle hover:text-palmon-primary transition-colors inline-flex items-center gap-0.5"
            >
              더보기 <ArrowRight size={12} />
            </Link>
          </div>
          {recentTips.length === 0 ? (
            <div className="text-xs text-fg-muted py-6 text-center">
              아직 등록된 팁이 없어요.
            </div>
          ) : (
            <ul className="space-y-3">
              {recentTips.map((t, i) => (
                <li key={i} className="text-sm">
                  <p className="leading-snug line-clamp-2 break-words">{t.content}</p>
                  {t.by && (
                    <div className="mt-1 text-xs text-fg-subtle">
                      <SourceBadge name={t.by} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Category Sections */}
      {CATEGORIES.map((cat) => (
        <section key={cat.title}>
          <h2 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2">
            <span>{cat.emoji}</span> {cat.title}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cat.items.map((item) => {
              const Icon = item.Icon;
              return (
                <Link key={item.href} href={item.href} className="block group">
                  <div className="p-4 md:p-5 rounded-2xl bg-card border border-app hover:border-palmon-primary group-hover:shadow-soft transition-all h-full">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-palmon flex items-center justify-center text-white flex-shrink-0">
                        <Icon size={18} />
                      </div>
                      <h3 className="text-base md:text-lg font-semibold">
                        {item.label}
                      </h3>
                    </div>
                    <p className="text-xs md:text-sm text-fg-muted">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {/* Contact CTA */}
      <section className="text-center py-6">
        <p className="text-sm text-fg-muted mb-2">
          궁금한 점이나 제보하실 팁이 있으신가요?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border border-app hover:border-palmon-primary transition-colors"
        >
          <Mail size={16} /> 문의하기
        </Link>
      </section>
    </div>
  );
}
