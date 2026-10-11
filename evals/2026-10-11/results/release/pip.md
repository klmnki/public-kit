The sentence confuses a **revision to a 2024 estimate** with a change during 2026. World Bank PIP’s September release lowered estimated global extreme poverty in **2024** by approximately **22.5 million people** compared with its March release. Separately, Georgia’s poverty rate declined between **2020 and 2024** within the September release.

All comparisons use the international poverty threshold of **$3 per person per day in 2021 purchasing power parity (PPP)**, rather than national poverty lines.

| Comparison | Earlier estimate | Later estimate | Difference |
|---|---:|---:|---:|
| World, **2024**, March → September release: poverty rate | 10.40% | 10.12% | −0.28 percentage points |
| World, **2024**, March → September release: people in poverty | 846,762,143 | 824,298,368 | −22,463,775 (about 22.5 million) |
| Georgia, **2020 → 2024**, September release: poverty rate | 11.98% | 4.23% | −7.75 percentage points |

The global comparison holds geography, reference year, threshold, PPP basis and reported population constant. It compares versions `20260324_2021_01_02_PROD` and `20260922_2021_01_02_PROD`; it **does not measure poverty falling between March and September 2026**. Both world records carry `estimate_type="actual"`, PIP’s historical-estimate flag, which does not establish that every component was observed in 2024.

Georgia’s comparison measures change over time using version `20260922_2021_01_02_PROD`. Both records are national HIS consumption survey estimates, with survey and reporting years matching 2020 and 2024, `is_interpolated=false`, `survey_comparability=2`, and the same comparable spell, `1998 - 2024`. Their `estimate_type` remains null; the explicit `estimation_type="survey"` identifies their estimation method. The evidence covers these two years and does not establish programme effects or local poverty conditions.

Source: [World Bank Poverty and Inequality Platform](https://pip.worldbank.org/) ([API documentation](https://pip.worldbank.org/api)), supplied responses retrieved **11 October 2026, approximately 14:41 UTC**. Rates were calculated as `100 × headcount`; percentage-point differences as `100 × (later − earlier)`. The global count difference uses published `pop_in_poverty`, rather than reconstructing counts from rounded rates.

Exact reproducible requests:

```text
https://api.worldbank.org/pip/v1/versions

https://api.worldbank.org/pip/v1/pip?country=GEO&year=2020%2C2024&povline=3&version=20260922_2021_01_02_PROD&fill_gaps=false&reporting_level=national&welfare_type=consumption&format=json

https://api.worldbank.org/pip/v1/pip-grp?country=all&year=2024&povline=3&version=20260324_2021_01_02_PROD&group_by=world&format=json

https://api.worldbank.org/pip/v1/pip-grp?country=all&year=2024&povline=3&version=20260922_2021_01_02_PROD&group_by=world&format=json
```

Verification is limited to the supplied parsed response objects: each supplied request reports HTTP 200, but original HTTP bytes were not retained and no fresh retrieval was performed. Provider data are licensed under [CC BY 4.0](https://datacatalog.worldbank.org/search/dataset/0038020/poverty-and-equity-database-poverty-and-inequality-platform).