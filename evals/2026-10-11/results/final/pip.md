The sentence confuses a **revision to the 2024 global estimate** with a fall in poverty between March and September 2026. The Georgia comparison does show a decline between 2020 and 2024.

Using the supplied [World Bank PIP](https://pip.worldbank.org/) responses, all estimates concern **international extreme poverty below $3 per person per day in 2021 purchasing-power-parity (PPP) dollars**, rather than national poverty lines.

| Comparison | Earlier estimate | Later estimate | Difference |
|---|---:|---:|---:|
| World, **2024**, March → September release | 10.40%; 846,762,143 people | 10.12%; 824,298,368 people | −0.28 percentage points; −22,463,775 people (about 22.5 million) |
| Georgia, **2020 → 2024**, September release | 11.98% | 4.23% | −7.75 percentage points |

**Corrected briefing:** “The September 2026 PIP release revised estimated global extreme poverty in **2024** downward by about **22.5 million people** compared with the March release. Separately, within the September release, Georgia’s estimated extreme-poverty rate declined from **11.98% in 2020 to 4.23% in 2024**.”

The global comparison holds geography, reference year, threshold, PPP basis and reported population constant. It compares production versions `20260324_2021_01_02_PROD` and `20260922_2021_01_02_PROD`; it does **not** measure a change during 2026. March’s API version is dated 24 March, although its public update was published 26 March. Both global rows carry `estimate_type="actual"`—a provider historical-estimate flag, not proof that every component was observed in 2024.

Georgia’s two rows use national HIS consumption surveys, with survey and reporting years matching. Both have `survey_comparability=2`, the same comparable spell (`1998 - 2024`), `is_interpolated=false`, `estimation_type="survey"` and `estimate_type=null`. Gap filling was disabled. This supports a comparison of the two survey years, not a continuous trend through 2026 or a claim about programme effects.

Rates were calculated as `100 × headcount`; differences are later minus earlier. The global count difference uses published `pop_in_poverty`, rather than reconstructing counts from rounded rates. The PPP basis comes from version metadata; Georgia’s `ppp=1.0735` is a conversion factor.

The supplied extract was retrieved on **11 October 2026, around 14:41 UTC**, with recorded HTTP 200 responses. It contains parsed response objects, not original HTTP bytes, so verification is limited to the supplied extract. PIP data use **CC BY 4.0**.

Reproducible requests: [version metadata](https://api.worldbank.org/pip/v1/versions), [Georgia, 2020 and 2024](https://api.worldbank.org/pip/v1/pip?country=GEO&year=2020%2C2024&povline=3&version=20260922_2021_01_02_PROD&fill_gaps=false&reporting_level=national&welfare_type=consumption&format=json), [world 2024, March version](https://api.worldbank.org/pip/v1/pip-grp?country=all&year=2024&povline=3&version=20260324_2021_01_02_PROD&group_by=world&format=json), and [world 2024, September version](https://api.worldbank.org/pip/v1/pip-grp?country=all&year=2024&povline=3&version=20260922_2021_01_02_PROD&group_by=world&format=json).