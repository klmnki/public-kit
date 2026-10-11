# Youth outside employment, education or training

**Question:** How did the share of young people aged 15–24 who were not in employment, education or training change in Moldova, Georgia and Serbia between 2021 and 2024?

This example retrieves ILOSTAT's annual SDG 8.6.1 series, selects both sexes, and retains the survey source, observation flags and notes. It uses an anonymous public bulk download. No account, API key or package installation is needed; Node.js 22 or later is required.

## Saved result

Retrieved on 11 October 2026. The 12 selected country-year observations are present.

| Country | 2021 (%) | 2024 (%) | Change (percentage points) |
| --- | ---: | ---: | ---: |
| Republic of Moldova | 13.550 | 11.491 | −2.059 |
| Georgia | 22.357 | 14.692 | −7.665 |
| Serbia | 16.714 | 12.598 | −4.116 |

The share fell in all three countries over this period. These changes describe the selected estimates; they do not identify a cause. NEET includes young people outside the labour force who are not studying or training, so it is different from unemployment.

All selected records are labelled `LFS - Labour Force Survey`, with source codes `BA:571`, `BA:13950` and `BA:467` respectively. Their common source note, `R1:3513`, means `Repository: ILO-STATISTICS - Micro data processing`. They belong to the selected survey series, rather than the separate ILO modelled-estimates series. Observation flags and indicator notes are blank in this extract; that does not establish perfect comparability or precision. ILOSTAT warns that figures can differ from national publications and the Global SDG Database when sources or reference years differ.

## Run

From the Public Kit repository root:

```sh
node examples/ilostat/retrieve.mjs --save
node examples/ilostat/retrieve.mjs --countries MDA,GEO,SRB --start 2021 --end 2024
node examples/ilostat/retrieve.mjs --snapshot examples/ilostat/snapshot.json
node --test examples/ilostat/retrieve.test.mjs
```

The first two commands make fresh requests. `--save` writes a dated JSON and CSV extract in `snapshots/`. It does not overwrite `snapshot.json`, which is the reviewed website snapshot. `--snapshot` replays a saved extract without network access and preserves its retrieval date. Choose one to five country codes and one to five annual years; the example remains fixed to this indicator and both sexes.

For a missing-data check:

```sh
node examples/ilostat/retrieve.mjs --countries MDA --start 1900 --end 1902
```

This selection was tested against the live endpoint and returned `status: "no_data"`, no rows, three explicit missing country-years and a null change. Absence is never converted to zero.

## Source and method

The [official bulk guide](https://ilostat.ilo.org/data/bulk/) and [indicator directory](https://rplumber.ilo.org/files/website/bulk/indicator.html) identify the annual file:

```text
https://rplumber.ilo.org/data/indicator?id=SDG_0861_SEX_RT_A&format=.csv.gz
```

The suffix `_A` selects annual data. Inside the file, `indicator` is `SDG_0861_SEX_RT`; `SEX_T` means both sexes. The script filters country, indicator, sex and four-digit year, then reads the relevant [dictionaries](https://rplumber.ilo.org/files/website/bulk/dic.html), for example:

```text
https://rplumber.ilo.org/metadata/dic?var=source&lang=en&format=.csv
```

Dictionary lookups preserve the selected country, indicator, source and note labels. The JSON contains the original fields plus a numeric `value`, `year`, country label and observation type. Each request records its URL, HTTP status, byte count and SHA-256 hash. The full international CSV and dictionaries are downloaded in memory; only the selected extract and relevant metadata are retained. Each request has a 30-second timeout and a 16 MiB response bound; decompression is also bounded. HTTP or parsing errors stop the run rather than producing a partial result.

Changes are end-year minus start-year, expressed in percentage points. Duplicate country-years, unexpected classification dimensions and invalid percentage values cause an error. The script withholds a change if an endpoint is missing, a break flag `B` occurs in the selected period, or the source changes. It calculates no regional total or unweighted average. Users should inspect retained metadata for additional comparability limits before drawing policy conclusions.

The measure and its qualifications are described in the [ILO SDG indicator definitions](https://ilostat.ilo.org/methods/concepts-and-definitions/description-sustainable-development-labour-market-indicators/). ILO's [rights and permissions](https://www.ilo.org/rights-and-permissions) place databases and datasets published from 3 May 2023 under CC BY 4.0; attribution and any dataset-specific exceptions still apply. These are public aggregate estimates, not microdata.

## Files and verification

- `snapshot.json`: stable, reviewed extract used by the website.
- `snapshots/2026-10-11-mda-geo-srb-2021-2024.json` and `.csv`: dated successful retrieval, 12 observations.
- `snapshots/2026-10-11-mda-1900-1902.json` and `.csv`: dated missing-data retrieval.
- `retrieve.mjs`: dependency-free retrieval, selection and calculation.
- `retrieve.test.mjs`: five tests covering CSV parsing, dimensional ambiguity, missing values, comparison safeguards and the saved observations.

The live checks establish that these particular requests succeeded on the recorded date. They do not guarantee future service availability or unchanged values. Revisions can alter a later retrieval.
