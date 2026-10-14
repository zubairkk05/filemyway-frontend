# 05 — Smart Drop Spec (the core feature)

Goal: the visitor drops or picks ANY file (or several). We recognise it ON THEIR DEVICE, say what it is in plain words, and show the conversions that fit, best choice first. They pick one, land on that tool with their file already loaded, and press the orange button. Nothing is uploaded before that button.

## 1. Where it appears
- Home page: the big drop box under the H1. Also a full-window drop overlay: dragging a file anywhere over the home page highlights the whole page ("Drop to start").
- 404 page: same smart drop box.
- Tool pages: the tool's own drop box, which also runs a SMALL version of detection (see 8, wrong file type).
- Paste support: Ctrl/Cmd+V pastes an image or file on home and tool pages.
- Mobile: the "Choose a file" button opens the system picker. The accept list is built from the config (live/beta tools only).

## 2. FileKinds
| Kind | Extensions | Notes |
|---|---|---|
| pdf | .pdf | |
| image | .jpg .jpeg .png .webp | |
| heic | .heic .heif | iPhone photos |
| excel | .xlsx .csv (also .xls .ods are recognised but may be unsupported, see 7) | |
| word | .doc .docx .odt .rtf | recognised so we can answer honestly |
| powerpoint | .ppt .pptx .odp | recognised so we can answer honestly |
| unknown | anything else (zip, video, exe, folders) | |
Detection order: (1) extension, (2) MIME type, (3) first bytes read with `file.slice(0, 16)`: `%PDF-`, JPEG FFD8FF, PNG 89504E47, RIFF....WEBP, HEIC `ftyp` brand, ZIP `PK` (OOXML), OLE D0CF11E0 (legacy Office). If extension and bytes disagree, trust the bytes and say so ("This file is named .pdf but looks like a picture"). The server validates again; the client check is only for guidance.

## 3. Flow (state machine)
`empty → filesReceived → analysing → suggesting → (actionChosen → navigate to tool page with files loaded)`; errors can occur at any step.
1. **filesReceived**: show file cards immediately (name, size, kind icon). Reject folders, 0-byte and over-limit files with plain messages (12).
2. **analysing** (usually under a second): kind detection; for a single PDF, lazy-load pdf.js and read FACTS (see 4). If pdf.js fails or takes longer than 2 s, skip facts and use generic ranking. Show a small "Looking at your file…" with the file card, never a blocking spinner page.
3. **suggesting**: show the question "What do you want to do with this file?" with up to 3 BIG highlighted actions ("Most likely") and a "More things you can do" list below (all other applicable live/beta actions). Each action row: plain label, one line why, orange arrow. Beta actions carry a small "Beta" tag and the beta note.
4. **actionChosen**: store the File objects in the in-memory Pending Files store, client-side navigate to `/<slug>`. The tool page finds pending files, validates them against that tool, and jumps straight to "file chosen" (step 1 done, step 2 active). The URL changes so the page is shareable and crawlable.
5. "Choose different file" and "Start over" are always visible during 1–3.

## 4. PDF facts (single PDF, read on device with pdf.js, dynamic import)
pageCount, isEncrypted (password needed to open), hasTextLayer (sample text from first 3 pages: nearly empty = scan), fileSizeMB. Never read more than the first 3 pages for detection. If encrypted: do not ask for a password in smart drop; just rank Unlock first.

## 5. Suggestion matrix (what shows, in what order)
Only tools with status live/beta appear. "Top 3" = first three that apply after rules; the rest go under "More".
**Single PDF** (default order after rules): Make smaller, Cut apart, PDF into JPG, Turn pages, Remove pages, Change page order, Add page numbers, Add watermark, Lock with password, PDF into PNG, PDF into Text, PDF into Excel (beta), PDF into PowerPoint (beta), Read a scanned PDF (beta). Rules that reorder:
- Encrypted PDF: Unlock first; hide others except Unlock until unlocked ("This PDF is locked. Unlock it first, then you can do more.").
- No text layer (scan): Read a scanned PDF first, then Make smaller, PDF into JPG; hide PDF into Text and PDF into Excel (they need real text).
- Has text layer: PDF into Text and PDF into Excel are promoted into top 5; Read a scanned PDF is hidden.
- File larger than 10 MB: Make smaller first.
- pageCount = 1: hide Cut apart, Change page order, Remove pages, Join.
- pageCount > 30: promote Cut apart and Remove pages.
**Several PDFs (2–20)**: Join PDFs together first, then offer to work on one file at a time ("Pick one file to work on").
**One or more images (jpg, png, webp)**: Pictures into PDF first; then Change picture type (offer only the OTHER formats, e.g. for a PNG offer JPG and WEBP); show "Join into one PDF" wording when several images.
**HEIC/HEIF**: iPhone photo (HEIC) into JPG first (beta until tested); then Pictures into PDF only if HEIC to JPG is live (explain: convert first).
**Excel or CSV (.xlsx, .csv)**: Excel or CSV into PDF (beta, basic) with a visible note that charts and pictures are not included. (.xls/.ods: treated as unsupported unless the backend accepts them.)
**Word and PowerPoint**: these conversions are hidden for now, so say it honestly: "We can't change Word/PowerPoint files yet." and show nothing to click except "See what we can do" (opens the three groups). Do NOT promise a date, do NOT collect emails in v1. When those tools go live, the matrix extends automatically through `suggestRules` in the config.
**Mixed kinds** (e.g. 2 PDFs and 3 images): group by kind with a simple choice: "You added different kinds of files. Which ones do you want to work with?" Buttons per group with counts; the other files are set aside (visible, removable) and can be handled afterwards.
**Unknown**: friendly message with the list of file types we accept (12).
All labels come from `plainLabel` in the config; the matrix is data in the config (`suggestRules`), not hardcoded in components.

## 6. Layout of the suggestion panel
- File card(s) at top (up to 3 cards visible, "+2 more" summary beyond).
- Question line (28–32px).
- Top 1–3 actions: large rows (≥ 92px high), first one visually emphasised (orange arrow circle and the tag "Best match"), others normal.
- "More things you can do" disclosure (open by default on desktop when ≤ 6 items, closed on phones). Items are plain rows with arrows.
- Reassurance line under everything: "Nothing leaves your device until you press the orange button."

## 7. Pending Files store
In-memory only (module-level store or context; File objects cannot be serialised). Holds the files, the detected kinds and facts. Cleared when: conversion finishes and user leaves the page, "Start over", or 30 minutes idle. A hard refresh loses it; the tool page then shows its normal empty drop box (no error). Never write files to localStorage/IndexedDB.

## 8. Wrong file on a tool page
If the dropped file does not fit the tool (a JPG on the Merge PDF page): keep the page calm, show a Banner: "That looks like a picture, not a PDF. Did you want to turn it into a PDF?" with a big button to the right tool (from the matrix) and a "Choose a PDF instead" link. If it fits another tool well, the same smart suggestions panel can be shown inline. Files that DO fit are kept.

## 9. Multi-file handling rules
Tool declares min/max files (from config). On tool pages, extra files beyond max are refused with a message that says how many are allowed. On home, 21+ files: ask the visitor to pick fewer. Reordering belongs to tools that need it (join, pictures into PDF).

## 10. Privacy and analytics
Detection and PDF facts happen on the device. Analytics events (privacy-friendly, no file names, no content): `drop_received` (kind, count), `suggestion_shown` (top slugs), `action_chosen` (slug, was_top3), `unsupported_kind` (kind). Used to improve rankings of suggestions.

## 11. Edge cases
- Folder dropped: ignore folders, message "Please drop files, not folders."
- Huge file (> max limit from `/tools`): show the limit and offer "Make smaller" only if it is a PDF under the hard cap.
- Duplicate drops: ignore exact duplicates (same name + size + lastModified) with a small notice.
- Drag cancelled/left window: remove highlight immediately.
- Slow devices: detection is chunked and cancellable; UI stays responsive.
- Files renamed with wrong extension: see byte check in 2.
- Zip archives: unsupported in v1 ("We cannot open zip files yet").
- Screen readers: announce "2 files added. 5 things you can do." via live region; focus moves to the question heading after analysis.

## 12. Acceptance criteria
- Dropping 1 PDF with text, 1 scanned PDF, 1 encrypted PDF, 1 JPG, 3 JPGs, 1 HEIC, 1 CSV, 1 DOCX, 1 unknown file, and a folder each produces exactly the suggestions defined above (use the fixture set).
- No network request containing file bytes happens before the orange button is pressed (verify in tests).
- After choosing an action, the tool page opens with the file already loaded and step 2 active, with no second upload prompt.
- Keyboard-only use works end to end; focus is never lost.
- Hidden tools never appear; when a hidden tool's status flips to live, it appears in the right places without code changes.
