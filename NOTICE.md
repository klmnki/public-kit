# Authorship and data licences

Ievgen Kylymnyk wrote Public Kit's instructions, code, graphics and documentation. The [MIT licence](LICENSE) covers this original material to the extent the author holds the rights. Provider responses, datasets and documentation retain their own licences.

## World Bank example

[data/verified-example.json](data/verified-example.json) includes a saved World Bank Indicators API response for **Population, total (`SP.POP.TOTL`)**, from World Development Indicators: Moldova, Georgia and Serbia, 2020–2024. Retrieval: **10 October 2026, 18:41:11 UTC**. The file records the exact query and retains the response's footnotes.

Attribution: **World Bank, World Development Indicators, Population, total (`SP.POP.TOTL`), accessed 10 October 2026.** The [indicator page](https://data.worldbank.org/indicator/SP.POP.TOTL) specifies [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). The [World Bank data licensing terms](https://datacatalog.worldbank.org/public-licenses) also apply.

Public Kit adds a provenance wrapper to the response and uses the observations in tables and a CSV. The displayed percentage change is a derived calculation: `(2024 value − 2020 value) / 2020 value × 100`, rounded to one decimal place. These adaptations do not change the underlying observations. The project's MIT licence does not replace the data licence.

## Other sources and inspiration

The source directory contains authored instructions and links to provider documentation. Check each selected dataset's attribution, reuse conditions and access limits. Public catalogue access does not establish permission to redistribute all listed resources.

[sgarcese's Civic Analytics Agent Workflow](https://github.com/sgarcese/Civic-Analytics-Agent-Workflow-Claude-Skill) inspired the decision to share this work as a skill. Public Kit uses independently written instructions. The GenAI Builders work informed its question-to-data approach.

Public Kit is a personal project. The listed institutions do not endorse it, and their names identify the sources they operate.
## Repeatable examples added in 0.3

- **ILOSTAT:** SDG 8.6.1, youth NEET ages 15–24, both sexes, selected Moldova/Georgia/Serbia observations for 2021–2024; accessed 11 October 2026. [ILO's data licence](https://www.ilo.org/rights-and-permissions) is CC BY 4.0 for current public datasets. The extract preserves source and note codes; Public Kit adds labels and percentage-point calculations. See [provenance](examples/ilostat/README.md).
- **World Bank PIP:** $3.00/day, 2021 PPP, versions 20260324_2021_01_02_PROD and 20260922_2021_01_02_PROD; accessed 11 October 2026. Data use [CC BY 4.0](https://datacatalog.worldbank.org/search/dataset/0038020/poverty-and-equity-database-poverty-and-inequality-platform). Public Kit retains responses and adds percentages, time changes and same-year revision calculations. See [provenance](examples/pip/README.md).
- **Eurostat:** une_rt_m, EU27_2020, monthly, total age/sex, seasonally adjusted, percentage of the labour force; accessed 11 October 2026. Reuse follows [Eurostat's copyright notice](https://ec.europa.eu/eurostat/about-us/policies/copyright). Public Kit decodes the series, preserves missing values and compares dated snapshots. See [provenance](examples/eurostat/README.md).

Provider data and names retain their own rights. The repository's MIT licence covers original code and instructions, not ownership of the underlying datasets. The public tables round rates for display; JSON snapshots retain the retrieved precision and provenance.
