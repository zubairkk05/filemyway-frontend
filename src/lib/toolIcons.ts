import type { IconName } from "@/components/ui/Icons";

/**
 * Maps a tool slug to a glyph for the landing-page grid. Purely presentational;
 * falls back to a generic file icon so new tools never break the page.
 */
const TOOL_ICONS: Record<string, IconName> = {
  "merge-pdf": "plus",
  "split-pdf": "scissors",
  "compress-pdf": "shrink",
  "rotate-pdf": "rotateRight",
  "delete-pdf-pages": "trash",
  "reorder-pdf-pages": "dragHandle",
  "add-page-numbers": "hash",
  "watermark-pdf": "watermark",
  "protect-pdf": "lock",
  "unlock-pdf": "unlock",
  "pdf-to-jpg": "image",
  "pdf-to-png": "image",
  "pdf-to-text": "text",
  "pdf-to-excel": "table",
  "pdf-to-ppt": "file",
  "ocr-pdf": "text",
  "jpg-to-pdf": "upload",
  "excel-to-pdf": "table",
  "png-to-jpg": "image",
  "jpg-to-png": "image",
  "webp-to-jpg": "image",
  "webp-to-png": "image",
  "jpg-to-webp": "image",
  "heic-to-jpg": "image",
};

export function toolIcon(slug: string): IconName {
  return TOOL_ICONS[slug] ?? "file";
}
