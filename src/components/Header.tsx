"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { Clock } from "./Clock";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 backdrop-blur bg-app/80 border-b border-app">
        <div className="flex items-center justify-between px-3 md:px-8 h-16 gap-2">
          <div className="flex items-center gap-2 md:hidden min-w-0">
            <button
              onClick={() => setOpen(true)}
              aria-label="메뉴 열기"
              className="p-2 rounded-lg hover:bg-muted flex-shrink-0"
            >
              <Menu size={22} />
            </button>
          </div>
          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <Clock />
            <div className="flex items-center gap-0.5">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
