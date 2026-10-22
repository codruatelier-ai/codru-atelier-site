# Changelog

Newest first. Every push to `main` gets an entry and the same number in
`package.json → version`.

## 0.4.1 · 2026-10-22

- The site is ready to publish: your name, city, address and an honest "sole trader (registration pending)" are filled in, and the booking and questionnaire links are live.
- The audit endpoint is optional now. Without one, the Romanian audit form opens the visitor's email app; a proper endpoint is planned.
- `npm run ready` says READY.

## 0.4.0 · 2026-10-21

- New look: near-black with one deep red, very large headlines, round buttons, glass cards and
  giant outlined step numbers. The logo and favicon are red.
- The photos on the home, home services and online shops pages, and the demo picture, are drawn as
  a field of light dots that slowly breathes, gets a light sweep every few seconds and reacts gently
  to the mouse. Still for "reduce motion"; a black and white photo without JavaScript.
- Home page: no prices or small print under the buttons. New "What you can hold me to" promises and
  the labelled roofer demo told as a short story. No testimonials until real clients send them.

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
