# 14 — Per-Tool UI Matrix

Only live/beta tools. SEO text (title, meta, H1, FAQ, steps, outline) is in the backend pack `tools/<slug>.md`; this table fixes the plain labels, groups, accepted input and option controls. Backend options are defined in the same tool docs; build the OptionsPanel from the config schema.

Hidden until Phase 2 (do NOT build pages): word-to-pdf, ppt-to-pdf, pdf-to-word.

| Slug | Plain label | Group | Accepts | Options UI | Orange button | Notes |
|---|---|---|---|---|---|---|
| merge-pdf | Join PDFs together | Fix up a PDF | pdf x2–20 | Sortable file list (drag + move buttons), page counts if known | Join PDFs | — |
| split-pdf | Cut a PDF apart | Fix up a PDF | pdf x1 | Tabs: By range / Every N pages / Pick pages (ThumbGrid); live count 'This will make 4 files' | Cut the PDF | — |
| compress-pdf | Make a PDF smaller | Fix up a PDF | pdf x1 | Three level cards (Less / Recommended / Smallest); result shows before, after, percent saved; 'already small' message | Make smaller | Never promise percentages |
| rotate-pdf | Turn PDF pages | Fix up a PDF | pdf x1 | ThumbGrid with rotate left/right per page + 'Turn all' | Save turned pages | — |
| delete-pdf-pages | Remove pages from a PDF | Fix up a PDF | pdf x1 | ThumbGrid, click to mark for removal, counter 'Removing 3 of 12' | Remove pages | Block removing all pages |
| reorder-pdf-pages | Change the order of pages | Fix up a PDF | pdf x1 | ThumbGrid drag reorder, 'Reverse order' button, move buttons | Save new order | — |
| add-page-numbers | Add page numbers | Fix up a PDF | pdf x1 | Position picker (6 spots diagram), format select, start number, skip first page | Add numbers | — |
| watermark-pdf | Put a watermark on a PDF | Fix up a PDF | pdf x1 | Text input, size, see-through slider, angle, colour presets; live preview on sample page | Add watermark | — |
| protect-pdf | Lock a PDF with a password | Fix up a PDF | pdf x1 | Password + confirm, show/hide, strong warning 'If you forget it, we cannot recover your file' | Lock the PDF | Reject already-locked PDFs with link to Unlock |
| unlock-pdf | Unlock a PDF | Fix up a PDF | pdf x1 | Password field (only if asked), required checkbox 'I own this file or have permission' | Unlock the PDF | No password guessing |
| pdf-to-jpg | PDF into pictures (JPG) | Change a PDF into something else | pdf x1 | Quality radio (Small / Good / Best), pages (All or range) | Change to JPG | Single page returns one picture, many pages a ZIP |
| pdf-to-png | PDF into pictures (PNG) | Change a PDF into something else | pdf x1 | Quality radio, pages, 'see-through background' toggle | Change to PNG | PNG files are bigger; say so |
| pdf-to-text | Copy the text out of a PDF | Change a PDF into something else | pdf x1 | Page-break marker toggle; text preview with Copy button | Get the text | Scans: link to Read a scanned PDF |
| pdf-to-excel | PDF into Excel | Change a PDF into something else | pdf x1 | Layout choice: one sheet per page / all tables on one sheet | Change to Excel | BETA note; scans not supported |
| pdf-to-ppt | PDF into PowerPoint | Change a PDF into something else | pdf x1 | Quality radio only | Change to PowerPoint | BETA note; slides are pictures |
| ocr-pdf | Read a scanned PDF | Change a PDF into something else | pdf/jpg/png x1 | Language picker, output choice; per-page progress; Cancel | Read the words | BETA; runs in browser, nothing uploaded; page cap 20 |
| jpg-to-pdf | Pictures into PDF | Make a PDF | image x1–50 | Thumbnail grid with drag reorder, rotate per picture, page size (A4/Letter/Fit), margin (none/small/big) | Make the PDF | Pictures only (HEIC via its own tool) |
| excel-to-pdf | Excel or CSV into PDF | Make a PDF | excel x1 | Orientation (Auto/Tall/Wide), fit to page width toggle, sheets (All/First) | Make the PDF | BETA note; charts and pictures not included |
| image-converter (png-to-jpg, jpg-to-png, webp-to-jpg, webp-to-png, jpg-to-webp) | Change picture type | Pictures | image x1–20 | Output format preselected by the landing page; quality slider (JPG/WEBP); background colour for see-through pictures | Change picture type | Five landing pages, each with unique copy; same widget |
| heic-to-jpg | iPhone photo (HEIC) into JPG | Pictures | heic x1–20 | Quality radio | Change to JPG | BETA until host test; may run in browser |

## Common to all tools
Template from 07; beta tools show their beta note; result screen shows related tools; pending files from smart drop load automatically; wrong-file banner per 05 section 8; limits line under the drop box read from `/tools`.

## Related tools rule
Each tool page shows 4–6 related live/beta tools from its backend doc, skipping hidden ones.
