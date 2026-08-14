export interface AchievementStep {
  order: number;
  name: string;
  note?: string;
}

export const achievementsWhy =
  "업적이 전투력 상승에 굉장히 중요한 이유는 다른 능력치와 달리 업적 레벨이 올라갈수록 UR토큰 요구량이 늘어남과 동시에 능력치 상승폭도 그에 맞게 유지되기 때문입니다 (완전 비례는 아니지만 거의 유지됩니다).";

export const earlyRoute: AchievementStep[] = [
  { order: 1, name: "9000돌파 마스터", note: "야옹별 및 보디빌더 해제 조건" },
  { order: 2, name: "야옹별대작전 3" },
  { order: 3, name: "본인 속성 업적 마스터", note: "전투 효율 가장 좋음" },
  {
    order: 4,
    name: "황혼의총아 마스터",
    note: "시즌2부터 가능 · 고에너지폭격 및 강철심장 해제 조건",
  },
];

export const followUpTips: string[] = [
  "위 우선순위 이후에는 야옹별, 크리티컬킬러, 굳건함, 팰몬보호협회, 동글동글, 고에너지폭격, 강철심장 및 신화 · 메가팰몬 조건부 해제 업적을 UR토큰 요구량을 봐가며 골고루 올리세요.",
  "초반 우선순위 루트 이후에는 하나 마스터하고 다음을 마스터하는 방식은 비추천. 골고루 1레벨씩 올리는 편이 스트레스가 덜하고 효율적입니다.",
  "내일의 보디빌더는 2레벨까지만 찍고, 다른 것 다 찍은 뒤 마지막에 더 올리는 것을 추천.",
  "골고루 어느 정도 찍은 후 동글동글 마스터 → 이족보행 친구들 2레벨까지 (보디빌더처럼 마지막에 추가로 올리기).",
];

export interface SpecialNote {
  title: string;
  body: string;
}

export const specialNotes: SpecialNote[] = [
  {
    title: "불바위덱 특이사항",
    body: "불과 바위를 둘 다 쓰므로 우선순위 루트에서 소우주를 먼저 마스터하고, 이후 다른 것들과 함께 지표면사이클론도 같이 올려 마스터해야 합니다.",
  },
];

export const achievementsMeta = {
  updatedAt: "2026-06-11",
  updatedBy: "TechBoy (69서버)",
};
