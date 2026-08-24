import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  palmons,
  getPalmon,
  cleanDescription,
  type PalmonSkill,
} from "@/lib/data/palmons";
import { PalmonHeroTree } from "./PalmonHeroTree";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return palmons.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const p = getPalmon(params.id);
  if (!p) return { title: "팰몬 정보 없음" };
  return {
    title: `${p.name} · 팰몬 도감`,
    description: `${p.name}의 스킬과 특성 정보`,
  };
}

export default function PalmonDetailPage({ params }: Props) {
  const p = getPalmon(params.id);
  if (!p) notFound();

  const activeSkills = p.skills?.filter((s) => s.type !== "통용 스킬") ?? [];
  const passiveSkills = p.skills?.filter((s) => s.type === "통용 스킬") ?? [];
  const hasSkills = (p.skills?.length ?? 0) > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/palmon"
        className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-palmon-primary"
      >
        <ChevronLeft size={16} />
        도감으로
      </Link>

      <PalmonHeroTree palmon={p} />

      {p.basicInfos && p.basicInfos.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl px-1">📊 스탯 (300 레벨 기준)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {p.basicInfos.map((s) => (
              <div
                key={s.name}
                className="bg-card rounded-2xl p-4 border border-app shadow-soft"
              >
                <div className="text-[11px] text-fg-subtle">{s.name}</div>
                <div className="text-lg md:text-xl font-bold tabular-nums mt-1 bg-gradient-palmon bg-clip-text text-transparent">
                  {Number(s.description).toLocaleString("ko-KR")}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!hasSkills ? (
        <div className="bg-card rounded-2xl p-8 border border-app shadow-soft text-center">
          <div className="text-4xl mb-2">🚧</div>
          <div className="text-lg mb-1">스킬 정보 없음</div>
          <div className="text-sm text-fg-muted">
            현재 스킬 데이터가 매핑되어 있지 않아요. 이미지와 함께 정리되는 대로
            반영할게요.
          </div>
        </div>
      ) : (
        <>
          {activeSkills.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl px-1">⚔️ 스킬</h2>
              <div className="grid gap-3">
                {activeSkills.map((s) => (
                  <SkillCard key={s.objectId} skill={s} />
                ))}
              </div>
            </section>
          )}

          {passiveSkills.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl px-1">✨ 통용 스킬 (특성)</h2>
              <div className="grid gap-3">
                {passiveSkills.map((s) => (
                  <SkillCard key={s.objectId} skill={s} passive />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <div className="rounded-xl bg-muted p-3 text-[11px] text-fg-subtle">
        이미지 출처: 게임사 공식 자료. 저작권은 Lilith Games. 스킬 데이터는
        네이버 게임 라운지 · 팰몬 서바이벌 DB 기반이며 팬 참고용입니다.
      </div>
    </div>
  );
}

function SkillCard({ skill, passive }: { skill: PalmonSkill; passive?: boolean }) {
  const lines = cleanDescription(skill.description);
  const [main, ...rest] = lines;
  const upgradeIdx = rest.findIndex((l) => l.includes("스킬 승급 효과"));
  const beforeUpgrade = upgradeIdx >= 0 ? rest.slice(0, upgradeIdx) : rest;
  const upgradeLines = upgradeIdx >= 0 ? rest.slice(upgradeIdx + 1) : [];

  return (
    <article className="bg-card rounded-2xl p-4 md:p-5 border border-app shadow-soft">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
          <Image
            src={skill.imageUrl}
            alt={skill.name}
            width={64}
            height={64}
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base md:text-lg">{skill.name}</h3>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded ${
                passive
                  ? "bg-gradient-gold text-white"
                  : "bg-gradient-palmon text-white"
              }`}
            >
              {skill.type}
            </span>
          </div>
          {main && (
            <p className="text-sm text-fg-muted mt-1 leading-relaxed">{main}</p>
          )}
        </div>
      </div>

      {beforeUpgrade.length > 0 && (
        <div className="text-sm text-fg-muted space-y-1 mb-3">
          {beforeUpgrade.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}

      {upgradeLines.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-palmon-primary hover:underline">
            스킬 승급 효과 보기
          </summary>
          <div className="mt-2 pt-2 border-t border-app grid grid-cols-1 sm:grid-cols-5 gap-1.5">
            {upgradeLines.map((line, i) => {
              const [tier, effect] = line.split(":").map((s) => s.trim());
              return (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-muted text-center text-xs"
                >
                  <div className="text-palmon-secondary font-bold">{tier}</div>
                  <div className="text-fg-muted mt-0.5">{effect}</div>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </article>
  );
}
