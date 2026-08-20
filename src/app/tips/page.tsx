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
        <div className="mb-1">📮 팁 제보 안내</div>
        <p>
          상단 [팁 제보] 버튼으로 서버·닉네임·내용을 남겨주시면 운영자에게 바로
          전달됩니다. 검토 후 순차적으로 이 페이지에 반영해요.
        </p>
      </div>
    </div>
  );
}
