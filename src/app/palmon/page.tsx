import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { palmons, palmonsMeta } from "@/lib/data/palmons";
import { PalmonListClient } from "./PalmonListClient";

export const metadata: Metadata = {
  title: "팰몬 도감",
  description: "팰몬 서바이벌 팰몬 전체 목록 — 등급 · 속성 · 진화 정보",
};

export default function PalmonListPage() {
  const sorted = [...palmons].sort((a, b) =>
    a.name.localeCompare(b.name, "ko-KR")
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        emoji="📖"
        title="팰몬 도감"
        description="팰몬 서바이벌에 등장하는 팰몬들을 등급 · 속성 · 진화별로 정리했어요. 카드를 클릭하면 진화 트리와 스킬 정보를 확인할 수 있어요."
        meta={
          <>
            수록: {palmonsMeta.listed}종 (진화형 포함 {palmonsMeta.totalEntries}
            개) · 스킬 데이터 {palmonsMeta.withSkills}종 · 최종 업데이트:{" "}
            {palmonsMeta.updatedAt} · 출처: {palmonsMeta.source}
          </>
        }
      />

      <PalmonListClient items={sorted} />

      <div className="rounded-xl bg-muted p-4 text-xs text-fg-muted">
        📌 이미지 · 팰몬 정보 저작권은 Lilith Games. 스킬 데이터는 아직 이미지와
        함께 정리되지 않은 부분이 있어 순차적으로 반영 중이에요.
      </div>
    </div>
  );
}
