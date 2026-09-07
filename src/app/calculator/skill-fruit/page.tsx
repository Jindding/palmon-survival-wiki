import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { Section } from "@/components/Section";
import { formatKrExact } from "@/lib/format";
import { sumLevelRange } from "@/lib/data/calculators/level-cost";
import { MilestoneTable } from "../MilestoneTable";
import {
  SKILL_FRUIT_IMAGE,
  SKILL_PER_LEVEL,
  SKILL_MAX_LEVEL,
  SKILL_MILESTONES,
  skillFruitMeta,
} from "@/lib/data/calculators/skill-fruit";
import { LevelCostCalc } from "../LevelCostCalc";

export const metadata: Metadata = {
  title: "스킬열매 계산기",
  description:
    "스킬을 현재 레벨에서 목표 레벨까지 올리는 데 필요한 스킬 레벨업 열매를 계산해요.",
};

export default function SkillFruitPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="스킬열매 계산기"
        description="스킬 하나를 목표 레벨까지 올리는 데 필요한 열매 개수를 계산해요."
        meta={
          <>
            최종 업데이트: {skillFruitMeta.updatedAt} · <SourceBadge name={skillFruitMeta.updatedBy} />
          </>
        }
      />

      <Section emoji="📐" title="계산 방법">
        <div className="space-y-4">
          {/* 아이템 소개 */}
          <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
            <Image
              src={SKILL_FRUIT_IMAGE}
              alt="스킬 레벨업 열매"
              width={72}
              height={72}
              className="w-16 h-16 md:w-[72px] md:h-[72px] object-contain rounded-xl shrink-0"
              priority
            />
            <div className="min-w-0">
              <div className="font-bold">스킬 레벨업 열매</div>
              <p className="text-sm text-fg-muted mt-0.5 leading-relaxed">
                팰몬 스킬의 레벨을 올리는 데 쓰는 재화예요. 스킬 하나당 최대
                Lv {SKILL_MAX_LEVEL}까지 올릴 수 있습니다.
              </p>
            </div>
          </div>

          {/* 대표 구간 누적 */}
          <MilestoneTable
            costs={SKILL_PER_LEVEL}
            milestones={SKILL_MILESTONES}
            unit="개"
          />

          {/* 짧은 보충 */}
          <ul className="text-xs text-fg-muted space-y-1.5 leading-relaxed">
            <li>
              <b className="text-fg">스킬 1개 풀레벨 = </b>
              <b className="text-fg">
                {formatKrExact(
                  sumLevelRange(SKILL_PER_LEVEL, 1, SKILL_MAX_LEVEL)
                )}
                개
              </b>{" "}
              — Lv 1에서 Lv {SKILL_MAX_LEVEL}까지 올리는 데 드는 총 열매 수예요.
            </li>
            <li>
              <b className="text-fg">스킬 단위 계산</b> — 팰몬 한 마리가 아니라
              스킬 하나 기준입니다. 여러 스킬을 올리려면 그만큼 곱해 주세요.
            </li>
            <li>
              <b className="text-fg">열매상자는 미포함</b> — 상자 보상이 확률
              기반이라, 지금은 순수 필요량만 계산해요.
            </li>
          </ul>
        </div>
      </Section>

      <Section emoji="🧮" title="계산기">
        <LevelCostCalc
          costs={SKILL_PER_LEVEL}
          maxLevel={SKILL_MAX_LEVEL}
          image={SKILL_FRUIT_IMAGE}
          itemName="스킬열매"
          defaultTarget={SKILL_MAX_LEVEL}
        />
      </Section>

      <div className="rounded-xl bg-muted p-4 text-xs text-fg-muted leading-relaxed">
        📌 게임 내 수치는 업데이트로 바뀔 수 있어요. 실제와 다르면{" "}
        <b className="text-fg">문의하기</b>로 알려주세요.
      </div>
    </div>
  );
}
