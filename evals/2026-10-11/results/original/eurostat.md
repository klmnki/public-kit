The latest available EU unemployment rate in these snapshots is **6.1% for August 2026**, unchanged from July: **0.0 percentage points** at the published precision.

| Month, 2026 | Earlier snapshot | Later snapshot |
|---|---:|---:|
| June | 6.1% | Outside request window |
| July | 6.1% | 6.1% |
| August | 6.1% | 6.1% |
| September | Outside request window | Null—no available value |

The later snapshot shows **no revision or withdrawal for the overlapping months**, July and August. Their values and null status flags are unchanged. September is a returned period with a missing value, not zero; the rolling request selects three dataset periods, not three available observations. June falls outside that rolling window, so its absence does not indicate withdrawal or establish whether it was revised.

The series covers the **EU aggregate of 27 countries (`EU27_2020`), total age and sex**, monthly unemployment as a **percentage of the labour force**, seasonally adjusted and **not calendar adjusted**. Source: Eurostat, European Commission, dataset [`une_rt_m`](https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table?lang=en). Both extracts record a source update of **8 October 2026, 11:00 +02:00**.

The requests used identical filters: `lang=en`, `freq=M`, `geo=EU27_2020`, `sex=T`, `age=TOTAL`, `unit=PC_ACT`, `s_adj=SA`.

- [Fixed June–August request](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?lang=en&freq=M&geo=EU27_2020&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA&sinceTimePeriod=2026-06&untilTimePeriod=2026-08): retrieved **11 October 2026 at 14:40:55.325 UTC**.
- [Rolling request, `lastTimePeriod=3`](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?lang=en&freq=M&geo=EU27_2020&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA&lastTimePeriod=3): retrieved **11 October 2026 at 14:41:27.831 UTC**.

These saved extracts establish the comparison above, not current values or why September is missing. The original JSON-stat responses are unavailable, so raw indexing cannot be verified.