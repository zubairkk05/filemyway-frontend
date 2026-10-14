"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { FileKind } from "@/config/tools.config";
import type { PdfFacts } from "@/lib/pdfFacts";

export interface PendingFile {
  file: File;
  kind: FileKind;
  facts?: PdfFacts;
}

interface PendingFilesValue {
  files: PendingFile[];
  /** Seconds since last change, used for the 30-minute idle clear. */
  setFiles: (files: PendingFile[]) => void;
  clear: () => void;
  /** A short flag that the tool page reads to know pending files just arrived. */
  seed: number;
}

const PendingFilesContext = createContext<PendingFilesValue | null>(null);

export function PendingFilesProvider({ children }: { children: ReactNode }) {
  const [files, setFilesState] = useState<PendingFile[]>([]);
  const [seed, setSeed] = useState(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const armIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setFilesState([]), 30 * 60 * 1000);
  }, []);

  const setFiles = useCallback(
    (next: PendingFile[]) => {
      setFilesState(next);
      setSeed((s) => s + 1);
      armIdle();
    },
    [armIdle]
  );

  const clear = useCallback(() => {
    setFilesState([]);
    if (idleTimer.current) clearTimeout(idleTimer.current);
  }, []);

  const value = useMemo<PendingFilesValue>(() => ({ files, setFiles, clear, seed }), [files, setFiles, clear, seed]);

  return <PendingFilesContext.Provider value={value}>{children}</PendingFilesContext.Provider>;
}

export function usePendingFiles(): PendingFilesValue {
  const ctx = useContext(PendingFilesContext);
  if (!ctx) throw new Error("usePendingFiles must be used inside PendingFilesProvider");
  return ctx;
}
