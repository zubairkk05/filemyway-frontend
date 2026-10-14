/**
 * On-device OCR (doc 05: ocr-pdf runs in the browser, the file is never uploaded).
 *
 * PDFs are rasterised page-by-page with pdfjs-dist and each page picture is read
 * by tesseract.js. Images are read directly. The tesseract worker, core wasm and
 * language data are fetched from the jsDelivr CDN on first use.
 */

export interface OcrProgress {
  percent: number;
  message?: string;
}

export interface OcrOutcome {
  text: string;
  pages: number;
}

export interface OcrArgs {
  file: File;
  language: string;
  maxPages: number;
  onProgress?: (progress: OcrProgress) => void;
  onNotice?: (message: string) => void;
  signal?: AbortSignal;
}

const PDF_SCALE = 2;
const IMAGE_MAX_DIM = 2200;
const RENDER_BUDGET = 12;

let pdfjsReady = false;

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  if (!pdfjsReady) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
    pdfjsReady = true;
  }
  return pdfjs;
}

function aborted(): { code: string; message: string } {
  return { code: "ABORTED", message: "Cancelled" };
}

async function renderPdf(args: OcrArgs): Promise<HTMLCanvasElement[]> {
  const { file, maxPages, onProgress, onNotice, signal } = args;
  const pdfjs = await loadPdfjs();
  const data = new Uint8Array(await file.arrayBuffer());
  if (signal?.aborted) throw aborted();
  const doc = await pdfjs.getDocument({ data, isEvalSupported: false }).promise;

  const total = Math.min(doc.numPages, maxPages);
  if (doc.numPages > maxPages) {
    onNotice?.(`Only the first ${maxPages} pages were read.`);
  }

  const canvases: HTMLCanvasElement[] = [];
  for (let p = 1; p <= total; p++) {
    if (signal?.aborted) {
      await doc.destroy();
      throw aborted();
    }
    const page = await doc.getPage(p);
    const viewport = page.getViewport({ scale: PDF_SCALE });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) throw { code: "ENGINE_FAILED", message: "Canvas unavailable" };
    await page.render({ canvasContext: context, viewport }).promise;
    canvases.push(canvas);
    onProgress?.({ percent: Math.round((p / total) * RENDER_BUDGET), message: "Reading pages" });
  }
  await doc.destroy();
  return canvases;
}

async function imageToCanvas(file: File): Promise<HTMLCanvasElement[]> {
  const bitmap = await createImageBitmap(file);
  const longest = Math.max(bitmap.width, bitmap.height);
  const scale = longest > IMAGE_MAX_DIM ? IMAGE_MAX_DIM / longest : 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw { code: "ENGINE_FAILED", message: "Canvas unavailable" };
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return [canvas];
}

function looksLikePdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

/**
 * Read the words from a scanned PDF or picture on the device. Resolves with the
 * text and the number of pages/images processed.
 */
export async function runBrowserOcr(args: OcrArgs): Promise<OcrOutcome> {
  const { file, language, maxPages, onProgress, signal } = args;

  const sources = looksLikePdf(file)
    ? await renderPdf(args)
    : await imageToCanvas(file);

  if (signal?.aborted) throw aborted();

  const Tesseract = await import("tesseract.js");
  const pageCount = sources.length;
  let pageIndex = 0;

  onProgress?.({ percent: RENDER_BUDGET, message: "Loading the reader" });

  const worker = await Tesseract.createWorker(language || "eng", undefined, {
    logger: (m) => {
      if (m.status !== "recognizing text" || typeof m.progress !== "number") return;
      const span = 100 - RENDER_BUDGET;
      const percent = RENDER_BUDGET + Math.round(((pageIndex + m.progress) / pageCount) * span);
      onProgress?.({
        percent: Math.min(99, percent),
        message: pageCount > 1 ? `Reading page ${pageIndex + 1} of ${pageCount}` : "Reading the words",
      });
    },
  });

  try {
    const pages: string[] = [];
    for (let i = 0; i < sources.length; i++) {
      if (signal?.aborted) throw aborted();
      pageIndex = i;
      const { data } = await worker.recognize(sources[i]);
      const text = (data.text ?? "").trim();
      if (text) pages.push(text);
    }
    onProgress?.({ percent: 100, message: "Finished" });
    return { text: pages.join("\n\n"), pages: pageCount };
  } finally {
    await worker.terminate();
  }
}
