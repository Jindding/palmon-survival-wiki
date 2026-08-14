export interface Mission {
  name: string;
  score: number;
  scoreAlt?: number;
  note?: string;
}

export interface MissionGroup {
  title: string;
  note?: string;
  columns?: [string, string];
  missions: Mission[];
}

export interface GvGDay {
  key: string;
  dayIndex: number;
  day: string;
  short: string;
  theme: string;
  emoji: string;
  color: string;
  missions: Mission[];
  groups?: MissionGroup[];
}

export const gvgSchedule: GvGDay[] = [
  {
    key: "mon",
    dayIndex: 1,
    day: "월요일",
    short: "월",
    theme: "첩보 특훈",
    emoji: "🕵️",
    color: "from-indigo-500 to-purple-500",
    missions: [
      { name: "1 AP 소모", score: 300 },
      { name: "첩보퀘스트 1개", score: 28_200 },
      { name: "팰몬 경험치 500 소모", score: 2 },
      { name: "탈것식량 100개 소모", score: 6 },
      { name: "황금편자 1개 소모", score: 5_000 },
      { name: "골드 100 채집", score: 40 },
      { name: "목판 100 채집", score: 40 },
      { name: "강철 100 채집", score: 40 },
      { name: "신기한완두 1개 획득", score: 600 },
    ],
  },
  {
    key: "tue",
    dayIndex: 2,
    day: "화요일",
    short: "화",
    theme: "캠프 건설",
    emoji: "🏗️",
    color: "from-amber-500 to-orange-500",
    missions: [
      { name: "건설가속 1분 사용", score: 118 },
      { name: "건설 전투력 1 증가", score: 10 },
      { name: "UR 비행선 1회 파견", score: 200_000 },
      { name: "레전드 보물찾기 1개", score: 150_000 },
      { name: "신기한완두 1개 획득", score: 600 },
    ],
  },
  {
    key: "wed",
    dayIndex: 3,
    day: "수요일",
    short: "수",
    theme: "기술 연구",
    emoji: "🔬",
    color: "from-cyan-500 to-blue-500",
    missions: [
      { name: "기술가속 1분 사용", score: 118 },
      { name: "기술 전투력 1 증가", score: 10 },
      { name: "개선훈장 1개 소모", score: 600 },
      { name: "첩보 퀘스트 1개 완료", score: 28_200 },
      { name: "신기한 원두 1개 획득", score: 600 },
      { name: "번식 레전드 화환 1개 사용", score: 300_000 },
      { name: "번식 에픽 화환 1개 사용", score: 100_000 },
      { name: "번식 노멀 화환 1개 사용", score: 20_000 },
      { name: "개인번식기지 1분 가속", score: 118 },
    ],
  },
  {
    key: "thu",
    dayIndex: 4,
    day: "목요일",
    short: "목",
    theme: "팰몬 육성",
    emoji: "🐣",
    color: "from-pink-500 to-rose-500",
    missions: [
      { name: "팰몬알 1회 부화", score: 6_900 },
      { name: "팰몬 경험치 500 소모", score: 2 },
      { name: "UR팰몬 증표 1개 사용", score: 20_000 },
      { name: "SSR팰몬 증표 1개 사용", score: 8_000 },
      { name: "SR팰몬 증표 1개 사용", score: 4_000 },
      { name: "레전드 스킬열매 1개 사용", score: 200 },
      { name: "에픽 스킬열매 1개 사용", score: 80 },
      { name: "레어 스킬열매 1개 사용", score: 40 },
      { name: "신기한완두 1개 획득", score: 600 },
    ],
  },
  {
    key: "fri",
    dayIndex: 5,
    day: "금요일",
    short: "금",
    theme: "전투 준비",
    emoji: "🛡️",
    color: "from-emerald-500 to-teal-500",
    missions: [
      { name: "첩보퀘스트 1개", score: 28_200 },
      { name: "건설 가속 1분 사용", score: 118 },
      { name: "건설 전투력 1 증가", score: 10 },
      { name: "기술 가속 1분 사용", score: 118 },
      { name: "기술 전투력 1 증가", score: 10 },
      { name: "훈련 가속 1분 사용", score: 118 },
      { name: "신기한완두 1개 획득", score: 600 },
      { name: "진화 정수 1개 사용", score: 20_000 },
      { name: "4대속성 에너지 1개 사용", score: 4 },
      { name: "오로라 정수 1개 사용", score: 20_000 },
    ],
    groups: [
      {
        title: "아미고 훈련 (레벨별)",
        missions: [
          { name: "Lv.1 아미고 훈련", score: 69 },
          { name: "Lv.2 아미고 훈련", score: 83 },
          { name: "Lv.3 아미고 훈련", score: 97 },
          { name: "Lv.4 아미고 훈련", score: 110 },
          { name: "Lv.5 아미고 훈련", score: 124 },
          { name: "Lv.6 아미고 훈련", score: 138 },
          { name: "Lv.7 아미고 훈련", score: 166 },
          { name: "Lv.8 아미고 훈련", score: 207 },
          { name: "Lv.9 아미고 훈련", score: 253 },
        ],
      },
    ],
  },
  {
    key: "sat",
    dayIndex: 6,
    day: "토요일",
    short: "토",
    theme: "적군 처치",
    emoji: "⚔️",
    color: "from-red-500 to-orange-600",
    missions: [
      { name: "UR 비행선 1회 파견", score: 200_000 },
      { name: "레전드 보물찾기 1개", score: 150_000 },
      { name: "건설 가속 1분 사용", score: 118 },
      { name: "기술 가속 1분 사용", score: 118 },
      { name: "훈련 가속 1분 사용", score: 118 },
      { name: "의료 가속 1분 사용", score: 118 },
      { name: "신기한완두 1개 획득", score: 600 },
    ],
    groups: [
      {
        title: "타인 아미고 처치 (공격)",
        note: "특정 길드 매칭 / 비특정 길드 매칭",
        columns: ["특정 매칭", "비특정 매칭"],
        missions: [
          { name: "Lv.1 아미고 처치", score: 36, scoreAlt: 7 },
          { name: "Lv.2 아미고 처치", score: 43, scoreAlt: 10 },
          { name: "Lv.3 아미고 처치", score: 50, scoreAlt: 12 },
          { name: "Lv.4 아미고 처치", score: 58, scoreAlt: 14 },
          { name: "Lv.5 아미고 처치", score: 65, scoreAlt: 17 },
          { name: "Lv.6 아미고 처치", score: 72, scoreAlt: 19 },
          { name: "Lv.7 아미고 처치", score: 86, scoreAlt: 22 },
          { name: "Lv.8 아미고 처치", score: 108, scoreAlt: 24 },
          { name: "Lv.9 아미고 처치", score: 132, scoreAlt: 26 },
        ],
      },
      {
        title: "아군 아미고 사망 (방어)",
        note: "타인이 우리 아미고 처치 시 획득 점수",
        missions: [
          { name: "Lv.1 아미고 사망", score: 12 },
          { name: "Lv.2 아미고 사망", score: 16 },
          { name: "Lv.3 아미고 사망", score: 20 },
          { name: "Lv.4 아미고 사망", score: 24 },
          { name: "Lv.5 아미고 사망", score: 28 },
          { name: "Lv.6 아미고 사망", score: 32 },
          { name: "Lv.7 아미고 사망", score: 36 },
          { name: "Lv.8 아미고 사망", score: 40 },
          { name: "Lv.9 아미고 사망", score: 44 },
        ],
      },
    ],
  },
];

export const gvgMeta = {
  updatedAt: "2026-08-11",
  updatedBy: "코라 #201",
  note: "GvG는 주 6일(월~토) 요일별 테마로 진행됩니다. 일요일은 GvG 미션이 없습니다.",
};
