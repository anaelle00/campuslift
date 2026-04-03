import subprocess, re

# Récupère tous les commits
result = subprocess.run(['git', 'log', '--format=%H', '--all'], capture_output=True, text=True)
commits = result.stdout.strip().split('\n')
print(f"Found {len(commits)} commits to process")

# Utilise git filter-branch comme fallback
subprocess.run([
    'git', 'filter-branch', '--force', '--msg-filter',
    'python -c "import sys,re; msg=sys.stdin.read(); print(re.sub(r\"\n\nCo-Authored-By:.*$\", \"\", msg, flags=re.MULTILINE|re.DOTALL).rstrip())"',
    '--', '--all'
], check=True)
