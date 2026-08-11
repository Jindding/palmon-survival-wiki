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

interface Props {
  params: { objectId: string };
}

export function generateStaticParams() {
  return palmons.map((p) => ({ objectId: p.objectId }));
}

export function generateMetadata({ params }: Props): Metadata {
  const p = getPalmon(params.objectId);
  if (!p) return { title: "팰몬 정보 없음" };
  return {
    title: `${p.name} · 팰몬 도감`,
    description: `${p.name}의 스킬과 특성 정보`,
  };
}

export default function PalmonDetailPage({ params }: Props) {
  const p = getPalmon(params.objectId);
  if (!p) notFound();

  const activeSkills = p.skills.filter((s) => s.type !== "통용 스킬");
  const passiveSkills = p.skills.filter((s) => s.type === "통용 스킬");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/palmon"
        className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-palmon-primary"
      >
        <ChevronLeft size={16} />
        도감으로
      </Link>

      {/* 헤로 */}
      <div className="rounded-3xl overflow-hidden border border-app shadow-soft bg-gradient-palmon relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_60%)]" />
        <div className="relative flex flex-col md:flex-row items-center gap-4 p-6 md:p-8">
          <div className="w-40 h-40 md:w-56 md:h-56 flex-shrink-0 flex items-center justify-center bg-white/15 backdrop-blur rounded-2xl border border-white/20">
            <Image
              src={p.imageUrl}
              alt={p.name}
              width={224}
              height={224}
              className="object-contain w-full h-full"
              unoptimized
              priority
            />
          </div>
          <div className="flex-1 text-white text-center md:text-left">
            <h1 className="text-3xl md:text-4xl mb-3">{p.name}</h1>
            {p.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">
                  스킬 {p.skills.length}개
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

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

      {p.skills.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 border border-app shadow-soft text-center">
          <div className="text-4xl mb-2">🚧</div>
          <div className="text-lg mb-1">상세 정보 준비 중</div>
          <div className="text-sm text-fg-muted">
            수집 스크립트로 스킬 정보를 채워넣을 예정입니다.
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
        출처: 네이버 게임 라운지 · 팰몬 서바이벌 DB. 저작권은 Lilith Games.
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
