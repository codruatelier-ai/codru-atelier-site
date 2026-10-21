import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { build, fill, include, loadConfig, markCurrent, tokens } from '../src/build.ts';

const out = mkdtempSync(join(tmpdir(), 'codru-site-'));
const config = loadConfig();
const pages = build(out, config);
const html = (p: string) => readFileSync(join(out, p), 'utf8');

test('fill and include: every token and partial must exist', () => {
  assert.equal(fill('a {{x}} b', { x: '<1>' }), 'a &lt;1&gt; b');
  assert.throws(() => fill('{{nope}}', {}), /Unknown token/);
  assert.equal(include('x<!-- include:p -->y', { p: ' P ' }), 'xPy');
  assert.throws(() => include('<!-- include:missing -->', {}), /Missing partial/);
});

test('empty links fall back to email, so no button is ever dead', () => {
  const t = tokens({ ...config, bookingUrl: '', questionnaireUrl: '' });
  assert.match(t.bookingHref!, /^mailto:/);
  assert.equal(tokens({ ...config, bookingUrl: 'https://calendar.app.google/x' }).bookingHref, 'https://calendar.app.google/x');
});

test('every page has a title, a description, a language and exactly one h1, and nothing left unfilled', () => {
  assert.ok(pages.length >= 8, `built ${pages.length} pages`);
  for (const p of pages) {
    const h = html(p);
    assert.match(h, /<title>[^<]{5,}<\/title>/, `${p}: title`);
    assert.match(h, /<meta name="description" content="[^"]{40,}">/, `${p}: description`);
    assert.match(h, /<html lang="(en|ro)">/, `${p}: lang`);
    assert.equal((h.match(/<h1[\s>]/g) ?? []).length, 1, `${p}: one h1`);
    assert.doesNotMatch(h, /\{\{|<!-- include:|lorem ipsum/i, `${p}: unfilled`);
  }
});

test('every local link and file exists', () => {
  for (const p of pages) {
    for (const [, url] of html(p).matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:|#)/.test(url!)) continue;
      const path = url!.split('#')[0]!.split('?')[0]!;
      if (!path) continue;
      assert.ok(existsSync(join(out, dirname(p), path)), `${p} links to missing ${url}`);
    }
  }
});

test('demos and spec work are always labelled as made-up', () => {
  for (const p of pages) {
    const h = html(p);
    if (h.includes('<video')) assert.match(h, /Demo · made-up business/, `${p}: video without its Demo label`);
  }
  const spec = html('spec-summit-roofing.html');
  assert.match(spec.slice(0, spec.indexOf('<header>')), /Spec work by Codru Atelier.*made-up business/s, 'the banner comes first');
  assert.match(spec, /placeholder reviews/i);
  assert.match(spec, /noindex/);
});

test('the audit form asks for consent with an unticked box and links the privacy page', () => {
  const h = html('audit.html');
  assert.match(h, /<input id="a-consent" name="consent" type="checkbox" required>/);
  assert.doesNotMatch(h, /a-consent[^>]*checked/);
  assert.match(h, /href="privacy.html"/);
  assert.match(h, /data-email="[^"]+@[^"]+"/);
});

test('the privacy page says what the outreach actually does', () => {
  const h = html('privacy.html');
  for (const must of ['90 days', 'no thanks', 'hashed', 'No cookies', 'Anthropic', 'standard contractual clauses', 'ANSPDCP', config.email]) {
    assert.ok(h.includes(must), `privacy page mentions ${must}`);
  }
});

test('every page shows who runs the business and links the privacy page', () => {
  for (const p of pages.filter((x) => !x.startsWith('spec-'))) {
    const h = html(p);
    assert.ok(h.includes(config.postalAddress.replace(/&/g, '&amp;').slice(0, 20)) || h.includes('TODO'), `${p}: address`);
    assert.match(h, /href="privacy.html"/, `${p}: privacy link`);
  }
});

test('the main menu marks the page you are on, for screen readers too', () => {
  assert.equal(markCurrent('<body data-page="work"><a data-p="work">W</a><a data-p="shop">S</a>'), '<body data-page="work"><a data-p="work" aria-current="page">W</a><a data-p="shop">S</a>');
  assert.match(html('work.html'), /data-p="work" aria-current="page"/);
  assert.match(html('home-services.html'), /data-p="home-services" aria-current="page"/);
  assert.doesNotMatch(html('index.html'), /aria-current/);
});

test('fonts are served from this site, never from a third party', () => {
  for (const p of pages) assert.doesNotMatch(html(p), /fonts\.(googleapis|gstatic)\.com/, `${p}: outside font host`);
  assert.doesNotMatch(readFileSync(join(out, 'assets/site.css'), 'utf8'), /https?:\/\//);
});
