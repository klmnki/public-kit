"""Bounded release checks: links, accidental private material, exact skill artifact."""
from pathlib import Path
import hashlib
import re

root = Path(__file__).resolve().parents[1]
errors = []
skip = {'.git', 'dist', 'release', 'node_modules'}
patterns = [r'sk-[A-Za-z0-9_-]{20,}', r'gh[pousr]_[A-Za-z0-9]{20,}', r'AKIA[A-Z0-9]{16}', r'C:\\Users\\', r'C:\\Antigravity', r'-----BEGIN .*PRIVATE KEY-----']
for path in root.rglob('*'):
    if not path.is_file() or any(p in skip for p in path.relative_to(root).parts) or path.name == 'audit-release.py':
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
if errors:
    raise SystemExit('\n'.join(errors))
print('Release audit passed: local links, private-material patterns, identical skill and checksum.')
