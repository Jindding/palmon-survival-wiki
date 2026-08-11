export interface EquipmentSection {
  title: string;
  emoji: string;
  intro?: string;
  bullets: string[];
}

export const equipmentGuide: EquipmentSection[] = [
  {
    title: "강화",
    emoji: "⚡",
    intro: "장비 레벨업의 핵심은 메인 딜러 집중과 서포터 최소 세팅입니다.",
    bullets: [
      "핵심 캐릭터 (팀 메인 딜러 신화팰몬) 한 마리의 장비 레벨을 다른 팰몬보다 +20 높게 유지하며 레벨업.",
      "버퍼 · 디버퍼는 방패와 가면부터 우선 강화.",
    ],
  },
  {
    title: "승급 우선순위",
    emoji: "🏆",
    intro: "누구부터 승급할지의 순서입니다.",
    bullets: [
      "1순위: 신화팰몬 & 에스카피에 (에스카피에 조합은 신화팰몬과 함께 반드시 방어템 승급)",
      "2순위: 주요 버퍼 & 디버퍼 — 스태츄, 돌피렌드, 길런트, 살라맨티스 등",
      "3순위: 나머지 팰몬",
    ],
  },
  {
    title: "역할별 승급 순서",
    emoji: "🎯",
    bullets: [
      "딜러: 스태프 → 목걸이 → 방패 → 가면 순으로 승급.",
      "에스카피에 · 버퍼 · 퓨어탱커: 방패와 가면만 승급. 스태프 · 목걸이는 승급 불필요.",
      "디버프 · CC 팰몬: 회피가 뜨지 않아야 하므로 목걸이 레벨 필수.",
    ],
  },
  {
    title: "승급 요령",
    emoji: "💡",
    bullets: [
      "장비 하나에 몰빵하지 말고, 한 캐릭터의 4개 장비를 다 같이 2성 → 5성 → 7성 순으로 골고루 올릴 것.",
      "에스카피에를 쓰는 조합은 메인 딜러 1명의 무기와 목걸이 10성을 최대한 빨리 완성. 10성 여부에 따라 조합력 차이가 큽니다.",
    ],
  },
];

export const equipmentMeta = {
  updatedAt: "2026-06-22",
  updatedBy: "TechBoy",
};
