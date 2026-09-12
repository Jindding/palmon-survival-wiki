import type { Metadata } from "next";
import { AdminTool } from "./AdminTool";

// 운영자용 삭제 도구. 사이드바 메뉴에는 넣지 않는다 — 주소를 아는 사람만 들어온다.
export const metadata: Metadata = {
  title: "관리자 도구",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold">🛠️ 관리자 도구</h1>
        <p className="text-sm text-fg-muted mt-1">
          신고된 게시글 · 댓글 · 한줄팁을 확인하고 삭제합니다. 첨부 이미지도 함께
          지워집니다.
        </p>
      </div>
      <AdminTool />
    </div>
  );
}
