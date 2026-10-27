#!/usr/bin/env node
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';
import { validatePalette } from './lib/palette.mjs';

const palettePath = 'palettes/palette.yaml';
const usage = 'Usage: sync:palette -- --source <hub> --target <consumer> --kind dotfiles|port';

function hashContent(content) {
  return createHash('sha256').update(content).digest('hex');
}

function parseOptions(args) {
  const options = {};
  const supportedOptions = new Set(['--source', '--target', '--kind']);

  for (let index = 0; index < args.length; index += 2) {
    const option = args[index];
    const value = args[index + 1];
    if (!supportedOptions.has(option) || !value) throw new Error(usage);
    options[option.slice(2)] = value;
  }

  if (!options.source || !options.target || !['dotfiles', 'port'].includes(options.kind)) {
    throw new Error('Specify --source, --target and --kind dotfiles|port');
  }

  return options;
}

function runGit(source, ...args) {
  return execFileSync('git', ['-C', source, ...args], { encoding: 'utf8' }).trim();
}

function readCommittedPalette(source) {
  const content = readFileSync(join(source, palettePath), 'utf8');
  validatePalette(parse(content));

  const hasWorkingChanges = runGit(source, 'status', '--porcelain', '--', palettePath);
  if (hasWorkingChanges) {
    throw new Error('Source palette has uncommitted changes; commit it before syncing');
  }

  const committedContent = runGit(source, 'show', `HEAD:${palettePath}`);
  if (committedContent !== content.trim()) {
    throw new Error('Source palette has uncommitted changes; commit it before syncing');
  }

  return content;
}

function checkConsumerPalette(paletteFile, lockFile, sourceContent) {
  if (existsSync(lockFile) && !existsSync(paletteFile)) {
    throw new Error('Consumer palette missing; restore it before syncing');
  }
  if (!existsSync(paletteFile)) return;

  const currentContent = readFileSync(paletteFile, 'utf8');
  if (existsSync(lockFile)) {
    const lock = JSON.parse(readFileSync(lockFile, 'utf8'));
    if (hashContent(currentContent) !== lock.sha256) {
      throw new Error('Consumer palette locally modified; preserve or restore edits before syncing');
    }
  } else if (currentContent !== sourceContent) {
    throw new Error('Unpinned consumer palette locally modified or different; reconcile it before syncing');
  }
}

function writeAtomically(filePath, content) {
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  writeFileSync(temporaryPath, content);
  renameSync(temporaryPath, filePath);
}

function syncPalette(options) {
  const source = resolve(options.source);
  const target = resolve(options.target);
  if (source === target || !existsSync(target)) {
    throw new Error('Target must be an existing consumer directory');
  }

  const sourceContent = readCommittedPalette(source);
  const commit = runGit(source, 'rev-parse', 'HEAD');
  const relativeDirectory = options.kind === 'dotfiles' ? 'share/themes/simhae' : 'palettes';
  const targetDirectory = join(target, relativeDirectory);
  const paletteFile = join(targetDirectory, 'palette.yaml');
  const lockFile = join(targetDirectory, 'source.json');

  checkConsumerPalette(paletteFile, lockFile, sourceContent);
  mkdirSync(targetDirectory, { recursive: true });

  const lock = {
    repository: 'https://github.com/spearkkk/simhae-theme',
    commit,
    path: palettePath,
    sha256: hashContent(sourceContent),
  };
  writeAtomically(paletteFile, sourceContent);
  writeAtomically(lockFile, `${JSON.stringify(lock, null, 2)}\n`);

  console.log(`Synced ${options.kind} palette to ${targetDirectory} (${commit.slice(0, 7)})`);
}

try {
  syncPalette(parseOptions(process.argv.slice(2)));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
