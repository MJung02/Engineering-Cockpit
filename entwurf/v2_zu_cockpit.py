"""v2.0-Export (JSON je Tabelle) -> cockpit_import.json fuer den Entwurf.
Aufruf: python v2_zu_cockpit.py  (im Ordner v2_export)
Liest nur die JSON-Dateien hier, schreibt cockpit_import.json daneben."""
import json, os, re
from collections import defaultdict

H = os.path.dirname(os.path.abspath(__file__))
L = lambda n: json.load(open(os.path.join(H, n + '.json'), encoding='utf-8-sig'))
P, T, M, I, Z, POS = L('projekte'), L('tasks'), L('meilensteine'), L('interaktionen'), L('zeitbuchungen'), L('projekt_positionen')

PRIO = {1: 'Hoch', 2: 'Mittel', 3: 'Niedrig'}
EST = {'2m': 0.05, '15m': 0.25, '2h': 2, '4h+': 4}
BUCKET = {'Erledigt': 'Erledigt', 'Warten_auf': 'Warten auf', 'Backlog': 'Backlog', 'In Bearbeitung': 'Fokus', 'Begonnen': 'Fokus'}
COLORS = ['#0F6CBD', '#0E7A6E', '#5B2D90', '#A33F06', '#8A3707', '#2B5797', '#107C10', '#C239B3']

d10 = lambda v: (v or '')[:10] or None
used = set()


def code_of(name):
    w = [x for x in re.split(r'[\s\-/]+', name) if x and x[0].isalnum()]
    c = ((w[0][0] + (w[1][0] if len(w) > 1 else w[0][1:2])) if w else 'PR').upper()
    base, k = c, 2
    while c in used:
        c = base[0] + str(k); k += 1
    used.add(c)
    return c


notes = defaultdict(list)
for i in sorted(I, key=lambda x: x['erstellt_am'] or ''):
    txt = (i['typ'] or 'Notiz') + ' ' + (d10(i['erstellt_am']) or '') + ': ' + (i['inhalt'] or '').strip()
    notes[('t', i['task_id']) if i['task_id'] else ('p', i['projekt_id'])].append(txt)
hours = defaultdict(int)
for z in Z:
    if z['task_id']:
        hours[z['task_id']] += z['dauer_min'] or 0

projects, tasks = [], []
for idx, p in enumerate(sorted(P, key=lambda x: x['id'])):
    key = 'v2p' + str(p['id'])
    name = p['name'].strip()
    ms = [m for m in M if m['projekt_id'] == p['id']]
    start, end = d10(p['start_datum']) or '2026-01-01', d10(p['end_datum']) or d10(p['start_datum']) or '2026-12-31'
    nodes = {}
    for m in sorted(ms, key=lambda m: (m['reihenfolge'] or 0, m['start_datum'] or '')):
        a, b = d10(m['start_datum']) or start, d10(m['end_datum']) or d10(m['start_datum']) or end
        nodes[m['id']] = {'id': key + 'n' + str(m['id']), 'name': m['titel'], 'type': 'gate' if m['ist_quality_gate'] else 'phase',
                          'start': a, 'end': max(a, b), 'done': m['status'] == 'Erledigt', 'owner': 'Du', 'tasks': [], 'children': [],
                          'kindLabel': 'Quality Gate' if m['ist_quality_gate'] else ('Arbeitspaket' if m['parent_id'] else 'Phase'),
                          'desc': m['beschreibung'] or '', 'parent': m['parent_id'], 'v2status': m['status']}
    tree = []
    for mid, n in nodes.items():
        par = nodes.get(n.pop('parent'))
        (par['children'] if par else tree).append(n)
    for n in nodes.values():
        n['children'].sort(key=lambda x: x['start'])
    tree.sort(key=lambda x: x['start'])
    for t in sorted([t for t in T if t['projekt_id'] == p['id']], key=lambda t: t['id']):
        node = nodes.get(t['meilenstein_id'])
        done = t['status'] == 'Erledigt'
        due = d10(t['faellig_am']) or (d10(t['erledigt_am']) if done else None) or (node['end'] if node else end)
        desc = (t['beschreibung'] or '').strip()
        extra = notes.get(('t', t['id']), [])
        if t['warten_auf_person_legacy']:
            extra.append('Wartet auf: ' + t['warten_auf_person_legacy'])
        x = {'id': 'v2t' + str(t['id']), 'title': t['titel'].strip(), 'proj': name, 'due': due, 'bucket': BUCKET.get(t['status'], 'Backlog'),
             'prio': PRIO.get(t['prioritaet'], 'Mittel'), 'owner': 'Du', 'mine': True, 'ms': node['id'] if node else None,
             'desc': (desc + ('\n\n' if desc and extra else '') + '\n'.join(extra)) or 'Übernommen aus v2.0', 'est': EST.get(t['aufwandsklasse'], 2), 'co': [],
             'done': done, 'crit': bool(t['kritischer_pfad']), 'booked': round(hours[t['id']] / 60, 2)}
        if node:
            node['tasks'].append(x['id'])
        tasks.append(x)
    costs = [[q['bezeichnung'], float((q['menge'] or 0) * (q['einzelpreis'] or 0)), q['lieferant'] or ''] for q in POS if q['projekt_id'] == p['id']]
    status = p['status'] or ''
    projects.append({'key': key, 'name': name, 'code': code_of(name), 'color': p['farbe'] or COLORS[idx % len(COLORS)], 'tpl': 'v2',
                     'model': 'Wasserfall mit Quality Gates' if tree else 'Liste und Board', 'stufe': 2 if tree else 1, 'mods': {}, 'start': start, 'end': end,
                     'members': ['Du'], 'tree': tree, 'risks': [], 'costs': costs, 'budget': float(p['budget_cap'] or 0), 'reqs': [], 'archived': status == 'Beendet',
                     'v2status': status, 'paused': status == 'Unterbrochen', 'kst': p['kostenstelle'] or '', 'desc': p['beschreibung'] or '',
                     'notes': notes.get(('p', p['id']), []), 'folder': p['ordner_pfad'] or ''})

pids = {p['id'] for p in P}
for t in [t for t in T if t['projekt_id'] not in pids]:
    done = t['status'] == 'Erledigt'
    tasks.append({'id': 'v2t' + str(t['id']), 'title': t['titel'].strip(), 'proj': 'Ohne Projekt', 'due': d10(t['faellig_am']) or d10(t['erledigt_am']) or '2026-11-20', 'bucket': BUCKET.get(t['status'], 'Backlog'),
                  'prio': PRIO.get(t['prioritaet'], 'Mittel'), 'owner': 'Du', 'mine': True, 'ms': None, 'desc': ((t['beschreibung'] or '').strip() or 'Übernommen aus v2.0') + ' (Projekt ' + str(t['projekt_id']) + ' existiert in v2.0 nicht mehr)', 'est': EST.get(t['aufwandsklasse'], 2), 'co': [], 'done': done, 'crit': bool(t['kritischer_pfad']), 'booked': 0})
out = {'format': 'cockpit-v2-import', 'version': 1, 'projects': projects, 'tasks': tasks}
json.dump(out, open(os.path.join(H, 'cockpit_import.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(projects), 'Projekte,', len(tasks), 'Aufgaben,', sum(len(n) for n in [list(1 for p in projects for _ in p['tree'])]), 'Phasen oben ->', os.path.join(H, 'cockpit_import.json'))
