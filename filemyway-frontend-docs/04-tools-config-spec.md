# 04 — Tools Config Spec (single source of truth)

One typed config array. Home page, footer, smart-drop suggestions, tool pages, metadata, JSON-LD and sitemap ALL read from it. Never hardcode tool names, labels or lists elsewhere. Adding a tool = one entry here (plus its backend module).

## Fields per tool
| Field | Meaning |
|---|---|
| slug | URL and API tool name (e.g. `merge-pdf`; image converter uses one API tool with several landing slugs) |
| status | `live` / `beta` / `hidden` (hidden = no page, no links, no suggestions) |
| runsOn | `server` or `browser` |
| group | one of the 4 groups in 03 |
| plainLabel | what the visitor sees on buttons, e.g. "Join PDFs together" |
| seo | title, metaDescription, h1, subtitle, keywords, howToSteps (3), faq (list), longCopy (reference to content), related (slugs) |
| accepts | list of FileKinds and extensions (see 05), min/max files, whether multiple files are allowed |
| limits | maxFileMB, maxTotalMB, maxFiles, maxPages (read from `GET /tools`, config values are fallback) |
| options | schema for the options panel: id, type (radio, select, toggle, text, number, pages-range, password, page-picker), label, helper text, default, validation |
| suggestRules | when and how high this tool is suggested after a drop (see 05) |
| betaNote | plain sentence shown on beta tool pages and suggestion cards |
| actionLabel | verb on the orange button, e.g. "Join PDFs", "Make smaller", "Change to JPG" |
| resultLabel | text for step 3, e.g. "Download your PDF" |
| aliases | other URLs that redirect here |

## Rules
- `GET /tools` from the API is authoritative for `status` and limits at run time; the build-time config provides copy and SEO. If they disagree (a tool is hidden by the API), hide it at run time too.
- A hidden tool must disappear from: sitemap, footer, home groups, suggestions, schema ItemList, related lists.
- A config validation step runs at build time and fails the build if: a live tool lacks SEO fields, a title exceeds 60 chars, a meta description is outside 120–160 chars, or a related slug does not exist or is hidden.
- SEO copy per tool is taken from the backend pack `tools/<slug>.md` (title, meta, H1, steps, FAQ, outline). Do not rewrite it differently here.
