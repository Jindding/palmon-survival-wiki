import type { ReactNode } from "react";

export function Section({
  emoji,
  title,
  description,
  children,
}: {
  emoji?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-card rounded-2xl p-5 md:p-6 border border-app shadow-soft">
      <div className="flex items-start gap-3 mb-4">
        {emoji && <div className="text-3xl leading-none">{emoji}</div>}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl">{title}</h2>
          {description && (
            <p className="text-sm text-fg-muted mt-1">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
