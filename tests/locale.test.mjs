import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';

const localeFile = new URL('../web/src/lib/locale.ts', import.meta.url);

test('language matching respects weights, regional tags, exclusions and fallback', async () => {
  assert.ok(existsSync(localeFile), 'locale resolver must exist');
  const { resolveLocale } = await import(localeFile.href);

  const cases = [
    ['ko-KR, en-US;q=0.8', 'ko'],
    ['en-US,en;q=0.9', 'en'],
    ['fr;q=1,ko;q=0.8,en;q=0.4', 'ko'],
    ['ko;q=0,en;q=0.5', 'en'],
    ['ja-JP', 'en'],
    ['', 'en'],
    ['*', 'en'],
  ];
  for (const [header, expected] of cases) assert.equal(resolveLocale(header), expected, header);

  assert.equal(resolveLocale('ko-KR', 'en'), 'en');
  assert.equal(resolveLocale('en-US', 'ko'), 'ko');
  assert.equal(resolveLocale('ko-KR', 'invalid'), 'ko');
});
