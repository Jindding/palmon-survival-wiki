// 팰몬의 캠프 작업 배치용 스킬·랭크. 팰몬 이름을 키로 매핑.
// 원본 데이터: 유저 관찰 기반. 신규 팰몬은 추후 확장.

export type WorkRank = "S" | "A" | "B";

export interface WorkAttribute {
  workSkill: string;
  workRank: WorkRank;
}

export const workAttributes: Record<string, WorkAttribute> = {
  // 물
  맥시미토: { workSkill: "건설", workRank: "S" },
  미야모아젤: { workSkill: "데빌 몬스터 보상 증가", workRank: "A" },

  // 불
  불카니드: { workSkill: "강철 생산", workRank: "B" },
  와이버노: { workSkill: "연금술 속도", workRank: "B" },
  인시너랩터: { workSkill: "첩보 증가", workRank: "A" },

  // 바위
  서베일링크스: { workSkill: "아미고 훈련", workRank: "A" },
  악솔리움: { workSkill: "수정 채굴", workRank: "B" },
  테라스투도: { workSkill: "광석 생산", workRank: "B" },
  린다니어: { workSkill: "의료", workRank: "B" },
  브루즈베리: { workSkill: "훈련", workRank: "B" },
  헤라클리프: { workSkill: "목판 생산", workRank: "B" },
  서버던트: { workSkill: "벌목", workRank: "B" },

  // 전기
  리뮤로이드: { workSkill: "연구", workRank: "A" },
  불릿볼트: { workSkill: "연구", workRank: "S" },
  로토로터: { workSkill: "골드 생산", workRank: "B" },
  썬더클로: { workSkill: "전력 생산", workRank: "B" },
};

export function getWorkAttribute(name: string): WorkAttribute | undefined {
  return workAttributes[name];
}

export const rankStyles: Record<
  WorkRank,
  { badge: string; label: string; desc: string }
> = {
  S: {
    label: "S",
    desc: "최우선 육성",
    badge:
      "bg-gradient-to-br from-amber-400 to-orange-500 text-white border-amber-500/50",
  },
  A: {
    label: "A",
    desc: "적극 육성",
    badge:
      "bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white border-purple-500/50",
  },
  B: {
    label: "B",
    desc: "기본 육성",
    badge:
      "bg-neutral-500/25 text-neutral-700 dark:text-neutral-200 border-neutral-500/30",
  },
};
