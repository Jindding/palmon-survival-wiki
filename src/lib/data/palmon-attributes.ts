export type PalmonElement = "물" | "불" | "바위" | "전기" | "미분류";
export type WorkRank = "S" | "A" | "B";

export interface PalmonAttribute {
  element: PalmonElement;
  workSkill?: string;
  workRank?: WorkRank;
}

export const palmonAttributes: Record<string, PalmonAttribute> = {
  // 물
  "CH_AD_21176_10": { element: "물" }, // 닌점프
  "CH_AD_21176_42": { element: "물" }, // 돌피렌드
  "CH_AD_21176_38": { element: "물" }, // 핀제뉴
  "CH_AD_21176_32": { element: "물" }, // 루시디아
  "CH_AD_21176_21": { element: "물" }, // 스퀴즐
  "CH_AD_21176_23": { element: "물", workSkill: "건설", workRank: "S" }, // 맥시미토
  "CH_AD_21176_8":  { element: "물" }, // 스노우카미
  "CH_AD_21176_7":  { element: "물" }, // 플래티푸츠
  "CH_AD_21176_20": { element: "물", workSkill: "데빌 몬스터 보상 증가", workRank: "A" }, // 미야모아젤
  "CH_AD_21176_4":  { element: "물" }, // 아우타이크

  // 불
  "CH_AD_21176_72": { element: "불" }, // 레본투렛
  "CH_AD_21176_27": { element: "불", workSkill: "강철 생산", workRank: "B" }, // 불카니드
  "CH_AD_21176_50": { element: "불" }, // 블레질
  "CH_AD_21176_60": { element: "불" }, // 마그몰린
  "CH_AD_21176_24": { element: "불" }, // 엠보아
  "CH_AD_21176_5":  { element: "불", workSkill: "연금술 속도", workRank: "B" }, // 와이버노
  "CH_AD_21176_30": { element: "불", workSkill: "첩보 증가", workRank: "A" }, // 인시너랩터
  "CH_AD_21176_62": { element: "불" }, // 후피릿

  // 바위
  "CH_AD_21176_52": { element: "바위", workSkill: "아미고 훈련", workRank: "A" }, // 서베일링크스
  "CH_AD_21176_56": { element: "바위" }, // 바붐
  "CH_AD_21176_48": { element: "바위" }, // 스태츄
  "CH_AD_21176_40": { element: "바위" }, // 길런트
  "CH_AD_21176_85": { element: "바위", workSkill: "수정 채굴", workRank: "B" }, // 악솔리움
  "CH_AD_21176_14": { element: "바위", workSkill: "광석 생산", workRank: "B" }, // 테라스투도
  "CH_AD_21176_13": { element: "바위", workSkill: "의료", workRank: "B" }, // 린다니어
  "CH_AD_21176_17": { element: "바위", workSkill: "훈련", workRank: "B" }, // 브루즈베리
  "CH_AD_21176_15": { element: "바위" }, // 스핀칠라
  "CH_AD_21176_9":  { element: "바위" }, // 플루팡
  "CH_AD_21176_29": { element: "바위", workSkill: "목판 생산", workRank: "B" }, // 헤라클리프
  "CH_AD_21176_64": { element: "바위" }, // 살라맨티스
  "CH_AD_21176_22": { element: "바위", workSkill: "벌목", workRank: "B" }, // 서버던트

  // 전기
  "CH_AD_21176_74": { element: "전기" }, // 배터레이나
  "CH_AD_21176_66": { element: "전기", workSkill: "연구", workRank: "A" }, // 리뮤드로이드
  "CH_AD_21176_25": { element: "전기" }, // 아버즈니안
  "CH_AD_21176_45": { element: "전기" }, // 맨틀레이
  "CH_AD_21176_34": { element: "전기" }, // 바크플러그
  "CH_AD_21176_84": { element: "전기", workSkill: "연구", workRank: "S" }, // 불릿볼트
  "CH_AD_21176_79": { element: "전기", workSkill: "골드 생산", workRank: "B" }, // 로토로터
  "CH_AD_21176_16": { element: "전기", workSkill: "전력 생산", workRank: "B" }, // 썬더클로
  "CH_AD_21176_31": { element: "전기" }, // 킬로홉

  // 추가 분류
  "CH_AD_21176_18": { element: "바위" }, // 그래키티
  "CH_AD_21176_68": { element: "물" },   // 레갈리온
  "CH_AD_21176_77": { element: "불" },   // 에스카피에
};

export const elementStyles: Record<PalmonElement, { label: string; badge: string; ring: string; emoji: string }> = {
  "물":    { label: "물",    emoji: "💧", badge: "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30",       ring: "ring-sky-400/40" },
  "불":    { label: "불",    emoji: "🔥", badge: "bg-red-500/15 text-red-600 dark:text-red-300 border-red-500/30",       ring: "ring-red-400/40" },
  "바위":  { label: "바위",  emoji: "🪨", badge: "bg-stone-500/20 text-stone-700 dark:text-stone-300 border-stone-500/30", ring: "ring-stone-400/40" },
  "전기":  { label: "전기",  emoji: "⚡", badge: "bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-500/30", ring: "ring-amber-400/40" },
  "미분류": { label: "미분류", emoji: "❔", badge: "bg-neutral-500/15 text-neutral-600 dark:text-neutral-300 border-neutral-500/30", ring: "ring-neutral-400/30" },
};

export const rankStyles: Record<WorkRank, { badge: string; label: string; desc: string }> = {
  S: { label: "S", desc: "최우선 육성", badge: "bg-gradient-to-br from-amber-400 to-orange-500 text-white border-amber-500/50" },
  A: { label: "A", desc: "적극 육성",   badge: "bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white border-purple-500/50" },
  B: { label: "B", desc: "기본 육성",   badge: "bg-neutral-500/25 text-neutral-700 dark:text-neutral-200 border-neutral-500/30" },
};

export function getAttribute(objectId: string): PalmonAttribute {
  return palmonAttributes[objectId] ?? { element: "미분류" };
}
