(async function () {
  const log = [], tick = () => new Promise(r => setTimeout(r, 30));
  const txt = () => document.getElementById('app').innerText;
  const btn = (re, scope) => [...(scope || document).querySelectorAll('button,[role=button],[role=tab]')].find(b => re.test(b.textContent.trim()));
  const ok = (name, cond) => log.push((cond ? 'OK   ' : 'FAIL ') + name);
  try {
    await tick();
    ok('Start gerendert', txt().length > 500);
    const nav = document.querySelector('nav');
    btn(/^Projekte$/, nav).click(); await tick();
    ok('Projekte-Liste', /SM42 Schraubstation/.test(txt()));
    btn(/^SM42 Schraubstation$/).click(); await tick();
    ok('Projekt SM42 geöffnet', /Übersicht/.test(txt()) && /Planung/.test(txt()));
    btn(/^Planung$/).click(); await tick();
    ok('Planung/Gantt', /Phase \/ Meilenstein/.test(txt()));
    const mt = btn(/Meilenstein-Trend/); if (mt) { mt.click(); await tick(); }
    ok('Trendanalyse', /Meilenstein-Trendanalyse/.test(txt()) && document.querySelectorAll('polyline').length > 3);
    btn(/^Team$/).click(); await tick();
    ok('Team-Reiter', /Mitglieder und Rollen/.test(txt()));
    btn(/Person oder Team einladen/).click(); await tick();
    const q = document.querySelector('input[aria-label="Person oder Team suchen"]');
    q.focus(); q.value = 'Yil'; q.dispatchEvent(new Event('input', { bubbles: true })); await tick();
    ok('Suche tippen, Fokus bleibt', document.activeElement === q && q.value === 'Yil');
    ok('Suche filtert', /M\. Yilmaz/.test(txt()) && !/R\. Fischer/.test(txt().split('Projektrolle')[0] || ''));
    btn(/M\. Yilmaz/).click(); await tick(); btn(/als \w+ einladen$/).click(); await tick();
    ok('Eingeladen', /M\. Yilmaz ist als/.test(txt()));
    const ki = document.querySelector('[aria-label="KI-Assistent"]'); if (ki) { ki.click(); await tick(); }
    const ta = [...document.querySelectorAll('textarea')].find(x => /Nachricht|Schreib|Frag/i.test(x.getAttribute('placeholder') || x.getAttribute('aria-label') || ''));
    ok('KI-Eingabe vorhanden', !!ta);
    if (ta) { ta.value = 'Wo finde ich die Teamplanung?'; ta.dispatchEvent(new Event('input', { bubbles: true })); await tick(); ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); await tick(); ok('KI antwortet, Feld leer', ta.value === '' && /Teamplanung/.test(txt())); }
    btn(/^Teams$/, document.querySelector('nav')).click(); await tick();
    ok('Teams: Standorte und Feiertage', /Standort \(Feiertage\)/.test(txt()) || /Teamplanung/.test(txt()));
    btn(/^Projekte$/, document.querySelector('nav')).click(); await tick();
    const imp = btn(/Import|Excel/); if (imp) { imp.click(); await tick(); }
    ok('Import: v2.0-Übernahme sichtbar', /Projekte aus v2\.0 übernehmen/.test(txt()));
    ok('keine [object Object]', !/\[object Object\]/.test(txt()));
  } catch (e) { log.push('FEHLER ' + e.message + ' ' + (e.stack || '').split('\n')[1]); }
  const pre = document.createElement('pre'); pre.id = 'selftest'; pre.textContent = log.join('\n'); document.body.appendChild(pre);
})();
