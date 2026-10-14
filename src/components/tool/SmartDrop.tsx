"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ToolConfig } from "@/config/tools.config";
import { visibleTools } from "@/config/tools.config";
import { copy } from "@/config/copy";
import { DropBox } from "@/components/ui/DropBox";
import { Banner } from "@/components/ui/Banner";
import { ToolChooser, type ChooserNotice } from "./ToolChooser";
import { detectKind, isZip } from "@/lib/fileKinds";
import { readPdfFacts } from "@/lib/pdfFacts";
import { toolsForKinds } from "@/lib/suggest";
import { usePendingFiles, type PendingFile } from "@/state/pendingFiles";

type Phase = "empty" | "analysing" | "choosing";

function acceptAttr(): string {
  const exts = new Set<string>();
  for (const tool of visibleTools()) for (const ext of tool.accepts.extensions) exts.add(ext);
  return Array.from(exts)
    .map((e) => `.${e}`)
    .join(",");
}

export function SmartDrop({
  fullWindowDrop = false,
  compact = false,
  onChooseTool,
}: {
  fullWindowDrop?: boolean;
  compact?: boolean;
  onChooseTool?: (tool: ToolConfig) => void;
}) {
  const router = useRouter();
  const { setFiles: setPending, clear } = usePendingFiles();
  const [phase, setPhase] = useState<Phase>("empty");
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [choices, setChoices] = useState<ToolConfig[]>([]);
  const [notice, setNotice] = useState<ChooserNotice | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pageDragging, setPageDragging] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setPhase("empty");
    setFiles([]);
    setChoices([]);
    setNotice(null);
    setMessage(null);
    clear();
  }, [clear]);

  const analyse = useCallback(async (incoming: File[]) => {
    setMessage(null);

    const rejected: string[] = [];
    const kept: File[] = [];
    const seen = new Set<string>();

    for (const file of incoming) {
      if (isZip(file.name)) {
        rejected.push(copy.smartDrop.zip);
        continue;
      }
      if (file.size === 0) {
        rejected.push(copy.smartDrop.folder);
        continue;
      }
      const key = `${file.name}:${file.size}:${file.lastModified}`;
      if (seen.has(key)) continue;
      seen.add(key);
      kept.push(file);
    }

    if (kept.length === 0) {
      setMessage(rejected[0] ?? copy.smartDrop.unsupported);
      return;
    }

    setPhase("analysing");

    const detected: PendingFile[] = [];
    for (const file of kept) {
      const info = await detectKind(file);
      detected.push({ file, kind: info.kind });
    }

    // PDF facts for a single PDF (doc 05, section 4).
    if (detected.length === 1 && detected[0].kind === "pdf") {
      const facts = await readPdfFacts(detected[0].file);
      if (facts) detected[0].facts = facts;
    }

    const kinds = detected.map((d) => d.kind);
    const uniqueKinds = Array.from(new Set(kinds.filter((k) => k !== "unknown")));
    const facts = detected[0]?.facts;
    const hasWordPpt = kinds.includes("word") || kinds.includes("powerpoint");

    let nextNotice: ChooserNotice | null = null;
    if (hasWordPpt) nextNotice = { tone: "info", text: copy.smartDrop.wordPpt };
    else if (uniqueKinds.length === 0) nextNotice = { tone: "info", text: copy.smartDrop.unknownList };
    else if (uniqueKinds.length > 1) nextNotice = { tone: "info", text: copy.smartDrop.mixedKinds };
    else if (facts?.isEncrypted) nextNotice = { tone: "warning", text: copy.smartDrop.encrypted };
    else if (facts && !facts.hasTextLayer) nextNotice = { tone: "info", text: copy.smartDrop.scanDetected };

    setFiles(detected);
    setChoices(hasWordPpt || uniqueKinds.length === 0 ? [] : toolsForKinds(kinds));
    setNotice(nextNotice);
    setPhase("choosing");
    // Keep files in the in-memory store for the handoff to the chosen tool.
    setPending(detected);

    if (rejected.length > 0) setMessage(rejected[0]);
  }, [setPending]);

  const onChoose = useCallback(
    (tool: ToolConfig) => {
      setPending(files);
      if (onChooseTool) onChooseTool(tool);
      else router.push(`/${tool.slug}`);
    },
    [files, onChooseTool, router, setPending]
  );

  // Paste support (home + tool pages).
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const pasted = Array.from(e.clipboardData?.files ?? []);
      if (pasted.length > 0) void analyse(pasted);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [analyse]);

  // Full-window drop overlay on the home page.
  useEffect(() => {
    if (!fullWindowDrop) return;
    let depth = 0;
    const onEnter = (e: DragEvent) => {
      if (!e.dataTransfer?.types.includes("Files")) return;
      depth++;
      setPageDragging(true);
    };
    const onLeave = () => {
      depth = Math.max(0, depth - 1);
      if (depth === 0) setPageDragging(false);
    };
    const onOver = (e: DragEvent) => e.preventDefault();
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      depth = 0;
      setPageDragging(false);
      const dropped = Array.from(e.dataTransfer?.files ?? []);
      if (dropped.length > 0) void analyse(dropped);
    };
    window.addEventListener("dragenter", onEnter, true);
    window.addEventListener("dragleave", onLeave, true);
    window.addEventListener("dragover", onOver, true);
    window.addEventListener("drop", onDrop, true);
    return () => {
      window.removeEventListener("dragenter", onEnter, true);
      window.removeEventListener("dragleave", onLeave, true);
      window.removeEventListener("dragover", onOver, true);
      window.removeEventListener("drop", onDrop, true);
    };
  }, [analyse, fullWindowDrop]);

  return (
    <div ref={sectionRef} className="relative">
      {pageDragging && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center border-4 border-dashed border-orange bg-highlight/40">
          <p className="rounded bg-surface px-8 py-4 text-[32px] font-bold">Drop to start</p>
        </div>
      )}

      {phase === "choosing" ? (
        <ToolChooser files={files} tools={choices} notice={notice} onChoose={onChoose} onStartOver={reset} />
      ) : (
        <div className="space-y-4">
          {message && (
            <Banner tone="info" role="status">
              {message}
            </Banner>
          )}
          {phase === "analysing" ? (
            <div
              className={`flex flex-col items-center justify-center gap-3 rounded-box border-3 border-dashed border-ink bg-surface ${
                compact ? "min-h-[190px]" : "min-h-[260px] sm:min-h-[340px]"
              }`}
            >
              <p className="text-[26px] font-bold">{copy.drop.analysing}</p>
              {files[0] && (
                <p className="text-helper text-muted" aria-live="polite">
                  {files[0].file.name}
                </p>
              )}
            </div>
          ) : (
            <DropBox accept={acceptAttr()} multiple compact={compact} onFiles={(f) => void analyse(f)} />
          )}
        </div>
      )}
    </div>
  );
}
