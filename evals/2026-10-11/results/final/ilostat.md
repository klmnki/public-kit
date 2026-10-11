**Georgia had the largest fall in youth NEET rates from 2022 to 2024: 5.474 percentage points. Serbia did not improve between 2023 and 2024:** its rate rose by 0.201 percentage points, although it remained below its 2022 level.

The supplied [ILOSTAT](https://ilostat.ilo.org/data/bulk/) extract reports annual rates for both sexes:

| Country | 2022 (%) | 2023 (%) | 2024 (%) | Change 2022–2024 (pp) | Change 2023–2024 (pp) |
|---|---:|---:|---:|---:|---:|
| Moldova | 14.963 | 13.308 | 11.491 | −3.472 | −1.817 |
| Georgia | 20.166 | 18.049 | 14.692 | −5.474 | −3.357 |
| Serbia | 13.231 | 12.397 | 12.598 | −0.633 | +0.201 |

Changes are calculated as the later rate minus the earlier rate.

**What this measures.** SDG indicator 8.6.1 measures the percentage of all youth aged 15–24 who are **not in employment, education or training (NEET)**. It includes people outside the labour force who are neither studying nor training. These results therefore do **not** establish changes in youth unemployment. They also do not establish a regional rate: national percentages cannot be added or simply averaged to produce one; compatible youth population denominators and defined regional coverage would be needed.

**Source and reproduction.** The evidence was retrieved from ILOSTAT, International Labour Organization, on **11 October 2026 at 14:46:53.313 UTC**. Download the [annual bulk CSV gzip](https://rplumber.ilo.org/data/indicator?id=SDG_0861_SEX_RT_A&format=.csv.gz), decode gzip and parse CSV, then select:

- `indicator=SDG_0861_SEX_RT`, `sex=SEX_T`
- `ref_area` in `MDA`, `GEO`, `SRB`; `time` in `2022`, `2023`, `2024`
- Retain sources `BA:571` (Moldova), `BA:13950` (Georgia), `BA:467` (Serbia), all labelled Labour Force Survey.

Metadata requests used `https://rplumber.ilo.org/metadata/dic?var={variable}&lang=en&format=.csv`, with `variable` set to `source`, `ref_area`, `indicator` and `note_source`.

**Main limitations.** All nine observations retain note `R1:3513`, meaning ILO microdata processing; observation-status and indicator-note fields are empty. Sources remain consistent within each country, but the supplied metadata cannot establish complete methodological comparability or statistical significance. The figures may differ from national publications or the Global SDG Database because sources or reference years differ. The evidence preserves exact observation strings and metadata excerpts, **not the full original bulk CSV**, limiting independent verification. Future downloads may contain revisions. These changes alone do not explain causes or programme effects. ILO dataset reuse is subject to [CC BY 4.0 and stated exceptions](https://www.ilo.org/rights-and-permissions).