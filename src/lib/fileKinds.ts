import type { FileKind } from "@/config/tools.config";

export interface KindInfo {
  kind: FileKind;
  /** Human word used in plain messages, e.g. "PDF", "picture". */
  word: string;
}

export interface DetectedKind extends KindInfo {
  ext: string;
  /** True when the bytes disagree with the extension. */
  mismatch: boolean;
  /** The kind implied by the extension alone. */
  extKind: FileKind;
}

const WORD: Record<FileKind, string> = {
  pdf: "PDF",
  image: "picture",
  heic: "iPhone photo",
  excel: "spreadsheet",
  word: "Word document",
  powerpoint: "PowerPoint file",
  unknown: "file",
};

export const kindWord = (kind: FileKind): string => WORD[kind];

const EXT_MAP: Record<string, FileKind> = {
  pdf: "pdf",
  jpg: "image",
  jpeg: "image",
  png: "image",
  webp: "image",
  heic: "heic",
  heif: "heic",
  xlsx: "excel",
  csv: "excel",
  xls: "excel",
  ods: "excel",
  doc: "word",
  docx: "word",
  odt: "word",
  rtf: "word",
  ppt: "powerpoint",
  pptx: "powerpoint",
  odp: "powerpoint",
};

export function extOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}

export function kindFromExtension(name: string): FileKind {
  return EXT_MAP[extOf(name)] ?? "unknown";
}

function bytesToAscii(bytes: Uint8Array, start: number, length: number): string {
  let out = "";
  for (let i = start; i < start + length; i++) out += String.fromCharCode(bytes[i] ?? 0);
  return out;
}

/** Sniff the first 16 bytes (doc 05, section 2). Returns null if no match. */
export function kindFromBytes(bytes: Uint8Array): FileKind | null {
  const starts = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);

  if (bytes.length >= 5 && bytesToAscii(bytes, 0, 5) === "%PDF-") return "pdf";
  if (starts(0xff, 0xd8, 0xff)) return "image";
  if (starts(0x89, 0x50, 0x4e, 0x47)) return "image";
  if (bytes.length >= 12 && bytesToAscii(bytes, 0, 4) === "RIFF" && bytesToAscii(bytes, 8, 4) === "WEBP") return "image";
  if (bytes.length >= 12 && bytesToAscii(bytes, 4, 4) === "ftyp") {
    const brand = bytesToAscii(bytes, 8, 4);
    if (["heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(brand)) return "heic";
  }
  if (starts(0x50, 0x4b, 0x03, 0x04) || starts(0x50, 0x4b, 0x05, 0x06)) return "excel"; // ZIP / OOXML
  if (starts(0xd0, 0xcf, 0x11, 0xe0)) return "excel"; // legacy OLE (Office)
  return null;
}

/**
 * Detect a file's kind on the device. Extension first, then the first bytes.
 * If they disagree we trust the bytes and flag the mismatch (doc 05).
 */
export async function detectKind(file: File): Promise<DetectedKind> {
  const extKind = kindFromExtension(file.name);
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const byteKind = kindFromBytes(head);

  const kind = byteKind ?? extKind;
  return {
    kind,
    ext: extOf(file.name),
    word: WORD[kind],
    extKind,
    mismatch: byteKind !== null && extKind !== "unknown" && byteKind !== extKind,
  };
}

export function isZip(fileName: string): boolean {
  return extOf(fileName) === "zip";
}

export function isFolderLike(file: File): boolean {
  return file.size === 0 && file.type === "";
}
