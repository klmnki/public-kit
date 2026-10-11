The sentence confuses a **revision to the global 2024 estimate** with a decline during 2026. A corrected briefing is:

> World Bank PIP’s September 2026 release revised estimated global extreme poverty in **2024** downward by **22.46 million people** compared with its March release. Separately, within the September release, Georgia’s poverty rate fell from **11.98% in 2020 to 4.23% in 2024**, a decline of **7.75 percentage points**.

All figures use the **$3.00 per person per day international poverty threshold at 2021 purchasing power parity (PPP)**, rather than national poverty lines. [Source: World Bank PIP](https://pip.worldbank.org/).

| Comparison | Earlier estimate | Later estimate | Difference |
|---|---:|---:|---:|
| World, **2024**, March → September release | 10.40%; 846,762,143 people | 10.12%; 824,298,368 people | −0.28 percentage points; −22,463,775 people |
| Georgia, **2020 → 2024**, September release | 11.98% | 4.23% | −7.75 percentage points |

The **world comparison measures a release revision**: geography, reference year, poverty threshold, PPP basis and reporting population (8,141,808,945) are unchanged. It provides no evidence of a 22.5-million decline between March and September 2026. Both rows carry `estimate_type="actual"`, a provider historical-estimate flag that does not establish that every country component was observed in 2024.

The **Georgia comparison measures change over time** using national consumption survey estimates. Survey and reporting years match; both rows are non-interpolated, have `estimation_type="survey"`, `survey_comparability=2`, and share the comparable spell **1998–2024**. Their `estimate_type` fields are null. The selection contains only the two requested years, with gap filling disabled; it does not establish an uninterrupted annual decline or programme effects.

The production versions are **`20260324_2021_01_02_PROD`** and **`20260922_2021_01_02_PROD`**. Georgia uses the latter throughout. Version metadata establishes the 2021 PPP basis; Georgia’s observation-level `ppp=1.0735` is a conversion factor.

Reproducible requests, exactly as supplied:

- [Version metadata](https://api.worldbank.org/pip/v1/versions)
- [Georgia: 2020 and 2024, national consumption, September version](https://api.worldbank.org/pip/v1/pip?country=GEO&year=2020%2C2024&povline=3&version=20260922_2021_01_02_PROD&fill_gaps=false&reporting_level=national&welfare_type=consumption&format=json)
- [World: 2024, March version](https://api.worldbank.org/pip/v1/pip-grp?country=all&year=2024&povline=3&version=20260324_2021_01_02_PROD&group_by=world&format=json)
- [World: 2024, September version](https://api.worldbank.org/pip/v1/pip-grp?country=all&year=2024&povline=3&version=20260922_2021_01_02_PROD&group_by=world&format=json)

Calculations multiply headcount fractions by 100 and subtract earlier values from later values; counts use published `pop_in_poverty`. Evidence was retrieved **11 October 2026, approximately 14:41 UTC**, and supplied as parsed responses, without original HTTP bytes. No fresh retrieval was performed. PIP data are licensed [CC BY 4.0](https://datacatalog.worldbank.org/search/dataset/0038020/poverty-and-equity-database-poverty-and-inequality-platform).