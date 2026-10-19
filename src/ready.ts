/**
 * `npm run ready`: may this site go public? Fails while any owner detail is a
 * TODO or a link still falls back to email. Prints what is left, in order.
 */
import { loadConfig } from './build.ts';

const c = loadConfig();
const left: string[] = [];
for (const [k, v] of Object.entries(c)) {
  if (typeof v === 'string' && v.startsWith('TODO')) left.push(`${k}: ${v.replace(/^TODO\(owner\):\s*/, '')}`);
}
if (!c.bookingUrl) left.push('bookingUrl: the Google Calendar booking page link (client-outreach .claude/skills/book/booking-page.md)');
if (!c.questionnaireUrl) left.push('questionnaireUrl: the live client-onboarding address');
if (!c.auditEndpoint) left.push('auditEndpoint: where the free-audit form sends (until then it opens the visitor\'s email app)');

if (left.length) {
  console.log('NOT READY to publish. Fill in site.config.json:');
  for (const l of left) console.log(`  - ${l}`);
  process.exitCode = 1;
} else {
  console.log('READY: every owner detail and link is filled in.');
}
