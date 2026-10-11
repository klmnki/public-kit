# Global Data Kit: comparative tests

On 11 October 2026 we ran 15 fresh Codex sessions: three saved-data questions, first without a skill, then with the original file and three successive revisions. Both the baseline and every skill version got the main calculations and substantive comparisons right. This small test does not establish a general accuracy or speed advantage.

The released file is 27% shorter. The tests prompted two changes: explicitly disclose missing original responses when working from processed extracts, and keep historical facts in skill examples out of answers restricted to new evidence.

## Results

Each case had eight assertions, scored 0, 1 or 2 against a rubric written before the runs. All intermediate attempts are included.

| Condition | ILOSTAT /16 | PIP /16 | Eurostat /16 | Total /48 |
| --- | ---: | ---: | ---: | ---: |
| No skill | 16 | 16 | 15 | 47 |
| Original 0.3.1-rc.1 | 16 | 16 | 16 | 48 |
| First compact draft | 16 | 16 | 15 | 47 |
| Compact draft with provenance rule | 16 | 15 | 16 | 47 |
| Released 0.3.2-rc.1 | 16 | 16 | 16 | 48 |

The baseline did not explicitly compare Eurostat's overlap status flags. The first compact draft did not disclose that the original JSON-stat response bodies were absent. After adding that disclosure rule, the next PIP answer included an exact historical publication date taken from the skill, outside the task's supplied evidence. We removed that aside and clarified the evidence boundary. The final run passed the rubric; the original file had also passed it.

The intermediate PIP aside was unsupported by the supplied evidence, not demonstrated false. No factual errors in the main calculations were identified by the grader.

## What changed

- Kept all 18 source guides, all 49 URLs and all 18 fenced request examples.
- Removed repeated instructions, duplicate prompts and dated result tables already available in the repository examples.
- Retained source-specific access, units, error handling, pagination and repeat-analysis guidance.
- Added explicit handling of processed extracts and dated instructional examples.

The file fell from 4,684 to 3,422 whitespace-delimited words (26.94%). Added input reported by the CLI, relative to each matched baseline, fell from 7,998 to 6,277 tokens (21.52%). This measures the skill plus its instruction wrapper, not total session cost. Cache use and elapsed time varied; these runs do not support a speed claim.

## Method

- Codex CLI 0.162.0-alpha.17.2, requested model alias `gpt-6.1-sol`, medium reasoning. The resolved backend model version was not independently verified.
- One fresh process per case and condition. Identical task and evidence in each matched run; treatment also received the exact skill in a separate instruction block.
- All 71 discovered local skills disabled per process. User/project instructions, memories, plugins, apps and delegation disabled. A preflight confirmed no installed Global Data Kit guidance in the baseline.
- Read-only sandbox; answers were instructed to use only supplied evidence. No tool calls occurred. The CLI's experimental-feature warning was recorded, not treated as an answer failure.
- An independent agent graded answers with condition labels masked, using the fixed rubric. Supporting quotations were mechanically checked against the saved answers. Grading remains model-assisted judgment, not independent human review.

The cases cover ILOSTAT NEET changes for Moldova, Georgia and Serbia in 2022–2024; a PIP country trend versus a same-year global revision; and Eurostat's latest nonmissing month, overlapping values and flags, and a row absent because the query window moved.

## Limits

Three cases, one run per condition and one model are insufficient to estimate general performance. Revisions were retested on the same cases: this is regression testing, not an unseen validation set. The PIP observations already appeared in repository examples, although the question framing changed.

These runs test interpretation of supplied data. They do not test live retrieval, source discovery, automatic skill activation, failure recovery from a real API, or the other source families. The ILOSTAT full download and original Eurostat response bodies were unavailable; the fixtures disclose those limits. Claude Code was not installed and was not tested.

## Inspect or repeat

- [Protocol and fixture limits](../evals/2026-10-11/README.md)
- [Fixed rubric](../evals/2026-10-11/oracle.json)
- [All 15 unchanged answers](../evals/2026-10-11/results/)
- [Run settings, hashes, counts and scores](../evals/2026-10-11/results.json)
- [Original and baseline grades](../evals/2026-10-11/grades.json), [compact draft](../evals/2026-10-11/grades-gamma.json), [provenance revision](../evals/2026-10-11/grades-delta.json), [release](../evals/2026-10-11/grades-epsilon.json)

Tested release SKILL.md SHA-256: `cb732d70921dee5a7b482c1e3d85247539b2e400f12bd22ac5d1d6fb63c7976b`.
