import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validatePorts } from '../scripts/lib/ports.mjs';

const canonicalPorts = JSON.parse(readFileSync(new URL('../data/ports.json', import.meta.url), 'utf8'));

test('validates canonical ports and allows omitted screenshots', () => {
  assert.equal(validatePorts(canonicalPorts), canonicalPorts);

  const withoutScreenshots = structuredClone(canonicalPorts);
  for (const port of withoutScreenshots) delete port.screenshot;
  assert.equal(validatePorts(withoutScreenshots), withoutScreenshots);
});

test('reports missing required fields with the record and field', () => {
  const ports = structuredClone(canonicalPorts);
  delete ports[0].name;
  assert.throws(() => validatePorts(ports), /ports\[0\]\.name/);
});

test('rejects invalid and duplicate port identifiers', () => {
  const invalid = structuredClone(canonicalPorts);
  invalid[0].id = 'deep-ocean-next';
  assert.throws(() => validatePorts(invalid), /ports\[0\]\.id/);

  const duplicate = structuredClone(canonicalPorts);
  duplicate[1].id = duplicate[0].id;
  assert.throws(() => validatePorts(duplicate), /ports\[1\]\.id/);
});

test('requires each intended application port exactly once', () => {
  assert.throws(() => validatePorts(canonicalPorts.slice(1)), /missing required port.*intellij/i);
});

test('rejects invalid field types, statuses, and variants precisely', () => {
  const badName = structuredClone(canonicalPorts);
  badName[0].name = 42;
  assert.throws(() => validatePorts(badName), /ports\[0\]\.name/);

  const badStatus = structuredClone(canonicalPorts);
  badStatus[0].status = 'coming-soon';
  assert.throws(() => validatePorts(badStatus), /ports\[0\]\.status/);

  const badVariants = structuredClone(canonicalPorts);
  badVariants[0].variants = ['pelagic', 'abyssal'];
  assert.throws(() => validatePorts(badVariants), /ports\[0\]\.variants/);
});

test('accepts only valid HTTPS repository and installation URLs', () => {
  for (const [field, value] of [['repository', 'not a URL'], ['installation', 'http://example.com/install']]) {
    const ports = structuredClone(canonicalPorts);
    ports[0][field] = value;
    assert.throws(() => validatePorts(ports), new RegExp(`ports\\[0\\]\\.${field}`));
  }
});

test('rejects screenshot paths that do not resolve to local public assets', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'simhae-ports-'));
  try {
    const ports = structuredClone(canonicalPorts);
    ports[0].screenshot = '/app-shots/missing.png';
    assert.throws(() => validatePorts(ports, { root }), /ports\[0\]\.screenshot/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
