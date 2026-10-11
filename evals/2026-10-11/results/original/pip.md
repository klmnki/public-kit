The sentence confuses a **revision to the 2024 global estimate** with a decline during 2026.

A corrected briefing: “World Bank PIP’s September 2026 release revised estimated global extreme poverty for **2024** downward by **22,463,775 people (about 22.5 million)** relative to its March release. Separately, within the September release, Georgia’s poverty rate fell by **7.75 percentage points between 2020 and 2024**.”

Both comparisons use the international extreme-poverty threshold of **$3 per person per day in 2021 purchasing power parity (PPP)**, rather than national poverty lines.

| Comparison | Earlier estimate | Later estimate | Difference |
|---|---:|---:|---:|
| World, **2024**, March → September release | 10.40%; 846,762,143 people | 10.12%; 824,298,368 people | −0.28 percentage points; −22,463,775 people |
| Georgia, **2020 → 2024**, September release | 11.98% | 4.23% | −7.75 percentage points |

The global comparison holds geography, reference year, threshold and PPP basis constant across versions `20260324_2021_01_02_PROD` and `20260922_2021_01_02_PROD`. It measures a **release revision**, not people leaving poverty between March and September 2026. Both world records carry `estimate_type="actual"`; that provider flag does not establish that every component was directly observed in 2024.

Georgia’s comparison uses national consumption surveys for 2020 and 2024 within version `20260922_2021_01_02_PROD`. Both records have national coverage, `estimation_type="survey"`, `is_interpolated=false`, `survey_comparability=2` and the same comparable spell, `1998 - 2024`; `estimate_type` remains null. These are two survey endpoints, with gap filling disabled. Neither comparison establishes programme effects.

Source: [World Bank PIP](https://pip.worldbank.org/), supplied saved responses retrieved **11 October 2026, approximately 14:41 UTC**, licensed CC BY 4.0. Rates equal `100 × headcount`; differences subtract earlier from later. Counts use published `pop_in_poverty`, rather than reconstruction from rounded rates.

Exact reproducible GET requests:

- [Version metadata](https://api.worldbank.org/pip/v1/versions)
- [Georgia: 2020 and 2024 national consumption surveys](https://api.worldbank.org/pip/v1/pip?country=GEO&year=2020%2C2024&povline=3&version=20260922_2021_01_02_PROD&fill_gaps=false&reporting_level=national&welfare_type=consumption&format=json)
- [World 2024: March version](https://api.worldbank.org/pip/v1/pip-grp?country=all&year=2024&povline=3&version=20260324_2021_01_02_PROD&group_by=world&format=json)
- [World 2024: September version](https://api.worldbank.org/pip/v1/pip-grp?country=all&year=2024&povline=3&version=20260922_2021_01_02_PROD&group_by=world&format=json)

No new retrieval was performed.