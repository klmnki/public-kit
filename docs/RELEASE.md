# Global Data Kit 0.3.1-rc.1

18 free institutional data guides for Codex and Claude Code. The primary artifact remains one self-contained [SKILL.md](../SKILL.md). This preview renames Public Kit to Global Data Kit. The 18 guides, analysis methods and saved observations are unchanged.

## What changed in 0.3.1

- The skill name is `global-data-kit`. Save it in a matching folder and invoke `$global-data-kit` in Codex or `/global-data-kit` in Claude Code. [Installation and migration](INSTALL.md).
- The compact website, repository documentation and banner use Global Data Kit. Existing repository and website addresses continue to work.
- The page shows the skill download, installation paths, 18 sources and three analyses in coloured tiles. Open a tile for source details, tables or the method.

## Rename checks, 11 October 2026

All 33 existing tests, the site build, release audit and skill validator passed after the rename. The desktop page fits at 1366 × 768. A 390-pixel mobile check found no horizontal overflow; the Codex and Claude tabs show the new install paths and invocations. The browser reported no console errors. The skill checksum is recorded in the build’s `SHA256SUMS.txt`.

## Included since 0.3.0

- **ILOSTAT:** twelve youth NEET observations for Moldova, Georgia and Serbia, 2021–2024, with source labels, notes and percentage-point changes. Missing years and breaks are handled explicitly.
- **PIP:** Georgia's 2020–2024 poverty comparison and a separate revision to the world's 2024 estimate across March and September releases. Exact API versions establish the $3/day, 2021 PPP basis.
- **Eurostat:** fixed and rolling unemployment queries, dated snapshots and separate new/revised/missing/flag comparisons. The saved rolling query includes a missing September value instead of inventing an observation.
- The skill explains how to preserve a query and compare later extracts. Optional scripts reproduce the three examples; they are not required to install or use the skill.
- The website provides sourced tables, saved JSON, copyable questions and links to reproduction instructions. [Public ChatGPT Site](https://public-kit.klmnki.chatgpt.site/) and [GitHub Pages](https://klmnki.github.io/public-kit/) use the same application source.

## Prior analysis verification, 11 October 2026

All three examples returned numeric observations through anonymous public routes. Their folders contain request details, data provenance and boundaries. Empty or invalid selections were tested. Thirty-three offline tests passed across the original population example and the three new examples. The standalone skill validator, site build, syntax checks and release audit passed.

An independent reviewer found and corrected two Eurostat issues before release: backwards snapshot comparison and response-size checking after full download. Regression tests now check chronology and enforce a streaming byte limit.

A separate agent used only the revised skill and official source responses for a new Moldova poverty question. It verified the selected production version, survey comparability and percentage-point arithmetic in three live requests. This was a forward-use check, not a controlled evaluation or a Claude client test.

Desktop and 390-pixel mobile views were inspected with Playwright. Example controls, keyboard navigation, source values and the missing September observation were checked; no page overflow or browser console errors were found.

The public pages display dated snapshots. They do not refresh automatically. Running a script requires network access and Node.js 22 or later; local execution was on Node.js 24.13.0. The GitHub workflow runs Node.js 22.

## Remaining limits

Earlier OECD numeric queries failed; NASA FIRMS and Copernicus authenticated retrievals remain untested. The other retained sources keep their dated checks from 0.2. No claim is made that all 18 guides have complete end-to-end validation or that this preview improves accuracy or saves time across clients.

Provider data retain their own licences. [NOTICE](../NOTICE.md) records attribution and transformations. Global Data Kit is an independent personal project by Ievgen Kylymnyk.
