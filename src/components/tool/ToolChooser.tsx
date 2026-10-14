"use client";

import { useEffect, useRef } from "react";
import type { ToolConfig } from "@/config/tools.config";
import { copy } from "@/config/copy";
import { Banner } from "@/components/ui/Banner";
import { Icon } from "@/components/ui/Icons";
import { CapsuleSelect } from "@/components/ui/CapsuleSelect";
import { formatBytes, truncateMiddle } from "@/lib/format";
import type { PendingFile } from "@/state/pendingFiles";

export interface ChooserNotice {
  tone: "info" | "warning";
  text: string;
}

interface ToolChooserProps {
  files: PendingFile[];
  tools: ToolConfig[];
  notice: ChooserNotice | null;
  onChoose: (tool: ToolConfig) => void;
  onStartOver: () => void;
}

export function ToolChooser({ files, tools, notice, onChoose, onStartOver }: ToolChooserProps) {
  const questionRef = useRef<HTMLHeadingElement>(null);
  const first = files[0];

  useEffect(() => {
    questionRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section aria-labelledby="choose-question" className="animate-fade-in space-y-4">
      <h2 id="choose-question" ref={questionRef} tabIndex={-1} className="text-[28px] font-bold sm:text-[32px]">
        {copy.drop.question}
      </h2>

      {/* One snackbar: the file on the left, the action dropdown on the right. */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-ink bg-surface px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Icon name="file" size={26} />
          <div className="min-w-0">
            <p className="truncate font-bold" title={first?.file.name}>
              {first ? truncateMiddle(first.file.name, 40) : ""}
            </p>
            <p className="text-helper text-muted">
              {first ? formatBytes(first.file.size) : ""}
              {first?.facts?.pageCount !== undefined ? ` · ${first.facts.pageCount} ${first.facts.pageCount === 1 ? "page" : "pages"}` : ""}
              {files.length > 1 ? ` · +${files.length - 1} more` : ""}
            </p>
          </div>
        </div>

        {tools.length > 0 && (
          <div className="ml-auto w-full sm:w-[280px]">
            <CapsuleSelect
              options={tools.map((tool) => ({
                value: tool.slug,
                label: tool.plainLabel,
                badge: tool.status === "beta" ? "Beta" : undefined,
              }))}
              placeholder={copy.drop.chooseAction}
              ariaLabel={copy.drop.question}
              onChange={(value) => {
                const tool = tools.find((t) => t.slug === value);
                if (tool) onChoose(tool);
              }}
            />
          </div>
        )}
      </div>

      {notice && <Banner tone={notice.tone}>{notice.text}</Banner>}
      {tools.length === 0 && !notice && <Banner tone="info">{copy.smartDrop.unsupported}</Banner>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-helper text-muted">{copy.drop.privacyLine}</p>
        <button type="button" onClick={onStartOver} className="text-helper font-bold underline underline-offset-[5px]">
          {copy.drop.startOver}
        </button>
      </div>
    </section>
  );
}
