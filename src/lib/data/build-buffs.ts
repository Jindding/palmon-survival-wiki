// 캠프 업그레이드 단축 버프.
//
// 게임 안에는 건설 시간을 줄이거나 자원 소모를 깎는 수단이 여럿 있다.
// 수치와 계산식은 palmon-tool(longchiri)의 것을 그대로 옮겼다.
//
//   시간: floor(기본초 / (1 + 건설속도 합)) - 고정 단축초   (0 미만이면 0)
//   자원: floor(기본값 * max(0, 1 + 자원절감 합))           (절감률은 음수)
//
// 원본은 버프마다 레벨을 고르게 되어 있지만, 이 페이지는 계산기가 아니라 자료 페이지라
// 레벨 선택을 없애고 "켜면 최대 레벨"로 단순화했다. 같은 범주는 하나로 묶는다
// (예: 고효율 건축 I~IV → "건축 연구" 하나).

/** 켜고 끄는 버프. 켜면 해당 범주의 최대 레벨이 한꺼번에 적용된다. */
export interface BuffToggle {
  id: string;
  label: string;
  /** 무엇이 묶여 있는지 한 줄 설명. */
  detail: string;
  /** 건설 속도 증가율 (0.2 = +20%). 자원 버프면 절감률(음수). */
  rate: number;
  /** 고정 단축 분. 건설자의 열정처럼 비율이 아닌 버프. */
  fixedMinutes?: number;
  note?: string;
  /** 이름만 봐도 아는 항목. 도움말 물음표를 달지 않는다. */
  selfEvident?: boolean;
}

/** 여럿 중 하나만 고르는 버프 (직위처럼 동시에 가질 수 없는 것). */
export interface BuffChoice {
  id: string;
  label: string;
  detail: string;
  options: { id: string; label: string; rate: number }[];
  /**
   * "전체 선택"을 눌렀을 때 고를 항목.
   * 보통 가장 높은 것을 잡지만 직위는 총독이 아니라 수석 건축사를 기본으로 둔다.
   */
  selectAllOption: string;
  /** 이름만 봐도 아는 항목. 도움말 물음표를 달지 않는다. */
  selfEvident?: boolean;
}

// ───────── 시간 단축 ─────────

export const TIME_TOGGLES: BuffToggle[] = [
  {
    id: "vip",
    label: "VIP Lv.9",
    // 원본 수치표에서 Lv.9부터 Lv.18까지 전부 +50%다. 더 올려도 건설 속도는 늘지 않는다.
    detail: "Lv.9 이상이면 동일 · +50%",
    rate: 0.5,
  },
  {
    id: "research",
    label: "건축 관련 연구",
    detail: "고효율 건축 I · II · III · IV 만렙 · +20%",
    rate: 0.2,
  },
  {
    id: "permanent",
    label: "영구 혜택",
    detail: "결제 · +30%",
    rate: 0.3,
    selfEvident: true,
  },
  {
    id: "monthly",
    label: "월간 혜택",
    detail: "결제 · +10%",
    rate: 0.1,
    selfEvident: true,
  },
  {
    id: "temple",
    label: "Lv6. 성전 건설 성지",
    detail: "성지 점령 · +20%",
    rate: 0.2,
    selfEvident: true,
  },
  {
    id: "guild",
    label: "길드 기술",
    detail: "초기기술 + 소생기술 만렙 · +4%",
    rate: 0.04,
    selfEvident: true,
  },
  {
    id: "admin",
    label: "관리자 장인",
    detail: "관리자 장인 선택 · +2%",
    rate: 0.02,
  },
];

/**
 * 시즌 스킬. 상시로 켜져 있는 다른 버프와 성격이 달라 따로 묶는다
 * (지속 시간이 있거나, 비율이 아닌 고정 단축이다).
 */
export const SEASON_TOGGLES: BuffToggle[] = [
  {
    id: "passion",
    label: "건설자의 열정",
    detail: "시즌1 만렙 · 180분 고정 단축",
    rate: 0,
    fixedMinutes: 180,
    note: "비율이 아니라 완성 시각을 180분 당겨주는 방식이에요.",
  },
  {
    id: "season_support",
    label: "길드원 건설 지원",
    detail: "시즌1 만렙 · +20%",
    rate: 0.2,
    // 60분은 "버프가 켜져 있는 시간"이지 "적용되는 공사 길이"가 아니다.
    // 그 안에 업그레이드를 시작하기만 하면 공사가 끝날 때까지 계속 붙는다.
    note: "버프 지속 60분 · 쿨타임 23시간 30분. 지속 시간 안에 업그레이드를 시작하면 공사가 끝날 때까지 적용돼요.",
  },
];

export const TIME_CHOICES: BuffChoice[] = [
  {
    id: "position",
    label: "직위",
    detail: "하나만 가질 수 있어요",
    // 총독은 서버에 한 명뿐이라, 전체 선택 시에는 현실적인 수석 건축사를 잡는다.
    selectAllOption: "architect",
    selfEvident: true,
    options: [
      { id: "governor", label: "총독", rate: 0.6 },
      { id: "architect", label: "수석 건축사", rate: 0.5 },
      { id: "scientist", label: "과학자", rate: 0.25 },
      { id: "queen", label: "왕비", rate: 0.2 },
    ],
  },
  {
    id: "templeRole",
    label: "성전 직책",
    detail: "Lv6. 성전 건설 · 하나만",
    selectAllOption: "staff",
    options: [
      { id: "staff", label: "참모", rate: 0.02 },
      { id: "commander", label: "지휘관", rate: 0.01 },
    ],
  },
];

// ───────── 자원 절감 ─────────

export const RESOURCE_TOGGLES: BuffToggle[] = [
  {
    id: "costcut",
    label: "비용 절감",
    detail: "시즌1 만렙 · -5%",
    rate: -0.05,
  },
  {
    id: "craft",
    label: "정교한 공예",
    detail: "연구 만렙 · -2.5%",
    rate: -0.025,
  },
];

// ───────── 합산 · 적용 ─────────

export interface BuffTotals {
  /** 건설 속도 증가율 합. 1.5면 +150%. */
  speedSum: number;
  /** 고정 단축 초. */
  fixedSeconds: number;
  /** 자원 절감률 합 (음수). */
  resourceSum: number;
}

export function sumBuffs(
  activeToggles: ReadonlySet<string>,
  activeChoices: Readonly<Record<string, string | null>>
): BuffTotals {
  let speedSum = 0;
  let fixedSeconds = 0;
  let resourceSum = 0;

  for (const b of [...TIME_TOGGLES, ...SEASON_TOGGLES]) {
    if (!activeToggles.has(b.id)) continue;
    speedSum += b.rate;
    fixedSeconds += Math.round((b.fixedMinutes ?? 0) * 60);
  }

  for (const g of TIME_CHOICES) {
    const picked = activeChoices[g.id];
    if (!picked) continue;
    const opt = g.options.find((o) => o.id === picked);
    if (opt) speedSum += opt.rate;
  }

  for (const b of RESOURCE_TOGGLES) {
    if (activeToggles.has(b.id)) resourceSum += b.rate;
  }

  return { speedSum, fixedSeconds, resourceSum };
}

/** palmon-tool의 applyTimeBuff와 동일. */
export function applyTimeBuff(
  baseSeconds: number | null,
  totals: BuffTotals
): number | null {
  if (baseSeconds === null) return null;
  const sped = Math.floor(baseSeconds / (1 + totals.speedSum));
  return Math.max(0, sped - totals.fixedSeconds);
}

/** palmon-tool의 applyResourceBuff와 동일. */
export function applyResourceBuff(
  baseCost: number | null,
  totals: BuffTotals
): number | null {
  if (baseCost === null) return null;
  const mult = Math.max(0, 1 + totals.resourceSum);
  return Math.max(0, Math.floor(baseCost * mult));
}

/** "전체 선택"이 켜는 항목들. */
export function allBuffSelections(): {
  toggles: Set<string>;
  choices: Record<string, string | null>;
} {
  return {
    toggles: new Set(
      [...TIME_TOGGLES, ...SEASON_TOGGLES, ...RESOURCE_TOGGLES].map((b) => b.id)
    ),
    choices: Object.fromEntries(
      TIME_CHOICES.map((g) => [g.id, g.selectAllOption])
    ),
  };
}

export const buildBuffMeta = {
  /** 수치 출처. 계산식도 이쪽을 그대로 따랐다. */
  source: "palmon-tool (longchiri)",
};
