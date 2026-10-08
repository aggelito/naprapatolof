import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');

const expectedEvents = [
  'booking-click',
  'map-click',
  'phone-click',
  'email-click',
  'google-review-click',
  'instagram-click',
];

test('tracks every meaningful outbound action exactly once', () => {
  for (const eventName of expectedEvents) {
    const matches = page.match(new RegExp(`data-umami-event="${eventName}"`, 'g')) ?? [];
    assert.equal(matches.length, 1, `${eventName} should appear exactly once`);
  }
});

test('does not add unnamed or unexpected Umami events', () => {
  const trackedEvents = [...page.matchAll(/data-umami-event="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(trackedEvents.sort(), expectedEvents.sort());
});

test('enables cookieless Core Web Vitals collection on the production tracker', () => {
  const scripts = [...page.matchAll(/<script[\s\S]*?src="https:\/\/umami\.aghost\.io\/script\.js"[\s\S]*?>/g)];
  assert.equal(scripts.length, 1, 'Umami script should appear exactly once');
  assert.match(scripts[0][0], /data-website-id="4442e406-82a3-4337-b016-36153a8c4de6"/);
  assert.match(scripts[0][0], /data-performance="true"/);
});

test('loads the production recorder for replays and heatmaps', () => {
  const scripts = [...page.matchAll(/<script[\s\S]*?src="https:\/\/umami\.aghost\.io\/recorder\.js"[\s\S]*?>/g)];
  assert.equal(scripts.length, 1, 'Umami recorder should appear exactly once');
  assert.match(scripts[0][0], /data-website-id="4442e406-82a3-4337-b016-36153a8c4de6"/);
  assert.match(page, /import\.meta\.env\.PROD && \([\s\S]*recorder\.js[\s\S]*\)/);
});
