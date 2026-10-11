Georgia had the largest fall in the youth NEET rate between 2022 and 2024: **5.474 percentage points**. Serbia’s rate fell over the full period, but **rose by 0.201 percentage points between 2023 and 2024**, so it did not improve in that final year. These calculations use the supplied ILOSTAT extract.

| Country | 2022 (%) | 2023 (%) | 2024 (%) | Change 2022–2024 (pp) | Change 2023–2024 (pp) |
|---|---:|---:|---:|---:|---:|
| Moldova | 14.963 | 13.308 | 11.491 | −3.472 | −1.817 |
| Georgia | 20.166 | 18.049 | 14.692 | −5.474 | −3.357 |
| Serbia | 13.231 | 12.397 | 12.598 | −0.633 | +0.201 |

Changes are later minus earlier; negative values indicate falling rates.

The indicator is **SDG 8.6.1**, the percentage of all young people aged **15–24** who are not in employment, education or training, with both sexes combined. It includes young people outside the labour force who are also outside education and training. It therefore **does not establish a change in youth unemployment**, which is a different measure. These country percentages also do not establish a regional rate: aggregation would require compatible youth population denominators and defined regional coverage.

Source: [ILOSTAT, International Labour Organization](https://ilostat.ilo.org/data/bulk/). The supplied extract was retrieved on **11 October 2026 at 14:46:53.313 UTC**.

To reproduce the selection:

- Download and decompress the [annual bulk CSV](https://rplumber.ilo.org/data/indicator?id=SDG_0861_SEX_RT_A&format=.csv.gz).
- Filter `indicator=SDG_0861_SEX_RT`, `sex=SEX_T`, `ref_area` in `MDA,GEO,SRB`, and `time` in `2022,2023,2024`.
- Retain the labour-force survey sources: Moldova `BA:571`, Georgia `BA:13950`, Serbia `BA:467`, alongside observation flags and notes. The supplied selection contains one row per country-year.
- Resolve metadata through `https://rplumber.ilo.org/metadata/dic?var={variable}&lang=en&format=.csv`, using `source`, `ref_area`, `indicator` and `note_source`.

All nine rows retain note `R1:3513`, meaning **ILO-STATISTICS microdata processing**; observation-status and indicator-note fields are empty. These are survey series, rather than ILO modelled estimates. Empty flags do not prove that comparability issues are absent, and the supplied evidence provides no uncertainty estimates to assess statistical significance. ILOSTAT warns that figures may differ from national publications and the Global SDG Database because sources or reference years differ. Future downloads may revise values; this evidence pack retains selected fields and metadata, but not the full original CSV. Dataset reuse follows [ILO rights and permissions](https://www.ilo.org/rights-and-permissions), including the stated CC BY 4.0 licence.