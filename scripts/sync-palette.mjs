#!/usr/bin/env node
import {readFileSync,existsSync,mkdirSync,writeFileSync,renameSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parse} from 'yaml';
import {validatePalette} from './lib/palette.mjs';
const hash = value => createHash('sha256').update(value).digest('hex');
try {
 const args=process.argv.slice(2), options={};
 for(let i=0;i<args.length;i+=2){if(!['--source','--target','--kind'].includes(args[i])||!args[i+1]) throw new Error('Usage: sync:palette -- --source <hub> --target <consumer> --kind dotfiles|port');options[args[i].slice(2)]=args[i+1];}
 if(!options.source||!options.target||!['dotfiles','port'].includes(options.kind))throw new Error('Specify --source, --target and --kind dotfiles|port');
 const source=resolve(options.source), target=resolve(options.target);
 if(source===target||!existsSync(target))throw new Error('Target must be an existing consumer directory');
 const git=(...a)=>execFileSync('git',['-C',source,...a],{encoding:'utf8'}).trim();
 const relative='palettes/palette.yaml', text=readFileSync(join(source,relative),'utf8');
 validatePalette(parse(text));
 if(git('status','--porcelain','--',relative)||git('show',`HEAD:${relative}`)!==text.trim()) throw new Error('Source palette has uncommitted changes; commit it before syncing');
 const commit=git('rev-parse','HEAD');
 const dir=join(target, options.kind==='dotfiles'?'share/themes/simhae':'palettes');
 const palette=join(dir,'palette.yaml'), lock=join(dir,'source.json');
 if(existsSync(lock)&&!existsSync(palette))throw new Error('Consumer palette missing; restore it before syncing');
 if(existsSync(palette)) {
  const current=readFileSync(palette,'utf8');
  if(existsSync(lock)) {
   const previous=JSON.parse(readFileSync(lock,'utf8'));
   if(hash(current)!==previous.sha256)throw new Error('Consumer palette locally modified; preserve or restore edits before syncing');
  } else if(current!==text)throw new Error('Unpinned consumer palette locally modified or different; reconcile it before syncing');
 }
 mkdirSync(dir,{recursive:true});
 const write=(file,content)=>{const temp=`${file}.${process.pid}.tmp`;writeFileSync(temp,content);renameSync(temp,file)};
 write(palette,text);
 write(lock,JSON.stringify({repository:'https://github.com/spearkkk/simhae-theme',commit,path:relative,sha256:hash(text)},null,2)+'\n');
 console.log(`Synced ${options.kind} palette to ${dir} (${commit.slice(0,7)})`);
} catch(error) {console.error(error.message);process.exitCode=1;}
