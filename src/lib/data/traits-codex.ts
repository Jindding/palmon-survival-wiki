export type TraitTier = "S" | "A" | "B";

export interface Trait {
  name: string;
  value: string;
}

export interface StatGroup {
  stat: string;
  traits: Trait[];
}

export interface CombatLine {
  id: string;
  name: string;
  role: string;
  emoji: string;
  color: string;
  stats: StatGroup[];
}

export interface WorkTrait {
  tier: TraitTier;
  name: string;
  value: string;
  note?: string;
}

export interface WorkGroup {
  id: string;
  work: string;
  emoji: string;
  facility?: string;
  traits: WorkTrait[];
}

export interface SubTrait {
  name: string;
  effect: string;
  priority: 1 | 2 | 3;
  tiers: { tier: TraitTier; value: string }[];
}

export const combatLines: CombatLine[] = [
  {
    id: "front",
    name: "앞라인",
    role: "버퍼 · 탱커 (방어 · 생존)",
    emoji: "🛡️",
    color: "from-blue-500 to-cyan-500",
    stats: [
      {
        stat: "HP",
        traits: [
          { name: "생기발랄", value: "+10%" },
          { name: "생존주의자", value: "+7%" },
        ],
      },
      {
        stat: "방어력",
        traits: [
          { name: "확고한 의지", value: "+10%" },
          { name: "태생탱커", value: "+7%" },
        ],
      },
      {
        stat: "강인함",
        traits: [
          { name: "강철심장", value: "+8%" },
          { name: "불굴의 의지", value: "+5%" },
        ],
      },
      {
        stat: "치명타대미지 경감",
        traits: [
          { name: "용감함", value: "+15%" },
          { name: "통뼈", value: "+8%" },
        ],
      },
      {
        stat: "스턴저항",
        traits: [{ name: "냉철한", value: "+7%" }],
      },
      {
        stat: "회피",
        traits: [{ name: "숨바꼭질 달인", value: "+5%" }],
      },
    ],
  },
  {
    id: "back",
    name: "뒷라인",
    role: "공격 팰몬 (치명 · 딜링)",
    emoji: "🎯",
    color: "from-red-500 to-orange-500",
    stats: [
      {
        stat: "치명타 대미지",
        traits: [
          { name: "약점킬러", value: "+15%" },
          { name: "악역", value: "+8%" },
        ],
      },
      {
        stat: "치명타 확률",
        traits: [
          { name: "종결자", value: "+8%" },
          { name: "행운아", value: "+5%" },
        ],
      },
      {
        stat: "공격력",
        traits: [
          { name: "용맹한 마음", value: "+10%" },
          { name: "파괴왕", value: "+7%" },
        ],
      },
      {
        stat: "명중률",
        traits: [
          { name: "백발백중", value: "+8%" },
          { name: "천리안", value: "+5%" },
        ],
      },
    ],
  },
];

export const workGroups: WorkGroup[] = [
  {
    id: "build",
    work: "건축시간",
    emoji: "🔨",
    facility: "캠프 (건설)",
    traits: [
      { tier: "S", name: "건축의별", value: "900초 감소" },
      { tier: "A", name: "건축의별", value: "300초 감소" },
      { tier: "B", name: "건축의별", value: "120초 감소" },
    ],
  },
  {
    id: "research",
    work: "연구시간",
    emoji: "🔬",
    facility: "연구대 (연구)",
    traits: [
      { tier: "S", name: "신동", value: "900초 감소" },
      { tier: "A", name: "신동", value: "300초 감소" },
      { tier: "B", name: "신동", value: "120초 감소" },
    ],
  },
  {
    id: "train",
    work: "훈련속도",
    emoji: "⚔️",
    facility: "아미고 기지 (훈련)",
    traits: [
      { tier: "S", name: "코치", value: "8% 가속" },
      { tier: "A", name: "코치", value: "4% 가속" },
      { tier: "B", name: "코치", value: "2% 가속" },
    ],
  },
  {
    id: "heal",
    work: "의료시간",
    emoji: "💊",
    facility: "병원 (치료)",
    traits: [
      { tier: "S", name: "기적의손", value: "8% 가속" },
      { tier: "A", name: "기적의손", value: "4% 가속" },
      { tier: "B", name: "기적의손", value: "2% 가속" },
    ],
  },
  {
    id: "wood",
    work: "목판가공",
    emoji: "🪚",
    facility: "테이블쏘",
    traits: [
      { tier: "S", name: "나무 분쇄자", value: "+30%" },
      { tier: "A", name: "모범노동자", value: "+10%" },
      { tier: "B", name: "공방전문가", value: "+5%" },
    ],
  },
  {
    id: "fire",
    work: "불피우기",
    emoji: "🔥",
    facility: "용광로",
    traits: [
      { tier: "S", name: "불의 신도", value: "+30%" },
      { tier: "A", name: "뜨거운 열기", value: "+10%" },
      { tier: "B", name: "장인정신", value: "+5%" },
    ],
  },
  {
    id: "power",
    work: "에너지 충전",
    emoji: "⚡",
    facility: "전력저장소",
    traits: [
      { tier: "S", name: "전력폭발", value: "15% 추가" },
      { tier: "A", name: "천둥 친화력", value: "10% 추가" },
      { tier: "B", name: "전도체", value: "3% 추가" },
      { tier: "B", name: "보조배터리", value: "5% 추가", note: "B 대체" },
    ],
  },
  {
    id: "crystal",
    work: "수정 채굴량",
    emoji: "💎",
    facility: "수정선별기",
    traits: [
      { tier: "S", name: "수정사냥꾼", value: "8% 증가" },
      { tier: "A", name: "수정사냥꾼", value: "5% 증가" },
      { tier: "B", name: "수정사냥꾼", value: "2% 증가" },
    ],
  },
  {
    id: "alchemy",
    work: "연금술 생산량",
    emoji: "🧪",
    facility: "연금술 공방",
    traits: [
      { tier: "S", name: "연금술사", value: "8% 증가" },
      { tier: "A", name: "연금술사", value: "5% 증가" },
      { tier: "B", name: "연금술사", value: "2% 증가" },
    ],
  },
  {
    id: "move",
    work: "이동속도",
    emoji: "💨",
    traits: [
      { tier: "S", name: "신속한 발걸음", value: "+10%" },
      { tier: "A", name: "운동선수", value: "+5%" },
    ],
  },
];

// 작업 보조 특성: 팰몬 특성 슬롯 4개 중 주 작업 특성 외 남는 슬롯에 넣는 부특성.
// 우선순위: 1) 몽상가 → 2) 필로우킹 → 3) 대식가 · 끝없는 의지 · 완속대사
export const subTraits: SubTrait[] = [
  {
    name: "몽상가",
    effect: "수면시 추가 경험치 가루 획득",
    priority: 1,
    tiers: [
      { tier: "S", value: "15% 추가" },
      { tier: "A", value: "10% 추가" },
      { tier: "B", value: "5% 추가" },
    ],
  },
  {
    name: "필로우킹",
    effect: "수면시 추가 경험치 가루",
    priority: 2,
    tiers: [
      { tier: "S", value: "+3 초당" },
      { tier: "A", value: "+2 초당" },
      { tier: "B", value: "+1 초당" },
    ],
  },
  {
    name: "대식가",
    effect: "식사소모량 감소",
    priority: 3,
    tiers: [
      { tier: "S", value: "50% 감소" },
      { tier: "A", value: "25% 감소" },
      { tier: "B", value: "10% 감소" },
    ],
  },
  {
    name: "끝없는 의지",
    effect: "에너지소모량 감소",
    priority: 3,
    tiers: [
      { tier: "S", value: "50% 감소" },
      { tier: "A", value: "25% 감소" },
      { tier: "B", value: "10% 감소" },
    ],
  },
  {
    name: "완속대사",
    effect: "배고픔게이지 감소",
    priority: 3,
    tiers: [
      { tier: "S", value: "50% 감소" },
      { tier: "A", value: "25% 감소" },
      { tier: "B", value: "10% 감소" },
    ],
  },
];

export const traitsCodexMeta = {
  updatedAt: "2026-08-17",
  updatedBy: "코라 #201",
  note: "전투 · 작업 · 작업 보조 특성을 카테고리별로 정리한 도감.",
};
