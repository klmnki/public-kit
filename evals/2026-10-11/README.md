# Saved-evidence paired comparison

Fifteen Codex runs are complete: three cases across the baseline, original skill and three revisions. See the [report](../../docs/EVALUATION.md), [run records](results.json) and [all unchanged answers](results/).

## Run

1. Freeze the exact one-file skill being evaluated; record its SHA-256, agent/model/version and run date in a results file outside `inputs`.
2. Create a fresh agent/session for each case and arm (six answers). Keep model, reasoning settings, tool access, answer budget and evidence identical. Give each agent only its `inputs/<case>/prompt.txt` and `evidence.json`. Do not give it this README, manifest, oracle, builder, other case answers, source example code, or source example README. The treatment arm additionally receives the exact skill file in a separate instruction block, leaving the natural task prompt unchanged. These runs supplied the skill inline; they did not test automatic activation.
3. Capture every answer unchanged under `results/baseline/<case>.md` or `results/with-skill/<case>.md`. An answering agent must not inspect other files or browse; the prompt already limits evidence to the supplied files.
4. Grade after all answers are captured, using `oracle.json`. Prefer an independent grader with arm labels masked. Save assertion scores and supporting answer quotes. Score 0/1/2 per assertion, 16 per case and 48 per arm, and report critical errors separately.
5. Compare individual assertion deltas and failure types. Three cases and one run per arm are a bounded smoke test, not a robust causal estimate or general benchmark. Do not claim gains if both arms tie. Change the skill only for observed, supported defects; use a new fresh run to assess a revision and label any reused case as a retest.

Rebuild exact input packs from saved source evidence with `python evals/2026-10-11/build-fixtures.py` from the public-kit directory. Check their integrity with `python evals/2026-10-11/validate-fixtures.py`.

## Evidence limits

- ILOSTAT uses 2022-2024, a new subperiod of the saved three-country extract. Original observation fields are retained verbatim; added convenience columns, computed changes and editorial limitations are excluded. The original complete download is absent.
- PIP retains the embedded parsed official API responses, request URLs, HTTP status and retrieval timestamps. Derived rows and comparisons are excluded. No new country/year pair is available in the saved evidence, so the case changes the analytical framing instead.
- Eurostat retains observations and metadata from the two saved normalized extracts. Its original JSON-stat response is absent. The overlap has no observed revision; this supports an honest no-detected-revision check but cannot establish revision-detection recall or raw decoding accuracy.
- These fixtures are public safe and frozen. They test interpretation, provenance and handling of limitations, not live retrieval, freshness beyond the saved date, source discovery, or other Global Data Kit source families.
