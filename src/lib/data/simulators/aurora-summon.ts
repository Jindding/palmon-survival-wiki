// 오로라 소환 시뮬레이터
//
// 신화 팰몬을 뽑는 가챠다. 오로라 구슬 1개로 1회 소환한다.
// 게임 안내문 그대로, 신화 팰몬은 한 번만 획득할 수 있고 그 뒤로는 오로라 정수가 나온다.
// 그래서 확률표가 두 벌이다.
//
//   [미보유] 0.13%로 신화 팰몬이 직접 나온다. 나머지는 아이템이고 친밀도가 쌓인다.
//            친밀도 1200을 채우면 확정 획득 — 이게 천장이다.
//   [보유]   신화 팰몬 자리에 오로라 정수가 들어간다. 친밀도 개념이 없다.
//
// 확률·친밀도 수치는 palmon-tool(github.com/longchiri/palmon-tool)의 확률표를 그대로 옮겼다.
// 주의: 원본 주석의 "총 가중치 10001", "평균 친밀도 1.848"은 실제 데이터와 맞지 않는다.
//       같은 표로 다시 계산하면 각각 10003과 1.2683이 나온다. 여기서는 데이터에서 직접 계산한다.

/** 게임 내 아이템 이미지 */
export const AURORA_ORB_IMAGE = "/items/aurora-orb.png";
export const AURORA_ESSENCE_IMAGE = "/items/aurora-essence.png";

/** 천장. 친밀도가 이 값에 닿으면 신화 팰몬을 확정으로 받는다. */
export const INTIMACY_GOAL = 1200;

export type SummonMode = "noMythic" | "hasMythic";

/** 결과 카드 색. 등급이 높을수록 눈에 띄게 한다. */
export type DropTone = "mythic" | "aurora" | "shard" | "normal";

export interface SummonDrop {
  id: string;
  label: string;
  emoji: string;
  /** 한 번에 몇 개 나오는지 */
  qty: number;
  /** 뽑기 가중치 */
  weight: number;
  /** 표시용 확률(%) */
  pct: number;
  /** 이 아이템으로 오르는 친밀도 (미보유 모드 전용) */
  intimacy?: number;
  /** 신화 팰몬 당첨 항목인지 */
  isMythic?: boolean;
  tone: DropTone;
}

/** 신화 팰몬 미보유 — 0.13%로 직접 획득, 나머지는 친밀도가 쌓인다 */
const NO_MYTHIC_DROPS: SummonDrop[] = [
  { id: "mythic", label: "신화 팰몬", emoji: "⭐", qty: 1, weight: 13, pct: 0.13, intimacy: 0, isMythic: true, tone: "mythic" },
  { id: "shard1", label: "팰몬조각", emoji: "🟡", qty: 1, weight: 1498, pct: 14.98, intimacy: 1, tone: "shard" },
  { id: "shard2", label: "팰몬조각", emoji: "🟡", qty: 2, weight: 499, pct: 4.99, intimacy: 2, tone: "shard" },
  { id: "fruit", label: "스킬열매", emoji: "🌰", qty: 50, weight: 1199, pct: 11.99, intimacy: 2, tone: "normal" },
  { id: "custom", label: "커스텀상자", emoji: "📦", qty: 2, weight: 999, pct: 9.99, intimacy: 2, tone: "normal" },
  { id: "power", label: "전력 보물상자", emoji: "⚡", qty: 2, weight: 999, pct: 9.99, intimacy: 1, tone: "normal" },
  { id: "wood", label: "목판 보물상자", emoji: "🪵", qty: 1, weight: 1199, pct: 11.99, intimacy: 1, tone: "normal" },
  { id: "steel", label: "강철 보물상자", emoji: "⚙️", qty: 1, weight: 1199, pct: 11.99, intimacy: 1, tone: "normal" },
  { id: "gold", label: "골드 보물상자", emoji: "🪙", qty: 1, weight: 1199, pct: 11.99, intimacy: 1, tone: "normal" },
  { id: "expbox", label: "경험치 보물상자", emoji: "🥚", qty: 1, weight: 1199, pct: 11.99, intimacy: 1, tone: "normal" },
];

/** 신화 팰몬 보유 — 팰몬 자리에 오로라 정수가 들어간다. 친밀도는 쌓이지 않는다 */
const HAS_MYTHIC_DROPS: SummonDrop[] = [
  { id: "aurora5", label: "오로라 정수", emoji: "✨", qty: 5, weight: 5, pct: 0.5, tone: "aurora" },
  { id: "aurora2", label: "오로라 정수", emoji: "✨", qty: 2, weight: 30, pct: 3.0, tone: "aurora" },
  { id: "aurora1", label: "오로라 정수", emoji: "✨", qty: 1, weight: 165, pct: 16.5, tone: "aurora" },
  { id: "fruit", label: "스킬열매", emoji: "🌰", qty: 50, weight: 120, pct: 12.0, tone: "normal" },
  { id: "custom", label: "커스텀상자", emoji: "📦", qty: 2, weight: 100, pct: 10.0, tone: "normal" },
  { id: "power", label: "전력 보물상자", emoji: "⚡", qty: 2, weight: 100, pct: 10.0, tone: "normal" },
  { id: "wood", label: "목판 보물상자", emoji: "🪵", qty: 1, weight: 120, pct: 12.0, tone: "normal" },
  { id: "steel", label: "강철 보물상자", emoji: "⚙️", qty: 1, weight: 120, pct: 12.0, tone: "normal" },
  { id: "gold", label: "골드 보물상자", emoji: "🪙", qty: 1, weight: 120, pct: 12.0, tone: "normal" },
  { id: "expbox", label: "경험치 보물상자", emoji: "🥚", qty: 1, weight: 120, pct: 12.0, tone: "normal" },
];

export const SUMMON_DROPS: Record<SummonMode, SummonDrop[]> = {
  noMythic: NO_MYTHIC_DROPS,
  hasMythic: HAS_MYTHIC_DROPS,
};

const TOTAL_WEIGHT: Record<SummonMode, number> = {
  noMythic: NO_MYTHIC_DROPS.reduce((s, d) => s + d.weight, 0),
  hasMythic: HAS_MYTHIC_DROPS.reduce((s, d) => s + d.weight, 0),
};

/**
 * 소환 1회당 평균 친밀도. 신화 당첨 항목은 친밀도가 없으므로 제외한다.
 * 천장까지 몇 번이나 돌려야 하는지 어림잡는 데 쓴다. (약 1.85)
 */
export const AVG_INTIMACY_PER_PULL = NO_MYTHIC_DROPS.filter((d) => !d.isMythic).reduce(
  (sum, d) => sum + (d.intimacy ?? 0) * (d.weight / TOTAL_WEIGHT.noMythic),
  0
);

/** 천장까지 남은 소환 횟수(평균 기준). 실제로는 운에 따라 달라진다. */
export function expectedPullsToCeiling(intimacy: number): number {
  const remain = Math.max(0, INTIMACY_GOAL - intimacy);
  if (remain === 0) return 0;
  return Math.ceil(remain / AVG_INTIMACY_PER_PULL);
}

/** 1회 소환. 가중치 기반 추첨이라 실제 게임과 같은 방식이다. */
export function rollOnce(mode: SummonMode): SummonDrop {
  const drops = SUMMON_DROPS[mode];
  let r = Math.random() * TOTAL_WEIGHT[mode];
  for (const drop of drops) {
    r -= drop.weight;
    if (r < 0) return drop;
  }
  return drops[drops.length - 1];
}

export interface PullOutcome {
  drop: SummonDrop;
  /** 이 소환으로 신화 팰몬을 얻었는지 */
  gotMythic: boolean;
  /** 직접 당첨인지 천장 도달인지 */
  gotBy: "direct" | "ceiling" | null;
  /** 이 소환 직후의 친밀도 */
  intimacy: number;
}

/**
 * 소환 한 번을 진행하고 결과와 갱신된 친밀도를 돌려준다.
 * 보유 모드에서는 친밀도가 오르지 않고 신화도 나오지 않는다.
 */
export function pull(mode: SummonMode, intimacy: number): PullOutcome {
  const drop = rollOnce(mode);

  if (mode === "hasMythic") {
    return { drop, gotMythic: false, gotBy: null, intimacy };
  }

  if (drop.isMythic) {
    return { drop, gotMythic: true, gotBy: "direct", intimacy };
  }

  const next = intimacy + (drop.intimacy ?? 0);
  if (next >= INTIMACY_GOAL) {
    // 아이템도 받고 천장도 함께 터진다.
    return { drop, gotMythic: true, gotBy: "ceiling", intimacy: INTIMACY_GOAL };
  }
  return { drop, gotMythic: false, gotBy: null, intimacy: next };
}

export const auroraSummonMeta = {
  updatedAt: "2026-09-10",
};
