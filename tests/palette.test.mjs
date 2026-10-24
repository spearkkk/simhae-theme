import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const modulePath = new URL('../scripts/lib/palette.mjs', import.meta.url);
test('canonical palette validates all four variants and preserves main colours', async () => {
  assert.ok(existsSync(modulePath), 'palette validator must exist');
  const {validatePalette} = await import(modulePath.href);
  const {parse} = await import('yaml');
  const data = parse(readFileSync(new URL('../palettes/palette.yaml', import.meta.url), 'utf8'));
  assert.equal(validatePalette(data), data);
  assert.equal(data.main, 'pelagic');
  assert.equal(data.palettes.pelagic.base03, '#24425C');
  assert.equal(data.palettes.pelagic.base04, '#4A6E86');
  for (const key of ['base00','base17']) {
    const bad = structuredClone(data); delete bad.palettes.hadal[key];
    assert.throws(() => validatePalette(bad), /hadal/);
  }
  const bad = structuredClone(data); bad.palettes.pelagic.base00 = '#xx0000';
  assert.throws(() => validatePalette(bad), /base00/);
});
test('sync pins a committed source, preserves edits, and rejects dirty source', () => {
  const script = new URL('../scripts/sync-palette.mjs', import.meta.url);
  assert.ok(existsSync(script), 'safe sync command must exist');
  const dir = mkdtempSync(path.join(tmpdir(),'simhae-sync-'));
  const source = path.join(dir,'source'), target = path.join(dir,'consumer');
  mkdirSync(path.join(source,'palettes'), {recursive:true}); mkdirSync(target);
  const canonical = readFileSync(new URL('../palettes/palette.yaml', import.meta.url),'utf8');
  writeFileSync(path.join(source,'palettes/palette.yaml'), canonical);
  const git = (...args) => {const r = spawnSync('git',args,{cwd:source,encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout.trim()};
  git('init','-q');git('add','.');git('-c','user.name=Test','-c','user.email=test@example.test','commit','-qm','palette');
  const run = () => spawnSync(process.execPath,[script.pathname,'--source',source,'--target',target,'--kind','port'],{encoding:'utf8'});
  let r=run();assert.equal(r.status,0,r.stderr);
  assert.equal(readFileSync(path.join(target,'palettes/palette.yaml'),'utf8'),canonical);
  const lock=JSON.parse(readFileSync(path.join(target,'palettes/source.json'),'utf8'));
  assert.equal(lock.commit,git('rev-parse','HEAD'));
  assert.equal(run().status,0);
  writeFileSync(path.join(target,'palettes/palette.yaml'),canonical+'\n# local edit\n');
  r=run();assert.notEqual(r.status,0);assert.match(r.stderr,/modified/i);
  assert.match(readFileSync(path.join(target,'palettes/palette.yaml'),'utf8'),/local edit/);
  writeFileSync(path.join(target,'palettes/palette.yaml'),canonical);
  writeFileSync(path.join(source,'palettes/palette.yaml'),canonical+'\n# dirty\n');
  r=run();assert.notEqual(r.status,0);assert.match(r.stderr,/source.*uncommitted/i);
});
