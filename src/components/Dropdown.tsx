"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

// 계산기 공용 드롭다운.
// 네이티브 <select>는 브라우저 기본 UI라 사이트 톤과 따로 놀고, 옵션이 수십 개일 때
// 그룹 구분이나 부가 정보(비용 등)를 붙일 수 없어서 직접 만들었다.
//
// 포커스는 트리거 버튼에 두고 aria-activedescendant로 하이라이트만 옮긴다.
// 목록으로 포커스를 실제 이동시키는 것보다 구현이 단순하면서 키보드 조작은 동일하게 된다.

export interface DropdownOption<T extends string | number> {
  value: T;
  label: string;
  /** 오른쪽에 흐리게 붙는 부가 정보 (예: 필요 개수) */
  hint?: string;
  /** 같은 값을 가진 항목끼리 묶여 머리글이 붙는다 */
  group?: string;
}

export function Dropdown<T extends string | number>({
  value,
  options,
  onChange,
  id,
  className = "",
}: {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  id?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedIndex = useMemo(
    () => options.findIndex((o) => o.value === value),
    [options, value]
  );
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  // 바깥 클릭으로 닫기
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // 열릴 때 현재 선택된 항목으로 스크롤
  useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    const raf = requestAnimationFrame(() => {
      listRef.current
        ?.querySelector('[data-active="true"]')
        ?.scrollIntoView({ block: "center" });
    });
    return () => cancelAnimationFrame(raf);
  }, [open, selectedIndex]);

  const commit = (index: number) => {
    const opt = options[index];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  };

  const move = (delta: number) => {
    setActiveIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next > options.length - 1) return options.length - 1;
      return next;
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      default:
        break;
    }
  };

  // 활성 항목이 바뀔 때마다 보이도록 스크롤
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-activedescendant={
          open && options[activeIndex] ? `${id}-opt-${activeIndex}` : undefined
        }
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border bg-app text-sm text-left transition-colors ${
          open
            ? "border-palmon-primary ring-2 ring-palmon-primary/25"
            : "border-app hover:border-palmon-primary/50"
        }`}
      >
        <span className="truncate">{selected?.label ?? "선택하세요"}</span>
        <span className="flex items-center gap-1.5 shrink-0">
          {selected?.hint && (
            <span className="text-[11px] text-fg-subtle tabular-nums">
              {selected.hint}
            </span>
          )}
          <ChevronDown
            size={16}
            className={`text-fg-subtle transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </span>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute z-30 mt-1.5 w-full max-h-72 overflow-y-auto rounded-xl border border-app bg-card shadow-lg p-1"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isActive = i === activeIndex;
            const showGroup = opt.group && opt.group !== options[i - 1]?.group;
            return (
              <div key={`${opt.value}`}>
                {showGroup && (
                  <div className="sticky top-0 z-10 bg-card px-2 pt-2 pb-1 text-[11px] font-bold text-fg-subtle">
                    {opt.group}
                  </div>
                )}
                <button
                  type="button"
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  data-active={isActive}
                  onClick={() => commit(i)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-sm text-left transition-colors ${
                    isSelected
                      ? "bg-gradient-palmon text-white"
                      : isActive
                        ? "bg-muted"
                        : ""
                  }`}
                >
                  <span className="flex items-center gap-1.5 min-w-0">
                    {isSelected && <Check size={13} className="shrink-0" />}
                    <span className="truncate">{opt.label}</span>
                  </span>
                  {opt.hint && (
                    <span
                      className={`text-[11px] tabular-nums shrink-0 ${
                        isSelected ? "text-white/80" : "text-fg-subtle"
                      }`}
                    >
                      {opt.hint}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
