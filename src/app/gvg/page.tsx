import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { gvgMeta } from "@/lib/data/gvg";
import { GvGView } from "./GvGView";

export const metadata: Metadata = {
  title: "GvG 주간 미션",
  description: "팰몬 서바이벌 GvG 요일별 미션과 점수 정리",
};

export default function GvGPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        emoji="🏰"
        title="GvG 주간 미션"
        description="일주일간 진행되는 길드 대결. 요일별 테마 미션을 수행해 점수를 획득합니다."
        meta={
          <>
            {gvgMeta.note} · 최종 업데이트: {gvgMeta.updatedAt}
          </>
        }
      />
      <GvGView />
    </div>
  );
}
