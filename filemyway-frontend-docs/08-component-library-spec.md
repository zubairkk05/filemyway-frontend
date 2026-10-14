# 08 — Component Library Spec (look and behaviour)

All components use tokens from 02. Every interactive component has hover, focus-visible (3px ink outline, 3px offset), active, disabled, and loading states.

| Component | Spec |
|---|---|
| Button (primary / orange) | orange fill, ink text 24–30px bold, 2px ink border, radius 12px, height ≥ 76px (Download 92px); hover orange-hover, pressed orange-press; disabled uses disabled tokens and an explanation line; loading shows text change, not just a spinner |
| Button (secondary) | transparent, 2px ink border, ink text |
| Link | ink, underlined, 5px offset; orange-text only for emphasis links |
| DropBox | white, 3px dashed ink border, radius 24px, min-height 340px (260px mobile), centered 84px upload icon, headline, "or", orange Choose button, helper line; states: idle, dragOver (highlight fill #FFF3BF or highlight color, thicker border), error (error border + message), disabled; entire box is a button (Enter/Space opens picker) and a drop target; hidden file input is labelled "Choose a file to upload" |
| ActionRow | white card, 2px ink border, radius 12px, min-height 92px; title 24px bold, one-line description 18px muted, 48px circular arrow (ink; orange on hover); hover and focus use highlight fill; optional tags: "Best match" (orange), "Beta" (outline) |
| StepCard | numbered circle 44px (ink; green with check when done; grey when locked), title 26px bold, content area; locked state greyed and non-interactive |
| FileCard | name (bold, truncate middle), size, pages, kind chip, Remove button (secondary), optional thumbnail |
| ProgressBar | 30px tall, 2px ink border, orange fill, `role=progressbar` with aria-valuenow, big percent text, aria-live polite updates at most every 2 seconds |
| Banner | full-width block: info (white + ink border), success (green fill, white text), warning (yellow fill, ink text), error (error border/fill); optional action button |
| ThumbGrid | responsive grid of page thumbnails with page numbers; supports select, delete mark, rotate buttons, drag reorder with keyboard alternative (move left/right buttons) |
| OptionsPanel | renders controls from the config options schema: radio cards, segmented toggle, select, number, text, pages-range input with live validation, password with show/hide; each has a visible label and helper line |
| PasswordField | show/hide toggle, confirm field when setting a password, clear forgot-password warning |
| Accordion (FAQ) | big tap target header, plus/minus icon, one or many open, keyboard accessible |
| Header / Footer | per 03 |
| Toast | avoided; use inline banners (toasts disappear and are bad for accessibility) |

## Icon set
upload, file, check, arrow-right, arrow-left, close, lock, unlock, help, download, trash, rotate-left, rotate-right, drag-handle. Inline SVG, 2px stroke, ink colour.

## Content rules inside components
Sentences under about 12 words; buttons are verbs; no jargon; no technical codes. Texts live in `config/copy` (12).
