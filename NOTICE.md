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