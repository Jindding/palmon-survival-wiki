import raw from "./palmons.json";

export type PalmonGrade = "SR" | "SSR" | "UR" | "신화";
export type PalmonElement = "물" | "불" | "바위" | "전기";
export type EvolutionStage = "evolved" | "superEvolved";

export interface PalmonSkill {
  objectId: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
}

export interface PalmonBasicInfo {
  name: string;
  description: string;
}

export interface PalmonEvolution {
  stage: EvolutionStage;
  id: string;
  name: string;
  imagePath: string | null;
}

export interface Palmon {
  id: string;
  name: string;
  grade: PalmonGrade;
  element: PalmonElement;
  imagePath: string | null;
  evolutions?: PalmonEvolution[];
  basicInfos?: PalmonBasicInfo[];
  skills?: PalmonSkill[];
}

export const palmons: Palmon[] = raw as Palmon[];

export function getPalmon(id: string): Palmon | undefined {
  return palmons.find((p) => p.id === id);
}

export function cleanDescription(desc: string): string[] {
  return desc
    .replace(/<BR\s*\/?>/gi, "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const gradeStyles: Record<
  PalmonGrade,
  { label: string; badge: string; ring: string }
> = {
  SR: {
    label: "SR",
    badge:
      "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40",
    ring: "ring-emerald-400/40",
  },
  SSR: {
    label: "SSR",
    badge:
      "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/40",
    ring: "ring-indigo-400/40",
  },
  UR: {
    label: "UR",
    badge:
      "bg-gradient-to-br from-amber-400 to-orange-500 text-white border-amber-500/50",
    ring: "ring-amber-400/40",
  },
  신화: {
    label: "신화",
    badge:
      "bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-500 text-white border-fuchsia-500/50",
    ring: "ring-fuchsia-400/40",
  },
};

export const elementStyles: Record<
  PalmonElement,
  { label: string; badge: string; emoji: string }
> = {
  물: {
    label: "물",
    emoji: "💧",
    badge:
      "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30",
  },
  불: {
    label: "불",
    emoji: "🔥",
    badge:
      "bg-red-500/15 text-red-600 dark:text-red-300 border-red-500/30",
  },
  바위: {
    label: "바위",
    emoji: "🪨",
    badge:
      "bg-stone-500/20 text-stone-700 dark:text-stone-300 border-stone-500/30",
  },
  전기: {
    label: "전기",
    emoji: "⚡",
    badge:
      "bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
};

export const palmonsMeta = {
  listed: palmons.length,
  totalEntries: palmons.reduce(
    (s, p) => s + 1 + (p.evolutions?.length ?? 0),
    0,
  ),
  withSkills: palmons.filter((p) => p.skills?.length).length,
  source: "게임사 공식 자료 (Lilith Games)",
  updatedAt: "2026-08-24",
};
