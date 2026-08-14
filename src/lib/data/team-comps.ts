export interface TeamComp {
  id: string;
  name: string;
  concept: string;
  frontLine: string[];
  backLine: string[];
  tips: string[];
}

export interface ElementGroup {
  id: string;
  name: string;
  emoji: string;
  color: string;
  comps: TeamComp[];
}

export const teamCompsIntro =
  "조합을 짤 때 가장 중요한 것은 조합의 컨셉을 먼저 이해하고, 그 컨셉에 맞는 팰몬들로 최상의 시너지를 만들어내는 것입니다.";

export const elementGroups: ElementGroup[] = [
  {
    id: "water",
    name: "물속성",
    emoji: "💧",
    color: "from-sky-500 to-blue-500",
    comps: [
      {
        id: "plunderjaw",
        name: "플런더조 처형 조합",
        concept:
          "글윙과 맘모스가 번갈아 CC로 턴을 벌어주는 동안, 셰프 버프를 받은 플런더조가 핵꿀밤으로 한 명씩 처형하는 조합.",
        frontLine: ["물개", "글윙", "돌핀"],
        backLine: ["샤리나", "맘모스", "셰프", "플런더조"],
        tips: [
          "글윙은 앞라인, 맘모스는 뒷라인이어야 CC가 번갈아가며 가장 효과적으로 들어감.",
          "이상적 세팅: 악어 모든 부위 10성 → 셰프/글윙/맘모스/돌핀 방템 7~8성 → 나머지 방템만 올림.",
          "글윙은 공템 불필요. 악어에게 걸리면 1궁1푹찍이라 양념이 필요 없고, 그 돈으로 악어 · 셰프 방템을 더 올리는 게 훨씬 현명.",
          "악어 무기 · 목걸이 10성이면 조합력 극대화. 없어도 최소 8성 이상 필수.",
          "셰프 방템은 반드시 7성 이상.",
        ],
      },
      {
        id: "meganin",
        name: "메가닌점 광역딜 조합",
        concept:
          "생존력과 광역딜이 모두 뛰어난 메가닌점을 필두로 CC지옥 + 꾸준한 광역딜로 상대를 말려죽이는 조합.",
        frontLine: ["물개", "글윙", "돌핀"],
        backLine: ["샤리나", "맘모스", "메가닌점", "스태츄"],
        tips: [
          "셰프보다 스태츄가 나은 이유: 메가닌점은 템포를 길게 가져가므로 스태츄로 안정감을 보태주는 편이 이득.",
          "닌점과 글윙 모두 딜러 역할이라 템을 한쪽에 몰빵하지 말고, 닌점 · 악어 모두 공템을 골고루 세팅.",
        ],
      },
    ],
  },
  {
    id: "electric",
    name: "전기속성",
    emoji: "⚡",
    color: "from-yellow-400 to-amber-500",
    comps: [
      {
        id: "seven-electric",
        name: "7전기 조합",
        concept:
          "전기속성은 자판티스에 전적으로 의존. '전기속성 팰몬' 데미지 감소 스킬 2개로 정체성은 결국 미친 생존력. 자판 버프를 모두 받는 7전기가 가장 효율적.",
        frontLine: ["바크플러그", "썬더투스", "자판티스"],
        backLine: ["맨틀레이", "썬디어리", "리뮤드로이드", "여왕벌"],
        tips: [
          "썬더투스를 앞라인에 두는 이유: 궁으로 타겟에서 벗어나 있는 시간이 대부분이고 자판 버프 때문에 어차피 안 죽음.",
          "생존 스킬이 전혀 없는 탱커 썬디어리를 뒤로 보내 오래 생존시켜 버프 유지.",
        ],
      },
      {
        id: "six-electric-statue",
        name: "6전기 + 스태츄 조합",
        concept:
          "리뮤드로이드는 조합 버프가 없고 딜량도 애매하므로, 대신 스태츄를 넣어 생존력을 극대화하고 고스펙 상대에 대한 방어율을 확보.",
        frontLine: ["바크플러그", "썬더투스", "자판티스"],
        backLine: ["맨틀레이", "썬디어리", "스태츄", "여왕벌"],
        tips: [
          "시즌2 전기 조합에 글윙 미사용: 뎀감이 높아 CC로 턴 벌 필요 없음.",
          "핵심 딜러 썬더투스는 원래 궁으로 상대 CC 다 씹으며 메인 딜러부터 녹이는 컨셉. CC로 턴 번다고 딜에 도움 안 됨.",
          "글윙은 자판 버프도, 속성보스 버프도 못 받아 다른 전기 팰몬보다 훨씬 빨리 죽어 오래 버텨야 하는 전기 조합에 마이너스.",
        ],
      },
    ],
  },
  {
    id: "rock",
    name: "바위속성",
    emoji: "🪨",
    color: "from-stone-500 to-amber-700",
    comps: [
      {
        id: "three-cc",
        name: "3CC 조합",
        concept: "글윙 + 맘모 + 루트워든의 정신 나간 3광역 CC로 상대방을 정신 못 차리게 하는 조합.",
        frontLine: ["글윙", "길런트", "스태츄"],
        backLine: ["루트워든", "링크스", "맘모스", "살라맨티스"],
        tips: [],
      },
    ],
  },
  {
    id: "fire",
    name: "불속성",
    emoji: "🔥",
    color: "from-orange-500 to-red-500",
    comps: [
      {
        id: "six-fire-glwing",
        name: "6불 + 1글윙 조합",
        concept:
          "글윙이 CC로 초반에 턴을 벌어주는 동안 폭딜로 최대한 상대방을 지워내 수적 유리를 유도.",
        frontLine: ["레본투렛", "글윙", "엠버"],
        backLine: ["헥스캣", "마그몰린", "블레질", "셰프"],
        tips: [
          "메인 딜러(블레질 vs 헥스캣)는 장비 조절과 테스트로 셰프 버프 대상 승률을 보고 판단 (아직 확인 불가).",
        ],
      },
    ],
  },
  {
    id: "fire-rock",
    name: "불바위 조합",
    emoji: "🌋",
    color: "from-red-500 to-stone-600",
    comps: [
      {
        id: "fire-rock-standard",
        name: "불바위 표준 조합",
        concept:
          "길런트의 뎀감 버프를 받은 단단한 맘모스가 광역 CC를 꾸준히 걸어주고, 셰프 · 스태츄 버프를 받은 엠버가이스트의 미친 탱과 전체딜로 말려죽이는 조합.",
        frontLine: ["레본투렛", "마그몰린", "엠버"],
        backLine: ["스태츄", "맘모스", "길런트", "셰프"],
        tips: [
          "셰프 방템은 반드시 엠버와 동급으로 맞출 것. 셰프의 이른 사망이 엠버의 이른 사망보다 훨씬 나쁜 결과.",
          "엠버 = 심장, 셰프 = 뼈대.",
          "시즌2 기준 상성인 동스펙 물덱 상대로도 반반 이상 (셰프악어덱 제외).",
          "자판 전기 조합을 정확히 카운터. 썬더투스가 공 가장 높은 엠버만 때리는데 엠버는 냥냥펀치에 안 죽음.",
          "고스펙 자판 전기 조합도 공격 시 시간초과로 잡지는 못하나, 방어 시 뚫리지도 않음.",
        ],
      },
    ],
  },
];

export const teamCompsMeta = {
  updatedAt: "2026-06-12",
  updatedBy: "TechBoy (69서버)",
  season: "시즌2",
};
