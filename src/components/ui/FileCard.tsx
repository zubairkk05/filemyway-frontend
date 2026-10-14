import { Icon } from "./Icons";
import { formatBytes, truncateMiddle } from "@/lib/format";

interface FileCardProps {
  name: string;
  size: number;
  pages?: number;
  kindLabel?: string;
  onRemove?: () => void;
  removeLabel?: string;
}

export function FileCard({ name, size, pages, kindLabel, onRemove, removeLabel = "Remove" }: FileCardProps) {
  return (
    <div className="flex items-center gap-4 rounded border-2 border-ink bg-surface px-4 py-3">
      <Icon name="file" size={28} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold" title={name}>
          {truncateMiddle(name, 48)}
        </p>
        <p className="text-helper text-muted">
          {formatBytes(size)}
          {pages !== undefined ? ` · ${pages} ${pages === 1 ? "page" : "pages"}` : ""}
          {kindLabel ? ` · ${kindLabel}` : ""}
        </p>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex min-h-[48px] items-center gap-2 rounded border-2 border-ink px-3 text-helper font-bold hover:bg-highlight"
        >
          <Icon name="close" size={18} />
          {removeLabel}
        </button>
      )}
    </div>
  );
}
