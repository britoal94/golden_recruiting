// Run after npm run build. Guards the six-page copy rollout without new dependencies.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const output = new URL('../dist/client/', import.meta.url);
const pages = new Map([
  ['', 'Founder-Led Recruiting'],
  ['services', 'Ways to work with us'],
  ['team', "Hi, I'm Bri."],
  ['mission', 'Why we do this'],
  ['apply', 'Looking for your next role?'],
  ['contact', "Let's talk"],
]);
for (const [route, heading] of pages) {
  const html = readFileSync(new URL(`${route ? route + '/' : ''}index.html`, output), 'utf8').replace(/&#(?:39|x27);|&apos;/g, "'");
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route}: one h1`);
  assert.ok(html.includes(heading), `${route}: document heading`);
  assert.ok(html.includes('bri@goldenrecruiting.com'), `${route}: correct contact email`);
  assert.ok(!html.includes('hello@goldenrecruiting.com'), `${route}: no old email`);
  assert.ok(!html.includes('Financial advisor recruiting'), `${route}: no old SEO niche`);
  assert.ok(!/\[(?:optional|Add |Describe |Two or three|one business day|Three downloadable)/i.test(html), `${route}: no document placeholders`);
  assert.ok(html.includes(`https://goldenrecruiting.com/${route}`), `${route}: canonical URL`);
  for (const [, href] of html.matchAll(/href="(\/(?!\/)[^"?#]*)/g)) {
    const path = href.replace(/^\//, '');
    assert.ok(existsSync(new URL(path, output)) || existsSync(new URL(`${path}/index.html`, output)), `${route}: link resolves: ${href}`);
  }
}
const home = readFileSync(new URL('index.html', output), 'utf8');
let previous = -1;
for (const heading of ['Who we are', 'Talk with Bri.', 'Our Services', 'Why Golden Recruiting', 'How we work with our clients', "Let's get started."]) {
  const index = home.indexOf(heading, previous + 1);
  assert.ok(index > previous, `Home section order: ${heading}`);
  previous = index;
}
const contact = readFileSync(new URL('contact/index.html', output), 'utf8');
assert.match(contact, /name="companyName"/);
assert.match(contact, /action="\/api\/contact"/);
assert.match(contact, /name="company"[^>]*tabindex="-1"/); // Separate honeypot, not the visible company field.
console.log('Content checks passed: six pages, headings, section order, internal links, metadata, placeholders and form fields.');
