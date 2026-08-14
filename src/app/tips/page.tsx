import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SourceBadge } from "@/components/SourceBadge";
import { tips, tipsMeta } from "@/lib/data/tips";

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

      {tips.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-app text-center text-sm text-fg-muted">
          아직 등록된 팁이 없어요. 곧 채워질 예정입니다.
        </div>
      ) : (
        <ul className="space-y-3">
          {tips.map((tip, i) => (
            <li
              key={i}
              className="relative bg-card rounded-2xl p-5 md:p-6 border border-app shadow-soft"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    backgroundColor: "rgb(var(--secondary) / 0.25)",
                    color: "rgb(var(--fg))",
                  }}
                  aria-hidden
                >
                  💡
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base md:text-lg leading-relaxed">
                    {tip.content}
                  </p>
                  {tip.by && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-fg-subtle">
                      <span>제보</span>
                      <SourceBadge name={tip.by} />
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div
        className="p-4 rounded-xl text-xs text-fg-muted"
        style={{ backgroundColor: "rgb(var(--muted))" }}
      >
        <div className="mb-1">📮 팁 제보</div>
        <p>
          운영자에게 직접 전달해 주시면 순차적으로 이 페이지에 반영됩니다.
          모든 팁은 제보자와 서버를 함께 표기해요.
        </p>
      </div>
    </div>
  );
}
