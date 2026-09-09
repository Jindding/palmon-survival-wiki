// 계산기 결과 카드의 한 줄. 4개 계산기가 똑같은 모양을 쓰고 있어 공용으로 뺐다.

export function ResultRow({
  label,
  value,
  tone,
  bold,
}: {
  label: string;
  value: string;
  tone?: "accent" | "danger";
  bold?: boolean;
}) {
  const toneCls =
    tone === "accent"
      ? "text-palmon-primary"
      : tone === "danger"
        ? "text-red-600 dark:text-red-400"
        : "text-fg";
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2">
      <span className="text-fg-muted text-[13px]">{label}</span>
      <span className={`tabular-nums ${toneCls} ${bold ? "font-bold" : ""}`}>
        {value}
      </span>
    </div>
  );
}
