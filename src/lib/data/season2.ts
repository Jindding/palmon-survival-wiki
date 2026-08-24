export interface Highlight {
  title?: string;
  body: string;
  tone?: "tip" | "warning" | "info";
}

export interface SubBlock {
  title: string;
  intro?: string;
  bullets?: string[];
  highlights?: Highlight[];
}

export interface Season2Section {
  id: string;
  emoji: string;
  title: string;
  intro?: string;
  bullets?: string[];
  highlights?: Highlight[];
  subs?: SubBlock[];
}

export const season2Hero = {
  name: "정복의 시대",
  tagline:
    "사막 원더랜드와 크로스 서버 정복이 열리는 시즌. Mega Evolution 이라는 4번째 성장 레이어가 등장하며, 재화 관리·길드 조직력이 시즌 1보다 훨씬 중요해집니다.",
};

export const season2Sections: Season2Section[] = [
  {
    id: "overview",
    emoji: "🏜️",
    title: "시즌 2 개요 · 새 세계관",
    intro:
      "얼음 시대를 지나 탐험대가 사막 원더랜드(Desert Wonderland)로 진입합니다. 4개 렐름이 자원과 지배권을 놓고 충돌하는 정복 시즌 (Conquest Season) 이 시즌 2의 핵심 콘텐츠 축입니다.",
    bullets: [
      "테마: 사막(Desert Sovereignty) + 정복 전쟁(Clash of Pallantis) 이중 로테이션, 주간 단위 교대",
      "롤아웃: 서버별 시즌 시작 Day 기준으로 콘텐츠 순차 오픈 (Day 1 · 15 · 29+)",
      "월드맵: 기존 'Ruins' → 'Sanctums' 로 명칭 변경 + 유형 다양화",
      "신규 몹 카테고리: 사막 Bolyos 몹 (마스터리·XP 획득처)",
    ],
    highlights: [
      {
        tone: "info",
        title: "공식 부제는 아직 유동적",
        body: "서드파티 소스마다 'Conquest Season' · 'Age of Mastery' 등 표기가 갈립니다. 한국 서버 공식 국문 부제는 확인 필요.",
      },
    ],
  },
  {
    id: "mega-evolution",
    emoji: "🧬",
    title: "Mega Evolution · 4번째 성장 레이어",
    intro:
      "시즌 2 전용 최상위 육성 시스템. 별·스킬·리서치 위에 얹히는 4번째 레이어로, 완성 시 S-tier → SS-tier 도약을 만들어냅니다.",
    subs: [
      {
        title: "🔓 언락 요건 (4가지 동시 충족)",
        bullets: [
          "5성 팰몬 (UR Omni Token 으로 5성 승급 완료)",
          "Camp Level 24 도달",
          "Evolution Essence 사전 확보 (Guild Duel 이 최대 공급원)",
          "Evolution Energy 단계별 확보 (부족 시 진행 도중 정체)",
        ],
      },
      {
        title: "🎯 Mega 폼 라인업",
        bullets: [
          "Day 1 · Shadowkaeru (Ninjump 의 Mega) — SS-tier 하이브리드 폭발 DPS",
          "Day 1 · Mystiray (Mantleray 의 Mega) — SS-tier 고속 연타 DPS, 공격력 버프에 잘 스케일",
          "Day 15 · Predalynx (Surveilynx 의 Mega) — Shadow Step 3구역 이동 + Phantom Snare 최대 2,100% 위력",
          "Day 15 · Solhorn (Hoofrit 의 Mega) — Inferno Ride 전 적 1,500% 광역 + 10초 화상",
          "Day 29+ · Leviadolph (Dolphriend 계열 Mega) — Tidal Rage · Execution Prevention · 스턴 락다운",
        ],
      },
    ],
    highlights: [
      {
        tone: "warning",
        title: "부분 커밋은 절대 금물",
        body: "재료 부족 상태로 시작하면 SS-tier 도 S-tier 도 아닌 애매한 상태로 정체됩니다. Essence·Energy 를 완성 분량까지 확보한 뒤 시작하세요.",
      },
      {
        tone: "tip",
        title: "1개 완성 후 다음 착수",
        body: "여러 개를 병렬로 진행하면 모두 완성이 늦어집니다. Shadowkaeru 또는 Mystiray 하나를 완성한 뒤, 사용 중에 다음 메가용 재화를 축적하세요.",
      },
    ],
  },
  {
    id: "resources",
    emoji: "🔄",
    title: "핵심 자원 순환",
    intro:
      "시즌 1의 석탄 → 벽돌 → 제너레이터 흐름을 대체하는 시즌 2 신규 재화 체계입니다.",
    subs: [
      {
        title: "🪙 신규 재화 목록",
        bullets: [
          "Evolution Essence: Mega Evolution 초기 게이트 · Guild Duel 최대 공급원",
          "Evolution Energy: Mega 진화 단계별 유지 재화",
          "Mithril (미스릴): Holy Tower 업그레이드용",
          "Titan Seals: 보스 콘텐츠 업그레이드용",
          "Mastery Sigils: 오프시즌 Master Rank 진행 재화",
          "Prismatic Vials: Prismatic 스킨 해금 재화",
          "Palmite: 오라 시스템 재료, 일일 채굴 및 Sanctum Siege 획득",
          "Aurora Orb: 시즌 1부터 유지, 신화 팰몬 소환용",
        ],
      },
      {
        title: "📈 성장 흐름",
        bullets: [
          "① Camp Lv24 도달 (자원 생산 시설 균형 업그레이드)",
          "② 5성 팰몬 확보 (UR Omni Token 집중 투자)",
          "③ Essence · Energy 축적 (Guild Duel 테마 데이 활용)",
          "④ Mega Evolution 완성",
          "⑤ Camp Lv30 이후 Master Rank 진입",
          "⑥ Mastery Sigils 로 랭크 상승 (레벨 캡 350)",
        ],
      },
    ],
  },
  {
    id: "combat",
    emoji: "⚔️",
    title: "전투 밸런스 변경",
    intro:
      "시즌 2 반영 밸런스 조정. 진화 오픈 시점이 크게 앞당겨졌고, 전투 시간도 늘어났습니다.",
    bullets: [
      "표준 전투 최대 시간: 90초 → 120초",
      "Evolution 오픈 시점: Day 8 → Day 4 로 앞당김",
      "Evolution 레벨 1/2/3/4 별 공격력 · HP 각 +5/+10/+15/+20%",
      "PvP HP 부스트: S2 · Conquest 는 유지, S1 이전 시즌은 장기전 대응 강화",
      "Electric Palmite 스킬 'Law of Lightning' 최대 10스택 제한",
    ],
  },
  {
    id: "new-palmons",
    emoji: "🐉",
    title: "신규 팰몬 · 신화 라인업",
    intro:
      "Mega 폼과 새로운 Mythic 팰몬이 함께 등장합니다. 시즌 2 진입 전 신화 1개 확보를 강력히 권장합니다.",
    subs: [
      {
        title: "✨ 신규 Mythic 팰몬 (Aurora Summons)",
        bullets: [
          "Rapheni (Fire) → 진화형 Raphenis: 불사조 컨셉, 퍼센트 스케일링, 화 속성 팀 인에이블러",
          "Scorphelia (Earth): S-Grade 스탯 UR 팰몬 4마리 조합 최적화 (도입 패치 2026-08-03 ver 0.4.398)",
          "Rootwarden (2026-05 출시): Aurora Summons 라인업 순차 등장",
        ],
      },
      {
        title: "🌟 Prismatic Palmon 시스템 (신규)",
        intro:
          "월드맵 포획 20회 달성 시 Prismatic Wheel 이 해금됩니다.",
        bullets: [
          "포획 시도(성공/실패 무관)마다 확률 발동으로 Prismatic Vials 획득",
          "Vials 로 특정 팰몬 전용 프리즘 스킨 해금 (진화·Mega 폼 포함)",
          "최초 대상: Ninjump · Mantleray · Surveilynx · Magmolin · Lucidina · Barkplug",
        ],
      },
    ],
  },
  {
    id: "class",
    emoji: "🎯",
    title: "클래스 · 듀얼 탤런트 시스템",
    intro:
      "시즌 2부터 Builder + Fighter 트리를 함께 운영하는 듀얼 클래스 탤런트가 도입됩니다. 다만 시즌 1과 마찬가지로 Builder 를 먼저 마스터해야 합니다.",
    subs: [
      {
        title: "🏗️ Builder 선행 (거의 모든 유저)",
        bullets: [
          "건설 · 연구 속도 상승",
          "사막 Bolyos 처치 시 XP 보너스",
          "길드 골드 기부량 +100%",
          "20시간 캠프 자원 즉시 획득 등 진행 가속 스킬 다수",
        ],
      },
      {
        title: "⚔️ Fighter 확장 (Builder 마스터 이후)",
        bullets: [
          "군대 훈련 · 치유 속도 향상",
          "전투 버프 계열 스킬",
          "PvP 시즌 후반 국면에서 진가 발휘",
        ],
      },
    ],
    highlights: [
      {
        tone: "warning",
        title: "Fighter 선행 금지",
        body: "저과금·중과금 계정에서 Fighter 를 먼저 잡으면 시즌 초반 진행 속도가 크게 뒤처집니다. Builder 를 마스터한 뒤 확장하세요.",
      },
    ],
  },
  {
    id: "events",
    emoji: "🎪",
    title: "주요 이벤트 · 콘텐츠",
    subs: [
      {
        title: "🩸 Bloodmoon Surge",
        bullets: [
          "고난도 PvE 웨이브. 시간 경과 시 적 강화",
          "Level 350 캡 대응, Master Rank 부스트 팰몬이 유리",
        ],
      },
      {
        title: "👹 Bullyboss",
        bullets: [
          "시즌 보스 도전, 순차 처치(Lv1 → Lv2) 규칙",
          "Lv2 이상 처치가 퀘스트 진행에 기여",
        ],
      },
      {
        title: "🏛️ Sanctum Siege · Sanctum Struggle",
        intro: "길드 PvP 콘텐츠. 시즌 2 GvG 의 핵심 축입니다.",
        bullets: [
          "맵 전역 Sanctum 점거 · 방어",
          "Lv1 먼저 오픈 후 Lv2 오픈",
          "3역할(랠리 리더 · 정찰 · 방어) 사전 배정 필수",
          "Lv2 는 오픈 이전 랠리 리더 · 공격팀 사전 배치 (선점 창이 결정적)",
        ],
        highlights: [
          {
            tone: "tip",
            title: "Palmite Mine 우선 점령",
            body: "오라 시스템용 희귀 Palmite 공급원. 길드 단위 확장 계획을 미리 짜두세요.",
          },
        ],
      },
      {
        title: "🌍 Desert Wonderland (크로스 서버)",
        bullets: [
          "최대 4개 렐름이 자원 · 지배권 경쟁",
          "안전지대가 주간 단위로 축소",
          "결과적으로 맵 전체가 완전 PvP 지역으로 전환 (시즌 진행 후반)",
        ],
      },
      {
        title: "🦌 Poacher Event",
        bullets: [
          "F2P 초반 주력 PvE 팜",
          "Barkplug 체인 라이트닝이 특히 유리",
        ],
      },
      {
        title: "🦁 King of the Jungle · World Boss · Guild Boss",
        bullets: [
          "Omni Token 및 진화 재료 안정 공급원",
          "Mega Evolution 준비 단계에서 필수 소스",
        ],
      },
      {
        title: "🏆 Palmia Wallet",
        bullets: [
          "포인트 적립형 상점",
          "보라 · 주황 Palmita 유닛 교환 가능",
        ],
      },
      {
        title: "⛩️ Temple 규칙",
        bullets: [
          "시즌 시작 시 모든 Sanctum · Temple 미점령 상태로 리셋",
          "Temple 은 시즌 21일차 이후 첫 금요일 서버시간 12:00 최초 개방",
          "이후 매주 금요일 재개방",
        ],
      },
    ],
  },
  {
    id: "gvg",
    emoji: "🛡️",
    title: "GvG · Guild Duel 변경점",
    intro:
      "시즌 2에서 길드전은 단순 랠리를 넘어 '테마 데이 최적화 + 크로스 서버 + 사전 배정 조직력' 3축이 승부를 가릅니다.",
    bullets: [
      "Guild Duel = 시즌 2 Evolution Essence 최대 공급원 (Mega 진입의 게이트)",
      "테마 데이 시스템 강화: 스피드업 · 에그 테마 > AP · 생산 활동 테마",
      "오프테마 데이에 고가치 자원을 태우면 시즌 보너스 보상을 영구 상실",
      "Sanctum Siege 규칙 최적화 (3역할 사전 배정 · 선점 우위 창)",
      "크로스 서버 확대: Desert Wonderland 로 4개 렐름 경쟁 구도",
    ],
    highlights: [
      {
        tone: "tip",
        title: "테마 대기 전략",
        body: "하루치 자원을 홀드하고 올바른 테마를 대기하는 것이 정답입니다. 잘못된 테마에 소진하면 시즌 종료까지 만회 불가.",
      },
    ],
  },
  {
    id: "shop",
    emoji: "💳",
    title: "배틀패스 · 과금 상품",
    intro:
      "시즌 1의 '별빛 계약' 대응. 시즌 2에서는 주간 패스 + 라이프타임 조합이 실질적 상위 라인입니다.",
    subs: [
      {
        title: "🎫 Desert Weekly Pass",
        bullets: [
          "Conquest Season 주간 패스",
          "기술 가속 · 팩션 버프 해금",
          "Desert Sovereignty 주간에만 이용 가능 (Clash of Pallantis 주간에는 비활성)",
        ],
      },
      {
        title: "🔒 Lifetime Pass",
        bullets: [
          "1회 구매, 영구 버프",
          "고과금 추천 티어에서 최우선 순위",
        ],
      },
      {
        title: "📅 Monthly Pass",
        bullets: [
          "지속 소액 과금 라인",
          "일일 · 주간 보상 트랙",
        ],
      },
      {
        title: "🧪 Field Lab 2 해금",
        bullets: [
          "2건 동시 연구 가능",
          "시즌 2 진행 속도 유의미하게 증가",
        ],
      },
      {
        title: "🐎 Marchable Mount 해금",
        bullets: [
          "모든 마운트가 전투에 함께 참여 가능",
          "탈것 육성 가이드와 연계 활용",
        ],
      },
    ],
    highlights: [
      {
        tone: "info",
        title: "Rubies 사용처",
        body: "Aurora Summons 신화 배너와 확정 레전더리 드롭에만 사용 권장. 그 외 소비는 낭비.",
      },
    ],
  },
  {
    id: "aurora",
    emoji: "🌌",
    title: "신화 팰몬 소환 (Aurora Altar)",
    intro:
      "시즌 1부터 유지되는 Aurora Altar 는 시즌 2에서도 캠프 성장의 핵심 요소입니다. 다만 시즌 2에는 Mega Evolution 이라는 새로운 경쟁 축이 생겨 재화 배분 전략이 바뀝니다.",
    bullets: [
      "위치: 캠프 좌측 상단, Hatchery 인접",
      "재화: Aurora Orb",
      "기본 확률: 위시리스트 즉시 뽑기 0.13%",
      "보장(피티): 누적 1,200 Heart(Affinity) 도달 시 확정 소환. Heart 는 초기화되지 않음",
      "신화 팰몬은 S-tier 특성 4개 사전 패키지 → 소환 즉시 전투 준비 완료 (별도 브리딩 불필요)",
    ],
    highlights: [
      {
        tone: "tip",
        title: "Orb 저축 vs 소환 딜레마",
        body: "Ninjump · Mantleray 육성이 잘 된 계정은 Orb 를 Mega 재화 확보에 활용, 아직 미완인 계정은 신화 1개 먼저 확보하세요.",
      },
    ],
  },
  {
    id: "tips",
    emoji: "💡",
    title: "시즌 2 초반 실전 팁",
    bullets: [
      "Day 1 최우선: Ninjump 5성 육성 → 시즌 2 개방 즉시 Shadowkaeru 전환 경로 확보",
      "코어 3인 팀: Ninjump(DPS) + Abuzzinian(3성, 마비 유틸) + Dolphriend(지속력) 조합이 Day 1 대부분의 PvE 처리",
      "별보다 스탯 우선: Ninjump 첫 잠금 S-스탯은 'Belligerant'. 별 먼저 올리면 복리 낭비",
      "Mega 대비 브리딩: 시즌 2 진입 전 양쪽 부모 모두 'Best' 스탯 확정",
      "Camp Level 24 우선: Farmland · Lumberyard · Steel Mill 균형 업그레이드로 도달",
      "Pallite 즉시 소비: 쌓아두지 말고 건설 가속에 사용",
      "리서치는 영구 진행: 이벤트 · 시즌 리셋 없이 지속",
      "Prismatic Wheel: 월드맵 포획 20회 달성 즉시 해금 → 초반부터 포획 활동 지속",
    ],
    highlights: [
      {
        tone: "warning",
        title: "메가 노선 변경 금지",
        body: "저과금 유저의 가장 큰 함정. 화염/컨트롤 라인 계정은 Solhorn·Leviadolph, DPS 라인 계정은 Shadowkaeru/Mystiray 로 노선을 유지하세요.",
      },
      {
        tone: "info",
        title: "정보 갱신 안내",
        body: "본 가이드는 서드파티 소스 교차 검증 기반이라 세부 수치는 서버·롤아웃 편차 가능. 한국 서버 공식 국문 표기는 이후 업데이트 예정.",
      },
    ],
  },
  {
    id: "diff",
    emoji: "🆚",
    title: "시즌 1과의 차이점 요약",
    subs: [
      {
        title: "환경 · 성장",
        bullets: [
          "환경: 눈보라·얼음 캠프 → 사막 + 정복 이중 테마",
          "성장 레이어: 별·스킬·리서치 3층 → +Mega Evolution 4층 · 오프시즌 Master Rank",
          "레벨 캡: 시즌 1 캡 → 350 확장",
          "월드맵: Ruins → Sanctums",
        ],
      },
      {
        title: "자원 · 시스템",
        bullets: [
          "핵심 자원: 석탄·벽돌·오로라 오브 → Evolution Essence·Energy·Mithril·Titan Seals·Mastery Sigils·Prismatic Vials",
          "핵심 건물: 제너레이터·벽돌 가마·오로라 제단 → Mithril 생산·Holy Tower·Titan Seal 생산·저주 저항 건물",
          "전투: 90초 최대 · 진화 Day 8 → 120초 최대 · 진화 Day 4",
        ],
      },
      {
        title: "클래스 · GvG · 배틀패스",
        bullets: [
          "클래스: 빌더 단일 트리 → Builder + Fighter 듀얼 트리 (Builder 선행 필수)",
          "GvG: 단순 길드 랠리 → Guild Duel 테마 데이 + Sanctum Siege 3역할 + 크로스 서버 Desert Wonderland",
          "배틀패스: 별빛 계약 → Desert Weekly Pass + Lifetime/Monthly Pass",
          "신화 소환: Glacewing 대표 → Rapheni · Scorphelia · Rootwarden 신규 라인",
        ],
      },
    ],
  },
];

export const season2Meta = {
  updatedAt: "2026-08-24",
  season: "시즌 2",
  seasonName: "정복의 시대",
};
