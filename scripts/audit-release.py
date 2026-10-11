"""Bounded release checks: links, accidental private material, exact skill artifact."""
from pathlib import Path
import hashlib
import re
import csv
import json

root = Path(__file__).resolve().parents[1]
errors = []
skip = {'.git', 'dist', 'node_modules', '.cache', 'output', '.playwright-cli'}
patterns = [r'sk-[A-Za-z0-9_-]{20,}', r'gh[pousr]_[A-Za-z0-9]{20,}', r'AKIA[A-Z0-9]{16}', r'C:\\Users\\', r'C:\\Antigravity', r'-----BEGIN .*PRIVATE KEY-----']
for path in root.rglob('*'):
    if not path.is_file() or path.relative_to(root).parts[0] == 'release' or any(p in skip for p in path.relative_to(root).parts) or path.name == 'audit-release.py':
        continue
    content = path.read_text(encoding='utf-8')
    if any(re.search(pattern, content) for pattern in patterns):
        errors.append(str(path.relative_to(root)) + ': private-material pattern')
    if path.suffix == '.md':
        for target in re.findall(r'\]\(([^)]+)\)', content):
            if target.startswith(('https://', 'http://', '#')):
                continue
            if not (path.parent / target.split('#')[0]).exists():
                errors.append(str(path.relative_to(root)) + ': missing local link ' + target)
skill = (root / 'SKILL.md').read_bytes()
if skill != (root / 'dist/SKILL.md').read_bytes():
    errors.append('Published skill differs from source')
expected = hashlib.sha256(skill).hexdigest() + '  SKILL.md\n'
if (root / 'dist/SHA256SUMS.txt').read_text() != expected:
    errors.append('Incorrect skill checksum')
with (root / 'dist/public-kit-population-2020-2024.csv').open(encoding='utf8', newline='') as stream:
    exported = list(csv.DictReader(stream))
observations = json.loads((root / 'data/verified-example.json').read_text(encoding='utf8'))['response'][1]
actual = {(r['iso3'], r['year']): (r['population'], r['footnote']) for r in exported}
wanted = {(r['countryiso3code'], r['date']): (str(r['value']), r.get('footnote','')) for r in observations}
if len(exported) != 15 or actual != wanted:
    errors.append('CSV does not preserve all 15 observations and footnotes')
if errors:
    raise SystemExit('\n'.join(errors))
print('Release audit passed: local links, private-material patterns, identical skill and checksum, complete CSV with footnotes.')
