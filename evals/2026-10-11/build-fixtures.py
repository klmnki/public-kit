import hashlib, json
from pathlib import Path
from decimal import Decimal

ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parents[1]

def read(rel):
    return json.loads((PROJECT / rel).read_text(encoding='utf-8-sig'))

def write(rel, obj):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def origin(rel, form):
    return {'savedSource': rel, 'sha256': hashlib.sha256((PROJECT / rel).read_bytes()).hexdigest(), 'evidenceForm': form}

ilo_path = 'examples/ilostat/snapshots/2026-10-11-mda-geo-srb-2021-2024.json'
ilo = read(ilo_path)
fields = ['ref_area','source','indicator','sex','time','obs_value','obs_status','note_indicator','note_source']
ilo_rows = [{k:r[k] for k in fields} for r in ilo['rows'] if 2022 <= int(r['time']) <= 2024]
write('inputs/ilostat/evidence.json', {
    'provenance': origin(ilo_path, 'Exact retained observation field strings and metadata excerpt; full original bulk CSV body is not retained in this pack.'),
    'source': ilo['source'], 'requests': ilo['requests'], 'retrievedAt': ilo['retrievedAt'],
    'selection': {'countries':['MDA','GEO','SRB'],'years':[2022,2023,2024],'sex':'SEX_T'},
    'rows': ilo_rows, 'metadata': ilo['metadata']})

pip_path = 'examples/pip/snapshot.json'
pip = read(pip_path)
write('inputs/pip/evidence.json', {
    'provenance': origin(pip_path, 'Embedded parsed API response objects, copied without derived rows or comparison results; original HTTP byte stream is not retained.'),
    'source': pip['source'], 'retrievedAt': pip['retrievedAt'], 'requests': pip['requests']})

es_paths = ['examples/eurostat/snapshots/eu-unemployment-2026-10-11T14-40-55-325Z.json','examples/eurostat/snapshots/eu-unemployment-2026-10-11T14-41-27-831Z.json']
es_keys = ['identity','source','request','retrievedAt','dimensionLabels','rows']
write('inputs/eurostat/evidence.json', {'snapshots': [dict(provenance=origin(p, 'Saved normalized observation extract; original JSON-stat response body is unavailable, so this case cannot test raw JSON-stat indexing.'), **{k:read(p)[k] for k in es_keys}) for p in es_paths]})

prompts = {
'ilostat': 'Prepare a short labour briefing comparing Moldova, Georgia and Serbia from 2022 to 2024 using the supplied ILOSTAT extract. Which country had the largest fall, and did Serbia improve between 2023 and 2024? Give the endpoint rates and changes, explain what the indicator covers, and say whether this supports a claim about youth unemployment or a regional rate. Include the source, retrieval date, query details needed to reproduce the selection, and the main limitations. Use only the supplied evidence; do not fetch new data.',
'pip': 'A colleague says: "The new poverty release proves global poverty fell by 22.5 million between March and September 2026, alongside a decline in Georgia since 2020." Check that sentence using the supplied PIP responses. Give a corrected short briefing with the rates and differences, explain what each comparison measures, and identify the poverty threshold, PPP basis, release versions and coverage. Include source and reproducible request details. Use only the supplied evidence; do not fetch new data.',
'eurostat': 'Prepare an EU unemployment update from the two supplied Eurostat snapshots. What is the latest available rate, how does it compare with the previous available month, and does the later snapshot show a revision or a withdrawal? Explain the September entry and the missing June entry in the later window. State the series coverage, adjustment, source, retrieval dates and request details. Keep the briefing short and clear about what these snapshots can and cannot establish. Use only the supplied evidence; do not fetch new data.'}
for case, prompt in prompts.items():
    (ROOT / 'inputs' / case / 'prompt.txt').write_text(prompt + '\n', encoding='utf-8')

assertions = {
'ilostat': [
('I1','Identifies ILOSTAT SDG 8.6.1 NEET, ages 15-24, both sexes; denominator is total youth population, not labour force.'),
('I2','Reports 2022/2024 rates MDA 14.963/11.491, GEO 20.166/14.692, SRB 13.231/12.598 percent, allowing consistent rounding within 0.011.'),
('I3','Reports changes MDA -3.472, GEO -5.474, SRB -0.633 percentage points; Georgia has largest fall. Labels percentage points correctly.'),
('I4','Reports Serbia 12.397 in 2023 to 12.598 in 2024: increase of 0.201 percentage points, so no improvement on this indicator over that year.'),
('I5','Does not call NEET youth unemployment and does not present an unweighted average as the regional rate.'),
('I6','Identifies national LFS observations processed by ILOSTAT, preserves source/coverage distinction from modelled estimates, and avoids causal claims.'),
('I7','Gives ILOSTAT link, retrieval 2026-10-11, indicator SDG_0861_SEX_RT_A bulk request and selection MDA/GEO/SRB, SEX_T, 2022-2024; notes blank flags do not establish certainty or national-source equivalence.'),
('I8','Discloses saved extract boundary and possible future revisions; does not claim live revalidation or original full-body verification.')],
'pip': [
('P1','Converts headcount fractions to percentages: Georgia 11.98% (2020) and 4.23% (2024), decline 7.75 percentage points.'),
('P2','Uses same September 2026 version for both Georgia years; calls this a time comparison, not a release revision.'),
('P3','World 2024 rates 10.40% and 10.12% differ by -0.28 percentage points; published people counts 846762143 and 824298368 differ by -22463775.'),
('P4','Calls the World pair a revision of the same reporting year across March/September 2026 releases; explicitly rejects interpreting it as people escaping poverty during those months.'),
('P5','States $3.00/person/day at 2021 PPP and cites exact versions 20260324_2021_01_02_PROD and 20260922_2021_01_02_PROD.'),
('P6','Distinguishes Georgia national consumption survey estimates (2020 and 2024 survey years, same comparable spell) from the World aggregate; does not treat World reporting year as a single survey year.'),
('P7','Gives World Bank/PIP source, retrieval 2026-10-11, country/years, povline=3, version and country endpoint versus group_by=world aggregate endpoint; does not silently substitute current-default release.'),
('P8','Does not invent Georgia people counts as official published fields, attribute causes, or assert intervening annual trajectories not supplied.')],
'eurostat': [
('E1','Latest non-missing observation is August 2026, 6.1%; September 2026 is present but null, not 0 and not an available September rate.'),
('E2','July 2026 is also 6.1%; displayed monthly change is 0.0 percentage points, not proof of constant counts or unrounded estimates.'),
('E3','Correctly identifies EU27_2020 aggregate, both sexes, total age, monthly unemployment, percent of labour force, seasonally adjusted.'),
('E4','No value or flag revision detected in overlapping July/August observations; makes no claim of no revisions outside the overlap or for all future releases.'),
('E5','June is outside the later lastTimePeriod=3 query window; no evidence it was withdrawn or became missing.'),
('E6','Separates source updated timestamp 2026-10-08 from observation month and the two retrievals on 2026-10-11.'),
('E7','Links Eurostat source and gives dataset une_rt_m, fixed June-August window vs lastTimePeriod=3, and freq=M, geo=EU27_2020, sex=T, age=TOTAL, unit=PC_ACT, s_adj=SA.'),
('E8','Discloses snapshots are saved normalized extracts, with original JSON-stat body unavailable; does not invent revision examples, impute missing data or claim current live verification.')]
}
write('oracle.json', {'scoring': {'perAssertion': '0 = absent/incorrect, 1 = partial, 2 = complete; grade content, not verbatim phrasing', 'maxPerCase':16,'maxPerArm':48,'numericalTolerance':0.011,'criticalErrors':['NEET called unemployment','fraction interpreted directly as percent','same-year revision called temporal decline','missing value treated as zero','query-window exclusion called withdrawal'], 'rules':'Record a quote from each answer for every awarded point; unsupported implication counts against the relevant assertion. A stated limitation may satisfy multiple assertions only where directly relevant.'}, 'cases':{k:[{'id':i,'assertion':v} for i,v in rows] for k,rows in assertions.items()}, 'expectedComputedValues':{'ilostatChangePp':{c:str(Decimal(next(r['obs_value'] for r in ilo_rows if r['ref_area']==c and r['time']=='2024'))-Decimal(next(r['obs_value'] for r in ilo_rows if r['ref_area']==c and r['time']=='2022'))) for c in ['MDA','GEO','SRB']},'serbia2023To2024Pp':'0.201','georgia2020To2024Pp':'-7.75','worldRevisionPp':'-0.28','worldRevisionPeople':-22463775,'eurostatLatestPeriod':'2026-08','eurostatLatestValue':6.1}})
write('manifest.json', {'id':'saved-evidence-comparison-2026-10-11','status':'cases-prepared; no trial outcomes asserted','cases':[{'id':case,'prompt':f'inputs/{case}/prompt.txt','evidence':f'inputs/{case}/evidence.json','assertions':8} for case in prompts], 'arms':['baseline: supplied prompt and evidence only','with-skill: identical prompt and evidence plus exact one-file Global Data Kit being evaluated'], 'holdout':'oracle.json and source example READMEs/scripts/comparisons must be withheld from answering agents.', 'gaps':['ILOSTAT supports a new 2022-2024 subperiod but retains selected raw fields, not the complete downloaded bulk body.','PIP has no additional saved years beyond the original example: this tests reinterpretation, not unseen endpoint generalization.','Eurostat raw JSON-stat payload is not retained; normalized extracts cannot test decoder correctness.','No genuine observed revision in the saved Eurostat overlap; no synthetic official record is introduced.','Saved-evidence tests do not establish live API retrieval or autonomous source discovery quality.']})
print('Wrote three isolated input packs, manifest and separate oracle.')
