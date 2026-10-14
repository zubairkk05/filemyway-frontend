# FileMyWay — Frontend Documentation Pack (Next.js, light theme, orange accent)

Docs only, no code. Written for an AI coding agent. The backend (NestJS + Python worker) has its own pack: `filemyway-docs.zip`. This pack covers everything the visitor sees.

## The big idea
The visitor drops ANY file. The site recognises what it is, explains it in plain words, and shows the conversions that make sense for that file, best choice first. Nothing is uploaded until the visitor presses the orange button. Every tool also has its own SEO page at a clean URL (`/merge-pdf`, `/pdf-to-jpg`, ...).

## Read order
1. `01-frontend-overview.md` — goals, stack, hosting options, folder plan
2. `02-design-system-light-orange.md` — colors, type, components look
3. `03-information-architecture-and-routing.md` — pages, URLs, navigation
4. `04-tools-config-spec.md` — the single config that drives everything
5. `05-smart-drop-spec.md` — THE CORE FEATURE: detect file, suggest conversions
6. `06-home-page-spec.md`
7. `07-tool-page-template-spec.md` — the page every tool shares + all states
8. `08-component-library-spec.md`
9. `09-api-client-and-state.md`
10. `10-seo-implementation.md`
11. `11-accessibility-performance.md`
12. `12-copy-and-error-messages.md` — exact plain-language texts
13. `13-browser-side-tools.md` — OCR, thumbnails, PDF facts
14. `14-per-tool-ui-matrix.md` — options UI and labels for every tool
15. `15-testing-acceptance.md`
16. `16-ai-agent-instructions.md` — master prompt and build order

## Non-negotiables
- Light theme, orange accent, readable for ages 5 to 70+.
- Big drop box everywhere it makes sense; whole box is clickable and accepts drops.
- Only `live` and `beta` tools are shown. Hidden tools do not exist on the site (404).
- Plain wording in the UI, keyword wording in URL/title/H1.
