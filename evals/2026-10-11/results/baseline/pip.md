The sentence conflates a **revision to the estimate for 2024** with a change over time. The supplied responses show:

| Comparison | Earlier estimate | Later estimate | Difference |
|---|---:|---:|---:|
| World, **2024**, March vs September 2026 releases | 10.40%; 846,762,143 people | 10.12%; 824,298,368 people | −0.28 percentage points; −22,463,775 people (about 22.5 million) |
| Georgia, **2020 vs 2024**, within the September 2026 release | 11.98% | 4.23% | −7.75 percentage points |

A corrected statement is: **“The September 2026 PIP release revised estimated global poverty in 2024 downward by about 22.5 million people compared with the March release. Separately, Georgia’s poverty rate fell from 11.98% in 2020 to 4.23% in 2024.”**

Both comparisons use the **$3 per person per day threshold on a 2021 purchasing power parity (PPP) basis**. The world comparison holds the reporting year and population constant—2024 and 8,141,808,945 people—and compares release versions `20260324_2021_01_02_PROD` and `20260922_2021_01_02_PROD`. It does **not** establish a poverty decline between March and September 2026. The count difference uses the returned `pop_in_poverty` values; the displayed headcount rates are rounded.

Georgia’s comparison measures change between two survey years within version `20260922_2021_01_02_PROD`. Both observations are national HIS consumption surveys, based on microdata, marked non-interpolated and within the reported comparable spell **1998–2024**. The world responses cover the `WLD` aggregate with `country=all` and are labelled `estimate_type=actual`; they do not supply country-level survey coverage details.

Source: [World Bank Poverty and Inequality Platform](https://pip.worldbank.org/), supplied parsed responses retrieved **11 October 2026, 14:41 UTC**, under [CC BY 4.0](https://datacatalog.worldbank.org/search/dataset/0038020/poverty-and-equity-database-poverty-and-inequality-platform). No new data were fetched.

Reproducible GET requests, all returning HTTP 200 in the supplied evidence:

- [Release versions](https://api.worldbank.org/pip/v1/versions)
- [World, March release](https://api.worldbank.org/pip/v1/pip-grp?country=all&year=2024&povline=3&version=20260324_2021_01_02_PROD&group_by=world&format=json)
- [World, September release](https://api.worldbank.org/pip/v1/pip-grp?country=all&year=2024&povline=3&version=20260922_2021_01_02_PROD&group_by=world&format=json)
- [Georgia, 2020 and 2024](https://api.worldbank.org/pip/v1/pip?country=GEO&year=2020%2C2024&povline=3&version=20260922_2021_01_02_PROD&fill_gaps=false&reporting_level=national&welfare_type=consumption&format=json)

The supplied evidence identifies `examples/pip/snapshot.json` as its saved source; the original HTTP byte stream was not retained.