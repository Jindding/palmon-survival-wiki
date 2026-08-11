import type { ReactNode } from "react";

export function PageHeader({
  emoji,
  title,
  description,
  meta,
}: {
  emoji?: string;
  title: string;
  description?: string;
  meta?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl mb-2 flex items-center gap-2">
        {emoji && <span>{emoji}</span>}
        <span>{title}</span>
      </h1>
      {description && (
        <p className="text-fg-muted text-sm md:text-base">{description}</p>
      )}
      {meta && <div className="mt-3 text-xs text-fg-subtle">{meta}</div>}
    </div>
  );
}
