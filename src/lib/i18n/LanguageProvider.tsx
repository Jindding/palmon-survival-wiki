"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dict, type Dict, type Lang } from "./dict";

const STORAGE_KEY = "palmon-hub-lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ko");

  useEffect(() => {
    const saved = typeof window !== "undefined"
      ? (localStorage.getItem(STORAGE_KEY) as Lang | null)
      : null;
    if (saved === "ko" || saved === "en") {
      setLangState(saved);
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    } catch {
      /* noop */
    }
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "ko" ? "en" : "ko");
  }, [lang, setLang]);

  const value: LanguageContextValue = {
    lang,
    setLang,
    toggle,
    t: dict[lang],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
}

export function useT() {
  return useLanguage().t;
}
