# 07 — Tool Page Template Spec

Every tool page uses this template. Tool-specific parts (options, labels, notes) come from the config and `14-per-tool-ui-matrix.md`.

## Page structure
1. Header
2. "← Back to all tools" (large link) and breadcrumb (Home › Tool name) with BreadcrumbList schema
3. H1 (keyword form from SEO block) and a one-sentence subtitle
4. Beta note (only for beta tools): a quiet banner with the tool's `betaNote`
5. Tool widget (three step cards, below)
6. Ad slot placeholder (empty fixed-height container; disabled in v1)
7. "How it works" (3 numbered lines, visible text, matches HowTo schema)
8. Long-form unique content (500–800 words from the backend pack outline)
9. FAQ accordion (matches FAQPage schema; native details/summary or accessible accordion)
10. Related tools (4–6 big action rows, live/beta only)
11. Footer

## Widget: three step cards (single column, max-width 760px)
Step cards are ALWAYS visible so people know what comes next. Only the current one is active; others are greyed.
- **Step 1: "Choose your file(s)"** — the drop box. States below.
- **Step 2: "Press the orange button"** — options (if the tool has any) and the big orange button with the tool's `actionLabel`. Disabled until step 1 is valid.
- **Step 3: "Download your file"** — greyed until done.

## States (state machine: idle → fileChosen → uploading → processing → done | error)
| State | What the visitor sees |
|---|---|
| idle | big drop box ("Drop your PDF here", "or", orange "Choose a file", limits line "PDF files up to 50 MB"); steps 2–3 greyed |
| dragOver | box turns yellow, thicker border, text "Let go to upload"; the whole box accepts the drop |
| fileChosen | step 1 shows green check + file card(s) (name, size, pages if known, Remove / Choose a different file); step 2 active with options |
| uploading | step 2 shows real upload percent bar and "Sending your file…" with Cancel |
| processing | progress bar from job progress, big percent, "Working on it… usually under a minute", "Please keep this page open", link "Stop and start again" |
| done | green banner "Your file is ready", file name and size, GIANT orange download button (≥ 92px), "Change another file", "Delete my file now", then "What else would you like to do?" with 2 related big rows. Savings line for Compress (before → after, percent saved) |
| error | friendly message with what to do next (see 12), "Try again" keeps files and options; password fields where needed |
Focus moves to the Download button when done, to the error message when failing, and to the question heading in smart drop.

## Behaviour rules
- Pre-validate files in the browser (kind, size, count) against `/tools` limits; the server remains the authority.
- Polling: every 1 s, easing to 3 s after 15 s; stops on unmount; after 5 minutes show "This is taking longer than usual" with options to keep waiting or start again.
- Cancel during upload aborts the request; cancel during processing calls DELETE on the job.
- Download uses a normal link with the signed token (no popups). The result stays available until `expiresAt`; show a plain countdown ("Ready for another 58 minutes").
- Several outputs arrive as one ZIP; say so on the button ("Download ZIP of pictures").
- Network drop: show "Your connection dropped. We will keep trying." and retry polling; do not lose the file list.
- Pending files from smart drop (05) load automatically on arrival.
- Page-selection tools (split, rotate, delete, reorder) show thumbnails rendered in the browser (13). Thumbnails lazy-load; fall back to a number list if rendering fails.
- Beta tools: the result screen repeats the limitation in one line ("Slides are pictures, text is not editable").

## Layout on phones
One column; sticky bottom bar with the current primary button (Choose / Convert / Download) when the main button is off-screen; drop box min-height 260px; big tap targets.

## Acceptance
- All states reachable and testable (mock the API).
- Never any technical codes or stack traces in the UI.
- After "Change another file", the widget returns to idle with state fully reset.
- Axe reports no serious issues; keyboard-only run completes a conversion.
