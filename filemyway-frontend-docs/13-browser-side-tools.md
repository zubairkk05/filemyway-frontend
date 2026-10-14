# 13 — Browser-Side Tools and Helpers

## Rules for anything running on the visitor's device
Dynamic import only when needed; run heavy work in a Web Worker; self-host WASM and data files on your own domain; show progress; support cancel; catch out-of-memory and show a friendly message; say clearly that the file is not uploaded.

## pdf.js (Apache-2.0) — thumbnails and PDF facts
Used for: page thumbnails (split, rotate, delete, reorder, watermark preview) and smart-drop PDF facts (page count, encrypted, text layer sample). Self-host the worker file. Render thumbnails lazily at about 200px width, 3–6 at a time, cancel off-screen renders. If rendering fails, show a plain page-number list.

## OCR PDF (Tesseract.js, Apache-2.0) — runs fully in the browser
Spec details in the backend pack `tools/ocr-pdf.md`. Frontend duties: language picker (default English plus browser-language guess, max 2), first-use download of language data with a size note, per-page progress ("Reading page 3 of 12"), Cancel, page cap 20 and size cap 25 MB, outputs: copy text, download .txt, download searchable PDF only if the chosen library version supports it (verify before promising it in the UI). Warn about slow phones. Password-protected PDFs: ask for the password in the page. Confirm in tests that no file bytes appear in network traffic.

## HEIC fallback
If the server cannot convert HEIC (pillow-heif untested on the host), the frontend uses an in-browser HEIC converter library (check its licence) and flips the tool to `runsOn: browser` in the config. Same privacy line as OCR.

## Wrong-file and drop helpers
File-kind detection, byte sniffing (first 16 bytes), duplicate detection, size and count validation all run in the browser (see 05).
