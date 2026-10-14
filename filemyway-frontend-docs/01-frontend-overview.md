# 01 — Frontend Overview

## Stack
Next.js (App Router) + TypeScript + Tailwind CSS. React Server Components by default; client components only where interaction is needed (drop box, tool widget, thumbnails). No UI kit libraries. Icons: a small inline SVG set (upload, file, check, arrow, close, lock, help).

## Rendering and hosting
All page content comes from the tools config, so every page can be pre-rendered at build time.
- **Option A (recommended): Vercel or Cloudflare Pages.** Full Next.js features, CDN, image optimisation.
- **Option B (your cPanel): static export** (`output: export`) uploaded to `public_html`. Works because pages are static and all conversion calls go to `api.filemyway.com`. Consequences to handle: no built-in image optimisation (pre-size images, use SVG/WebP assets); no middleware (do http→https and www→apex redirects, trailing-slash rules and security headers in `.htaccess`); OG images and sitemap are generated at build time; a custom 404 page must be placed as `404.html`; unknown URLs must return a real 404 status (configure `ErrorDocument 404`). Pick one option before starting and keep the rest of the docs identical.

## Environment variables
`NEXT_PUBLIC_API_BASE` (e.g. https://api.filemyway.com/api/v1), `NEXT_PUBLIC_SITE_URL` (https://filemyway.com), optional analytics id. No secrets in the frontend.

## Folder plan (names only)
- `app/` routes: home, `[tool]` page, static pages (about, contact, privacy-policy, terms, help, blog)
- `config/tools.config` (single source of truth), `config/copy` (plain-language strings)
- `components/` ui (Button, DropBox, StepCard, ProgressBar, Banner, ActionRow, Accordion), tool (ToolWidget, FileCard, OptionsPanel, ThumbGrid), layout (Header, Footer, Breadcrumb)
- `lib/` api client, file-kind detection, smart-suggest engine, pdf facts (dynamic), format helpers
- `state/` pending-files store, tool-session state machine
- `public/` fonts (self-hosted), favicon set, OG assets, pdf.js worker, Tesseract.js assets (only when OCR is built)

## Targets
Mobile first. LCP < 2.5 s, CLS < 0.1, INP < 200 ms. First-load JS under 120 KB gzip on tool pages (pdf.js, Tesseract.js and thumbnails load only when needed). Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.

## What the frontend never does
Never stores files; never sends a file before the user presses the orange button; never shows hidden tools; never shows technical error codes; never blocks the page on third-party scripts.
