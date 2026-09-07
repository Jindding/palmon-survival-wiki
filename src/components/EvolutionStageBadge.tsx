import type { EvoStage } from "@/lib/data/calculators/evolution-essence";

// 진화 단계 배지. 게임 내 진화 단계 표식을 SVG로 재현했다.
// 네 개의 날 중 [단계 수]만큼 금색으로 켜지고, 나머지는 회색으로 꺼진다.
//   4단계 = 전부 점등 / 3단계 = 우측 아래 꺼짐 / 2단계 = 아래 두 개 꺼짐 / 1단계 = 좌측 위만 점등
// 원본 게임 아이콘은 가운데 숫자가 문양 위에 겹쳐 그려져 있어 지울 수 없으므로,
// 숫자를 빼고 날 점등만으로 단계를 표현하도록 다시 그렸다.
//
// 작은 크기(18px)에서도 켜짐/꺼짐이 구분돼야 하므로 그라데이션·발광 원 없이 단색으로만 그린다.
// 네 날은 가운데에서 서로 떨어져 있고, 끝을 뾰족하게 유지하려고 strokeLinejoin은 miter를 쓴다
// (round로 두면 날 끝이 뭉개진다).

// 점등 순서 = 좌측 위 → 우측 위 → 좌측 아래 → 우측 아래.
// 즉 꺼지는 순서는 그 역순이라 우측 아래가 가장 먼저 꺼진다.
const BLADE_ANGLES = [225, 315, 135, 45];

const CENTER = 32;
/** 날 끝이 중심에서 떨어진 거리 */
const TIP_RADIUS = 31;
/** 날 안쪽 끝. 0이 아니라서 네 날이 가운데에서 서로 떨어진다. */
const INNER_RADIUS = 5;
/** 날이 가장 넓어지는 지점의 반폭 */
const HALF_WIDTH = 6;
/** 가장 넓어지는 지점이 안쪽 끝~날 끝 사이 어디인지 (0=안쪽 끝, 1=날 끝) */
const WIDEST_AT = 0.18;

// 게임 아이콘의 밝은 주황색을 그대로 쓴다.
// 외곽선을 갈색 계열로 잡으면 전체가 탁해 보이므로, 채움보다 살짝 진한 색으로만 두른다.
// 메가진화(5~8단계)는 일반 진화와 구분되도록 같은 밝기의 붉은색을 쓴다.
export type StageBadgeTone = "gold" | "red";

export const TONE_COLORS: Record<StageBadgeTone, { fill: string; stroke: string }> = {
  gold: { fill: "#FFB020", stroke: "#FF8A00" },
  red: { fill: "#FF5A47", stroke: "#EE3B22" },
};

const OFF_FILL = "#C2C4CB";
const OFF_STROKE = "#93969F";
const STROKE_WIDTH = 1.5;

function round(n: number): string {
  return n.toFixed(2);
}

/**
 * 중심에서 angleDeg 방향으로 뻗는 표창 날 하나의 path.
 * 안쪽 끝 → 좌우로 벌어졌다가 → 날 끝으로 모이는 나뭇잎 모양이며,
 * 안쪽 끝이 중심에 닿지 않아 네 날이 서로 떨어져 보인다.
 */
function bladePath(angleDeg: number): string {
  const a = (angleDeg * Math.PI) / 180;
  const perp = a + Math.PI / 2;
  const widestRadius = INNER_RADIUS + (TIP_RADIUS - INNER_RADIUS) * WIDEST_AT;

  const at = (radius: number, offset: number): string => {
    const x = CENTER + radius * Math.cos(a) + offset * Math.cos(perp);
    const y = CENTER + radius * Math.sin(a) + offset * Math.sin(perp);
    return `${round(x)} ${round(y)}`;
  };

  return [
    `M${at(TIP_RADIUS, 0)}`,
    `L${at(widestRadius, -HALF_WIDTH)}`,
    `L${at(INNER_RADIUS, 0)}`,
    `L${at(widestRadius, HALF_WIDTH)}`,
    "Z",
  ].join(" ");
}

export function EvolutionStageBadge({
  stage,
  size = 40,
  tone = "gold",
  label,
  className = "",
}: {
  /** 몇 개의 날을 켤지 (1~4) */
  stage: EvoStage;
  size?: number;
  tone?: StageBadgeTone;
  /** 스크린리더용 설명. 메가진화처럼 단계 번호가 다를 때 직접 넘긴다. */
  label?: string;
  className?: string;
}) {
  const { fill: ON_FILL, stroke: ON_STROKE } = TONE_COLORS[tone];
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      role="img"
      aria-label={label ?? `진화 ${stage}단계`}
    >
      {/* 날끼리 겹치지 않으므로 그리는 순서는 상관없다 */}
      {BLADE_ANGLES.map((angle, i) => {
        const on = i < stage;
        return (
          <path
            key={angle}
            d={bladePath(angle)}
            fill={on ? ON_FILL : OFF_FILL}
            stroke={on ? ON_STROKE : OFF_STROKE}
            strokeWidth={STROKE_WIDTH}
            strokeLinejoin="miter"
            strokeMiterlimit={10}
          />
        );
      })}
    </svg>
  );
}
