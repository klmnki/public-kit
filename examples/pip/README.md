# Poverty change and a revised estimate

Ask: **How did extreme poverty change in Georgia from 2020 to 2024? Separately, how did the March and September 2026 releases revise the global estimate for 2024?**

This example retrieves four observations directly from the World Bank Poverty and Inequality Platform (PIP), using the **$3.00 per person per day line in 2021 purchasing power parity**. It records the responses and release metadata in [snapshot.json](snapshot.json).

## Saved result

Retrieved 11 October 2026. Rates below are percentages of the population.

| Comparison | Earlier value | Later value | Difference |
| --- | ---: | ---: | ---: |
| Georgia, 2020 to 2024, September release | 11.98% | 4.23% | −7.75 percentage points |
| World, 2024 estimate, March to September releases | 10.40% | 10.12% | −0.28 percentage points |

The global count was revised from **846,762,143 to 824,298,368 people**, a difference of **−22,463,775**. Both estimates describe 2024: this is a revision, not a fall in poverty between March and September 2026.

Georgia's observations are national consumption estimates from the HIS survey. Survey and reporting years match; both rows have survey-comparability code 2 and the `1998 - 2024` comparable spell. They are marked `estimation_type=survey` and `is_interpolated=false`. The global rows carry PIP's `estimate_type=actual` flag, which identifies its historical aggregate; it does not mean that every country component was directly observed in 2024.

## Run it

Requires Node.js 22 or later, with outbound HTTPS access. No packages, account or API key are required. Run from the repository root:

```sh
node examples/pip/fetch.mjs
node --test examples/pip/fetch.test.mjs
```

The fetch script writes a new snapshot only after every required numeric request and the negative check succeed. Requests have a 25-second timeout, a 256 KiB response limit and no automatic retries. The snapshot retains raw responses, retrieval timestamps, exact requests, selected fields and derived differences.

## Requests and release identity

First read `https://api.worldbank.org/pip/v1/versions`. Confirm that each exact version has `ppp_version=2021` and `identity=PROD`:

- March: `20260324_2021_01_02_PROD` — the API release date differs from the public update's 26 March publication date.
- September: `20260922_2021_01_02_PROD`.

The observation field `ppp` is a conversion factor, not a PPP year. This example establishes the PPP basis from `/versions` and pins that complete version in every numeric request.

```text
https://api.worldbank.org/pip/v1/pip?country=GEO&year=2020%2C2024&povline=3&version=20260922_2021_01_02_PROD&fill_gaps=false&reporting_level=national&welfare_type=consumption&format=json
https://api.worldbank.org/pip/v1/pip-grp?country=all&year=2024&povline=3&version=20260324_2021_01_02_PROD&group_by=world&format=json
https://api.worldbank.org/pip/v1/pip-grp?country=all&year=2024&povline=3&version=20260922_2021_01_02_PROD&group_by=world&format=json
```

`headcount` is a fraction: multiply by 100 for a percentage. A percentage-point difference is `100 × (later headcount − earlier headcount)`. Keep the supplied `pop_in_poverty` count: multiplying a rounded API headcount by population would produce a different count.

For a time comparison, require one release, consistent definitions and comparable survey series. For a revision, require the same reporting year, geography, poverty line and PPP basis, with two ordered releases. The tests reject mismatches, duplicate rows, missing values and an attempted revision across different years.

## Checks and limits

The live run returned four numeric observations. A deliberately invalid version returned HTTP 404 and produced no estimate. Offline tests cover empty arrays, null versus zero, service-error payloads, incompatible comparisons and the response-size limit. The example was executed with Node.js 24.13.0; it uses APIs available in Node.js 22.

These are estimates at the international extreme-poverty line, not national poverty rates or an assessment of all deprivation. The example does not explain what caused the Georgian change, reconstruct the World Bank's aggregation method, or retrieve nowcasts. Other countries, lines and revisions need their own coverage checks. A pinned release can still receive provider corrections; retain the retrieval timestamp and raw response.

## Sources and reuse

- [PIP API documentation](https://pip.worldbank.org/api) and [the World Bank's official R client](https://github.com/worldbank/pipr/blob/main/R/get_stats.R) document the country and aggregate routes.
- [March 2026 update](https://blogs.worldbank.org/en/opendata/march-2026-global-poverty-update-from-the-world-bank--new-data-a) and [September 2026 update](https://blogs.worldbank.org/en/opendata/september-2026-global-poverty-update-from-the-world-bank--one-in) explain the recurring release and revision process. The numeric results above come from the saved API responses.
- World Bank (2026), *Poverty and Inequality Platform*, versions `20260324_2021_01_02_PROD` and `20260922_2021_01_02_PROD`, accessed 11 October 2026. Provider data are [CC BY 4.0](https://datacatalog.worldbank.org/search/dataset/0038020/poverty-and-equity-database-poverty-and-inequality-platform), separate from this repository's MIT code licence. The percentage and difference fields are calculations from those data.
