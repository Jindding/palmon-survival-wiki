"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { menu } from "@/lib/menu";
import { useT } from "@/lib/i18n/LanguageProvider";
import { Logo } from "./Logo";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const t = useT();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-card border-r border-app transform transition-transform md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-app">
          <Logo onClick={onClose} />
          <button
            onClick={onClose}
            aria-label={t.header.closeMenu}
            className="p-2 rounded-lg hover:bg-muted"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-73px)]">
          {menu.map((sec) => (
            <div key={sec.sectionKey}>
              <div className="text-xs uppercase tracking-wider text-fg-subtle mb-2 px-3">
                {t.nav[sec.sectionKey]}
              </div>
              <ul className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  const disabled = item.soon;
                  const content = (
                    <>
                      <Icon size={18} />
                      <span className="flex-1">{t.nav[item.labelKey]}</span>
                      {item.soon && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-fg-subtle">
                          {t.nav.soonBadge}
                        </span>
                      )}
                    </>
                  );
                  return (
                    <li key={item.href}>
                      {disabled ? (
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-fg-subtle">
                          {content}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                            active
                              ? "bg-gradient-palmon text-white"
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
      </div>
    </>
  );
}
