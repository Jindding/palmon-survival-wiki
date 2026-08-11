"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function LanguageToggle() {
  const { lang, toggle, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.header.language}
      title={lang === "ko" ? "EN" : "한국어"}
      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors relative"
    >
      <Languages size={18} />
      <span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-bold px-1 rounded bg-gradient-palmon text-white leading-tight">
        {lang === "ko" ? "KO" : "EN"}
      </span>
    </button>
  );
}
