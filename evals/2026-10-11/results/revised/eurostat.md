The latest available EU unemployment rate in the supplied snapshots is **6.1% for August 2026**, unchanged from July’s 6.1%—a difference of **0.0 percentage points**. Source: [Eurostat, European Commission, dataset `une_rt_m`](https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table?lang=en).

The later snapshot shows **no revision or withdrawal in the overlapping months**: July and August remain at 6.1%, with status fields still null.

- **September:** present in the later response, but its value is null. It is the latest returned period, not the latest available observation; it must not be treated as zero. The extract provides no reason for the missing value.
- **June:** recorded at 6.1% in the earlier snapshot, but outside the later July–September window. Its absence does not indicate withdrawal.

The series covers the **EU27_2020 aggregate, total age and sex**, monthly unemployment as a percentage of the labour force. It is **seasonally adjusted, not calendar adjusted**.

Both requests use `lang=en&freq=M&geo=EU27_2020&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA`:

| Snapshot | Request window | Retrieved (UTC) |
|---|---|---|
| Earlier | [Fixed June–August: `sinceTimePeriod=2026-06&untilTimePeriod=2026-08`](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?lang=en&freq=M&geo=EU27_2020&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA&sinceTimePeriod=2026-06&untilTimePeriod=2026-08) | 2026-10-11 14:40:55.325 |
| Later | [Rolling: `lastTimePeriod=3`](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?lang=en&freq=M&geo=EU27_2020&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA&lastTimePeriod=3) | 2026-10-11 14:41:27.831 |

Both report source update time **2026-10-08 11:00:00 +02:00**. These normalized extracts establish the comparison above; they cannot verify raw JSON-stat indexing, explain September’s missing value, or establish changes outside their coverage.