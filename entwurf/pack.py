"""Packt alles für GitHub in den Ordner github_upload/ (ohne Geheimnisse, ohne große Dateien).
Aufruf im Projektordner:  python entwurf\\pack.py
Danach: github_upload zippen bzw. dessen Inhalt ins Repo MJung02/Engineering-Cockpit legen.
GitHub Pages: Settings > Pages > Branch main, Ordner / (root)."""
import os, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'github_upload')
E = os.path.join(ROOT, 'entwurf')

# nie hochladen: Geheimnisse, große/lokale Dateien, Werkzeugordner
SKIP_DIRS = {'.git', '.venv', 'venv', 'models', '__pycache__', '.claude', 'github_upload', 'entwurf', '{pages,components,utils,assets}', 'v2_export'}
SKIP_FILES = {'.env', '.DS_Store', 'engineering_cockpit.db', 'Projektverwaltung.lnk'}
SKIP_EXT = ('.gguf', '.bin', '.db', '.sqlite', '.pyc', '.lnk')

def _clear(path):
    """Inhalt löschen; OneDrive sperrt manchmal leere Ordner – die bleiben dann einfach stehen."""
    for dp, dns, fns in os.walk(path, topdown=False):
        for f in fns:
            p = os.path.join(dp, f)
            try:
                os.chmod(p, 0o666); os.remove(p)
            except OSError as e:
                sys.exit('Kann ' + p + ' nicht löschen (Datei offen?): ' + str(e))
        for d in dns:
            try:
                os.rmdir(os.path.join(dp, d))
            except OSError:
                pass


if os.path.isdir(OUT):
    _clear(OUT)
os.makedirs(OUT, exist_ok=True)

# 1) Seite (index.html, app.js, dc-runtime.js, .nojekyll) ins Wurzelverzeichnis
subprocess.check_call([sys.executable, os.path.join(E, 'build_pages.py'), os.path.join(E, 'Main.dc.html'), OUT])

# 2) Entwurf-Quelle und Werkzeuge
shutil.copytree(E, os.path.join(OUT, 'entwurf'), ignore=shutil.ignore_patterns('__pycache__', '*.pyc', 'site_test', 'v2_export', '*.json'), dirs_exist_ok=True)

# 3) Dokumente (ohne Sicherungskopien)
os.makedirs(os.path.join(OUT, 'docs'), exist_ok=True)
for f in os.listdir(os.path.join(ROOT, 'docs')):
    if 'backup' in f.lower():
        continue
    p = os.path.join(ROOT, 'docs', f)
    if os.path.isfile(p):
        shutil.copy2(p, os.path.join(OUT, 'docs', f))

# 4) bisherige v2.0-App (Streamlit) ohne .env, Modell, venv, Datenbank
V2 = os.path.join(OUT, 'v2_streamlit')
for dp, dns, fns in os.walk(ROOT):
    rel = os.path.relpath(dp, ROOT)
    dns[:] = [d for d in dns if d not in SKIP_DIRS and not (rel == '.' and d == 'docs')]
    for f in fns:
        if f in SKIP_FILES or f.lower().endswith(SKIP_EXT):
            continue
        if rel == '.' and f in ('index.html',):
            continue
        dst = os.path.join(V2, rel, f)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(os.path.join(dp, f), dst)
open(os.path.join(V2, 'models', 'HIER_GGUF_MODELL_ABLEGEN.txt') if os.path.isdir(os.path.join(V2, 'models')) else os.path.join(V2, 'MODELL_HINWEIS.txt'), 'w', encoding='utf-8').write(
    'Das lokale KI-Modell (z. B. Phi-3.5-mini-instruct-Q4_K_M.gguf, 2,3 GB) ist zu groß für GitHub.\nBitte separat in den Ordner models/ legen.\n')

# 5) .gitignore und README
open(os.path.join(OUT, '.gitignore'), 'w', encoding='utf-8').write('''# nie ins Repository
.env
*.gguf
*.db
.venv/
venv/
__pycache__/
*.pyc
.DS_Store
v2_export/
cockpit_import.json
entwurf/site_test/
''')
shutil.copy2(os.path.join(E, 'README_repo.md'), os.path.join(OUT, 'README.md'))

# 6) Prüfung: keine verbotenen Dateien, nichts über 25 MB
bad = []
for dp, dns, fns in os.walk(OUT):
    for f in fns:
        p = os.path.join(dp, f)
        if f == '.env' or f.lower().endswith(('.gguf', '.db')) or os.path.getsize(p) > 25e6:
            bad.append(p)
n = sum(len(fns) for _, _, fns in os.walk(OUT))
size = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fns in os.walk(OUT) for f in fns)
assert not bad, bad
print('github_upload fertig:', n, 'Dateien,', round(size / 1e6, 1), 'MB')
