import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { clinic } from '../src/lib/clinic.ts';
import {
  generateJsonLd,
  generateLlmsTxt,
  generateRobotsTxt,
} from '../src/lib/agent-content.ts';

const page = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
const robotsEndpoint = await readFile(
  new URL('../src/pages/robots.txt.ts', import.meta.url),
  'utf8',
);
const llmsEndpoint = await readFile(
  new URL('../src/pages/llms.txt.ts', import.meta.url),
  'utf8',
);

test('robots.txt allows crawling and points to the sitemap', () => {
  const robots = generateRobotsTxt(clinic);

  assert.match(robots, /^User-agent: \*\nAllow: \/\n/m);
  assert.match(robots, /^Sitemap: https:\/\/lancingnaprapati\.se\/sitemap-index\.xml$/m);
  assert.equal(robots.includes('<'), false);
});

test('robots.txt names common AI search crawlers', () => {
  const robots = generateRobotsTxt(clinic);

  for (const bot of ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot']) {
    assert.match(robots, new RegExp(`User-agent: ${bot}\\nAllow: /`));
  }
});

test('llms.txt repeats the live clinic facts', () => {
  const llms = generateLlmsTxt(clinic);

  assert.match(llms, /^# Olof Lancing Naprapat\n/);
  assert.match(llms, /^> Legitimerad naprapat i Simrishamn\.$/m);
  assert.equal(llms.includes('## Priser'), false);
  assert.equal(llms.includes(clinic.locationName), true);
  assert.equal(llms.includes(clinic.streetAddress), true);
  assert.equal(llms.includes(clinic.addressLocality), true);
  assert.equal(llms.includes(clinic.hours), true);
  assert.equal(llms.includes(clinic.email), true);
  assert.equal(llms.includes(clinic.siteUrl), true);
  assert.match(llms, new RegExp(`\\[Bokning\\]\\(${clinic.bookingUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`));
  assert.match(llms, /\[Klinikfakta\]\(https:\/\/lancingnaprapati\.se\/index\.md\)/);
  assert.match(llms, /\[Instagram\]\(https:\/\/www\.instagram\.com\/lancingnaprapati\/\)/);
  assert.match(llms, /\[E-post\]\(mailto:info@lancingnaprapati\.se\)/);
  assert.match(llms, /\[Webbplatskarta\]\(https:\/\/lancingnaprapati\.se\/sitemap-index\.xml\)/);

  const fileLists = llms.split(/^## /m).slice(1);
  assert.equal(fileLists.length > 0, true);
  for (const section of fileLists) {
    const items = section.split('\n').filter((line) => line.startsWith('- '));
    assert.equal(items.length > 0, true, section);
    for (const item of items) {
      assert.match(item, /^- \[[^\]]+\]\([^)]+\)/);
    }
  }

  for (const item of clinic.prices) {
    assert.equal(llms.includes(item.label), true, `${item.label} missing from llms.txt`);
    assert.equal(llms.includes(item.price), true, `${item.price} missing from llms.txt`);
    if (item.time) {
      assert.equal(llms.includes(item.time), true, `${item.time} missing from llms.txt`);
    }
  }
});

test('JSON-LD uses schema.org clinic facts from the shared module', () => {
  const data = generateJsonLd(clinic);
  const graph = data['@graph'];
  assert.equal(Array.isArray(graph), true);

  const business = graph.find((node) => node['@type']?.includes('LocalBusiness'));
  const person = graph.find((node) => node['@type'] === 'Person');

  assert.equal(data['@context'], 'https://schema.org');
  assert.equal(business.name, clinic.businessName);
  assert.equal(business.url, clinic.siteUrl);
  assert.equal(business.email, clinic.email);
  assert.equal(business.telephone, clinic.telephone);
  assert.equal(business.address.streetAddress, clinic.streetAddress);
  assert.equal(business.address.addressLocality, clinic.addressLocality);
  assert.equal(business.address.addressCountry, 'SE');
  assert.equal(person.name, clinic.personName);
  assert.equal(person.jobTitle, clinic.jobTitle);
  assert.equal(business.sameAs.includes(clinic.googleReviewUrl), true);

  const offers = business.makesOffer;
  assert.equal(offers.length, clinic.prices.length);
  for (const [index, item] of clinic.prices.entries()) {
    assert.equal(offers[index].name, item.label);
    assert.equal(offers[index].priceCurrency, 'SEK');
    assert.equal(offers[index].price, Number(item.price.replace(/[^\d]/g, '')));
  }
});

test('includes the Google Search Console HTML verification tag', () => {
  assert.match(
    page,
    /<meta\s+name="google-site-verification"\s+content="kKAgxm7cW1GZvGxoFRP5hYi5ppFCSXWcDgqBoKDQuZA"\s*\/>/,
  );
});

test('the Google review link points at the Lancingnaprapati AB listing', () => {
  assert.equal(
    clinic.googleReviewUrl,
    'https://www.google.com/search?kgmid=/g/11zytk23xc&q=Lancingnaprapati+AB',
  );
  assert.equal(clinic.googleReviewUrl.includes('Olof+Lancing+Naprapat+Simrishamn'), false);
});

test('practical facts are a valid definition list and the Swish mark is the official icon', async () => {
  assert.equal(/<span>\s*<dt>/.test(page), false);
  assert.match(page, /<dt>\s*<CalendarDays[^>]*\/>\s*<span>Dagar<\/span>\s*<\/dt>\s*<dd>/);
  assert.match(page, /<dt>\s*<Clock3[^>]*\/>\s*<span>Öppettider<\/span>\s*<\/dt>\s*<dd>/);
  assert.match(page, /<dt>\s*<MapPin[^>]*\/>\s*<span>Plats<\/span>\s*<\/dt>\s*<dd>/);

  const css = await readFile(new URL('../src/styles/site.css', import.meta.url), 'utf8');
  assert.match(css, /--site-clay-text:\s*#795848;/);
  assert.match(css, /\.care-step__number\s*\{[^}]*color:\s*var\(--site-clay-text\)/s);

  const swish = await readFile(new URL('../public/swish.svg', import.meta.url), 'utf8');
  assert.match(swish, /Swish_App_Icon_SVG/);
  assert.match(page, /import \{ Image \} from 'astro:assets'/);
  assert.match(page, /import portrait from '\.\.\/assets\/olof-lancing\.webp'/);
  assert.equal(page.includes('src="/olof-lancing.webp"'), false);
  assert.match(page, /layout="constrained"/);
  assert.match(page, /widths=\{\[480, 800, 1200\]\}/);
  assert.equal(swish.includes('base64'), false);
  assert.equal(swish.length < 20_000, true);
});

test('the missing page points home and stays out of search', async () => {
  const missing = await readFile(new URL('../src/pages/404.astro', import.meta.url), 'utf8');

  assert.match(missing, /Sidan finns inte/);
  assert.match(missing, /href="\/"/);
  assert.match(missing, /name="robots" content="noindex"/);
  assert.equal(missing.includes('github.com'), false);
});

test('the page and static files are generated from the shared clinic module', () => {
  assert.match(page, /from ['"]\.\.\/lib\/clinic['"]/);
  assert.match(page, /from ['\"]\.\.\/lib\/agent-content['\"]/);
  assert.match(page, /application\/ld\+json/);
  assert.match(page, /generateJsonLd/);
  assert.equal(page.includes('const prices = ['), false);
  assert.equal(page.includes("const bookingUrl = '"), false);
  assert.match(robotsEndpoint, /generateRobotsTxt/);
  assert.match(llmsEndpoint, /generateLlmsTxt/);
});
