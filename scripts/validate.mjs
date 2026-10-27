import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { validatePalette } from './lib/palette.mjs';
import { validatePorts } from './lib/ports.mjs';

const root = new URL('../', import.meta.url);
const paletteText = readFileSync(new URL('palettes/palette.yaml', root), 'utf8');
const portsText = readFileSync(new URL('data/ports.json', root), 'utf8');

validatePalette(parse(paletteText));
validatePorts(JSON.parse(portsText), { root: fileURLToPath(root) });

console.log('Validated four palettes and three application ports.');
