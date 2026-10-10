# Public Kit 0.2.0-rc.1

This preview focuses on a practical task: ask a question in ordinary language and use the assistant to retrieve, check and explain public institutional data.

The main artifact remains one [SKILL.md](../SKILL.md) for Codex and Claude Code. It contains the source routes and request instructions, with no companion skill or script required. The session must provide HTTP or browsing tools and network access.

## Changes from 0.1.0-rc.1

- Rewrote the skill around source selection, real requests, response checks and useful outputs. Follow-up questions can change the country, period, measure or format.
- Reduced the directory from 27 providers to 16 institution-operated services with free routes. Removed the 11 providers outside this scope.
- Replaced the synthetic preference simulation with a saved World Bank response: population in Moldova, Georgia and Serbia, 2020–2024. The example retains the request, source footnotes and retrieval time.
- Updated the website, installation instructions and attribution to match the single-file skill.

## Retrieval checks on 10 October 2026

Bounded anonymous requests to 13 services returned usable responses. These include catalogue or product metadata where the service starts with dataset discovery. Each route explains what its sample returns and what further retrieval would require.

OECD metadata loaded; tested numeric requests returned HTTP 500. NASA FIRMS and Copernicus require free credentials, and authenticated retrievals remain untested.

The [World Bank example](../data/verified-example.json) contains 15 observations, three countries and five years, on one response page. Its calculated changes describe the returned national series. Georgia's census note and Moldova's preliminary-data flags limit the interpretation.

## Release checks

- Five Node tests passed: real-response parsing and footnotes, incomplete/error responses, endpoint arithmetic, missing/zero baselines and the standalone 16-source scope.
- The skill format validator, site build and release audit passed. The audit checks local documentation links, selected private-material patterns, exact skill/checksum identity and all 15 CSV observations with footnotes.
- Desktop and 390-pixel mobile views were inspected. The data table, source search, empty results, source expansion and two-source credentials filter worked. No page overflow or browser error logs were observed.
- A separate review adapted the SDG request to Bangladesh in 2021 and retrieved two successive pages, preserving their different sex dimensions. This is a request-level test, not a controlled cross-client evaluation.

This preview has no completed controlled evaluation of behaviour across Codex and Claude. Endpoint checks do not establish future service availability or unrestricted dataset reuse. Public Kit is an independent personal project by Ievgen Kylymnyk.
