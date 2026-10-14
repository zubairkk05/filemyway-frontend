"use client";

import { useCallback, useState } from "react";
import type { ToolConfig } from "@/config/tools.config";
import { copy } from "@/config/copy";
import { SmartDrop } from "./SmartDrop";
import { ToolWidget } from "./ToolWidget";
import { usePendingFiles } from "@/state/pendingFiles";

export function HomeToolFlow() {
  const [tool, setTool] = useState<ToolConfig | null>(null);
  const pending = usePendingFiles();

  const startOver = useCallback(() => {
    pending.clear();
    setTool(null);
  }, [pending]);

  if (!tool) {
    return <SmartDrop fullWindowDrop compact onChooseTool={setTool} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <header className="max-w-2xl">
          <h2 className="font-display text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.05] tracking-[-0.03em]">
            {tool.seo?.h1 ?? tool.plainLabel}
          </h2>
          {tool.seo?.subtitle && <p className="mt-2 text-[19px] text-muted">{tool.seo.subtitle}</p>}
        </header>
        <button
          type="button"
          onClick={startOver}
          className="inline-flex min-h-[48px] items-center text-helper font-bold underline underline-offset-[5px]"
        >
          {copy.drop.startOver}
        </button>
      </div>
      <ToolWidget key={tool.slug} tool={tool} compact onChangeTool={setTool} />
    </div>
  );
}
