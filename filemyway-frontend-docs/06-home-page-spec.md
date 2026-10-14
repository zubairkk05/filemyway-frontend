# 06 — Home Page Spec (`/`)

## SEO block
- Title: Free Online PDF Tools – Merge, Split, Compress & Convert | FileMyWay
- Meta description: Free online PDF and image tools. Merge, split, compress, rotate and convert files in seconds. No sign-up, files deleted automatically.
- H1 (visible): "What would you like to do?"  — keep a keyword-rich sentence directly under it ("Free online PDF and image tools. No sign-up.") so the page still states its topic in the first screen.
- Canonical: https://filemyway.com
- Schema: WebSite, Organization, ItemList of live/beta tools (generated from config).

## Layout (top to bottom)
1. Header (wordmark, Need help?).
2. Hero: H1 with yellow marker on the last words, one reassuring line ("Drop a file below, or pick a tool. It is free. No sign-up.").
3. Smart drop box (see 05): min height 340px (260px mobile), dashed 3px border, 84px upload icon, "Drop a file here", orange button "Choose a file", helper "PDF, pictures, Excel or CSV files". The whole home window is a drop target.
4. Suggestion panel appears in place under the drop box after a drop (the page does not jump to another URL until an action is chosen). Scroll it into view smoothly (instant if reduced motion).
5. "Or pick what you want to do": groups from 03, each a numbered heading with a one-line explanation, then big action rows (2 columns on desktop, 1 on phones).
6. Trust strip (ink background, white text): "It is free." / "Your file is erased after 1 hour." / "We never read your files." (state values from config/env; keep true).
7. Short FAQ (6 questions: free?, safe?, how long are files kept?, what file types?, why can't I do Word?, phone?) with FAQPage schema. The Word answer is honest: "Word and PowerPoint conversions are not available yet."
8. Footer.

## Behaviour
- Server-rendered HTML contains the H1, all group links and FAQ; the drop box enhances with JS. Without JS the group links still work.
- Group rows are plain anchors to `/<slug>` (crawlable). The label is the plain label; the anchor `title` attribute and `aria-label` include the keyword name.
- After a drop, show a "Start over" link and keep the group list below.

## Acceptance
- All live/beta tool links present in HTML; none for hidden tools.
- Lighthouse SEO 100, LCP < 2.5 s on mobile.
- Works with keyboard only; drop box reachable as the first interactive element after the header.
