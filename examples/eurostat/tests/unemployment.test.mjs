import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRequest, compareSnapshots, decodeDataset, fetchDataset, parseArgs, FILTERS } from '../unemployment.mjs';

// Entirely synthetic fixtures for parser and revision tests. These values do not report Eurostat revisions.
function syntheticDataset() {
  const ids = ['time', 'geo', 'unit', 's_adj', 'age', 'sex', 'freq'];
  return {
    version: '2.0', class: 'dataset', source: 'ESTAT', label: 'SYNTHETIC TEST DATA', updated: '2026-10-01T00:00:00Z',
    id: ids, size: [3, 1, 1, 1, 1, 1, 1],
    dimension: Object.fromEntries(ids.map(id => [id, { category: {
      index: id === 'time' ? { '2026-08': 2, '2026-06': 0, '2026-07': 1 } : { [FILTERS[id]]: 0 },
      label: {},
    } }])), value: { 0: 6, 1: 0 }, status: { 0: 'p' },
  };
}

function snapshot() {
  return decodeDataset(syntheticDataset(), buildRequest({ from: '2026-06', to: '2026-08' }), '2026-10-01T00:00:00Z');
}

test('query fixes all dimensions and bounds the requested period', () => {
  const url = new URL(buildRequest().url);
  for (const [key, value] of Object.entries(FILTERS)) assert.equal(url.searchParams.get(key), value);
  assert.equal(url.searchParams.get('lastTimePeriod'), '3');
  assert.throws(() => buildRequest({ last: 121 }), /1 to 120/);
  assert.throws(() => buildRequest({ from: '2026-13', to: '2026-14' }), /YYYY-MM/);
  assert.throws(() => buildRequest({ from: '2026-08', to: '2026-06' }), /ordered/);
  assert.throws(() => parseArgs(['--last', '3', '--from', '2026-06', '--to', '2026-08']), /OR/);
});

test('decodes category positions, preserves zero, missing values and flags', () => {
  const value = snapshot();
  assert.deepEqual(value.rows.map(row => [row.period, row.value, row.status]), [
    ['2026-06', 6, 'p'], ['2026-07', 0, null], ['2026-08', null, null],
  ]);
});

test('fills an omitted requested month with null, never zero', () => {
  const data = syntheticDataset();
  data.size[0] = 2;
  data.dimension.time.category.index = { '2026-06': 0, '2026-08': 1 };
  const value = decodeDataset(data, buildRequest({ from: '2026-06', to: '2026-08' }));
  assert.deepEqual(value.rows[1], { period: '2026-07', value: null, status: null, presentInResponse: false });
});

test('rejects the wrong source, dimensions and malformed category positions', () => {
  const data = syntheticDataset();
  data.dimension.geo.category.index = { US: 0 };
  assert.throws(() => decodeDataset(data, buildRequest()), /identity mismatch/);
  data.dimension.geo.category.index = { EU27_2020: 0 };
  data.dimension.time.category.index['2026-08'] = 1;
  assert.throws(() => decodeDataset(data, buildRequest()), /category index/);
});

test('separates new periods, overlapping revisions, newly available values and flags', () => {
  const previous = snapshot(), current = structuredClone(previous);
  current.retrievedAt = '2026-10-02T00:00:00Z';
  current.rows[0] = { ...current.rows[0], value: 6.1, status: null };
  current.rows[2].value = 5.8;
  current.rows.push({ period: '2026-09', value: 5.7, status: null, presentInResponse: true });
  const changes = compareSnapshots(previous, current);
  assert.equal(changes.newObservations[0].period, '2026-09');
  assert.deepEqual(changes.revisedObservations, [{ period: '2026-06', previousValue: 6, currentValue: 6.1, changePercentagePoints: 0.1 }]);
  assert.equal(changes.newlyAvailableValues[0].period, '2026-08');
  assert.deepEqual(changes.statusChanges, [{ period: '2026-06', previousStatus: 'p', currentStatus: null }]);
  assert.deepEqual(changes.unchangedPeriods, ['2026-07']);
});

test('a rolling window does not imply withdrawal; a missing overlapping value is explicit', () => {
  const previous = snapshot(), current = structuredClone(previous);
  current.retrievedAt = '2026-10-02T00:00:00Z';
  current.rows = current.rows.slice(1);
  current.rows[0].value = null;
  const changes = compareSnapshots(previous, current);
  assert.deepEqual(changes.outsideCurrentWindow, ['2026-06']);
  assert.deepEqual(changes.newlyMissingValues, [{ period: '2026-07', previousValue: 0 }]);
  assert.deepEqual(changes.revisedObservations, []);
});

test('rejects metadata mismatch, duplicate periods and nonnumeric values', () => {
  for (const mutate of [
    value => { value.identity.dimensions.s_adj = 'NSA'; },
    value => { value.unit = 'Number'; },
    value => { value.rows.push(value.rows[0]); },
    value => { value.rows[0].value = '6'; },
  ]) {
    const changed = snapshot(); mutate(changed);
    assert.throws(() => compareSnapshots(snapshot(), changed));
  }
});

test('empty observations and API errors do not become a zero-valued snapshot', () => {
  const data = syntheticDataset(); data.value = {};
  assert.throws(() => decodeDataset(data, buildRequest()), /No numeric observations/);
  data.size[0] = 0;
  assert.throws(() => decodeDataset(data, buildRequest()), /No observations/);
  assert.throws(() => decodeDataset({ error: { status: 400, label: 'Synthetic error' } }, buildRequest()), /API error/);
});

test('HTTP errors, malformed JSON and bounded timeouts propagate without a snapshot', async () => {
  const request = buildRequest();
  await assert.rejects(fetchDataset(request, { fetchImpl: async () => new Response('Synthetic error', { status: 503 }) }), /HTTP 503/);
  await assert.rejects(fetchDataset(request, { fetchImpl: async () => new Response('not JSON') }), /invalid JSON/);
  let signal;
  await assert.rejects(fetchDataset(request, { timeoutMs: 5, fetchImpl: async (_url, options) => {
    signal = options.signal;
    await new Promise(resolve => setTimeout(resolve, 20));
    signal.throwIfAborted();
  } }), { name: 'TimeoutError' });
  assert.equal(signal.aborted, true);
});


test('rejects backwards or invalid retrieval times and ambiguous equal-time revisions', () => {
  const previous = snapshot(), current = structuredClone(previous);
  current.retrievedAt = '2026-09-30T23:59:59.999Z';
  current.rows[0].value = 7;
  assert.throws(() => compareSnapshots(previous, current), /predates/);
  for (const invalid of [undefined, 123, 'not-a-date', '2026-02-30T00:00:00Z', '2026-10-01']) {
    current.retrievedAt = invalid;
    assert.throws(() => compareSnapshots(previous, current), /timestamp/);
    assert.throws(() => compareSnapshots(current, previous), /timestamp/);
  }
  current.retrievedAt = previous.retrievedAt;
  assert.throws(() => compareSnapshots(previous, current), /Equal retrieval timestamps/);
  assert.deepEqual(compareSnapshots(previous, structuredClone(previous)).revisedObservations, []);
});

test('rejects oversized Content-Length before reading the stream and aborts the request', async () => {
  let pulls = 0, cancelled = false, signal;
  const stream = new ReadableStream({
    pull(controller) { pulls++; controller.enqueue(new Uint8Array(1)); },
    cancel() { cancelled = true; },
  }, { highWaterMark: 0 });
  await assert.rejects(fetchDataset(buildRequest(), { fetchImpl: async (_url, options) => {
    signal = options.signal;
    return new Response(stream, { headers: { 'Content-Length': '4000000' } });
  } }), /2,000,000-byte/);
  assert.equal(pulls, 0);
  assert.equal(cancelled, true);
  assert.equal(signal.aborted, true);
});

test('caps actual streamed bytes even with missing or misleading Content-Length', async () => {
  // Over 4 MB of UTF-8 bytes but about 2 MB of characters; a character limit is insufficient.
  const bytes = new TextEncoder().encode(JSON.stringify({ value: 'é'.repeat(2_000_000) }));
  for (const headers of [{}, { 'Content-Length': '10' }]) {
    let delivered = 0, cancelled = false, signal;
    const stream = new ReadableStream({
      pull(controller) {
        const end = Math.min(delivered + 65536, bytes.length);
        controller.enqueue(bytes.subarray(delivered, end));
        delivered = end;
        if (delivered === bytes.length) controller.close();
      },
      cancel() { cancelled = true; },
    }, { highWaterMark: 0 });
    await assert.rejects(fetchDataset(buildRequest(), { fetchImpl: async (_url, options) => {
      signal = options.signal;
      return new Response(stream, { headers });
    } }), /2,000,000-byte/);
    assert.ok(delivered > 2_000_000 && delivered <= 2_000_000 + 65536);
    assert.ok(delivered < bytes.length);
    assert.equal(cancelled, true);
    assert.equal(signal.aborted, true);
  }
});

test('decodes valid multibyte JSON across stream boundaries', async () => {
  const bytes = new TextEncoder().encode('{"label":"é"}');
  let offset = 0;
  const stream = new ReadableStream({ pull(controller) {
    controller.enqueue(bytes.subarray(offset, ++offset));
    if (offset === bytes.length) controller.close();
  } });
  assert.deepEqual(await fetchDataset(buildRequest(), { fetchImpl: async () => new Response(stream) }), { label: 'é' });
});
