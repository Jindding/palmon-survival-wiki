"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/LanguageProvider";

export function Logo({ onClick }: { onClick?: () => void }) {
  const t = useT();
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2 group">
      <div className="w-9 h-9 rounded-xl bg-gradient-palmon flex items-center justify-center text-white text-lg shadow-soft group-hover:scale-105 transition-transform">
        🐾
      </div>
      <div className="leading-tight">
        <div className="text-lg">{t.site.title}</div>
        <div className="text-[10px] text-fg-subtle -mt-1">{t.site.subtitle}</div>
      </div>
    </Link>
  );
}
