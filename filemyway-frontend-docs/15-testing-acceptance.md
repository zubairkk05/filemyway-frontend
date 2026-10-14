# 15 — Testing and Acceptance

## Fixtures (shared)
PDF with text (1 and 40 pages), scanned PDF, encrypted PDF, corrupt PDF, 0-byte file, 3 JPGs, PNG with transparency, WEBP, HEIC, CSV (UTF-8), XLSX, DOCX, PPTX, ZIP, a folder, mixed bundle (2 PDFs + 3 JPGs), 60 MB file, 25 files.

## Test layers
1. **Unit**: file-kind detection (extension vs bytes), suggest engine (matrix and rules from 05), config validation, copy lookup, size/count validators.
2. **Component**: DropBox states, ActionRow, StepCard, ProgressBar, Banner, OptionsPanel from schema.
3. **Integration (mock API)**: every tool through idle → done and each error code; cancel; start over; network drop; 429.
4. **Smart drop**: the 12 acceptance cases in `05-smart-drop-spec.md`; assert no network request carries file bytes before the orange button; files persist across client navigation; hard refresh shows a normal empty drop box.
5. **E2E (Playwright)**: Chromium and WebKit (mobile viewport): home → drop PDF → choose action → tool page loaded → convert → download (against staging API) for at least merge, compress, pdf-to-jpg, jpg-to-pdf.
6. **Hidden tools**: assert 404 and absence from sitemap, nav, footer, home, suggestions, schema, related lists.
7. **SEO**: automated checks per page (title ≤ 60, description 120–160, one H1, canonical, JSON-LD valid, schema text equals visible text, sitemap complete).
8. **Accessibility**: axe on all page types and states; keyboard-only run; screen-reader smoke test; 200% zoom.
9. **Performance**: Lighthouse CI on home and 3 tool pages (budgets from 01 and 11).
10. **Visual**: screenshot comparison against the approved mockups for home, drop box, file chosen, converting, ready (desktop and phone).
11. **Usability**: one child-level reader and one older adult complete a conversion unaided.

## Release gates
All tests green; Lighthouse budgets met; no console errors; contrast verified for every token pair; privacy statements match behaviour; legal pages live.
