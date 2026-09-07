"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { Palmon, PalmonEvolution } from "@/lib/data/palmons";
import { gradeStyles, elementStyles, seasonStyles } from "@/lib/data/palmons";

type Stage = "base" | "evolved" | "superEvolved";

interface StageTheme {
  label: string;
  heroBg: string;
  heroBorder: string;
  cardBg: string;
  border: string;
  ring: string;
  dot: string;
  text: string;
  pageOverlay: string; // 페이지 전체에 깔릴 subtle 그라데이션
}

const STAGE_THEME: Record<Stage, StageTheme> = {
  base: {
    label: "원본",
    heroBg: "bg-gradient-palmon",
    heroBorder: "border-palmon-primary/30",
    cardBg:
      "bg-gradient-to-br from-palmon-primary/5 via-palmon-accent/3 to-palmon-secondary/5 dark:from-palmon-primary/10 dark:via-palmon-accent/5 dark:to-palmon-secondary/8",
    border: "border-palmon-primary/30",
    ring: "ring-palmon-primary/40",
    dot: "bg-palmon-primary",
    text: "text-palmon-primary",
    pageOverlay: "",
  },
  evolved: {
    label: "진화",
    heroBg: "bg-gradient-to-br from-orange-400 to-amber-500",
    heroBorder: "border-orange-400/40",
    cardBg:
      "bg-gradient-to-br from-amber-500/5 via-orange-500/3 to-orange-500/5 dark:from-amber-500/10 dark:via-orange-500/6 dark:to-orange-500/10",
    border: "border-orange-500/30",
    ring: "ring-orange-500/50",
    dot: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
    pageOverlay:
      "bg-gradient-to-br from-orange-500/4 via-transparent to-amber-500/4",
  },
  superEvolved: {
    label: "슈퍼 진화",
    heroBg: "bg-gradient-to-br from-red-400 to-rose-500",
    heroBorder: "border-red-400/40",
    cardBg:
      "bg-gradient-to-br from-red-500/5 via-rose-500/3 to-red-500/5 dark:from-red-500/10 dark:via-rose-500/6 dark:to-red-500/10",
    border: "border-red-500/30",
    ring: "ring-red-500/50",
    dot: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    pageOverlay:
      "bg-gradient-to-br from-red-500/4 via-transparent to-rose-500/4",
  },
};

interface ViewingForm {
  stage: Stage;
  name: string;
  imagePath: string | null;
  id: string;
}

export function PalmonHeroTree({ palmon }: { palmon: Palmon }) {
  const [current, setCurrent] = useState<ViewingForm>({
    stage: "base",
    name: palmon.name,
    imagePath: palmon.imagePath,
    id: palmon.id,
  });

  const theme = STAGE_THEME[current.stage];
  const gs = gradeStyles[palmon.grade];
  const es = elementStyles[palmon.element];
  const ss = palmon.season ? seasonStyles[palmon.season] : null;
  const hasEvolutions = palmon.evolutions && palmon.evolutions.length > 0;

  const showBase = () =>
    setCurrent({
      stage: "base",
      name: palmon.name,
      imagePath: palmon.imagePath,
      id: palmon.id,
    });

  const showEvo = (ev: PalmonEvolution) =>
    setCurrent({
      stage: ev.stage,
      name: ev.name,
      imagePath: ev.imagePath,
      id: ev.id,
    });

  return (
    <>
      {/* 페이지 전체 배경 오버레이 */}
      <div
        className={`fixed inset-0 -z-10 pointer-events-none transition-colors duration-500 ${theme.pageOverlay}`}
        aria-hidden
      />

      {/* 히어로 */}
      <div
        className={`rounded-3xl overflow-hidden border-2 shadow-soft relative transition-all duration-300 ${theme.heroBg} ${theme.heroBorder}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_60%)]" />
        <div className="relative flex flex-col md:flex-row items-center gap-4 p-6 md:p-8">
          <div className="w-40 h-40 md:w-56 md:h-56 flex-shrink-0 flex items-center justify-center bg-white/15 backdrop-blur rounded-2xl border border-white/20">
            {current.imagePath ? (
              <Image
                src={current.imagePath}
                alt={current.name}
                width={224}
                height={224}
                className="object-contain w-full h-full transition-opacity duration-300"
                priority
                key={current.id}
              />
            ) : (
              <div className="text-white/60 text-4xl">🚧</div>
            )}
          </div>
          <div className="flex-1 text-white text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2 flex-wrap">
              {current.stage === "base" ? (
                <>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold border ${gs.badge}`}
                  >
                    {gs.label}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${es.badge}`}
                  >
                    {es.emoji} {es.label}
                  </span>
                  {ss && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-bold ${ss.badge}`}
                    >
                      {ss.emoji} {ss.label}
                    </span>
                  )}
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white/25 backdrop-blur font-bold text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {theme.label}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl mb-3">{current.name}</h1>
            {current.stage === "base" && palmon.skills?.length ? (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">
                  스킬 {palmon.skills.length}개
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* 진화 트리 */}
      {hasEvolutions && (
        <section className="space-y-3 mt-6">
          <h2 className="text-xl px-1 flex items-center gap-2">
            <Sparkles size={18} className={theme.text} />
            진화 트리
            <span className="text-xs text-fg-subtle font-normal ml-1">
              (클릭하면 이미지가 바뀝니다)
            </span>
          </h2>
          <div
            className={`rounded-2xl border shadow-soft p-4 md:p-5 transition-colors duration-300 ${theme.cardBg} ${theme.border}`}
          >
            <div className="flex items-center gap-2 md:gap-3 overflow-x-auto overflow-y-visible py-2 px-1">
              <EvolutionNodeButton
                name={palmon.name}
                imagePath={palmon.imagePath}
                stageLabel="원본"
                theme={STAGE_THEME.base}
                active={current.stage === "base"}
                onClick={showBase}
              />
              {palmon.evolutions!.map((ev) => {
                const evTheme = STAGE_THEME[ev.stage];
                return (
                  <div
                    key={ev.id}
                    className="flex items-center gap-2 md:gap-3 shrink-0"
                  >
                    <div className={`text-2xl ${evTheme.text}`}>→</div>
                    <EvolutionNodeButton
                      name={ev.name}
                      imagePath={ev.imagePath}
                      stageLabel={evTheme.label}
                      theme={evTheme}
                      active={current.stage === ev.stage}
                      onClick={() => showEvo(ev)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function EvolutionNodeButton({
  name,
  imagePath,
  stageLabel,
  theme,
  active,
  onClick,
}: {
  name: string;
  imagePath: string | null;
  stageLabel: string;
  theme: StageTheme;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 w-24 md:w-32 rounded-xl p-2 text-center border-2 transition-all ${
        active
          ? `${theme.cardBg} ${theme.border} ring-2 ring-offset-2 ring-offset-card ${theme.ring}`
          : "bg-muted border-app hover:border-fg-subtle/40"
      }`}
    >
      <div className="w-20 h-20 md:w-28 md:h-28 mx-auto flex items-center justify-center bg-card rounded-lg overflow-hidden">
        {imagePath ? (
          <Image
            src={imagePath}
            alt={name}
            width={112}
            height={112}
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="text-2xl">🚧</div>
        )}
      </div>
      <div
        className={`text-[10px] uppercase tracking-wider mt-1.5 font-bold ${
          active ? theme.text : "text-fg-subtle"
        }`}
      >
        {stageLabel}
      </div>
      <div className="text-xs md:text-sm truncate">{name}</div>
    </button>
  );
}
