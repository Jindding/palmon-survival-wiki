import { Feather } from "lucide-react";

export function SourceBadge({ name }: { name: string }) {
  const match = name.match(/^(.+?)\s*#(\S+)\s*$/);
  const author = match?.[1] ?? name;
  const server = match?.[2];

  return (
    <span className="inline-flex items-center gap-1.5 align-middle whitespace-nowrap">
      <Feather
        size={12}
        className="opacity-70"
        style={{ color: "rgb(var(--primary))" }}
        aria-hidden
      />
      {server && (
        <span
          className="font-semibold"
          style={{ color: "rgb(var(--accent))" }}
        >
          {server}서버
        </span>
      )}
      <span
        className="font-semibold"
        style={{ color: "rgb(var(--primary))" }}
      >
        {author}
      </span>
    </span>
  );
}
