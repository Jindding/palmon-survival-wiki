import { sumLevelRange } from "@/lib/data/calculators/level-cost";
import { formatKrCompact, formatKrExact } from "@/lib/format";

// 경험치 · 스킬열매 계산기의 "대표 구간" 표.
// 두 페이지가 같은 형태라 공유한다.
//
// 경험치처럼 억 단위까지 가는 값은 그대로 늘어놓으면 훑어보기 어려워 만/억으로 줄이고,
// 스킬열매처럼 10만 안쪽에서 끝나는 값은 줄이면 오히려 정보가 깎이므로 그대로 쓴다.
// 기준은 전체 누적이 100만을 넘는지 여부다.
const COMPACT_THRESHOLD = 1_000_000;

export function MilestoneTable({
  costs,
  milestones,
  unit,
}: {
  costs: readonly number[];
  milestones: number[];
  /** 숫자 뒤에 붙는 단위 (예: "개") */
  unit?: string;
}) {
  const grandTotal = sumLevelRange(costs, 1, milestones[milestones.length - 1]);
  const compact = grandTotal >= COMPACT_THRESHOLD;
  const show = compact ? formatKrCompact : formatKrExact;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-app text-fg-subtle text-xs">
            <th className="text-left py-2 px-2 font-normal">구간</th>
            <th className="text-right py-2 px-2 font-normal">이 구간</th>
            <th className="text-right py-2 px-2 font-normal">누적</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map((lv, i) => {
            const from = i === 0 ? 1 : milestones[i - 1];
            const step = sumLevelRange(costs, from, lv);
            const cumulative = sumLevelRange(costs, 1, lv);
            return (
              <tr key={lv} className="border-b border-app/50 last:border-0">
                <td className="py-2.5 px-2 whitespace-nowrap">
                  <span className="text-fg-subtle">Lv {from}</span>
                  <span className="text-fg-subtle mx-1">→</span>
                  <span className="font-bold">Lv {lv}</span>
                </td>
                <td
                  className="py-2.5 px-2 text-right tabular-nums text-fg-muted whitespace-nowrap"
                  title={formatKrExact(step)}
                >
                  {show(step)}
                  {unit}
                </td>
                <td
                  className="py-2.5 px-2 text-right tabular-nums font-bold text-palmon-primary whitespace-nowrap"
                  title={formatKrExact(cumulative)}
                >
                  {show(cumulative)}
                  {unit}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-[11px] text-fg-subtle mt-2 px-2">
        「누적」은 Lv 1부터 그 레벨까지의 총합이에요.
        {compact && " 숫자에 마우스를 올리면 정확한 값을 볼 수 있어요."}
      </p>
    </div>
  );
}
