// 모험가 대회 (Mission of Merit) — 매일 시간대별로 활동 카테고리가 바뀌는 일일 이벤트.
// 5개 카테고리(펠몬강화 · 건물레벨업 · 아미고훈련 · 기술연구 · AP소모)가
// 하루 6개 시간대에 순환 배치되며, 요일마다 시작 카테고리가 한 칸씩 밀린다 (5일 사이클).

export type MvMCategoryKey =
  | "palmon"
  | "building"
  | "amigo"
  | "research"
  | "ap";

export interface MvMCategoryMeta {
  key: MvMCategoryKey;
  label: string;
  short: string;
  emoji: string;
  color: string;
  actions: string[];
  tips: string;
}

export const MVM_CATEGORY_ORDER: MvMCategoryKey[] = [
  "palmon",
  "building",
  "amigo",
  "research",
  "ap",
];

export const MVM_CATEGORIES: Record<MvMCategoryKey, MvMCategoryMeta> = {
  palmon: {
    key: "palmon",
    label: "팰몬 강화",
    short: "팰몬",
    emoji: "🐣",
    color: "from-pink-500 to-rose-500",
    actions: ["팰몬 경험치 소모", "스킬열매 · 증표 사용"],
    tips: "부화·강화용 재료를 모아 두었다가 이 시간대에 한번에 쏟아부으면 점수 효율이 좋습니다.",
  },
  building: {
    key: "building",
    label: "건물 레벨업",
    short: "건물",
    emoji: "🏗️",
    color: "from-amber-500 to-orange-500",
    actions: ["건물 가속 사용", "건물 전투력 증가"],
    tips: "이 시간대에 맞춰 긴 건설 큐를 걸어두고 가속을 사용하세요.",
  },
  amigo: {
    key: "amigo",
    label: "아미고 훈련",
    short: "아미고",
    emoji: "⚔️",
    color: "from-emerald-500 to-teal-500",
    actions: ["아미고 훈련", "훈련 가속 사용"],
    tips: "훈련 슬롯을 비워두었다가 이 시간대에 몰아서 훈련하세요.",
  },
  research: {
    key: "research",
    label: "기술 연구",
    short: "기술",
    emoji: "🔬",
    color: "from-cyan-500 to-blue-500",
    actions: ["기술 가속 사용", "기술 전투력 증가"],
    tips: "장기 연구 큐를 걸어두었다가 이 시간대에 가속을 쓰면 점수·연구 진행 둘 다 챙깁니다.",
  },
  ap: {
    key: "ap",
    label: "AP 소모",
    short: "AP",
    emoji: "🍖",
    color: "from-indigo-500 to-purple-500",
    actions: ["AP 소모", "탈것 식량 소모", "첩보 퀘스트 진행"],
    tips: "AP 회복 아이템·탈것 식량을 아껴 두었다가 이 시간대에 소모하세요.",
  },
};

// KST 기준 하루 6개 시간대.
// 게임 서버 시간(UTC−2) 하루 시작이 KST 11:00과 정확히 일치하므로, "점심/오후" 슬롯이 하루의 첫 슬롯이다.
export interface MvMSlot {
  key: string;
  label: string;
  timeRangeKst: string;
  timeRangeServer: string;
  startHourKst: number; // 0-23
  endHourKst: number; // 0-23, exclusive
}

export const MVM_SLOTS: MvMSlot[] = [
  {
    key: "lunch",
    label: "점심 · 오후",
    timeRangeKst: "11:00 ~ 14:59",
    timeRangeServer: "00:00 ~ 03:59",
    startHourKst: 11,
    endHourKst: 15,
  },
  {
    key: "afternoon",
    label: "오후 · 저녁",
    timeRangeKst: "15:00 ~ 18:59",
    timeRangeServer: "04:00 ~ 07:59",
    startHourKst: 15,
    endHourKst: 19,
  },
  {
    key: "evening",
    label: "저녁 · 밤",
    timeRangeKst: "19:00 ~ 22:59",
    timeRangeServer: "08:00 ~ 11:59",
    startHourKst: 19,
    endHourKst: 23,
  },
  {
    key: "night",
    label: "밤 · 새벽",
    timeRangeKst: "23:00 ~ 내일 02:59",
    timeRangeServer: "12:00 ~ 15:59",
    startHourKst: 23,
    endHourKst: 3,
  },
  {
    key: "dawn",
    label: "새벽 · 아침",
    timeRangeKst: "내일 03:00 ~ 06:59",
    timeRangeServer: "16:00 ~ 19:59",
    startHourKst: 3,
    endHourKst: 7,
  },
  {
    key: "morning",
    label: "오전",
    timeRangeKst: "내일 07:00 ~ 10:59",
    timeRangeServer: "20:00 ~ 23:59",
    startHourKst: 7,
    endHourKst: 11,
  },
];

// MvM 순환 앵커.
// 관측(길드대결.모험가대회.xlsx): 2026-08-10(월) MvM day가 '아미고훈련'(index 2)로 시작.
// 5개 카테고리가 매일 하나씩 뒤로 밀리므로, 일주일이 지나면 시작 카테고리가 (7 mod 5 =) 2칸씩 이동.
// 따라서 요일 기준 고정 매핑은 불가 — 앵커 날짜 기준 경과 일수로 계산해야 한다.
const ANCHOR_UTC_MS = Date.UTC(2026, 7, 10, 2, 0, 0); // 2026-08-10 KST 11:00 (MvM day 시작)
const ANCHOR_START_INDEX = 2; // 아미고

// 주어진 시각이 앵커 기준 몇 번째 MvM day인지 반환 (음수 가능).
// MvM day의 경계는 KST 11:00 = UTC 02:00.
function mvmDayNumber(now: Date): number {
  return Math.floor((now.getTime() - ANCHOR_UTC_MS) / (24 * 60 * 60 * 1000));
}

// 특정 시각의 MvM day 시작 카테고리 인덱스.
export function getStartCategoryIndexAt(now: Date): number {
  const day = mvmDayNumber(now);
  const mod = MVM_CATEGORY_ORDER.length;
  return ((ANCHOR_START_INDEX + day) % mod + mod) % mod;
}

// 특정 시각의 특정 슬롯 카테고리.
export function getSlotCategoryAt(now: Date, slotIndex: number): MvMCategoryKey {
  const start = getStartCategoryIndexAt(now);
  return MVM_CATEGORY_ORDER[(start + slotIndex) % MVM_CATEGORY_ORDER.length];
}

export interface MvMDaySlot {
  slot: MvMSlot;
  category: MvMCategoryKey;
}

export interface MvMDay {
  key: string;
  dayIndex: number;
  day: string;
  short: string;
  slots: MvMDaySlot[];
}

const DAY_META: Array<{ key: string; dayIndex: number; day: string; short: string }> = [
  { key: "sun", dayIndex: 0, day: "일요일", short: "일" },
  { key: "mon", dayIndex: 1, day: "월요일", short: "월" },
  { key: "tue", dayIndex: 2, day: "화요일", short: "화" },
  { key: "wed", dayIndex: 3, day: "수요일", short: "수" },
  { key: "thu", dayIndex: 4, day: "목요일", short: "목" },
  { key: "fri", dayIndex: 5, day: "금요일", short: "금" },
  { key: "sat", dayIndex: 6, day: "토요일", short: "토" },
];

// 주어진 시각(now)이 속한 MvM 주(일~토)의 7일 스케줄을 계산.
// 각 요일 카드는 이번 주 해당 요일의 실제 순환 카테고리를 반영한다.
export function buildWeeklySchedule(now: Date = new Date()): MvMDay[] {
  // now가 속한 MvM day의 KST 기준 요일(dow)을 구한다.
  const kst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const kstHour = kst.getHours();
  const mvmDayDate = new Date(kst);
  if (kstHour < 11) {
    mvmDayDate.setDate(mvmDayDate.getDate() - 1);
  }
  const currentDow = mvmDayDate.getDay(); // 0=일 ~ 6=토
  const currentDayNumber = mvmDayNumber(now);
  const mod = MVM_CATEGORY_ORDER.length;

  return DAY_META.map((meta) => {
    // 이번 주에서 이 요일이 현재 요일과 몇 일 차이나는지 (음수 가능)
    const offset = meta.dayIndex - currentDow;
    const dayNum = currentDayNumber + offset;
    const start = ((ANCHOR_START_INDEX + dayNum) % mod + mod) % mod;
    return {
      ...meta,
      slots: MVM_SLOTS.map((slot, i) => ({
        slot,
        category: MVM_CATEGORY_ORDER[(start + i) % mod],
      })),
    };
  });
}

// 정적 export (SSR 초기 렌더용). 클라이언트에서는 buildWeeklySchedule로 갱신 권장.
export const mvmSchedule: MvMDay[] = buildWeeklySchedule();

// GvG 요일 테마 ↔ MvM 카테고리 매칭.
// 두 이벤트 점수를 동시에 올릴 수 있는 "겹치는 시간"을 계산하는 데 사용된다.
// 참고: 팰몬 경험치 소모 = MvM '펠몬강화(palmon)' 카테고리와 동일.
export const GVG_TO_MVM: Record<string, MvMCategoryKey[]> = {
  // 첩보 특훈: AP소모·첩보퀘스트·탈것식량 → ap / 팰몬 경험치 500 소모 → palmon
  mon: ["ap", "palmon"],
  // 캠프 건설: 건설가속 · 건설 전투력
  tue: ["building"],
  // 기술 연구: 기술가속·기술 전투력 → research / 첩보 퀘스트 1개 완료 → ap
  wed: ["research", "ap"],
  // 팰몬 육성: 부화 · 팰몬 경험치 · 증표 · 스킬열매
  thu: ["palmon"],
  // 전투 준비: 훈련가속·아미고훈련 → amigo / 건설 → building / 기술 → research / 첩보퀘스트 → ap
  fri: ["amigo", "building", "research", "ap"],
  // 적군 처치: 건설·기술·훈련 가속 존재 (아미고 처치는 amigo 훈련과 별개지만 훈련 가속은 매칭)
  sat: ["building", "research", "amigo"],
};

// 이번 주 특정 요일의 GvG 겹치는 슬롯을 반환.
// dayIndex는 KST 요일(0=일 ~ 6=토), now는 현재 시각(기본값 new Date()).
export function getGoldenSlots(
  gvgKey: string,
  dayIndex: number,
  now: Date = new Date(),
): MvMDaySlot[] {
  const cats = GVG_TO_MVM[gvgKey] ?? [];
  if (cats.length === 0) return [];
  const week = buildWeeklySchedule(now);
  const day = week.find((d) => d.dayIndex === dayIndex);
  if (!day) return [];
  return day.slots.filter((s) => cats.includes(s.category));
}

// 현재 KST 시각의 요일 인덱스(0=일, 6=토)와, 그 요일 스케줄상 지금이 몇 번째 슬롯인지 계산.
// 밤 슬롯(23~02:59)은 자정을 넘기지만, MvM의 "일차"는 KST 11시에 시작하기 때문에
// 자정~10:59는 여전히 전날의 스케줄에 속한다.
export function resolveCurrentKstContext(now: Date = new Date()): {
  dayIndex: number;
  slotIndex: number;
} {
  const kst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const hour = kst.getHours();
  let dayIndex = kst.getDay();
  // 하루의 시작은 KST 11:00. 그 이전 시각은 전날 일차에 속한다.
  if (hour < 11) {
    dayIndex = (dayIndex + 6) % 7;
  }
  const slotIndex = getSlotIndexFromKstHour(hour);
  return { dayIndex, slotIndex };
}

function getSlotIndexFromKstHour(hour: number): number {
  if (hour >= 11 && hour < 15) return 0;
  if (hour >= 15 && hour < 19) return 1;
  if (hour >= 19 && hour < 23) return 2;
  if (hour >= 23 || hour < 3) return 3;
  if (hour >= 3 && hour < 7) return 4;
  return 5; // 7 ~ 10:59
}

export const mvmMeta = {
  updatedAt: "2026-08-17",
  updatedBy: "코라 #201",
  note: "매일 6개 시간대에 5개 카테고리가 순환. 요일 고정이 아니라 매일 시작 카테고리가 1칸씩 밀리는 5일 주기입니다.",
};

export const mvmRewardsSummary = [
  "고급 성장 자원 (진화 정수 · 오로라 정수 · 팰몬 증표)",
  "가속 아이템 (건설 · 기술 · 훈련 · 의료)",
  "번식 화환 · 스킬열매",
  "황금 잎 · 프레스티지 · 그레늄",
];
