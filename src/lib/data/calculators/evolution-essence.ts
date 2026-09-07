// 진화 정수 계산기 (기존 팰몬 · 진화 1~4단계)
//
// 기존 팰몬을 진화시킬 때 쓰는 재화가 "진화 정수"다. 단계마다 필요량이 다르고,
// 목표 단계까지 가려면 그 앞 단계 비용이 전부 누적된다.
//   진화 1단계 20 → 2단계 +40 → 3단계 +80 → 4단계 +160 = 4단계 1마리에 총 300
//
// 이미 키운 팰몬을 초기화하면 그 팰몬에 들어갔던 정수를 "누적 비용 그대로" 돌려받는다.
// 즉 진화 4단계 팰몬 1마리를 초기화하면 300개가 통째로 환급된다.
// 그래서 실제 가용량은 [보유량 + 초기화 환급 합계]로 계산해야 한다.
//
// 참고: 시즌 팰몬은 같은 구조에 재화 이름만 "오로라의 정수"로 바뀌고 1~4단계만 존재한다.
//       메가진화(5~8단계)는 "메가 진화석"이라는 별도 재화를 쓰므로 이 계산기 범위 밖이다.

/** 게임 내 진화 정수 아이템 이미지. 메뉴 · 계산기 양쪽에서 쓴다. */
export const EVO_ESSENCE_IMAGE = "/items/evolution-essence.png";

export type EvoStage = 1 | 2 | 3 | 4;

export const EVO_STAGES: EvoStage[] = [1, 2, 3, 4];

export interface EvoStageInfo {
  stage: EvoStage;
  label: string;
  /** 직전 단계에서 이 단계로 올릴 때만 드는 비용 */
  stepCost: number;
  /** 0단계부터 이 단계까지 올리는 데 드는 총 비용 = 초기화 시 환급량 */
  cumulativeCost: number;
}

export const EVO_STAGE_INFO: Record<EvoStage, EvoStageInfo> = {
  1: { stage: 1, label: "진화 1단계", stepCost: 20, cumulativeCost: 20 },
  2: { stage: 2, label: "진화 2단계", stepCost: 40, cumulativeCost: 60 },
  3: { stage: 3, label: "진화 3단계", stepCost: 80, cumulativeCost: 140 },
  4: { stage: 4, label: "진화 4단계", stepCost: 160, cumulativeCost: 300 },
};

/** 진화 4단계(최종) 1마리 완성에 필요한 진화 정수 */
export const EVO_FULL_COST = EVO_STAGE_INFO[4].cumulativeCost;

export type ResetCounts = Record<EvoStage, number>;

export const EMPTY_RESET_COUNTS: ResetCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };

export interface EvoEssenceInput {
  /** 현재 보유 중인 진화 정수 */
  owned: number;
  /** 초기화할 팰몬 수 (단계별) */
  resetCounts: ResetCounts;
  /** 목표 진화 단계 */
  target: EvoStage;
}

export interface RefundRow {
  stage: EvoStage;
  count: number;
  unitRefund: number;
  subtotal: number;
}

export interface AlternativeRow {
  stage: EvoStage;
  count: number;
}

export interface EvoEssenceResult {
  /** 초기화 환급 내역 (0마리인 단계는 제외) */
  refundRows: RefundRow[];
  /** 초기화 환급 합계 */
  refundTotal: number;
  /** 보유 + 환급 */
  total: number;
  /** 목표 단계 1마리당 필요량 */
  perOne: number;
  /** 목표 단계로 완성 가능한 마릿수 */
  count: number;
  /** 완성하고 남는 정수 */
  remain: number;
  /** 1마리도 못 만들 때 모자란 양 (그 외엔 0) */
  shortage: number;
  /** 남은 정수로 추가로 만들 수 있는 다른 단계 (목표 단계 제외) */
  alternatives: AlternativeRow[];
}

/** 음수·NaN 방어. 입력값은 항상 0 이상의 정수로 다룬다. */
function clean(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.floor(n);
}

export function calcEvolutionEssence(input: EvoEssenceInput): EvoEssenceResult {
  const owned = clean(input.owned);

  const refundRows: RefundRow[] = [];
  let refundTotal = 0;
  for (const stage of EVO_STAGES) {
    const count = clean(input.resetCounts[stage]);
    if (count === 0) continue;
    const unitRefund = EVO_STAGE_INFO[stage].cumulativeCost;
    const subtotal = count * unitRefund;
    refundRows.push({ stage, count, unitRefund, subtotal });
    refundTotal += subtotal;
  }

  const total = owned + refundTotal;
  const perOne = EVO_STAGE_INFO[input.target].cumulativeCost;
  const count = Math.floor(total / perOne);
  const remain = total - count * perOne;
  const shortage = count === 0 ? perOne - total : 0;

  // 남는 정수를 다른 단계에 돌리면 몇 마리가 더 나오는지. 목표 단계는 이미 최대로 뽑았으므로 제외.
  const alternatives: AlternativeRow[] = [];
  if (remain > 0) {
    for (const stage of EVO_STAGES) {
      if (stage === input.target) continue;
      const possible = Math.floor(remain / EVO_STAGE_INFO[stage].cumulativeCost);
      if (possible > 0) alternatives.push({ stage, count: possible });
    }
  }

  return {
    refundRows,
    refundTotal,
    total,
    perOne,
    count,
    remain,
    shortage,
    alternatives,
  };
}

export const evolutionEssenceMeta = {
  updatedAt: "2026-09-07",
  updatedBy: "Python #152",
};
