import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {readWorldBankPage,compareEndpoints} from '../lib/observations.mjs';
const example=JSON.parse(await readFile(new URL('../data/verified-example.json',import.meta.url),'utf8'));
test('real response retains observations, nulls and source footnotes',()=>{
  const rows=readWorldBankPage(example.response);assert.equal(rows.length,15);
  assert.equal(rows.find(r=>r.country==='GEO'&&r.year===2024).value,3812518);
  assert.match(rows.find(r=>r.country==='GEO'&&r.year===2024).footnote,/2024 census/);
  const missing=structuredClone(example.response);missing[1][0].value=null;assert.equal(readWorldBankPage(missing).find(r=>r.country===missing[1][0].countryiso3code&&r.year===Number(missing[1][0].date)).value,null);
});
test('a truncated or invalid response cannot silently become a complete table',()=>{
  const partial=structuredClone(example.response);partial[0].pages=2;assert.throws(()=>readWorldBankPage(partial),/Incomplete/);
  const duplicate=structuredClone(example.response);duplicate[1][1]=duplicate[1][0];assert.throws(()=>readWorldBankPage(duplicate),/Duplicate/);
  assert.throws(()=>readWorldBankPage([{message:[{value:'Invalid indicator'}]}]));
});
test('endpoint change matches arithmetic without inferring a cause',()=>{
  const summary=compareEndpoints(readWorldBankPage(example.response),2020,2024);
  assert.equal(summary.find(r=>r.country==='MDA').changePercent,(2402306-2635130)/2635130*100);
  assert.equal(summary.find(r=>r.country==='SRB').start,6899126);
});
test('missing endpoints and zero baselines have no fabricated percentage',()=>{
  assert.equal(compareEndpoints([{country:'ABC',name:'Example',year:2020,value:null},{country:'ABC',name:'Example',year:2024,value:5}],2020,2024)[0].changePercent,null);
  assert.equal(compareEndpoints([{country:'ABC',name:'Example',year:2020,value:0},{country:'ABC',name:'Example',year:2024,value:5}],2020,2024)[0].changePercent,null);
});
test('portable skill includes retained institutional sources and excludes removed providers',async()=>{
  const skill=await readFile(new URL('../SKILL.md',import.meta.url),'utf8');
  const {sources}=JSON.parse(await readFile(new URL('../data/catalogue.json',import.meta.url),'utf8'));
  assert.equal(sources.length,18);assert.equal(new Set(sources.map(s=>s.id)).size,18);
  for(const source of sources){assert.ok(skill.includes(source.documentationUrl),source.name);assert.ok(source.operator);assert.ok(source.request||source.discovery);}
  for(const name of ['Tavily','Mapbox','Open-Meteo','OpenAlex','OpenAQ','Frankfurter','Crossref','Google Earth Engine','Azure AI','GDELT','OpenStreetMap'])assert.ok(!skill.includes(name),name);
  assert.equal([...skill.matchAll(/\]\((?!https:\/\/|#)([^)]+)\)/g)].length,0);
  assert.match(skill,/^---\r?\nname: public-kit\r?\n/);
  assert.ok(!skill.includes('Public API Marketplace'));
});
