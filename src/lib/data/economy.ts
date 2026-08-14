export interface CurrencyRate {
  name: string;
  krw: number;
  priority?: number;
}

export const currencyRates: CurrencyRate[] = [
  { name: "개선훈장", krw: 75 },
  { name: "타이탄인장", krw: 150 },
  { name: "황금편자", krw: 375, priority: 5 },
  { name: "만능조각", krw: 750, priority: 4 },
  { name: "걸작구슬", krw: 750, priority: 2 },
  { name: "장비결정", krw: 750, priority: 3 },
  { name: "오로라구슬", krw: 1000, priority: 1 },
  { name: "진화정수", krw: 1500 },
  { name: "팰몬캐쳐", krw: 1500 },
  { name: "블룸스톤", krw: 2500 },
  { name: "오로라정수", krw: 4000, priority: 1 },
];

export const dollarComparison =
  "$1 = 황금편자 4개 = 만능조각 2개 = 걸작구슬 2개 = 장비결정 2개 = 진화정수 1개 = 팰몬캐쳐 1개 = 오로라구슬 1.5개 = 오로라정수 0.375개 = 타이탄인장 10개 = 블룸스톤 0.6개";

export const spendingPriority: string[] = [
  "오로라구슬 및 정수",
  "걸작구슬",
  "장비결정",
  "만능조각",
  "황금편자",
];

export const spendingTips: string[] = [
  "게임 초반에는 2 · 4주 간격으로 판매되는 각종 패스권으로 재화와 진화정수를 수급하세요.",
  "소중과금 이상: 시즌1부터 판매되는 오로라구슬 10개 일일패키지 매일 구매 + 일요일 걸작구슬 패키지 3회 매주 구매.",
  "소중과금 이상 필수 패스: 블랙잭 월간 패스권 (7개월 존버하여 캠프스킨 or 걸작구슬).",
  "중과금 이상 강추 패스: 운명의 룰렛 주간 패스권. UR선택상자로 육성 팰몬을 최대치까지 올리고 만능조각은 신화팰몬에만 쓰고 업적 몰빵.",
  "걸작구슬 · 황금편자 · 진화정수는 초기화 후 재사용 가능하지만, 팰몬 진화에 사용한 만능조각은 절대 되돌아오지 않습니다. 별 올리기보다 업적에 우선 사용하세요.",
  "그 외 패키지는 구매 전 반드시 환율표 기준으로 가치를 계산할 것.",
];

export interface SpendingTier {
  level: string;
  goal: string;
  packages: string[];
}

export const spendingTiers: SpendingTier[] = [
  {
    level: "초소과금",
    goal: "시즌1 종료 시 신화팰몬 1마리 명함 획득 (2단계 진화 가능)",
    packages: ["시즌패스권 (2회 판매)", "오프시즌 패스권", "주간 패스권"],
  },
  {
    level: "소중과금",
    goal: "시즌1 종료 시 신화팰몬 1마리 풀진화 가능",
    packages: ["초소과금 항목 전부", "$5 일일패키지 극야의빛1 (오로라구슬 10개) 매일"],
  },
  {
    level: "중고과금",
    goal: "시즌1 종료 시 신화팰몬 2마리 풀진화 가능",
    packages: ["소중과금 항목 전부", "$10 일일패키지 극야의빛2 (오로라구슬 15개) 매일"],
  },
];

export interface EventEfficiencyTip {
  name: string;
  emoji: string;
  tips: string[];
}

export const eventEfficiency: EventEfficiencyTip[] = [
  {
    name: "행운의 룰렛",
    emoji: "🎰",
    tips: [
      "패스권 반드시 구매",
      "일주일 토큰 200개 이상 → 200회 돌려 200회 보상 획득",
      "일주일 토큰 200개 미만 → 100회만 돌리고 남은 토큰은 다음 주로 이월",
    ],
  },
  {
    name: "블랙잭",
    emoji: "🃏",
    tips: [
      "패스권 반드시 구매",
      "룰 완전 숙지 시 매달 4만~4만5천 포인트 획득 가능",
      "7개월간 30만 포인트 → 캠프스킨 구매 (약 $100 이득) 또는 걸작구슬 교환",
    ],
  },
];

export const economyMeta = {
  updatedAt: "2026-06-22",
  updatedBy: "TechBoy (69서버)",
  source: "환율표: 코드님 (타이탄인장 · 블룸스톤 추가)",
};
