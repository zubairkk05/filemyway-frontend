import Link from "next/link";
import type { ToolConfig, ToolGroup } from "@/config/tools.config";
import { Icon } from "@/components/ui/Icons";
import { toolIcon } from "@/lib/toolIcons";

const GROUP_ACCENT: Record<ToolGroup, string> = {
  convert: "bg-orange text-ink",
  make: "bg-success text-white",
  fix: "bg-highlight text-ink",
  pictures: "bg-ink text-white",
};

export function ToolTile({ tool, group }: { tool: ToolConfig; group: ToolGroup }) {
  return (
    <Link
      href={`/${tool.slug}`}
      title={tool.seo?.keywords[0] ?? tool.plainLabel}
      className="group flex h-full items-start gap-3 rounded border-2 border-ink bg-surface p-4 transition-colors hover:bg-highlight focus-visible:bg-highlight"
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-card ${GROUP_ACCENT[group]}`}>
        <Icon name={toolIcon(tool.slug)} size={24} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[19px] font-bold leading-tight">{tool.plainLabel}</span>
          {tool.status === "beta" && (
            <span className="rounded border-2 border-ink px-1.5 text-[13px] font-bold leading-[1.6]">Beta</span>
          )}
        </span>
        {tool.seo?.subtitle && (
          <span className="mt-0.5 line-clamp-2 block text-[16px] leading-snug text-muted">{tool.seo.subtitle}</span>
        )}
      </span>
    </Link>
  );
}
