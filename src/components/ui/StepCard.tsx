import type { ReactNode } from "react";
import { Icon } from "./Icons";

interface StepCardProps {
  step: number;
  title: string;
  status: "active" | "done" | "locked";
  compact?: boolean;
  children: ReactNode;
}

export function StepCard({ step, title, status, compact = false, children }: StepCardProps) {
  const locked = status === "locked";
  let circle = "bg-ink text-white";
  if (status === "done") circle = "bg-success text-white";
  if (locked) circle = "bg-disabled-bg text-disabled-text";

  return (
    <section
      className={`rounded border-2 ${compact ? "p-4" : "p-5 sm:p-6"} ${
        locked ? "border-disabled-border bg-surface opacity-60" : "border-ink bg-surface"
      }`}
      aria-current={status === "active" ? "step" : undefined}
    >
      <header className={`flex items-center ${compact ? "mb-3 gap-3" : "mb-4 gap-4"}`}>
        <span
          className={`flex shrink-0 items-center justify-center rounded-full font-bold ${circle} ${
            compact ? "h-9 w-9 text-[18px]" : "h-11 w-11 text-[20px]"
          }`}
        >
          {status === "done" ? <Icon name="check" size={compact ? 20 : 24} /> : step}
        </span>
        <h2 className={`font-bold ${compact ? "text-[20px]" : "text-[22px] sm:text-[26px]"} ${locked ? "text-disabled-text" : ""}`}>
          {title}
        </h2>
      </header>
      <div className={locked ? "pointer-events-none" : ""} aria-hidden={locked || undefined}>
        {children}
      </div>
    </section>
  );
}
