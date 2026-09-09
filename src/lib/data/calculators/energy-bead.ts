// 에너지 구슬 계산기 (진화 조건)
//
// 진화 정수가 "진화에 쓰는 재화"라면, 에너지 구슬은 "다음 진화 단계로 넘어가기 위한 조건"을
// 채우는 재료다. 둘은 별개라 진화하려면 양쪽을 모두 준비해야 한다.
//
// 한 진화 단계는 여러 소단계로 쪼개져 있고, 소단계마다 필요한 구슬 양이 다르다.
// 표에 적힌 값은 소단계 하나를 끝내는 데 드는 총량이며, 실제로는 10번에 나눠 강화한다
// (강화 1회 = 표시값 ÷ 10).
//
// 진화 1~4단계 합계 400,000 + 메가진화 5~8단계와 스킬해금 합계 400,000 = 전체 800,000.

/** 게임 내 에너지 구슬 아이템 이미지 */
export const ENERGY_BEAD_IMAGE = "/items/energy-bead.png";

export type EnergyGroupKey =
  | "evo1"
  | "evo2"
  | "evo3"
  | "evo4"
  | "mega5"
  | "mega6"
  | "mega7"
  | "mega8"
  | "skill";

export interface EnergyStep {
  id: string;
  group: EnergyGroupKey;
  label: string;
  cost: number;
}

/** 진화 1단계 1번부터 메가 스킬해금까지, 게임 진행 순서 그대로 */
export const ENERGY_STEPS: EnergyStep[] = [
  { id: "evo1-1", group: "evo1", label: "진화 1단계 1번", cost: 6000 },
  { id: "evo1-2", group: "evo1", label: "진화 1단계 2번", cost: 7000 },
  { id: "evo1-3", group: "evo1", label: "진화 1단계 3번", cost: 8000 },
  { id: "evo1-4", group: "evo1", label: "진화 1단계 4번", cost: 9000 },

  { id: "evo2-1", group: "evo2", label: "진화 2단계 1번", cost: 9000 },
  { id: "evo2-2", group: "evo2", label: "진화 2단계 2번", cost: 9000 },
  { id: "evo2-3", group: "evo2", label: "진화 2단계 3번", cost: 10000 },
  { id: "evo2-4", group: "evo2", label: "진화 2단계 4번", cost: 10000 },
  { id: "evo2-5", group: "evo2", label: "진화 2단계 5번", cost: 11000 },
  { id: "evo2-6", group: "evo2", label: "진화 2단계 6번", cost: 11000 },

  { id: "evo3-1", group: "evo3", label: "진화 3단계 1번", cost: 12000 },
  { id: "evo3-2", group: "evo3", label: "진화 3단계 2번", cost: 13000 },
  { id: "evo3-3", group: "evo3", label: "진화 3단계 3번", cost: 14000 },
  { id: "evo3-4", group: "evo3", label: "진화 3단계 4번", cost: 15000 },
  { id: "evo3-5", group: "evo3", label: "진화 3단계 5번", cost: 17000 },
  { id: "evo3-6", group: "evo3", label: "진화 3단계 6번", cost: 19000 },

  { id: "evo4-1", group: "evo4", label: "진화 4단계 1번", cost: 22000 },
  { id: "evo4-2", group: "evo4", label: "진화 4단계 2번", cost: 26000 },
  { id: "evo4-3", group: "evo4", label: "진화 4단계 3번", cost: 30000 },
  { id: "evo4-4", group: "evo4", label: "진화 4단계 4번", cost: 38000 },
  { id: "evo4-5", group: "evo4", label: "진화 4단계 5번", cost: 46000 },
  { id: "evo4-6", group: "evo4", label: "진화 4단계 6번", cost: 58000 },

  { id: "mega5-1", group: "mega5", label: "메가진화 5단계 1번", cost: 9000 },
  { id: "mega5-2", group: "mega5", label: "메가진화 5단계 2번", cost: 10000 },
  { id: "mega5-3", group: "mega5", label: "메가진화 5단계 3번", cost: 11000 },

  { id: "mega6-1", group: "mega6", label: "메가진화 6단계 1번", cost: 11000 },
  { id: "mega6-2", group: "mega6", label: "메가진화 6단계 2번", cost: 11500 },
  { id: "mega6-3", group: "mega6", label: "메가진화 6단계 3번", cost: 12000 },
  { id: "mega6-4", group: "mega6", label: "메가진화 6단계 4번", cost: 12500 },
  { id: "mega6-5", group: "mega6", label: "메가진화 6단계 5번", cost: 13000 },

  { id: "mega7-1", group: "mega7", label: "메가진화 7단계 1번", cost: 13000 },
  { id: "mega7-2", group: "mega7", label: "메가진화 7단계 2번", cost: 13500 },
  { id: "mega7-3", group: "mega7", label: "메가진화 7단계 3번", cost: 14000 },
  { id: "mega7-4", group: "mega7", label: "메가진화 7단계 4번", cost: 15000 },
  { id: "mega7-5", group: "mega7", label: "메가진화 7단계 5번", cost: 16500 },
  { id: "mega7-6", group: "mega7", label: "메가진화 7단계 6번", cost: 18000 },

  { id: "mega8-1", group: "mega8", label: "메가진화 8단계 1번", cost: 22000 },
  { id: "mega8-2", group: "mega8", label: "메가진화 8단계 2번", cost: 26000 },
  { id: "mega8-3", group: "mega8", label: "메가진화 8단계 3번", cost: 30000 },
  { id: "mega8-4", group: "mega8", label: "메가진화 8단계 4번", cost: 38000 },
  { id: "mega8-5", group: "mega8", label: "메가진화 8단계 5번", cost: 46000 },

  { id: "skill", group: "skill", label: "메가 스킬해금", cost: 58000 },
];

export interface EnergyGroupInfo {
  key: EnergyGroupKey;
  label: string;
  /** 메가진화 구간인지 (진화 1~4단계와 구분해 표시) */
  isMega: boolean;
  /**
   * 진화 단계 배지에서 켤 날 개수(1~4).
   * 메가진화 5~8단계는 5를 빼서 1~4로 대응시킨다.
   * 스킬해금은 단계가 아니라서 배지가 없다.
   */
  bladeStage?: 1 | 2 | 3 | 4;
  steps: number;
  total: number;
}

export const ENERGY_GROUP_LABELS: Record<EnergyGroupKey, string> = {
  evo1: "진화 1단계",
  evo2: "진화 2단계",
  evo3: "진화 3단계",
  evo4: "진화 4단계",
  mega5: "메가진화 5단계",
  mega6: "메가진화 6단계",
  mega7: "메가진화 7단계",
  mega8: "메가진화 8단계",
  skill: "메가 스킬해금",
};

const MEGA_GROUPS: EnergyGroupKey[] = ["mega5", "mega6", "mega7", "mega8", "skill"];

const BLADE_STAGES: Partial<Record<EnergyGroupKey, 1 | 2 | 3 | 4>> = {
  evo1: 1,
  evo2: 2,
  evo3: 3,
  evo4: 4,
  mega5: 1,
  mega6: 2,
  mega7: 3,
  mega8: 4,
};

/** 단계별 소계. ENERGY_STEPS에서 계산하므로 표와 계산 결과가 어긋날 일이 없다. */
export const ENERGY_GROUPS: EnergyGroupInfo[] = (
  Object.keys(ENERGY_GROUP_LABELS) as EnergyGroupKey[]
).map((key) => {
  const steps = ENERGY_STEPS.filter((s) => s.group === key);
  return {
    key,
    label: ENERGY_GROUP_LABELS[key],
    isMega: MEGA_GROUPS.includes(key),
    bladeStage: BLADE_STAGES[key],
    steps: steps.length,
    total: steps.reduce((sum, s) => sum + s.cost, 0),
  };
});

/** 진화 1~4단계 구간 */
export const ENERGY_EVO_GROUPS = ENERGY_GROUPS.filter((g) => !g.isMega);
/** 메가진화 5~8단계 + 스킬해금 구간 */
export const ENERGY_MEGA_GROUPS = ENERGY_GROUPS.filter((g) => g.isMega);

export const ENERGY_EVO_TOTAL = ENERGY_EVO_GROUPS.reduce(
  (sum, g) => sum + g.total,
  0
);
export const ENERGY_MEGA_TOTAL = ENERGY_MEGA_GROUPS.reduce(
  (sum, g) => sum + g.total,
  0
);
export const ENERGY_TOTAL = ENERGY_EVO_TOTAL + ENERGY_MEGA_TOTAL;

/**
 * 드롭다운용 소단계 목록.
 * 그룹 머리글이 따로 붙으므로 라벨에서 단계명을 떼어 "1번"만 남긴다
 * (스킬해금처럼 뗄 게 없으면 원래 라벨을 그대로 쓴다).
 */
export const ENERGY_STEP_OPTIONS = (() => {
  // 같은 단계 안에서 몇 번째 소단계인지 세어 둔다. 영문 라벨("Step 3")을 만들 때 쓴다.
  const seen = new Map<EnergyGroupKey, number>();
  return ENERGY_STEPS.map((step, index) => {
    const stepNo = (seen.get(step.group) ?? 0) + 1;
    seen.set(step.group, stepNo);
    return {
      index,
      id: step.id,
      group: step.group,
      stepNo,
      cost: step.cost,
      groupLabel: ENERGY_GROUP_LABELS[step.group],
      shortLabel:
        step.label.replace(ENERGY_GROUP_LABELS[step.group], "").trim() ||
        step.label,
    };
  });
})();

/** 강화 1회에 들어가는 양 = 소단계 표시값 ÷ 이 값 */
export const ENERGY_UPGRADES_PER_STEP = 10;

/** 아직 아무것도 완료하지 않은 상태 */
export const ENERGY_START_INDEX = -1;

export interface EnergyInput {
  /** 완료한 마지막 소단계의 인덱스. -1이면 "처음 시작" */
  currentIndex: number;
  /** 목표 소단계의 인덱스 (이 단계까지 완료) */
  targetIndex: number;
  owned: number;
}

export interface EnergyGroupNeed {
  key: EnergyGroupKey;
  label: string;
  need: number;
}

export interface EnergyResult {
  /** 목표가 현재보다 앞이거나 같은 경우 */
  alreadyDone: boolean;
  needed: number;
  owned: number;
  shortage: number;
  surplus: number;
  /** 필요 구간을 진화 단계별로 쪼갠 내역 */
  byGroup: EnergyGroupNeed[];
}

/** 음수·NaN 방어. 입력값은 항상 0 이상의 정수로 다룬다. */
function clean(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.floor(n);
}

export function calcEnergyBeads(input: EnergyInput): EnergyResult {
  const owned = clean(input.owned);
  const from = input.currentIndex + 1;
  const to = input.targetIndex;

  if (to < from) {
    return {
      alreadyDone: true,
      needed: 0,
      owned,
      shortage: 0,
      surplus: owned,
      byGroup: [],
    };
  }

  const byGroupMap = new Map<EnergyGroupKey, number>();
  let needed = 0;
  for (let i = from; i <= to && i < ENERGY_STEPS.length; i++) {
    const step = ENERGY_STEPS[i];
    needed += step.cost;
    byGroupMap.set(step.group, (byGroupMap.get(step.group) ?? 0) + step.cost);
  }

  // ENERGY_GROUPS 순서를 따라야 진행 순서대로 표시된다.
  const byGroup: EnergyGroupNeed[] = ENERGY_GROUPS.filter((g) =>
    byGroupMap.has(g.key)
  ).map((g) => ({
    key: g.key,
    label: g.label,
    need: byGroupMap.get(g.key) ?? 0,
  }));

  return {
    alreadyDone: false,
    needed,
    owned,
    shortage: Math.max(0, needed - owned),
    surplus: Math.max(0, owned - needed),
    byGroup,
  };
}

export const energyBeadMeta = {
  updatedAt: "2026-09-07",
  updatedBy: "Python #152",
};
