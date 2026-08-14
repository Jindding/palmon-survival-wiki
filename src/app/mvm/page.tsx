import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { mvmMeta } from "@/lib/data/mvm";
import { MvMView } from "./MvMView";

export const metadata: Metadata = {
  title: "모험가 대회",
  description: "매일 시간대별로 활동이 바뀌는 일일 이벤트 '모험가 대회' 스케줄 가이드",
};

export default function MvMPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        emoji="🏆"
        title="모험가 대회"
        description="매일 주어지는 목표(퀘스트)를 달성해 포인트를 쌓고, 고급 성장 자원과 교환하는 일일 이벤트입니다."
        meta={
          <>
            {mvmMeta.note} · 최종 업데이트: {mvmMeta.updatedAt} · <SourceBadge name={mvmMeta.updatedBy} />
          </>
        }
      />
      <MvMView />
    </div>
  );
}
