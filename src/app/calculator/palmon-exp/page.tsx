import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { Section } from "@/components/Section";
import { formatKrExact } from "@/lib/format";
import { sumLevelRange } from "@/lib/data/calculators/level-cost";
import { MilestoneTable } from "../MilestoneTable";
import {
  PALMON_EXP_IMAGE,
  EXP_PER_LEVEL,
  EXP_MAX_LEVEL,
  EXP_MILESTONES,
  palmonExpMeta,
} from "@/lib/data/calculators/palmon-exp";
import { LevelCostCalc } from "../LevelCostCalc";

export const metadata: Metadata = {
  title: "경험치 계산기",
  description:
    "현재 레벨에서 목표 레벨까지 팰몬을 키우는 데 필요한 경험치를 계산해요.",
};

export default function PalmonExpPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="경험치 계산기"
        description="현재 레벨에서 목표 레벨까지 필요한 팰몬 경험치를 계산해요."
        meta={
          <>
            최종 업데이트: {palmonExpMeta.updatedAt} · <SourceBadge name={palmonExpMeta.updatedBy} />
          </>
        }
      />

      <Section emoji="📐" title="계산 방법">
        <div className="space-y-4">
          {/* 아이템 소개 */}
          <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
            <Image
              src={PALMON_EXP_IMAGE}
              alt="팰몬 경험치"
              width={72}
              height={72}
              className="w-16 h-16 md:w-[72px] md:h-[72px] object-contain rounded-xl shrink-0"
              priority
            />
            <div className="min-w-0">
              <div className="font-bold">팰몬 경험치</div>
              <p className="text-sm text-fg-muted mt-0.5 leading-relaxed">
                팰몬 레벨을 올리는 데 쓰는 재화예요. 레벨이 오를수록 한 레벨당
                비용이 가파르게 늘어납니다.
              </p>
            </div>
          </div>

          {/* 대표 구간 누적 */}
          <MilestoneTable costs={EXP_PER_LEVEL} milestones={EXP_MILESTONES} />

          {/* 짧은 보충 */}
          <ul className="text-xs text-fg-muted space-y-1.5 leading-relaxed">
            <li>
              <b className="text-fg">최대 Lv {EXP_MAX_LEVEL}</b> — Lv 1부터
              끝까지 올리려면 총{" "}
              <b className="text-fg">
                {formatKrExact(sumLevelRange(EXP_PER_LEVEL, 1, EXP_MAX_LEVEL))}
              </b>
              이 필요해요.
            </li>
            <li>
              <b className="text-fg">구간 합산</b> — 현재 레벨부터 목표 레벨
              직전까지의 레벨업 비용을 모두 더한 값이 필요량입니다.
            </li>
            <li>
              <b className="text-fg">경험치 상자는 미포함</b> — 상자 보상이 캠프
              레벨에 따라 달라져서, 지금은 순수 필요량만 계산해요.
            </li>
          </ul>
        </div>
      </Section>

      <Section emoji="🧮" title="계산기">
        <LevelCostCalc
          costs={EXP_PER_LEVEL}
          maxLevel={EXP_MAX_LEVEL}
          image={PALMON_EXP_IMAGE}
          itemName="경험치"
          defaultTarget={EXP_MAX_LEVEL}
        />
      </Section>

      <div className="rounded-xl bg-muted p-4 text-xs text-fg-muted leading-relaxed">
        📌 게임 내 수치는 업데이트로 바뀔 수 있어요. 실제와 다르면{" "}
        <b className="text-fg">문의하기</b>로 알려주세요.
      </div>
    </div>
  );
}
