# 16 — Instructions for the AI Coding Agent (Frontend)

## Master prompt (paste first in every session)
"You are building the FileMyWay frontend (filemyway.com) with Next.js App Router, TypeScript and Tailwind. Follow the attached documents exactly: light theme with orange accent (02), single tools config (04), smart drop (05), tool page template (07). Do not invent features, labels, routes or colours not in the docs. Hidden tools must not exist on the site. Never upload a file before the user presses the orange button. Keep all tool data and copy in config files, not in components. Write typed, accessible, tested code. When something is ambiguous choose the simplest option and list your assumption at the end. After each task, list files created, how to run tests, and which acceptance criteria are met or not."

## Build order (one task per session; attach 01, 02 and the named docs)
1. **Foundation**: project setup, Tailwind tokens from 02, fonts, layout (Header, Footer), 404, static pages shells, env handling, hosting choice from 01.
2. **Config**: tools config schema and entries for all live/beta tools (04, 14), build-time validation, mock `/tools`, copy strings (12).
3. **Components**: build 08 with all states, plus a simple internal page listing every component state for review.
4. **Tool widget**: state machine and template (07, 09), API client with progress, polling, cancel, errors, mock mode.
5. **Smart drop**: file-kind detection, PDF facts (pdf.js dynamic), suggest engine from the config, suggestion panel, Pending Files store, wrong-file banner (05, 13).
6. **Home page** (06) and **tool pages** (07 + 14): routing for live/beta slugs, hidden slugs 404.
7. **Page-selection tools UI**: ThumbGrid with pdf.js for split, rotate, delete, reorder, watermark preview.
8. **Browser OCR** (13) and the HEIC fallback if needed.
9. **SEO layer** (10): metadata, JSON-LD, sitemap, robots, OG images, redirects.
10. **Accessibility and performance pass** (11).
11. **Tests** (15) and fixes.
12. **Deploy**: Option A or B from 01 with staging first.

## Rules of engagement
- Use the backend pack for tool behaviour, options and SEO copy; this pack for everything visual.
- One tool page template; no per-tool one-off layouts.
- Do not add libraries beyond: Next.js, React, Tailwind, a small drag-sort helper, pdf.js, Tesseract.js (only when OCR is built). Justify any other.
- No tracking scripts, ads scripts or third-party fonts unless instructed.
- Keep the code understandable for a non-expert owner: clear folder names, short comments on non-obvious logic.

## Definition of done per task
Compiles, lints, tests pass, acceptance criteria in the referenced docs are listed and checked in the final message.
