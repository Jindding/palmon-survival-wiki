import type { ReactNode } from "react";
import { CalcLangProvider } from "@/components/calculator/CalcLangProvider";
import { CalcLangSwitcher } from "@/components/calculator/CalcLangSwitcher";

// /simulator/* 공통 껍데기.
// 계산기와 같은 언어 상태를 공유한다(같은 localStorage 키). 도구 페이지에서 한 번 고르면
// 계산기든 시뮬레이터든 같은 언어로 보이는 편이 자연스럽다.

export default function SimulatorLayout({ children }: { children: ReactNode }) {
  return (
    <CalcLangProvider>
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-end">
        <CalcLangSwitcher />
      </div>
      {children}
    </CalcLangProvider>
  );
}
