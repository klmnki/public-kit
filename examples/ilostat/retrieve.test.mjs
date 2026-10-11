import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseCsv, selectRows, changes, DEFAULT_SELECTION, INDICATOR } from './retrieve.mjs';
const row = (time, value, extra = {}) => ({ref_area:'MDA', source:'BA:571', indicator:INDICATOR, sex:'SEX_T', time, obs_value:value, obs_status:'', ...extra});
test('CSV preserves quoted notes and UTF-8 BOM', () => {
  assert.deepEqual(parseCsv('\uFEFFcode,note\r\nA,"a, b and ""quote""\nnext"\r\n'), [{code:'A',note:'a, b and "quote"\nnext'}]);
  assert.throws(() => parseCsv('a,b\n1'), /width mismatch/);
});
test('missing values stay null and duplicate sources fail closed', () => {
  assert.equal(selectRows([row('2021','')])[0].value, null);
  assert.throws(() => selectRows([row('2021','1'), row('2021','2',{source:'OTHER'})]), /Ambiguous/);
  assert.throws(() => selectRows([row('2021','1',{classif1:'AGE_YTHADULT_Y15-29'})]), /classification/);
  assert.throws(() => selectRows([row('2021','NaN')]), /Invalid/);
});
test('change is in percentage points and missing or broken comparisons are withheld', () => {
  const selection={...DEFAULT_SELECTION,countries:['MDA']};
  assert.equal(changes(selectRows([row('2021','13.55'),row('2024','11.491')]), selection)[0].changePercentagePoints,-2.059);
  assert.equal(changes(selectRows([row('2021',''),row('2024','11.491')]), selection)[0].changePercentagePoints,null);
  assert.equal(changes(selectRows([row('2021','13.55'),row('2022','14',{obs_status:'B'}),row('2024','11.491')]), selection)[0].changePercentagePoints,null);
  assert.equal(changes(selectRows([row('2021','13.55'),row('2024','11.491',{source:'NEW'})]), selection)[0].changePercentagePoints,null);
});
test('empty selection creates no invented zero', () => {
  const selected=selectRows([row('2021','13.55')], {...DEFAULT_SELECTION,countries:['ZZZ']});
  assert.deepEqual(selected,[]);
  assert.equal(changes(selected,{...DEFAULT_SELECTION,countries:['ZZZ']})[0].changePercentagePoints,null);
});
test('shipped extract has complete unique cells, source notes and reproducible arithmetic', async () => {
  const snapshot=JSON.parse(await readFile(new URL('./snapshots/2026-10-11-mda-geo-srb-2021-2024.json',import.meta.url),'utf8'));
  assert.equal(snapshot.rows.length,12);
  assert.equal(new Set(snapshot.rows.map(r=>r.ref_area+'/'+r.year)).size,12);
  assert.deepEqual(snapshot.missing,[]);
  assert.deepEqual(snapshot.changes,changes(snapshot.rows,snapshot.selection));
  assert.ok(snapshot.rows.every(r=>r.note_source==='R1:3513' && r.sourceLabel==='LFS - Labour Force Survey'));
  assert.ok(snapshot.requests.every(r=>r.status===200 && /^[a-f0-9]{64}$/.test(r.sha256)));
});
