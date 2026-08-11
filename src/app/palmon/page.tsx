import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { palmons, palmonsMeta } from "@/lib/data/palmons";
import {
  getAttribute,
  rankStyles,
  type WorkRank,
} from "@/lib/data/palmon-attributes";
import { PalmonListClient } from "./PalmonListClient";

export const metadata: Metadata = {
  title: "팰몬 도감",
  description: "팰몬 서바이벌 팰몬 전체 목록",
};

const RANK_ORDER: WorkRank[] = ["S", "A", "B"];
const RANK_BLURB: Record<WorkRank, string> = {
  S: "최우선 육성 · 성장 병목을 직접 뚫어주는 핵심 작업",
  A: "적극 육성 · 코어 로테이션에 넣어두면 체감 큰 팰몬",
  B: "기본 육성 · 필요 시 배치, 여유 자원으로 확장",
};

export default function PalmonListPage() {
  const withAttr = palmons.map((p) => ({ ...p, attr: getAttribute(p.objectId) }));

  const sorted = [...withAttr].sort((a, b) =>
    a.name.localeCompare(b.name, "ko-KR")
  );

  const byRank: Record<WorkRank, typeof withAttr> = { S: [], A: [], B: [] };
  for (const p of withAttr) {
    if (p.attr.workRank) byRank[p.attr.workRank].push(p);
  }
  for (const r of RANK_ORDER) {
    byRank[r].sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        emoji="📖"
        title="팰몬 도감"
        description="팰몬 서바이벌에 등장하는 팰몬들의 스킬과 특성을 정리했어요."
        meta={
          <>
            수록: {palmonsMeta.listed}종 · 상세 정보 {palmonsMeta.collected}종 완료 · 전체 {palmonsMeta.totalKnown}종 예정 · 출처: {palmonsMeta.source}
          </>
        }
      />

      {/* 작업 스킬 중요도 랭킹 */}
      <section className="rounded-3xl border border-app bg-gradient-to-br from-palmon-primary/10 via-palmon-accent/5 to-palmon-secondary/10 dark:from-palmon-primary/20 dark:via-palmon-accent/10 dark:to-palmon-secondary/15 shadow-soft overflow-hidden">
        <div className="p-4 md:p-5 border-b border-app/60 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg md:text-xl">⛏️ 작업 스킬 중요도 랭킹</h2>
            <p className="text-xs text-fg-muted mt-0.5">
              전투용이 아니라 <b>기지 작업 배치용</b> 우선순위입니다. 육성·배치 순서 참고용.
            </p>
          </div>
          <span className="text-[11px] px-2 py-1 rounded-full bg-muted text-fg-muted">
            총 {byRank.S.length + byRank.A.length + byRank.B.length}종 배치 가능
          </span>
        </div>

        <div className="p-4 md:p-5 space-y-4">
          {RANK_ORDER.map((r) => {
            const list = byRank[r];
            if (list.length === 0) return null;
            const rs = rankStyles[r];
            return (
              <div key={r} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-sm px-2.5 py-1 rounded-lg font-bold border ${rs.badge}`}>
                    {rs.label}랭크
                  </span>
                  <span className="text-xs text-fg-muted">{RANK_BLURB[r]}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {list.map((p) => (
                    <Link
                      key={p.objectId}
                      href={`/palmon/${p.objectId}`}
                      className="group flex items-center gap-2 bg-card rounded-xl border border-app p-2 hover:border-palmon-primary hover:shadow-lg transition-all"
                    >
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          width={40}
                          height={40}
                          className="object-contain group-hover:scale-110 transition-transform"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm truncate">{p.name}</div>
                        <div className="text-[11px] text-fg-subtle truncate">
                          {p.attr.workSkill}
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

      {/* 도감 (속성 · 랭크 필터) */}
      <PalmonListClient items={sorted} />

      <div className="rounded-xl bg-muted p-4 text-xs text-fg-muted">
        📌 팰몬 이미지와 스킬 정보의 원본 출처는 네이버 게임 라운지 · 팰몬 서바이벌 DB입니다.
        게임 저작권은 Lilith Games에 있습니다. 본 페이지는 팬 참고용입니다.
      </div>
    </div>
  );
}
