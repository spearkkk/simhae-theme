import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { parse } from 'yaml';

const paletteModule = new URL('../scripts/lib/palette.mjs', import.meta.url);
const canonicalFile = new URL('../palettes/palette.yaml', import.meta.url);

test('canonical palette validates all four variants and preserves main colours', async () => {
  assert.ok(existsSync(paletteModule), 'palette validator must exist');
  const { validatePalette } = await import(paletteModule.href);
  const data = parse(readFileSync(canonicalFile, 'utf8'));

  assert.equal(validatePalette(data), data);
  assert.equal(data.main, 'pelagic');
  assert.equal(data.palettes.pelagic.base03, '#24425C');
  assert.equal(data.palettes.pelagic.base04, '#4A6E86');

  for (const key of ['base00', 'base17']) {
    const invalid = structuredClone(data);
    delete invalid.palettes.hadal[key];
    assert.throws(() => validatePalette(invalid), /hadal/);
  }

  const invalid = structuredClone(data);
  invalid.palettes.pelagic.base00 = '#xx0000';
  assert.throws(() => validatePalette(invalid), /base00/);
});

test('sync pins a committed source, preserves edits, and rejects dirty source', () => {
  const script = new URL('../scripts/sync-palette.mjs', import.meta.url);
  assert.ok(existsSync(script), 'safe sync command must exist');

  const directory = mkdtempSync(path.join(tmpdir(), 'simhae-sync-'));
  const source = path.join(directory, 'source');
  const target = path.join(directory, 'consumer');
  mkdirSync(path.join(source, 'palettes'), { recursive: true });
  mkdirSync(target);

  const canonical = readFileSync(canonicalFile, 'utf8');
  writeFileSync(path.join(source, 'palettes/palette.yaml'), canonical);

  const git = (...args) => {
    const result = spawnSync('git', args, { cwd: source, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  git('init', '-q');
  git('add', '.');
  git('-c', 'user.name=Test', '-c', 'user.email=test@example.test', 'commit', '-qm', 'palette');

  const runSync = () => spawnSync(process.execPath, [
    script.pathname,
    '--source', source,
    '--target', target,
    '--kind', 'port',
  ], { encoding: 'utf8' });

  let result = runSync();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(readFileSync(path.join(target, 'palettes/palette.yaml'), 'utf8'), canonical);

  const lockPath = path.join(target, 'palettes/source.json');
  const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
  assert.equal(lock.commit, git('rev-parse', 'HEAD'));
  assert.equal(runSync().status, 0);

  const consumerPalette = path.join(target, 'palettes/palette.yaml');
  writeFileSync(consumerPalette, `${canonical}\n# local edit\n`);
  result = runSync();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /modified/i);
  assert.match(readFileSync(consumerPalette, 'utf8'), /local edit/);

  writeFileSync(consumerPalette, canonical);
  writeFileSync(path.join(source, 'palettes/palette.yaml'), `${canonical}\n# dirty\n`);
  result = runSync();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /source.*uncommitted/i);
  assert.equal(readFileSync(consumerPalette, 'utf8'), canonical);
});
