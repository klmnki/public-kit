import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';

export const INDICATOR = 'SDG_0861_SEX_RT';
const BASE = 'https://rplumber.ilo.org';
const HERE = dirname(fileURLToPath(import.meta.url));
const MAX_BYTES = 16 * 1024 * 1024;
export const DEFAULT_SELECTION = { countries: ['MDA', 'GEO', 'SRB'], start: 2021, end: 2024, sex: 'SEX_T' };

// CSV parser supports quoted commas, escaped quotes and embedded newlines.
export function parseCsv(text) {
  text = text.replace(/^\uFEFF/, '');
  const records = []; let record = []; let field = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (c === ',' && !quoted) { record.push(field); field = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      record.push(field); if (record.some(v => v !== '')) records.push(record);
      record = []; field = '';
    } else field += c;
  }
  if (quoted) throw new Error('Unterminated quoted CSV field');
  record.push(field); if (record.some(v => v !== '')) records.push(record);
  const headers = records.shift();
  if (!headers || new Set(headers).size !== headers.length) throw new Error('Missing or duplicate CSV headers');
  return records.map((values, i) => {
    if (values.length !== headers.length) throw new Error(`CSV width mismatch at record ${i + 2}`);
    return Object.fromEntries(headers.map((h, j) => [h, values[j]]));
  });
}

export function selectRows(raw, selection = DEFAULT_SELECTION) {
  const seen = new Set();
  return raw.filter(r => selection.countries.includes(r.ref_area) && r.indicator === INDICATOR &&
    r.sex === selection.sex && /^\d{4}$/.test(r.time) && +r.time >= selection.start && +r.time <= selection.end)
    .map(r => {
      // This example requires exactly one source/dimension row per country/year.
      const key = `${r.ref_area}/${r.time}`;
      if (seen.has(key)) throw new Error(`Ambiguous country/year ${key}: select a source and all dimensions explicitly`);
      seen.add(key);
      if (r.classif1 || r.classif2) throw new Error(`Unexpected classification in ${key}`);
      const value = r.obs_value.trim() === '' ? null : Number(r.obs_value);
      if (value !== null && (!Number.isFinite(value) || value < 0 || value > 100)) throw new Error(`Invalid percentage in ${key}`);
      return { ...r, year: +r.time, value };
    }).sort((a, b) => selection.countries.indexOf(a.ref_area) - selection.countries.indexOf(b.ref_area) || a.year - b.year);
}

export function changes(rows, selection) {
  return selection.countries.map(country => {
    const series = rows.filter(r => r.ref_area === country);
    const first = series.find(r => r.year === selection.start);
    const last = series.find(r => r.year === selection.end);
    const breakInSeries = series.some(r => r.obs_status === 'B');
    const sourceChanged = new Set(series.map(r => r.source)).size > 1;
    const usable = first?.value != null && last?.value != null && !breakInSeries && !sourceChanged;
    return { country, startYear: selection.start, endYear: selection.end,
      startValue: first?.value ?? null, endValue: last?.value ?? null,
      changePercentagePoints: usable ? Math.round((last.value - first.value) * 1000) / 1000 : null,
      reason: usable ? null : breakInSeries ? 'Series break: change withheld' : sourceChanged ? 'Source changed: change withheld' : 'Missing endpoint observation' };
  });
}

async function fetchCsv(url, { gzip = false } = {}) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000), redirect: 'error' }).catch(error => { throw new Error('Request failed for ' + url + ': ' + error.message); });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  if (+(response.headers.get('content-length') || 0) > MAX_BYTES) throw new Error('Download exceeds 16 MiB bound');
  const chunks = []; let bytes = 0;
  for await (const chunk of response.body) {
    bytes += chunk.length;
    if (bytes > MAX_BYTES) throw new Error('Download exceeds 16 MiB bound');
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks);
  const decoded = gzip && body[0] === 0x1f && body[1] === 0x8b ? gunzipSync(body, { maxOutputLength: MAX_BYTES }) : body;
  const text = decoded.toString('utf8');
  if (/^\s*</.test(text)) throw new Error(`Unexpected HTML/XML instead of CSV: ${url}`);
  return { rows: parseCsv(text), request: { url, status: response.status, contentType: response.headers.get('content-type'), bytes, sha256: createHash('sha256').update(body).digest('hex') } };
}

function dictionaryRows(rows, codes) {
  return rows.filter(r => codes.has(Object.values(r)[0]));
}
function labels(rows) { return Object.fromEntries(rows.map(r => [Object.values(r)[0], Object.values(r)[1]])); }

export async function retrieve(selection = DEFAULT_SELECTION) {
  const requests = [];
  const download = await fetchCsv(`${BASE}/data/indicator?id=${INDICATOR}_A&format=.csv.gz`, { gzip: true });
  requests.push(download.request);
  const raw = selectRows(download.rows, selection);
  const metadata = {};
  const needed = {
    source: new Set(raw.map(r => r.source)),
    ref_area: new Set(selection.countries),
    indicator: new Set([INDICATOR]),
    note_source: new Set(raw.flatMap(r => r.note_source ? r.note_source.split('_') : [])),
    note_indicator: new Set(raw.flatMap(r => r.note_indicator ? r.note_indicator.split('_') : [])),
    obs_status: new Set(raw.map(r => r.obs_status).filter(Boolean))
  };
  for (const [name, codes] of Object.entries(needed)) {
    if (!codes.size) { metadata[name] = []; continue; }
    const result = await fetchCsv(`${BASE}/metadata/dic?var=${name}&lang=en&format=.csv`);
    requests.push(result.request); metadata[name] = dictionaryRows(result.rows, codes);
  }
  const countryLabels = labels(metadata.ref_area), sourceLabels = labels(metadata.source);
  const rows = raw.map(r => ({ ...r, country: countryLabels[r.ref_area] || r.ref_area, sourceLabel: sourceLabels[r.source] || r.source,
    observationType: /LFS|Labour Force Survey/i.test(sourceLabels[r.source] || '') ? 'Labour Force Survey estimate, processed by ILOSTAT' : /modelled|modeled/i.test(sourceLabels[r.source] || '') ? 'Modelled estimate' : 'Consult the retained source metadata' }));
  const missing = selection.countries.flatMap(country => Array.from({ length: selection.end - selection.start + 1 }, (_, i) => selection.start + i)
    .filter(year => !rows.some(r => r.ref_area === country && r.year === year && r.value !== null)).map(year => ({ country, year })));
  return {
    source: { name: 'ILOSTAT, International Labour Organization', documentation: 'https://ilostat.ilo.org/data/bulk/',
      catalogue: `${BASE}/files/website/bulk/indicator.html`, licence: 'CC BY 4.0 (ILO databases and datasets published from 3 May 2023)', licenceUrl: 'https://www.ilo.org/rights-and-permissions' },
    requests, retrievedAt: new Date().toISOString(),
    question: `How did the share of young people outside employment, education or training change in ${selection.countries.join(', ')} from ${selection.start} to ${selection.end}?`,
    measure: 'SDG 8.6.1: youth not in employment, education or training (NEET), ages 15–24, both sexes', unit: 'percent of youth aged 15–24',
    selection, status: rows.length ? 'data' : 'no_data', rows, changes: changes(rows, selection), missing, metadata,
    limitations: [
      'National percentages; no regional total or unweighted country average is calculated.',
      'The selected SDG survey series is distinct from ILO modelled estimates. Retain source and note codes; an empty flag is not proof that estimates are exact.',
      'ILOSTAT warns that this series can differ from nationally reported figures and the Global SDG Database because sources and reference years differ.',
      'Differences are percentage points, not percentage changes. A change does not establish its cause.',
      'NEET is not the unemployment rate: it also includes young people outside the labour force who are not in education or training.',
      'The CSV download contains more countries and years; only the stated extract is retained. Revisions can change a future retrieval.',
      'A missing row or value remains missing, never zero. Changes are withheld for missing endpoints, a B flag or a source change within the selected period.'
    ]
  };
}

function toCsv(rows) {
  if (!rows.length) return 'ref_area,year,value\n';
  const keys = Object.keys(rows[0]);
  const quote = value => '"' + String(value ?? '').replaceAll('"', '""') + '"';
  return [keys.map(quote).join(','), ...rows.map(r => keys.map(k => quote(r[k])).join(','))].join('\n') + '\n';
}

async function main() {
  const args = process.argv.slice(2);
  const option = name => { const index = args.indexOf(name); return index < 0 ? undefined : args[index + 1]; };
  const selection = { ...DEFAULT_SELECTION, countries: (option('--countries') || 'MDA,GEO,SRB').split(',').map(s => s.trim().toUpperCase()),
    start: Number(option('--start') || 2021), end: Number(option('--end') || 2024) };
  if (!selection.countries.length || selection.countries.some(c => !/^[A-Z]{3}$/.test(c)) || selection.countries.length > 5 ||
    !Number.isInteger(selection.start) || !Number.isInteger(selection.end) || selection.start < 1900 || selection.end < selection.start || selection.end - selection.start > 4) throw new Error('Select 1–5 ISO3 countries and 1–5 annual years');
  let result;
  if (option('--snapshot')) {
    if (args.some(a => ['--countries', '--start', '--end'].includes(a))) throw new Error('Snapshot replay preserves its original selection; omit selection flags');
    result = JSON.parse(await readFile(resolve(option('--snapshot')), 'utf8'));
    result = { ...result, mode: 'saved snapshot; no network refresh' };
  } else result = await retrieve(selection);
  if (args.includes('--save')) {
    if (option('--snapshot')) throw new Error('Cannot save a snapshot replay as a new retrieval');
    const folder = resolve(HERE, 'snapshots'); await mkdir(folder, { recursive: true });
    const name = `${result.retrievedAt.slice(0, 10)}-${selection.countries.join('-').toLowerCase()}-${selection.start}-${selection.end}`;
    await writeFile(resolve(folder, `${name}.json`), JSON.stringify(result, null, 2) + '\n');
    await writeFile(resolve(folder, `${name}.csv`), toCsv(result.rows));
  }
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}

