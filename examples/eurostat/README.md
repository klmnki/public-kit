# Repeat a Eurostat unemployment check

> What was the EU unemployment rate in June, July and August 2026? Save the figures so I can check for new observations and revisions when I run the query again.

On 11 October 2026, Eurostat returned **6.1% for each month**. The June-to-August change was **0.0 percentage points** at the published precision. These are seasonally adjusted rates for the EU aggregate, expressed as a percentage of the labour force. Equal displayed rates do not establish that unemployment counts stayed constant.

| Month | Unemployment rate | Statistical flag returned |
| --- | ---: | --- |
| June 2026 | 6.1% | None |
| July 2026 | 6.1% | None |
| August 2026 | 6.1% | None |

Inspect the [dated snapshot](snapshots/eu-unemployment-2026-10-11T14-40-55-325Z.json) for the exact request, retrieval time, source update time, dimension labels and values. Eurostat reported the dataset update time as 8 October 2026. This snapshot records one retrieval, not a permanent statement about what Eurostat will publish later.

## Run it

You need Node.js 22 or later and internet access. The script uses built-in modules and Eurostat's public API; no packages or account are required. Run these commands from the Public Kit repository root:

```sh
node examples/eurostat/unemployment.mjs --from 2026-06 --to 2026-08
```

Each successful run writes a new timestamped JSON file under `examples/eurostat/snapshots/`. It includes the request, source, units, limitations, flags and a row for each requested month. The script keeps missing values as `null` and refuses a response with no numeric observations. It does not overwrite an earlier snapshot.

For a rolling window of the latest three **dataset periods**:

```sh
node examples/eurostat/unemployment.mjs --last 3
```

Eurostat returned July 6.1%, August 6.1% and September `null` for that request on 11 October. A dataset can include a period before this selected series has a value. Inspect the dates and gaps before describing the result as the latest three available observations. The [rolling-window snapshot](snapshots/eu-unemployment-2026-10-11T14-41-27-831Z.json) preserves this gap.

## Compare with an earlier run

Supply a snapshot you saved previously. This command uses the included June–August baseline:

```sh
node examples/eurostat/unemployment.mjs --last 3 --previous examples/eurostat/snapshots/eu-unemployment-2026-10-11T14-40-55-325Z.json
```

The new snapshot adds a `comparison` section:

- `newObservations`: numeric observations for periods absent from the earlier file. This means new to your comparison, not proof of first publication by Eurostat.
- `revisedObservations`: changed numeric values for periods present in both files, with differences in percentage points.
- `newlyAvailableValues` and `newlyMissingValues`: changes between a number and `null` for an overlapping period.
- `statusChanges`: changed statistical flags, reported even when the numeric value stays the same.
- `outsideCurrentWindow`: earlier periods the new query did not cover. Their absence says nothing about withdrawal or revision.

The included rolling-window comparison found unchanged values for July and August, no numeric revisions and a missing September value. June fell outside the new query window. These two files came from successive checks on the same day; they do not demonstrate a later publication or an actual revision.

To check revisions further back, query a longer overlapping range, for example `--from 2026-01 --to 2026-09`, and use a baseline covering those periods. A comparison cannot detect revisions outside the periods you fetch. The script rejects a baseline with a different series identity, measure or unit. Both snapshots need valid UTC retrieval timestamps. The current snapshot must be later than the baseline; equal times are accepted only when their observations match.

## Scope and checks

The example fixes dataset `une_rt_m` and dimensions `freq=M`, `geo=EU27_2020`, `sex=T`, `age=TOTAL`, `unit=PC_ACT`, `s_adj=SA`. It decodes JSON-stat dimension positions rather than assuming object order. Use a different example or adapt the code if your question needs another geography or subgroup.

Requests have a 20-second timeout, adjustable up to 60 seconds with `--timeout-ms`. Both fixed and rolling queries allow at most 120 months. The download stops when the response exceeds 2,000,000 bytes; an oversized Content-Length triggers rejection before reading the body. `--out-dir PATH` changes the output directory. A failed HTTP request, invalid response, empty result or all-missing result exits with an error and saves no snapshot.

Run the focused tests:

```sh
node --test examples/eurostat/tests/unemployment.test.mjs
```

The tests use **synthetic data** for revisions, flags, zero values and gaps. They check query bounds, metadata mismatch, malformed responses, HTTP errors and timeout handling. Those fixtures provide no evidence of an actual Eurostat revision. The implementation targets Node.js 22+; this check ran on Node.js 24.13.0.

Official references: [dataset in Eurostat's Data Browser](https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table?lang=en), [Statistics API query and time filters](https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-detailed-guidelines/api-statistics), and [JSON-stat response structure](https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-getting-started/api).
