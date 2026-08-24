import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { traitsCodexMeta } from "@/lib/data/traits-codex";
import { palmons } from "@/lib/data/palmons";
import {
  getWorkAttribute,
  rankStyles,
  type WorkRank,
} from "@/lib/data/palmon-attributes";
import { TraitsCodexView } from "./TraitsCodexView";

export const metadata: Metadata = {
  title: "특성 도감",
  description: "팰몬 서바이벌의 모든 특성을 카테고리별로 정리한 도감",
};

const RANK_ORDER: WorkRank[] = ["S", "A", "B"];
const RANK_BLURB: Record<WorkRank, string> = {
  S: "최우선 육성 · 성장 병목을 직접 뚫어주는 핵심 작업",
  A: "적극 육성 · 코어 로테이션에 넣어두면 체감 큰 팰몬",
  B: "기본 육성 · 필요 시 배치, 여유 자원으로 확장",
};

const TOC = [
  { href: "#combat", label: "⚔️ 전투 특성" },
  { href: "#work", label: "🛠️ 작업 특성" },
  { href: "#sub", label: "🌟 작업 보조 특성" },
  { href: "#palmon-ranking", label: "⛏️ 팰몬 배치 우선순위" },
];

interface PalmonWithWork {
  id: string;
  name: string;
  imagePath: string | null;
  workSkill: string;
  workRank: WorkRank;
}

export default function TraitsCodexPage() {
  const withWork: PalmonWithWork[] = [];
  for (const p of palmons) {
    const w = getWorkAttribute(p.name);
    if (w) {
      withWork.push({
        id: p.id,
        name: p.name,
        imagePath: p.imagePath,
        workSkill: w.workSkill,
        workRank: w.workRank,
      });
    }
  }

  const byRank: Record<WorkRank, PalmonWithWork[]> = { S: [], A: [], B: [] };
  for (const p of withWork) byRank[p.workRank].push(p);
  for (const r of RANK_ORDER) {
    byRank[r].sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));
  }
  const totalRanked = byRank.S.length + byRank.A.length + byRank.B.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        emoji="📚"
        title="특성 도감"
        description="시설 배치 · 자원 생산 · 전투 · 공용 유틸까지 모든 특성을 한곳에서. 검색과 필터로 빠르게 찾아보세요."
        meta={
          <>
            {traitsCodexMeta.note} · 최종 업데이트: {traitsCodexMeta.updatedAt} ·{" "}
            <SourceBadge name={traitsCodexMeta.updatedBy} />
          </>
        }
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
          {TOC.map((t) => (
            <a
              key={t.href}
              href={t.href}
              className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-gradient-palmon hover:text-white transition-colors"
            >
              {t.label}
            </a>
          ))}
        </div>
      </nav>

      {/* 특성 도감 본문 (검색 + 전투/작업/보조 특성) */}
      <TraitsCodexView />

      {/* 팰몬 배치 우선순위 */}
      <section
        id="palmon-ranking"
        className="rounded-3xl border border-app bg-gradient-to-br from-palmon-primary/10 via-palmon-accent/5 to-palmon-secondary/10 dark:from-palmon-primary/20 dark:via-palmon-accent/10 dark:to-palmon-secondary/15 shadow-soft overflow-hidden scroll-mt-32"
      >
        <div className="p-4 md:p-5 border-b border-app/60 flex items-center justify-between flex-wrap gap-2">
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl">⛏️ 작업 배치 팰몬 우선순위</h2>
            <p className="text-xs text-fg-muted mt-1 leading-relaxed">
              위 <b>작업 특성</b> 을 어느 팰몬에게 붙일지 결정할 때 참고하는{" "}
              <b>팰몬 배치 랭킹</b> 입니다. 전투용이 아니라 캠프 작업 배치용
              우선순위예요.
            </p>
          </div>
          <span className="text-[11px] px-2 py-1 rounded-full bg-muted text-fg-muted whitespace-nowrap">
            총 {totalRanked}종 배치 가능
          </span>
        </div>

        <div className="p-4 md:p-5 space-y-4">
          {RANK_ORDER.map((r) => {
            const list = byRank[r];
            if (list.length === 0) return null;
            const rs = rankStyles[r];
            return (
              <div key={r} className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-sm px-2.5 py-1 rounded-lg font-bold border ${rs.badge}`}
                  >
                    {rs.label}랭크
                  </span>
                  <span className="text-xs text-fg-muted">
                    {RANK_BLURB[r]}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {list.map((p) => (
                    <Link
                      key={p.id}
                      href={`/palmon/${p.id}`}
                      className="group flex items-center gap-2 bg-card rounded-xl border border-app p-2 hover:border-palmon-primary hover:shadow-lg transition-all"
                    >
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {p.imagePath && (
                          <Image
                            src={p.imagePath}
                            alt={p.name}
                            width={40}
                            height={40}
                            className="object-contain group-hover:scale-110 transition-transform"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm truncate">{p.name}</div>
                        <div className="text-[11px] text-fg-subtle truncate">
                          {p.workSkill}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
