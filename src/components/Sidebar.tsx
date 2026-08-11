"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { menu } from "@/lib/menu";
import { Logo } from "./Logo";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 flex-col border-r border-app bg-card sticky top-0 h-screen">
      <div className="p-6 border-b border-app">
        <Logo />
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {menu.map((sec) => (
          <div key={sec.section}>
            <div className="text-xs uppercase tracking-wider text-fg-subtle mb-2 px-3">
              {sec.section}
            </div>
            <ul className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                const disabled = item.soon;
                const content = (
                  <>
                    <Icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    {item.soon && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-fg-subtle">
                        준비중
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={item.href}>
                    {disabled ? (
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-fg-subtle cursor-not-allowed">
                        {content}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          active
                            ? "bg-gradient-palmon text-white shadow-soft"
                            : "hover:bg-muted"
                        }`}
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-app text-[10px] text-fg-subtle">
        비공식 팬 위키 · Lilith Games
      </div>
    </aside>
  );
}
