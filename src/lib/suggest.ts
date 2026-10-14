import { visibleTools, getToolBySlug, type FileKind, type ToolConfig } from "@/config/tools.config";
import type { PdfFacts } from "./pdfFacts";

export interface Suggestion {
  tool: ToolConfig;
  reason: string;
  best: boolean;
}

export interface SuggestContext {
  kinds: FileKind[];
  count: number;
  facts?: PdfFacts;
}

export interface SuggestResult {
  top: Suggestion[];
  more: Suggestion[];
  /** Encrypted PDF: only Unlock is offered until unlocked. */
  locked: boolean;
  scan: boolean;
  wordPpt: boolean;
  unsupported: boolean;
  mixed: boolean;
}

function toSuggestion(tool: ToolConfig, best = false): Suggestion {
  return { tool, reason: tool.suggest?.reason ?? "", best };
}

function applyRules(base: ToolConfig[], ctx: SuggestContext): { ordered: ToolConfig[]; scan: boolean } {
  const allPdf = ctx.kinds.every((k) => k === "pdf");
  let ordered = [...base];
  let scan = false;

  if (allPdf && ctx.facts) {
    const { isEncrypted, hasTextLayer, pageCount, fileSizeMB } = ctx.facts;

    if (isEncrypted) {
      const unlock = getToolBySlug("unlock-pdf");
      return { ordered: unlock ? [unlock] : [], scan: false };
    }

    if (!hasTextLayer) {
      scan = true;
      ordered = ordered.filter((t) => !t.suggest?.requiresText);
      ordered = moveToFront(ordered, ["ocr-pdf", "compress-pdf", "pdf-to-jpg"]);
    } else {
      ordered = ordered.filter((t) => !t.suggest?.requiresScan);
      ordered = promoteInto(ordered, ["pdf-to-text", "pdf-to-excel"], 5);
    }

    if (fileSizeMB > 10) ordered = moveToFront(ordered, ["compress-pdf"]);
    if (pageCount !== undefined && pageCount <= 1) {
      ordered = ordered.filter((t) => !["split-pdf", "reorder-pdf-pages", "delete-pdf-pages", "merge-pdf"].includes(t.slug));
    }
    if (pageCount !== undefined && pageCount > 30) ordered = moveToFront(ordered, ["split-pdf", "delete-pdf-pages"]);
  }

  return { ordered, scan };
}

function moveToFront(list: ToolConfig[], slugs: string[]): ToolConfig[] {
  const picked = slugs.map((s) => list.find((t) => t.slug === s)).filter((t): t is ToolConfig => !!t);
  const rest = list.filter((t) => !slugs.includes(t.slug));
  return [...picked, ...rest];
}

function promoteInto(list: ToolConfig[], slugs: string[], _topN: number): ToolConfig[] {
  const picked = slugs.map((s) => list.find((t) => t.slug === s)).filter((t): t is ToolConfig => !!t);
  const rest = list.filter((t) => !slugs.includes(t.slug));
  return [...picked, ...rest];
}

export function suggest(ctx: SuggestContext): SuggestResult {
  const uniqueKinds = Array.from(new Set(ctx.kinds.filter((k) => k !== "unknown")));
  const mixed = uniqueKinds.length > 1;

  if (ctx.kinds.includes("word") || ctx.kinds.includes("powerpoint")) {
    return { top: [], more: [], locked: false, scan: false, wordPpt: true, unsupported: false, mixed };
  }
  if (mixed) {
    return { top: [], more: [], locked: false, scan: false, wordPpt: false, unsupported: false, mixed: true };
  }
  if (uniqueKinds.length === 0) {
    return { top: [], more: [], locked: false, scan: false, wordPpt: false, unsupported: true, mixed: false };
  }

  const primary = uniqueKinds[0];
  let locked = false;
  let scan = false;

  let ordered: ToolConfig[] = [];

  if (primary === "pdf" && ctx.count >= 2) {
    // Several PDFs: join first, then the usual tools.
    const merge = getToolBySlug("merge-pdf");
    const rest = visibleTools().filter(
      (t) => t.suggest?.kinds.includes("pdf") && t.slug !== "merge-pdf" && t.status !== "hidden"
    );
    ordered = [...(merge ? [merge] : []), ...rest];
    scan = applyRules(ordered, ctx).scan;
  } else if (primary === "pdf") {
    const base = visibleTools().filter((t) => t.suggest?.kinds.includes("pdf"));
    const res = applyRules(base, ctx);
    ordered = res.ordered;
    scan = res.scan;
    if (ordered.length === 1 && ordered[0].slug === "unlock-pdf") locked = true;
  } else if (primary === "image") {
    const toPdf = getToolBySlug("jpg-to-pdf");
    const converterSlug = pickImageConverterSlug(ctx);
    const converter = converterSlug ? getToolBySlug(converterSlug) : undefined;
    ordered = [toPdf, converter].filter((t): t is ToolConfig => !!t);
  } else if (primary === "heic") {
    const heic = getToolBySlug("heic-to-jpg");
    ordered = [heic].filter((t): t is ToolConfig => !!t);
  } else if (primary === "excel") {
    const excel = getToolBySlug("excel-to-pdf");
    ordered = [excel].filter((t): t is ToolConfig => !!t);
  }

  const suggestions = ordered.map((t, i) => toSuggestion(t, i === 0));
  return {
    top: suggestions.slice(0, 3),
    more: suggestions.slice(3),
    locked,
    scan,
    wordPpt: false,
    unsupported: false,
    mixed: false,
  };
}

function pickImageConverterSlug(ctx: SuggestContext): string | undefined {
  // All image landing pages share one API tool; pick a sensible entry point.
  if (ctx.kinds.includes("heic")) return undefined;
  return "png-to-jpg";
}

/**
 * Every visible tool that can accept at least one of the given file kinds.
 * No ranking, no "best match" — the user decides (doc 05 replaced by choice).
 */
export function toolsForKinds(kinds: FileKind[]): ToolConfig[] {
  const present = new Set<FileKind>(kinds.filter((k) => k !== "unknown"));
  if (present.size === 0) return [];
  return visibleTools().filter((t) => t.accepts.kinds.some((k) => present.has(k)));
}
