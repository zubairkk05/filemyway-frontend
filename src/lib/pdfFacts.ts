export interface PdfFacts {
  pageCount: number;
  isEncrypted: boolean;
  hasTextLayer: boolean;
  fileSizeMB: number;
}

let workerReady = false;

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  if (!workerReady) {
    // Self-hosted worker bundled by Next.js from node_modules.
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
    workerReady = true;
  }
  return pdfjs;
}

/**
 * Read lightweight facts from a single PDF on the device (doc 05, section 4).
 * Reads at most the first 3 pages for the text-layer sample. Returns null on
 * any failure so the smart drop can fall back to generic ranking.
 */
export async function readPdfFacts(file: File): Promise<PdfFacts | null> {
  const fileSizeMB = file.size / (1024 * 1024);
  try {
    const pdfjs = await loadPdfjs();
    const data = new Uint8Array(await file.arrayBuffer());
    const doc = await pdfjs.getDocument({ data, isEvalSupported: false }).promise;

    const pageCount = doc.numPages;
    let hasTextLayer = false;
    const limit = Math.min(3, pageCount);
    for (let p = 1; p <= limit; p++) {
      const page = await doc.getPage(p);
      const text = await page.getTextContent();
      const sample = text.items.map((it) => ("str" in it ? it.str : "")).join("").trim();
      if (sample.length > 20) {
        hasTextLayer = true;
        break;
      }
    }

    await doc.destroy();
    return { pageCount, isEncrypted: false, hasTextLayer, fileSizeMB };
  } catch (err) {
    // Password-protected PDFs throw a PasswordException of name "PasswordException".
    const name = (err as { name?: string })?.name;
    if (name === "PasswordException") {
      return { pageCount: 0, isEncrypted: true, hasTextLayer: false, fileSizeMB };
    }
    return null;
  }
}
