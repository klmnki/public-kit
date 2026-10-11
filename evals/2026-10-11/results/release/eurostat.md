The latest available EU unemployment rate in the supplied snapshots is **6.1% for August 2026**, unchanged from July: **0.0 percentage points**.

The later snapshot shows **no revision or withdrawal in the overlapping July–August observations**: both remain 6.1%, with null status fields.

- **September** is present but has a null value. It is the latest selected period, not the latest available observation. `lastTimePeriod=3` selects three dataset periods, which need not contain three available rates. These snapshots do not establish why September lacks a value.
- **June** falls outside the later July–September window. Its absence is a coverage change, not evidence of withdrawal.

The series is Eurostat’s **`une_rt_m`**, covering the **EU27_2020 aggregate, total age and sex**, monthly unemployment as a **percentage of the labour force**, **seasonally adjusted but not calendar adjusted**. Source: [Eurostat, European Commission](https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table?lang=en). Both extracts report a source update of **8 October 2026, 11:00 +02:00**.

The requests used `lang=en&freq=M&geo=EU27_2020&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA`:

| Retrieved at (UTC) | Request window |
|---|---|
| 11 October 2026, 14:40:55.325 | [Fixed June–August request](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?lang=en&freq=M&geo=EU27_2020&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA&sinceTimePeriod=2026-06&untilTimePeriod=2026-08) |
| 11 October 2026, 14:41:27.831 | [Rolling request: `lastTimePeriod=3`](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?lang=en&freq=M&geo=EU27_2020&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA&lastTimePeriod=3) |

These findings rely on supplied **normalized extracts**. Original JSON-stat responses are unavailable, so raw indexing cannot be verified; the comparison establishes only what changed within the overlapping coverage.