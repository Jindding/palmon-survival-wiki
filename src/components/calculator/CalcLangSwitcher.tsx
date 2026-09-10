"use client";

import { Languages } from "lucide-react";
import { CALC_LANGS, CALC_LANG_LABEL } from "@/lib/i18n/calculator";
import { useCalcLang } from "./CalcLangProvider";

// 도구 페이지(계산기 · 시뮬레이터) 언어 스위처.
// 해당 레이아웃에만 붙어서, 영문 지원 범위가 어디까지인지 위치로 알려주는 역할도 한다.

export function CalcLangSwitcher() {
  const { lang, setLang, ready } = useCalcLang();

  return (
    <div className="flex items-center gap-2">
      <Languages size={15} className="text-fg-subtle shrink-0" aria-hidden />
      <div
        role="group"
        aria-label="언어 선택"
        className="inline-flex rounded-lg border border-app bg-muted p-0.5"
      >
        {CALC_LANGS.map((code) => {
          const active = ready && lang === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-pressed={active}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                active
                  ? "bg-gradient-palmon text-white"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              {CALC_LANG_LABEL[code]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
