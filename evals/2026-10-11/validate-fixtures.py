import hashlib, json
from pathlib import Path
from decimal import Decimal
ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parents[1]
def read(p): return json.loads(p.read_text(encoding='utf-8-sig'))
manifest = read(ROOT/'manifest.json')
assert len(manifest['cases']) == 3
for case in manifest['cases']:
    pack = read(ROOT/case['evidence'])
    assert (ROOT/case['prompt']).is_file()
    for record in pack.get('snapshots',[pack]):
        provenance = record['provenance']
        source = PROJECT/provenance['savedSource']
        assert hashlib.sha256(source.read_bytes()).hexdigest() == provenance['sha256']
        assert not set(record).intersection(['changes','comparisons','comparison','limitations'])
ilo = read(ROOT/'inputs/ilostat/evidence.json')
original = read(PROJECT/ilo['provenance']['savedSource'])
assert len(ilo['rows']) == 9
for row in ilo['rows']:
    source_row = next(r for r in original['rows'] if r['ref_area']==row['ref_area'] and r['time']==row['time'])
    assert all(source_row[k] == v for k,v in row.items())
pip = read(ROOT/'inputs/pip/evidence.json')
assert pip['requests'] == read(PROJECT/pip['provenance']['savedSource'])['requests']
responses = {r['id']:r['response'] for r in pip['requests']}
geo = responses['georgia']
assert (Decimal(str(geo[1]['headcount']))-Decimal(str(geo[0]['headcount'])))*100 == Decimal('-7.75')
for snap in read(ROOT/'inputs/eurostat/evidence.json')['snapshots']:
    assert snap['rows'] == read(PROJECT/snap['provenance']['savedSource'])['rows']
oracle=read(ROOT/'oracle.json')
assert all(len(v)==8 for v in oracle['cases'].values())
for path in (ROOT/'inputs').rglob('*'):
    if path.is_file():
        text=path.read_text(encoding='utf-8')
        assert 'C:\\' not in text and 'C:/' not in text
print('PASS: 3 cases; 24 assertions; source hashes, exact retained data, derived-result exclusion, arithmetic and public-safe paths verified.')
