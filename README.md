![Public Kit: use public data through a conversation](assets/banner.svg)

**Ask a question. Use data from 16 institutional APIs in Codex or Claude Code.**

By [Ievgen Kylymnyk](https://github.com/klmnki) · One SKILL.md · MIT · Preview 0.2.0-rc.1

[**Download SKILL.md**](https://raw.githubusercontent.com/klmnki/public-kit/main/SKILL.md) · [Read the file](SKILL.md) · [See the example](https://klmnki.github.io/public-kit/#example) · [Browse sources](https://klmnki.github.io/public-kit/#sources)

Describe what you need in ordinary language. Public Kit guides your assistant to select an institutional source, request real data, check what came back and explain the result. You can ask for a comparison, a chart, a CSV or a data connection for an app. You do not need to choose an API or know its parameter names first.

## Start with a question

> Compare population in Moldova, Georgia and Serbia from 2020 to 2024. Give me the numbers, the change over the period and the source.

For this question, use the World Bank's population series. A request on **10 October 2026** returned 15 observations covering the three countries and five years:

| Country | 2020 | 2024 | Change |
| --- | ---: | ---: | ---: |
| Georgia | 3,722,716 | 3,812,518 | +2.4% |
| Moldova | 2,635,130 | 2,402,306 | −8.8% |
| Serbia | 6,899,126 | 6,586,476 | −4.5% |

The calculation is `(2024 − 2020) / 2020 × 100`, rounded to one decimal place. Georgia's 2024 figure uses the 2024 census; Moldova's 2023 and 2024 figures are preliminary. Explaining the demographic causes would require more evidence.

Inspect the [saved response and exact query](data/verified-example.json), or [view the example](https://klmnki.github.io/public-kit/#example). The website displays this dated response. In a new conversation, the assistant should retrieve the requested data again.

Then continue: “Add Romania”, “Show the annual series”, or “Put this in a dashboard with a country selector.”

## Install one file

Save [SKILL.md](https://raw.githubusercontent.com/klmnki/public-kit/main/SKILL.md) in your project:

```text
Codex        .agents/skills/public-kit/SKILL.md
Claude Code  .claude/skills/public-kit/SKILL.md
```

Invoke `$public-kit` in Codex or `/public-kit` in Claude Code, followed by your question. [Installation details](docs/INSTALL.md) include personal installation paths.

The file contains the instructions, 16 source routes, example requests and licence. No companion files are required. Your session needs a tool that can fetch URLs or execute HTTP requests, with network access allowed.

## Sources and current checks

The directory covers services from the UN, World Bank, NASA, USGS, European Commission, OECD and Copernicus. The included routes are free, subject to provider terms and quotas. NASA FIRMS and Copernicus require free credentials.

On **10 October 2026**, bounded anonymous requests to 13 services returned usable responses. OECD metadata loaded, but the tested data queries returned HTTP 500. Authenticated NASA FIRMS and Copernicus retrievals remain untested. Some successful requests retrieve dataset metadata; the assistant must then inspect the selected resource to obtain observations.

These checks establish access for specific requests. We have not completed a controlled evaluation of the skill across Codex and Claude. Check the returned dates, coverage and source notes before using a result.

## About the project

My GenAI Builders work informed this approach: start with a practical question, connect useful data and check the result. [sgarcese's Civic Analytics Agent Workflow](https://github.com/sgarcese/Civic-Analytics-Agent-Workflow-Claude-Skill) inspired sharing the instructions as a skill. I wrote Public Kit as an independent personal project; the listed institutions do not endorse it.

[Contribute a correction or tested use case](CONTRIBUTING.md). Original instructions and code use the [MIT licence](LICENSE). Provider data retain their own terms; the World Bank example uses CC BY 4.0. See [NOTICE](NOTICE.md).

## Run the optional website

Use Node.js 22 or later. There are no npm dependencies.

```sh
npm test
npm run build
npm run preview
```

Open `http://127.0.0.1:4188`. The build copies `SKILL.md` to the site and produces its SHA-256 checksum.