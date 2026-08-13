export interface BuildRequirement {
  level: number;
  prereqs: string[];
  gold: number | null;
  wood: number | null;
  steel: number | null;
  seconds: number | null;
}

export const buildRequirements: BuildRequirement[] = [
  { level: 2, prereqs: [], gold: null, wood: null, steel: null, seconds: 3 },
  { level: 3, prereqs: ["테이블쏘 Lv.1", "용광로 Lv.1"], gold: null, wood: 500, steel: 500, seconds: 60 },
  { level: 4, prereqs: ["상점 Lv.3"], gold: null, wood: 2_000, steel: 2_000, seconds: 600 },
  { level: 5, prereqs: ["상점 Lv.4"], gold: null, wood: 5_000, steel: 5_000, seconds: 1_800 },
  { level: 6, prereqs: ["원정 파티", "부화실"], gold: null, wood: 20_000, steel: 20_000, seconds: 2_880 },
  { level: 7, prereqs: ["아미고 기지", "상점"], gold: null, wood: 50_000, steel: 50_000, seconds: 5_400 },
  { level: 8, prereqs: ["병원", "테이블쏘"], gold: null, wood: 150_000, steel: 150_000, seconds: 13_020 },
  { level: 9, prereqs: ["물의 조각상", "상점"], gold: null, wood: 500_000, steel: 500_000, seconds: 18_000 },
  { level: 10, prereqs: ["원정 파티", "아미고"], gold: null, wood: 1_000_000, steel: 1_000_000, seconds: 24_000 },
  { level: 11, prereqs: ["전력 저장소 Lv.10", "연구대 Lv.10"], gold: null, wood: 2_000_000, steel: 2_000_000, seconds: 30_000 },
  { level: 12, prereqs: ["병원 Lv.10", "부화실 Lv.11"], gold: null, wood: 3_200_000, steel: 3_200_000, seconds: null },
  { level: 13, prereqs: ["아미고 기지 Lv.12", "테이블쏘 Lv.12"], gold: null, wood: 5_000_000, steel: 5_000_000, seconds: null },
  { level: 14, prereqs: ["병원 Lv.13", "용광로 Lv.13"], gold: null, wood: 7_700_000, steel: 7_700_000, seconds: null },
  { level: 15, prereqs: ["전력 저장소 Lv.14", "연구대 Lv.14"], gold: null, wood: 10_100_000, steel: 10_100_000, seconds: 82_800 },
  { level: 16, prereqs: ["아미고 기지 Lv.15", "테이블쏘 Lv.15", "스토어하우스"], gold: 16_900_000, wood: 14_100_000, steel: 14_100_000, seconds: 115_200 },
  { level: 17, prereqs: ["원정 파티 Lv.16", "전력 저장소 Lv.16"], gold: 21_700_000, wood: 21_800_000, steel: 21_800_000, seconds: 162_000 },
  { level: 18, prereqs: ["부화실 Lv.17", "연구대 Lv.17"], gold: 45_600_000, wood: 32_000_000, steel: 32_000_000, seconds: 226_800 },
  { level: 19, prereqs: ["아미고 기지 Lv.18", "연구대 Lv.18"], gold: 63_700_000, wood: 53_100_000, steel: 53_100_000, seconds: 320_400 },
  { level: 20, prereqs: ["병원 Lv.19", "연구대 Lv.19"], gold: null, wood: 60_900_000, steel: 60_900_000, seconds: 450_000 },
  { level: 21, prereqs: ["원정 파티 Lv.20", "연구대 Lv.20"], gold: 120_000_000, wood: 104_000_000, steel: 104_000_000, seconds: 630_000 },
  { level: 22, prereqs: ["아미고 기지 Lv.21", "연구대 Lv.21"], gold: 160_000_000, wood: 144_700_000, steel: 144_700_000, seconds: 882_000 },
  { level: 23, prereqs: ["병원 Lv.22", "연구대 Lv.22"], gold: 170_000_000, wood: 201_300_000, steel: 201_300_000, seconds: 1_234_800 },
  { level: 24, prereqs: ["원정 파티 Lv.23", "연구대 Lv.23"], gold: 250_000_000, wood: 280_100_000, steel: 280_100_000, seconds: 1_731_600 },
  { level: 25, prereqs: ["아미고 기지 Lv.24", "연구대 Lv.24"], gold: 200_000_000, wood: 381_000_000, steel: 381_000_000, seconds: 2_001_600 },
  { level: 26, prereqs: ["병원 Lv.25", "연구대 Lv.25"], gold: 630_000_000, wood: 525_000_000, steel: 525_000_000, seconds: 2_851_200 },
  { level: 27, prereqs: ["원정 파티 Lv.26", "연구대 Lv.26"], gold: null, wood: 605_000_000, steel: 605_000_000, seconds: 3_502_800 },
  { level: 28, prereqs: ["아미고 기지 Lv.27", "연구대 Lv.27"], gold: null, wood: 745_000_000, steel: 745_000_000, seconds: 5_202_000 },
  { level: 29, prereqs: ["병원 Lv.28", "연구대 Lv.28"], gold: null, wood: 986_000_000, steel: 986_000_000, seconds: 6_771_600 },
  { level: 30, prereqs: ["원정 파티 Lv.29", "연구대 Lv.29"], gold: 1_500_000_000, wood: 1_300_000_000, steel: 1_300_000_000, seconds: 8_802_000 },
];

export const buildMeta = {
  updatedAt: "2026-08-11",
  note: "'—' 표시는 원본 데이터에 명시되지 않은 항목입니다. 골드가 표시되지 않은 저레벨 구간은 골드 소모가 없는 경우입니다.",
};
