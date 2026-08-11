import type { Highlight as HighlightType } from "@/lib/data/season1";

const toneStyle: Record<NonNullable<HighlightType["tone"]>, string> = {
  tip: "border-l-4 border-palmon-secondary bg-palmon-secondary/10",
  warning: "border-l-4 border-palmon-accent bg-palmon-accent/10",
  info: "border-l-4 border-palmon-primary bg-palmon-primary/10",
};

const toneEmoji: Record<NonNullable<HighlightType["tone"]>, string> = {
  tip: "💡",
  warning: "⚠️",
  info: "ℹ️",
};

export function HighlightCard({ h }: { h: HighlightType }) {
  const tone = h.tone ?? "info";
  return (
    <div className={`p-3 rounded-lg ${toneStyle[tone]}`}>
      <div className="flex items-start gap-2">
        <span className="text-lg leading-none">{toneEmoji[tone]}</span>
        <div className="flex-1 min-w-0">
          {h.title && <div className="text-sm font-bold mb-0.5">{h.title}</div>}
          <div className="text-sm text-fg-muted">{h.body}</div>
        </div>
      </div>
    </div>
  );
}
