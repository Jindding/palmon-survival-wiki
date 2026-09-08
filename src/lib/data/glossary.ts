// 팰몬 서바이벌 용어집.
//
// 이 사이트는 공식 자료 · 커뮤니티 공략 · 원본 도구 등 여러 출처를 참고해 만들어서,
// 같은 대상을 가리키는데도 문서마다 표기가 다른 경우가 많다.
// 예) 진화 정수 / 진화정수 / Evolution Essence
//
// 여기서 [표준 표기]를 하나로 정하고, 실제로 쓰이는 다른 표기를 aliases에 모아둔다.
// 앞으로 새 페이지를 쓸 때는 term의 표기를 따른다.
//
// status:
//   "confirmed"  — 사이트 데이터로 뜻이 확인된 용어
//   "needs-check" — 이름만 등장하고 정확한 용도·관계가 확인되지 않은 용어.
//                   note에 무엇이 불확실한지 적어두고 사용자 보충을 기다린다.

export type GlossaryStatus = "confirmed" | "needs-check";

export type GlossaryCategory =
  | "재화"
  | "육성"
  | "전투 · 경쟁"
  | "건설 · 자원"
  | "시간"
  | "약칭 · 은어";

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  "재화",
  "육성",
  "전투 · 경쟁",
  "건설 · 자원",
  "시간",
  "약칭 · 은어",
];

export interface GlossaryTerm {
  /** 이 사이트에서 쓰는 표준 표기 */
  term: string;
  /** 같은 대상을 가리키는 다른 표기 (띄어쓰기 차이 포함) */
  aliases?: string[];
  /** 게임 내 영문 표기 */
  english?: string;
  category: GlossaryCategory;
  description: string;
  /** 헷갈리기 쉬운 지점이나 확인이 필요한 부분 */
  note?: string;
  status: GlossaryStatus;
  /** 관련 페이지 경로 */
  href?: string;
  hrefLabel?: string;
}

export const glossary: GlossaryTerm[] = [
  // ───────── 재화 ─────────
  {
    term: "진화 정수",
    aliases: ["진화정수"],
    english: "Evolution Essence",
    category: "재화",
    description:
      "기존 팰몬을 진화시킬 때 쓰는 재화. 진화 1단계 20개, 2단계 60개, 3단계 140개, 4단계 300개가 누적으로 들어간다.",
    note: "이름이 비슷한 「오로라 정수」와는 다른 재화다. 오로라 정수는 신화(시즌) 팰몬 전용.",
    status: "confirmed",
    href: "/calculator/evolution-essence",
    hrefLabel: "진화 정수 계산기",
  },
  {
    term: "오로라 정수",
    aliases: ["오로라정수", "오로라의 정수"],
    category: "재화",
    description:
      "신화(시즌) 팰몬을 진화시킬 때 쓰는 재화. 진화 정수와 계산식은 같고 재화 이름만 다르다.",
    note: "「오로라 구슬」과 헷갈리기 쉽다. 정수는 진화용, 구슬은 소환용이다.",
    status: "confirmed",
  },
  {
    term: "오로라 구슬",
    aliases: ["오로라구슬"],
    english: "Aurora Orb",
    category: "재화",
    description:
      "신화 팰몬 소환(오로라 소환 · Aurora Altar)에 쓰는 재화. 신화 확률은 0.13%이며 1,200회 소환 시 확정 지급된다.",
    note: "「오로라 정수」와 다른 재화다.",
    status: "confirmed",
    href: "/season1",
    hrefLabel: "시즌 1 가이드",
  },
  {
    term: "UR 만능 팰몬조각",
    aliases: ["만능조각", "팰몬조각", "만능 팰몬조각"],
    category: "재화",
    description:
      "팰몬을 승급시킬 때 쓰는 조각. 성급(★)을 올리는 데 쓰며 1성 25개부터 5성까지 누적 975개가 필요하다.",
    note: "「팰몬 만능 UR 증표(UR토큰)」와 같은 것인지 확인이 필요하다. 과금 가이드에는 같은 재화를 승급과 업적에 나눠 쓰는 것처럼 적혀 있다.",
    status: "needs-check",
    href: "/calculator/palmon-shard",
    hrefLabel: "만능 팰몬조각 계산기",
  },
  {
    term: "팰몬 증표",
    aliases: ["UR팰몬 증표", "SSR팰몬 증표", "SR팰몬 증표"],
    category: "재화",
    description:
      "등급별(SR · SSR · UR)로 존재하는 팰몬 관련 재화. 상자 보상과 이벤트 보상 목록에 자주 등장한다.",
    note: "등급별 증표와 「팰몬 만능 UR 증표」의 차이 확인이 필요하다. 만능 증표는 모든 UR 팰몬에게 쓸 수 있는 반면, 등급별 증표는 특정 팰몬에 묶여 있는 것으로 추정된다.",
    status: "needs-check",
  },
  {
    term: "에너지 구슬",
    english: "Evolution Energy",
    category: "재화",
    description:
      "다음 진화 단계로 넘어가기 위한 조건을 채우는 재료. 진화 자체에 쓰는 진화 정수와는 별개라 양쪽을 모두 준비해야 한다. 진화 1~4단계 40만 + 메가진화·스킬해금 40만 = 총 80만 개.",
    note: "속성별(물·불·바위·전기) 구슬이 따로 있는지, 공용인지 확인이 필요하다.",
    status: "needs-check",
    href: "/calculator/energy-bead",
    hrefLabel: "에너지 구슬 계산기",
  },
  {
    term: "스킬 레벨업 열매",
    aliases: ["스킬열매", "열매"],
    category: "재화",
    description:
      "팰몬 스킬 레벨을 올리는 데 쓰는 재화. 스킬 하나를 Lv 30까지 올리는 데 104,200개가 필요하다.",
    note: "팰몬 한 마리 기준이 아니라 스킬 하나 기준이다.",
    status: "confirmed",
    href: "/calculator/skill-fruit",
    hrefLabel: "스킬열매 계산기",
  },
  {
    term: "팰몬 경험치",
    aliases: ["경험치", "팰몬 XP"],
    category: "재화",
    description:
      "팰몬 레벨을 올리는 데 쓰는 재화. 최대 Lv 300이며 전 구간 누적 약 99억이 든다.",
    status: "confirmed",
    href: "/calculator/palmon-exp",
    hrefLabel: "경험치 계산기",
  },
  {
    term: "황금편자",
    category: "재화",
    description: "탈것 관련 재화. 탈것 초기화 시 사용한 물량을 전부 회수할 수 있다.",
    note: "정확한 획득처와 사용처 정리가 필요하다.",
    status: "needs-check",
    href: "/mounts",
    hrefLabel: "탈것 시스템",
  },
  {
    term: "걸작구슬",
    category: "재화",
    description:
      "무기의 성급(★)을 올릴 때 쓰는 재화. ★10까지 있고 누적 1,325개가 든다. 흔히 말하는 「무기 1개 완성」은 ★5 기준 150개를 가리킨다.",
    note: "팰몬 승급에 쓰는 「UR 만능 팰몬조각」과는 다른 재화다. 무기는 걸작구슬, 팰몬은 조각.",
    status: "confirmed",
    href: "/calculator/masterwork-bead",
    hrefLabel: "걸작구슬 계산기",
  },
  {
    term: "장비결정",
    category: "재화",
    description: "장비 관련 재화로 과금 환산표에 등장한다.",
    note: "용도 확인 필요.",
    status: "needs-check",
  },
  {
    term: "팰몬캐쳐",
    category: "재화",
    description: "과금 환산표에 등장하는 팰몬 획득 관련 재화.",
    note: "용도 확인 필요.",
    status: "needs-check",
  },
  {
    term: "타이탄인장",
    category: "재화",
    description: "과금 환산표에 등장하는 재화.",
    note: "용도 확인 필요.",
    status: "needs-check",
  },
  {
    term: "블룸스톤",
    category: "재화",
    description: "과금 환산표에 등장하는 재화.",
    note: "용도 확인 필요. 번식 관련으로 추정된다.",
    status: "needs-check",
  },
  {
    term: "황금 잎 · 프레스티지 · 그레늄",
    category: "재화",
    description: "모험가 대회(MvM) 보상 목록에 함께 등장하는 재화들.",
    note: "각각의 용도와 획득처 정리가 필요하다.",
    status: "needs-check",
  },

  // ───────── 육성 ─────────
  {
    term: "진화",
    category: "육성",
    description:
      "팰몬을 강화하는 축 중 하나. 1~4단계로 나뉘며 진화 정수와 에너지 구슬을 쓴다.",
    note: "5~8단계는 「메가진화」라고 따로 부르고 재화도 다르다.",
    status: "confirmed",
  },
  {
    term: "메가진화",
    aliases: ["메가 진화", "Mega Evolution"],
    category: "육성",
    description:
      "진화 5~8단계를 가리키는 이름. 일반 진화와 달리 「메가 진화석」이라는 별도 재화를 쓴다.",
    note: "데이터상 내부 표기는 「진화 5단계」지만 화면에는 「메가진화 5단계」로 보여준다.",
    status: "confirmed",
  },
  {
    term: "승급",
    category: "육성",
    description:
      "팰몬의 성급(★)을 올리는 강화. 진화와는 별개 축이며 UR 만능 팰몬조각을 쓴다. ★1~★5까지 있다.",
    note: "「진화 단계」와 「성급」은 서로 다른 축이다. 한 마리를 완성하려면 둘 다 올려야 한다.",
    status: "confirmed",
    href: "/calculator/palmon-shard",
    hrefLabel: "만능 팰몬조각 계산기",
  },
  {
    term: "성급",
    aliases: ["별", "★"],
    category: "육성",
    description: "승급으로 올리는 팰몬의 별 등급. ★1부터 ★5까지.",
    status: "confirmed",
  },
  {
    term: "특성",
    english: "Trait",
    category: "육성",
    description:
      "팰몬이 가지는 능력. 슬롯이 4개이며 전투 특성 · 작업 특성 · 작업 보조 특성으로 나뉜다.",
    status: "confirmed",
    href: "/traits-codex",
    hrefLabel: "특성 도감",
  },
  {
    term: "번식",
    category: "육성",
    description:
      "두 팰몬으로 알을 얻고 부화시켜 자식 팰몬을 만드는 시스템. 특성이 상속된다.",
    note: "알을 부화시키는 장소를 자료에 따라 「부화장(Hatchery)」 또는 「부화실」로 다르게 부른다. 건물 목록에는 「부화실」로 되어 있다.",
    status: "needs-check",
    href: "/breeding",
    hrefLabel: "번식 시스템",
  },
  {
    term: "탈것",
    category: "육성",
    description:
      "하루 한 번 초기화할 수 있는 성장 시스템. 초기화하면 사용한 황금편자와 먹이를 전부 회수한다.",
    status: "confirmed",
    href: "/mounts",
    hrefLabel: "탈것 시스템",
  },
  {
    term: "아미고",
    category: "육성",
    description:
      "레벨별로 훈련시키는 병력 단위. 「아미고 기지」에서 훈련하며 GvG와 모험가 대회 점수에 반영된다.",
    note: "팰몬과의 관계(별도 유닛인지, 팰몬에 딸린 개념인지)와 정확한 명칭 정리가 필요하다.",
    status: "needs-check",
  },

  // ───────── 전투 · 경쟁 ─────────
  {
    term: "GvG",
    aliases: ["길드전", "길드대결", "길드 대결"],
    category: "전투 · 경쟁",
    description:
      "일주일간 진행되는 길드 대결. 요일마다 테마 미션이 정해져 있고 수행해서 점수를 얻는다.",
    status: "confirmed",
    href: "/gvg",
    hrefLabel: "GvG 주간 미션",
  },
  {
    term: "모험가 대회",
    aliases: ["MvM", "모험가대회"],
    english: "Mission of Merit",
    category: "전투 · 경쟁",
    description:
      "매일 6개 시간대에 5개 카테고리가 순환하는 일일 이벤트. 요일 고정이 아니라 매일 시작 카테고리가 한 칸씩 밀리는 5일 주기다.",
    note: "GvG 요일 테마와 겹치는 시간대를 노리면 두 점수를 동시에 올릴 수 있다.",
    status: "confirmed",
    href: "/mvm",
    hrefLabel: "모험가 대회",
  },
  {
    term: "AP",
    category: "전투 · 경쟁",
    description:
      "행동에 소모되는 자원. 모험가 대회의 「AP 소모」 카테고리와 GvG 첩보 특훈 점수에 쓰인다.",
    note: "회복 방식과 최대치 정리가 필요하다.",
    status: "needs-check",
  },
  {
    term: "첩보 퀘스트",
    aliases: ["첩보퀘스트", "첩보 특훈"],
    category: "전투 · 경쟁",
    description:
      "AP를 소모해 진행하는 퀘스트. GvG 월요일 테마(첩보 특훈)와 모험가 대회 AP 카테고리에서 점수가 된다.",
    status: "confirmed",
  },
  {
    term: "불씨",
    category: "전투 · 경쟁",
    description:
      "불씨 쟁탈전에서 다투는 자원. 길드·서버별 보유량으로 순위가 매겨진다.",
    status: "confirmed",
    href: "/events/ember-wars",
    hrefLabel: "불씨 쟁탈전",
  },

  // ───────── 건설 · 자원 ─────────
  {
    term: "캠프",
    category: "건설 · 자원",
    description:
      "플레이어의 본거지. 캠프 레벨이 건물 상한과 각종 보상량의 기준이 된다.",
    status: "confirmed",
    href: "/buildings",
    hrefLabel: "캠프 업그레이드",
  },
  {
    term: "가속",
    aliases: ["가속권", "건설가속", "기술가속", "훈련가속"],
    category: "건설 · 자원",
    description:
      "건설 · 기술 연구 · 훈련 · 치료의 대기 시간을 줄이는 아이템. 종류별로 나뉘어 있어 용도가 맞아야 쓸 수 있다.",
    note: "자료에 따라 「건설 가속」과 「건설가속」처럼 띄어쓰기가 다르게 쓰인다. 이 사이트에서는 띄어 쓴다.",
    status: "confirmed",
  },

  // ───────── 시간 ─────────
  {
    term: "서버 시간",
    category: "시간",
    description:
      "게임 서버가 쓰는 기준 시간으로 UTC−2다. 한국 시간(KST)은 서버 시간 + 11시간이다.",
    note: "이 사이트는 KST를 기준으로 표시하고 서버 시간을 함께 적는다.",
    status: "confirmed",
  },
  {
    term: "일일 초기화",
    aliases: ["하루 경계"],
    category: "시간",
    description:
      "게임의 하루가 바뀌는 시점. 서버 시간 00:00 = 한국 시간 오전 11:00이다. 한국 시간 자정부터 오전 10:59까지는 아직 전날에 속한다.",
    note: "모험가 대회 요일 계산이 이 경계를 따른다.",
    status: "confirmed",
    href: "/mvm",
    hrefLabel: "모험가 대회",
  },

  // ───────── 약칭 · 은어 ─────────
  // 유저 제보 가이드에 인게임 약칭이 그대로 쓰이는 경우가 많아, 정식 명칭과 이어 준다.
  {
    term: "데미지 감소",
    aliases: ["뎀감"],
    category: "약칭 · 은어",
    description: "받는 피해를 줄이는 효과. 전기 조합의 정체성으로 자주 언급된다.",
    status: "confirmed",
  },
  {
    term: "CC",
    english: "Crowd Control",
    aliases: ["군중 제어"],
    category: "약칭 · 은어",
    description:
      "상대의 행동을 막거나 늦추는 효과. 「3CC 조합」처럼 CC 개수로 조합 이름을 붙이기도 한다.",
    status: "confirmed",
  },
  {
    term: "공격 장비 · 방어 장비",
    aliases: ["공템", "방템"],
    category: "약칭 · 은어",
    description:
      "공격력 위주 장비와 방어력 위주 장비를 가리키는 말. 스태프 · 목걸이가 공격, 방패 · 가면이 방어 쪽이다.",
    status: "confirmed",
    href: "/equipment",
    hrefLabel: "장비 업그레이드",
  },
  {
    term: "궁극기",
    aliases: ["궁"],
    category: "약칭 · 은어",
    description: "팰몬의 필살기. 조합 설명에서 「궁」으로 줄여 쓰는 경우가 많다.",
    status: "confirmed",
  },
  {
    term: "속성보스 버프",
    category: "약칭 · 은어",
    description:
      "특정 속성 팰몬이 받는 버프. 글레이스윙이 전기 조합에서 못 받는 버프로 언급된다.",
    note: "정확한 획득 조건 확인이 필요하다.",
    status: "needs-check",
  },
  {
    term: "팰몬 만능 UR 증표",
    aliases: ["UR토큰", "UR 팰몬 만능 증표", "UR 만능 증표"],
    category: "재화",
    description:
      "특정 팰몬에 묶이지 않고 모든 UR 팰몬에게 쓸 수 있는 범용 토큰. 업적 레벨을 올리는 데 요구되며, 레벨이 오를수록 요구량이 늘어난다.",
    note: "승급에 쓰는 「UR 만능 팰몬조각」과 같은 것인지 확인이 필요하다. 과금 가이드에는 같은 재화를 승급과 업적에 나눠 쓰는 것처럼 적혀 있다.",
    status: "needs-check",
    href: "/achievements",
    hrefLabel: "업적 가이드",
  },
];

export const glossaryMeta = {
  updatedAt: "2026-09-08",
};

export const glossaryStats = {
  total: glossary.length,
  needsCheck: glossary.filter((t) => t.status === "needs-check").length,
};
