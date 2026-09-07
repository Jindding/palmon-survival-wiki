import { Star } from "lucide-react";
import { STAR_RANKS, type StarRank } from "@/lib/data/calculators/palmon-shard";

// 승급 성급 배지. 별 5개 중 해당 성급만큼 금색으로 채운다.
// 진화 단계 배지(EvolutionStageBadge)와 같은 역할이며, 승급은 별로 표기되므로 별을 쓴다.
export function StarRankBadge({
  rank,
  size = 14,
  className = "",
}: {
  rank: StarRank;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${rank}성`}
    >
      {STAR_RANKS.map((r) => {
        const on = r <= rank;
        return (
          <Star
            key={r}
            size={size}
            aria-hidden
            className="shrink-0"
            fill={on ? "#FFB020" : "none"}
            stroke={on ? "#FF8A00" : "#B0B2BA"}
            strokeWidth={2}
          />
        );
      })}
    </span>
  );
}
