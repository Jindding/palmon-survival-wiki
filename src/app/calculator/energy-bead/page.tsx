import type { Metadata } from "next";
import Image from "next/image";
import { Sigma, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { Section } from "@/components/Section";
import {
  EvolutionStageBadge,
  TONE_COLORS,
} from "@/components/EvolutionStageBadge";
import { formatKrNum } from "@/lib/format";
import {
  ENERGY_BEAD_IMAGE,
  ENERGY_EVO_GROUPS,
  ENERGY_MEGA_GROUPS,
  ENERGY_EVO_TOTAL,
  ENERGY_MEGA_TOTAL,
  ENERGY_TOTAL,
  ENERGY_UPGRADES_PER_STEP,
  energyBeadMeta,
  type EnergyGroupInfo,
} from "@/lib/data/calculators/energy-bead";
import { EnergyBeadCalc } from "./EnergyBeadCalc";

const BADGE_SIZE = 28;

/** 단계 한 줄. 진화는 금색 표창, 메가진화는 붉은 표창, 스킬해금은 별 아이콘. */
function GroupRow({ group }: { group: EnergyGroupInfo }) {
  return (
    <tr className="border-b border-app/50">
      <td className="py-2 px-2">
        <span className="flex items-center gap-2">
          {group.bladeStage ? (
            <EvolutionStageBadge
              stage={group.bladeStage}
              size={BADGE_SIZE}
              tone={group.isMega ? "red" : "gold"}
              label={group.label}
            />
          ) : (
            <Sparkles
              size={BADGE_SIZE - 8}
              className="mx-1 shrink-0"
              style={{ color: TONE_COLORS.red.fill }}
              aria-hidden
            />
          )}
          <span className="whitespace-nowrap">{group.label}</span>
        </span>
      </td>
      <td className="py-2 px-2 text-right tabular-nums text-fg-muted">
        {group.steps}
      </td>
      <td className="py-2 px-2 text-right tabular-nums font-bold text-palmon-primary">
        {formatKrNum(group.total)}
      </td>
    </tr>
  );
}

/** 합계 한 줄. grand는 전체 합계라 더 강조한다. */
function TotalRow({
  label,
  value,
  grand,
}: {
  label: string;
  value: number;
  grand?: boolean;
}) {
  return (
    <tr className={grand ? "bg-palmon-primary/10" : "bg-muted"}>
      <td className="py-2.5 px-2" colSpan={2}>
        <span className="flex items-center gap-2 font-bold">
          <Sigma
            size={BADGE_SIZE - 6}
            className="mx-0.5 shrink-0 text-fg-muted"
            aria-hidden
          />
          {label}
        </span>
      </td>
      <td
        className={`py-2.5 px-2 text-right tabular-nums font-bold ${
          grand ? "text-palmon-primary text-base" : ""
        }`}
      >
        {formatKrNum(value)}
      </td>
    </tr>
  );
}

export const metadata: Metadata = {
  title: "에너지 구슬 계산기",
  description:
    "현재 진행도에서 목표 단계까지 진화 조건을 채우는 데 필요한 에너지 구슬을 계산해요.",
};

export default function EnergyBeadPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="에너지 구슬 계산기"
        description="지금 진행도에서 목표 단계까지 에너지 구슬이 얼마나 필요한지 계산해요."
        meta={
          <>
            최종 업데이트: {energyBeadMeta.updatedAt} · <SourceBadge name={energyBeadMeta.updatedBy} />
          </>
        }
      />

      <Section emoji="📐" title="계산 방법">
        <div className="space-y-4">
          {/* 아이템 소개 */}
          <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
            <Image
              src={ENERGY_BEAD_IMAGE}
              alt="에너지 구슬"
              width={72}
              height={72}
              className="w-16 h-16 md:w-[72px] md:h-[72px] object-contain rounded-xl shrink-0"
              priority
            />
            <div className="min-w-0">
              <div className="font-bold">에너지 구슬</div>
              <p className="text-sm text-fg-muted mt-0.5 leading-relaxed">
                다음 진화 단계로 넘어가기 위한 <b className="text-fg">조건</b>을
                채우는 재료예요. 진화에 쓰는 진화 정수와는 별개라 양쪽을 모두
                준비해야 합니다.
              </p>
            </div>
          </div>

          {/* 단계별 필요량 — 진화 / 메가진화 / 전체 세 덩어리로 묶어서 보여준다 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-app text-fg-subtle text-xs">
                  <th className="text-left py-2 px-2 font-normal">단계</th>
                  <th className="text-right py-2 px-2 font-normal">소단계 수</th>
                  <th className="text-right py-2 px-2 font-normal">필요 개수</th>
                </tr>
              </thead>

              <tbody className="border-b-2 border-app">
                {ENERGY_EVO_GROUPS.map((g) => (
                  <GroupRow key={g.key} group={g} />
                ))}
                <TotalRow label="진화 합계" value={ENERGY_EVO_TOTAL} />
              </tbody>

              <tbody className="border-b-2 border-app">
                {ENERGY_MEGA_GROUPS.map((g) => (
                  <GroupRow key={g.key} group={g} />
                ))}
                <TotalRow label="메가진화 + 스킬해금 합계" value={ENERGY_MEGA_TOTAL} />
              </tbody>

              <tbody>
                <TotalRow label="전체 합계" value={ENERGY_TOTAL} grand />
              </tbody>
            </table>
          </div>

          {/* 짧은 보충 */}
          <ul className="text-xs text-fg-muted space-y-1.5 leading-relaxed">
            <li>
              <b className="text-fg">소단계로 나뉘어요</b> — 한 진화 단계는 여러
              소단계로 쪼개져 있고, 소단계마다 필요한 양이 다릅니다.
            </li>
            <li>
              <b className="text-fg">강화 {ENERGY_UPGRADES_PER_STEP}회</b> —
              표의 값은 소단계 하나를 끝내는 총량이에요. 실제로는{" "}
              {ENERGY_UPGRADES_PER_STEP}번에 나눠 강화합니다 (1회 = 표시값 ÷{" "}
              {ENERGY_UPGRADES_PER_STEP}).
            </li>
            <li>
              <b className="text-fg">진화 정수와 별개</b> — 조건은 에너지 구슬,
              진화 자체는 진화 정수입니다.
            </li>
          </ul>
        </div>
      </Section>

      <Section emoji="🧮" title="계산기">
        <EnergyBeadCalc />
      </Section>

      <div className="rounded-xl bg-muted p-4 text-xs text-fg-muted leading-relaxed">
        📌 게임 내 수치는 업데이트로 바뀔 수 있어요. 실제와 다르면{" "}
        <b className="text-fg">문의하기</b>로 알려주세요.
      </div>
    </div>
  );
}
