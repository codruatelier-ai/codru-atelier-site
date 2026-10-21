# Design — Codru Atelier

The look of Codru Atelier's public pages: this site, the client questionnaire (`client-onboarding`) and the
Overseer Board. The source of truth is `client-onboarding/.tastemaker/style-lock.md`. This file is the same
system written for building pages; keep the two in step, and change both together.

**Direction (owner, 2026-10-21):** near-black, one deep red, very large white type, and photos drawn as a
field of light dots that slowly breathe. Taken from the owner's reference boards. Calm, with one dramatic
beat per photo.

## Colour tokens (dark only, `color-scheme: dark`)

| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `--bg` | `#050506` | Page, header | — |
| `--surface` / `--field` | `#0f0f11` / `#141417` | Inputs, notices | — |
| `--glass` | white at 3.5% | Cards and steps, with a 1px lit top edge | — |
| `--edge` / `--edge-hi` | white at 10% / 22% | Dividers (decorative) / outline buttons, tags | — |
| `--text` | `#f2f2f0` | Body text, focus ring | 18.2:1 on bg |
| `--muted` | `#9b9ca3` | Help text, notes, details | 7.5:1 on bg, 6.7:1 on field |
| `--control` | `#6b6c74` | Input borders | 3.5:1 on field |
| `--accent` / `--accent-hi` | `#9b1c1f` / `#b42226` | Primary buttons, logo mark, play button | white 8.1:1 / 6.6:1 |
| `--ember` | `#ef5348` | Links, numbers on the promises, the current-page underline | 5.8:1 on bg |
| `--good` / `--warn` / `--error` | `#6fd3a8` / `#f3c46b` / `#ff8f85` | Status, always with words | ≥7:1 on bg |

Proportions: about 60% near-black, 30% glass and greys, 10% red. Red marks actions and the one glow
behind a call-to-action card; it is never decoration on text.

## Type

- **Geist 600** for headings and the wordmark only. Self-hosted (`site/assets/fonts/geist-600.woff2` here,
  `public/fonts/` in the questionnaire, OFL licence beside it) and preloaded. No Google Fonts.
- **System fonts** for everything else.
- Headlines are the memorable element: h1 44–104px (`clamp`), line height 0.96, tracking −0.035em;
  h2 32–56px. Body 16px, lead 19px.
- Weights 400 and 600. `strong` is 600; `em` is 600 and never italic. Sentence case everywhere.
- Lines stay under about 70 characters (`.lead` 42ch, `.small` and `.prose` 70ch).

## Spacing and shape

- Spacing tokens `--s1`…`--s10`: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. No raw px in components.
- Radii: `--r-lg` 24 (cards, photos) · `--r-md` 16 (inputs, video) · buttons and tags are pills.
- Shadows only as light: a 1px lit top edge on glass, a red shadow under primary buttons, one soft red
  glow per call-to-action card. No grey drop shadows.

## Photos as dots (`site/assets/halftone.js`)

- Markup: `<div class="dots" data-halftone data-cell="7" data-gamma="1.1"><img src alt></div>`. Without
  JavaScript the `<img>` shows in black and white; with it, a canvas draws the dots and the image stays in
  the page (visually hidden) for its alt text.
- Every photo fades out over its outer 14% on all sides (`--fade` mask), so it dissolves into the page.
- Motion: a ~7 s breathing wave (dots swell by about 6%), a light sweep every 9 s (2.4 s, eased), and a
  pointer bloom (dots within ~170px grow and lean up to 9px away, easing in over ~0.6 s). Touch pointers
  don't trigger it.
- Nothing moves under `prefers-reduced-motion: reduce`, and nothing runs while the photo is off screen.
- `data-gamma` balances a photo: 1.1 for dark photos, up to 3 for bright ones.

## Rules

- Focus: a 2px `--text` ring with a 3px offset, on everything. It must stay visible on the red buttons.
- Tap targets at least 44px; buttons are 52px.
- The current page is marked with `aria-current="page"` (set by `src/build.ts`), shown as a red underline.
- Hover styles only inside `@media (hover: hover)`.
- On phones the header is one brand row plus one nav row (about 108px); the header CTA hides.
- Wide tables keep a sideways scroll on phones, with a one-line hint above them.
- No inline `style` attributes.
- Demos and spec work always carry "made-up business" on a tag (a test checks it).
- No invented clients, numbers, reviews or testimonials. Value is shown with promises the owner can be held
  to, labelled demos, and real client quotes only once a client has given written OK.
- The spec page (`spec-summit-roofing.html`) keeps its own light theme on purpose, as a trade site would.

## Don'ts

No web fonts from a CDN. No all-caps labels. No "→" on links or cards. No hover lift on cards. No fade-in
on scroll. No highlighted single words in headlines. No blue: the red is the only accent.
