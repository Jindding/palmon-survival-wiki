"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CalcLang } from "@/lib/i18n/calculator";

// 계산기 전용 언어 상태.
//
// 영문 지원은 /calculator/* 와 /simulator/* 에만 있으므로 전역이 아니라 각 레이아웃에서만 감싼다.
// 도구 사이를 옮겨 다녀도 언어가 유지되어야 해서 localStorage에 저장한다(키를 공유한다).
//
// 서버는 항상 한국어로 렌더하고, 저장된 언어는 마운트 후에 반영한다.
// 그래야 하이드레이션 불일치가 나지 않는다 (첫 프레임만 한국어로 스쳐 지나간다).

const STORAGE_KEY = "palmon-hub:calc-lang";

interface CalcLangContextValue {
  lang: CalcLang;
  setLang: (lang: CalcLang) => void;
  /** localStorage를 읽기 전인지. 스위처가 깜빡이지 않도록 쓰인다. */
  ready: boolean;
}

const CalcLangContext = createContext<CalcLangContextValue | null>(null);

export function CalcLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<CalcLang>("ko");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ko" || saved === "en") setLangState(saved);
    } catch {
      // localStorage를 못 쓰는 환경이면 기본값(한국어)으로 둔다.
    }
    setReady(true);
  }, []);

  const setLang = useCallback((next: CalcLang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 저장 실패해도 이번 세션 동안은 동작해야 하므로 무시한다.
    }
  }, []);

  return (
    <CalcLangContext.Provider value={{ lang, setLang, ready }}>
      {children}
    </CalcLangContext.Provider>
  );
}

export function useCalcLang(): CalcLangContextValue {
  const ctx = useContext(CalcLangContext);
  if (!ctx) {
    throw new Error("useCalcLang은 CalcLangProvider 안에서만 쓸 수 있습니다.");
  }
  return ctx;
}
