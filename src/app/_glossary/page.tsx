// 용어집 — 현재 비활성화 상태 (2026-09-08).
//
// 폴더 이름 앞의 밑줄 때문에 Next.js가 이 폴더를 라우팅에서 제외한다(private folder).
// 코드와 데이터(src/lib/data/glossary.ts)는 그대로 두었으니, 다시 켜려면
//   1. 이 폴더를 src/app/glossary 로 되돌리고
//   2. src/lib/menu.ts 의 "홈" 섹션에 { href: "/glossary", label: "용어집", icon: ScrollText } 를 추가
// 하면 된다.

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { glossaryMeta, glossaryStats } from "@/lib/data/glossary";
import { GlossaryView } from "./GlossaryView";

export const metadata: Metadata = {
  title: "용어집",
  description:
    "팰몬 서바이벌에서 같은 것을 가리키는데 표기가 다른 용어들을 한곳에 정리했어요.",
};

export default function GlossaryPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        emoji="📖"
        title="용어집"
        description="같은 것을 가리키는데 자료마다 다르게 부르는 용어들을 한곳에 모았어요. 헷갈리는 것끼리 무엇이 다른지도 함께 적어 뒀습니다."
        meta={
          <>
            {glossaryStats.total}개 수록 · 보충 필요 {glossaryStats.needsCheck}개
            · 최종 업데이트: {glossaryMeta.updatedAt}
          </>
        }
      />

      <div className="rounded-xl border border-dashed border-app p-4 text-xs text-fg-muted leading-relaxed">
        <b className="text-fg">❓ 보충 필요</b> 표시가 붙은 용어는 이름만 확인됐고
        정확한 용도나 다른 용어와의 관계가 아직 정리되지 않은 것들이에요. 아시는
        내용이 있으면 <b className="text-fg">문의하기</b>나{" "}
        <b className="text-fg">자유게시판</b>으로 알려주시면 반영할게요.
      </div>

      <GlossaryView />
    </div>
  );
}
