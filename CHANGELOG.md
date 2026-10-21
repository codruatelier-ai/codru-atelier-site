# Changelog

Newest first. Every push to `main` gets an entry and the same number in
`package.json → version`.

## 0.3.0 · 2026-10-21

- Fonts come from this site: Geist (headings) is self-hosted, the rest uses the system fonts. Google
  Fonts is gone, which the privacy page's "no third parties" promise needed.
- Easier to see and use: input borders and the focus ring are clearly visible, the menu marks the page
  you're on, and links and buttons are big enough to tap.
- On phones the header is shorter (one menu row), and price tables say they scroll sideways.
- Calmer look: no all-caps labels above headings, no arrows on links, one type scale and spacing set.
- Spec page: a visible focus ring and input borders; the call button dials the example number.
- `DESIGN.md` describes the look, shared with client-onboarding.

## 0.2.0 · 2026-10-20

- The site: home, two niche offer pages, work (demos, spec work, sample audits, all labelled made-up),
  a spec one-page site for a made-up roofer, privacy notice, Romanian free-audit request page with
  consent, 404. Dark modern look shared with client-onboarding; CC0 photos (credits in `site/images/`).
- `npm run build` fills `site/` from `site.config.json`; `npm run ready` blocks publishing while any
  owner detail is TODO; tests check every page, link, label and the consent box.
- GitHub Pages workflow: publishes `main` only when check and ready pass.

## 0.1.0 · 2026-10-19

- Project started with the standard defaults.
