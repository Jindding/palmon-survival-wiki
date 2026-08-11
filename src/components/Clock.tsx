"use client";

import { useEffect, useState } from "react";

const SERVER_TZ = "Etc/GMT+2"; // POSIX 관례: GMT+2 = UTC-2 (게임 서버)
const KST_TZ = "Asia/Seoul";

function format(date: Date, tz: string) {
  return date.toLocaleTimeString("en-GB", {
    timeZone: tz,
    hour12: false,
  });
}

export function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const server = now ? format(now, SERVER_TZ) : "--:--:--";
  const kst = now ? format(now, KST_TZ) : "--:--:--";

  return (
    <div
      className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1 rounded-lg bg-muted border border-app"
      aria-label="현재 시간"
    >
      <TimeCell label="서버" tone="secondary" value={server} />
      <div className="w-px h-6 bg-app" />
      <TimeCell label="KST" tone="primary" value={kst} />
    </div>
  );
}

function TimeCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "primary" | "secondary";
}) {
  return (
    <div className="flex flex-col items-end leading-tight">
      <span
        className={`text-[9px] md:text-[10px] uppercase tracking-wider ${
          tone === "primary"
            ? "text-palmon-primary dark:text-palmon-accent"
            : "text-fg-subtle"
        }`}
      >
        {label}
      </span>
      <span className="text-[11px] md:text-xs font-mono tabular-nums">
        {value}
      </span>
    </div>
  );
}
