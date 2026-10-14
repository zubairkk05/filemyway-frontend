import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "./Icons";

type Variant = "primary" | "secondary";
type Size = "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingLabel?: string;
  icon?: IconName;
}

const SIZES: Record<Size, string> = {
  md: "min-h-[56px] px-6 text-[20px]",
  lg: "min-h-[76px] px-8 text-[24px]",
  xl: "min-h-[92px] px-10 text-[26px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "lg", loading = false, loadingLabel, icon, children, className = "", disabled, ...rest },
  ref
) {
  const base =
    "inline-flex items-center justify-center gap-3 rounded border-2 font-bold transition-colors disabled:cursor-not-allowed";
  const variants: Record<Variant, string> = {
    primary:
      "border-ink bg-orange text-ink hover:bg-orange-hover active:bg-orange-press disabled:bg-disabled-bg disabled:border-disabled-border disabled:text-disabled-text",
    secondary:
      "border-ink bg-transparent text-ink hover:bg-highlight active:bg-highlight disabled:border-disabled-border disabled:text-disabled-text",
  };

  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === "xl" ? 30 : 24} />}
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
});
