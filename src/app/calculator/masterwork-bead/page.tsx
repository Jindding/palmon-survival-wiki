import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { StarRankBadge } from "@/components/StarRankBadge";
import { formatKrNum } from "@/lib/format";
import {
  MASTERWORK_BEAD_IMAGE,
  BEAD_MAX_RANK,
  BEAD_PER_WEAPON,
  BEAD_RANKS,
  BEAD_RANK_INFO,
  masterworkBeadMeta,
} from "@/lib/data/calculators/masterwork-bead";
import { MasterworkBeadCalc } from "./MasterworkBeadCalc";

export const metadata: Metadata = {
  title: "걸작구슬 계산기",
  description:
    "보유한 걸작구슬로 무기를 목표 성급까지 몇 개나 올릴 수 있는지 계산해요.",
};

export default function MasterworkBeadPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="걸작구슬 계산기"
        description="지금 가진 구슬로 무기를 몇 개나 승급시킬 수 있는지 계산해요."
        meta={<>최종 업데이트: {masterworkBeadMeta.updatedAt}</>}
      />

      <Section emoji="📐" title="계산 방법">
        <div className="space-y-4">
          {/* 아이템 소개 */}
          <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
            <Image
              src={MASTERWORK_BEAD_IMAGE}
              alt="걸작구슬"
              width={72}
              height={72}
              className="w-16 h-16 md:w-[72px] md:h-[72px] object-contain rounded-xl shrink-0"
              priority
            />
            <div className="min-w-0">
              <div className="font-bold">걸작구슬</div>
              <p className="text-sm text-fg-muted mt-0.5 leading-relaxed">
                무기의 <b className="text-fg">성급(★)</b>을 올릴 때 쓰는 재화예요.
                팰몬 승급과 달리 ★{BEAD_MAX_RANK}까지 있고, 성급이 오를수록 앞
                성급 비용이 그대로 누적됩니다.
              </p>
            </div>
          </div>

          {/* 성급별 필요량 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-app text-fg-subtle text-xs">
                  <th className="text-left py-2 px-2 font-normal">성급</th>
                  <th className="text-right py-2 px-2 font-normal">필요 개수</th>
                  <th className="text-right py-2 px-2 font-normal">
                    누적 필요 개수
                  </th>
                </tr>
              </thead>
              <tbody>
                {BEAD_RANKS.map((r) => {
                  const info = BEAD_RANK_INFO[r];
                  return (
                    <tr key={r} className="border-b border-app/50 last:border-0">
                      <td className="py-2 px-2">
                        <span className="flex items-center gap-2">
                          <StarRankBadge rank={r} max={BEAD_MAX_RANK} />
                          <span className="whitespace-nowrap">{info.label}</span>
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
              <b className="text-fg">
                무기 1개(5성) = {formatKrNum(BEAD_PER_WEAPON)}개
              </b>{" "}
              — 흔히 말하는 「무기 하나 완성」 기준이에요. ★
              {BEAD_MAX_RANK}까지 올리려면{" "}
              {formatKrNum(BEAD_RANK_INFO[BEAD_MAX_RANK].cumulativeCost)}개가
              듭니다.
            </li>
            <li>
              <b className="text-fg">↻ 초기화</b> — 올린 무기를 되돌리면 들어간
              구슬을 전액 돌려받아요. 손해가 없습니다.
            </li>
            <li>
              <b className="text-fg">팰몬 승급과는 별개</b> — 무기는 걸작구슬,
              팰몬은 UR 만능 팰몬조각을 씁니다.
            </li>
          </ul>
        </div>
      </Section>

      <Section emoji="🧮" title="계산기">
        <MasterworkBeadCalc />
      </Section>

      <div className="rounded-xl bg-muted p-4 text-xs text-fg-muted leading-relaxed">
        📌 게임 내 수치는 업데이트로 바뀔 수 있어요. 실제와 다르면{" "}
        <b className="text-fg">문의하기</b>로 알려주세요.
      </div>
    </div>
  );
}
