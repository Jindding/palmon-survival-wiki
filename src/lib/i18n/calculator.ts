// 계산기 전용 한/영 문구 사전.
//
// 영문 지원은 /calculator/* 에만 있다. 사이트 나머지는 한국어 전용이다.
// 게임 용어 영문 표기는 docs/term-translation.txt 의 대조표를 따른다.
//   진화 정수 = Evolution Essence / 에너지 구슬 = Evolution Energy
//   걸작구슬 = Opus Pearl / 만능 팰몬조각 = UR Omni Token
//   팰몬 경험치 = Palmon XP / 스킬열매 = Skill Fruit
//
// 숫자가 끼어드는 문구는 함수로 둔다. 한국어와 영어의 어순·조사가 달라
// 문자열을 조각내서 붙이면 어느 한쪽이 반드시 어색해지기 때문이다.

export type CalcLang = "ko" | "en";

export const CALC_LANGS: CalcLang[] = ["ko", "en"];

/** 스위처에 표시할 이름. 어느 언어에서든 양쪽 다 보여야 해서 고정값이다. */
export const CALC_LANG_LABEL: Record<CalcLang, string> = {
  ko: "한국어",
  en: "English",
};

export interface CalcUiText {
  howTo: string;
  calculator: string;
  lastUpdated: string;
  disclaimer: string;
  contact: string;
  disclaimerTail: string;
  emptyHint: string;
  ownedPlaceholder: string;
  resetAll: string;
  owned: string;
  usableTotal: string;
  leftOver: string;
  shortLabel: string;
  shortBig: (amount: string) => string;
  targetBasis: (label: string) => string;
  toNext: string;
  toNextValue: (amount: string) => string;
  refundRow: (rank: string) => string;
  refundCalc: (count: string, unit: string, unitRefund: string, subtotal: string) => string;
  leftoverHint: (remain: string) => string;
  /** 계산기 밖은 한국어 전용이라는 안내 */
  koOnlyNotice: string;
}

export interface ItemIntroText {
  name: string;
  desc: string;
}

export interface RankTableText {
  rankHeader: string;
  stageHeader: string;
  stepHeader: string;
  cumulativeHeader: string;
}

export interface PageText {
  title: string;
  description: string;
  metaDescription: string;
}

export interface CalcDict {
  ui: CalcUiText;
  rankTable: RankTableText;

  evolutionEssence: PageText & {
    item: ItemIntroText;
    stageLabel: (stage: number) => string;
    targetStage: string;
    ownedLabel: string;
    resetSectionLabel: string;
    resetHint: string;
    resetPerUnit: (stage: number, refund: string) => string;
    needPerOne: (stage: number) => string;
    countUnit: string;
    bullets: { reset: [string, string]; season: [string, string]; mega: [string, string] };
  };

  palmonShard: PageText & {
    item: ItemIntroText;
    rankLabel: (rank: number) => string;
    targetRank: string;
    ownedLabel: string;
    needPerOne: (rank: number) => string;
    countUnit: string;
    promoted: string;
    bullets: {
      full: (total: string) => [string, string];
      separate: [string, string];
      fullSet: [string, string];
    };
  };

  masterworkBead: PageText & {
    item: ItemIntroText;
    rankLabel: (rank: number) => string;
    targetRank: string;
    ownedLabel: string;
    resetSectionLabel: string;
    resetHint: string;
    resetPerUnit: (rank: number, refund: string) => string;
    needPerOne: (rank: number) => string;
    countUnit: string;
    bullets: {
      weapon: (perWeapon: string, maxRank: number, maxCost: string) => [string, string];
      reset: [string, string];
      separate: [string, string];
    };
  };

  energyBead: PageText & {
    item: ItemIntroText;
    currentLabel: string;
    targetLabel: string;
    startFromScratch: string;
    beforeStartGroup: string;
    completedSuffix: (label: string) => string;
    ownedLabel: string;
    ownedPlaceholder: string;
    alreadyDone: string;
    totalNeed: string;
    stageHeader: string;
    stepCountHeader: string;
    needHeader: string;
    evoTotal: string;
    megaTotal: string;
    grandTotal: string;
    breakdown: string;
    /** 소단계 라벨. 그룹 머리글이 따로 붙으므로 번호만 쓴다 */
    stepLabel: (stepNo: number) => string;
    /** 진화 단계 이름. 데이터의 한국어 라벨을 키로 받는다 */
    groupLabels: Record<string, string>;
    bullets: {
      substep: [string, string];
      upgrades: (per: number) => [string, string];
      separate: [string, string];
    };
  };

  levelCost: {
    currentLevel: string;
    targetLevel: string;
    range: (max: number) => string;
    ownedLabel: (item: string) => string;
    ownedPlaceholder: string;
    alreadyDone: string;
    needed: string;
    cumulativeToTarget: (target: number) => string;
    milestoneRange: string;
    milestoneStep: string;
    milestoneCumulative: string;
    milestoneNote: string;
    milestoneHover: string;
  };

  palmonExp: PageText & {
    item: ItemIntroText;
    itemShort: string;
    bullets: { max: (max: number, total: string) => [string, string]; sum: [string, string]; box: [string, string] };
  };

  skillFruit: PageText & {
    item: ItemIntroText;
    itemShort: string;
    unit: string;
    bullets: { full: (max: number, total: string) => [string, string]; perSkill: [string, string]; box: [string, string] };
  };
}

// ═══════════════════════════════════════════ 한국어

const ko: CalcDict = {
  ui: {
    howTo: "계산 방법",
    calculator: "계산기",
    lastUpdated: "최종 업데이트",
    disclaimer: "게임 내 수치는 업데이트로 바뀔 수 있어요. 실제와 다르면",
    contact: "문의하기",
    disclaimerTail: "로 알려주세요.",
    emptyHint: "보유 개수를 입력하면 결과가 바로 나와요.",
    ownedPlaceholder: "지금 가진 개수",
    resetAll: "전체 초기화",
    owned: "보유",
    usableTotal: "사용 가능 총합",
    leftOver: "완성 후 남는 양",
    shortLabel: "모자란 양",
    shortBig: (amount) => `${amount}개 부족`,
    targetBasis: (label) => `${label} 기준`,
    toNext: "다음 1개까지",
    toNextValue: (amount) => `${amount}개 더`,
    refundRow: (rank) => `↻ ${rank} 초기화`,
    refundCalc: (count, unit, unitRefund, subtotal) =>
      `${count}${unit} × ${unitRefund} = +${subtotal}`,
    leftoverHint: (remain) => `남은 ${remain}개로 추가 완성 가능`,
    koOnlyNotice: "",
  },
  rankTable: {
    rankHeader: "성급",
    stageHeader: "단계",
    stepHeader: "필요 개수",
    cumulativeHeader: "누적 필요 개수",
  },

  evolutionEssence: {
    title: "진화 정수 계산기",
    description: "지금 가진 정수로 팰몬을 몇 마리나 진화시킬 수 있는지 계산해요.",
    metaDescription:
      "기존 팰몬을 목표 진화 단계까지 올리는 데 필요한 진화 정수를 계산하고, 초기화 환급까지 반영해 완성 마릿수를 확인해요.",
    item: {
      name: "진화 정수",
      desc: "기존 팰몬을 진화시킬 때 쓰는 재화예요. 단계가 오를수록 비용이 커지고, 앞 단계 비용이 그대로 누적됩니다.",
    },
    stageLabel: (stage) => `진화 ${stage}단계`,
    targetStage: "🎯 목표 단계",
    ownedLabel: "보유 진화 정수",
    resetSectionLabel: "↻ 초기화할 팰몬 (선택)",
    resetHint:
      "이미 진화시킨 팰몬을 초기화하면 들어간 정수를 전부 돌려받아요. 단계별 마릿수를 넣으면 환급량이 보유량에 더해집니다.",
    resetPerUnit: (stage, refund) => `${stage}단계 · 1마리 +${refund}`,
    needPerOne: (stage) => `진화 ${stage}단계 1마리 필요`,
    countUnit: "마리",
    bullets: {
      reset: ["↻ 초기화", "키운 팰몬을 되돌리면 들어간 정수를 전액 돌려받아요. 손해가 없습니다."],
      season: ["시즌 팰몬", "재화 이름만 「오로라 정수」로 다르고 계산은 똑같아요."],
      mega: ["메가진화 5~8단계", "「메가 진화석」이라는 다른 재화를 써서 여기서는 계산되지 않아요."],
    },
  },

  palmonShard: {
    title: "만능 팰몬조각 계산기",
    description: "지금 가진 조각으로 팰몬을 몇 마리나 승급시킬 수 있는지 계산해요.",
    metaDescription:
      "보유한 UR 만능 팰몬조각으로 팰몬을 몇 마리나 승급시킬 수 있는지 성급별로 계산해요.",
    item: {
      name: "UR 만능 팰몬조각",
      desc: "팰몬을 승급시킬 때 쓰는 재화예요. 승급은 성급(★)으로 나뉘고, 성급이 오를수록 앞 성급 비용이 그대로 누적됩니다.",
    },
    rankLabel: (rank) => `${rank}성`,
    targetRank: "🎯 목표 성급",
    ownedLabel: "보유 UR 만능 팰몬조각",
    needPerOne: (rank) => `${rank}성 1마리 필요`,
    countUnit: "마리",
    promoted: "승급 후 남는 양",
    bullets: {
      full: (total) => [`5성 1마리 = ${total}개`, "팰몬 한 마리를 5성까지 올리는 데 드는 총 조각 수예요."],
      separate: ["진화와는 별개", "승급은 조각, 진화는 진화 정수를 씁니다. 한 마리를 완성하려면 둘 다 필요해요."],
      fullSet: ["풀세팅 마릿수", "승급 가능 마릿수와 진화 가능 마릿수 중 더 작은 쪽이 실제로 완성할 수 있는 수예요."],
    },
  },

  masterworkBead: {
    title: "걸작구슬 계산기",
    description: "지금 가진 구슬로 무기를 몇 개나 승급시킬 수 있는지 계산해요.",
    metaDescription:
      "보유한 걸작구슬로 무기를 목표 성급까지 몇 개나 올릴 수 있는지 계산해요.",
    item: {
      name: "걸작구슬",
      desc: "무기의 성급(★)을 올릴 때 쓰는 재화예요. 팰몬 승급과 달리 ★10까지 있고, 성급이 오를수록 앞 성급 비용이 그대로 누적됩니다.",
    },
    rankLabel: (rank) => `${rank}성`,
    targetRank: "🎯 목표 성급",
    ownedLabel: "보유 걸작구슬",
    resetSectionLabel: "↻ 초기화할 무기 (선택)",
    resetHint:
      "이미 올린 무기를 초기화하면 들어간 구슬을 전부 돌려받아요. 성급별 개수를 넣으면 환급량이 보유량에 더해집니다.",
    resetPerUnit: (rank, refund) => `${rank}성 · +${refund}`,
    needPerOne: (rank) => `${rank}성 무기 1개 필요`,
    countUnit: "개",
    bullets: {
      weapon: (perWeapon, maxRank, maxCost) => [
        `무기 1개(5성) = ${perWeapon}개`,
        `흔히 말하는 「무기 하나 완성」 기준이에요. ★${maxRank}까지 올리려면 ${maxCost}개가 듭니다.`,
      ],
      reset: ["↻ 초기화", "올린 무기를 되돌리면 들어간 구슬을 전액 돌려받아요. 손해가 없습니다."],
      separate: ["팰몬 승급과는 별개", "무기는 걸작구슬, 팰몬은 UR 만능 팰몬조각을 씁니다."],
    },
  },

  energyBead: {
    title: "에너지 구슬 계산기",
    description: "지금 진행도에서 목표 단계까지 에너지 구슬이 얼마나 필요한지 계산해요.",
    metaDescription:
      "현재 진행도에서 목표 단계까지 진화 조건을 채우는 데 필요한 에너지 구슬을 계산해요.",
    item: {
      name: "에너지 구슬",
      desc: "다음 진화 단계로 넘어가기 위한 조건을 채우는 재료예요. 진화에 쓰는 진화 정수와는 별개라 양쪽을 모두 준비해야 합니다.",
    },
    currentLabel: "📍 현재 (완료한 곳까지)",
    targetLabel: "🎯 목표",
    startFromScratch: "처음 시작",
    beforeStartGroup: "시작 전",
    completedSuffix: (label) => `${label} 완료`,
    ownedLabel: "보유 에너지 구슬",
    ownedPlaceholder: "지금 가진 개수 (비워두면 필요량만 계산)",
    alreadyDone: "목표가 현재 진행도보다 앞이에요. 추가로 필요한 에너지 구슬이 없습니다.",
    totalNeed: "필요 합계",
    stageHeader: "단계",
    stepCountHeader: "소단계 수",
    needHeader: "필요 개수",
    evoTotal: "진화 합계",
    megaTotal: "메가진화 + 스킬해금 합계",
    grandTotal: "전체 합계",
    breakdown: "단계별 내역",
    stepLabel: (stepNo) => `${stepNo}번`,
    groupLabels: {
      "진화 1단계": "진화 1단계",
      "진화 2단계": "진화 2단계",
      "진화 3단계": "진화 3단계",
      "진화 4단계": "진화 4단계",
      "메가진화 5단계": "메가진화 5단계",
      "메가진화 6단계": "메가진화 6단계",
      "메가진화 7단계": "메가진화 7단계",
      "메가진화 8단계": "메가진화 8단계",
      "메가 스킬해금": "메가 스킬해금",
    },
    bullets: {
      substep: ["소단계로 나뉘어요", "한 진화 단계는 여러 소단계로 쪼개져 있고, 소단계마다 필요한 양이 다릅니다."],
      upgrades: (per) => [
        `강화 ${per}회`,
        `표의 값은 소단계 하나를 끝내는 총량이에요. 실제로는 ${per}번에 나눠 강화합니다 (1회 = 표시값 ÷ ${per}).`,
      ],
      separate: ["진화 정수와 별개", "조건은 에너지 구슬, 진화 자체는 진화 정수입니다."],
    },
  },

  levelCost: {
    currentLevel: "현재 레벨",
    targetLevel: "목표 레벨",
    range: (max) => `1 ~ ${max}`,
    ownedLabel: (item) => `보유 ${item}`,
    ownedPlaceholder: "비워두면 필요량만 계산해요",
    alreadyDone: "목표 레벨이 현재 레벨보다 같거나 낮아요. 목표를 더 높게 잡아 보세요.",
    needed: "필요량",
    cumulativeToTarget: (target) => `Lv 1 → Lv ${target} 전체 누적`,
    milestoneRange: "구간",
    milestoneStep: "이 구간",
    milestoneCumulative: "누적",
    milestoneNote: "「누적」은 Lv 1부터 그 레벨까지의 총합이에요.",
    milestoneHover: " 숫자에 마우스를 올리면 정확한 값을 볼 수 있어요.",
  },

  palmonExp: {
    title: "경험치 계산기",
    description: "현재 레벨에서 목표 레벨까지 필요한 팰몬 경험치를 계산해요.",
    metaDescription:
      "현재 레벨에서 목표 레벨까지 팰몬을 키우는 데 필요한 경험치를 계산해요.",
    item: {
      name: "팰몬 경험치",
      desc: "팰몬 레벨을 올리는 데 쓰는 재화예요. 레벨이 오를수록 한 레벨당 비용이 가파르게 늘어납니다.",
    },
    itemShort: "경험치",
    bullets: {
      max: (max, total) => [`최대 Lv ${max}`, `Lv 1부터 끝까지 올리려면 총 ${total}이 필요해요.`],
      sum: ["구간 합산", "현재 레벨부터 목표 레벨 직전까지의 레벨업 비용을 모두 더한 값이 필요량입니다."],
      box: ["경험치 상자는 미포함", "상자 보상이 캠프 레벨에 따라 달라져서, 지금은 순수 필요량만 계산해요."],
    },
  },

  skillFruit: {
    title: "스킬열매 계산기",
    description: "스킬 하나를 목표 레벨까지 올리는 데 필요한 열매 개수를 계산해요.",
    metaDescription:
      "스킬을 현재 레벨에서 목표 레벨까지 올리는 데 필요한 스킬 레벨업 열매를 계산해요.",
    item: {
      name: "스킬 레벨업 열매",
      desc: "팰몬 스킬의 레벨을 올리는 데 쓰는 재화예요.",
    },
    itemShort: "스킬열매",
    unit: "개",
    bullets: {
      full: (max, total) => [
        `스킬 1개 풀레벨 = ${total}개`,
        `Lv 1에서 Lv ${max}까지 올리는 데 드는 총 열매 수예요.`,
      ],
      perSkill: ["스킬 단위 계산", "팰몬 한 마리가 아니라 스킬 하나 기준입니다. 여러 스킬을 올리려면 그만큼 곱해 주세요."],
      box: ["열매상자는 미포함", "상자 보상이 확률 기반이라, 지금은 순수 필요량만 계산해요."],
    },
  },
};

// ═══════════════════════════════════════════ English

const en: CalcDict = {
  ui: {
    howTo: "How it works",
    calculator: "Calculator",
    lastUpdated: "Last updated",
    disclaimer: "In-game values can change with updates. If something looks off, tell us via",
    contact: "Contact",
    disclaimerTail: ".",
    emptyHint: "Enter what you have and the result appears right away.",
    ownedPlaceholder: "How many you have",
    resetAll: "Reset all",
    owned: "Owned",
    usableTotal: "Usable total",
    leftOver: "Left over",
    shortLabel: "Short by",
    shortBig: (amount) => `${amount} short`,
    targetBasis: (label) => `Target: ${label}`,
    toNext: "To the next one",
    toNextValue: (amount) => `${amount} more`,
    refundRow: (rank) => `↻ Reset ${rank}`,
    refundCalc: (count, _unit, unitRefund, subtotal) =>
      `${count} × ${unitRefund} = +${subtotal}`,
    leftoverHint: (remain) => `With the ${remain} left over you can also make`,
    koOnlyNotice: "Only the calculators are available in English. The rest of the site is Korean only.",
  },
  rankTable: {
    rankHeader: "Star",
    stageHeader: "Stage",
    stepHeader: "This star",
    cumulativeHeader: "Cumulative",
  },

  evolutionEssence: {
    title: "Evolution Essence Calculator",
    description:
      "See how many palmons you can evolve with the Evolution Essence you have.",
    metaDescription:
      "Work out the Evolution Essence needed to reach a target evolution stage, including refunds from resetting palmons.",
    item: {
      name: "Evolution Essence",
      desc: "Used to evolve standard palmons. Each stage costs more, and every earlier stage is included in the total.",
    },
    stageLabel: (stage) => `Stage ${stage}`,
    targetStage: "🎯 Target stage",
    ownedLabel: "Evolution Essence owned",
    resetSectionLabel: "↻ Palmons to reset (optional)",
    resetHint:
      "Resetting an evolved palmon refunds every essence you put in. Enter how many you will reset per stage and the refund is added to your total.",
    resetPerUnit: (stage, refund) => `Stage ${stage} · each +${refund}`,
    needPerOne: (stage) => `Needed for one Stage ${stage}`,
    countUnit: "",
    bullets: {
      reset: ["↻ Reset", "Rolling a palmon back refunds the full amount. Nothing is lost."],
      season: ["Season palmons", "They use Aurora Essence instead, but the maths is identical."],
      mega: ["Mega Evolution (5–8)", "Those stages use Mega Evolution Stones, a separate currency, so they are not covered here."],
    },
  },

  palmonShard: {
    title: "UR Omni Token Calculator",
    description:
      "See how many palmons you can promote with the UR Omni Tokens you have.",
    metaDescription:
      "Work out how many palmons you can promote to each star rank with your UR Omni Tokens.",
    item: {
      name: "UR Omni Token",
      desc: "Used to promote palmons. Promotion is measured in stars (★), and every earlier star is included in the total.",
    },
    rankLabel: (rank) => `★${rank}`,
    targetRank: "🎯 Target star",
    ownedLabel: "UR Omni Tokens owned",
    needPerOne: (rank) => `Needed for one ★${rank}`,
    countUnit: "",
    promoted: "Left over",
    bullets: {
      full: (total) => [`One ★5 palmon = ${total}`, "That is the total number of tokens to take a single palmon all the way to ★5."],
      separate: ["Separate from evolution", "Promotion uses tokens, evolution uses Evolution Essence. A finished palmon needs both."],
      fullSet: ["Full builds", "Whichever is lower — palmons you can promote or palmons you can evolve — is how many you can actually finish."],
    },
  },

  masterworkBead: {
    title: "Opus Pearl Calculator",
    description: "See how many weapons you can upgrade with the Opus Pearls you have.",
    metaDescription:
      "Work out how many weapons you can take to a target star rank with your Opus Pearls.",
    item: {
      name: "Opus Pearl",
      desc: "Used to raise a weapon's star rank (★). Unlike palmon promotion this goes up to ★10, and every earlier star is included in the total.",
    },
    rankLabel: (rank) => `★${rank}`,
    targetRank: "🎯 Target star",
    ownedLabel: "Opus Pearls owned",
    resetSectionLabel: "↻ Weapons to reset (optional)",
    resetHint:
      "Resetting an upgraded weapon refunds every pearl you put in. Enter how many you will reset per star and the refund is added to your total.",
    resetPerUnit: (rank, refund) => `★${rank} · each +${refund}`,
    needPerOne: (rank) => `Needed for one ★${rank} weapon`,
    countUnit: "",
    bullets: {
      weapon: (perWeapon, maxRank, maxCost) => [
        `One weapon (★5) = ${perWeapon}`,
        `That is what people usually mean by "finishing a weapon". Taking one to ★${maxRank} costs ${maxCost}.`,
      ],
      reset: ["↻ Reset", "Rolling a weapon back refunds the full amount. Nothing is lost."],
      separate: ["Separate from palmon promotion", "Weapons use Opus Pearls, palmons use UR Omni Tokens."],
    },
  },

  energyBead: {
    title: "Evolution Energy Calculator",
    description:
      "Work out how much Evolution Energy you need to get from where you are to your target stage.",
    metaDescription:
      "Work out the Evolution Energy needed to meet evolution requirements from your current progress to a target stage.",
    item: {
      name: "Evolution Energy",
      desc: "Material that meets the requirement for moving to the next evolution stage. It is separate from Evolution Essence, so you need both.",
    },
    currentLabel: "📍 Current (last one completed)",
    targetLabel: "🎯 Target",
    startFromScratch: "From the start",
    beforeStartGroup: "Not started",
    completedSuffix: (label) => `${label} done`,
    ownedLabel: "Evolution Energy owned",
    ownedPlaceholder: "Leave empty to see the requirement only",
    alreadyDone:
      "Your target is behind your current progress, so no extra Evolution Energy is needed.",
    totalNeed: "Total needed",
    stageHeader: "Stage",
    stepCountHeader: "Steps",
    needHeader: "Needed",
    evoTotal: "Evolution total",
    megaTotal: "Mega Evolution + skill unlock total",
    grandTotal: "Grand total",
    breakdown: "Breakdown by stage",
    stepLabel: (stepNo) => `Step ${stepNo}`,
    groupLabels: {
      "진화 1단계": "Stage 1",
      "진화 2단계": "Stage 2",
      "진화 3단계": "Stage 3",
      "진화 4단계": "Stage 4",
      "메가진화 5단계": "Mega Stage 5",
      "메가진화 6단계": "Mega Stage 6",
      "메가진화 7단계": "Mega Stage 7",
      "메가진화 8단계": "Mega Stage 8",
      "메가 스킬해금": "Mega skill unlock",
    },
    bullets: {
      substep: ["Split into steps", "Each evolution stage is split into several steps, and every step costs a different amount."],
      upgrades: (per) => [
        `${per} upgrades per step`,
        `The table shows the total for finishing one step. In game you spend it over ${per} upgrades (one upgrade = the listed value ÷ ${per}).`,
      ],
      separate: ["Separate from Evolution Essence", "Energy meets the requirement; the evolution itself costs Evolution Essence."],
    },
  },

  levelCost: {
    currentLevel: "Current level",
    targetLevel: "Target level",
    range: (max) => `1 – ${max}`,
    ownedLabel: (item) => `${item} owned`,
    ownedPlaceholder: "Leave empty to see the requirement only",
    alreadyDone:
      "Your target level is the same as or lower than your current level. Try aiming higher.",
    needed: "Needed",
    cumulativeToTarget: (target) => `Total from Lv 1 to Lv ${target}`,
    milestoneRange: "Range",
    milestoneStep: "This range",
    milestoneCumulative: "Cumulative",
    milestoneNote: "“Cumulative” is the total from Lv 1 up to that level.",
    milestoneHover: " Hover a number to see the exact value.",
  },

  palmonExp: {
    title: "Palmon XP Calculator",
    description: "Work out the Palmon XP needed to get from your current level to your target.",
    metaDescription:
      "Work out how much Palmon XP you need to raise a palmon from its current level to a target level.",
    item: {
      name: "Palmon XP",
      desc: "Used to raise a palmon's level. The cost per level climbs steeply as the level goes up.",
    },
    itemShort: "Palmon XP",
    bullets: {
      max: (max, total) => [`Max Lv ${max}`, `Going from Lv 1 all the way up takes ${total} in total.`],
      sum: ["Range total", "The requirement is every level-up cost from your current level up to just before the target."],
      box: ["XP boxes not included", "Box rewards depend on your camp level, so only the raw requirement is calculated for now."],
    },
  },

  skillFruit: {
    title: "Skill Fruit Calculator",
    description: "Work out how many Skill Fruits it takes to raise one skill to your target level.",
    metaDescription:
      "Work out how many Skill Fruits you need to raise a skill from its current level to a target level.",
    item: {
      name: "Skill Fruit",
      desc: "Used to raise the level of a palmon's skill.",
    },
    itemShort: "Skill Fruit",
    unit: "",
    bullets: {
      full: (max, total) => [
        `One skill maxed = ${total}`,
        `That is the total number of fruits to take a skill from Lv 1 to Lv ${max}.`,
      ],
      perSkill: ["Counted per skill", "This is per skill, not per palmon. Multiply if you plan to raise several skills."],
      box: ["Fruit boxes not included", "Box rewards are random, so only the raw requirement is calculated for now."],
    },
  },
};

export const calcDict: Record<CalcLang, CalcDict> = { ko, en };
