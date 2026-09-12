import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { tips, tipsMeta } from "@/lib/data/tips";
import { TipsBrowser } from "./TipsBrowser";

export const metadata: Metadata = {
  title: "한줄팁 모음",
  description: "유저들이 제보한 팰몬 서바이벌 실전 한줄팁 모음",
};

export default function TipsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        emoji="💡"
        title="유저 한줄팁"
        description="게임 안팎에서 유저들이 알려준 실전 팁을 모아두는 곳이에요. 짧지만 알짜배기 정보만!"
        meta={
          <>
            {tipsMeta.note} · 최종 업데이트: {tipsMeta.updatedAt}
          </>
        }
      />

      <TipsBrowser tips={tips} />

      <div
        className="p-4 rounded-xl text-xs text-fg-muted"
        style={{ backgroundColor: "rgb(var(--muted))" }}
      >
        <div className="mb-1">✍️ 팁 작성 안내</div>
        <p>
          상단 [팁 작성하기] 버튼으로 누구나 팁을 남길 수 있어요. 작성하면 검토
          없이 바로 이 페이지에 올라갑니다. 서버·닉네임을 적으면 작성자로
          표시되고, [익명으로 작성]을 체크하면 익명으로 올라가요. 지우고 싶은
          글은 문의하기로 알려주세요.
        </p>
      </div>
    </div>
  );
}
