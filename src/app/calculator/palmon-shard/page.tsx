import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { Section } from "@/components/Section";
import { StarRankBadge } from "@/components/StarRankBadge";
import { formatKrNum } from "@/lib/format";
import {
  PALMON_SHARD_IMAGE,
  SHARD_PER_PALMON,
  STAR_RANKS,
  STAR_RANK_INFO,
  palmonShardMeta,
} from "@/lib/data/calculators/palmon-shard";
import { PalmonShardCalc } from "./PalmonShardCalc";

export const metadata: Metadata = {
  title: "만능 팰몬조각 계산기",
  description:
    "보유한 UR 만능 팰몬조각으로 팰몬을 몇 마리나 승급시킬 수 있는지 성급별로 계산해요.",
};

export default function PalmonShardPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="만능 팰몬조각 계산기"
        description="지금 가진 조각으로 팰몬을 몇 마리나 승급시킬 수 있는지 계산해요."
        meta={
          <>
            최종 업데이트: {palmonShardMeta.updatedAt} · <SourceBadge name={palmonShardMeta.updatedBy} />
          </>
        }
      />

      <Section emoji="📐" title="계산 방법">
        <div className="space-y-4">
          {/* 아이템 소개 */}
          <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
            <Image
              src={PALMON_SHARD_IMAGE}
              alt="UR 만능 팰몬조각"
              width={72}
              height={72}
              className="w-16 h-16 md:w-[72px] md:h-[72px] object-contain rounded-xl shrink-0"
              priority
            />
            <div className="min-w-0">
              <div className="font-bold">UR 만능 팰몬조각</div>
              <p className="text-sm text-fg-muted mt-0.5 leading-relaxed">
                팰몬을 승급시킬 때 쓰는 재화예요. 승급은 <b className="text-fg">
                성급(★)
                </b>
                으로 나뉘고, 성급이 오를수록 앞 성급 비용이 그대로 누적됩니다.
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
                {STAR_RANKS.map((r) => {
                  const info = STAR_RANK_INFO[r];
                  return (
                    <tr key={r} className="border-b border-app/50 last:border-0">
                      <td className="py-2 px-2">
                        <span className="flex items-center gap-2">
                          <StarRankBadge rank={r} />
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
              <b className="text-fg">5성 1마리 = {formatKrNum(SHARD_PER_PALMON)}
              개</b> — 팰몬 한 마리를 5성까지 올리는 데 드는 총 조각 수예요.
            </li>
            <li>
              <b className="text-fg">진화와는 별개</b> — 승급은 조각, 진화는 진화
              정수를 씁니다. 한 마리를 완성하려면 둘 다 필요해요.
            </li>
            <li>
              <b className="text-fg">풀세팅 마릿수</b> — 승급 가능 마릿수와 진화
              가능 마릿수 중 <b className="text-fg">더 작은 쪽</b>이 실제로
              완성할 수 있는 수예요.
            </li>
          </ul>
        </div>
      </Section>

      <Section emoji="🧮" title="계산기">
        <PalmonShardCalc />
      </Section>

      <div className="rounded-xl bg-muted p-4 text-xs text-fg-muted leading-relaxed">
        📌 게임 내 수치는 업데이트로 바뀔 수 있어요. 실제와 다르면{" "}
        <b className="text-fg">문의하기</b>로 알려주세요.
      </div>
    </div>
  );
}
