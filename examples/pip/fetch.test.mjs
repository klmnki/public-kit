import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compare, fetchJson, normalizeRows, one, requireVersion, VERSIONS } from './fetch.mjs';

const saved = JSON.parse(await readFile(new URL('./snapshot.json', import.meta.url), 'utf8'));
const geo2020 = one(saved.rows, 'GEO', 2020, VERSIONS.september);
const geo2024 = one(saved.rows, 'GEO', 2024, VERSIONS.september);
const worldMarch = one(saved.rows, 'WLD', 2024, VERSIONS.march);
const worldSeptember = one(saved.rows, 'WLD', 2024, VERSIONS.september);
const version = requireVersion(saved.versions, VERSIONS.september);
const expected = { entity: 'GEO', years: [2020, 2024], maxRows: 2, kind: 'country' };
const raw = saved.requests.find(request => request.id === 'georgia').response;

test('saved country responses support the period change without mixing releases', () => {
  assert.equal(compare(geo2020, geo2024, 'change').differencePercentagePoints, -7.75);
  assert.equal(geo2020.surveyComparability, geo2024.surveyComparability);
  assert.equal(geo2024.headcountPercent, 4.23);
});
test('same-year revision uses published counts, not rounded-rate multiplication', () => {
  const result = compare(worldMarch, worldSeptember, 'revision');
  assert.equal(result.differencePercentagePoints, -0.28);
  assert.equal(result.differencePeople, -22463775);
  assert.notEqual(worldSeptember.headcountFraction * worldSeptember.reportingPopulation, worldSeptember.peopleInPoverty);
});
test('a revision cannot be mislabelled as change, or different years as revision', () => {
  assert.throws(() => compare(worldMarch, worldSeptember, 'change'), /one release/);
  assert.throws(() => compare(geo2020, geo2024, 'revision'), /same year/);
  assert.throws(() => compare(worldSeptember, worldMarch, 'revision'), /earlier\/later/);
});
test('incompatible PPP, poverty line, welfare and coverage are rejected', () => {
  for (const [key, value] of [['pppYear', 2017], ['povertyLine', 2.15], ['welfareType', 'income'], ['surveyCoverage', 'urban']]) {
    assert.throws(() => compare(geo2020, { ...geo2024, [key]: value }, 'change'), /mismatch/);
  }
  assert.throws(() => compare(geo2020, { ...geo2024, comparableSpell: 'different' }, 'change'), /comparability/);
});
test('missing observations and duplicates cannot silently become a result', () => {
  assert.deepEqual(normalizeRows([], version, expected), []);
  assert.throws(() => one([], 'GEO', 2024, version.version), /received 0/);
  assert.throws(() => one([geo2024, geo2024], 'GEO', 2024, version.version), /received 2/);
});
test('null headcounts are not zero; genuine zero remains a valid value', () => {
  assert.throws(() => normalizeRows([{ ...raw[0], headcount: null }], version, expected), /headcount/);
  assert.equal(normalizeRows([{ ...raw[0], headcount: 0 }], version, expected)[0].headcountPercent, 0);
});
test('wrong response entity, nowcast and service error are rejected', () => {
  assert.throws(() => normalizeRows([{ ...raw[0], country_code: 'MDA' }], version, expected), /match/);
  assert.throws(() => normalizeRows([{ ...raw[0], estimate_type: 'nowcast' }], version, expected), /nowcasting/);
  assert.throws(() => normalizeRows({ error: 'bad request' }, version, expected), /service error/);
});
test('the PPP basis must be confirmed by the exact production version', () => {
  assert.equal(version.ppp_version, '2021');
  assert.throws(() => requireVersion([{ ...version, ppp_version: '2017' }], version.version), /not confirmed/);
  assert.throws(() => requireVersion(saved.versions, 'INVALID'), /not confirmed/);
});
test('HTTP errors and oversized streamed JSON fail without producing observations', async () => {
  await assert.rejects(fetchJson('https://example.invalid', { fetchImpl: async () => new Response('missing', { status: 404 }) }), /HTTP 404/);
  await assert.rejects(fetchJson('https://example.invalid', { maxBytes: 3, fetchImpl: async () => new Response('[1,2,3]', { headers: { 'content-type': 'application/json' } }) }), /byte limit/);
});
test('bounded JSON transport preserves an empty result', async () => {
  const response = await fetchJson('https://example.invalid', { fetchImpl: async () => new Response('[]', { headers: { 'content-type': 'application/json' } }) });
  assert.deepEqual(response.response, []);
});
