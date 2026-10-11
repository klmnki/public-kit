**Georgia had the largest fall in the youth NEET rate between 2022 and 2024: 5.474 percentage points. Serbia did not improve between 2023 and 2024:** its rate rose by 0.201 percentage points, although it remained below its 2022 level.

Based on the supplied **ILOSTAT** extract:

| Country | 2022 (%) | 2023 (%) | 2024 (%) | Change 2022–2024 (pp) | Change 2023–2024 (pp) |
|---|---:|---:|---:|---:|---:|
| Moldova | 14.963 | 13.308 | 11.491 | −3.472 | −1.817 |
| Georgia | 20.166 | 18.049 | 14.692 | −5.474 | −3.357 |
| Serbia | 13.231 | 12.397 | 12.598 | −0.633 | +0.201 |

Changes are calculated as the later rate minus the earlier rate; negative values indicate a fall.

The indicator is **SDG 8.6.1**, the percentage of all youth aged **15–24** who are outside employment, education and training, with both sexes combined. It includes young people outside the labour force who are also outside education and training. **It does not establish a change in youth unemployment**, which is a different measure. These country percentages also do not establish a regional rate: an aggregate would require compatible youth population denominators and a defined regional coverage.

To reproduce the selection, download and decompress the [ILOSTAT annual indicator CSV](https://rplumber.ilo.org/data/indicator?id=SDG_0861_SEX_RT_A&format=.csv.gz), parse its quoted CSV fields, and filter:

- `indicator=SDG_0861_SEX_RT`; `sex=SEX_T`
- `ref_area` in `MDA`, `GEO`, `SRB`; `time` in `2022`, `2023`, `2024`
- Retain source codes `BA:571` (Moldova), `BA:13950` (Georgia), and `BA:467` (Serbia), plus flags and notes.

**Source and retrieval:** ILOSTAT, International Labour Organization; retrieved **11 October 2026 at 14:46:53.313 UTC**. The supplied source dictionary identifies all three series as Labour Force Surveys, rather than ILO modelled estimates. Every row retains note `R1:3513`, meaning “Repository: ILO-STATISTICS - Micro data processing”; observation-status and indicator-note fields are empty. See the [bulk documentation](https://ilostat.ilo.org/data/bulk/) and [ILO rights and permissions](https://www.ilo.org/rights-and-permissions) for the supplied CC BY 4.0 licensing context.

The extract contains all nine requested country-year observations, with unchanged source codes. However, the original bulk CSV body is absent, so verification is limited to retained observation strings and metadata. Empty flags do not establish full comparability; the evidence provides no sampling uncertainty or detailed assessment of methodological breaks, so statistical significance cannot be judged. ILOSTAT cautions that figures may differ from national publications and the Global SDG Database because sources or reference years differ. Future downloads may revise these values.