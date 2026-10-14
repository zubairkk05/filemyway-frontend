# 02 — Design System: Light theme, Orange accent

Principles: calm, big, obvious. One main action per screen. Readable by a 5-year-old and a 70-year-old. Looks hand-designed: generous space, strong typography, no gradient washes, no glass effects, no stock icon soup.

## Color tokens
| Token | Value | Use |
|---|---|---|
| ground | #F4F3EF | page background |
| surface | #FFFFFF | cards, drop box, panels |
| ink | #141414 | text, borders, icons |
| muted | #4A4A45 | secondary text |
| line | #CFCFC8 | hairlines, dividers |
| orange (accent) | #FF4B14 | main buttons, progress fill, logo dot, key highlights |
| orange-hover | #FF6B3D | button hover |
| orange-press | #E63E08 | button pressed |
| orange-text | #B93408 | orange used for SMALL text or links on light backgrounds |
| highlight | #FFD84D | headline marker, hover/focus fill, drag-over |
| success | #0F7B3F | done states (white text) |
| error | #B3261E | errors |
| disabled bg / text / border | #E4E3DD / #6A6A64 / #B9B8B0 | inactive controls |
Rules: dark text ON orange fills; orange NEVER used for small body text (use orange-text); verify every pair with a contrast checker for WCAG AA (4.5:1 normal text, 3:1 large text). Orange appears in a few places per screen only, so it keeps its power.

## Typography
- Body/UI: Atkinson Hyperlegible 400/700, self-hosted, `font-display: swap`.
- Headings/wordmark: Bricolage Grotesque 800, tracking -0.03em, line-height 1.05.
- Sizes: body 20px/1.5; helper text 18px minimum; button text 24–30px; H1 clamp(40px, 6–7vw, 84px); H2 32px. Nothing below 16px.

## Shape and spacing
Radius 12px (controls, cards), 24px (drop box), full circle for step numbers and arrow buttons. Borders 2px ink (drop box 3px dashed). Spacing scale 4/8/12/16/24/32/48/72. Container max 1120px, side padding 28px (16px on small phones). Touch targets ≥ 48px, primary buttons ≥ 76px high.

## Motion
Subtle only: 150ms colour transitions, drop-box highlight, progress bar width. Respect `prefers-reduced-motion` (no movement, instant state change). No auto-playing animation.

## Wordmark
`filemyway` in Bricolage 800, lowercase, with an orange dot. Favicon: orange dot on ink square, plus the 192/512 PWA icons and Apple touch icon.

## Look of key components
See `08-component-library-spec.md`. Reference mockups: the "easy to use" artboards in the FileMyWay UI sketch (home, drop box, file chosen, converting, ready). Where the mockups use PDF to Word as a sample tool, build the same layout with a live tool.

## Dark theme
Not in v1. Keep all colours as tokens so it can be added later with no component rewrites.
