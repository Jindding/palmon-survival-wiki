export type TraitTier = "S+" | "S";

export interface TraitRecommendation {
  tier: TraitTier;
  stat: string;
  note?: string;
}

export interface TraitCategory {
  id: string;
  title: string;
  description: string;
  examples: string[];
  emoji: string;
  recommendations: TraitRecommendation[];
}

export const traitCategories: TraitCategory[] = [
  {
    id: "crit-dealer",
    title: "치명확률 증가 패시브를 가진 딜러",
    description:
      "자체 패시브로 치명확률이 확보되는 딜러. 치명 관련 스탯 효율이 매우 높습니다.",
    examples: ["맨틀레이"],
    emoji: "⚔️",
    recommendations: [
      { tier: "S+", stat: "치명타" },
      { tier: "S+", stat: "치명데미지" },
      { tier: "S+", stat: "공격력" },
      { tier: "S", stat: "치명타 또는 S+ 체력", note: "상황에 따라 선택" },
    ],
  },
  {
    id: "backline-dealer",
    title: "치명확률 증가 패시브가 없는 뒷라인 딜러",
    description:
      "자체 치명 패시브가 없는 원거리·후방 딜러. 공격력과 치명타를 균형 있게 챙깁니다.",
    examples: ["블레질"],
    emoji: "🏹",
    recommendations: [
      { tier: "S+", stat: "공격력" },
      { tier: "S+", stat: "치명타" },
      { tier: "S+", stat: "체력" },
      { tier: "S+", stat: "방어력" },
    ],
  },
  {
    id: "buffer-tank",
    title: "버퍼 · 디버퍼 · 퓨어 탱커",
    description: "생존과 유틸리티가 핵심인 서포터 · 탱커 계열.",
    examples: ["에스카피에", "스태츄", "돌피렌드"],
    emoji: "🛡️",
    recommendations: [
      { tier: "S+", stat: "체력" },
      { tier: "S+", stat: "방어력" },
      { tier: "S", stat: "체력" },
      { tier: "S", stat: "방어력" },
    ],
  },
];

export const traitGuideMeta = {
  updatedAt: "2026-06-22",
  updatedBy: "TechBoy #69",
};
