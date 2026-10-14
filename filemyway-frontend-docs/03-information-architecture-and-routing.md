# 03 — Information Architecture and Routing

## URLs (clean, root level, no trailing slash)
- `/` home with the smart drop box
- `/<tool-slug>` one page per live/beta tool (list in `14-per-tool-ui-matrix.md`), e.g. `/merge-pdf`, `/pdf-to-jpg`, `/png-to-jpg`
- Static: `/about`, `/contact`, `/help`, `/privacy-policy`, `/terms`
- Blog skeleton: `/blog`, `/blog/<slug>` (content later)
- Hidden tools (not built yet) → real 404. Never a placeholder page.

## Navigation
Header: wordmark (home link) and a "Need help?" link to `/help`. No dropdowns, no tabs. Finding tools = the smart drop box and the three groups on the home page. On tool pages: a large "← Back to all tools" link above the H1.
Footer: all live/beta tools in three groups, then About, Help, Contact, Privacy, Terms.

## Groups (home page and footer), plain wording
1. Change a PDF into something else: PDF into JPG, PDF into PNG, PDF into Text, PDF into Excel (beta), PDF into PowerPoint (beta), Read a scanned PDF (beta)
2. Make a PDF: Pictures into PDF, Excel or CSV into PDF (beta)
3. Fix up a PDF: Join, Cut apart, Make smaller, Turn pages, Remove pages, Change page order, Add page numbers, Add watermark, Lock with password, Unlock
4. Pictures: Change picture type (PNG, JPG, WEBP), iPhone photo (HEIC) into JPG (beta)
Group membership and labels live in the tools config, not in components.

## Page types and what each needs
| Page | Rendering | Main content |
|---|---|---|
| Home | static | H1, smart drop box, groups, trust strip, FAQ |
| Tool | static (widget is client) | H1 (keyword), widget, steps, long copy, FAQ, related tools |
| Static pages | static | text |
| 404 | static | friendly message + the smart drop box + popular tools |

## Redirects
http→https, www→apex (301). Old or mistyped tool URLs can be mapped in the config (`aliases`), 301 to the right slug.

## Deep link with a pre-selected action
Arriving on `/<tool>` shows that tool's own drop box. Arriving on `/` and choosing an action navigates client-side to `/<tool>` with the files kept in memory (see 05).
