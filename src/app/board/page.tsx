import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { BoardView } from "./BoardView";

export const metadata: Metadata = {
  title: "자유게시판",
  description: "팰몬 서바이벌 유저들이 자유롭게 소통하는 게시판",
};

export default function BoardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        emoji="💬"
        title="자유게시판"
        description="질문, 팁, 잡담 뭐든 환영해요. 로그인 없이 닉네임만 있으면 바로 참여할 수 있습니다."
      />
      <BoardView />
    </div>
  );
}
