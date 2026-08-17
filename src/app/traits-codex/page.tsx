import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { traitsCodexMeta } from "@/lib/data/traits-codex";
import { TraitsCodexView } from "./TraitsCodexView";

export const metadata: Metadata = {
  title: "특성 도감",
  description: "팰몬 서바이벌의 모든 특성을 카테고리별로 정리한 도감",
};

export default function TraitsCodexPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        emoji="📚"
        title="특성 도감"
        description="시설 배치 · 자원 생산 · 전투 · 공용 유틸까지 모든 특성을 한곳에서. 검색과 필터로 빠르게 찾아보세요."
        meta={
          <>
            {traitsCodexMeta.note} · 최종 업데이트: {traitsCodexMeta.updatedAt} ·{" "}
            <SourceBadge name={traitsCodexMeta.updatedBy} />
          </>
        }
      />
      <TraitsCodexView />
    </div>
  );
}
