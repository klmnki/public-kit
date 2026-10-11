The latest available unemployment rate **in the supplied snapshots is 6.1% for August 2026**, unchanged from July’s 6.1% (a change of **0.0 percentage points**).

The later snapshot shows **no evidence of a revision or withdrawal**: July and August remain at 6.1%. September is present but has a null value and no status flag, so it supplies no usable rate or explanation for its absence. June’s omission reflects the different request window: the later extract contains July–September, whereas the earlier request explicitly covered June–August. It does not establish that June was withdrawn.

The series covers the **EU27_2020**, total sex and age, monthly unemployment as a percentage of the active population (`PC_ACT`). It is **seasonally adjusted, not calendar adjusted** (`SA`).

Source: Eurostat, European Commission (ESTAT), dataset `une_rt_m`, *Unemployment by sex and age – monthly data*, via the [Eurostat statistics API](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m). Both snapshots report a source update of **8 October 2026, 11:00 +0200**.

| Retrieval timestamp (UTC) | Request window |
|---|---|
| 11 October 2026, 14:40:55.325 | `sinceTimePeriod=2026-06&untilTimePeriod=2026-08` |
| 11 October 2026, 14:41:27.831 | `lastTimePeriod=3`, yielding July–September |

Both requests used `lang=en&freq=M&geo=EU27_2020&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA`.

These are saved normalized extracts. They establish the displayed values and window differences, but cannot explain September’s null, establish wider revision history, or verify raw JSON-stat indexing because the original response bodies are unavailable.