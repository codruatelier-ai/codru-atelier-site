# Design — Codru Atelier

The look of Codru Atelier's public pages: this site, the client questionnaire (`client-onboarding`) and the
Overseer Board. The source of truth is `client-onboarding/.tastemaker/style-lock.md`. This file is the same
system written for building pages; keep the two in step, and change both together.

## Colour tokens (dark only, `color-scheme: dark`)

| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `--bg` | `#0b0d10` | Page, header | — |
| `--surface` | `#12151a` | Cards, steps | — |
| `--field` | `#181c22` | Inputs, notices, photo placeholders | — |
| `--text` | `#eef1f4` | Body text, focus ring | 17.2:1 on bg |
| `--muted` | `#9aa3ad` | Help text, notes, labels | 6.7:1 on field, 6.1:1 on selected |
| `--control` | `#6b7480` | Input, tag and secondary-button borders | 3.6:1 on field, 4.1:1 on bg |
| `--hairline` | `#232831` | Section and card dividers (decorative only) | — |
| `--accent` | `#8fb3ff` | Primary buttons, links, the featured card's edge | 9.3:1 on bg |
| `--accent-hi` | `#adc7ff` | Hover, demo tags, step numbers | 11.5:1 on bg |
| `--on-accent` | `#0a1222` | Text on accent | 9.0:1 |
| `--selected` | `#17233a` | Featured card fill | — |
| `--good` / `--warn` / `--error` | `#6fd3a8` / `#f3c46b` / `#ff8f85` | Status, always with words | ≥7:1 on surface |

Proportions: about 60% near-black base, 30% surface greys, 10% blue accent (buttons, links, the one
featured card). The accent is never decoration.

## Type

- **Geist 600** for headings and the wordmark only. It is self-hosted (`site/assets/fonts/geist-600.woff2`,
  OFL licence beside it) and preloaded. No Google Fonts: the privacy page promises no third parties.
- **System fonts** for everything else (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto`).
- Scale in px: 13 (tags) · 14 (notes, labels) · 16 (body) · 18 (lead, h3) · 22 (h2 on phones, prices) ·
  32 (h1 on phones, h2 on desktop) · 44 (h1 on desktop).
- Weights: 400 and 600. `strong` is 600. `em` is shown as 600 and never in italics.
- Sentence case everywhere. No all-caps labels, no letter-spaced eyebrows.
- Lines stay under about 70 characters (`.lead` 60ch, `.small` and `.prose` 70ch).

## Spacing and shape

- Spacing tokens: `--s1` 4 · `--s2` 8 · `--s3` 12 · `--s4` 16 · `--s5` 24 · `--s6` 32 · `--s7` 48 · `--s8` 64 · `--s9` 96.
  No raw px for spacing in components.
- Radii: `--r-lg` 20 (cards, photos) · `--r-md` 12 (buttons, inputs) · `--r-sm` 8 · pills 999.
- No shadows, gradients or blur.

## Rules

- Focus: a 2px `--text` ring, offset 2px, on everything. It must stay visible on the blue buttons.
- Tap targets are at least 44px: nav and footer links included. Buttons are 48px.
- The current page is marked with `aria-current="page"` (set by `src/build.ts`), shown as an underline.
- Hover styles only inside `@media (hover: hover)`, so nothing sticks after a tap.
- Motion: 150ms colour transitions only, and none under `prefers-reduced-motion: reduce`.
- On phones the header is one brand row plus one nav row (about 108px). The header CTA hides; every page
  has its own booking button.
- Wide tables keep a sideways scroll on phones, with a one-line hint above them.
- No inline `style` attributes: use a class.
- Demos and spec work always carry "made-up business" on a tag (a test checks it).
- The spec page (`spec-summit-roofing.html`) has its own light theme on purpose, as a trade site would.
  Its focus ring (`#92400e`, 6.8:1) and input borders (`#857f73`, 4.0:1) follow the same contrast rules.

## Don'ts

No Inter or other web fonts from a CDN. No uppercase eyebrows above headings. No "→" on links or cards.
No hover lift or glow on cards. No fade-ins on scroll. No highlighted single words in headlines. No
invented clients, numbers or reviews.
