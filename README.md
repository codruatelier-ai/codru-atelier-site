# codru-atelier-site

Codru Atelier's public website, started 2026-10-19. Plain HTML and one stylesheet (same look as the
client questionnaire), no framework, no cookies, no tracking.

| Page | For |
| --- | --- |
| `index.html` | Who it's for, how it works, labelled proof, prices, who you'll work with |
| `home-services.html` | "Never miss a job": text-back, quote form, review requests, fast site |
| `online-shops.html` | "Store tune-up + one automation": speed, stock, back-in-stock, carts |
| `work.html` | Demos, spec work and sample audits, each labelled made-up |
| `spec-summit-roofing.html` | Spec work: a one-page site for a made-up roofer |
| `privacy.html` | The privacy notice every outreach email links to (`SENDER_PRIVACY_URL`) |
| `audit.html` | Romanian free-audit request with an unticked consent box (the consent route) |

## Develop

```
npm install
npm run check     # typecheck + tests: pages, links, labels, consent
npm run build     # site/ + site.config.json → dist/
npm run ready     # may it go public? lists what's still to fill in
```

Node ≥ 23.6 runs the `.ts` files directly.

## Going live (owner)

1. Fill in `site.config.json`: full name, city, postal address, legal form, then the booking link,
   the questionnaire address and (optional) an audit-form endpoint. `npm run ready` must say READY.
2. Add a photo of yourself if you like (a real person is the strongest proof a new studio has).
3. Say "push". On GitHub: Settings → Pages → Source: **GitHub Actions**. The site appears at
   `https://codruatelier-ai.github.io/codru-atelier-site/` (or your own domain, under Pages → Custom domain).
4. In `client-outreach/.env`, set `SENDER_PRIVACY_URL` to the privacy page's address, and put the demo
   video addresses (`…/media/*.mp4`) into `client-outreach/free-things/demo-videos/links.json`.

Rules for AI agents working here are in [CLAUDE.md](CLAUDE.md).
