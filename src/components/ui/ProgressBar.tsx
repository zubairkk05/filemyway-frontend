interface ProgressBarProps {
  percent: number;
  label?: string;
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div>
      <div
        className="h-[30px] w-full overflow-hidden rounded border-2 border-ink bg-surface"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div className="h-full bg-orange transition-[width]" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-2 text-[22px] font-bold" aria-live="polite">
        {value}%
      </p>
    </div>
  );
}
