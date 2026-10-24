import {readFileSync,existsSync} from 'node:fs';
import {parse} from 'yaml';
import {validatePalette} from './lib/palette.mjs';
const root=new URL('../',import.meta.url);
validatePalette(parse(readFileSync(new URL('palettes/palette.yaml',root),'utf8')));
const ports=JSON.parse(readFileSync(new URL('data/ports.json',root),'utf8'));
const ids=new Set();
for(const port of ports){
 if(ids.has(port.id)||!['intellij','chrome','zen'].includes(port.id))throw new Error(`Invalid or duplicate port: ${port.id}`);
 ids.add(port.id);
 for(const key of ['repository','installation'])if(new URL(port[key]).protocol!=='https:')throw new Error(`Invalid ${port.id}.${key}`);
 if(!['source','published'].includes(port.status))throw new Error(`Invalid ${port.id} status`);
 for(const variant of port.variants)if(!['pelagic','trench','hadal','benthic'].includes(variant))throw new Error(`Invalid variant ${variant}`);
 if(port.screenshot&&!existsSync(new URL(`web/public${port.screenshot}`,root)))throw new Error(`Missing screenshot ${port.screenshot}`);
}
if(ids.size!==3)throw new Error('Expected three application ports');
console.log('Validated four palettes and three application ports.');
