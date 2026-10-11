The latest available EU unemployment rate in these snapshots is **6.1% for August 2026**, unchanged from July (**0.0 percentage points**).

The later snapshot shows **no revision in the overlapping July–August values and no evidence of withdrawal**. September is present with a null value: `lastTimePeriod=3` selects the latest three dataset periods, July–September, rather than three available observations. June’s absence reflects the shifted query window; it does not establish that June’s previously reported 6.1% was withdrawn.

The series covers the **EU-27 (from 2020), total age and sex**, monthly unemployment as a percentage of the labour force, **seasonally adjusted but not calendar adjusted**. Source: [Eurostat, European Commission, dataset `une_rt_m`](https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table?lang=en). Both extracts record a source update of **8 October 2026, 11:00 +02:00**; all observation statuses are null.

Both requests used `lang=en&freq=M&geo=EU27_2020&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA`:

| Snapshot retrieval time (UTC) | Request window |
|---|---|
| 11 October 2026, 14:40:55.325 | [Fixed June–August](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?lang=en&freq=M&geo=EU27_2020&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA&sinceTimePeriod=2026-06&untilTimePeriod=2026-08): `sinceTimePeriod=2026-06&untilTimePeriod=2026-08` |
| 11 October 2026, 14:41:27.831 | [Latest three periods](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?lang=en&freq=M&geo=EU27_2020&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA&lastTimePeriod=3): `lastTimePeriod=3` |

These are supplied normalized extracts, not original JSON-stat responses. They support this comparison, but cannot verify raw indexing, explain why September lacks a value, or establish changes outside their coverage.