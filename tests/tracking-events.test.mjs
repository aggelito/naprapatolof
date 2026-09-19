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
