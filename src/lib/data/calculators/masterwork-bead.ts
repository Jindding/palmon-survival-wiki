// 걸작구슬 계산기 (무기 승급)
//
// 무기의 성급(★)을 올릴 때 쓰는 재화가 "걸작구슬"이다.
// 팰몬 승급과 달리 ★10까지 있고, 성급이 오를수록 앞 성급 비용이 그대로 누적된다.
//   ★1 10 → ★2 +20 → ★3 +30 → ★4 +40 → ★5 +50 → ★6 +75 → ★7 +100 → ★8 +200 → ★9 +300 → ★10 +500
//
// 이미 올린 무기를 초기화하면 들어간 구슬을 누적 비용 그대로 돌려받으므로,
// 실제 가용량은 [보유량 + 초기화 환급 합계]로 계산해야 한다. (진화 정수와 같은 구조)

/** 게임 내 걸작구슬 아이템 이미지 */
export const MASTERWORK_BEAD_IMAGE = "/items/masterwork-bead.png";

export const BEAD_MAX_RANK = 10;

export interface BeadRankInfo {
  rank: number;
  label: string;
  /** 직전 성급에서 이 성급으로 올릴 때만 드는 구슬 수 */
  stepCost: number;
  /** 0성부터 이 성급까지 올리는 데 드는 총 구슬 수 = 초기화 시 환급량 */
  cumulativeCost: number;
}

const STEP_COSTS = [10, 20, 30, 40, 50, 75, 100, 200, 300, 500];

export const BEAD_RANKS: number[] = STEP_COSTS.map((_, i) => i + 1);

export const BEAD_RANK_INFO: Record<number, BeadRankInfo> = (() => {
  const out: Record<number, BeadRankInfo> = {};
  let running = 0;
  STEP_COSTS.forEach((stepCost, i) => {
    const rank = i + 1;
    running += stepCost;
    out[rank] = {
      rank,
      label: `${rank}성`,
      stepCost,
      cumulativeCost: running,
    };
  });
  return out;
})();

/** 원본 도구가 기준으로 삼는 "무기 1개 완성" = 5성 누적 */
export const BEAD_PER_WEAPON = BEAD_RANK_INFO[5].cumulativeCost;

export type BeadResetCounts = Record<number, number>;

export interface BeadInput {
  owned: number;
  /** 초기화할 무기 수 (성급별) */
  resetCounts: BeadResetCounts;
  /** 목표 성급 */
  target: number;
}

export interface BeadRefundRow {
  rank: number;
  count: number;
  unitRefund: number;
  subtotal: number;
}

export interface BeadAlternative {
  rank: number;
  count: number;
}

export interface BeadResult {
  refundRows: BeadRefundRow[];
  refundTotal: number;
  /** 보유 + 환급 */
  total: number;
  /** 목표 성급 무기 1개당 필요 구슬 */
  perOne: number;
  /** 목표 성급으로 완성 가능한 무기 수 */
  count: number;
  remain: number;
  /** 1개도 못 만들 때 모자란 양 (그 외엔 0) */
  shortage: number;
  /** 다음 1개까지 더 모아야 하는 구슬 */
  toNext: number;
  /** 남은 구슬로 추가로 만들 수 있는 다른 성급 (목표 성급 제외) */
  alternatives: BeadAlternative[];
}

/** 음수·NaN 방어. 입력값은 항상 0 이상의 정수로 다룬다. */
function clean(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.floor(n);
}

export function calcMasterworkBead(input: BeadInput): BeadResult {
  const owned = clean(input.owned);

  const refundRows: BeadRefundRow[] = [];
  let refundTotal = 0;
  for (const rank of BEAD_RANKS) {
    const count = clean(input.resetCounts[rank]);
    if (count === 0) continue;
    const unitRefund = BEAD_RANK_INFO[rank].cumulativeCost;
    const subtotal = count * unitRefund;
    refundRows.push({ rank, count, unitRefund, subtotal });
    refundTotal += subtotal;
  }

  const total = owned + refundTotal;
  const perOne = BEAD_RANK_INFO[input.target].cumulativeCost;
  const count = Math.floor(total / perOne);
  const remain = total - count * perOne;

  // 남는 구슬을 다른 성급에 돌리면 몇 개가 더 나오는지. 목표 성급은 이미 최대로 뽑았으므로 제외.
  const alternatives: BeadAlternative[] = [];
  if (remain > 0) {
    for (const rank of BEAD_RANKS) {
      if (rank === input.target) continue;
      const possible = Math.floor(remain / BEAD_RANK_INFO[rank].cumulativeCost);
      if (possible > 0) alternatives.push({ rank, count: possible });
    }
  }

  return {
    refundRows,
    refundTotal,
    total,
    perOne,
    count,
    remain,
    shortage: count === 0 ? perOne - total : 0,
    toNext: perOne - remain,
    alternatives,
  };
}

export const masterworkBeadMeta = {
  updatedAt: "2026-09-08",
};
