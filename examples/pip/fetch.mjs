import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const API = 'https://api.worldbank.org/pip/v1/';
export const VERSIONS = { march: '20260324_2021_01_02_PROD', september: '20260922_2021_01_02_PROD' };
const MAX_BYTES = 256 * 1024;
const TIMEOUT_MS = 25000;

export function requestUrl(endpoint, params = {}) {
  const url = new URL(endpoint, API);
  url.search = new URLSearchParams(params).toString();
  return url.href;
}

export async function fetchJson(url, { fetchImpl = fetch, maxBytes = MAX_BYTES, timeoutMs = TIMEOUT_MS } = {}) {
  const response = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs), headers: { Accept: 'application/json' }, redirect: 'error' });
  if (!response.ok) {
    await response.body?.cancel();
    const error = new Error(`HTTP ${response.status} from ${url}`);
    error.status = response.status;
    throw error;
  }
  if (!response.headers.get('content-type')?.includes('json')) {
    await response.body?.cancel();
    throw new Error('Expected JSON content type');
  }
  if (Number(response.headers.get('content-length')) > maxBytes) {
    await response.body?.cancel();
    throw new Error('Response exceeds byte limit');
  }
  if (!response.body) throw new Error('Missing response body');
  const reader = response.body.getReader();
  const chunks = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maxBytes) { await reader.cancel(); throw new Error('Response exceeds byte limit'); }
    chunks.push(value);
  }
  return { status: response.status, bytes, response: JSON.parse(Buffer.concat(chunks).toString('utf8')) };
}

export function requireVersion(versions, version) {
  if (!Array.isArray(versions)) throw new Error('Expected a version array');
  const matches = versions.filter(row => row.version === version);
  if (matches.length !== 1 || matches[0].ppp_version !== '2021' || matches[0].identity !== 'PROD') {
    throw new Error('Requested production version with 2021 PPP basis not confirmed');
  }
  return matches[0];
}

export function normalizeRows(data, versionInfo, expected) {
  if (!Array.isArray(data)) throw new Error('Expected an observation array, not a service error');
  if (data.length > expected.maxRows) throw new Error('Unexpected row count');
  return data.map(raw => {
    if (typeof raw.headcount !== 'number' || !Number.isFinite(raw.headcount) || raw.headcount < 0 || raw.headcount > 1) throw new Error('Missing or invalid headcount');
    const entity = raw.country_code ?? raw.region_code;
    if (entity !== expected.entity || !expected.years.includes(raw.reporting_year) || raw.poverty_line !== 3) throw new Error('Response does not match the requested entity, year or poverty line');
    if (expected.kind === 'country' && (raw.reporting_level !== 'national' || raw.survey_coverage !== 'national' || raw.welfare_type !== 'consumption' || raw.estimation_type !== 'survey' || raw.survey_year !== raw.reporting_year || raw.is_interpolated !== false || /nowcast/i.test(raw.estimate_type ?? ''))) throw new Error('Expected national consumption survey estimates without interpolation or nowcasting');
    if (expected.kind === 'aggregate' && raw.estimate_type !== 'actual') throw new Error('Expected provider actual flag for aggregate');
    return {
      entity, name: raw.country_name ?? raw.region_name, kind: expected.kind,
      reportingYear: raw.reporting_year, surveyYear: raw.survey_year ?? null,
      version: versionInfo.version, releaseVersion: versionInfo.release_version,
      pppYear: Number(versionInfo.ppp_version), povertyLine: raw.poverty_line,
      headcountFraction: raw.headcount, headcountPercent: Number((raw.headcount * 100).toFixed(8)),
      peopleInPoverty: raw.pop_in_poverty ?? null, reportingPopulation: raw.reporting_pop ?? null,
      welfareType: raw.welfare_type ?? null, reportingLevel: raw.reporting_level ?? null,
      surveyCoverage: raw.survey_coverage ?? null, surveyAcronym: raw.survey_acronym ?? null,
      surveyComparability: raw.survey_comparability ?? null, comparableSpell: raw.comparable_spell ?? null,
      estimationType: raw.estimation_type ?? null, estimateType: raw.estimate_type ?? null,
      isInterpolated: raw.is_interpolated ?? null,
      nowcast: expected.kind === 'country' ? false : /nowcast/i.test(raw.estimate_type ?? ''),
      pppConversionFactor: raw.ppp ?? null
    };
  });
}

export function one(rows, entity, year, version) {
  const found = rows.filter(row => row.entity === entity && row.reportingYear === year && row.version === version);
  if (found.length !== 1) throw new Error(`Expected one matching row; received ${found.length}`);
  return found[0];
}

export function compare(before, after, kind) {
  for (const key of ['entity', 'kind', 'pppYear', 'povertyLine', 'welfareType', 'reportingLevel', 'surveyCoverage']) {
    if (before[key] !== after[key]) throw new Error(`Comparison mismatch: ${key}`);
  }
  if (kind === 'change') {
    if (before.version !== after.version || before.reportingYear >= after.reportingYear || before.nowcast || after.nowcast) throw new Error('Time change requires one release and increasing non-nowcast years');
    if (before.kind === 'country' && (before.surveyComparability !== after.surveyComparability || before.comparableSpell !== after.comparableSpell)) throw new Error('Survey comparability differs');
  } else if (kind === 'revision') {
    if (before.reportingYear !== after.reportingYear || before.version === after.version || before.releaseVersion >= after.releaseVersion) throw new Error('Revision requires the same year and an earlier/later release');
  } else throw new Error('Unknown comparison kind');
  if (![before.headcountFraction, after.headcountFraction].every(value => typeof value === 'number' && Number.isFinite(value))) throw new Error('Missing comparison value');
  return {
    kind, entity: before.entity, fromYear: before.reportingYear, toYear: after.reportingYear,
    fromVersion: before.version, toVersion: after.version,
    beforePercent: before.headcountPercent, afterPercent: after.headcountPercent,
    differencePercentagePoints: Number(((after.headcountFraction - before.headcountFraction) * 100).toFixed(8)),
    differencePeople: before.peopleInPoverty === null || after.peopleInPoverty === null ? null : after.peopleInPoverty - before.peopleInPoverty
  };
}

export async function run() {
  const retrievedAt = new Date().toISOString();
  const requests = [];
  async function get(id, endpoint, params) {
    const url = requestUrl(endpoint, params);
    const result = await fetchJson(url);
    requests.push({ id, url, retrievedAt: new Date().toISOString(), ...result });
    return result.response;
  }
  const versionList = await get('versions', 'versions');
  const march = requireVersion(versionList, VERSIONS.march);
  const september = requireVersion(versionList, VERSIONS.september);
  const countryParams = { country: 'GEO', year: '2020,2024', povline: '3', version: september.version, fill_gaps: 'false', reporting_level: 'national', welfare_type: 'consumption', format: 'json' };
  const country = await get('georgia', 'pip', countryParams);
  const rows = normalizeRows(country, september, { kind: 'country', entity: 'GEO', years: [2020, 2024], maxRows: 2 });
  for (const [id, version] of [['world-march', march], ['world-september', september]]) {
    const response = await get(id, 'pip-grp', { country: 'all', year: '2024', povline: '3', version: version.version, group_by: 'world', format: 'json' });
    rows.push(...normalizeRows(response, version, { kind: 'aggregate', entity: 'WLD', years: [2024], maxRows: 1 }));
  }
  const comparisons = [
    compare(one(rows, 'GEO', 2020, september.version), one(rows, 'GEO', 2024, september.version), 'change'),
    compare(one(rows, 'WLD', 2024, march.version), one(rows, 'WLD', 2024, september.version), 'revision')
  ];
  const negativeUrl = requestUrl('pip', { country: 'GEO', year: '2024', povline: '3', version: 'INVALID', format: 'json' });
  let negativeCheck;
  try { await fetchJson(negativeUrl); throw new Error('Invalid version unexpectedly succeeded'); }
  catch (error) {
    if (error.status !== 404) throw error;
    negativeCheck = { url: negativeUrl, retrievedAt: new Date().toISOString(), status: error.status, result: 'Invalid version rejected; no observations inferred.' };
  }
  const snapshot = {
    id: 'pip-poverty-change-and-revision',
    question: 'How did extreme poverty change in Georgia from 2020 to 2024, and how did the March and September 2026 releases revise the global estimate for 2024?',
    source: { name: 'World Bank Poverty and Inequality Platform', url: 'https://pip.worldbank.org/', documentation: 'https://pip.worldbank.org/api', clientDocumentation: 'https://github.com/worldbank/pipr/blob/main/R/get_stats.R', licence: 'CC BY 4.0', licenceUrl: 'https://datacatalog.worldbank.org/search/dataset/0038020/poverty-and-equity-database-poverty-and-inequality-platform' },
    retrievedAt, kind: 'saved live response',
    measure: 'Poverty headcount below $3.00 per person per day, 2021 purchasing power parity',
    unit: 'percent of population; differences in percentage points; published counts in people',
    versions: [march, september], rows, comparisons, requests, negativeCheck,
    limitations: [
      'Pinned release versions confirm the 2021 PPP basis through /versions. The observation field ppp is a conversion factor, not a year.',
      'The March API version is dated 20260324; the accompanying public update was published on 26 March 2026.',
      'Georgia rows are national consumption survey estimates with the same comparability spell, no interpolation and matching survey/reporting years. They are not causal programme-impact estimates.',
      'World actual is the provider estimate_type label for its historical aggregate. It does not mean every country component was directly observed in 2024.',
      'A same-year revision across releases is not a change in poverty between their publication dates.',
      'Rates use the precision returned by the API. Published people-in-poverty counts are retained directly; multiplying the rounded headcount by population would give a different count.',
      'The example uses the international extreme-poverty line, not national poverty lines or a general measure of deprivation.',
      'Four numeric rows and one negative request were checked. Other countries, poverty lines, nowcasts and access patterns are outside this example.'
    ]
  };
  await writeFile(new URL('snapshot.json', import.meta.url), JSON.stringify(snapshot, null, 2) + '\n');
  console.log(JSON.stringify({ output: 'examples/pip/snapshot.json', retrievedAt, rows: rows.length, comparisons, negativeCheck }, null, 2));
  return snapshot;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch(error => { console.error(error.message); process.exitCode = 1; });
}

