/**
 * Builds the site: copies site/ to dist/, filling the {{tokens}} in HTML from
 * site.config.json. Empty links fall back to email, so the site never shows a
 * dead button. `npm run build` writes dist/; GitHub Pages serves dist/.
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

export interface SiteConfig {
  ownerFirstName: string;
  ownerFullName: string;
  city: string;
  country: string;
  postalAddress: string;
  legalForm: string;
  email: string;
  bookingUrl: string;
  questionnaireUrl: string;
  auditEndpoint: string;
  siteUrl: string;
  updated: string;
}


const ROOT = join(import.meta.dirname, '..');

export function loadConfig(path = join(ROOT, 'site.config.json')): SiteConfig {
  return JSON.parse(readFileSync(path, 'utf8')) as SiteConfig;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The values every {{token}} resolves to. Unfilled owner details stay visibly unfilled. */
export function tokens(c: SiteConfig): Record<string, string> {
  const mail = (subject: string) => `mailto:${c.email}?subject=${encodeURIComponent(subject)}`;
  return {
    ownerFirstName: c.ownerFirstName,
    ownerFullName: c.ownerFullName,
    city: c.city,
    country: c.country,
    postalAddress: c.postalAddress,
    legalForm: c.legalForm,
    email: c.email,
    bookingHref: c.bookingUrl || mail('A 20-minute call'),
    questionnaireHref: c.questionnaireUrl || mail('Start a project'),
    auditEndpoint: c.auditEndpoint,
    siteUrl: c.siteUrl,
    updated: c.updated,
  };
}

/** Pure. Fills {{name}} tokens; throws on a token that has no value, so a typo can't ship. */
export function fill(html: string, values: Record<string, string>): string {
  return html.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    if (!(name in values)) throw new Error(`Unknown token {{${name}}}`);
    return escapeHtml(values[name]!);
  });
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** Pure. Replaces <!-- include:name --> with site/_partials/name.html; throws on a missing partial. */
export function include(html: string, partials: Record<string, string>): string {
  return html.replace(/<!-- include:([\w-]+) -->/g, (_, name: string) => {
    const part = partials[name];
    if (part === undefined) throw new Error(`Missing partial ${name}`);
    return part.trim();
  });
}

/** Pure. Marks the main-menu link for the page named in <body data-page>, so the current page is announced. */
export function markCurrent(html: string): string {
  const page = html.match(/<body data-page="([\w-]+)"/)?.[1];
  return page ? html.replace(`data-p="${page}"`, `data-p="${page}" aria-current="page"`) : html;
}

export function build(out = join(ROOT, 'dist'), config = loadConfig()): string[] {
  const src = join(ROOT, 'site');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  cpSync(src, out, { recursive: true, filter: (p) => !p.includes('_partials') });
  const partialsDir = join(src, '_partials');
  const partials = Object.fromEntries(
    readdirSync(partialsDir).filter((f) => f.endsWith('.html')).map((f) => [f.replace(/\.html$/, ''), readFileSync(join(partialsDir, f), 'utf8')]),
  );
  const values = tokens(config);
  const pages = walk(out).filter((p) => p.endsWith('.html'));
  for (const p of pages) writeFileSync(p, markCurrent(fill(include(readFileSync(p, 'utf8'), partials), values)));
  return pages.map((p) => relative(out, p));
}

// Compare file paths, not URLs: the folder name has spaces, which a URL encodes.
if (process.argv[1] && import.meta.filename === resolve(process.argv[1])) {
  const pages = build();
  console.log(`Built ${pages.length} pages into dist/`);
}
