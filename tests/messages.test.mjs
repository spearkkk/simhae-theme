import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('Korean and English provide identical message keys',()=>{
 const read=locale=>JSON.parse(readFileSync(new URL(`../web/src/messages/${locale}.json`,import.meta.url),'utf8'));
 const flatten=(obj,prefix='')=>Object.entries(obj).flatMap(([key,value])=>typeof value==='object'?flatten(value,`${prefix}${key}.`):[`${prefix}${key}`]).sort();
 assert.deepEqual(flatten(read('en')),flatten(read('ko')));
});
