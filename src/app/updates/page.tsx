import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { updates, updatesMeta, type UpdateTag } from "@/lib/data/updates";

export const metadata: Metadata = {
  title: "업데이트 소식",
  description: "팰몬 허브에 새로 추가되거나 개선된 내용을 확인할 수 있어요.",
};

const TAG_META: Record<UpdateTag, { label: string; className: string }> = {
  NEW: {
    label: "신규",
    className:
      "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30",
  },
  UPDATE: {
    label: "개선",
    className:
      "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },
  FIX: {
    label: "수정",
    className:
      "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
  },
  DATA: {
    label: "데이터",
    className:
      "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
  },
};

export default function UpdatesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        emoji="📣"
        title="업데이트 소식"
        description="팰몬 허브에 새로 추가되거나 개선된 내용을 정리해두는 곳이에요. 최신 소식이 항상 맨 위에 표시됩니다."
        meta={
          <>
            {updatesMeta.note} · 최종 업데이트: {updatesMeta.updatedAt}
          </>
        }
      />

      {updates.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-app text-center text-sm text-fg-muted">
          아직 등록된 소식이 없어요.
        </div>
      ) : (
        <ul className="space-y-3">
          {updates.map((entry, i) => {
            const tag = TAG_META[entry.tag];
            return (
              <li
                key={i}
                className="bg-card rounded-2xl p-5 md:p-6 border border-app shadow-soft"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${tag.className}`}
                  >
                    {tag.label}
                  </span>
                  <span className="text-xs text-fg-subtle">{entry.date}</span>
                </div>
                <h2 className="mt-2 text-base md:text-lg font-bold leading-snug">
                  {entry.title}
                </h2>
                {entry.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm text-fg-muted list-disc list-inside marker:text-fg-subtle">
                    {entry.bullets.map((b, j) => (
                      <li key={j} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
