/**
 * `npm run ready`: may this site go public? Fails while any owner detail is a
 * TODO or the booking or questionnaire link is empty. Prints what is left, in order. The audit endpoint is optional.
 */
import { loadConfig } from './build.ts';

const c = loadConfig();
const left: string[] = [];
for (const [k, v] of Object.entries(c)) {
  if (typeof v === 'string' && v.startsWith('TODO')) left.push(`${k}: ${v.replace(/^TODO\(owner\):\s*/, '')}`);
}
if (!c.bookingUrl) left.push('bookingUrl: the Google Calendar booking page link (client-outreach .claude/skills/book/booking-page.md)');
if (!c.questionnaireUrl) left.push('questionnaireUrl: the live client-onboarding address');

if (left.length) {
  console.log('NOT READY to publish. Fill in site.config.json:');
  for (const l of left) console.log(`  - ${l}`);
  process.exitCode = 1;
} else {
  console.log('READY: every owner detail and link is filled in.');
}
// Optional, so it never blocks publishing: without an endpoint the free-audit form opens the visitor's own
// email app with the request filled in (assets/audit.js). A real endpoint keeps the consent record server-side.
if (!c.auditEndpoint) console.log('Note: auditEndpoint is empty. The audit form falls back to email until an endpoint is set.');
