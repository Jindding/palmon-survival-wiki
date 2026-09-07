import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { Section } from "@/components/Section";
import { formatKrNum } from "@/lib/format";
import {
  EVO_STAGES,
  EVO_STAGE_INFO,
  EVO_ESSENCE_IMAGE,
  evolutionEssenceMeta,
} from "@/lib/data/calculators/evolution-essence";
import { EvolutionStageBadge } from "@/components/EvolutionStageBadge";
import { EvolutionEssenceCalc } from "./EvolutionEssenceCalc";

export const metadata: Metadata = {
  title: "진화 정수 계산기",
  description:
    "기존 팰몬을 목표 진화 단계까지 올리는 데 필요한 진화 정수를 계산하고, 초기화 환급까지 반영해 완성 마릿수를 확인해요.",
};

export default function EvolutionEssencePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="진화 정수 계산기"
        description="지금 가진 정수로 팰몬을 몇 마리나 진화시킬 수 있는지 계산해요."
        meta={
          <>
            최종 업데이트: {evolutionEssenceMeta.updatedAt} · <SourceBadge name={evolutionEssenceMeta.updatedBy} />
          </>
        }
      />

      <Section emoji="📐" title="계산 방법">
        <div className="space-y-4">
          {/* 아이템 소개 */}
          <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
            <Image
              src={EVO_ESSENCE_IMAGE}
              alt="진화 정수"
              width={72}
              height={72}
              className="w-16 h-16 md:w-[72px] md:h-[72px] object-contain rounded-xl shrink-0"
              priority
            />
            <div className="min-w-0">
              <div className="font-bold">진화 정수</div>
              <p className="text-sm text-fg-muted mt-0.5 leading-relaxed">
                기존 팰몬을 진화시킬 때 쓰는 재화예요. 단계가 오를수록 비용이
                커지고, 앞 단계 비용이 그대로 누적됩니다.
              </p>
            </div>
          </div>

          {/* 단계별 비용 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-app text-fg-subtle text-xs">
                  <th className="text-left py-2 px-2 font-normal">단계</th>
                  <th className="text-right py-2 px-2 font-normal">필요 개수</th>
                  <th className="text-right py-2 px-2 font-normal">
                    누적 필요 개수
                  </th>
                </tr>
              </thead>
              <tbody>
                {EVO_STAGES.map((s) => {
                  const info = EVO_STAGE_INFO[s];
                  return (
                    <tr key={s} className="border-b border-app/50 last:border-0">
                      <td className="py-2 px-2">
                        <span className="flex items-center gap-2">
                          <EvolutionStageBadge stage={s} size={32} />
                          {info.label}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right tabular-nums text-fg-muted">
                        +{formatKrNum(info.stepCost)}
                      </td>
                      <td className="py-2 px-2 text-right tabular-nums font-bold text-palmon-primary">
                        {formatKrNum(info.cumulativeCost)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 짧은 보충 */}
          <ul className="text-xs text-fg-muted space-y-1.5 leading-relaxed">
            <li>
              <b className="text-fg">↻ 초기화</b> — 키운 팰몬을 되돌리면 들어간
              정수를 전액 돌려받아요. 손해가 없습니다.
            </li>
            <li>
              <b className="text-fg">시즌 팰몬</b> — 재화 이름만 「오로라의 정수」로
              다르고 계산은 똑같아요.
            </li>
            <li>
              <b className="text-fg">메가진화 5~8단계</b> — 「메가 진화석」이라는
              다른 재화를 써서 여기서는 계산되지 않아요.
            </li>
          </ul>
        </div>
      </Section>

      <Section emoji="🧮" title="계산기">
        <EvolutionEssenceCalc />
      </Section>

      <div className="rounded-xl bg-muted p-4 text-xs text-fg-muted leading-relaxed">
        📌 게임 내 수치는 업데이트로 바뀔 수 있어요. 실제와 다르면{" "}
        <b className="text-fg">문의하기</b>로 알려주세요.
      </div>
    </div>
  );
}
