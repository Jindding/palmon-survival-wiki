"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";

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
  const t = useT();

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
      aria-label="Clock"
    >
      <TimeCell label={t.header.server} tone="secondary" value={server} />
      <div className="w-px h-6 bg-app" />
      <TimeCell label={t.header.kst} tone="primary" value={kst} />
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
