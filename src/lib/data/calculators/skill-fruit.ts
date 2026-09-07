// 스킬 레벨업 열매 계산기
//
// 스킬 하나를 현재 레벨에서 목표 레벨까지 올리는 데 필요한 스킬 레벨업 열매를 계산한다.
// 스킬은 Lv 30가 최대이며, 1개를 풀레벨까지 올리려면 총 104,200개가 든다.
//
// 참고: 원본 도구에는 보유 열매상자로 몇 개를 까면 되는지 추천하는 기능이 있지만,
//       상자 보상이 확률 기반이라 여기서는 제외했다.

import { calcLevelCost, type LevelCostInput, type LevelCostResult } from "./level-cost";

/** 게임 내 스킬 레벨업 열매 아이템 이미지 */
export const SKILL_FRUIT_IMAGE = "/items/skill-fruit.png";

export const SKILL_MAX_LEVEL = 30;

/** SKILL_PER_LEVEL[N] = 스킬 Lv N → Lv N+1 비용 */
export const SKILL_PER_LEVEL: readonly number[] = [
  0, 100, 200, 300, 400, 600, 800, 1000, 1200, 1400,
  1700, 2000, 2300, 2600, 2900, 3200, 3500, 3800, 4100, 4400,
  4700, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000,
];

export function calcSkillFruit(input: LevelCostInput): LevelCostResult {
  return calcLevelCost(SKILL_PER_LEVEL, SKILL_MAX_LEVEL, input);
}

/** 계산 방법 표에 보여줄 대표 구간 (Lv 1 기준 누적) */
export const SKILL_MILESTONES = [5, 10, 15, 20, 25, SKILL_MAX_LEVEL];

export const skillFruitMeta = {
  updatedAt: "2026-09-07",
  updatedBy: "Python #152",
};
