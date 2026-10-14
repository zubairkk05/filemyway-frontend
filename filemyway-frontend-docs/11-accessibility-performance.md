# 11 — Accessibility and Performance

## Accessibility (hard requirements)
- WCAG 2.2 AA minimum; contrast checked for every token pair (orange only as fill with ink text, or orange-text for small text).
- Everything usable by keyboard; visible focus ring on all controls; logical tab order; skip link to main content.
- Drop box is a real button/label with accessible name; drag and drop is never the only way.
- Live regions announce: files added, suggestions ready, progress (throttled), done, errors.
- Focus management: after analysis → question heading; after done → Download button; after error → error message.
- No information by colour alone (status also has text/icon); no hover-only information.
- Touch targets ≥ 48px; text resizable to 200% without breaking layout; line length ≤ 75 characters in long copy.
- `prefers-reduced-motion` respected; no flashing; no timeouts except stated file expiry.
- Language attribute set; headings in order; forms with labels and error text linked via aria-describedby.
- Test with keyboard only, a screen reader (NVDA or VoiceOver) and browser zoom 200%.

## Readability for ages 5 to 70+
Plain words, short sentences, big type, one primary action per screen, clear "what happens next". Test with at least one child (or child-level reading check) and one older adult before launch.

## Performance budget
LCP < 2.5 s, CLS < 0.1, INP < 200 ms on mid-range mobile 4G. First-load JS < 120 KB gzip on tool pages. Dynamic imports for pdf.js, thumbnail grid, Tesseract.js. Self-hosted fonts (preload the two used weights). No layout shift: reserve drop box, widget and ad heights. Use the platform file input; avoid heavy drag-and-drop libraries (native events are enough; sortable lists may use one small library).
