"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icons";

export interface CapsuleOption {
  value: string;
  label: string;
  badge?: string;
}

interface CapsuleSelectProps {
  options: CapsuleOption[];
  placeholder: string;
  ariaLabel: string;
  value?: string;
  variant?: "capsule" | "plain";
  onChange: (value: string) => void;
}

export function CapsuleSelect({ options, placeholder, ariaLabel, value, variant = "capsule", onChange }: CapsuleSelectProps) {
  const selectedLabel = options.find((o) => o.value === value)?.label;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const baseId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelectorAll("[role=option]")[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openList = () => {
    setActive(0);
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
    onChange(option.value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus({ preventScroll: true });
        break;
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(options.length - 1, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        choose(active);
        break;
    }
  };

  return (
    <div ref={rootRef} className={variant === "plain" ? "relative inline-block" : "relative w-full sm:w-[280px]"} onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openList())}
        className={
          variant === "plain"
            ? `inline-flex items-center gap-1.5 text-[17px] font-bold text-ink transition-colors hover:text-orange ${
                open ? "text-orange" : ""
              }`
            : `flex h-12 w-full items-center justify-between gap-3 rounded-full border-2 border-ink bg-surface pl-5 pr-2 text-[17px] font-bold text-ink transition-colors focus-visible:bg-highlight ${
                open ? "bg-highlight" : "hover:bg-highlight"
              }`
        }
      >
        <span className="truncate">{selectedLabel ?? placeholder}</span>
        {variant === "plain" ? (
          <Icon
            name="chevronDown"
            size={16}
            className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        ) : (
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-transform duration-150 ${
              open ? "rotate-180" : ""
            }`}
          >
            <Icon name="chevronDown" size={18} />
          </span>
        )}
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          aria-activedescendant={`${baseId}-${active}`}
          className={`absolute left-0 z-30 mt-2 max-h-72 animate-fade-in overflow-auto rounded-2xl border-2 border-ink bg-surface py-1 shadow-[0_12px_32px_-12px_rgba(20,20,20,0.45)] ${
            variant === "plain" ? "min-w-[260px]" : "right-0"
          }`}
        >
          {options.map((option, i) => (
            <li
              id={`${baseId}-${i}`}
              key={option.value}
              role="option"
              aria-selected={value !== undefined ? option.value === value : i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
              className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-[17px] font-bold ${
                i === active ? "bg-highlight" : ""
              }`}
            >
              <span className="truncate">{option.label}</span>
              {option.badge && (
                <span className="shrink-0 rounded border-2 border-ink px-1.5 text-[13px] font-bold">{option.badge}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
