import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {compareOptions,demoOptions} from '../lib/model.mjs';

test('changing priorities reverses the preferred option',()=>{
  assert.equal(compareOptions(demoOptions,{budget:60,weight:0})[0].id,'shade');
  assert.equal(compareOptions(demoOptions,{budget:60,weight:1})[0].id,'cooling');
});
test('budget keeps rejected options visible and handles no feasible option',()=>{
  const rows=compareOptions(demoOptions,{budget:30,weight:0.5});
  assert.equal(rows[0].id,'visits');assert.equal(rows.filter(r=>r.feasible).length,1);assert.equal(rows.length,3);
  assert.equal(compareOptions(demoOptions,{budget:24,weight:0.5}).filter(r=>r.rank!==null).length,0);
});
test('worked example agrees with hand calculation and preserves ties',()=>{
  const rows=compareOptions(demoOptions,{budget:60,weight:0.5});
  assert.equal(rows.find(r=>r.id==='shade').score,60);assert.equal(rows.find(r=>r.id==='cooling').score,72.5);assert.equal(rows.find(r=>r.id==='visits').score,55);
  const tied=compareOptions(demoOptions,{budget:60,weight:30/85});assert.equal(tied[0].rank,1);assert.equal(tied[1].rank,1);
});
test('invalid assumptions fail explicitly',()=>{
  for(const weight of [-1,2,NaN,Infinity])assert.throws(()=>compareOptions(demoOptions,{budget:60,weight}));
  assert.throws(()=>compareOptions(demoOptions,{budget:-1,weight:0.5}));
  assert.throws(()=>compareOptions([{id:'x',name:'X',cost:1,reach:null,targeting:30}],{budget:60,weight:0.5}));
});
test('the standalone skill contains every source and no required local dependency',async()=>{
  const skill=await readFile(new URL('../SKILL.md',import.meta.url),'utf8');
  const {sources}=JSON.parse(await readFile(new URL('../data/catalogue.json',import.meta.url),'utf8'));
  assert.equal(sources.length,27);assert.equal(new Set(sources.map(s=>s.id)).size,27);
  assert.equal(sources.filter(s=>s.accessClass==='account-or-project').length,9);
  for(const s of sources){assert.ok(skill.includes(s.documentationUrl),s.name);assert.ok(s.limitation||s.watchFor);assert.equal(new URL(s.documentationUrl).protocol,'https:');}
  assert.equal([...skill.matchAll(/\]\((?!https:\/\/|#)([^)]+)\)/g)].length,0,'No links to missing local reference files');
  assert.ok(skill.startsWith('---\nname: public-kit\n'));assert.ok(skill.includes('Copyright (c) 2026 Ievgen Kylymnyk'));
});
