import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { buildMeta } from "@/lib/data/build";
import { BuildingsView } from "./BuildingsView";

export const metadata: Metadata = {
  title: "캠프 업그레이드 요구사항",
  description: "캠프 업그레이드 자격, 자원, 시간과 단축 버프 적용 결과 정리",
};

export default function BuildingsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <PageHeader
        emoji="🏕️"
        title="캠프 업그레이드"
        description="캠프 업그레이드에 필요한 자격 요건, 자원, 시간을 정리했어요. 가지고 있는 단축 버프를 눌러 적용해볼 수 있어요."
        meta={<>최종 업데이트: {buildMeta.updatedAt}</>}
      />

      <div className="rounded-xl bg-muted p-3 text-xs text-fg-muted">
        ⚠️ 계산 결과는 정확하지 않을 수 있어요. 참고용으로만 봐주세요.
      </div>

      <BuildingsView />

      <div className="rounded-xl bg-muted p-3 text-xs text-fg-muted space-y-1">
        <p>📌 {buildMeta.note}</p>
        <p>🔎 숫자에 마우스를 올리면 정확한 값과 버프 적용 전 값이 보여요.</p>
      </div>
    </div>
  );
}
