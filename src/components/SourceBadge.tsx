export function SourceBadge({ name }: { name: string }) {
  const match = name.match(/^(.+?)\s*#(\S+)\s*$/);
  const author = match?.[1] ?? name;
  const server = match?.[2];

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold align-middle"
      style={{
        backgroundColor: "rgb(var(--primary) / 0.10)",
        borderColor: "rgb(var(--primary) / 0.35)",
        color: "rgb(var(--primary))",
      }}
    >
      <span aria-hidden>✍️</span>
      <span>{author}</span>
      {server && (
        <span
          className="ml-0.5 rounded-full px-1.5 py-[1px] text-[10px] font-bold"
          style={{
            backgroundColor: "rgb(var(--accent) / 0.18)",
            color: "rgb(var(--accent))",
          }}
        >
          #{server}
        </span>
      )}
    </span>
  );
}
