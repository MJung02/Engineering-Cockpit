"""Baut aus dem Entwurf (Main.dc.html) eine eigenständige Seite für GitHub Pages.
Aufruf: python build_pages.py <Pfad zu Main.dc.html> <Zielordner>
Ergebnis: <Ziel>/index.html, app.js, dc-runtime.js, .nojekyll"""
import io, json, os, re, shutil, sys, datetime

src, out = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))
s = io.open(src, encoding='utf-8').read()

a = s.index('<x-dc>') + len('<x-dc>'); b = s.index('</x-dc>')
tpl = s[a:b]
h0 = tpl.index('<helmet>'); h1 = tpl.index('</helmet>') + len('</helmet>')
helmet = tpl[h0 + len('<helmet>'):h1 - len('</helmet>')]
tpl = tpl[:h0] + tpl[h1:]
assert '</template>' not in tpl

m = re.search(r"<script type=\"text/x-dc\" data-dc-script data-props='([^']*)'>", s)
props = {k: v.get('default') for k, v in json.loads(m.group(1)).items() if not k.startswith('$')}
c0 = m.end(); c1 = s.index('</script>', c0)
code = s[c0:c1]

# Anpassungen nur für die öffentliche Version
def sub(txt, old, new):
    assert txt.count(old) == 1, ('Stelle nicht gefunden', old[:60], txt.count(old))
    return txt.replace(old, new)
tpl = sub(tpl, 'Farben, Dunkelmodus und Dichte über „Tweaks“. ', 'Nichts wird gespeichert: Neu laden setzt alles zurück. ')
code = sub(code, "'https://cockpit.ejot.local/' + this.kenn(x)", "(typeof location !== 'undefined' ? location.origin + location.pathname : '') + '#' + this.kenn(x)")
title = re.search(r'<title>(.*?)</title>', s).group(1)
stamp = datetime.datetime.now().strftime('%d.%m.%Y %H:%M')

os.makedirs(out, exist_ok=True)
io.open(os.path.join(out, 'app.js'), 'w', encoding='utf-8', newline='\n').write(
    '/* Engineering Cockpit – Entwurf, Stand ' + stamp + ' */\nwindow.__dcComponent = (function () {\n' + code + '\nreturn Component;\n})();\n')
shutil.copy(os.path.join(here, 'dc-runtime.js'), os.path.join(out, 'dc-runtime.js'))
io.open(os.path.join(out, '.nojekyll'), 'w').write('')
html = '''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>''' + title + '''</title>
''' + helmet.strip() + '''
<style>body{background:#F5F5F5}#dc-loading{font:15px 'Segoe UI',system-ui,sans-serif;color:#444;padding:40px}</style>
</head>
<body>
<div id="app"><div id="dc-loading">Engineering Cockpit wird geladen …</div></div>
<template id="dc-template">''' + tpl + '''</template>
<script src="dc-runtime.js?v=''' + stamp.replace(' ', '_').replace(':', '') + '''"></script>
<script src="app.js?v=''' + stamp.replace(' ', '_').replace(':', '') + '''"></script>
<script>
(function () {
  var props = ''' + json.dumps(props) + ''';
  var app = document.getElementById('app'); app.innerHTML = '';
  dcMount(window.__dcComponent, props, document.getElementById('dc-template'), app);
  if (/[?&]selftest/.test(location.search)) { var t = document.createElement('script'); t.src = 'entwurf/selftest.js'; document.body.appendChild(t); }
})();
</script>
</body>
</html>
'''
io.open(os.path.join(out, 'index.html'), 'w', encoding='utf-8', newline='\n').write(html)
print('ok', out, round(len(html) / 1e6, 2), 'MB index,', round(len(code) / 1e6, 2), 'MB app.js, Stand', stamp)
