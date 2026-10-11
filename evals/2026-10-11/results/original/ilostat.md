**Georgia had the largest fall in the youth NEET rate between 2022 and 2024: 5.474 percentage points. Serbia did not improve between 2023 and 2024:** its rate rose by 0.201 percentage points, although it remained below its 2022 level.

| Country | 2022 | 2023 | 2024 | Change, 2022–2024 |
|---|---:|---:|---:|---:|
| Moldova | 14.963% | 13.308% | 11.491% | −3.472 pp |
| Georgia | 20.166% | 18.049% | 14.692% | −5.474 pp |
| Serbia | 13.231% | 12.397% | 12.598% | −0.633 pp |

Changes are calculated as the later rate minus the earlier rate, using the supplied values.

SDG indicator 8.6.1 measures the percentage of **all young people aged 15–24 who are outside employment, education and training**, with both sexes combined here. It includes people outside the labour force. These figures therefore support a comparison of youth **NEET rates**, not a claim that youth unemployment fell. They also do not establish a regional rate: national percentages cannot be summed, and a pooled rate would require compatible youth population denominators and defined regional coverage.

The source is [ILOSTAT, International Labour Organization](https://ilostat.ilo.org/data/bulk/), retrieved **11 October 2026 at 14:46:53.313 UTC**. To reproduce the selection:

- Download the [annual SDG 8.6.1 gzip CSV](https://rplumber.ilo.org/data/indicator?id=SDG_0861_SEX_RT_A&format=.csv.gz), decompress it and parse the CSV.
- Filter `indicator=SDG_0861_SEX_RT`, `sex=SEX_T`, `ref_area` to `MDA`, `GEO`, `SRB`, and `time` to `2022`, `2023`, `2024`.
- Retain source codes `BA:571` for Moldova, `BA:13950` for Georgia and `BA:467` for Serbia. All are labelled **Labour Force Survey**, rather than ILO modelled estimates.
- Resolve metadata through `https://rplumber.ilo.org/metadata/dic?var=source&lang=en&format=.csv`, substituting `ref_area`, `indicator` and `note_source` for the other supplied dictionaries.

The extract contains all nine selected country-year observations, with no gaps or duplicates. Every row retains note `R1:3513`, meaning **ILO-STATISTICS microdata processing**; observation-status and indicator-note fields are blank. Those blanks do not establish statistical significance or rule out methodological breaks. No uncertainty estimates are supplied, so Serbia’s small increase cannot be assessed for significance. The figures do not explain causes, may differ from national publications or the Global SDG Database, and may be revised. This briefing uses the supplied retained fields and metadata; the full original bulk CSV is not retained in the evidence pack.