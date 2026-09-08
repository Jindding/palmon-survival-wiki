import { Star } from "lucide-react";
import { TONE_COLORS } from "./EvolutionStageBadge";

// 성급 배지. 진화 단계 배지(EvolutionStageBadge)와 같은 역할이며, 승급은 별로 표기되므로 별을 쓴다.
//
// 팰몬 승급(max 5): 별 5개 중 rank개를 금색으로 채운다.
// 무기 승급(max 10): 6성부터 별 색이 붉게 바뀌고 개수가 다시 1개부터 시작한다.
//   ★5 = 노란 별 5개 / ★6 = 붉은 별 1개 / ★10 = 붉은 별 5개
//   별 개수만으로 성급을 알 수 있으므로 숫자는 넣지 않는다 (옆 라벨과 중복된다).

const GOLD = TONE_COLORS.gold;
const RED = TONE_COLORS.red;
const OFF_STROKE = "#B0B2BA";

/** 색이 한 번 바뀌는 지점. 이 값을 넘으면 다시 1개부터 센다. */
const TIER_SIZE = 5;

export function StarRankBadge({
  rank,
  max = 5,
  size = 14,
  className = "",
}: {
  rank: number;
  max?: number;
  size?: number;
  className?: string;
}) {
  const wrapperCls = `inline-flex items-center gap-0.5 ${className}`;

  if (max > TIER_SIZE) {
    const isHighTier = rank > TIER_SIZE;
    const count = isHighTier ? rank - TIER_SIZE : rank;
    const tone = isHighTier ? RED : GOLD;
    return (
      <span className={wrapperCls} role="img" aria-label={`${rank}성`}>
        {Array.from({ length: count }, (_, i) => (
          <Star
            key={i}
            size={size}
            aria-hidden
            className="shrink-0"
            fill={tone.fill}
            stroke={tone.stroke}
            strokeWidth={2}
          />
        ))}
      </span>
    );
  }

  return (
    <span className={wrapperCls} role="img" aria-label={`${rank}성`}>
      {Array.from({ length: max }, (_, i) => i + 1).map((r) => {
        const on = r <= rank;
        return (
          <Star
            key={r}
            size={size}
            aria-hidden
            className="shrink-0"
            fill={on ? GOLD.fill : "none"}
            stroke={on ? GOLD.stroke : OFF_STROKE}
            strokeWidth={2}
          />
        );
      })}
    </span>
  );
}
