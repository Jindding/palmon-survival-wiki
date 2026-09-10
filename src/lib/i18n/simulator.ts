// 시뮬레이터 전용 한/영 문구 사전.
//
// 언어 상태는 계산기와 공유한다(같은 localStorage 키). 도구 페이지에서 한 번 고르면
// 계산기든 시뮬레이터든 같은 언어로 보이는 편이 자연스럽기 때문이다.
//
// 게임 용어 영문 표기 근거:
//   친밀도 = Heart (Affinity)  — season2.ts "누적 1,200 Heart(Affinity) 도달 시 확정 소환"
//   천장   = Pity              — season2.ts "보장(피티)"
//   오로라 소환 = Aurora Summons / 오로라 제단 = Aurora Altar
//   오로라 구슬 = Aurora Orb / 오로라 정수 = Aurora Essence (docs/term-translation.txt)
//   만능 팰몬조각 = UR Palmon Omni Token (docs/term-translation.txt)
//
//   목판 보물상자 = Lumber Treasure Chest (사용자 확인)
//   신화 팰몬 조각 = "<팰몬 이름> 증표" / "<Palmon> Token" (예: 마몰리스 증표 / Mammolith Token)
//     팰몬마다 이름이 다르다.
//     승급용 "UR Palmon Omni Token"(만능 증표)과는 다른 아이템이다.
//
// 나머지 보물상자 영문명은 아직 확인되지 않아 임시 표기다. 확정되면 dropLabels만 고치면 된다.

import type { CalcLang } from "./calculator";

export interface SimulatorDict {
  auroraSummon: {
    title: string;
    description: string;
    metaDescription: string;

    /** 뽑기 방식 설명 */
    howTo: string;
    simulate: string;
    lastUpdated: string;
    orbName: string;
    orbDesc: string;
    rules: {
      chance: [string, string];
      pity: (goal: string, avg: string, avgPulls: string, worst: string) => [string, string];
      once: [string, string];
      target: [string, string];
    };
    disclaimerBox: string;
    footNote: string;
    contact: string;
    footNoteTail: string;

    /** 시뮬레이터 UI */
    targetTitle: string;
    targetHint: string;
    ownershipTitle: string;
    ownershipHint: string;
    modeNoMythic: [string, string];
    modeHasMythic: [string, string];
    noticeNoMythic: string;
    noticeHasMythic: string;
    heart: string;
    heartResetBtn: string;
    pityPassed: string;
    pityRemain: (pulls: string) => string;
    summonBtn: (count: number) => string;
    thisBatch: (count: number) => string;
    restartBtn: string;
    totalTitle: string;
    totalSummary: (pulls: string) => string;
    colItem: string;
    colHits: string;
    colGained: string;
    colActualRate: string;
    colRate: string;
    colHeart: string;
    ratesTitle: (mode: string) => string;

    /** 획득 팝업 */
    popupBadge: string;
    obtainedTitle: (name: string) => string;
    byDirect: (nth: string) => string;
    byPity: (goal: string, nth: string) => string;
    afterNote: string;
    btnRestart: string;
    btnEssence: string;
    btnConfirm: string;
    zoomLabel: (name: string) => string;
    closeLabel: string;

    /** 랭킹 */
    rankingTitle: string;
    rankingNote: string;
    rankingEmpty: string;
    colRank: string;
    colPalmon: string;
    colPulls: string;
    colPlayer: string;
    pullsValue: (n: string) => string;
    byCeilingTag: string;
    serverBadge: (server: string) => string;
    registerBtn: string;
    serverPlaceholder: string;
    nicknamePlaceholder: string;
    submitBtn: string;
    submitting: string;
    submitted: (rank: string) => string;
    submitFailed: string;

    /** 드랍 아이템 이름 (id 기준) */
    dropLabels: Record<string, string>;
    /**
     * 신화 팰몬 조각 이름. 게임에서는 팰몬마다 이름이 달라서(예: Mammolith Token)
     * 고정 문자열이 아니라 대상 팰몬 이름을 받아 만든다.
     */
    shardLabel: (palmonName: string) => string;
  };
}

const ko: SimulatorDict = {
  auroraSummon: {
    title: "오로라 소환 시뮬레이터",
    description:
      "실제 게임처럼 1회 · 10회씩 뽑아보면서 천장까지 얼마나 걸리는지 감을 잡아보세요.",
    metaDescription:
      "신화 팰몬을 뽑는 오로라 소환을 실제와 같은 방식으로 돌려봐요. 1회 · 10회 소환과 친밀도 천장까지 그대로 재현했어요.",

    howTo: "뽑기 방식",
    simulate: "소환하기",
    lastUpdated: "최종 업데이트",
    orbName: "오로라 구슬",
    orbDesc: "오로라 소환에 쓰는 재화예요. 구슬 1개로 1회 소환합니다.",
    rules: {
      chance: ["신화 팰몬 0.13%", "소환 한 번마다 이 확률로 바로 나옵니다."],
      pity: (goal, avg, avgPulls, worst) => [
        `천장 ${goal}`,
        `못 뽑아도 소환할 때마다 친밀도가 쌓이고, ${goal}을 채우면 확정으로 받습니다. 한 번에 평균 ${avg}씩 올라서 평균 ${avgPulls}회, 운이 가장 나빠도 ${worst}회면 천장에 닿습니다.`,
      ],
      once: [
        "한 번만 획득",
        "신화 팰몬을 얻은 뒤로는 그 자리에 오로라 정수가 나옵니다. 확률표가 통째로 바뀌어요.",
      ],
      target: [
        "목표 팰몬 선택",
        "노리는 시즌 1 신화 팰몬을 고르면 뽑혔을 때 그 팰몬이 나옵니다. 시즌 2 신화는 아직 준비 중이에요.",
      ],
    },
    disclaimerBox:
      "시뮬레이션입니다 — 매번 새로 추첨하므로 돌릴 때마다 결과가 달라집니다. 실제 게임 결과를 예측하지는 못하고, 「평균적으로 이 정도 걸린다」는 감을 잡는 용도예요.",
    footNote: "게임 내 확률은 업데이트로 바뀔 수 있어요. 실제와 다르면",
    contact: "문의하기",
    footNoteTail: "로 알려주세요.",

    targetTitle: "⭐ 노리는 신화 팰몬",
    targetHint:
      "지금은 시즌 1 신화 팰몬만 고를 수 있어요. 뽑히면 그 팰몬이 나옵니다.",
    ownershipTitle: "🎯 신화 팰몬 보유 상태",
    ownershipHint:
      "이미 신화 팰몬이 있으면 확률표가 달라져요. 팰몬 자리에 오로라 정수가 들어가고 친밀도는 쌓이지 않습니다.",
    modeNoMythic: ["미보유", "신화 팰몬을 노리는 중"],
    modeHasMythic: ["보유", "이미 획득함"],
    noticeNoMythic:
      "신화 팰몬은 오로라 소환 시 한 번만 획득할 수 있습니다. 이후의 소환 시엔 오로라 정수를 획득합니다.",
    noticeHasMythic: "이미 신화 팰몬을 보유해 오로라 정수가 나옵니다.",
    heart: "친밀도",
    heartResetBtn: "친밀도 초기화",
    pityPassed: "천장을 이미 통과했어요.",
    pityRemain: (pulls) => `천장까지 평균 ${pulls}회 더 (운에 따라 달라져요)`,
    summonBtn: (count) => `${count}회 소환`,
    thisBatch: (count) => `이번 소환 (${count}회)`,
    restartBtn: "처음부터",
    totalTitle: "누적 결과",
    totalSummary: (pulls) => `총 ${pulls}회 소환 · 오로라 구슬 ${pulls}개 사용`,
    colItem: "아이템",
    colHits: "나온 횟수",
    colGained: "총 획득",
    colActualRate: "실제 확률",
    colRate: "확률",
    colHeart: "친밀도",
    ratesTitle: (mode) => `📊 현재 확률표 (${mode})`,

    popupBadge: "⭐ 신화 팰몬 획득",
    obtainedTitle: (name) => `${name} 획득!`,
    byDirect: (nth) => `${nth}번째 소환에서 0.13%를 뚫었어요!`,
    byPity: (goal, nth) =>
      `친밀도 ${goal}을 채워 ${nth}번째 소환에서 확정 획득했어요.`,
    afterNote: "이후 소환에서는 오로라 정수가 나옵니다.",
    btnRestart: "다시뽑기",
    btnEssence: "오로라정수 뽑기",
    btnConfirm: "확인",
    zoomLabel: (name) => `${name} 크게 보기`,
    closeLabel: "닫기",

    rankingTitle: "🏆 빨리 뽑은 랭킹",
    rankingNote: "검증되지 않은 기록이에요",
    rankingEmpty: "아직 등록된 기록이 없어요. 1등을 노려보세요!",
    colRank: "순위",
    colPalmon: "팰몬",
    colPulls: "소환 횟수",
    colPlayer: "플레이어",
    pullsValue: (n) => `${n}회`,
    byCeilingTag: "천장",
    serverBadge: (server) => `${server}서버`,
    registerBtn: "🏆 랭킹 등록",
    serverPlaceholder: "서버",
    nicknamePlaceholder: "닉네임",
    submitBtn: "등록",
    submitting: "등록 중…",
    submitted: (rank) => `${rank}위로 등록됐어요!`,
    submitFailed: "등록에 실패했어요. 잠시 후 다시 시도해주세요.",
    shardLabel: (palmonName) => `${palmonName} 증표`,
    dropLabels: {
      mythic: "신화 팰몬",
      shard1: "증표",
      shard2: "증표",
      fruit: "스킬열매",
      custom: "커스텀상자",
      power: "전력 보물상자",
      wood: "목판 보물상자",
      steel: "강철 보물상자",
      gold: "골드 보물상자",
      expbox: "경험치 보물상자",
      aurora1: "오로라 정수",
      aurora2: "오로라 정수",
      aurora5: "오로라 정수",
    },
  },
};

const en: SimulatorDict = {
  auroraSummon: {
    title: "Aurora Summons Simulator",
    description:
      "Pull one or ten at a time, just like in game, and get a feel for how long the pity takes.",
    metaDescription:
      "Run Aurora Summons the way the game does it — single and ten pulls, with the Heart pity all the way to 1,200.",

    howTo: "How pulling works",
    simulate: "Summon",
    lastUpdated: "Last updated",
    orbName: "Aurora Orb",
    orbDesc: "The currency for Aurora Summons. One orb is one pull.",
    rules: {
      chance: ["Mythic Palmon 0.13%", "Every pull has this chance to drop it outright."],
      pity: (goal, avg, avgPulls, worst) => [
        `Pity at ${goal}`,
        `Even without a hit, every pull adds Heart, and reaching ${goal} guarantees the palmon. Heart goes up by ${avg} per pull on average, so pity lands around ${avgPulls} pulls — ${worst} at the very worst.`,
      ],
      once: [
        "Only once",
        "After you get the Mythic Palmon, that slot turns into Aurora Essence. The whole drop table changes.",
      ],
      target: [
        "Pick your target",
        "Choose the Season 1 Mythic Palmon you are chasing and that is the one you get. Season 2 mythics are not in yet.",
      ],
    },
    disclaimerBox:
      "This is a simulation — every pull is rolled fresh, so results differ each time. It cannot predict your actual game, it just shows roughly how long it tends to take.",
    footNote: "In-game rates can change with updates. If something looks off, tell us via",
    contact: "Contact",
    footNoteTail: ".",

    targetTitle: "⭐ Target Mythic Palmon",
    targetHint:
      "Only Season 1 mythics for now. Whichever you pick is what you get when it drops.",
    ownershipTitle: "🎯 Do you already own a Mythic Palmon?",
    ownershipHint:
      "Owning one changes the drop table. The palmon slot becomes Aurora Essence and Heart no longer builds up.",
    modeNoMythic: ["Not yet", "Still chasing one"],
    modeHasMythic: ["Owned", "Already got one"],
    noticeNoMythic:
      "A Mythic Palmon can only be obtained once from Aurora Summons. After that, summons give Aurora Essence instead.",
    noticeHasMythic:
      "You already own a Mythic Palmon, so summons give Aurora Essence.",
    heart: "Heart",
    heartResetBtn: "Reset Heart",
    pityPassed: "Pity has already been reached.",
    pityRemain: (pulls) => `About ${pulls} more pulls to pity (luck varies)`,
    summonBtn: (count) => `Summon ×${count}`,
    thisBatch: (count) => `This batch (${count} ${count === 1 ? "pull" : "pulls"})`,
    restartBtn: "Start over",
    totalTitle: "Running totals",
    totalSummary: (pulls) => `${pulls} pulls · ${pulls} Aurora Orbs spent`,
    colItem: "Item",
    colHits: "Times",
    colGained: "Total",
    colActualRate: "Actual rate",
    colRate: "Rate",
    colHeart: "Heart",
    ratesTitle: (mode) => `📊 Current drop table (${mode})`,

    popupBadge: "⭐ Mythic Palmon obtained",
    obtainedTitle: (name) => `${name} obtained!`,
    byDirect: (nth) => `Beat the 0.13% on pull ${nth}!`,
    byPity: (goal, nth) => `Filled Heart to ${goal} and got it on pull ${nth}.`,
    afterNote: "From here on, summons give Aurora Essence.",
    btnRestart: "Pull again",
    btnEssence: "Pull for Essence",
    btnConfirm: "OK",
    zoomLabel: (name) => `View ${name} larger`,
    closeLabel: "Close",

    rankingTitle: "🏆 Fastest pulls",
    rankingNote: "Unverified records — just for fun",
    rankingEmpty: "No records yet. Be the first!",
    colRank: "Rank",
    colPalmon: "Palmon",
    colPulls: "Pulls",
    colPlayer: "Player",
    pullsValue: (n) => n,
    byCeilingTag: "Pity",
    serverBadge: (server) => `Server ${server}`,
    registerBtn: "🏆 Submit to ranking",
    serverPlaceholder: "Server",
    nicknamePlaceholder: "Nickname",
    submitBtn: "Submit",
    submitting: "Submitting…",
    submitted: (rank) => `Submitted at rank ${rank}!`,
    submitFailed: "Could not submit. Please try again in a moment.",
    shardLabel: (palmonName) => `${palmonName} Token`,
    dropLabels: {
      mythic: "Mythic Palmon",
      shard1: "Token",
      shard2: "Token",
      fruit: "Skill Fruit",
      custom: "Custom Chest",
      power: "Power Treasure Chest",
      wood: "Lumber Treasure Chest",
      steel: "Steel Treasure Chest",
      gold: "Gold Treasure Chest",
      expbox: "XP Treasure Chest",
      aurora1: "Aurora Essence",
      aurora2: "Aurora Essence",
      aurora5: "Aurora Essence",
    },
  },
};

export const simulatorDict: Record<CalcLang, SimulatorDict> = { ko, en };
