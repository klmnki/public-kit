#!/usr/bin/env node
// Node.js 22+, no packages. Run with --help for the bounded Eurostat example.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ENDPOINT = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m';
export const FILTERS = Object.freeze({ freq: 'M', geo: 'EU27_2020', sex: 'T', age: 'TOTAL', unit: 'PC_ACT', s_adj: 'SA' });
const MEASURE = 'Monthly unemployment rate, seasonally adjusted, total age and sex, EU27_2020';
const UNIT = 'Percentage of active population';
const MAX_MONTHS = 120;
const MAX_RESPONSE_BYTES = 2_000_000;
const HERE = dirname(fileURLToPath(import.meta.url));

function monthNumber(value) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value ?? '')) throw new Error(`Expected YYYY-MM; received ${value}`);
  const [year, month] = value.split('-').map(Number);
  return year * 12 + month - 1;
}

function monthsBetween(from, to) {
  const start = monthNumber(from), end = monthNumber(to);
  if (end < start || end - start + 1 > MAX_MONTHS) throw new Error('Choose an ordered range of 1–120 months.');
  return Array.from({ length: end - start + 1 }, (_, n) => {
    const month = start + n;
    return `${Math.floor(month / 12).toString().padStart(4, '0')}-${(month % 12 + 1).toString().padStart(2, '0')}`;
  });
}

export function buildRequest({ last = 3, from, to } = {}) {
  const url = new URL(ENDPOINT);
  url.searchParams.set('lang', 'en');
  for (const [key, value] of Object.entries(FILTERS)) url.searchParams.set(key, value);
  let window;
  if (from !== undefined || to !== undefined) {
    if (!from || !to) throw new Error('Supply both --from and --to.');
    monthsBetween(from, to);
    url.searchParams.set('sinceTimePeriod', from);
    url.searchParams.set('untilTimePeriod', to);
    window = { kind: 'fixed', from, to };
  } else {
    if (!Number.isInteger(last) || last < 1 || last > MAX_MONTHS) throw new Error('--last must be an integer from 1 to 120.');
    url.searchParams.set('lastTimePeriod', String(last));
    window = { kind: 'latest', periods: last };
  }
  return { url: url.href, filters: { ...FILTERS }, window };
}

function orderedCodes(dimension, size) {
  const index = dimension?.category?.index;
  const pairs = Array.isArray(index) ? index.map((code, i) => [code, i]) : Object.entries(index ?? {});
  if (pairs.length !== size || pairs.some(([, n]) => !Number.isInteger(n) || n < 0 || n >= size)
      || new Set(pairs.map(([, n]) => n)).size !== size) throw new Error('Invalid JSON-stat category index.');
  return pairs.sort((a, b) => a[1] - b[1]).map(([code]) => code);
}

export function decodeDataset(data, request, retrievedAt = new Date().toISOString()) {
  if (data.error) throw new Error(`Eurostat API error: ${JSON.stringify(data.error)}`);
  if (data.class !== 'dataset' || data.version !== '2.0' || !Array.isArray(data.id) || !Array.isArray(data.size)
      || data.id.length !== data.size.length || new Set(data.id).size !== data.id.length) throw new Error('Expected a JSON-stat 2.0 dataset.');
  if (data.size.some(n => !Number.isInteger(n) || n < 0)) throw new Error('Invalid dimension size.');
  if (data.size.some(n => n === 0)) throw new Error('No observations returned; no snapshot saved.');
  const expectedIds = [...Object.keys(FILTERS), 'time'].sort();
  if (JSON.stringify([...data.id].sort()) !== JSON.stringify(expectedIds)) throw new Error('Unexpected dataset dimensions.');
  const codes = Object.fromEntries(data.id.map((id, i) => [id, orderedCodes(data.dimension?.[id], data.size[i])]));
  for (const [id, code] of Object.entries(FILTERS)) {
    if (codes[id].length !== 1 || codes[id][0] !== code) throw new Error(`Series identity mismatch for ${id}.`);
  }
  if (data.source !== 'ESTAT') throw new Error('Unexpected dataset source.');
  const times = codes.time;
  times.forEach(monthNumber);
  if (times.length > MAX_MONTHS) throw new Error('Response exceeded the 120-month bound.');
  const count = data.size.reduce((a, b) => a * b, 1);
  for (const field of ['value', 'status']) {
    for (const key of Object.keys(data[field] ?? {})) {
      if (!/^\d+$/.test(key) || Number(key) >= count) throw new Error(`Invalid ${field} index.`);
    }
  }
  // JSON-stat varies its last dimension fastest. Read actual positions, never object-key order.
  const timePosition = data.id.indexOf('time');
  const timeStride = data.size.slice(timePosition + 1).reduce((a, b) => a * b, 1);
  let rows = times.map((period, i) => {
    const index = i * timeStride;
    const value = data.value?.[index] ?? null;
    if (value !== null && (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100)) throw new Error('Invalid unemployment percentage.');
    const status = data.status?.[index] ?? null;
    if (status !== null && typeof status !== 'string') throw new Error('Invalid statistical status flag.');
    return { period, value, status, presentInResponse: true };
  }).sort((a, b) => a.period.localeCompare(b.period));
  if (request.window.kind === 'fixed') {
    const periods = monthsBetween(request.window.from, request.window.to);
    if (rows.some(row => !periods.includes(row.period))) throw new Error('Response contains periods outside the request.');
    const indexed = new Map(rows.map(row => [row.period, row]));
    rows = periods.map(period => indexed.get(period) ?? { period, value: null, status: null, presentInResponse: false });
  } else if (rows.length > request.window.periods) throw new Error('Response exceeds the requested latest window.');
  if (!rows.some(row => row.value !== null)) throw new Error('No numeric observations returned; no snapshot saved.');
  return {
    schemaVersion: 1,
    identity: { source: 'ESTAT', endpoint: ENDPOINT, dataset: 'une_rt_m', dimensions: { ...FILTERS }, measure: MEASURE, unit: UNIT },
    source: {
      publisher: 'Eurostat, European Commission', datasetCode: 'une_rt_m', label: data.label ?? null,
      updated: data.updated ?? null, dataBrowser: 'https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table?lang=en',
      documentation: 'https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-detailed-guidelines/api-statistics',
    },
    request, retrievedAt, measure: MEASURE, unit: UNIT,
    dimensionLabels: Object.fromEntries(Object.keys(FILTERS).map(id => [id, data.dimension[id].category.label?.[FILTERS[id]] ?? FILTERS[id]])),
    rows,
    limitations: [
      'EU aggregate; this series does not describe a country, municipality or subgroup.',
      'Percentage of the active population, seasonally adjusted. Changes in rates use percentage points.',
      'Eurostat may revise values and flags. A comparison detects changes only in periods fetched in both snapshots.',
      'Missing values remain null. A period outside a later query window does not imply a withdrawn observation.',
      'The latest window follows Eurostat dataset time categories; inspect returned dates and missing values.',
      'Equal displayed rates do not establish that unemployment counts or underlying unrounded estimates stayed constant.',
    ],
  };
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}

function validateSnapshot(snapshot) {
  const timestamp = snapshot.retrievedAt;
  const epoch = typeof timestamp === 'string' ? Date.parse(timestamp) : NaN;
  const normalized = typeof timestamp === 'string' && timestamp.length === 20 ? timestamp.replace(/Z$/, '.000Z') : timestamp;
  if (typeof timestamp !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(timestamp)
      || !Number.isFinite(epoch) || new Date(epoch).toISOString() !== normalized) throw new Error('Invalid retrievedAt timestamp; expected a valid UTC ISO timestamp.');
  if (snapshot.schemaVersion !== 1 || !snapshot.identity || snapshot.measure !== MEASURE || snapshot.unit !== UNIT || !Array.isArray(snapshot.rows)) throw new Error('Invalid snapshot metadata.');
  const expected = { source: 'ESTAT', endpoint: ENDPOINT, dataset: 'une_rt_m', dimensions: { ...FILTERS }, measure: MEASURE, unit: UNIT };
  if (JSON.stringify(canonical(snapshot.identity)) !== JSON.stringify(canonical(expected))) throw new Error('Snapshot series identity mismatch.');
  const seen = new Set();
  for (const row of snapshot.rows) {
    monthNumber(row.period);
    if (seen.has(row.period)) throw new Error('Duplicate period in snapshot.');
    seen.add(row.period);
    if (row.value !== null && (typeof row.value !== 'number' || !Number.isFinite(row.value) || row.value < 0 || row.value > 100)) throw new Error('Invalid snapshot value.');
    if (row.status !== null && typeof row.status !== 'string') throw new Error('Invalid snapshot status.');
  }
}

function difference(current, previous) {
  return Number((current - previous).toFixed(10));
}

export function compareSnapshots(previous, current) {
  validateSnapshot(previous); validateSnapshot(current);
  const previousTime = Date.parse(previous.retrievedAt), currentTime = Date.parse(current.retrievedAt);
  if (currentTime < previousTime) throw new Error('Current snapshot predates the previous snapshot.');
  const orderedRows = snapshot => canonical([...snapshot.rows].sort((a, b) => a.period.localeCompare(b.period)));
  if (currentTime === previousTime && JSON.stringify(orderedRows(previous)) !== JSON.stringify(orderedRows(current))) {
    throw new Error('Equal retrieval timestamps require identical observations; their revision order is unknown.');
  }
  const earlier = new Map(previous.rows.map(row => [row.period, row]));
  const currentPeriods = new Set(current.rows.map(row => row.period));
  const result = { previousRetrievedAt: previous.retrievedAt, currentRetrievedAt: current.retrievedAt,
    newObservations: [], revisedObservations: [], newlyAvailableValues: [], newlyMissingValues: [], statusChanges: [],
    unchangedPeriods: [], missingPeriods: [], outsideCurrentWindow: previous.rows.filter(row => !currentPeriods.has(row.period)).map(row => row.period) };
  for (const row of current.rows) {
    const old = earlier.get(row.period);
    if (row.value === null) result.missingPeriods.push(row.period);
    if (!old) {
      if (row.value !== null) result.newObservations.push(row);
      continue;
    }
    if (old.value === null && row.value !== null) result.newlyAvailableValues.push(row);
    else if (old.value !== null && row.value === null) result.newlyMissingValues.push({ period: row.period, previousValue: old.value });
    else if (old.value !== row.value) result.revisedObservations.push({ period: row.period, previousValue: old.value, currentValue: row.value, changePercentagePoints: difference(row.value, old.value) });
    else if (old.status === row.status) result.unchangedPeriods.push(row.period);
    if (old.status !== row.status) result.statusChanges.push({ period: row.period, previousStatus: old.status, currentStatus: row.status });
  }
  return result;
}

export async function fetchDataset(request, { timeoutMs = 20000, fetchImpl = fetch } = {}) {
  const controller = new AbortController();
  const signal = AbortSignal.any([AbortSignal.timeout(timeoutMs), controller.signal]);
  const response = await fetchImpl(request.url, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Eurostat HTTP ${response.status}; no snapshot saved.`);
  const sizeError = () => new Error('Response exceeded the 2,000,000-byte example limit; no snapshot saved.');
  const advertisedLength = response.headers.get('content-length');
  if (advertisedLength !== null && /^\d+$/.test(advertisedLength) && Number(advertisedLength) > MAX_RESPONSE_BYTES) {
    const error = sizeError();
    controller.abort(error);
    await response.body?.cancel(error).catch(() => {});
    throw error;
  }
  if (!response.body) throw new Error('Eurostat returned an empty body; no snapshot saved.');
  const reader = response.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_RESPONSE_BYTES) {
        const error = sizeError();
        controller.abort(error);
        await reader.cancel(error).catch(() => {});
        throw error;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  const text = new TextDecoder().decode(bytes);
  try { return JSON.parse(text); } catch { throw new Error('Eurostat returned invalid JSON; no snapshot saved.'); }
}

export function parseArgs(args) {
  const options = {};
  const allowed = new Set(['--last', '--from', '--to', '--previous', '--out-dir', '--timeout-ms']);
  for (let i = 0; i < args.length; i++) {
    const flag = args[i];
    if (!allowed.has(flag) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Unknown or incomplete option: ${flag}`);
    const key = flag.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (options[key] !== undefined) throw new Error(`Repeated option: ${flag}`);
    options[key] = ['last', 'timeoutMs'].includes(key) ? Number(args[++i]) : args[++i];
  }
  if (options.last !== undefined && (options.from || options.to)) throw new Error('Use --last OR --from/--to.');
  if (options.timeoutMs !== undefined && (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 1 || options.timeoutMs > 60000)) throw new Error('--timeout-ms must be between 1 and 60000.');
  return options;
}

export async function main(args = process.argv.slice(2)) {
  if (args.length === 1 && args[0] === '--help') {
    console.log('node examples/eurostat/unemployment.mjs [--last 3 | --from YYYY-MM --to YYYY-MM] [--previous FILE] [--out-dir DIR] [--timeout-ms 20000]');
    return;
  }
  const options = parseArgs(args);
  const request = buildRequest(options);
  const previous = options.previous ? JSON.parse(await readFile(resolve(options.previous), 'utf8')) : null;
  if (previous) validateSnapshot(previous);
  const data = await fetchDataset(request, options);
  const snapshot = decodeDataset(data, request);
  if (previous) snapshot.comparison = compareSnapshots(previous, snapshot);
  const outputDirectory = resolve(options.outDir ?? resolve(HERE, 'snapshots'));
  await mkdir(outputDirectory, { recursive: true });
  const file = resolve(outputDirectory, `eu-unemployment-${snapshot.retrievedAt.replace(/[:.]/g, '-')}.json`);
  await writeFile(file, `${JSON.stringify(snapshot, null, 2)}\n`, { flag: 'wx' });
  console.log(`Saved ${file}`);
  for (const row of snapshot.rows) console.log(`${row.period}: ${row.value === null ? 'missing' : `${row.value}%`}${row.status ? ` [${row.status}]` : ''}`);
  if (snapshot.comparison) console.log(JSON.stringify(snapshot.comparison, null, 2));
  return { file, snapshot };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.name === 'TimeoutError' ? 'Eurostat request timed out; no snapshot saved.' : error.message); process.exitCode = 1; });
}
