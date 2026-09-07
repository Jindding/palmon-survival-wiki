// UR 만능 팰몬조각 계산기 (승급)
//
// 팰몬을 승급시킬 때 쓰는 재화가 "UR 만능 팰몬조각"이다.
// 진화가 단계(1~4단계)로 나뉘는 것과 달리, 승급은 성급(★1~★5)으로 나뉜다.
// 성급을 올릴 때마다 조각이 들어가고 앞 성급 비용이 그대로 누적된다.
//   ★1 25 → ★2 +50 → ★3 +100 → ★4 +300 → ★5 +500 = 5성 1마리에 총 975
//
// 진화 정수와 짝을 이루는 재화라, 실제 "풀세팅" 마릿수는
// [승급 가능 마릿수]와 [진화 가능 마릿수] 중 작은 쪽이 된다.

/** 게임 내 UR 만능 팰몬조각 아이템 이미지 */
export const PALMON_SHARD_IMAGE = "/items/palmon-shard.png";

export type StarRank = 1 | 2 | 3 | 4 | 5;

export const STAR_RANKS: StarRank[] = [1, 2, 3, 4, 5];

export interface StarRankInfo {
  rank: StarRank;
  label: string;
  /** 직전 성급에서 이 성급으로 올릴 때만 드는 조각 수 */
  stepCost: number;
  /** 0성부터 이 성급까지 올리는 데 드는 총 조각 수 */
  cumulativeCost: number;
}

const STEP_COSTS: Record<StarRank, number> = {
  1: 25,
  2: 50,
  3: 100,
  4: 300,
  5: 500,
};

export const STAR_RANK_INFO: Record<StarRank, StarRankInfo> = (() => {
  const out = {} as Record<StarRank, StarRankInfo>;
  let running = 0;
  for (const rank of STAR_RANKS) {
    running += STEP_COSTS[rank];
    out[rank] = {
      rank,
      label: `${rank}성`,
      stepCost: STEP_COSTS[rank],
      cumulativeCost: running,
    };
  }
  return out;
})();

/** 5성(최종) 1마리 완성에 필요한 조각 수 */
export const SHARD_PER_PALMON = STAR_RANK_INFO[5].cumulativeCost;

export interface ShardInput {
  owned: number;
  /** 목표 성급 */
  target: StarRank;
}

export interface ShardAlternative {
  rank: StarRank;
  count: number;
}

export interface ShardResult {
  owned: number;
  /** 목표 성급 1마리당 필요 조각 수 */
  perOne: number;
  /** 목표 성급으로 완성 가능한 마릿수 */
  count: number;
  /** 완성하고 남는 조각 */
  remain: number;
  /** 1마리도 못 만들 때 모자란 양 (그 외엔 0) */
  shortage: number;
  /** 다음 1마리까지 더 모아야 하는 조각 */
  toNext: number;
  /** 남은 조각으로 추가로 만들 수 있는 다른 성급 (목표 성급 제외) */
  alternatives: ShardAlternative[];
}

/** 음수·NaN 방어. 입력값은 항상 0 이상의 정수로 다룬다. */
function clean(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.floor(n);
}

export function calcPalmonShard(input: ShardInput): ShardResult {
  const owned = clean(input.owned);
  const perOne = STAR_RANK_INFO[input.target].cumulativeCost;
  const count = Math.floor(owned / perOne);
  const remain = owned - count * perOne;

  // 남는 조각을 다른 성급에 돌리면 몇 마리가 더 나오는지. 목표 성급은 이미 최대로 뽑았으므로 제외.
  const alternatives: ShardAlternative[] = [];
  if (remain > 0) {
    for (const rank of STAR_RANKS) {
      if (rank === input.target) continue;
      const possible = Math.floor(remain / STAR_RANK_INFO[rank].cumulativeCost);
      if (possible > 0) alternatives.push({ rank, count: possible });
    }
  }

  return {
    owned,
    perOne,
    count,
    remain,
    shortage: count === 0 ? perOne - owned : 0,
    toNext: perOne - remain,
    alternatives,
  };
}

export const palmonShardMeta = {
  updatedAt: "2026-09-07",
  updatedBy: "Python #152",
};
