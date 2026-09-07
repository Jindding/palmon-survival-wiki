// 레벨 구간 비용 계산 공용 로직.
// 경험치 계산기와 스킬열매 계산기가 완전히 같은 구조라 계산부를 공유한다.
//
// costs[N] = "Lv N → Lv N+1"로 올리는 데 드는 비용. costs[0]은 항상 0이다.
// 따라서 Lv X → Lv Y 비용 = costs[X] + costs[X+1] + ... + costs[Y-1].

export interface LevelCostInput {
  current: number;
  target: number;
  /** 보유량. 0이면 필요량만 계산한다. */
  owned: number;
}

export interface LevelCostResult {
  /** 목표가 현재보다 같거나 낮은 경우 */
  alreadyDone: boolean;
  /** 현재 → 목표에 필요한 양 */
  needed: number;
  owned: number;
  shortage: number;
  surplus: number;
  /** Lv 1 → 현재 레벨까지 이미 들어간 누적량 */
  spentSoFar: number;
  /** Lv 1 → 목표 레벨까지의 총 누적량 */
  totalToTarget: number;
}

/** Lv fromLv → Lv toLv 구간 비용 합. toLv가 더 낮으면 0. */
export function sumLevelRange(
  costs: readonly number[],
  fromLv: number,
  toLv: number
): number {
  if (toLv <= fromLv) return 0;
  let sum = 0;
  for (let i = fromLv; i < toLv && i < costs.length; i++) sum += costs[i] ?? 0;
  return sum;
}

/** 음수·NaN 방어. 레벨은 1 이상, 보유량은 0 이상으로 다룬다. */
function clampLevel(lv: number, maxLevel: number): number {
  if (!Number.isFinite(lv)) return 1;
  return Math.min(Math.max(Math.floor(lv), 1), maxLevel);
}

export function calcLevelCost(
  costs: readonly number[],
  maxLevel: number,
  input: LevelCostInput
): LevelCostResult {
  const current = clampLevel(input.current, maxLevel);
  const target = clampLevel(input.target, maxLevel);
  const owned =
    Number.isFinite(input.owned) && input.owned > 0 ? Math.floor(input.owned) : 0;

  const needed = sumLevelRange(costs, current, target);

  return {
    alreadyDone: target <= current,
    needed,
    owned,
    shortage: Math.max(0, needed - owned),
    surplus: Math.max(0, owned - needed),
    spentSoFar: sumLevelRange(costs, 1, current),
    totalToTarget: sumLevelRange(costs, 1, target),
  };
}
