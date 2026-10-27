import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function readMessages(locale) {
  const path = new URL(`../web/src/messages/${locale}.json`, import.meta.url);
  return JSON.parse(readFileSync(path, 'utf8'));
}

function flattenKeys(value, prefix = '') {
  return Object.entries(value)
    .flatMap(([key, nested]) => typeof nested === 'object'
      ? flattenKeys(nested, `${prefix}${key}.`)
      : [`${prefix}${key}`])
    .sort();
}

test('Korean and English provide identical message keys', () => {
  assert.deepEqual(flattenKeys(readMessages('en')), flattenKeys(readMessages('ko')));
});
