import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icons";

type Tone = "info" | "success" | "warning" | "error";

const TONES: Record<Tone, string> = {
  info: "border-2 border-ink bg-surface text-ink",
  success: "bg-success text-white",
  warning: "bg-highlight text-ink",
  error: "border-2 border-error bg-surface text-error",
};

const ICONS: Record<Tone, IconName> = {
  info: "help",
  success: "check",
  warning: "warning",
  error: "warning",
};

interface BannerProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  role?: "status" | "alert";
}

export function Banner({ tone = "info", title, children, action, role }: BannerProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-4 rounded px-5 py-4 ${TONES[tone]}`}
      role={role ?? (tone === "error" ? "alert" : undefined)}
    >
      <Icon name={ICONS[tone]} size={28} />
      <div className="min-w-[12rem] flex-1 text-helper">
        {title && <p className="font-bold">{title}</p>}
        <div>{children}</div>
      </div>
      {action}
    </div>
  );
}
