import type { ReactNode } from "react";
import { CalcLangProvider } from "@/components/calculator/CalcLangProvider";
import { CalcLangSwitcher } from "@/components/calculator/CalcLangSwitcher";

// /calculator/* 공통 껍데기.
// 언어 스위처를 여기에 한 번만 두면 계산기 6개 전부에 노출되고, 계산기 밖에는 나오지 않는다.
// 영문 지원 범위가 계산기뿐이라 전역 헤더에 두지 않았다.

export default function CalculatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CalcLangProvider>
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-end">
        <CalcLangSwitcher />
      </div>
      {children}
    </CalcLangProvider>
  );
}
