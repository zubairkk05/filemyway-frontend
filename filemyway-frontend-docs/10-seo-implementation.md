# 10 — SEO Implementation (frontend side)

Full strategy is in the backend pack `04-seo-strategy.md`. This file lists what the frontend must implement.

1. Pre-rendered HTML for every page with H1, how-it-works, long copy, FAQ and related links present without JavaScript.
2. Metadata per page from the config: title (≤ 60 chars, keyword first, ends with " | FileMyWay"), description (120–160 chars), canonical (absolute, no trailing slash), Open Graph and Twitter tags, `robots` index/follow. Beta pages are indexable.
3. JSON-LD generated from config: home (WebSite, Organization, ItemList); tools (SoftwareApplication with price 0, BreadcrumbList, FAQPage, HowTo). Schema text must match visible text exactly. No fake ratings.
4. `sitemap.xml` and `robots.txt` generated from the config (live + beta + static pages only; lastmod = build date or content date). robots disallows `/api/` (if present) and nothing else.
5. OG image per tool generated at build time (tool name + "Free · No sign-up" on the light/orange style); one default for static pages.
6. One H1 per page; H2 for steps, features, FAQ, related. Image alt text meaningful; decorative SVG `aria-hidden`.
7. Internal links: related tools (4–6 live/beta only), footer with all tools, breadcrumbs. Anchor text is the descriptive tool name.
8. Visible keyword wording: URL, `<title>` and H1 keep the keyword phrase ("PDF to JPG Converter"); the plain label ("PDF into pictures (JPG)") is used on buttons and the home groups, with the keyword name in `title`/`aria-label` of the link.
9. 404 page returns a real 404; hidden tool URLs return 404 and are absent from sitemap, nav and schema.
10. Redirect rules (http→https, www→apex, aliases) implemented at host level or `.htaccess` for static hosting.
11. Performance for SEO: fonts self-hosted with swap, no render-blocking third-party scripts, reserved heights for widget and ad slot (no layout shift), lazy-load below-the-fold JS.
12. Pre-launch checks: all pages 200 with SSR HTML, no duplicate titles/descriptions, schema validates in Google's Rich Results Test, sitemap valid, Lighthouse SEO 100, canonical and redirects verified.
