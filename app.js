/* Engineering Cockpit – Entwurf, Stand 18.11.2026 07:52 */
window.__dcComponent = (function () {

const DAY = 86400000;
function D(s) { const p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
const TODAY = D('2026-11-13');
const START = D('2026-09-01');
const END = D('2027-02-01');
const SPAN = Math.round((END - START) / DAY);
function dd(a, b) { return Math.round((b - a) / DAY); }
function fmt(d) { return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.'; }
function pct(n) { return (Math.round(n * 100) / 100) + '%'; }

const GREEN = '#107C10', RED = '#C50F1F';
const BUCKET = { 'Backlog': '#5C5C5C', 'Fokus': '#0F6CBD', 'Warten auf': '#A33F06', 'Erledigt': GREEN };
if (typeof document !== 'undefined' && !window.__ecKeys) { window.__ecKeys = true;
  document.addEventListener('keydown', e => { if (!(e.ctrlKey || e.metaKey) || e.altKey || String(e.key).toLowerCase() !== 'm') return; e.preventDefault();
    if (e.shiftKey) { const b = document.querySelector('[aria-label="KI-Assistent"]'); if (b) b.click(); return; }
    const f = document.getElementById('suche'); if (f) { f.focus(); if (f.select) f.select(); } }); }
const PCODE = { 'SM42 Schraubstation': 'SM42', 'Retrofit Linie 2': 'RL2', 'Prüfstand Drehmoment': 'PD', 'Instandhaltung Halle 2': 'IH', 'Ohne Projekt': 'ICH', 'MES-Anbindung Halle 1': 'MES' }, KCNT = {};
const LNK_SEED = { t12: [['blockiert durch', 't1']] };
const HIST_SEED = { 't:t1': [['12.11. 15:40', 'T. Brandt', 'Angelegt', '', 'Stromlaufplan Schutztür freigeben'], ['12.11. 15:42', 'T. Brandt', 'Verantwortlich', 'T. Brandt', 'Du'], ['13.11. 08:05', 'Du', 'Bucket', 'Backlog', 'Fokus']], 'n:m42': [['04.11. 10:20', 'Du', 'Ende', '27.11.', '04.12.'], ['11.11. 14:05', 'L. Wagner', 'Doku', '', 'Grundgestell geliefert']] };
const ARB_T = [['aufgaben', '☰', 'Meine Aufgaben', false], ['fokus', '★', 'Fokus', true], ['tag', '🕘', 'Mein Tag planen', true], ['besprechung', '🗒', 'Besprechungsnotizen', true]];
const PRIO = { 'Dringend': '#C50F1F', 'Hoch': '#5B2D90', 'Mittel': '#0E6E7A', 'Niedrig': '#5C5C5C' }; const PRIO0 = Object.assign({}, PRIO);
const LABELS = [['mech', 'Mechanik', '#0F6CBD'], ['elek', 'Elektrik', '#C19C00'], ['sw', 'Software', '#0E7A6E'], ['kunde', 'Kunde', '#5B2D90'], ['eink', 'Einkauf', '#A33F06'], ['sich', 'Sicherheit', '#C50F1F']];
const LBL_SEED = { t1: ['elek', 'sich'], t2: ['eink'], t3: ['sw'], t12: ['mech'] };
const CHK_SEED = { t1: [['Schutztürkreis K3 prüfen', true], ['Schutztürkreis K7 prüfen', false], ['Anmerkungen ins PDF', false], ['Freigabe an T. Brandt', false]], t3: [['Testfälle aus Lastenheft', true], ['Simulation PLCSIM', true], ['Test an der Maschine', false]] };
const PROJCOL = { 'SM42 Schraubstation': '#0F6CBD', 'Retrofit Linie 2': '#0E7A6E', 'Instandhaltung Halle 2': '#A33F06', 'Team Automatisierung': '#5B2D90' };
const AV = { 'Du': '#5B2D90', 'T. Brandt': '#0E6E7A', 'S. Keller': '#A33F06', 'L. Wagner': '#0F6CBD', 'M. Yilmaz': '#8A3707', 'J. Novak': '#2B5797', 'R. Fischer': '#6B4E16', 'K. Weber': '#0E6E7A', 'A. Schulz': '#5C2E91', 'D. Petrov': '#A4262C', 'P. Hoffmann': '#33691E', 'N. Becker': '#004E8C', 'E. Lang': '#8E562E', 'F. Roth': '#5B5FC7', 'System': '#5C5C5C', 'Kunde': '#3B3A39', 'H. Lorenz': '#4A4A8C' };
function ini(n) { return n === 'Du' ? 'DU' : (n === 'System' ? 'EC' : n.split(/[ .]+/).filter(Boolean).map(x => x[0]).join('').slice(0, 2).toUpperCase()); }

const TR = {
  de: { start: 'Start', arbeit: 'Meine Arbeit', projekte: 'Projekte', teams: 'Teams', wissen: 'Wissen', berichte: 'Berichte', eingang: 'Posteingang', search: 'Projekte, Aufgaben, Wissen durchsuchen', neu: 'Neu', greeting: 'Guten Morgen', date: 'Freitag, 13. November 2026', tabs: ['Übersicht', 'Aufgaben', 'Planung', 'Team', 'Analyse', 'Dokumente', 'Finanzen'] },
  en: { start: 'Home', arbeit: 'My work', projekte: 'Projects', teams: 'Teams', wissen: 'Knowledge', berichte: 'Reports', eingang: 'Inbox', search: 'Search projects, tasks, knowledge', neu: 'New', greeting: 'Good morning', date: 'Friday, 13 November 2026', tabs: ['Overview', 'Tasks', 'Planning', 'Team', 'Analysis', 'Documents', 'Finance'] },
  es: { start: 'Inicio', arbeit: 'Mi trabajo', projekte: 'Proyectos', teams: 'Equipos', wissen: 'Conocimiento', berichte: 'Informes', eingang: 'Bandeja de entrada', search: 'Buscar proyectos, tareas, conocimiento', neu: 'Nuevo', greeting: 'Buenos días', date: 'Viernes, 13 de noviembre de 2026', tabs: ['Resumen', 'Tareas', 'Planificación', 'Equipo', 'Análisis', 'Documentos', 'Finanzas'] },
  pl: { start: 'Start', arbeit: 'Moja praca', projekte: 'Projekty', teams: 'Zespoły', wissen: 'Wiedza', berichte: 'Raporty', eingang: 'Skrzynka odbiorcza', search: 'Szukaj projektów, zadań, wiedzy', neu: 'Nowy', greeting: 'Dzień dobry', date: 'Piątek, 13 listopada 2026', tabs: ['Przegląd', 'Zadania', 'Planowanie', 'Zespół', 'Analiza', 'Dokumenty', 'Finanse'] },
  tr: { start: 'Başlangıç', arbeit: 'İşlerim', projekte: 'Projeler', teams: 'Ekipler', wissen: 'Bilgi', berichte: 'Raporlar', eingang: 'Gelen kutusu', search: 'Proje, görev ve bilgi ara', neu: 'Yeni', greeting: 'Günaydın', date: '13 Kasım 2026, Cuma', tabs: ['Genel bakış', 'Görevler', 'Planlama', 'Ekip', 'Analiz', 'Belgeler', 'Finans'] }
};
const LANGS = [['de', 'DE', 'Deutsch'], ['en', 'EN', 'English'], ['es', 'ES', 'Español'], ['pl', 'PL', 'Polski'], ['tr', 'TR', 'Türkçe']];

const TASKS = [
  { id: 't1', title: 'Stromlaufplan Schutztür freigeben', proj: 'SM42 Schraubstation', due: '2026-11-10', bucket: 'Fokus', prio: 'Hoch', owner: 'Du', mine: true, ms: 'm22', desc: 'Freigabe des Stromlaufplans für die Schutztürüberwachung nach dem Review durch T. Brandt. Blockiert das Gate G2.' },
  { id: 't2', title: 'Angebot Servoantriebe nachfassen', proj: 'SM42 Schraubstation', due: '2026-11-11', bucket: 'Warten auf', prio: 'Mittel', owner: 'Du', mine: true, ms: 'm32', desc: 'Rückmeldung des Lieferanten steht seit 04.11. aus. Ohne Bestellung bis 20.11. verschiebt sich die Montage.' },
  { id: 't3', title: 'SPS-Baustein FB_Zuführung testen', proj: 'SM42 Schraubstation', due: '2026-11-13', bucket: 'Fokus', prio: 'Hoch', owner: 'Du', mine: true, ms: 'm51', desc: 'Test am Simulationsmodell: Teilezuführung, Leerfahrt, Störungsquittierung.' },
  { id: 't4', title: 'Wartung Presse 3: Hydrauliköl wechseln', proj: 'Instandhaltung Halle 2', due: '2026-11-13', bucket: 'Backlog', prio: 'Mittel', owner: 'Du', mine: true, ms: null, desc: 'Wartungsplan alle 2.000 Betriebsstunden. Zertifikat Hydraulik erforderlich.' },
  { id: 't5', title: 'FAT-Checkliste vorbereiten', proj: 'SM42 Schraubstation', due: '2026-11-17', bucket: 'Backlog', prio: 'Mittel', owner: 'Du', mine: true, ms: 'g3', desc: 'Prüfschritte aus dem Lastenheft ableiten und mit dem Kunden abstimmen.' },
  { id: 't6', title: 'Review Lastenheft Kapitel 4', proj: 'Retrofit Linie 2', due: '2026-11-19', bucket: 'Backlog', prio: 'Mittel', owner: 'Du', mine: true, ms: null, desc: 'Anforderungen an die neue Sicherheitssteuerung prüfen.' },
  { id: 't7', title: 'Schulung TIA Portal für das Team planen', proj: 'Team Automatisierung', due: '2026-11-30', bucket: 'Backlog', prio: 'Niedrig', owner: 'Du', mine: true, ms: null, desc: 'Termin und Inhalte mit dem Teamleiter abstimmen.' },
  { id: 't8', title: 'Lessons Learned Retrofit Linie 1 eintragen', proj: 'Retrofit Linie 2', due: '2026-12-04', bucket: 'Backlog', prio: 'Niedrig', owner: 'Du', mine: true, ms: null, desc: 'Erkenntnisse aus der Inbetriebnahme Linie 1 für Linie 2 festhalten.' },
  { id: 't9', title: 'Klemmenplan erstellen', proj: 'SM42 Schraubstation', due: '2026-10-30', bucket: 'Erledigt', prio: 'Mittel', owner: 'T. Brandt', mine: false, ms: 'm22', desc: 'Klemmenplan für Schaltschrank =S1.' },
  { id: 't10', title: 'FB_Schrauber parametrieren', proj: 'SM42 Schraubstation', due: '2026-11-20', bucket: 'Fokus', prio: 'Mittel', owner: 'S. Keller', mine: false, ms: 'm51', desc: 'Drehmoment- und Drehwinkelprogramme laut Pflichtenheft.' },
  { id: 't11', title: 'Schutzzaun Angebot einholen', proj: 'SM42 Schraubstation', due: '2026-11-25', bucket: 'Backlog', prio: 'Niedrig', owner: 'L. Wagner', mine: false, ms: 'm42', desc: 'Drei Angebote für den Schutzzaun.' },
  { id: 't12', title: 'Pneumatikplan prüfen', proj: 'SM42 Schraubstation', due: '2026-11-12', bucket: 'Warten auf', prio: 'Mittel', owner: 'S. Keller', mine: false, ms: 'm42', desc: 'Warten auf überarbeiteten Plan vom Konstrukteur.' }
];
const TASK = {}; TASKS.forEach(t => { TASK[t.id] = t; });

const TREE = [
  { id: 'p1', name: 'Konzept', type: 'phase', start: '2026-09-01', end: '2026-09-25', owner: 'Du', children: [
    { id: 'm11', name: 'Lastenheft abgestimmt', type: 'ms', start: '2026-09-01', end: '2026-09-18', done: true, owner: 'Du' },
    { id: 'm12', name: 'Gate G1: Konzeptfreigabe', type: 'gate', start: '2026-09-25', end: '2026-09-25', done: true, owner: 'Geschäftsführung' } ] },
  { id: 'p2', name: 'Konstruktion', type: 'phase', start: '2026-09-28', end: '2026-11-10', owner: 'T. Brandt', children: [
    { id: 'm21', name: 'Mechanik 3D-Konstruktion', type: 'ms', start: '2026-09-28', end: '2026-10-23', done: true, owner: 'L. Wagner' },
    { id: 'm22', name: 'Stromlaufplan (EPLAN)', type: 'ms', start: '2026-10-12', end: '2026-11-06', owner: 'T. Brandt', tasks: ['t9', 't1'] },
    { id: 'm23', name: 'Gate G2: Konstruktionsfreigabe', type: 'gate', start: '2026-11-10', end: '2026-11-10', owner: 'Geschäftsführung' } ] },
  { id: 'p3', name: 'Beschaffung', type: 'phase', start: '2026-10-19', end: '2026-11-27', owner: 'Du', children: [
    { id: 'm31', name: 'Normteile bestellt', type: 'ms', start: '2026-10-19', end: '2026-10-30', done: true, owner: 'L. Wagner' },
    { id: 'm32', name: 'Servoantriebe bestellen', type: 'ms', start: '2026-11-02', end: '2026-11-20', owner: 'Du', tasks: ['t2'] },
    { id: 'm33', name: 'Wareneingang Schaltschrank', type: 'gate', start: '2026-11-27', end: '2026-11-27', owner: 'L. Wagner' } ] },
  { id: 'p4', name: 'Montage und Verdrahtung', type: 'phase', start: '2026-11-16', end: '2026-12-18', owner: 'L. Wagner', children: [
    { id: 'm42', name: 'Mechanische Montage', type: 'ms', start: '2026-11-16', end: '2026-12-04', owner: 'L. Wagner', tasks: ['t12', 't11'] },
    { id: 'm41', name: 'Schaltschrank verdrahten', type: 'ms', start: '2026-11-30', end: '2026-12-18', owner: 'T. Brandt' } ] },
  { id: 'p5', name: 'SPS-Programmierung und IBN', type: 'phase', start: '2026-11-09', end: '2027-01-22', owner: 'Du', children: [
    { id: 'm51', name: 'SPS-Bausteine Zuführung und Schrauber', type: 'ms', start: '2026-11-09', end: '2026-11-27', owner: 'Du', tasks: ['t3', 't10'] },
    { id: 'm52', name: 'Inbetriebnahme vor Ort', type: 'ms', start: '2027-01-04', end: '2027-01-22', owner: 'S. Keller' } ] },
  { id: 'g3', name: 'Gate G3: FAT beim Kunden', type: 'gate', start: '2027-01-26', end: '2027-01-26', owner: 'Kunde', tasks: ['t5'] }
];
const NODE = {}, PARENT = {};
(function idx(list, parent) { list.forEach(n => { NODE[n.id] = n; PARENT[n.id] = parent; if (n.children) idx(n.children, n.id); }); })(TREE, null);
const KIND = { phase: 'Phase', ms: 'Meilenstein', gate: 'Quality Gate / Termin' };
const FILE_URL = {};
const SUPPLIERS = [['Würth', '70012', 'Normteile, Befestigung'], ['Festo', '70145', 'Pneumatik'], ['Bosch Rexroth', '70210', 'Antriebe, Hydraulik'], ['Elektro Müller', '70388', 'Elektroinstallation'], ['Spedition Kraus', '70402', 'Transport'],
  ['Siemens', '70011', 'Automatisierung, SPS'], ['Phoenix Contact', '70033', 'Klemmen, Steckverbinder'], ['Rittal', '70047', 'Schaltschränke'], ['Pilz', '70059', 'Sicherheitstechnik'], ['SICK', '70061', 'Sensorik, Lichtschranken'],
  ['KUKA', '70077', 'Robotik, Service'], ['SMC', '70089', 'Pneumatik'], ['igus', '70093', 'Energieketten, Lager'], ['Murrelektronik', '70101', 'Dezentrale Installation'], ['Lapp Kabel', '70118', 'Kabel, Leitungen'],
  ['Hoffmann Group', '70124', 'Werkzeug'], ['Bürkert', '70137', 'Ventile'], ['Schunk', '70150', 'Greifer, Spanntechnik'], ['ifm electronic', '70163', 'Sensorik'], ['Hydac', '70171', 'Hydraulik, Filter'],
  ['TÜV Rheinland', '70185', 'Prüfung, Abnahme'], ['Conrad Electronic', '70199', 'Elektronik, Kleinteile'], ['Mercateo', '70203', 'Büro, Verbrauch'], ['Deutsche Bahn', '70220', 'Reisekosten'], ['Hotel Lindenhof', '70231', 'Reisekosten']];
const AKTE_SEED = {
  't:t1': { doku: [['Protokoll', 'T. Brandt', '12.11. 15:40', 'Review Stromlaufplan =S1 v3: Schutztürkreis K3 und K7 prüfen, sonst in Ordnung.']], files: [['PDF', 'Stromlaufplan_S1_v3.pdf', '1,2 MB', 'T. Brandt', '11.11.']], times: [['12.11.', 'Du', 1.5, 'Review vorbereitet'], ['13.11.', 'Du', 0.5, '']] },
  't:t4': { files: [['IMG', 'Presse3_Oelstand.jpg', '2,3 MB', 'K. Weber', '12.11.'], ['IMG', 'Presse3_Typenschild.jpg', '1,9 MB', 'K. Weber', '12.11.']], doku: [['Messwert', 'K. Weber', '12.11. 06:20', 'Ölstand Min-Marke, Öltemperatur 54 °C, keine Leckage sichtbar.']] },
  't:t12': { files: [['PDF', 'Pneumatikplan_v2_Anmerkungen.pdf', '860 KB', 'S. Keller', '10.11.']], times: [['10.11.', 'S. Keller', 2, 'Prüfung, Ventilinsel zu klein']] },
  'n:m32': { files: [['PDF', 'Angebot_Rexroth_2026-118.pdf', '420 KB', 'Du', '04.11.']], inv: [['Bosch Rexroth', 18400, 'Material', 'bei H. Lorenz', 'über 5.000 €: Freigabe Bereichsleitung']], doku: [['Entscheidung', 'Du', '04.11. 10:12', 'Servoantriebe von Rexroth statt Siemens: Lieferzeit 3 statt 9 Wochen, Mehrpreis 6 %.']] },
  'n:m42': { doku: [['Notiz', 'L. Wagner', '11.11. 14:05', 'Grundgestell ist geliefert, Montage startet nach Freigabe Pneumatikplan.']], files: [['IMG', 'Grundgestell_Anlieferung.jpg', '3,1 MB', 'L. Wagner', '11.11.']], inv: [['Würth', 1480, 'Material', 'freigegeben', 'Normteile, von dir freigegeben']] },
  'n:m23': { doku: [['Protokoll', 'T. Brandt', '10.11. 09:00', 'Gate-Vorbereitung: 4 von 5 Punkten erfüllt, Stromlaufplan offen.']] }
};
const PL_OF = { sm42: 'Du', rl2: 'T. Brandt', pd: 'N. Becker', ih: 'R. Fischer' };
const COMMENTS = {
  t1: [['T. Brandt', 'gestern 16:20', 'Review ist durch, zwei Anmerkungen zur Schutztür stehen im PDF. Bitte bis Montag freigeben.'], ['Du', 'heute 08:05', 'Danke, schaue ich mir heute Nachmittag an.']],
  t2: [['Du', '04.11.', 'Angebot angefragt, Rückmeldung bis 11.11. zugesagt.']],
  t12: [['S. Keller', '10.11.', 'Ventilinsel ist zu klein dimensioniert, Plan zurück an @L. Wagner.'], ['L. Wagner', '11.11.', 'Übernehme ich, neuer Stand bis 16.11.']],
  t10: [['S. Keller', 'heute 09:12', 'Drehwinkelprogramm 3 fehlt noch im Pflichtenheft. @Du kannst du das klären?']]
};

const TEAMS = {
  automatisierung: { name: 'Automatisierung', code: 'AU', color: '#5B2D90', lead: 'S. Keller',
    members: [['S. Keller', 'SPS / IBN', [90, 105, 95, 80, 60, 50]], ['Du', 'Projektleitung', [95, 112, 85, 70, 60, 40]], ['M. Yilmaz', 'Robotik', [70, 75, 90, 0, 85, 60]], ['J. Novak', 'SPS', [110, 120, 100, 90, 70, 50]]],
    skills: ['TIA Portal', 'Safety', 'KUKA', 'Profinet', 'WinCC'],
    levels: { 'S. Keller': [4, 3, 1, 3, 3], 'Du': [3, 3, 1, 2, 2], 'M. Yilmaz': [2, 2, 4, 2, 1], 'J. Novak': [4, 2, 0, 4, 3] },
    inbox: [
      { id: 'a1', type: 'Störung', typeBg: RED, title: 'Roboterzelle L3: Greiferfehler analysieren', needs: 'KUKA ≥ 3', due: '14.11.', suggest: 'M. Yilmaz (KUKA 4, 10 h frei diese Woche)', sug: 'M. Yilmaz' },
      { id: 'a2', type: 'Auftrag', typeBg: '#0F6CBD', title: 'SPS-Update Presse 3 einspielen', needs: 'TIA Portal ≥ 3', due: '20.11.', suggest: 'S. Keller (TIA 4, Auslastung 95 %)', sug: 'S. Keller' },
      { id: 'a3', type: 'Prüfung', typeBg: '#0E6E7A', title: 'Safety-Programm Linie 2 gegenprüfen', needs: 'Safety ≥ 3', due: '25.11.', suggest: 'S. Keller oder du (Safety 3)', sug: 'S. Keller' } ],
    certs: [['J. Novak', 'Elektrofachkraft', '2026-12-20'], ['Du', 'Safety-Schulung (TÜV)', '2027-01-05'], ['M. Yilmaz', 'KUKA Roboterprogrammierer', '2027-06-30']] },
  instandhaltung: { name: 'Instandhaltung', code: 'IH', color: '#A33F06', lead: 'R. Fischer',
    members: [['R. Fischer', 'Teamleitung', [70, 80, 75, 85, 70, 60]], ['K. Weber', 'Elektriker', [105, 95, 0, 0, 90, 85]], ['A. Schulz', 'Mechaniker', [85, 90, 100, 95, 80, 70]], ['D. Petrov', 'Hydraulik', [60, 115, 90, 80, 75, 70]]],
    skills: ['Elektrik', 'Hydraulik', 'Pneumatik', 'Mechanik', 'SPS-Diagnose'],
    levels: { 'R. Fischer': [3, 3, 3, 3, 2], 'K. Weber': [4, 1, 2, 2, 3], 'A. Schulz': [1, 2, 3, 4, 1], 'D. Petrov': [2, 4, 3, 3, 1] },
    inbox: [
      { id: 'b1', type: 'Störung', typeBg: RED, title: 'Förderband 4: Antrieb blockiert', needs: 'Mechanik ≥ 3, Elektrik ≥ 2', due: 'heute', suggest: 'A. Schulz (Mechanik 4, Frühschicht)', sug: 'A. Schulz' },
      { id: 'b2', type: 'Wartung', typeBg: '#0E6E7A', title: 'Presse 3: Hydrauliköl wechseln', needs: 'Hydraulik ≥ 3, Zertifikat Hydraulik', due: '13.11.', suggest: 'D. Petrov (Hydraulik 4, Zertifikat gültig)', sug: 'D. Petrov' },
      { id: 'b3', type: 'Auftrag', typeBg: '#0F6CBD', title: 'Lichtschranke Tor 2 tauschen', needs: 'Elektrik ≥ 3, Schaltberechtigung', due: '18.11.', suggest: 'K. Weber (Elektrik 4, ab KW 49 im Urlaub)', sug: 'K. Weber' } ],
    certs: [['K. Weber', 'Schaltberechtigung', '2026-11-28'], ['D. Petrov', 'Hydraulik-Fachkunde', '2026-12-31'], ['R. Fischer', 'Elektrofachkraft', '2028-03-31']] },
  konstruktion: { name: 'Konstruktion', code: 'KO', color: '#0F6CBD', lead: 'L. Wagner',
    members: [['L. Wagner', 'Mechanik', [80, 90, 95, 90, 70, 60]], ['T. Brandt', 'Elektrokonstruktion', [100, 110, 105, 90, 80, 60]], ['P. Hoffmann', 'Mechanik', [60, 65, 70, 75, 80, 80]]],
    skills: ['SolidWorks', 'EPLAN', 'Normteile', 'Toleranzen', 'Sicherheit'],
    levels: { 'L. Wagner': [4, 1, 3, 3, 2], 'T. Brandt': [1, 4, 2, 2, 3], 'P. Hoffmann': [3, 0, 3, 2, 1] },
    inbox: [
      { id: 'c1', type: 'Änderung', typeBg: '#8A3707', title: 'CR-07: Schraubstation Hub +50 mm', needs: 'SolidWorks ≥ 3', due: '22.11.', suggest: 'P. Hoffmann (SolidWorks 3, 25 h frei)', sug: 'P. Hoffmann' } ],
    certs: [['T. Brandt', 'Elektrofachkraft', '2027-09-30']] },
  software: { name: 'Softwareentwicklung', code: 'SW', color: '#0E7A6E', lead: 'N. Becker',
    members: [['N. Becker', 'Teamleitung', [85, 90, 85, 80, 0, 0]], ['E. Lang', 'Backend', [95, 100, 90, 85, 80, 70]], ['F. Roth', 'Frontend', [70, 80, 75, 70, 65, 60]]],
    skills: ['Python', 'C#', 'OPC UA', 'SQL', 'Web'],
    levels: { 'N. Becker': [3, 4, 3, 3, 2], 'E. Lang': [4, 2, 3, 4, 1], 'F. Roth': [2, 1, 1, 2, 4] },
    inbox: [
      { id: 'd1', type: 'Bug', typeBg: RED, title: 'MES-Schnittstelle liefert Fehler 500', needs: 'OPC UA ≥ 3', due: '14.11.', suggest: 'E. Lang (OPC UA 3, Backend)', sug: 'E. Lang' } ],
    certs: [] }
};
const KWS = ['KW 46', 'KW 47', 'KW 48', 'KW 49', 'KW 50', 'KW 51'];

const INBOX = [
  { id: 'i1', type: 'freigabe', typeLabel: 'Freigabe', from: 'T. Brandt', time: 'vor 20 Min.', context: 'SM42 Schraubstation › Gate G2', title: 'Gate G2: Konstruktionsfreigabe', sub: 'Bitte um Freigabe, 4 von 5 Punkten erfüllt', body: 'Die Konstruktion ist bis auf die Freigabe des Stromlaufplans abgeschlossen. Ich bitte um Freigabe mit Auflage, damit die Bestellung der Schaltschrankteile starten kann.' },
  { id: 'i8', type: 'freigabe', typeLabel: 'Aufgabe freigeben', from: 'L. Wagner', time: 'vor 1 Std.', context: 'Für S. Keller · ohne Projekt', title: 'Aufgabe für S. Keller: Schaltplan Vorrichtung V-17 prüfen', sub: '6 h · fällig 20.11. · wartet auf deine Freigabe', body: 'L. Wagner aus dem Team Konstruktion möchte S. Keller eine Aufgabe außerhalb eines Projekts geben. L. Wagner gehört nicht zu S. Kellers Team, deshalb entscheidest du als Chef, ob die Aufgabe in S. Kellers Kapazität passt.' },
  { id: 'i2', type: 'freigabe', typeLabel: 'Wochenzettel', from: 'S. Keller', time: 'vor 2 Std.', context: 'Zeiterfassung KW 45', title: 'Wochenzettel KW 45 zur Freigabe', sub: '40 h · 2 Projekte', body: 'Eingereicht am Freitag, 06.11. Alle Zeiten auf Projekte gebucht.' },
  { id: 'i3', type: 'antrag', typeLabel: 'Projektantrag', from: 'M. Yilmaz', time: 'gestern', context: 'Projektanträge', title: 'Kamerabasierte Teileerkennung Linie 3', sub: 'Eingereicht, Bewertung offen', body: 'Ich schlage vor, an Linie 3 vor dem Verschrauben eine Kamerakontrolle einzubauen. Das spart Nacharbeit am Bandende.' },
  { id: 'i4', type: 'erwaehnung', typeLabel: 'Erwähnung', from: 'L. Wagner', time: 'gestern', context: 'SM42 › Mechanische Montage › Schutzzaun Angebot einholen', title: '@Du Schutzzaun: welches Angebot?', sub: 'Drei Angebote liegen vor', body: '', quote: '„@Du Die drei Angebote für den Schutzzaun sind im Task. Variante B ist 12 % teurer, aber 2 Wochen schneller lieferbar. Welches nehmen wir?“', task: 't11' },
  { id: 'i5', type: 'erwaehnung', typeLabel: 'Team-Erwähnung', from: 'R. Fischer', time: 'Mo.', context: 'Instandhaltung Halle 2 › Roboterzelle L3', title: '@Automatisierung Greiferfehler Roboterzelle L3', sub: 'An das Team Automatisierung', body: '', quote: '„@Automatisierung Der Greifer an Zelle L3 meldet sporadisch Fehler 4711. Kann sich jemand mit KUKA-Erfahrung das ansehen?“' },
  { id: 'i6', type: 'system', typeLabel: 'Automatisierung', from: 'System', time: 'Mo.', context: 'Regel „Statuswechsel melden“', title: 'Pneumatikplan prüfen: Fokus → Warten auf', sub: 'SM42 Schraubstation', body: 'Deine Regel „Wenn sich der Status eines Tasks in SM42 ändert, dann benachrichtige mich“ wurde ausgelöst. S. Keller hat den Task nach „Warten auf“ verschoben.' },
  { id: 'i7', type: 'system', typeLabel: 'Hinweis', from: 'System', time: 'Mo.', context: 'Qualifikationen', title: 'Dein Zertifikat läuft in 53 Tagen ab', sub: 'Safety-Schulung (TÜV), gültig bis 05.01.2027', body: 'Bitte rechtzeitig eine Auffrischung planen. Dein Teamleiter wurde ebenfalls informiert.' }
];
const INB = {}; INBOX.forEach(m => { INB[m.id] = m; });
const ITYPE_BG = { freigabe: '#0F6CBD', antrag: '#5B2D90', erwaehnung: '#0E6E7A', system: '#5C5C5C' };

const RACI_ROWS = ['1.1 Lastenheft', '2.1 Mechanik-Konstruktion', '2.2 Stromlaufplan', '3.2 Beschaffung Antriebe', '5.1 SPS-Programmierung', '5.2 Inbetriebnahme'];
const RACI_COLS = ['Du', 'T. Brandt', 'S. Keller', 'L. Wagner', 'Kunde'];
const RACI_INIT = [['A', 'C', 'C', 'C', 'R'], ['A', 'C', '', 'R', 'I'], ['A', 'R', 'C', 'I', ''], ['R', '', 'I', 'C', ''], ['A', 'I', 'R', '', ''], ['R', 'I', 'R', 'I', 'C']];
const RACI_COL = { R: '#0F6CBD', A: '#5B2D90', C: '#0E6E7A', I: '#5C5C5C' };
const CYCLE = ['', 'R', 'A', 'C', 'I'];

// ── Scrum: Retrofit Linie 2 ──
const EPIC_BG = { HMI: '#0F6CBD', Safety: '#A4262C', Rezepte: '#8A3707', Daten: '#0E6E7A' };
const MO_BG = { Must: '#5B2D90', Should: '#0E6E7A', Could: '#5C5C5C' };
const STORIES = {
  s1: { key: 'RL-11', title: 'Linie über neues HMI starten', role: 'Bediener', goal: 'die Linie am neuen HMI starten und stoppen', benefit: 'ich nicht mehr zum alten Bedienpult laufen muss', epic: 'HMI', mo: 'Must', sp: 5, owner: 'F. Roth', sprint: 4, ac: ['Start- und Stopp-Taster schalten die Linie in unter 1 s', 'Zustand der Linie ist farbig sichtbar', 'Start nur möglich, wenn alle Störungen quittiert sind'] },
  s2: { key: 'RL-12', title: 'Störmeldungen im Klartext', role: 'Instandhalter', goal: 'Störmeldungen mit Klartext und Abhilfe sehen', benefit: 'ich Störungen schneller behebe', epic: 'HMI', mo: 'Must', sp: 8, owner: 'F. Roth', sprint: 4, ac: ['Gegeben eine Störung, dann zeigt das HMI Klartext und Abhilfe', 'Störungshistorie der letzten 24 h abrufbar', 'Quittieren nur mit der Rolle Instandhaltung'] },
  s3: { key: 'RL-13', title: 'Not-Halt über Safety-SPS', role: 'Sicherheitsbeauftragter', goal: 'den Not-Halt-Kreis über die Safety-SPS auswerten', benefit: 'die Linie die Anforderungen nach ISO 13849 erfüllt', epic: 'Safety', mo: 'Must', sp: 8, owner: 'J. Novak', sprint: 4, ac: ['Not-Halt an allen 4 Stationen stoppt in Stoppkategorie 0', 'Diskrepanzüberwachung beider Kanäle aktiv', 'Validierung nach ISO 13849-2 dokumentiert'] },
  s4: { key: 'RL-14', title: 'Rezepte für 3 Teilevarianten', role: 'Einrichter', goal: 'Rezepte für drei Teilevarianten anlegen', benefit: 'Umrüsten ohne Programmänderung möglich ist', epic: 'Rezepte', mo: 'Should', sp: 5, owner: 'M. Yilmaz', sprint: 4, ac: ['Drei Rezepte anlegbar', 'Rezeptwahl am HMI', 'Parametergrenzen werden geprüft'] },
  s5: { key: 'RL-15', title: 'Schutztür-Zuhaltung über Safety-SPS', role: 'Sicherheitsbeauftragter', goal: 'die Schutztür-Zuhaltung über die Safety-SPS steuern', benefit: 'niemand in die laufende Station greifen kann', epic: 'Safety', mo: 'Must', sp: 5, owner: 'J. Novak', sprint: 0, ac: ['Zuhaltung nur im Stillstand lösbar', 'Türüberwachung erreicht PL d'] },
  s6: { key: 'RL-16', title: 'Benutzerrollen am HMI', role: 'Schichtleiter', goal: 'Rollen für Bediener, Einrichter und Instandhaltung am HMI', benefit: 'jeder nur die erlaubten Funktionen sieht', epic: 'HMI', mo: 'Should', sp: 8, owner: 'F. Roth', sprint: 0, ac: ['Drei Rollen mit festgelegten Rechten', 'Anmeldung per RFID-Karte'] },
  s7: { key: 'RL-17', title: 'Taktzeit je Station anzeigen', role: 'Schichtleiter', goal: 'die Taktzeit jeder Station live sehen', benefit: 'ich Engpässe sofort erkenne', epic: 'HMI', mo: 'Should', sp: 3, owner: 'F. Roth', sprint: 0, ac: ['Taktzeit je Station live', 'Vergleich mit dem Zielwert farbig'] },
  s8: { key: 'RL-18', title: 'Rezeptwechsel ohne Anlagenstopp', role: 'Einrichter', goal: 'das Rezept ohne Anlagenstopp wechseln', benefit: 'beim Umrüsten keine Produktion ausfällt', epic: 'Rezepte', mo: 'Could', sp: 13, owner: 'M. Yilmaz', sprint: 0, ac: [] },
  s9: { key: 'RL-19', title: 'Energieverbrauch je Schicht', role: 'Werksleitung', goal: 'den Energieverbrauch je Schicht sehen', benefit: 'wir Einsparungen belegen können', epic: 'Daten', mo: 'Could', sp: 5, owner: 'E. Lang', sprint: 0, ac: ['Zählerwerte je Schicht gespeichert', 'Export als CSV'] }
};
const SB_COLS = [['To Do', '#5C5C5C'], ['In Arbeit', '#0F6CBD'], ['Review', '#8A3707'], ['Done', GREEN]];

// ── V-Modell: Prüfstand Drehmoment ──
const VN = [
  { id: 'v1', name: 'Anforderungsdefinition', x: 13, y: 11, side: 'L', pair: 'v9', start: '2026-06-01', end: '2026-06-30', owner: 'N. Becker', kids: [['Lastenheft Prüfstand', '2026-06-19', true], ['42 Anforderungen abgestimmt', '2026-06-30', true]] },
  { id: 'v2', name: 'Systementwurf', x: 21, y: 31, side: 'L', pair: 'v8', start: '2026-07-01', end: '2026-07-31', owner: 'N. Becker', kids: [['Systemarchitektur Mechanik, Elektrik, Software', '2026-07-24', true], ['Gate: Systementwurf freigegeben', '2026-07-31', true]] },
  { id: 'v3', name: 'Architektur / Grobentwurf', x: 29, y: 51, side: 'L', pair: 'v7', start: '2026-08-03', end: '2026-09-11', owner: 'E. Lang', kids: [['Messkette und Datenfluss', '2026-08-28', true], ['Schnittstellen OPC UA', '2026-09-11', true]] },
  { id: 'v4', name: 'Modulentwurf', x: 37, y: 71, side: 'L', pair: 'v6', start: '2026-09-14', end: '2026-11-06', owner: 'E. Lang', kids: [['Antriebsregelung', '2026-10-16', true], ['Messverstärker-Modul', '2026-11-06', false]] },
  { id: 'v5', name: 'Implementierung', x: 50, y: 89, side: 'B', pair: 'v6', start: '2026-10-05', end: '2027-01-15', owner: 'F. Roth', kids: [['Antriebsregelung codiert', '2026-11-27', false], ['Messwerterfassung codiert', '2026-12-18', false], ['Auswertung und Prüfprotokoll', '2027-01-15', false]] },
  { id: 'v6', name: 'Modultest', x: 63, y: 71, side: 'R', pair: 'v4', cov: 60, start: '2026-11-02', end: '2027-01-22', owner: 'F. Roth', kids: [['MT-01 Antriebsregelung Sprungantwort', '2026-11-12', true], ['MT-02 Drehzahlgrenzen', '2026-11-20', false], ['MT-03 Messverstärker kalibrieren', '2026-12-04', false]] },
  { id: 'v7', name: 'Integrationstest', x: 71, y: 51, side: 'R', pair: 'v3', cov: 20, start: '2027-01-11', end: '2027-02-12', owner: 'E. Lang', kids: [['IT-01 Messkette Ende zu Ende', '2027-01-29', false], ['IT-02 OPC-UA-Datenübergabe', '2027-02-12', false]] },
  { id: 'v8', name: 'Systemtest', x: 79, y: 31, side: 'R', pair: 'v2', cov: 0, start: '2027-02-15', end: '2027-03-12', owner: 'N. Becker', kids: [['ST-01 Drehmomentgenauigkeit ±0,5 %', '2027-03-05', false], ['ST-02 Dauerlauf 72 h', '2027-03-12', false]] },
  { id: 'v9', name: 'Abnahmetest', x: 87, y: 11, side: 'R', pair: 'v1', cov: 0, start: '2027-03-15', end: '2027-03-31', owner: 'Kunde', kids: [['Abnahmeprotokoll beim Kunden', '2027-03-31', false]] }
];
const VNODE = {}; VN.forEach(v => { VNODE[v.id] = v; });
// V-Modell-Ebenen als Meilensteine, ihre Arbeitspakete als Aufgaben: so zeigen alle Ansichten dieselben Daten
const PD_SIDE = [['vL', 'Spezifikation (linker Ast)', 'L'], ['vB', 'Umsetzung', 'B'], ['vR', 'Test und Abnahme (rechter Ast)', 'R']];
const PD_TREE = PD_SIDE.map(([pid, pname, side]) => {
  const children = VN.filter(v => v.side === side).map(v => {
    const ids = v.kids.map((k, i) => {
      const id = v.id + 'k' + i;
      const x = { id, title: k[0], proj: 'Prüfstand Drehmoment', due: k[1], bucket: k[2] ? 'Erledigt' : (D(k[1]) <= TODAY ? 'Fokus' : 'Backlog'), prio: 'Mittel', owner: v.owner, mine: false, ms: v.id, desc: 'Arbeitspaket der Ebene „' + v.name + '“ im V-Modell.' };
      TASKS.push(x); TASK[id] = x; return id;
    });
    const n = { id: v.id, name: v.name, type: 'ms', start: v.start, end: v.end, owner: v.owner, tasks: ids, pd: true };
    NODE[v.id] = n; PARENT[v.id] = pid; return n;
  });
  const ph = { id: pid, name: pname, type: 'phase', start: children.reduce((a, c) => (c.start < a ? c.start : a), '9999'), end: children.reduce((a, c) => (c.end > a ? c.end : a), '0000'), owner: 'N. Becker', children, pd: true };
  NODE[pid] = ph; return ph;
});

// ── Kanban: Instandhaltung Halle 2 ──
const KB_COLS = [['eingang', 'Eingang', null, '#5C5C5C'], ['geplant', 'Geplant', null, '#0E6E7A'], ['arbeit', 'In Arbeit', 3, '#0F6CBD'], ['teile', 'Warten auf Teile', 4, '#A33F06'], ['erledigt', 'Erledigt', null, GREEN]];
const KB_TYPE = { 'Störung': RED, 'Wartung': '#0E6E7A', 'Auftrag': '#0F6CBD' };
const KB_CLASS = { 'Expedite': RED, 'Fester Termin': '#5B2D90', 'Standard': null };
const KB = [
  { id: 'k1', type: 'Störung', title: 'Förderband 4: Antrieb blockiert', anlage: 'FB-04', cls: 'Expedite', owner: 'A. Schulz', col: 'arbeit', age: 0 },
  { id: 'k4', type: 'Störung', title: 'Roboterzelle L3: Greiferfehler', anlage: 'RZ-L3', cls: 'Standard', owner: 'M. Yilmaz', col: 'arbeit', age: 1 },
  { id: 'k7', type: 'Störung', title: 'Tor 5 schließt nicht vollständig', anlage: 'TOR-05', cls: 'Standard', owner: 'K. Weber', col: 'arbeit', age: 4 },
  { id: 'k2', type: 'Wartung', title: 'Presse 3: Hydrauliköl wechseln', anlage: 'PR-03', cls: 'Standard', owner: 'D. Petrov', col: 'geplant', age: 2 },
  { id: 'k6', type: 'Auftrag', title: 'Hallenkran: UVV-Prüfung vorbereiten', anlage: 'KR-01', cls: 'Fester Termin', due: '30.11.', owner: 'R. Fischer', col: 'geplant', age: 3 },
  { id: 'k5', type: 'Wartung', title: 'Kompressor 1: Ansaugfilter tauschen', anlage: 'KP-01', cls: 'Standard', owner: 'A. Schulz', col: 'eingang', age: 0 },
  { id: 'k11', type: 'Störung', title: 'Absaugung Schweißplatz 2 zu schwach', anlage: 'AS-02', cls: 'Standard', owner: 'R. Fischer', col: 'eingang', age: 1 },
  { id: 'k3', type: 'Auftrag', title: 'Lichtschranke Tor 2 tauschen', anlage: 'TOR-02', cls: 'Standard', owner: 'K. Weber', col: 'teile', age: 6 },
  { id: 'k8', type: 'Auftrag', title: 'Servomotor Presse 2 ersetzen', anlage: 'PR-02', cls: 'Standard', owner: 'D. Petrov', col: 'teile', age: 9 },
  { id: 'k9', type: 'Wartung', title: 'Klimagerät Schaltschrankraum', anlage: 'KL-02', cls: 'Standard', owner: 'R. Fischer', col: 'erledigt', age: 0 },
  { id: 'k10', type: 'Störung', title: 'Lichtvorhang Station 3 quittiert nicht', anlage: 'ST-03', cls: 'Expedite', owner: 'K. Weber', col: 'erledigt', age: 0 },
  { id: 'k12', type: 'Störung', title: 'Presse 2: Hydraulikdruck schwankt', anlage: 'PR-02', cls: 'Expedite', owner: 'R. Fischer', col: 'neu', age: 0 }
];

// ── Berichte: Portfolio der Bereichsleitung ──
const CAP_TEAMS = [['auto', 'Automatisierung', 4], ['kon', 'Konstruktion', 4], ['sw', 'Softwareentwicklung', 3], ['ih', 'Instandhaltung', 6]];
const PLAN_H = 28; // 35 h Sollzeit × 80 % planbar
const PORT = [
  { key: 'sm42', code: 'SM', name: 'SM42 Schraubstation', color: '#0F6CBD', model: 'Wasserfall', pl: 'Du', status: 'laufend', start: '2026-09-01', end: '2027-01-26', budget: [182, 240], amp: ['rot', 'gruen', 'weiss'], next: 'Gate G2 Konstruktionsfreigabe (seit 10.11.)',
    ms: [['2026-09-25', 'Gate G1 Konzeptfreigabe', 'erledigt'], ['2026-11-10', 'Gate G2 Konstruktionsfreigabe', 'ueberfaellig'], ['2026-11-27', 'Wareneingang Schaltschrank', 'plan'], ['2027-01-26', 'Gate G3 FAT beim Kunden', 'plan']],
    demand: { auto: 60, kon: 30, sw: 10 },
    stand: 'Konstruktion abgeschlossen, Elektroplanung bei 80 %. Zwei Aufgaben überfällig.', schritte: 'Servoantriebe bestellen, Schaltschrankbau starten.', bedarf: 'Gate G2 ist seit 10.11. überfällig. Freigabe durch die Geschäftsführung fehlt.' },
  { key: 'rl2', code: 'RL', name: 'Retrofit Linie 2', color: '#0E7A6E', model: 'Scrum', pl: 'T. Brandt', status: 'laufend', start: '2026-09-21', end: '2027-01-08', budget: [96, 180], amp: ['weiss', 'gruen', 'gruen'], next: 'Sprint-4-Review heute',
    ms: [['2026-10-02', 'Sprint 1', 'erledigt'], ['2026-10-16', 'Sprint 2', 'erledigt'], ['2026-10-30', 'Sprint 3', 'erledigt'], ['2026-11-13', 'Sprint 4 Review', 'plan'], ['2027-01-08', 'Release 1', 'plan']],
    demand: { auto: 40, sw: 50 },
    stand: 'Sprint 4 von 8, Velocity im Mittel 23 SP. Inkrement HMI-Grundbild abgenommen.', schritte: 'Review heute, danach Planung Sprint 5 (Safety).', bedarf: '' },
  { key: 'pd', code: 'PD', name: 'Prüfstand Drehmoment', color: '#5B2D90', model: 'V-Modell', pl: 'N. Becker', status: 'laufend', start: '2026-06-01', end: '2027-03-31', budget: [310, 290], amp: ['rot', 'rot', 'weiss'], next: 'Messverstärker-Modul',
    ms: [['2026-06-30', 'Anforderungen abgestimmt', 'erledigt'], ['2026-09-30', 'Systementwurf', 'erledigt'], ['2026-11-06', 'Modulentwurf', 'ueberfaellig'], ['2027-03-31', 'Abnahme beim Kunden', 'plan']],
    demand: { kon: 40, sw: 20, auto: 20 },
    stand: 'Feinentwurf Messverstärker verspätet, Budget um 7 % überschritten.', schritte: 'Modultests vorbereiten, Nachtrag beim Kunden klären.', bedarf: 'Budgetüberschreitung 20 T€: Nachtrag beim Kunden oder interne Freigabe.' },
  { key: 'ih', code: 'IH', name: 'Instandhaltung Halle 2', color: '#A33F06', model: 'Kanban', pl: 'R. Fischer', status: 'laufend', start: '2026-06-01', end: null, budget: [41, 120], amp: ['weiss', 'gruen', 'weiss'], next: 'Wartung Presse 3 · 13.11.',
    ms: [['2026-11-30', 'UVV-Prüfung Hallenkran', 'plan']],
    demand: { ih: 150 },
    stand: '3 von 3 Plätzen „In Arbeit“ belegt, Durchlaufzeit 3,8 Tage.', schritte: 'Ersatzteil Servomotor Presse 2 nachfassen (9 Tage Wartezeit).', bedarf: '' },
  { key: 'mes', code: 'ME', name: 'MES-Anbindung Halle 1', color: '#B4009E', model: 'Scrum', pl: 'L. Wagner', status: 'genehmigt', start: '2027-01-11', end: '2027-06-25', budget: [0, 150], amp: ['weiss', 'weiss', 'weiss'], next: 'Kick-off 11.01.2027',
    ms: [['2027-01-11', 'Kick-off', 'plan'], ['2027-06-25', 'Go-live', 'plan']],
    demand: { sw: 30, auto: 20 },
    stand: 'Antrag am 02.11. genehmigt, Team noch nicht besetzt.', schritte: 'Product Owner benennen, Backlog anlegen.', bedarf: '' },
  { key: 'ets', code: 'ET', name: 'Ersatzteillager digital', color: '#33691E', model: 'Kanban', pl: 'D. Petrov', status: 'genehmigt', start: '2026-12-01', end: '2027-04-30', budget: [0, 60], amp: ['weiss', 'weiss', 'weiss'], next: 'Lagerbestand erfassen',
    ms: [['2027-04-30', 'Lager im System', 'plan']],
    demand: { ih: 30, sw: 10 },
    stand: 'Genehmigt, Start Dezember.', schritte: 'Lagerplätze und Artikelstamm aufnehmen.', bedarf: '' }
];
const PROJ_OPEN = { sm42: true, rl2: true, pd: true, ih: true };
PORT.push({ key: 'tl3', code: 'TL', name: 'Teileerkennung Linie 3', color: '#8E562E', model: 'Scrum', pl: 'M. Yilmaz', status: 'genehmigt', start: '2027-02-01', end: '2027-07-30', budget: [0, 85], amp: ['weiss', 'weiss', 'weiss'], next: 'Kick-off 01.02.2027',
  ms: [['2027-02-01', 'Kick-off', 'plan'], ['2027-07-30', 'Abnahme Linie 3', 'plan']], demand: { auto: 20, sw: 15 },
  stand: 'Antrag von M. Yilmaz genehmigt am 13.11.2026, Bewertung 3,6 von 5.', schritte: 'Backlog anlegen, Kamera-Muster bestellen.', bedarf: '' });
const PORTK = {}; PORT.forEach(x => { PORTK[x.key] = x; });
function capFill(order) {
  const gap = {}, free = {};
  CAP_TEAMS.forEach(([tk, tn, n]) => {
    let left = n * PLAN_H;
    order.forEach(x => { const d = x.demand[tk] || 0; if (!d) return; const c = Math.max(0, Math.min(d, left)); left -= d; if (d - c > 0) gap[x.key] = (gap[x.key] || 0) + (d - c); });
    free[tk] = left;
  });
  return { gap, free };
}
const R0 = D('2026-06-01'), R1 = D('2027-07-01'), RSPAN = dd(R0, R1);
const RMON = ['Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez', 'Jan 27', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'];

// ── Wissen ──
const W_CAT = { 'Lessons Learned': '#5B2D90', 'Technik-Gedächtnis': '#0E6E7A', 'Vorlage': '#0F6CBD' };
const WISSEN = [
  { id: 'w1', cat: 'Lessons Learned', kind: 'verbessern', title: 'Langläufer-Teile früher bestellen', origin: 'SM42 Schraubstation', okey: 'sm42', date: '06.11.2026', author: 'Du', help: 7, tags: ['Einkauf', 'Termin', 'Antriebe'],
    f: [['Beobachtung', 'Die Lieferzeit der Servoantriebe stieg von 6 auf 14 Wochen. Gate G2 ist dadurch überfällig.'], ['Ursache', 'Bestellung war erst nach der Konstruktionsfreigabe vorgesehen.'], ['Empfehlung', 'Langläufer schon in der Konzeptphase identifizieren und über Rahmenvertrag reservieren.']],
    reason: 'Ähnliche Antriebe im Prüfstand Drehmoment geplant' },
  { id: 'w2', cat: 'Technik-Gedächtnis', title: 'Profinet: Gerätename nach Tausch neu vergeben', origin: 'Roboterzelle L3 (RZ-L3)', okey: 'ih', date: '28.10.2026', author: 'M. Yilmaz', help: 12, tags: ['Profinet', 'Störung'],
    f: [['Symptom', 'Nach Tausch des Greifer-Ventilinseln-Moduls meldet die SPS „Gerät nicht erreichbar“.'], ['Ursache', 'Neues Modul hat keinen Profinet-Gerätenamen.'], ['Lösung', 'Mit TIA „Gerätenamen zuweisen“, danach Station neu starten. Dauer 10 Minuten.']],
    reason: null },
  { id: 'w3', cat: 'Lessons Learned', kind: 'gut', title: 'Instandhaltung im Daily spart Wartezeit', origin: 'Retrofit Linie 2', okey: 'rl2', date: '30.10.2026', author: 'T. Brandt', help: 5, tags: ['Kommunikation', 'Scrum'],
    f: [['Beobachtung', 'Seit die Instandhaltung zweimal pro Woche im Daily ist, warten Stories nicht mehr auf Anlagenfreigaben.'], ['Ursache', 'Abstimmung über Mail dauerte im Schnitt 2 Tage.'], ['Empfehlung', 'Bei Retrofits einen festen Ansprechpartner der Instandhaltung ins Team holen.']],
    reason: null },
  { id: 'w4', cat: 'Technik-Gedächtnis', title: 'Presse 3: Leck am Ventilblock V2', origin: 'Presse 3 (PR-03)', okey: 'ih', date: '14.09.2026', author: 'D. Petrov', help: 4, tags: ['Hydraulik', 'Wartung'],
    f: [['Symptom', 'Ölfilm unter dem Ventilblock, Druckabfall nach 2 h.'], ['Ursache', 'O-Ring an Anschluss P ausgehärtet.'], ['Lösung', 'O-Ring-Satz Art. 44-118 tauschen, beim Ölwechsel immer mit prüfen.']],
    reason: 'Ölwechsel Presse 3 ist heute geplant' },
  { id: 'w5', cat: 'Vorlage', title: 'Projektvorlage Sondermaschine', origin: 'Vorlagen Bereich Technik', okey: null, date: '01.07.2026', author: 'Bereichsleitung', help: 9, tags: ['Wasserfall', 'Gates'],
    f: [['Inhalt', 'Wasserfall mit 4 Quality Gates, PSP mit 6 Phasen, RACI, Risikoliste und Budgetstruktur.'], ['Verwendung', 'Für Maschinenbau-Projekte ab Stufe 3. Wird beim Anlegen eines Projekts angeboten.']],
    reason: null },
  { id: 'w6', cat: 'Vorlage', title: 'Checkliste Inbetriebnahme Schaltschrank', origin: 'Vorlagen Bereich Technik', okey: null, date: '12.05.2026', author: 'L. Wagner', help: 15, tags: ['Inbetriebnahme', 'Elektro'],
    f: [['Inhalt', '38 Prüfpunkte von Schutzleiterprüfung bis Not-Halt-Test, mit Feldern für Messwerte und Unterschrift.'], ['Verwendung', 'Als Aufgabenliste in einen Meilenstein übernehmen. Erledigte Punkte gehen ins Prüfprotokoll.']],
    reason: 'SM42: Wareneingang Schaltschrank am 27.11.' },
  { id: 'w7', cat: 'Lessons Learned', kind: 'verbessern', title: 'Abnahmekriterien vor dem Systementwurf festlegen', origin: 'Prüfstand Drehmoment', okey: 'pd', date: '02.10.2026', author: 'N. Becker', help: 6, tags: ['Anforderungen', 'Kunde'],
    f: [['Beobachtung', 'Der Kunde hat die Genauigkeit nach dem Systementwurf von ±1 % auf ±0,5 % verschärft.'], ['Ursache', 'Abnahmetest war nur grob beschrieben.'], ['Empfehlung', 'Im V-Modell die Abnahmekriterien zusammen mit den Anforderungen unterschreiben lassen.']],
    reason: null },
  { id: 'w8', cat: 'Lessons Learned', kind: 'gut', title: 'Sprint-Ziel in einem Satz', origin: 'Retrofit Linie 2', okey: 'rl2', date: '16.10.2026', author: 'Du', help: 3, tags: ['Scrum'],
    f: [['Beobachtung', 'Seit das Sprint-Ziel in einem Satz formuliert ist, gibt es weniger Diskussionen im Review.'], ['Empfehlung', 'Ziel auf dem Sprint-Board ganz oben zeigen.']],
    reason: 'Sprint-5-Planung steht an' },
  { id: 'w9', cat: 'Technik-Gedächtnis', title: 'Lichtvorhang Station 3 quittiert nicht', origin: 'Station 3 (ST-03)', okey: 'ih', date: '12.11.2026', author: 'K. Weber', help: 2, tags: ['Sicherheit', 'Störung'],
    f: [['Symptom', 'Lichtvorhang bleibt rot, Quittierung ohne Wirkung.'], ['Ursache', 'Verschmutzte Frontscheibe am Empfänger.'], ['Lösung', 'Mit Antistatik-Tuch reinigen, Reinigung in Wochenwartung aufgenommen.']],
    reason: null },
  { id: 'w10', cat: 'Lessons Learned', kind: 'verbessern', title: 'Lieferantentermine wöchentlich prüfen', origin: 'Prüfstand Drehmoment', okey: 'pd', date: '20.10.2026', author: 'S. Keller', help: 4, tags: ['Einkauf', 'Termin'],
    f: [['Beobachtung', 'Verspätung des Messverstärkers wurde erst zwei Wochen vor dem Termin bekannt.'], ['Empfehlung', 'Automatisierung „Lieferant bestätigt Termin nicht → Erinnerung an Einkauf“ einschalten.']],
    reason: null },
  { id: 'w11', cat: 'Lessons Learned', kind: 'gut', title: 'FAT-Checkliste vier Wochen vorher mit dem Kunden abstimmen', origin: 'Montagezelle M7 (2025)', okey: 'm7', date: '12.06.2025', author: 'T. Brandt', help: 9, tags: ['Abnahme', 'Kunde', 'FAT'],
    f: [['Beobachtung', 'Die FAT lief ohne Überraschungen, weil Prüfpunkte und Toleranzen vorab unterschrieben waren.'], ['Empfehlung', 'FAT-Checkliste spätestens vier Wochen vor dem Gate mit dem Kunden abstimmen und freigeben lassen.']], reason: null },
  { id: 'w12', cat: 'Lessons Learned', kind: 'verbessern', title: 'Schutzzaun und Sicherheitskonzept früh mit der Sicherheitsfachkraft klären', origin: 'Montagezelle M7 (2025)', okey: 'm7', date: '12.06.2025', author: 'L. Wagner', help: 8, tags: ['Sicherheit', 'Schutzzaun', 'Abnahme'],
    f: [['Beobachtung', 'Der Schutzzaun musste nach der Begehung umgebaut werden, zwei Wochen Verzug.'], ['Empfehlung', 'Sicherheitskonzept und Schutzzaun-Layout schon in der Konstruktion von der Sicherheitsfachkraft prüfen lassen.']], reason: null },
  { id: 'w13', cat: 'Lessons Learned', kind: 'verbessern', title: 'Puffer für die Inbetriebnahme einplanen', origin: 'Prüfstand Bremse (2024)', okey: 'pb', date: '03.12.2024', author: 'S. Keller', help: 11, tags: ['Inbetriebnahme', 'Termin', 'SPS'],
    f: [['Beobachtung', 'Die SPS-Inbetriebnahme dauerte 40 % länger als geplant, weil Signale vor Ort anders verdrahtet waren.'], ['Empfehlung', '20 % Puffer für die Inbetriebnahme einplanen und vorher einen Signaltest mit Simulation (PLCSIM) machen.']], reason: null },
  { id: 'w14', cat: 'Lessons Learned', kind: 'gut', title: 'Stromlaufplan-Review vor dem Schaltschrankbau', origin: 'Prüfstand Bremse (2024)', okey: 'pb', date: '03.12.2024', author: 'T. Brandt', help: 6, tags: ['Elektro', 'Review', 'Stromlaufplan'],
    f: [['Beobachtung', 'Ein Vier-Augen-Review des Stromlaufplans fand drei Fehler, bevor der Schaltschrank gebaut war.'], ['Empfehlung', 'Stromlaufplan immer im Review freigeben, bevor der Schaltschrankbau beauftragt wird.']], reason: null },
  { id: 'w15', cat: 'Lessons Learned', kind: 'verbessern', title: 'Stillstandsfenster schriftlich mit der Produktion fixieren', origin: 'Retrofit Linie 1 (2025)', okey: 'rl1', date: '18.08.2025', author: 'Du', help: 7, tags: ['Retrofit', 'Stillstand', 'Produktion'],
    f: [['Beobachtung', 'Das zugesagte Stillstandsfenster wurde kurzfristig um zwei Tage gekürzt.'], ['Empfehlung', 'Stillstandsfenster schriftlich mit Werkleitung und Schichtleitung fixieren und einen Rückfallplan vorbereiten.']], reason: null },
  { id: 'w16', cat: 'Lessons Learned', kind: 'gut', title: 'Rahmenvertrag für Normteile spart Bestellaufwand', origin: 'Montagezelle M7 (2025)', okey: 'm7', date: '12.06.2025', author: 'Du', help: 5, tags: ['Einkauf', 'Normteile', 'Bestellung'],
    f: [['Beobachtung', 'Normteile über den Rahmenvertrag kamen in zwei Tagen statt zwei Wochen.'], ['Empfehlung', 'Normteile und Kleinteile über den bestehenden Rahmenvertrag abrufen statt einzeln bestellen.']], reason: null }
];
const WK = {}; WISSEN.forEach(w => { WK[w.id] = w; });

// ── Aufgaben anlegen und freigeben ──
const BOSS = { 'Du': 'H. Lorenz', 'S. Keller': 'Du', 'L. Wagner': 'Du', 'T. Brandt': 'L. Wagner', 'M. Yilmaz': 'S. Keller', 'J. Novak': 'S. Keller', 'K. Weber': 'R. Fischer' };
const TEAM_OF = { 'Du': 'Automatisierung', 'S. Keller': 'Automatisierung', 'M. Yilmaz': 'Automatisierung', 'J. Novak': 'Automatisierung', 'L. Wagner': 'Konstruktion', 'T. Brandt': 'Konstruktion', 'K. Weber': 'Instandhaltung', 'R. Fischer': 'Instandhaltung' };
const LOAD47 = { 'Du': 86, 'S. Keller': 92, 'L. Wagner': 90, 'T. Brandt': 82, 'M. Yilmaz': 68, 'J. Novak': 74, 'K. Weber': 75 };
const DIR = (() => { const F = ['Anna', 'Ben', 'Clara', 'David', 'Elena', 'Felix', 'Greta', 'Hannes', 'Ida', 'Jonas', 'Katrin', 'Lukas', 'Mara', 'Nils', 'Olga', 'Paul', 'Rita', 'Sven', 'Tanja', 'Uwe', 'Vera', 'Willi', 'Yasemin', 'Zoe', 'Ahmet'];
  const L = ['Bauer', 'Becker', 'Braun', 'Fuchs', 'Hahn', 'Hartmann', 'Hoffmann', 'Jung', 'Kaiser', 'Klein', 'Koch', 'Krause', 'Lang', 'Lehmann', 'Meyer', 'Müller', 'Neumann', 'Peters', 'Richter', 'Schmitz'];
  const T = [['Konstruktion', 'L. Wagner'], ['Elektroplanung', 'T. Brandt'], ['Instandhaltung', 'R. Fischer'], ['Qualität', 'H. Lorenz'], ['Einkauf', 'H. Lorenz'], ['Logistik', 'H. Lorenz'], ['Produktion', 'H. Lorenz'], ['IT', 'H. Lorenz'], ['Automatisierung', 'S. Keller'], ['Vertrieb', 'H. Lorenz']];
  const out = []; for (let i = 0; i < 500; i++) { const n = F[i % F.length] + ' ' + L[Math.floor(i / F.length) % L.length], tm = T[(i * 7) % T.length]; out.push([n, tm[0]]); BOSS[n] = tm[1]; TEAM_OF[n] = tm[0]; LOAD47[n] = 40 + ((i * 37) % 70); } return out; })();
const NT_PEOPLE = ['M. Yilmaz', 'J. Novak', 'S. Keller', 'L. Wagner', 'K. Weber'];
const P_FAM = [['liste', '☐', 'Liste und Board', 'Aufgaben als Liste und Board mit Buckets. Für kleine Vorhaben ohne Ballast.', '#5C5C5C'], ['kanban', '▥', 'Kanban', 'Laufende Arbeit im Fluss mit WIP-Limits, z. B. Instandhaltung, Support.', '#A33F06'],
  ['wf', '▭', 'Wasserfall', 'Phasen, Meilensteine und Quality Gates im Gantt. Klassisch für Anlagen und Maschinen.', '#0F6CBD'], ['v', 'V', 'V-Modell', 'Anforderungen bis Validierung mit Verfolgbarkeit, z. B. Sicherheitsfunktionen.', '#5B2D90'], ['scrum', '⟳', 'Scrum', 'Sprints mit Backlog, Planning und Review, z. B. Software.', '#0E7A6E']];
const P_TPL = {
  leer: { fam: 'liste', icon: '☐', name: 'Leer', desc: 'Nur Aufgaben und Board.', stufe: 1, model: 'Liste und Board', phases: [], tasks: [] },
  kan0: { fam: 'kanban', icon: '▥', name: 'Leer', desc: 'Board mit WIP-Limits, ohne Startaufgaben.', stufe: 1, model: 'Kanban mit WIP-Limits', phases: [], tasks: [] },
  wf0: { fam: 'wf', icon: '▭', name: 'Leer', desc: 'Eine Phase und ein Abnahme-Gate, den Rest baust du selbst.', stufe: 2, model: 'Wasserfall mit Quality Gates', phases: [['Umsetzung', 0, 30, 'Abnahme']], tasks: [] },
  v0: { fam: 'v', icon: 'V', name: 'Leer', desc: 'Die vier Ebenen des V ohne Inhalte.', stufe: 4, model: 'V-Modell', phases: [['Anforderungen', 0, 15, 'Review Anforderungen'], ['Entwurf', 16, 35, 'Review Entwurf'], ['Umsetzung', 36, 60, null], ['Verifikation und Validierung', 61, 85, 'Validierung']], tasks: [] },
  sc0: { fam: 'scrum', icon: '⟳', name: 'Leer', desc: 'Ein erster Sprint à 2 Wochen.', stufe: 2, model: 'Scrum, Sprints à 2 Wochen', phases: [['Sprint 1', 0, 13, 'Review Sprint 1']], tasks: [] },
  klein: { fam: 'liste', icon: '⚡', name: 'Kleines Vorhaben', desc: 'Board mit Buckets und 5 Startaufgaben.', stufe: 1, model: 'Board (Kanban)', phases: [], tasks: ['Ziel und Umfang klären', 'Material bestellen', 'Umsetzen', 'Testen', 'Übergabe und Doku'] },
  sm: { fam: 'wf', icon: '⚙', name: 'Sondermaschine', desc: 'Wasserfall: 4 Phasen, 4 Quality Gates mit Checklisten.', stufe: 3, model: 'Wasserfall mit Quality Gates', phases: [['Konzept', 0, 20, 'G1 Konzeptfreigabe'], ['Konstruktion', 21, 70, 'G2 Konstruktionsfreigabe'], ['Fertigung und Montage', 71, 120, 'G3 FAT'], ['Inbetriebnahme', 121, 150, 'G4 SAT / Abnahme']], tasks: ['Lastenheft prüfen', 'Pflichtenheft erstellen', 'Risikobeurteilung (CE)', 'Stückliste', 'Stromlaufplan', 'FAT-Protokoll vorbereiten'] },
  ibn: { fam: 'wf', icon: '▶', name: 'SPS-Inbetriebnahme', desc: 'Vorbereitung und IBN vor Ort, Abnahme als Gate.', stufe: 2, model: 'Wasserfall', phases: [['Vorbereitung', 0, 10, 'Bereit zur IBN'], ['IBN vor Ort', 11, 25, 'Abnahme']], tasks: ['IO-Test', 'Safety-Validierung', 'Parameter sichern', 'Einweisung Bediener'] },
  retro: { fam: 'wf', icon: '↻', name: 'Retrofit', desc: 'Bestandsaufnahme, Planung, Umbau im Stillstand.', stufe: 3, model: 'Wasserfall mit Quality Gates', phases: [['Bestandsaufnahme', 0, 15, 'G1 Ist-Analyse'], ['Planung', 16, 45, 'G2 Freigabe Umbau'], ['Umbau im Stillstand', 46, 60, 'G3 Wiederanlauf']], tasks: ['Altanlage dokumentieren', 'Stillstand mit Produktion abstimmen', 'Ersatzteile bestellen'] },
  kons: { fam: 'wf', icon: '✎', name: 'Konstruktionsprojekt', desc: 'Entwurf und Detail mit Zeichnungsfreigabe.', stufe: 2, model: 'Wasserfall', phases: [['Entwurf', 0, 20, 'Entwurfsreview'], ['Detailkonstruktion', 21, 50, 'Zeichnungsfreigabe']], tasks: ['Anforderungen sammeln', '3D-Modell', 'Zeichnungen ableiten', 'Normteile prüfen'] },
  sw: { fam: 'scrum', icon: '⌘', name: 'Softwareprojekt', desc: 'Sprints à 2 Wochen mit Review.', stufe: 2, model: 'Scrum, Sprints à 2 Wochen', phases: [['Sprint 1', 0, 13, 'Review Sprint 1'], ['Sprint 2', 14, 27, 'Review Sprint 2'], ['Sprint 3', 28, 41, 'Release']], tasks: ['Backlog füllen', 'Definition of Done festlegen', 'CI-Pipeline einrichten'] },
  v: { fam: 'v', icon: 'V', name: 'Sicherheitsfunktion', desc: 'Anforderungen bis Validierung, mit Nachweisen.', stufe: 4, model: 'V-Modell', phases: [['Anforderungen', 0, 20, 'Review Anforderungen'], ['Entwurf', 21, 45, 'Review Entwurf'], ['Umsetzung', 46, 75, 'Code-Review'], ['Verifikation und Validierung', 76, 110, 'Validierung (PL/SIL)']], tasks: ['Sicherheitsanforderungen (SRS)', 'PLr bestimmen', 'Testfälle ableiten', 'Validierungsbericht'] },
  wart: { fam: 'kanban', icon: '🔧', name: 'Wartungsplanung', desc: 'Board mit WIP-Limits und wiederkehrenden Aufgaben.', stufe: 1, model: 'Kanban mit WIP-Limits', phases: [], tasks: ['Wartungsplan anlegen', 'Ersatzteilliste prüfen'] } };
const P_MODS = [['tasks', 'Aufgaben, Board, Liste, Kalender, Dateien', 1], ['plan', 'Meilensteine, Phasen, Zeitplan', 2], ['zeit', 'Zeiterfassung', 2], ['docs', 'Dokumente', 2], ['res', 'Ressourcen und Kapazität', 3], ['budget', 'Budget und Rechnungen', 3], ['risk', 'Risiken', 3], ['raci', 'RACI / AKV', 3], ['status', 'Statusbericht', 3], ['opl', 'Offene Punkte und Entscheidungen', 2], ['close', 'Projektabschluss', 2], ['req', 'Anforderungen mit Verfolgbarkeit', 4], ['cr', 'Change Requests', 4], ['test', 'Testfälle', 4], ['audit', 'Audit-Ansicht', 4]];
const STUFEN = [[1, 'Liste', 'Aufgaben und Board. Sonst nichts.'], [2, 'Projekt', '+ Meilensteine, Zeitplan, Zeiten, Dokumente'], [3, 'Gesteuertes Projekt', '+ Kapazität, Budget, Risiken, RACI, Statusbericht'], [4, 'Reguliert / komplex', '+ Anforderungen, Change Requests, Testfälle, Audit']];
const RISK_SEED = { sm42: [['Lieferverzug Servoantriebe', 4, 4, 'Zweitlieferant anfragen, Liefertermin wöchentlich prüfen', 'Du'], ['Abnahme Schutztür durch Sicherheitsfachkraft verzögert sich', 2, 5, 'Termin früh blocken, Unterlagen vorab senden', 'T. Brandt'], ['Inbetriebnehmer in KW 50 nicht verfügbar', 3, 3, 'Vertretung einplanen', 'S. Keller']],
  rl2: [['Altsteuerung nicht dokumentiert', 4, 3, 'Programm vorab auslesen und sichern', 'T. Brandt'], ['Stillstandsfenster zu kurz für Umbau', 3, 5, 'Umbau in zwei Wochenenden teilen', 'Du']],
  pd: [['Messunsicherheit über Toleranz', 3, 4, 'Vorversuch mit Referenzaufnehmer', 'N. Becker'], ['Kalibrierlabor ausgebucht', 2, 3, 'Termin jetzt reservieren', 'E. Lang']],
  ih: [['Ersatzteil Presse 3 nicht am Lager', 3, 4, 'Mindestbestand anlegen', 'R. Fischer']] };
const CRX_SEED = { rl2: [{ id: 'CR-01', t: 'Zusätzlicher Lichtvorhang an Station 4', art: 'Umfang', cost: 6800, days: 5, why: 'Forderung aus Gefährdungsbeurteilung', st: 'eingereicht', by: 'T. Brandt', d: '10.11.' }],
  pd: [{ id: 'CR-01', t: 'Messbereich auf 500 Nm erweitern', art: 'Umfang', cost: 12400, days: 10, why: 'Kundenwunsch nach Spezifikationsreview', st: 'genehmigt', by: 'N. Becker', d: '04.11.' }] };
const ABW_SEED = { sm42: [{ n: 'S. Keller', von: '2026-11-23', bis: '2026-11-27', art: 'Urlaub' }, { n: 'T. Brandt', von: '2026-12-02', bis: '2026-12-02', art: 'Schulung' }], rl2: [{ n: 'M. Yilmaz', von: '2026-11-16', bis: '2026-11-18', art: 'Dienstreise' }] };
const KT_SEED = { sm42: [{ n: 'Fr. Hartmann', f: 'Kunde, Werkleitung', e: 'hoch', c: 'Abnahme und Termine' }, { n: 'Hr. Ott', f: 'Lieferant Servoantriebe', e: 'mittel', c: 'Liefertermine' }, { n: 'Sicherheitsfachkraft', f: 'intern, Arbeitssicherheit', e: 'hoch', c: 'Abnahme Schutztür' }],
  rl2: [{ n: 'Hr. Kurz', f: 'Schichtleitung Linie 2', e: 'hoch', c: 'Stillstandsfenster' }], pd: [{ n: 'Dr. Weiß', f: 'Kunde, Entwicklung', e: 'hoch', c: 'Spezifikation' }] };
const DEP_SEED = { m23: ['m22'] };
const OPL_SEED = { sm42: [{ id: 'OP-01', t: 'Kunde liefert Schraubfall-Spezifikation M8', who: 'Du', due: '2026-11-11', st: 'offen', src: 'Kunden-Call 04.11.' }, { id: 'OP-02', t: 'Klären: Not-Halt-Kreis zweikanalig bis Station 3?', who: 'T. Brandt', due: '2026-11-20', st: 'offen', src: 'Daily 12.11.' }, { id: 'OP-03', t: 'Angebot Schutzzaun zweiter Lieferant', who: 'L. Wagner', due: '2026-11-06', st: 'erledigt', src: 'Daily 03.11.' }] };
const DEC_SEED = { sm42: [{ id: 'E-01', t: 'Servoantriebe von Bosch Rexroth statt Siemens', why: 'Lieferzeit 6 statt 14 Wochen, Mehrkosten 1.200 € im Budget', by: 'Du, T. Brandt', d: '28.10.', src: 'Konstruktionsreview' }, { id: 'E-02', t: 'Gate G2 erst nach freigegebenem Stromlaufplan', why: 'Vermeidet Nacharbeit im Schaltschrankbau', by: 'Geschäftsführung', d: '04.11.', src: 'Gate-Vorbereitung' }] };
const KST0 = { sm42: '4711-SM', rl2: '4712-RL', pd: '4713-PD', ih: '4720-IH' }, IA0 = { sm42: 'IA-26-0412', pd: 'IA-26-0388' };
const PSET0 = { sm42: { stufe: 3, mods: {} }, rl2: { stufe: 2, mods: { res: true } }, pd: { stufe: 4, mods: {} }, ih: { stufe: 1, mods: { plan: true, docs: true, zeit: true } } };
const PCOLORS = ['#0F6CBD', '#0E7A6E', '#5B2D90', '#A33F06', '#C50F1F', '#107C10', '#8A3707', '#3B3A39'];
const KO0 = { status: 'offen', pl: 'M. Yilmaz', due: '2027-01-15', date: '2027-01-12', time: '10:00', dur: 2, place: 'Besprechungsraum 2', ppl: ['M. Yilmaz', 'H. Lorenz', 'S. Keller', 'E. Lang'], agenda: {},
  goal: 'Roboterzelle Linie 3 erkennt Teile per Kamera und wechselt den Greifer ohne Werkzeug, damit die Umrüstzeit sinkt.', ef: [], us: [], out: [], risks: [], model: null, vorlage: null, invited: false };
const NT_PROJ = ['Ohne Projekt', 'SM42 Schraubstation', 'Retrofit Linie 2', 'Prüfstand Drehmoment', 'Instandhaltung Halle 2'];
const NT_H = [2, 4, 8, 16];
const REQ_ME = [
  { id: 'q1', from: 'M. Yilmaz', title: 'IBN-Checkliste Roboterzelle L3 übernehmen', proj: 'ohne Projekt', h: 4, due: '19.11.', kind: 'team' },
  { id: 'q2', from: 'R. Fischer', title: 'Greifer-Parameter Roboterzelle L3 prüfen', proj: 'ohne Projekt', h: 3, due: '18.11.', kind: 'extern' },
  { id: 'q3', from: 'T. Brandt', title: 'Safety-Konzept gegenlesen', proj: 'Retrofit Linie 2', h: 6, due: '24.11.', kind: 'projekt' }
];

// ── Verwaltung: Organisation ──
const ORG_UNITS = [
  { id: 'gf', name: 'Geschäftsführung', lead: 'H. Lorenz', parent: null, color: '#3B3A39' },
  { id: 'tech', name: 'Bereich Technik', lead: 'Du', parent: 'gf', color: '#4A4A8C' },
  { id: 'auto', name: 'Automatisierung', lead: 'S. Keller', parent: 'tech', color: '#5B2D90' },
  { id: 'kon', name: 'Konstruktion', lead: 'L. Wagner', parent: 'tech', color: '#0F6CBD' },
  { id: 'sw', name: 'Softwareentwicklung', lead: 'N. Becker', parent: 'tech', color: '#0E7A6E' },
  { id: 'ih', name: 'Instandhaltung', lead: 'R. Fischer', parent: 'tech', color: '#A33F06' }
];
const OU = {}; ORG_UNITS.forEach(u => { OU[u.id] = u; });
const ORG_INIT = { 'H. Lorenz': 'gf', 'Du': 'tech', 'S. Keller': 'auto', 'M. Yilmaz': 'auto', 'J. Novak': 'auto', 'L. Wagner': 'kon', 'T. Brandt': 'kon', 'P. Hoffmann': 'kon', 'N. Becker': 'sw', 'E. Lang': 'sw', 'F. Roth': 'sw', 'R. Fischer': 'ih', 'K. Weber': 'ih', 'A. Schulz': 'ih', 'D. Petrov': 'ih' };
const ROLE = { 'H. Lorenz': 'Geschäftsführer', 'Du': 'Bereichsleitung Technik', 'S. Keller': 'Teamleitung · SPS und IBN', 'M. Yilmaz': 'Robotik', 'J. Novak': 'Antriebstechnik', 'L. Wagner': 'Teamleitung · Mechanik', 'T. Brandt': 'Konstrukteur', 'P. Hoffmann': 'Technischer Zeichner', 'N. Becker': 'Teamleitung', 'E. Lang': 'Backend', 'F. Roth': 'HMI', 'R. Fischer': 'Teamleitung', 'K. Weber': 'Elektriker', 'A. Schulz': 'Mechatroniker', 'D. Petrov': 'Hydraulik' };
const FACH = { 'J. Novak': 'N. Becker (Antriebssoftware)', 'F. Roth': 'S. Keller (HMI-Standards)', 'K. Weber': 'S. Keller (Elektrosicherheit)' };
const TEAM_LOAD = { auto: '93 %', kon: '84 %', sw: '86 %', ih: '74 %' };
const AD_GROUPS = [
  { name: 'Gate-Prüfer Elektrik', members: ['S. Keller', 'K. Weber'], used: 'Gate G2 in SM42, Checkliste Inbetriebnahme Schaltschrank' },
  { name: 'Freigeber Rechnung', members: ['Du', 'H. Lorenz'], used: 'Rechnungen ab 5.000 €, Nachträge' },
  { name: 'Sicherheitsbeauftragte', members: ['K. Weber', 'A. Schulz'], used: 'Automatisierung „Störung mit Sicherheitsbezug“' }
];

// ── Themen ──
const THEMES = [['qual', 'Qualität', '#0F6CBD'], ['umwelt', 'Umwelt', '#33691E'], ['audit', 'Audit und Normen', '#5C5C5C'], ['kosten', 'Kosteneinsparung', '#B4009E'], ['prod', 'Steigerung Produktivität', '#0E7A6E'], ['ress', 'Einsparung von Ressourcen', '#6B4E16'], ['entl', 'Entlastung Betriebspersonal', '#A33F06'], ['arb', 'Arbeitsbedingungen und Sicherheit', '#5B2D90']];
const TH = {}; THEMES.forEach(([k, n, c]) => { TH[k] = { name: n, color: c }; });
const PTHEME = { sm42: ['prod', 'qual'], rl2: ['prod', 'kosten'], pd: ['qual', 'audit'], ih: ['entl', 'arb'], mes: ['kosten', 'prod'], ets: ['ress', 'kosten'], tl3: ['qual', 'entl'] };
const FOCUS_W = [0, 1, 2, 3];
const FOCUS_L = ['Kein', 'Niedrig', 'Mittel', 'Hoch'];

// ── Aufwand je Aufgabe (h) und Anforderungen SM42 ──
const EST = { t1: 2, t2: 0.5, t3: 4, t4: 3, t5: 4, t6: 3, t7: 1, t8: 1.5, t9: 6, t10: 8, t11: 2, t12: 1.5 };
const REQS_SM = [
  { id: 'A-01', text: 'Verschraubung 12 Nm ±3 %', ms: 'm51', tasks: ['t10', 't3'], test: 'FAT-03 Drehmomentprüfung' },
  { id: 'A-02', text: 'Schutztür mit Zuhaltung, PL d', ms: 'm22', tasks: ['t1', 't9'], test: 'Validierung SF-02 Schutztür' },
  { id: 'A-03', text: 'Taktzeit höchstens 12 s', ms: 'm51', tasks: ['t3'], test: 'FAT-05 Taktzeitmessung' },
  { id: 'A-04', text: 'Pneumatik mit Energietrennung', ms: 'm42', tasks: ['t12'], test: '' },
  { id: 'A-05', text: 'Dokumentation nach Maschinenrichtlinie', ms: 'g3', tasks: ['t5'], test: 'Abnahmeprotokoll FAT' },
  { id: 'A-06', text: 'Schutzzaun nach ISO 14120', ms: 'm42', tasks: ['t11'], test: '' }
];

// ── Scrum: Sprints als Meilensteine, Stories als Aufgaben ──
const SST_BUCKET = { 'To Do': 'Backlog', 'In Arbeit': 'Fokus', 'Review': 'Warten auf', 'Done': 'Erledigt' };
const RL_SPRINTS = [['rS1', 'Sprint 1', '2026-09-21', '2026-10-02'], ['rS2', 'Sprint 2', '2026-10-05', '2026-10-16'], ['rS3', 'Sprint 3', '2026-10-19', '2026-10-30'], ['rS4', 'Sprint 4', '2026-11-02', '2026-11-13'],
  ['rS5', 'Sprint 5', '2026-11-16', '2026-11-27'], ['rS6', 'Sprint 6', '2026-11-30', '2026-12-11'], ['rS7', 'Sprint 7', '2026-12-14', '2026-12-23'], ['rS8', 'Sprint 8', '2027-01-04', '2027-01-08']];
const RL_CHILD = RL_SPRINTS.map(([id, name, a, b], i) => { const n = { id, name, type: 'ms', start: a, end: b, owner: 'Du', tasks: [], done: i < 3, rl: true }; NODE[id] = n; PARENT[id] = 'rR1'; return n; });
NODE.rREL = { id: 'rREL', name: 'Release 1 (HMI, Safety)', type: 'gate', start: '2027-01-08', end: '2027-01-08', owner: 'Du', tasks: [], rl: true }; PARENT.rREL = 'rR1';
const RL_TREE = [{ id: 'rR1', name: 'Release 1', type: 'phase', start: '2026-09-21', end: '2027-01-08', owner: 'Du', children: RL_CHILD.concat([NODE.rREL]), rl: true }];
NODE.rR1 = RL_TREE[0];
Object.keys(STORIES).forEach((sid, i) => {
  const st = STORIES[sid], id = 'rt' + sid, sp = st.sprint === 4 ? 'rS4' : null;
  const x = { id, title: st.key + ' ' + st.title, proj: 'Retrofit Linie 2', due: st.sprint === 4 ? '2026-11-13' : (i < 7 ? '2026-11-27' : '2026-12-11'), bucket: 'Backlog',
    prio: st.mo === 'Must' ? 'Hoch' : (st.mo === 'Should' ? 'Mittel' : 'Niedrig'), owner: st.owner, mine: false, ms: sp, story: sid, est: st.sp * 3,
    desc: 'Als ' + st.role + ' möchte ich ' + st.goal + ', damit ' + st.benefit + '.' };
  TASKS.push(x); TASK[id] = x; if (sp) NODE[sp].tasks.push(id);
});

// ── Kanban: Karten als Aufgaben, Wartungstermine als Meilensteine ──
const KB_BUCKET = { neu: 'Backlog', eingang: 'Backlog', geplant: 'Backlog', arbeit: 'Fokus', teile: 'Warten auf', erledigt: 'Erledigt' };
const IH_DUE = { k1: '2026-11-13', k4: '2026-11-16', k7: '2026-11-17', k2: '2026-11-13', k6: '2026-11-30', k5: '2026-11-20', k11: '2026-11-19', k3: '2026-11-18', k8: '2026-11-12', k9: '2026-11-10', k10: '2026-11-12', k12: '2026-11-13' };
const IH_EST = { 'Störung': 3, 'Wartung': 4, 'Auftrag': 2 };
const IH_MS = [['iW1', 'Ölwechsel Presse 3', '2026-11-13', '2026-11-13', 'gate', 'D. Petrov', ['k2']], ['iW2', 'UVV-Prüfung Hallenkran', '2026-11-23', '2026-11-30', 'ms', 'R. Fischer', ['k6']],
  ['iW3', 'Jahreswartung Kompressoren', '2026-12-07', '2026-12-15', 'ms', 'A. Schulz', ['k5']], ['iW4', 'Großinspektion Presse 2 (Betriebsruhe)', '2026-12-21', '2026-12-31', 'ms', 'D. Petrov', ['k8']],
  ['iW5', 'DGUV V3 ortsveränderliche Geräte', '2027-01-11', '2027-01-22', 'ms', 'K. Weber', []]];
const IH_MS_OF = {}; IH_MS.forEach(m => m[6].forEach(k => { IH_MS_OF[k] = m[0]; }));
const IH_CHILD = IH_MS.map(([id, name, a, b, type, owner]) => { const n = { id, name, type, start: a, end: b, owner, tasks: [], ih: true }; NODE[id] = n; PARENT[id] = 'iP'; return n; });
const IH_TREE = [{ id: 'iP', name: 'Wartungsplan Halle 2', type: 'phase', start: '2026-11-13', end: '2027-01-22', owner: 'R. Fischer', children: IH_CHILD, ih: true }];
NODE.iP = IH_TREE[0];
KB.forEach(k => {
  const id = 'ik' + k.id, ms = IH_MS_OF[k.id] || null;
  const x = { id, title: k.title, proj: 'Instandhaltung Halle 2', due: IH_DUE[k.id] || '2026-11-20', bucket: 'Backlog', prio: k.cls === 'Expedite' ? 'Hoch' : (k.cls === 'Fester Termin' ? 'Mittel' : 'Niedrig'), owner: k.owner, mine: false, ms, kb: k.id, est: IH_EST[k.type] || 2,
    desc: k.type + ' an ' + k.anlage + '. Serviceklasse: ' + k.cls + '.' };
  TASKS.push(x); TASK[id] = x; if (ms) NODE[ms].tasks.push(id);
});
const IH_SKILL = { 'K. Weber': 'Elektrofachkraft, DGUV V3', 'A. Schulz': 'Mechatronik, Kompressoren', 'D. Petrov': 'Hydraulik-Zertifikat', 'R. Fischer': 'Kranprüfer, Teamleitung', 'M. Yilmaz': 'Robotik', 'Du': 'Elektrofachkraft' };

// ── Projektanteile je Person (für die Ansicht Personen) ──
const PSHARE = {
  sm42: { 'Du': 0.6, 'T. Brandt': 0.5, 'S. Keller': 0.4, 'L. Wagner': 0.3 },
  rl2: { 'Du': 0.3, 'J. Novak': 1, 'S. Keller': 0.5, 'M. Yilmaz': 0.5, 'F. Roth': 0.3, 'E. Lang': 0.2 },
  pd: { 'N. Becker': 0.6, 'E. Lang': 0.5, 'F. Roth': 0.4, 'Kunde': 0.1 },
  ih: { 'R. Fischer': 0.5, 'K. Weber': 1, 'A. Schulz': 1, 'D. Petrov': 1, 'M. Yilmaz': 0.2, 'Du': 0.1 }
};

// ── Projekt-Reiter für alle Beispielprojekte ──
const PNAME_OF = { sm42: 'SM42 Schraubstation', rl2: 'Retrofit Linie 2', pd: 'Prüfstand Drehmoment', ih: 'Instandhaltung Halle 2' };
const PTREE_OF = { sm42: TREE, rl2: RL_TREE, pd: PD_TREE, ih: IH_TREE };
const BL_SEED = (() => { const map = {}; const walk = l => l.forEach(n => { map[n.id] = [n.start, n.end]; if (n.children) walk(n.children); }); walk(TREE);
  if (map.m23) map.m23 = ['2026-11-06', '2026-11-06']; if (map.m32) map.m32 = [map.m32[0], '2026-11-13']; return { sm42: { date: '01.10.2026 (Projektstart)', map } }; })();
const MTA_REPORTS = ['2026-10-01', '2026-10-15', '2026-10-29'];
const MTA_HIST = { m22: ['2026-11-06', '2026-10-30', '2026-11-06'], m23: ['2026-11-06', '2026-11-06', '2026-11-10'], m32: ['2026-11-13', '2026-11-13', '2026-11-17'], m51: ['2026-11-27', '2026-11-27', '2026-11-27'], m52: ['2027-01-22', '2027-01-15', '2027-01-22'] };
const MTA_COLORS = ['#0F6CBD', '#C239B3', '#107C10', '#CA5010', '#5C2E91', '#038387', '#A4262C', '#8764B8', '#986F0B', '#4F6BED', '#00B7C3'];
const SITES = [['NW', 'Nordrhein-Westfalen'], ['HE', 'Hessen'], ['BW', 'Baden-Württemberg'], ['TH', 'Thüringen'], ['SN', 'Sachsen'], ['AT', 'Österreich'], ['CZ', 'Tschechien']];
const SITE0 = { 'T. Brandt': 'HE', 'L. Wagner': 'BW', 'M. Yilmaz': 'TH', 'J. Novak': 'CZ', 'A. Schulz': 'SN', 'D. Petrov': 'AT' };
const HOL_DE = { '2026-12-25': 'Weihnachten', '2026-12-26': '2. Weihnachtstag', '2027-01-01': 'Neujahr', '2027-03-26': 'Karfreitag', '2027-03-29': 'Ostermontag', '2027-05-01': 'Tag der Arbeit', '2027-05-06': 'Christi Himmelfahrt', '2027-05-17': 'Pfingstmontag', '2027-05-27': 'Fronleichnam' };
const HOL_SITE = { NW: {}, HE: {}, BW: { '2027-01-06': 'Heilige Drei Könige' }, TH: { '2027-05-27': null }, SN: { '2026-11-18': 'Buß- und Bettag', '2027-05-27': null },
  AT: { only: true, '2026-12-08': 'Mariä Empfängnis', '2026-12-25': 'Christtag', '2026-12-26': 'Stefanitag', '2027-01-01': 'Neujahr', '2027-01-06': 'Heilige Drei Könige', '2027-03-29': 'Ostermontag', '2027-05-01': 'Staatsfeiertag', '2027-05-06': 'Christi Himmelfahrt', '2027-05-17': 'Pfingstmontag', '2027-05-27': 'Fronleichnam' },
  CZ: { only: true, '2026-11-17': 'Tag des Kampfes für Freiheit', '2026-12-24': 'Heiliger Abend', '2026-12-25': '1. Weihnachtstag', '2026-12-26': '2. Weihnachtstag', '2027-01-01': 'Neujahr', '2027-03-26': 'Karfreitag', '2027-03-29': 'Ostermontag', '2027-05-01': 'Tag der Arbeit', '2027-05-08': 'Tag der Befreiung' } };
const BR_DE = { '2026-12-24': 'Betriebsruhe', '2026-12-28': 'Betriebsruhe', '2026-12-29': 'Betriebsruhe', '2026-12-30': 'Betriebsruhe', '2026-12-31': 'Betriebsruhe' };
const CAP_WEEK_H = 28; // 35 h × 80 % planbar = 100 %
function pctNum(p) { const m = /([0-9]+)/.exec(String(p || '')); return m ? +m[1] : 0; }
function projPctOf(name, skipPk) { let sum = 0; const list = []; for (const k in PMEMBERS) { if (k === skipPk) continue; const r = PMEMBERS[k].find(x => x[0] === name && !x[4]); if (r && pctNum(r[3])) { sum += pctNum(r[3]); list.push([k, pctNum(r[3])]); } } return { sum, list }; }
function holAt(iso, site) { const S = HOL_SITE[site] || {}; if (S.only) return S[iso] || null; if (iso in S) return S[iso] || null; return HOL_DE[iso] || BR_DE[iso] || null; }
const CR_SEED = { sm42: [
  { id: 'CR-01', title: 'Schraubstation: Hub +50 mm für neues Teilespektrum', desc: 'Der Kunde will ab 2027 längere Bolzen verschrauben. Dafür braucht die Station 50 mm mehr Hub am Schraubzylinder.', reason: 'Kundenwunsch, neues Teilespektrum ab KW 3/2027', days: 7, cost: 4800, nodes: ['m42'], by: 'T. Brandt', when: '11.11.', status: 'bei H. Lorenz' },
  { id: 'CR-02', title: 'Servoantriebe Rexroth statt Siemens', desc: 'Lieferzeit Siemens 9 Wochen, Rexroth 3 Wochen. Mehrpreis 6 %.', reason: 'Termin halten', days: 0, cost: 1100, nodes: ['m32'], by: 'Du', when: '04.11.', status: 'genehmigt', decided: 'Du, 04.11.' }] };
const PSTACEY = { sm42: [1, 0], rl2: [3, 3], pd: [2, 1], ih: [1, 1] };
const PMEMBERS = {
  sm42: [['Du', 'Owner', 'Automatisierung', '60 %'], ['T. Brandt', 'Bearbeiter', 'Konstruktion', '50 %'], ['S. Keller', 'Bearbeiter', 'Automatisierung', '40 %'], ['L. Wagner', 'Mitwirkender', 'Konstruktion', '30 %'], ['Kunde', 'Gast', 'extern', '–']],
  rl2: [['Du', 'Owner', 'Automatisierung', '30 %'], ['J. Novak', 'Bearbeiter', 'Automatisierung', '100 %'], ['S. Keller', 'Bearbeiter', 'Automatisierung', '50 %'], ['M. Yilmaz', 'Bearbeiter', 'Automatisierung', '50 %'], ['F. Roth', 'Bearbeiter', 'Softwareentwicklung', '30 %'], ['T. Brandt', 'Mitwirkender', 'Konstruktion', '20 %']],
  pd: [['N. Becker', 'Owner', 'Softwareentwicklung', '60 %'], ['E. Lang', 'Bearbeiter', 'Softwareentwicklung', '50 %'], ['F. Roth', 'Bearbeiter', 'Softwareentwicklung', '40 %'], ['Du', 'Leser', 'Bereich Technik', '–'], ['Kunde', 'Gast', 'extern', '10 %']],
  ih: [['R. Fischer', 'Owner', 'Instandhaltung', '50 %'], ['K. Weber', 'Bearbeiter', 'Instandhaltung', '100 %'], ['A. Schulz', 'Bearbeiter', 'Instandhaltung', '100 %'], ['D. Petrov', 'Bearbeiter', 'Instandhaltung', '100 %'], ['M. Yilmaz', 'Mitwirkender', 'Automatisierung', '20 %'], ['Du', 'Leser', 'Bereich Technik', '–']]
};
const PTEAM = {
  sm42: [['Du', 'Projektleitung', '60%'], ['T. Brandt', 'Elektrokonstruktion', '50%'], ['S. Keller', 'SPS / IBN', '40%'], ['L. Wagner', 'Mechanik', '30%']],
  rl2: [['Du', 'Product Owner', '30%'], ['J. Novak', 'Safety-SPS', '100%'], ['S. Keller', 'Scrum Master, IBN', '50%'], ['M. Yilmaz', 'Robotik, Rezepte', '50%'], ['F. Roth', 'HMI', '30%']],
  pd: [['N. Becker', 'Projektleitung', '60%'], ['E. Lang', 'Architektur, Integration', '50%'], ['F. Roth', 'Implementierung', '40%'], ['Kunde', 'Abnahme', '10%']],
  ih: [['R. Fischer', 'Teamleitung', '50%'], ['K. Weber', 'Elektrik', '100%'], ['A. Schulz', 'Mechanik', '100%'], ['D. Petrov', 'Hydraulik', '100%']]
};
const PRACI = {
  sm42: { rows: RACI_ROWS, cols: RACI_COLS, init: RACI_INIT },
  rl2: { rows: ['Epic HMI', 'Epic Safety', 'Epic Rezepte', 'Sprint-Planung', 'Review und Abnahme'], cols: ['Du', 'J. Novak', 'S. Keller', 'F. Roth', 'T. Brandt'],
    init: [['A', 'C', 'I', 'R', ''], ['A', 'R', 'C', 'I', 'C'], ['A', 'C', 'R', '', 'I'], ['A', 'R', 'R', 'R', 'I'], ['A', 'R', 'C', 'R', 'I']] },
  pd: { rows: ['Lastenheft und Abnahmekriterien', 'Systementwurf', 'Messverstärker-Modul', 'Modul- und Integrationstest', 'Abnahmetest'], cols: ['N. Becker', 'E. Lang', 'F. Roth', 'Du', 'Kunde'],
    init: [['A', 'C', '', 'I', 'R'], ['A', 'R', 'C', 'I', ''], ['C', 'A', 'R', '', ''], ['A', 'R', 'R', 'I', ''], ['R', 'C', 'C', 'I', 'A']] },
  ih: { rows: ['Störungsbehebung', 'Wartungsplan', 'UVV-Prüfungen', 'Ersatzteile', 'Sicherheitsfreigabe'], cols: ['R. Fischer', 'K. Weber', 'A. Schulz', 'D. Petrov', 'Du'],
    init: [['A', 'R', 'R', 'R', 'I'], ['A', 'C', 'R', 'R', ''], ['A', 'R', '', 'C', 'I'], ['A', '', 'C', 'R', 'I'], ['R', 'R', '', '', 'A']] }
};
const PAKV = {
  rl2: [['Du', 'Backlog priorisieren, Stories abnehmen', 'Priorität und Umfang', 'Produktwert und Release-Inhalt', false], ['J. Novak', 'Safety-SPS programmieren', 'TIA Safety, Elektrofachkraft', 'Funktionale Sicherheit der Linie', false],
    ['F. Roth', 'HMI entwickeln', 'WinCC Unified', 'Bedienbarkeit am HMI', false], ['S. Keller', 'Inbetriebnahme Linie 2', 'Freigabe IBN', 'Anlauf ohne Stillstand über Plan (keine Hoheit über Schichtplanung)', true]],
  pd: [['N. Becker', 'Projekt leiten, Kunde', 'Budget bis 50.000 €', 'Termin, Kosten, Abnahme', false], ['E. Lang', 'Architektur, Integrationstest', 'Technische Entscheidungen Software', 'Testabdeckung je Ebene', false],
    ['F. Roth', 'Implementierung, Modultest', 'Code-Freigabe', 'Modulqualität', false], ['Kunde', 'Abnahmetest', 'Abnahme unterschreiben', 'Abnahmekriterien vollständig (noch nicht unterschrieben)', true]],
  ih: [['R. Fischer', 'Aufträge priorisieren, Team einsetzen', 'Fremdfirmen bis 5.000 €', 'Verfügbarkeit Halle 2', false], ['K. Weber', 'Elektrische Störungen, DGUV V3', 'Elektrofachkraft', 'Elektrische Sicherheit', false],
    ['A. Schulz', 'Mechanik, Kompressoren', 'Mechatroniker', 'Wartung nach Plan', false], ['D. Petrov', 'Hydraulik, Pressen', 'Hydraulik-Zertifikat', 'Ölwechsel und Dichtigkeit', false]]
};
const PDOCS = {
  rl2: [['DOC', '#2B5797', 'Product Vision Retrofit L2', 'Vision', 'Release 1', 'v1', 'final', '21.09. · Du'], ['XLS', '#107C10', 'Definition of Done', 'Arbeitsvereinbarung', 'alle Sprints', 'v2', 'final', '05.10. · Team'],
    ['PDF', '#A4262C', 'Sicherheitskonzept Linie 2', 'Sicherheitsnachweis', 'Epic Safety', 'v0.8', 'pruefung', '11.11. · J. Novak'], ['PNG', '#5B2D90', 'HMI-Grundbild Entwurf', 'Design', 'RL-11', 'v3', 'pruefung', '10.11. · F. Roth'], ['DOC', '#2B5797', 'Retro Sprint 3', 'Protokoll', 'Sprint 3', 'v1', 'final', '30.10. · Du']],
  pd: [['PDF', '#A4262C', 'Lastenheft Prüfstand', 'Lastenheft', 'Anforderungsdefinition', 'v2.0', 'final', '30.06. · N. Becker'], ['DOC', '#2B5797', 'Systemspezifikation', 'Spezifikation', 'Systementwurf', 'v1.3', 'final', '31.07. · N. Becker'],
    ['DOC', '#2B5797', 'Feinentwurf Messverstärker', 'Modulentwurf', 'Modulentwurf', 'v0.7', 'entwurf', '09.11. · E. Lang'], ['XLS', '#107C10', 'Testspezifikation Modultest', 'Testfälle', 'Modultest', 'v0.4', 'pruefung', '12.11. · F. Roth'], ['PDF', '#A4262C', 'Abnahmeprotokoll (Vorlage)', 'Prüfprotokoll', 'Abnahmetest', 'v0.1', 'entwurf', '01.10. · Kunde']],
  ih: [['PDF', '#A4262C', 'Wartungsplan Halle 2 2026', 'Wartungsplan', 'Wartungsplan Halle 2', 'v4', 'final', '02.01. · R. Fischer'], ['PDF', '#A4262C', 'Prüfbuch Hallenkran', 'Prüfnachweis', 'UVV-Prüfung Hallenkran', 'v12', 'final', '30.11.2025 · R. Fischer'],
    ['XLS', '#107C10', 'Ersatzteilliste Presse 2', 'Ersatzteile', 'Großinspektion Presse 2', 'v3', 'pruefung', '10.11. · D. Petrov'], ['JPG', '#33691E', 'Foto Leckage Ventilblock V2', 'Foto', 'Presse 3', 'v1', 'final', '14.09. · D. Petrov'], ['PDF', '#A4262C', 'Gefährdungsbeurteilung Hydraulik', 'Sicherheitsnachweis', 'Presse 3', 'v2', 'pruefung', '05.11. · R. Fischer']]
};
const PLOG = {
  rl2: [['F. Roth', 'heute 09:40', 'HMI-Grundbild an Bediener verteilt, drei Rückmeldungen.'], ['J. Novak', 'gestern', 'Not-Halt-Kreis auf Safety-SPS umgestellt, Validierung offen.'], ['Du', '11.11.', 'RL-14 Rezepte: Akzeptanzkriterium 2 präzisiert.'], ['S. Keller', '06.11.', 'Retro: Daily mit Instandhaltung beibehalten.']],
  pd: [['E. Lang', 'heute 07:55', 'Feinentwurf Messverstärker v0.7 hochgeladen, Review angefragt.'], ['N. Becker', 'gestern', 'Kunde bestätigt Genauigkeit ±0,5 %, Nachtrag in Arbeit.'], ['F. Roth', '10.11.', 'Modultests MT-01 bis MT-04 bestanden.'], ['N. Becker', '06.11.', 'Modulentwurf überfällig, neuer Termin 20.11.']],
  ih: [['D. Petrov', 'heute 10:05', 'Servomotor Presse 2: Lieferant bestätigt 18.11.'], ['K. Weber', 'gestern', 'Lichtvorhang Station 3 gereinigt, Wochenwartung ergänzt.'], ['R. Fischer', '11.11.', 'WIP-Limit „In Arbeit“ bleibt bei 3.'], ['A. Schulz', '09.11.', 'Ansaugfilter Kompressor 1 bestellt.']]
};
const PFIN = {
  rl2: { B: [['Budget (Plan)', 180000], ['Ist', 96000], ['Obligo', 22000], ['Prognose', 172000]], hours: [['J. Novak', 290, 40], ['S. Keller', 150, 30], ['M. Yilmaz', 140, 20], ['F. Roth', 120, 24]], hmax: 340,
    inv: [['Leistungsverrechnung Q3', '58.000 € · gebucht 30.09.', 'bezahlt'], ['Leistungsverrechnung Q4', 'fällig 31.12.', 'plan'], ['Safety-SPS Hardware', '24.000 € · bestellt 20.10.', 'bestellt']] },
  pd: { B: [['Budget (Plan)', 290000], ['Ist', 310000], ['Obligo', 18000], ['Prognose', 352000]], hours: [['N. Becker', 300, 20], ['E. Lang', 280, 40], ['F. Roth', 230, 30]], hmax: 340,
    inv: [['Anzahlung 40 %', '116.000 € · bezahlt 15.06.', 'bezahlt'], ['Nachtrag Genauigkeit ±0,5 %', '42.000 € · beim Kunden in Prüfung', 'pruefung'], ['Schlussrechnung', 'nach Abnahme 31.03.2027', 'entwurf']] },
  ih: { B: [['Budget 2026 (Plan)', 120000], ['Ist', 41000], ['Obligo', 9500], ['Prognose', 108000]], hours: [['K. Weber', 610, 40], ['D. Petrov', 600, 50], ['A. Schulz', 590, 30], ['R. Fischer', 300, 20]], hmax: 700,
    inv: [['Fremdfirma Kranprüfung', '2.400 € · beauftragt für 30.11.', 'bestellt'], ['Ersatzteile Servomotor', '6.800 € · bestellt 03.11.', 'bestellt'], ['Hydrauliköl 400 l', '1.900 € · bezahlt 28.10.', 'bezahlt']] }
};

// ── Projekteinstellungen ──
const BCAT = { offen: ['Offen', '#5C5C5C'], aktiv: ['In Arbeit', '#0F6CBD'], wartet: ['Wartet', '#A33F06'], fertig: ['Erledigt', '#107C10'] };
const DEF_BUCKETS = [{ key: 'Backlog', name: 'Backlog', cat: 'offen', color: BUCKET['Backlog'] }, { key: 'Fokus', name: 'Fokus', cat: 'aktiv', color: BUCKET['Fokus'] },
  { key: 'Warten auf', name: 'Warten auf', cat: 'wartet', color: BUCKET['Warten auf'] }, { key: 'Erledigt', name: 'Erledigt', cat: 'fertig', color: BUCKET['Erledigt'] }];
const PK_OF = { 'SM42 Schraubstation': 'sm42', 'Retrofit Linie 2': 'rl2', 'Prüfstand Drehmoment': 'pd', 'Instandhaltung Halle 2': 'ih' };
const RIGHTS = ['Ablaufplan ändern', 'Aufgaben anlegen und zuweisen', 'Eigene Aufgaben bearbeiten', 'Dateien ablegen', 'Budget und Finanzen sehen', 'Mitglieder und Rollen verwalten', 'Automatisierungen anlegen'];
const RIGHTS_INIT = [[true, true, false, false, false], [true, true, false, false, false], [true, true, true, false, false], [true, true, true, false, false], [true, true, false, false, false], [true, false, false, false, false], [true, true, false, false, false]];
const RULES_INIT = [{ text: 'Wenn sich der Status einer meiner Aufgaben ändert, dann Mail an mich.', on: true, runs: '3× ausgelöst in 30 Tagen' },
  { text: 'Wenn ein Meilenstein überfällig wird, dann Teams-Nachricht an die Projektleitung.', on: true, runs: 'zuletzt am 10.11.' },
  { text: 'Wenn eine Aufgabe 5 Tage in „Warten auf“ liegt, dann Erinnerung an den Bearbeiter.', on: false, runs: '' }];
const RECIPES = ['Jeden Morgen um 7 Uhr: Sammelmail mit meinen überfälligen Aufgaben', 'Wenn ein Gate erreicht ist, dann Freigabe beim Chef anfragen', 'Wenn eine Störung „Expedite“ eingeht, dann Push an die Bereitschaft', 'Wenn ein Lieferant den Termin nicht bestätigt, dann Erinnerung an den Einkauf'];

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { screen: 'start', ptab: 'uebersicht', panel: null, filter: 'alle', ampel: 'alle', expanded: { p2: true }, highlight: null, done: {}, sx: 1, sy: 0,
      lang: 'de', editDash: false, team: 'automatisierung', claimed: {}, inSel: 'i1', inFilter: 'alle', read: {}, result: {}, raci: RACI_INIT.map(r => r.slice()), akv: 'tabelle',
      kb: (() => { const o = {}; KB.forEach(k => { o[k.id] = k.col; }); return o; })(), lane: 'keine', kbMsg: '',
      proj: 'sm42', sview: 'zyklus', order: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9'],
      sst: { s1: 'Done', s2: 'Review', s3: 'In Arbeit', s4: 'To Do' },
      acs: { s1: [true, true, true], s2: [true, true, false], s3: [true, false, false], s4: [false, false, false], s5: [false, false], s6: [false, false], s7: [false, false], s8: [], s9: [false, false] },
      plan5: [], boardMsg: '', accept: {}, goal: null, mood: null,
      rview: 'portfolio', rFilter: 'alle', rMsg: '', rAuto: false, porder: ['sm42', 'rl2', 'pd', 'ih', 'mes', 'ets'],
      wcat: 'alle', wtag: null, wHelp: {}, wMsg: '',
      nt: { who: 'ich', person: 'M. Yilmaz', proj: 'Ohne Projekt', h: 4, due: '2026-11-20', co: [], rep: 'nie', kind: 'aufgabe', title: '', ctx: null, parent: null, date: '2026-11-27', dur: 14, owner: 'Du', check: 'Konstruktionsfreigabe' },
      arbTab: 'aufgaben', panelW: 420, panelMax: false, descEdit: null, themeMode: 'system', accentOv: null, densOv: null, profMsg: '', prof: { title: 'Projektingenieur Automatisierung', site: 'Werk 1', phone: '+49 2722 62-0', pic: '#5B2D90', photo: false, levels: { 'TIA Portal': 3, 'Safety': 3, 'KUKA': 1, 'Profinet': 2, 'WinCC': 2, 'Projektmanagement': 3 }, extra: [], certs: [['Safety-Schulung (TÜV)', '2027-01-05']], hours: 35, days: [true, true, true, true, true], share: 80, start: '07:00', deputy: 'S. Keller' }, notif: { mail: true, push: true, teams: false, digest: true, quiet: true, mention: true }, cal: { outlook: true, block: true, ical: false, fokusFree: true }, kiPref: { outlook: true, drafts: true, replies: true, mails: true, termine: true, status: true, wissen: true, team: true }, drState: {}, drSlot: {}, drMsg: '', drVar: {}, q: '', drIdx: 0, kmState: {}, kmIdx: 0, kmMsg: '', tpH: 'woche', tpKi: false, tdKi: false, tpW: 0, tpZoom: 'w1', teamAdd: {}, tdPlan: {}, tdSel: null, recurAdd: {}, pSub: 'details', akte: {}, akMsg: '', akTyp: 'Notiz', akH: 1, akD: 'heute', akWho: 'Du', akSup: 'Würth', akSupQ: '', supAdd: [], akView: null, akKind: 'Material', akAmt: '', akBeleg: false, nodeCo: { m42: ['T. Brandt'], m23: ['T. Brandt', 'L. Wagner'] }, invAdd: {}, coOv: { t12: ['L. Wagner'], t5: ['S. Keller'], t10: ['Du'], t3: ['S. Keller'] }, kiSkip: {},
      txt: {}, cmpOpen: null, cmpErr: null, reqTxt: {}, gateRes: {}, wait: { t2: { who: 'Lieferant', why: 'Angebot Servoantriebe, angefragt am 04.11.', until: '18.11.', since: '04.11.' }, t12: { who: 'L. Wagner', why: 'Überarbeiteter Pneumatikplan, Ventilinsel neu dimensionieren', until: '16.11.', since: '10.11.' } }, waitAsk: null, waitEdit: null, waitDraft: {}, comments: {}, pMsg: '',
      tplan: {}, tpSel: null, tpMsg: '', meetDay: {}, weekMsg: '', daySel: '2026-11-13', daySel2: null, dayMsg: '', dayPlan: { '2026-11-13': [{ id: 't2', start: 7, h: 0.5 }, { id: 't3', start: 8.5, h: 1 }] }, ovBy: {}, ovEdit: false, kiSum: {}, kiUse: { mail: true, status: true, risiko: true, ll: true, sum: true }, sent: [], reqObj: {}, reqAns: {},
      aStep: 1, aClar: 1, aTech: 2, aTeams: { auto: true }, aEff: 1, aStartI: 1, aSent: false, aAnswered: false, aMsg: '',
      ztOpen: false, tl3: false, zt: { pl: 'M. Yilmaz', model: 'Scrum', vorlage: 'Scrum Standard', rank: 4 },
      adview: 'org', orgSel: 'auto', orgOf: Object.assign({}, ORG_INIT), orgMove: null, orgHist: [], adMsg: '',
      rem: { team: 1, extern: 2, zeit: 2, antrag: 5, gate: 2, anteil: 2 }, planF: 80, vtBy: 'S. Keller', vtSet: false,
      focus: { qual: 2, umwelt: 1, audit: 1, kosten: 3, prod: 2, ress: 1, entl: 1, arb: 1 }, aThemeSel: ['prod', 'entl'],
      mview: { arbeit: 'liste', sm42: 'board', sm42p: 'gantt', pd: 'liste', pdp: 'vmodel', rl2: 'board', rl2p: 'scrum', ih: 'kanban', ihp: 'gantt' }, bk: {}, fSort: [],
      blane: {}, calP: {}, ownerOv: {}, dragOver: null, mvMsg: '', raciBy: {}, rev: 0,
      dOrder: ['aufgaben', 'fokus', 'eingang', 'projekte', 'last', 'woche'], dSize: {}, dHidden: {}, dashMsg: '', dH: {}, dExtra: [], dOpt: {}, dOptOpen: null, dNote: '', ibl: {}, iblOpen: false, detMode: 'popup', upAddK: 'phase', upDur: 28, upRole: {}, upAkv: {}, upRaci: {}, impRaw: '', impMap: {}, impOff: {}, impProj: 'SM42 Schraubstation', impMsg: '', impDone: false, impLast: null, blOn: true, blBy: {}, blMsg: '', crBy: {}, crNew: null, crMsg: '', chatMode: 'auto', chat: null, chatOpen: false, chatIn: '', kiToneBy: {}, kiNoteBy: {}, hist: {}, lnk: null, lnkOpen: false, lnkQ: '', lnkType: 'blockiert durch', delAsk: null, trash: [], trashOpen: false, trMsg: '', ko: null, koMsg: '', koErr: '', koEf: '', koUsR: '', koUsZ: '', koUsN: '', koOut: '', koRisk: '', nkKind: 'ms', nkName: '', nkWho: null, nkStartBy: {}, nkEndBy: {}, mvg: {}, svBy: {}, ntText: '', ntDue: '', ntWho: null, mvf: {}, mvfOpen: {}, lblNames: {}, propOpen: null, lbl: {}, lblEdit: false, chk: {}, chkNew: '', pplOpen: null, pplQ: '', newP: null, uprojs: [], upSel: null, upTab: 'uebersicht', upView: 'board', upGate: {}, psetBy: {}, userTpl: [], qa: null, qaText: '', qaDue: '', pnMsg: '', absAdd: [], absKind: 'Urlaub', absFrom: '2026-12-21', absTo: '2026-12-23', absMsg: '', absLast: null, absDone: {}, ntfOpen: false, ntfRead: {}, ntfF: 'alle', mtSel: 'mt2', mtNotes: {}, mtProt: {}, mtMsg: '',
      setSub: null, bucketsBy: {}, rightsBy: {}, rolesExtra: {}, rulesBy: {}, rb: { trig: 0, obj: 1, act: 0, to: 0 }, setMsg: '', asRole: 'Leser',
      moScreen: 'list', moSel: 'k7', moChecks: {}, moTimer: false, moBooked: 0, moPhoto: 0, moArt: 0, moDring: 0, moMsg: '', moMsgOk: true };
  }

  vStatus(v) { return this.nodeStatus(NODE[v.id]); }
  openProject(key) { const st = PSTACEY[key] || [1, 0]; this.setState({ boardMsg: '', screen: 'projekt', proj: key, ptab: key === 'sm42' ? 'uebersicht' : (key === 'ih' ? 'aufgaben' : 'planung'), panel: null, highlight: null, sx: st[0], sy: st[1] }); }
  kbColsOf() { return this.state.kbCols || KB_COLS; }
  kbSetCols(list, msg) { this.setState({ kbCols: list, kbMsg: msg || '', kbOk: true }); }
  kbNew(col, o) { const C = this.kbColsOf(), def = C.find(c => c[0] === col), inCol = Object.values(this.state.kb).filter(c => c === col).length;
    if (def && def[2] && inCol >= def[2]) return this.setState({ kbMsg: 'WIP-Limit „' + def[1] + '“ erreicht (' + inCol + ' von ' + def[2] + '). Neue Aufträge erst in „' + C[0][1] + '“ anlegen oder einen abschließen.', kbOk: false });
    const id = 'kn' + Date.now().toString(36), k = { id, type: o.type, title: o.title, anlage: o.anlage || '–', cls: o.exp ? 'Expedite' : 'Standard', owner: o.owner, col, age: 0 };
    KB.push(k); const x = { id: 'ik' + id, title: o.title, proj: 'Instandhaltung Halle 2', due: o.exp ? '2026-11-13' : '2026-11-20', bucket: 'Backlog', prio: o.exp ? 'Hoch' : 'Niedrig', owner: o.owner, mine: o.owner === 'Du', ms: null, kb: id, est: IH_EST[o.type] || 2, desc: o.type + ' an ' + (o.anlage || 'Anlage offen') + '. Serviceklasse: ' + k.cls + '.' };
    TASKS.push(x); TASK[x.id] = x;
    this.setState({ kb: Object.assign({}, this.state.kb, { [id]: col }), kbAdd: null, kbMsg: o.type + ' „' + o.title + '“ in „' + (def ? def[1] : col) + '“ angelegt' + (o.owner !== 'Du' ? ', zugewiesen an ' + o.owner : '') + '. Klick auf den Titel öffnet die Details.', kbOk: true, rev: (this.state.rev || 0) + 1 }); }
  moveKb(id, dir) {
    const order = this.kbColsOf().map(c => c[0]);
    const cur = this.state.kb[id], next = this.kbColsOf()[order.indexOf(cur) + dir];
    if (!next) return;
    const limit = next[2];
    const inCol = Object.values(this.state.kb).filter(c => c === next[0]).length;
    if (limit && inCol >= limit) {
      this.setState({ kbMsg: 'WIP-Limit „' + next[1] + '“ erreicht (' + inCol + ' von ' + limit + '). Erst einen Auftrag abschließen, dann neuen beginnen.', kbOk: false });
      return;
    }
    const kb = Object.assign({}, this.state.kb); kb[id] = next[0]; this.setState({ kb, kbMsg: '', kbOk: true });
  }
  moveStory(id, dir) {
    const cols = SB_COLS.map(c => c[0]);
    const cur = this.state.sst[id], idx = cols.indexOf(cur), next = cols[idx + dir];
    if (!next) return;
    if (next === 'Done' && !this.state.acs[id].every(Boolean)) {
      const open = this.state.acs[id].filter(x => !x).length;
      this.setState({ boardMsg: STORIES[id].key + ' kann nicht nach Done: ' + open + ' von ' + this.state.acs[id].length + ' Akzeptanzkriterien offen. Im Story-Panel abhaken.' });
      return;
    }
    const sst = Object.assign({}, this.state.sst); sst[id] = next; this.setState({ sst, boardMsg: '' });
  }

  theme() {
    const tm = (this.state && this.state.themeMode) || 'system';
    const dark = tm === 'dunkel' ? true : (tm === 'hell' ? false : !!this.props.dark);
    const accent = (this.state && this.state.accentOv) || (this.props.accent ?? '#0F6CBD');
    const t = dark
      ? { bg: '#1B1B1B', surface: '#262626', surface2: '#2E2E2E', border: '#3B3B3B', strong: '#8A8A8A', text: '#FFFFFF', muted: '#B3B3B3', track: '#3B3B3B', soft: accent + '33', hl: accent + '2E' }
      : { bg: '#F4F5F7', surface: '#FFFFFF', surface2: '#F7F7F8', border: '#E1E1E3', strong: '#8A8886', text: '#242424', muted: '#5E5E5E', track: '#E6E6E8', soft: accent + '1A', hl: accent + '14' };
    return { t, accent, accentText: dark ? '#9CC9F5' : accent };
  }

  isDone(task) { if (task.story) return this.state.sst[task.story] === 'Done'; if (task.kb) return this.state.kb[task.kb] === 'erledigt'; const d = this.state.done[task.id]; return d === undefined ? task.bucket === 'Erledigt' : d; }
  bucketOf(task) { if (task.story) return task.ms ? SST_BUCKET[this.state.sst[task.story]] : 'Backlog'; if (task.kb) return KB_BUCKET[this.state.kb[task.kb]] || 'Backlog'; if (this.isDone(task)) { const o2 = this.state.bk[task.id]; return o2 && this.catOf(task, o2) === 'fertig' ? o2 : this.doneKey(task); } const o = this.state.bk[task.id]; if (o && this.bucketsOf(this.pkOf(task)).some(b => b.key === o)) return o; return task.bucket === 'Erledigt' ? 'Fokus' : task.bucket; }
  toggleFocus(id) {
    const x = TASK[id]; if (this.isDone(x)) return;
    if (x.story) return x.ms ? this.storyTo(x.story, this.bucketOf(x) === 'Fokus' ? 'To Do' : 'In Arbeit') : this.setState({ boardMsg: STORIES[x.story].key + ' liegt im Product Backlog.' });
    if (x.kb) return this.kbTo(x.kb, this.bucketOf(x) === 'Fokus' ? 'geplant' : 'arbeit');
    const bk = Object.assign({}, this.state.bk), inF = this.bucketOf(x) === 'Fokus';
    bk[id] = inF ? (x.bucket !== 'Fokus' && x.bucket !== 'Erledigt' ? x.bucket : 'Backlog') : 'Fokus';
    this.setState({ bk });
  }
  moveBucket(id, dir) {
    const B = this.bucketsOf(this.pkOf(TASK[id])).map(b => b.key), i = B.indexOf(this.bucketOf(TASK[id])) + dir;
    if (i >= 0 && i < B.length) this.bucketTo(id, B[i]);
  }
  bucketTo(id, b) {
    const x = TASK[id];
    if (x.story) return this.storyTo(x.story, { Backlog: 'To Do', Fokus: 'In Arbeit', 'Warten auf': 'Review', Erledigt: 'Done' }[b]);
    if (x.kb) return this.kbTo(x.kb, { Backlog: 'geplant', Fokus: 'arbeit', 'Warten auf': 'teile', Erledigt: 'erledigt' }[b]);
    const bk = Object.assign({}, this.state.bk), done = Object.assign({}, this.state.done), oldB = this.bucketName(x, this.bucketOf(x));
    done[id] = this.catOf(x, b) === 'fertig'; bk[id] = b;
    this.setState({ bk, done }); this.logH('t:' + id, 'Bucket', oldB, this.bucketName(x, b));
    const bl = this.catOf(x, b) === 'aktiv' ? this.blockersOf(id) : []; if (bl.length) this.setState({ boardMsg: '⛔ „' + x.title + '“ ist blockiert durch ' + bl.map(o => '„' + TASK[o].title + '“').join(', ') + '. Trotzdem verschoben.', pMsg: '⛔ Blockiert durch ' + bl.map(o => this.kenn(TASK[o])).join(', ') + '.' });
    if (this.catOf(x, b) === 'wartet' && !(this.state.wait || {})[id]) { const sc = this.state.screen; this.setState({ waitAsk: id, pMsg: '', panel: { kind: 'task', id, from: sc === 'projekt' ? 'aufgaben' : sc } }); }
  }
  storyTo(sid, col) {
    if (!(sid in this.state.sst)) return this.setState({ boardMsg: STORIES[sid].key + ' liegt im Product Backlog. Über die Sprint-Planung in den Sprint holen.' });
    if (this.state.sst[sid] === col) return;
    if (col === 'Done' && !this.state.acs[sid].every(Boolean)) {
      const open = this.state.acs[sid].filter(x => !x).length;
      return this.setState({ boardMsg: STORIES[sid].key + ' kann nicht nach Done: ' + open + ' von ' + this.state.acs[sid].length + ' Akzeptanzkriterien offen. Im Story-Panel abhaken.' });
    }
    const sst = Object.assign({}, this.state.sst); sst[sid] = col; this.setState({ sst, boardMsg: '' });
  }
  kbTo(kid, col) {
    if (this.state.kb[kid] === col) return;
    const def = this.kbColsOf().find(c => c[0] === col), lim = def && def[2], inCol = Object.values(this.state.kb).filter(c => c === col).length;
    if (lim && inCol >= lim) return this.setState({ kbMsg: 'WIP-Limit „' + def[1] + '“ erreicht (' + inCol + ' von ' + lim + '). Erst einen Auftrag abschließen, dann neuen beginnen.', kbOk: false });
    const kb = Object.assign({}, this.state.kb); kb[kid] = col; this.setState({ kb, kbMsg: '', kbOk: true });
  }
  ganttStart(id, mode) { return e => { this._gd = { id, mode, x0: e.clientX }; try { e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move'; } catch (er) { /* ältere Browser */ } if (e.stopPropagation) e.stopPropagation(); }; }
  ganttOver() { return e => { if (this._gd && e && e.preventDefault) e.preventDefault(); }; }
  ganttDrop(span) {
    return e => {
      if (e && e.preventDefault) e.preventDefault();
      const g = this._gd; this._gd = null; if (!g) return;
      const w = e.currentTarget && e.currentTarget.getBoundingClientRect ? e.currentTarget.getBoundingClientRect().width : 0;
      if (w) this.shiftNode(g.id, g.mode, Math.round((e.clientX - g.x0) / w * span));
    };
  }
  drawDeps() { try { const deps = this.depsOf(); document.querySelectorAll('[data-gantt]').forEach(c => { const old = c.querySelector(':scope > svg.ec-deps'); if (old) old.remove(); const cr = c.getBoundingClientRect(); if (!cr.width) return;
      const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'); svg.setAttribute('class', 'ec-deps'); svg.setAttribute('width', c.scrollWidth); svg.setAttribute('height', c.scrollHeight); svg.setAttribute('aria-hidden', 'true'); svg.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;overflow:visible;z-index:2';
      svg.innerHTML = '<defs><marker id="ecArr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#0F6CBD"/></marker><marker id="ecArrR" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#C50F1F"/></marker></defs>'; let n = 0;
      Object.keys(deps).forEach(sid => (deps[sid] || []).forEach(pid => { const a = c.querySelector('[data-nid="' + pid + '"]'), b = c.querySelector('[data-nid="' + sid + '"]'); if (!a || !b || !a.offsetParent || !b.offsetParent) return;
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), x1 = ra.right - cr.left, y1 = ra.top + ra.height / 2 - cr.top, x2 = rb.left - cr.left - 2, y2 = rb.top + rb.height / 2 - cr.top, crit = /197, 15, 31/.test(a.style.boxShadow || '') && /197, 15, 31/.test(b.style.boxShadow || '');
        const tp = rb.top - cr.top, bt = rb.bottom - cr.top, xa = Math.max(x1 + 8, rb.left - cr.left + 8), ye = y2 >= y1 ? tp - 1 : bt + 1, d = 'M' + x1 + ',' + y1 + ' H' + xa + ' V' + ye;
        const pth = document.createElementNS(ns, 'path'); pth.setAttribute('d', d); pth.setAttribute('fill', 'none'); pth.setAttribute('stroke', crit ? '#C50F1F' : '#0F6CBD'); pth.setAttribute('stroke-width', crit ? '2' : '1.5'); pth.setAttribute('marker-end', crit ? 'url(#ecArrR)' : 'url(#ecArr)'); svg.appendChild(pth); n++; }));
      if (n) c.appendChild(svg); }); } catch (e) { /* Zeichnen optional */ } }
  tabSplit(list) { const MORE = ['zeiten', 'kapazitaet', 'status', 'opl', 'aenderungen', 'abschluss', 'verlauf', 'anf'], s = this.state, main = list.filter(x => !MORE.includes(x.k) || x.sel === 'true'), more = list.filter(x => MORE.includes(x.k) && x.sel !== 'true');
    return { main, more: more.map(x => Object.assign({}, x, { go: e => { this.setState({ tabMore: false }); x.go(e); } })), hasMore: more.length > 0, moreDisp: s.tabMore ? 'flex' : 'none', moreToggle: () => this.setState({ tabMore: !s.tabMore }), moreLabel: 'Mehr (' + more.length + ') ' + (s.tabMore ? '▴' : '▾') }; }
  projPk(id) { let r = id; while (PARENT[r]) r = PARENT[r]; return Object.keys(PTREE_OF).find(k => (PTREE_OF[k] || []).some(x => x.id === r)) || null; }
  pptKit(D0) { const T = this._pptTpl || {}, col = T.colors || {}, A1 = col.accent1 || '0F6CBD', DK = col.dk2 || col.dk1 || '242424', fH = (T.fonts || {}).major || 'Segoe UI', fB = (T.fonts || {}).minor || 'Segoe UI', p = new window.PptxGenJS(); p.layout = 'LAYOUT_WIDE'; p.author = 'Engineering Cockpit';
    p.defineSlideMaster({ title: 'EC', background: { color: 'FFFFFF' }, objects: [{ rect: { x: 0, y: 0, w: 13.33, h: 0.1, fill: { color: A1 } } }].concat(T.logo ? [{ image: { data: T.logo, x: 11.3, y: 0.22, w: 1.7, h: 0.6, sizing: { type: 'contain', w: 1.7, h: 0.6 } } }] : []).concat([{ text: { text: D0.foot, options: { x: 0.5, y: 7.0, w: 9, h: 0.3, fontSize: 10, color: '808080', fontFace: fB } } }]), slideNumber: { x: 12.4, y: 7.0, fontSize: 10, color: '808080', fontFace: fB } });
    const K = { p, A1, DK, fH, fB, S: () => p.addSlide({ masterName: 'EC' }) };
    K.head = (sl, t0) => sl.addText(t0, { x: 0.5, y: 0.3, w: 10.4, h: 0.7, fontSize: 26, bold: true, color: DK, fontFace: fH });
    K.TB = (rows, hdr) => [hdr.map(h => ({ text: h, options: { bold: true, color: 'FFFFFF', fill: { color: A1 } } }))].concat(rows);
    K.tOpt = o => Object.assign({ x: 0.5, y: 1.2, w: 12.3, fontSize: 12, fontFace: fB, color: '242424', border: { type: 'solid', pt: 0.5, color: 'D0D0D0' }, valign: 'middle' }, o || {});
    K.bul = (sl, lines, o) => sl.addText((lines.length ? lines : ['–']).map(l => ({ text: l, options: { bullet: true, breakLine: true } })), Object.assign({ fontSize: 14, fontFace: fB, color: '242424', valign: 'top' }, o));
    K.title = (t1, t2, t3) => { const sl = K.S(); sl.addText(t1, { x: 0.8, y: 2.3, w: 11.5, h: 1.1, fontSize: 38, bold: true, color: A1, fontFace: fH }); sl.addText(t2, { x: 0.8, y: 3.5, w: 11.5, h: 0.6, fontSize: 18, color: '505050', fontFace: fB }); if (t3) sl.addText(t3, { x: 0.8, y: 4.2, w: 11.5, h: 0.5, fontSize: 14, color: '808080', fontFace: fB }); };
    return K; }
  async pptGate(id, t, accent) { await this.loadLibs(); const n = NODE[id], pk = this.projPk(id); if (!n || !pk) return; const M = this.modX(pk, '', t, accent, () => true), D0 = M.ppt.deckData(), ph = NODE[PARENT[id]], name = this.pnm(pk);
    const K = this.pptKit({ foot: name + ' · Gate-Review „' + n.name + '“' }), dd = iso => iso.slice(8, 10) + '.' + iso.slice(5, 7) + '.' + iso.slice(0, 4);
    const before = D0.tasks.filter(x => { const m = /(\d\d)\.(\d\d)\.(\d{4})/.exec(x.due); return m && (m[3] + '-' + m[2] + '-' + m[1]) <= n.end; }), late = before.filter(x => x.late), hiR = D0.risks.filter(r => r.sc >= 12), opLate = D0.opl.filter(o => o.late);
    const rec = late.length || opLate.length || hiR.length ? 'Mit Auflage bestehen' : 'Bestanden'; let sl;
    K.title('Gate-Review: ' + n.name, name + (ph ? ' · Phase ' + ph.name : '') + ' · Termin ' + dd(n.end), 'Entscheidung durch: ' + (n.owner || 'Projektleitung') + ' · Unterlage erzeugt am 13.11.2026');
    sl = K.S(); K.head(sl, 'Gate-Checkliste'); sl.addTable(K.TB((n.checks && n.checks.length ? n.checks : ['Checkliste vollständig', 'Dokumente freigegeben', 'Offene Punkte bewertet']).map(c0 => [c0, '☐ ja   ☐ nein', '']), ['Kriterium', 'Erfüllt', 'Nachweis / Bemerkung']), K.tOpt({ colW: [6.3, 2.2, 3.8], rowH: 0.5 }));
    sl = K.S(); K.head(sl, 'Stand bis zum Gate'); K.bul(sl, [(ph ? 'Phase „' + ph.name + '“: ' + dd(ph.start) + ' – ' + dd(ph.end) : 'Ohne Phase'), before.length + ' Aufgaben bis zum Gate offen, davon ' + late.length + ' überfällig', D0.opl.length + ' offene Punkte (' + opLate.length + ' überfällig)', hiR.length + ' hoch bewertete Risiken', 'Status gesamt: ' + D0.amp], { x: 0.5, y: 1.2, w: 5.6, h: 4.5 });
    if (before.length) sl.addTable(K.TB(before.slice(0, 10).map(x => [x.title, x.who, { text: x.due, options: { color: x.late ? 'C50F1F' : '242424' } }]), ['Offen bis zum Gate', 'Wer', 'Fällig']), K.tOpt({ x: 6.4, w: 6.4, fontSize: 11, colW: [3.9, 1.4, 1.1] }));
    sl = K.S(); K.head(sl, 'Offene Punkte und Risiken'); if (D0.opl.length) sl.addTable(K.TB(D0.opl.slice(0, 6).map(o => [o.id, o.t, o.who, { text: o.due, options: { color: o.late ? 'C50F1F' : '242424' } }]), ['ID', 'Offener Punkt', 'Wer', 'Bis']), K.tOpt({ colW: [0.9, 7.6, 2.3, 1.5] }));
    if (D0.risks.length) sl.addTable(K.TB(D0.risks.slice(0, 5).map(r => [{ text: String(r.sc), options: { bold: true, color: 'FFFFFF', fill: { color: r.c }, align: 'center' } }, r.t, r.m]), ['W×A', 'Risiko', 'Maßnahme']), K.tOpt({ y: 4.2, colW: [0.9, 5.4, 6] }));
    sl = K.S(); K.head(sl, 'Entscheidungsvorlage'); [['Bestanden', 'Alle Kriterien erfüllt, nächste Phase startet.', '107C10'], ['Mit Auflage bestehen', 'Start der nächsten Phase, offene Punkte mit Frist und Verantwortlichem.', 'B07B00'], ['Nicht bestanden', 'Nacharbeit, neuer Gate-Termin.', 'C50F1F']].forEach(([h, d0, c0], i) => { sl.addShape(K.p.ShapeType.rect, { x: 0.5 + i * 4.2, y: 1.3, w: 4, h: 2.2, fill: { color: 'F5F5F5' }, line: { color: c0, width: 2 } }); sl.addText([{ text: h + '\n', options: { bold: true, fontSize: 18, color: c0 } }, { text: d0, options: { fontSize: 13, color: '242424' } }], { x: 0.7 + i * 4.2, y: 1.4, w: 3.6, h: 2.0, fontFace: K.fB, valign: 'top' }); });
    sl.addText([{ text: 'Empfehlung der Projektleitung: ', options: { bold: true } }, { text: rec }], { x: 0.5, y: 3.9, w: 12.3, h: 0.5, fontSize: 18, fontFace: K.fB, color: K.DK });
    K.bul(sl, (late.length ? [late.length + ' überfällige Aufgaben bis zum Gate'] : []).concat(opLate.length ? [opLate.length + ' überfällige offene Punkte'] : []).concat(hiR.map(r => 'Hohes Risiko: ' + r.t)).concat(!late.length && !opLate.length && !hiR.length ? ['Keine Auffälligkeiten'] : []), { x: 0.5, y: 4.5, w: 12.3, h: 2.2 });
    sl = K.S(); K.head(sl, 'Gate-Protokoll'); sl.addTable([[{ text: 'Datum', options: { bold: true } }, ''], [{ text: 'Teilnehmer', options: { bold: true } }, ''], [{ text: 'Entscheidung', options: { bold: true } }, '☐ Bestanden   ☐ Mit Auflage   ☐ Nicht bestanden'], [{ text: 'Auflagen (was, wer, bis wann)', options: { bold: true } }, ''], [{ text: 'Unterschrift', options: { bold: true } }, '']], K.tOpt({ colW: [3.5, 8.8], rowH: [0.6, 0.8, 0.6, 2.0, 0.8] }));
    sl.addText('Nach dem Termin: Entscheidung im Cockpit am Gate eintragen (Bestanden / Mit Auflage / Nicht bestanden). Auflagen werden offene Punkte.', { x: 0.5, y: 6.3, w: 12.3, h: 0.4, fontSize: 11, color: '808080', fontFace: K.fB });
    const out = await K.p.write({ outputType: 'blob' }); this.dlBlob(out, (PCODE[name] || name).replace(/[^\wäöüÄÖÜß-]+/g, '_') + '_Gate_' + n.name.replace(/[^\wäöüÄÖÜß-]+/g, '_').slice(0, 30) + '.pptx'); return 6; }
  async pptBoard(t, accent) { await this.loadLibs(); const s = this.state, pks = Object.keys(PNAME_OF).concat((s.uprojs || []).map(u => u.key)).filter((k, i, a) => a.indexOf(k) === i && !(((s.psetBy || {})[k]) || {}).archived);
    const L = pks.map(pk => { const M = this.modX(pk, '', t, accent, () => true); return M.ppt ? M.ppt.deckData() : null; }).filter(Boolean), K = this.pptKit({ foot: 'Lenkungskreis Bereich Technik · Stand 13.11.2026' }), AC = { 'grün': '107C10', gelb: 'B07B00', rot: 'C50F1F' };
    K.title('Lenkungskreis Bereich Technik', L.length + ' Projekte · Stand 13.11.2026', 'Erzeugt aus dem Engineering Cockpit');
    let sl = K.S(); K.head(sl, 'Portfolio auf einen Blick'); sl.addTable(K.TB(L.map(d => [d.name, { text: d.amp, options: { bold: true, color: 'FFFFFF', fill: { color: AC[d.amp] || '808080' }, align: 'center' } }].concat(d.lights.map(l => ({ text: l.v, options: { color: l.c } }))).concat([String(d.openCount) + ' / ' + d.lateCount])), ['Projekt', 'Gesamt', 'Termine', 'Kosten', 'Risiken', 'Offen / überfällig']), K.tOpt({ colW: [3.2, 1.2, 2.2, 2.4, 2.1, 1.2], fontSize: 11 }));
    L.forEach(d => { const sl2 = K.S(); K.head(sl2, d.name); sl2.addShape(K.p.ShapeType.ellipse, { x: 10.6, y: 0.4, w: 0.45, h: 0.45, fill: { color: AC[d.amp] || '808080' } }); sl2.addText(d.sub, { x: 0.5, y: 0.95, w: 12, h: 0.35, fontSize: 12, color: '606060', fontFace: K.fB });
      d.lights.forEach((l, i) => { sl2.addShape(K.p.ShapeType.rect, { x: 0.5 + i * 4.2, y: 1.45, w: 0.1, h: 0.8, fill: { color: l.c } }); sl2.addText([{ text: l.l + '\n', options: { fontSize: 11, color: '606060' } }, { text: l.v, options: { fontSize: 14, bold: true } }], { x: 0.7 + i * 4.2, y: 1.45, w: 3.8, h: 0.8, fontFace: K.fB }); });
      [['Erreicht', d.erreicht], ['Nächste Schritte', d.naechst], ['Entscheidungsbedarf', d.entsch]].forEach(([h, tx], i) => { sl2.addText(h, { x: 0.5 + i * 4.2, y: 2.5, w: 4, h: 0.4, fontSize: 15, bold: true, color: K.DK, fontFace: K.fH }); K.bul(sl2, String(tx || '').split('\n').map(x => x.replace(/^[•\-]\s*/, '')).filter(Boolean).slice(0, 6), { x: 0.5 + i * 4.2, y: 2.95, w: 4, h: 3.8, fontSize: 12 }); }); });
    const all = Array.from(new Set([].concat(...pks.map(k => (PMEMBERS[k] || []).map(m => m[0]))))), cf = this.resConf(all, null, t, accent);
    sl = K.S(); K.head(sl, 'Ressourcenkonflikte im Bereich (KW 47–52)'); if (cf.rows.length) sl.addTable(K.TB(cf.rows.slice(0, 10).map(r => [r.name, r.kw, { text: r.load, options: { bold: true, color: String(r.col).replace('#', '') } }, r.parts.map(x => x.label).join(' · ')]), ['Person', 'Woche', 'Auslastung', 'Zusammensetzung']), K.tOpt({ colW: [2.4, 2.2, 1.4, 6.3], fontSize: 11 })); else K.bul(sl, ['Keine Konflikte in den nächsten 6 Wochen.'], { x: 0.5, y: 1.3, w: 12, h: 1 });
    sl = K.S(); K.head(sl, 'Entscheidungsbedarf für den Lenkungskreis'); K.bul(sl, [].concat(...L.map(d => String(d.entsch || '').split('\n').map(x => x.replace(/^[•\-]\s*/, '')).filter(x => x && x !== 'keiner').map(x => d.name + ': ' + x))).slice(0, 12), { x: 0.5, y: 1.2, w: 12.3, h: 5.5, fontSize: 15 });
    const out = await K.p.write({ outputType: 'blob' }); this.dlBlob(out, 'Lenkungskreis_Bereich_Technik_2026-11-13.pptx'); return L.length + 4; }
  depsOf() { if (!this._depDef) this._depDef = {}; const D0 = this._depDef;
    Object.keys(PTREE_OF).forEach(pk => { if (D0[pk]) return; const d = {}; const link = list => { const L = (list || []).slice().sort((a, b) => (a.start < b.start ? -1 : 1)); L.forEach((n, i) => { const pr = L.slice(0, i).filter(x => this.depNeed(x) <= n.start).sort((a, b) => (a.end < b.end ? 1 : -1))[0]; if (pr) d[n.id] = [pr.id]; link(n.children); }); }; link(PTREE_OF[pk]); D0[pk] = d; });
    const all = Object.assign({}, DEP_SEED); Object.keys(D0).forEach(pk => Object.assign(all, D0[pk])); return Object.assign(all, this.state.deps || {}); }
  autoDep(id) { const n = NODE[id]; if (!n) return ''; const sib = PARENT[id] ? (NODE[PARENT[id]].children || []) : (PTREE_OF[this.projPk(id)] || []), pr = sib.filter(x => x.id !== id && this.depNeed(x) <= n.start).sort((a, b) => (a.end < b.end ? 1 : -1))[0];
    if (!pr) return ''; this.setState({ deps: Object.assign({}, this.depsOf(), { [id]: [pr.id] }) }); return ' Beginnt nach „' + pr.name + '“ (Abhängigkeit automatisch gesetzt, im Detail mit ✕ lösbar).'; }
  projNodes(id) { let r = id; while (PARENT[r]) r = PARENT[r]; const pk = Object.keys(PTREE_OF).find(k => (PTREE_OF[k] || []).some(x => x.id === r)); const out = []; const w = l => (l || []).forEach(x => { out.push(x); w(x.children); }); w(PTREE_OF[pk]); return out; }
  depNeed(p) { return p.type === 'gate' ? p.end : this.isoAdd(p.end, 1); }
  dependsOn(a, b, deps, seen) { seen = seen || {}; if (seen[a]) return false; seen[a] = true; return (deps[a] || []).some(x => x === b || this.dependsOn(x, b, deps, seen)); }
  pushSucc(id, deps, seen) { deps = deps || this.depsOf(); seen = seen || {}; const p = NODE[id]; if (!p) return []; const moved = [];
    Object.keys(deps).forEach(sid => { if (!(deps[sid] || []).includes(id) || seen[sid]) return; const sN = NODE[sid]; if (!sN) return; const need = this.depNeed(p); if (sN.start >= need) return;
      const d = this.dayDiff(need, sN.start), oS = sN.end; seen[sid] = true; this.moveNodeBy(sN, d); this.logH('n:' + sid, 'Termin (Vorgänger „' + p.name + '“ verschoben)', fmt(D(oS)), fmt(D(sN.end))); const B = this.nodeBounds(sid); let w = '';
      if (B.hi && sN.end > B.hi) { this.fitInto(sN, NODE[PARENT[sid]]); w = ' – Konflikt: passt nicht mehr in „' + B.pn + '“, Phase verlängern oder Abhängigkeit prüfen'; }
      moved.push('„' + sN.name + '“ +' + d + (d === 1 ? ' Tag' : ' Tage') + w); this.pushSucc(sid, deps, seen).forEach(x => moved.push(x)); });
    return moved; }
  pushNote(id, deps) { const m = this.pushSucc(id, deps); return m.length ? ' Nachfolger mitverschoben: ' + m.join(', ') + '.' : ''; }
  critSet(nodes, deps) { const ids = new Set(nodes.map(n => n.id)), inDep = new Set(); Object.keys(deps).forEach(sid => { if (!ids.has(sid)) return; (deps[sid] || []).forEach(pid => { if (ids.has(pid)) { inDep.add(sid); inDep.add(pid); } }); });
    const crit = new Set(); if (!inDep.size) return crit; const cand = nodes.filter(n => inDep.has(n.id)), end = cand.reduce((a, n) => (n.end > a ? n.end : a), '0000'), st = cand.filter(n => n.end === end);
    while (st.length) { const n = st.pop(); if (crit.has(n.id)) continue; crit.add(n.id); (deps[n.id] || []).forEach(pid => { const p = NODE[pid]; if (p && ids.has(pid) && this.depNeed(p) >= n.start) st.push(p); }); }
    return crit; }
  depLabel(n, deps) { const pr = ((deps || this.depsOf())[n.id] || []).filter(id => NODE[id]).map(id => NODE[id].name); return { hasDep: pr.length > 0, depTxt: pr.length ? 'nach ' + pr.join(', ') : '' }; }
  nodeBounds(id) { const n = NODE[id], p = NODE[PARENT[id]], k = (n && n.children) || [], prs = (this.depsOf()[id] || []).filter(x => NODE[x]), nd = prs.map(x => [this.depNeed(NODE[x]), NODE[x].name]).sort((a, b) => (a[0] < b[0] ? 1 : -1))[0] || [null, ''];
    return { need: nd[0], needN: nd[1], lo: p ? p.start : null, hi: p ? p.end : null, pn: p ? p.name : '', cs: k.length ? k.reduce((a, c) => (c.start < a ? c.start : a), '9999') : null, ce: k.length ? k.reduce((a, c) => (c.end > a ? c.end : a), '0000') : null }; }
  dayDiff(a, b) { return Math.round((D(a) - D(b)) / 86400000); }
  isoAdd(iso, d) { const x = D(iso); x.setDate(x.getDate() + d); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); }
  moveNodeBy(m, d) { m.start = this.isoAdd(m.start, d); m.end = this.isoAdd(m.end, d); if (VNODE[m.id]) { VNODE[m.id].start = m.start; VNODE[m.id].end = m.end; } (m.children || []).forEach(c => this.moveNodeBy(c, d)); }
  fitInto(n, p) { if (!n || !p) return ''; let d = 0; if (n.start < p.start) d = this.dayDiff(p.start, n.start); else if (n.end > p.end) d = -this.dayDiff(n.end, p.end);
    if (d) this.moveNodeBy(n, d); let c = false; if (n.start < p.start) { n.start = p.start; c = true; } if (n.end > p.end) { n.end = p.end; c = true; }
    if (VNODE[n.id]) { VNODE[n.id].start = n.start; VNODE[n.id].end = n.end; } if (c) (n.children || []).forEach(k => this.fitInto(k, n));
    return d || c ? ' In den Zeitraum von „' + p.name + '“ (' + fmt(D(p.start)) + ' – ' + fmt(D(p.end)) + ') gelegt.' : ''; }
  shiftNode(id, mode, days) {
    const n = NODE[id]; if (!n || !days) return; const o0 = [n.start, n.end]; const point = n.type === 'gate'; if (point && mode !== 'move') return;
    const B = this.nodeBounds(id), add = (a, d) => this.isoAdd(a, d), lim = x => ' Grenze: „' + B.pn + '“ ' + x + '.'; let note = '', d = days;
    if (mode === 'move') {
      if (B.lo && add(n.start, d) < B.lo) { d = this.dayDiff(B.lo, n.start); note = lim('beginnt am ' + fmt(D(B.lo))); }
      if (B.hi && add(n.end, d) > B.hi) { d = this.dayDiff(B.hi, n.end); note = lim('endet am ' + fmt(D(B.hi))); }
      if (B.lo && add(n.start, d) < B.lo) d = this.dayDiff(B.lo, n.start);
      if (B.need && add(n.start, d) < B.need) { d = this.dayDiff(B.need, n.start); note = ' Früher geht nicht: „' + n.name + '“ beginnt nach „' + B.needN + '“ (Abhängigkeit, im Detail mit ✕ lösbar).'; }
      if (d) this.moveNodeBy(n, d);
    } else if (mode === 'end') { let ne = add(n.end, d); if (ne < n.start) ne = n.start; if (B.hi && ne > B.hi) { ne = B.hi; note = lim('endet am ' + fmt(D(B.hi))); } if (B.ce && ne < B.ce) { ne = B.ce; note = ' Kürzer geht nicht: Darin liegt etwas bis ' + fmt(D(B.ce)) + '.'; } d = this.dayDiff(ne, n.end); n.end = ne; if (VNODE[id]) VNODE[id].end = n.end; }
    else { let ns = add(n.start, d); if (ns > n.end) ns = n.end; if (B.lo && ns < B.lo) { ns = B.lo; note = lim('beginnt am ' + fmt(D(B.lo))); } if (B.need && ns < B.need) { ns = B.need; note = ' Früher geht nicht: beginnt nach „' + B.needN + '“ (Abhängigkeit, im Detail mit ✕ lösbar).'; } if (B.cs && ns > B.cs) { ns = B.cs; note = ' Kürzer geht nicht: Darin beginnt etwas am ' + fmt(D(B.cs)) + '.'; } d = this.dayDiff(ns, n.start); n.start = ns; if (VNODE[id]) VNODE[id].start = n.start; }
    if (!d) { const m0 = '„' + n.name + '“ bleibt, wo es ist.' + note; return this.setState({ mvMsg: m0, pnMsg: m0 }); }
    this.logH('n:' + id, n.type === 'gate' ? 'Termin' : (mode === 'start' ? 'Start' : 'Ende'), fmt(D(mode === 'start' ? o0[0] : o0[1])), fmt(D(mode === 'start' ? n.start : n.end)));
    days = d;
    const txt = mode === 'end' ? (days > 0 ? 'Ende ' + days + ' Tage später, länger' : 'Ende ' + (-days) + ' Tage früher, kürzer') : mode === 'start' ? (days > 0 ? 'Start ' + days + ' Tage später, kürzer' : 'Start ' + (-days) + ' Tage früher, länger') : (days > 0 ? days + ' Tage später' : (-days) + ' Tage früher');
    const pushT = this.pushNote(id) + (n.children || []).map(c => this.pushNote(c.id)).join('');
    const msgS = '„' + n.name + '“ liegt jetzt ' + (point ? 'auf dem ' + fmt(D(n.end)) : 'von ' + fmt(D(n.start)) + ' bis ' + fmt(D(n.end))) + ' (' + txt + ').' + note + pushT + ' Die Baseline bleibt zum Vergleich erhalten.';
    this.setState({ rev: (this.state.rev || 0) + 1, mvMsg: msgS, pnMsg: msgS });
  }
  moveToDay(id, iso, label) {
    if (typeof id !== 'string' || id.indexOf('wk:') !== 0) return;
    const [, kind, ref] = id.match(/^wk:(\w):(.*)$/) || [];
    if (kind === 't') { const x = TASK[ref]; if (!x || x.due === iso) return; x.due = iso; return this.setState({ rev: (this.state.rev || 0) + 1, weekMsg: '„' + x.title + '“ ist jetzt am ' + label + ' fällig.' }); }
    if (kind === 'm') return this.setState({ meetDay: Object.assign({}, this.state.meetDay, { [ref]: iso }), weekMsg: '„' + ref + '“ auf ' + label + ' verschoben. Die Teilnehmer bekommen einen neuen Terminvorschlag.' });
    if (kind === 'n') { const n = NODE[ref]; if (!n) return; const days = Math.round((D(iso) - D(n.end)) / 86400000); if (days) this.shiftNode(ref, 'move', days); this.setState({ weekMsg: '„' + n.name + '“ auf ' + label + ' verschoben. Im Gantt und für alle Beteiligten sofort sichtbar.' }); }
  }
  setNodeDate(id, which, iso) {
    const n = NODE[id]; if (!n || !/^\d{4}-\d\d-\d\d$/.test(iso || '')) return; const B = this.nodeBounds(id); let note = '', v = iso;
    if (B.lo && v < B.lo) { v = B.lo; note = ' Das Datum lag vor „' + B.pn + '“, darum ' + fmt(D(v)) + '.'; }
    if (B.hi && v > B.hi) { v = B.hi; note = ' Das Datum lag nach „' + B.pn + '“, darum ' + fmt(D(v)) + '.'; }
    if (B.need && v < B.need && (n.type === 'gate' || which === 'start')) { v = B.need; note = ' Früher geht nicht: „' + n.name + '“ beginnt nach „' + B.needN + '“ (Abhängigkeit, im Detail mit ✕ lösbar).'; }
    if (n.type === 'gate') { n.start = v; n.end = v; }
    else if (which === 'start') { if (B.cs && v > B.cs) { v = B.cs; note = ' Später geht nicht: Darin beginnt etwas am ' + fmt(D(B.cs)) + '.'; } n.start = v; if (n.end < v) n.end = v; }
    else { if (B.ce && v < B.ce) { v = B.ce; note = ' Früher geht nicht: Darin endet etwas am ' + fmt(D(B.ce)) + '.'; } n.end = v; if (n.start > v) n.start = v; }
    if (VNODE[id]) { VNODE[id].start = n.start; VNODE[id].end = n.end; }
    this.logH('n:' + id, n.type === 'gate' ? 'Termin' : (which === 'start' ? 'Start' : 'Ende'), '', fmt(D(which === 'start' ? n.start : n.end)));
    const m0 = '„' + n.name + '“ ' + (n.type === 'gate' ? 'ist jetzt am ' + fmt(D(n.end)) + D(n.end).getFullYear() : 'liegt jetzt von ' + fmt(D(n.start)) + ' bis ' + fmt(D(n.end)) + D(n.end).getFullYear()) + ' (von Hand eingetragen).' + note + this.pushNote(id) + ' Die Baseline bleibt zum Vergleich erhalten.';
    this.setState({ rev: (this.state.rev || 0) + 1, mvMsg: m0, pnMsg: m0 });
  }
  tabSeen(pk, role, k) { if (k === 'uebersicht' || k === 'aufgaben' || k === 'team' || role === 'Owner') return true; const rv = ((this.state.pTabRole || {})[pk] || {})[role]; if (rv && rv[k] !== undefined) return rv[k];
    return role === 'Bearbeiter' ? true : ({ Mitwirkender: ['dokumente'], Leser: [], Gast: [] }[role] || []).includes(k); }
  risksOf(pk) { const s = this.state; if ((s.riskBy || {})[pk]) return s.riskBy[pk]; const U = (s.uprojs || []).find(u => u.key === pk);
    return U ? (U.risks || []).map((r, i) => ({ id: 'r' + i, t: r.t, w: r.w, a: r.a, m: r.m || '', o: r.o || 'Du', st: 'offen' })) : (RISK_SEED[pk] || []).map((r, i) => ({ id: 'r' + i, t: r[0], w: r[1], a: r[2], m: r[3], o: r[4], st: 'offen' })); }
  kstOf(pk) { const s = this.state, ps = (s.psetBy || {})[pk] || {}, U = (s.uprojs || []).find(u => u.key === pk); return ps.kst !== undefined ? ps.kst : ((U && U.kst) || KST0[pk] || ''); }
  iaOf(pk) { const s = this.state, ps = (s.psetBy || {})[pk] || {}, U = (s.uprojs || []).find(u => u.key === pk); return ps.ia !== undefined ? ps.ia : ((U && U.ia) || IA0[pk] || ''); }
  resConf(people, focus, t, accent) { const s = this.state, RED = '#C50F1F', AMB = '#B07B00', est = x => EST[x.id] || x.est || 1, hF = v => (Math.round(v * 10) / 10).toLocaleString('de-DE') + ' h';
    const W = [0, 1, 2, 3, 4, 5].map(i => { const a = this.isoAdd('2026-11-16', i * 7); return { a, e: this.isoAdd(a, 6), kw: 47 + i }; });
    const AB = [], abBy = Object.assign({}, ABW_SEED, s.abwBy || {}); Object.keys(abBy).forEach(k => (abBy[k] || []).forEach(x => AB.push(x)));
    const ord = (s.porder || []).concat(Object.keys(PNAME_OF)), rank = pk => { const i = ord.indexOf(pk); return i < 0 ? 99 : i; };
    const PC = ['#0F6CBD', '#0E7A6E', '#5B2D90', '#A33F06', '#8A3707', '#107C10'], pcol = pk => PC[Math.max(0, Object.keys(PNAME_OF).indexOf(pk)) % PC.length];
    const weekOf = (n, w) => { const tw = TASKS.filter(x => !this.isDone(x) && this.ownerOf(x) === n && x.due && x.due >= w.a && x.due <= w.e); let off = 0;
      for (let d = 0; d < 5; d++) { const day = this.isoAdd(w.a, d); if (AB.some(x => x.n === n && day >= x.von && day <= x.bis)) off++; }
      const cap = 32 * (5 - off) / 5, base = Math.round(32 * Math.max(0, (LOAD47[n] || 60) - 40) / 100 * (5 - off) / 5 * 10) / 10, byP = {};
      tw.forEach(x => { const k = PK_OF[x.proj] || 'ohne'; byP[k] = (byP[k] || 0) + est(x); }); return { tw, off, cap, base, byP, hrs: base + Object.values(byP).reduce((a, v) => a + v, 0) }; };
    const rows = [];
    people.filter(n => n && n !== 'Kunde').forEach(n => W.forEach(w => { const r = weekOf(n, w); if (!r.tw.length || (r.cap > 0 && r.hrs <= r.cap)) return;
      const pks = Object.keys(r.byP), cand = r.tw.filter(x => !focus || PK_OF[x.proj] === focus).sort((a, b) => (rank(PK_OF[b.proj]) - rank(PK_OF[a.proj])) || (est(b) - est(a))), over = r.hrs - r.cap, x = cand.find(c => est(c) >= over) || cand.slice().sort((a, b) => est(b) - est(a))[0], partly = !!x && r.cap > 0 && est(x) < over;
      let give = null; if (x) { const pk = PK_OF[x.proj]; (PMEMBERS[pk] || []).map(m => m[0]).filter(m => m !== n && !/Kunde/.test(m)).forEach(m => { const q = weekOf(m, w), l = q.cap ? (q.hrs + est(x)) / q.cap : 9; if (l <= 0.9 && (!give || l < give.l)) give = { m, l }; }); }
      const pct = r.cap ? Math.round(r.hrs / r.cap * 100) : 0;
      rows.push({ wk: w.kw, name: n, kw: 'KW ' + w.kw + ' (' + w.a.slice(8, 10) + '.' + w.a.slice(5, 7) + '.)', why: r.off ? ' · ' + r.off + (r.off === 1 ? ' Tag' : ' Tage') + ' abwesend' : '', load: r.cap ? pct + ' %' : 'abwesend', col: pct > 120 || !r.cap ? RED : AMB,
        parts: pks.map(k => ({ label: (k === 'ohne' ? 'ohne Projekt' : (PCODE[this.pnm(k)] || this.pnm(k))) + ' ' + hF(r.byP[k]), bg: k === focus ? accent : pcol(k) })).concat(r.base ? [{ label: 'Linie/Grundlast ' + hF(r.base), bg: '#8A8886' }] : []),
        tip: (r.cap ? hF(r.hrs) + ' verplant bei ' + hF(r.cap) + ' planbarer Zeit.' : 'Abwesend, aber Aufgaben fällig.') + (x ? ' Vorschlag: „' + x.title + '“ (' + this.pnm(PK_OF[x.proj]) + ', Priorität ' + (rank(PK_OF[x.proj]) + 1) + ', ' + hF(est(x)) + ') ' + (give ? 'an ' + give.m + ' geben oder ' : '') + 'eine Woche später.' + (partly ? ' Das allein reicht nicht ganz: Es fehlen danach noch ' + hF(over - est(x)) + '.' : '') : ' Der Konflikt entsteht in anderen Projekten; dort ausgleichen oder mit der Bereichsleitung priorisieren.'),
        canMv: !!x, mvLabel: x ? '„' + (x.title.length > 26 ? x.title.slice(0, 24) + '…' : x.title) + '“ +1 Woche' : '', canGive: !!(x && give), giveLabel: give ? 'an ' + give.m + ' geben' : '',
        mv: () => { if (!x) return; const o = x.due; x.due = this.isoAdd(x.due, 7); this.logH('t:' + x.id, 'Fällig', fmt(D(o)), fmt(D(x.due))); this.setState({ rev: (this.state.rev || 0) + 1, rcMsg: '„' + x.title + '“ ist jetzt am ' + fmt(D(x.due)) + ' fällig. ' + n + ' wird in KW ' + w.kw + ' entlastet.' }); },
        give: () => { if (!x || !give) return; this.logH('t:' + x.id, 'Verantwortlich', n, give.m); this.setState({ ownerOv: Object.assign({}, this.state.ownerOv, { [x.id]: give.m }), rev: (this.state.rev || 0) + 1, rcMsg: '„' + x.title + '“ liegt jetzt bei ' + give.m + '. ' + give.m + ' bekommt eine Benachrichtigung.' }); } }); }));
    rows.sort((a, b) => a.wk - b.wk);
    return { rows, empty: !rows.length, count: rows.length ? rows.length + (rows.length === 1 ? ' Konflikt' : ' Konflikte') : 'keine Konflikte', msg: s.rcMsg || '', hasMsg: !!s.rcMsg,
      hint: 'Je Person und Woche: Grundlast aus der Linie, Aufgaben aller Projekte nach Fälligkeit und Schätzung, Abwesenheiten. Planbar sind 32 h pro Woche (80 % der Sollzeit). Vorschläge betreffen zuerst das Projekt mit der niedrigsten Priorität (Berichte › Portfolio).' }; }
  dlCsv(file, head, rows) { try { const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"', csv = '﻿' + [head].concat(rows).map(r => r.map(q).join(';')).join('\r\n');
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = file; document.body.appendChild(a); a.click(); a.remove(); return true; } catch (e) { return false; } }
  loadLibs() { if (this._libP) return this._libP; const add = src => new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = src; sc.onload = res; sc.onerror = () => rej(new Error('Bibliothek fehlt: ' + src)); document.head.appendChild(sc); });
    this._libP = (window.JSZip ? Promise.resolve() : add('vendor/jszip.min.js')).then(() => (window.PptxGenJS ? null : add('vendor/pptxgen.bundle.js'))); this._libP.catch(() => { this._libP = null; }); return this._libP; }
  dlBlob(blob, file) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file; document.body.appendChild(a); a.click(); a.remove(); window.__ecLastFile = { blob, file }; }
  async pptLoad(buf, name) { await this.loadLibs(); const zip = await window.JSZip.loadAsync(buf), files = Object.keys(zip.files); const colors = {}; let fonts = {}, logo = null;
    const th = files.find(f => /^ppt\/theme\/theme\d+\.xml$/.test(f));
    if (th) { const x = await zip.file(th).async('string'); ['accent1', 'accent2', 'accent3', 'dk1', 'dk2', 'lt1'].forEach(k => { const m = new RegExp('<a:' + k + '>[\\s\\S]*?(?:srgbClr val="([0-9A-Fa-f]{6})"|lastClr="([0-9A-Fa-f]{6})")').exec(x); if (m) colors[k] = (m[1] || m[2]).toUpperCase(); });
      const mj = /<a:majorFont>[\s\S]*?<a:latin typeface="([^"]*)"/.exec(x), mn = /<a:minorFont>[\s\S]*?<a:latin typeface="([^"]*)"/.exec(x); fonts = { major: mj ? mj[1] : '', minor: mn ? mn[1] : '' }; }
    for (const rf of files.filter(f => /^ppt\/(slideMasters|slideLayouts)\/_rels\/[^/]+\.rels$/.test(f)).sort()) { if (logo) break; const r = await zip.file(rf).async('string'), m = /Target="\.\.\/media\/([^"]+\.(png|jpe?g))"/i.exec(r); if (m && zip.file('ppt/media/' + m[1])) { const b = await zip.file('ppt/media/' + m[1]).async('base64'); logo = 'data:image/' + (/png/i.test(m[2]) ? 'png' : 'jpeg') + ';base64,' + b; } }
    const slides = files.filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f)), tokens = new Set();
    for (const f of slides) { const x = await zip.file(f).async('string'), txt = x.replace(/<\/a:t>[\s\S]*?<a:t(?: [^>]*)?>/g, '').replace(/<[^>]+>/g, ' '); (txt.match(/\{\{\s*[^{}]+?\s*\}\}/g) || []).forEach(t0 => tokens.add(t0.replace(/[{}]/g, '').trim())); }
    this._pptTpl = { buf, name, colors, fonts, logo };
    this.setState({ pptTpl: { name, colors, fonts, hasLogo: !!logo, tokens: Array.from(tokens), slides: slides.length }, pptMsg: 'Vorlage „' + name + '“ geladen: ' + slides.length + ' Folien, ' + Object.keys(colors).length + ' Farben, Schrift ' + (fonts.major || 'Standard') + (logo ? ', Logo' : ', kein Logo gefunden') + (tokens.size ? ', ' + tokens.size + ' Platzhalter.' : ', keine Platzhalter.') }); }
  async pptFill(vals, file) { const T = this._pptTpl; if (!T) throw new Error('Keine Vorlage'); await this.loadLibs(); const zip = await window.JSZip.loadAsync(T.buf);
    const norm = k => String(k).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]/g, ''), V = {}; Object.keys(vals).forEach(k => { V[norm(k)] = vals[k]; });
    const esc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'), setT = (p, text) => { let i = 0; return p.replace(/(<a:t(?: [^>]*)?>)([\s\S]*?)(<\/a:t>)/g, (m, a, b, c) => a + (i++ === 0 ? text : '') + c); };
    let n = 0; const miss = new Set();
    for (const f of Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f))) { let x = await zip.file(f).async('string');
      x = x.replace(/<a:p>[\s\S]*?<\/a:p>|<a:p [^>]*>[\s\S]*?<\/a:p>/g, p => { const ts = Array.from(p.matchAll(/<a:t(?: [^>]*)?>([\s\S]*?)<\/a:t>/g)); if (!ts.length) return p; const full = ts.map(m => m[1]).join(''); if (full.indexOf('{{') < 0) return p;
        const only = /^\s*\{\{\s*([^{}]+?)\s*\}\}\s*$/.exec(full);
        if (only) { const v = V[norm(only[1])]; if (v === undefined) { miss.add(only[1]); return p; } n++; return String(v).split('\n').map(line => setT(p, esc(line))).join(''); }
        return setT(p, full.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (m0, k) => { const v = V[norm(k)]; if (v === undefined) { miss.add(k); return m0; } n++; return esc(String(v).replace(/\n/g, ' · ')); })); });
      zip.file(f, x); }
    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }); this.dlBlob(blob, file); return { n, miss: Array.from(miss) }; }
  async pptMake(D0, file, tokensOnly) { await this.loadLibs(); const T = this._pptTpl || {}, col = T.colors || {}, A1 = col.accent1 || '0F6CBD', DK = col.dk2 || col.dk1 || '242424', fH = (T.fonts || {}).major || 'Segoe UI', fB = (T.fonts || {}).minor || 'Segoe UI';
    const p = new window.PptxGenJS(); p.layout = 'LAYOUT_WIDE'; p.title = D0.name; p.author = 'Engineering Cockpit';
    p.defineSlideMaster({ title: 'EC', background: { color: 'FFFFFF' }, objects: [{ rect: { x: 0, y: 0, w: 13.33, h: 0.1, fill: { color: A1 } } }].concat(T.logo ? [{ image: { data: T.logo, x: 11.3, y: 0.22, w: 1.7, h: 0.6, sizing: { type: 'contain', w: 1.7, h: 0.6 } } }] : []).concat([{ text: { text: D0.name + ' · Stand ' + D0.date, options: { x: 0.5, y: 7.0, w: 9, h: 0.3, fontSize: 10, color: '808080', fontFace: fB } } }]), slideNumber: { x: 12.4, y: 7.0, fontSize: 10, color: '808080', fontFace: fB } });
    const S = () => p.addSlide({ masterName: 'EC' }), head = (sl, t0) => sl.addText(t0, { x: 0.5, y: 0.3, w: 10.6, h: 0.7, fontSize: 26, bold: true, color: DK, fontFace: fH });
    const TB = (rows, hdr) => [hdr.map(h => ({ text: h, options: { bold: true, color: 'FFFFFF', fill: { color: A1 } } }))].concat(rows), tOpt = o => Object.assign({ x: 0.5, y: 1.2, w: 12.3, fontSize: 12, fontFace: fB, color: '242424', border: { type: 'solid', pt: 0.5, color: 'D0D0D0' }, valign: 'middle' }, o || {});
    const bullets = (sl, lines, o) => sl.addText((lines.length ? lines : ['–']).map(l => ({ text: l, options: { bullet: true, breakLine: true } })), Object.assign({ fontSize: 14, fontFace: fB, color: '242424', valign: 'top' }, o));
    if (tokensOnly) { let sl = S(); sl.addText('{{Projekt}}', { x: 0.8, y: 2.3, w: 11.5, h: 1.1, fontSize: 40, bold: true, color: A1, fontFace: fH }); sl.addText('{{Modell}} · Projektleitung {{Projektleitung}} · {{Zeitraum}}', { x: 0.8, y: 3.5, w: 11.5, h: 0.6, fontSize: 18, color: '505050', fontFace: fB }); sl.addText('Stand {{Datum}}', { x: 0.8, y: 4.2, w: 11.5, h: 0.5, fontSize: 14, color: '808080', fontFace: fB });
      sl = S(); head(sl, 'Status: {{Ampel}}'); sl.addText('Termine: {{Termine}}\nKosten: {{Kosten}}\nRisiken: {{Risiken}}', { x: 0.5, y: 1.2, w: 12, h: 1.4, fontSize: 16, fontFace: fB }); sl.addText('Erreicht', { x: 0.5, y: 2.8, w: 4, h: 0.4, bold: true, fontSize: 16, fontFace: fH }); sl.addText('{{Erreicht}}', { x: 0.5, y: 3.2, w: 4, h: 3.4, fontSize: 13, valign: 'top', fontFace: fB });
      sl.addText('Nächste Schritte', { x: 4.7, y: 2.8, w: 4, h: 0.4, bold: true, fontSize: 16, fontFace: fH }); sl.addText('{{NaechsteSchritte}}', { x: 4.7, y: 3.2, w: 4, h: 3.4, fontSize: 13, valign: 'top', fontFace: fB }); sl.addText('Entscheidungsbedarf', { x: 8.9, y: 2.8, w: 4, h: 0.4, bold: true, fontSize: 16, fontFace: fH }); sl.addText('{{Entscheidungsbedarf}}', { x: 8.9, y: 3.2, w: 4, h: 3.4, fontSize: 13, valign: 'top', fontFace: fB });
      [['Meilensteine', '{{Meilensteine}}'], ['Offene Aufgaben', '{{OffeneAufgaben}}'], ['Team und Zuständigkeiten', '{{Team}}'], ['Kosten', 'Budget {{Budget}} · Ist {{Ist}} · Nachträge {{Nachtraege}}'], ['Risiken', '{{Risikoliste}}'], ['Offene Punkte', '{{OffenePunkte}}'], ['Entscheidungen', '{{Entscheidungen}}']].forEach(([h, tk]) => { const s2 = S(); head(s2, h); s2.addText(tk, { x: 0.5, y: 1.2, w: 12.3, h: 5.5, fontSize: 14, valign: 'top', fontFace: fB }); });
      const out = await p.write({ outputType: 'blob' }); this.dlBlob(out, file); return 9; }
    const sel = D0.sel; let n = 0;
    if (sel.titel) { const sl = S(); n++; if (sel.chg && D0.chg && D0.chg.length) { /* folgt nach dem Titel */ } sl.addText(D0.name, { x: 0.8, y: 2.3, w: 11.5, h: 1.1, fontSize: 40, bold: true, color: A1, fontFace: fH }); sl.addText(D0.sub, { x: 0.8, y: 3.5, w: 11.5, h: 0.6, fontSize: 18, color: '505050', fontFace: fB }); sl.addText('Projektstatus · Stand ' + D0.date, { x: 0.8, y: 4.2, w: 11.5, h: 0.5, fontSize: 14, color: '808080', fontFace: fB }); }
    if (sel.chg && D0.chg && D0.chg.length) { const sl = S(); n++; head(sl, 'Was hat sich seit letzter Woche geändert?'); bullets(sl, D0.chg, { x: 0.5, y: 1.2, w: 12.3, h: 5.5, fontSize: 15 }); }
    if (sel.status) { const sl = S(); n++; head(sl, 'Status: ' + D0.amp); D0.lights.forEach((l, i) => { sl.addShape(p.ShapeType.rect, { x: 0.5 + i * 4.2, y: 1.2, w: 4, h: 1.1, fill: { color: 'F5F5F5' } }); sl.addShape(p.ShapeType.rect, { x: 0.5 + i * 4.2, y: 1.2, w: 0.12, h: 1.1, fill: { color: l.c } }); sl.addText([{ text: l.l + '\n', options: { fontSize: 12, color: '606060' } }, { text: l.v, options: { fontSize: 16, bold: true, color: '242424' } }], { x: 0.75 + i * 4.2, y: 1.25, w: 3.7, h: 1.0, fontFace: fB }); });
      [['Erreicht', D0.erreicht], ['Nächste Schritte', D0.naechst], ['Entscheidungsbedarf', D0.entsch]].forEach(([h, txt0], i) => { sl.addText(h, { x: 0.5 + i * 4.2, y: 2.6, w: 4, h: 0.4, fontSize: 16, bold: true, color: DK, fontFace: fH }); bullets(sl, String(txt0 || '').split('\n').map(x => x.replace(/^[•\-]\s*/, '')).filter(Boolean), { x: 0.5 + i * 4.2, y: 3.05, w: 4, h: 3.7 }); }); }
    if (sel.gantt && D0.nodes.length) { const sl = S(); n++; head(sl, 'Termine' + (D0.model ? ' (' + D0.model + ')' : '')); const lo = D0.nodes.reduce((a, x) => (x.a < a ? x.a : a), '9999'), hi = D0.nodes.reduce((a, x) => (x.b > a ? x.b : a), '0000'), span = Math.max(1, this.dayDiff(hi, lo) + 1), X0 = 4.3, W = 8.5, xs = d => X0 + this.dayDiff(d, lo) / span * W;
      let m = lo.slice(0, 8) + '01'; while (m <= hi) { const x = Math.max(X0, xs(m)); sl.addShape(p.ShapeType.line, { x, y: 1.15, w: 0, h: 5.5, line: { color: 'E0E0E0', width: 0.75 } }); sl.addText(['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][+m.slice(5, 7) - 1] + ' ' + m.slice(2, 4), { x: x + 0.02, y: 0.95, w: 0.9, h: 0.25, fontSize: 9, color: '808080', fontFace: fB }); m = this.isoAdd(m, 32).slice(0, 8) + '01'; }
      if (D0.today >= lo && D0.today <= hi) sl.addShape(p.ShapeType.line, { x: xs(D0.today), y: 1.15, w: 0, h: 5.5, line: { color: 'C50F1F', width: 1.25, dashType: 'dash' } });
      D0.nodes.slice(0, 16).forEach((x, i) => { const y = 1.3 + i * 0.33, c = x.st === 'erledigt' ? '107C10' : (x.st === 'ueberfaellig' ? 'C50F1F' : (x.phase ? A1 : '5B8FD0'));
        sl.addText(x.name, { x: 0.5 + x.lvl * 0.2, y, w: 3.7 - x.lvl * 0.2, h: 0.3, fontSize: 10.5, bold: !!x.phase, fontFace: fB, color: '242424' });
        if (x.pt) sl.addShape(x.gate ? p.ShapeType.rect : p.ShapeType.diamond, { x: xs(x.b) - 0.1, y: y + 0.05, w: 0.2, h: 0.2, fill: { color: c } }); else sl.addShape(p.ShapeType.roundRect, { x: xs(x.a), y: y + (x.phase ? 0.05 : 0.08), w: Math.max(0.06, xs(this.isoAdd(x.b, 1)) - xs(x.a)), h: x.phase ? 0.2 : 0.14, fill: { color: c }, rectRadius: 0.03 }); });
      sl.addText('◆ Meilenstein  ■ Quality Gate  · rot = überfällig, grün = erledigt, gestrichelt = heute', { x: 0.5, y: 6.7, w: 12, h: 0.25, fontSize: 9, color: '808080', fontFace: fB }); }
    if (sel.ms && D0.ms.length) { const sl = S(); n++; head(sl, 'Meilensteine und Quality Gates'); sl.addTable(TB(D0.ms.slice(0, 14).map(r => [r.name, r.date, { text: r.st, options: { color: r.col } }]), ['Meilenstein / Gate', 'Termin', 'Status']), tOpt({ colW: [8.3, 2, 2] })); }
    if (sel.tasks) { const sl = S(); n++; head(sl, 'Offene Aufgaben (' + D0.openCount + ', davon ' + D0.lateCount + ' überfällig)'); if (D0.tasks.length) sl.addTable(TB(D0.tasks.slice(0, 14).map(r => [r.title, r.who, { text: r.due, options: { color: r.late ? 'C50F1F' : '242424', bold: r.late } }]), ['Aufgabe', 'Verantwortlich', 'Fällig']), tOpt({ colW: [8.3, 2.5, 1.5] })); else bullets(sl, ['Keine offenen Aufgaben.'], { x: 0.5, y: 1.2, w: 12, h: 1 }); }
    if (sel.team && D0.team.length) { const sl = S(); n++; head(sl, 'Team und Zuständigkeiten'); sl.addTable(TB(D0.team.map(r => [r.name, r.role, r.pct, String(r.open)]), ['Person', 'Rolle', 'Projektanteil', 'Offene Aufgaben']), tOpt({ colW: [4.3, 3, 2.5, 2.5] })); }
    if (sel.kosten && D0.budget) { const sl = S(); n++; head(sl, 'Kosten'); sl.addChart(p.ChartType.bar, [{ name: 'Euro', labels: ['Budget', 'Ist', 'Nachträge (genehmigt)'], values: [D0.budget, D0.cost, D0.nach] }], { x: 0.5, y: 1.2, w: 7.5, h: 5.3, barDir: 'col', chartColors: [A1], showValue: true, dataLabelFormatCode: '#,##0', valAxisLabelFormatCode: '#,##0', catAxisLabelFontFace: fB, valAxisLabelFontFace: fB, catAxisLabelFontSize: 12 });
      bullets(sl, ['Budget: ' + D0.fE(D0.budget), 'Ist: ' + D0.fE(D0.cost) + ' (' + Math.round(D0.cost / D0.budget * 100) + ' %)', 'Genehmigte Nachträge: ' + D0.fE(D0.nach), 'Kostenstelle ' + D0.kst + (D0.ia ? ' · Innenauftrag ' + D0.ia : '')], { x: 8.4, y: 1.4, w: 4.4, h: 4 }); }
    if (sel.risk && D0.risks.length) { const sl = S(); n++; head(sl, 'Risiken'); sl.addTable(TB(D0.risks.slice(0, 10).map(r => [{ text: String(r.sc), options: { bold: true, color: 'FFFFFF', fill: { color: r.c }, align: 'center' } }, r.t, r.m, r.o]), ['W×A', 'Risiko', 'Maßnahme', 'Verantwortlich']), tOpt({ colW: [0.9, 4.4, 5, 2] })); }
    if (sel.opl && (D0.opl.length || D0.dec.length)) { const sl = S(); n++; head(sl, 'Offene Punkte und Entscheidungen'); if (D0.opl.length) sl.addTable(TB(D0.opl.slice(0, 7).map(r => [r.id, r.t, r.who, { text: r.due, options: { color: r.late ? 'C50F1F' : '242424' } }]), ['ID', 'Offener Punkt', 'Wer', 'Bis']), tOpt({ y: 1.2, colW: [0.9, 7.6, 2.3, 1.5] }));
      if (D0.dec.length) sl.addTable(TB(D0.dec.slice(-5).map(r => [r.id, r.t, r.d]), ['ID', 'Entscheidung', 'Am']), tOpt({ y: 4.3, colW: [0.9, 9.9, 1.5] })); }
    if (sel.next) { const sl = S(); n++; head(sl, 'Nächste Schritte'); bullets(sl, D0.nextLines, { x: 0.5, y: 1.2, w: 12.3, h: 5.5, fontSize: 18 }); }
    const out = await p.write({ outputType: 'blob' }); this.dlBlob(out, file); return n; }
  llUI(ctx, exclude, opt) { const s = this.state, stop = new Set(['und', 'der', 'die', 'das', 'mit', 'für', 'von', 'eine', 'einen', 'oder', 'nicht', 'wird', 'werden', 'auch', 'nach', 'über', 'beim', 'dann', 'noch', 'schon', 'weil', 'wenn', 'zwei', 'vier', 'neue', 'neuer', 'projekt', 'phase', 'aufgabe']);
    const toks = str => (String(str || '').toLowerCase().match(/[a-zäöüß0-9]{4,}/g) || []).filter(w => !stop.has(w)), stem = w => w.slice(0, 6), C = new Set(toks(ctx).map(stem));
    const L = WISSEN.filter(w => w.cat === 'Lessons Learned' && w.okey !== exclude && !(opt.dis || {})[w.id]).map(w => { const ws = Array.from(new Set(toks(w.title + ' ' + w.tags.join(' ') + ' ' + w.f.map(x => x[1]).join(' ')).map(stem))), hit = ws.filter(x => C.has(x)), tagHit = w.tags.filter(tg => C.has(stem(tg.toLowerCase())));
      return { w, hit, tagHit, score: hit.length + tagHit.length * 2 + (w.help || 0) * 0.05 }; }).filter(x => x.hit.length >= 2 || x.tagHit.length >= 1).sort((a, b) => b.score - a.score);
    const shown = opt.all ? L : L.slice(0, 3);
    return { items: shown.map(({ w, tagHit, hit }) => { const rec = (w.f.find(x => x[0] === 'Empfehlung') || w.f[w.f.length - 1] || ['', ''])[1], taken = !!(opt.taken || {})[w.id], helped = !!(s.wHelp || {})[w.id];
        return { id: w.id, kind: w.kind === 'gut' ? 'Lief gut' : 'Verbessern', bg: w.kind === 'gut' ? '#107C10' : '#A33F06', title: w.title, rec, meta: 'aus ' + w.origin + ' · ' + w.date + ' · passt zu: ' + (tagHit.length ? tagHit.join(', ') : hit.slice(0, 3).join(', ')) + ' · ' + ((w.help || 0) + (helped ? 1 : 0)) + '× hilfreich',
          takeLabel: taken ? opt.takenLbl : opt.takeLbl, takeBg: taken ? '#107C10' : 'transparent', takeFg: taken ? '#FFFFFF' : 'inherit', take: () => opt.onTake(w, rec, taken),
          helpLabel: helped ? '👍 Hilfreich' : '👍', helpPressed: helped ? 'true' : 'false', help: () => this.setState({ wHelp: Object.assign({}, s.wHelp, { [w.id]: !helped }) }),
          dis: () => opt.onDis(w), details: () => this.setState({ panel: { kind: 'wissen', id: w.id, from: s.screen } }) }; }),
      empty: !L.length, count: L.length, more: L.length > 3 && !opt.all, moreLabel: 'Alle ' + L.length + ' passenden anzeigen' }; }
  modX(pk, tab, t, accent, on) { const s = this.state, U = (s.uprojs || []).find(u => u.key === pk), name = this.pnm(pk), RED = '#C50F1F', GRN = '#107C10', AMB = '#B07B00';
    if (!pk || !name) return { is: {}, msg: '', hasMsg: false };
    const tasks = TASKS.filter(x => x.proj === name), open = tasks.filter(x => !this.isDone(x)), mem = (PMEMBERS[pk] || []).filter(m => m[0] !== 'Kunde' && !m[4]).map(m => m[0]);
    const pad = v => String(v).padStart(2, '0'), now = () => { const d = new Date(); return '13.11. ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
    const save = (patch, msg, log) => { const p = Object.assign({}, patch, { mxMsg: msg || '' }); if (log) p.audBy = Object.assign({}, this.state.audBy, { [pk]: (((this.state.audBy || {})[pk]) || []).concat([[now(), 'Du'].concat(log)]) }); this.setState(p); };
    const chip = (sel, label, go) => ({ label, pressed: sel ? 'true' : 'false', ring: sel ? accent : t.border, bg: sel ? t.soft : t.surface, go });
    const fE = v => Math.round(v).toLocaleString('de-DE') + ' €', hF = v => (Math.round(v * 100) / 100).toLocaleString('de-DE') + ' h', fd = iso => (iso ? iso.slice(8, 10) + '.' + iso.slice(5, 7) + '.' : '–');
    const F = s.mxF || {}, setF = k => e => this.setState({ mxF: Object.assign({}, this.state.mxF, { [k]: e && e.target ? e.target.value : '' }) }), setFv = (k, v) => this.setState({ mxF: Object.assign({}, this.state.mxF, { [k]: v }) });
    const sponsor = PL_OF[pk] === 'Du' || !PL_OF[pk] ? 'die Bereichsleitung' : PL_OF[pk];
    const est = x => EST[x.id] || x.est || 1, ini2 = n => n.split(/[ .]+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    // Risiken
    const R = this.risksOf(pk), sc = r => r.w * r.a, rc = v => (v >= 12 ? RED : (v >= 6 ? AMB : GRN));
    const setR = (l, msg, log) => save({ riskBy: Object.assign({}, this.state.riskBy, { [pk]: l }) }, msg, log);
    const risk = { items: R.slice().sort((a, b) => ((a.st === 'geschlossen') - (b.st === 'geschlossen')) || (sc(b) - sc(a))).map(r => ({ title: r.t, score: String(sc(r)), bg: r.st === 'geschlossen' ? '#8A8886' : rc(sc(r)), strike: r.st === 'geschlossen' ? 'line-through' : 'none',
        sub: 'Wahrscheinlichkeit ' + r.w + ' × Auswirkung ' + r.a + ' · verantwortlich ' + r.o + ' · ' + r.st, m: r.m ? 'Maßnahme: ' + r.m : 'Noch keine Maßnahme', mCol: r.m ? t.text : RED,
        stLabel: r.st === 'geschlossen' ? 'Wieder öffnen' : (r.st === 'offen' ? '▶ In Bearbeitung' : '✓ Schließen'),
        step: () => { const nx = r.st === 'geschlossen' ? 'offen' : (r.st === 'offen' ? 'in Bearbeitung' : 'geschlossen'); setR(R.map(x => (x.id === r.id ? Object.assign({}, x, { st: nx }) : x)), 'Risiko „' + r.t + '“: ' + nx + '.', ['Risiko „' + r.t + '“', 'Status', r.st, nx]); },
        del: () => setR(R.filter(x => x.id !== r.id), 'Risiko gelöscht.', ['Risiko „' + r.t + '“', 'gelöscht', 'W' + r.w + '×A' + r.a, '']) })),
      empty: !R.length, count: R.filter(r => r.st !== 'geschlossen').length + ' offen · ' + R.filter(r => r.st !== 'geschlossen' && sc(r) >= 12).length + ' hoch', grid: [],
      text: F.rt || '', setText: setF('rt'), m: F.rm || '', setM: setF('rm'),
      ws: [1, 2, 3, 4, 5].map(v => chip((F.rw || 3) === v, String(v), () => setFv('rw', v))), as: [1, 2, 3, 4, 5].map(v => chip((F.ra || 3) === v, String(v), () => setFv('ra', v))),
      owners: mem.slice(0, 8).map(n => chip((F.ro || 'Du') === n, n, () => setFv('ro', n))),
      add: () => { const F2 = this.state.mxF || {}, tt = (F2.rt || '').trim(); if (!tt) return this.setState({ mxMsg: 'Erst beschreiben, was schiefgehen kann.' });
        const r = { id: 'r' + Date.now(), t: tt, w: F2.rw || 3, a: F2.ra || 3, m: (F2.rm || '').trim(), o: F2.ro || 'Du', st: 'offen' };
        save({ riskBy: Object.assign({}, this.state.riskBy, { [pk]: R.concat([r]) }), mxF: Object.assign({}, F2, { rt: '', rm: '' }) }, 'Risiko erfasst, Bewertung ' + (r.w * r.a) + (r.w * r.a >= 12 ? ' (hoch). Bitte eine Maßnahme festlegen.' : '.'), ['Risiko „' + r.t + '“', 'angelegt', '', 'W' + r.w + '×A' + r.a]); } };
    for (let a = 5; a >= 1; a--) for (let w = 1; w <= 5; w++) { const n = R.filter(r => r.st !== 'geschlossen' && r.w === w && r.a === a).length; risk.grid.push({ n: n ? String(n) : '', bg: rc(w * a), op: n ? '1' : '0.22', aria: 'Wahrscheinlichkeit ' + w + ', Auswirkung ' + a + ': ' + n + ' Risiken' }); }
    // Zeiten
    const tk = x => 't:' + x.id, timesOf = x => (((AKTE_SEED[tk(x)] || {}).times) || []).concat((((s.akte || {})[tk(x)] || {}).times) || []);
    const TL = []; tasks.forEach(x => timesOf(x).forEach(r => TL.push({ x, d: r[0], who: r[1], h: r[2], note: r[3] || '' })));
    const hSum = TL.reduce((a, r) => a + r.h, 0), byP = {}; TL.forEach(r => { byP[r.who] = (byP[r.who] || 0) + r.h; }); const mxP = Math.max(1, ...Object.values(byP).concat([0]));
    const selT = tasks.find(x => x.id === F.zt) || open[0], wz = ((s.wzBy || {})[pk]) || '';
    const zeit = { sum: hF(hSum), count: TL.length + (TL.length === 1 ? ' Buchung' : ' Buchungen'), people: Object.keys(byP).sort((a, b) => byP[b] - byP[a]).map(n => ({ name: n, h: hF(byP[n]), w: Math.round(byP[n] / mxP * 100) + '%' })),
      rows: TL.slice().reverse().slice(0, 15).map(r => ({ d: r.d, who: r.who, task: r.x.title, h: hF(r.h), note: r.note, sub: r.who + (r.note ? ' · ' + r.note : ''), open: () => this.openTask(r.x.id, U ? 'pn' : 'projekt') })), empty: !TL.length,
      tasks: open.slice(0, 8).map(x => chip(!!selT && selT.id === x.id, x.title.length > 34 ? x.title.slice(0, 32) + '…' : x.title, () => setFv('zt', x.id))), noTasks: !open.length,
      hs: [0.5, 1, 2, 4, 8].map(v => chip((F.zh || 1) === v, v.toLocaleString('de-DE') + ' h', () => setFv('zh', v))), note: F.zn || '', setNote: setF('zn'),
      book: () => { const F2 = this.state.mxF || {}, x = tasks.find(y => y.id === F2.zt) || open[0]; if (!x) return this.setState({ mxMsg: 'Keine offene Aufgabe zum Buchen.' });
        const h = F2.zh || 1, k = tk(x), cur = Object.assign({ doku: [], files: [], times: [], inv: [] }, (this.state.akte || {})[k] || {}); cur.times = cur.times.concat([['13.11.', 'Du', h, (F2.zn || '').trim()]]);
        save({ akte: Object.assign({}, this.state.akte, { [k]: cur }), mxF: Object.assign({}, F2, { zn: '' }) }, hF(h) + ' auf „' + x.title + '“ gebucht. Steht auch an der Aufgabe unter Zeiten.', ['Zeit „' + x.title + '“', 'gebucht', '', hF(h)]); },
      wz: wz ? 'Wochenzettel KW 46: ' + wz : 'Wochenzettel KW 46: noch nicht eingereicht', wzLabel: wz ? 'Zurückziehen' : 'Wochenzettel einreichen',
      wzGo: () => save({ wzBy: Object.assign({}, this.state.wzBy, { [pk]: wz ? '' : 'eingereicht, wartet auf Freigabe durch ' + sponsor }) }, wz ? 'Wochenzettel zurückgezogen.' : 'Wochenzettel eingereicht. Die Freigabe landet im Posteingang von ' + sponsor + '.', ['Wochenzettel KW 46', 'Status', wz ? 'eingereicht' : 'offen', wz ? 'zurückgezogen' : 'eingereicht']) };
    // Kapazität
    const PCT = n => { const m = (PMEMBERS[pk] || []).find(x => x[0] === n), p = m && m[3] ? parseInt(m[3], 10) : NaN; return isNaN(p) ? 20 : p; };
    const RR = mem.map(n => { const my = open.filter(x => this.ownerOf(x) === n), hrs = my.filter(x => !x.due || x.due <= '2026-12-11').reduce((a, x) => a + est(x), 0), cap = 40 * PCT(n) / 100 * 4, load = cap ? Math.round(hrs / cap * 100) : 0; return { n, my, hrs, cap, load, tot: LOAD47[n] || 70 }; });
    const ov = RR.filter(r => r.load > 100 && r.my.length).sort((a, b) => b.load - a.load)[0], lo = RR.slice().sort((a, b) => a.load - b.load)[0], big = ov ? ov.my.slice().sort((a, b) => est(b) - est(a))[0] : null;
    const res = { rows: RR.map(r => ({ name: r.n, ini: ini2(r.n), av: AV[r.n] || accent, pct: PCT(r.n) + ' % im Projekt', hrs: hF(r.hrs) + ' geplant von ' + hF(r.cap) + ' verfügbar', w: Math.min(100, r.load) + '%', col: r.load > 100 ? RED : (r.load > 85 ? AMB : GRN), load: r.load + ' %',
        tot: 'über alle Projekte ' + r.tot + ' %', totCol: r.tot > 95 ? RED : t.muted, n: r.my.length + ' offene Aufgaben' })),
      empty: !RR.length, hasOver: !!ov, ok: !ov, overText: ov ? ov.n + ' ist in den nächsten 4 Wochen mit ' + ov.load + ' % überplant.' + (big && lo && lo.n !== ov.n ? ' Vorschlag: „' + big.title + '“ (' + hF(est(big)) + ') an ' + lo.n + ' (' + lo.load + ' %) geben.' : '') : 'Niemand ist in den nächsten 4 Wochen überplant.',
      canBal: !!(ov && big && lo && lo.n !== ov.n), balance: () => { if (!(ov && big && lo)) return; save({ ownerOv: Object.assign({}, this.state.ownerOv, { [big.id]: lo.n }) }, '„' + big.title + '“ liegt jetzt bei ' + lo.n + '. ' + lo.n + ' bekommt eine Benachrichtigung.', ['Aufgabe „' + big.title + '“', 'Verantwortlich', ov.n, lo.n]); },
      hint: 'Grundlage: Projektanteil (Team › ✎) × 40 h pro Woche, Schätzungen der offenen Aufgaben mit Fälligkeit bis 11.12. Die Gesamtauslastung kommt aus allen Projekten und Linienaufgaben.' };
    // Change Requests
    const C = ((s.crBy || {})[pk]) || CRX_SEED[pk] || [], setC = (l, msg, log, extra) => save(Object.assign({ crBy: Object.assign({}, this.state.crBy, { [pk]: l }) }, extra || {}), msg, log);
    const setSt = (c, st) => setC(C.map(x => (x.id === c.id ? Object.assign({}, x, { st }) : x)), c.id + ' ' + st + '.' + (st === 'genehmigt' && c.cost ? ' ' + fE(c.cost) + ' stehen jetzt als Nachtrag unter Finanzen.' : '') + (st === 'genehmigt' && c.days ? ' Plan um ' + c.days + ' Tage anpassen: Reiter Planung.' : ''), [c.id + ' „' + c.t + '“', 'Status', c.st, st]);
    const cr = { items: C.slice().reverse().map(c => ({ id: c.id, title: c.t, sub: c.art + ' · ' + (c.cost ? '+' + fE(c.cost) : 'ohne Mehrkosten') + (c.days ? ' · +' + c.days + ' Tage' : '') + ' · von ' + c.by + ', ' + c.d, why: c.why, hasWhy: !!c.why,
        st: c.st, stBg: c.st === 'genehmigt' ? GRN : (c.st === 'abgelehnt' ? RED : AMB), pending: c.st === 'eingereicht', ok: () => setSt(c, 'genehmigt'), no: () => setSt(c, 'abgelehnt') })),
      empty: !C.length, count: C.filter(c => c.st === 'eingereicht').length + ' offen · ' + C.filter(c => c.st === 'genehmigt').length + ' genehmigt', who: 'Freigabe durch ' + sponsor + ' (Owner oder Auftraggeber).',
      t: F.ct || '', setT: setF('ct'), why: F.cw || '', setWhy: setF('cw'), cost: F.cc || '', setCost: setF('cc'), days: F.cd || '', setDays: setF('cd'),
      arts: ['Umfang', 'Termin', 'Kosten', 'Qualität'].map(k => chip((F.ca || 'Umfang') === k, k, () => setFv('ca', k))), open: !!s.crNew, toggle: () => this.setState({ crNew: !s.crNew }), btn: s.crNew ? 'Abbrechen' : '+ Change Request',
      add: () => { const F2 = this.state.mxF || {}; if (!(F2.ct || '').trim()) return this.setState({ mxMsg: 'Kurz beschreiben, was sich ändern soll.' });
        const c = { id: 'CR-' + pad(C.length + 1), t: F2.ct.trim(), art: F2.ca || 'Umfang', cost: parseFloat(String(F2.cc || '0').replace(/\./g, '').replace(',', '.')) || 0, days: parseInt(F2.cd || '0', 10) || 0, why: (F2.cw || '').trim(), st: 'eingereicht', by: 'Du', d: '13.11.' };
        setC(C.concat([c]), c.id + ' eingereicht. Die Freigabe liegt jetzt bei ' + sponsor + '.', [c.id + ' „' + c.t + '“', 'eingereicht', '', c.art], { mxF: Object.assign({}, F2, { ct: '', cw: '', cc: '', cd: '' }), crNew: false }); },
      sm42: pk === 'sm42', openOld: () => this.setState({ panel: { kind: 'crs', id: 'crs', from: 'planung' } }) };
    // Statusbericht
    const SB = Object.assign({ amp: null, erreicht: null, naechst: null, entsch: null, sent: [] }, ((s.sbBy || {})[pk]) || {}), setSB = p => this.setState({ sbBy: Object.assign({}, this.state.sbBy, { [pk]: Object.assign({}, SB, p) }) });
    const FB = pk === 'sm42' ? [['', 480000], ['', 212400]] : (typeof PFIN !== 'undefined' && PFIN[pk] ? PFIN[pk].B : null);
    const budget = U ? (U.budget || 0) : (FB ? FB[0][1] : 0), cost = U ? (U.costs || []).reduce((a, c) => a + c[1], 0) : (FB ? FB[1][1] : 0);
    const ovd = open.filter(x => x.due && x.due < '2026-11-13').length, hiR = R.filter(r => r.st !== 'geschlossen' && sc(r) >= 12).length, AC = { 'grün': GRN, gelb: AMB, rot: RED };
    const autoA = ovd > 2 || hiR > 1 || (budget && cost > budget) ? 'rot' : (ovd || hiR ? 'gelb' : 'grün'), amp = SB.amp || autoA;
    const dDone = tasks.filter(x => this.isDone(x)).slice(-4).map(x => '• ' + x.title).join('\n') || '• noch nichts abgeschlossen';
    const dNext = open.slice().sort((a, b) => (a.due < b.due ? -1 : 1)).slice(0, 3).map(x => '• ' + x.title + ' (bis ' + fd(x.due) + ')').join('\n') || '• –';
    const dEnt = C.filter(c => c.st === 'eingereicht').map(c => '• ' + c.id + ' „' + c.t + '“ freigeben').concat(R.filter(r => r.st !== 'geschlossen' && sc(r) >= 12 && !r.m).map(r => '• Maßnahme für Risiko „' + r.t + '“ festlegen')).join('\n') || '• keiner';
    const status = { lights: [['Termine', ovd ? ovd + ' Aufgaben überfällig' : 'im Plan', ovd > 2 ? RED : (ovd ? AMB : GRN)], ['Kosten', budget ? Math.round(cost / budget * 100) + ' % vom Budget verbraucht' : 'kein Budget hinterlegt', budget && cost > budget ? RED : (budget ? GRN : t.strong)], ['Risiken', hiR ? hiR + ' hoch bewertet' : 'keine hohen Risiken', hiR > 1 ? RED : (hiR ? AMB : GRN)]].map(([l, v, c]) => ({ l, v, c })),
      amps: ['grün', 'gelb', 'rot'].map(a => ({ label: a, pressed: amp === a ? 'true' : 'false', ring: amp === a ? AC[a] : t.border, bg: amp === a ? AC[a] : t.surface, fg: amp === a ? '#FFFFFF' : t.text, go: () => setSB({ amp: a }) })),
      ampNote: SB.amp ? 'Gesamtampel von dir gesetzt (Vorschlag aus den Daten: ' + autoA + ').' : 'Gesamtampel automatisch aus Terminen, Kosten und Risiken: ' + autoA + '. Du kannst sie überschreiben.', ampCol: AC[amp],
      erreicht: SB.erreicht !== null ? SB.erreicht : dDone, naechst: SB.naechst !== null ? SB.naechst : dNext, entsch: SB.entsch !== null ? SB.entsch : dEnt,
      setE: e => setSB({ erreicht: e && e.target ? e.target.value : '' }), setN: e => setSB({ naechst: e && e.target ? e.target.value : '' }), setD: e => setSB({ entsch: e && e.target ? e.target.value : '' }),
      reset: () => setSB({ amp: null, erreicht: null, naechst: null, entsch: null }), to: 'Geht an ' + sponsor + ' und erscheint im Portfolio unter Berichte › Statusbericht.',
      send: () => save({ sbBy: Object.assign({}, this.state.sbBy, { [pk]: Object.assign({}, SB, { sent: SB.sent.concat([{ d: '13.11.2026', amp }]) }) }) }, 'Statusbericht (Ampel ' + amp + ') an ' + sponsor + ' gesendet.', ['Statusbericht', 'gesendet', '', 'Ampel ' + amp]),
      pdf: () => this.setState({ mxMsg: 'Der Bericht würde jetzt als PDF erzeugt, mit Logo, Ampeln und den drei Textfeldern.' }),
      hist: SB.sent.slice().reverse().map(x => ({ text: x.d + ' · Ampel ' + x.amp + ' · von dir gesendet', c: AC[x.amp] })), noHist: !SB.sent.length };
    // Audit
    const flatN = []; const walk = l => (l || []).forEach(n => { flatN.push(n); walk(n.children); }); walk(PTREE_OF[pk]);
    const AU = [], H = s.hist || {}; tasks.forEach(x => (H['t:' + x.id] || HIST_SEED['t:' + x.id] || []).forEach(h => AU.push({ when: h[0], who: h[1], obj: 'Aufgabe „' + x.title + '“', typ: 'Aufgaben', field: h[2], a: h[3], b: h[4] })));
    flatN.forEach(n => (H['n:' + n.id] || HIST_SEED['n:' + n.id] || []).forEach(h => AU.push({ when: h[0], who: h[1], obj: (n.kindLabel || 'Phase') + ' „' + n.name + '“', typ: 'Planung', field: h[2], a: h[3], b: h[4] })));
    (((s.audBy || {})[pk]) || []).forEach(h => AU.push({ when: h[0], who: h[1], obj: h[2], typ: /^Risiko/.test(h[2]) ? 'Risiken' : /^(OP|E)-/.test(h[2]) ? 'Offene Punkte' : (/^CR-/.test(h[2]) ? 'Change Requests' : (/^Zeit|^Wochenzettel/.test(h[2]) ? 'Zeiten' : 'Sonstiges')), field: h[3], a: h[4], b: h[5] }));
    const wk = w => { const m = /(\d\d)\.(\d\d)\.\s*(\d\d:\d\d)?/.exec(w || '') || []; return (m[2] || '00') + (m[1] || '00') + (m[3] || '00:00'); };
    AU.sort((a, b) => (wk(a.when) < wk(b.when) ? 1 : -1)); const af = s.audF || 'Alle', typs = ['Alle'].concat(['Aufgaben', 'Planung', 'Risiken', 'Offene Punkte', 'Change Requests', 'Zeiten', 'Sonstiges'].filter(x => AU.some(r => r.typ === x)));
    const AUf = AU.filter(r => af === 'Alle' || r.typ === af);
    const audit = { rows: AUf.slice(0, 50).map(r => ({ when: r.when, who: r.who, ini: ini2(r.who), av: AV[r.who] || '#5C5C5C', obj: r.obj, field: r.field, a: r.a || '–', b: r.b || '–' })), empty: !AUf.length, count: AU.length + ' Einträge, unveränderbar gespeichert',
      filters: typs.map(x => chip(af === x, x, () => this.setState({ audF: x }))),
      csv: () => { try { const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"', csv = '\ufeffZeitpunkt;Person;Objekt;Feld;Alt;Neu\n' + AU.map(r => [r.when, r.who, r.obj, r.field, r.a, r.b].map(q).join(';')).join('\n');
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'Verlauf_' + name.replace(/\W+/g, '_') + '.csv'; document.body.appendChild(a); a.click(); a.remove(); this.setState({ mxMsg: 'Verlauf als CSV heruntergeladen (' + AU.length + ' Einträge).' }); } catch (e) { this.setState({ mxMsg: 'Download im Browser nicht möglich.' }); } } };
    // Finanzen: Kostenstelle, Innenauftrag, Nachträge
    const kst = this.kstOf(pk), ia = this.iaOf(pk), apC = C.filter(c => c.st === 'genehmigt' && c.cost);
    const fin = { kst: kst || 'nicht hinterlegt', ia: ia || 'nicht hinterlegt', kstCol: kst ? t.text : t.muted, iaCol: ia ? t.text : t.muted, edit: () => this.setState({ panel: { kind: 'settings', id: 'settings', from: U ? 'pn' : 'projekt' }, setSub: 'stamm', setMsg: '' }),
      nach: apC.map(c => ({ text: c.id + ' ' + c.t, amt: '+' + fE(c.cost) })), hasNach: apC.length > 0, nachSum: 'Nachträge gesamt +' + fE(apC.reduce((a, c) => a + c.cost, 0)) };
    // Team: Abwesenheiten, Kontakte
    const AB = ((s.abwBy || {})[pk]) || ABW_SEED[pk] || [], setAB = (l, msg, log) => save({ abwBy: Object.assign({}, this.state.abwBy, { [pk]: l }) }, msg, log);
    const KT = ((s.ktBy || {})[pk]) || KT_SEED[pk] || [], setKT = (l, msg, log, extra) => save(Object.assign({ ktBy: Object.assign({}, this.state.ktBy, { [pk]: l }) }, extra || {}), msg, log);
    const EC = { hoch: RED, mittel: AMB, niedrig: GRN };
    const team = { abw: AB.map((a, i) => { const hit = open.filter(x => this.ownerOf(x) === a.n && x.due >= a.von && x.due <= a.bis); return { name: a.n, ini: ini2(a.n), av: AV[a.n] || accent, text: a.art + ' · ' + fd(a.von) + (a.bis !== a.von ? ' – ' + fd(a.bis) : ''), warn: hit.length ? '⚠ ' + hit.length + ' Aufgabe' + (hit.length > 1 ? 'n' : '') + ' fällig in dieser Zeit: ' + hit.map(x => x.title).join(', ') : '', hasWarn: hit.length > 0,
        del: () => setAB(AB.filter((x, k) => k !== i), 'Abwesenheit gelöscht.', ['Abwesenheit ' + a.n, 'gelöscht', a.art, '']) }; }), abwEmpty: !AB.length,
      abwWho: mem.slice(0, 8).map(n => chip((F.an || mem[0]) === n, n, () => setFv('an', n))), abwArt: ['Urlaub', 'Krank', 'Schulung', 'Dienstreise'].map(k => chip((F.aa || 'Urlaub') === k, k, () => setFv('aa', k))),
      abwVon: F.av || '2026-11-23', abwBis: F.ab || '2026-11-27', setVon: setF('av'), setBis: setF('ab'),
      abwAdd: () => { const F2 = this.state.mxF || {}, a = { n: F2.an || mem[0], von: F2.av || '2026-11-23', bis: F2.ab || F2.av || '2026-11-27', art: F2.aa || 'Urlaub' }; if (!a.n) return; if (a.bis < a.von) a.bis = a.von; setAB(AB.concat([a]), a.art + ' für ' + a.n + ' eingetragen.', ['Abwesenheit ' + a.n, a.art, '', fd(a.von) + '–' + fd(a.bis)]); },
      kt: KT.map((k, i) => ({ name: k.n, f: k.f, e: 'Einfluss ' + k.e, eCol: EC[k.e] || t.strong, c: k.c ? 'Thema: ' + k.c : '', hasC: !!k.c, del: () => setKT(KT.filter((x, j) => j !== i), 'Kontakt entfernt.', ['Kontakt ' + k.n, 'entfernt', '', '']) })), ktEmpty: !KT.length,
      ktN: F.kn || '', setKtN: setF('kn'), ktF: F.kf || '', setKtF: setF('kf'), ktC: F.kc || '', setKtC: setF('kc'), ktE: ['hoch', 'mittel', 'niedrig'].map(k => chip((F.ke || 'mittel') === k, k, () => setFv('ke', k))),
      ktAdd: () => { const F2 = this.state.mxF || {}; if (!(F2.kn || '').trim()) return this.setState({ mxMsg: 'Name des Kontakts fehlt.' }); const k = { n: F2.kn.trim(), f: (F2.kf || '').trim(), e: F2.ke || 'mittel', c: (F2.kc || '').trim() };
        setKT(KT.concat([k]), 'Kontakt „' + k.n + '“ hinzugefügt.', ['Kontakt ' + k.n, 'hinzugefügt', '', k.f], { mxF: Object.assign({}, F2, { kn: '', kf: '', kc: '' }) }); } };
    // Offene Punkte und Entscheidungen
    const OP = ((s.oplBy || {})[pk]) || OPL_SEED[pk] || [], DC = ((s.decBy || {})[pk]) || DEC_SEED[pk] || [], of = s.oplF || 'offen';
    const setOP = (l, msg, log, extra) => save(Object.assign({ oplBy: Object.assign({}, this.state.oplBy, { [pk]: l }) }, extra || {}), msg, log);
    const OPv = OP.filter(o => of === 'alle' || (of === 'offen' ? o.st === 'offen' : o.st === 'offen' && o.due < '2026-11-13'));
    const opl = { items: OPv.map(o => { const late = o.st === 'offen' && o.due < '2026-11-13'; return { id: o.id, title: o.t, done: o.st === 'erledigt', strike: o.st === 'erledigt' ? 'line-through' : 'none', sub: o.who + ' · bis ' + fd(o.due) + (o.src ? ' · aus ' + o.src : ''), col: late ? RED : t.muted, late, lateTxt: late ? 'überfällig' : '',
        mark: o.st === 'erledigt' ? '✓' : '', ring: o.st === 'erledigt' ? GRN : t.strong, bg: o.st === 'erledigt' ? GRN : t.surface, aria: (o.st === 'erledigt' ? 'Wieder öffnen: ' : 'Erledigt: ') + o.t,
        toggle: () => setOP(OP.map(x => (x.id === o.id ? Object.assign({}, x, { st: x.st === 'erledigt' ? 'offen' : 'erledigt' }) : x)), o.id + (o.st === 'erledigt' ? ' wieder offen.' : ' erledigt.'), [o.id + ' „' + o.t + '“', 'Status', o.st, o.st === 'erledigt' ? 'offen' : 'erledigt']),
        canTask: o.st === 'offen' && !o.task, hasTask: !!o.task,
        task: () => { const id = 'opk' + (s.rev || 0) + '_' + TASKS.length, x = { id, title: o.t, proj: name, due: o.due, bucket: 'Backlog', prio: 'Mittel', owner: o.who, mine: o.who === 'Du', ms: null, desc: 'Aus offenem Punkt ' + o.id + (o.src ? ' (' + o.src + ')' : ''), est: 2, co: [] }; TASKS.push(x); TASK[id] = x;
          setOP(OP.map(z => (z.id === o.id ? Object.assign({}, z, { task: id }) : z)), o.id + ' ist jetzt eine Aufgabe für ' + o.who + '.', [o.id + ' „' + o.t + '“', 'Aufgabe angelegt', '', o.who], { rev: (this.state.rev || 0) + 1 }); },
        openTask: () => (o.task ? this.openTask(o.task, U ? 'pn' : 'projekt') : null) }; }),
      empty: !OPv.length, count: OP.filter(o => o.st === 'offen').length + ' offen · ' + OP.filter(o => o.st === 'offen' && o.due < '2026-11-13').length + ' überfällig',
      filters: [['offen', 'Offen'], ['ueber', 'Überfällig'], ['alle', 'Alle']].map(([k, l]) => chip(of === k, l, () => this.setState({ oplF: k }))),
      t: F.ot || '', setT: setF('ot'), due: F.od || '2026-11-27', setDue: setF('od'), whos: mem.slice(0, 8).map(n => chip((F.ow || 'Du') === n, n, () => setFv('ow', n))),
      add: () => { const F2 = this.state.mxF || {}; if (!(F2.ot || '').trim()) return this.setState({ mxMsg: 'Kurz beschreiben, was offen ist.' }); const o = { id: 'OP-' + pad(OP.length + 1), t: F2.ot.trim(), who: F2.ow || 'Du', due: F2.od || '2026-11-27', st: 'offen', src: 'von Hand' };
        setOP(OP.concat([o]), o.id + ' angelegt, ' + o.who + ' bis ' + fd(o.due) + '.', [o.id + ' „' + o.t + '“', 'angelegt', '', o.who], { mxF: Object.assign({}, F2, { ot: '' }) }); },
      decs: DC.slice().reverse().map(d => ({ id: d.id, title: d.t, why: d.why, hasWhy: !!d.why, sub: d.d + ' · ' + d.by + (d.src ? ' · ' + d.src : '') })), decEmpty: !DC.length, decCount: DC.length + (DC.length === 1 ? ' Entscheidung' : ' Entscheidungen'),
      dt: F.dt || '', setDt: setF('dt'), dw: F.dw || '', setDw: setF('dw'),
      decAdd: () => { const F2 = this.state.mxF || {}; if (!(F2.dt || '').trim()) return this.setState({ mxMsg: 'Was wurde entschieden?' }); const d = { id: 'E-' + pad(DC.length + 1), t: F2.dt.trim(), why: (F2.dw || '').trim(), by: 'Du', d: '13.11.', src: 'von Hand' };
        save({ decBy: Object.assign({}, this.state.decBy, { [pk]: DC.concat([d]) }), mxF: Object.assign({}, F2, { dt: '', dw: '' }) }, d.id + ' im Entscheidungslog. Es lässt sich nicht mehr ändern, nur durch eine neue Entscheidung ersetzen.', [d.id + ' „' + d.t + '“', 'entschieden', '', 'Du']); } };
    // Projektabschluss
    const CL = Object.assign({ abn: null, ll: [], closed: '' }, ((s.clBy || {})[pk]) || {}), setCL = (p, msg, log, extra) => save(Object.assign({ clBy: Object.assign({}, this.state.clBy, { [pk]: Object.assign({}, CL, p) }) }, extra || {}), msg, log);
    const archived = !!(((s.psetBy || {})[pk]) || {}).archived;
    const ABR = [['ok', 'ohne Mängel abgenommen'], ['rest', 'mit Restpunkten abgenommen'], ['nein', 'nicht abgenommen']];
    const openT = open.length, openOP = OP.filter(o => o.st === 'offen').length, openCR = C.filter(c => c.st === 'eingereicht').length, openRk = R.filter(r => r.st !== 'geschlossen').length;
    const llG = CL.ll.filter(l => l.k === 'gut').length, llV = CL.ll.filter(l => l.k === 'verbessern').length, llOk = llG > 0 && llV > 0, abnOk = !!CL.abn && CL.abn.res !== 'nein';
    const nodesP = []; const wP = l => (l || []).forEach(x => { nodesP.push(x); wP(x.children); }); wP(PTREE_OF[pk]); const endPlan = nodesP.reduce((a, n) => (n.end > a ? n.end : a), '0000');
    const blM = ((Object.assign({}, typeof BL_SEED !== 'undefined' ? BL_SEED : {}, s.blBy || {}))[pk] || {}).map || {}, endBase = Object.values(blM).reduce((a, v) => (v && v[1] > a ? v[1] : a), '0000');
    const chk = (okk, label, sub, act, actLabel) => ({ label, sub, mark: okk ? '✓' : '!', col: okk ? GRN : AMB, act: act || (() => {}), hasAct: !!act && !okk, actLabel: actLabel || '' });
    const close = {
      archived, notArchived: !archived, closedTxt: archived ? 'Abgeschlossen und archiviert am ' + (CL.closed || '13.11.2026') + '. Das Projekt ist nur noch lesbar.' : '',
      abnDone: !!CL.abn, abnTxt: CL.abn ? 'Abnahme am ' + fd(CL.abn.d) + ' durch ' + CL.abn.who + ': ' + (ABR.find(x => x[0] === CL.abn.res) || ['', ''])[1] + (CL.abn.rest ? ' · Restpunkte als offene Punkte angelegt' : '') : '',
      abnD: F.cd2 || '2026-11-13', setAbnD: setF('cd2'), abnWho: F.cw2 !== undefined ? F.cw2 : (PL_OF[pk] && PL_OF[pk] !== 'Du' ? PL_OF[pk] : 'Kunde'), setAbnWho: setF('cw2'), abnRest: F.cr2 || '', setAbnRest: setF('cr2'),
      abnRes: ABR.map(([k, l]) => chip((F.cs2 || 'ok') === k, l, () => setFv('cs2', k))),
      abnSave: () => { const F2 = this.state.mxF || {}, res = F2.cs2 || 'ok', rest = (F2.cr2 || '').split('\n').map(x => x.trim()).filter(Boolean);
        const nOP = rest.map((t0, i) => ({ id: 'OP-' + pad(OP.length + i + 1), t: 'Restpunkt: ' + t0, who: 'Du', due: this.isoAdd(F2.cd2 || '2026-11-13', 14), st: 'offen', src: 'Abnahme ' + fd(F2.cd2 || '2026-11-13') }));
        setCL({ abn: { d: F2.cd2 || '2026-11-13', who: (F2.cw2 !== undefined ? F2.cw2 : 'Kunde') || 'Kunde', res, rest: rest.length } }, 'Abnahmeprotokoll gespeichert' + (rest.length ? ', ' + rest.length + ' Restpunkte als offene Punkte angelegt' : '') + '. Es liegt unter Dokumente.', ['Abnahme', (ABR.find(x => x[0] === res) || ['', ''])[1], '', fd(F2.cd2 || '2026-11-13')], rest.length ? { oplBy: Object.assign({}, this.state.oplBy, { [pk]: OP.concat(nOP) }) } : null); },
      checks: [chk(abnOk, 'Abnahme', CL.abn ? (CL.abn.res === 'nein' ? 'nicht abgenommen: erst Mängel beheben' : 'erfasst') : 'Abnahmeprotokoll fehlt (Schritt 1)'),
        chk(!openT, 'Offene Aufgaben', openT ? openT + ' noch offen' : 'alle erledigt', () => { open.forEach(x => { if (!this.isDone(x)) this.toggleDone(x.id); }); this.setState({ mxMsg: openT + ' Restaufgaben geschlossen. Der Verlauf hält fest, dass sie beim Abschluss geschlossen wurden.' }); }, 'Restaufgaben schließen'),
        chk(!openOP, 'Offene Punkte', openOP ? openOP + ' noch offen' : 'keine', () => this.setState({ ptab: 'opl', upTab: 'opl' }), 'Zu den offenen Punkten'),
        chk(!openCR, 'Change Requests', openCR ? openCR + ' ohne Entscheidung' : 'alle entschieden', () => this.setState({ ptab: 'aenderungen', upTab: 'aenderungen' }), 'Entscheiden'),
        chk(!openRk, 'Risiken', openRk ? openRk + ' nicht geschlossen' : 'alle geschlossen', () => setR(R.map(r => Object.assign({}, r, { st: 'geschlossen' })), openRk + ' Risiken geschlossen (Projektende).', ['Risiken', 'geschlossen', String(openRk), '0']), 'Alle schließen'),
        chk(llOk, 'Lessons Learned', llOk ? llG + ' lief gut, ' + llV + ' verbessern' : 'Pflicht: mindestens eine „lief gut“ und eine „verbessern“ (Schritt 3)')],
      ll: CL.ll.map(l => ({ kind: l.k === 'gut' ? 'Lief gut' : 'Verbessern', bg: l.k === 'gut' ? GRN : '#A33F06', title: l.t, rec: l.rec, hasRec: !!l.rec })), llEmpty: !CL.ll.length,
      llKinds: [['gut', 'Lief gut'], ['verbessern', 'Verbessern']].map(([k, l]) => chip((F.lk || 'gut') === k, l, () => setFv('lk', k))),
      llT: F.lt || '', setLlT: setF('lt'), llR: F.lr || '', setLlR: setF('lr'),
      llAdd: () => { const F2 = this.state.mxF || {}; if (!(F2.lt || '').trim()) return this.setState({ mxMsg: 'Was lief gut oder was sollte besser werden?' }); const k = F2.lk || 'gut', l = { k, t: F2.lt.trim(), rec: (F2.lr || '').trim() };
        WISSEN.push({ id: 'wl' + pk + (CL.ll.length + 1) + '_' + WISSEN.length, cat: 'Lessons Learned', kind: k, title: l.t, origin: name, okey: pk, date: '13.11.2026', author: 'Du', help: 0, tags: ['Projektabschluss'], f: [['Beobachtung', l.t], ['Empfehlung', l.rec || '–']] });
        setCL({ ll: CL.ll.concat([l]) }, 'Lesson Learned gespeichert und unter Wissen für alle Projekte auffindbar.', ['Lesson Learned', k === 'gut' ? 'lief gut' : 'verbessern', '', l.t], { mxF: Object.assign({}, F2, { lt: '', lr: '' }) }); },
      rep: [['Termin', 'geplantes Ende ' + (endBase !== '0000' ? fd(endBase) + ' (Baseline), ' : '') + 'aktuell ' + fd(endPlan), endBase !== '0000' && endPlan > endBase ? '+' + this.dayDiff(endPlan, endBase) + ' Tage' : 'im Plan', endBase !== '0000' && endPlan > endBase ? RED : GRN],
        ['Kosten', budget ? fE(cost) + ' von ' + fE(budget) : 'kein Budget hinterlegt', budget ? Math.round(cost / budget * 100) + ' %' : '–', budget && cost > budget ? RED : GRN],
        ['Aufgaben', (tasks.length - openT) + ' von ' + tasks.length + ' erledigt', openT ? openT + ' offen' : 'vollständig', openT ? AMB : GRN],
        ['Änderungen', C.filter(c => c.st === 'genehmigt').length + ' genehmigte Change Requests', fE(C.filter(c => c.st === 'genehmigt').reduce((a, c) => a + (c.cost || 0), 0)) + ' Nachträge', t.strong],
        ['Entscheidungen', DC.length + ' im Entscheidungslog', '', t.strong]].map(([l, v, d, c]) => ({ l, v, d, c })),
      pdf: () => this.setState({ mxMsg: 'Abschlussbericht würde als PDF erzeugt: Plan gegen Ist, Abnahme, Lessons Learned, Entscheidungen. Ablage unter Dokumente.' }),
      canClose: abnOk && llOk && !archived, cantClose: !(abnOk && llOk) && !archived, missing: [!abnOk ? 'Abnahme' : '', !llOk ? 'Lessons Learned' : ''].filter(Boolean).join(' und '),
      warnOpen: openT + openOP + openCR > 0 ? 'Hinweis: Es ist noch etwas offen (' + [openT ? openT + ' Aufgaben' : '', openOP ? openOP + ' offene Punkte' : '', openCR ? openCR + ' Change Requests' : ''].filter(Boolean).join(', ') + '). Es wird mit archiviert und bleibt nachvollziehbar.' : '', hasWarnOpen: openT + openOP + openCR > 0,
      doClose: () => { if (!(abnOk && llOk)) return; save({ psetBy: Object.assign({}, this.state.psetBy, { [pk]: Object.assign({}, (this.state.psetBy || {})[pk] || {}, { archived: true }) }), clBy: Object.assign({}, this.state.clBy, { [pk]: Object.assign({}, CL, { closed: '13.11.2026' }) }) }, 'Projekt abgeschlossen und archiviert. Abschlussbericht und Lessons Learned sind abgelegt; das Projekt ist nur noch lesbar.', ['Projekt', 'Status', 'laufend', 'abgeschlossen']); },
      reopen: () => save({ psetBy: Object.assign({}, this.state.psetBy, { [pk]: Object.assign({}, (this.state.psetBy || {})[pk] || {}, { archived: false }) }) }, 'Projekt wieder geöffnet.', ['Projekt', 'Status', 'abgeschlossen', 'laufend']) };
    const soonN = nodesP.filter(n => n.end >= '2026-11-13' && n.start <= '2027-01-12'), llCtx = name + ' ' + (U ? U.model : '') + ' ' + soonN.map(n => n.name).join(' ') + ' ' + open.map(x => x.title).join(' ');
    const llDis = ((s.llDis || {})[pk]) || {}, llTk = ((s.llTaken || {})[pk]) || {};
    const llh = Object.assign(this.llUI(llCtx, pk, { dis: llDis, taken: llTk, all: !!s.llAll, takeLbl: '+ Als Aufgabe übernehmen', takenLbl: '✓ Aufgabe angelegt',
      onTake: (w, rec, taken) => { if (taken) return; const id = 'llk' + (s.rev || 0) + '_' + TASKS.length, x = { id, title: rec.length > 90 ? w.title : rec, proj: name, due: this.isoAdd('2026-11-13', 14), bucket: 'Backlog', prio: 'Mittel', owner: 'Du', mine: true, ms: null, desc: 'Aus Lessons Learned „' + w.title + '“ (' + w.origin + '): ' + rec, est: 2, co: [] }; TASKS.push(x); TASK[id] = x;
        save({ rev: (this.state.rev || 0) + 1, llTaken: Object.assign({}, this.state.llTaken, { [pk]: Object.assign({}, llTk, { [w.id]: id }) }) }, 'Aufgabe „' + x.title + '“ angelegt, fällig ' + fd(x.due) + '.', ['Lesson Learned „' + w.title + '“', 'übernommen', '', 'Aufgabe']); },
      onDis: w => this.setState({ llDis: Object.assign({}, this.state.llDis, { [pk]: Object.assign({}, llDis, { [w.id]: true }) }), mxMsg: 'Hinweis ausgeblendet. Er erscheint in diesem Projekt nicht mehr.' }) }),
      { collapsible: true, showItems: !!s.llOpenP, toggle: () => this.setState({ llOpenP: !s.llOpenP }), toggleLabel: s.llOpenP ? 'Ausblenden ▴' : 'Anzeigen ▾', sub: (s.llOpenP ? 'passend zu den nächsten 60 Tagen: ' : 'Hinweise passend zu ') + (soonN.slice(0, 3).map(n => n.name).join(', ') || name), moreGo: () => this.setState({ llAll: true }), hasDis: Object.keys(llDis).length > 0, disLabel: Object.keys(llDis).length + ' ausgeblendet · wieder zeigen', disReset: () => this.setState({ llDis: Object.assign({}, this.state.llDis, { [pk]: {} }) }) });
    const dDE = iso => (iso ? iso.slice(8, 10) + '.' + iso.slice(5, 7) + '.' + iso.slice(0, 4) : ''), fileN = k => (PCODE[name] || name).replace(/[^\wäöüÄÖÜß-]+/g, '_') + '_' + k + '_2026-11-13.csv';
    const depsX = this.depsOf(), lvl = n => { let d = 0, p = PARENT[n.id]; while (p) { d++; p = PARENT[p]; } return d; };
    const exp = { open: !!s.expOpen, openA: s.expOpen ? 'true' : 'false', toggle: () => this.setState({ expOpen: !s.expOpen }),
      tasks: () => { const ok2 = this.dlCsv(fileN('Aufgaben'), ['Titel', 'Verantwortlich', 'Fällig', 'Status', 'Bucket', 'Priorität', 'Schätzung h'], tasks.map(x => [x.title, this.ownerOf(x), dDE(x.due), this.isDone(x) ? 'erledigt' : (x.due < '2026-11-13' ? 'überfällig' : 'offen'), this.bucketOf(x), x.prio || '', est(x)]));
        this.setState({ expOpen: false, mxMsg: ok2 ? tasks.length + ' Aufgaben als Excel-Datei (CSV) heruntergeladen.' : 'Download im Browser nicht möglich.' }); },
      dates: () => { const ok2 = this.dlCsv(fileN('Termine'), ['Ebene', 'Art', 'Name', 'Beginn', 'Ende', 'Status', 'Vorgänger'], nodesP.map(n => [lvl(n), n.type === 'phase' ? 'Phase' : (n.type === 'gate' ? (n.msPoint ? 'Meilenstein' : 'Quality Gate') : (n.kindLabel || 'Meilenstein')), '  '.repeat(lvl(n)) + n.name, n.type === 'gate' ? '' : dDE(n.start), dDE(n.end), this.nodeStatus(n), (depsX[n.id] || []).filter(id => NODE[id]).map(id => NODE[id].name).join(', ')]));
        this.setState({ expOpen: false, mxMsg: ok2 ? nodesP.length + ' Termine (Phasen, Meilensteine, Gates) als Excel-Datei heruntergeladen.' : 'Download im Browser nicht möglich.' }); },
      opl: () => { const ok2 = this.dlCsv(fileN('OffenePunkte'), ['ID', 'Art', 'Text', 'Wer', 'Bis / am', 'Status', 'Herkunft'], OP.map(o => [o.id, 'Offener Punkt', o.t, o.who, dDE(o.due), o.st, o.src || '']).concat(DC.map(d => [d.id, 'Entscheidung', d.t + (d.why ? ' (Warum: ' + d.why + ')' : ''), d.by, d.d, 'entschieden', d.src || ''])));
        this.setState({ expOpen: false, mxMsg: ok2 ? (OP.length + DC.length) + ' offene Punkte und Entscheidungen als Excel-Datei heruntergeladen.' : 'Download im Browser nicht möglich.' }); },
      pdf: () => { this.setState({ expOpen: false, ptab: 'planung', upTab: 'planung', mview: Object.assign({}, s.mview, { sm42p: 'gantt' }), mxMsg: '' }); setTimeout(() => { try { window.print(); } catch (e) { /* ohne Druck */ } }, 400); } };
    const AUw = AU.filter(r => wk(r.when) >= '1106'), catOf = r => (/Ende|Start|Fällig|Termin/.test(r.field) ? 'Termine verschoben' : (/^Risiko/.test(r.obj) && /angelegt/.test(r.field) ? 'Neue Risiken' : (/erledigt|bestanden|genehmigt|abgeschlossen|geschlossen/.test(String(r.b)) ? 'Erledigt und entschieden' : (/^E-/.test(r.obj) || /entschieden/.test(r.field) ? 'Entscheidungen' : 'Weitere Änderungen'))));
    const chgG = {}; AUw.forEach(r => { const k = catOf(r); (chgG[k] = chgG[k] || []).push(r.obj.replace(/^(Aufgabe|Phase|Meilenstein|Quality Gate|Arbeitspaket) /, '') + (r.a && r.a !== '–' ? ' ' + r.a + ' → ' + (r.b || '') : (r.b && r.b !== '–' ? ': ' + r.b : ''))); });
    const chgOrder = ['Termine verschoben', 'Neue Risiken', 'Erledigt und entschieden', 'Entscheidungen', 'Weitere Änderungen'].filter(k => chgG[k]), chgLines = chgOrder.map(k => k + ' (' + chgG[k].length + '): ' + chgG[k].slice(0, 3).join(' · ') + (chgG[k].length > 3 ? ' …' : ''));
    const SA = Object.assign({ on: false, ch: 'mail', att: true }, ((s.sbAuto || {})[pk]) || {}), setSA = p0 => this.setState({ sbAuto: Object.assign({}, this.state.sbAuto, { [pk]: Object.assign({}, SA, p0) }) });
    status.chg = { lines: chgOrder.map(k => ({ k, n: String(chgG[k].length), items: chgG[k].slice(0, 4).join(' · ') + (chgG[k].length > 4 ? ' …' : '') })), empty: !AUw.length, sum: AUw.length + ' Änderungen vom 06.11. bis 13.11., automatisch aus dem Verlauf zusammengefasst' };
    status.auto = { on: SA.on ? 'true' : 'false', onLabel: SA.on ? '✓ Jeden Freitag 14:00 automatisch' : 'Automatisch versenden: aus', onBg: SA.on ? '#107C10' : t.surface, onFg: SA.on ? '#FFFFFF' : t.text, toggle: () => { setSA({ on: !SA.on }); this.setState({ mxMsg: !SA.on ? 'Ab jetzt jeden Freitag 14:00: Statusbericht' + (SA.att ? ' mit Präsentation' : '') + ' an ' + sponsor + (SA.ch === 'teams' ? ' im Teams-Kanal des Projekts.' : ' per E-Mail.') + ' Nächster Versand: Fr 20.11. 14:00.' : 'Automatischer Versand ausgeschaltet.' }); },
      chans: [['mail', 'E-Mail'], ['teams', 'Teams-Kanal']].map(([k, l]) => chip(SA.ch === k, l, () => setSA({ ch: k }))), att: chip(SA.att, (SA.att ? '✓ ' : '+ ') + 'Präsentation anhängen', () => setSA({ att: !SA.att })), next: SA.on ? 'Nächster Versand: Freitag 20.11.2026, 14:00 · Am Freitag 10:00 bekommst du eine Erinnerung zum Prüfen.' : '' };
    const PS0 = [['titel', 'Titel'], ['status', 'Status und Ampel'], ['gantt', 'Termine (Gantt)'], ['ms', 'Meilensteine'], ['tasks', 'Offene Aufgaben'], ['team', 'Team und Zuständigkeiten'], ['kosten', 'Kosten'], ['risk', 'Risiken'], ['opl', 'Offene Punkte und Entscheidungen'], ['next', 'Nächste Schritte'], ['chg', 'Änderungen seit letzter Woche']];
    const pSel = Object.assign({}, ...PS0.map(([k]) => ({ [k]: true })), s.pptSel || {}), TPm = s.pptTpl || null, MDL = U ? U.model : (({ sm42: 'Wasserfall', rl2: 'Scrum', pd: 'V-Modell', ih: 'Kanban' })[pk] || '');
    const deck = () => { const roleOf = n => ((PMEMBERS[pk] || []).find(m => m[0] === n) || [])[1] || '', pctOf = n => ((PMEMBERS[pk] || []).find(m => m[0] === n) || [])[3] || '–';
      const ms = nodesP.filter(n => n.type === 'gate').sort((a, b) => (a.end < b.end ? -1 : 1)), lateT = open.filter(x => x.due < '2026-11-13'), stc2 = st => (st === 'erledigt' ? '107C10' : (st === 'ueberfaellig' ? 'C50F1F' : '242424'));
      const stTxt = st => ({ erledigt: 'erledigt', ueberfaellig: 'überfällig', plan: 'im Plan' })[st] || st;
      return { name, date: '13.11.2026', today: '2026-11-13', model: MDL, sub: [MDL, 'Projektleitung ' + (PL_OF[pk] || 'Du'), nodesP.length ? fd(nodesP.reduce((a, n) => (n.start < a ? n.start : a), '9999')) + ' – ' + fd(nodesP.reduce((a, n) => (n.end > a ? n.end : a), '0000')) : ''].filter(Boolean).join(' · '),
        amp, lights: status.lights.map(l => ({ l: l.l, v: l.v, c: /^#[0-9A-Fa-f]{6}$/.test(l.c) ? l.c.slice(1) : '808080' })), erreicht: status.erreicht, naechst: status.naechst, entsch: status.entsch, sel: pSel,
        nodes: nodesP.map(n => ({ name: n.name, a: n.type === 'gate' ? n.end : n.start, b: n.end, pt: n.type === 'gate', gate: n.type === 'gate' && !n.msPoint, phase: n.type === 'phase', lvl: lvl(n), st: this.nodeStatus(n) })),
        ms: ms.map(n => ({ name: (n.msPoint ? '◆ ' : '■ ') + n.name, date: dDE(n.end), st: stTxt(this.nodeStatus(n)), col: stc2(this.nodeStatus(n)) })),
        tasks: open.slice().sort((a, b) => (a.due < b.due ? -1 : 1)).map(x => ({ title: x.title, who: this.ownerOf(x), due: dDE(x.due), late: x.due < '2026-11-13' })), openCount: open.length, lateCount: lateT.length,
        team: mem.map(n => ({ name: n, role: roleOf(n), pct: pctOf(n), open: open.filter(x => this.ownerOf(x) === n).length })),
        budget, cost, nach: C.filter(c => c.st === 'genehmigt').reduce((a, c) => a + (c.cost || 0), 0), fE, kst: this.kstOf(pk) || '–', ia: this.iaOf(pk),
        risks: R.filter(r => r.st !== 'geschlossen').sort((a, b) => sc(b) - sc(a)).map(r => ({ sc: sc(r), c: rc(sc(r)).replace('#', ''), t: r.t, m: r.m || '–', o: r.o })),
        opl: OP.filter(o => o.st === 'offen').map(o => ({ id: o.id, t: o.t, who: o.who, due: dDE(o.due), late: o.due < '2026-11-13' })), dec: DC.map(d => ({ id: d.id, t: d.t, d: d.d })),
        chg: chgLines, nextLines: open.slice().sort((a, b) => (a.due < b.due ? -1 : 1)).slice(0, 5).map(x => x.title + ' (' + this.ownerOf(x) + ', bis ' + fd(x.due) + ')').concat(ms.filter(n => n.end >= '2026-11-13').slice(0, 2).map(n => (n.msPoint ? 'Meilenstein ' : 'Gate ') + n.name + ' am ' + fd(n.end))) }; };
    const tokVals = () => { const d0 = deck(), L = a => a.join('\n') || '–', clean = v => String(v).replace(/^• /gm, ''); return { Projekt: name, Projektleitung: PL_OF[pk] || 'Du', Zeitraum: d0.sub.split(' · ').pop(), Modell: MDL, Datum: d0.date, Ampel: amp, Termine: status.lights[0].v, Kosten: status.lights[1].v, Risiken: status.lights[2].v,
      Erreicht: clean(status.erreicht), NaechsteSchritte: clean(status.naechst), Entscheidungsbedarf: clean(status.entsch), Meilensteine: L(d0.ms.map(m0 => m0.name.slice(2) + ' – ' + m0.date + ' – ' + m0.st)),
      OffeneAufgaben: L(d0.tasks.slice(0, 12).map(x => x.title + ' (' + x.who + ', ' + x.due + ')')), Ueberfaellig: L(d0.tasks.filter(x => x.late).map(x => x.title + ' (' + x.who + ', ' + x.due + ')')), Team: L(d0.team.map(x => x.name + ' – ' + x.role + (x.open ? ', ' + x.open + ' offen' : ''))),
      Budget: budget ? fE(budget) : '–', Ist: fE(cost), Nachtraege: fE(d0.nach), Kostenstelle: d0.kst, Innenauftrag: d0.ia || '–', Risikoliste: L(d0.risks.map(r => r.t + ' (' + r.sc + ')')), OffenePunkte: L(d0.opl.map(o => o.id + ' ' + o.t + ' (' + o.who + ', ' + o.due + ')')), Entscheidungen: L(d0.dec.map(x => x.id + ' ' + x.t + ' (' + x.d + ')')), Aenderungen: L(d0.chg || []) }; };
    const pFile = k => (PCODE[name] || name).replace(/[^\wäöüÄÖÜß-]+/g, '_') + '_' + k + '_2026-11-13.pptx', busy = m0 => this.setState({ pptBusy: true, pptMsg: m0 }), fail = e => this.setState({ pptBusy: false, pptMsg: 'Fehler: ' + (e && e.message ? e.message : e) });
    const TOKS = ['Projekt', 'Projektleitung', 'Zeitraum', 'Modell', 'Datum', 'Ampel', 'Termine', 'Kosten', 'Risiken', 'Erreicht', 'NaechsteSchritte', 'Entscheidungsbedarf', 'Meilensteine', 'OffeneAufgaben', 'Ueberfaellig', 'Team', 'Budget', 'Ist', 'Nachtraege', 'Kostenstelle', 'Innenauftrag', 'Risikoliste', 'OffenePunkte', 'Entscheidungen'], br = k => '{' + '{' + k + '}' + '}';
    const ppt = { open: !!s.pptOpen, toggle: () => this.setState({ pptOpen: !s.pptOpen, expOpen: false, pptMsg: '' }), busy: !!s.pptBusy, msg: s.pptMsg || '', hasMsg: !!s.pptMsg,
      intro: 'Aus Status, Planung, Aufgaben, Team, Kosten, Risiken und offenen Punkten des Projekts. Mit deiner Vorlage übernimmt das Cockpit Farben, Schriften und Logo; Platzhalter wie ' + br('Projekt') + ' oder ' + br('OffeneAufgaben') + ' füllt es direkt in deinen eigenen Folien aus.',
      hasTpl: !!TPm, noTpl: !TPm, tplName: TPm ? TPm.name : '', tplInfo: TPm ? TPm.slides + ' Folien · Schrift ' + (TPm.fonts.major || 'Standard') + (TPm.hasLogo ? ' · Logo übernommen' : ' · kein Logo') : '',
      hasTok: !!TPm && TPm.tokens.length > 0, tokTxt: TPm ? (TPm.tokens.length ? 'Platzhalter in der Vorlage: ' + TPm.tokens.map(br).join(', ') : 'Keine Platzhalter gefunden. Das Cockpit erzeugt einen eigenen Foliensatz im Design der Vorlage.') : '',
      colors: TPm ? Object.values(TPm.colors).slice(0, 6).map(c => ({ c: '#' + c })) : [],
      upload: e => { const f0 = e && e.target && e.target.files ? e.target.files[0] : null; if (!f0) return; if (!/\.pptx$/i.test(f0.name)) return this.setState({ pptMsg: 'Bitte eine .pptx-Datei wählen (PowerPoint ab 2007).' }); busy('Vorlage wird gelesen …'); f0.arrayBuffer().then(b => this.pptLoad(b, f0.name)).then(() => this.setState({ pptBusy: false })).catch(fail); },
      drop: () => { this._pptTpl = null; this.setState({ pptTpl: null, pptMsg: 'Vorlage entfernt. Es gilt wieder das Cockpit-Design.' }); },
      slides: PS0.map(([k, l]) => chip(!!pSel[k], (pSel[k] ? '✓ ' : '+ ') + l, () => this.setState({ pptSel: Object.assign({}, pSel, { [k]: !pSel[k] }) }))),
      make: () => { busy('Präsentation wird erzeugt …'); this.pptMake(deck(), pFile('Status')).then(n0 => this.setState({ pptBusy: false, pptMsg: 'Präsentation mit ' + n0 + ' Folien heruntergeladen' + (TPm ? ', im Design von „' + TPm.name + '“.' : ', im Cockpit-Design.') })).catch(fail); },
      fill: () => { busy('Vorlage wird ausgefüllt …'); this.pptFill(tokVals(), pFile('aus_Vorlage')).then(r0 => this.setState({ pptBusy: false, pptMsg: r0.n + ' Platzhalter ausgefüllt' + (r0.miss.length ? '; unbekannt: ' + r0.miss.map(br).join(', ') : '') + '. Datei heruntergeladen.' })).catch(fail); },
      deckData: () => deck(),
      sample: () => { busy('Mustervorlage wird erzeugt …'); this.pptMake(deck(), 'Mustervorlage_mit_Platzhaltern.pptx', true).then(() => this.setState({ pptBusy: false, pptMsg: 'Mustervorlage heruntergeladen. In PowerPoint ins Firmendesign übernehmen, Platzhalter stehen lassen und als Vorlage hochladen.' })).catch(fail); },
      tokenList: TOKS.map(br).join('  '), tokHint: 'Steht ein Listen-Platzhalter wie ' + br('OffeneAufgaben') + ' allein in einer Zeile, wird er zu mehreren Zeilen; im Fließtext werden Einträge mit · getrennt.' };
    const is = { close: tab === 'close', opl: tab === 'opl', risk: tab === 'risk', zeit: tab === 'zeit', res: tab === 'res', status: tab === 'status', cr: tab === 'cr', audit: tab === 'audit' };
    const conf = tab === 'res' ? this.resConf(mem, pk, t, accent) : { rows: [], empty: true };
    return { is, exp, ppt, llh, close, opl, risk, zeit, res, conf, cr, status, audit, fin, team, resOn: !!(on && on('res')), msg: s.mxMsg || '', hasMsg: !!s.mxMsg }; }
  labelsOf(pk) { const del = ((this.state.lblDel || {})[pk]) || {}; return LABELS.concat(((this.state.lblX || {})[pk]) || []).filter(l => !del[l[0]]); }
  layOf(key, def) { const L = (this.state.lay || {})[key] || {}; const order = (L.order || []).filter(k => def.includes(k)).concat(def.filter(k => !(L.order || []).includes(k))); return { order, hide: L.hide || {} }; }
  layUI(key, def, names, fixed, t, accent, wDef) { const L = this.layOf(key, def), set = patch => this.setState({ lay: Object.assign({}, this.state.lay, { [key]: Object.assign({}, L, patch) }) });
    const out = { open: this.state.layOpen === key, toggle: () => this.setState({ layOpen: this.state.layOpen === key ? null : key }) };
    out.items = L.order.map((k, i) => { const on = !L.hide[k]; return { label: names[k], pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, mark: fixed.includes(k) ? '' : (on ? '✓ ' : '+ '),
      go: () => (fixed.includes(k) ? null : set({ hide: Object.assign({}, L.hide, { [k]: on }) })), up: () => { if (!i) return; const o = L.order.slice(); [o[i - 1], o[i]] = [o[i], o[i - 1]]; set({ order: o }); }, down: () => { if (i === L.order.length - 1) return; const o = L.order.slice(); [o[i + 1], o[i]] = [o[i], o[i + 1]]; set({ order: o }); } }; });
    const W = Object.assign({}, wDef || {}, (((this.state.lay || {})[key] || {}).w) || {}), dk = k => 'lay|' + key + '|' + k;
    def.forEach(k => { const half = W[k] === 'half', hot = this.state.dragOver === dk(k);
      out[k] = { show: !L.hide[k] || fixed.includes(k), order: String(L.order.indexOf(k) + 1), col: half ? 'span 1' : '1 / -1', flex: half ? '1 1 340px' : '1 1 100%', ol: hot ? '2px dashed ' + accent : 'none', canHide: !fixed.includes(k),
        wLabel: half ? '▭ ganze Breite' : '◧ halbe Breite', wide: () => set({ w: Object.assign({}, W, { [k]: half ? 'full' : 'half' }) }), hide: () => set({ hide: Object.assign({}, L.hide, { [k]: true }) }),
        drag: this.dragStart(dk(k)), dragEnd: this.dragEnd(), over: this.dragOver(dk(k)),
        drop: this.dropOn(dk(k), id => { const p = String(id).split('|'); if (p[0] !== 'lay' || p[1] !== key || p[2] === k) return; const o = L.order.filter(x => x !== p[2]); o.splice(o.indexOf(k), 0, p[2]); set({ order: o }); }) }; });
    out.hint = 'Bereiche am ⠿ ziehen, Breite umschalten oder mit ✕ ausblenden.'; return out; }
  nodeMove(u, fromId, toId) { if (!fromId || fromId === toId) return; const n = NODE[fromId], tg = NODE[toId]; if (!n || !tg) return;
    const listOf = id => (PARENT[id] ? (NODE[PARENT[id]].children = NODE[PARENT[id]].children || []) : u.tree);
    if (n.type === 'phase' && tg.type !== 'phase') return this.setState({ pnMsg: 'Phasen lassen sich nur vor eine andere Phase ziehen.' });
    if (n.children && n.children.includes(tg)) return;
    const src = listOf(fromId), i = src.indexOf(n); if (i < 0) return; src.splice(i, 1);
    let msg, par = null;
    if (tg.type === 'phase' && n.type !== 'phase') { tg.children = tg.children || []; tg.children.push(n); PARENT[fromId] = toId; par = tg; msg = '„' + n.name + '“ liegt jetzt in „' + tg.name + '“.'; }
    else { const dest = listOf(toId), j = dest.indexOf(tg); dest.splice(j < 0 ? dest.length : j, 0, n); PARENT[fromId] = PARENT[toId] || null; par = PARENT[toId] ? NODE[PARENT[toId]] : null; msg = '„' + n.name + '“ steht jetzt vor „' + tg.name + '“' + (par ? ' in „' + par.name + '“' : '') + '.'; }
    if (par) msg += this.fitInto(n, par);
    this.setState({ rev: (this.state.rev || 0) + 1, pnMsg: msg }); }
  canPlan(pk) { const r = (PMEMBERS[pk] || []).find(x => x[0] === 'Du'); return !r || r[1] === 'Owner' || r[1] === 'Bearbeiter'; }
  dateEdit(n, can) { const pt = n.type === 'gate', ok = v => /^\d{4}-\d\d-\d\d$/.test(v || '') && +v.slice(0, 4) >= 2020 && +v.slice(0, 4) <= 2100, val = e => (e && e.target ? e.target.value : '');
    return { edit: !!can, ro: !can, roTitle: can ? '' : 'Nur lesen: Termine ändern dürfen Owner und Bearbeiter.', range: !pt, a: n.start, b: n.end, aLabel: 'Beginn ' + n.name, bLabel: (pt ? 'Termin ' : 'Ende ') + n.name, bTitle: pt ? 'Termin ändern' : 'Ende ändern',
      setA: e => { const v = val(e); if (ok(v)) this.setNodeDate(n.id, 'start', v); }, setB: e => { const v = val(e); if (ok(v)) this.setNodeDate(n.id, pt ? 'start' : 'end', v); } }; }
  setDue(id, iso) { const x = TASK[id]; if (!x || !/^\d{4}-\d\d-\d\d$/.test(iso || '')) return; this.logH('t:' + id, 'Fällig', fmt(D(x.due)), fmt(D(iso))); x.due = iso; this.setState({ rev: (this.state.rev || 0) + 1, pMsg: 'Fällig jetzt am ' + fmt(D(iso)) + D(iso).getFullYear() + '.' }); }
  coOf(x) { const o = this.state.coOv && this.state.coOv[x.id]; return o || x.co || []; }
  pkOfNode(id) { let r = id; while (PARENT[r]) r = PARENT[r]; return Object.keys(PTREE_OF).find(k => PTREE_OF[k].some(n => n.id === r)) || 'sm42'; }
  pkOf(x) { return PK_OF[x.proj] || 'arbeit'; }
  bucketsOf(pk) { return (this.state.bucketsBy && this.state.bucketsBy[pk]) || DEF_BUCKETS; }
  lblName(pk, k) { const o = ((this.state.lblNames || {})[pk] || {})[k]; return o || (this.labelsOf(pk).find(l => l[0] === k) || LABELS.find(l => l[0] === k) || ['', k])[1]; }
  kenn(x) { if (!x) return ''; if (!x.kid) { const u = (this.state.uprojs || []).find(u2 => u2.name === x.proj), c = PCODE[x.proj] || (u ? u.code : 'ICH'); KCNT[c] = (KCNT[c] || 100) + 1; x.kid = c + '-' + KCNT[c]; } return x.kid; }
  logH(key, field, a, b) { if (a === b) return; const h = Object.assign({}, this.state.hist), l = (h[key] || HIST_SEED[key] || []).concat([['13.11. ' + ['09:12', '09:40', '10:05', '11:18', '13:30', '14:02', '15:25'][(h[key] || []).length % 7], 'Du', field, String(a), String(b)]]); h[key] = l; this.setState({ hist: h }); }
  blockersOf(id) { const L = this.state.lnk || LNK_SEED, out = []; (L[id] || []).forEach(([ty, o]) => { if (ty === 'blockiert durch' && TASK[o] && TASKS.includes(TASK[o]) && !this.isDone(TASK[o])) out.push(o); });
    Object.keys(L).forEach(k => (L[k] || []).forEach(([ty, o]) => { if (o === id && ty === 'blockiert' && TASK[k] && TASKS.includes(TASK[k]) && !this.isDone(TASK[k])) out.push(k); })); return out; }
  trashTask(id) { const x = TASK[id], i = TASKS.indexOf(x); if (i < 0) return; TASKS.splice(i, 1); let ms = null; Object.values(NODE).forEach(n => { if (n.tasks && n.tasks.includes(id)) { ms = n.id; n.tasks = n.tasks.filter(z => z !== id); } });
    this.logH('t:' + id, 'Gelöscht', 'aktiv', 'Papierkorb'); this.setState({ trash: (this.state.trash || []).concat([{ id, ms, when: '13.11.2026', by: 'Du' }]), panel: null, delAsk: null, rev: (this.state.rev || 0) + 1, boardMsg: '„' + x.title + '“ (' + this.kenn(x) + ') liegt im Papierkorb. Wiederherstellen unter Projekte › Papierkorb, 30 Tage lang.' }); }
  restoreTask(id) { const e = (this.state.trash || []).find(z => z.id === id), x = TASK[id]; if (!e || !x) return; TASKS.push(x); if (e.ms && NODE[e.ms]) NODE[e.ms].tasks = (NODE[e.ms].tasks || []).concat([id]);
    this.logH('t:' + id, 'Wiederhergestellt', 'Papierkorb', 'aktiv'); this.setState({ trash: this.state.trash.filter(z => z.id !== id), rev: (this.state.rev || 0) + 1, trMsg: '„' + x.title + '“ ist wieder da, mit Verknüpfungen, Dateien und Verlauf.' }); }
  polishMail(raw, tone, ctx) { ctx = ctx || {}; tone = tone || 'freundlich';
    const ABBR = [[/\bbzgl\.?/gi, 'bezüglich'], [/\basap\b/gi, 'so bald wie möglich'], [/\b(pls|plz)\b/gi, 'bitte'], [/\bthx\b/gi, 'vielen Dank'], [/\bz\.\s?b\.?/gi, 'zum Beispiel'], [/\bggf\.?/gi, 'gegebenenfalls'], [/\bmgl\.?(?=\s|$)/gi, 'möglich'], [/\bwg\.?(?=\s)/gi, 'wegen'], [/\bfyi\b/gi, 'zur Info'], [/\bkw ?(\d+)/gi, 'KW $1'], [/\bmo\b/gi, 'Montag'], [/\bfr\b/gi, 'Freitag'], [/\bu\.\s?a\./gi, 'unter anderem'], [/\bi\.\s?o\./gi, 'in Ordnung'], [/\bdh\.?|d\.\s?h\./gi, 'das heißt'], [/\bev\.?|evtl\.?/gi, 'eventuell'], [/\bbtw\b/gi, 'übrigens']];
    const STOCK = /^(ich hoffe, es geht (dir|ihnen) gut|vielen dank für (deine|ihre) nachricht|ich wende mich mit folgendem anliegen an sie|für rückfragen stehe ich ihnen gern zur verfügung|melde dich gern, wenn etwas unklar ist|kannst du mir bitte kurz folgende punkte beantworten|könnten sie mir bitte folgende punkte beantworten|bitte (gib mir|geben sie mir) bis .* bescheid, damit wir den termin halten|dein name|danke und gruß)[.:]?$/i;
    const lines = String(raw || '').split(/\n+/).map(l => l.trim().replace(/^[•*-]\s*/, '')).filter(Boolean).filter(l => !STOCK.test(l)).filter(l => !/^(hallo|hi|hey|moin|servus|guten (tag|morgen|abend)|sehr geehrte[rn]?|liebe|lieber)\b/i.test(l) && !/^(mfg|vg|lg|gruß|grüße|gruss|viele grüße|beste grüße|freundliche grüße|mit freundlichen grüßen|danke und gruß)\b/i.test(l) && !/^betreff\s*:/i.test(l));
    let body = lines.join(' '); ABBR.forEach(([r, v]) => { body = body.replace(r, v); }); body = body.replace(/\s+/g, ' ').replace(/\s+([,.!?])/g, '$1').trim();
    let sents = body.split(/(?<=[.!?:])\s+|\s*;\s*|\s+-\s+|\s*•\s*/).map(x => x.trim()).filter(x => x.length > 1 && !STOCK.test(x)).map(x => { x = x.charAt(0).toUpperCase() + x.slice(1); if (!/[.!?:]$/.test(x)) x += /^(kannst|könnt|können|hast|habt|ist|sind|wann|wie|wo|was|wer|gibt|wäre|würde|bitte um rückmeldung ob)\b/i.test(x) ? '?' : '.'; return x; });
    if (!sents.length) sents = ['(Hier steht noch kein Inhalt.)'];
    const to = String(ctx.to || '').replace(/\s*\(.*\)$/, '').trim(), last = to.split(/\s+/).pop() || '', isCo = /gmbh|\bag\b|\bkg\b|lieferant|rexroth|festo|würth|siemens|sick|pilz|vertrieb|einkauf|team/i.test(to) && !/^(herr|frau|hr\.|fr\.)/i.test(to);
    const name = to && !isCo ? (/^(herr|frau|hr\.|fr\.)/i.test(to) ? to.replace(/^hr\.?/i, 'Herr').replace(/^fr\.?/i, 'Frau') : last) : '';
    const greet = tone === 'formell' ? (name && /^(herr|frau)/i.test(name) ? 'Sehr geehrte' + (/^frau/i.test(name) ? ' ' : 'r ') + name + ',' : 'Sehr geehrte Damen und Herren,') : (name ? 'Hallo ' + name + ',' : 'Hallo zusammen,');
    const close = tone === 'formell' ? 'Mit freundlichen Grüßen' : (tone === 'knapp' ? 'Danke und Gruß' : 'Viele Grüße');
    let core = sents; if (tone === 'knapp') core = sents.slice(0, 3);
    const qs = core.filter(x => /\?$/.test(x)), st = core.filter(x => !/\?$/.test(x));
    const parts = [], sie = tone === 'formell' || /^(Herr|Frau)\b/.test(name) || isCo;
    if (tone === 'freundlich') parts.push(ctx.reply ? (sie ? 'vielen Dank für Ihre Nachricht.' : 'vielen Dank für deine Nachricht.') : (sie ? 'ich hoffe, es geht Ihnen gut.' : 'ich hoffe, es geht dir gut.'));
    if (tone === 'formell') parts.push(ctx.reply ? 'vielen Dank für Ihre Nachricht.' : 'ich wende mich mit folgendem Anliegen an Sie.');
    if (st.length) parts.push(st.join(' '));
    if (qs.length >= 2) parts.push((sie ? 'Könnten Sie mir bitte folgende Punkte beantworten:' : 'Kannst du mir bitte kurz folgende Punkte beantworten:') + '\n' + qs.map(q => '• ' + q).join('\n'));
    else if (qs.length) parts.push(qs[0]);
    if (tone === 'frist') parts.push(sie ? 'Bitte geben Sie mir bis ' + (ctx.frist || 'Mittwoch, 18.11.') + ' Bescheid, damit wir den Termin halten.' : 'Bitte gib mir bis ' + (ctx.frist || 'Mittwoch, 18.11.') + ' Bescheid, damit wir den Termin halten.');
    if (tone !== 'knapp' && tone !== 'frist') parts.push(sie ? 'Für Rückfragen stehe ich Ihnen gern zur Verfügung.' : 'Melde dich gern, wenn etwas unklar ist.');
    const subject = ctx.subject || (() => { const w = st.concat(qs)[0].replace(/[.!?]$/, '').split(/\s+/).slice(0, 7).join(' '); return w.length > 60 ? w.slice(0, 57) + '…' : w; })();
    const text = greet + '\n\n' + (tone === 'frist' ? (parts[0] ? parts.join('\n\n') : '') : parts.join('\n\n')).replace(/^vielen/, 'vielen').replace(/^ich/, 'ich') + '\n\n' + close + '\n' + (ctx.sig || 'Dein Name');
    return { subject, text: (text.charAt(0).toUpperCase() + text.slice(1)) }; }
  pnm(pk) { return PNAME_OF[pk] || ((this.state.uprojs || []).find(u => u.key === pk) || {}).name || ''; }
  modGroups(ps, toggle, t, accent, own, isV) { const INFO = { tasks: ['Liste, Board, Kalender, Personen, Dateien an jeder Aufgabe', 'Reiter Aufgaben'], plan: ['Phasen, Meilensteine, Quality Gates, Arbeitspakete', 'Reiter Planung'], zeit: ['Zeiten an Aufgaben buchen, Wochenzettel', 'Reiter Zeiten'], docs: ['Dokumente und Fotos am Projekt', 'Aufgabe › Dateien'],
      res: ['Auslastung je Person, Überlastung, Ausgleich', 'Reiter Kapazität'], budget: ['Budget, Kosten, Rechnungen, Nachträge', 'Reiter Finanzen'], risk: ['Risikoregister mit Wahrscheinlichkeit × Auswirkung, Maßnahmen', 'Reiter Risiken'], raci: ['Wer führt aus, verantwortet, wird gefragt, informiert; AKV mit Freigabegrenzen', 'Reiter Team › RACI und AKV'],
      status: ['Statusbericht mit Ampel für Auftraggeber und Portfolio', 'Reiter Statusbericht'], opl: ['Offene-Punkte-Liste und Entscheidungslog, aus Besprechungen übernehmbar', 'Reiter Offene Punkte'], close: ['Abnahme, Restarbeiten, Lessons Learned, Abschlussbericht, Archivieren', 'Reiter Abschluss'], req: ['Anforderungen mit Nachweis', own ? 'Reiter Anforderungen' : 'Planung › V-Modell'], cr: ['Änderungen an Umfang, Termin, Kosten mit Freigabe', 'Reiter Change Requests'], test: ['Testfälle zu Anforderungen, Nachweis je Anforderung', own ? 'Reiter Anforderungen' : 'Planung › Verfolgbarkeit'], audit: ['Prüfpfad aller Änderungen im Projekt, Export', 'Reiter Verlauf'] };
    const vOnly = k => (k === 'req' || k === 'test') && !isV;
    const isOn = k => { if (vOnly(k)) return false; const m = P_MODS.find(x => x[0] === k); return ps.mods && ps.mods[k] !== undefined ? ps.mods[k] : (m ? m[2] <= ps.stufe : true); };
    return [[1, 'Immer dabei'], [2, 'Ab Stufe 2 · Projekt'], [3, 'Ab Stufe 3 · Gesteuert'], [4, 'Stufe 4 · Reguliert']].map(([lv, title]) => ({ title, items: P_MODS.filter(m => m[2] === lv).map(([k, label]) => { const on = isOn(k), fixed = k === 'tasks', soon = /kommt/.test(INFO[k][1]);
      const vo = vOnly(k); return { name: label, desc: INFO[k][0], where: vo ? 'nur im V-Modell' : (on ? '→ ' + INFO[k][1] : (lv > ps.stufe ? 'aus (Stufe ' + lv + ')' : 'ausgeschaltet')), whereColor: on ? (soon ? '#A33F06' : accent) : t.muted, checked: on ? 'true' : 'false', track: on ? (fixed ? t.strong : '#107C10') : (vo ? t.surface2 : t.border), justify: on ? 'flex-end' : 'flex-start', cursor: fixed || vo ? 'not-allowed' : 'pointer', go: () => (fixed || vo ? null : toggle(k, on, label)) }; }) })); }
  memberUI(pk, t, accent, akvOn) { const s = this.state, U = (s.uprojs || []).find(u => u.key === pk), ini0 = n => n === 'Kunde' ? 'KD' : n.split(/[ .]+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    if (!PMEMBERS[pk]) PMEMBERS[pk] = U ? U.members.map(m => [m, m === (PL_OF[pk] || 'Du') ? 'Owner' : 'Bearbeiter']) : [];
    const L = PMEMBERS[pk], R5 = ['Owner', 'Bearbeiter', 'Mitwirkender', 'Leser', 'Gast'], RB = { Owner: '#5B2D90', Bearbeiter: '#0F6CBD', Mitwirkender: '#0E6E7A', Leser: '#5C5C5C', Gast: '#8A3707' };
    const RH = { Owner: 'Darf alles, auch Einstellungen und Mitglieder', Bearbeiter: 'Aufgaben, Planung und Dateien bearbeiten', Mitwirkender: 'Eigene Aufgaben bearbeiten und kommentieren', Leser: 'Nur lesen', Gast: 'Extern, sieht nur Freigegebenes' };
    const PC = ['–', '10 %', '20 %', '30 %', '50 %', '100 %'], AK = [[0, '–'], [1000, '1.000 €'], [5000, '5.000 €'], [25000, '25.000 €']];
    const TM = Object.values(TEAMS), teamOf = n => { if (n === 'Kunde') return 'extern'; const T = TM.find(T0 => T0.members.some(m => m[0] === n)); if (T) return T.name; for (const k in PMEMBERS) { const r = PMEMBERS[k].find(x => x[0] === n && x[2]); if (r) return r[2]; } return '–'; };
    const akvM = Object.assign({}, (s.mbrAkv || {})[pk] || {}), akvOf = n => (akvM[n] !== undefined ? akvM[n] : ((L.find(x => x[0] === n) || [])[1] === 'Owner' ? 5000 : 0)), owners = L.filter(x => x[1] === 'Owner').length;
    const commit = (list, msg, extra) => { PMEMBERS[pk] = list; const patch = Object.assign({ rev: (this.state.rev || 0) + 1, mbrMsg: msg, mbrMsgPk: pk }, extra || {}); if (U) patch.uprojs = (this.state.uprojs || []).map(u => (u.key === pk ? Object.assign({}, u, { members: list.filter(x => !x[4]).map(x => x[0]) }) : u)); this.setState(patch); };
    const chip = (on, go, label, hint) => ({ label, hint: hint || '', pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go });
    const inv = s.mbrInv === pk, q = (s.mbrQ || '').trim(), ql = q.toLowerCase(), have = new Set(L.map(x => x[0])), who = s.mbrWho && !have.has(s.mbrWho) ? s.mbrWho : null, role = s.mbrRole || 'Bearbeiter', pct = s.mbrPct || '20 %';
    const cands = Object.keys(AV).filter(n => !['System', 'Kunde'].includes(n) && !have.has(n)).map(n => ({ n, isT: false, sub: teamOf(n), color: AV[n], code: ini0(n) }))
      .concat(TM.filter(T => !have.has('Team ' + T.name)).map(T => ({ n: 'Team ' + T.name, isT: true, sub: 'ganzes Team · ' + T.members.length + ' Personen · Leitung ' + T.lead, color: T.color, code: T.code })))
      .concat(ql ? DIR.filter(d => !have.has(d[0]) && !AV[d[0]]).map(d => ({ n: d[0], isT: false, sub: d[1], color: '#5C5C5C', code: ini0(d[0]) })) : [])
      .filter(c => !ql || c.n.toLowerCase().includes(ql) || c.sub.toLowerCase().includes(ql));
    const add = (name, isT, r, p0, tm) => commit(L.concat([[name, r, tm, p0, isT]]), (isT ? name + ' ist als ' + r + ' im Projekt. Aufgaben kannst du jetzt an das ganze Team geben; die Teamleitung verteilt sie.' : name + ' ist als ' + r + ' im Projekt' + (p0 !== '–' ? ' (' + p0 + ')' : '') + '.') + ' Benachrichtigung geht per Mail raus (im Entwurf simuliert).', { mbrInv: null, mbrWho: null, mbrQ: '' });
    return { akvOn: !!akvOn, akvCol: akvOn ? '130px' : '0px', count: L.length + (L.length === 1 ? ' Mitglied' : ' Mitglieder'), hasMsg: !!s.mbrMsg && s.mbrMsgPk === pk, msg: s.mbrMsg || '',
      inv: { open: inv, openA: inv ? 'true' : 'false', btn: inv ? '✕ Einladen schließen' : '+ Person oder Team einladen', btnBg: inv ? t.soft : t.surface, toggle: () => this.setState({ mbrInv: inv ? null : pk, mbrQ: '', mbrWho: null, mbrMsg: '' }),
        q, setQ: e => this.setState({ mbrQ: e && e.target ? e.target.value : '' }),
        candInfo: ql ? cands.length + ' Treffer' + (cands.length > 9 ? ', die ersten 9. Genauer suchen.' : '') : 'Vorschläge. Die Suche findet alle 500 Kollegen nach Name, Team oder Abteilung.', cands: cands.slice(0, 9).map(c => ({ label: c.n, sub: c.sub, ini: c.code, color: c.color, round: c.isT ? '8px' : '50%', pressed: who === c.n ? 'true' : 'false', ring: who === c.n ? accent : t.border, bg: who === c.n ? t.soft : t.surface, go: () => this.setState({ mbrWho: who === c.n ? null : c.n }) })),
        none: !cands.length, canGuest: q.length > 2, guestLabel: '„' + q + '“ als Gast (extern) einladen', guest: () => add(q, false, 'Gast', '–', 'extern'),
        roles: R5.map(r => chip(role === r, () => this.setState({ mbrRole: r }), r)), roleHint: RH[role], pcts: PC.map(p0 => chip(pct === p0, () => this.setState({ mbrPct: p0 }), p0)),
        sendLabel: who ? who + ' als ' + role + ' einladen' : 'Erst Person oder Team wählen', sendBg: who ? accent : t.strong,
        note: who && /^Team /.test(who) ? 'Das Team erscheint als eine Zeile; Aufgaben gehen dann an „' + who + '“.' : (who ? (t0 => who + ' ist dann insgesamt bei ' + t0 + ' % (100 % = ' + CAP_WEEK_H + ' h/Woche planbar)' + (t0 > 100 ? ' – überbucht, mit Teamleitung klären.' : '.'))(projPctOf(who, pk).sum + pctNum(pct)) : 'Kollegen sind sofort im Projekt; der Projektanteil zählt in Teamplanung und Auslastung.'),
        send: () => { if (!who) return this.setState({ mbrMsg: 'Erst eine Person oder ein Team auswählen.', mbrMsgPk: pk }); const isT = /^Team /.test(who); add(who, isT, role, pct, isT ? who.slice(5) : teamOf(who)); } },
      rows: L.map(x => { const [n, r, tm, p0, isT] = x, key = pk + '|' + n, ed = s.mbrEdit === key, T = isT ? TM.find(T0 => 'Team ' + T0.name === n) : null, lastOwner = r === 'Owner' && owners === 1, ak = akvOf(n);
        const upd = (patch, msg) => commit(L.map(y => (y[0] === n ? [n, patch.r || y[1], y[2] || teamOf(n), patch.p || y[3] || '–', y[4]] : y)), msg);
        const tot = isT ? null : projPctOf(n);
        return { tot: tot && tot.list.length > 1 ? 'gesamt ' + tot.sum + ' %' + (tot.sum > 100 ? ' ⚠' : '') : '', totColor: tot && tot.sum > 100 ? '#C50F1F' : t.muted, name: n, ini: T ? T.code : ini0(n), color: T ? T.color : (AV[n] || '#5C5C5C'), round: isT ? '8px' : '50%', role: r, roleBg: RB[r] || '#5C5C5C', team: tm || teamOf(n), pct: p0 || '–',
          hasSub: n === (PL_OF[pk] || 'Du') || !!isT, sub: isT ? 'ganzes Team' + (T ? ' · Leitung ' + T.lead : '') : 'Projektleitung', rowBg: ed ? t.soft : 'transparent',
          akv: ak ? ak.toLocaleString('de-DE') + ' €' : '–', akvColor: ak ? t.text : t.muted,
          editing: ed, editA: ed ? 'true' : 'false', editLabel: n + ' bearbeiten', edit: () => this.setState({ mbrEdit: ed ? null : key }),
          roles: R5.map(r2 => chip(r === r2, () => (lastOwner && r2 !== 'Owner' ? this.setState({ mbrMsg: 'Mindestens ein Owner muss bleiben. Mach zuerst jemand anderen zum Owner.', mbrMsgPk: pk }) : upd({ r: r2 }, n + ' ist jetzt ' + r2 + '. ' + RH[r2] + '.')), r2, RH[r2])),
          pcts: PC.map(p2 => chip((p0 || '–') === p2, () => upd({ p: p2 }, n + ': Projektanteil ' + p2 + '.'), p2)),
          akvs: AK.map(([v0, l]) => chip(ak === v0, () => this.setState({ mbrAkv: Object.assign({}, s.mbrAkv, { [pk]: Object.assign({}, akvM, { [n]: v0 }) }), mbrMsg: n + (v0 ? ' darf jetzt bis ' + l + ' freigeben.' : ' gibt nichts frei.'), mbrMsgPk: pk }), l)),
          canRemove: !lastOwner && n !== (PL_OF[pk] || 'Du'), remove: () => commit(L.filter(y => y[0] !== n), n + ' ist nicht mehr im Projekt. Offene Aufgaben von ' + n + ' bitte neu verteilen (Aufgaben › Personen).', { mbrEdit: null }) }; }) }; }
  loadV2(txt) { let d; try { d = typeof txt === 'string' ? JSON.parse(txt.replace(/^\uFEFF/, '')) : txt; } catch (er) { return this.setState({ v2Msg: 'Der Inhalt ist kein gültiges JSON. Bitte die Datei cockpit_import.json komplett nehmen.' }); }
    if (!d || d.format !== 'cockpit-v2-import' || !Array.isArray(d.projects)) return this.setState({ v2Msg: 'Das ist keine cockpit_import.json. Die Datei entsteht mit v2_zu_cockpit.py im Ordner v2_export.' });
    const have = new Set((this.state.uprojs || []).map(u => u.key)), ups = d.projects.filter(p => !have.has(p.key));
    const reg = (list, parent, flat) => list.forEach(n => { n.children = n.children || []; n.tasks = n.tasks || []; n.owner = n.owner || 'Du'; NODE[n.id] = n; PARENT[n.id] = parent; flat.push(n); reg(n.children, n.id, flat); });
    ups.forEach(u => { const flat = []; reg(u.tree || [], null, flat); u.nodes = flat; PTREE_OF[u.key] = u.tree; PK_OF[u.name] = u.key; PL_OF[u.key] = 'Du'; PCODE[u.name] = u.code; if (!PMEMBERS[u.key]) PMEMBERS[u.key] = [['Du', 'Owner', 'Automatisierung', '–']]; });
    const bk = Object.assign({}, this.state.bk), done = Object.assign({}, this.state.done); let n = 0;
    (d.tasks || []).forEach(x => { if (TASK[x.id]) return; const y = Object.assign({}, x); delete y.done; TASKS.push(y); TASK[y.id] = y; bk[y.id] = x.bucket; done[y.id] = !!x.done; n++; });
    const all = (this.state.v2Keys || []).concat(ups.map(u => u.key));
    this.setState({ uprojs: (this.state.uprojs || []).concat(ups), bk, done, rev: (this.state.rev || 0) + 1, v2Keys: all, v2Raw: '', v2Paste: false,
      v2Msg: ups.length ? ups.length + (ups.length === 1 ? ' Projekt' : ' Projekte') + ' und ' + n + ' Aufgaben übernommen. Sie stehen unter Projekte, in Meine Aufgaben und im Dashboard.' : 'Diese Projekte sind schon übernommen.' }); }
  mtaUI(o) { const s = this.state, t = o.t, accent = o.accent, K = o.key, open = !!(s.mtaOpenBy || {})[K], hide = (s.mtaHideBy || {})[K] || {}, R = o.reports || [], H = o.hist || {}, bm = o.blMap || {};
    const add = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n), X0 = R.length ? D(R[0]) : add(TODAY, -14), X1 = add(TODAY, 14);
    const all = [], leaf = []; (function w(l) { l.forEach(n => { if (n.type === 'ms' || n.type === 'gate') all.push(n); else if (!(n.children || []).length) leaf.push(n); if (n.children) w(n.children); }); })(o.tree || []);
    const ms = (all.length ? all : leaf).filter(n => D(n.end) >= X0 || !n.done);
    const items0 = ms.map((n, i) => { const base = (bm[n.id] || [n.start, n.end])[1], hist = R.map((r, k) => (H[n.id] || [])[k] || base), pts = [];
      R.forEach((r, k) => { if (!n.done || D(r) <= D(n.end)) pts.push([D(r), D(hist[k])]); });
      if (n.done) pts.push([D(n.end) < X0 ? X0 : D(n.end), D(n.end)]); else pts.push([TODAY, D(n.end)]);
      const dv = dd(D(base), D(n.end)), last = hist.length ? dd(D(hist[hist.length - 1]), D(n.end)) : 0, ups = hist.reduce((a2, v, k) => a2 + (k && dd(D(hist[k - 1]), D(v)) > 0 ? 1 : 0), 0) + (last > 0 ? 1 : 0);
      return { n, i, color: MTA_COLORS[i % MTA_COLORS.length], base, dv, last, ups, pts, hidden: !!hide[n.id] }; });
    const dates = [].concat(...items0.map(x => x.pts.map(p => p[1]))).concat([X0]);
    const Y0 = new Date(Math.min.apply(null, dates).valueOf()), Y0m = new Date(Y0.getFullYear(), Y0.getMonth(), 1), Y1 = add(new Date(Math.max.apply(null, dates).valueOf()), 10);
    const X = d => Math.max(0, Math.min(1000, dd(X0, d) / Math.max(1, dd(X0, X1)) * 1000)), Y = d => Math.max(0, Math.min(1000, 1000 - dd(Y0m, d) / Math.max(1, dd(Y0m, Y1)) * 1000)), r1 = v => Math.round(v * 10) / 10, pc = v => r1(v / 10) + '%';
    const items = items0, vis = items.filter(x => !x.hidden), slip = items.filter(x => !x.n.done && x.dv > 0), worst = slip.slice().sort((a2, b2) => b2.dv - a2.dv)[0], fresh = items.filter(x => !x.n.done && x.last > 0);
    const openNode = id => () => this.setState({ highlight: id, panel: { kind: 'node', id, from: K === 'sm42' ? 'planung' : 'pn' } });
    const months = []; for (let m = Y0m; m <= Y1; m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) months.push(m);
    const MN = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'], setK = (st, v) => this.setState({ [st]: Object.assign({}, s[st], { [K]: v }) });
    const lastR = R.length ? fmt(D(R[R.length - 1])) : '';
    return { open, openA: open ? 'true' : 'false', ring: open ? accent : t.strong, toggle: () => setK('mtaOpenBy', !open), hasData: R.length > 0 && items.length > 0, noData: !(R.length > 0 && items.length > 0),
      noDataText: !R.length ? 'Noch kein Berichtsstand. Speichere eine Baseline (Knopf links); ab dann zeigt die Trendanalyse, wie sich jeder Termin seitdem verschoben hat.' : 'Keine Meilensteine im Zeitraum.',
      reports: R.map(r => fmt(D(r))).join(', ') + (R.length ? ' und ' : '') + 'heute (' + fmt(TODAY) + ')',
      sumHead: slip.length ? slip.length + ' von ' + items.filter(x => !x.n.done).length + ' offenen Terminen rutschen.' : 'Alle Termine halten.',
      sumText: slip.length ? 'Am stärksten: „' + worst.n.name + '“ +' + worst.dv + (worst.dv === 1 ? ' Tag' : ' Tage') + ' gegenüber der Baseline.' + (fresh.length && R.length > 1 ? ' Seit dem letzten Bericht neu verschoben: ' + fresh.map(x => x.n.name + ' (+' + x.last + ' T.)').join(', ') + '. Ursache im Statusbericht festhalten.' : '') : 'Keine Linie steigt. Seit der Baseline' + (o.blDate ? ' vom ' + o.blDate : '') + ' hat sich kein Termin nach hinten verschoben.',
      sumColor: slip.length ? (worst.dv > 5 ? RED : '#CA5010') : GREEN, sumBg: t.surface2,
      gridY: months.map(m => ({ top: pc(Y(m)), label: MN[m.getMonth()] + ' ' + String(m.getFullYear()).slice(2) })),
      gridX: R.map(r => ({ left: pc(X(D(r))), label: fmt(D(r)), color: t.muted, fw: '400' })).concat([{ left: pc(X(TODAY)), label: 'heute', color: o.accentText, fw: '700' }]),
      diag: r1(X(X0)) + ',' + r1(Y(X0)) + ' ' + r1(X(X1)) + ',' + r1(Y(X1)),
      series: vis.map(x => ({ pts: x.pts.map(([a2, b2]) => r1(X(a2)) + ',' + r1(Y(b2))).join(' '), color: x.color, sw: x.n.type === 'gate' ? '3' : '2.5' })),
      dots: [].concat(...vis.map(x => x.pts.map(([a2, b2], k) => ({ left: pc(X(a2)), top: pc(Y(b2)), color: x.color, size: k === x.pts.length - 1 ? '14px' : '10px', radius: x.n.type === 'gate' ? '2px' : '50%', open: openNode(x.n.id),
        tip: x.n.name + ': Stand ' + (x.n.done && k === x.pts.length - 1 ? fmt(D(x.n.end)) + ' erreicht' : (k === x.pts.length - 1 && !x.n.done ? 'heute' : fmt(a2)) + ', geplant ' + fmt(b2)) })))),
      chips: items.map(x => ({ label: x.n.name, color: x.color, pressed: x.hidden ? 'false' : 'true', ring: x.hidden ? t.border : x.color, fg: x.hidden ? t.muted : t.text, go: () => setK('mtaHideBy', Object.assign({}, hide, { [x.n.id]: !x.hidden })) })),
      allLabel: vis.length ? 'Alle ausblenden' : 'Alle einblenden', allGo: () => { const h = {}; if (vis.length) items.forEach(x => { h[x.n.id] = true; }); setK('mtaHideBy', h); },
      rows: items.slice().sort((a2, b2) => (!!a2.n.done - !!b2.n.done) || (b2.dv - a2.dv) || (D(a2.n.end) - D(b2.n.end))).map(x => ({ name: x.n.name, color: x.color, radius: x.n.type === 'gate' ? '2px' : '50%', open: openNode(x.n.id), base: fmt(D(x.base)), now: x.n.done ? fmt(D(x.n.end)) + ' ✓' : fmt(D(x.n.end)),
        dev: x.dv === 0 ? '±0' : (x.dv > 0 ? '+' : '−') + Math.abs(x.dv) + ' T.', devColor: x.dv > 0 ? RED : (x.dv < 0 ? GREEN : t.muted),
        trend: x.n.done ? 'erreicht' : (x.last > 0 ? '↗ rutscht' + (R.length > 1 ? ' weiter (+' + x.last + ' T. seit ' + lastR + ')' : ' (+' + x.last + ' T.)') : (x.ups ? '→ stabil seit letztem Bericht' : (x.dv < 0 ? '↘ früher als geplant' : '→ hält'))),
        trendColor: x.n.done ? GREEN : (x.last > 0 ? RED : t.muted) })) }; }
  bkSet(pk, list, msg) { this.setState(Object.assign({ bucketsBy: Object.assign({}, this.state.bucketsBy, { [pk]: list }) }, msg !== undefined ? { boardMsg: msg, pnMsg: '' } : {})); }
  bkAdd(pk) { const bks = this.bucketsOf(pk).slice(), nb = { key: 'b' + Date.now().toString(36) + bks.length, name: 'Neuer Bucket', cat: 'aktiv', color: '#8764B8' }; const fi = bks.findIndex(x => x.cat === 'fertig'); bks.splice(fi < 0 ? bks.length : fi, 0, nb); this.bkSet(pk, bks, 'Bucket „Neuer Bucket“ angelegt. Namen direkt in der Spaltenüberschrift ändern.'); return nb.key; }
  bkRename(pk, key, name) { this.bkSet(pk, this.bucketsOf(pk).map(x => (x.key === key ? Object.assign({}, x, { name }) : x))); }
  bkMove(pk, key, d) { const o = this.bucketsOf(pk).slice(), i = o.findIndex(x => x.key === key), j = i + d; if (i < 0 || j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; this.bkSet(pk, o, ''); }
  bkDel(pk, key, projName) { const bks = this.bucketsOf(pk), b = bks.find(x => x.key === key); if (!b) return;
    if (b.cat === 'fertig' && bks.filter(x => x.cat === 'fertig').length === 1) return this.setState({ pnMsg: '', boardMsg: '„' + b.name + '“ ist die einzige Erledigt-Spalte und bleibt.' });
    const target = bks.find(x => x.key !== key && x.cat === 'offen') || bks.find(x => x.key !== key), moved = TASKS.filter(x => x.proj === projName && this.bucketOf(x) === key);
    const bk = Object.assign({}, this.state.bk); moved.forEach(x => { bk[x.id] = target.key; });
    this.setState({ bk, bucketsBy: Object.assign({}, this.state.bucketsBy, { [pk]: bks.filter(x => x.key !== key) }), pnMsg: '', boardMsg: '„' + b.name + '“ gelöscht.' + (moved.length ? ' ' + moved.length + ' Aufgaben liegen jetzt in „' + target.name + '“.' : '') }); }
  quickTask(o) { const id = 'q' + Date.now().toString(36) + TASKS.length, owner = o.owner || 'Du';
    const x = { id, title: o.title, proj: o.proj || 'Ohne Projekt', due: o.due || '2026-11-20', bucket: 'Backlog', prio: 'Mittel', owner, mine: owner === 'Du', ms: o.ms || null, desc: 'Direkt angelegt am 13.11.', est: o.h || 2, co: [] };
    TASKS.push(x); TASK[id] = x; const bk = Object.assign({}, this.state.bk), done = Object.assign({}, this.state.done); if (o.bucket) { bk[id] = o.bucket; done[id] = this.catOf(x, o.bucket) === 'fertig'; }
    this.setState({ bk, done, rev: (this.state.rev || 0) + 1, qa: null, qaText: '' }); return id; }
  catOf(x, key) { const b = this.bucketsOf(this.pkOf(x)).find(y => y.key === key); return b ? b.cat : (key === 'Erledigt' ? 'fertig' : 'aktiv'); }
  doneKey(x) { const b = this.bucketsOf(this.pkOf(x)).find(y => y.cat === 'fertig'); return b ? b.key : 'Erledigt'; }
  bucketName(x, key) { const b = this.bucketsOf(this.pkOf(x)).find(y => y.key === key); return b ? b.name : key; }
  bucketColor(x, key) { const b = this.bucketsOf(this.pkOf(x)).find(y => y.key === key); return b ? b.color : (BUCKET[key] || '#5C5C5C'); }
  ownerOf(x) { return (this.state.ownerOv && this.state.ownerOv[x.id]) || x.owner; }
  reassign(id, p) {
    const o = Object.assign({}, this.state.ownerOv), oldO = this.ownerOf(TASK[id]); o[id] = p; this.logH('t:' + id, 'Verantwortlich', oldO, p);
    this.setState({ ownerOv: o, kbMsg: '', boardMsg: '', mvMsg: '„' + TASK[id].title + '“ ist jetzt bei ' + (p === 'Du' ? 'dir' : p) + '. Im Projekt gilt das ohne Freigabe; ' + (p === 'Du' ? 'du wirst' : p + ' wird') + ' benachrichtigt.' });
  }
  dragStart(id) { return e => { this._drag = id; try { e.dataTransfer.setData('text/plain', String(id)); e.dataTransfer.effectAllowed = 'move'; } catch (er) { /* ältere Browser */ } }; }
  dragOver(key) { return e => { if (e && e.preventDefault) e.preventDefault(); if (this.state.dragOver !== key) this.setState({ dragOver: key }); }; }
  dropOn(key, fn) { return e => { if (e && e.preventDefault) e.preventDefault(); const id = this._drag; this._drag = null; this.setState({ dragOver: null }); if (id) fn(id); }; }
  dragEnd() { return () => { this._drag = null; if (this.state.dragOver) this.setState({ dragOver: null }); }; }
  taskStatus(task) {
    if (this.isDone(task)) return 'erledigt';
    const due = D(task.due);
    if (due < TODAY) return 'ueberfaellig';
    if (+due === +TODAY) return 'heute';
    return 'plan';
  }
  nodeStatus(n) {
    if (n.done) return 'erledigt';
    const kids = n.children || [], ts = (n.tasks || []).map(id => TASK[id]);
    if (kids.length + ts.length > 0 && kids.every(k => this.nodeStatus(k) === 'erledigt') && ts.every(x => this.isDone(x))) return 'erledigt';
    if (D(n.end) < TODAY) return 'ueberfaellig';
    return 'plan';
  }
  overdueBelow(n) {
    let c = 0;
    (n.children || []).forEach(k => { if (this.nodeStatus(k) === 'ueberfaellig') c++; c += this.overdueBelow(k); });
    (n.tasks || []).forEach(id => { if (this.taskStatus(TASK[id]) === 'ueberfaellig') c++; });
    return c;
  }
  chip(status, t, accent) {
    if (status === 'erledigt') return { label: '✓ Erledigt', bg: GREEN, fg: '#FFFFFF', bd: GREEN };
    if (status === 'ueberfaellig') return { label: '! Überfällig', bg: RED, fg: '#FFFFFF', bd: RED };
    if (status === 'heute') return { label: 'Heute', bg: accent, fg: '#FFFFFF', bd: accent };
    return { label: 'Im Plan', bg: t.surface, fg: t.text, bd: t.strong };
  }
  dueLabel(x) { const ts = this.taskStatus(x); return (ts === 'ueberfaellig' ? '! ' : (ts === 'erledigt' ? '✓ ' : '')) + fmt(D(x.due)); }

  openTask(id, from) { const x = TASK[id]; if (x && x.story) return this.setState({ panel: { kind: 'story', id: x.story, from } }); this.setState({ panel: { kind: 'task', id, from }, pSub: 'details', akMsg: '' }); }
  openNode(id, from) { if (VNODE[id]) return this.setState({ panel: { kind: 'vnode', id, from } }); this.setState({ panel: { kind: 'node', id, from }, pSub: 'details', akMsg: '' }); }
  jumpTo(nodeId) {
    if (NODE[nodeId] && NODE[nodeId].pd) { const mview = Object.assign({}, this.state.mview, { pdp: 'vmodel' }); return this.setState({ screen: 'projekt', proj: 'pd', ptab: 'planung', mview, panel: VNODE[nodeId] ? { kind: 'vnode', id: nodeId, from: 'vmodel' } : null }); }
    const expanded = Object.assign({}, this.state.expanded);
    let p = PARENT[nodeId]; while (p) { expanded[p] = true; p = PARENT[p]; }
    const mview = Object.assign({}, this.state.mview, { sm42p: 'gantt' });
    this.setState({ screen: 'projekt', proj: 'sm42', ptab: 'planung', ampel: 'alle', expanded, highlight: nodeId, mview, panel: { kind: 'node', id: nodeId, from: 'planung' }, akMsg: '' });
  }
  toggleDone(id) {
    const t = TASK[id];
    if (t.story) return t.ms ? this.storyTo(t.story, this.isDone(t) ? 'Review' : 'Done') : this.setState({ boardMsg: STORIES[t.story].key + ' liegt im Product Backlog und wird über die Sprint-Planung eingeplant.' });
    if (t.kb) return this.kbTo(t.kb, this.isDone(t) ? 'arbeit' : 'erledigt');
    const done = Object.assign({}, this.state.done), was = this.isDone(t); done[id] = !was; this.setState({ done }); this.logH('t:' + id, 'Status', was ? 'erledigt' : 'offen', was ? 'offen' : 'erledigt');
  }
  openInbox(id) { const read = Object.assign({}, this.state.read); read[id] = true; this.setState({ screen: 'eingang', inSel: id, read, panel: null, inTab: 'msg', inFilter: 'alle', navOpen: false, inOpen: true }); }
  isUnread(m) { return !this.state.read[m.id] && ['i1', 'i8', 'i2', 'i3', 'i4'].includes(m.id); }
  decide(id, text) { const result = Object.assign({}, this.state.result); result[id] = text; this.setState({ result }); }

  renderVals() {
    if (typeof document !== 'undefined' && !this._cfmHook) { this._cfmHook = true; document.addEventListener('click', e => { const b = e.target && e.target.closest ? e.target.closest('[data-confirm]') : null; if (!b || window.__ecAutoConfirm) return; if (b.__ecOk) { b.__ecOk = false; return; } e.preventDefault(); e.stopPropagation(); this._cfmBtn = b; this.setState({ cfm: b.getAttribute('data-confirm') }); }, true); }
    if (typeof window !== 'undefined') { clearTimeout(this._ddT); this._ddT = setTimeout(() => this.drawDeps(), 60); if (!this._ddR) { this._ddR = true; window.addEventListener('resize', () => this.drawDeps()); } }
    if (typeof window !== 'undefined' && !window.__ecNodes) window.__ecNodes = { NODE, PARENT };
    if (!this._tabHook && typeof document !== 'undefined') { this._tabHook = true; document.addEventListener('click', e => { const b = e.target && e.target.closest ? e.target.closest('[role=tab]') : null; if (b) setTimeout(() => { try { const L = b.closest('[role=tablist]'); if (L && L.scrollWidth > L.clientWidth) L.scrollTo({ left: b.offsetLeft - (L.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' }); } catch (x) { /* alt */ } }, 30); }, true); }
    Object.assign(PRIO, PRIO0, this.state.prioC || {});
    TASKS.forEach(x => this.kenn(x));
    const { t, accent, accentText } = this.theme();
    const s = this.state;
    const tr = TR[s.lang];
    // Texteingabe mit Vorschlägen: Einwand, Rückfrage, Auflage, Kommentar, Warten auf
    const estOf0 = x => EST[x.id] || x.est || 1;
    const cmp = (key, o) => { const has = k2 => !!(this.state.txt && Object.prototype.hasOwnProperty.call(this.state.txt, k2)), cur0 = () => (has(key) ? this.state.txt[key] : (o.init || ''));
      const open = !!o.always || s.cmpOpen === key, val = (s.txt && Object.prototype.hasOwnProperty.call(s.txt, key)) ? s.txt[key] : (o.init || ''), err = s.cmpErr === key;
      return { open, title: o.title || '', ph: o.ph || 'Text eingeben', value: val, sendLabel: o.send || 'Senden', hasErr: err, err: o.err || 'Bitte kurz begründen, damit die andere Seite weiß, worum es geht.', bd: err ? RED : t.strong, canCancel: !o.always,
        hasChips: !!(o.chips && o.chips.length), chips: (o.chips || []).map(c => ({ label: c, go: () => { const cur = cur0(); this.setState({ txt: Object.assign({}, this.state.txt, { [key]: cur ? cur.replace(/[\s.]*$/, '. ') + c : c }), cmpErr: null }); } })),
        input: e => { const v = e && e.target ? e.target.value : ''; this.setState({ txt: Object.assign({}, this.state.txt, { [key]: v }), cmpErr: null }); },
        send: () => { const v = (cur0() || '').trim(); if (!v && !o.optional) return this.setState({ cmpErr: key }); const tx = Object.assign({}, this.state.txt); delete tx[key]; this.setState({ cmpOpen: null, cmpErr: null, txt: tx }); if (o.onSend) o.onSend(v); },
        cancel: () => this.setState({ cmpOpen: null, cmpErr: null }),
        hasKi: !!o.ki, kiNote: (s.kiNoteBy || {})[key] || '', hasKiNote: !!((s.kiNoteBy || {})[key]),
        kiTones: [['freundlich', '✨ Freundlicher'], ['formell', 'Formeller'], ['knapp', 'Kürzer'], ['frist', 'Mit Frist']].map(([k, l]) => ({ label: l, pressed: ((s.kiToneBy || {})[key] || '') === k ? 'true' : 'false', ring: ((s.kiToneBy || {})[key] || '') === k ? '#5B2D90' : t.border, bg: ((s.kiToneBy || {})[key] || '') === k ? t.soft : t.surface,
          go: () => { const cur = cur0(), r = this.polishMail(cur, k, Object.assign({ reply: true }, o.ki || {})); this.setState({ txt: Object.assign({}, this.state.txt, { [key]: r.text }), cmpErr: null, kiToneBy: Object.assign({}, this.state.kiToneBy, { [key]: k }), kiNoteBy: Object.assign({}, this.state.kiNoteBy, { [key]: '✨ Überarbeitet: ' + l.replace('✨ ', '') + '. Abkürzungen ausgeschrieben, Anrede und Gruß ergänzt, Fragen als Liste. Du kannst weiter ändern und erneut überarbeiten lassen.' }) }); } })) }; };
    const openCmp = key => () => this.setState({ cmpOpen: key, cmpErr: null });
    const noCmp = cmp('__none', { title: '' });
    const dens = s.densOv || (this.props.density ?? 'normal');
    const rowH = dens === 'kompakt' ? '40px' : (dens === 'luftig' ? '60px' : '50px');
    const primaryBtn = { bg: accent, fg: '#FFFFFF', bd: accent };
    const secondaryBtn = { bg: t.surface, fg: t.text, bd: t.strong };

    // Navigation
    const keys = ['start', 'arbeit', 'projekte', 'teams', 'wissen', 'berichte', 'eingang'];
    const navScreen = s.screen === 'projekt' || s.screen === 'antrag' || s.screen === 'mobil' ? 'projekte' : s.screen;
    const nav = {};
    keys.forEach(k => {
      const on = navScreen === k;
      nav[k] = { bg: on ? t.soft : 'transparent', fw: on ? 700 : 500, ic: on ? accent : t.muted, go: () => this.setState({ screen: k, panel: null, navOpen: false }) };
    });
    const is = { start: s.screen === 'start', arbeit: s.screen === 'arbeit', projekte: s.screen === 'projekte', projekt: s.screen === 'projekt', teams: s.screen === 'teams', eingang: s.screen === 'eingang', berichte: s.screen === 'berichte', wissen: s.screen === 'wissen', antrag: s.screen === 'antrag', admin: s.screen === 'admin', mobil: s.screen === 'mobil', profil: s.screen === 'profil', pnew: s.screen === 'pnew', pn: s.screen === 'pn', kickoff: s.screen === 'kickoff', import: s.screen === 'import' };
    is.other = !Object.values(is).some(Boolean);
    const OTHER = {
      wissen: ['Wissen', 'Technik-Gedächtnis, Lessons Learned und Stakeholder an einer Stelle. Folgt im nächsten Entwurf.'],
      berichte: ['Berichte', 'Portfolio, Dashboards und Statusberichte. Folgt im nächsten Entwurf.']
    };
    const o = OTHER[s.screen] || ['', ''];
    const langBtn = { de: { bg: s.lang === 'de' ? t.surface : 'transparent', fg: s.lang === 'de' ? t.text : t.muted }, en: { bg: s.lang === 'en' ? t.surface : 'transparent', fg: s.lang === 'en' ? t.text : t.muted } };

    // Meine Arbeit
    const mine = TASKS.filter(x => x.mine);
    const st = mine.map(x => ({ x, s: this.taskStatus(x) }));
    const overdueCount = st.filter(a => a.s === 'ueberfaellig').length;
    const C = [
      { key: 'ueberfaellig', label: 'Überfällig', count: overdueCount, dot: RED, dotBd: RED, num: RED },
      { key: 'heute', label: 'Heute fällig', count: st.filter(a => a.s === 'heute').length, dot: accent, dotBd: accent, num: t.text },
      { key: 'plan', label: 'Im Plan', count: st.filter(a => a.s === 'plan' || a.s === 'heute').length, dot: t.surface, dotBd: t.strong, num: t.text },
      { key: 'erledigt', label: 'Erledigt', count: st.filter(a => a.s === 'erledigt').length, dot: GREEN, dotBd: GREEN, num: GREEN }
    ];
    const counters = C.map(c => ({ label: c.label, count: c.count, dot: c.dot, dotBd: c.dotBd, numColor: c.num, pressed: s.filter === c.key ? 'true' : 'false', ring: s.filter === c.key ? accent : t.border,
      pick: () => this.setState({ filter: s.filter === c.key ? 'alle' : c.key }),
      goArbeit: () => this.setState({ screen: 'arbeit', arbTab: 'aufgaben', filter: c.key, panel: null }) }));
    const groupOf = a => {
      if (a.s === 'erledigt' || a.s === 'ueberfaellig' || a.s === 'heute') return a.s;
      return dd(TODAY, D(a.x.due)) <= 7 ? 'woche' : 'spaeter';
    };
    const pass = a => s.filter === 'alle' || (s.filter === 'plan' ? (a.s === 'plan' || a.s === 'heute') : a.s === s.filter);
    const G = [['ueberfaellig', 'Überfällig', RED], ['heute', 'Heute', accentText], ['woche', 'Nächste 7 Tage', t.text], ['spaeter', 'Später', t.muted], ['erledigt', 'Erledigt', GREEN]];
    const groups = G.map(([key, title, color]) => {
      const items = st.filter(a => groupOf(a) === key && pass(a));
      const rows = items.map(a => {
        const x = a.x, done = a.s === 'erledigt';
        return {
          title: x.title, proj: x.proj, projColor: PROJCOL[x.proj] || accent,
          bucket: this.bucketOf(x), bucketBg: BUCKET[this.bucketOf(x)], prio: x.prio, prioBg: PRIO[x.prio],
          chip: this.chip(a.s, t, accent), dueLabel: this.dueLabel(x),
          rowBg: s.panel && s.panel.id === x.id ? t.hl : 'transparent', strike: done ? 'line-through' : 'none',
          checkFill: done ? GREEN : 'none', checkColor: done ? GREEN : t.strong, checkMark: done ? '#FFFFFF' : 'transparent',
          checkLabel: (done ? 'Als offen markieren: ' : 'Als erledigt markieren: ') + x.title,
          toggle: () => this.toggleDone(x.id), open: () => this.openTask(x.id, 'arbeit')
        };
      });
      const byB = {}; items.forEach(a => { const b = this.bucketOf(a.x); byB[b] = (byB[b] || 0) + 1; });
      const dist = Object.keys(byB).map(b => ({ label: b + ': ' + byB[b], flex: byB[b], color: BUCKET[b] }));
      return { title, color, count: items.length, rows, dist, show: items.length > 0 };
    }).filter(g => g.show);
    const filterHint = s.filter === 'alle' ? 'Alle offenen und erledigten Aufgaben' : 'Gefiltert, Klick auf den Zähler hebt den Filter auf';

    // Start
    const focus = st.filter(a => a.s === 'ueberfaellig' || a.s === 'heute').map(a => ({ title: a.x.title, proj: a.x.proj, chip: this.chip(a.s, t, accent), dueLabel: this.dueLabel(a.x), open: () => this.openTask(a.x.id, 'start') }));
    const palette = ['Kennzahl', 'Aufgabenliste', 'Kalender', 'Diagramm', 'Meilensteine', 'Burndown', 'Workload', 'Notiz'];
    const wBorder = s.editDash ? '2px dashed ' + accent : '1px solid ' + t.border;
    const editBtn = s.editDash ? { label: 'Fertig', bg: accent, fg: '#FFFFFF', bd: accent } : { label: 'Dashboard anpassen', bg: t.surface, fg: t.text, bd: t.strong };
    const myLoadRaw = [95, 112, 85, 70, 60, 40];
    const MAXL = 130;
    const myLoad = myLoadRaw.map((v, i) => ({ kw: KWS[i], label: v + ' %', h: pct(v / MAXL * 100), bg: v > 100 ? RED : (v >= 80 ? '#C19C00' : accent), fg: v > 100 ? RED : t.text }));
    const loadLine = pct(100 / MAXL * 100 * 0.85);
    const days = [['Fr 13.11.', '2026-11-13'], ['Mo 16.11.', '2026-11-16'], ['Di 17.11.', '2026-11-17'], ['Mi 18.11.', '2026-11-18'], ['Do 19.11.', '2026-11-19']];
    const MEET = { '2026-11-13': [['10:00 Daily SM42', 'Teams-Besprechung']], '2026-11-16': [['09:00 Gate-Review G2', 'mit Geschäftsführung']], '2026-11-18': [['14:00 Kunden-Call', 'SM42 Statusbericht']] };
    const week = days.map(([label, iso], i) => {
      const items = [];
      const dnd = id => ({ drag: this.dragStart(id), dragEnd: this.dragEnd(), draggable: s.editDash ? 'false' : 'true', mvOn: s.wkSel === id ? 'true' : 'false', mvBg: s.wkSel === id ? t.soft : t.surface, mvBd: s.wkSel === id ? accent : t.border, mvLabel: s.wkSel === id ? '✓ gewählt – Tag antippen' : '⇄ Verschieben',
        mv: () => this.setState({ wkSel: s.wkSel === id ? null : id, weekMsg: s.wkSel === id ? '' : 'Jetzt beim Ziel-Tag auf „⤓ Hierher“ tippen.' }) });
      Object.keys(MEET).forEach(d0 => (MEET[d0] || []).forEach(([a, b]) => { if (((s.meetDay || {})[a] || d0) === iso) items.push(Object.assign({ title: a, sub: b, bg: t.surface2, fg: t.text, bd: t.border, open: () => {} }, dnd('wk:m:' + a))); }));
      TASKS.filter(x => x.mine && x.due === iso && !x.story && !x.kb).forEach(x => { const ch = this.chip(this.taskStatus(x), t, accent); items.push(Object.assign({ title: x.title, sub: x.proj, bg: ch.bg === t.surface ? t.surface : ch.bg, fg: ch.fg, bd: ch.bd, open: () => this.openTask(x.id, 'start') }, dnd('wk:t:' + x.id))); });
      Object.values(NODE).filter(n => n.type !== 'phase' && n.end === iso).forEach(n => items.push(Object.assign({ title: '◆ ' + n.name, sub: n.pd ? 'Ebene · Prüfstand Drehmoment' : (n.kindLabel || KIND[n.type].split(' /')[0]) + ' · ' + PNAME_OF[this.pkOfNode(n.id)], bg: t.surface, fg: t.text, bd: t.strong, open: () => this.openNode(n.id, 'start') }, dnd('wk:n:' + n.id))));
      const key = 'wk|' + iso, hot = s.dragOver === key;
      return { label, items, bg: hot ? t.hl : (i === 0 ? t.soft : t.surface2), bd: hot ? accent : (i === 0 ? accent : t.border), bw: hot ? '2px' : '1px', fg: i === 0 ? accentText : t.muted,
        over: this.dragOver(key), drop: this.dropOn(key, id => this.moveToDay(id, iso, label)),
        canDrop: !!s.wkSel, pick: () => { const id = this.state.wkSel; if (!id) return; this.setState({ wkSel: null }); this.moveToDay(id, iso, label); } };
    });

    // Posteingang
    const unreadCount = INBOX.filter(m => this.isUnread(m)).length;
    const inTabK = s.inTab || 'msg', nUnread = INBOX.filter(m => this.isUnread(m)).length;
    const inTab = { msg: inTabK === 'msg', anf: inTabK === 'anf', ent: inTabK === 'ent' };
    const inTabs = [['msg', 'Nachrichten', nUnread], ['anf', 'Neue Aufgaben für dich', 0], ['ent', 'Entwürfe', 0]].map(([k, l, n]) => { const on = inTabK === k; return { label: l, sel: on ? 'true' : 'false', bg: on ? t.surface : 'transparent', fg: on ? t.text : t.muted, sh: on ? '0 1px 2px rgba(0,0,0,0.12)' : 'none', hasN: n > 0, n: String(n), go: () => this.setState({ inTab: k }) }; });
    const inboxPreview = INBOX.slice(0, 4).map(m => ({ title: m.title, typeLabel: m.typeLabel, time: m.time, ini: ini(m.from), avColor: AV[m.from] || accent, unread: this.isUnread(m), open: () => this.openInbox(m.id) }));
    const IF = [['alle', 'Alle'], ['erwaehnung', 'Erwähnungen'], ['freigabe', 'Freigaben'], ['antrag', 'Anträge'], ['system', 'System']];
    const inboxFilters = IF.map(([k, l]) => ({ label: l, count: k === 'alle' ? INBOX.length : INBOX.filter(m => m.type === k).length, sel: s.inFilter === k ? 'true' : 'false', ring: s.inFilter === k ? accent : t.border, pick: () => this.setState({ inFilter: k }) }));
    const inboxList = INBOX.filter(m => s.inFilter === 'alle' || m.type === s.inFilter).map(m => ({
      title: m.title, sub: m.sub, time: m.time, typeLabel: m.typeLabel, typeBg: ITYPE_BG[m.type], ini: ini(m.from), avColor: AV[m.from] || accent,
      unread: this.isUnread(m), fw: this.isUnread(m) ? 700 : 500, hasResult: !!s.result[m.id],
      bg: s.inSel === m.id ? t.hl : 'transparent', open: () => this.openInbox(m.id)
    }));
    const sel = INB[s.inSel] || INBOX[0];
    const res = s.result[sel.id];
    let actions = [];
    if (sel.id === 'i1') actions = [['Bestanden', 'Gate G2 bestanden', primaryBtn], ['Mit Auflagen', 'Bestanden mit Auflage: Stromlaufplan bis 18.11. freigeben', secondaryBtn], ['Nicht bestanden', 'Gate G2 nicht bestanden', secondaryBtn]];
    if (sel.id === 'i8') actions = [['Freigeben', 'Freigegeben. S. Keller und L. Wagner sind informiert.', primaryBtn], ['Freigeben mit Termin 27.11.', 'Freigegeben mit Termin 27.11. Auslastung S. Keller KW 47: 103 %, KW 48: 91 %.', secondaryBtn], ['An M. Yilmaz geben', 'An M. Yilmaz gegeben (Freigabe durch S. Keller). Auslastung M. Yilmaz KW 47: 68 % → 89 %.', secondaryBtn], ['Ablehnen', 'Abgelehnt, Begründung an L. Wagner gesendet.', secondaryBtn]];
    if (sel.id === 'i2') actions = [['Freigeben', 'Wochenzettel freigegeben', primaryBtn], ['Mit Kommentar zurückgeben', 'Zurückgegeben an S. Keller', secondaryBtn]];
    if (sel.id === 'i3') actions = [['Genehmigen und Projekt anlegen', 'Genehmigt, Projekt „Teileerkennung L3“ angelegt', primaryBtn], ['Rückfrage stellen', 'Rückfrage an M. Yilmaz gesendet', secondaryBtn], ['Zurückstellen', 'Zurückgestellt bis 01.02.2027', secondaryBtn], ['Ablehnen', 'Abgelehnt', secondaryBtn]];
    if (sel.id === 'i4') actions = [['Antworten', 'Antwort gesendet', primaryBtn], ['Zum Task', null, secondaryBtn]];
    if (sel.id === 'i5') actions = [['Ins Team-Board', null, primaryBtn]];
    if (sel.id === 'i6') actions = [['Task öffnen', null, primaryBtn], ['Regel bearbeiten', null, secondaryBtn]];
    if (sel.id === 'i7') actions = [['Schulung planen', 'Aufgabe „Safety-Auffrischung buchen“ angelegt', primaryBtn]];
    const IBNEED = {
      'i1|Mit Auflagen': { title: 'Welche Auflage, bis wann, wer?', chips: ['Stromlaufplan bis 18.11. freigeben', 'Verantwortlich: T. Brandt', 'Nachweis im Gate-Protokoll'], send: 'Mit Auflage bestehen', gate: 'auflage', res: v => 'Bestanden mit Auflage: „' + v + '“. Die Auflage ist als Aufgabe angelegt, das Gate bleibt gelb, bis sie erledigt ist.' },
      'i1|Nicht bestanden': { title: 'Warum nicht bestanden, und was muss bis zum Nachtermin passieren?', chips: ['Stromlaufplan fehlt', 'Nachtermin 24.11.', 'Bestellung Schaltschrankteile bleibt gestoppt'], send: 'Nicht bestanden senden', gate: 'nein', res: v => 'Nicht bestanden: „' + v + '“. T. Brandt ist informiert, der Nachtermin wird geplant.' },
      'i8|Ablehnen': { title: 'Begründung an L. Wagner', chips: ['S. Keller ist in KW 47 voll', 'Bitte über das Projekt SM42 einplanen', 'Erst nach Gate G2'], send: 'Ablehnen und senden', res: v => 'Abgelehnt. Begründung an L. Wagner: „' + v + '“' },
      'i2|Mit Kommentar zurückgeben': { title: 'Kommentar an S. Keller', chips: ['Mittwoch fehlen 2 h', 'Bitte auf das Projekt statt auf Gemeinkosten buchen'], send: 'Zurückgeben', res: v => 'Zurückgegeben an S. Keller: „' + v + '“' },
      'i3|Rückfrage stellen': { title: 'Deine Rückfrage an M. Yilmaz', chips: ['Welche Einsparung erwartest du pro Jahr?', 'Gibt es schon ein Angebot?', 'Wer aus der Instandhaltung macht mit?'], send: 'Rückfrage senden', res: v => 'Rückfrage an M. Yilmaz gesendet: „' + v + '“' },
      'i3|Zurückstellen': { title: 'Bis wann und warum?', chips: ['bis 01.02.2027', 'nach der Budgetrunde', 'zusammen mit Retrofit Linie 3 prüfen'], send: 'Zurückstellen', res: v => 'Zurückgestellt: „' + v + '“' },
      'i3|Ablehnen': { title: 'Begründung an M. Yilmaz', chips: ['Kein Budget 2027', 'Passt nicht zum Fokus Kosteneinsparung', 'Bitte mit einem ähnlichen Antrag zusammenlegen'], send: 'Ablehnen und senden', res: v => 'Abgelehnt: „' + v + '“. M. Yilmaz ist informiert.' },
      'i4|Antworten': { title: 'Antwort an ' + sel.from, ph: 'Antwort schreiben, @ für Personen und Teams', chips: ['Erledige ich bis Montag', '@T. Brandt bitte übernehmen'], send: 'Antwort senden', res: v => 'Antwort gesendet: „' + v + '“' } };
    const ibOpenL = typeof s.cmpOpen === 'string' && s.cmpOpen.indexOf('ib:' + sel.id + ':') === 0 ? s.cmpOpen.slice(('ib:' + sel.id + ':').length) : null;
    const IBL0 = { ki: 'oben', split: 'neben', listW: 1, side: 'links', dense: 'normal', listH: 'frei' }, ibs = Object.assign({}, IBL0, s.ibl || {});
    const setIbl = patch => () => this.setState({ ibl: Object.assign({}, ibs, patch) });
    const LW = [['1 1 240px', 'schmal'], ['1 1 340px', 'mittel'], ['1 1 480px', 'breit'], ['2 1 560px', 'sehr breit']];
    const ibOpt = (key, label, opts) => ({ label, opts: opts.map(([v, l]) => ({ label: l, pressed: ibs[key] === v ? 'true' : 'false', ring: ibs[key] === v ? accent : t.border, bg: ibs[key] === v ? t.surface : 'transparent', go: setIbl({ [key]: v }) })) });
    const neben = ibs.split === 'neben';
    const ibl = { open: !!s.iblOpen, openA: s.iblOpen ? 'true' : 'false', toggle: () => this.setState({ iblOpen: !s.iblOpen }), btnBd: s.iblOpen ? accent : t.border, btnBg: s.iblOpen ? t.soft : t.surface,
      groups: [ibOpt('ki', 'KI-Entwürfe', [['oben', 'oben'], ['unten', 'unten'], ['aus', 'eingeklappt']]), ibOpt('split', 'Liste und Inhalt', [['neben', 'nebeneinander'], ['unter', 'untereinander']]),
        ibOpt('side', 'Liste steht', [['links', 'links'], ['rechts', 'rechts']]), ibOpt('listW', 'Breite der Liste', LW.map((x, i) => [i, x[1]])), ibOpt('dense', 'Zeilen in der Liste', [['normal', 'normal'], ['kompakt', 'kompakt, ohne Untertitel']]),
        ibOpt('listH', 'Höhe der Liste', [['frei', 'wie Inhalt'], ['400', 'max. 400 px'], ['650', 'max. 650 px']])],
      reset: () => this.setState({ ibl: Object.assign({}, IBL0) }),
      kiOrder: ibs.ki === 'unten' ? 3 : 0, kiDisp: ibs.ki === 'aus' ? 'none' : 'flex', kiHidden: ibs.ki === 'aus', kiShow: setIbl({ ki: 'oben' }), kiCount: '',
      dir: neben ? 'row' : 'column', align: neben ? 'flex-start' : 'stretch', listOrder: ibs.side === 'rechts' ? 2 : 0, bodyOrder: ibs.side === 'rechts' ? 0 : 2,
      listFlex: neben ? LW[ibs.listW][0] : '1 1 auto', bodyFlex: neben ? '2 1 440px' : '1 1 auto', listMaxH: ibs.listH === 'frei' ? (neben ? 'none' : '320px') : ibs.listH + 'px',
      rowPad: ibs.dense === 'kompakt' ? '6px 12px' : '12px 14px', subDisp: ibs.dense === 'kompakt' ? 'none' : 'block', sepDisp: neben ? 'block' : 'none',
      sepStart: e => { this._ibx = e && e.clientX; if (e && e.dataTransfer) { try { e.dataTransfer.setData('text/plain', 'ibsep'); } catch (er) {} } },
      sepEnd: e => { const x0 = this._ibx, x1 = e && e.clientX; if (x0 == null || x1 == null || !x1) return; let d = Math.round((x1 - x0) / 120) * (ibs.side === 'rechts' ? -1 : 1); if (!d) return; this.setState({ ibl: Object.assign({}, ibs, { listW: Math.max(0, Math.min(LW.length - 1, ibs.listW + d)) }) }); } };
    const ib = {
      from: sel.from === 'System' ? 'Engineering Cockpit' : sel.from, ini: ini(sel.from), avColor: AV[sel.from] || accent, time: sel.time, context: sel.context,
      typeLabel: sel.typeLabel, typeBg: ITYPE_BG[sel.type], title: sel.title, body: sel.body, quote: sel.quote || '',
      isGate: sel.id === 'i1', isTaskReq: sel.id === 'i8', isTime: sel.id === 'i2', isAntrag: sel.id === 'i3', isMention: sel.type === 'erwaehnung',
      hasResult: !!res, result: res || '', showActions: !res && !(sel.id === 'i3' && s.ztOpen) && !ibOpenL,
      cmp: ibOpenL ? cmp('ib:' + sel.id + ':' + ibOpenL, Object.assign({}, IBNEED[sel.id + '|' + ibOpenL], { onSend: v => { const nd = IBNEED[sel.id + '|' + ibOpenL]; this.decide(sel.id, nd.res(v)); if (nd.gate) this.setState({ gateRes: Object.assign({}, this.state.gateRes, { m23: { r: nd.gate, text: v, by: 'Du', when: '13.11.' } }) }); } })) : noCmp,
      actions: actions.map(([label, text, b]) => ({ label: IBNEED[sel.id + '|' + label] ? label + ' …' : label, bg: b.bg, fg: b.fg, bd: b.bd, go: () => {
        if (IBNEED[sel.id + '|' + label]) return this.setState({ cmpOpen: 'ib:' + sel.id + ':' + label, cmpErr: null });
        if (label === 'Genehmigen und Projekt anlegen') return this.setState({ ztOpen: true });
        if (label === 'Zum Task') return this.openTask('t11', 'eingang');
        if (label === 'Ins Team-Board') return this.setState({ screen: 'teams', team: 'automatisierung' });
        if (label === 'Task öffnen') return this.openTask('t12', 'eingang');
        if (text) this.decide(sel.id, text);
      } }))
    };
    const gateChecks = [['Mechanik-Konstruktion freigegeben', true, 'L. Wagner, 23.10.'], ['Stückliste vollständig', true, '28.10.'], ['Risikobeurteilung aktualisiert', true, '02.11.'], ['Stromlaufplan freigegeben', false, 'offen, Task überfällig'], ['Normteile bestellt', true, '30.10.']]
      .map(([text, ok, note]) => ({ text, mark: ok ? '✓' : '', bg: ok ? GREEN : 'transparent', bd: ok ? GREEN : RED, note, noteColor: ok ? t.muted : RED }));
    const timesheet = [['SM42 Schraubstation', [6, 7, 5, 8, 6]], ['Retrofit Linie 2', [2, 1, 3, 0, 2]]].map(([name, h]) => ({ name, h: h.map(String), sum: h.reduce((a, b) => a + b, 0) + ' h', fw: 500 }));
    timesheet.push({ name: 'Summe', h: ['8', '8', '8', '8', '8'], sum: '40 h', fw: 700 });
    const criteria = [['Nutzen', '30 %', 4], ['Strategische Passung', '20 %', 4], ['Dringlichkeit', '20 %', 3], ['Risiko (5 = gering)', '15 %', 4], ['Aufwand (5 = gering)', '15 %', 3]].map(([name, w, sc]) => ({ name, w, score: sc + ' / 5', pct: (sc / 5 * 100) + '%' }));

    // Teams
    const teamTabs = Object.keys(TEAMS).map(k => ({ name: TEAMS[k].name, color: TEAMS[k].color, sel: s.team === k ? 'true' : 'false', ring: s.team === k ? accent : t.border, bg: s.team === k ? t.soft : t.surface, go: () => this.setState({ team: k }) }));
    const TM0 = TEAMS[s.team], TM = Object.assign({}, TM0, { inbox: TM0.inbox.concat((s.teamAdd || {})[s.team] || []) });
    const heatCell = v => v === 0 ? { label: 'Urlaub', bg: '#E1E1E3', fg: '#3B3A39' } : (v > 100 ? { label: v + ' %', bg: '#FDE7E9', fg: '#A4262C' } : (v >= 80 ? { label: v + ' %', bg: '#FFF4CE', fg: '#5C4300' } : { label: v + ' %', bg: '#DFF6DD', fg: '#0E4F0E' }));
    const heat = TM.members.map(([name, role, loads]) => ({ name, role, ini: ini(name), color: AV[name] || accent, cells: loads.map((v, i) => Object.assign({ title: name + ' ' + KWS[i] }, heatCell(v))) }));
    const allLoads = TM.members.map(m => m[2][0]);
    const avgLoad = Math.round(allLoads.reduce((a, b) => a + b, 0) / allLoads.length);
    const certs = TM.certs.map(([name, cert, until]) => {
      const days = dd(TODAY, D(until));
      const c = days <= 30 ? { label: '! ' + days + ' Tage', bg: RED, fg: '#FFFFFF', bd: RED } : (days <= 60 ? { label: days + ' Tage', bg: '#FFF4CE', fg: '#5C4300', bd: '#C19C00' } : { label: '✓ gültig', bg: GREEN, fg: '#FFFFFF', bd: GREEN });
      return Object.assign({ name, cert, until: fmt(D(until)) + D(until).getFullYear() }, c);
    });
    const expiring = TM.certs.filter(c => dd(TODAY, D(c[2])) <= 60).length;
    const inbox = TM.inbox.map(it => {
      const r = s.claimed[it.id];
      return Object.assign({}, it, { open: !r, done: !!r, result: r || '',
        claim: () => { const c = Object.assign({}, s.claimed); c[it.id] = 'Übernommen von dir'; this.setState({ claimed: c }); },
        assign: () => { const c = Object.assign({}, s.claimed); c[it.id] = 'Zugewiesen an ' + it.sug; this.setState({ claimed: c }); } });
    });
    const openInbox = TM.inbox.filter(it => !s.claimed[it.id]).length;
    // Teamplanung: KI-Verteilung, Grobplanung 6 Monate, wiederkehrende Aufgaben
    const MONTHS = ['Dez 26', 'Jan 27', 'Feb 27', 'Mär 27', 'Apr 27', 'Mai 27'], MON_H = 28 * 4.3;
    const DEMAND = {
      automatisierung: [{ id: 'bd1', title: 'MES-Anbindung Halle 1: SPS-Schnittstellen', short: 'MES', proj: 'MES-Anbindung Halle 1', need: 'Profinet ≥ 3', pct: 40, from: 1, months: 5 },
        { id: 'bd2', title: 'Teileerkennung Linie 3: Roboterintegration', short: 'TL3', proj: 'Teileerkennung Linie 3', need: 'KUKA ≥ 3', pct: 50, from: 2, months: 4 },
        { id: 'bd3', title: 'Retrofit Linie 2: IBN-Unterstützung', short: 'RL2', proj: 'Retrofit Linie 2', need: 'TIA Portal ≥ 3', pct: 30, from: 0, months: 2 }],
      instandhaltung: [{ id: 'bi1', title: 'Großinspektion Presse 2 (Betriebsruhe)', short: 'Presse 2', proj: 'Instandhaltung Halle 2', need: 'Hydraulik ≥ 3', pct: 60, from: 0, months: 1 },
        { id: 'bi2', title: 'Ersatzteillager digital: Stammdaten und Lagerplätze', short: 'ETL', proj: 'Ersatzteillager digital', need: 'Mechanik ≥ 2', pct: 30, from: 0, months: 5 }],
      konstruktion: [{ id: 'bk1', title: 'Teileerkennung Linie 3: Greiferkonstruktion', short: 'TL3', proj: 'Teileerkennung Linie 3', need: 'SolidWorks ≥ 3', pct: 50, from: 2, months: 3 }],
      software: [{ id: 'bs1', title: 'MES-Anbindung Halle 1: Datenmodell und Schnittstelle', short: 'MES', proj: 'MES-Anbindung Halle 1', need: '', pct: 50, from: 1, months: 4 }] };
    const RECUR = {
      instandhaltung: [['Wochenwartung Lichtvorhänge', 'jeden Montag', 'K. Weber', 0.5, 'wöchentlich'], ['Filter Kompressoren prüfen', 'monatlich, 1. Werktag', 'A. Schulz', 1, 'monatlich'], ['Ölwechsel Pressen 1–3', 'alle 2.000 Betriebsstunden, etwa quartalsweise', 'D. Petrov', 3, 'quartalsweise'], ['UVV-Prüfung Hallenkran', 'jährlich im Januar', 'R. Fischer', 4, 'jährlich']],
      automatisierung: [['Datensicherung SPS-Projekte', 'monatlich', 'J. Novak', 1, 'monatlich'], ['Safety-Validierung Stichprobe', 'quartalsweise', 'S. Keller', 4, 'quartalsweise']],
      konstruktion: [['Normteil-Katalog aktualisieren', 'quartalsweise', 'P. Hoffmann', 2, 'quartalsweise']],
      software: [['Sicherheitsupdates Server', 'monatlich, 2. Dienstag', 'E. Lang', 2, 'monatlich']] };
    const RFREQ = { 'täglich': 21, 'wöchentlich': 4.3, 'monatlich': 1, 'quartalsweise': 1 / 3, 'jährlich': 1 / 12 };
    const recur = (RECUR[s.team] || []).concat((s.recurAdd || {})[s.team] || []);
    const recH = name => recur.filter(r => r[2] === name).reduce((acc, r) => acc + r[3] * (RFREQ[r[4]] || 1), 0);
    const baseM = (loads, m) => Math.max(20, Math.round(loads.reduce((x, y) => x + y, 0) / loads.length - m * 9));
    const demList = DEMAND[s.team] || [], tdP = s.tdPlan || {};
    const demOn = (name, m, extra) => demList.filter(dm => tdP[dm.id] && tdP[dm.id].who === name && m >= tdP[dm.id].from && m < tdP[dm.id].from + dm.months).reduce((acc, dm) => acc + dm.pct, 0) + ((extra || {})[name + '|' + m] || 0);
    const loadM = (name, loads, m, extra) => baseM(loads, m) + Math.round(recH(name) / MON_H * 100) + demOn(name, m, extra);
    // Tagesplanung im Team: jeder Arbeitstag bis 6 Monate voraus (26 Wochen ab KW 47)
    const TPH = { a1: 6, a2: 4, a3: 5, b1: 3, b2: 4, b3: 2, c1: 8 }, TPVAR = [1.1, 0.9, 1, 1.05, 0.95], DAYH = 5.6;
    const fmtH = v => (Math.round(v * 10) / 10).toLocaleString('de-DE');
    const needGap = (name, needs) => { const out = []; String(needs).split(',').forEach(part => { const m = part.trim().match(/^(.+?)\s*≥\s*(\d)/); if (!m) return; const si = TM.skills.indexOf(m[1].trim()); if (si < 0) return; const lv = (TM.levels[name] || [])[si] || 0; if (lv < +m[2]) out.push(m[1].trim() + ' Stufe ' + lv + ' statt ' + m[2]); }); return out; };
    const tp_WDN = ['Mo', 'Di', 'Mi', 'Do', 'Fr'], tp_WDNAME = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'], tp_NWEEKS = 26;
    const tp_kwOf = w => (w <= 6 ? 47 + w : w - 6);
    const tp_HOL = { '2026-12-24': 'Betriebsruhe', '2026-12-25': 'Weihnachten', '2026-12-28': 'Betriebsruhe', '2026-12-29': 'Betriebsruhe', '2026-12-30': 'Betriebsruhe', '2026-12-31': 'Betriebsruhe', '2027-01-01': 'Neujahr', '2027-03-26': 'Karfreitag', '2027-03-29': 'Ostermontag', '2027-05-06': 'Christi Himmelfahrt' };
    const tp_PDAYS = []; for (let w = 0; w < tp_NWEEKS; w++) for (let di = 0; di < 5; di++) { const iso = new Date(Date.UTC(2026, 10, 16 + w * 7 + di)).toISOString().slice(0, 10);
      tp_PDAYS.push({ w, di, iso, label: tp_WDN[di] + ' ' + iso.slice(8, 10) + '.' + iso.slice(5, 7) + '.', mon: (+iso.slice(0, 4) - 2026) * 12 + (+iso.slice(5, 7)) - 12, hol: holAt(iso, 'NW'), holAny: SITES.map(([k, l]) => [k, holAt(iso, k)]).filter(z => z[1]) }); }
    const tp_ihWin = s.team === 'instandhaltung';
    const siteOf = n => (s.siteBy || {})[n] || SITE0[n] || 'NW';
    const tp_holOf = (d, n) => { const h = n ? holAt(d.iso, siteOf(n)) : d.hol; return h && !(tp_ihWin && h === 'Betriebsruhe') ? h : null; };
    const tp_ABS = { 'Du': [['2027-02-08', '2027-02-12', 'Urlaub']], 'S. Keller': [['2027-02-22', '2027-02-26', 'Urlaub']], 'J. Novak': [['2027-04-06', '2027-04-09', 'Urlaub']], 'M. Yilmaz': [['2027-01-18', '2027-01-20', 'Schulung KUKA']],
      'D. Petrov': [['2027-03-01', '2027-03-12', 'Urlaub']], 'A. Schulz': [['2027-01-25', '2027-01-29', 'Urlaub']], 'R. Fischer': [['2027-04-19', '2027-04-23', 'Urlaub']], 'K. Weber': [['2027-02-15', '2027-02-16', 'Schulung Schaltberechtigung']],
      'L. Wagner': [['2027-03-15', '2027-03-19', 'Urlaub']], 'T. Brandt': [['2027-02-01', '2027-02-03', 'Messe']], 'P. Hoffmann': [['2027-05-10', '2027-05-14', 'Urlaub']], 'E. Lang': [['2027-04-12', '2027-04-16', 'Urlaub']], 'F. Roth': [['2027-01-11', '2027-01-15', 'Urlaub']] };
    const tp_awayOf = (name, loads, d) => { if (d.w + 1 < loads.length && loads[d.w + 1] === 0) return 'Urlaub'; const ab = (tp_ABS[name] || []).concat((s.absAdd || []).filter(x => x[3] === name)).find(([f, u]) => d.iso >= f && d.iso <= u); return ab ? ab[2] : null; };
    const tp_pctOf = (name, loads, d) => (d.w + 1 < loads.length ? loads[d.w + 1] : baseM(loads, Math.max(0, d.mon))) + (d.mon >= 0 ? demOn(name, d.mon) : 0);
    const tp_firstWd = ym => { const x = tp_PDAYS.find(d => !tp_holOf(d) && d.iso.slice(0, 7) === ym); return x ? x.iso : null; };
    const tp_recOn = (r, d) => { const sub = String(r[1]).toLowerCase(), f = r[4], mo = +d.iso.slice(5, 7), day = +d.iso.slice(8, 10);
      const wd = tp_WDNAME.findIndex(n => sub.indexOf(n) >= 0), nth = sub.match(/(\d)\.\s*(montag|dienstag|mittwoch|donnerstag|freitag)/);
      const monthly = () => (nth ? d.di === tp_WDNAME.indexOf(nth[2]) && Math.ceil(day / 7) === +nth[1] : tp_firstWd(d.iso.slice(0, 7)) === d.iso);
      if (f === 'täglich') return true;
      if (f === 'wöchentlich') return d.di === (wd >= 0 ? wd : 0);
      if (f === 'monatlich') return monthly();
      if (f === 'quartalsweise' || f === 'nach Betriebsstunden') return [1, 4, 7, 10].indexOf(mo) >= 0 && monthly();
      if (f === 'jährlich') return mo === 1 && d.di === 0 && day >= 8 && day <= 14;
      return false; };
    const tp_FUT = {
      automatisierung: [{ id: 'f1', type: 'Auftrag', typeBg: '#0F6CBD', title: 'MES: SPS-Datenbausteine definieren', needs: 'Profinet ≥ 3', due: '15.01.', dueIso: '2027-01-15', h: 6, proj: 'MES-Anbindung Halle 1' },
        { id: 'f2', type: 'Prüfung', typeBg: '#0E6E7A', title: 'FAT Teileerkennung Linie 3 vorbereiten', needs: 'KUKA ≥ 3', due: '12.02.', dueIso: '2027-02-12', h: 8, proj: 'Teileerkennung Linie 3' },
        { id: 'f3', type: 'Prüfung', typeBg: '#0E6E7A', title: 'Retrofit Linie 2: Safety-Abnahme mit TÜV', needs: 'Safety ≥ 3', due: '18.12.', dueIso: '2026-12-18', h: 5, proj: 'Retrofit Linie 2' }],
      instandhaltung: [{ id: 'f4', type: 'Wartung', typeBg: '#0E6E7A', title: 'Großinspektion Presse 2: Hydraulik', needs: 'Hydraulik ≥ 3', due: '30.12.', dueIso: '2026-12-30', h: 8, proj: 'Instandhaltung Halle 2' },
        { id: 'f5', type: 'Wartung', typeBg: '#0E6E7A', title: 'Schaltschränke Halle 2 thermografieren', needs: 'Elektrik ≥ 3', due: '26.02.', dueIso: '2027-02-26', h: 6, proj: 'Instandhaltung Halle 2' }],
      konstruktion: [{ id: 'f6', type: 'Auftrag', typeBg: '#0F6CBD', title: 'Greifer Linie 3: Konstruktion freigeben', needs: 'SolidWorks ≥ 3', due: '19.03.', dueIso: '2027-03-19', h: 6, proj: 'Teileerkennung Linie 3' }],
      software: [{ id: 'f7', type: 'Auftrag', typeBg: '#0F6CBD', title: 'MES: OPC-UA-Server Lasttest', needs: 'OPC UA ≥ 3', due: '05.03.', dueIso: '2027-03-05', h: 5, proj: 'MES-Anbindung Halle 1' }] };
    const tpPool = TM.inbox.concat(tp_FUT[s.team] || []), tp_hOf = it => it.h || TPH[it.id] || 4;
    const tp_kwIso = iso => { const d = tp_PDAYS.find(x => x.iso === iso); return d ? 'KW ' + tp_kwOf(d.w) : ''; };
    const tpOpen = tpPool.filter(it => !s.claimed[it.id]).sort((x, y) => (x.dueIso || '') < (y.dueIso || '') ? -1 : ((x.dueIso || '') > (y.dueIso || '') ? 1 : 0)), tpSelIt = tpOpen.find(it => it.id === s.tpSel);
    const tp_isW4 = s.tpZoom === 'w4', tp_nW = tp_isW4 ? 4 : 1, tp_w0 = Math.max(0, Math.min(tp_NWEEKS - tp_nW, s.tpW || 0));
    const tp_vis = tp_PDAYS.filter(d => d.w >= tp_w0 && d.w < tp_w0 + tp_nW), tp_last = tp_vis[tp_vis.length - 1];
    const tp_dayInfo = (name, loads, d, extra) => { const away = tp_awayOf(name, loads, d), hol = tp_holOf(d, name), off = away || hol;
      const recs = off ? [] : recur.filter(r => r[2] === name && tp_recOn(r, d));
      const planned = tpPool.filter(it => s.tplan[it.id] && s.tplan[it.id].who === name && s.tplan[it.id].iso === d.iso);
      const own = TASKS.filter(x => this.ownerOf(x) === name && x.due === d.iso && !this.isDone(x));
      const h = off ? 0 : tp_pctOf(name, loads, d) / 100 * DAYH * TPVAR[d.di] + recs.reduce((acc, r) => acc + r[3], 0) + planned.reduce((acc, it) => acc + tp_hOf(it), 0) + ((extra || {})[name + '|' + d.iso] || 0);
      return { away, hol, off, recs, planned, own, h }; };
    const tpAssign = (itId, who, iso, label) => { const it = tpPool.find(z => z.id === itId); if (!it || this.state.claimed[it.id]) return; const gap = needGap(who, it.needs), late = it.dueIso && iso > it.dueIso;
      this.setState({ tplan: Object.assign({}, this.state.tplan, { [it.id]: { who, iso } }), claimed: Object.assign({}, this.state.claimed, { [it.id]: 'Zugewiesen an ' + who + ' für ' + label + ' (' + tp_kwIso(iso) + ')' }), tpSel: null,
        tpMsg: '„' + it.title + '“ an ' + who + ' für ' + label + ' (' + tp_kwIso(iso) + ') · ' + who + ' hat die Aufgabe sofort in Meine Arbeit, ohne Annahme.' + (late ? ' Achtung: liegt nach der Fälligkeit ' + it.due + '.' : '') + (gap.length ? ' Achtung Qualifikation: ' + gap.join(', ') + '.' : '') }); };
    const tp_unplan = it => () => { const pl = Object.assign({}, this.state.tplan), c = Object.assign({}, this.state.claimed); delete pl[it.id]; delete c[it.id]; this.setState({ tplan: pl, claimed: c, tpMsg: '„' + it.title + '“ ist zurück bei „Noch nicht verteilt“.' }); };
    const tpRows = TM.members.map(([name, role, loads]) => ({ name, role: role + ' · ' + siteOf(name) + (projPctOf(name).sum ? ' · Projekte ' + projPctOf(name).sum + ' %' + (projPctOf(name).sum > 100 ? ' ⚠' : '') : ''), ini: ini(name), color: AV[name] || accent, cells: tp_vis.map(d => {
      const inf = tp_dayInfo(name, loads, d), h = inf.h, key = 'tp|' + name + '|' + d.iso, hot = s.dragOver === key;
      const fit = tpSelIt && !inf.off ? (needGap(name, tpSelIt.needs).length || (tpSelIt.dueIso && d.iso > tpSelIt.dueIso) ? 'warn' : 'ok') : null;
      const chips = inf.own.map(x => (x.priv && name !== 'Du' ? { label: '🔒 privat · ' + fmtH(x.est || 1) + ' h', bg: t.track, fg: t.muted, aria: 'Private Aufgabe, Inhalt nicht sichtbar', open: () => this.setState({ tpMsg: 'Private Aufgabe von ' + name + ': Titel und Inhalt sieht nur ' + name + ', auch Vorgesetzte nicht. Hier zählt nur die Dauer.' }) } : { label: (x.priv ? '🔒 ' : '') + x.title, bg: t.surface2, fg: t.text, aria: x.title + ' öffnen', open: () => this.openTask(x.id, 'teams') }))
        .concat(inf.recs.map(r => ({ label: '🔁 ' + r[0] + ' · ' + fmtH(r[3]) + ' h', bg: t.surface2, fg: t.text, aria: r[0] + ', ' + r[1], open: () => this.setState({ tpMsg: '„' + r[0] + '“ wiederholt sich (' + r[1] + ') und steht deshalb automatisch hier. Ändern unter 6 Monate › Wiederkehrende Aufgaben.' }) })))
        .concat(inf.planned.map(it => ({ label: it.title + ' · ' + fmtH(tp_hOf(it)) + ' h', bg: it.typeBg, fg: '#FFFFFF', aria: it.title + ' zurücknehmen', open: tp_unplan(it) })));
      const heat = inf.off ? t.track : (hot ? t.soft : (h > DAYH ? '#FDE7E9' : (h > 4.5 ? '#FFF4CE' : '#DFF6DD'))), heatFg = inf.off ? t.muted : (h > DAYH ? '#A4262C' : (h > 4.5 ? '#5C4300' : '#0E4F0E'));
      const mw = tp_ihWin && d.hol === 'Betriebsruhe' && !inf.off;
      return { away: !!inf.off, notAway: !inf.off, hText: inf.off ? inf.off : fmtH(h) + ' / 5,6 h', fill: pct(Math.min(100, h / DAYH * 100)), barBg: h > DAYH ? RED : (h > 4.5 ? '#C19C00' : GREEN), hColor: h > DAYH ? RED : t.text,
        bg: inf.off ? t.track : (hot ? t.soft : t.surface), bd: hot ? accent : (fit === 'ok' ? GREEN : (fit === 'warn' ? '#C19C00' : (tp_isW4 ? 'transparent' : t.border))), bw: hot || fit ? '2px' : '1px', aria: name + ', ' + d.label + (inf.off ? ', ' + inf.off : ', ' + fmtH(h) + ' Stunden'),
        hasTag: mw, tag: mw ? '🔧 Betriebsruhe: Wartungsfenster' : '', chips, heat, heatFg,
        short: inf.off ? (inf.away ? inf.away[0] : (inf.hol === 'Betriebsruhe' ? 'BR' : 'FT')) : fmtH(h), dots: inf.planned.length || inf.own.length ? '•'.repeat(Math.min(3, inf.planned.length + inf.own.length)) : (inf.recs.length ? '🔁' : ''),
        tip: d.label + ' · ' + name + ': ' + (inf.off ? inf.off : fmtH(h) + ' h' + (chips.length ? ' · ' + chips.map(x => x.label).join(', ') : '')),
        over: inf.off ? () => {} : this.dragOver(key), drop: inf.off ? () => {} : this.dropOn(key, id => { if (typeof id === 'string' && id.indexOf('tp:') === 0) tpAssign(id.slice(3), name, d.iso, d.label); }),
        click: inf.off ? () => this.setState({ tpMsg: name + ' am ' + d.label + ': ' + inf.off + '.' }) : () => { if (this.state.tpSel) tpAssign(this.state.tpSel, name, d.iso, d.label); else if (tp_isW4) this.setState({ tpW: d.w, tpZoom: 'w1', tpMsg: 'KW ' + tp_kwOf(d.w) + ' im Detail.' }); } }; }) }));
    const tp_MCH = [['Nov', '2026-11'], ['Dez', '2026-12'], ['Jan', '2027-01'], ['Feb', '2027-02'], ['Mär', '2027-03'], ['Apr', '2027-04'], ['Mai', '2027-05']];
    const tp_weekOfIso = (iso, mon) => { const d = tp_PDAYS.find(x => x.iso >= iso && (!mon || x.di === 0)); return d ? d.w : tp_NWEEKS - 1; };
    const tp_goW = w => this.setState({ tpW: Math.max(0, Math.min(tp_NWEEKS - tp_nW, w)), tpMsg: '' });
    const tp = { days: tp_vis.map(d => d.label + (d.hol ? ' · ' + d.hol : '')), rows: tpRows, lead: TM.lead, hasItems: tpOpen.length > 0, noItems: tpOpen.length === 0, hasMsg: !!s.tpMsg, msg: s.tpMsg || '',
      items: tpOpen.map(it => ({ title: it.title, type: it.type, typeBg: it.typeBg, needs: it.needs, due: it.due + (it.dueIso ? ' (' + tp_kwIso(it.dueIso) + ')' : ''), h: fmtH(tp_hOf(it)) + ' h', ring: s.tpSel === it.id ? accent : t.border, bg: s.tpSel === it.id ? t.soft : t.surface, pressed: s.tpSel === it.id ? 'true' : 'false',
        drag: this.dragStart('tp:' + it.id), dragEnd: this.dragEnd(), pick: () => this.setState({ tpSel: s.tpSel === it.id ? null : it.id, tpMsg: '' }) })),
      hint: tpSelIt ? '„' + tpSelIt.title + '“ gewählt: jetzt einen Tag anklicken. Grün umrandet: passt, gelb: Qualifikation fehlt oder nach der Fälligkeit.' : 'Aufgabe auf Person und Tag ziehen, oder erst anklicken und dann den Tag. Mit ‹ › oder den Monaten bis Mitte Mai blättern. Klick auf eine verteilte Aufgabe nimmt sie zurück.',
      hasJump: !!(tpSelIt && tpSelIt.dueIso && !(tpSelIt.dueIso >= tp_vis[0].iso && tpSelIt.dueIso <= tp_last.iso)), jumpLabel: tpSelIt && tpSelIt.dueIso ? 'Zur Fälligkeit ' + tpSelIt.due + ' (' + tp_kwIso(tpSelIt.dueIso) + ')' : '', jump: () => { if (tpSelIt && tpSelIt.dueIso) tp_goW(tp_weekOfIso(tpSelIt.dueIso) - tp_nW + 1); },
      isW1: !tp_isW4, isW4: tp_isW4, gridCols: '150px repeat(' + tp_vis.length + ', minmax(' + (tp_isW4 ? '30px' : '96px') + ', 1fr))',
      weekHeads: tp_isW4 ? [0, 1, 2, 3].map(k => 'KW ' + tp_kwOf(tp_w0 + k) + ' · ' + tp_vis[k * 5].label.slice(3)) : [],
      dayHeads: tp_vis.map(d => { const tmH = TM.members.map(m => [m[0], holAt(d.iso, siteOf(m[0]))]).filter(z => z[1]); return { wd: tp_WDN[d.di], num: d.iso.slice(8, 10), fg: tmH.length === TM.members.length ? RED : (tmH.length ? '#CA5010' : t.muted), title: d.label + (tmH.length ? ', ' + (tmH.length === TM.members.length ? tmH[0][1] + ' (alle)' : tmH.map(z => z[0] + ': ' + z[1]).join(', ')) : '') }; }),
      nav: { label: tp_isW4 ? 'KW ' + tp_kwOf(tp_w0) + ' bis ' + tp_kwOf(tp_w0 + 3) : 'KW ' + tp_kwOf(tp_w0), range: tp_vis[0].label + ' bis ' + tp_last.label + tp_last.iso.slice(0, 4),
        prev: () => tp_goW(tp_w0 - tp_nW), next: () => tp_goW(tp_w0 + tp_nW), today: () => tp_goW(0), prevOp: tp_w0 > 0 ? '1' : '0.35', nextOp: tp_w0 + tp_nW < tp_NWEEKS ? '1' : '0.35' },
      monthChips: tp_MCH.map(([l, ym]) => { const on = tp_vis[Math.min(2, tp_vis.length - 1)].iso.slice(0, 7) === ym; return { label: l, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: () => tp_goW(tp_weekOfIso(ym + '-01', true)) }; }),
      zooms: [['w1', '1 Woche, Details'], ['w4', '4 Wochen, kompakt']].map(([k, l]) => { const on = (s.tpZoom || 'w1') === k; return { label: l, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: () => this.setState({ tpZoom: k, tpW: tp_w0, tpMsg: '' }) }; }) };
    tp.sites = TM.members.map(([n]) => { const cur = siteOf(n); return { name: n, ini: ini(n), color: AV[n] || accent, site: cur, label: (SITES.find(z => z[0] === cur) || ['', cur])[1], go: () => { const i = SITES.findIndex(z => z[0] === cur), nx = SITES[(i + 1) % SITES.length][0]; this.setState({ siteBy: Object.assign({}, s.siteBy, { [n]: nx }), tpMsg: n + ': Standort jetzt ' + SITES.find(z => z[0] === nx)[1] + '. Feiertage in der Planung folgen dem Standort.' }); } }; });
    tp.siteNote = (() => { const vis = tp_vis.map(d => TM.members.map(m => [m[0], d, holAt(d.iso, siteOf(m[0]))]).filter(z => z[2] && z[2] !== 'Betriebsruhe')).reduce((a, b) => a.concat(b), []); const only = vis.filter(z => TM.members.some(m => !holAt(z[1].iso, siteOf(m[0])))); return only.length ? 'Standort-Feiertage im Zeitraum: ' + only.slice(0, 4).map(z => z[1].label + ' ' + z[2] + ' (' + z[0] + ')').join(', ') + (only.length > 4 ? ' …' : '') : 'Im sichtbaren Zeitraum gelten für alle dieselben Feiertage.'; })();

    const tpKiPlan = () => { const extra = {}, res = [];
      tpOpen.forEach(it => { const h = tp_hOf(it); let best = null;
        const cand = it.dueIso && it.dueIso > tp_vis[0].iso ? tp_PDAYS.filter(d => d.iso >= tp_vis[0].iso && d.iso <= it.dueIso) : tp_vis;
        TM.members.forEach(([name, role, loads]) => { const gap = needGap(name, it.needs).length;
          cand.forEach((d, k) => { const inf = tp_dayInfo(name, loads, d, extra); if (inf.off) return;
            const after = inf.h + h, score = gap * 100 + Math.max(0, after - DAYH) * 10 + after + k * 0.05;
            if (!best || score < best.score) best = { name, label: d.label, iso: d.iso, w: d.w, score, after, gap }; }); });
        if (best) { extra[best.name + '|' + best.iso] = (extra[best.name + '|' + best.iso] || 0) + h; res.push({ it, best }); } });
      return res; };
    const assignD = (id, name, m) => { const dm = demList.find(z => z.id === id); if (!dm) return; const gap = needGap(name, dm.need); const loads = (TM.members.find(x => x[0] === name) || [0, 0, [0]])[2];
      let peak = 0; for (let k = m; k < Math.min(6, m + dm.months); k++) peak = Math.max(peak, loadM(name, loads, k) + dm.pct);
      this.setState({ tdPlan: Object.assign({}, this.state.tdPlan, { [id]: { who: name, from: m } }), tdSel: null, tpMsg: '„' + dm.title + '“ ab ' + MONTHS[m] + ' bei ' + name + ' (' + dm.pct + ' % für ' + dm.months + ' Monate).' + (peak > 100 ? ' Achtung: Spitze ' + peak + ' %.' : ' Spitze ' + peak + ' %.') + (gap.length ? ' Qualifikation: ' + gap.join(', ') + '.' : '') }); };
    const kiMon = () => { const extra = {}, res = [];
      demList.filter(dm => !tdP[dm.id]).forEach(dm => { let best = null;
        const opts = [];
        TM.members.forEach(([name, role, loads]) => { const gap = needGap(name, dm.need).length;
          for (let sh = 0; sh <= 3 && dm.from + sh < 6; sh++) { const f0 = dm.from + sh; let peak = 0;
            for (let m = f0; m < Math.min(6, f0 + dm.months); m++) peak = Math.max(peak, loadM(name, loads, m, extra) + dm.pct);
            opts.push({ name, peak, gap, from: f0, shift: sh }); } });
        const fit = opts.filter(o => o.peak <= 100 && !o.gap).sort((x, y) => x.shift - y.shift || x.peak - y.peak);
        const fit2 = opts.filter(o => o.peak <= 100).sort((x, y) => x.gap - y.gap || x.shift - y.shift || x.peak - y.peak);
        best = fit[0] || opts.filter(o => !o.gap && !o.shift).sort((x, y) => x.peak - y.peak)[0] || fit2[0] || opts.filter(o => !o.shift).sort((x, y) => x.gap - y.gap || x.peak - y.peak)[0];
        if (best) { for (let m = best.from; m < Math.min(6, best.from + dm.months); m++) extra[best.name + '|' + m] = (extra[best.name + '|' + m] || 0) + dm.pct; res.push({ dm, best }); } });
      return res; };
    const isMon = s.tpH === 'monate';
    const kiW = s.tpKi && !isMon ? tpKiPlan() : [], kiM = s.tdKi && isMon ? kiMon() : [];
    const applyW = list => { const pl = Object.assign({}, this.state.tplan), cl = Object.assign({}, this.state.claimed); list.forEach(r => { pl[r.it.id] = { who: r.best.name, iso: r.best.iso }; cl[r.it.id] = 'Zugewiesen an ' + r.best.name + ' für ' + r.best.label + ' (KI-Vorschlag)'; });
      this.setState({ tplan: pl, claimed: cl, tpKi: list.length === kiW.length ? false : this.state.tpKi, tpMsg: (list.length === 1 ? '„' + list[0].it.title + '“' : list.length + ' Aufgaben') + ' nach KI-Vorschlag verteilt. Alle haben sie sofort in Meine Arbeit.' }); };
    const applyM = list => { const td = Object.assign({}, this.state.tdPlan); list.forEach(r => { td[r.dm.id] = { who: r.best.name, from: r.best.from }; });
      this.setState({ tdPlan: td, tdKi: list.length === kiM.length ? false : this.state.tdKi, tpMsg: (list.length === 1 ? '„' + list[0].dm.title + '“' : list.length + ' Bedarfe') + ' nach KI-Vorschlag eingeplant.' }); };
    const kiRows = isMon ? kiM.map(r => ({ title: r.dm.title, to: r.best.name + ' ab ' + MONTHS[r.best.from] + (r.best.shift ? ' (' + r.best.shift + ' Mon. später als gewünscht)' : ''), why: (r.best.gap ? '⚠ Qualifikation knapp' : '✓ ' + (r.dm.need || 'passt')) + ' · Spitze danach ' + r.best.peak + ' %' + (r.best.peak > 100 ? ' · geht nur mit Überlast, Projektleitung fragen' : '') + (r.best.shift ? ' · früher wäre jemand über 100 %' : ''), color: r.best.peak > 100 ? RED : (r.best.gap || r.best.shift ? '#A33F06' : GREEN), take: () => applyM([r]) }))
      : kiW.map(r => ({ title: r.it.title, to: r.best.name + ', ' + r.best.label + ' (KW ' + tp_kwOf(r.best.w) + ')', why: (r.best.gap ? '⚠ Qualifikation knapp' : '✓ ' + r.it.needs) + ' · Tag danach ' + fmtH(r.best.after) + ' von 5,6 h' + (r.best.after > DAYH ? ' · nur mit Mehrarbeit oder auf zwei Tage verteilt' : ''), color: r.best.after > DAYH ? RED : (r.best.gap ? '#A33F06' : GREEN), take: () => applyW([r]) }));
    Object.assign(tp, {
      isWoche: !isMon, isMonate: isMon, heading: isMon ? 'Grobplanung Dezember bis Mai' : 'Tagesplanung bis Mai · Aufgaben auf Person und Tag',
      horizons: [['woche', 'Tage (bis 6 Monate)'], ['monate', '6 Monate grob']].map(([k, l]) => ({ label: l, pressed: (s.tpH || 'woche') === k ? 'true' : 'false', ring: (s.tpH || 'woche') === k ? accent : t.border, bg: (s.tpH || 'woche') === k ? t.soft : t.surface, go: () => this.setState({ tpH: k, tpMsg: '' }) })),
      kiOn: s.kiPref.team !== false, kiBtn: () => this.setState(isMon ? { tdKi: !s.tdKi } : { tpKi: !s.tpKi }),
      kiOpen: (isMon ? s.tdKi : s.tpKi) && s.kiPref.team !== false, kiRows, kiHas: kiRows.length > 0, kiNone: kiRows.length === 0,
      kiNote: isMon ? 'Die KI verteilt offene Bedarfe so, dass die Qualifikation passt und niemand über 100 % kommt; wenn nötig schiebt sie den Start um bis zu 3 Monate. Grundlage: Projektanteile, wiederkehrende Aufgaben, Abwesenheiten.'
        : (kiW.some(r => r.best.after > DAYH) ? 'Die Woche ist voll: ' + kiW.filter(r => r.best.after > DAYH).length + ' von ' + kiW.length + ' Aufgaben passen nur mit Mehrarbeit. Besser einen späteren Tag vor der Fälligkeit wählen oder in Teile schneiden.' : 'Die KI verteilt so, dass die Qualifikation passt und die Tage unter 5,6 h bleiben. Aufgaben mit späterer Fälligkeit legt sie auf den ersten passenden Tag bis dahin, mit Urlaub, Feiertagen und wiederkehrenden Aufgaben.'),
      kiAll: () => (isMon ? applyM(kiM) : applyW(kiW)), kiClose: () => this.setState(isMon ? { tdKi: false } : { tpKi: false }),
      months: MONTHS,
      monRows: TM.members.map(([name, role, loads]) => ({ name, role, ini: ini(name), color: AV[name] || accent, cells: MONTHS.map((ml, m) => { const v2 = loadM(name, loads, m), key = 'td|' + name + '|' + m, hot = s.dragOver === key;
        const starts = demList.filter(dm => tdP[dm.id] && tdP[dm.id].who === name && tdP[dm.id].from === m);
        return { label: v2 + ' %', bg: hot ? t.soft : (v2 > 100 ? '#FDE7E9' : (v2 >= 80 ? '#FFF4CE' : '#DFF6DD')), fg: v2 > 100 ? '#A4262C' : (v2 >= 80 ? '#5C4300' : '#0E4F0E'), bd: hot ? accent : 'transparent', aria: name + ', ' + ml,
          chips: starts.map(dm => ({ label: '→ ' + dm.short + ' ' + dm.pct + ' % · ' + dm.months + ' Mon.', aria: dm.title + ' zurücknehmen', open: () => { const o = Object.assign({}, this.state.tdPlan); delete o[dm.id]; this.setState({ tdPlan: o, tpMsg: '„' + dm.title + '“ ist wieder offen.' }); } })),
          over: this.dragOver(key), drop: this.dropOn(key, id => { if (typeof id === 'string' && id.indexOf('td:') === 0) assignD(id.slice(3), name, m); }),
          click: () => { if (this.state.tdSel) assignD(this.state.tdSel, name, m); else { const d0 = tp_PDAYS.find(x => x.mon === m); this.setState({ tpH: 'woche', tpZoom: 'w4', tpW: Math.min(tp_NWEEKS - 4, d0 ? d0.w : 0), tpMsg: ml + ' Tag für Tag. Zurück zur Grobplanung über „6 Monate grob“.' }); } } }; }) })),
      demItems: demList.filter(dm => !tdP[dm.id]).map(dm => ({ title: dm.title, sub: dm.pct + ' % · ' + MONTHS[dm.from] + ' bis ' + MONTHS[Math.min(5, dm.from + dm.months - 1)] + (dm.need ? ' · ' + dm.need : ''), proj: dm.proj,
        ring: s.tdSel === dm.id ? accent : t.border, bg: s.tdSel === dm.id ? t.soft : t.surface, drag: this.dragStart('td:' + dm.id), dragEnd: this.dragEnd(), pick: () => this.setState({ tdSel: s.tdSel === dm.id ? null : dm.id }) })),
      noDem: demList.filter(dm => !tdP[dm.id]).length === 0,
      recur: recur.map(([title, rhythm, who, h, freq]) => ({ title, sub: rhythm + ' · ' + who + ' · ' + h.toLocaleString('de-DE') + ' h je Termin, etwa ' + (Math.round(h * (RFREQ[freq] || 1) * 10) / 10).toLocaleString('de-DE') + ' h im Monat' })),
      addRecur: () => this.setState({ panel: { kind: 'new', id: 'new', from: 'teams' }, nt: Object.assign({}, s.nt, { kind: 'aufgabe', who: 'ich', title: '', rep: 'wöchentlich', ctx: s.team === 'instandhaltung' ? 'ih' : null, proj: s.team === 'instandhaltung' ? 'Instandhaltung Halle 2' : 'Ohne Projekt', co: [] }) }),
      monHint: s.tdSel ? 'Bedarf gewählt: jetzt Person und Startmonat anklicken.' : 'Bedarf aus Projekten auf Person und Startmonat ziehen oder anklicken und dann die Zelle. Zellen zeigen die Auslastung inklusive Projektanteilen und wiederkehrender Aufgaben. Ohne Auswahl öffnet ein Klick den Monat Tag für Tag.'
    });
    const tm = {
      name: TM.name, code: TM.code, color: TM.color, lead: TM.lead, memberCount: TM.members.length,
      kpis: [
        { label: 'Im Team-Eingang', value: String(openInbox), color: t.text },
        { label: 'Störungen offen', value: String(TM.inbox.filter(it => it.type === 'Störung' && !s.claimed[it.id]).length), color: RED },
        { label: 'Ø Auslastung KW 46', value: avgLoad + ' %', color: avgLoad > 100 ? RED : t.text },
        { label: 'Zertifikate ≤ 60 Tage', value: String(expiring), color: expiring ? '#8A3707' : t.text }
      ],
      heat, inbox, skills: TM.skills,
      skillRows: TM.members.map(([name]) => ({ name, levels: (TM.levels[name] || []).map((lv, i) => ({ aria: name + ', ' + TM.skills[i] + ': Stufe ' + lv + ' von 4', dots: [1, 2, 3, 4].map(n => ({ bg: n <= lv ? accent : 'transparent', bd: n <= lv ? accent : t.strong })) })) })),
      certs, noCerts: certs.length === 0
    };

    // Projekte
    const msAll = Object.values(NODE).filter(n => n.type !== 'phase' && !n.pd);
    const msDone = msAll.filter(n => this.nodeStatus(n) === 'erledigt').length;
    const projects = [
      { code: 'SM', name: 'SM42 Schraubstation', color: '#0F6CBD', model: 'Wasserfall', stufe: 'Stufe 3', chip: this.chip('ueberfaellig', t, accent), progress: Math.round(msDone / msAll.length * 100) + '%', next: 'Servoantriebe 20.11.', clickable: true, static: false, open: () => this.openProject('sm42') },
      { code: 'RL', name: 'Retrofit Linie 2', color: '#0E7A6E', model: 'Scrum', stufe: 'Stufe 2', chip: this.chip('plan', t, accent), progress: '50%', next: 'Sprint-4-Review heute', clickable: true, static: false, open: () => this.openProject('rl2') },
      { code: 'PD', name: 'Prüfstand Drehmoment', color: '#5B2D90', model: 'V-Modell', stufe: 'Stufe 4', chip: this.chip(VN.some(v => this.vStatus(v) === 'ueberfaellig') ? 'ueberfaellig' : 'plan', t, accent), progress: '45%', next: 'Messverstärker-Modul', clickable: true, static: false, open: () => this.openProject('pd') },
      { code: 'IH', name: 'Instandhaltung Halle 2', color: '#A33F06', model: 'Kanban', stufe: 'Stufe 1', chip: this.chip('plan', t, accent), progress: '60%', next: 'Wartung Presse 3 13.11.', clickable: true, static: false, open: () => this.openProject('ih') }
    ];

    // Projekt-Tabs
    const TABK0 = ['uebersicht', 'aufgaben', 'planung', 'team', 'analyse', 'dokumente', 'finanzen'], TABK = ['uebersicht', 'aufgaben', 'planung', 'team', 'analyse', 'zeiten', 'kapazitaet', 'status', 'opl', 'dokumente', 'finanzen', 'aenderungen', 'abschluss', 'verlauf'];
    const TLBL = { analyse: 'Risiken', zeiten: 'Zeiten', kapazitaet: 'Kapazität', status: 'Statusbericht', opl: 'Offene Punkte', abschluss: 'Abschluss', aenderungen: 'Change Requests', verlauf: 'Verlauf' }, TLBL_X = { en: { analyse: 'Risks', zeiten: 'Time', kapazitaet: 'Capacity', status: 'Status report', opl: 'Open items', abschluss: 'Closure', aenderungen: 'Change requests', verlauf: 'History' }, es: { analyse: 'Riesgos', zeiten: 'Tiempos', kapazitaet: 'Capacidad', status: 'Informe de estado', opl: 'Puntos abiertos', abschluss: 'Cierre', aenderungen: 'Solicitudes de cambio', verlauf: 'Historial' }, pl: { analyse: 'Ryzyka', zeiten: 'Czas pracy', kapazitaet: 'Obciążenie', status: 'Raport statusu', opl: 'Otwarte punkty', abschluss: 'Zamknięcie', aenderungen: 'Wnioski o zmianę', verlauf: 'Historia' }, tr: { analyse: 'Riskler', zeiten: 'Süreler', kapazitaet: 'Kapasite', status: 'Durum raporu', opl: 'Açık maddeler', abschluss: 'Kapanış', aenderungen: 'Değişiklik talepleri', verlauf: 'Geçmiş' } }, tlbl = k => ((TLBL_X[s.lang] || {})[k]) || (s.lang === 'de' || !TLBL_X[s.lang] ? TLBL[k] : null) || tr.tabs[TABK0.indexOf(k)];
    const PSc = Object.assign({}, PSET0[s.proj] || { stufe: 2, mods: {} }, (s.psetBy || {})[s.proj] || {});
    const modC = k => { const m = P_MODS.find(x => x[0] === k); return PSc.mods && PSc.mods[k] !== undefined ? PSc.mods[k] : (m ? m[2] <= PSc.stufe : true); };
    const TABMOD = { planung: ['plan'], analyse: ['risk'], zeiten: ['zeit'], kapazitaet: ['res'], status: ['status'], opl: ['opl'], abschluss: ['close'], aenderungen: ['cr'], verlauf: ['audit'], dokumente: ['docs'], finanzen: ['budget'] };
    const ptabs = TABK.map((k, i) => ({ k, label: tlbl(k), sel: s.ptab === k ? 'true' : 'false', line: s.ptab === k ? accent : 'transparent', fg: s.ptab === k ? t.text : t.muted, fw: s.ptab === k ? 700 : 500, go: () => this.setState({ ptab: k, mxMsg: '' }), show: (!TABMOD[k] || TABMOD[k].some(modC)) && !((s.pTabMe || {})[s.proj] || {})[k] }));
    const pTabMeOpts = TABK.map(k => [k, tlbl(k)]).filter(([k]) => !['uebersicht', 'aufgaben', 'team'].includes(k) && (!TABMOD[k] || TABMOD[k].some(modC))).map(([k, l]) => { const h = (s.pTabMe || {})[s.proj] || {}, on = !h[k]; return { label: (on ? '✓ ' : '+ ') + l, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: () => this.setState({ pTabMe: Object.assign({}, s.pTabMe, { [s.proj]: Object.assign({}, h, { [k]: on }) }) }) }; });
    const isSm = s.proj === 'sm42';
    const ptl = this.layUI('team:' + s.proj, ['mitglieder', 'auslastung', 'raci', 'akv', 'abwesend', 'kontakte'], { mitglieder: 'Mitglieder', auslastung: 'Auslastung', raci: 'RACI-Matrix', akv: 'AKV', abwesend: 'Abwesenheiten', kontakte: 'Kontakte' }, ['mitglieder'], t, accent);
    const pTabMeOpen = !!s.pTabMeOpen, pTabMeToggle = () => this.setState({ pTabMeOpen: !s.pTabMeOpen });
    const pt = {}; TABK.forEach(k => { pt[k] = s.ptab === k; });
    pt.gantt = isSm && s.ptab === 'planung';
    pt.scrum = s.proj === 'rl2' && s.ptab === 'planung';
    pt.vmodel = s.proj === 'pd' && s.ptab === 'planung';
    pt.kanban = s.proj === 'ih' && s.ptab === 'aufgaben';
    const mainTab = s.proj === 'ih' ? 'aufgaben' : 'planung';
    pt.ihPlan = s.proj === 'ih' && s.ptab === 'planung';
    pt.placeholder = false;
    const pjPlaceholder = { title: tr.tabs[TABK.indexOf(s.ptab)] || '', main: tr.tabs[TABK.indexOf(mainTab)] };
    const red = { bg: RED, fg: '#FFFFFF', bd: RED }, grn = { bg: GREEN, fg: '#FFFFFF', bd: GREEN }, neu = { bg: t.surface, fg: t.text, bd: t.strong }, accC = { bg: accent, fg: '#FFFFFF', bd: accent };
    const PJ = {
      sm42: { code: 'SM', color: '#0F6CBD', name: 'SM42 Schraubstation', meta: 'Wasserfall · Stufe 3 · Projektleitung: du · 01.09.2026 – 26.01.2027', chips: [Object.assign({ label: '! Termin: 2 überfällig' }, red), Object.assign({ label: '✓ Kosten im Budget' }, grn), Object.assign({ label: 'Qualität: Gate G2 offen' }, neu)] },
      rl2: { code: 'RL', color: '#0E7A6E', name: 'Retrofit Linie 2', meta: 'Scrum · Stufe 2 · Product Owner: du · Sprint 4 von 8 · Release 1 nach Sprint 8', chips: [Object.assign({ label: 'Sprint 4 endet heute' }, accC), Object.assign({ label: 'Velocity Ø 18 SP' }, neu)] },
      pd: { code: 'PD', color: '#5B2D90', name: 'Prüfstand Drehmoment', meta: 'V-Modell · Stufe 4 · Projektleitung: N. Becker · 01.06.2026 – 31.03.2027', chips: [Object.assign({ label: '! Modulentwurf überfällig' }, red), Object.assign({ label: 'Testabdeckung 27 %' }, neu), Object.assign({ label: 'Audit-Log aktiv' }, neu)] }
    };
    const kbInArbeit = Object.values(s.kb).filter(c => c === 'arbeit').length;
    PJ.ih = { code: 'IH', color: '#A33F06', name: 'Instandhaltung Halle 2', meta: 'Kanban · Stufe 1 · Team Instandhaltung · Leitung: R. Fischer · laufend',
      chips: [Object.assign({ label: '! 1 Expedite offen' }, red), Object.assign({ label: 'WIP In Arbeit ' + kbInArbeit + '/3' }, kbInArbeit >= 3 ? accC : neu), Object.assign({ label: 'Ø Durchlaufzeit 3,4 Tage' }, neu)] };
    const pj = PJ[s.proj];

    // ── Scrum ──
    const SV = [['zyklus', 'Überblick'], ['backlog', 'Backlog'], ['planning', 'Sprint-Planung'], ['board', 'Sprint-Board'], ['review', 'Review & Retro'], ['metrics', 'Kennzahlen']];
    const scrumViews = SV.map(([k, l], i) => { const on = s.sview === k; return { label: l, n: String(i + 1), sel: on ? 'true' : 'false', bg: on ? t.surface : 'transparent', fg: on ? t.text : t.muted, shadow: on ? '0 1px 2px rgba(0,0,0,0.08)' : 'none', numBg: on ? accent : t.track, numFg: on ? '#FFFFFF' : t.text, go: () => this.setState({ sview: k, boardMsg: '' }) }; });
    const sv = {}; SV.forEach(([k]) => { sv[k] = s.sview === k; });
    const openStory = id => this.setState({ panel: { kind: 'story', id, from: 'scrum' } });
    const moveOrder = (id, dir) => { const o = s.order.slice(); const i = o.indexOf(id), j = i + dir; if (j < 0 || j >= o.length) return; o[i] = o[j]; o[j] = id; this.setState({ order: o }); };
    const backlog = s.order.map((id, i) => {
      const st2 = STORIES[id], status = s.sst[id], ready = st2.ac.length > 0;
      return { rank: String(i + 1), key: st2.key, title: st2.title, story: 'Als ' + st2.role + ' möchte ich ' + st2.goal, epic: st2.epic, epicBg: EPIC_BG[st2.epic], mo: st2.mo, moBg: MO_BG[st2.mo], sp: String(st2.sp),
        dor: ready ? '✓ erfüllt' : '! keine Akzeptanzkriterien', dorColor: ready ? GREEN : RED,
        sprint: st2.sprint ? 'Sprint ' + st2.sprint + ' · ' + status : (s.plan5.includes(id) ? 'Sprint 5 geplant' : '–'),
        rowBg: s.panel && s.panel.id === id ? t.hl : 'transparent', open: () => openStory(id),
        up: () => moveOrder(id, -1), down: () => moveOrder(id, 1), upLabel: st2.key + ' nach oben', downLabel: st2.key + ' nach unten' };
    });
    const leftIds = s.order.filter(id => !s.plan5.includes(id) && (STORIES[id].sprint === 0 || (STORIES[id].sprint === 4 && s.sst[id] !== 'Done' && s.sst[id] !== 'Review')));
    const planLeft = leftIds.map(id => {
      const st2 = STORIES[id], ready = st2.ac.length > 0, carry = st2.sprint === 4;
      return { key: st2.key, title: st2.title, sp: String(st2.sp), ready, blocked: !ready,
        note: !ready ? 'DoR offen: keine Akzeptanzkriterien' : (carry ? 'Übertrag aus Sprint 4 · ' + s.sst[id] : 'DoR erfüllt · ' + st2.epic + ' · ' + st2.mo),
        noteColor: !ready ? RED : (carry ? '#8A3707' : t.muted),
        addLabel: st2.key + ' in Sprint 5 einplanen', add: () => this.setState({ plan5: s.plan5.concat([id]) }) };
    });
    const planRight = s.plan5.map(id => ({ key: STORIES[id].key, title: STORIES[id].title, sp: String(STORIES[id].sp), removeLabel: STORIES[id].key + ' aus Sprint 5 entfernen', remove: () => this.setState({ plan5: s.plan5.filter(x => x !== id) }) }));
    const planSum = s.plan5.reduce((a, id) => a + STORIES[id].sp, 0);
    const plan = { sum: String(planSum), empty: planSum === 0, w: pct(Math.min(planSum / 18, 1) * 100),
      color: planSum > 18 ? RED : (planSum >= 14 ? GREEN : accentText),
      msg: planSum === 0 ? 'Stories aus dem Backlog einplanen' : (planSum > 18 ? 'Über der Kapazität: ' + (planSum - 18) + ' SP zu viel' : (planSum >= 14 ? 'Passt zur Kapazität' : 'Noch ' + (18 - planSum) + ' SP frei')) };
    // Planbare Zeit: Sollarbeitszeit 35 h/Woche × Planungsfaktor 80 % = 28 h/Woche = 5,6 h/Tag, 10 Arbeitstage
    const capacity = [['J. Novak', 1, 1, '1 Tag Urlaub'], ['S. Keller', 0.5, 0, '–'], ['M. Yilmaz', 0.5, 2, '2 Tage Schulung'], ['F. Roth', 0.3, 0, '–']]
      .map(([name, share, away, awayText]) => ({ name, pct: Math.round(share * 100) + ' %', away: awayText, h: (Math.round((10 - away) * 5.6 * share * 10) / 10).toLocaleString('de-DE') + ' h' }));
    const sprintIds = s.s5 ? s.plan5.slice() : ['s1', 's2', 's3', 's4'];
    const goal5 = s.goal5 !== undefined ? s.goal5 : 'Safety-Zuhaltung und Rezeptverwaltung abnahmebereit';
    const sp5 = { goal: goal5, setGoal: e => this.setState({ goal5: e && e.target ? e.target.value : '' }), started: !!s.s5, notStarted: !s.s5,
      hasMsg: !!s.sp5Msg, msg: s.sp5Msg || '', msgColor: s.s5 ? GREEN : RED, goBoard: () => this.setState({ sview: 'board', boardMsg: '' }),
      boardName: s.s5 ? 'Sprint 5' : 'Sprint 4', boardGoal: s.s5 ? goal5 : 'HMI-Grundbedienung und Not-Halt über Safety-SPS lauffähig', chip: s.s5 ? 'Sprint 5 · 16.11.–27.11. · Tag 1 von 10' : 'Sprint 4 · 02.11.–13.11. · endet heute',
      start: () => { const g = (goal5 || '').trim(), sum = s.plan5.reduce((a, id) => a + STORIES[id].sp, 0);
        if (!g) return this.setState({ sp5Msg: 'Ohne Sprintziel geht es nicht: Was soll am Ende des Sprints erreicht sein? Ein Satz reicht.' });
        if (!sum) return this.setState({ sp5Msg: 'Noch keine Story eingeplant. Links aus dem Backlog mit „+“ in den Sprint holen.' });
        if (sum > 18) return this.setState({ sp5Msg: 'Über der Kapazität: ' + (sum - 18) + ' SP zu viel. Erst eine Story herausnehmen, sonst ist die Zusage nicht zu halten.' });
        const sst = Object.assign({}, s.sst); s.plan5.forEach(id => { if (!sst[id] || sst[id] === 'Done') sst[id] = 'To Do'; });
        const back = ['s1', 's2', 's3', 's4'].filter(id => !s.plan5.includes(id) && s.sst[id] !== 'Done').map(id => STORIES[id].key);
        this.setState({ s5: true, sst, sp5Msg: 'Sprint 5 gestartet: ' + s.plan5.length + ' Stories, ' + sum + ' SP, Ziel „' + g + '“. Das Team sieht sie jetzt im Sprint-Board.' + (back.length ? ' Nicht übernommen und zurück im Backlog: ' + back.join(', ') + '.' : '') }); } };
    const sboard = SB_COLS.map(([name, color], ci) => {
      const ids = sprintIds.filter(id => s.sst[id] === name), sbKey = 'sb|' + name, sbHot = s.dragOver === sbKey;
      return { name, color, over: this.dragOver(sbKey), drop: this.dropOn(sbKey, tid => { const x = TASK[tid]; if (x && x.story) this.storyTo(x.story, name); }),
        bg: sbHot ? t.soft : t.surface2, bd: sbHot ? accent : t.border, bdStyle: sbHot ? 'dashed' : 'solid', sp: String(ids.reduce((a, id) => a + STORIES[id].sp, 0)),
        cards: ids.map(id => {
          const st2 = STORIES[id], a = s.acs[id], ok = a.filter(Boolean).length, full = ok === a.length;
          return { key: st2.key, title: st2.title, sp: String(st2.sp), ini: ini(st2.owner), avColor: AV[st2.owner] || accent, ac: ok + '/' + a.length,
            acBg: full ? GREEN : t.surface, acFg: full ? '#FFFFFF' : t.text, acBd: full ? GREEN : t.strong,
            canLeft: ci > 0, canRight: ci < SB_COLS.length - 1, left: () => this.moveStory(id, -1), right: () => this.moveStory(id, 1),
            leftLabel: st2.key + ' nach ' + (SB_COLS[ci - 1] || [''])[0], rightLabel: st2.key + ' nach ' + (SB_COLS[ci + 1] || [''])[0], open: () => openStory(id), drag: this.dragStart('rt' + id), dragEnd: this.dragEnd() };
        }) };
    });
    const doneSp = sprintIds.filter(id => s.sst[id] === 'Done').reduce((a, id) => a + STORIES[id].sp, 0);
    const spTot = s.s5 ? Math.max(1, s.plan5.reduce((a, id) => a + STORIES[id].sp, 0)) : 26;
    const rest = spTot - doneSp;
    const bx = i => 24 + i * 30, by = v => 140 - v / spTot * 120;
    const actualVals = [26, 26, 26, 26, 21, 21, 21, 21, 21, Math.min(rest, 21)];
    if (doneSp < 5) actualVals[9] = rest;
    const burn = { rest: String(rest), total: String(spTot), from: s.s5 ? '16.11.' : '02.11.', to: s.s5 ? '27.11.' : '13.11.',
      ideal: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => bx(i) + ',' + by(spTot - spTot * i / 9)).join(' '),
      actual: (s.s5 ? [spTot, rest] : actualVals).map((v, i) => bx(i) + ',' + by(v)).join(' '),
      aria: (s.s5 ? 'Burndown Sprint 5, Tag 1: Rest ' : 'Burndown Sprint 4: Rest ') + rest + ' von ' + spTot + ' Story Points' };
    const boardMsg = { show: !!s.boardMsg, text: s.boardMsg };
    const GB = [['erreicht', 'Erreicht'], ['teilweise', 'Teilweise'], ['nicht', 'Nicht erreicht']];
    const goalBtns = GB.map(([k, l]) => { const on = s.goal === k; return { label: l, sel: on ? 'true' : 'false', bg: on ? accent : t.surface, fg: on ? '#FFFFFF' : t.text, bd: on ? accent : t.strong, go: () => this.setState({ goal: k }) }; });
    const setAcc = (id, v) => { const a = Object.assign({}, s.accept); if (v === null) delete a[id]; else a[id] = v; this.setState({ accept: a }); };
    const reviewRows = sprintIds.map(id => {
      const st2 = STORIES[id], a = s.acs[id], dec = s.accept[id];
      return { key: st2.key, title: st2.title, sp: String(st2.sp), state: s.sst[id], ac: a.filter(Boolean).length + '/' + a.length,
        undecided: !dec, decided: !!dec, result: dec === 'ja' ? '✓ Angenommen' : 'Nicht angenommen → zurück ins Backlog',
        resBg: dec === 'ja' ? GREEN : t.surface, resFg: dec === 'ja' ? '#FFFFFF' : t.text, resBd: dec === 'ja' ? GREEN : t.strong,
        yesBg: t.surface, yesFg: this.props.dark ? '#6CCB5F' : GREEN,
        yes: () => setAcc(id, 'ja'), no: () => setAcc(id, 'nein'), reset: () => setAcc(id, null) };
    });
    const accSp = sprintIds.filter(id => s.accept[id] === 'ja').reduce((a, id) => a + STORIES[id].sp, 0);
    const review = { accSp: String(accSp), rel: Math.round(accSp / 26 * 100) + ' %' };
    const RX = s.retroX || {}, rAdd = s.retroAdd || null, rWho = s.retroWho || 'J. Novak', RTEAM = ['Du', 'J. Novak', 'S. Keller', 'M. Yilmaz', 'F. Roth'];
    const retro = [
      { k: 'gut', title: 'Lief gut', bg: '#DFF6DD', fg: '#0E4F0E', items: [{ text: 'HMI-Prototyp früh mit Bedienern getestet' }, { text: 'Daily kurz und pünktlich' }], ph: 'Was lief gut? z. B. Abstimmung mit der Schicht', addLabel: '+ Karte' },
      { k: 'verb', title: 'Verbessern', bg: '#FFF4CE', fg: '#5C4300', items: [{ text: 'Safety-Validierung zu spät begonnen' }, { text: 'Testanlage oft belegt' }], ph: 'Was hat gebremst oder gestört?', addLabel: '+ Karte' },
      { k: 'mass', title: 'Maßnahmen', bg: '#DCEAF7', fg: '#0C3B5E', items: [{ text: 'Safety-Validierung ab Sprintbeginn einplanen', owner: 'J. Novak' }, { text: 'Slots für die Testanlage im Kalender reservieren', owner: 'S. Keller' }], ph: 'Was machen wir konkret anders?', addLabel: '+ Maßnahme' }
    ].map(c => { const adding = rAdd === c.k;
      const save = () => { const v = (this.state.retroT || '').trim(); if (!v) return this.setState({ retroMsg: 'Bitte erst einen Text eingeben.' }); const it = { text: v }; let msg = 'Karte in „' + c.title + '“ ergänzt.';
        if (c.k === 'mass') { it.owner = rWho; this.quickTask({ title: v, proj: 'Retrofit Linie 2', due: '2026-11-27', owner: rWho }); msg = 'Maßnahme angelegt und als Aufgabe für ' + (rWho === 'Du' ? 'dich' : rWho) + ' eingeplant, fällig zum Sprintende am 27.11. In der nächsten Retro prüft ihr, ob sie gewirkt hat.'; }
        this.setState({ retroX: Object.assign({}, this.state.retroX, { [c.k]: ((this.state.retroX || {})[c.k] || []).concat([it]) }), retroAdd: null, retroT: '', retroMsg: msg }); };
      return Object.assign({}, c, { items: c.items.concat(RX[c.k] || []).map(it => ({ text: it.text, owner: it.owner || '', hasOwner: !!it.owner, canPromote: c.k === 'verb', promote: () => this.setState({ retroAdd: 'mass', retroT: it.text.replace(/^./, m => m.toUpperCase()) + ' – Gegenmaßnahme: ', retroMsg: '' }) })),
        adding, notAdding: !adding, isMass: c.k === 'mass', text: adding ? (s.retroT || '') : '', setText: e => this.setState({ retroT: e && e.target ? e.target.value : '' }),
        key: e => { if (e && e.key === 'Enter') save(); if (e && e.key === 'Escape') this.setState({ retroAdd: null, retroT: '' }); },
        whos: RTEAM.map(n => ({ label: n === 'Du' ? 'ich' : n, pressed: rWho === n ? 'true' : 'false', ring: rWho === n ? '#0C3B5E' : '#D1D1D1', go: () => this.setState({ retroWho: n }) })),
        saveLabel: c.k === 'mass' ? 'Anlegen (wird Aufgabe)' : 'Hinzufügen', save, add: () => this.setState({ retroAdd: c.k, retroT: '', retroMsg: '' }), cancel: () => this.setState({ retroAdd: null, retroT: '' }) }); });
    const retroInfo = { hasMsg: !!s.retroMsg, msg: s.retroMsg || '' };
    const moodBtns = [1, 2, 3, 4, 5].map(n => { const on = s.mood === n; return { n: String(n), sel: on ? 'true' : 'false', aria: 'Stimmung ' + n + ' von 5', bg: on ? accent : t.surface, fg: on ? '#FFFFFF' : t.text, bd: on ? accent : t.strong, go: () => this.setState({ mood: n }) }; });
    const moods = [4, 3, 4].concat(s.mood ? [s.mood] : []);
    const moodAvg = (Math.round(moods.reduce((a, b) => a + b, 0) / moods.length * 10) / 10).toLocaleString('de-DE') + ' von 5 (' + moods.length + ' Stimmen)';
    const velocity = [['Sprint 1', 18, 15], ['Sprint 2', 20, 19], ['Sprint 3', 22, 21], ['Sprint 4', 26, doneSp]].map(([label, c, d]) => ({ label, c: String(c), d: String(d), ch: Math.round(c / 30 * 170) + 'px', dh: Math.round(d / 30 * 170) + 'px' }));
    const scrumKpis = [
      { label: 'Velocity Ø Sprint 1–3', value: '18 SP', sub: 'Grundlage für die Planung von Sprint 5' },
      { label: 'Zusagezuverlässigkeit Sprint 4', value: Math.round(doneSp / 26 * 100) + ' %', sub: doneSp + ' von 26 SP erledigt' },
      { label: 'Release 1 (Epics HMI, Safety)', value: 'Sprint 8', sub: 'Prognose aus Rest-Backlog und Velocity' }
    ];

    // ── Scrum-Zyklus grafisch ──
    const goView = k => () => this.setState({ sview: k, boardMsg: '' });
    const notDone = Object.keys(STORIES).filter(id => s.sst[id] !== 'Done');
    const decidedN = sprintIds.filter(id => s.accept[id]).length;
    const zNode = (sub, go, hot) => ({ sub, go, bd: hot ? accent : t.border, bg: hot ? t.soft : t.surface });
    const zy = {
      backlog: zNode(notDone.length + ' Stories · ' + notDone.reduce((a, id) => a + STORIES[id].sp, 0) + ' SP', goView('backlog')),
      planning: zNode('Sprint 5 ab 16.11.' + (planSum ? ' · ' + planSum + ' SP geplant' : ''), goView('planning')),
      sprintBacklog: zNode('4 Stories · 26 SP zugesagt', goView('board')),
      sprint: { go: goView('board'), day: 'Tag 10 / 10', sp: doneSp + ' von 26 SP', aria: 'Sprint 4, Tag 10 von 10, ' + doneSp + ' von 26 Story Points erledigt. Öffnet das Sprint-Board.' },
      increment: zNode(doneSp + ' SP fertig' + (accSp ? ' · ' + accSp + ' SP abgenommen' : ' · Abnahme im Review'), goView('review')),
      review: zNode(decidedN + ' von 4 Stories bewertet', goView('review'), true),
      retro: zNode('2 Maßnahmen · Stimmung ' + moodAvg.split(' ')[0], goView('review'))
    };
    const ring = { time: '597 597', sp: Math.round(490 * doneSp / 26) + ' 490' };
    const sprintStrip = [1, 2, 3, 4, 5, 6, 7, 8].map(n => {
      const doneS = n < 4, cur = n === 4, nxt = n === 5;
      const vel = { 1: 15, 2: 19, 3: 21 }[n];
      return { label: 'Sprint ' + n, sub: doneS ? '✓ ' + vel + ' SP' : (cur ? 'läuft · endet heute' : (nxt ? (s.s5 ? 'läuft seit 16.11.' : 'Planung · ab 16.11.') : 'geplant')),
        bg: doneS ? GREEN : (cur ? accent : t.surface), fg: doneS || cur ? '#FFFFFF' : t.text, bd: doneS ? GREEN : (cur ? accent : (nxt ? accent : t.border)),
        go: cur ? goView('board') : (nxt ? goView('planning') : goView('metrics')) };
    });

    // ── Kanban ──
    const KB_BY = {}; KB.forEach(k => { KB_BY[k.id] = k; });
    const kbCount = col => Object.values(s.kb).filter(c => c === col).length;
    const KBC = this.kbColsOf(), kbGrid = 'repeat(' + KBC.length + ', minmax(200px, 1fr))', kbMinW = (KBC.length * 220) + 'px';
    const kbHead = KBC.map(([key, name, lim, color], ci) => {
      const n = kbCount(key), full = lim && n >= lim, LIMS = [null, 2, 3, 4, 5, 6], nextLim = LIMS[(LIMS.indexOf(lim) + 1) % LIMS.length];
      const swap = d => { const o = KBC.slice(), j = ci + d; if (j < 0 || j >= o.length) return; [o[ci], o[j]] = [o[j], o[ci]]; this.kbSetCols(o, '„' + name + '“ verschoben.'); };
      return { name, color, lim: lim ? n + ' / ' + lim : String(n), limBg: full ? RED : t.track, limFg: full ? '#FFFFFF' : t.text, bg: full ? (this.props.dark ? '#3A1F22' : '#FDF3F4') : t.surface, bd: full ? RED : t.border,
        limTitle: (lim ? 'WIP-Limit ' + lim : 'Ohne WIP-Limit') + '. Klick: ' + (nextLim ? 'Limit ' + nextLim : 'ohne Limit'),
        cycleLim: () => this.kbSetCols(KBC.map(c => (c[0] === key ? [c[0], c[1], nextLim, c[3]] : c)), '„' + name + '“: ' + (nextLim ? 'WIP-Limit ' + nextLim + '.' : 'kein WIP-Limit mehr.')),
        rename: e => { const v = e && e.target ? e.target.value : name; this.setState({ kbCols: this.kbColsOf().map(c => (c[0] === key ? [c[0], v, c[2], c[3]] : c)) }); },
        left: () => swap(-1), right: () => swap(1), leftLabel: 'Spalte ' + name + ' nach links', rightLabel: 'Spalte ' + name + ' nach rechts', delLabel: 'Spalte ' + name + ' löschen',
        del: () => { if (key === 'erledigt') return this.setState({ kbMsg: '„' + name + '“ ist die Erledigt-Spalte und bleibt.', kbOk: false }); if (KBC.length <= 2) return this.setState({ kbMsg: 'Mindestens zwei Spalten müssen bleiben.', kbOk: false });
          const target = KBC.find(c => c[0] !== key), kb = Object.assign({}, s.kb); let m = 0; Object.keys(kb).forEach(id => { if (kb[id] === key) { kb[id] = target[0]; m++; } });
          this.setState({ kbCols: KBC.filter(c => c[0] !== key), kb, kbOk: true, kbMsg: 'Spalte „' + name + '“ gelöscht' + (m ? '; ' + m + (m === 1 ? ' Karte liegt' : ' Karten liegen') + ' jetzt in „' + target[1] + '“.' : '.') }); } };
    });
    const kbAddCol = () => { const fi = KBC.findIndex(c => c[0] === 'erledigt'), o = KBC.slice(); o.splice(fi < 0 ? o.length : fi, 0, ['c' + Date.now().toString(36), 'Neue Spalte', null, '#8764B8']); this.kbSetCols(o, 'Spalte „Neue Spalte“ angelegt. Namen direkt in der Überschrift ändern, Klick auf die Zahl setzt ein WIP-Limit.'); };
    const KA = s.kbAdd || null, KAT = ['Störung', 'Wartung', 'Auftrag'], KAO = ['A. Schulz', 'D. Petrov', 'K. Weber', 'M. Yilmaz', 'R. Fischer', 'Du'];
    const kbAddSave = () => { const a = this.state.kbAdd; if (!a) return; const tt = (a.title || '').trim(); if (!tt) return this.setState({ kbMsg: 'Bitte einen Titel eingeben, z. B. „Presse 2: Leckage am Zylinder“.', kbOk: false }); this.kbNew(a.col, { title: tt, type: a.type || 'Auftrag', anlage: (a.anlage || '').trim(), owner: a.owner || 'R. Fischer', exp: !!a.exp }); };
    const kbAdd = KA ? { title: KA.title || '', setTitle: e => this.setState({ kbAdd: Object.assign({}, this.state.kbAdd, { title: e && e.target ? e.target.value : '' }) }), anlage: KA.anlage || '', setAnlage: e => this.setState({ kbAdd: Object.assign({}, this.state.kbAdd, { anlage: e && e.target ? e.target.value : '' }) }),
      key: e => { if (e && e.key === 'Enter') kbAddSave(); if (e && e.key === 'Escape') this.setState({ kbAdd: null }); },
      types: KAT.map(ty => ({ label: ty, pressed: (KA.type || 'Auftrag') === ty ? 'true' : 'false', bg: (KA.type || 'Auftrag') === ty ? KB_TYPE[ty] : t.surface, fg: (KA.type || 'Auftrag') === ty ? '#FFFFFF' : t.text, go: () => this.setState({ kbAdd: Object.assign({}, this.state.kbAdd, { type: ty }) }) })),
      owners: KAO.map(o => ({ label: o === 'Du' ? 'ich' : o, pressed: (KA.owner || 'R. Fischer') === o ? 'true' : 'false', ring: (KA.owner || 'R. Fischer') === o ? accent : t.border, bg: (KA.owner || 'R. Fischer') === o ? t.soft : t.surface, go: () => this.setState({ kbAdd: Object.assign({}, this.state.kbAdd, { owner: o }) }) })),
      expLabel: KA.exp ? '✓ Expedite (sofort)' : 'Expedite (sofort)', expRing: KA.exp ? RED : t.border, exp: () => this.setState({ kbAdd: Object.assign({}, this.state.kbAdd, { exp: !KA.exp }) }),
      save: kbAddSave, cancel: () => this.setState({ kbAdd: null }) } : {};
    const kbReport = () => this.setState({ kbAdd: { col: KBC[0][0], lane: s.lane === 'keine' ? '' : '\u0000', type: 'Störung', owner: 'R. Fischer', exp: true, title: '', anlage: '' }, lane: 'keine', kbMsg: '' });
    const kbCard = k => {
      const col = s.kb[k.id], ci = this.kbColsOf().findIndex(c => c[0] === col), moved = col !== k.col;
      const age = moved ? 0 : k.age, done = col === 'erledigt';
      return { title: (TASK['ik' + k.id] || k).title, open: () => this.openTask('ik' + k.id, 'proj'), type: k.type, typeBg: KB_TYPE[k.type], anlage: k.anlage, cls: k.cls === 'Fester Termin' ? 'Termin ' + k.due : k.cls, hasClass: k.cls !== 'Standard', classBg: KB_CLASS[k.cls] || t.strong,
        ini: ini(this.ownerOf(TASK['ik' + k.id])), avColor: AV[this.ownerOf(TASK['ik' + k.id])] || accent, drag: this.dragStart('ik' + k.id), dragEnd: this.dragEnd(),
        age: done ? '✓ erledigt' : (age === 0 ? 'heute in Spalte' : age + ' Tage in Spalte'), ageColor: done ? GREEN : (age >= 8 ? RED : (age >= 5 ? '#8A3707' : t.muted)),
        bg: done ? t.surface : (age >= 8 ? (this.props.dark ? '#3A1F22' : '#FDE7E9') : (age >= 5 ? (this.props.dark ? '#3A3320' : '#FFF4CE') : t.surface)), bd: age >= 8 && !done ? RED : (age >= 5 && !done ? '#C19C00' : t.border),
        canLeft: ci > 0, canRight: ci < this.kbColsOf().length - 1, left: () => this.moveKb(k.id, -1), right: () => this.moveKb(k.id, 1),
        leftLabel: k.title + ' nach ' + (this.kbColsOf()[ci - 1] || ['', ''])[1], rightLabel: k.title + ' nach ' + (this.kbColsOf()[ci + 1] || ['', ''])[1] };
    };
    let laneDefs;
    if (s.lane === 'person') laneDefs = ['A. Schulz', 'D. Petrov', 'K. Weber', 'M. Yilmaz', 'R. Fischer'].map(p => ({ title: p, color: AV[p] || accent, filter: k => this.ownerOf(TASK['ik' + k.id]) === p }));
    else if (s.lane === 'klasse') laneDefs = [['Expedite', RED], ['Fester Termin', '#5B2D90'], ['Standard', t.muted]].map(([c, col]) => ({ title: c, color: col, filter: k => k.cls === c }));
    else laneDefs = [{ title: '', color: t.text, filter: () => true }];
    const kbLanes = laneDefs.map(l => {
      const ks = KB.filter(l.filter).filter(k => s.kb[k.id] !== 'neu');
      return { title: l.title, color: l.color, showTitle: s.lane !== 'keine', count: String(ks.length),
        cells: this.kbColsOf().map(([key]) => { const dk = 'kb|' + l.title + '|' + key, hot = s.dragOver === dk;
          const addingH = !!KA && KA.col === key && (KA.lane === l.title || (KA.lane === '\u0000' && l.title === ''));
          return { cards: ks.filter(k => s.kb[k.id] === key).map(kbCard), over: this.dragOver(dk), adding: addingH, notAdding: !addingH, add: () => this.setState({ kbAdd: { col: key, lane: l.title, type: 'Auftrag', owner: s.lane === 'person' ? l.title : 'R. Fischer', title: '', anlage: '' }, kbMsg: '' }), bg: hot ? t.soft : t.surface2, bd: hot ? accent : t.border, bdStyle: hot ? 'dashed' : 'solid',
            drop: this.dropOn(dk, tid => { const x = TASK[tid]; if (!x || !x.kb) return; if (s.lane === 'person' && this.ownerOf(x) !== l.title) this.reassign(tid, l.title); this.kbTo(x.kb, key); }) }; }) };
    }).filter(l => s.lane === 'keine' || l.count !== '0');
    const laneBtns = [['keine', 'Keine'], ['person', 'Person'], ['klasse', 'Serviceklasse']].map(([k, l]) => { const on = s.lane === k; return { label: l, sel: on ? 'true' : 'false', bg: on ? t.surface : 'transparent', fg: on ? t.text : t.muted, go: () => this.setState({ lane: k }) }; });
    const openStoer = KB.filter(k => k.type === 'Störung' && s.kb[k.id] !== 'erledigt' && s.kb[k.id] !== 'neu').length;
    const oldest = Math.max.apply(null, KB.filter(k => s.kb[k.id] === k.col && k.col !== 'erledigt').map(k => k.age).concat([0]));
    const kbKpis = [
      { label: 'Offene Störungen', value: String(openStoer), color: openStoer ? RED : t.text },
      { label: 'In Arbeit (WIP-Limit 3)', value: kbInArbeit + ' / 3', color: kbInArbeit >= 3 ? '#8A3707' : t.text },
      { label: 'Ø Durchlaufzeit', value: '3,4 Tage', color: t.text },
      { label: 'Älteste Karte in Spalte', value: oldest + ' Tage', color: oldest >= 8 ? RED : t.text }
    ];
    const kbMsg = { show: !!s.kbMsg, text: s.kbMsg, bg: s.kbOk ? t.soft : '#FDE7E9', fg: s.kbOk ? t.text : '#A4262C', bd: s.kbOk ? accent : '#FDE7E9' };
    const cx = i => 30 + i * 60, cyv = v => 140 - v * 120 / 75;
    const E = [10, 22, 35, 47, 58], W = [6, 7, 6, 8, 7], Q = [5, 6, 4, 5, 5];
    const layer = (top, bottom) => top.map((v, i) => cx(i) + ',' + cyv(v)).concat(bottom.map((v, i) => cx(i) + ',' + cyv(v)).reverse()).join(' ');
    const EW = E.map((v, i) => v + W[i]), EWQ = EW.map((v, i) => v + Q[i]);
    const cfd = { done: layer(E, [0, 0, 0, 0, 0]), wip: layer(EW, E), queue: layer(EWQ, EW) };

    // ── V-Modell ──
    const vnodes = VN.map(v => {
      const stv = this.vStatus(v), ch = this.chip(stv, t, accent), done = v.kids.filter(k => k[2]).length;
      const sub = v.side === 'R' ? 'Abdeckung ' + v.cov + ' % · ' + done + '/' + v.kids.length + ' Tests' : done + '/' + v.kids.length + ' erledigt · bis ' + fmt(D(v.end));
      const selV = s.panel && s.panel.id === v.id;
      return { name: v.name, sub, left: v.x + '%', top: v.y + '%', bg: ch.bg, fg: ch.fg, bd: selV ? accent : ch.bd, shadow: selV ? '0 0 0 3px ' + accent : '0 1px 3px rgba(0,0,0,0.12)',
        aria: v.name + ', ' + ch.label + ', ' + sub, open: () => this.setState({ panel: { kind: 'vnode', id: v.id, from: 'vmodel' } }) };
    });
    const vlinks = VN.filter(v => v.side === 'L').map(v => { const r = VNODE[v.pair]; return { left: (v.x + 10) + '%', width: (100 - 2 * (v.x + 10)) + '%', top: v.y + '%', cov: r.cov + ' %' }; });

    // Übersicht
    const OVK = ['sm42', 'rl2', 'pd', 'ih'].includes(s.proj) ? s.proj : 'sm42';
    const ovMs = []; PTREE_OF[OVK].forEach(ph => { if (ph.type !== 'phase') ovMs.push(ph); (ph.children || []).forEach(c => ovMs.push(c)); });
    const cnt = x => ovMs.filter(n => this.nodeStatus(n) === x).length;
    const msCounters = [
      { label: 'Erledigt', count: cnt('erledigt'), bg: GREEN, fg: '#FFFFFF', bd: GREEN, go: () => this.setState({ mview: Object.assign({}, s.mview, OVK === 'sm42' ? { sm42p: 'gantt' } : { [OVK + 'p']: 'ms' }), ptab: 'planung', ampel: 'erledigt' }) },
      { label: 'Im Plan', count: cnt('plan'), bg: t.surface, fg: t.text, bd: t.strong, go: () => this.setState({ mview: Object.assign({}, s.mview, OVK === 'sm42' ? { sm42p: 'gantt' } : { [OVK + 'p']: 'ms' }), ptab: 'planung', ampel: 'plan' }) },
      { label: 'Überfällig', count: cnt('ueberfaellig'), bg: RED, fg: '#FFFFFF', bd: RED, go: () => this.setState({ mview: Object.assign({}, s.mview, OVK === 'sm42' ? { sm42p: 'gantt' } : { [OVK + 'p']: 'ms' }), ptab: 'planung', ampel: 'ueberfaellig' }) }
    ];
    const nextMs = ovMs.filter(n => this.nodeStatus(n) !== 'erledigt' && D(n.end) >= TODAY).sort((a, b) => D(a.end) - D(b.end)).slice(0, 4)
      .map(n => ({ name: n.name, date: fmt(D(n.end)), chip: this.chip(this.nodeStatus(n), t, accent), open: () => this.openNode(n.id, 'uebersicht') }));
    const projOverdue = []
      .concat(ovMs.filter(n => this.nodeStatus(n) === 'ueberfaellig').map(n => ({ kind: n.type === 'gate' ? 'Gate' : 'Meilenstein', name: n.name, date: fmt(D(n.end)), open: () => this.openNode(n.id, 'uebersicht') })))
      .concat(TASKS.filter(x => x.proj === PNAME_OF[OVK] && this.taskStatus(x) === 'ueberfaellig').map(x => ({ kind: 'Aufgabe', name: x.title, date: fmt(D(x.due)), open: () => this.openTask(x.id, 'uebersicht') })));
    const team = PTEAM[OVK]
      .map(([name, role, p]) => ({ name, role, pct: p, ini: ini(name), color: AV[name] }));

    // Board
    const projTasks = TASKS.filter(x => x.proj === 'SM42 Schraubstation');
    const board = ['Backlog', 'Fokus', 'Warten auf', 'Erledigt'].map(b => {
      const cards = projTasks.filter(x => this.bucketOf(x) === b).map(x => ({ title: x.title, ini: ini(x.owner), avColor: AV[x.owner] || accent, chip: this.chip(this.taskStatus(x), t, accent), dueLabel: this.dueLabel(x), open: () => this.openTask(x.id, 'aufgaben') }));
      return { name: b, color: BUCKET[b], count: cards.length, cards };
    });

    // Projekt: Team
    const ROLE_BG = { Owner: '#5B2D90', Bearbeiter: '#0F6CBD', Mitwirkender: '#0E6E7A', Leser: '#5C5C5C', Gast: '#8A3707' };
    const members = PMEMBERS[OVK]
      .map(([name, role, tm2, p]) => ({ name, role, team: tm2, pct: p, ini: name === 'Kunde' ? 'KD' : ini(name), color: AV[name], roleBg: ROLE_BG[role] }));
    const RQ = PRACI[OVK], raciM = OVK === 'sm42' ? s.raci : (s.raciBy[OVK] || RQ.init);
    const raciRows = RQ.rows.map((name, r) => {
      const row = raciM[r];
      const a = row.filter(v => v === 'A').length, rr = row.filter(v => v === 'R').length;
      const ok = a === 1 && rr >= 1;
      const check = ok ? '✓ in Ordnung' : (a === 0 ? '! kein A' : (a > 1 ? '! mehrere A' : '! kein R'));
      return { name, check, checkColor: ok ? GREEN : RED, rowBg: ok ? 'transparent' : (this.props.dark ? '#3A1F22' : '#FDF3F4'),
        cells: row.map((v, c) => ({ v, bg: v ? RACI_COL[v] : t.surface, fg: '#FFFFFF', bd: v ? RACI_COL[v] : t.border, aria: name + ', ' + RQ.cols[c] + ': ' + (v || 'leer'),
          pick: () => { const m = raciM.map(x => x.slice()); m[r][c] = CYCLE[(CYCLE.indexOf(v) + 1) % CYCLE.length]; if (OVK === 'sm42') this.setState({ raci: m }); else this.setState({ raciBy: Object.assign({}, s.raciBy, { [OVK]: m }) }); } })) };
    });
    const akv = (OVK !== 'sm42' ? PAKV[OVK] : [
      ['Du', 'Projekt planen und steuern, Kundenkontakt', 'Budget bis 50.000 €, Gate-Antrag', 'Termin, Kosten, Ergebnis', false],
      ['T. Brandt', 'Stromlaufplan, Klemmenplan, Schaltschrankbau begleiten', 'EPLAN, Elektrofachkraft', 'Normgerechte Elektrokonstruktion', false],
      ['S. Keller', 'SPS-Programmierung, Inbetriebnahme', 'TIA Portal, Safety, Freigabe IBN', 'Funktion und Sicherheit der Steuerung', false],
      ['L. Wagner', 'Mechanik-Konstruktion, Montage, Schutzzaun', 'SolidWorks, Bestellungen bis 10.000 €', 'Mechanik und Abnahme Schutzzaun (Sicherheitsbewertung fehlt)', true]
    ]).map(([name, a, k, v, warn]) => ({ name, a, k, v, warn, ini: ini(name), color: AV[name], vColor: warn ? RED : t.text, vBg: warn ? '#FDE7E9' : '#DFF6DD', vFg: warn ? '#A4262C' : '#0E4F0E', cardBd: warn ? RED : t.border }));
    const akvBtn = { table: { bg: s.akv === 'tabelle' ? t.surface : 'transparent', fg: s.akv === 'tabelle' ? t.text : t.muted }, diagram: { bg: s.akv === 'diagramm' ? t.surface : 'transparent', fg: s.akv === 'diagramm' ? t.text : t.muted } };

    // Projekt: Dokumente
    const DST = { final: { label: '✓ Final', bg: GREEN, fg: '#FFFFFF', bd: GREEN }, pruefung: { label: 'In Prüfung', bg: accent, fg: '#FFFFFF', bd: accent }, entwurf: { label: 'Entwurf', bg: t.surface, fg: t.text, bd: t.strong } };
    const docs = (OVK !== 'sm42' ? PDOCS[OVK] : [
      ['PDF', '#A4262C', 'Lastenheft SM42', 'Lastenheft', 'Phase Konzept', 'v1.2', 'final', '18.09. · Du'],
      ['DOC', '#2B5797', 'Pflichtenheft SM42', 'Pflichtenheft', 'Phase Konzept', 'v0.9', 'pruefung', '05.11. · Du'],
      ['PDF', '#A4262C', 'Stromlaufplan =S1', 'Zeichnung (EPLAN)', 'Meilenstein Stromlaufplan', 'v3', 'entwurf', '11.11. · T. Brandt'],
      ['3D', '#33691E', 'Grundgestell.step', '3D-Modell', 'Mechanik 3D-Konstruktion', 'v5', 'final', '23.10. · L. Wagner'],
      ['PDF', '#A4262C', 'Angebot Servoantriebe', 'Angebot', 'Servoantriebe bestellen', 'v1', 'pruefung', '04.11. · Du'],
      ['XLS', '#107C10', 'FAT-Checkliste', 'Prüfprotokoll', 'Gate G3', 'v0.1', 'entwurf', '12.11. · Du']
    ]).map(([ext, typeBg, name, kind, link, ver, stt, when]) => ({ ext, typeBg, name, kind, link, ver, st: DST[stt], when }));
    const log = (OVK !== 'sm42' ? PLOG[OVK] : [['T. Brandt', 'heute 08:12', 'Stromlaufplan v3 hochgeladen, Schutztürkreis überarbeitet.'], ['S. Keller', 'gestern', 'Pneumatikplan zurück an Konstruktion, Ventilinsel falsch dimensioniert.'], ['Du', '10.11.', 'Gate G2 verschoben, Stromlaufplan noch nicht freigegeben.'], ['L. Wagner', '06.11.', 'Lessons Learned: Schutzzaun früher anfragen, Lieferzeit 5 Wochen.']])
      .map(([who, when, text]) => ({ who, when, text, ini: ini(who), color: AV[who] }));

    // Projekt: Finanzen
    const FC = [t.strong, accent, '#8A3707', GREEN];
    const FB = OVK !== 'sm42' ? PFIN[OVK].B : [['Budget (Plan)', 480000], ['Ist', 212400], ['Obligo', 96000], ['Prognose', 455000]];
    const fMax = Math.max.apply(null, FB.map(b => b[1])), overF = FB[3][1] > FB[0][1];
    const B = FB.map((b, i) => [b[0], b[1], i === 3 && overF ? RED : FC[i]]);
    const budget = B.map(([label, v, color]) => ({ label, color, w: pct(v / fMax * 100), value: v.toLocaleString('de-DE') + ' €' }));
    const finSum = overF ? { label: '! Prognose ' + Math.round((FB[3][1] / FB[0][1] - 1) * 100) + ' % über Budget', bg: RED } : { label: '✓ Prognose im Budget', bg: GREEN };
    // Projektübersicht: Kacheln je Projekt und Person
    const OV_ALL = ['ms', 'next', 'overdue', 'team', 'mine', 'budget', 'log', 'themen', 'ki'];
    const OV_T = { ms: 'Meilensteine nach Termin', next: 'Nächste Meilensteine', overdue: 'Überfällig im Projekt', team: 'Team und Projektanteile', mine: 'Meine Aufgaben hier', budget: 'Budget', log: 'Letzte Aktivität', themen: 'Themen', ki: 'KI-Zusammenfassung' };
    const ovS = Object.assign({ order: OV_ALL, hidden: { mine: true, budget: true, log: true, themen: true, ki: true }, size: {} }, s.ovBy[OVK] || {});
    const OSZ = [['1 1 300px', 'schmal'], ['2 1 460px', 'mittel'], ['1 1 100%', 'ganze Breite']];
    const setOv = patch => { const cur = Object.assign({ order: OV_ALL, hidden: { mine: true, budget: true, log: true, themen: true, ki: true }, size: {} }, (this.state.ovBy || {})[OVK] || {}); const p2 = typeof patch === 'function' ? patch(cur) : patch; this.setState({ ovBy: Object.assign({}, this.state.ovBy, { [OVK]: Object.assign({}, cur, p2) }) }); };
    const ovw = {};
    OV_ALL.forEach(k => { const sz = ovS.size[k] !== undefined ? ovS.size[k] : 0, hot = s.dragOver === 'ov|' + k;
      ovw[k] = { order: ovS.order.indexOf(k), disp: ovS.hidden[k] ? 'none' : 'block', flex: OSZ[sz][0], sizeLabel: OSZ[sz][1], border: hot ? '3px solid ' + accent : '1px solid ' + t.border, draggable: 'true',
        start: e => { if (e && e.target !== e.currentTarget) return; this.dragStart('ov:' + k)(e); }, over: this.dragOver('ov|' + k),
        drop: true ? this.dropOn('ov|' + k, id => { if (typeof id !== 'string' || id.indexOf('ov:') !== 0) return; const from = id.slice(3); if (from === k) return; setOv(cur => { const o = cur.order.filter(x => x !== from); o.splice(o.indexOf(k), 0, from); return { order: o }; }); }) : () => {},
        smaller: () => setOv(cur => ({ size: Object.assign({}, cur.size, { [k]: Math.max(0, (cur.size[k] || 0) - 1) }) })), wider: () => setOv(cur => ({ size: Object.assign({}, cur.size, { [k]: Math.min(OSZ.length - 1, (cur.size[k] || 0) + 1) }) })),
        hide: () => setOv(cur => ({ hidden: Object.assign({}, cur.hidden, { [k]: true }) })) }; });
    const ovPal = OV_ALL.filter(k => ovS.hidden[k]).map(k => ({ label: '+ ' + OV_T[k], go: () => setOv(cur => { const h = Object.assign({}, cur.hidden); delete h[k]; return { hidden: h }; }) }));
    const myHere = TASKS.filter(x => x.proj === PNAME_OF[OVK] && this.ownerOf(x) === 'Du' && !this.isDone(x)).map(x => ({ title: x.title, chip: this.chip(this.taskStatus(x), t, accent), dueLabel: this.dueLabel(x), open: () => this.openTask(x.id, 'uebersicht') }));
    const nOver = ovMs.filter(n => this.nodeStatus(n) === 'ueberfaellig');
    const kiText = PNAME_OF[OVK] + ': ' + cnt('erledigt') + ' von ' + ovMs.length + ' Meilensteinen sind erledigt' + (nOver.length ? ', überfällig ist ' + nOver.map(n => '„' + n.name + '“').join(', ') : ', nichts ist überfällig') + '. '
      + (nextMs[0] ? 'Als Nächstes steht „' + nextMs[0].name + '“ am ' + nextMs[0].date + ' an. ' : '') + finSum.label.replace(/^[!✓] /, '') + '.' + (log[0] ? ' Zuletzt: ' + log[0].text : '');
    const ovx = { edit: !!s.ovEdit, editLabel: s.ovEdit ? 'Fertig' : 'Übersicht anpassen', toggle: () => this.setState({ ovEdit: !s.ovEdit }), palette: ovPal, noPalette: ovPal.length === 0,
      reset: () => { const o = Object.assign({}, s.ovBy); delete o[OVK]; this.setState({ ovBy: o }); },
      mine: myHere, noMine: myHere.length === 0, themes: (PTHEME[OVK] || []).map(k => { const th = THEMES.find(z => z[0] === k); return { label: th ? th[1] : k, color: th ? th[2] : t.strong }; }), logTop: log.slice(0, 4),
      kiDone: !!s.kiSum[OVK], kiNot: !s.kiSum[OVK], kiText, kiRun: () => this.setState({ kiSum: Object.assign({}, s.kiSum, { [OVK]: true }) }), goFin: () => this.setState({ ptab: 'finanzen' }) };
    const hMax = OVK !== 'sm42' ? PFIN[OVK].hmax : 320;
    const hours = (OVK !== 'sm42' ? PFIN[OVK].hours : [['Du', 260, 50], ['T. Brandt', 230, 30], ['S. Keller', 110, 30], ['L. Wagner', 170, 20]]).map(([name, ok, pre]) => ({ name, ok: pct(ok / hMax * 100), pre: pct(pre / hMax * 100), total: (ok + pre) + ' h' }));
    const INVS = { bezahlt: { label: '✓ Bezahlt', bg: GREEN, fg: '#FFFFFF', bd: GREEN }, plan: { label: 'Im Plan', bg: t.surface, fg: t.text, bd: t.strong }, bestellt: { label: 'Bestellt', bg: '#8A3707', fg: '#FFFFFF', bd: '#8A3707' }, pruefung: { label: 'In Prüfung', bg: accent, fg: '#FFFFFF', bd: accent }, entwurf: { label: 'Entwurf', bg: t.surface, fg: t.text, bd: t.strong } };
    const invoices0 = OVK !== 'sm42' ? PFIN[OVK].inv.map(([name, sub, k]) => ({ name, sub, st: INVS[k] })) : [['Vorrechnung 30 %', '144.000 € · gestellt 30.09.', { label: '✓ Bezahlt', bg: GREEN, fg: '#FFFFFF', bd: GREEN }], ['Zwischenbericht Q4', 'Berichtspflicht Kunde · fällig 31.12.', { label: 'Im Plan', bg: t.surface, fg: t.text, bd: t.strong }], ['Endrechnung', 'nach FAT · Entwurf vorhanden', { label: 'Entwurf', bg: t.surface, fg: t.text, bd: t.strong }]]
      .map(([name, sub, stt]) => ({ name, sub, st: stt }));
    const invoices = invoices0.concat(((s.invAdd || {})[OVK] || []).map(([name, sub, k]) => ({ name, sub, st: INVS[k] || INVS.plan })));

    // Gantt
    const months = [['September', 30], ['Oktober', 31], ['November', 30], ['Dezember', 31], ['Januar', 31]].map(([l, d]) => ({ label: l, flex: d }));
    let acc = 0; const monthLines = [30, 31, 30, 31].map(d => { acc += d; return { left: pct(acc / SPAN * 100) }; });
    const todayLeft = pct(dd(START, TODAY) / SPAN * 100);
    const rowsRaw = [];
    const walk = (list, depth) => list.forEach(n => {
      const status = this.nodeStatus(n);
      if (s.ampel === 'alle') { rowsRaw.push({ n, depth, status }); if (n.children && s.expanded[n.id]) walk(n.children, depth + 1); }
      else { if (status === s.ampel) rowsRaw.push({ n, depth: 0, status }); if (n.children) walk(n.children, depth + 1); }
    });
    walk(TREE, 0);
    const blAll = Object.assign({}, BL_SEED, s.blBy || {}), blCur = blAll.sm42 || null, blMap = blCur ? blCur.map : {}, blOn = s.blOn !== false;
    const depsG = this.depsOf(), critG = this.critSet(this.projNodes('p1'), depsG);
    const rows = rowsRaw.map(({ n, depth, status }) => {
      const a = D(n.start), b = D(n.end), point = n.type === 'gate', hint = this.overdueBelow(n), ch = this.chip(status, t, accent);
      const hasKids = !!(n.children && n.children.length) && s.ampel === 'alle';
      return {
        nid: n.id, name: n.name, de: this.dateEdit(n, true), dragMove: this.ganttStart(n.id, 'move'), dragDur: this.ganttStart(n.id, 'end'), dragStartH: this.ganttStart(n.id, 'start'), over: this.ganttOver(), drop: this.ganttDrop(SPAN), canResize: !point, endLeft: pct((dd(START, b) + 1) / SPAN * 100),
        fw: n.type === 'phase' ? 700 : 500, indent: (8 + depth * 22) + 'px', dates: point ? fmt(b) : fmt(a) + ' – ' + fmt(b),
        hasKids, noKids: !hasKids, expanded: s.expanded[n.id] ? 'true' : 'false', chev: s.expanded[n.id] ? 'rotate(90deg)' : 'none',
        toggleLabel: (s.expanded[n.id] ? 'Zuklappen: ' : 'Aufklappen: ') + n.name,
        toggle: () => { const e = Object.assign({}, s.expanded); e[n.id] = !e[n.id]; this.setState({ expanded: e }); },
        open: () => this.setState({ highlight: n.id, panel: { kind: 'node', id: n.id, from: 'planung' }, akMsg: '' }),
        hasHint: hint > 0 && status !== 'ueberfaellig', hint: hint + ' überfällig', chip: ch,
        left: pct(dd(START, a) / SPAN * 100), width: point ? '16px' : pct(Math.max((dd(a, b) + 1) / SPAN * 100, 0.8)),
        barH: point ? '16px' : (n.type === 'phase' ? '22px' : '16px'), barMt: point ? '-8px' : (n.type === 'phase' ? '-11px' : '-8px'),
        transform: point ? (n.msPoint ? 'translateX(-50%) rotate(45deg)' : 'translateX(-50%)') : 'none', radius: point ? (n.msPoint ? '3px' : '4px') : '6px',
        shadow: critG.has(n.id) ? '0 0 0 3px rgba(197,15,31,0.55)' : '0 1px 2px rgba(0,0,0,0.12)', ...this.depLabel(n, depsG),
        barText: point ? (n.msPoint ? '' : 'G') : (status === 'erledigt' ? ' ✓' : (status === 'ueberfaellig' ? ' !' : '')), aria: n.name + ', ' + ch.label,
        rowBg: (s.highlight === n.id || (s.panel && s.panel.id === n.id)) ? t.hl : 'transparent',
        ...(() => { const bm = blMap[n.id]; if (!bm || !blOn) return { blShow: false, blLeft: '0%', blWidth: '0%', hasDev: false, dev: '', devColor: t.muted, devTitle: '' };
          const ba = D(bm[0]), bb = D(bm[1]), dv = dd(bb, b), pt2 = n.type === 'gate';
          return { blShow: dv !== 0 || dd(ba, a) !== 0, blLeft: pct(dd(START, ba) / SPAN * 100), blWidth: pt2 ? '6px' : pct(Math.max((dd(ba, bb) + 1) / SPAN * 100, 0.8)),
            hasDev: dv !== 0, dev: (dv > 0 ? '+' : '−') + Math.abs(dv) + ' T. zur Baseline', devColor: dv > 0 ? RED : GREEN, devTitle: 'Baseline ' + fmt(ba) + (pt2 ? '' : ' – ' + fmt(bb)) + ', jetzt ' + (pt2 ? fmt(b) : fmt(a) + ' – ' + fmt(b)) }; })()
      };
    });
    const L = [['alle', 'Alle', t.track, t.strong], ['erledigt', 'Erledigt', GREEN, GREEN], ['plan', 'Im Plan', t.surface, t.strong], ['ueberfaellig', 'Überfällig', RED, RED]];
    const legend = L.map(([k, l, bg, bd]) => ({ label: l, bg, bd, pressed: s.ampel === k ? 'true' : 'false', ring: s.ampel === k ? accent : t.border, pick: () => this.setState({ ampel: k }) }));
    const allOpen = TREE.filter(n => n.children).every(n => s.expanded[n.id]);
    const toggleAll = () => { const e = {}; TREE.forEach(n => { if (n.children) e[n.id] = !allOpen; }); this.setState({ expanded: e, ampel: 'alle' }); };

    // Stacey
    const zoneOf = (x, y) => { const v = x + y; return v <= 2 ? 'Einfach' : (v <= 4 ? 'Kompliziert' : (v <= 6 ? 'Komplex' : 'Chaotisch')); };
    const ZC = { 'Einfach': '#DDF0DE', 'Kompliziert': '#DCEAF7', 'Komplex': '#FCEBCB', 'Chaotisch': '#F7D9DC' };
    const stacey = [], staceyW = [];
    for (let y = 4; y >= 0; y--) for (let x = 0; x <= 4; x++) {
      const z = zoneOf(x, y), selC = s.sx === x && s.sy === y;
      const corner = (x === 0 && y === 0) || (x === 4 && y === 4) || (x === 2 && y === 2) || (x === 3 && y === 0);
      staceyW.push({ x, y, zone: z, bg: ZC[z] });
      stacey.push({ mark: selC ? '●' : (corner ? z : ''), zone: z, bg: ZC[z], sel: selC, showZone: !selC && corner, ring: selC ? accent : 'transparent', aria: 'Anforderungen ' + (y + 1) + ' von 5 unklar, Lösung ' + (x + 1) + ' von 5 unsicher, ' + z, pick: () => this.setState({ sx: x, sy: y }) });
    }
    const staceyZone = zoneOf(s.sx, s.sy);
    let staceyRec = s.sy < 2 && s.sx < 2 ? 'Wasserfall' : (s.sy < 2 ? 'V-Modell' : (s.sx < 2 ? 'Inkrementell' : 'Scrum'));
    if (staceyZone === 'Chaotisch') staceyRec = 'Erst Klarheit schaffen (Prototyp), dann Scrum';

    // Berichte: Portfolio, Roadmap, Kapazität, Statusbericht
    const RV = [['portfolio', 'Portfolio'], ['themen', 'Themen & Fokus'], ['roadmap', 'Roadmap'], ['kapazitaet', 'Kapazität & Priorität'], ['konflikte', 'Ressourcenkonflikte'], ['bericht', 'Statusbericht']];
    const rOrd = this.layOf('rep', RV.map(x => x[0])), rCfgOpen = !!s.rCfg;
    const rCfg = { open: rCfgOpen, toggle: () => this.setState({ rCfg: !rCfgOpen }), items: rOrd.order.map(k => { const on = !rOrd.hide[k], l = (RV.find(x => x[0] === k) || ['', k])[1]; return { label: (on ? '✓ ' : '+ ') + l, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: () => this.setState({ lay: Object.assign({}, s.lay, { rep: { order: rOrd.order, hide: Object.assign({}, rOrd.hide, { [k]: on }) } }) }) }; }) };
    const rViews = rOrd.order.filter(k => !rOrd.hide[k]).map(k => RV.find(x => x[0] === k)).map(([k, label]) => ({ drag: this.dragStart('rv:' + k), dragEnd: this.dragEnd(), over: this.dragOver('rv|' + k),
      drop: this.dropOn('rv|' + k, id => { if (typeof id !== 'string' || id.indexOf('rv:') !== 0) return; const from = id.slice(3); if (from === k) return; const o = rOrd.order.filter(x => x !== from); o.splice(o.indexOf(k), 0, from); this.setState({ lay: Object.assign({}, this.state.lay, { rep: { order: o, hide: rOrd.hide } }) }); }), label, sel: s.rview === k ? 'true' : 'false', bg: s.rview === k ? t.surface : 'transparent', fg: s.rview === k ? t.text : t.muted, sh: s.rview === k ? '0 1px 3px rgba(0,0,0,0.15)' : 'none', go: () => this.setState({ rview: k, rMsg: '' }) }));
    const rv1 = {}; RV.forEach(([k]) => { rv1[k] = s.rview === k; });
    const rConf = s.rview === 'konflikte' ? this.resConf(Array.from(new Set([].concat(...Object.keys(PNAME_OF).map(k => (PMEMBERS[k] || []).map(m => m[0]))))), null, t, accent) : { rows: [], empty: true };
    const progOf = { sm42: projects[0].progress, rl2: projects[1].progress, pd: projects[2].progress, ih: projects[3].progress, mes: '0%', ets: '0%', tl3: '0%' };
    const ordered = s.porder.map(k => PORTK[k]);
    // Kapazität in Prioritätsreihenfolge verteilen
    const gap = {}, gapTeams = {};
    const capRows = CAP_TEAMS.map(([tk, tn, n]) => {
      const cap = n * PLAN_H;
      let left = cap, demand = 0; const parts = [];
      ordered.forEach(x => {
        const d = x.demand[tk] || 0; if (!d) return;
        demand += d;
        const c = Math.max(0, Math.min(d, left)); left -= d;
        if (c > 0) parts.push({ x, h: c, ok: true });
        if (d - c > 0) { parts.push({ x, h: d - c, ok: false }); gap[x.key] = (gap[x.key] || 0) + (d - c); (gapTeams[x.key] = gapTeams[x.key] || []).push(tn + ' ' + (d - c) + ' h'); }
      });
      const scale = Math.max(cap, demand) * 1.06;
      const segs = parts.map(g => ({
        w: pct(g.h / scale * 100), bg: g.ok ? g.x.color : 'repeating-linear-gradient(45deg, #C50F1F 0 5px, #E8A0A6 5px 10px)',
        label: g.h >= 18 ? g.x.code + ' ' + g.h + ' h' : g.x.code,
        title: g.x.name + ': ' + g.h + ' h/Woche ' + (g.ok ? 'eingeplant' : 'nicht gedeckt'),
        open: () => this.setState({ rMsg: g.x.name + ' braucht in ' + tn + ' ' + (g.x.demand[tk]) + ' h/Woche' + (g.ok ? '.' : ', davon ' + g.h + ' h nicht gedeckt. Priorität erhöhen, Anteil umverteilen oder Termin schieben.') })
      }));
      const over = Math.max(0, demand - cap);
      return { name: tn, sub: n + ' Personen · ' + demand + ' von ' + cap + ' h/Woche', segs, capLeft: pct(cap / scale * 100),
        gapLabel: over ? '! ' + over + ' h fehlen' : '✓ ' + (cap - demand) + ' h frei', gapColor: over ? RED : GREEN };
    });
    const AMP = { gruen: ['✓', GREEN, GREEN, '#FFFFFF'], weiss: ['', t.surface, t.strong, t.text], rot: ['!', RED, RED, '#FFFFFF'] };
    const AMPN = ['Termin', 'Kosten', 'Qualität'];
    const AMPT = { gruen: 'besser als Plan', weiss: 'im Plan', rot: 'kritisch' };
    const pdAmp = VN.some(v => this.vStatus(v) === 'ueberfaellig') ? 'rot' : 'weiss';
    const rowOf = (x, i) => {
      const amp = x.key === 'pd' ? [pdAmp, x.amp[1], x.amp[2]] : x.amp;
      const g = gap[x.key] || 0;
      const res = g ? { label: '! ' + g + ' h/Wo fehlen', bg: RED, fg: '#FFFFFF', bd: RED, text: RED, title: gapTeams[x.key].join(', ') } : { label: '✓ Gedeckt', bg: GREEN, fg: '#FFFFFF', bd: GREEN, text: GREEN, title: 'Bedarf vollständig eingeplant' };
      const move = dir => () => { const o = s.porder.slice(), j = i + dir; if (j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; this.setState({ porder: o, rMsg: x.name + ' steht jetzt auf Priorität ' + (j + 1) + '.' }); };
      const overB = x.budget[0] > x.budget[1];
      return {
        key: x.key, rank: i + 1, code: x.code, name: x.name, color: x.color, model: x.key === 'tl3' ? ((s.ko && s.ko.model) || 'offen') : x.model, pl: x.key === 'tl3' ? s.zt.pl : x.pl,
        sub: (x.status === 'genehmigt' ? 'Genehmigt · Start ' + fmt(D(x.start)) + D(x.start).getFullYear() : 'Laufend') + ' · PL ' + (x.key === 'tl3' ? s.zt.pl : x.pl),
        clickable: !!PROJ_OPEN[x.key], static: !PROJ_OPEN[x.key], open: () => PROJ_OPEN[x.key] && this.openProject(x.key),
        amps: amp.map((a, k) => ({ mark: AMP[a][0], bg: AMP[a][1], bd: AMP[a][2], fg: AMP[a][3], title: AMPN[k] + ': ' + AMPT[a], long: AMPN[k] + ': ' + AMPT[a], val: a })),
        progress: progOf[x.key], budget: x.budget[0] + ' / ' + x.budget[1] + ' T€', budgetSub: overB ? 'überschritten um ' + Math.round((x.budget[0] / x.budget[1] - 1) * 100) + ' %' : Math.round(x.budget[0] / x.budget[1] * 100) + ' % verbraucht', budgetColor: overB ? RED : t.text,
        next: x.next, res, gap: g, themes: (PTHEME[x.key] || []).map((k, j) => ({ label: TH[k].name, color: TH[k].color, fw: j === 0 ? 700 : 500 })),
        resText: g ? 'Es fehlen ' + gapTeams[x.key].join(' und ') + ' pro Woche.' : 'Bedarf ist eingeplant.',
        stand: x.stand, schritte: x.schritte, bedarf: x.bedarf, hasNeed: !!x.bedarf,
        up: move(-1), down: move(1), upOp: i === 0 ? '0.35' : '1', downOp: i === ordered.length - 1 ? '0.35' : '1',
        upLabel: x.name + ' höher priorisieren', downLabel: x.name + ' niedriger priorisieren'
      };
    };
    const portAll = ordered.map(rowOf);
    const RF = { kritisch: 'Termin oder Kosten kritisch', luecke: 'Ressourcen fehlen', genehmigt: 'Noch nicht gestartet' };
    const fPass = r => s.rFilter === 'alle' || (s.rFilter === 'kritisch' && r.amps.slice(0, 2).some(a => a.val === 'rot')) || (s.rFilter === 'luecke' && r.gap > 0) || (s.rFilter === 'genehmigt' && PORTK[r.key].status === 'genehmigt');
    const portRows = portAll.filter(fPass);
    const sumB = ordered.reduce((a, x) => [a[0] + x.budget[0], a[1] + x.budget[1]], [0, 0]);
    const gapSum = Object.values(gap).reduce((a, b) => a + b, 0);
    const kpi = (label, value, sub, color, f) => ({ label, value, sub, color, ring: s.rFilter === f ? accent : t.border, pressed: s.rFilter === f ? 'true' : 'false', go: () => this.setState({ rview: 'portfolio', rFilter: s.rFilter === f ? 'alle' : f }) });
    const rKpis = [
      kpi('Projekte', ordered.length, ordered.filter(x => x.status === 'laufend').length + ' laufend · ' + ordered.filter(x => x.status === 'genehmigt').length + ' genehmigt', t.text, 'alle'),
      kpi('Termin oder Kosten kritisch', portAll.filter(r => r.amps.slice(0, 2).some(a => a.val === 'rot')).length, 'Klick filtert die Liste', RED, 'kritisch'),
      kpi('Ressourcenlücke', gapSum + ' h', 'pro Woche, nach Priorität', gapSum ? RED : GREEN, 'luecke'),
      kpi('Noch nicht gestartet', ordered.filter(x => x.status === 'genehmigt').length, 'genehmigt, Start geplant', t.text, 'genehmigt'),
      { label: 'Budget gesamt', value: Math.round(sumB[0] / sumB[1] * 100) + ' %', sub: sumB[0] + ' von ' + sumB[1] + ' T€ verbraucht', color: t.text, ring: t.border, pressed: 'false', go: () => this.setState({ rview: 'portfolio', rFilter: 'alle' }) },
      { label: 'Offene Anträge', value: 1, sub: 'Bewertung im Posteingang', color: accentText, ring: t.border, pressed: 'false', go: () => this.openInbox('i3') }
    ];
    const rp = d => pct(Math.max(0, Math.min(100, dd(R0, D(d)) / RSPAN * 100)));
    const rMonths = RMON.map((label, i) => ({ label, left: pct(dd(R0, new Date(2026, 5 + i, 1)) / RSPAN * 100) }));
    const roadRows = portAll.map(r => {
      const x = PORTK[r.key], endD = x.end || '2027-07-01';
      const w = dd(D(x.start), D(endD)) / RSPAN * 100;
      return { name: r.rank + '. ' + x.name, color: x.color, light: x.color + '33', bdStyle: x.end ? 'solid' : 'dashed', left: rp(x.start), width: pct(Math.max(w, 1)),
        done: x.end ? r.progress : '0%', title: x.name + ': ' + fmt(D(x.start)) + D(x.start).getFullYear() + ' bis ' + (x.end ? fmt(D(x.end)) + D(x.end).getFullYear() : 'laufend') + ' · ' + r.progress + ' erledigt',
        open: () => PROJ_OPEN[x.key] ? this.openProject(x.key) : this.setState({ rMsg: x.name + ' startet am ' + fmt(D(x.start)) + D(x.start).getFullYear() + '. Die Planung legt die Projektleitung nach dem Kick-off an.' }),
        ms: x.ms.map(([d, n, st3]) => { const c = this.chip(st3, t, accent); return { left: rp(d), bg: c.bg, bd: c.bd, title: n + ' · ' + fmt(D(d)) + ' · ' + c.label }; }) };
    });
    const reportRows = portAll;
    const rAutoBtn = s.rAuto ? { label: '✓ Jeden Freitag automatisch', bg: GREEN, fg: '#FFFFFF', bd: GREEN } : { label: 'Jeden Freitag automatisch', bg: t.surface, fg: t.text, bd: t.strong };

    // Wissen
    const wPass = w => (s.wcat === 'alle' || w.cat === s.wcat) && (!s.wtag || w.tags.includes(s.wtag));
    const helpOf = w => w.help + (s.wHelp[w.id] ? 1 : 0);
    const openW = id => () => this.setState({ panel: { kind: 'wissen', id, from: 'wissen' }, wMsg: '' });
    const wCard = w => ({ id: w.id, cat: w.cat, color: W_CAT[w.cat], title: w.title, date: w.date, tags: w.tags, origin: w.origin, help: helpOf(w),
      teaser: w.f[0][1], hasKind: !!w.kind, kindLabel: w.kind === 'gut' ? 'Lief gut' : 'Verbessern', kindBg: w.kind === 'gut' ? GREEN : '#A33F06',
      ring: s.panel && s.panel.kind === 'wissen' && s.panel.id === w.id ? accent : t.border, reason: w.reason, open: openW(w.id) });
    const wList = WISSEN.filter(wPass).map(wCard);
    const wSuggest = WISSEN.filter(w => w.reason).map(wCard);
    const wCats = [['alle', 'Alle', t.strong]].concat(Object.keys(W_CAT).map(k => [k, k === 'Vorlage' ? 'Vorlagen' : k, W_CAT[k]])).map(([k, label, color]) => ({
      label, color, count: k === 'alle' ? WISSEN.length : WISSEN.filter(w => w.cat === k).length,
      pressed: s.wcat === k ? 'true' : 'false', ring: s.wcat === k ? accent : t.border, bg: s.wcat === k ? t.soft : t.surface,
      go: () => this.setState({ wcat: k }) }));
    const tagCount = {}; WISSEN.forEach(w => w.tags.forEach(tg => { tagCount[tg] = (tagCount[tg] || 0) + 1; }));
    const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 7);
    const maxTag = topTags.length ? topTags[0][1] : 1;
    const wTopics = topTags.map(([label, count]) => ({ label, count, w: pct(count / maxTag * 100), pressed: s.wtag === label ? 'true' : 'false', bg: s.wtag === label ? t.soft : 'transparent',
      go: () => this.setState({ wtag: s.wtag === label ? null : label }) }));
    const llBy = {}; WISSEN.filter(w => w.cat === 'Lessons Learned').forEach(w => { const o2 = llBy[w.origin] = llBy[w.origin] || { g: 0, v: 0 }; o2[w.kind === 'gut' ? 'g' : 'v']++; });
    const wProj = Object.entries(llBy).map(([name, c]) => ({ name, count: (c.g + c.v) + ' Einträge', gw: pct(c.g / (c.g + c.v) * 100), vw: pct(c.v / (c.g + c.v) * 100) }));

    // Aufgaben anlegen und freigeben
    const nts = s.nt, forOther = nts.who === 'andere', toTeam = nts.who === 'team', ntTk = TEAMS[nts.teamK] ? nts.teamK : 'instandhaltung', ntT = TEAMS[ntTk], target = forOther ? nts.person : (toTeam ? 'Team ' + ntT.name : 'Du');
    const tLoad = k => { const ms = TEAMS[k].members.filter(m => m[2][1] > 0); return Math.round(ms.reduce((acc, m) => acc + m[2][1], 0) / Math.max(1, ms.length)); };
    const tOpen = k => TEAMS[k].inbox.concat((s.teamAdd || {})[k] || []).filter(it => !s.claimed[it.id]).length;
    const bossOf = BOSS[target], inProj = nts.proj !== 'Ohne Projekt';
    const mode = toTeam ? 'teamq' : !forOther ? 'ich' : (inProj ? 'projekt' : (bossOf === 'Du' ? 'chef' : (TEAM_OF[target] === TEAM_OF['Du'] ? 'team' : 'extern')));
    const selfApproved = mode !== 'extern' && mode !== 'team' && mode !== 'teamq';
    const ldBefore = toTeam ? tLoad(ntTk) : LOAD47[target], ldAfter = Math.round(ldBefore + nts.h / PLAN_H * 100 / (toTeam ? ntT.members.length : 1));
    const setNt = patch => () => this.setState({ nt: Object.assign({}, nts, patch) });
    const pick = (on, label, patch) => ({ label, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: setNt(patch) });
    const stepOf = (label, i, n) => ({ label, bg: i === n - 1 ? GREEN : accent, fg: '#FFFFFF', arrow: i === n - 1 ? 'none' : 'inline' });
    const FLOW = {
      ich: [['Du legst an', 'Sofort in Meine Arbeit'], 'Keine Freigabe nötig', 'Eigene Aufgaben stehen sofort in Meine Arbeit und zählen in deine planbare Zeit.', 'Aufgabe anlegen'],
      projekt: [['Du weist zu', target + ' arbeitet'], 'Im Projekt: direkt zugewiesen', 'Im Projekt gelten die Projektrollen. Keine Freigabe und keine Annahme nötig, die Aufgabe zählt in den freigegebenen Projektanteil von ' + target + '.', 'Aufgabe zuweisen'],
      chef: [['Du legst an', target + ' arbeitet'], 'Du bist Chef von ' + target, 'Die Aufgabe ist sofort freigegeben. ' + target + ' wird benachrichtigt.', 'Aufgabe anlegen'],
      team: [['Du gibst ab', target + ' nimmt an', target + ' arbeitet'], target + ' ist in deinem Team', 'Unter Teamkollegen braucht es keine Freigabe durch den Chef. ' + target + ' muss die Aufgabe annehmen und kann sie ablehnen oder einen anderen Termin vorschlagen.', 'An ' + target + ' senden'],
      teamq: [['Du gibst ans Team', ntT.lead + ' verteilt', 'Person arbeitet'], 'An Team ' + ntT.name + ' · Teamleitung ' + ntT.lead, 'Die Aufgabe landet im Team-Eingang. ' + ntT.lead + ' verteilt sie in der Tagesplanung auf Person und Tag, oder jemand aus dem Team übernimmt sie selbst. Bis dahin zählt sie in die Team-Kapazität, nicht bei einer Person. Du siehst unter „Von mir vergeben“, wer sie bekommen hat.', 'An Team ' + ntT.name + ' geben'],
      extern: [['Du fragst an', bossOf + ' gibt frei', target + ' arbeitet'], 'Freigabe durch ' + bossOf + ', Chef von ' + target, target + ' ist nicht in deinem Team. ' + target + ' sieht die Aufgabe sofort als „angefragt“ und kann einen Einwand schreiben; in die Kapazität zählt sie erst nach der Freigabe. Ohne Entscheidung erinnert das Cockpit ' + bossOf + ' nach 2 Arbeitstagen.', 'Zur Freigabe senden']
    }[mode];
    const stepL = FLOW[0];
    const NKIND = [['aufgabe', '☐', 'Aufgabe'], ['ms', '◆', 'Meilenstein'], ['gate', '◈', 'Quality Gate'], ['phase', '▭', 'Phase / Arbeitspaket'], ['projekt', '▣', 'Projekt'], ['antrag', '✚', 'Projektantrag']], NSHORT = { aufgabe: 'Aufgabe', ms: 'Meilenstein', gate: 'Gate', phase: 'Phase', projekt: 'Projekt', antrag: 'Antrag' };
    const ctxPk = nts.ctx && PNAME_OF[nts.ctx] ? nts.ctx : null, nPk = PK_OF[nts.proj] || ctxPk || 'sm42';
    const nKind = !ctxPk && ['ms', 'gate', 'phase'].includes(nts.kind) ? 'aufgabe' : (nts.kind || 'aufgabe'), isNodeK = ['ms', 'gate', 'phase'].includes(nKind);
    const isoN = x => x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
    const addDays = (iso, d) => { const x = D(iso); x.setDate(x.getDate() + d); return isoN(x); };
    const NDATES = [['2026-11-20', '20.11.'], ['2026-11-27', '27.11.'], ['2026-12-04', '04.12.'], ['2026-12-18', '18.12.'], ['2027-01-15', '15.01.'], ['2027-02-26', '26.02.']];
    const CHECKS = { 'Konstruktionsfreigabe': ['Zeichnungen freigegeben', 'Stückliste vollständig', 'Risikobeurteilung aktualisiert'], 'FAT': ['Prüfprotokoll vollständig', 'Mängelliste abgearbeitet', 'Dokumentation übergeben'], 'SAT / Abnahme': ['Abnahmeprotokoll unterschrieben', 'Einweisung der Bediener erfolgt', 'Restpunkte vereinbart'], 'Ohne Checkliste': [] };
    const phasesN = PTREE_OF[nPk].filter(n => n.type === 'phase' && !n.pd);
    const ownersN = (PMEMBERS[nPk] || []).map(m => m[0]).filter(n => n !== 'Kunde').concat(nKind === 'gate' ? ['Geschäftsführung', 'Kunde', 'Qualität'] : []);
    const nodeTitle = (nts.title || '').trim() || ({ ms: 'Neuer Meilenstein', gate: 'Neues Quality Gate', phase: 'Neue Phase' })[nKind] || '';
    const nt = {
      nodeHint: !ctxPk, kinds: NKIND.filter(k => (ctxPk ? !(k[0] === 'antrag' || k[0] === 'projekt') : !['ms', 'gate', 'phase'].includes(k[0]))).map(([k, icon, label]) => ({ icon, label, short: NSHORT[k], pressed: nKind === k ? 'true' : 'false', ring: nKind === k ? accent : t.border, bg: nKind === k ? t.soft : t.surface,
        go: setNt(Object.assign({ kind: k, parent: null, owner: 'Du' }, ['ms', 'gate', 'phase'].includes(k) && nts.proj === 'Ohne Projekt' ? { proj: 'SM42 Schraubstation' } : {})) })),
      inProjHint: !!ctxPk, ctxText: ctxPk ? 'Du bist im Projekt ' + PNAME_OF[ctxPk] + '. Was du hier anlegst, gehört zu diesem Projekt.' : '',
      leaveProj: setNt({ ctx: null, proj: 'Ohne Projekt', kind: 'aufgabe' }),
      hasTitle: nKind !== 'antrag', title: nts.title || '', setTitle: e => { const v = e && e.target ? e.target.value : ''; this.setState({ nt: Object.assign({}, this.state.nt, { title: v }) }); },
      titlePh: ({ projekt: 'Name des Projekts', aufgabe: 'Was ist zu tun?', ms: 'z. B. Schaltschrank geliefert', gate: 'z. B. Gate G4: Abnahme beim Kunden', phase: 'z. B. Inbetriebnahme vor Ort' })[nKind] || '',
      isProjKind: nKind === 'projekt', isTaskKind: nKind === 'aufgabe', isNodeKind: isNodeK, isGateKind: nKind === 'gate', isPhaseKind: nKind === 'phase', isAntragKind: nKind === 'antrag',
      other: forOther, toTeam,
      teams: Object.keys(TEAMS).map(k => { const on = ntTk === k, ld = tLoad(k); return { name: TEAMS[k].name, color: TEAMS[k].color, sub: 'Leitung ' + TEAMS[k].lead + ' · ' + TEAMS[k].members.length + ' Personen', load: 'Ø ' + ld + ' % · ' + tOpen(k) + ' im Team-Eingang', loadColor: ld > 95 ? RED : (ld >= 85 ? '#A33F06' : GREEN),
        pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: setNt({ teamK: k, need: null }) }; }),
      needChips: ['egal'].concat(ntT.skills).map(sk => { const on = (nts.need || 'egal') === sk; return { label: sk === 'egal' ? 'keine Vorgabe' : sk + ' ≥ 3', pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: setNt({ need: sk }) }; }),
      more: !!nts.more, moreOpen: nts.more ? 'true' : 'false', moreIcon: nts.more ? '▾' : '▸', moreToggle: setNt({ more: !nts.more }),
      moreSum: [(nts.rep || 'nie') !== 'nie' ? '🔁 ' + nts.rep : 'einmalig', (nts.co || []).length ? '👥 ' + nts.co.join(', ') : ''].filter(Boolean).join(' · '),
      forBtns: [['ich', 'Ich'], ['andere', 'Eine Person'], ['team', 'Ein Team']].map(([k, label]) => ({ label, pressed: nts.who === k ? 'true' : 'false', bg: nts.who === k ? t.surface : 'transparent', fg: nts.who === k ? t.text : t.muted, go: setNt({ who: k }) })),
      pq: nts.pq || '', setPq: e => this.setState({ nt: Object.assign({}, this.state.nt, { pq: e && e.target ? e.target.value : '' }) }),
      pqInfo: (q0 => q0 ? (h0 => h0 + ' Treffer' + (h0 > 8 ? ', die ersten 8. Genauer suchen, z. B. mit Abteilung.' : ''))(NT_PEOPLE.concat(DIR.map(d => d[0])).filter(n => (n + ' ' + (TEAM_OF[n] || '')).toLowerCase().includes(q0)).length) : 'Vorschläge: dein Umfeld. Die Suche findet alle 500 Kollegen nach Name oder Abteilung.')((nts.pq || '').trim().toLowerCase()),
      people: ((q0 => q0 ? NT_PEOPLE.concat(DIR.map(d => d[0])).filter(n => (n + ' ' + (TEAM_OF[n] || '')).toLowerCase().includes(q0)).slice(0, 8) : NT_PEOPLE.concat(nts.person && !NT_PEOPLE.includes(nts.person) ? [nts.person] : []))((nts.pq || '').trim().toLowerCase())).map(n => Object.assign(pick(nts.person === n, n, { person: n }), { name: n, ini: ini(n), av: AV[n] || accent, boss: (TEAM_OF[n] === TEAM_OF['Du'] ? 'Dein Team' : 'Team ' + TEAM_OF[n]) + ' · Chef: ' + (BOSS[n] === 'Du' ? 'du' : BOSS[n]), load: (LOAD47[n] || 50) + ' %', loadColor: (LOAD47[n] || 50) >= 90 ? '#A33F06' : t.text })),
      projs: (ctxPk ? [PNAME_OF[ctxPk]] : NT_PROJ).map(n => pick(nts.proj === n, n, { proj: n })),
      hours: NT_H.map(h => pick(nts.h === h, h + ' h', { h })),
      steps: stepL.map((l, i) => stepOf(l, i, stepL.length)),
      flowTitle: FLOW[1], flowText: FLOW[2],
      loadText: toTeam ? 'Team ' + ntT.name + ' in KW 47: Ø ' + ldBefore + ' % → ' + ldAfter + ' % · ' + tOpen(ntTk) + ' Aufgaben warten schon im Team-Eingang' : 'Auslastung ' + (forOther ? target : 'du') + ' in KW 47: ' + ldBefore + ' % → ' + ldAfter + ' %' + (ldAfter > 100 ? ' · über der planbaren Zeit' : ''),
      loadColor: ldAfter > 100 ? RED : GREEN, boxBd: ldAfter > 100 ? RED : accent,
      nodeProjs: (ctxPk ? [PNAME_OF[ctxPk]] : Object.values(PNAME_OF)).map(n => pick(nts.proj === n, n, { proj: n, parent: null, owner: 'Du' })),
      parentLabel: nKind === 'phase' ? 'Wo einordnen?' : 'Gehört zu Phase',
      phases: [{ id: null, name: nKind === 'phase' ? 'Oberste Ebene (neue Phase)' : 'Ohne Phase' }].concat(phasesN).map(ph => pick((nts.parent || null) === ph.id, ph.id ? (nKind === 'phase' ? 'Arbeitspaket in „' + ph.name + '“' : ph.name) : ph.name, { parent: ph.id })),
      dateLabel: nKind === 'phase' ? 'Beginnt am' : 'Termin', dates: NDATES.map(([iso, l]) => pick(nts.date === iso, l, { date: iso })), dateIso: nts.date, setDate: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) this.setState({ nt: Object.assign({}, this.state.nt, { date: v }) }); },
      dueIso: nts.due || '2026-11-20', setDue: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) this.setState({ nt: Object.assign({}, this.state.nt, { due: v }) }); },
      coChips: (inProj && PK_OF[nts.proj] ? (PMEMBERS[PK_OF[nts.proj]] || []).map(m => m[0]).filter(n => n !== 'Kunde' && n !== target) : []).map(n => { const on = (nts.co || []).includes(n); return { label: (on ? '✓ ' : '+ ') + n, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: setNt({ co: on ? (nts.co || []).filter(c => c !== n) : (nts.co || []).concat([n]) }) }; }),
      hasCo: !!(inProj && PK_OF[nts.proj]),
      reps: ['nie', 'täglich', 'wöchentlich', 'monatlich', 'quartalsweise', 'jährlich', 'nach Betriebsstunden'].map(r => pick((nts.rep || 'nie') === r, r === 'nie' ? 'einmalig' : r, { rep: r })), repNote: (nts.rep || 'nie') === 'nie' ? '' : 'Das Cockpit legt die nächste Aufgabe automatisch an, sobald diese erledigt ist, und plant sie in Teamplanung und Kapazität ein.', hasRep: (nts.rep || 'nie') !== 'nie',
      durs: [[7, '1 Woche'], [14, '2 Wochen'], [28, '4 Wochen'], [56, '8 Wochen']].map(([d, l]) => pick(nts.dur === d, l, { dur: d })),
      ownerLabel: nKind === 'gate' ? 'Entscheidet' : 'Verantwortlich', owners: ownersN.map(n => pick(nts.owner === n, n, { owner: n })),
      checks: Object.keys(CHECKS).map(c => pick(nts.check === c, c, { check: c })), checkItems: (CHECKS[nts.check] || []).map(x => ({ text: x })), hasCheckItems: (CHECKS[nts.check] || []).length > 0,
      nodeInfo: nKind === 'ms' ? 'Ein Meilenstein ist ein Termin ohne Dauer (◆). Er steht danach im Gantt, in den Meilensteinen und im Kalender aller Beteiligten. Aufgaben ordnest du ihm in der Aufgabe zu.'
        : (nKind === 'gate' ? 'Ein Quality Gate ist ein Meilenstein mit Prüfung: Checkliste, Entscheider und Ergebnis „Bestanden“, „Mit Auflage bestanden“ oder „Nicht bestanden“.'
        : 'Auf oberster Ebene entsteht eine neue Phase, unter einer Phase ein Arbeitspaket mit Dauer. Beides lässt sich danach im Gantt ziehen.'),
      submitLabel: isNodeK ? NKIND.find(k => k[0] === nKind)[2] + ' anlegen' : (nKind === 'antrag' ? 'Zum Projektantrag' : (nKind === 'projekt' ? 'Weiter: Vorlage und Stufe wählen' : FLOW[3])),
      submit: () => {
        if (nKind === 'antrag') return this.setState({ screen: 'antrag', aStep: 1, panel: null, aMsg: '' });
        if (nKind === 'projekt') return this.setState({ screen: 'pnew', panel: null, newP: { tpl: 'leer', name: (nts.title || '').trim(), start: '2026-11-23', color: '#0F6CBD', members: ['Du'], stufe: null, mods: {}, err: '' }, nt: Object.assign({}, nts, { title: '', kind: 'aufgabe' }) });
        if (isNodeK) {
          const pk = nPk, par = nts.parent ? NODE[nts.parent] : null, id = 'nn' + (s.rev || 0) + '_' + Object.keys(NODE).length;
          const end = nKind === 'phase' ? addDays(nts.date, nts.dur) : nts.date;
          const n = { id, name: nodeTitle, type: nKind === 'phase' ? (par ? 'ms' : 'phase') : 'gate', start: nts.date, end, owner: nts.owner || 'Du', tasks: [], done: false,
            kindLabel: nKind === 'ms' ? 'Meilenstein' : (nKind === 'gate' ? 'Quality Gate' : (par ? 'Arbeitspaket' : 'Phase')), msPoint: nKind === 'ms', checks: nKind === 'gate' ? (CHECKS[nts.check] || []) : [] };
          if (n.type === 'phase') n.children = [];
          if (par) par.children = (par.children || []).concat([n]); else PTREE_OF[pk].push(n);
          NODE[id] = n; PARENT[id] = par ? par.id : null;
          const fitMsg = (par ? this.fitInto(n, par) : '') + this.autoDep(id);
          const pv = { sm42: 'sm42p', rl2: 'rl2p', pd: 'pdp', ih: 'ihp' }[pk];
          return this.setState({ rev: (s.rev || 0) + 1, screen: 'projekt', proj: pk, ptab: 'planung', mview: Object.assign({}, s.mview, { [pv]: nKind === 'phase' ? 'gantt' : 'ms' }),
            panel: { kind: 'node', id, from: 'planung' }, nt: Object.assign({}, nts, { title: '' }),
            mvMsg: n.kindLabel + ' „' + nodeTitle + '“ angelegt' + (par ? ' in „' + par.name + '“' : '') + ', ' + (nKind === 'phase' ? fmt(D(n.start)) + ' bis ' + fmt(D(n.end)) : 'Termin ' + fmt(D(n.end))) + ' · alle Projektmitglieder sehen es sofort.' + fitMsg });
        }
        const title = (nts.title || '').trim() || 'Neue Aufgabe ' + (s.sent.length + 1);
        if (selfApproved) { const id = 'tn' + s.sent.length + '_' + TASKS.length; const x = { id, title, proj: inProj ? nts.proj : 'Ohne Projekt', due: nts.due || '2026-11-20', bucket: 'Backlog', prio: 'Mittel', owner: target, mine: target === 'Du', ms: null, desc: 'Angelegt am 13.11.', est: nts.h, co: inProj ? (nts.co || []) : [], repeat: (nts.rep || 'nie') !== 'nie' ? nts.rep : null }; TASKS.push(x); TASK[id] = x; }
        if (toTeam) { const due = nts.due || '2026-11-20', id = 'tq' + (s.rev || 0) + '_' + s.sent.length, need = nts.need && nts.need !== 'egal' ? nts.need + ' ≥ 3' : 'keine Vorgabe';
          const it = { id, type: 'Von dir', typeBg: '#5B2D90', title, needs: need, due: due.slice(8, 10) + '.' + due.slice(5, 7) + '.', dueIso: due, h: +nts.h || 4, suggest: 'Teamleitung ' + ntT.lead + ' verteilt', sug: ntT.lead, proj: nts.proj, from: 'Du', repeat: (nts.rep || 'nie') !== 'nie' ? nts.rep : null };
          return this.setState({ rev: (s.rev || 0) + 1, teamAdd: Object.assign({}, s.teamAdd, { [ntTk]: ((s.teamAdd || {})[ntTk] || []).concat([it]) }),
            sent: s.sent.concat([{ title, who: 'Team ' + ntT.name, proj: nts.proj, h: nts.h, status: 'team', boss: ntT.lead, tq: id }]), panel: null, nt: Object.assign({}, nts, { title: '' }),
            screen: 'teams', team: ntTk, tpH: 'woche', tpSel: id, tpMsg: '„' + title + '“ liegt im Team-Eingang von ' + ntT.name + '. ' + ntT.lead + ' wurde benachrichtigt und verteilt sie auf Person und Tag.' }); }
        const recNew = (nts.rep || 'nie') !== 'nie' && s.panel && s.panel.from === 'teams' ? { recurAdd: Object.assign({}, s.recurAdd, { [s.team]: ((s.recurAdd || {})[s.team] || []).concat([[title, nts.rep, target, +nts.h || 1, nts.rep]]) }) } : {};
        this.setState(Object.assign(recNew, { rev: (s.rev || 0) + 1, sent: s.sent.concat([{ title, who: target, proj: nts.proj, h: nts.h, status: selfApproved ? 'aktiv' : (mode === 'team' ? 'annahme' : 'wartet'), boss: bossOf }]), panel: null, nt: Object.assign({}, nts, { title: '' }) },
          ctxPk ? { screen: 'projekt', proj: ctxPk, ptab: 'aufgaben' } : { screen: 'arbeit' }));
      }
    };
    const waitChip = { label: 'Wartet auf Freigabe', bg: t.surface2, fg: t.text, bd: '#8764B8' };
    const okChip = { label: '✓ Freigegeben', bg: GREEN, fg: '#FFFFFF', bd: GREEN };
    const setAns = (id, v) => () => { const o = Object.assign({}, s.reqAns); o[id] = v; this.setState({ reqAns: o }); };
    const btnP = { bg: accent, fg: '#FFFFFF', bd: accent }, btnS = { bg: t.surface, fg: t.text, bd: t.strong };
    const reqMe = REQ_ME.map(q => {
      const a = s.reqAns[q.id];
      let chip, acts = [], note = '';
      if (q.kind === 'team') {
        chip = a === 'an' ? Object.assign({}, okChip, { label: '✓ Angenommen' }) : (a === 'ab' ? { label: 'Abgelehnt', bg: t.surface2, fg: t.muted, bd: t.strong } : (a === 'termin' ? Object.assign({}, waitChip, { label: 'Anderer Termin vorgeschlagen' }) : Object.assign({}, waitChip, { label: 'Bitte annehmen · Teamkollege' })));
        if (!a) acts = [Object.assign({ label: 'Annehmen', go: setAns(q.id, 'an') }, btnP), Object.assign({ label: 'Anderer Termin …', go: openCmp('rq:' + q.id + ':termin') }, btnS), Object.assign({ label: 'Ablehnen …', go: openCmp('rq:' + q.id + ':ab') }, btnS)];
        const rt = s.reqTxt[q.id] ? ': „' + s.reqTxt[q.id] + '“' : '';
        note = a === 'an' ? 'Steht jetzt in deiner Liste und zählt in deine Kapazität: KW 47 86 % → 100 %.' : (a === 'ab' ? q.from + ' wurde informiert' + rt + ' und kann die Aufgabe jemand anderem geben.' : (a === 'termin' ? q.from + ' bekommt deinen Vorschlag zur Bestätigung' + rt + '.' : ''));
      } else if (q.kind === 'extern') {
        chip = Object.assign({}, waitChip, { label: 'Wartet auf Freigabe H. Lorenz' });
        if (!s.reqObj[q.id]) acts = [Object.assign({ label: 'Einwand schreiben …', go: openCmp('rq:' + q.id + ':einwand') }, btnS)];
        else note = 'Einwand an H. Lorenz und ' + q.from + ' gesendet: „' + s.reqObj[q.id] + '“';
      } else {
        chip = Object.assign({}, okChip, { label: '✓ Im Projekt zugewiesen' });
        note = 'Projektaufgabe nach Projektrolle, keine Freigabe nötig. Zählt in deinen Projektanteil Retrofit Linie 2.';
      }
      const RQC = {
        termin: { title: 'Welcher Termin passt dir, und warum?', chips: ['26.11. passt mir', '04.12. passt mir', 'Erst nach der FAT', 'Nur mit 2 h statt ' + q.h + ' h'], send: 'Vorschlag senden', onSend: v => this.setState({ reqAns: Object.assign({}, this.state.reqAns, { [q.id]: 'termin' }), reqTxt: Object.assign({}, this.state.reqTxt, { [q.id]: v }) }) },
        ab: { title: 'Warum lehnst du ab? ' + q.from + ' sieht deine Begründung.', chips: ['Kapazität in KW 47 voll', 'Fehlende Qualifikation', 'Gehört zu einem anderen Team', 'Bitte erst mit H. Lorenz abstimmen'], send: 'Ablehnen und senden', onSend: v => this.setState({ reqAns: Object.assign({}, this.state.reqAns, { [q.id]: 'ab' }), reqTxt: Object.assign({}, this.state.reqTxt, { [q.id]: v }) }) },
        einwand: { title: 'Dein Einwand an H. Lorenz und ' + q.from, chips: ['Termin zu knapp', 'Kapazität in KW 47 voll', 'Andere Person besser geeignet', 'Inhalt unklar, bitte Rücksprache'], send: 'Einwand senden', onSend: v => this.setState({ reqObj: Object.assign({}, this.state.reqObj, { [q.id]: v }) }) } };
      const ck = Object.keys(RQC).find(k => s.cmpOpen === 'rq:' + q.id + ':' + k);
      if (ck) acts = [];
      return { title: q.title, from: q.from, ini: ini(q.from), av: AV[q.from] || accent, proj: q.proj, h: q.h + ' h', due: q.due, chip, acts, note, hasNote: !!note, cmp: ck ? cmp('rq:' + q.id + ':' + ck, RQC[ck]) : noCmp };
    });
    const sent = s.sent.map(x => ({ title: x.title, sub: (x.who === 'Du' ? 'für dich' : 'für ' + x.who) + ' · ' + x.proj + ' · ' + x.h + ' h · fällig 20.11.',
      chip: x.status === 'aktiv' ? Object.assign({}, okChip, { label: x.who === 'Du' ? '✓ In Meine Arbeit' : (x.proj === 'Ohne Projekt' ? '✓ Freigegeben' : '✓ Zugewiesen') }) : Object.assign({}, waitChip, { label: x.status === 'annahme' ? 'Wartet auf Annahme durch ' + x.who : (x.status === 'team' ? (s.tplan[x.tq] ? '→ ' + s.tplan[x.tq].who + ', ' + s.tplan[x.tq].iso.slice(8, 10) + '.' + s.tplan[x.tq].iso.slice(5, 7) + '.' : 'Im Team-Eingang, ' + x.boss + ' verteilt') : 'Wartet auf Freigabe ' + x.boss) }) }));
    const reqLoad = [['KW 47', 92, 21], ['KW 48', 80, 0]].map(([kw, b, a]) => ({ kw, before: pct(b / 1.2), add: pct(a / 1.2), line: pct(100 / 1.2),
      label: a ? b + ' % → ' + (b + a) + ' %' : b + ' % (gleich)', color: b + a > 100 ? RED : t.text }));

    // Projektantrag: Einreichen (Mitarbeiter) und Zuteilen (Chef)
    const AS = ['Idee', 'Einordnung', 'Aufwand und Termin', 'Prüfen und einreichen'];
    const aSteps = AS.map((label, i) => { const n = i + 1, on = s.aStep === n, dn = s.aStep > n; return { label, num: dn ? '✓' : String(n), bg: dn ? GREEN : (on ? accent : t.surface2), fg: dn || on ? '#FFFFFF' : t.muted, fw: on ? 700 : 500, current: on ? 'step' : 'false', go: () => this.setState({ aStep: n }) }; });
    const aIs = { s1: s.aStep === 1, s2: s.aStep === 2, s3: s.aStep === 3, s4: s.aStep === 4 };
    const opt = (cur, i, label, key) => ({ label, pressed: cur === i ? 'true' : 'false', ring: cur === i ? accent : t.border, bg: cur === i ? t.soft : t.surface, go: () => this.setState({ [key]: i }) });
    const CLAR = ['klar und abgestimmt', 'teilweise klar', 'noch unklar'], TECH = ['bekannt', 'teilweise neu', 'völlig neu'];
    const EFF = ['bis 80 h', '80 bis 300 h', '300 bis 1000 h', 'über 1000 h'], STARTS = ['Januar 2027', 'Februar 2027', 'März 2027'];
    const aClar = CLAR.map((l, i) => opt(s.aClar, i, l, 'aClar'));
    const aTech = TECH.map((l, i) => opt(s.aTech, i, l, 'aTech'));
    const zoneA = s.aClar === 2 && s.aTech === 2 ? 'chaotisch' : (s.aClar === 2 || s.aTech === 2 ? 'komplex' : (s.aClar + s.aTech === 0 ? 'einfach' : 'kompliziert'));
    const ZA = { einfach: ['Einfach', 'Wasserfall', 'Stufe 1 bis 2: Aufgabenliste mit Meilensteinen reicht.'], kompliziert: ['Kompliziert', 'Wasserfall mit Quality Gates oder V-Modell', 'Stufe 3: Gantt, Gates und Risiken.'], komplex: ['Komplex', 'Scrum', 'Stufe 3: Backlog, Sprints und Reviews.'], chaotisch: ['Chaotisch', 'erst Machbarkeitsstudie, dann Scrum', 'Stufe 2: kurze Studie mit festem Zeitrahmen.'] }[zoneA];
    const aZone = { name: ZA[0], model: ZA[1], text: ZA[2] };
    const aTeams = CAP_TEAMS.map(([tk, tn]) => { const on = !!s.aTeams[tk]; return { label: tn, mark: on ? '✓ ' : '', pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: () => { const o = Object.assign({}, s.aTeams); o[tk] = !o[tk]; this.setState({ aTeams: o }); } }; });
    const aEff = EFF.map((l, i) => opt(s.aEff, i, l, 'aEff'));
    const aStart = STARTS.map((l, i) => opt(s.aStartI, i, l, 'aStartI'));
    const capNow = capFill(s.porder.map(k => PORTK[k]));
    const aCap = CAP_TEAMS.filter(([tk]) => s.aTeams[tk]).map(([tk, tn, n]) => { const f = capNow.free[tk]; return { name: tn, text: f >= 0 ? f + ' h/Woche frei' : 'schon ' + (-f) + ' h/Woche überplant', color: f > 0 ? GREEN : RED, w: pct(Math.max(0, f) / (n * PLAN_H) * 100) }; });
    const aSum = [['Titel', 'Schnellwechsel-Greifer Roboterzelle L3'], ['Einordnung', aZone.name + ': ' + aZone.model], ['Themen', s.aThemeSel.map((k, j) => TH[k].name + (j === 0 ? ' (Hauptthema)' : '')).join(', ') || 'noch keine gewählt'], ['Bereiche', CAP_TEAMS.filter(([tk]) => s.aTeams[tk]).map(c => c[1]).join(', ') || 'noch keine gewählt'], ['Aufwand', EFF[s.aEff]], ['Wunschstart', STARTS[s.aStartI]], ['Geht an', 'H. Lorenz, dein Chef']].map(([k, v]) => ({ k, v }));
    const aLast = s.aStep === 4;
    const aNext = { label: aLast ? 'Einreichen' : 'Weiter', go: () => (aLast ? this.setState({ aSent: true, screen: 'projekte', aStep: 1, aMsg: '' }) : this.setState({ aStep: s.aStep + 1, aMsg: '' })) };
    const aBack = { op: s.aStep === 1 ? '0.4' : '1', go: () => { if (s.aStep > 1) this.setState({ aStep: s.aStep - 1 }); } };
    const stepRow = (cur, labels) => labels.map((l, i) => ({ label: l, bg: i < cur ? GREEN : (i === cur ? accent : t.surface2), fg: i <= cur ? '#FFFFFF' : t.muted, arrow: i === labels.length - 1 ? 'none' : 'inline' }));
    const myAntraege = [];
    if (s.aSent) myAntraege.push({ name: 'Schnellwechsel-Greifer Roboterzelle L3', sub: 'Eingereicht heute · bei H. Lorenz', steps: stepRow(1, ['Eingereicht', 'In Bewertung', 'Entscheidung', 'Projekt angelegt']), note: 'H. Lorenz ist benachrichtigt. Bei jeder Änderung bekommst du eine Nachricht.', noteColor: t.muted, hasNote: true, canAnswer: false, answer: () => {}, cmp: noCmp });
    myAntraege.push({ name: 'Energiemonitoring Druckluft Halle 1', sub: 'Eingereicht 21.10.2026 · bei H. Lorenz', steps: stepRow(1, ['Eingereicht', s.aAnswered ? 'In Bewertung' : 'Rückfrage', 'Entscheidung', 'Projekt angelegt']),
      note: s.aAnswered ? 'Deine Antwort: „' + s.aAnswered + '“. Der Antrag ist wieder in Bewertung.' : 'Rückfrage von H. Lorenz: „Welche Einsparung erwartest du pro Jahr?“', noteColor: s.aAnswered ? t.muted : accentText, hasNote: true, canAnswer: !s.aAnswered && s.cmpOpen !== 'ma:etd', answer: openCmp('ma:etd'), cmp: cmp('ma:etd', { title: 'Deine Antwort an H. Lorenz', ph: 'Eigene Antwort schreiben, z. B. Einsparung, Annahmen, Quelle', chips: ['ca. 10.000 € pro Jahr', 'ca. 18.000 € pro Jahr', 'noch nicht bezifferbar, Messung läuft bis 30.11.', 'Rechnung hänge ich an'], send: 'Antwort senden', err: 'Bitte eine Antwort schreiben oder einen Vorschlag anklicken.', onSend: v => this.setState({ aAnswered: v }) }) });
    myAntraege.push({ name: 'Ersatzteillager digital', sub: 'Eingereicht 02.10.2026 · genehmigt 02.11.2026', steps: stepRow(4, ['Eingereicht', 'In Bewertung', 'Genehmigt', 'Projekt angelegt']), note: 'Projektleitung D. Petrov, Start 01.12.2026.', noteColor: t.muted, hasNote: true, canAnswer: false, answer: () => {}, cmp: noCmp });

    const ztS = s.zt, baseOrder = s.porder.filter(k => k !== 'tl3');
    const insAt = (arr, r) => { const o = arr.slice(); o.splice(r - 1, 0, 'tl3'); return o; };
    const capBase = capFill(baseOrder.map(k => PORTK[k])), capIns = capFill(insAt(baseOrder, ztS.rank).map(k => PORTK[k]));
    const losers = baseOrder.filter(k => (capIns.gap[k] || 0) > (capBase.gap[k] || 0)).map(k => PORTK[k].name + ' ' + ((capIns.gap[k] || 0) - (capBase.gap[k] || 0)) + ' h');
    const g3 = capIns.gap.tl3 || 0;
    const zchip = (on, label, sub, patch) => ({ label, sub, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: () => this.setState({ zt: Object.assign({}, ztS, patch) }) });
    const zt = {
      show: sel.id === 'i3' && s.ztOpen && !s.result.i3, done: sel.id === 'i3' && s.tl3,
      pls: [['M. Yilmaz', 'Antragsteller · KW 47: 68 %'], ['J. Novak', 'KW 47: 74 %'], ['S. Keller', 'KW 47: 92 %']].map(([n, sub]) => zchip(ztS.pl === n, n, sub, { pl: n })),
      koDues: [['2026-12-18', 'in 5 Wochen · 18.12.'], ['2027-01-15', '15.01.2027 (empfohlen, 2 Wochen vor Start)'], ['2027-01-29', '29.01.2027 (letzte Woche vor Start)']].map(([d, l]) => zchip((ztS.koDue || '2027-01-15') === d, l, '', { koDue: d })),
      handover: 'Wie das Projekt umgesetzt wird, entscheidet ' + ztS.pl + ' als Projektleitung im Kick-off: Vorgehensmodell (Vorschlag aus dem Antrag: Scrum, komplex), Vorlage, User Stories, Erfolgsfaktoren und Abnahmekriterien. Bis dahin hat das Projekt den Status „Kick-off ausstehend“.',
      createLabel: 'Genehmigen und ' + ztS.pl + ' beauftragen',
      goKickoff: () => this.setState({ screen: 'kickoff', panel: null }),
      ranks: baseOrder.concat([null]).map((k, i) => zchip(ztS.rank === i + 1, String(i + 1), k ? 'vor ' + PORTK[k].code : 'zuletzt', { rank: i + 1 })),
      capTitle: g3 ? '! Auf Priorität ' + ztS.rank + ' fehlen der Teileerkennung ' + g3 + ' h/Woche' : '✓ Auf Priorität ' + ztS.rank + ' ist der Bedarf gedeckt', capColor: g3 ? RED : GREEN,
      capText: 'Bedarf: Automatisierung 20 h und Softwareentwicklung 15 h pro Woche. ' + (losers.length ? 'Dafür verlieren Kapazität: ' + losers.join(', ') + ' pro Woche.' : 'Kein anderes Projekt verliert Kapazität.'),
      create: () => { const due = ztS.koDue || '2027-01-15'; const tid = this.quickTask({ title: 'Kick-off Teileerkennung Linie 3 planen und durchführen (Pflicht)', proj: 'Ohne Projekt', owner: ztS.pl, due });
        this.setState({ tl3: true, ztOpen: false, porder: insAt(baseOrder, ztS.rank), ko: Object.assign({}, KO0, { pl: ztS.pl, due, task: tid }),
          result: Object.assign({}, s.result, { i3: 'Genehmigt: Teileerkennung Linie 3 · Projektleitung ' + ztS.pl + ' · Priorität ' + ztS.rank + ' · Start 01.02.2027. ' + ztS.pl + ' plant den Kick-off bis ' + fmt(D(due)) + D(due).getFullYear() + ' und legt dort das Vorgehen fest.' }) }); },
      cancel: () => this.setState({ ztOpen: false }),
      goPortfolio: () => this.setState({ screen: 'berichte', rview: 'portfolio', rFilter: 'alle', panel: null })
    };

    // Verwaltung
    const AV_TABS = [['org', 'Organigramm'], ['personen', 'Personen'], ['regeln', 'Freigabewege'], ['gruppen', 'Gruppen und Vertretung'], ['ki', 'KI-Modell']];
    const adViews = AV_TABS.map(([k, label]) => ({ label, sel: s.adview === k ? 'true' : 'false', bg: s.adview === k ? t.surface : 'transparent', fg: s.adview === k ? t.text : t.muted, sh: s.adview === k ? '0 1px 3px rgba(0,0,0,0.15)' : 'none', go: () => this.setState({ adview: k, adMsg: '' }) }));
    const ad = { org: s.adview === 'org', personen: s.adview === 'personen', regeln: s.adview === 'regeln', gruppen: s.adview === 'gruppen', ki: s.adview === 'ki' };
    const kiAd = {
      backends: [['Modell auf dem Cockpit-Server (eingebettet)', 'Phi-3.5 mini aus dem Ordner models/ auf dem Server. Läuft im Cockpit-Prozess, ohne Zusatzdienst, ohne API-Schlüssel, ohne Internet. Alle Nutzer teilen sich das Modell, Anfragen laufen nacheinander in einer Warteschlange.', 'aktiv', true],
        ['Ollama', 'Eigener Hintergrunddienst. Auf dem Server nicht vorgesehen.', 'nicht verfügbar', false],
        ['Cloud-KI', 'Daten würden das Firmennetz verlassen. Per Richtlinie gesperrt.', 'gesperrt', false]]
        .map(([name, sub, state, on]) => ({ name, sub, state, ring: on ? accent : t.border, dot: on ? accent : 'transparent', bg: on ? t.soft : t.surface, op: on ? '1' : '0.6', stBg: on ? GREEN : t.surface2, stFg: on ? '#FFFFFF' : t.muted })),
      facts: [['Modelldatei', 'models/Phi-3.5-mini-instruct-Q4_K_M.gguf · 2,4 GB auf dem Server'], ['Laufzeit', 'llama-cpp-python im Cockpit-Prozess, CPU, rund 4 GB RAM'], ['Warteschlange', 'KI-Aufträge laufen im Hintergrund, die Seite bleibt bedienbar'], ['Kontext', '4.096 Token, reicht für etwa 6 Seiten Text'], ['Einstellung', '.env: KI_BACKEND=lokal']].map(([k, v]) => ({ k, v })),
      test: () => this.setState({ adMsg: 'Test mit dem Modell auf dem Server: Antwort erhalten. Die erste Anfrage dauert länger, weil das Modell einmal in den Speicher geladen wird.' }),
      uses: [['mail', 'E-Mails in Aufgaben umwandeln'], ['status', 'Statusbericht vorschlagen'], ['risiko', 'Risiken vorschlagen'], ['ll', 'Ähnliche Lessons Learned finden'], ['sum', 'Projekt zusammenfassen (Kachel in der Übersicht)']]
        .map(([k, label]) => { const on = !!s.kiUse[k]; return { label, checked: on ? 'true' : 'false', trackBg: on ? GREEN : t.strong, justify: on ? 'flex-end' : 'flex-start', toggle: () => this.setState({ kiUse: Object.assign({}, s.kiUse, { [k]: !on }) }) }; }) };
    const orgOf = s.orgOf;
    const bossOfP = p => { const u = OU[orgOf[p]]; if (!u) return '–'; if (u.lead === p) return u.parent ? OU[u.parent].lead : '–'; return u.lead; };
    const membersOf = id => Object.keys(orgOf).filter(p => orgOf[p] === id);
    const unitCard = u => ({ name: u.name, lead: u.lead === 'Du' ? 'du' : u.lead, color: u.color, ini: ini(u.lead), av: AV[u.lead] || accent,
      count: membersOf(u.id).length + (membersOf(u.id).length === 1 ? ' Person' : ' Personen'), load: TEAM_LOAD[u.id] || '–',
      people: membersOf(u.id).map(n => ({ name: n, ini: ini(n), av: AV[n] || accent })),
      pressed: s.orgSel === u.id ? 'true' : 'false', ring: s.orgSel === u.id ? accent : t.border, go: () => this.setState({ orgSel: u.id, orgMove: null }) });
    const orgTop = ORG_UNITS.filter(u => u.id === 'gf' || u.id === 'tech').map(unitCard);
    const orgTeams = ORG_UNITS.filter(u => u.parent === 'tech').map(unitCard);
    const selU = OU[s.orgSel];
    const orgDetail = {
      name: selU.name, lead: selU.lead === 'Du' ? 'du' : selU.lead, leadBoss: selU.parent ? (OU[selU.parent].lead === 'Du' ? 'du' : OU[selU.parent].lead) : 'Gesellschafter',
      members: membersOf(selU.id).map(n => {
        const isLead = OU[orgOf[n]].lead === n, picked = s.orgMove === n;
        return { name: n === 'Du' ? 'Du' : n, ini: ini(n), av: AV[n] || accent, role: ROLE[n] || '', boss: bossOfP(n) === 'Du' ? 'du' : bossOfP(n),
          canMove: !isLead && selU.parent === 'tech', picked: picked ? 'true' : 'false', ring: picked ? accent : t.strong, bg: picked ? t.soft : t.surface,
          pick: () => this.setState({ orgMove: picked ? null : n }), showTargets: picked };
      })
    };
    const orgTargets = ORG_UNITS.filter(u => u.parent === 'tech' && u.id !== s.orgSel).map(u => ({ label: u.name, color: u.color, go: () => {
      const p = s.orgMove; if (!p) return;
      const o = Object.assign({}, orgOf); o[p] = u.id;
      const newBoss = u.lead;
      this.setState({ orgOf: o, orgMove: null, orgSel: u.id,
        orgHist: [{ text: p + ': ' + OU[orgOf[p]].name + ' → ' + u.name + ', neuer Chef ' + newBoss, when: 'heute, durch dich' }].concat(s.orgHist),
        adMsg: p + ' ist jetzt in ' + u.name + '. Offene Freigaben für ' + p + ' gehen ab sofort an ' + newBoss + ', bereits entschiedene bleiben bei ' + OU[orgOf[p]].lead + '.' });
    } }));
    const orgHist = s.orgHist.concat([
      { text: 'F. Roth: Automatisierung → Softwareentwicklung, neuer Chef N. Becker', when: '01.10.2026, H. Lorenz' },
      { text: 'Team Instandhaltung angelegt, Leitung R. Fischer', when: '01.06.2026, H. Lorenz' }
    ]);
    const VERTR = [{ who: 'R. Fischer', by: 'K. Weber', period: '16.11. bis 20.11.2026', active: false }, { who: 'H. Lorenz', by: 'Du', period: '21.12.2026 bis 06.01.2027', active: false }];
    if (s.vtSet) VERTR.push({ who: 'Du', by: s.vtBy, period: '21.12.2026 bis 06.01.2027', active: false, mine: true });
    const vertrList = VERTR.map(v => ({ who: v.who === 'Du' ? 'Du' : v.who, by: v.by === 'Du' ? 'dir' : v.by, period: v.period, state: v.mine ? 'neu' : 'geplant', bg: v.mine ? GREEN : t.surface2, fg: v.mine ? '#FFFFFF' : t.text, bd: v.mine ? GREEN : t.strong }));
    const vtPick = ['S. Keller', 'L. Wagner', 'N. Becker'].map(n => ({ label: n, pressed: s.vtBy === n ? 'true' : 'false', ring: s.vtBy === n ? accent : t.border, bg: s.vtBy === n ? t.soft : t.surface, go: () => this.setState({ vtBy: n }) }));
    const vertrOf = p => { const v = VERTR.find(x => x.who === p); return v ? (v.by === 'Du' ? 'du' : v.by) + ', ' + v.period.split(' bis ')[0] : '–'; };
    const orgPeople = Object.keys(orgOf).map(n => { const u = OU[orgOf[n]]; return { name: n, ini: ini(n), av: AV[n] || accent, unit: u.name, color: u.color, boss: bossOfP(n) === 'Du' ? 'du' : bossOfP(n), fach: FACH[n] || '–', vertr: vertrOf(n), vColor: vertrOf(n) === '–' ? t.muted : t.text }; });
    const RULES = [
      ['projekt', 'Aufgabe im Projekt', 'keine Freigabe, Zuweisung nach Projektrolle', null],
      ['team', 'Aufgabe von Teamkollegen', 'Annahme durch die empfangende Person', 'team'],
      ['extern', 'Aufgabe von außerhalb des Teams', 'Chef der empfangenden Person', 'extern'],
      ['zeit', 'Wochenzettel', 'Chef bzw. Projektleitung', 'zeit'],
      ['anteil', 'Projektanteil ändern', 'Chef der Person', 'anteil'],
      ['antrag', 'Projektantrag', 'Chef, ab 100 T€ zusätzlich Geschäftsführung', 'antrag'],
      ['gate', 'Quality Gate', '@Gate-Prüfer und Projektleitung', 'gate']
    ];
    const rules = RULES.map(([k, what, who, rk]) => {
      const n = rk ? s.rem[rk] : 0;
      const setR = d => () => { const o = Object.assign({}, s.rem); o[rk] = Math.max(1, Math.min(10, n + d)); this.setState({ rem: o }); };
      return { what, who, hasRem: !!rk, fixed: !rk, fixedText: 'festgelegt am 13.11.2026', rem: 'nach ' + n + (n === 1 ? ' Arbeitstag' : ' Arbeitstagen'),
        minus: rk ? setR(-1) : () => {}, plus: rk ? setR(1) : () => {}, minusLabel: what + ': Erinnerung früher', plusLabel: what + ': Erinnerung später' };
    });
    const pfBtns = [70, 75, 80, 85].map(v => ({ label: v + ' %', pressed: s.planF === v ? 'true' : 'false', ring: s.planF === v ? accent : t.border, bg: s.planF === v ? t.soft : t.surface, go: () => this.setState({ planF: v }) }));
    const pf = { hours: (35 * s.planF / 100).toLocaleString('de-DE') + ' h planbar pro Woche', text: 'bei 35 h Sollzeit und ' + s.planF + ' % · branchenüblich sind 75 %' };
    const groupsAd = AD_GROUPS.map(g => ({ name: g.name, used: g.used, people: g.members.map(n => ({ name: n, ini: ini(n), av: AV[n] || accent })) }));

    // Themen und Fokus
    const fW = k => FOCUS_W[s.focus[k] || 0];
    const thOrd = (s.thOrder || THEMES.map(x => x[0])), THS = THEMES.slice().sort((a, b) => thOrd.indexOf(a[0]) - thOrd.indexOf(b[0]));
    const focusRows = THS.map(([k, name, color], ti) => ({ name, color, aria: 'Fokus ' + name, rank: String(ti + 1), drag: this.dragStart('th:' + k), dragEnd: this.dragEnd(), over: this.dragOver('th|' + k),
      rowBg: s.dragOver === 'th|' + k ? t.soft : 'transparent', rowBd: s.dragOver === 'th|' + k ? accent : 'transparent',
      drop: this.dropOn('th|' + k, id => { if (typeof id !== 'string' || id.indexOf('th:') !== 0) return; const from = id.slice(3); if (from === k) return; const o = thOrd.filter(x => x !== from); o.splice(o.indexOf(k), 0, from); this.setState({ thOrder: o }); }),
      lv: FOCUS_L.map((label, i) => ({ label, pressed: s.focus[k] === i ? 'true' : 'false', bg: s.focus[k] === i ? (i === 3 ? accent : t.surface) : 'transparent', fg: s.focus[k] === i ? (i === 3 ? '#FFFFFF' : t.text) : t.muted,
        go: () => { const f = Object.assign({}, s.focus); f[k] = i; this.setState({ focus: f }); } })) }));
    const thHours = {}; let thTotal = 0;
    ordered.forEach(x => {
      const h = Object.values(x.demand).reduce((a, b) => a + b, 0), th = PTHEME[x.key] || [];
      th.forEach((k, j) => { const part = th.length === 1 ? h : (j === 0 ? h * 2 / 3 : h / 3 / (th.length - 1)); thHours[k] = (thHours[k] || 0) + part; });
      thTotal += h;
    });
    const wSum = THEMES.reduce((a, [k]) => a + fW(k), 0) || 1;
    const themeBars = THEMES.map(([k, name, color]) => {
      const ist = thTotal ? (thHours[k] || 0) / thTotal * 100 : 0, soll = fW(k) / wSum * 100, diff = ist - soll;
      return { name, color, ist: pct(ist), soll: pct(soll), label: 'ist ' + Math.round(ist) + ' % · soll ' + Math.round(soll) + ' %', textColor: Math.abs(diff) >= 8 ? (diff > 0 ? '#A33F06' : RED) : t.text };
    });
    const scoreOf = key => (PTHEME[key] || []).reduce((a, k, j) => a + fW(k) * (j === 0 ? 1 : 0.5), 0);
    const sugOrder = s.porder.slice().sort((a, b) => scoreOf(b) - scoreOf(a) || s.porder.indexOf(a) - s.porder.indexOf(b));
    const prioSug = sugOrder.map((k, i) => { const x = PORTK[k], d = s.porder.indexOf(k) - i;
      return { rank: i + 1, code: x.code, name: x.name, color: x.color, score: scoreOf(k).toLocaleString('de-DE') + ' Pkt.',
        themes: (PTHEME[k] || []).map((tk, j) => ({ label: TH[tk].name, color: TH[tk].color, fw: j === 0 ? 700 : 500 })),
        move: d > 0 ? '↑ ' + d + ' Platz' + (d > 1 ? 'e' : '') : (d < 0 ? '↓ ' + (-d) + ' Platz' + (d < -1 ? 'e' : '') : 'bleibt'), moveColor: d > 0 ? GREEN : (d < 0 ? '#A33F06' : t.muted) }; });
    const applySug = () => this.setState({ porder: sugOrder, rMsg: 'Prioritätsvorschlag übernommen. Betroffene Projektleitungen werden informiert, die Begründung „Fokus Themen“ steht in der Historie.' });
    const aThemes = THEMES.map(([k, name]) => { const idx = s.aThemeSel.indexOf(k), on = idx >= 0;
      return { label: name, mark: on ? (idx === 0 ? '★ ' : '✓ ') : '', pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface,
        go: () => this.setState({ aThemeSel: on ? s.aThemeSel.filter(x => x !== k) : s.aThemeSel.concat([k]).slice(0, 3) }) }; });
    const aFocusHint = THEMES.filter(([k]) => s.focus[k] === 3).map(c => c[1]).join(', ') || 'keine Schwerpunkte gesetzt';

    // Ansichten (Liste, Board, Kalender, Personen, PSP, Meilensteine, Gantt, Verfolgbarkeit) für Meine Arbeit und alle Projekte
    const PKS = ['sm42', 'rl2', 'pd', 'ih'];
    const mvPk = PKS.includes(s.proj) ? s.proj : 'sm42';
    const mvProj = s.screen === 'projekt';
    const mvPlan = mvProj && s.ptab === 'planung';
    const mvCtx = mvProj ? mvPk + (mvPlan ? 'p' : '') : 'arbeit';
    const mvFrom = mvPlan ? 'planung' : (mvProj ? 'aufgaben' : 'arbeit');
    const PINFO = { sm42: [TREE, 'SM42 Schraubstation', '#0F6CBD', START, END], pd: [PD_TREE, 'Prüfstand Drehmoment', '#5B2D90', D('2026-06-01'), D('2027-04-01')],
      rl2: [RL_TREE, 'Retrofit Linie 2', '#0E7A6E', D('2026-09-14'), D('2027-01-18')], ih: [IH_TREE, 'Instandhaltung Halle 2', '#A33F06', D('2026-11-02'), D('2027-02-01')] };
    const [PTREE, PNAME, PCOLOR, PR0, PR1] = PINFO[mvPk];
    const PRS = dd(PR0, PR1);
    const treeIds = []; PTREE.forEach(ph => { treeIds.push(ph.id); (ph.children || []).forEach(c => treeIds.push(c.id)); });
    const MV_ALL = { vmodel: ['V-Modell', '◇'], scrum: ['Scrum-Zyklus', '↻'], kanban: ['Kanban', '▥'], liste: ['Liste', '☰'], board: ['Board', '▦'], kalender: ['Kalender', '▤'], personen: ['Personen', '◉'],
      gantt: ['Gantt', '▬'], psp: ['PSP', '⌗'], ms: ['Meilensteine', '◆'], trace: ['Verfolgbarkeit', '⇄'] };
    const MV_BY = { arbeit: ['liste', 'board', 'kalender', 'gantt', 'ms'],
      sm42: ['liste', 'board', 'kalender', 'personen'], sm42p: ['gantt', 'psp', 'ms', 'trace'],
      pd: ['liste', 'board', 'kalender', 'personen'], pdp: ['vmodel', 'gantt', 'psp', 'ms', 'trace'],
      rl2: ['board', 'liste', 'kalender', 'personen'], rl2p: ['scrum', 'gantt', 'ms', 'trace'],
      ih: ['kanban', 'liste', 'kalender', 'personen'], ihp: ['gantt', 'ms', 'personen'] };
    const mvTabsK = MV_BY[mvCtx];
    const mvView = mvTabsK.includes(s.mview[mvCtx]) ? s.mview[mvCtx] : mvTabsK[0];
    const mvSet = v => () => { const o = Object.assign({}, s.mview); o[mvCtx] = v; this.setState({ mview: o }); };
    const stc = st => st === 'erledigt' ? GREEN : (st === 'ueberfaellig' ? RED : t.strong);
    const stBg = st => st === 'erledigt' ? GREEN : (st === 'ueberfaellig' ? RED : t.surface);
    const isoD = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const ownerOf = x => this.ownerOf(x);
    const ctxAll = (mvProj ? TASKS.filter(x => x.proj === PNAME) : TASKS.filter(x => x.mine)).filter(x => !x.kb || s.kb[x.kb] !== 'neu');
    const mvf_MF0 = { who: null, prio: null, due: null, lbl: null, q: '' }, mvf_mf = Object.assign({}, mvf_MF0, (s.mvf || {})[mvCtx] || {}), mvf_setMf = patch => this.setState({ mvf: Object.assign({}, s.mvf, { [mvCtx]: Object.assign({}, mvf_mf, patch) }) });
    const mvf_DUEF = { ueber: ['Überfällig', x => this.taskStatus(x) === 'ueberfaellig'], heute: ['Heute', x => x.due === '2026-11-13'], woche: ['Diese Woche', x => x.due >= '2026-11-09' && x.due <= '2026-11-15'], naechste: ['Nächste Woche', x => x.due >= '2026-11-16' && x.due <= '2026-11-22'], spaeter: ['Später', x => x.due > '2026-11-22'] };
    const mvf_lblsOf = x => (s.lbl || {})[x.id] || LBL_SEED[x.id] || [];
    const mvf_fPass = x => (!mvf_mf.who || this.ownerOf(x) === mvf_mf.who || this.coOf(x).includes(mvf_mf.who)) && (!mvf_mf.prio || x.prio === mvf_mf.prio) && (!mvf_mf.due || mvf_DUEF[mvf_mf.due][1](x)) && (!mvf_mf.lbl || mvf_lblsOf(x).includes(mvf_mf.lbl)) && (!mvf_mf.q || x.title.toLowerCase().indexOf(mvf_mf.q.toLowerCase()) >= 0 || (x.kid || '').toLowerCase().indexOf(mvf_mf.q.toLowerCase()) >= 0);
    const ctxTasks = ctxAll.filter(mvf_fPass);
    const msNodes = Object.values(NODE).filter(n => n.type !== 'phase');
    const ctxMs = mvProj ? msNodes.filter(n => treeIds.includes(n.id)) : msNodes.filter(n => ctxTasks.some(x => x.ms === n.id));
    const phaseOf = n => (PARENT[n.id] ? NODE[PARENT[n.id]].name : 'Projekt');
    const PLAN_DAY = PLAN_H / 5;
    const estOf = x => EST[x.id] || x.est || 1;
    const noMs = mvPk === 'rl2' ? 'Product Backlog' : 'ohne Meilenstein';
    const nm = n => (n === 'Du' ? 'Du' : n);
    const mvRow = x => {
      const ts = this.taskStatus(x), dn = ts === 'erledigt', b = this.bucketOf(x), inF = b === 'Fokus', o = ownerOf(x);
      const c2 = mvProj ? (x.ms ? NODE[x.ms].name : noMs) : x.proj;
      return { title: x.title, col2: c2, col2Color: mvProj ? (x.ms ? stc(this.nodeStatus(NODE[x.ms])) : t.strong) : (PROJCOL[x.proj] || t.strong),
        owner: nm(o), ini: ini(o), av: AV[o] || accent,
        open: () => this.openTask(x.id, mvFrom), toggle: () => this.toggleDone(x.id), checkLabel: (dn ? 'Wieder öffnen: ' : 'Erledigt: ') + x.title,
        checkColor: dn ? GREEN : t.strong, checkFill: dn ? GREEN : 'none', checkMark: dn ? '#FFFFFF' : 'none', strike: dn ? 'line-through' : 'none',
        bucket: x.story ? (s.sst[x.story] || 'Backlog') : (x.kb ? (this.kbColsOf().find(c => c[0] === s.kb[x.kb]) || ['', b])[1] : this.bucketName(x, b)), bucketBg: this.bucketColor(x, b), prio: x.prio, prioBg: PRIO[x.prio], chip: this.chip(ts, t, accent), dueLabel: this.dueLabel(x),
        inFocus: inF ? 'true' : 'false', star: inF ? '★' : '☆', starColor: inF ? accent : t.muted, focusLabel: (inF ? 'Aus dem Fokus nehmen: ' : 'In den Fokus legen: ') + x.title, focus: () => this.toggleFocus(x.id) };
    };
    const byDue = (a, b) => D(a.due) - D(b.due);

    // Liste
    let mvGroups;
    if (!mvProj) {
      const stA = ctxTasks.map(x => ({ x, s: this.taskStatus(x) })).filter(pass);
      mvGroups = G.map(([key, title, color]) => { const rows = stA.filter(a => groupOf(a) === key).sort((a, b) => byDue(a.x, b.x)).map(a => mvRow(a.x)); return { title, color, count: rows.length, rows }; }).filter(g => g.count > 0);
    } else {
      const grpNodes = PTREE.length === 1 ? PTREE[0].children : PTREE;
      mvGroups = grpNodes.map(gn => {
        const ids = gn.children ? gn.children.map(c => c.id) : [gn.id];
        const rows = ctxTasks.filter(x => x.ms && ids.includes(x.ms)).sort(byDue).map(mvRow);
        const st = this.nodeStatus(gn);
        return { title: gn.name, color: st === 'plan' ? t.text : stc(st), count: rows.length, rows };
      }).filter(g => g.count > 0);
      const rest = ctxTasks.filter(x => !x.ms).sort(byDue).map(mvRow);
      if (rest.length) mvGroups.push({ title: noMs, color: t.muted, count: rest.length, rows: rest });
    }

    // Board mit Zeilen und Drag & Drop
    const BKS = ['Backlog', 'Fokus', 'Warten auf', 'Erledigt'];
    const BOARD = mvProj && mvPk === 'rl2'
      ? { cols: [['Product Backlog', '#5C5C5C']].concat(SB_COLS).map(c => [c[0], c[1], c[0]]),
          colOf: x => (x.story ? (x.ms ? s.sst[x.story] : 'Product Backlog') : { Backlog: 'To Do', Fokus: 'In Arbeit', 'Warten auf': 'Review', Erledigt: 'Done' }[this.bucketOf(x)]),
          to: (id, c) => { const x = TASK[id];
            if (!x.story) return c === 'Product Backlog' ? this.setState({ boardMsg: '„' + x.title + '“ ist eine Aufgabe, keine Story, und bleibt im Sprint.' }) : this.bucketTo(id, { 'To Do': 'Backlog', 'In Arbeit': 'Fokus', 'Review': 'Warten auf', 'Done': 'Erledigt' }[c]);
            if (c === 'Product Backlog' || !x.ms) return this.setState({ boardMsg: STORIES[x.story].key + ': Stories wechseln nur über die Sprint-Planung zwischen Product Backlog und Sprint.' });
            this.storyTo(x.story, c); } }
      : { cols: (mvProj ? this.bucketsOf(mvPk) : DEF_BUCKETS).map(b => [b.key, b.color, b.name]), colOf: x => this.bucketOf(x), to: (id, c) => this.bucketTo(id, c) };
    const colNames = BOARD.cols.map(c => c[0]);
    const bkEdit = !!(mvProj && mvPk !== 'rl2' && mvPk !== 'ih');
    const RLB = { 'Product Backlog': 'Backlog', 'To Do': 'Backlog', 'In Arbeit': 'Fokus', 'Review': 'Warten auf', 'Done': 'Erledigt' };
    const qaProj = lnKey => (mvProj ? PNAME_OF[mvPk] : (laneModeQ() === 'projekt' && lnKey && lnKey !== '-' ? lnKey : 'Ohne Projekt'));
    const laneModeQ = () => s.blane[mvCtx] || 'keine';
    const qaSave = (key, o) => () => { const tt = (this.state.qaText || '').trim(); if (!tt) return this.setState({ boardMsg: 'Erst einen Titel eingeben.' }); this.quickTask(Object.assign({ title: tt }, o)); this.setState({ qa: key, boardMsg: '„' + tt + '“ angelegt' + (o.owner && o.owner !== 'Du' ? ' für ' + o.owner : '') + (o.due ? ', fällig ' + fmt(D(o.due)) : '') }); };
    const laneMode = s.blane[mvCtx] || 'keine';
    const laneOpts = mvProj ? [['keine', 'Keine'], ['person', 'Nach Person']] : [['keine', 'Keine'], ['projekt', 'Nach Projekt']];
    const laneBtnsMv = laneOpts.map(([k, l]) => ({ label: l, sel: laneMode === k ? 'true' : 'false', bg: laneMode === k ? t.surface : 'transparent', fg: laneMode === k ? t.text : t.muted, go: () => { const o = Object.assign({}, s.blane); o[mvCtx] = k; this.setState({ blane: o }); } }));
    const uniq = arr => arr.filter((v, i) => arr.indexOf(v) === i);
    let laneList;
    if (laneMode === 'person') laneList = uniq(ctxTasks.map(ownerOf)).sort().map(p => ({ key: p, title: nm(p), ini: ini(p), av: AV[p] || accent, test: x => ownerOf(x) === p }));
    else if (laneMode === 'projekt') laneList = uniq(ctxTasks.map(x => x.proj)).map(p => ({ key: p, title: p, ini: p.slice(0, 2).toUpperCase(), av: PROJCOL[p] || accent, test: x => x.proj === p }));
    else laneList = [{ key: '-', title: '', ini: '', av: accent, test: () => true }];
    const cardMeta = x => { const w = s.wait[x.id], nC = (COMMENTS[x.id] || []).length + (s.comments[x.id] || []).length, wt = w && !x.story && !x.kb && this.catOf(x, this.bucketOf(x)) === 'wartet';
      const ckL = (s.chk || {})[x.id] || (CHK_SEED[x.id] || []).map(([tt, d]) => ({ t: tt, d })), lbL = ((s.lbl || {})[x.id] || LBL_SEED[x.id] || []).map(k => this.lblName(this.pkOf(x), k)).filter(Boolean);
      const co3 = this.coOf(x), parts = [this.blockersOf(x.id).length ? '⛔ blockiert' : '', lbL.length ? '● ' + lbL.join(', ') : '', ckL.length ? '☑ ' + ckL.filter(c => c.d).length + '/' + ckL.length : '', x.repeat ? '🔁 ' + x.repeat : '', wt ? '⏳ wartet auf ' + w.who : '', co3.length ? '👥 +' + co3.join(', ') : '', nC ? '💬 ' + nC : ''].filter(Boolean); return { hasMeta: parts.length > 0, meta: parts.join(' · ') }; };
    const cardOf = x => { const ts = this.taskStatus(x), o = ownerOf(x), ci = colNames.indexOf(BOARD.colOf(x));
      return { title: x.title, sub: mvProj ? (x.ms ? NODE[x.ms].name : noMs) : x.proj, owner: nm(o), ini: ini(o), av: AV[o] || accent, chip: this.chip(ts, t, accent), dueLabel: this.dueLabel(x),
        edge: stc(ts), strike: ts === 'erledigt' ? 'line-through' : 'none', open: () => this.openTask(x.id, mvFrom), drag: this.dragStart(x.id), dragEnd: this.dragEnd(),
        left: () => ci > 0 && BOARD.to(x.id, colNames[ci - 1]), right: () => ci < colNames.length - 1 && BOARD.to(x.id, colNames[ci + 1]), leftOp: ci === 0 ? '0.3' : '1', rightOp: ci === colNames.length - 1 ? '0.3' : '1',
        leftLabel: x.title + ' nach ' + (colNames[ci - 1] || '–'), rightLabel: x.title + ' nach ' + (colNames[ci + 1] || '–'), ...cardMeta(x) }; };
    const mvLanes = laneList.map(ln => {
      const items = ctxTasks.filter(ln.test);
      return { title: ln.title, ini: ln.ini, av: ln.av, showTitle: laneMode !== 'keine', sub: items.filter(x => !this.isDone(x)).length + ' offen',
        cells: colNames.map(cn => { const key = mvCtx + '|' + ln.key + '|' + cn, hot = s.dragOver === key;
          return { bg: hot ? t.soft : t.surface2, bd: hot ? accent : t.border, bdStyle: hot ? 'dashed' : 'solid', over: this.dragOver(key),
            drop: this.dropOn(key, id => { const x = TASK[id]; if (laneMode === 'person' && ownerOf(x) !== ln.key) this.reassign(id, ln.key); if (BOARD.colOf(x) !== cn) BOARD.to(id, cn); }),
            cards: items.filter(x => BOARD.colOf(x) === cn).sort(byDue).map(cardOf),
            ...(() => { const qk = 'mv|' + mvCtx + '|' + ln.key + '|' + cn, ad = s.qa === qk; return { adding: ad, notAdding: !ad, add: () => this.setState({ qa: qk, qaText: '' }),
              save: qaSave(qk, { proj: qaProj(ln.key), bucket: mvPk === 'rl2' && mvProj ? RLB[cn] : cn, owner: laneMode === 'person' ? ln.key : 'Du', due: '2026-11-20' }) }; })() }; }) };
    });
    const mvCols = BOARD.cols.map(([cn, color, label]) => {
      const items = ctxTasks.filter(x => BOARD.colOf(x) === cn), h = items.reduce((a, x) => a + estOf(x), 0);
      let hint = '', hc = t.muted;
      if (cn === 'Fokus' && !mvProj) { hint = h.toLocaleString('de-DE') + ' h von ' + PLAN_DAY.toLocaleString('de-DE') + ' h heute'; if (h > PLAN_DAY) hc = RED; }
      else if (mvPk === 'rl2' && mvProj) hint = items.reduce((a, x) => a + (x.story ? STORIES[x.story].sp : 0), 0) + ' SP';
      else hint = h.toLocaleString('de-DE') + ' h Aufwand';
      const ed = bkEdit; return { name: label || cn, color, count: items.length, hint, hintColor: hc, editable: ed, fixed: !ed,
        rename: e => this.bkRename(mvPk, cn, e && e.target ? e.target.value : (label || cn)), left: () => this.bkMove(mvPk, cn, -1), right: () => this.bkMove(mvPk, cn, 1), del: () => this.bkDel(mvPk, cn, PNAME_OF[mvPk]) };
    });

    // Kalender mit Beteiligten
    const calSel = s.calP[mvCtx] || null;
    const calOwners = uniq(ctxTasks.map(ownerOf)).sort();
    const calPeople = [{ label: 'Alle', ini: '∗', av: t.strong, title: 'Alle Beteiligten', pressed: !calSel ? 'true' : 'false', ring: !calSel ? accent : t.border, bg: !calSel ? t.soft : t.surface, go: () => { const o = Object.assign({}, s.calP); o[mvCtx] = null; this.setState({ calP: o }); } }]
      .concat(calOwners.map(p => ({ label: nm(p), ini: ini(p), av: AV[p] || accent, title: ctxTasks.filter(x => ownerOf(x) === p).length + ' Aufgaben', pressed: calSel === p ? 'true' : 'false', ring: calSel === p ? accent : t.border, bg: calSel === p ? t.soft : t.surface,
        go: () => { const o = Object.assign({}, s.calP); o[mvCtx] = calSel === p ? null : p; this.setState({ calP: o }); } })));
    const C0 = D('2026-10-26');
    const mvCal = Array.from({ length: 42 }, (_, i) => {
      const d = new Date(C0.getFullYear(), C0.getMonth(), C0.getDate() + i), iso = isoD(d), isToday = +d === +TODAY, wk = d.getDay() === 0 || d.getDay() === 6;
      const items = ctxTasks.filter(x => x.due === iso && (!calSel || ownerOf(x) === calSel || this.coOf(x).includes(calSel))).map(x => { const c = this.chip(this.taskStatus(x), t, accent), o = ownerOf(x), co2 = this.coOf(x); return { label: x.title + (co2.length ? ' (+' + co2.length + ')' : ''), title: x.title + ' · ' + [o].concat(co2).map(nm).join(', ') + ' · ' + c.label, bg: c.bg, fg: c.fg, bd: c.bd, ini: ini(o), av: AV[o] || accent, open: () => this.openTask(x.id, mvFrom) }; })
        .concat(ctxMs.filter(n => n.end === iso && (!calSel || n.owner === calSel)).map(n => { const c = this.chip(this.nodeStatus(n), t, accent); return { label: '◆ ' + n.name, title: n.name + ' · ' + nm(n.owner) + ' · ' + c.label, bg: t.soft, fg: t.text, bd: c.bd, ini: ini(n.owner), av: AV[n.owner] || accent, open: () => this.openNode(n.id, mvFrom) }; }));
      const qk = 'cal|' + mvCtx + '|' + iso, ad = s.qa === qk;
      return { label: fmt(d), adding: ad, add: () => this.setState({ qa: qk, qaText: '' }), save: qaSave(qk, { proj: qaProj(null), due: iso, owner: calSel || 'Du' }), num: d.getDate() === 1 ? d.getDate() + '. ' + ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][d.getMonth()] : String(d.getDate()), items,
        bg: isToday ? t.soft : (wk ? t.surface2 : t.surface), bd: isToday ? '2px solid ' + accent : '1px solid ' + t.border, fw: isToday ? 800 : 600, numColor: isToday ? accentText : (d.getMonth() === 10 ? t.text : t.muted) };
    });

    // Personen (Auslastung je Woche, Aufgaben per Ziehen neu zuweisen)
    const WEEKS = [['KW 46', '2026-11-09'], ['KW 47', '2026-11-16'], ['KW 48', '2026-11-23'], ['KW 49', '2026-11-30'], ['KW 50', '2026-12-07'], ['KW 51', '2026-12-14']];
    const weekOf = x => { const d = D(x.due); if (d < D(WEEKS[1][1])) return 0; for (let j = WEEKS.length - 1; j >= 0; j--) if (d >= D(WEEKS[j][1])) return d < new Date(D(WEEKS[j][1]).getTime() + 7 * DAY) ? j : -1; return -1; };
    const shareOf = p => ((PSHARE[mvPk] || {})[p] || 0.5);
    const people = uniq(ctxTasks.map(ownerOf).concat(ctxTasks.reduce((a, x) => a.concat(this.coOf(x)), []))).sort((a, b) => (a === 'Du' ? -1 : (b === 'Du' ? 1 : a.localeCompare(b))));
    const peRows = people.map(p => {
      const partOf = x => estOf(x) / (1 + this.coOf(x).length);
      const open = ctxTasks.filter(x => (ownerOf(x) === p || this.coOf(x).includes(p)) && !this.isDone(x)).sort(byDue), cap = shareOf(p) * PLAN_H, key = mvCtx + '|pe|' + p, hot = s.dragOver === key;
      const cells = WEEKS.map(([kw], j) => { const h = Math.round(open.filter(x => weekOf(x) === j).reduce((a, x) => a + partOf(x), 0) * 10) / 10, r = cap ? h / cap : 0;
        return { label: h ? h.toLocaleString('de-DE') + ' h' : '–', bg: !h ? t.surface2 : (r > 1 ? RED : (r > 0.8 ? '#A33F06' : accent)), fg: h ? '#FFFFFF' : t.muted, title: nm(p) + ' ' + kw + ': ' + h.toLocaleString('de-DE') + ' h von ' + cap.toLocaleString('de-DE') + ' h Anteil' }; });
      const skill = mvPk === 'ih' ? (IH_SKILL[p] ? ' · ' + IH_SKILL[p] : '') : '';
      const qkP = 'pe|' + mvCtx + '|' + p, adP = s.qa === qkP;
      return { adding: adP, notAdding: !adP, add: () => this.setState({ qa: qkP, qaText: '' }), save: qaSave(qkP, { proj: qaProj(null), owner: p, due: s.qaDue || '2026-11-27' }), name: nm(p), ini: ini(p), av: AV[p] || accent, sub: (mvProj ? 'Anteil ' + Math.round(shareOf(p) * 100) + ' % = ' + cap.toLocaleString('de-DE') + ' h/Woche' : '') + skill,
        cells, total: (Math.round(open.reduce((a, x) => a + partOf(x), 0) * 10) / 10).toLocaleString('de-DE') + ' h', bg: hot ? t.soft : 'transparent', bd: hot ? accent : t.border, bdStyle: hot ? 'dashed' : 'solid',
        over: this.dragOver(key), drop: this.dropOn(key, id => { if (ownerOf(TASK[id]) !== p) this.reassign(id, p); }),
        tasks: open.map(x => { const c = this.chip(this.taskStatus(x), t, accent); return { label: (ownerOf(x) === p ? '' : '👥 ') + x.title + ' · ' + (Math.round(partOf(x) * 10) / 10).toLocaleString('de-DE') + ' h', title: x.title + ' · fällig ' + fmt(D(x.due)), bg: c.bg === t.surface ? t.surface2 : c.bg, fg: c.fg, bd: c.bd, open: () => this.openTask(x.id, mvFrom), drag: this.dragStart(x.id), dragEnd: this.dragEnd() }; }) };
    });
    const pe = { title: mvCtx === 'ihp' ? 'Einsatzplanung nach Person und Woche' : 'Wer hat was, Woche für Woche', weeks: WEEKS.map(w => w[0]), rows: peRows,
      sub: mvCtx === 'ihp' ? 'Stunden aus offenen Aufträgen gegen den Anteil der Person, mit Qualifikationen. Überfällige zählen in die laufende Woche.' : 'Stunden aus offenen Aufgaben dieses Projekts gegen den Projektanteil der Person (Anteil × 28 h planbar). Überfällige zählen in die laufende Woche.',
      dragHint: 'Aufgabe auf eine andere Person ziehen, um sie neu zuzuweisen (im Projekt ohne Freigabe).' };

    // PSP
    let psp;
    const leafOf = x => ({ label: (this.isDone(x) ? '✓ ' : '· ') + x.title, color: stc(this.taskStatus(x)) === t.strong ? t.muted : stc(this.taskStatus(x)) });
    if (mvProj) {
      const cols = PTREE.map((ph, i) => { const st = this.nodeStatus(ph);
        const items = ph.children ? ph.children.map((c, j) => ({ code: '1.' + (i + 1) + '.' + (j + 1), name: c.name, sub: nm(c.owner) + ' · ' + fmt(D(c.end)), color: stc(this.nodeStatus(c)), open: () => this.openNode(c.id, mvFrom), leaves: (c.tasks || []).map(id => leafOf(TASK[id])) }))
          : (ph.tasks || []).map((id, j) => ({ code: '1.' + (i + 1) + '.' + (j + 1), name: TASK[id].title, sub: 'Aufgabe · ' + fmt(D(TASK[id].due)), color: stc(this.taskStatus(TASK[id])), open: () => this.openTask(id, mvFrom), leaves: [] }));
        return { code: '1.' + (i + 1), name: ph.name, state: this.chip(st, t, accent).label, color: stc(st) === t.strong ? accent : stc(st), open: () => this.openNode(ph.id, mvFrom), items }; });
      psp = { root: PNAME, rootCode: '1', rootColor: PCOLOR, cols };
    } else {
      const projs = uniq(ctxTasks.map(x => x.proj));
      const cols = projs.map((pn, i) => {
        const tks = ctxTasks.filter(x => x.proj === pn), msIds = uniq(tks.map(x => x.ms || '-'));
        const items = msIds.map((k, j) => ({ code: (i + 1) + '.' + (j + 1), name: k === '-' ? 'ohne Meilenstein' : NODE[k].name, sub: k === '-' ? 'Einzelaufgaben' : 'Meilenstein · ' + fmt(D(NODE[k].end)), color: k === '-' ? t.strong : stc(this.nodeStatus(NODE[k])),
          open: () => (k === '-' ? null : this.openNode(k, mvFrom)), leaves: tks.filter(x => (x.ms || '-') === k).map(leafOf) }));
        const over = tks.some(x => this.taskStatus(x) === 'ueberfaellig');
        return { code: String(i + 1), name: pn, state: tks.length + ' Aufgaben' + (over ? ' · überfällig' : ''), color: over ? RED : (PROJCOL[pn] || accent), open: () => { const k2 = { 'SM42 Schraubstation': 'sm42', 'Retrofit Linie 2': 'rl2', 'Instandhaltung Halle 2': 'ih' }[pn]; if (k2) this.openProject(k2); }, items };
      });
      psp = { root: 'Meine Arbeit', rootCode: 'alle Projekte', rootColor: '#5B2D90', cols };
    }
    psp.n = psp.cols.length; psp.minW = (psp.cols.length * 210) + 'px'; psp.lineInset = pct(50 / psp.cols.length);

    // Meilensteine
    const M0 = mvProj ? PR0 : D('2026-10-01'), M1 = mvProj ? PR1 : D('2027-02-01'), MSPAN = dd(M0, M1);
    const mp = d => pct(Math.max(0, Math.min(100, dd(M0, d) / MSPAN * 100)));
    const MON = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const msSorted = ctxMs.slice().sort((a, b) => D(a.end) - D(b.end));
    const msLine = msSorted.map((n, i) => { const c = this.chip(this.nodeStatus(n), t, accent); return { rot: n.type === 'gate' && !n.msPoint ? 'none' : 'rotate(45deg)', left: mp(D(n.end)), top: (i % 2 ? 22 : 6) + 'px', bg: stBg(this.nodeStatus(n)), bd: c.bd === t.strong ? t.text : c.bd, title: n.name + ' · ' + fmt(D(n.end)) + ' · ' + c.label, open: () => this.openNode(n.id, mvFrom) }; });
    const msMonths = []; for (let d = new Date(M0); d < M1; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) msMonths.push({ label: MON[d.getMonth()] + (d.getMonth() === 0 ? ' ' + d.getFullYear() : ''), left: mp(d) });
    const msRows = msSorted.map(n => {
      const st = this.nodeStatus(n), tk = (n.tasks || []).map(id => TASK[id]), open = tk.filter(x => !this.isDone(x)).length, tot = tk.length;
      const pr = st === 'erledigt' ? 100 : (tot ? Math.round((tot - open) / tot * 100) : 0);
      return { name: n.name, col2: mvProj ? phaseOf(n) : (n.pd ? 'Prüfstand Drehmoment' : 'SM42 Schraubstation'), date: fmt(D(n.end)), chip: this.chip(st, t, accent), bg: stBg(st), bd: stc(st) === t.strong ? t.text : stc(st),
        prog: pr + '%', progColor: st === 'ueberfaellig' ? RED : (st === 'erledigt' ? GREEN : accent), openTasks: tot ? open + ' von ' + tot : '–', openColor: open && st === 'ueberfaellig' ? RED : t.text, open: () => this.openNode(n.id, mvFrom) };
    });

    // Gantt
    let gantt;
    if (mvProj) {
      const gp = d => pct(Math.max(0, Math.min(100, dd(PR0, D(d)) / PRS * 100)));
      const rows = [];
      const pushNode = (n, indent, fw, rowBg) => { const st = this.nodeStatus(n), dnd = { drag: this.ganttStart(n.id, 'move'), over: this.ganttOver(), drop: this.ganttDrop(PRS), draggable: 'true' };
        if (n.type === 'gate') rows.push({ label: (n.msPoint ? '◆ ' : '▣ ') + n.name, rot: n.msPoint ? 'rotate(45deg)' : 'none', rad: n.msPoint ? '2px' : '4px', indent, fw, isBar: false, isMs: true, left: gp(n.end), bg: stBg(st), bd: stc(st) === t.strong ? t.text : stc(st), title: n.name + ' · ' + fmt(D(n.end)), rowBg, open: () => this.openNode(n.id, mvFrom), width: '0', top: '0', h: '0', ...dnd });
        else rows.push({ label: n.name, indent, fw, isBar: true, isMs: false, left: gp(n.start), width: pct(Math.max(0.8, (dd(D(n.start), D(n.end)) + 1) / PRS * 100)), top: n.type === 'phase' ? '13px' : '10px', h: n.type === 'phase' ? '10px' : '16px',
          bg: n.type === 'phase' ? t.strong : (st === 'erledigt' ? GREEN : (st === 'ueberfaellig' ? RED : t.soft)), bd: n.type === 'phase' ? t.strong : (st === 'plan' ? accent : stc(st)), title: n.name + ' · ' + fmt(D(n.start)) + ' – ' + fmt(D(n.end)) + ' · ' + this.chip(st, t, accent).label, rowBg, open: () => this.openNode(n.id, mvFrom), ...dnd, canResize: n.type === 'ms' || (n.type === 'phase' && !(n.children && n.children.length)), dragS: this.ganttStart(n.id, 'start'), dragE: this.ganttStart(n.id, 'end') }); };
      PTREE.forEach(ph => { pushNode(ph, '8px', 700, ph.type === 'phase' ? t.surface2 : 'transparent'); (ph.children || []).forEach(c => pushNode(c, '24px', 500, 'transparent')); });
      const ticks = []; for (let d = new Date(PR0.getFullYear(), PR0.getMonth(), 1); d < PR1; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) if (d >= PR0) ticks.push({ label: MON[d.getMonth()] + (d.getMonth() === 0 || ticks.length === 0 ? ' ' + d.getFullYear() : ''), left: gp(isoD(d)) });
      const GH = { pd: 'Ebenen des V-Modells als Zeitplan. Das V zeigt, was zusammengehört, der Gantt zeigt, wann es passiert und wo sich Ebenen überlappen.', rl2: 'Sprints und Release als Zeitplan. Der Sprint-Inhalt wird im Scrum-Zyklus geplant, nicht hier.', ih: 'Wartungsfenster und Prüftermine als Zeitplan. Störungen kommen ungeplant und laufen über das Kanban.' };
      gantt = { rows, ticks, today: gp('2026-11-13'), hasFull: false, full: () => {}, hint: GH[mvPk] || '' };
    } else {
      const G0 = D('2026-11-02'), GSPAN = 42;
      const gq = d => pct(Math.max(0, Math.min(100, dd(G0, d) / GSPAN * 100)));
      const rows = [], projs = uniq(ctxTasks.map(x => x.proj));
      projs.forEach(pn => {
        rows.push({ label: pn, indent: '8px', fw: 700, isBar: false, isMs: false, left: '0', width: '0', top: '0', h: '0', bg: 'transparent', bd: 'transparent', title: pn, rowBg: t.surface2, open: () => {} });
        ctxTasks.filter(x => x.proj === pn).sort(byDue).forEach(x => {
          const days = Math.max(1, Math.ceil(estOf(x) / PLAN_DAY)), due = D(x.due), st0 = new Date(due.getFullYear(), due.getMonth(), due.getDate() - days + 1), ts = this.taskStatus(x);
          rows.push({ label: (this.bucketOf(x) === 'Fokus' ? '★ ' : '') + x.title, indent: '24px', fw: 500, isBar: true, isMs: false, left: gq(st0), width: pct(Math.max(1.4, days / GSPAN * 100)), top: '10px', h: '16px',
            bg: ts === 'erledigt' ? GREEN : (ts === 'ueberfaellig' ? RED : t.soft), bd: ts === 'plan' || ts === 'heute' ? accent : stc(ts), title: x.title + ' · ' + estOf(x) + ' h · fällig ' + fmt(due), rowBg: 'transparent', open: () => this.openTask(x.id, mvFrom) });
        });
        ctxMs.filter(n => ctxTasks.some(x => x.proj === pn && x.ms === n.id)).forEach(n => { const ns = this.nodeStatus(n);
          rows.push({ label: (n.msPoint ? '◆ ' : '▣ ') + n.name, rot: n.msPoint ? 'rotate(45deg)' : 'none', rad: n.msPoint ? '2px' : '4px', indent: '24px', fw: 500, isBar: false, isMs: true, left: gq(D(n.end)), width: '0', top: '0', h: '0', bg: stBg(ns), bd: stc(ns) === t.strong ? t.text : stc(ns), title: n.name + ' · ' + fmt(D(n.end)), rowBg: 'transparent', open: () => this.openNode(n.id, mvFrom) }); });
      });
      const ticks = Array.from({ length: 6 }, (_, i) => ({ label: 'KW ' + (45 + i), left: pct(i * 7 / GSPAN * 100) }));
      gantt = { rows, ticks, today: gq(TODAY), hasFull: false, full: () => {}, hint: 'Deine Aufgaben als Balken: Dauer aus dem Aufwand und 5,6 h planbarer Zeit pro Tag, Ende am Fälligkeitstag. ★ = im Fokus.' };
    }

    gantt.rows.forEach(r => { if (r.canResize === undefined) { r.canResize = false; r.dragS = () => {}; r.dragE = () => {}; } if (!r.drag) { r.drag = () => {}; r.over = () => {}; r.drop = () => {}; r.draggable = 'false'; } });
    if (mvProj) gantt.hint = (gantt.hint ? gantt.hint + ' ' : '') + 'Balken ziehen verschiebt.';

    // Verfolgbarkeit
    const reqOfTask = id => REQS_SM.filter(r => r.tasks.includes(id));
    const tchip = x => { const c = this.chip(this.taskStatus(x), t, accent); return { label: x.title, bg: c.bg, fg: c.fg, bd: c.bd, open: () => this.openTask(x.id, mvFrom) }; };
    const msCell = id => { if (!id) return { label: '–', bg: 'transparent', bd: t.strong, open: () => {} }; const n = NODE[id], st = this.nodeStatus(n); return { label: n.name, bg: stBg(st), bd: stc(st) === t.strong ? t.text : stc(st), open: () => this.openNode(id, mvFrom) }; };
    const stOK = { label: '✓ vollständig', bg: GREEN, fg: '#FFFFFF', bd: GREEN }, stGap = { label: '! Nachweis fehlt', bg: RED, fg: '#FFFFFF', bd: RED }, stNone = { label: '! ohne Bezug', bg: '#A33F06', fg: '#FFFFFF', bd: '#A33F06' };
    let trc = { title: '', sub: '', head: [], rows: [], kpis: [], hasOrphans: false, orphanTitle: '', orphans: [] };
    if (mvProj && mvPk === 'pd') {
      const spec = VN.filter(v => v.side !== 'R');
      const rows = spec.map(v => { const pr = VNODE[v.pair], cov = pr.cov || 0;
        return { a: { code: v.side === 'B' ? 'Umsetzung' : 'Spezifikation', label: v.name, open: () => this.openNode(v.id, mvFrom) }, b: msCell(pr.id),
          c: (NODE[v.id].tasks || []).map(id => tchip(TASK[id])), d: (NODE[pr.id].tasks || []).map(id => TASK[id].title).join(' · ') || 'noch keine Testfälle', dColor: (NODE[pr.id].tasks || []).length ? t.text : RED,
          st: cov >= 100 ? stOK : (cov > 0 ? { label: cov + ' % abgedeckt', bg: '#A33F06', fg: '#FFFFFF', bd: '#A33F06' } : Object.assign({}, stGap, { label: '! 0 % abgedeckt' })) }; });
      const covs = VN.filter(v => v.side === 'R').map(v => v.cov || 0);
      trc = { title: 'Spezifikation ↔ Testebene', sub: 'Jede Ebene des linken Asts ist mit ihrer Testebene rechts gepaart. Abdeckung = Anteil der Anforderungen dieser Ebene mit bestandenem Testfall.',
        head: ['Spezifikationsebene', 'Testebene', 'Arbeitspakete', 'Testfälle', 'Abdeckung'], rows,
        kpis: [{ label: 'Ebenen', value: spec.length, color: t.text }, { label: 'Testabdeckung Ø', value: Math.round(covs.reduce((x, y) => x + y, 0) / covs.length) + ' %', color: '#A33F06' }, { label: 'ohne bestandenen Test', value: covs.filter(c => c === 0).length, color: RED }],
        hasOrphans: false, orphanTitle: '', orphans: [] };
    } else if (mvProj && mvPk === 'rl2') {
      const openS = sid => () => this.setState({ panel: { kind: 'story', id: sid, from: 'planung' } });
      const rows = Object.keys(STORIES).map(sid => { const st2 = STORIES[sid], a = s.acs[sid] || [], ok = a.filter(Boolean).length, x = TASK['rt' + sid];
        return { a: { code: st2.key + ' · Epic ' + st2.epic, label: st2.title, open: openS(sid) }, b: x.ms ? msCell(x.ms) : { label: 'Product Backlog', bg: 'transparent', bd: t.strong, open: () => {} },
          c: a.map((v, i) => ({ label: 'AK ' + (i + 1) + (v ? ' ✓' : ''), bg: v ? GREEN : t.surface, fg: v ? '#FFFFFF' : t.text, bd: v ? GREEN : t.strong, open: openS(sid) })),
          d: st2.sprint === 4 ? 'Sprint-4-Review heute' : 'noch nicht im Sprint', dColor: t.text,
          st: !a.length ? Object.assign({}, stGap, { label: '! keine Kriterien' }) : (ok === a.length ? (s.sst[sid] === 'Done' ? Object.assign({}, stOK, { label: '✓ Done' }) : Object.assign({}, stOK, { label: '✓ Kriterien erfüllt' })) : { label: ok + ' von ' + a.length + ' erfüllt', bg: t.surface2, fg: t.text, bd: t.strong }) }; });
      const noAc = Object.keys(STORIES).filter(sid => !(s.acs[sid] || []).length).length;
      trc = { title: 'User Story → Sprint → Akzeptanzkriterien → Abnahme', sub: 'Jede Story mit ihren Akzeptanzkriterien. Ohne Kriterien ist die Definition of Ready nicht erfüllt.',
        head: ['User Story', 'Sprint', 'Akzeptanzkriterien', 'Nachweis', 'Stand'], rows,
        kpis: [{ label: 'Stories', value: rows.length, color: t.text }, { label: 'Done', value: Object.values(s.sst).filter(v => v === 'Done').length, color: GREEN }, { label: 'ohne Kriterien', value: noAc, color: RED }],
        hasOrphans: false, orphanTitle: '', orphans: [] };
    } else if (mvProj) {
      const rows = REQS_SM.map(r => ({ a: { code: r.id, label: r.text, open: () => this.setState({ panel: null }) }, b: msCell(r.ms), c: r.tasks.map(id => tchip(TASK[id])), d: r.test || 'kein Prüfschritt definiert', dColor: r.test ? t.text : RED, st: r.test && r.tasks.length ? stOK : stGap }));
      const orph = ctxTasks.filter(x => reqOfTask(x.id).length === 0);
      trc = { title: 'Anforderung → Meilenstein → Aufgabe → Nachweis', sub: 'Jede Anforderung aus dem Lastenheft ist mit Arbeitspaket, Aufgaben und dem Prüfschritt der FAT verknüpft. Lücken sind rot.',
        head: ['Anforderung', 'Meilenstein', 'Aufgaben', 'Nachweis (FAT, Validierung)', 'Abdeckung'], rows,
        kpis: [{ label: 'Anforderungen', value: REQS_SM.length, color: t.text }, { label: 'mit Nachweis', value: REQS_SM.filter(r => r.test).length + ' von ' + REQS_SM.length, color: GREEN }, { label: 'Lücken', value: REQS_SM.filter(r => !r.test).length, color: RED }],
        hasOrphans: orph.length > 0, orphanTitle: 'Aufgaben ohne Bezug zu einer Anforderung (' + orph.length + ')', orphans: orph.map(x => ({ label: x.title, open: () => this.openTask(x.id, mvFrom) })) };
    } else {
      const rows = ctxTasks.map(x => { const rq = reqOfTask(x.id);
        return { a: { code: x.proj, label: x.title, open: () => this.openTask(x.id, mvFrom) }, b: msCell(x.ms),
          c: rq.map(r => ({ label: r.id + ' ' + r.text, bg: t.surface2, fg: t.text, bd: t.strong, open: () => { const o = Object.assign({}, s.mview); o.sm42p = 'trace'; this.setState({ mview: o, screen: 'projekt', proj: 'sm42', ptab: 'planung', panel: null }); } })),
          d: rq.length ? rq.map(r => r.test).filter(Boolean).join(', ') || 'kein Prüfschritt' : (x.ms ? 'über Meilenstein ' + NODE[x.ms].name : '–'), dColor: t.text,
          st: rq.length ? (rq.every(r => r.test) ? stOK : stGap) : (x.ms ? { label: 'Meilenstein', bg: t.surface2, fg: t.text, bd: t.strong } : stNone) }; });
      trc = { title: 'Meine Aufgabe → Meilenstein → Anforderung → Nachweis', sub: 'Wozu jede Aufgabe gehört.', head: ['Meine Aufgabe', 'Meilenstein', 'Anforderung', 'Nachweis', 'Bezug'], rows,
        kpis: [{ label: 'Meine Aufgaben', value: ctxTasks.length, color: t.text }], hasOrphans: false, orphanTitle: '', orphans: [] };
    }
    const mvMsg = s.boardMsg || (mvProj && mvPk === 'ih' ? s.kbMsg : '') || s.mvMsg;
    const HINT = { arbeit: filterHint, sm42: 'Arbeiten an den Aufgaben. Gantt, PSP, Meilensteine und Verfolgbarkeit stehen unter Planung.', pd: 'Arbeitspakete aller Ebenen. V-Modell, Gantt, PSP, Meilensteine und Verfolgbarkeit stehen unter Planung.',
      rl2: 'Alle Stories des Release. Sprint-Planung, Review und Kennzahlen stehen unter Planung › Scrum-Zyklus.', ih: 'Aufträge und Störungen. Wartungsplan und Einsatzplanung stehen unter Planung.',
      sm42p: 'Termine, Struktur und Nachweise. Die Arbeit an den Aufgaben steht unter Aufgaben.', pdp: 'Termine, Struktur und Nachweise. Die Arbeit an den Aufgaben steht unter Aufgaben.', rl2p: 'Scrum-Ablauf, Zeitplan der Sprints und Akzeptanzkriterien.', ihp: 'Wartungsplan, Prüftermine und Einsatz der Personen.' };
    const qaWhoList = mvProj ? uniq(['Du'].concat((PMEMBERS[mvPk] || []).map(m => m[0]).filter(m => m !== 'Kunde'))) : ['Du'];
    const qaW = qaWhoList.includes(s.qaWho) ? s.qaWho : 'Du';
    const mvQa = { qaText: s.qaText || '', setQa: e => this.setState({ qaText: e && e.target ? e.target.value : '' }), qaCancel: () => this.setState({ qa: null, qaText: '' }),
      qaDue: s.qaDue || '2026-11-20', setQaDue: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) this.setState({ qaDue: v }); },
      qaWho: qaWhoList.slice(0, 8).map(n2 => ({ name: nm(n2), ini: ini(n2), av: AV[n2] || accent, pressed: qaW === n2 ? 'true' : 'false', ring: qaW === n2 ? t.text : 'transparent', go: () => this.setState({ qaWho: n2 }) })),
      listAdd: () => { const tt = (this.state.qaText || '').trim(); if (!tt) return this.setState({ boardMsg: 'Erst einen Titel eingeben.' }); this.quickTask({ title: tt, proj: qaProj(null), owner: qaW, due: s.qaDue || '2026-11-20' }); this.setState({ boardMsg: '„' + tt + '“ angelegt' + (qaW !== 'Du' ? ' für ' + qaW : '') + ', fällig ' + fmt(D(s.qaDue || '2026-11-20')) }); },
      canAddCol: bkEdit, addCol: () => this.bkAdd(mvPk) };
    const mvf_fOpen = (s.mvfOpen || {})[mvCtx] || null, mvf_setFOpen = k => this.setState({ mvfOpen: Object.assign({}, s.mvfOpen, { [mvCtx]: mvf_fOpen === k ? null : k }) });
    const mvf_fPk = mvProj ? mvPk : 'arbeit', mvf_fPeople = uniq(ctxAll.map(ownerOf).concat(ctxAll.reduce((a, x) => a.concat(this.coOf(x)), []))).sort((a, b) => (a === 'Du' ? -1 : (b === 'Du' ? 1 : a.localeCompare(b))));
    const mvf_fGroup = (k, label, curLabel, opts) => { const on = !!mvf_mf[k], op = mvf_fOpen === k; return { label: on ? label + ': ' + curLabel : label, bd: on ? accent : t.border, bg: on ? t.soft : t.surface, fw: on ? '700' : '500', open: op, openA: op ? 'true' : 'false', toggle: () => mvf_setFOpen(k),
      opts: [{ label: 'Alle', dot: 'transparent', dotDisp: 'none', pressed: !on ? 'true' : 'false', ring: !on ? accent : t.border, bg: t.surface, go: () => { mvf_setMf({ [k]: null }); mvf_setFOpen(k); } }].concat(opts.map(([v, l, dot]) => ({ label: l, dot: dot || 'transparent', dotDisp: dot ? 'inline-block' : 'none', pressed: mvf_mf[k] === v ? 'true' : 'false', ring: mvf_mf[k] === v ? accent : t.border, bg: t.surface, go: () => { mvf_setMf({ [k]: v }); this.setState({ mvfOpen: Object.assign({}, this.state.mvfOpen, { [mvCtx]: null }) }); } }))) }; };
    const mvF = { fq: mvf_mf.q, setFq: e => mvf_setMf({ q: e && e.target ? e.target.value : '' }),
      fgroups: [mvf_fGroup('who', 'Person', mvf_mf.who ? nm(mvf_mf.who) : '', mvf_fPeople.map(p => [p, p === 'Du' ? 'Mir zugewiesen' : nm(p), AV[p] || null])),
        mvf_fGroup('prio', 'Priorität', mvf_mf.prio || '', Object.keys(PRIO).map(pr => [pr, pr, PRIO[pr]])),
        mvf_fGroup('due', 'Fällig', mvf_mf.due ? mvf_DUEF[mvf_mf.due][0] : '', Object.keys(mvf_DUEF).map(k => [k, mvf_DUEF[k][0], k === 'ueber' ? RED : null])),
        mvf_fGroup('lbl', 'Etikett', mvf_mf.lbl ? this.lblName(mvf_fPk, mvf_mf.lbl) : '', this.labelsOf(mvf_fPk).map(([k, l, c]) => [k, this.lblName(mvf_fPk, k), c]))],
      fHas: !!(mvf_mf.who || mvf_mf.prio || mvf_mf.due || mvf_mf.lbl || mvf_mf.q), fClear: () => this.setState({ mvf: Object.assign({}, s.mvf, { [mvCtx]: Object.assign({}, mvf_MF0) }), mvfOpen: Object.assign({}, s.mvfOpen, { [mvCtx]: null }) }),
      fCount: ctxTasks.length + ' von ' + ctxAll.length + ' Aufgaben' };
    // Gruppieren nach und gespeicherte Ansichten
    const GBDEF = mvProj ? (mvPk === 'rl2' ? 'sprint' : 'ms') : 'status', gb = (s.mvg || {})[mvCtx] || GBDEF;
    const GBOPT = [[GBDEF, mvProj ? (mvPk === 'rl2' ? 'Sprint' : 'Meilenstein') : 'Status'], ['bucket', 'Bucket'], ['person', 'Person'], ['due', 'Fälligkeit'], ['prio', 'Priorität'], ['lbl', 'Etikett']];
    if (gb !== GBDEF) { const xs = ctxTasks.slice().sort(byDue); let defs = [];
      if (gb === 'bucket') defs = (mvProj ? this.bucketsOf(mvPk) : DEF_BUCKETS).map(b => [b.name, b.color, x => this.bucketOf(x) === b.key]);
      if (gb === 'person') defs = uniq(xs.map(ownerOf)).sort((a, b) => (a === 'Du' ? -1 : (b === 'Du' ? 1 : a.localeCompare(b)))).map(p => [nm(p), AV[p] || accent, x => ownerOf(x) === p]);
      if (gb === 'due') defs = [['Überfällig', RED, x => this.taskStatus(x) === 'ueberfaellig'], ['Heute', accentText, x => !this.isDone(x) && x.due === '2026-11-13'], ['Diese Woche', t.text, x => !this.isDone(x) && x.due > '2026-11-13' && x.due <= '2026-11-15'], ['Nächste Woche', t.text, x => !this.isDone(x) && x.due >= '2026-11-16' && x.due <= '2026-11-22'], ['Später', t.muted, x => !this.isDone(x) && x.due > '2026-11-22'], ['Erledigt', GREEN, x => this.isDone(x)]];
      if (gb === 'prio') defs = Object.keys(PRIO).map(pr => [pr, PRIO[pr], x => x.prio === pr]);
      if (gb === 'lbl') defs = this.labelsOf(mvf_fPk).map(([k, l, c]) => [this.lblName(mvf_fPk, k), c, x => mvf_lblsOf(x).includes(k)]).concat([['Ohne Etikett', t.muted, x => !mvf_lblsOf(x).length]]);
      mvGroups = defs.map(([title, color, test]) => { const rows = xs.filter(test).map(mvRow); return { title, color, count: rows.length, rows }; }).filter(g => g.count > 0); }
    const SV0 = { sm42: [{ name: 'Meine überfälligen', f: { who: 'Du', due: 'ueber' }, g: null }, { name: 'Nächste Woche nach Person', f: { due: 'naechste' }, g: 'person' }], arbeit: [{ name: 'Überfällig', f: { due: 'ueber' }, g: null }, { name: 'Nach Priorität', f: {}, g: 'prio' }] };
    const svList = (s.svBy || {})[mvCtx] || SV0[mvCtx] || [], setSv = list => this.setState({ svBy: Object.assign({}, s.svBy, { [mvCtx]: list }) });
    const curSig = JSON.stringify([mvf_mf.who, mvf_mf.prio, mvf_mf.due, mvf_mf.lbl, gb === GBDEF ? null : gb]), sigOf = v => JSON.stringify([v.f.who || null, v.f.prio || null, v.f.due || null, v.f.lbl || null, v.g || null]);
    const autoName = () => [mvf_mf.who ? (mvf_mf.who === 'Du' ? 'Meine' : nm(mvf_mf.who)) : '', mvf_mf.due ? mvf_DUEF[mvf_mf.due][0] : '', mvf_mf.prio || '', mvf_mf.lbl ? this.lblName(mvf_fPk, mvf_mf.lbl) : '', gb !== GBDEF ? 'nach ' + (GBOPT.find(o => o[0] === gb) || ['', ''])[1] : ''].filter(Boolean).join(' · ') || 'Alle Aufgaben';
    const mvG = { groupBy: GBOPT.map(([k, l]) => ({ label: l, pressed: gb === k ? 'true' : 'false', ring: gb === k ? accent : t.border, bg: gb === k ? t.soft : t.surface, go: () => this.setState({ mvg: Object.assign({}, s.mvg, { [mvCtx]: k }) }) })),
      saved: svList.map((v, i) => { const on = sigOf(v) === curSig; return { label: v.name, title: 'Filter und Gruppierung dieser Ansicht anwenden', pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface,
        go: () => this.setState({ mvf: Object.assign({}, s.mvf, { [mvCtx]: Object.assign({ who: null, prio: null, due: null, lbl: null, q: '' }, v.f) }), mvg: Object.assign({}, s.mvg, { [mvCtx]: v.g || GBDEF }), boardMsg: '' }),
        del: () => { setSv(svList.filter((z, k) => k !== i)); this.setState({ boardMsg: 'Ansicht „' + v.name + '“ gelöscht.' }); } }; }),
      canSave: (mvf_mf.who || mvf_mf.prio || mvf_mf.due || mvf_mf.lbl || gb !== GBDEF) && !svList.some(v => sigOf(v) === curSig),
      saveView: () => { const name = autoName(); setSv(svList.concat([{ name, f: { who: mvf_mf.who, prio: mvf_mf.prio, due: mvf_mf.due, lbl: mvf_mf.lbl }, g: gb === GBDEF ? null : gb }])); this.setState({ boardMsg: 'Ansicht „' + name + '“ gespeichert. Ein Klick darauf stellt Filter und Gruppierung wieder her.' }); } };
    const mv = { ...mvQa, ...mvF, ...mvG,
      tabs: mvTabsK.map(k => ({ label: MV_ALL[k][0], icon: MV_ALL[k][1], sel: mvView === k ? 'true' : 'false', bg: mvView === k ? t.surface : 'transparent', fg: mvView === k ? t.text : t.muted, sh: mvView === k ? '0 1px 2px rgba(0,0,0,0.12)' : 'none', go: mvSet(k) })),
      is: { liste: mvView === 'liste', board: mvView === 'board', kalender: mvView === 'kalender', personen: mvView === 'personen', psp: mvView === 'psp', ms: mvView === 'ms',
        gantt: mvView === 'gantt' && mvCtx !== 'sm42p', fullGantt: mvView === 'gantt' && mvCtx === 'sm42p', vmodel: mvView === 'vmodel', scrum: mvView === 'scrum', kanban: mvView === 'kanban', trace: mvView === 'trace' },
      hint: HINT[mvCtx] || '', hasMsg: !!mvMsg, msg: mvMsg || '',
      col2: mvProj ? (mvPk === 'rl2' ? 'Sprint' : 'Meilenstein') : 'Projekt', groups: mvGroups, listEmpty: mvGroups.length === 0,
      cols: mvCols, lanes: mvLanes, laneBtns: laneBtnsMv, laneHint: laneMode === 'person' ? 'Auf eine andere Person ziehen weist die Aufgabe neu zu.' : '',
      boardGrid: 'repeat(' + mvCols.length + ', minmax(230px, 1fr))', boardMinW: (mvCols.length * 245) + 'px',
      cal: mvCal, calPeople, pe, psp,
      msLine, msMonths, msRows, msToday: mp(TODAY), msCol2: mvProj ? 'Phase' : 'Projekt', gantt, tr: trc
    };
    pt.kanban = mvProj && mvPk === 'ih' && s.ptab === 'aufgaben' && mvView === 'kanban';

    // Profil und Einstellungen
    const PF = s.prof, setPf = patch => this.setState({ prof: Object.assign({}, this.state.prof, patch) });
    const pk4 = (on, label, go) => ({ label, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go });
    const tg = (on, label, go) => ({ label, checked: on ? 'true' : 'false', track: on ? GREEN : t.strong, justify: on ? 'flex-end' : 'flex-start', go });
    const SKILL_SUG = ['EPLAN', 'Python', 'Hydraulik', 'Siemens S7-1500', 'Risikobeurteilung (CE)', 'Englisch verhandlungssicher'].filter(k => !(k in PF.levels));
    const prf = {
      hasMsg: !!s.profMsg, msg: s.profMsg || '',
      ini: 'DU', pic: PF.pic, photo: PF.photo, noPhoto: !PF.photo,
      setPhoto: () => { setPf({ photo: true }); this.setState({ profMsg: 'Profilbild hochgeladen. Es erscheint überall, wo bisher dein Kürzel stand.' }); },
      pics: ['#5B2D90', '#0F6CBD', '#0E7A6E', '#A33F06', '#A4262C'].map(c => ({ c, ring: PF.pic === c ? t.text : 'transparent', go: () => setPf({ pic: c, photo: false }) })),
      title: PF.title, setTitle: e => setPf({ title: e && e.target ? e.target.value : PF.title }),
      phone: PF.phone, setPhone: e => setPf({ phone: e && e.target ? e.target.value : PF.phone }),
      sites: ['Werk 1', 'Werk 2', 'Mobil / Außendienst'].map(n => pk4(PF.site === n, n, () => setPf({ site: n }))),
      facts: [['Team', 'Automatisierung'], ['Vorgesetzter', 'H. Lorenz'], ['Rolle im System', 'Projektleitung, Mitarbeiter']].map(([k, v]) => ({ k, v })),
      skills: Object.keys(PF.levels).map(k => ({ name: k, dots: [1, 2, 3, 4].map(n => ({ bg: n <= PF.levels[k] ? accent : 'transparent', bd: n <= PF.levels[k] ? accent : t.strong, aria: k + ' Stufe ' + n, go: () => setPf({ levels: Object.assign({}, PF.levels, { [k]: PF.levels[k] === n ? n - 1 : n }) }) })),
        label: ['–', 'Grundlagen', 'Anwenden', 'Selbstständig', 'Experte'][PF.levels[k]], confirm: PF.levels[k] >= 3 ? (k === 'Projektmanagement' ? '✓ bestätigt' : 'von S. Keller bestätigt') : '' })),
      skillSug: SKILL_SUG.map(k => ({ label: '+ ' + k, pressed: 'false', ring: t.border, bg: t.surface, go: () => { setPf({ levels: Object.assign({}, PF.levels, { [k]: 1 }) }); this.setState({ profMsg: '„' + k + '“ hinzugefügt. Stufe per Klick auf die Punkte setzen; ab Stufe 3 bestätigt die Teamleitung.' }); } })),
      certs: PF.certs.map(([n, d]) => { const days = dd(TODAY, D(d)); return { name: n, until: fmt(D(d)) + D(d).getFullYear(), st: days <= 60 ? '! ' + days + ' Tage' : '✓ gültig', stBg: days <= 60 ? '#8A3707' : GREEN }; }),
      addCert: () => { setPf({ certs: PF.certs.concat([['Elektrofachkraft für festgelegte Tätigkeiten', '2029-11-13']]) }); this.setState({ profMsg: 'Zertifikat ergänzt. Nachweis als PDF hochladen, die Teamleitung sieht den Ablauf in der Qualifikationsmatrix.' }); },
      themes: [['hell', '☀ Hell'], ['dunkel', '☾ Dunkel'], ['system', '⚙ Wie das System']].map(([k, l]) => pk4(s.themeMode === k, l, () => this.setState({ themeMode: k }))),
      dens: [['kompakt', 'Kompakt'], ['normal', 'Normal'], ['luftig', 'Luftig']].map(([k, l]) => pk4(dens === k, l, () => this.setState({ densOv: k }))),
      accents: [['#0F6CBD', 'Blau'], ['#0E7A6E', 'Petrol'], ['#5B2D90', 'Violett'], ['#A33F06', 'Orange']].map(([c, l]) => ({ c, label: l, ring: accent === c ? t.text : 'transparent', go: () => this.setState({ accentOv: c }) })),
      langs: LANGS.map(([k, label, title]) => pk4(s.lang === k, title, () => this.setState({ lang: k }))),
      hoursOpts: [35, 38, 40].map(h => pk4(PF.hours === h, h + ' h', () => setPf({ hours: h }))),
      dayOpts: ['Mo', 'Di', 'Mi', 'Do', 'Fr'].map((d, i) => pk4(PF.days[i], d, () => setPf({ days: PF.days.map((x, j) => (j === i ? !x : x)) }))),
      shareLabel: PF.share + ' %', shareMinus: () => setPf({ share: Math.max(50, PF.share - 5) }), sharePlus: () => setPf({ share: Math.min(100, PF.share + 5) }),
      planText: 'Planbar: ' + (Math.round(PF.hours * PF.days.filter(Boolean).length / 5 * PF.share / 10) / 10).toLocaleString('de-DE') + ' h pro Woche. Der Rest ist Puffer für Störungen, Mails und Unvorhergesehenes.',
      starts: ['06:00', '07:00', '08:00'].map(h => pk4(PF.start === h, 'ab ' + h, () => setPf({ start: h }))),
      sites: SITES.map(([k, l]) => { const on = ((s.siteBy || {})['Du'] || SITE0['Du'] || 'NW') === k; return { label: l, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: () => this.setState({ siteBy: Object.assign({}, s.siteBy, { Du: k }), absMsg: 'Standort: ' + l + '. Teamplanung, Kapazität und Fälligkeiten rechnen mit diesen Feiertagen.' }) }; }), deputies: ['S. Keller', 'M. Yilmaz', 'J. Novak'].map(n => pk4(PF.deputy === n, n, () => setPf({ deputy: n }))),
      navOpts: [['projekte', 'Projekte'], ['teams', 'Teams'], ['wissen', 'Wissen'], ['berichte', 'Berichte'], ['eingang', 'Posteingang']].map(([k, l]) => { const on = !(s.navHide || {})[k]; return pk4(on, (on ? '✓ ' : '+ ') + l, () => this.setState({ navHide: Object.assign({}, s.navHide, { [k]: on }), profMsg: l + (on ? ' ist im Menü ausgeblendet. Über „⚙ Menü anpassen“ holst du es zurück.' : ' ist wieder im Menü.') })); }),
      arbOpts: ARB_T.filter(x => x[3]).map(([k, ic, l]) => { const on = !(s.arbHide || {})[k]; return pk4(on, (on ? '✓ ' : '+ ') + l, () => this.setState({ arbHide: Object.assign({}, s.arbHide, { [k]: on }), profMsg: '„' + l + '“ ' + (on ? 'ist in Meine Arbeit ausgeblendet.' : 'ist wieder sichtbar.') })); }),
      prioC: ['Dringend', 'Hoch', 'Mittel', 'Niedrig'].map(n => ({ name: n, color: PRIO[n], set: e => { const v = e && e.target ? e.target.value : ''; if (/^#[0-9a-fA-F]{6}$/.test(v)) this.setState({ prioC: Object.assign({}, this.state.prioC, { [n]: v }) }); } })),
      prioReset: () => this.setState({ prioC: {}, profMsg: 'Prioritätsfarben zurückgesetzt.' }),
      detModes: [['seite', '▐ Am rechten Rand (Liste bleibt sichtbar)'], ['popup', '⧉ Als Pop-up in der Mitte']].map(([k, l]) => pk4((s.detMode || 'popup') === k, l, () => this.setState({ detMode: k, profMsg: k === 'popup' ? 'Details öffnen ab jetzt als Pop-up. Umschalten geht auch direkt im Detail mit ⇥.' : 'Details öffnen ab jetzt am rechten Rand.' }))),
      ...(() => { const ABSC = { Urlaub: '#0F6CBD', Schulung: '#5B2D90', Dienstreise: '#0E6E7A', Gleittag: '#8A3707', Krank: '#A4262C' }, dep = PF.deputy || 'S. Keller';
        const fmtR = (f, u) => f.slice(8, 10) + '.' + f.slice(5, 7) + '.' + (f === u ? f.slice(0, 4) : ' bis ' + u.slice(8, 10) + '.' + u.slice(5, 7) + '.' + u.slice(0, 4));
        const mine = (tp_ABS['Du'] || []).map(x => ({ f: x[0], u: x[1], k: x[2], src: 'aus Zeitwirtschaft', i: -1 })).concat((s.absAdd || []).map((x, i) => ({ f: x[0], u: x[1], k: x[2], src: 'von dir eingetragen', i, who: x[3] })).filter(x => x.who === 'Du'));
        const af = s.absFrom || '2026-12-21', au = s.absTo || '2026-12-23', last = s.absLast;
        const hits = last ? TASKS.filter(x => (this.ownerOf(x) === 'Du' || (s.absDone || {})[x.id]) && !this.isDone(x) && x.due >= last[0] && x.due <= last[1]) : [];
        return { abs: mine.sort((x, y) => (x.f < y.f ? -1 : 1)).map(x => ({ kind: x.k, range: fmtR(x.f, x.u), src: x.src, bg: ABSC[x.k] || '#5C5C5C', canDel: x.i >= 0, del: () => this.setState({ absAdd: s.absAdd.filter((z, k) => k !== x.i), absLast: null, absMsg: 'Abwesenheit gelöscht. Die Tage sind wieder planbar.' }) })),
          absKinds: Object.keys(ABSC).map(k => pk4((s.absKind || 'Urlaub') === k, k, () => this.setState({ absKind: k }))),
          absFrom: af, absTo: au, setAbsFrom: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) this.setState({ absFrom: v }); }, setAbsTo: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) this.setState({ absTo: v }); },
          absSave: () => { if (au < af) return this.setState({ absMsg: '„bis“ liegt vor „von“.', absLast: null }); const k = s.absKind || 'Urlaub', n = TASKS.filter(x => this.ownerOf(x) === 'Du' && !this.isDone(x) && x.due >= af && x.due <= au).length;
            this.setState({ absAdd: (s.absAdd || []).concat([[af, au, k, 'Du']]), absLast: [af, au], absDone: {}, absMsg: k + ' ' + fmtR(af, au) + ' eingetragen. ' + dep + ' vertritt dich bei Freigaben.' + (n ? ' ' + n + (n === 1 ? ' Aufgabe ist' : ' Aufgaben sind') + ' in der Zeit fällig:' : ' In der Zeit ist nichts von dir fällig.') }); },
          absHasMsg: !!s.absMsg, absMsg: s.absMsg || '', absBd: hits.length ? '#C19C00' : accent,
          absHits: hits.map(x => { const r = (s.absDone || {})[x.id]; return { label: x.title + ' · fällig ' + fmt(D(x.due)) + ' · ' + x.proj, deputy: dep, open: !r, isDone: !!r, result: r || '',
            toDeputy: () => this.setState({ ownerOv: Object.assign({}, s.ownerOv, { [x.id]: dep }), absDone: Object.assign({}, s.absDone, { [x.id]: '→ an ' + dep + ' gegeben, ' + dep + ' ist benachrichtigt' }) }),
            earlier: () => this.setState({ bk: Object.assign({}, s.bk, { [x.id]: 'Fokus' }), absDone: Object.assign({}, s.absDone, { [x.id]: '★ in deinen Fokus gelegt, vor der Abwesenheit erledigen' }) }) }; }) }; })(),
      notif: [['mail', 'Mail bei neuen Aufgaben und Freigaben'], ['push', 'Push aufs Handy'], ['teams', 'Teams-Nachricht'], ['mention', '@Erwähnungen sofort, alles andere gesammelt'], ['digest', 'Tagesübersicht um 7:00'], ['quiet', 'Ruhezeit 18:00–7:00 und am Wochenende']].map(([k, l]) => tg(s.notif[k], l, () => this.setState({ notif: Object.assign({}, s.notif, { [k]: !s.notif[k] }) }))),
      cal: [['outlook', 'Outlook-Kalender (Microsoft 365) verbunden'], ['fokusFree', 'Termine „Fokuszeit“ (Titel oder Kategorie) sind Platz für Aufgaben, kein Termin'], ['block', 'Eingeplante Aufgaben als Fokuszeit in Outlook blocken'], ['ical', 'Zusätzlich iCal-Abo für andere Kalender']].map(([k, l]) => tg(s.cal[k], l, () => this.setState({ cal: Object.assign({}, s.cal, { [k]: !s.cal[k] }) }))),
      calNote: s.cal.outlook ? 'Verbunden über den Cockpit-Server mit Microsoft Graph. Das Cockpit liest Termine und schreibt nur, was du freigibst.' : 'Nicht verbunden: Mein Tag zeigt keine Termine.',
      ki: [['outlook', 'KI-Hilfe mit Outlook: Mails lesen, Entwürfe und Termine vorbereiten (Hauptschalter)'], ['drafts', 'KI bereitet Entwürfe vor (Posteingang)'], ['replies', 'Antwortvorschläge auf eingehende Mails zu meinen Projekten'], ['wissen', 'KI pflegt Lessons Learned, Technik-Gedächtnis und Vorlagen mit'], ['team', 'KI schlägt in der Teamplanung eine Verteilung vor'], ['mails', 'Nachfass-Mails bei „Warten auf“'], ['termine', 'Terminvorschläge mit freien Zeiten aus Outlook'], ['status', 'Wöchentlicher Statusbericht als Entwurf']].map(([k, l]) => tg(s.kiPref[k], l, () => this.setState({ kiPref: Object.assign({}, s.kiPref, { [k]: !s.kiPref[k] }) }))),
      openAdmin: () => this.setState({ screen: 'admin', panel: null, adMsg: '' }),
      save: () => this.setState({ profMsg: 'Gespeichert. Einstellungen gelten auf allen Geräten.' })
    };

    // KI-Entwürfe und Antwortvorschläge: die KI bereitet vor, du machst in Outlook oder hier fertig
    const DRAFTS = [
      { id: 'm1', kind: 'Antwort auf Mail', icon: '↩', ch: 'mail', pref: 'replies', to: 'Bosch Rexroth, Vertrieb', subject: 'Re: AB 2026-118 Servoantriebe',
        orig: { from: 'Bosch Rexroth, Vertrieb', when: 'heute 08:47', subject: 'AB 2026-118 Servoantriebe', text: 'Sehr geehrte Damen und Herren, hiermit bestätigen wir den Auftrag 2026-118 mit Liefertermin 02.12.2026. Ein früherer Termin ist aufgrund der Fertigungsauslastung leider nicht möglich.' },
        why: 'Neue Mail zu „Servoantriebe bestellen“ (SM42). Der Liefertermin liegt 5 Tage hinter dem Meilenstein.',
        vars: [['Annehmen', 'Guten Tag,\n\nvielen Dank für die Auftragsbestätigung. Wir planen mit Anlieferung am 02.12.2026 und bitten um Avis zwei Tage vorher.\n\nViele Grüße'],
          ['Nachhaken', 'Guten Tag,\n\nvielen Dank für die Bestätigung. Der 02.12. liegt nach unserem Montagebeginn. Ist eine Teillieferung von 4 der 6 Antriebe bis 27.11. möglich, gegebenenfalls mit Expresszuschlag?\n\nViele Grüße'],
          ['Eskalieren', 'Guten Tag,\n\nder Termin 27.11. ist für uns verbindlich vereinbart (Angebot vom 04.11.). Bitte rufen Sie mich bis morgen 12 Uhr zurück, damit wir eine Lösung finden.\n\nViele Grüße']],
        act: ['Meilenstein öffnen und Termin prüfen', () => this.openNode('m32', 'eingang')] },
      { id: 'm2', kind: 'Antwort auf Mail', icon: '↩', ch: 'mail', pref: 'replies', to: 'Hr. Albers (Kunde)', subject: 'Re: FAT früher möglich?',
        orig: { from: 'Hr. Albers (Kunde)', when: 'gestern 16:12', subject: 'FAT früher möglich?', text: 'Hallo, unser Werk möchte die Anlage zwei Wochen früher in Betrieb nehmen. Können wir die FAT auf den 21.01. vorziehen?' },
        why: 'Mail zum Projekt SM42, betrifft Gate G3 (26.01.). Laut Plan liegt die Inbetriebnahme bis 22.01.',
        vars: [['Prüfen', 'Hallo Herr Albers,\n\ndanke für die Anfrage. Ich prüfe mit dem Team, ob wir die FAT auf den 21.01. vorziehen können, und melde mich bis Mittwoch.\n\nViele Grüße'],
          ['Zusagen', 'Hallo Herr Albers,\n\nder 21.01. ist möglich, wenn die Servoantriebe bis 27.11. kommen. Ich bestätige den Termin verbindlich am 30.11.\n\nViele Grüße'],
          ['Absagen', 'Hallo Herr Albers,\n\nden 21.01. schaffen wir leider nicht, die Inbetriebnahme vor Ort läuft bis 22.01. Wir bleiben beim 26.01.\n\nViele Grüße']],
        act: ['Gate G3 im Plan öffnen', () => this.openNode('g3', 'eingang')] },
      { id: 'm3', kind: 'Antwort auf Mail', icon: '↩', ch: 'mail', pref: 'replies', to: 'K. Weber', subject: 'Re: Presse 3 Ölwechsel erledigt',
        orig: { from: 'K. Weber', when: 'heute 07:58', subject: 'Presse 3 Ölwechsel erledigt', text: 'Ölwechsel ist durch, 32 Liter, Filter mitgetauscht. Foto vom Ölstand hängt an.' },
        why: 'Bezieht sich auf deine Aufgabe „Wartung Presse 3: Hydrauliköl wechseln“ (Foto im Anhang).',
        vars: [['Danke', 'Danke, Karl! Ich setze die Aufgabe auf erledigt.'], ['Rückfrage', 'Danke! Welches Öl hast du genommen, HLP 46 wie im Wartungsplan?']],
        act: ['Aufgabe erledigt setzen und Foto in die Akte', () => { if (!this.isDone(TASK.t4)) this.toggleDone('t4'); const k = 't:t4', cur = Object.assign({ doku: [], files: [], times: [], inv: [] }, (this.state.akte || {})[k] || {}); cur.files = cur.files.concat([['IMG', 'Presse3_Oelstand_nachher.jpg', '2,0 MB', 'K. Weber', 'heute']]); this.setState({ akte: Object.assign({}, this.state.akte, { [k]: cur }), drMsg: 'Aufgabe „Wartung Presse 3“ ist erledigt, das Foto liegt in der Akte der Aufgabe.' }); }] },
      { id: 'd1', kind: 'Mail', icon: '✉', ch: 'mail', pref: 'mails', to: 'Spedition Kraus', subject: 'Abholung Schaltschrank =S1, KW 48',
        why: 'Der Schaltschrank ist für 27.11. fertig gemeldet, eine Abholung ist noch nicht beauftragt.',
        vars: [['Entwurf', 'Guten Tag,\n\nbitte holen Sie am Freitag, 27.11., ab 10 Uhr einen Schaltschrank (2,0 × 0,8 × 0,6 m, ca. 320 kg) bei Elektro Müller ab und liefern Sie ihn am Montag, 30.11., an unser Werk 1, Halle 4.\n\nViele Grüße']] },
      { id: 'd2', kind: 'Termin', icon: '📅', ch: 'termin', pref: 'termine', to: 'Geschäftsführung, T. Brandt, L. Wagner', subject: 'Gate-Review G2: Konstruktionsfreigabe SM42',
        why: 'Gate G2 steht am 17.11., es gibt noch keinen Termin mit den Entscheidern.', slots: ['Di 17.11., 10:30–11:30', 'Di 17.11., 14:00–15:00', 'Mi 18.11., 08:30–09:30'],
        vars: [['Agenda', 'Agenda\n1. Stand der Checkliste (4 von 5 erfüllt)\n2. Auflage Stromlaufplan\n3. Entscheidung: bestanden, mit Auflage oder nicht bestanden']] },
      { id: 'd3', kind: 'Statusbericht', icon: '📝', ch: 'mail', pref: 'status', to: 'H. Lorenz', subject: 'Status SM42 Schraubstation, KW 46',
        why: 'Freitag: Wochenstatus SM42 für H. Lorenz ist fällig.',
        vars: [['Kurz', 'Gesamt: gelb.\nTermine: Gate G2 am 17.11., Stromlaufplan als Auflage offen.\nBeschaffung: Servoantriebe kommen erst am 02.12., Teillieferung angefragt.\nBudget: Prognose im Budget.\nNächste Woche: Gate G2, Start Montage.'],
          ['Ausführlich', 'Gesamtstatus: gelb\n\nTermine\n- Gate G2 Konstruktionsfreigabe am 17.11.; 4 von 5 Punkten erfüllt, Stromlaufplan als Auflage.\n- Servoantriebe: Auftragsbestätigung für 02.12. statt 27.11.; Teillieferung angefragt.\n\nKosten\n- Prognose 455 T€ bei 480 T€ Budget.\n\nRisiken\n- Montagebeginn verschiebt sich um bis zu 1 Woche, wenn keine Teillieferung kommt.\n\nNächste Schritte\n- Gate G2, Abholung Schaltschrank, Start Montage.']] },
      { id: 'd4', kind: 'Antwort auf Kommentar', icon: '💬', ch: 'kommentar', pref: 'drafts', to: 'S. Keller (an „FB_Schrauber parametrieren“)', subject: 'Drehwinkelprogramm 3',
        why: 'S. Keller fragt an „FB_Schrauber parametrieren“ nach dem Drehwinkelprogramm 3.',
        vars: [['Entwurf', 'Programm 3 ist im Pflichtenheft noch nicht beschrieben. Ich kläre das bis Dienstag mit dem Kunden und trage es in Kapitel 5.3 nach. Bis dahin bitte mit Programm 1 und 2 weitermachen.']] } ];
    const CH = { mail: ['In Outlook als Entwurf', 'Direkt senden'], termin: ['In Outlook öffnen', 'Einladung direkt senden'], kommentar: ['An der Aufgabe posten', null] };
    const drOpen = DRAFTS.filter(d => s.kiPref.drafts && s.kiPref[d.pref] !== false && !s.drState[d.id] && (s.kiPref.outlook || d.ch === 'kommentar'));
    const drafts = drOpen.map(d => { const slot = (s.drSlot || {})[d.id] || 0, vi = (s.drVar || {})[d.id] || 0, key = 'dr:' + d.id + ':' + vi, init = d.vars[vi][1];
      const textNow = () => { const tx = this.state.txt || {}; return (Object.prototype.hasOwnProperty.call(tx, key) ? tx[key] : init).trim(); };
      const done = (state, msg) => this.setState({ drState: Object.assign({}, this.state.drState, { [d.id]: state }), drMsg: msg });
      const where = d.slots ? ' für ' + d.slots[slot] : '';
      const primary = () => { if (!textNow()) return this.setState({ cmpErr: key });
        if (d.ch === 'mail') return done('outlook', '„' + d.subject + '“ würde jetzt in Outlook › Entwürfe liegen, mit Empfänger, Betreff und deinem Text. Dort fertig machen und senden. (Vorschau: simuliert, hier ist kein Outlook angebunden.)');
        if (d.ch === 'termin') return done('outlook', 'Outlook würde den Termin „' + d.subject + '“ vorausgefüllt öffnen' + where + ', mit Teilnehmern, Raum 2 und Agenda. Die Einladung sendest du in Outlook. (Vorschau: simuliert, hier ist kein Outlook angebunden.)');
        return done('sent', 'Antwort an der Aufgabe gepostet. S. Keller wird benachrichtigt.'); };
      const direct = () => { if (!textNow()) return this.setState({ cmpErr: key }); done('sent', d.ch === 'termin' ? 'Einladung' + where + ' würde direkt gesendet und Raum 2 gebucht. (Vorschau: simuliert, hier ist kein Outlook angebunden.)' : '„' + d.subject + '“ würde direkt über Outlook gesendet. (Vorschau: simuliert, hier ist kein Outlook angebunden.)'); };
      return { icon: d.icon, kind: d.kind, why: d.why, to: d.to, subject: d.subject, isTermin: !!d.slots,
        hasOrig: !!d.orig, origFrom: d.orig ? d.orig.from : '', origWhen: d.orig ? d.orig.when : '', origSubject: d.orig ? d.orig.subject : '', origText: d.orig ? d.orig.text : '',
        hasVars: d.vars.length > 1, vars: d.vars.map(([l], i) => ({ label: l, pressed: vi === i ? 'true' : 'false', ring: vi === i ? accent : t.border, bg: vi === i ? t.soft : t.surface, go: () => this.setState({ drVar: Object.assign({}, s.drVar, { [d.id]: i }) }) })),
        slots: (d.slots || []).map((sl, i) => ({ label: sl, pressed: slot === i ? 'true' : 'false', ring: slot === i ? accent : t.border, bg: slot === i ? t.soft : t.surface, go: () => this.setState({ drSlot: Object.assign({}, s.drSlot, { [d.id]: i }) }) })),
        slotNote: d.slots ? 'Alle Teilnehmer sind laut Outlook frei. Raum 2 wird mit dem Termin gebucht.' : '',
        cmp: cmp(key, { always: true, init, title: 'Text bearbeiten', send: CH[d.ch][0], err: 'Der Text ist leer.', ki: d.ch === 'kommentar' ? null : { to: d.to, subject: d.subject }, onSend: () => primary() }),
        hasDirect: !!CH[d.ch][1], directLabel: CH[d.ch][1] || '', direct,
        hasAct: !!d.act, actLabel: d.act ? d.act[0] : '', act: d.act ? d.act[1] : () => {},
        discard: () => done('discarded', 'Verworfen. Die KI schlägt diesen Entwurf nicht noch einmal vor.'),
        later: () => done('later', 'Zurückgelegt bis Montag.') }; });
    const nIn = drafts.filter(d => d.hasOrig).length;
    const drI = Math.min(s.drIdx || 0, Math.max(0, drafts.length - 1));
    const dr = { cur: drafts.length ? [drafts[drI]] : [], pos: drafts.length ? (drI + 1) + ' von ' + drafts.length : '', multi: drafts.length > 1,
      prev: () => this.setState({ drIdx: (drI - 1 + drafts.length) % Math.max(1, drafts.length) }), next: () => this.setState({ drIdx: (drI + 1) % Math.max(1, drafts.length) }),
      others: drafts.map((d, i) => ({ label: d.icon + ' ' + (d.subject.length > 26 ? d.subject.slice(0, 25) + '…' : d.subject), pressed: i === drI ? 'true' : 'false', ring: i === drI ? accent : t.border, bg: i === drI ? t.soft : t.surface, go: () => this.setState({ drIdx: i }) })),
      outlookOff: !s.kiPref.outlook, toSettings: () => this.setState({ screen: 'profil', panel: null, profMsg: 'Unter „Kalender und KI-Assistent“ schaltest du die KI-Hilfe mit Outlook für dich aus.' }),
      list: drafts, has: drafts.length > 0, none: drafts.length === 0, count: String(drafts.length), hasMsg: !!s.drMsg, msg: s.drMsg || '', off: !s.kiPref.drafts,
      head: drafts.length ? drafts.length + (drafts.length === 1 ? ' Entwurf' : ' Entwürfe') + (nIn ? ', davon ' + nIn + (nIn === 1 ? ' Antwort auf eine eingegangene Mail' : ' Antworten auf eingegangene Mails') : '') : 'Keine offenen Entwürfe',
      note: 'Die KI auf dem Cockpit-Server liest neue Mails zu deinen Projekten (über Microsoft Graph) und bereitet Antworten, Nachfass-Mails, Termine und Berichte vor. Mails landen als Entwurf in Outlook, Termine öffnen sich vorausgefüllt. Nichts geht ohne deinen Klick raus.' };

    // Rechtes Feld: Breite ziehen, groß machen
    const PW = s.panelW || 420;
    const popup = (s.detMode || 'popup') === 'popup';
    const PWM = popup ? { pos: 'fixed', top: '4vh', left: '50%', tf: 'translateX(-50%)', w: 'min(980px, 94vw)', h: 'auto', maxH: '92vh', z: '90', rad: '14px', sh: '0 24px 64px rgba(0,0,0,0.35)', pad: '24px', role: 'dialog', modal: 'true' }
      : { pos: 'relative', top: 'auto', left: 'auto', tf: 'none', w: 'auto', h: '100%', maxH: 'none', z: 'auto', rad: '0', sh: 'none', pad: '20px', role: 'complementary', modal: 'false' };
    const pw = Object.assign({}, PWM, { popup, side: !popup, modeIcon: popup ? '⇥' : '⧉', modeLabel: popup ? 'Als Feld am rechten Rand zeigen' : 'Als Pop-up in der Mitte zeigen',
      modeToggle: () => this.setState({ detMode: popup ? 'seite' : 'popup', panelMax: false }) });
    Object.assign(pw, { flex: popup ? '0 0 auto' : (s.panelMax ? '1 1 100%' : '0 0 ' + PW + 'px'), mainDisp: !popup && s.panelMax && s.panel ? 'none' : 'block', maxLabel: s.panelMax ? '⤡' : '⤢', maxAria: s.panelMax ? 'Wieder als Seitenfeld' : 'Groß machen', gripBg: 'transparent',
      toggleMax: () => this.setState({ panelMax: !s.panelMax }), wider: () => this.setState({ panelW: Math.min(1100, PW + 160), panelMax: false }), narrower: () => this.setState({ panelW: Math.max(320, PW - 160), panelMax: false }),
      grab: e => { this._pw = { x0: e && e.clientX, w: PW }; try { e.dataTransfer.setData('text/plain', 'pw'); e.dataTransfer.effectAllowed = 'move'; } catch (er) { /* ältere Browser */ } },
      drop: e => { const g = this._pw; this._pw = null; if (!g || !e || !e.clientX || !g.x0) return; this.setState({ panelW: Math.max(320, Math.min(1100, g.w + (g.x0 - e.clientX))), panelMax: false }); } });

    // Globale Suche über alles
    const qq = (s.q || '').trim().toLowerCase(), hitQ = str => String(str || '').toLowerCase().includes(qq);
    const sr = { open: qq.length >= 2, q: s.q || '', set: e => this.setState({ q: e && e.target ? e.target.value : '' }), clear: () => this.setState({ q: '' }), groups: [], none: false, count: '0' };
    if (sr.open) {
      const goQ = fn => () => { this.setState({ q: '' }); fn(); };
      const objName = k => (k[0] === 't' ? (TASK[k.slice(2)] || {}).title : (NODE[k.slice(2)] || {}).name) || k;
      const openAk = (k, sub) => { if (k[0] === 't') this.openTask(k.slice(2), s.screen); else this.openNode(k.slice(2), s.screen); this.setState({ pSub: sub }); };
      const G = [
        ['Aufgaben', TASKS.filter(x => !x.story && (hitQ(x.title) || hitQ(x.desc) || hitQ(x.proj) || hitQ(this.ownerOf(x)))).slice(0, 6).map(x => ({ title: x.title, sub: x.proj + ' · ' + this.ownerOf(x) + ' · fällig ' + fmt(D(x.due)), go: goQ(() => this.openTask(x.id, s.screen)) }))],
        ['Meilensteine und Gates', Object.values(NODE).filter(n => n.type !== 'phase' && hitQ(n.name)).slice(0, 5).map(n => ({ title: '◆ ' + n.name, sub: PNAME_OF[this.pkOfNode(n.id)] + ' · ' + fmt(D(n.end)), go: goQ(() => this.openNode(n.id, s.screen)) }))],
        ['Projekte', Object.keys(PNAME_OF).filter(k => hitQ(PNAME_OF[k])).map(k => ({ title: PNAME_OF[k], sub: 'Projekt', go: goQ(() => this.openProject(k)) }))],
        ['Wissen', WISSEN.filter(w => hitQ(w.title) || (w.tags || []).some(hitQ) || (w.f || []).some(f => hitQ(f[1]))).slice(0, 4).map(w => ({ title: w.title, sub: w.cat + ' · ' + w.origin, go: goQ(() => this.setState({ screen: 'wissen', panel: { kind: 'wissen', id: w.id, from: 'wissen' } })) }))],
        ['Dateien und Doku', Object.keys(AKTE_SEED).reduce((acc, k) => acc.concat((AKTE_SEED[k].files || []).filter(f => hitQ(f[1])).map(f => ({ title: f[1], sub: 'Datei an „' + objName(k) + '“', go: goQ(() => openAk(k, 'dateien')) })))
          .concat((AKTE_SEED[k].doku || []).filter(d2 => hitQ(d2[3])).map(d2 => ({ title: d2[0] + ': ' + d2[3].slice(0, 70), sub: 'Doku an „' + objName(k) + '“', go: goQ(() => openAk(k, 'doku')) }))), []).slice(0, 5)],
        ['Kommentare', Object.keys(COMMENTS).reduce((acc, id) => acc.concat(COMMENTS[id].filter(c2 => hitQ(c2[2])).map(c2 => ({ title: '„' + c2[2].slice(0, 70) + '“', sub: c2[0] + ' an „' + TASK[id].title + '“', go: goQ(() => this.openTask(id, s.screen)) }))), []).slice(0, 4)],
        ['Personen', Object.keys(AV).filter(n => n !== 'Du' && hitQ(n)).slice(0, 4).map(n => ({ title: n, sub: 'Aufgaben: ' + TASKS.filter(x => this.ownerOf(x) === n && !this.isDone(x)).length + ' offen', go: goQ(() => this.setState({ screen: 'teams' })) }))]
      ].filter(g => g[1].length).map(([label, items]) => ({ label, items }));
      sr.groups = G; sr.none = !G.length; sr.count = String(G.reduce((acc, g) => acc + g.items.length, 0));
    }

    // KI pflegt Wissen und Vorlagen mit
    const KM = [
      { id: 'k1', kind: 'Neue Lessons Learned', icon: '💡', why: 'Aus Kommentaren und Doku in SM42 erkannt: Der Pneumatikplan kam zweimal zurück, weil die Ventilinsel zu klein war.', title: 'Pneumatik früh mit der Steuerung abstimmen',
        text: 'Beobachtung: Der Pneumatikplan SM42 musste zweimal überarbeitet werden, die Ventilinsel war zu klein.\nUrsache: Anzahl der Ventile und Reserven wurde erst nach dem Konstruktionsstand mit der Automatisierung abgestimmt.\nEmpfehlung: Ventilinsel und Reserveplätze im Konzept gemeinsam mit der Automatisierung festlegen.', act: 'Als Lessons Learned speichern', cat: 'Lessons Learned', tags: ['Pneumatik', 'Schnittstelle'], origin: 'SM42 Schraubstation', okey: 'sm42' },
      { id: 'k2', kind: 'Zusammenführen', icon: '🔗', why: '„Langläufer-Teile früher bestellen“ und „Lieferantentermine wöchentlich prüfen“ haben dieselbe Ursache: Beschaffung zu spät angestoßen.', title: 'Langläufer früh bestellen und Liefertermine wöchentlich prüfen',
        text: 'Beide Einträge werden zu einem zusammengeführt. Bewertungen, Verweise und Kommentare bleiben erhalten, der alte Link leitet weiter.', act: 'Zusammenführen' },
      { id: 'k3', kind: 'Technik-Gedächtnis ergänzen', icon: '🔧', why: 'K. Weber hat an „Wartung Presse 3“ Ölmenge, Ölsorte und Filter dokumentiert. Das gehört in den Steckbrief der Anlage.', title: 'Presse 3: Ölwechsel',
        text: 'Hydrauliköl HLP 46, 32 Liter, Rücklauffilter mittauschen. Ölstand danach an der Min-Marke prüfen und nach 1 h Betrieb nachfüllen.', act: 'Ins Technik-Gedächtnis', cat: 'Technik-Gedächtnis', tags: ['Presse 3', 'Hydraulik'], origin: 'Instandhaltung Halle 2', okey: 'ih' },
      { id: 'k4', kind: 'Vorlage verbessern', icon: '📋', why: 'In drei Projekten wurde die „Checkliste Inbetriebnahme Schaltschrank“ um denselben Punkt ergänzt.', title: 'Checkliste Inbetriebnahme Schaltschrank',
        text: 'Neuer Prüfpunkt nach Punkt 7: „Not-Halt-Kreis mit Protokoll getestet, Unterschrift Elektrofachkraft“.', act: 'In die Vorlage übernehmen' },
      { id: 'k5', kind: 'Prüfen lassen', icon: '⏳', why: '„Profinet: Gerätename nach Tausch neu vergeben“ ist 18 Monate alt; seitdem gilt TIA Portal V19 mit geändertem Ablauf.', title: 'Profinet: Gerätename nach Tausch neu vergeben',
        text: 'Hallo Jan, kannst du bitte prüfen, ob der Ablauf mit TIA Portal V19 noch stimmt? Danke!', act: 'J. Novak um Prüfung bitten' } ];
    const kmOpen = KM.filter(k => s.kiPref.wissen !== false && !(s.kmState || {})[k.id]);
    const kmI = Math.min(s.kmIdx || 0, Math.max(0, kmOpen.length - 1));
    const kmDone = (k, msg) => this.setState({ kmState: Object.assign({}, this.state.kmState, { [k.id]: 'done' }), kmMsg: msg });
    const km = { has: kmOpen.length > 0, none: kmOpen.length === 0, multi: kmOpen.length > 1, pos: kmOpen.length ? (kmI + 1) + ' von ' + kmOpen.length : '', hasMsg: !!s.kmMsg, msg: s.kmMsg || '', off: s.kiPref.wissen === false,
      prev: () => this.setState({ kmIdx: (kmI - 1 + kmOpen.length) % Math.max(1, kmOpen.length) }), next: () => this.setState({ kmIdx: (kmI + 1) % Math.max(1, kmOpen.length) }),
      cur: kmOpen.length ? [kmOpen[kmI]].map(k => ({ kind: k.kind, icon: k.icon, why: k.why, title: k.title,
        cmp: cmp('km:' + k.id, { always: true, init: k.text, title: 'Inhalt prüfen und anpassen', send: k.act, err: 'Der Inhalt ist leer.',
          onSend: v => { if (k.cat) { WISSEN.push({ id: 'w' + k.id, cat: k.cat, kind: k.cat === 'Lessons Learned' ? 'verbessern' : undefined, title: k.title, origin: k.origin, okey: k.okey, date: '13.11.2026', author: 'Du (Vorschlag der KI)', help: 0, tags: k.tags, f: [['Inhalt', v]] }); this.setState({ rev: (this.state.rev || 0) + 1 }); }
            kmDone(k, { k1: 'Gespeichert unter Lessons Learned. Beim nächsten Projekt mit Pneumatik schlägt das Cockpit ihn vor.', k2: 'Zusammengeführt. Der neue Eintrag hat 9 Hilfreich-Stimmen aus beiden.', k3: 'Im Technik-Gedächtnis von Presse 3 gespeichert. Beim nächsten Ölwechsel steht er in der Aufgabe.', k4: 'Vorlage aktualisiert (Version 1.4). Laufende Projekte bekommen einen Hinweis, neue übernehmen den Punkt.', k5: 'J. Novak hat die Bitte mit Link zum Eintrag bekommen.' }[k.id]); } }),
        later: () => this.setState({ kmIdx: kmI + 1, kmMsg: 'Zurückgestellt.' }), discard: () => kmDone(k, 'Verworfen. Die KI schlägt das nicht noch einmal vor.') })) : [],
      note: 'Die KI liest Kommentare, Doku, Gate-Protokolle und Abschlussberichte und schlägt vor, was ins Wissen gehört, was doppelt ist, was veraltet ist und welche Vorlage sich verbessern lässt. Gespeichert wird erst, wenn du zustimmst.' };

    // Fokus
    const mineOpen = TASKS.filter(x => x.mine);
    const inF = mineOpen.filter(x => this.bucketOf(x) === 'Fokus').sort((a, b) => D(a.due) - D(b.due)).map(x => x.id);
    const fList = (s.fSort || []).filter(id => inF.includes(id)).concat(inF.filter(id => !(s.fSort || []).includes(id)));
    const fH = fList.reduce((a, id) => a + estOf(TASK[id]), 0);
    const sugF = mineOpen.filter(x => this.taskStatus(x) === 'ueberfaellig' && this.bucketOf(x) !== 'Fokus');
    const fo = {
      count: fList.length, load: fH.toLocaleString('de-DE') + ' h von ' + PLAN_DAY.toLocaleString('de-DE') + ' h heute planbar', loadColor: fH > PLAN_DAY ? RED : GREEN,
      text: fH > PLAN_DAY ? 'Mehr im Fokus, als heute in deine planbare Zeit passt. Nimm etwas heraus oder plane es für morgen.' : 'Das nimmst du dir heute vor. Die Reihenfolge bestimmst du; im Board ist es die Spalte „Fokus“.',
      empty: fList.length === 0,
      rows: fList.map((id, i) => { const x = TASK[id], mv2 = d => () => { const o = fList.slice(), j = i + d; if (j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; this.setState({ fSort: o }); };
        return { rank: i + 1, title: x.title, proj: x.proj, est: estOf(x).toLocaleString('de-DE') + ' h', chip: this.chip(this.taskStatus(x), t, accent), dueLabel: this.dueLabel(x), open: () => this.openTask(id, 'arbeit'),
          up: mv2(-1), down: mv2(1), upOp: i === 0 ? '0.35' : '1', downOp: i === fList.length - 1 ? '0.35' : '1', upLabel: x.title + ' nach oben', downLabel: x.title + ' nach unten',
          done: () => this.toggleDone(id), out: () => this.toggleFocus(id), outLabel: 'Aus dem Fokus nehmen: ' + x.title }; }),
      hasSug: sugF.length > 0, sugText: sugF.length + (sugF.length === 1 ? ' überfällige Aufgabe ist' : ' überfällige Aufgaben sind') + ' nicht im Fokus: ' + sugF.map(x => x.title).join(', '),
      addSug: () => { const bk = Object.assign({}, s.bk); sugF.forEach(x => { bk[x.id] = 'Fokus'; }); this.setState({ bk }); }
    };


    // Mein Tag: Outlook-Termine und eingeplante Aufgaben auf einer Zeitachse
    const OUTLOOK = {
      '2026-11-13': [['08:00', 0.5, 'Schichtübergabe Halle 2', 'Halle 2'], ['09:30', 0.5, 'Daily SM42', 'Teams-Besprechung'], ['10:00', 2, 'Fokuszeit', 'Serientermin, Kategorie Fokuszeit', 'fokus'], ['12:00', 0.5, 'Mittagspause', '', 'pause'], ['13:00', 1.5, 'Abstimmung Lieferant Servoantriebe', 'Besprechungsraum 2'], ['15:30', 0.5, '1:1 mit H. Lorenz', 'Teams-Besprechung']],
      '2026-11-16': [['09:00', 1.5, 'Gate-Review G2', 'mit Geschäftsführung'], ['10:00', 2, 'Fokuszeit', 'Serientermin, Kategorie Fokuszeit', 'fokus'], ['12:00', 0.5, 'Mittagspause', '', 'pause'], ['14:00', 1, 'Safety-Unterweisung', 'Schulungsraum 1']] };
    const DAYS2 = [['2026-11-13', 'Heute, Fr 13.11.'], ['2026-11-16', 'Mo 16.11.']];
    const dIso = s.daySel || '2026-11-13', isToday = dIso === '2026-11-13', H0 = 7, H1 = 16, PX = 52, NOW = 9;
    const tnum = v => { const [h, m] = v.split(':').map(Number); return h + m / 60; };
    const hhmm = v => String(Math.floor(v)).padStart(2, '0') + ':' + (v % 1 ? '30' : '00');
    const fmtH2 = v => (Math.round(v * 10) / 10).toLocaleString('de-DE') + ' h';
    const fokusFree = s.cal.fokusFree !== false, isFok = (title, kind) => kind === 'fokus' || /fokus|focus|blocker/i.test(title);
    const evAll = (OUTLOOK[dIso] || []).map(([st, h, title, where, kind]) => ({ start: tnum(st), h, title, where, kind: isFok(title, kind) && fokusFree ? 'fokus' : (kind === 'fokus' ? 'termin' : (kind || 'termin')) }));
    const evs = evAll.filter(e => e.kind !== 'fokus'), fokEv = evAll.filter(e => e.kind === 'fokus');
    const inFokus = (a, h) => fokEv.some(f => a >= f.start && a + h <= f.start + f.h);
    const dPlan = ((s.dayPlan || {})[dIso] || []).filter(p => TASK[p.id]);
    const clash = (a, h, skipId, plan) => { const e = evs.find(x => a < x.start + x.h && a + h > x.start); if (e) return e.title; const q = (plan || dPlan).find(p => p.id !== skipId && a < p.start + p.h && a + h > p.start); return q ? TASK[q.id].title : null; };
    const needOf = id => Math.max(0.5, Math.min(4, Math.ceil(estOf(TASK[id]) * 2) / 2));
    // Übertrag: an anderen Tagen eingeplant? Dann hier nur zeigen, wenn dort nicht geschafft oder ein Rest offen ist.
    const nowOf = iso => (iso < '2026-11-13' ? 99 : (iso === '2026-11-13' ? NOW : -1));
    const elsewhere = id => { let info = null; Object.keys(s.dayPlan || {}).filter(d => d !== dIso).forEach(d => (s.dayPlan[d] || []).filter(p => p.id === id).forEach(p => { info = info || []; info.push(Object.assign({ day: d }, p)); })); return info; };
    const carry = id => { const ps = elsewhere(id); if (!ps) return { show: true, note: '' }; if (ps.some(p => p.day > dIso)) return { show: false };
      if (this.isDone(TASK[id])) return { show: false };
      const dayL = d => (DAYS2.find(x => x[0] === d) || [d, fmt(D(d))])[1].replace('Heute, ', '');
      const missed = ps.filter(p => p.start + p.h <= nowOf(p.day)), planned = ps.reduce((a, p) => a + p.h, 0), rest = needOf(id) - planned;
      if (missed.length) return { show: true, note: '↻ ' + dayL(missed[0].day) + ' ' + hhmm(missed[0].start) + '–' + hhmm(missed[0].start + missed[0].h) + ' nicht geschafft', rest: null };
      if (rest > 0) return { show: true, note: '↻ Rest ' + fmtH2(rest) + ' von ' + dayL(ps[0].day), rest };
      return { show: false }; };
    const hOf = id => { const old = dPlan.find(p => p.id === id); if (old) return old.h; const c = carry(id); return c && c.rest ? c.rest : needOf(id); };
    const firstFree = (h, plan, skipId) => { const st0 = isToday ? NOW : H0, cand = []; for (let a = st0; a + h <= H1; a += 0.5) cand.push(a); const pref = cand.filter(a => fokEv.some(f => a < f.start + f.h && a + h > f.start)); for (const a of pref.concat(cand)) if (!clash(a, h, skipId, plan)) return a; return null; };
    const bestGap = (plan, skipId) => { let best = null; for (let a = isToday ? NOW : H0; a + 0.5 <= H1; a += 0.5) { if (clash(a, 0.5, skipId, plan)) continue; let h = 0.5; while (a + h + 0.5 <= H1 && !clash(a, h + 0.5, skipId, plan)) h += 0.5; if (!best || h > best.h) best = { a, h }; } return best; };
    const setPlan = (list, msg) => this.setState({ dayPlan: Object.assign({}, this.state.dayPlan, { [dIso]: list }), dayMsg: msg });
    const placeAt = (id, a) => { const x = TASK[id]; if (!x) return; const h = hOf(id);
      if (a + h > H1) return this.setState({ dayMsg: '„' + x.title + '“ braucht ' + fmtH2(h) + ' und passt ab ' + hhmm(a) + ' nicht mehr in den Tag.' });
      if (isToday && a < NOW) return this.setState({ dayMsg: 'Es ist schon nach ' + hhmm(a) + '. Wähle eine spätere Zeit.' });
      const c = clash(a, h, id); if (c) return this.setState({ dayMsg: hhmm(a) + '–' + hhmm(a + h) + ' überschneidet sich mit „' + c + '“. Nimm eine andere Zeit oder plane die Aufgabe kürzer.' });
      setPlan(dPlan.filter(p => p.id !== id).concat([{ id, start: a, h }]), '„' + x.title + '“ von ' + hhmm(a) + ' bis ' + hhmm(a + h) + ' eingeplant.'); };
    const placeAuto = id => { const rest = dPlan.filter(p => p.id !== id), a = firstFree(hOf(id), rest, id); if (a !== null) return placeAt(id, a);
      const g = bestGap(rest, id); if (!g) return this.setState({ dayMsg: 'Heute ist keine Zeit mehr frei für „' + TASK[id].title + '“. Plane sie auf Montag.' });
      setPlan(rest.concat([{ id, start: g.a, h: g.h }]), '„' + TASK[id].title + '“ braucht ' + fmtH2(hOf(id)) + ', am Stück frei sind nur ' + fmtH2(g.h) + ': ' + hhmm(g.a) + '–' + hhmm(g.a + g.h) + ' eingeplant, den Rest am Montag.'); };
    const fokH = fokEv.reduce((a, f) => a + f.h - evs.filter(e => e.start < f.start + f.h && e.start + e.h > f.start).reduce((x, e) => x + Math.min(e.start + e.h, f.start + f.h) - Math.max(e.start, f.start), 0), 0);
    const evH = evs.reduce((a, e) => a + e.h, 0), plH = dPlan.reduce((a, p) => a + p.h, 0), dayLeft = Math.max(0, H1 - (isToday ? NOW : H0) - evs.filter(e => e.start >= (isToday ? NOW : H0)).reduce((a, e) => a + e.h, 0) - dPlan.reduce((a, p) => a + p.h, 0));
    const unplF = fList.filter(id => !dPlan.some(p => p.id === id)), needF = unplF.reduce((a, id) => a + hOf(id), 0);
    const carriedIds = Object.keys(s.dayPlan || {}).filter(d => d < dIso).reduce((a, d) => a.concat((s.dayPlan[d] || []).map(p => p.id)), []);
    const dayCands = Array.from(new Set(fList.concat(TASKS.filter(x => x.mine && !x.story && !x.kb && !this.isDone(x) && D(x.due) <= D(dIso) && !fList.includes(x.id)).map(x => x.id)).concat(carriedIds)))
      .filter(id => TASK[id] && !this.isDone(TASK[id]) && !dPlan.some(p => p.id === id) && carry(id).show);
    // Lücken nach dem Gesetzten, und KI-Vorschläge aus dem Backlog
    const gaps = []; { let a = isToday ? NOW : H0; while (a < H1) { if (clash(a, 0.5)) { a += 0.5; continue; } let h = 0.5; while (a + h < H1 && !clash(a + h, 0.5)) h += 0.5; gaps.push({ a, h }); a += h; } }
    const PRIO_W = { Hoch: 0, Mittel: 1, Niedrig: 2 };
    const pool = TASKS.filter(x => x.mine && !x.story && !x.kb && !this.isDone(x) && !dayCands.includes(x.id) && !dPlan.some(p => p.id === x.id) && !elsewhere(x.id) && !fList.includes(x.id))
      .sort((p1, p2) => (PRIO_W[p1.prio] - PRIO_W[p2.prio]) || (D(p1.due) - D(p2.due)));
    const usedS = new Set();
    const kiSug = gaps.filter(g => g.h >= 0.5).slice(0, 3).map(g => { const gk = dIso + '|' + g.a, skip = (s.kiSkip || {})[gk] || [];
      const fit = pool.filter(x => !usedS.has(x.id) && !skip.includes(x.id)), best = fit.find(x => needOf(x.id) <= g.h) || fit[0]; if (!best) return null; usedS.add(best.id);
      const h = Math.min(needOf(best.id), g.h), dd2 = Math.round((D(best.due) - D(dIso)) / 86400000);
      return { gap: hhmm(g.a) + '–' + hhmm(g.a + g.h) + (inFokus(g.a, g.h) ? ' · deine Fokuszeit' : ' frei') + ' (' + fmtH2(g.h) + ')', title: best.title, why: (dd2 < 0 ? 'überfällig' : 'fällig in ' + dd2 + ' Tagen') + ' · Priorität ' + best.prio + ' · ' + (needOf(best.id) <= g.h ? 'passt mit ' + fmtH2(needOf(best.id)) + ' hinein' : 'braucht ' + fmtH2(needOf(best.id)) + ', ' + fmtH2(h) + ' davon heute') + ' · ' + best.proj,
        take: () => setPlan(dPlan.concat([{ id: best.id, start: g.a, h }]), 'KI-Vorschlag übernommen: „' + best.title + '“ ' + hhmm(g.a) + '–' + hhmm(g.a + h) + '.'),
        other: () => this.setState({ kiSkip: Object.assign({}, s.kiSkip, { [gk]: skip.concat([best.id]) }) }) }; }).filter(Boolean);
    const slots = []; for (let a = H0; a < H1; a += 0.5) { const key = 'dy|' + a, hot = s.dragOver === key, past = isToday && a < NOW;
      slots.push({ top: ((a - H0) * PX) + 'px', line: a % 1 ? 'dashed' : 'solid', bg: hot ? t.soft : (past ? t.surface2 : 'transparent'), aria: hhmm(a),
        over: this.dragOver(key), drop: this.dropOn(key, id => { if (typeof id === 'string' && id.indexOf('dp:') === 0) placeAt(id.slice(3), a); }), click: () => { if (s.daySel2) { placeAt(s.daySel2, a); this.setState({ daySel2: null }); } } }); }
    const fokBands = fokEv.map(f => ({ title: '🎯 Fokuszeit · Platz für Aufgaben', sub: hhmm(f.start) + '–' + hhmm(f.start + f.h) + ' · aus Outlook, für andere als beschäftigt', top: ((f.start - H0) * PX + 1) + 'px', h: (f.h * PX - 2) + 'px',
      bg: this.props.dark ? '#1F3B2A' : '#E7F5EA', fg: this.props.dark ? '#BFE6C8' : '#0E4F0E', edge: GREEN, isTask: false, isPast: false, done: () => {}, draggable: 'false', drag: () => {}, dragEnd: () => {}, cursor: 'default', shorter: () => {}, longer: () => {}, remove: () => {}, open: () => {}, aria: 'Fokuszeit', pe: 'none', left: '0px', z: '0', bstyle: 'dashed' }));
    const blocks = fokBands.concat(evs.map(e => ({ title: (e.kind === 'pause' ? '' : '📅 ') + e.title, sub: e.kind === 'pause' ? hhmm(e.start) + '–' + hhmm(e.start + e.h) : hhmm(e.start) + '–' + hhmm(e.start + e.h) + (e.where ? ' · ' + e.where : '') + ' · Outlook',
        top: ((e.start - H0) * PX + 1) + 'px', h: (e.h * PX - 2) + 'px', bg: e.kind === 'pause' ? t.track : (this.props.dark ? '#3B3A4A' : '#E8E6F4'), fg: t.text, edge: e.kind === 'pause' ? t.strong : '#5B2D90',
        isTask: false, isPast: false, done: () => {}, draggable: 'false', drag: () => {}, dragEnd: () => {}, cursor: 'default', shorter: () => {}, longer: () => {}, remove: () => {}, open: () => {}, aria: e.title, pe: 'auto', left: '6px', z: '1', bstyle: 'solid' })))
      .concat(dPlan.map(p => { const x = TASK[p.id], ts = this.taskStatus(x);
        const resize = d => () => { const nh = Math.max(0.5, p.h + d); if (p.start + nh > H1) return this.setState({ dayMsg: 'Länger geht nicht, der Arbeitstag endet um ' + hhmm(H1) + '.' }); const c = clash(p.start, nh, p.id); if (c) return this.setState({ dayMsg: 'Länger geht nicht, danach kommt „' + c + '“.' }); setPlan(dPlan.map(q => q.id === p.id ? Object.assign({}, q, { h: nh }) : q), '„' + x.title + '“ jetzt ' + hhmm(p.start) + '–' + hhmm(p.start + nh) + ' (' + (d > 0 ? '+' : '−') + '30 Min., ' + fmtH2(nh) + ').'); };
        const past = isToday && p.start + p.h <= NOW && ts !== 'erledigt';
        return { isPast: past, done: () => this.toggleDone(p.id), title: (this.bucketOf(x) === 'Fokus' ? '★ ' : '') + x.title, sub: hhmm(p.start) + '–' + hhmm(p.start + p.h) + ' (' + fmtH2(p.h) + ')' + (past ? ' · vorbei, nicht erledigt' : '') + ' · ' + x.proj, top: ((p.start - H0) * PX + 1) + 'px', h: (p.h * PX - 2) + 'px',
          bg: ts === 'erledigt' ? GREEN : (past ? '#A33F06' : accent), fg: '#FFFFFF', edge: ts === 'ueberfaellig' ? RED : '#0C3B5E', isTask: true, draggable: 'true', drag: this.dragStart('dp:' + p.id), dragEnd: this.dragEnd(), cursor: 'grab',
          pe: 'auto', left: '6px', z: '2', bstyle: 'solid', shorter: resize(-0.5), longer: resize(0.5), remove: () => setPlan(dPlan.filter(q => q.id !== p.id), '„' + x.title + '“ wieder ausgeplant.'), open: () => this.openTask(p.id, 'arbeit'), aria: x.title }; }));
    const dy = {
      kiOpen: !!s.dyKi, kiOpenA: s.dyKi ? 'true' : 'false', kiBtn: s.dyKi ? '💡 Vorschläge ausblenden' : '💡 Vorschläge für freie Lücken', kiToggle: () => this.setState({ dyKi: !this.state.dyKi }),
      days: DAYS2.map(([iso, label]) => ({ label, pressed: dIso === iso ? 'true' : 'false', ring: dIso === iso ? accent : t.border, bg: dIso === iso ? t.soft : t.surface, go: () => this.setState({ daySel: iso, dayMsg: '' }) })),
      H: ((H1 - H0) * PX) + 'px', hours: Array.from({ length: (H1 - H0) * 2 + 1 }, (_, i) => ({ label: i % 2 ? ':30' : hhmm(H0 + i / 2), top: (i * PX / 2 - 7) + 'px', fs: i % 2 ? '10px' : '11px', op: i % 2 ? '0.6' : '1' })), slots, blocks,
      showNow: isToday, nowTop: ((NOW - H0) * PX) + 'px',
      stats: 'Termine ' + fmtH2(evH) + (fokEv.length ? ' · Fokuszeit ' + fmtH2(fokH) + ' (frei für Aufgaben)' : '') + ' · eingeplant ' + fmtH2(plH) + ' · noch frei ' + fmtH2(dayLeft),
      fitText: !unplF.length ? (fList.length ? '✓ Alle Fokusaufgaben haben eine Zeit.' : 'Noch nichts im Fokus. Ziehe Aufgaben hierher oder setze sie mit ★ in den Fokus.')
        : (needF > dayLeft ? '! Dein Fokus braucht noch ' + fmtH2(needF) + ', frei sind nur ' + fmtH2(dayLeft) + '. Nimm etwas aus dem Fokus oder plane es auf Montag.' : 'Noch ' + unplF.length + ' Fokusaufgaben (' + fmtH2(needF) + ') ohne Zeit. Platz ist da: ' + fmtH2(dayLeft) + ' frei.'),
      fitColor: unplF.length && needF > dayLeft ? RED : (unplF.length ? t.text : GREEN), fitBd: unplF.length && needF > dayLeft ? RED : t.border,
      hasMsg: !!s.dayMsg, msg: s.dayMsg || '',
      todo: dayCands.map(id => { const x = TASK[id], inFo = fList.includes(id), cr = carry(id); return { title: x.title, note: cr.note || '', hasNote: !!cr.note, sub: (inFo ? '★ Fokus · ' : 'fällig ' + fmt(D(x.due)) + ' · ') + fmtH2(hOf(id)) + ' · ' + x.proj, ring: s.daySel2 === id ? accent : (inFo ? accent : t.border), bg: s.daySel2 === id ? t.soft : t.surface,
        drag: this.dragStart('dp:' + id), dragEnd: this.dragEnd(), pick: () => this.setState({ daySel2: s.daySel2 === id ? null : id, dayMsg: s.daySel2 === id ? '' : 'Jetzt eine Uhrzeit in der Zeitachse anklicken.' }), auto: () => placeAuto(id), autoLabel: 'Nächste freie Zeit für ' + x.title }; }),
      hasTodo: dayCands.length > 0, noTodo: dayCands.length === 0, kiSug, hasKi: kiSug.length > 0, noKi: kiSug.length === 0, kiNote: gaps.length ? 'Gesetzt sind deine Fokus- und fälligen Aufgaben. Für die restlichen Lücken schlägt die KI auf dem Cockpit-Server Aufgaben aus deinem Backlog vor.' : 'Der Tag ist voll, keine Lücke mehr frei.',
      autoAll: () => { let plan = dPlan.slice(); const miss = [], cut = []; unplF.forEach(id => { const h = hOf(id), a = firstFree(h, plan, id); if (a !== null) { plan = plan.concat([{ id, start: a, h }]); return; }
          const g = bestGap(plan, id); if (g) { plan = plan.concat([{ id, start: g.a, h: g.h }]); cut.push(TASK[id].title + ' (' + fmtH2(g.h) + ' von ' + fmtH2(h) + ')'); } else miss.push(TASK[id].title); });
        if (!unplF.length) return this.setState({ dayMsg: 'Alle Fokusaufgaben haben schon eine Zeit.' });
        setPlan(plan, (unplF.length - miss.length) + ' Fokusaufgaben in freie Zeiten gelegt, Fokuszeit zuerst.' + (cut.length ? ' Gekürzt, Rest am Montag: ' + cut.join(', ') + '.' : '') + (miss.length ? ' Kein Platz mehr für: ' + miss.join(', ') + '.' : '')); },
      toOutlook: () => this.setState({ dayMsg: dPlan.length ? dPlan.length + ' Blöcke würden als „Fokuszeit“ in deinen Outlook-Kalender eingetragen. Kollegen sähen dich dort als beschäftigt, Inhalte bleiben privat. (Vorschau: simuliert, hier ist kein Outlook angebunden.)' : 'Noch nichts eingeplant.' })
    };


    // Besprechungen: Mitschrift → Protokoll → Aufgaben
    const MTG = [
      { id: 'mt1', day: '2026-11-13', time: '09:30', title: 'Daily SM42', proj: 'SM42 Schraubstation', who: ['Du', 'T. Brandt', 'L. Wagner', 'S. Keller'], agenda: [], notes: '' },
      { id: 'mt2', day: '2026-11-13', time: '13:00', title: 'Abstimmung Lieferant Servoantriebe', proj: 'SM42 Schraubstation', who: ['Du', 'T. Brandt', 'H. Lorenz', 'Rexroth (extern)'], agenda: ['Liefertermin AB 2026-118', 'Mehrpreis 6 %', 'Inbetriebnahme und Doku'],
        notes: 'Liefertermin laut AB 2026-118 bestätigt: KW 50\nBeschluss: Servo-Inbetriebnahme erst nach dem FAT\nT. Brandt passt Stromlaufplan =S1 an bis 20.11.\nDu klärst den Mehrpreis 6 % mit dem Einkauf bis 18.11.\nRexroth schickt die Inbetriebnahme-Doku bis 27.11.\nH. Lorenz gibt die Nachtragsbestellung frei' },
      { id: 'mt3', day: '2026-11-13', time: '15:30', title: '1:1 mit H. Lorenz', proj: 'Ohne Projekt', who: ['Du', 'H. Lorenz'], agenda: ['Auslastung KW 47–49', 'Schulung Safety'], notes: '' },
      { id: 'mt4', day: '2026-11-16', time: '09:00', title: 'Gate-Review G2', proj: 'SM42 Schraubstation', who: ['Du', 'Geschäftsführung', 'T. Brandt', 'L. Wagner'], agenda: ['Checkliste G2 (4 von 5)', 'Stromlaufplan offen', 'Entscheidung'], notes: '' }];
    const mtP = s.mtProt || {}, mtN = s.mtNotes || {}, mtCur = MTG.find(m => m.id === s.mtSel) || MTG[1];
    const notesOf = m => (mtN[m.id] !== undefined ? mtN[m.id] : m.notes);
    const parseDue = (line) => { const mm = line.match(/bis\s+(\d{1,2})\.(\d{1,2})\./); if (!mm) return null; const mo = +mm[2]; return (mo >= 11 ? '2026' : '2027') + '-' + String(mo).padStart(2, '0') + '-' + String(+mm[1]).padStart(2, '0'); };
    const parseProt = m => { const dec = [], info = [], acts = [];
      notesOf(m).split('\n').map(l => l.trim().replace(/^[-•*]\s*/, '')).filter(Boolean).forEach(l => {
        if (/^(beschluss|entschieden|vereinbart)\s*:?/i.test(l)) return dec.push(l.replace(/^(beschluss|entschieden|vereinbart)\s*:?\s*/i, ''));
        const who = m.who.concat(Object.keys(AV).filter(n => !m.who.includes(n))).find(p => l.indexOf(p) === 0 || l.indexOf(p.split(' ')[0]) === 0 || (p.indexOf(' ') > 0 && l.indexOf(p.split(' ').pop()) >= 0 && l.indexOf(p.split(' ').pop()) < 12));
        const due = parseDue(l);
        if (due || (who && /\b(macht|klärt|schickt|passt|gibt|prüft|erstellt|bestellt|liefert|übernimmt|frei)\b/i.test(l))) {
          const txt = l.replace(/\s*bis\s+\d{1,2}\.\d{1,2}\.?/, '');
          acts.push({ text: txt.charAt(0).toUpperCase() + txt.slice(1), who: who || 'Du', due: due || addDaysIso(m.day, 7), task: null });
        } else info.push(l); });
      return { dec, info, acts, sent: false }; };
    const addDaysIso = (iso, n) => { const x = D(iso); x.setDate(x.getDate() + n); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
    const setProt = (id, pr, msg) => this.setState({ mtProt: Object.assign({}, this.state.mtProt, { [id]: pr }), mtMsg: msg === undefined ? this.state.mtMsg : msg });
    const prot = mtP[mtCur.id] || null;
    const mkTask = (m, a) => { const ext = /extern|Geschäftsführung/.test(a.who), owner = ext ? 'Du' : a.who, id = 'mtk' + (s.rev || 0) + '_' + TASKS.length;
      const x = { id, title: (ext ? a.who.replace(' (extern)', '') + ': ' : '') + (a.text || 'Maßnahme'), proj: m.proj, due: a.due, bucket: 'Backlog', prio: 'Mittel', owner, mine: owner === 'Du', ms: null, desc: 'Aus Besprechung „' + m.title + '“ am ' + fmt(D(m.day)) + (ext ? ' · extern, Erinnerung bei dir' : ''), est: 2, co: [] };
      TASKS.push(x); TASK[id] = x; return id; };
    const mt = {
      list: MTG.map(m => { const on = m.id === mtCur.id, p2 = mtP[m.id], open = p2 ? p2.acts.filter(a => !a.task).length : 0;
        return { title: m.title, when: (m.day === '2026-11-13' ? 'heute ' : fmt(D(m.day)) + ' ') + m.time + (m.proj !== 'Ohne Projekt' ? ' · ' + m.proj : ''), pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface,
          status: !p2 ? (notesOf(m) ? 'Mitschrift vorhanden, noch kein Protokoll' : (m.day > '2026-11-13' ? 'Steht noch an · Tagesordnung bereit' : 'Noch keine Mitschrift')) : (p2.sent ? '✓ Protokoll versendet' : 'Protokoll im Entwurf') + (open ? ' · ' + open + ' Maßnahmen offen' : ''),
          stColor: p2 && p2.sent ? GREEN : (p2 ? '#A33F06' : t.muted), go: () => this.setState({ mtSel: m.id, mtMsg: '' }) }; }),
      hasMsg: !!s.mtMsg, msg: s.mtMsg || '',
      cur: { title: mtCur.title, when: fmt(D(mtCur.day)) + ' ' + mtCur.time, proj: mtCur.proj, people: mtCur.who.map(n => ({ name: n, ini: ini(n.replace(' (extern)', '')), av: AV[n] || '#5C5C5C' })),
        hasAgenda: mtCur.agenda.length > 0, agenda: mtCur.agenda, notes: notesOf(mtCur), ph: 'z. B. „Beschluss: …“, „L. Wagner prüft Greifer bis 24.11.“',
        setNotes: e => this.setState({ mtNotes: Object.assign({}, this.state.mtNotes, { [mtCur.id]: e && e.target ? e.target.value : '' }) }),
        ki: () => { if (!notesOf(mtCur).trim()) return this.setState({ mtMsg: 'Erst etwas mitschreiben, dann macht die KI daraus ein Protokoll.' }); const pr = parseProt(mtCur); const keep = prot ? prot.acts.filter(a => a.task) : [];
          setProt(mtCur.id, Object.assign(pr, { acts: keep.concat(pr.acts.filter(a => !keep.some(k => k.text === a.text))) }), '✨ Protokoll erstellt: ' + pr.dec.length + ' Beschlüsse, ' + pr.acts.length + ' Maßnahmen, ' + pr.info.length + ' Informationen. Prüfe Wer und Bis, dann als Aufgaben anlegen.'); },
        addAct: () => { const p0 = prot || { dec: [], info: [], acts: [], sent: false }; setProt(mtCur.id, Object.assign({}, p0, { acts: p0.acts.concat([{ text: '', who: 'Du', due: addDaysIso(mtCur.day, 7), task: null }]) }), ''); },
        hasProt: !!prot, hasDec: !!prot && prot.dec.length > 0, dec: prot ? prot.dec : [], hasInfo: !!prot && prot.info.length > 0, info: prot ? prot.info : [],
        acts: (prot ? prot.acts : []).map((a, ai) => { const upd = patch => { const p0 = this.state.mtProt[mtCur.id]; const acts = p0.acts.map((z, k) => (k === ai ? Object.assign({}, z, patch) : z)); setProt(mtCur.id, Object.assign({}, p0, { acts })); };
          return { text: a.text, who: a.who, due: a.due, open: !a.task, done: !!a.task, setText: e => upd({ text: e && e.target ? e.target.value : '' }), setDue: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) upd({ due: v }); },
            whos: mtCur.who.concat(mtCur.who.includes(a.who) ? [] : [a.who]).map(n => ({ label: n === 'Du' ? 'ich' : n, pressed: a.who === n ? 'true' : 'false', ring: a.who === n ? accent : t.border, bg: a.who === n ? t.soft : t.surface, go: () => upd({ who: n }) })),
            create: () => { const id = mkTask(mtCur, a); upd({ task: id }); this.setState({ rev: (this.state.rev || 0) + 1, mtMsg: '„' + (a.text || 'Maßnahme') + '“ ist jetzt eine Aufgabe für ' + (/extern|Geschäftsführung/.test(a.who) ? 'dich (Erinnerung an ' + a.who + ')' : a.who) + ', fällig ' + fmt(D(a.due)) }); },
            del: () => { const p0 = this.state.mtProt[mtCur.id]; setProt(mtCur.id, Object.assign({}, p0, { acts: p0.acts.filter((z, k) => k !== ai) })); }, openTask: () => this.openTask(a.task, 'arbeit') }; }),
        allTasks: () => { const p0 = this.state.mtProt[mtCur.id]; if (!p0) return; let n = 0; const acts = p0.acts.map(a => { if (a.task) return a; n++; return Object.assign({}, a, { task: mkTask(mtCur, a) }); });
          this.setState({ rev: (this.state.rev || 0) + 1, mtProt: Object.assign({}, this.state.mtProt, { [mtCur.id]: Object.assign({}, p0, { acts }) }), mtMsg: n ? n + ' Aufgaben angelegt. Alle Beteiligten haben sie sofort in Meine Arbeit, im Projekt ohne Annahme.' : 'Alle Maßnahmen sind schon Aufgaben.' }); },
        canProj: !!PK_OF[mtCur.proj], toProj: () => { const p0 = this.state.mtProt[mtCur.id], pk = PK_OF[mtCur.proj]; if (!p0 || !pk) return; const day = fmt(D(mtCur.day)), src = mtCur.title + ' ' + day;
          const OP = ((this.state.oplBy || {})[pk]) || OPL_SEED[pk] || [], DC = ((this.state.decBy || {})[pk]) || DEC_SEED[pk] || [];
          const nOP = p0.acts.filter(a => !a.task && a.text && !OP.some(o => o.t === a.text)).map((a, i) => ({ id: 'OP-' + String(OP.length + i + 1).padStart(2, '0'), t: a.text, who: a.who, due: a.due, st: 'offen', src }));
          const nDC = p0.dec.filter(d => !DC.some(x => x.t === d)).map((d, i) => ({ id: 'E-' + String(DC.length + i + 1).padStart(2, '0'), t: d, why: '', by: mtCur.who.slice(0, 3).join(', '), d: day, src }));
          this.setState({ oplBy: Object.assign({}, this.state.oplBy, { [pk]: OP.concat(nOP) }), decBy: Object.assign({}, this.state.decBy, { [pk]: DC.concat(nDC) }), mtMsg: nOP.length + ' offene Punkte und ' + nDC.length + ' Entscheidungen in „' + mtCur.proj + '“ übernommen (Reiter Offene Punkte).' + (!nOP.length && !nDC.length ? ' Alles war schon drin.' : '') }); },
        send: () => { const p0 = this.state.mtProt[mtCur.id]; setProt(mtCur.id, Object.assign({}, p0, { sent: true }), 'Protokoll würde an ' + (mtCur.who.length - 1) + ' Teilnehmer gemailt und unter ' + (mtCur.proj === 'Ohne Projekt' ? 'Meine Dokumente' : 'Projekt › Dokumente') + ' abgelegt. (Vorschau: simuliert, hier ist kein Outlook angebunden.)'); } } };

    // Benachrichtigungen
    const ntRead = s.ntfRead || {};
    const NTF = [
      ['n1', 'mention', '@', 'T. Brandt hat dich erwähnt: „Bitte bis Montag freigeben.“', 'Review Stromlaufplan =S1', 'vor 20 Min.', () => this.openTask('t1', 'start')],
      ['n2', 'freigabe', '✔', 'Freigabe nötig: Rechnung Bosch Rexroth 18.400 €', 'SM42 · wartet seit 2 Tagen', 'vor 1 Std.', () => this.setState({ screen: 'eingang', panel: null })],
      ['n3', 'frist', '⏰', 'Morgen fällig: SPS-Update Presse 3 einspielen', 'Team Automatisierung', 'vor 2 Std.', () => this.setState({ screen: 'teams', team: 'automatisierung', panel: null })],
      ['n4', 'frist', '◈', 'Gate G3 in 14 Tagen: Checkliste 2 von 5 erfüllt', 'SM42 Schraubstation', 'heute 07:00', () => this.setState({ screen: 'projekt', proj: 'sm42', ptab: 'planung', panel: null })],
      ['n5', 'info', '🎓', 'K. Weber: Schaltberechtigung läuft in 15 Tagen ab', 'Team Instandhaltung', 'heute 07:00', () => this.setState({ screen: 'teams', team: 'instandhaltung', panel: null })],
      ['n6', 'info', '✨', 'Die KI hat 3 neue Entwürfe vorbereitet', 'Posteingang', 'gestern', () => this.setState({ screen: 'eingang', panel: null })]]
      .concat(s.ko && s.ko.status !== 'durchgefuehrt' ? [['nko', 'frist', '🚀', 'Kick-off Teileerkennung Linie 3: ' + (s.ko.invited ? 'Termin ' + fmt(D(s.ko.date)) + ' ' + s.ko.time : 'noch kein Termin, Pflicht bis ' + fmt(D(s.ko.due))), 'Projektleitung ' + s.ko.pl, 'gerade eben', () => this.setState({ screen: 'kickoff', panel: null })]] : [])
      .concat(s.sent.filter(x => x.status === 'team' && x.tq && s.tplan[x.tq]).map((x, k) => ['nt' + x.tq, 'info', '👥', x.boss + ' hat „' + x.title + '“ an ' + s.tplan[x.tq].who + ' gegeben', 'für ' + s.tplan[x.tq].iso.slice(8, 10) + '.' + s.tplan[x.tq].iso.slice(5, 7) + '.', 'gerade eben', () => this.setState({ screen: 'teams', team: Object.keys(TEAMS).find(k2 => 'Team ' + TEAMS[k2].name === x.who) || 'automatisierung', panel: null })]));
    const nf = s.ntfF || 'alle', NTFF = [['alle', 'Alle'], ['mention', '@ Erwähnungen'], ['freigabe', 'Freigaben'], ['frist', 'Fristen']];
    const ntfUnread = NTF.filter(x => !ntRead[x[0]]).length;
    const ntfItems = NTF.filter(x => nf === 'alle' || x[1] === nf);
    const ntf = { open: !!s.ntfOpen, openA: s.ntfOpen ? 'true' : 'false', toggle: () => this.setState({ ntfOpen: !s.ntfOpen }), has: ntfUnread > 0, count: String(ntfUnread), btnBg: s.ntfOpen ? t.soft : t.surface,
      allRead: () => { const r = {}; NTF.forEach(x => { r[x[0]] = true; }); this.setState({ ntfRead: r }); }, settings: () => this.setState({ screen: 'profil', panel: null, ntfOpen: false }),
      filters: NTFF.map(([k, l]) => ({ label: l, pressed: nf === k ? 'true' : 'false', ring: nf === k ? accent : t.border, bg: nf === k ? t.soft : t.surface, go: () => this.setState({ ntfF: k }) })),
      items: ntfItems.map(([id, kind, icon, text, sub, time, go]) => ({ icon, text, sub, time, unread: !ntRead[id], fw: ntRead[id] ? '400' : '700', bg: ntRead[id] ? 'transparent' : t.soft,
        go: () => { this.setState({ ntfRead: Object.assign({}, this.state.ntfRead, { [id]: true }), ntfOpen: false }); go(); } })), none: ntfItems.length === 0 };

    // Start-Dashboard: Kacheln ziehen, Größe ändern, ausblenden
    const DKEYS = ['aufgaben', 'fokus', 'eingang', 'projekte', 'last', 'woche'];
    const DTITLE = { aufgaben: 'Meine Aufgaben', fokus: 'Mein Fokus heute', eingang: 'Posteingang', projekte: 'Meine Projekte', last: 'Meine Auslastung', woche: 'Die nächsten 5 Arbeitstage' };
    const DSIZES = [['1 1 300px', 'schmal'], ['2 1 460px', 'mittel'], ['3 1 620px', 'breit'], ['1 1 100%', 'ganze Breite']];
    const DSIZE0 = { aufgaben: 0, fokus: 0, eingang: 0, projekte: 2, last: 0, woche: 2 };
    const noop = () => {};
    const DHS = [['auto', 'auto', 'visible', 'auto'], ['260px', 'auto', 'auto', 'kompakt'], ['none', '480px', 'visible', 'hoch']];
    const visOrder = () => s.dOrder.filter(x => !s.dHidden[x] && (DKEYS.includes(x) || (s.dExtra || []).includes(x)));
    const dMove = (k, d) => () => { const v = visOrder(), i = v.indexOf(k), j = i + d; if (i < 0 || j < 0 || j >= v.length) return; const o = s.dOrder.slice(), a = o.indexOf(k), b = o.indexOf(v[j]); o[a] = v[j]; o[b] = k; this.setState({ dOrder: o, dashMsg: '' }); };
    const dCommon = k => { const hi = (s.dH || {})[k] || 0; return { left: dMove(k, -1), right: dMove(k, 1), maxH: DHS[hi][0], minH: DHS[hi][1], ovf: DHS[hi][2], hLabel: DHS[hi][3], taller: () => this.setState({ dH: Object.assign({}, s.dH, { [k]: (hi + 1) % DHS.length }) }) }; };
    const dash = {};
    DKEYS.forEach(k => {
      const sz = s.dSize[k] !== undefined ? s.dSize[k] : DSIZE0[k], hot = s.dragOver === 'dash|' + k;
      const setSize = d => () => { const o = Object.assign({}, s.dSize); o[k] = Math.max(0, Math.min(DSIZES.length - 1, sz + d)); this.setState({ dSize: o }); };
      dash[k] = { order: s.dOrder.indexOf(k), disp: s.dHidden[k] ? 'none' : 'block', flex: DSIZES[sz][0], sizeLabel: DSIZES[sz][1],
        border: hot ? '3px solid ' + accent : wBorder, draggable: 'true',
        start: e => { if (e && e.target !== e.currentTarget) return; this.dragStart('w:' + k)(e); }, over: this.dragOver('dash|' + k),
        drop: true ? this.dropOn('dash|' + k, id => { if (typeof id !== 'string' || id.indexOf('w:') !== 0) return; const from = id.slice(2); if (from === k) return; const o = s.dOrder.filter(x => x !== from); o.splice(o.indexOf(k), 0, from); this.setState({ dOrder: o }); }) : noop,
        smaller: setSize(-1), wider: setSize(1), hide: () => { const o = Object.assign({}, s.dHidden); o[k] = true; this.setState({ dHidden: o }); } };
      Object.assign(dash[k], dCommon(k));
    });
    // Zusatzkacheln mit echten Daten
    const dOpt = s.dOpt || {}, optOf = (k, d) => (dOpt[k] !== undefined ? dOpt[k] : d);
    const gates = Object.values(NODE).filter(n => (n.type === 'gate' || n.msPoint) && !n.done);
    const certAll = [].concat(...Object.keys(TEAMS).map(k => TEAMS[k].certs.map(c => ({ name: c[0], cert: c[1], until: c[2], team: TEAMS[k].name }))));
    const XW = {
      termine: { icon: '📅', title: 'Termine heute', desc: 'Outlook-Termine des Tages, Fokuszeit grün', opts: null,
        rows: () => (OUTLOOK['2026-11-13'] || []).map(([st, h, title, where, kind]) => ({ label: st + ' ' + title, sub: where + ' · ' + fmtH2(h), val: kind === 'fokus' || /fokus/i.test(title) ? 'frei für Aufgaben' : '', color: kind === 'fokus' || /fokus/i.test(title) ? GREEN : '#8764B8', go: () => this.setState({ screen: 'arbeit', arbTab: 'tag' }) })), empty: 'Heute keine Termine.' },
      teamein: { icon: '👥', title: 'Team-Eingang', desc: 'Offene Aufgaben eines Teams', optLabel: 'Team', opts: Object.keys(TEAMS).map(k => [k, TEAMS[k].name]), def: 'automatisierung',
        rows: o => TEAMS[o].inbox.concat((s.teamAdd || {})[o] || []).filter(it => !s.claimed[it.id]).map(it => ({ label: it.title, sub: it.type + ' · ' + it.needs, val: 'fällig ' + it.due, color: it.typeBg, go: () => this.setState({ screen: 'teams', team: o, tpH: 'woche', tpSel: it.id }) })), empty: '✓ Nichts offen.' },
      meilen: { icon: '◆', title: 'Meilensteine und Gates', desc: 'Was in den nächsten Tagen ansteht', optLabel: 'Zeitraum', opts: [[14, '14 Tage'], [30, '30 Tage'], [90, '90 Tage']], def: 30,
        rows: o => gates.filter(n => dd(TODAY, D(n.end)) >= -7 && dd(TODAY, D(n.end)) <= o).sort((x, y) => (x.end < y.end ? -1 : 1)).map(n => { const dl = dd(TODAY, D(n.end)); return { label: (n.msPoint ? '◆ ' : '◈ ') + n.name, sub: (n.owner || '') + ' · ' + fmt(D(n.end)), val: dl < 0 ? 'überfällig' : (dl === 0 ? 'heute' : 'in ' + dl + ' T.'), color: dl < 0 ? RED : (dl <= 7 ? '#A33F06' : accent), go: () => this.setState({ panel: { kind: 'node', id: n.id, from: 'start' }, akMsg: '' }) }; }), empty: 'Nichts in diesem Zeitraum.' },
      zert: { icon: '🎓', title: 'Zertifikate laufen ab', desc: 'Schulungen und Berechtigungen aller Teams', optLabel: 'Ablauf in', opts: [[60, '60 Tage'], [180, '6 Monate'], [365, '1 Jahr']], def: 180,
        rows: o => certAll.filter(c => dd(TODAY, D(c.until)) <= o).sort((x, y) => (x.until < y.until ? -1 : 1)).map(c => { const dl = dd(TODAY, D(c.until)); return { label: c.name + ': ' + c.cert, sub: 'Team ' + c.team, val: dl + ' Tage', color: dl <= 30 ? RED : (dl <= 60 ? '#A33F06' : GREEN), go: () => this.setState({ screen: 'teams' }) }; }), empty: 'Nichts läuft ab.' },
      kivor: { icon: '✨', title: 'KI-Vorschläge', desc: 'Entwürfe und Wissens-Vorschläge, die auf dich warten', opts: null,
        rows: () => [{ label: 'Entwürfe für Mails und Termine', sub: 'im Posteingang, einer nach dem anderen', val: '›', color: '#5B2D90', go: () => this.setState({ screen: 'eingang' }) }, { label: 'Wissen und Vorlagen pflegen', sub: 'Lessons Learned, Technik-Gedächtnis', val: '›', color: '#5B2D90', go: () => this.setState({ screen: 'wissen' }) }], empty: '' },
      notiz: { icon: '📝', title: 'Notiz', desc: 'Freier Text, nur für dich', opts: null, note: true, rows: () => [], empty: '' }
    };
    const dashX = (s.dExtra || []).filter(k => XW[k]).map(k => { const w = XW[k], sz = s.dSize[k] !== undefined ? s.dSize[k] : 0, hot = s.dragOver === 'dash|' + k, o = optOf(k, w.def), rows = w.rows(o);
      const setSize = d => () => this.setState({ dSize: Object.assign({}, s.dSize, { [k]: Math.max(0, Math.min(DSIZES.length - 1, sz + d)) }) });
      return Object.assign({ key: k, icon: w.icon, title: w.title + (w.opts ? ' · ' + (w.opts.find(x => x[0] === o) || ['', ''])[1] : ''), order: s.dOrder.indexOf(k), flex: DSIZES[sz][0], sizeLabel: DSIZES[sz][1], border: hot ? '3px solid ' + accent : wBorder,
        draggable: s.editDash ? 'true' : 'false', start: s.editDash ? this.dragStart('w:' + k) : noop, over: s.editDash ? this.dragOver('dash|' + k) : noop,
        drop: s.editDash ? this.dropOn('dash|' + k, id => { if (typeof id !== 'string' || id.indexOf('w:') !== 0) return; const from = id.slice(2); if (from === k) return; const or = s.dOrder.filter(x => x !== from); or.splice(or.indexOf(k), 0, from); this.setState({ dOrder: or }); }) : noop,
        smaller: setSize(-1), wider: setSize(1), remove: () => this.setState({ dExtra: s.dExtra.filter(x => x !== k), dOrder: s.dOrder.filter(x => x !== k), dashMsg: '„' + w.title + '“ entfernt.' }),
        hasOpts: !!w.opts, optOpen: s.dOptOpen === k ? 'true' : 'false', showOpts: !!w.opts && (s.dOptOpen === k || s.editDash), optToggle: () => this.setState({ dOptOpen: s.dOptOpen === k ? null : k }), optLabel: w.optLabel || '',
        opts: (w.opts || []).map(([v, l]) => ({ label: l, pressed: o === v ? 'true' : 'false', ring: o === v ? accent : t.border, bg: o === v ? t.soft : t.surface, go: () => this.setState({ dOpt: Object.assign({}, s.dOpt, { [k]: v }) }) })),
        isNote: !!w.note, note: s.dNote || '', setNote: e => this.setState({ dNote: e && e.target ? e.target.value : '' }),
        rows, empty: !w.note && rows.length === 0, emptyText: w.empty }, dCommon(k)); });
    const addX = k => () => this.setState({ dExtra: (s.dExtra || []).concat([k]), dOrder: s.dOrder.filter(x => x !== k).concat([k]), dashMsg: '„' + XW[k].title + '“ hinzugefügt, ganz unten. Mit ◀ oder Ziehen nach vorne holen.' });
    const paletteItems = DKEYS.filter(k => s.dHidden[k]).map(k => ({ label: '↺ ' + DTITLE[k], desc: 'Wieder einblenden', go: () => { const o = Object.assign({}, s.dHidden); delete o[k]; this.setState({ dHidden: o }); } }))
      .concat(Object.keys(XW).filter(k => !(s.dExtra || []).includes(k)).map(k => ({ label: '+ ' + XW[k].icon + ' ' + XW[k].title, desc: XW[k].desc, go: addX(k) })));
    const DLAY = {
      std: ['Standard', 'Alles wie ausgeliefert', { dOrder: DKEYS.slice(), dSize: {}, dHidden: {}, dH: {}, dExtra: [] }],
      pl: ['Projektleitung', 'Projekte, Meilensteine und Posteingang vorne', { dOrder: ['projekte', 'meilen', 'eingang', 'aufgaben', 'fokus', 'woche', 'last', 'kivor'], dSize: { projekte: 3, meilen: 1 }, dHidden: {}, dH: {}, dExtra: ['meilen', 'kivor'] }],
      tl: ['Teamleitung', 'Team-Eingang, Auslastung und Zertifikate', { dOrder: ['teamein', 'last', 'zert', 'aufgaben', 'fokus', 'eingang', 'projekte', 'woche'], dSize: { teamein: 1, last: 1 }, dHidden: { projekte: true }, dH: {}, dExtra: ['teamein', 'zert'], dOpt: { teamein: 'automatisierung' } }],
      ih: ['Instandhaltung', 'Termine, Team-Eingang Instandhaltung, Fokus', { dOrder: ['termine', 'teamein', 'fokus', 'aufgaben', 'woche', 'eingang', 'projekte', 'last'], dSize: { teamein: 1 }, dHidden: { projekte: true, last: true }, dH: { aufgaben: 1 }, dExtra: ['termine', 'teamein'], dOpt: { teamein: 'instandhaltung' } }]
    };
    const dashLayouts = Object.keys(DLAY).filter(k => k !== 'std').map(k => ({ label: DLAY[k][0], desc: DLAY[k][1], go: () => this.setState(Object.assign({ dashMsg: 'Layout „' + DLAY[k][0] + '“ geladen. Alles lässt sich weiter anpassen.' }, DLAY[k][2])) }));
    const dashReset = () => this.setState(Object.assign({ dashMsg: 'Zurückgesetzt auf Standard.' }, DLAY.std[2]));

    // Mobile Ansicht Instandhaltung
    const MO_WHO = 'K. Weber';
    const moOrdersK = KB.filter(k => this.ownerOf(TASK['ik' + k.id]) === MO_WHO && s.kb[k.id] !== 'erledigt' && s.kb[k.id] !== 'neu');
    const MO_CHECK = { 'Störung': ['Anlage freigeschaltet und gegen Wiedereinschalten gesichert', 'Ursache gefunden und dokumentiert', 'Instandgesetzt und Funktion geprüft', 'Anlage an die Schichtleitung übergeben'],
      'Wartung': ['Anlage freigeschaltet', 'Wartungspunkte laut Plan erledigt', 'Verbrauchsmaterial dokumentiert', 'Probelauf ohne Befund'], 'Auftrag': ['Material vollständig', 'Arbeit ausgeführt', 'Funktion geprüft', 'Bereich aufgeräumt'] };
    const MO_HINT = { k7: 'Tor 5: Endschalter oben bei Frost schwergängig, mit Silikonspray behandeln.', k3: 'Lichtschranke Typ WL12, Ersatz im Lager Regal C4.', k10: 'Verschmutzte Frontscheibe, mit Antistatik-Tuch reinigen.' };
    const moSel = KB.find(k => k.id === s.moSel) || moOrdersK[0] || KB[0];
    const moC = MO_CHECK[moSel.type] || MO_CHECK['Auftrag'], moChk = s.moChecks[moSel.id] || [];
    const moAll = moC.every((_, i) => moChk[i]);
    const MOT = { list: 'Aufträge', detail: 'Auftrag', scan: 'QR-Code scannen', report: 'Störung melden', sent: 'Gemeldet' };
    const moGo = scr => () => this.setState({ moScreen: scr, moMsg: '' });
    const mo = {
      is: { list: s.moScreen === 'list', detail: s.moScreen === 'detail', scan: s.moScreen === 'scan', report: s.moScreen === 'report', sent: s.moScreen === 'sent' },
      title: MOT[s.moScreen], canBack: s.moScreen !== 'list', back: moGo(s.moScreen === 'report' ? 'scan' : 'list'),
      back2: () => this.openProject('ih'), hasMsg: !!s.moMsg, msg: s.moMsg, msgBg: s.moMsgOk ? '#DFF6DD' : '#FDE7E9', msgFg: s.moMsgOk ? '#0E4F0E' : '#A4262C',
      kpis: [{ label: 'offen', value: moOrdersK.length, color: t.text }, { label: 'Störungen', value: moOrdersK.filter(k => k.type === 'Störung').length, color: RED }, { label: 'heute gebucht', value: (s.moBooked || 0).toLocaleString('de-DE') + ' h', color: GREEN }],
      orders: moOrdersK.map(k => { const col = s.kb[k.id], age = col === k.col ? k.age : 0;
        return { title: k.title, type: k.type, anlage: k.anlage, color: KB_TYPE[k.type], state: (this.kbColsOf().find(c => c[0] === col) || ['', ''])[1], stateColor: col === 'arbeit' ? accentText : t.muted,
          age: age ? age + ' Tage in dieser Spalte' : 'heute übernommen', ageColor: age >= 5 ? '#A33F06' : t.muted, open: () => this.setState({ moSel: k.id, moScreen: 'detail', moMsg: '' }) }; }),
      noOrders: moOrdersK.length === 0,
      o: { title: moSel.title, type: moSel.type, anlage: moSel.anlage, color: KB_TYPE[moSel.type], desc: moSel.type + ' · Serviceklasse ' + moSel.cls + ' · gemeldet von der Schichtleitung', hint: MO_HINT[moSel.id] || 'kein Eintrag zu dieser Anlage' },
      checks: moC.map((text, i) => ({ text, pressed: moChk[i] ? 'true' : 'false', mark: moChk[i] ? '✓' : '', bg: moChk[i] ? GREEN : t.surface, bd: moChk[i] ? GREEN : t.strong,
        toggle: () => { const o = Object.assign({}, s.moChecks), a = (o[moSel.id] || []).slice(); a[i] = !a[i]; o[moSel.id] = a; this.setState({ moChecks: o }); } })),
      timerBtn: s.moTimer ? { label: '■ Stopp (läuft)', bg: RED } : { label: '▶ Zeit starten', bg: GREEN },
      timer: () => (s.moTimer ? this.setState({ moTimer: false, moBooked: (s.moBooked || 0) + 0.75, moMsg: '0,75 h auf „' + moSel.title + '“ gebucht. Erscheint im Wochenzettel.', moMsgOk: true }) : this.setState({ moTimer: true, moMsg: '' })),
      booked: (s.moBooked ? s.moBooked.toLocaleString('de-DE') + ' h heute gebucht' : 'Noch keine Zeit gebucht') + (s.moTimer ? ' · Zeit läuft' : ''),
      photo: () => this.setState({ moPhoto: (s.moPhoto || 0) + 1 }), photoLabel: s.moPhoto ? '📷 ' + s.moPhoto + (s.moPhoto > 1 ? ' Fotos ✓' : ' Foto ✓') : '📷 Foto aufnehmen',
      finishBg: moAll ? GREEN : t.strong,
      finish: () => { if (!moAll) return this.setState({ moMsg: 'Erst alle Punkte der Checkliste abhaken.', moMsgOk: false }); const kb = Object.assign({}, s.kb); kb[moSel.id] = 'erledigt'; this.setState({ kb, moScreen: 'list', moTimer: false, moMsg: '„' + moSel.title + '“ abgeschlossen. R. Fischer sieht es sofort im Kanban.', moMsgOk: true }); },
      goScan: moGo('scan'), scanned: moGo('report'),
      arts: ['Störung', 'Mangel', 'Sicherheit'].map((l, i) => ({ label: l, pressed: s.moArt === i ? 'true' : 'false', ring: s.moArt === i ? accent : t.border, bg: s.moArt === i ? t.soft : t.surface, go: () => this.setState({ moArt: i }) })),
      drings: ['Anlage steht', 'Läuft eingeschränkt', 'Kann bis zur nächsten Wartung warten'].map((l, i) => ({ label: l, pressed: s.moDring === i ? 'true' : 'false', ring: s.moDring === i ? (i === 0 ? RED : accent) : t.border, bg: s.moDring === i ? t.soft : t.surface, go: () => this.setState({ moDring: i }) })),
      send: () => { const kb = Object.assign({}, s.kb); kb.k12 = 'eingang'; this.setState({ kb, moScreen: 'sent', moMsg: '', moPhoto: 0 }); },
      toKanban: () => this.setState({ screen: 'projekt', proj: 'ih', ptab: 'aufgaben', mview: Object.assign({}, s.mview, { ih: 'kanban' }), panel: null }),
      home: moGo('list'),
      tabs: [['☰', 'Aufträge', 'list'], ['⚠', 'Melden', 'scan'], ['◔', 'Auftrag', 'detail']].map(([icon, label, k]) => ({ icon, label, fg: s.moScreen === k ? accentText : t.muted, go: moGo(k) })),
      jumps: [['1', 'Aufträge des Tages', 'list'], ['2', 'Auftrag mit Checkliste und Zeit', 'detail'], ['3', 'Störung per QR-Code melden', 'scan'], ['4', 'Meldung abgeschickt', 'sent']].map(([num, label, k]) => ({ num, label, pressed: s.moScreen === k ? 'true' : 'false', ring: s.moScreen === k ? accent : t.border, bg: s.moScreen === k ? t.soft : t.surface, go: moGo(k) }))
    };

    // Projekteinstellungen: Buckets, Rollen und Rechte, Automatisierungen
    const SKU = s.screen === 'pn' ? (s.uprojs || []).find(u => u.key === s.upSel) : null, SK = SKU ? SKU.key : OVK;
    const PJS = PJ[SK] || { name: SKU ? SKU.name : '', code: SKU ? SKU.code : '', meta: '' };
    const setGo = sub => () => this.setState({ setSub: sub, setMsg: '' });
    const bks = this.bucketsOf(SK);
    const bkCount = key => TASKS.filter(x => x.proj === this.pnm(SK) && this.bucketOf(x) === key).length;
    const setBk = list => this.setState({ bucketsBy: Object.assign({}, s.bucketsBy, { [SK]: list }) });
    const bucketsUI = bks.map((b, i) => ({ name: b.name, color: b.color, aria: 'Name von Bucket ' + (i + 1), count: String(bkCount(b.key)),
      catLabel: BCAT[b.cat][0], catBg: BCAT[b.cat][1], upOp: i === 0 ? '0.3' : '1', upLabel: b.name + ' nach oben', delLabel: b.name + ' löschen',
      rename: e => { const v = e && e.target ? e.target.value : b.name; setBk(bks.map(x => (x.key === b.key ? Object.assign({}, x, { name: v }) : x))); },
      cycle: () => { const order = ['offen', 'aktiv', 'wartet', 'fertig'], nc = order[(order.indexOf(b.cat) + 1) % order.length];
        if (b.cat === 'fertig' && bks.filter(x => x.cat === 'fertig').length === 1) return this.setState({ setMsg: 'Mindestens ein Bucket muss „Erledigt“ bedeuten, sonst wird nie etwas fertig.' });
        setBk(bks.map(x => (x.key === b.key ? Object.assign({}, x, { cat: nc, color: BCAT[nc][1] }) : x))); },
      up: () => { if (!i) return; const o = bks.slice(); [o[i - 1], o[i]] = [o[i], o[i - 1]]; setBk(o); },
      del: () => {
        if (b.cat === 'fertig' && bks.filter(x => x.cat === 'fertig').length === 1) return this.setState({ setMsg: '„' + b.name + '“ ist der einzige Erledigt-Bucket und kann nicht gelöscht werden.' });
        const target = bks.find(x => x.key !== b.key && x.cat === 'offen') || bks.find(x => x.key !== b.key);
        const moved = TASKS.filter(x => x.proj === this.pnm(SK) && this.bucketOf(x) === b.key);
        const bk = Object.assign({}, s.bk); moved.forEach(x => { bk[x.id] = target.key; });
        this.setState({ bk, bucketsBy: Object.assign({}, s.bucketsBy, { [SK]: bks.filter(x => x.key !== b.key) }), setMsg: '„' + b.name + '“ gelöscht. ' + (moved.length ? moved.length + ' Aufgaben liegen jetzt in „' + target.name + '“, nichts geht verloren.' : 'Er war leer.') });
      } }));
    const FIXED = { rl2: SB_COLS.map(([n, c]) => ({ name: n, color: c, sub: n === 'Done' ? 'nur mit erfüllten Akzeptanzkriterien' : 'Status-Workflow' })),
      ih: this.kbColsOf().map(([k, n, lim, c]) => ({ name: n, color: c, sub: lim ? 'WIP-Limit ' + lim : 'ohne Limit' })) };
    const ROLES_P = ['Owner', 'Bearbeiter', 'Mitwirkender', 'Leser', 'Gast'].concat(s.rolesExtra[SK] || []);
    const RM = s.rightsBy[SK] || RIGHTS_INIT;
    const memCount = r => PMEMBERS[SK].filter(m => m[1] === r).length;
    const asR = s.asRole || 'Leser', asIdx = ROLES_P.indexOf(asR);
    const allowed = RIGHTS.filter((_, i) => (RM[i] || [])[asIdx]);
    const rb = s.rb, TRIG = ['Status ändert sich', 'Termin wird überschritten', 'Liegt 5 Tage im selben Bucket', 'Neue Aufgabe angelegt', '@Erwähnung im Kommentar'];
    const TRIGS = ['sich der Status ändert', 'der Termin überschritten wird', 'sie 5 Tage im selben Bucket liegt', 'eine neue Aufgabe angelegt wird', 'jemand im Kommentar erwähnt wird'];
    const firstTask = TASKS.find(x => x.proj === this.pnm(SK));
    const OBJ = ['jede Aufgabe', firstTask ? 'Aufgabe „' + firstTask.title + '“' : 'eine Aufgabe', 'jeden Meilenstein', 'Aufgaben im Bucket Fokus'];
    const ACT = ['Mail senden', 'Push aufs Handy', 'Teams-Nachricht', 'Bucket auf Fokus setzen', 'Aufgabe anlegen'];
    const TO = ['an mich', 'an den Bearbeiter', 'an die Projektleitung', 'an @Team Automatisierung'];
    const sentence = 'Wenn bei ' + OBJ[rb.obj] + ' ' + TRIGS[rb.trig] + ', dann ' + ACT[rb.act] + (rb.act < 3 ? ' ' + TO[rb.to] : '') + '.';
    const autoRules = s.rulesBy[SK] || RULES_INIT;
    const setRules = list => this.setState({ rulesBy: Object.assign({}, s.rulesBy, { [SK]: list }) });
    const partOf = (label, list, key) => ({ label, opts: list.map((l, i) => ({ label: l, pressed: rb[key] === i ? 'true' : 'false', ring: rb[key] === i ? accent : t.border, bg: rb[key] === i ? t.soft : t.surface, go: () => this.setState({ rb: Object.assign({}, rb, { [key]: i }) }) })) });
    const SUBT = { buckets: 'Buckets', rollen: 'Rollen und Rechte', auto: 'Automatisierungen', lbl: 'Etiketten', stamm: 'Stammdaten', stufe: 'Stufe und Module', modell: 'Vorgehensmodell', arch: 'Archivieren oder löschen' };
    const set = {
      isMain: !s.setSub, isBuckets: s.setSub === 'buckets', isRollen: s.setSub === 'rollen', isAuto: s.setSub === 'auto', title: SUBT[s.setSub] || 'Einstellungen',
      hasMsg: !!s.setMsg, msg: s.setMsg || '', back: setGo(null),
      bEditable: !FIXED[SK], bFixed: !!FIXED[SK], fixedCols: FIXED[SK] || [], buckets: bucketsUI,
      bNote: FIXED[SK] ? (SK === 'rl2' ? 'Im Scrum-Projekt sind die Spalten der Status-Workflow der Stories. Ändern über das Vorgehensmodell.' : 'Im Kanban-Projekt sind die Spalten der Fluss mit WIP-Limits. Ändern im Kanban-Board.') : 'Anlegen, umbenennen, sortieren, löschen. Die Spalten im Board ändern sich sofort.',
      addBucket: () => { const n = Object.keys(s.bucketsBy).length + bks.length + 1, nb = { key: 'b' + Date.now(), name: 'Neuer Bucket ' + n, cat: 'aktiv', color: BCAT.aktiv[1] };
        const o = bks.slice(), fi = o.findIndex(x => x.cat === 'fertig'); o.splice(fi < 0 ? o.length : fi, 0, nb); setBk(o); this.setState({ setMsg: 'Bucket angelegt. Namen direkt im Feld ändern.' }); },
      nRoles: ROLES_P.length,
      roles: ROLES_P.map(r => ({ short: r.length > 7 ? r.slice(0, 6) + '.' : r, title: r, count: memCount(r) + ' P.' })),
      rights: RIGHTS.map((name, i) => ({ name, cells: ROLES_P.map((r, j) => { const on = !!(RM[i] || [])[j];
        return { pressed: on ? 'true' : 'false', mark: on ? '✓' : '', bg: on ? GREEN : t.surface, bd: on ? GREEN : t.border, aria: r + ': ' + name,
          toggle: () => { if (j === 0 && i === 5) return this.setState({ setMsg: 'Der Owner behält immer das Recht, Mitglieder und Rollen zu verwalten.' });
            const m = RM.map(row => row.slice()); while (m[i].length < ROLES_P.length) m[i].push(false); m[i][j] = !on; this.setState({ rightsBy: Object.assign({}, s.rightsBy, { [SK]: m }), setMsg: '' }); } }; }) })),
      extraRoles: (s.rolesExtra[SK] || []).map((r0, ri) => ({ name: r0, rename: e => { const v = e && e.target ? e.target.value : r0; const ex = (this.state.rolesExtra[SK] || []).slice(), old = ex[ri]; ex[ri] = v; PMEMBERS[SK] = PMEMBERS[SK].map(m => (m[1] === old ? [m[0], v].concat(m.slice(2)) : m)); this.setState({ rolesExtra: Object.assign({}, this.state.rolesExtra, { [SK]: ex }) }); },
        del: () => { const ex = (this.state.rolesExtra[SK] || []).slice(), old = ex[ri], idx = 5 + ri; ex.splice(ri, 1); PMEMBERS[SK] = PMEMBERS[SK].map(m => (m[1] === old ? [m[0], 'Leser'].concat(m.slice(2)) : m)); const RM0 = (this.state.rightsBy[SK] || RIGHTS_INIT).map(row => row.filter((v, c) => c !== idx)); this.setState({ rolesExtra: Object.assign({}, this.state.rolesExtra, { [SK]: ex }), rightsBy: Object.assign({}, this.state.rightsBy, { [SK]: RM0 }), setMsg: 'Rolle „' + old + '“ gelöscht. Mitglieder mit dieser Rolle sind jetzt Leser.' }); } })),
      addRoleLabel: (s.rolesExtra[SK] || []).length ? '+ Weitere Rolle' : '+ Eigene Rolle, z. B. „Prüfer“',
      addRole: () => { const ex = s.rolesExtra[SK] || [], name = ['Prüfer', 'Lieferant', 'Werkstudent'][ex.length] || 'Rolle ' + (ex.length + 6);
        const m = RM.map((row, i) => row.concat([i === 2 || i === 3])); this.setState({ rolesExtra: Object.assign({}, s.rolesExtra, { [SK]: ex.concat([name]) }), rightsBy: Object.assign({}, s.rightsBy, { [SK]: m }), setMsg: 'Rolle „' + name + '“ angelegt: darf eigene Aufgaben bearbeiten und Dateien ablegen.' }); },
      asRole: ROLES_P.map(r => ({ label: r, pressed: asR === r ? 'true' : 'false', ring: asR === r ? accent : t.border, bg: asR === r ? t.soft : t.surface, go: () => this.setState({ asRole: r }) })),
      asText: 'Als ' + asR + ': ' + (allowed.length ? 'darf ' + allowed.join(', ') + '. Alles andere nur lesen.' : 'nur lesen, keine Änderungen, keine Uploads.') + (asR === 'Gast' ? ' Sieht nur freigegebene Bereiche, keine Finanzen.' : ''),
      rules: autoRules.map((r, i) => ({ text: r.text, runs: r.on ? r.runs : 'pausiert', checked: r.on ? 'true' : 'false', trackBg: r.on ? GREEN : t.strong, justify: r.on ? 'flex-end' : 'flex-start', aria: 'Regel an oder aus: ' + r.text, delLabel: 'Regel löschen: ' + r.text,
        toggle: () => setRules(autoRules.map((x, j) => (j === i ? Object.assign({}, x, { on: !x.on }) : x))), del: () => setRules(autoRules.filter((_, j) => j !== i)) })),
      parts: [partOf('Wenn', TRIG, 'trig'), partOf('bei', OBJ, 'obj'), partOf('dann', ACT, 'act'), partOf('an', TO, 'to')],
      sentence,
      testRule: () => this.setState({ setMsg: 'Testlauf: ' + (rb.act === 0 ? 'Mail „[' + PJS.code + '] ' + (firstTask ? firstTask.title : 'Aufgabe') + ': Fokus → Warten auf“ ginge ' + TO[rb.to] + '.' : ACT[rb.act] + ' würde ausgelöst.') + ' Nichts wurde wirklich gesendet.' }),
      saveRule: () => { setRules(autoRules.concat([{ text: sentence, on: true, runs: 'neu, noch nicht ausgelöst' }])); this.setState({ setMsg: 'Regel gespeichert und aktiv.' }); },
      recipes: RECIPES.map(r => ({ label: r, go: () => { setRules(autoRules.concat([{ text: r, on: true, runs: 'aus Rezept, noch nicht ausgelöst' }])); this.setState({ setMsg: 'Rezept übernommen.' }); } }))
    };
    const MODEL = { sm42: 'Wasserfall mit Quality Gates', rl2: 'Scrum, Sprints à 2 Wochen', pd: 'V-Modell, 9 Ebenen', ih: 'Kanban mit WIP-Limits' };
    const psetOf = k => { const u0 = (s.uprojs || []).find(u => u.key === k); return Object.assign({}, PSET0[k] || (u0 ? { stufe: u0.stufe, mods: u0.mods || {} } : { stufe: 2, mods: {} }), (s.psetBy || {})[k] || {}); };
    const modOn = (ps, k) => { const m = P_MODS.find(x => x[0] === k); return ps.mods && ps.mods[k] !== undefined ? ps.mods[k] : (m ? m[2] <= ps.stufe : true); };
    const setPs = (k, patch, msg) => this.setState({ psetBy: Object.assign({}, s.psetBy, { [k]: Object.assign({}, psetOf(k), patch) }), setMsg: msg || '' });
    const PS = psetOf(SK);
    const MODELTXT = { sm42: 'Phasen, Meilensteine und Quality Gates im Gantt. Arbeitspakete lassen sich ziehen, Gates haben Checklisten.', rl2: 'Product Backlog, Sprint-Planung, Sprint-Board und Review. Der Status-Workflow der Stories ersetzt die Buckets.', pd: 'Ebenen des V von Anforderung bis Validierung, mit Verfolgbarkeit Anforderung ↔ Test.', ih: 'Fluss mit WIP-Limits, Störungen kommen ungeplant, Wartungen wiederkehrend.' };
    const lblRen = (pk, k) => e => { const v = e && e.target ? e.target.value : ''; this.setState({ lblNames: Object.assign({}, s.lblNames, { [pk]: Object.assign({}, (s.lblNames || {})[pk] || {}, { [k]: v }) }) }); };
    const lblCount = (pname, k) => TASKS.filter(x => x.proj === pname && ((s.lbl || {})[x.id] || LBL_SEED[x.id] || []).includes(k)).length;
    Object.assign(set, { isLbl: s.setSub === 'lbl', lblNew: s.lblNew || '', setLblNew: e => this.setState({ lblNew: e && e.target ? e.target.value : '' }),
      lblAdd: () => { const v = (this.state.lblNew || '').trim(); if (!v) return this.setState({ setMsg: 'Erst einen Namen eingeben, z. B. „Wartet auf Kunde“.' }); const PAL = ['#B4009E', '#33691E', '#8A3707', '#0E6E7A', '#5C5C5C', '#C50F1F'], cur = (this.state.lblX || {})[SK] || [];
        this.setState({ lblX: Object.assign({}, this.state.lblX, { [SK]: cur.concat([['x' + Date.now().toString(36), v, PAL[cur.length % PAL.length]]]) }), lblNew: '', setMsg: 'Etikett „' + v + '“ angelegt. An einer Aufgabe unter „Etiketten“ zuweisen, im Board und in Listen filtern.' }); }, lbls: this.labelsOf(SK).map(([k, l, c]) => ({ c, del: () => this.setState({ lblDel: Object.assign({}, s.lblDel, { [SK]: Object.assign({}, (s.lblDel || {})[SK] || {}, { [k]: true }) }), setMsg: '„' + this.lblName(SK, k) + '“ gelöscht. Aufgaben verlieren nur dieses Etikett.' }), name: this.lblName(SK, k), rename: lblRen(SK, k), count: (n0 => n0 + (n0 === 1 ? ' Aufgabe' : ' Aufgaben'))(lblCount(this.pnm(SK), k)) })),
      isSicht: s.setSub === 'sicht',
      sichtRows: [['planung', 'Planung'], ['risiken', 'Risiken'], ['zeiten', 'Zeiten'], ['kapazitaet', 'Kapazität'], ['status', 'Statusbericht'], ['opl', 'Offene Punkte'], ['dokumente', 'Dokumente'], ['budget', 'Finanzen'], ['aenderungen', 'Change Requests'], ['abschluss', 'Abschluss'], ['anf', 'Anforderungen'], ['verlauf', 'Verlauf']].map(([k, l]) => ({ name: l, cells: ['Bearbeiter', 'Mitwirkender', 'Leser', 'Gast'].map(r => { const on = this.tabSeen(SK, r, k);
        return { v: on ? '✓' : '–', bg: on ? '#107C10' : t.surface2, fg: on ? '#FFFFFF' : t.muted, aria: l + ' für ' + r + (on ? ' sichtbar' : ' verborgen'), go: () => { const cur = (this.state.pTabRole || {})[SK] || {}; this.setState({ pTabRole: Object.assign({}, this.state.pTabRole, { [SK]: Object.assign({}, cur, { [r]: Object.assign({}, cur[r] || {}, { [k]: !on }) }) }), setMsg: l + (on ? ' ist für ' + r + ' jetzt verborgen.' : ' ist für ' + r + ' jetzt sichtbar.') }); } }; }) })),
      asRoles: ['Owner', 'Bearbeiter', 'Mitwirkender', 'Leser', 'Gast'].map(r => ({ label: r, pressed: ((s.pnAs || {})[SK] || 'Owner') === r ? 'true' : 'false', ring: ((s.pnAs || {})[SK] || 'Owner') === r ? accent : t.border, bg: ((s.pnAs || {})[SK] || 'Owner') === r ? t.soft : t.surface, go: () => this.setState({ pnAs: Object.assign({}, s.pnAs, { [SK]: r === 'Owner' ? null : r }), setMsg: r === 'Owner' ? 'Vorschau beendet.' : 'Das Projekt zeigt jetzt die Reiter, die ein ' + r + ' sieht.' }) })),
      canModel: !!SKU, models: ['Liste und Board', 'Kanban mit WIP-Limits', 'Wasserfall mit Quality Gates', 'V-Modell', 'Scrum'].map(m => ({ label: m, pressed: SKU && SKU.model === m ? 'true' : 'false', ring: SKU && SKU.model === m ? accent : t.border, bg: SKU && SKU.model === m ? t.soft : t.surface,
        go: () => { if (!SKU) return; const tree = SKU.tree = SKU.tree || [], empty = !tree.length;
          const mk = list => { let d = SKU.start > '2026-11-13' ? SKU.start : '2026-11-16'; list.forEach(([nm, days, gate, isMs]) => { const id = SK + 'x' + Object.keys(NODE).length, e = addDays(d, days - 1), ph = { id, name: nm, type: 'phase', start: d, end: e, children: [], owner: 'Du', tasks: [], kindLabel: 'Phase' }; NODE[id] = ph; PARENT[id] = null;
            if (gate) { const gid = SK + 'x' + Object.keys(NODE).length, g = { id: gid, name: gate, type: 'gate', start: e, end: e, owner: 'Du', tasks: [], msPoint: !!isMs, kindLabel: isMs ? 'Meilenstein' : 'Quality Gate', checks: isMs ? [] : ['Checkliste vollständig', 'Dokumente freigegeben', 'Offene Punkte bewertet'] }; ph.children.push(g); NODE[gid] = g; PARENT[gid] = id; }
            tree.push(ph); d = addDays(e, 1); }); };
          const BK = (list) => list.map(([k, n, c, col]) => ({ key: k, name: n, cat: c, color: col }));
          const P = { 'Scrum': { b: BK([['Backlog', 'Product Backlog', 'offen', '#5C5C5C'], ['sbl', 'Sprint-Backlog', 'offen', '#0E6E7A'], ['Fokus', 'In Arbeit', 'aktiv', '#0F6CBD'], ['rev', 'Review', 'aktiv', '#8A3707'], ['Erledigt', 'Done', 'fertig', '#107C10']]), ph: [['Sprint 1', 14, 'Review Sprint 1', true], ['Sprint 2', 14, 'Review Sprint 2', true], ['Sprint 3', 14, 'Review Sprint 3', true], ['Sprint 4', 14, 'Release 1', true]], mods: { plan: true }, t: 'Board jetzt Product Backlog, Sprint-Backlog, In Arbeit, Review, Done' },
            'Kanban mit WIP-Limits': { b: BK([['Backlog', 'Eingang', 'offen', '#5C5C5C'], ['gepl', 'Geplant', 'offen', '#0E6E7A'], ['Fokus', 'In Arbeit', 'aktiv', '#0F6CBD'], ['Warten auf', 'Warten auf', 'wartend', '#A33F06'], ['Erledigt', 'Erledigt', 'fertig', '#107C10']]), ph: [], mods: {}, t: 'Board jetzt Eingang, Geplant, In Arbeit, Warten auf, Erledigt' },
            'V-Modell': { b: null, ph: [['Anforderungen', 14, 'Anforderungen freigegeben'], ['Systementwurf', 14, 'Entwurf freigegeben'], ['Umsetzung', 28, null], ['Integration und Test', 14, 'Integrationstest bestanden'], ['Abnahme', 7, 'Abnahme durch Kunde']], mods: { plan: true, req: true, test: true }, t: 'Reiter Anforderungen mit Testfällen eingeschaltet' },
            'Wasserfall mit Quality Gates': { b: null, ph: [['Konzept', 14, 'G1 Konzept freigegeben'], ['Konstruktion', 21, 'G2 Konstruktionsfreigabe'], ['Fertigung und Montage', 28, null], ['Inbetriebnahme', 14, 'G3 Inbetriebnahme'], ['Abnahme', 7, 'G4 Abnahme']], mods: { plan: true }, t: 'Planung mit Phasen und Quality Gates' },
            'Liste und Board': { b: null, ph: [], mods: { plan: false }, t: 'nur noch Aufgaben mit Liste und Board, Planung ausgeblendet (Daten bleiben)' } }[m];
          const done = [P.t]; if (P.ph.length && empty) { mk(P.ph); done.push(P.ph.length + (m === 'Scrum' ? ' Sprints' : ' Phasen') + ' angelegt'); } else if (P.ph.length) done.push('bestehende Phasen bleiben');
          if (P.b) this.bkSet(SK, P.b);
          this.setState({ uprojs: (this.state.uprojs || []).map(u0 => (u0.key === SK ? Object.assign({}, u0, { model: m }) : u0)), psetBy: Object.assign({}, this.state.psetBy, { [SK]: Object.assign({}, psetOf(SK), { mods: Object.assign({}, psetOf(SK).mods, P.mods) }) }), rev: (this.state.rev || 0) + 1,
            setMsg: 'Vorgehen jetzt: ' + m + '. ' + done.join(', ') + '. Aufgaben, Termine und Dokumente bleiben erhalten.', pnMsg: 'Vorgehen auf ' + m + ' umgestellt: ' + done.join(', ') + '.' }); } })),
      isStamm: s.setSub === 'stamm', isStufe: s.setSub === 'stufe', isModell: s.setSub === 'modell', isArch: s.setSub === 'arch',
      pname: PJS.name, pcode: PJS.code, kst: this.kstOf(SK), setKst: e => setPs(SK, { kst: e && e.target ? e.target.value : '' }), ia: this.iaOf(SK), setIa: e => setPs(SK, { ia: e && e.target ? e.target.value : '' }),
      colors: PCOLORS.map(c => ({ c, pressed: (PS.color || '') === c ? 'true' : 'false', ring: (PS.color || '') === c ? t.text : 'transparent', go: () => setPs(SK, { color: c }, 'Farbe geändert. Gilt in Projektliste, Kalender und Karten.') })),
      stufen: STUFEN.map(([n, name, desc]) => ({ n: String(n), name, desc, pressed: PS.stufe === n ? 'true' : 'false', ring: PS.stufe === n ? accent : t.border, bg: PS.stufe === n ? t.soft : t.surface,
        go: () => setPs(SK, { stufe: n }, 'Stufe ' + n + ' · ' + name + '. ' + (n < PS.stufe ? 'Ausgeblendete Bereiche behalten ihre Daten.' : 'Neue Bereiche sind jetzt sichtbar.')) })),
      modGroups: this.modGroups(PS, (k, on, label) => setPs(SK, { mods: Object.assign({}, PS.mods, { [k]: !on }) }, label + (on ? ' ausgeblendet.' : ' eingeschaltet.')), t, accent, !!SKU, /V-Modell/.test(MODEL[SK] || (SKU ? SKU.model : ''))),
      mods: P_MODS.map(([k, label, lv]) => { const on = modOn(PS, k), extra = PS.mods && PS.mods[k] !== undefined; return { label: (on ? '✓ ' : '+ ') + label + (extra ? (on ? ' (zugeschaltet)' : ' (abgeschaltet)') : ''), pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface,
        go: () => { if (k === 'tasks') return this.setState({ setMsg: 'Aufgaben sind die Grundlage und bleiben immer an.' }); setPs(SK, { mods: Object.assign({}, PS.mods, { [k]: !on }) }, label + (on ? ' ausgeblendet.' : ' eingeschaltet.')); } }; }),
      model: (MODEL[SK] || (SKU ? SKU.model : "")), modelText: (MODELTXT[SK] || 'Eigenes Projekt, Vorgehen ' + (SKU ? SKU.model : '') + '.') + (SKU ? ' Du kannst das Vorgehen jederzeit wechseln; Daten bleiben erhalten.' : ' Beispielprojekt: Vorgehen fest.'),
      saveTpl: () => this.setState({ userTpl: (s.userTpl || []).concat([{ key: 'ut' + (s.userTpl || []).length, name: PJS.name + ' (Vorlage)', stufe: PS.stufe, model: (MODEL[SK] || (SKU ? SKU.model : "")), from: SK }]), setMsg: 'Als Vorlage gespeichert: Struktur, Dauern und Abhängigkeiten, ohne Zeiten, Kommentare und Personen. Steht ab jetzt unter „+ Neues Projekt“.' }),
      archText: PS.archived ? 'Das Projekt ist archiviert: nur lesbar, nicht mehr in Listen und Auswertungen.' : 'Archivieren macht das Projekt nur lesbar und blendet es aus Listen und Auswertungen aus. Wiederherstellen geht jederzeit. Gelöschte Projekte liegen 30 Tage im Papierkorb.',
      archLabel: PS.archived ? 'Wiederherstellen' : 'Archivieren', archive: () => setPs(SK, { archived: !PS.archived }, PS.archived ? 'Wiederhergestellt.' : 'Archiviert. In der Projektliste unter „archiviert“.'),
      del: () => this.setState({ setMsg: 'Löschen braucht die Bestätigung durch ' + (PL_OF[SK] === 'Du' ? 'die Bereichsleitung' : PL_OF[SK]) + '. Anfrage gesendet; bis dahin passiert nichts.' }) });
    const settings = [
      ['Stammdaten', PJS.name + ' · Farbe, Kostenstelle', 'stamm'], ['Stufe und Module', 'Stufe ' + PS.stufe + ' · ' + P_MODS.filter(m => modOn(PS, m[0])).length + ' von ' + P_MODS.length + ' Modulen an', 'stufe'], ['Vorgehensmodell', (MODEL[SK] || (SKU ? SKU.model : "")), 'modell'],
      ['Etiketten', this.labelsOf(SK).map(l => this.lblName(SK, l[0])).join(', '), 'lbl'],
      ['Buckets', FIXED[SK] ? 'Spalten des ' + (SK === 'rl2' ? 'Sprint-Boards' : 'Kanban-Boards') : bks.map(b => b.name).join(', '), 'buckets'],
      ['Sichtbarkeit der Reiter', 'Wer welche Reiter sieht, z. B. Elektriker nur Übersicht und Aufgaben', 'sicht'],
      ['Mitglieder, Rollen und Rechte', PMEMBERS[SK].length + ' Mitglieder · ' + ROLES_P.length + ' Rollen', 'rollen'],
      ['Automatisierungen', autoRules.filter(r => r.on).length + ' aktive Regeln', 'auto'], ['Archivieren oder löschen', PS.archived ? 'archiviert' : 'Papierkorb 30 Tage', 'arch']
    ].map(([name, sub, k]) => ({ name, sub, go: k ? setGo(k) : () => this.setState({ setMsg: name + ': im Entwurf nur angedeutet.' }) }));

    // Neues Projekt (Assistent) und eigene Projekte
    TASKS.forEach(x => this.kenn(x));
    const fE = v => (Math.round(v * 100) / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    const NW0 = { tpl: 'leer', name: '', start: '2026-11-23', color: PCOLORS[0], members: ['Du'], stufe: null, mods: {}, err: '' };
    const nw = Object.assign({}, NW0, s.newP || {}), setNw = patch => this.setState({ newP: Object.assign({}, nw, patch, { err: '' }) });
    const UTPL = {}; (s.userTpl || []).forEach(ut => { if (ut.base && P_TPL[ut.base]) { UTPL[ut.key] = Object.assign({}, P_TPL[ut.base], { icon: '★', name: ut.name, desc: 'Aus Wissen › Vorlagen, gepflegt vom Team' }); return; } const tree = ut.nodes || PTREE_OF[ut.from] || [], ph = tree.filter(n => n.type === 'phase'), f0 = ph.length ? ph[0].start : '2026-01-01';
      UTPL[ut.key] = { icon: '★', name: ut.name, desc: 'Deine Vorlage' + (ut.from ? ' aus „' + PNAME_OF[ut.from] + '“' : '') + ', ohne Zeiten, Kommentare und Personen', stufe: ut.stufe, model: ut.model, phases: ph.map(n => [n.name, Math.max(0, dd(D(f0), D(n.start))), Math.max(1, dd(D(f0), D(n.end))), null]), tasks: [] }; });
    const ALLTPL = Object.assign({}, P_TPL, UTPL); Object.keys(s.tplHide || {}).forEach(k => { if ((s.tplHide || {})[k] && !/^(leer|kan0|wf0|v0|sc0)$/.test(k)) delete ALLTPL[k]; });
    const famOf = k => { const x = ALLTPL[k]; if (!x) return 'liste'; if (x.fam) return x.fam; const m0 = String(x.model || ''); return /scrum/i.test(m0) ? 'scrum' : (/v-modell/i.test(m0) ? 'v' : (/kanban/i.test(m0) ? 'kanban' : (/wasserfall|gate/i.test(m0) ? 'wf' : 'liste'))); };
    const curFam = famOf(nw.tpl);
    const TP = ALLTPL[nw.tpl] || P_TPL.leer, nwStufe = nw.stufe || TP.stufe, nwPs = { stufe: nwStufe, mods: nw.mods };
    const PPL = ['Du', 'T. Brandt', 'L. Wagner', 'S. Keller', 'M. Yilmaz', 'J. Novak', 'K. Weber', 'R. Fischer', 'E. Lang'];
    const UP = s.uprojs || [];
    const pnw = {
      open: () => this.setState({ screen: 'pnew', panel: null, newP: Object.assign({}, NW0) }), back: () => this.setState({ screen: 'projekte' }),
      tplOpen: !!s.tplMgr, tplToggle: () => this.setState({ tplMgr: !s.tplMgr }),
      tplList: Object.keys(P_TPL).concat(Object.keys(UTPL)).filter(k => !/^(leer|kan0|wf0|v0|sc0)$/.test(k)).map(k => { const x = P_TPL[k] || UTPL[k], hid = !!(s.tplHide || {})[k], own = !!UTPL[k];
        return { name: (x.icon || '') + ' ' + x.name, sub: own ? 'eigene Vorlage' : 'mitgeliefert', act: own ? 'Löschen' : (hid ? 'Wieder anzeigen' : 'Ausblenden'), state: hid ? '· ausgeblendet' : '',
          go: () => (own ? this.setState({ userTpl: (s.userTpl || []).filter(ut => ut.key !== k), newP: Object.assign({}, nw, { tpl: nw.tpl === k ? 'leer' : nw.tpl }) }) : this.setState({ tplHide: Object.assign({}, s.tplHide, { [k]: !hid }), newP: Object.assign({}, nw, { tpl: nw.tpl === k ? 'leer' : nw.tpl }) })) }; }),
      ll: (() => { const TPx = ALLTPL[nw.tpl] || {}, ctx = (nw.name || '') + ' ' + (TPx.name || '') + ' ' + (TPx.desc || '') + ' ' + (TPx.model || '') + ' ' + (TPx.phases || []).map(p0 => p0[0] + ' ' + (p0[3] || '')).join(' ') + ' ' + (TPx.tasks || []).join(' '), tk = {}; (nw.llTake || []).forEach(id => { tk[id] = true; });
        return Object.assign(this.llUI(ctx, null, { dis: nw.llDis || {}, taken: tk, all: !!nw.llAll, takeLbl: '+ Beim Anlegen als Aufgabe', takenLbl: '✓ wird als Aufgabe angelegt',
          onTake: (w, rec, taken) => setNw({ llTake: taken ? (nw.llTake || []).filter(x => x !== w.id) : (nw.llTake || []).concat([w.id]) }), onDis: w => setNw({ llDis: Object.assign({}, nw.llDis, { [w.id]: true }) }) }),
          { collapsible: false, showItems: true, toggle: () => {}, toggleLabel: '', sub: (nw.llTake || []).length ? (nw.llTake || []).length + ' werden als Aufgabe angelegt' : 'passend zu Name, Vorlage und Phasen', moreGo: () => setNw({ llAll: true }), hasDis: false, disLabel: '', disReset: () => {} }); })(),
      stOpen: nw.stOpen === true, stToggle: () => setNw({ stOpen: nw.stOpen !== true }), stBtn: nw.stOpen === true ? '▴ Hilfe zur Vorgehensmodell-Findung ausblenden' : '🧭 Hilfe bei der Wahl des Vorgehensmodells (Stacey-Matrix)',
      stGrid: staceyW.map(c => { const sel = (nw.sx || 0) === c.x && (nw.sy || 0) === c.y, corner = (c.x === 0 && c.y === 0) || (c.x === 4 && c.y === 4) || (c.x === 2 && c.y === 2) || (c.x === 3 && c.y === 0); return { bg: c.bg, ring: sel ? accent : 'transparent', sel: sel ? 'true' : 'false', mark: sel ? '●' : (corner ? c.zone : ''), aria: 'Anforderungen ' + (c.y + 1) + ' von 5 unklar, Technik ' + (c.x + 1) + ' von 5 neu, ' + c.zone, pick: () => setNw({ sx: c.x, sy: c.y }) }; }),
      stY: ['klar', 'eher klar', 'teils offen', 'unklar', 'völlig offen'].map((l, i) => ({ label: l, pressed: (nw.sy || 0) === i ? 'true' : 'false', ring: (nw.sy || 0) === i ? accent : t.border, bg: (nw.sy || 0) === i ? t.soft : t.surface, go: () => setNw({ sy: i }) })),
      stX: ['bekannt', 'eher bekannt', 'teils neu', 'neu', 'völlig neu'].map((l, i) => ({ label: l, pressed: (nw.sx || 0) === i ? 'true' : 'false', ring: (nw.sx || 0) === i ? accent : t.border, bg: (nw.sx || 0) === i ? t.soft : t.surface, go: () => setNw({ sx: i }) })),
      ...(() => { const x0 = nw.sx || 0, y0 = nw.sy || 0, v = x0 + y0, zone = v <= 2 ? 'Einfach' : (v <= 4 ? 'Kompliziert' : (v <= 6 ? 'Komplex' : 'Chaotisch'));
        const fk = y0 < 2 && x0 < 2 ? 'wf' : (y0 < 2 ? 'v' : 'scrum'), nm0 = (P_FAM.find(f => f[0] === fk) || ['', '', ''])[2];
        const why = { wf: 'Ziel und Weg sind klar: Phasen mit Quality Gates, fester Termin.', v: 'Was gebaut wird ist klar, die Technik neu: jede Ebene wird gegen ihre Testebene geprüft.', scrum: 'Was gebaut wird, ist noch offen: in kurzen Sprints liefern und nachsteuern.' }[fk];
        return { stZone: zone, stRec: nm0, stWhy: why + (zone === 'Chaotisch' ? ' Vorher mit einem Prototyp Klarheit schaffen.' : '') + ' Laufende Arbeit ohne Ende (Wartung, Support): Kanban.', stTake: () => { const ex0 = Object.keys(ALLTPL).filter(k => famOf(k) === fk); setNw({ tpl: ex0[0], stufe: null, mods: {}, stOpen: false }); } }; })(),
      ...(() => { const myT = (TEAMS.automatisierung.members || []).map(m => m[0]), foreign = (nw.members || []).filter(m => m !== 'Du' && !myT.includes(m)), why = [];
        if (nwStufe >= 3) why.push('Stufe ' + nwStufe + ' bringt Budget mit'); if (foreign.length) why.push('Leute aus anderen Teams (' + foreign.join(', ') + ') brauchen das OK ihrer Teamleitung');
        return { apNeed: why.length > 0, apOk: !why.length, apText: why.length ? 'Freigabe nötig: ' + why.join('; ') + '. Lege es als Entwurf an oder reiche es gleich mit Freigabe ein.' : 'Ohne Freigabe: Stufe 1 oder 2, kein Budget, nur Leute aus deinem Team. Das Projekt ist sofort aktiv.' }; })(),
      fams: P_FAM.map(([fk, ic, nm2, ds, col]) => { const on = curFam === fk, ex = Object.keys(ALLTPL).filter(k => famOf(k) === fk); return { icon: ic, name: nm2, desc: ds, iconBg: col, meta: ex.length > 1 ? (ex.length === 2 ? 'Beispiel: ' : 'Beispiele: ') + ex.filter(k => !/^(leer|kan0|wf0|v0|sc0)$/.test(k)).map(k => ALLTPL[k].name).join(', ') : 'leer starten',
        pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: () => setNw({ tpl: on ? nw.tpl : ex[0], stufe: null, mods: {} }) }; }),
      ...(() => { const q = (s.exQ || '').trim().toLowerCase(), all = Object.keys(ALLTPL).filter(k => !(s.tplHide || {})[k] || nw.tpl === k), L0 = q ? all.filter(k => ((ALLTPL[k].name || '') + ' ' + (ALLTPL[k].desc || '')).toLowerCase().includes(q)) : all.filter(k => famOf(k) === curFam);
        const L1 = L0.filter(k => k === nw.tpl).concat(L0.filter(k => k !== nw.tpl)), more = s.exAll || q ? 0 : Math.max(0, L1.length - 4);
        const exTpl = k => { const x = ALLTPL[k], on = nw.tpl === k; return { icon: x.icon, name: x.name, desc: x.desc, meta: 'Stufe ' + x.stufe + (x.phases.length ? ' · ' + x.phases.length + (x.phases.length === 1 ? ' Phase' : ' Phasen') : '') + (x.tasks.length ? ' · ' + x.tasks.length + ' Startaufgaben' : ''), pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: () => setNw({ tpl: k, stufe: null, mods: {} }) }; };
        return { examples: (more ? L1.slice(0, 4) : L1).map(exTpl), exHead: q ? L0.length + (L0.length === 1 ? ' Vorlage passt' : ' Vorlagen passen') + ' zu „' + s.exQ.trim() + '“' : 'Vorlage (optional) · ' + L0.length + ' für ' + (P_FAM.find(f => f[0] === curFam) || ['', '', ''])[2],
          exQ: s.exQ || '', setExQ: e => this.setState({ exQ: e && e.target ? e.target.value : '' }), exMore: more > 0, exMoreLabel: 'Alle ' + L1.length + ' anzeigen', exAllGo: () => this.setState({ exAll: true }), exLess: !!s.exAll && !q && L1.length > 4, exLessGo: () => this.setState({ exAll: false }), exNone: !L0.length }; })(),
      name: nw.name, setName: e => this.setState({ newP: Object.assign({}, this.state.newP || NW0, { name: e && e.target ? e.target.value : '', err: '' }) }),
      start: nw.start, setStart: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) setNw({ start: v }); },
      colors: PCOLORS.map(c => ({ c, pressed: nw.color === c ? 'true' : 'false', ring: nw.color === c ? t.text : 'transparent', go: () => setNw({ color: c }) })),
      people: nw.members.map(n => ({ label: n === 'Du' ? 'Du (Projektleitung)' : n, x: n !== 'Du', rm: n + ' entfernen', go: () => { if (n === 'Du') return; setNw({ members: nw.members.filter(m => m !== n) }); } })),
      ...(() => { const q = (s.nwQ || '').trim().toLowerCase(), pool = Array.from(new Set(PPL.concat(DIR.map(d => d[0])))), hits = q.length < 2 ? [] : pool.filter(n => !nw.members.includes(n) && (n + ' ' + (TEAM_OF[n] || '')).toLowerCase().includes(q));
        return { mq: s.nwQ || '', setMq: e => this.setState({ nwQ: e && e.target ? e.target.value : '' }), mHas: hits.length > 0, mNone: q.length >= 2 && !hits.length, mInfo: hits.length > 8 ? hits.length + ' Treffer, die ersten 8. Genauer suchen grenzt ein.' : '',
          mRes: hits.slice(0, 8).map(n => ({ name: n, ini: ini(n), av: AV[n] || accent, team: TEAM_OF[n] ? 'Team ' + TEAM_OF[n] : '', load: 'ausgelastet ' + (LOAD47[n] || 60) + ' %', go: () => this.setState({ newP: Object.assign({}, nw, { members: nw.members.concat([n]), err: '' }), nwQ: '' }) })),
          mSug: PPL.filter(n => !nw.members.includes(n)).map(n => ({ label: '+ ' + n, go: () => setNw({ members: nw.members.concat([n]) }) })), mHasSug: PPL.some(n => !nw.members.includes(n)) }; })(),
      stufen: STUFEN.map(([n, name, desc]) => ({ n: String(n), name, desc: desc + (n === TP.stufe ? ' · empfohlen für diese Vorlage' : ''), pressed: nwStufe === n ? 'true' : 'false', ring: nwStufe === n ? accent : t.border, bg: nwStufe === n ? t.soft : t.surface, go: () => setNw({ stufe: n, mods: {} }) })),
      modGroups: this.modGroups(nwPs, (k, on) => setNw({ mods: Object.assign({}, nw.mods, { [k]: !on }) }), t, accent, true, curFam === 'v'),
      sumTitle: nw.name.trim() ? '„' + nw.name.trim() + '“ wird angelegt' : 'Noch ohne Name',
      sum: (P_FAM.find(f => f[0] === curFam) || ['', '', ''])[2] + (TP.name === 'Leer' ? ' (leer)' : ' · Beispiel ' + TP.name) + ' · Stufe ' + nwStufe + ' · ' + P_MODS.filter(m => modOn(nwPs, m[0])).length + ' Module · ' + nw.members.length + (nw.members.length === 1 ? ' Mitglied' : ' Mitglieder')
        + (TP.phases.length ? ' · ' + TP.phases.length + (TP.phases.length === 1 ? ' Phase mit ' : ' Phasen mit ') + TP.phases.filter(p => p[3]).length + (TP.phases.filter(p => p[3]).length === 1 ? ' Quality Gate' : ' Quality Gates') + ' (Termine ab ' + fmt(D(nw.start)) + ')' : '') + (TP.tasks.length ? ' · ' + TP.tasks.length + ' Startaufgaben' : '') + '. Du bist Projektleitung; die Mitglieder sehen das Projekt sofort.',
      hasErr: !!nw.err, err: nw.err || '',
      antrag: () => this.setState({ screen: 'antrag', aStep: 1, panel: null, aMsg: '' }),
      create: () => { const name = nw.name.trim(); if (!name) return this.setState({ newP: Object.assign({}, nw, { err: 'Bitte einen Namen eingeben.' }) });
        if (PK_OF[name] || UP.some(u => u.name === name)) return this.setState({ newP: Object.assign({}, nw, { err: 'Ein Projekt „' + name + '“ gibt es schon.' }) });
        const key = 'u' + UP.length + '_' + (s.rev || 0), words = name.split(/\s+/), code = (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
        const nodes = []; TP.phases.forEach(([pn2, a, b, g], i) => { nodes.push({ id: key + 'p' + i, name: pn2, type: 'phase', start: addDays(nw.start, a), end: addDays(nw.start, b) }); if (g) nodes.push({ id: key + 'g' + i, name: g, type: 'gate', start: addDays(nw.start, b), end: addDays(nw.start, b), checks: ['Checkliste vollständig', 'Dokumente freigegeben', 'Offene Punkte bewertet'] }); });
        PK_OF[name] = key; PL_OF[key] = 'Du'; PMEMBERS[key] = nw.members.map(m => [m, m === 'Du' ? 'Owner' : 'Bearbeiter']);
        TP.tasks.forEach((tt, i) => { const id = key + 't' + i, ph = TP.phases[Math.min(TP.phases.length - 1, Math.floor(i * TP.phases.length / Math.max(1, TP.tasks.length)))];
          const x = { id, title: tt, proj: name, due: addDays(nw.start, ph ? ph[2] : 7 * (i + 1)), bucket: 'Backlog', prio: 'Mittel', owner: nw.members[i % nw.members.length], mine: nw.members[i % nw.members.length] === 'Du', ms: null, desc: 'Aus Vorlage ' + TP.name, est: 4, co: [] };
          x.mine = x.owner === 'Du'; TASKS.push(x); TASK[id] = x; });
        (nw.llTake || []).forEach((wid, i) => { const w = WISSEN.find(z => z.id === wid); if (!w) return; const rec = (w.f.find(z => z[0] === 'Empfehlung') || w.f[w.f.length - 1])[1], id = key + 'l' + i;
          const x = { id, title: rec.length > 90 ? w.title : rec, proj: name, due: addDays(nw.start, 14), bucket: 'Backlog', prio: 'Mittel', owner: 'Du', mine: true, ms: null, desc: 'Aus Lessons Learned „' + w.title + '“ (' + w.origin + ')', est: 2, co: [] }; TASKS.push(x); TASK[id] = x; });
        const u = { key, name, code, color: nw.color, tpl: nw.tpl, model: TP.model, stufe: nwStufe, mods: nw.mods, start: nw.start, members: nw.members.slice(), nodes, risks: [], costs: [], budget: nwStufe >= 3 ? 50000 : 0, reqs: [], archived: false };
        this.setState({ rev: (s.rev || 0) + 1, uprojs: UP.concat([u]), screen: 'pn', upSel: key, upTab: TP.tasks.length || !nodes.length ? 'aufgaben' : 'planung', newP: null, pnMsg: 'Projekt „' + name + '“ angelegt' + (nodes.length ? ' mit ' + nodes.filter(n => n.type === 'phase').length + ' Phasen und ' + nodes.filter(n => n.type === 'gate').length + ' Quality Gates' : '') + (TP.tasks.length ? ' und ' + TP.tasks.length + ' Aufgaben' : '') + '. Aufgaben direkt in einer Spalte mit „+ Aufgabe“ anlegen.' }); } };

    const upCur = UP.find(u => u.key === s.upSel) || null;
    // eigene Projekte: Baum aus Phasen und Meilensteinen im globalen Knotenmodell anmelden (Detail, Gantt-Logik, Gates)
    const regU = u => { if (u.tree) { PTREE_OF[u.key] = u.tree; return; } const ph = u.nodes.filter(n => n.type === 'phase').map(n => Object.assign(n, { children: n.children || [], owner: n.owner || 'Du', tasks: n.tasks || [], kindLabel: 'Phase' }));
      const top = ph.slice(); u.nodes.filter(n => n.type !== 'phase').forEach(n => { Object.assign(n, { owner: n.owner || 'Du', tasks: n.tasks || [], kindLabel: n.kindLabel || (n.type === 'gate' && !n.msPoint ? 'Quality Gate' : 'Meilenstein'), msPoint: n.type === 'ms' ? true : n.msPoint });
        if (n.type === 'ms') n.type = 'gate'; const p0 = ph.find(q => n.end >= q.start && n.end <= q.end) || ph.find(q => n.end === q.end); if (p0) { p0.children.push(n); PARENT[n.id] = p0.id; } else { top.push(n); PARENT[n.id] = null; } NODE[n.id] = n; });
      ph.forEach(n => { NODE[n.id] = n; PARENT[n.id] = null; }); u.tree = top.sort((x, y) => (x.start < y.start ? -1 : 1)); PTREE_OF[u.key] = u.tree; };
    (s.uprojs || []).forEach(regU);
    let pn = { name: '', code: '', color: accent, meta: '', tabs: [], is: {}, hasMsg: false, msg: '' };
    if (upCur) { const u = upCur, ups = Object.assign({ stufe: u.stufe, mods: u.mods || {} }, (s.psetBy || {})[u.key] || {}), on = k => modOn(ups, k);
      const updU = (patch, msg) => this.setState({ uprojs: (this.state.uprojs || []).map(x => (x.key === u.key ? Object.assign({}, x, typeof patch === 'function' ? patch(x) : patch) : x)), pnMsg: msg || '', boardMsg: '' });
      const setUps = (patch, msg) => this.setState({ psetBy: Object.assign({}, s.psetBy, { [u.key]: Object.assign({}, ups, patch) }), pnMsg: msg || '' });
      const isVu = /V-Modell/.test(u.model);
      const TABS0 = [['uebersicht', 'Übersicht', true], ['aufgaben', 'Aufgaben', true], ['planung', 'Planung', on('plan')], ['team', 'Team', true], ['risiken', 'Risiken', on('risk')], ['zeiten', 'Zeiten', on('zeit')], ['kapazitaet', 'Kapazität', on('res')], ['status', 'Statusbericht', on('status')], ['opl', 'Offene Punkte', on('opl')], ['dokumente', 'Dokumente', on('docs')], ['budget', 'Finanzen', on('budget')], ['aenderungen', 'Change Requests', on('cr')], ['abschluss', 'Abschluss', on('close')], ['anf', 'Anforderungen', isVu && (on('req') || on('test'))], ['verlauf', 'Verlauf', on('audit')]].filter(x => x[2]);
      const myRoleP = ((PMEMBERS[u.key] || []).find(x => x[0] === 'Du') || [])[1] || 'Owner', asRole = (s.pnAs || {})[u.key] || myRoleP, meHide = (s.pTabMe || {})[u.key] || {};
      const TABS = TABS0.filter(x => this.tabSeen(u.key, asRole, x[0]) && !meHide[x[0]]);
      const tab = TABS.some(x => x[0] === s.upTab) ? s.upTab : 'uebersicht', tasks = TASKS.filter(x => x.proj === u.name), byDue2 = (a, b) => (a.due < b.due ? -1 : 1);
      const view = s.upView || 'board', bks = this.bucketsOf(u.key);
      const cardO = (x, i, list) => { const o = this.ownerOf(x), ts = this.taskStatus(x); return { title: x.title, owner: nm(o), ini: ini(o), av: AV[o] || accent, due: fmt(D(x.due)), edge: stc(ts), strike: ts === 'erledigt' ? 'line-through' : 'none', open: () => this.openTask(x.id, 'pn'), drag: this.dragStart(x.id), dragEnd: this.dragEnd(),
        left: () => { const ci = bks.findIndex(b => b.key === this.bucketOf(x)); if (ci > 0) this.bucketTo(x.id, bks[ci - 1].key); }, right: () => { const ci = bks.findIndex(b => b.key === this.bucketOf(x)); if (ci < bks.length - 1) this.bucketTo(x.id, bks[ci + 1].key); } }; };
      const flat = []; const walk = (l, d) => l.forEach(n => { flat.push({ n, d }); if (n.children) walk(n.children, d + 1); }); walk(u.tree || [], 0);
      const gatesAll = flat.map(f => f.n).filter(n => n.type !== 'phase').sort((a, b) => (a.end < b.end ? -1 : 1)), gres = Object.assign({}, s.upGate || {}, s.gateRes || {});
      const phs = flat.map(f => f.n), p0 = phs.length ? phs.reduce((a, n) => (n.start < a ? n.start : a), phs[0].start) : u.start, p1 = phs.length ? phs.reduce((a, n) => (n.end > a ? n.end : a), phs[0].end) : (u.end || u.start), span = Math.max(1, dd(D(p0), D(p1)));
      const nextG = gatesAll.find(n => !gres[n.id] && n.end >= '2026-11-13'), open = tasks.filter(x => !this.isDone(x)), costSum = u.costs.reduce((a, c) => a + c[1], 0) + ((s.pInv || {})[u.key] || []).filter(i0 => i0.status === 'freigegeben').reduce((a, i0) => a + i0.amt, 0);
      const rk = s.upRk || { t: '', w: 3, a: 3 };
      const ovd = flat.filter(f => (f.n.type !== 'phase' || !(f.n.children || []).length) && this.nodeStatus(f.n) === 'ueberfaellig').length, otk = tasks.filter(x => this.taskStatus(x) === 'ueberfaellig').length, chipC = (bg, fg, bd, label) => ({ bg, fg, bd, label });
      pn = { name: u.name, code: u.code, color: (ups.color || u.color), meta: u.model + ' · Stufe ' + ups.stufe + ' · Projektleitung: ' + ((PL_OF[u.key] || 'Du') === 'Du' ? 'du' : PL_OF[u.key]) + ' · ' + fmt(D(p0)) + D(p0).getFullYear() + ' – ' + fmt(D(p1)) + D(p1).getFullYear() + (u.v2status ? ' · Status ' + u.v2status : '') + (u.kst ? ' · KST ' + u.kst : '') + (ups.archived ? ' · archiviert' : ''),
        chips: [ovd + otk ? chipC(RED, '#FFFFFF', RED, '! Termin: ' + (ovd + otk) + ' überfällig') : chipC(GREEN, '#FFFFFF', GREEN, '✓ Termine im Plan')]
          .concat(on('budget') ? [u.budget && costSum > u.budget ? chipC(RED, '#FFFFFF', RED, '! Kosten über Budget') : chipC(GREEN, '#FFFFFF', GREEN, '✓ Kosten im Budget')] : [])
          .concat(nextG ? [chipC(t.surface, t.text, t.strong, 'Qualität: ' + nextG.name.replace(/^Gate /, 'Gate ') + ' offen')] : []),
        asInfo: asRole !== myRoleP ? 'Vorschau: so sieht ein ' + asRole + ' das Projekt.' : '', hasAs: asRole !== myRoleP, asReset: () => this.setState({ pnAs: Object.assign({}, s.pnAs, { [u.key]: null }) }),
        meOpen: !!s.pTabMeOpen, meToggle: () => this.setState({ pTabMeOpen: !s.pTabMeOpen }),
        meOpts: TABS0.filter(x => x[0] !== 'uebersicht' && x[0] !== 'aufgaben' && x[0] !== 'team' && this.tabSeen(u.key, asRole, x[0])).map(([k, l]) => { const on2 = !meHide[k]; return { label: (on2 ? '✓ ' : '+ ') + l, pressed: on2 ? 'true' : 'false', ring: on2 ? accent : t.border, bg: on2 ? t.soft : t.surface, go: () => this.setState({ pTabMe: Object.assign({}, s.pTabMe, { [u.key]: Object.assign({}, meHide, { [k]: on2 }) }) }) }; }),
        ...(() => { const sp = this.tabSplit(TABS.map(([k, l]) => ({ k, label: l, sel: tab === k ? 'true' : 'false', line: tab === k ? accent : 'transparent', fg: tab === k ? t.text : t.muted, fw: tab === k ? 700 : 500, go: () => this.setState({ upTab: k, pnMsg: '', boardMsg: '', mxMsg: '' }) }))); return { tabsMore: sp }; })(),
        tabs: TABS.map(([k, l]) => ({ label: l, sel: tab === k ? 'true' : 'false', line: tab === k ? accent : 'transparent', fg: tab === k ? t.text : t.muted, fw: tab === k ? 700 : 500, go: () => this.setState({ upTab: k, pnMsg: '', boardMsg: '', mxMsg: '' }) })),
        is: { dokumente: tab === 'dokumente', team: tab === 'team', uebersicht: tab === 'uebersicht', aufgaben: tab === 'aufgaben', planung: tab === 'planung', risiken: tab === 'risiken', budget: tab === 'budget', anf: tab === 'anf', einst: tab === 'einst' },
        hasMsg: !!(s.pnMsg || s.boardMsg), msg: s.pnMsg || s.boardMsg || '',
        addTask: () => this.setState({ upTab: 'aufgaben', upView: 'board', qa: 'pn|' + bks[0].key, qaText: '', pnMsg: '' }),
        kpis: [{ label: 'Offene Aufgaben', value: String(open.length), sub: (tasks.length - open.length) + ' erledigt', color: t.text, go: () => this.setState({ upTab: 'aufgaben' }) },
          { label: 'Überfällig', value: String(open.filter(x => x.due < '2026-11-13').length), sub: 'nach Fälligkeit', color: open.some(x => x.due < '2026-11-13') ? RED : t.text, go: () => this.setState({ upTab: 'aufgaben', upView: 'liste' }) }]
          .concat(on('plan') ? [{ label: 'Nächster Termin', value: nextG ? fmt(D(nextG.end)) : '–', sub: nextG ? nextG.name : 'keine Meilensteine', color: t.text, go: () => this.setState({ upTab: 'planung' }) }] : [])
          .concat(on('risk') ? (() => { const RK = this.risksOf(u.key).filter(r => r.st !== 'geschlossen'), hi = RK.filter(r => r.w * r.a >= 12).length; return [{ label: 'Risiken', value: String(RK.length), sub: hi + ' hoch', color: hi ? RED : t.text, go: () => this.setState({ upTab: 'risiken' }) }]; })() : [])
          .concat(on('budget') ? [{ label: 'Budget verbraucht', value: u.budget ? Math.round(costSum / u.budget * 100) + ' %' : '–', sub: fE(costSum) + ' von ' + fE(u.budget), color: u.budget && costSum > u.budget ? RED : t.text, go: () => this.setState({ upTab: 'budget' }) }] : []),
        modList: P_MODS.filter(m => on(m[0])).map(m => m[1]),
        views: [['board', 'Board'], ['liste', 'Liste']].map(([k, l]) => ({ label: l, pressed: view === k ? 'true' : 'false', ring: view === k ? accent : t.border, bg: view === k ? t.soft : t.surface, go: () => this.setState({ upView: k }) })),
        isBoard: view === 'board', isList: view === 'liste', qaWho: u.members.map(m => ({ name: m, ini: ini(m), av: AV[m] || accent, pressed: (u.members.includes(s.qaWho) ? s.qaWho : 'Du') === m ? 'true' : 'false', ring: (u.members.includes(s.qaWho) ? s.qaWho : 'Du') === m ? t.text : 'transparent', go: () => this.setState({ qaWho: m }) })), qaText: s.qaText || '', setQa: e => this.setState({ qaText: e && e.target ? e.target.value : '' }), qaCancel: () => this.setState({ qa: null, qaText: '' }),
        cols: bks.map(b => { const key = 'pn|' + b.key, hot = s.dragOver === key, items = tasks.filter(x => this.bucketOf(x) === b.key).sort(byDue2), adding = s.qa === key;
          return { name: b.name, color: b.color, count: String(items.length), bg: hot ? t.soft : t.surface2, bd: hot ? accent : t.border, bdStyle: hot ? 'dashed' : 'solid', over: this.dragOver(key), drop: this.dropOn(key, id => { if (TASK[id]) this.bucketTo(id, b.key); }),
            rename: e => this.bkRename(u.key, b.key, e && e.target ? e.target.value : b.name), left: () => this.bkMove(u.key, b.key, -1), right: () => this.bkMove(u.key, b.key, 1), del: () => this.bkDel(u.key, b.key, u.name),
            cards: items.map(cardO), adding, notAdding: !adding, add: () => this.setState({ qa: key, qaText: '' }),
            save: () => { const tt = (this.state.qaText || '').trim(); if (!tt) return; this.quickTask({ title: tt, proj: u.name, bucket: b.key, due: addDays(u.start, 14), owner: u.members.includes(this.state.qaWho) ? this.state.qaWho : 'Du' }); this.setState({ qa: key, pnMsg: '„' + tt + '“ in „' + b.name + '“ angelegt.' }); } }; }),
        addCol: () => this.bkAdd(u.key),
        qaDue: s.qaDue || addDays(u.start, 7), setQaDue: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) this.setState({ qaDue: v }); },
        listAdd: () => { const tt = (this.state.qaText || '').trim(); if (!tt) return this.setState({ pnMsg: 'Erst einen Titel eingeben.' }); const ow = u.members.includes(this.state.qaWho) ? this.state.qaWho : 'Du'; this.quickTask({ title: tt, proj: u.name, due: s.qaDue || addDays(u.start, 7), owner: ow }); this.setState({ pnMsg: '„' + tt + '“ angelegt' + (ow !== 'Du' ? ' für ' + ow + ', ohne Annahme (im Projekt)' : '') + '.' }); },
        rows: tasks.slice().sort(byDue2).map(x => { const dn = this.isDone(x), o = this.ownerOf(x); return { title: x.title, checked: dn ? 'true' : 'false', mark: dn ? '✓' : '', fill: dn ? GREEN : 'transparent', ring: dn ? GREEN : t.strong, strike: dn ? 'line-through' : 'none', toggle: () => this.toggleDone(x.id), open: () => this.openTask(x.id, 'pn'), bucket: this.bucketName(x, this.bucketOf(x)), owner: nm(o), ini: ini(o), av: AV[o] || accent, due: fmt(D(x.due)), dueIso: x.due, setDue: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v) && +v.slice(0, 4) >= 2020) { this.setDue(x.id, v); this.setState({ pnMsg: '„' + x.title + '“ ist jetzt am ' + fmt(D(v)) + ' fällig.' }); } } }; }),
        noPhases: flat.length === 0, todayLeft: pct(Math.max(0, Math.min(100, dd(D(p0), TODAY) / span * 100))),
        pmonths: (() => { const out = []; let d0 = D(p0); d0 = new Date(d0.getFullYear(), d0.getMonth(), 1); const end = D(p1); while (d0 <= end && out.length < 14) { const nx = new Date(d0.getFullYear(), d0.getMonth() + 1, 1), a0 = d0 < D(p0) ? D(p0) : d0, b0 = nx > end ? end : nx; out.push({ label: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][d0.getMonth()] + ' ' + String(d0.getFullYear()).slice(2), flex: String(Math.max(1, dd(a0, b0))) }); d0 = nx; } return out; })(),
        ...(() => { const gw = (s.pnGWin || {})[u.key] || [0, 0], f0 = D(p0) < TODAY ? D(p0) : TODAY, G0 = new Date(f0.getFullYear(), f0.getMonth() - 1 - gw[0], 1); let G1 = new Date(D(p1).getFullYear(), D(p1).getMonth() + 2 + gw[1], 0); if (dd(G0, G1) < 120) G1 = new Date(G0.getFullYear(), G0.getMonth() + 4, 0);
          const canP = this.canPlan(u.key), setW = w => this.setState({ pnGWin: Object.assign({}, s.pnGWin, { [u.key]: w }) });
          const GS = dd(G0, G1) + 1, MNL = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'], gMonths = [], gLines = [];
          for (let m = new Date(G0); m <= G1; m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) { const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate(); gMonths.push({ label: MNL[m.getMonth()] + (m.getMonth() === 0 || !gMonths.length ? ' ' + m.getFullYear() : ''), flex: String(days) }); if (m > G0) gLines.push({ left: pct(dd(G0, m) / GS * 100) }); }
          const amp = s.pnAmpel || 'alle', ex = s.pnExp || {}, isOpen = n => ex[n.id] !== false, blU = (s.blBy || {})[u.key] || null, blM = blU ? blU.map : {}, blOn = s.blOn !== false, raw = [];
          const walkG = (list, depth) => list.forEach(n => { const st = this.nodeStatus(n); if (amp === 'alle') { raw.push({ n, depth, st }); if (n.children && n.children.length && isOpen(n)) walkG(n.children, depth + 1); } else { if (st === amp) raw.push({ n, depth: 0, st }); if (n.children) walkG(n.children, depth + 1); } });
          walkG(u.tree || [], 0);
          const parents = flat.map(f => f.n).filter(n => n.children && n.children.length), allOpen = parents.every(isOpen);
          const L = [['alle', 'Alle', t.track, t.strong], ['erledigt', 'Erledigt', GREEN, GREEN], ['plan', 'Im Plan', t.surface, t.strong], ['ueberfaellig', 'Überfällig', RED, RED]];
          const moved = flat.map(f => f.n).filter(n => blM[n.id] && dd(D(blM[n.id][1]), D(n.end)) !== 0), mx = moved.reduce((m0, n) => Math.max(m0, dd(D(blM[n.id][1]), D(n.end))), 0);
          return { gMonths, gLines, gToday: pct(dd(G0, TODAY) / GS * 100), gTodayOn: TODAY >= G0 && TODAY <= G1, gEmpty: !!flat.length && !raw.length,
            gEarlier: () => setW([gw[0] + 1, gw[1]]), gLater: () => setW([gw[0], gw[1] + 1]), gShifted: !!(gw[0] || gw[1]), gReset: () => setW([0, 0]),
            gLegend: L.map(([k, l, bg, bd]) => ({ label: l, bg, bd, pressed: amp === k ? 'true' : 'false', ring: amp === k ? accent : t.border, pick: () => this.setState({ pnAmpel: k }) })),
            gToggleLabel: allOpen ? 'Alle zuklappen' : 'Alle aufklappen', gToggleAll: () => { const e = Object.assign({}, ex); parents.forEach(n => { e[n.id] = !allOpen; }); this.setState({ pnExp: e }); },
            gbl: { onA: blOn ? 'true' : 'false', ring: blOn ? accent : t.border, btn: blOn ? '▬ Baseline an' : '▬ Baseline aus', toggle: () => this.setState({ blOn: !blOn }), saveLabel: blU ? 'Neue Baseline speichern' : 'Baseline speichern',
              text: blU ? 'Baseline vom ' + blU.date + ': ' + (moved.length ? moved.length + (moved.length === 1 ? ' Termin' : ' Termine') + ' verschoben' + (mx > 0 ? ', größte Verschiebung +' + mx + ' Tage' : '') + '. Grauer Balken = Plan laut Baseline.' : 'alle Termine wie geplant.') : 'Noch keine Baseline. Speichere sie, sobald der Plan steht; danach siehst du jede Verschiebung als grauen Balken.',
              save: () => { const map = {}; flat.forEach(({ n }) => { map[n.id] = [n.start, n.end]; }); this.setState({ blBy: Object.assign({}, s.blBy, { [u.key]: { date: fmt(TODAY) + TODAY.getFullYear(), iso: '2026-11-13', map } }), pnMsg: 'Baseline gespeichert (' + fmt(TODAY) + TODAY.getFullYear() + '). Verschiebungen zählen ab jetzt gegen diesen Stand.' }); } },
            gRows: (() => { const depsU = this.depsOf(), nodesU = []; const wU = l => (l || []).forEach(x => { nodesU.push(x); wU(x.children); }); wU(u.tree); const critU = this.critSet(nodesU, depsU), depLbl = n => this.depLabel(n, depsU); return  raw.map(({ n, depth, st }) => { const a1 = D(n.start), b1 = D(n.end), point = n.type === 'gate', hint = this.overdueBelow(n), ch0 = this.chip(st, t, accent), gr = gres[n.id], hasKids = !!(n.children && n.children.length) && amp === 'alle', op = isOpen(n);
              const ch = point && !n.msPoint && st !== 'erledigt' && st !== 'ueberfaellig' ? Object.assign({}, ch0, { bg: '#5B2D90', bd: '#5B2D90', fg: '#FFFFFF' }) : ch0;
              const bm = blM[n.id], bl = (() => { if (!bm || !blOn) return { blShow: false, blLeft: '0%', blWidth: '0%', hasDev: false, dev: '', devColor: t.muted, devTitle: '' }; const ba = D(bm[0]), bb = D(bm[1]), dv = dd(bb, b1);
                return { blShow: dv !== 0 || dd(ba, a1) !== 0, blLeft: pct(dd(G0, ba) / GS * 100), blWidth: point ? '6px' : pct(Math.max((dd(ba, bb) + 1) / GS * 100, 0.8)), hasDev: dv !== 0, dev: (dv > 0 ? '+' : '−') + Math.abs(dv) + ' T. zur Baseline', devColor: dv > 0 ? RED : GREEN, devTitle: 'Baseline ' + fmt(ba) + (point ? '' : ' – ' + fmt(bb)) }; })();
              const dk = 'gr|' + n.id;
              return Object.assign({ de: this.dateEdit(n, canP), isPhase: n.type === 'phase', addInLabel: 'Meilenstein oder Gate in „' + n.name + '“ anlegen',
                addIn: () => { this.setState({ upAddK: 'ms', upPar: n.id, upMsD: n.end, upMsN: '', pnMsg: 'Unten ist alles für „' + n.name + '“ vorbereitet: Art wählen (Meilenstein oder Gate), Namen eingeben, Enter.' }); setTimeout(() => { const el = document.querySelector('input[aria-label="Name"]'); if (el) { el.focus(); if (el.scrollIntoView) el.scrollIntoView({ block: 'center' }); } }, 60); },
                rowDrag: this.dragStart('gr:' + n.id), rowEnd: this.dragEnd(), rowOver: this.dragOver(dk), rowHot: s.dragOver === dk ? t.soft : 'transparent',
                rowDrop: this.dropOn(dk, id => { if (typeof id === 'string' && id.indexOf('gr:') === 0) this.nodeMove(u, id.slice(3), n.id); }),
                nid: n.id, name: n.name + (gr ? ({ ok: ' ✓', auflage: ' ✓ (Auflage)', nein: ' ✗', bestanden: ' ✓', nicht: ' ✗' })[gr.r || gr] || '' : ''), dragMove: this.ganttStart(n.id, 'move'), dragDur: this.ganttStart(n.id, 'end'), dragStartH: this.ganttStart(n.id, 'start'), over: this.ganttOver(), drop: this.ganttDrop(GS), canResize: !point, endLeft: pct((dd(G0, b1) + 1) / GS * 100),
                fw: n.type === 'phase' ? 700 : 500, indent: (8 + depth * 22) + 'px', dates: point ? fmt(b1) : fmt(a1) + ' – ' + fmt(b1),
                hasKids, noKids: !hasKids, expanded: op ? 'true' : 'false', chev: op ? 'rotate(90deg)' : 'none', toggleLabel: (op ? 'Zuklappen: ' : 'Aufklappen: ') + n.name,
                toggle: () => this.setState({ pnExp: Object.assign({}, ex, { [n.id]: !op }) }),
                open: () => this.setState({ panel: { kind: 'node', id: n.id, from: 'pn' }, pSub: 'details', akMsg: '' }),
                hasHint: hint > 0 && st !== 'ueberfaellig', hint: hint + ' überfällig', chip: ch,
                left: pct(dd(G0, a1) / GS * 100), width: point ? '16px' : pct(Math.max((dd(a1, b1) + 1) / GS * 100, 0.8)),
                barH: point ? '16px' : (n.type === 'phase' ? '22px' : '16px'), barMt: point ? '-8px' : (n.type === 'phase' ? '-11px' : '-8px'),
                transform: point ? (n.msPoint ? 'translateX(-50%) rotate(45deg)' : 'translateX(-50%)') : 'none', radius: point ? (n.msPoint ? '3px' : '4px') : '6px',
                shadow: critU.has(n.id) ? '0 0 0 3px rgba(197,15,31,0.55)' : '0 1px 2px rgba(0,0,0,0.12)', ...depLbl(n),
                barText: point ? (n.msPoint ? '' : 'G') : (st === 'erledigt' ? ' ✓' : (st === 'ueberfaellig' ? ' !' : '')), aria: (n.kindLabel || KIND[n.type] || '') + ' ' + n.name + ', ' + ch.label,
                rowBg: s.panel && s.panel.id === n.id ? t.hl : 'transparent' }, bl); }); })() }; })(),
        trows: flat.map(({ n, d }) => { const st = this.nodeStatus(n), ch = this.chip(st, t, accent), gr = gres[n.id], isPt = n.type === 'gate', isG = isPt && !n.msPoint, a0 = D(n.start), b0 = D(n.end);
          return { name: n.name, icon: n.type === 'phase' ? (d ? '▭' : '▬') : (isG ? '◈' : '◆'), iconColor: isG ? '#5B2D90' : (n.type === 'phase' ? accent : t.text), indent: (8 + d * 20) + 'px', fw: n.type === 'phase' && !d ? '700' : '500',
            dates: isPt ? fmt(b0) : fmt(a0) + ' – ' + fmt(b0), st: gr ? ({ ok: '✓ bestanden', auflage: '✓ mit Auflage', nein: '✗ nicht bestanden', bestanden: '✓ bestanden', nicht: '✗ nicht bestanden' })[gr.r || gr] || ch.label : ch.label, stBg: ch.bg, stFg: ch.fg, stBd: ch.bd,
            left: pct(Math.max(0, dd(D(p0), a0) / span * 100)), width: isPt ? '14px' : pct(Math.max(1.5, (dd(a0, b0) + 1) / span * 100)), h: isPt ? '14px' : (d ? '12px' : '18px'), mt: isPt ? '-7px' : (d ? '-6px' : '-9px'), tf: isPt ? 'translateX(-50%) rotate(45deg)' : 'none', rad: isPt ? '3px' : '5px',
            bar: st === 'erledigt' ? GREEN : (st === 'ueberfaellig' ? RED : (isG ? '#5B2D90' : (n.type === 'phase' && !d ? (ups.color || u.color) : accent))), open: () => this.setState({ panel: { kind: 'node', id: n.id, from: 'pn' }, pSub: 'details', akMsg: '' }) }; }),
        addKinds: [['phase', '▭ Phase'], ['ms', '◆ Meilenstein (Termin)'], ['msr', '▬ Meilenstein (von–bis)'], ['gate', '▣ Quality Gate']].map(([k, l]) => ({ label: l, pressed: (s.upAddK || 'phase') === k ? 'true' : 'false', ring: (s.upAddK || 'phase') === k ? accent : t.border, bg: (s.upAddK || 'phase') === k ? t.soft : t.surface, go: () => this.setState({ upAddK: k }) })),
        addIsPhase: (s.upAddK || 'phase') === 'phase', addHasEnd: ['phase', 'msr'].includes(s.upAddK || 'phase'), addNotPhase: (s.upAddK || 'phase') !== 'phase',
        msEnd: s.upMsE || addDays(s.upMsD || addDays(u.start, 30), s.upDur || 28), setMsEnd: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) this.setState({ upMsE: v, upDur: 0 }); },
        addPars: [['', 'automatisch nach Termin']].concat((u.tree || []).filter(q => q.type === 'phase').map(q => [q.id, q.name + ' (' + fmt(D(q.start)) + '–' + fmt(D(q.end)) + ')'])).concat([['__top', 'keine (oberste Ebene)']]).map(([k, l]) => ({ label: l, pressed: (s.upPar || '') === k ? 'true' : 'false', ring: (s.upPar || '') === k ? accent : t.border, bg: (s.upPar || '') === k ? t.soft : t.surface, go: () => this.setState({ upPar: k }) })),
        addPh: ({ phase: 'z. B. Montage und Verdrahtung', ms: 'z. B. Schaltschrank geliefert', msr: 'z. B. Mechanik montiert', gate: 'z. B. Abnahme FAT' })[s.upAddK || 'phase'], addDateLabel: ({ phase: 'Beginn', ms: 'Termin', msr: 'Beginn', gate: 'Fällig am' })[s.upAddK || 'phase'],
        durs: [[14, '2 Wo.'], [28, '4 Wo.'], [56, '8 Wo.']].map(([d0, l]) => ({ label: l, pressed: (s.upDur || 28) === d0 ? 'true' : 'false', ring: (s.upDur || 28) === d0 ? accent : t.border, bg: (s.upDur || 28) === d0 ? t.soft : t.surface, go: () => this.setState({ upDur: d0, upMsE: addDays(s.upMsD || addDays(u.start, 30), d0) }) })),
        addBtn: ({ phase: 'Phase anlegen', ms: 'Meilenstein anlegen', msr: 'Meilenstein anlegen', gate: 'Gate anlegen' })[s.upAddK || 'phase'],
        addNote: (s.upAddK || 'phase') === 'phase' ? 'Eine Phase hat Beginn und Ende. Meilensteine und Gates ordnest du danach einer Phase zu; Arbeitspakete legst du im Detail einer Phase an.' : ((s.upAddK === 'gate' ? 'Ein Quality Gate hat einen Fälligkeitstermin und eine Checkliste. ' : 'Ein Meilenstein ist ein Termin ohne Dauer. ') + 'Er liegt immer innerhalb der gewählten Phase; ein Datum außerhalb wird an die Phase angepasst. Termine änderst du später direkt in der Spalte „Termin“.'),
        addNode: () => { const k = s.upAddK || 'phase', nm2 = (s.upMsN || '').trim(), d2 = s.upMsD || addDays(u.start, 30), e2 = s.upMsE || addDays(d2, s.upDur || 28); if (!nm2) return this.setState({ pnMsg: 'Erst einen Namen eingeben.' });
          if ((k === 'phase' || k === 'msr') && e2 < d2) return this.setState({ pnMsg: 'Das Ende liegt vor dem Beginn. Bitte Ende ändern.' });
          const id = u.key + 'x' + Object.keys(NODE).length, n = k === 'phase' ? { id, name: nm2, type: 'phase', start: d2, end: e2, children: [], owner: 'Du', tasks: [], kindLabel: 'Phase' } : k === 'msr' ? { id, name: nm2, type: 'ms', start: d2, end: e2, children: [], owner: 'Du', tasks: [], msPoint: false, kindLabel: 'Meilenstein' }
            : { id, name: nm2, type: 'gate', start: d2, end: d2, owner: 'Du', tasks: [], msPoint: k === 'ms', kindLabel: k === 'ms' ? 'Meilenstein' : 'Quality Gate', checks: k === 'gate' ? ['Checkliste vollständig', 'Dokumente freigegeben', 'Offene Punkte bewertet'] : [] };
          const phs = (u.tree || []).filter(q => q.type === 'phase'), selP = s.upPar || '', par = k === 'phase' || selP === '__top' ? null : (selP ? phs.find(q => q.id === selP) : phs.find(q => d2 >= q.start && d2 <= q.end)) || null;
          const ext = par ? this.fitInto(n, par) : '';
          if (par) par.children = (par.children || []).concat([n]); else u.tree.push(n); NODE[id] = n; PARENT[id] = par ? par.id : null; u.tree.sort((x, y) => (x.start < y.start ? -1 : 1)); const depT = this.autoDep(id);
          this.setState({ rev: (s.rev || 0) + 1, upMsN: '', upMsE: null, upPar: '', pnMsg: n.kindLabel + ' „' + nm2 + '“ angelegt' + (par ? ' in „' + par.name + '“' : '') + ', ' + (k === 'phase' || k === 'msr' ? fmt(D(n.start)) + ' – ' + fmt(D(n.end)) : (k === 'gate' ? 'fällig am ' : '') + fmt(D(n.end))) + '.' + ext + depT + ' Klick auf die Zeile öffnet das Detail.' }); },
        gates: [].map(n => { const r = gres[n.id], isG = n.type === 'gate', late = !r && n.end < '2026-11-13'; const ST = { bestanden: ['Bestanden', GREEN], auflage: ['Mit Auflage', '#C19C00'], nicht: ['Nicht bestanden', RED] };
          const setR = v => () => { if (v === 'auflage') this.quickTask({ title: 'Auflage aus ' + n.name + ' erfüllen', proj: u.name, due: addDays(n.end, 14) }); this.setState({ upGate: Object.assign({}, this.state.upGate, { [n.id]: v }), pnMsg: n.name + ': ' + ST[v][0] + '.' + (v === 'auflage' ? ' Die Auflage steht als Aufgabe im Backlog, fällig in 14 Tagen.' : (v === 'nicht' ? ' Die Phase bleibt offen, bis das Gate erneut bewertet ist.' : '')) }); };
          return { icon: isG ? '◈' : '◆', name: n.name, sub: fmt(D(n.end)) + (isG && n.checks ? ' · Checkliste: ' + n.checks.join(', ') : ''), status: r ? ST[r][0] : (late ? 'überfällig' : 'geplant'), stBg: r ? ST[r][1] : (late ? RED : t.strong), canDecide: isG && !r, pass: setR('bestanden'), cond: setR('auflage'), fail: setR('nicht') }; }),
        msKey: e => { if (e && e.key === 'Enter') { const b = [...document.querySelectorAll('button')].find(x => /^(Phase|Meilenstein|Gate) anlegen$/.test(x.textContent.trim())); if (b) b.click(); } }, msName: s.upMsN || '', setMsName: e => this.setState({ upMsN: e && e.target ? e.target.value : '' }), msDate: s.upMsD || addDays(u.start, 30), setMsDate: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) this.setState({ upMsD: v, upMsE: (s.upDur || 0) ? addDays(v, s.upDur) : (s.upMsE && s.upMsE >= v ? s.upMsE : addDays(v, 28)) }); },
        addMs: () => { const nm2 = (s.upMsN || '').trim() || 'Neuer Meilenstein', d2 = s.upMsD || addDays(u.start, 30); updU(x => ({ nodes: x.nodes.concat([{ id: u.key + 'm' + x.nodes.length, name: nm2, type: 'ms', start: d2, end: d2 }]) }), '◆ „' + nm2 + '“ am ' + fmt(D(d2)) + ' angelegt.'); this.setState({ upMsN: '' }); },
        addGate: () => { const nm2 = (s.upMsN || '').trim() || 'Neues Quality Gate', d2 = s.upMsD || addDays(u.start, 30); updU(x => ({ nodes: x.nodes.concat([{ id: u.key + 'q' + x.nodes.length, name: nm2, type: 'gate', start: d2, end: d2, checks: ['Checkliste vollständig', 'Dokumente freigegeben'] }]) }), '◈ „' + nm2 + '“ am ' + fmt(D(d2)) + ' angelegt.'); this.setState({ upMsN: '' }); },
        addPhase: () => { const nm2 = (s.upMsN || '').trim() || 'Neue Phase', d2 = s.upMsD || u.start; updU(x => ({ nodes: x.nodes.concat([{ id: u.key + 'h' + x.nodes.length, name: nm2, type: 'phase', start: d2, end: addDays(d2, 28) }]) }), 'Phase „' + nm2 + '“ ab ' + fmt(D(d2)) + ' für 4 Wochen angelegt.'); this.setState({ upMsN: '' }); },
        risks: u.risks.map((r, i) => { const sc = r.w * r.a; return { title: r.t, score: String(sc), bg: sc >= 12 ? RED : (sc >= 6 ? '#C19C00' : GREEN), sub: 'Wahrscheinlichkeit ' + r.w + ' × Auswirkung ' + r.a + (sc >= 12 ? ' · Maßnahme festlegen' : ''), del: () => updU(x => ({ risks: x.risks.filter((z, k) => k !== i) }), 'Risiko gelöscht.') }; }), noRisks: u.risks.length === 0,
        rkText: rk.t, setRk: e => this.setState({ upRk: Object.assign({}, rk, { t: e && e.target ? e.target.value : '' }) }),
        rkW: [1, 2, 3, 4, 5].map(v => ({ label: String(v), pressed: rk.w === v ? 'true' : 'false', ring: rk.w === v ? accent : t.border, bg: rk.w === v ? t.soft : t.surface, go: () => this.setState({ upRk: Object.assign({}, rk, { w: v }) }) })),
        rkA: [1, 2, 3, 4, 5].map(v => ({ label: String(v), pressed: rk.a === v ? 'true' : 'false', ring: rk.a === v ? accent : t.border, bg: rk.a === v ? t.soft : t.surface, go: () => this.setState({ upRk: Object.assign({}, rk, { a: v }) }) })),
        addRisk: () => { if (!rk.t.trim()) return this.setState({ pnMsg: 'Erst beschreiben, was schiefgehen kann.' }); updU(x => ({ risks: x.risks.concat([{ t: rk.t.trim(), w: rk.w, a: rk.a }]) }), 'Risiko erfasst (Wert ' + rk.w * rk.a + ').'); this.setState({ upRk: { t: '', w: 3, a: 3 } }); },
        budget: String(u.budget || ''), setBudget: e => { const v = +String(e && e.target ? e.target.value : '').replace(/\D/g, ''); updU({ budget: v }); },
        budText: fE(costSum) + ' von ' + fE(u.budget || 0) + (u.budget && costSum > u.budget ? ' · überschritten' : ''), budColor: u.budget && costSum > u.budget ? RED : (u.budget && costSum > u.budget * 0.8 ? '#C19C00' : GREEN), budW: pct(u.budget ? Math.min(100, costSum / u.budget * 100) : 0),
        costs: u.costs.map(c => ({ text: c[0], amount: fE(c[1]) })), coText: s.upCoT || '', setCoText: e => this.setState({ upCoT: e && e.target ? e.target.value : '' }), coAmt: s.upCoA || '', setCoAmt: e => this.setState({ upCoA: e && e.target ? e.target.value : '' }),
        addCost: () => { const a = parseFloat(String(s.upCoA || '').replace(/\./g, '').replace(',', '.')); if (!(a > 0)) return this.setState({ pnMsg: 'Betrag eingeben, z. B. 1.480,00.' }); updU(x => ({ costs: x.costs.concat([[(s.upCoT || '').trim() || 'Kosten', a]]) }), fE(a) + ' gebucht.'); this.setState({ upCoT: '', upCoA: '' }); },
        reqs: u.reqs.map((r, i) => { const n = tasks.filter(x => (x.desc || '').indexOf(r.id) >= 0).length; return { id: r.id, text: r.text, trace: n ? n + ' Aufgaben verknüpft' : 'noch ohne Nachweis', color: n ? GREEN : '#A33F06' }; }),
        tr: (() => { const TS = (s.testsBy || {})[u.key] || [], setTs = (l, msg) => this.setState({ testsBy: Object.assign({}, s.testsBy, { [u.key]: l }), pnMsg: msg || '' }), testOn = on('test');
          const rows = u.reqs.map(r => { const ts = TS.filter(z => z.req === r.id), nT = tasks.filter(x => (x.desc || '').indexOf(r.id) >= 0).length, pass = ts.filter(z => z.st === 'bestanden').length, fail = ts.filter(z => z.st === 'fehlgeschlagen').length, op = !!(s.trOpen || {})[r.id];
            const cov = !ts.length ? ['○ ohne Test', '#8A8886'] : (fail ? ['✗ fehlgeschlagen', RED] : (pass === ts.length ? ['✓ nachgewiesen', GREEN] : ['◐ ' + pass + '/' + ts.length + ' bestanden', '#CA5010']));
            return { id: r.id, text: r.text, tasks: nT ? nT + ' Aufgaben' : '–', taskColor: nT ? t.text : t.muted, cov: cov[0], covBg: cov[1], ok: ts.length && !fail && pass === ts.length, fail: fail > 0, rowBg: op ? t.surface2 : 'transparent',
              open: op, openA: op ? 'true' : 'false', chev: op ? '▴' : '▾', toggleLabel: (op ? 'Zuklappen: ' : 'Testfälle: ') + r.id, toggle: () => this.setState({ trOpen: Object.assign({}, s.trOpen, { [r.id]: !op }) }),
              newText: (s.trNew || {})[r.id] || '', setNew: e => this.setState({ trNew: Object.assign({}, s.trNew, { [r.id]: e && e.target ? e.target.value : '' }) }),
              addTest: () => { const tt = ((this.state.trNew || {})[r.id] || '').trim(); if (!tt) return; const id = 'T' + (TS.length + 1); setTs(TS.concat([{ id, req: r.id, title: tt, st: 'offen', when: '', task: null }]), 'Testfall ' + id + ' zu ' + r.id + ' angelegt.'); this.setState({ trNew: Object.assign({}, this.state.trNew, { [r.id]: '' }) }); },
              tests: ts.map(z => ({ id: z.id, title: z.title, meta: z.st === 'offen' ? 'noch nicht ausgeführt' : z.st + ' am ' + z.when + ' · Du', hasTask: !!z.task, openTask: () => this.openTask(z.task, 'pn'),
                states: [['offen', '○ Offen'], ['bestanden', '✓ Bestanden'], ['fehlgeschlagen', '✗ Fehlgeschlagen']].map(([k2, l2]) => ({ label: l2, pressed: z.st === k2 ? 'true' : 'false', ring: z.st === k2 ? (k2 === 'bestanden' ? GREEN : (k2 === 'fehlgeschlagen' ? RED : accent)) : t.border, bg: z.st === k2 ? t.soft : t.surface,
                  go: () => { let task = z.task; if (k2 === 'fehlgeschlagen' && !task) task = this.quickTask({ title: 'Fehler beheben: ' + z.title, proj: u.name, due: addDays('2026-11-13', 5), owner: 'Du', bucket: 'Fokus' });
                    if (task && TASK[task] && k2 === 'fehlgeschlagen') { TASK[task].desc = 'Testfall ' + z.id + ' zu ' + r.id + ' fehlgeschlagen (13.11.). Nach der Behebung den Test erneut ausführen.'; TASK[task].prio = 'Hoch'; }
                    setTs(TS.map(y => (y.id === z.id ? Object.assign({}, y, { st: k2, when: k2 === 'offen' ? '' : '13.11.', task }) : y)), z.id + ': ' + l2.slice(2) + (k2 === 'fehlgeschlagen' && !z.task ? '. Fehleraufgabe „Fehler beheben: ' + z.title + '“ angelegt und mit ' + r.id + ' verknüpft.' : '.')); } })) })) }; });
          const nOk = rows.filter(r => r.ok).length, nFail = rows.filter(r => r.fail).length;
          return { rows, empty: !rows.length, testOn, testOff: !testOn, cov: rows.length ? nOk + ' von ' + rows.length + ' Anforderungen nachgewiesen' + (TS.length ? ' · ' + TS.length + ' Testfälle' : '') : '', covW: pct(rows.length ? nOk / rows.length * 100 : 0), covColor: nFail ? RED : GREEN,
            hasFail: nFail > 0, failText: nFail + (nFail === 1 ? ' Anforderung hat' : ' Anforderungen haben') + ' einen fehlgeschlagenen Test. Die Fehleraufgaben stehen unter Aufgaben; nach der Behebung den Test erneut auf „Bestanden“ setzen.' }; })(),
        rqText: s.upRq || '', setRq: e => this.setState({ upRq: e && e.target ? e.target.value : '' }),
        addReq: () => { const tt = (s.upRq || '').trim(); if (!tt) return; updU(x => ({ reqs: x.reqs.concat([{ id: u.code + '-A' + (x.reqs.length + 1), text: tt }]) }), 'Anforderung angelegt.'); this.setState({ upRq: '' }); },
        stufen: STUFEN.map(([n, name, desc]) => ({ n: String(n), name, desc, pressed: ups.stufe === n ? 'true' : 'false', ring: ups.stufe === n ? accent : t.border, bg: ups.stufe === n ? t.soft : t.surface, go: () => setUps({ stufe: n }, 'Stufe ' + n + ' · ' + name + '. Die Reiter oben passen sich an.') })),
        modGroups: this.modGroups(ups, (k, o2, label) => setUps({ mods: Object.assign({}, ups.mods, { [k]: !o2 }) }, label + (o2 ? ' ausgeblendet. Daten bleiben erhalten.' : ' eingeschaltet.')), t, accent, true, /V-Modell/.test(u.model)),
        rename: e => { const v = e && e.target ? e.target.value : u.name; if (!v.trim()) return; TASKS.forEach(x => { if (x.proj === u.name) x.proj = v; }); delete PK_OF[u.name]; PK_OF[v] = u.key; updU({ name: v }); },
        colors: PCOLORS.map(c => ({ c, pressed: (ups.color || u.color) === c ? 'true' : 'false', ring: (ups.color || u.color) === c ? t.text : 'transparent', go: () => setUps({ color: c }) })),
        people: PPL.map(n => { const o2 = u.members.includes(n); return { label: (o2 ? '✓ ' : '+ ') + n, pressed: o2 ? 'true' : 'false', ring: o2 ? accent : t.border, bg: o2 ? t.soft : t.surface,
          go: () => { if (n === 'Du') return; const m2 = o2 ? u.members.filter(x => x !== n) : u.members.concat([n]); PMEMBERS[u.key] = m2.map(m => [m, m === 'Du' ? 'Owner' : 'Bearbeiter']); updU({ members: m2 }, o2 ? n + ' entfernt.' : n + ' hinzugefügt und benachrichtigt.'); } }; }),
        ...(() => { const ROLES = ['Owner', 'Bearbeiter', 'Mitwirkender', 'Leser'], rl = (s.upRole || {})[u.key] || {}, akv = (s.upAkv || {})[u.key] || {}, rc = (s.upRaci || {})[u.key] || {};
          const roleOf = m => ((PMEMBERS[u.key] || []).find(x => x[0] === m) || [m, rl[m] || (m === 'Du' ? 'Owner' : 'Bearbeiter')])[1], setK = (st, key, val) => this.setState({ [st]: Object.assign({}, s[st], { [u.key]: Object.assign({}, (s[st] || {})[u.key] || {}, { [key]: val }) }) });
          const acts = flat.filter(f => f.d === 0 || f.n.type === 'gate').map(f => f.n).slice(0, 12), cyc = { '': 'R', R: 'A', A: 'C', C: 'I', I: '' }, RC = { R: ['#0F6CBD', '#FFFFFF'], A: ['#5B2D90', '#FFFFFF'], C: ['#C19C00', '#1B1B1B'], I: [t.surface2, t.text], '': [t.surface, t.muted] };
          return { mem: u.members.map(m => ({ name: m, ini: ini(m), av: AV[m] || accent, roles: ROLES.map(r => ({ label: r, pressed: roleOf(m) === r ? 'true' : 'false', ring: roleOf(m) === r ? accent : t.border, bg: roleOf(m) === r ? t.soft : t.surface, go: () => { if (m === 'Du' && r !== 'Owner') return this.setState({ pnMsg: 'Die Projektleitung bleibt Owner.' }); PMEMBERS[u.key] = (PMEMBERS[u.key] || []).map(x => (x[0] === m ? [m, r] : x)); setK('upRole', m, r); this.setState({ pnMsg: m + ' ist jetzt ' + r + '. Was die Rolle darf, steht unter ⚙ › Mitglieder, Rollen und Rechte.' }); } })),
              akv: [[0, '–'], [1000, '1.000 €'], [5000, '5.000 €'], [25000, '25.000 €']].map(([v0, l]) => ({ label: l, pressed: (akv[m] !== undefined ? akv[m] : (m === 'Du' ? 5000 : 0)) === v0 ? 'true' : 'false', ring: (akv[m] !== undefined ? akv[m] : (m === 'Du' ? 5000 : 0)) === v0 ? accent : t.border, bg: t.surface, go: () => setK('upAkv', m, v0) })) })),
            memAdd: PPL.filter(m => !u.members.includes(m)).map(m => ({ label: '+ ' + m, pressed: 'false', ring: t.border, bg: t.surface, go: () => { const m2 = u.members.concat([m]); PMEMBERS[u.key] = m2.map(x => [x, x === 'Du' ? 'Owner' : 'Bearbeiter']); updU({ members: m2 }, m + ' ist jetzt im Projekt und benachrichtigt.'); } })),
            mta: this.mtaUI({ key: u.key, tree: u.tree || [], blMap: ((s.blBy || {})[u.key] || {}).map || {}, blDate: ((s.blBy || {})[u.key] || {}).date || '', reports: (s.blBy || {})[u.key] ? [((s.blBy || {})[u.key].iso || '2026-11-13')] : [], hist: {}, t, accent, accentText }),
            docs: (() => { const keys = [['p:' + u.key, 'Projektakte', null]].concat(tasks.map(x => ['t:' + x.id, x.title, () => this.openTask(x.id, 'pn')])).concat(flat.map(f => ['n:' + f.n.id, f.n.name, () => this.setState({ panel: { kind: 'node', id: f.n.id, from: 'pn' }, pSub: 'dateien' })]));
              const AKC = { PDF: '#A4262C', DOC: '#2B5797', XLS: '#107C10', IMG: '#8764B8' }, ak = s.akte || {}, items = [];
              keys.forEach(([k, where, go]) => { const fl = ((ak[k] || {}).files || []).concat(((AKTE_SEED[k] || {}).files || [])); fl.forEach(f0 => items.push({ type: f0[0], typeBg: AKC[f0[0]] || '#5C5C5C', name: f0[1], size: f0[2], by: f0[3] + ' · ' + f0[4], where, hasWhere: !!go, goWhere: go || (() => {}),
                hasUrl: !!FILE_URL[f0[1]], view: () => { try { window.open(FILE_URL[f0[1]], '_blank'); } catch (er) {} } })); });
              return { items, empty: !items.length, count: items.length + (items.length === 1 ? ' Datei' : ' Dateien'),
                pick: e => { const f = e && e.target && e.target.files && e.target.files[0]; if (!f) return; const ext = /\.(jpe?g|png|heic|gif)$/i.test(f.name) ? 'IMG' : (/\.pdf$/i.test(f.name) ? 'PDF' : (/\.xlsx?$/i.test(f.name) ? 'XLS' : 'DOC'));
                  try { if (typeof URL !== 'undefined' && URL.createObjectURL) FILE_URL[f.name] = URL.createObjectURL(f); } catch (er) {}
                  const k = 'p:' + u.key, cur = Object.assign({ doku: [], files: [], times: [], inv: [] }, ak[k] || {}); cur.files = cur.files.concat([[ext, f.name, Math.max(1, Math.round((f.size || 1024) / 1024)).toLocaleString('de-DE') + ' KB', 'Du', 'heute']]);
                  this.setState({ akte: Object.assign({}, this.state.akte, { [k]: cur }), pnMsg: '„' + f.name + '“ in der Projektakte abgelegt (nur in diesem Browser).' }); } }; })(),
            fin: (() => { const nach = ((s.invAdd || {})[u.key] || []), crs = ((s.crBy || {})[u.key] || []), obl = crs.filter(c => c.status === 'genehmigt').reduce((a2, c) => a2 + (c.cost || 0), 0), offen = crs.filter(c => c.status === 'eingereicht' || c.status === 'bei H. Lorenz').reduce((a2, c) => a2 + (c.cost || 0), 0);
              const hrs = tasks.reduce((a2, x) => a2 + (x.booked || 0), 0), prog = costSum + obl, B0 = u.budget || 0, mx = Math.max(1, B0, costSum, obl, prog);
              return { bars: [['Budget (Plan)', B0, '#0F6CBD'], ['Ist (gebuchte Kosten)', costSum, '#5C5C5C'], ['Nachträge genehmigt', obl, '#8A3707'], ['Prognose', prog, B0 && prog > B0 ? RED : GREEN]].map(([l, v, c]) => ({ label: l, value: fE(v), w: pct(v / mx * 100), color: c })),
                sum: !B0 ? 'Noch kein Budget eingetragen.' : (prog > B0 ? '! Prognose ' + Math.round((prog / B0 - 1) * 100) + ' % über Budget' : '✓ Prognose im Budget (' + Math.round(prog / B0 * 100) + ' %)'), sumBg: !B0 ? t.strong : (prog > B0 ? RED : GREEN),
                open: offen ? fE(offen) + ' in offenen Change Requests (noch nicht genehmigt)' : '', hasOpen: offen > 0, hours: hrs ? (Math.round(hrs * 10) / 10).toLocaleString('de-DE') + ' h gebucht (aus Zeiterfassung)' : '', hasHours: hrs > 0,
                nach: nach.filter(([n0]) => /Nachtrag/.test(n0)).map(([n0, t0]) => ({ text: n0 + ' · ' + t0 })), hasNach: nach.some(([n0]) => /Nachtrag/.test(n0)) }; })(),
            tl: this.layUI('team:' + u.key, ['mitglieder', 'auslastung', 'raci', 'akv', 'abwesend', 'kontakte'], { mitglieder: 'Mitglieder und Rollen', auslastung: 'Auslastung', raci: 'RACI-Matrix', akv: 'AKV', abwesend: 'Abwesenheiten', kontakte: 'Kontakte' }, ['mitglieder'], t, accent), mbr: this.memberUI(u.key, t, accent, on('raci')), raciOn: on('raci'), raciOff: !on('raci'), raciCols: '220px repeat(' + u.members.length + ', minmax(60px, 1fr))', raciHead: u.members.map(m => (m === 'Du' ? 'ich' : m)),
            inv: (() => { const list = (s.pInv || {})[u.key] || [], F = Object.assign({ sup: '', amt: '', kind: 'Material', where: '', beleg: '' }, (s.pInvF || {})[u.key] || {}), open = s.pInvOpen === u.key, fE2 = v => v.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
              const myRole = ((PMEMBERS[u.key] || []).find(x => x[0] === 'Du') || [])[1], am = (s.mbrAkv || {})[u.key] || {}, myLim = am.Du !== undefined ? am.Du : (myRole === 'Owner' ? 5000 : 0);
              const setF = patch => this.setState({ pInvF: Object.assign({}, this.state.pInvF, { [u.key]: Object.assign({}, F, (this.state.pInvF || {})[u.key] || {}, patch) }) }), val = e => (e && e.target ? e.target.value : '');
              const num = parseFloat(String(F.amt || '').replace(/\s|€/g, '').replace(/\./g, '').replace(',', '.')) || 0, setL = (fn, msg) => this.setState({ pInv: Object.assign({}, this.state.pInv, { [u.key]: fn(((this.state.pInv || {})[u.key] || []).slice()) }), pInvMsg: msg, pInvMsgK: u.key });
              const appr = num > 5000 ? 'H. Lorenz' : (num <= myLim ? 'Du' : 'Projektleitung');
              const wh = [['', 'Projekt allgemein']].concat(flat.map(f0 => [f0.n.id, (f0.n.type === 'phase' ? '▭ ' : (f0.n.msPoint ? '◆ ' : '◈ ')) + f0.n.name]).slice(0, 10));
              const sumOk = list.filter(i0 => i0.status === 'freigegeben').reduce((a2, i0) => a2 + i0.amt, 0);
              return { open, openA: open ? 'true' : 'false', btn: open ? '✕ Schließen' : '+ Rechnung einreichen', toggle: () => this.setState({ pInvOpen: open ? null : u.key, pInvMsg: '' }),
                sum: list.length ? list.length + (list.length === 1 ? ' Rechnung' : ' Rechnungen') + ' · ' + fE2(sumOk) + ' freigegeben' : '',
                hasMsg: !!s.pInvMsg && s.pInvMsgK === u.key, msg: s.pInvMsg || '', empty: !list.length && !open,
                sup: F.sup, setSup: e => setF({ sup: val(e) }), amt: F.amt, setAmt: e => setF({ amt: val(e) }),
                kinds: ['Material', 'Dienstleistung', 'Reisekosten', 'Werkzeug'].map(k0 => ({ label: k0, pressed: F.kind === k0 ? 'true' : 'false', ring: F.kind === k0 ? accent : t.border, bg: F.kind === k0 ? t.soft : t.surface, go: () => setF({ kind: k0 }) })),
                wheres: wh.map(([k0, l0]) => ({ label: l0, pressed: F.where === k0 ? 'true' : 'false', ring: F.where === k0 ? accent : t.border, bg: F.where === k0 ? t.soft : t.surface, go: () => setF({ where: k0 }) })),
                pick: e => { const f = e && e.target && e.target.files && e.target.files[0]; if (!f) return; try { if (typeof URL !== 'undefined' && URL.createObjectURL) FILE_URL[f.name] = URL.createObjectURL(f); } catch (er) {} setF({ beleg: f.name }); },
                belegText: F.beleg ? '✓ ' + F.beleg : 'Beleg ist Pflicht', belegColor: F.beleg ? GREEN : t.muted,
                rule: 'Freigabe nach AKV: bis zu deiner Grenze (' + (myLim ? myLim.toLocaleString('de-DE') + ' €' : '0 €') + ') gibst du selbst frei, bis 5.000 € die Projektleitung, darüber H. Lorenz. Freigegebene Rechnungen zählen ins Ist.' + (num ? ' Dieser Betrag: ' + (appr === 'Du' ? 'gibst du selbst frei.' : 'Freigabe durch ' + appr + '.') : ''),
                submit: () => { if (!F.sup.trim()) return this.setState({ pInvMsg: 'Bitte den Lieferanten eintragen.', pInvMsgK: u.key }); if (!(num > 0)) return this.setState({ pInvMsg: 'Bitte den Betrag eintragen, z. B. 1.480,00.', pInvMsgK: u.key }); if (!F.beleg) return this.setState({ pInvMsg: 'Bitte den Beleg anhängen: Foto oder PDF der Rechnung.', pInvMsgK: u.key });
                  const whN = F.where && NODE[F.where] ? NODE[F.where].name : 'Projekt allgemein', it = { id: 'iv' + Date.now().toString(36), sup: F.sup.trim(), amt: num, kind: F.kind, where: whN, beleg: F.beleg, status: appr === 'Du' ? 'freigegeben' : 'bei ' + appr, appr, date: fmt(TODAY) };
                  setL(l0 => l0.concat([it]), 'Rechnung über ' + fE2(num) + ' eingereicht' + (appr === 'Du' ? ' und von dir freigegeben. Sie zählt jetzt ins Ist und geht an die Buchhaltung.' : '. Sie wartet auf die Freigabe durch ' + appr + '.'));
                  this.setState({ pInvOpen: null, pInvF: Object.assign({}, this.state.pInvF, { [u.key]: { kind: F.kind } }) }); },
                items: list.slice().reverse().map(i0 => ({ sup: i0.sup, kind: i0.kind, amount: fE2(i0.amt), sub: i0.where + ' · eingereicht ' + i0.date + ' · Beleg: ' + i0.beleg, status: i0.status, stBg: i0.status === 'freigegeben' ? GREEN : (i0.status === 'abgelehnt' ? RED : '#8764B8'),
                  canDecide: /^bei /.test(i0.status), who: i0.appr === 'Projektleitung' ? 'Projektleitung' : i0.appr,
                  ok: () => setL(l0 => l0.map(z => (z.id === i0.id ? Object.assign({}, z, { status: 'freigegeben' }) : z)), 'Freigegeben durch ' + i0.appr + ' (im Entwurf simuliert). ' + fE2(i0.amt) + ' zählen jetzt ins Ist.'),
                  no: () => setL(l0 => l0.map(z => (z.id === i0.id ? Object.assign({}, z, { status: 'abgelehnt' }) : z)), 'Rechnung abgelehnt. Sie zählt nicht ins Ist.') })) }; })(),
            akv: (() => { const L = (PMEMBERS[u.key] || u.members.map(m => [m, m === 'Du' ? 'Owner' : 'Bearbeiter'])).filter(x => !x[4]), am = (s.mbrAkv || {})[u.key] || {}, ed = !!(s.akvEd || {})[u.key], tx = ed ? ((s.akvDraft || {})[u.key] || {}) : ((s.akvTx || {})[u.key] || {});
              const canEd = (((PMEMBERS[u.key] || []).find(x => x[0] === 'Du') || [])[1] || 'Owner') === 'Owner', view = ((s.akvView || {})[u.key]) || 'tabelle';
              const DEF = { Owner: ['Projekt leiten, planen, Team steuern', 'Termine und Umfang ändern, Aufgaben vergeben', 'Termin, Kosten und Projektziel'], Bearbeiter: ['Arbeitspakete bearbeiten, Aufgaben erledigen', 'Fachliche Entscheidungen im eigenen Arbeitspaket', 'Ergebnis der eigenen Arbeitspakete'], Mitwirkender: ['Zuarbeit zu Aufgaben', 'Eigene Aufgaben ändern und kommentieren', 'Eigene Aufgaben termingerecht'], Leser: ['Sich informieren', '–', '–'], Gast: ['Zulieferung von außen', 'Freigegebenes sehen', 'Eigene Lieferung'] };
              const rows = L.map(x => { const n = x[0], r = x[1], d = DEF[r] || DEF.Bearbeiter, own = tx[n] || {}, lim = am[n] !== undefined ? am[n] : (r === 'Owner' ? 5000 : 0);
                const Rn = acts.filter(a => rc[a.id + '|' + n] === 'R').map(a => a.name), An = acts.filter(a => rc[a.id + '|' + n] === 'A').map(a => a.name), weak = An.length > 0 && ['Leser', 'Gast', 'Mitwirkender'].includes(r);
                const set = f => e => { const v = e && e.target ? e.target.value : ''; const cur = (this.state.akvDraft || {})[u.key] || {}; this.setState({ akvDraft: Object.assign({}, this.state.akvDraft, { [u.key]: Object.assign({}, cur, { [n]: Object.assign({}, cur[n] || {}, { [f]: v }) }) }) }); };
                return { name: n === 'Du' ? 'Du (ich)' : n, role: r, limit: lim ? lim.toLocaleString('de-DE') + ' €' : '0 €', a: own.a !== undefined ? own.a : d[0], k: own.k !== undefined ? own.k : d[1], v: own.v !== undefined ? own.v : d[2], setA: set('a'), setK: set('k'), setV: set('v'),
                  aAuto: Rn.length ? 'führt aus (R): ' + Rn.join(', ') : '', hasAAuto: Rn.length > 0, vAuto: An.length ? 'verantwortet (A): ' + An.join(', ') : '', hasVAuto: An.length > 0,
                  kAuto: lim ? 'Rechnungen und Nachträge freigeben bis ' + lim.toLocaleString('de-DE') + ' €' : 'gibt keine Rechnungen frei', warn: weak, ini: ini(n), av: AV[n] || accent, vBd: weak ? RED : t.border }; });
              const vw = k => ({ label: k === 'tabelle' ? 'Tabelle' : 'Diagramm', pressed: view === k ? 'true' : 'false', bg: view === k ? t.surface : 'transparent', fg: view === k ? t.text : t.muted, go: () => this.setState({ akvView: Object.assign({}, this.state.akvView, { [u.key]: k }) }) });
              return { rows, hasWarn: rows.some(r0 => r0.warn), edit: ed, isTab: !ed && view === 'tabelle', isDia: !ed && view === 'diagramm', views: [vw('tabelle'), vw('diagramm')], canEd: canEd && !ed,
                startEd: () => this.setState({ akvEd: Object.assign({}, this.state.akvEd, { [u.key]: true }), akvDraft: Object.assign({}, this.state.akvDraft, { [u.key]: JSON.parse(JSON.stringify((this.state.akvTx || {})[u.key] || {})) }), akvMsg: '' }),
                save: () => this.setState({ akvTx: Object.assign({}, this.state.akvTx, { [u.key]: (this.state.akvDraft || {})[u.key] || {} }), akvEd: Object.assign({}, this.state.akvEd, { [u.key]: false }), akvMsg: 'AKV gespeichert. Alle Mitglieder sehen die neue Fassung.' }),
                cancel: () => this.setState({ akvEd: Object.assign({}, this.state.akvEd, { [u.key]: false }), akvMsg: 'Änderungen verworfen.' }), msg: s.akvMsg || '', hasMsg: !!s.akvMsg }; })(),
            raciAddTxt: s.raciT || '', setRaciT: e => this.setState({ raciT: e && e.target ? e.target.value : '' }), raciNone: !acts.length && !((s.raciX || {})[u.key] || []).length,
            raciAdd: () => { const v = (this.state.raciT || '').trim(); if (!v) return this.setState({ pnMsg: 'Bitte eine Tätigkeit eingeben, z. B. „Bestellung freigeben“.' }); const L0 = (this.state.raciX || {})[u.key] || []; this.setState({ raciX: Object.assign({}, this.state.raciX, { [u.key]: L0.concat([{ id: u.key + 'rx' + L0.length, name: v, type: 'act' }]) }), raciT: '', pnMsg: '„' + v + '“ steht jetzt in der RACI-Matrix. Je Zeile genau ein A vergeben.' }); },
            raciRows: acts.concat((s.raciX || {})[u.key] || []).map(n => { const aCount = u.members.filter(m => rc[n.id + '|' + m] === 'A').length; return { name: (n.type === 'gate' ? (n.msPoint ? '◆ ' : '◈ ') : '') + n.name, warn: aCount === 0 ? 'noch kein A' : (aCount > 1 ? aCount + '× A, nur eines erlaubt' : ''), warnColor: aCount === 1 ? GREEN : '#A33F06',
              cells: u.members.map(m => { const v0 = rc[n.id + '|' + m] || ''; return { v: v0 || '·', bg: RC[v0][0], fg: RC[v0][1], aria: n.name + ', ' + m + ': ' + (v0 || 'leer'), go: () => setK('upRaci', n.id + '|' + m, cyc[v0]) }; }) }; }) }; })(),
        lbls: this.labelsOf(u.key).map(([k, l, c]) => ({ c, name: this.lblName(u.key, k), rename: e => { const v = e && e.target ? e.target.value : ''; this.setState({ lblNames: Object.assign({}, s.lblNames, { [u.key]: Object.assign({}, (s.lblNames || {})[u.key] || {}, { [k]: v }) }) }); } })),
        archText: ups.archived ? 'Archiviert: nur lesbar und nicht in Listen und Auswertungen.' : 'Archivieren macht das Projekt nur lesbar. Wiederherstellen geht jederzeit.', archLabel: ups.archived ? 'Wiederherstellen' : 'Archivieren',
        archive: () => setUps({ archived: !ups.archived }, ups.archived ? 'Wiederhergestellt.' : 'Archiviert.'),
        saveTpl: () => this.setState({ userTpl: (s.userTpl || []).concat([{ key: 'ut' + (s.userTpl || []).length, name: u.name + ' (Vorlage)', stufe: ups.stufe, model: u.model, from: null, nodes: u.nodes }]), pnMsg: 'Als Vorlage gespeichert. Steht ab jetzt unter „+ Neues Projekt“.' }) };
    }
    const projectsAll = projects.map(p => { const k = PK_OF[p.name], ps = Object.assign({}, PSET0[k] || {}, (s.psetBy || {})[k] || {}); return Object.assign({}, p, ps.color ? { color: ps.color } : {}, ps.stufe ? { stufe: 'Stufe ' + ps.stufe } : {}, ps.archived ? { chip: this.chip('erledigt', t, accent) } : {}, ps.archived ? { name: p.name + ' (archiviert)' } : {}); })
      .concat(UP.map(u => { const ups = Object.assign({ stufe: u.stufe }, (s.psetBy || {})[u.key] || {}), tk = TASKS.filter(x => x.proj === u.name), dn = tk.filter(x => this.isDone(x)).length, ng = u.nodes.filter(n => n.type !== 'phase').sort((a, b) => (a.end < b.end ? -1 : 1))[0];
        return { code: u.code, name: u.name + (ups.archived ? ' (archiviert)' : ''), color: ups.color || u.color, model: u.model.split(' ')[0], stufe: 'Stufe ' + ups.stufe, chip: this.chip(ups.archived ? 'erledigt' : (u.tree || []).concat(...(u.tree || []).map(n => n.children || [])).some(n => n.type !== 'phase' && this.nodeStatus(n) === 'ueberfaellig') || tk.some(x => this.taskStatus(x) === 'ueberfaellig') ? 'ueberfaellig' : 'plan', t, accent), progress: (tk.length ? Math.round(dn / tk.length * 100) : 0) + '%', next: (ng2 => (ng2 ? ng2.name + ' ' + fmt(D(ng2.end)) : '–'))((u.tree || []).concat(...(u.tree || []).map(n => n.children || [])).filter(n => (n.type !== 'phase' || !(n.children || []).length) && this.nodeStatus(n) !== 'erledigt').sort((a, b) => (a.end < b.end ? -1 : 1))[0] || (tk.filter(x => !this.isDone(x)).sort((a, b) => (a.due < b.due ? -1 : 1))[0] ? { name: tk.filter(x => !this.isDone(x)).sort((a, b) => (a.due < b.due ? -1 : 1))[0].title, end: tk.filter(x => !this.isDone(x)).sort((a, b) => (a.due < b.due ? -1 : 1))[0].due } : null)), clickable: true, static: false, open: () => this.setState({ screen: 'pn', upSel: u.key, upTab: 'uebersicht', panel: null }) }; }));

    const uniqA = arr => arr.filter((v, i) => arr.indexOf(v) === i);
    // Beteiligte: eine Liste mit Avatar und Rolle, Personen über Suche hinzufügen
    const mkPpl = (O, C, note, k) => { const strip = l => String(l).replace(/^[✓+]\s*/, ''), own = O.find(o => o.pressed === 'true'), ownN = own ? strip(own.label) : '';
      const co = C.filter(c => c.pressed === 'true'), open = s.pplOpen === k, q = (s.pplQ || '').toLowerCase(), person = n => ({ name: n, ini: ini(n), av: AV[n] || '#5C5C5C' });
      const rows = (own ? [Object.assign(person(ownN), { role: 'Verantwortlich', isOwner: true, notOwner: false, remove: () => {} })] : []).concat(co.map(c => Object.assign(person(strip(c.label)), { role: 'Beteiligt', isOwner: false, notOwner: true, remove: c.go })));
      const cands = O.map(o => strip(o.label)).filter(n => n !== ownN && !co.some(c => strip(c.label) === n) && (!q || n.toLowerCase().indexOf(q) >= 0)).map(n => { const cc = C.find(c => strip(c.label) === n), oo = O.find(o => strip(o.label) === n);
        return Object.assign(person(n), { canAdd: !!cc, add: () => { if (cc) cc.go(); this.setState({ pplQ: '' }); }, makeOwner: () => { if (oo) oo.go(); this.setState({ pplOpen: null, pplQ: '' }); } }); });
      return { rows, open, openA: open ? 'true' : 'false', toggle: () => this.setState({ pplOpen: open ? null : k, pplQ: '' }), q: s.pplQ || '', setQ: e => this.setState({ pplQ: e && e.target ? e.target.value : '' }),
        cands, noCands: cands.length === 0, note, hasNote: !!note, addLabel: open ? 'Fertig' : '+ Person' }; };

    // Kick-off nach der Genehmigung
    const KS = s.ko, koSet = (patch, msg) => this.setState({ ko: Object.assign({}, this.state.ko, patch), koMsg: msg === undefined ? '' : msg, koErr: '' });
    const koSetF = (k) => e => this.setState({ [k]: e && e.target ? e.target.value : '' });
    const KO_AG = [['Projekt erklären', 'Ziel, Hintergrund und Nutzen aus dem Antrag'], ['Umfang und Abgrenzung', 'Was gehört dazu, was ausdrücklich nicht'], ['User Stories und Anforderungen', 'Wer will was und warum'], ['Erfolgsfaktoren und Abnahmekriterien', 'Woran messen wir, dass es geklappt hat'], ['Vorgehensmodell und Vorlage', 'Wie wir arbeiten: Scrum, Wasserfall, V-Modell, Kanban'], ['Rollen und Zuständigkeiten', 'RACI, Ansprechpartner, Vertretung'], ['Risiken', 'Was kann schiefgehen, was tun wir dagegen'], ['Termine und nächste Schritte', 'Meilensteine, erste Aufgaben, nächstes Treffen']];
    const KO_PPL = ['M. Yilmaz', 'H. Lorenz', 'S. Keller', 'J. Novak', 'E. Lang', 'F. Roth', 'Du', 'Qualität', 'Kunde'];
    const KO_REQ = KS ? [KS.pl, 'M. Yilmaz', 'H. Lorenz'] : [];
    const KO_MOD = [['Scrum', 'sw', 'Scrum Standard'], ['Wasserfall', 'sm', 'Sondermaschine mit 4 Gates'], ['V-Modell', 'v', 'Sicherheitsfunktion (V-Modell)'], ['Kanban', 'klein', 'Board (Kanban)']];
    let ko = { has: false, none: true, back: () => this.setState({ screen: 'eingang' }), status: 'nicht genehmigt', stBg: t.strong, sub: '' };
    if (KS) {
      const koDone = KS.status === 'durchgefuehrt', checks = [[KS.invited, 'Termin eingeladen'], [KS.ef.length > 0, 'mindestens ein Erfolgsfaktor'], [KS.us.length > 0, 'mindestens eine User Story'], [!!KS.model, 'Vorgehensmodell gewählt']];
      ko = { has: true, none: false, back: () => this.setState({ screen: 'eingang' }),
        status: koDone ? '✓ Kick-off durchgeführt' : (KS.invited ? 'Termin ' + fmt(D(KS.date)) + ' ' + KS.time : 'Kick-off ausstehend'), stBg: koDone ? GREEN : (KS.invited ? accent : '#A33F06'),
        sub: 'Projektleitung ' + KS.pl + ' · Pflicht bis ' + fmt(D(KS.due)) + KS.due.slice(0, 4) + ' · Projektstart 01.02.2027. Ohne Kick-off bleibt das Projekt im Status „Kick-off ausstehend“; Aufgaben und Kapazität starten danach.',
        hasMsg: !!s.koMsg, msg: s.koMsg || '', hasErr: !!s.koErr, err: s.koErr || '',
        date: KS.date, setDate: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) koSet({ date: v, invited: false }); },
        dateNote: KS.date > KS.due ? '! nach der Frist ' + fmt(D(KS.due)) : '✓ vor der Frist', dateColor: KS.date > KS.due ? RED : GREEN,
        times: ['08:00', '10:00', '13:00', '14:30'].map(x => ({ label: x, pressed: KS.time === x ? 'true' : 'false', ring: KS.time === x ? accent : t.border, bg: KS.time === x ? t.soft : t.surface, go: () => koSet({ time: x, invited: false }) })),
        durs: [1, 2, 3].map(x => ({ label: x + ' h', pressed: KS.dur === x ? 'true' : 'false', ring: KS.dur === x ? accent : t.border, bg: KS.dur === x ? t.soft : t.surface, go: () => koSet({ dur: x, invited: false }) })),
        places: ['Besprechungsraum 2', 'Teams', 'Vor Ort an Linie 3'].map(x => ({ label: x, pressed: KS.place === x ? 'true' : 'false', ring: KS.place === x ? accent : t.border, bg: KS.place === x ? t.soft : t.surface, go: () => koSet({ place: x, invited: false }) })),
        ppl: KO_PPL.map(n => { const on = KS.ppl.includes(n) || KO_REQ.includes(n), req = KO_REQ.includes(n); return { label: (on ? '✓ ' : '+ ') + n + (req ? ' (Pflicht)' : ''), pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface,
          go: () => { if (req) return this.setState({ koErr: n + ' muss beim Kick-off dabei sein.' }); koSet({ ppl: on ? KS.ppl.filter(x => x !== n) : KS.ppl.concat([n]), invited: false }); } }; }),
        inviteLabel: KS.invited ? 'Einladung erneut senden' : 'Einladung senden', inviteNote: KS.invited ? 'Eingeladen: ' + fmt(D(KS.date)) + ' ' + KS.time + ', ' + KS.dur + ' h, ' + KS.place : 'Mit Agenda und Antrag im Anhang',
        invite: () => { const all = Array.from(new Set(KO_REQ.concat(KS.ppl))); koSet({ invited: true, status: koDone ? KS.status : 'geplant' }, 'Einladung „Kick-off Teileerkennung Linie 3“ für ' + fmt(D(KS.date)) + ' ' + KS.time + ' an ' + all.length + ' Teilnehmer, mit Agenda und Antrag. (Vorschau: simuliert, kein Outlook angebunden.)' + (KS.date > KS.due ? ' Achtung: liegt nach der Frist, ' + 'H. Lorenz wird informiert.' : '')); },
        agenda: KO_AG.map(([title, sub], i) => { const on = !!KS.agenda[i]; return { n: String(i + 1), title, sub, checked: on ? 'true' : 'false', mark: on ? '✓' : '', ring: on ? GREEN : t.strong, fill: on ? GREEN : 'transparent', toggle: () => koSet({ agenda: Object.assign({}, KS.agenda, { [i]: !on }) }) }; }),
        goal: KS.goal, setGoal: e => koSet({ goal: e && e.target ? e.target.value : KS.goal }),
        ef: KS.ef.map((x, i) => ({ text: x, del: () => koSet({ ef: KS.ef.filter((z, k) => k !== i) }) })), efText: s.koEf || '', setEfText: koSetF('koEf'),
        efAdd: () => { const v = (this.state.koEf || '').trim(); if (!v) return; koSet({ ef: KS.ef.concat([v]) }); this.setState({ koEf: '' }); },
        efSug: ['Umrüstzeit unter 5 min', 'Erkennungsrate ≥ 99,5 %', 'Taktzeit Linie 3 ≤ 12 s', 'Budget ≤ 180.000 €', 'Inbetriebnahme bis KW 26'].filter(x => !KS.ef.includes(x)).map(x => ({ label: x, go: () => koSet({ ef: KS.ef.concat([x]) }) })),
        us: KS.us.map((x, i) => ({ id: 'US-' + (i + 1), text: x, del: () => koSet({ us: KS.us.filter((z, k) => k !== i) }) })),
        usR: s.koUsR || '', usZ: s.koUsZ || '', usN: s.koUsN || '', setUsR: koSetF('koUsR'), setUsZ: koSetF('koUsZ'), setUsN: koSetF('koUsN'),
        usAdd: () => { const r = (this.state.koUsR || '').trim(), z = (this.state.koUsZ || '').trim(), nn = (this.state.koUsN || '').trim(); if (!r || !z) return this.setState({ koErr: 'Für eine User Story mindestens „Als …“ und „möchte ich …“ ausfüllen.' });
          koSet({ us: KS.us.concat(['Als ' + r + ' möchte ich ' + z + (nn ? ', damit ' + nn : '') + '.']) }); this.setState({ koUsR: '', koUsZ: '', koUsN: '' }); },
        out: KS.out.map((x, i) => ({ text: x, del: () => koSet({ out: KS.out.filter((z, k) => k !== i) }) })), outText: s.koOut || '', setOutText: koSetF('koOut'), outAdd: () => { const v = (this.state.koOut || '').trim(); if (!v) return; koSet({ out: KS.out.concat([v]) }); this.setState({ koOut: '' }); },
        risks: KS.risks.map((x, i) => ({ text: x, del: () => koSet({ risks: KS.risks.filter((z, k) => k !== i) }) })), riskText: s.koRisk || '', setRiskText: koSetF('koRisk'), riskAdd: () => { const v = (this.state.koRisk || '').trim(); if (!v) return; koSet({ risks: KS.risks.concat([v]) }); this.setState({ koRisk: '' }); },
        models: KO_MOD.map(([m, tk, tl]) => ({ label: m + (m === 'Scrum' ? ' (Vorschlag aus dem Antrag)' : ''), pressed: KS.model === m ? 'true' : 'false', ring: KS.model === m ? accent : t.border, bg: KS.model === m ? t.soft : t.surface, go: () => koSet({ model: m, vorlage: tk }) })),
        tpls: Object.keys(P_TPL).filter(k => !KS.model || (P_FAM.find(f => f[2] === KS.model || (KS.model === 'Wasserfall' && f[0] === 'wf') || (KS.model === 'Scrum' && f[0] === 'scrum') || (KS.model === 'V-Modell' && f[0] === 'v') || (KS.model === 'Kanban' && f[0] === 'kanban')) || [''])[0] === P_TPL[k].fam).map(k => ({ label: P_TPL[k].name === 'Leer' ? 'Leer' : P_TPL[k].name, pressed: KS.vorlage === k ? 'true' : 'false', ring: KS.vorlage === k ? accent : t.border, bg: KS.vorlage === k ? t.soft : t.surface, go: () => koSet({ vorlage: k }) })),
        checkTitle: koDone ? 'Kick-off abgeschlossen, Projekt läuft.' : 'Zum Abschließen fehlt noch:', checks: checks.map(([ok, l]) => ({ label: l, mark: ok ? '✓' : '○', color: ok ? GREEN : t.text })),
        finish: () => { if (koDone) { const u0 = (this.state.uprojs || []).find(u2 => u2.name === 'Teileerkennung Linie 3'); return u0 ? this.setState({ screen: 'pn', upSel: u0.key, upTab: 'uebersicht' }) : null; }
          const miss = checks.filter(c => !c[0]).map(c => c[1]); if (miss.length) return this.setState({ koErr: 'Noch nicht vollständig: ' + miss.join(', ') + '.' });
          const TPk = P_TPL[KS.vorlage || 'leer'] || P_TPL.leer, start = '2027-02-01', key = 'u' + (this.state.uprojs || []).length + '_ko', name = 'Teileerkennung Linie 3', members = Array.from(new Set([KS.pl].concat(KS.ppl.filter(n => AV[n]))));
          const nodes = []; TPk.phases.forEach(([pn2, a1, b1, g], i) => { nodes.push({ id: key + 'p' + i, name: pn2, type: 'phase', start: addDays(start, a1), end: addDays(start, b1) }); if (g) nodes.push({ id: key + 'g' + i, name: g, type: 'gate', start: addDays(start, b1), end: addDays(start, b1), checks: KS.ef.slice(0, 3) }); });
          PK_OF[name] = key; PL_OF[key] = KS.pl; PMEMBERS[key] = members.map(m => [m, m === KS.pl ? 'Owner' : 'Bearbeiter']);
          KS.us.forEach((us, i) => { const id = key + 'us' + i, x = { id, title: 'US-' + (i + 1) + ': ' + ((m0 => (m0 ? m0[1].charAt(0).toUpperCase() + m0[1].slice(1) : us.slice(0, 80)))(us.match(/möchte ich (.+?)(?:, damit|\.$)/))), proj: name, due: addDays(start, 14 * (i + 1)), bucket: 'Backlog', prio: 'Mittel', owner: KS.pl, mine: KS.pl === 'Du', ms: null, desc: us, est: 8, co: [] }; TASKS.push(x); TASK[id] = x; });
          if (KS.task && TASK[KS.task]) { const dn = Object.assign({}, this.state.done, { [KS.task]: true }); this.setState({ done: dn }); }
          const u = { key, name, code: 'TL', color: '#5B2D90', tpl: KS.vorlage || 'leer', model: KS.model, stufe: 3, mods: {}, start, members, nodes, risks: KS.risks.map(r => ({ t: r, w: 3, a: 3 })), costs: [], budget: 180000, reqs: [], archived: false, goal: KS.goal, ef: KS.ef.slice(), out: KS.out.slice(), us: KS.us.slice() };
          this.setState({ rev: (this.state.rev || 0) + 1, uprojs: (this.state.uprojs || []).concat([u]), ko: Object.assign({}, KS, { status: 'durchgefuehrt' }), screen: 'pn', upSel: key, upTab: 'uebersicht',
            pnMsg: 'Kick-off abgeschlossen. „' + name + '“ läuft als ' + KS.model + ' mit ' + KS.us.length + (KS.us.length === 1 ? ' User Story' : ' User Stories') + ' als Aufgaben, ' + KS.ef.length + (KS.ef.length === 1 ? ' Erfolgsfaktor' : ' Erfolgsfaktoren') + ' und ' + KS.risks.length + (KS.risks.length === 1 ? ' Risiko' : ' Risiken') + '. Das Protokoll liegt unter Dokumente.' }); } };
    }
    if (pn && upCur && upCur.ef) Object.assign(pn, { hasGoals: true, goal: upCur.goal || '', efList: upCur.ef, usList: upCur.us || [], outList: upCur.out || [] });
    else Object.assign(pn, { hasGoals: false, goal: '', efList: [], usList: [], outList: [] });

    // KI-Assistent: To-dos aus Sätzen, Mails aus Stichpunkten
    const CHAT0 = [{ who: 'bot', kind: 'text', text: 'Hallo! Du kannst ganz normal mit mir schreiben. Ich zeige dir den Weg in der Software, lege To-dos an, wenn du es sagst, hake Erledigtes ab und schreibe aus Stichpunkten fertige Mails.\n\nBeispiele:\n• „Wo trage ich meinen Urlaub ein?“\n• „Stromlaufplan Schutztür habe ich freigegeben“ (hakt ab)\n• „Erinnere mich morgen an die Rechnung Würth“\n• „L. Wagner soll in SM42 bis Freitag den Greifer prüfen, 3 h“\n• „Mail an Hr. Maier (Rexroth): liefertermin kw 50 ok? brauchen doku asap“' }];
    const chatL = s.chat || CHAT0, chatPush = (msgs, extra) => this.setState(Object.assign({ chat: (this.state.chat || CHAT0).concat(msgs) }, extra || {}));
    const PALIAS = [[/\bsm ?42\b|schraubstation/i, 'SM42 Schraubstation'], [/\bretrofit|\brl ?2\b|linie 2\b/i, 'Retrofit Linie 2'], [/prüfstand|\bpd\b|drehmoment/i, 'Prüfstand Drehmoment'], [/instandhaltung|\bih\b|halle 2\b/i, 'Instandhaltung Halle 2']].concat((s.uprojs || []).map(u => [new RegExp(u.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), u.name]));
    const WD = { montag: '2026-11-16', dienstag: '2026-11-17', mittwoch: '2026-11-18', donnerstag: '2026-11-19', freitag: '2026-11-20' };
    const parseTodo = line => { let tl = ' ' + line + ' ', who = 'Du', proj = null, due = null, h = 2;
      const pm = PALIAS.find(([r]) => r.test(tl)); if (pm) proj = pm[1];
      Object.keys(AV).filter(n => n !== 'Du').forEach(n => { const ln = n.split(' ').pop(); if (new RegExp('\\b' + ln + '\\b', 'i').test(tl) && (new RegExp('(für|an|soll|muss|bitte|' + n.replace('.', '\\.') + ')', 'i').test(tl))) who = n; });
      if (/\b(für mich|erinnere mich|ich muss|mir)\b/i.test(tl)) who = who === 'Du' ? 'Du' : who;
      const dm = tl.match(/\b(?:bis|am|zum)?\s*(\d{1,2})\.(\d{1,2})\.?(\d{2,4})?/); if (dm) due = ((+dm[2] >= 11) ? '2026' : '2027') + '-' + String(+dm[2]).padStart(2, '0') + '-' + String(+dm[1]).padStart(2, '0');
      if (!due && /\bheute\b/i.test(tl)) due = '2026-11-13'; if (!due && /\bübermorgen\b/i.test(tl)) due = '2026-11-17'; if (!due && /\bmorgen\b/i.test(tl)) due = '2026-11-16';
      if (!due) { const w = Object.keys(WD).find(k => new RegExp('\\b' + k + '\\b', 'i').test(tl)); if (w) due = WD[w]; }
      if (!due && /nächste woche/i.test(tl)) due = '2026-11-20'; if (!due && /ende (des )?monats|monatsende/i.test(tl)) due = '2026-11-30';
      const hm = tl.match(/(\d+(?:[.,]\d)?)\s*(h|std\.?|stunden)\b/i); if (hm) h = +hm[1].replace(',', '.');
      let title = line.replace(/^\s*[-•*\d.)]+\s*/, '').replace(/^(to-?do|aufgabe|notiz|neu)\s*(für\s+(mich|[A-ZÄÖÜ]\.\s?[A-ZÄÖÜ][a-zäöüß]+))?\s*:\s*/i, '').replace(/^für\s+(mich|[A-ZÄÖÜ]\.\s?[A-ZÄÖÜ][a-zäöüß]+)\s*:\s*/i, '').replace(/\b(erinnere mich( daran)?|bitte|leg(e)?( mir)?( eine)?( aufgabe)? an|ich muss|nicht vergessen)\b[:,]?\s*/gi, '')
        .replace(/\b([Ff]ür|[Aa]n)\s+(mich|[A-ZÄÖÜ]\.\s?[A-ZÄÖÜ][a-zäöüß]+)\b/g, '').replace(/\b[A-ZÄÖÜ]\.\s?[A-ZÄÖÜ][a-zäöüß]+\s+(soll|muss)\b/g, '').replace(/\b(im|in|beim|für das)\s+(projekt\s+)?(sm ?42|schraubstation|retrofit( linie 2)?|rl ?2|prüfstand( drehmoment)?|instandhaltung( halle 2)?)\b/gi, '')
        .replace(/\b(bis|am|zum)\s+(\d{1,2}\.\d{1,2}\.?(\d{2,4})?|morgen|übermorgen|heute|montag|dienstag|mittwoch|donnerstag|freitag|nächste woche|ende des monats)\b/gi, '').replace(/\b(morgen|übermorgen|heute|nächste woche)\b/gi, '').replace(/,?\s*\d+(?:[.,]\d)?\s*(h|std\.?|stunden)\b/gi, '').replace(/\s+/g, ' ').replace(/^[\s,:.-]+|[\s,:.-]+$/g, '');
      if (who !== 'Du') title = title.replace(new RegExp('^' + who.split(' ').pop() + '\\s*', 'i'), '');
      title = title.replace(/^(an|daran,?|dass)\s+/i, '').replace(/^(den|die|das|dem|der)\s+/i, '');
      title = title ? title.charAt(0).toUpperCase() + title.slice(1) : 'Neue Aufgabe';
      return { title, who, proj, due: due || '2026-11-20', h }; };
    const makeTodo = td => { const inProj = !!td.proj, bossOf2 = BOSS[td.who], sameTeam = TEAM_OF[td.who] && TEAM_OF[td.who] === TEAM_OF['Du'];
      if (td.who === 'Du' || inProj || bossOf2 === 'Du') { const id = this.quickTask({ title: td.title, proj: td.proj || 'Ohne Projekt', owner: td.who, due: td.due, h: td.h }); return Object.assign({}, td, { id, mode: td.who === 'Du' ? 'mir' : (inProj ? 'projekt' : 'chef') }); }
      return Object.assign({}, td, { id: null, mode: sameTeam ? 'annahme' : 'freigabe', boss: bossOf2 }); };
    const NAVGO = (patch) => () => this.setState(Object.assign({ panel: null }, patch));
    const HELP = [
      [/trend|mta|meilenstein.*(rutsch|verschieb|verlauf)/i, 'Die Meilenstein-Trendanalyse findest du im Projekt SM42 › Planung › Gantt › „📈 Meilenstein-Trend“. Steigende Linien zeigen Termine, die von Bericht zu Bericht nach hinten rutschen.', 'Zur Trendanalyse', { screen: 'projekt', proj: 'sm42', ptab: 'planung', mtaOpenBy: { sm42: true } }],
      [/projekt.*(anleg|neu|erstell|start)|neues projekt/i, 'Ein Projekt legst du unter Projekte › „+ Neues Projekt“ an: Vorlage wählen, Name, Stufe 1–4. Für Vorhaben mit Budget, die freigegeben werden müssen, nimm „Projekt einreichen“.', 'Zu „Neues Projekt“', { screen: 'pnew', newP: null }],
      [/antrag|einreich/i, 'Anträge stellst du unter Projekte › „Projekt einreichen“. Dein Chef sieht ihn im Posteingang und genehmigt ihn dort.', 'Zum Antrag', { screen: 'antrag', aStep: 1 }],
      [/urlaub|abwesen|krank|schulung eintrag|dienstreise/i, 'Abwesenheiten trägst du im Profil unter „Arbeitszeit und Vertretung“ › „Meine Abwesenheiten“ ein. Die Tage sind dann in der Teamplanung gesperrt.', 'Zum Profil', { screen: 'profil' }],
      [/sprache|dunkel|hell|dark|farbe|profilbild|kompetenz|fähigkeit/i, 'Sprache, Hell/Dunkel, Profilbild und Fähigkeiten stellst du im Profil ein (oben rechts auf dein Bild).', 'Zum Profil', { screen: 'profil' }],
      [/team.*(plan|vertei)|tagesplanung|6 monate|grobplanung|mitarbeiter einteil/i, 'Die Teamplanung findest du unter Teams: Aufgaben auf Person und Tag ziehen, bis 6 Monate voraus; „6 Monate grob“ für Projektanteile.', 'Zu Teams', { screen: 'teams', tpH: 'woche' }],
      [/wiederkehr|wartung.*(regel|jede|plan)|serie/i, 'Wiederkehrende Aufgaben: Teams › „6 Monate grob“ › „+ Wiederkehrende Aufgabe“, oder beim Anlegen unter „Weitere Optionen“ › Wiederholen.', 'Zu Teams', { screen: 'teams', tpH: 'monate' }],
      [/bucket|spalte|board/i, 'Spalten (Buckets) änderst du direkt im Board eines Projekts: Name in der Überschrift, ◀ ▶ verschieben, 🗑 löschen, „+ Spalte (Bucket)“ oben.', 'Zum Board SM42', { screen: 'projekt', proj: 'sm42', ptab: 'aufgaben', mview: Object.assign({}, s.mview, { sm42: 'board' }) }],
      [/etikett|label|tag\b/i, 'Etiketten setzt du im Aufgaben-Detail unter „Etiketten“. Umbenennen: Projekteinstellungen (Zahnrad im Projekt) › Etiketten.', 'Zu SM42', { screen: 'projekt', proj: 'sm42', ptab: 'aufgaben' }],
      [/papierkorb|gelöscht|wiederherstell/i, 'Gelöschtes liegt 30 Tage unter Projekte › „🗑 Papierkorb“ und lässt sich dort wiederherstellen.', 'Zum Papierkorb', { screen: 'projekte', trashOpen: true }],
      [/dashboard|kachel|startseite/i, 'Die Startseite passt du mit „Anpassen“ oben rechts an: Kacheln ziehen, Breite/Höhe, Zusatzkacheln, fertige Layouts.', 'Zur Startseite', { screen: 'start', editDash: true }],
      [/posteingang.*(anpass|anordn|größe|layout)|ansicht anpassen/i, 'Im Posteingang oben rechts „⚙ Ansicht anpassen“: KI-Entwürfe oben/unten, Liste links/rechts, Breite, Dichte.', 'Zum Posteingang', { screen: 'eingang', iblOpen: true }],
      [/besprechung|protokoll|meeting/i, 'Besprechungen und Protokolle: Meine Arbeit › „Besprechungen“. Mitschrift tippen, „✨ Protokoll aus Mitschrift“, Maßnahmen als Aufgaben.', 'Zu Besprechungen', { screen: 'arbeit', arbTab: 'besprechung' }],
      [/rechnung|lieferant|kosten/i, 'Rechnungen reichst du an der Aufgabe oder am Meilenstein ein: Detail › Reiter „Kosten“ › Lieferant suchen, Betrag, Beleg.', 'Zu einer Aufgabe', { screen: 'projekt', proj: 'sm42', ptab: 'aufgaben', panel: { kind: 'task', id: 't2', from: 'aufgaben' }, pSub: 'kosten' }],
      [/datei|pdf|foto|bild|dokument/i, 'Dateien und Fotos: Detail einer Aufgabe › Reiter „Dateien“. Klick auf eine Datei öffnet die Vorschau.', 'Zu den Dateien', { screen: 'projekt', proj: 'sm42', ptab: 'aufgaben', panel: { kind: 'task', id: 't1', from: 'aufgaben' }, pSub: 'dateien' }],
      [/zeit buchen|zeiten|stunden buchen|zeiterfass/i, 'Zeit buchst du im Detail einer Aufgabe › Reiter „Zeiten“.', 'Zu den Zeiten', { screen: 'projekt', proj: 'sm42', ptab: 'aufgaben', panel: { kind: 'task', id: 't1', from: 'aufgaben' }, pSub: 'zeit' }],
      [/kick-?off/i, 'Den Kick-off plant die Projektleitung nach der Genehmigung: Glocke oder Posteingang › „Kick-off-Seite öffnen“.', 'Zum Kick-off', { screen: 'kickoff' }],
      [/meilenstein|gate|arbeitspaket|untermeilenstein/i, 'Meilensteine, Gates und Arbeitspakete legst du mit „+ Neu“ an oder direkt im Detail einer Phase unter „Untermeilensteine und Gates“.', 'Zur Planung SM42', { screen: 'projekt', proj: 'sm42', ptab: 'planung' }],
      [/mein tag|fokuszeit|kalender|outlook.*termin|tag planen/i, '„Mein Tag“ (Meine Arbeit) zeigt deine Outlook-Termine und Fokuszeit; Aufgaben ziehst du in freie Zeiten.', 'Zu Mein Tag', { screen: 'arbeit', arbTab: 'tag' }],
      [/ki.*(aus|abschalt)|outlook.*(aus|abschalt)/i, 'Die KI-Hilfe mit Outlook schaltest du im Profil unter „Kalender und KI-Assistent“ aus.', 'Zum Profil', { screen: 'profil' }],
      [/lessons|wissen|vorlage|technik-gedächtnis/i, 'Lessons Learned, Technik-Gedächtnis und Vorlagen stehen unter „Wissen“.', 'Zu Wissen', { screen: 'wissen' }],
      [/bericht|portfolio|status.?bericht|auswertung/i, 'Statusberichte und das Portfolio findest du unter „Berichte“.', 'Zu Berichte', { screen: 'berichte' }],
      [/benachrichtig|glocke|erwähn/i, 'Benachrichtigungen siehst du an der Glocke oben; wie du benachrichtigt wirst, stellst du im Profil ein.', 'Zum Profil', { screen: 'profil' }],
      [/filter|ansicht speichern|gruppier/i, 'In jeder Aufgabenliste: Filterleiste (Person, Priorität, Fällig, Etikett), „Gruppieren nach“ und „+ Als Ansicht speichern“.', 'Zur Liste SM42', { screen: 'projekt', proj: 'sm42', ptab: 'aufgaben', mview: Object.assign({}, s.mview, { sm42: 'liste' }) }],
      [/verknüpf|abhängig|blockier|vorgänger/i, 'Verknüpfungen setzt du im Aufgaben-Detail unter „Verknüpfungen“ › „+ Verknüpfen“.', 'Zu einer Aufgabe', { screen: 'projekt', proj: 'sm42', ptab: 'aufgaben', panel: { kind: 'task', id: 't12', from: 'aufgaben' }, pSub: 'details' }],
      [/verlauf|historie|wer hat.*geändert/i, 'Änderungen siehst du im Detail › Reiter „Verlauf“.', 'Zum Verlauf', { screen: 'projekt', proj: 'sm42', ptab: 'aufgaben', panel: { kind: 'task', id: 't1', from: 'aufgaben' }, pSub: 'verlauf' }],
      [/einstellung.*projekt|projekt.*einstell|stufe|modul/i, 'Projekteinstellungen öffnest du im Projekt über das Zahnrad oben rechts: Stammdaten, Stufe und Module, Buckets, Etiketten, Rollen, Automatisierungen, Archivieren.', 'Zu SM42', { screen: 'projekt', proj: 'sm42', ptab: 'uebersicht' }],
      [/import|excel|csv|übernehm.*liste/i, 'Aufgabenlisten aus Excel übernimmst du unter Projekte › „⇪ Import aus Excel“: Zellen kopieren und einfügen oder CSV wählen, Spalten prüfen, übernehmen.', 'Zum Import', { screen: 'import' }],
      [/aufgabe.*(anleg|erstell)|to-?do anleg|neue aufgabe/i, 'Aufgaben legst du mit „+ Neu“ oben an, direkt in Board, Liste, Kalender oder Personen mit „+ Aufgabe“, oder hier im Chat mit „To-do: …“.', 'Zu Meine Aufgaben', { screen: 'arbeit', arbTab: 'aufgaben' }],
      [/team.*(geben|vergeben|zuweisen)|an ein team/i, 'An ein Team gibst du eine Aufgabe über „+ Neu“ › „Wer erledigt es?“ › „Ein Team“.', 'Neu öffnen', { panel: { kind: 'new', id: 'new', from: s.screen } }]];
    const isQuestion = tx => /\?\s*$|^(wie|wo|was|wann|warum|wieso|kann|könnte|gibt es|hilfe|zeig|finde|erklär)/i.test(tx) || /\bwo finde|wo (kann|stelle|trage|sehe)|wie (kann|mache|lege|stelle|ändere)/i.test(tx);
    const TODO_SIG = /^(to-?do|aufgabe|notiz)\b|erinnere mich|leg(e)?\b.*\ban\b|nicht vergessen|\b[A-ZÄÖÜ]\.\s?[A-Za-zäöüß]+\s+(soll|muss)\b|^für\s+([A-ZÄÖÜ]|mich)|\b(ich muss|ich sollte|muss noch)\b|^bitte .* (bis|morgen|heute)/i;
    const chatMode = s.chatMode || 'auto';
    const isMail = tx => /\b(mail|e-mail|email|antwort an|schreib(e)? (eine )?(nachricht|antwort))\b/i.test(tx) && tx.length > 25;
    const sendChat = raw => { const tx = String(raw || '').trim(); if (!tx) return; const me = { who: 'me', kind: 'text', text: tx };
      if (isMail(tx)) { const toM = tx.match(/\ban\s+((?:herrn?|frau|hr\.|fr\.)\s*)?([A-ZÄÖÜ][\w.äöüß-]*(?:\s+[A-ZÄÖÜ][\wäöüß-]+)?)(\s*\([^)]*\))?/), to = toM ? ((toM[1] || '') + toM[2] + (toM[3] || '')).trim() : '';
        const rawBody = tx.indexOf(':') >= 0 ? tx.slice(tx.indexOf(':') + 1) : tx.replace(/^.*?\b(mail|e-mail|email)\b\s*(an\s+\S+(\s+\S+)?)?/i, '');
        const r = this.polishMail(rawBody, 'freundlich', { to }); return chatPush([me, { who: 'bot', kind: 'mail', text: 'Hier ist der Entwurf' + (to ? ' an ' + to : '') + '. Ändere, was du willst, und lass ihn bei Bedarf nochmal überarbeiten.', mail: { to, subject: r.subject, body: r.text, raw: rawBody, tone: 'freundlich' } }], { chatIn: '' }); }
      if (/^(hallo|hi|hey|moin|servus|guten (morgen|tag|abend))\b[!. ]*$/i.test(tx)) return chatPush([me, { who: 'bot', kind: 'text', text: 'Hallo! Wobei kann ich helfen? Du kannst einfach schreiben, mich nach dem Weg in der Software fragen, To-dos anlegen lassen oder eine Mail aus Stichpunkten bekommen.' }], { chatIn: '' });
      if (/^(danke|merci|super|top|passt|ok(ay)?)\b/i.test(tx) && tx.length < 40) return chatPush([me, { who: 'bot', kind: 'text', text: 'Gern! Sag Bescheid, wenn du noch etwas brauchst.' }], { chatIn: '' });
      if (/was kannst du|wer bist du|wie funktionierst du|hilfe$/i.test(tx)) return chatPush([me, { who: 'bot', kind: 'text', text: 'Ich kann:\n• dir den Weg in der Software zeigen („Wo trage ich Urlaub ein?“)\n• To-dos anlegen, wenn du es sagst („To-do: …“, „erinnere mich …“, „L. Wagner soll …“)\n• Aufgaben abhaken oder in den Fokus legen („habe ich erledigt“, „bin gerade dran“)\n• Mails aus Stichpunkten schreiben („Mail an …: …“)\n• sagen, was heute ansteht\n\nOben im Chat stellst du ein, ob ich To-dos sofort anlege oder vorher frage.' }], { chatIn: '' });
      if (/\b(was steht|was ist|was habe ich).*(heute|an|offen)|überfällig\b/i.test(tx)) { const mine = TASKS.filter(x => this.ownerOf(x) === 'Du' && !this.isDone(x)), over = mine.filter(x => x.due < '2026-11-13'), today = mine.filter(x => x.due === '2026-11-13');
        return chatPush([me, { who: 'bot', kind: 'text', text: (over.length ? 'Überfällig (' + over.length + '):\n' + over.map(x => '• ' + this.kenn(x) + ' ' + x.title + ' (' + fmt(D(x.due)) + ')').join('\n') + '\n\n' : '') + (today.length ? 'Heute fällig:\n' + today.map(x => '• ' + this.kenn(x) + ' ' + x.title).join('\n') : 'Heute ist nichts mehr fällig.') + '\n\nSoll ich etwas davon auf Montag legen? Schreib z. B. „SM42-102 auf Montag“.' }], { chatIn: '' }); }
      const mv2 = tx.match(/\b([A-Z]{2,4}\d*-\d{3})\b.*\bauf\s+(montag|dienstag|mittwoch|donnerstag|freitag|\d{1,2}\.\d{1,2}\.?)/i);
      if (mv2) { const x = TASKS.find(z => this.kenn(z).toLowerCase() === mv2[1].toLowerCase()), d2 = WD[mv2[2].toLowerCase()] || parseTodo('bis ' + mv2[2]).due; if (x) { this.setDue(x.id, d2); return chatPush([me, { who: 'bot', kind: 'text', text: '„' + x.title + '“ ist jetzt fällig am ' + fmt(D(d2)) + '2026.' }], { chatIn: '' }); } }
      if (isQuestion(tx) && !/^(to-?do|aufgabe|notiz)|erinnere mich|[A-ZÄÖÜ]\.\s?[A-Za-zäöüß]+\s+(soll|muss)/i.test(tx)) { const hits = HELP.filter(([r]) => r.test(tx)).slice(0, 2);
        if (hits.length) return chatPush([me, { who: 'bot', kind: 'help', text: hits.map(h => h[1]).join('\n\n'), btns: hits.map(h => ({ label: h[2] + ' ›', patch: h[3] })) }], { chatIn: '' });
        return chatPush([me, { who: 'bot', kind: 'help', text: 'Dazu habe ich im Entwurf keine Antwort hinterlegt. Im fertigen Cockpit beantwortet das lokale Modell freie Fragen und durchsucht dafür die Hilfe und eure Wissensseiten.\n\nVersuch es z. B. mit „Wo trage ich Urlaub ein?“, „Wie lege ich ein Projekt an?“ oder „Wo finde ich den Papierkorb?“.', btns: [] }], { chatIn: '' }); }
      // Statusmeldungen zu vorhandenen Aufgaben: erledigt, in Arbeit, warte auf
      const ST_DONE = /\b(erledigt|fertig|abgeschlossen|freigegeben|abgehakt|geschafft|gemacht|ist durch|ist raus|verschickt|versendet|gesendet|habe ich (schon|bereits)|hab ich (schon|bereits)|ist (schon|bereits) (freigegeben|erledigt|fertig))\b|\b(habe|hab) ich\b[^.!?]*\b(ge\w+(t|en)|\w+iert|freigeben|erledigt)\b/i;
      const ST_WORK = /\b(dran|daran|bin (ich )?(gerade |grad |jetzt )?(dran|daran|dabei)|arbeite (gerade |jetzt )?(an|daran)|angefangen|habe? (mit .* )?begonnen|in arbeit|mache (gerade|jetzt))\b/i;
      const ST_WAIT = /\b(warte (noch )?auf|wartet (noch )?auf|hängt an)\b/i;
      const STOPW = new Set(['habe', 'hab', 'schon', 'gerade', 'grad', 'bereits', 'weiterhin', 'dran', 'daran', 'dabei', 'aber', 'noch', 'dass', 'diese', 'dieser', 'eine', 'einen', 'einer', 'heute', 'jetzt', 'mache', 'arbeite', 'erledigt', 'fertig', 'außerdem', 'auch', 'damit', 'wieder', 'warte', 'wartet', 'abgeschlossen', 'gemacht', 'geschafft', 'angefangen', 'begonnen', 'bitte', 'mich', 'mein', 'meine', 'ist', 'sind', 'wird']);
      const sigW = str => String(str).toLowerCase().replace(/[^a-zäöüß0-9_ ]/g, ' ').split(/\s+/).filter(w => w.length >= 4 && !STOPW.has(w));
      const wEq = (a1, b1) => { const n0 = Math.min(6, a1.length, b1.length); return n0 >= 4 && a1.slice(0, n0) === b1.slice(0, n0); };
      const findTasks = sent => { const ws = sigW(sent); if (!ws.length) return [];
        return TASKS.filter(x => !x.story && (this.ownerOf(x) === 'Du' || this.coOf(x).includes('Du'))).map(x => { const tw = sigW(x.title), m0 = tw.filter(w => ws.some(v => wEq(w, v))).length; return { x, m0, r: tw.length ? m0 / tw.length : 0 }; })
          .filter(o2 => o2.m0 >= 1).map(o2 => Object.assign(o2, { strong: o2.m0 >= 2 || o2.r >= 0.6 })).sort((a1, b1) => b1.m0 - a1.m0 || b1.r - a1.r); };
      const sents = tx.split(/(?<![\s(][A-ZÄÖÜ]\.)(?<=[.!?])\s+|\n+|\s+(?=weiterhin\b|außerdem\b|und dann\b)/i).map(z => z.trim()).filter(z => z.length > 3);
      const statusActs = [], restLines = [];
      sents.forEach(sent => { const kind = ST_DONE.test(sent) ? 'done' : (ST_WORK.test(sent) ? 'work' : (ST_WAIT.test(sent) ? 'wait' : null));
        if (!kind) return restLines.push(sent);
        const hits = findTasks(sent); if (!hits.length) return statusActs.push({ kind, none: true, text: sent });
        if (!hits[0].strong) return hits.filter(h => !this.isDone(h.x) || kind !== 'done').slice(0, 4).forEach(h => statusActs.push({ kind, pick: true, id: h.x.id }));
        const top = hits.filter(h => h.m0 === hits[0].m0 && Math.abs(h.r - hits[0].r) < 0.01);
        if (top.length > 1) return top.slice(0, 4).forEach(h => statusActs.push({ kind, pick: true, id: h.x.id }));
        const x = hits[0].x, prevB = this.bucketOf(x), wasDone = this.isDone(x);
        if (kind === 'done' && !wasDone) this.toggleDone(x.id);
        if (kind === 'work') { const ab = this.bucketsOf(this.pkOf(x)).find(b => b.cat === 'aktiv'); if (ab && prevB !== ab.key) this.bucketTo(x.id, ab.key); }
        if (kind === 'wait') { const wb = this.bucketsOf(this.pkOf(x)).find(b => b.cat === 'wartet'); if (wb && prevB !== wb.key) this.bucketTo(x.id, wb.key); }
        statusActs.push({ kind, id: x.id, prevB, wasDone, applied: true }); });
      if (statusActs.length) {
        const todos2 = restLines.filter(l => !/^(weiterhin|außerdem|und)\b/i.test(l) && /\b(muss|soll|bitte|erinnere|to-?do|aufgabe|bis|für)\b/i.test(l)).map(parseTodo).map(makeTodo);
        const n0 = statusActs.filter(a1 => a1.applied).length;
        return chatPush([me, { who: 'bot', kind: 'status', text: [n0 ? 'Verstanden, ich habe ' + (n0 === 1 ? 'deine Aufgabe' : n0 + ' Aufgaben') + ' aktualisiert:' : '', statusActs.some(a1 => a1.pick) ? 'Welche Aufgabe meinst du? Tippe auf die richtige.' : '', statusActs.some(a1 => a1.none) ? 'Zu „' + statusActs.filter(a1 => a1.none).map(a1 => a1.text).join('“, „') + '“ habe ich keine passende offene Aufgabe von dir gefunden. Wenn es eine neue sein soll, schreib z. B. „To-do: …“.' : ''].filter(Boolean).join('\n'), acts: statusActs.filter(a1 => !a1.none), todos: todos2 }], { chatIn: '', rev: (this.state.rev || 0) + 1 }); }
      const items = tx.split(/\n+|;\s*|\s+und dann\s+/).map(l => l.trim()).filter(l => l.length > 2);
      if (!items.length) return;
      const explicit = TODO_SIG.test(tx) || items.length > 1 && items.every(l => /^[-•*\d]/.test(l));
      if (!explicit) return chatPush([me, { who: 'bot', kind: 'ask', text: 'Verstanden. Soll ich daraus ein To-do machen?', btns: [{ label: '+ Als To-do anlegen', todo: tx }, { label: 'Nein, nur notiert', none: true }] }], { chatIn: '' });
      if (chatMode === 'fragen') { const prev = items.map(parseTodo); return chatPush([me, { who: 'bot', kind: 'ask', text: 'Soll ich ' + (prev.length === 1 ? 'dieses To-do' : 'diese ' + prev.length + ' To-dos') + ' anlegen?\n' + prev.map(p2 => '• ' + p2.title + ' · ' + (p2.who === 'Du' ? 'für dich' : 'für ' + p2.who) + (p2.proj ? ' · ' + p2.proj : '') + ' · fällig ' + fmt(D(p2.due))).join('\n'), btns: [{ label: '✓ Anlegen', todo: tx, force: true }, { label: 'Abbrechen', none: true }] }], { chatIn: '' }); }
      const todos = items.map(parseTodo).map(makeTodo);
      chatPush([me, { who: 'bot', kind: 'todo', text: todos.length === 1 ? 'Erledigt, ich habe angelegt:' : todos.length + ' To-dos angelegt:', todos }], { chatIn: '', rev: (this.state.rev || 0) + 1,
        sent: (this.state.sent || []).concat(todos.filter(td => !td.id).map(td => ({ title: td.title, who: td.who, proj: 'Ohne Projekt', h: td.h, status: td.mode === 'annahme' ? 'annahme' : 'wartet', boss: td.boss }))) }); };
    const doTodos = tx => { const items = tx.split(/\n+|;\s*|\s+und dann\s+/).map(l => l.trim()).filter(l => l.length > 2), todos = items.map(parseTodo).map(makeTodo);
      chatPush([{ who: 'bot', kind: 'todo', text: todos.length === 1 ? 'Angelegt:' : todos.length + ' To-dos angelegt:', todos }], { rev: (this.state.rev || 0) + 1, sent: (this.state.sent || []).concat(todos.filter(td => !td.id).map(td => ({ title: td.title, who: td.who, proj: 'Ohne Projekt', h: td.h, status: td.mode === 'annahme' ? 'annahme' : 'wartet', boss: td.boss }))) }); };
    const TONES = [['freundlich', 'Freundlich'], ['formell', 'Formell'], ['knapp', 'Kürzer'], ['frist', 'Mit Frist']];
    const chat = { right: s.panel && !s.chatOpen ? 'auto' : '16px', left: s.panel && !s.chatOpen ? '16px' : 'auto', open: !!s.chatOpen, openA: s.chatOpen ? 'true' : 'false', btn: s.chatOpen ? '✕ Schließen' : '✨ Assistent', btnI: s.chatOpen ? '✕' : '✨', btnT: s.chatOpen ? 'Schließen' : 'Assistent', toggle: () => this.setState({ chatOpen: !s.chatOpen }),
      sub: 'Lokales Modell auf dem Cockpit-Server · im Entwurf mit Regeln nachgebildet', clear: () => this.setState({ chat: null, chatIn: '' }),
      input: s.chatIn || '', setIn: e => this.setState({ chatIn: e && e.target ? e.target.value : '' }), send: () => { const v0 = this.state.chatIn; this.setState({ chatIn: '' }); sendChat(v0); },
      key: e => { if (!e || e.key !== 'Enter' || e.shiftKey || e.isComposing) return; if (e.preventDefault) e.preventDefault(); const v0 = e.target && e.target.value !== undefined ? e.target.value : this.state.chatIn; if (e.target) e.target.value = ''; this.setState({ chatIn: '' }); sendChat(v0); },
      sugs: [['Wo finde ich …?', 'Wo trage ich meinen Urlaub ein?'], ['Was steht heute an?', 'Was steht heute an?'], ['Status melden', 'Stromlaufplan der Schutztür habe ich schon freigegeben. Weiterhin bin ich gerade am SPS-Baustein FB_Zuführung testen dran'], ['To-do für mich', 'Erinnere mich morgen an die Rechnung Würth'], ['To-do für L. Wagner', 'L. Wagner soll in SM42 bis Freitag den Greifer prüfen, 3 h'], ['Mail aus Stichpunkten', 'Mail an Hr. Maier (Rexroth): liefertermin kw 50 ok? brauchen die IBN-doku asap. können wir mo telefonieren?']].map(([l, v]) => ({ label: l, go: () => sendChat(v) })),
      modeLabel: chatMode === 'auto' ? 'To-dos: sofort' : 'To-dos: erst fragen', modeTitle: 'Umschalten: To-dos sofort anlegen oder vorher fragen', modeToggle: () => this.setState({ chatMode: chatMode === 'auto' ? 'fragen' : 'auto' }),
      msgs: chatL.map((m, mi) => { const me = m.who === 'me', base0 = { hasBtns: false, btns: [] }, base = Object.assign(base0, { align: me ? 'flex-end' : 'flex-start', bg: me ? '#5B2D90' : t.surface, fg: me ? '#FFFFFF' : t.text, bd: me ? '#5B2D90' : t.border, text: m.text, isTodo: m.kind === 'todo', isMail: m.kind === 'mail', todos: [], tones: [], subject: '', body: '', hasNote: false, note: '' });
        if (m.btns && m.btns.length) { const used = m.used; base.hasBtns = !used; base.btns = m.btns.map(b => ({ label: b.label, bd: b.none ? t.border : '#5B2D90', bg: b.none ? t.surface : '#5B2D90', fg: b.none ? t.text : '#FFFFFF',
          go: () => { const l = (this.state.chat || CHAT0).slice(); l[mi] = Object.assign({}, l[mi], { used: !!(b.todo || b.none) }); this.setState({ chat: l });
            if (b.patch) return this.setState(Object.assign({ panel: null, chatOpen: true }, b.patch)); if (b.none) return chatPush([{ who: 'bot', kind: 'text', text: 'Alles klar, ich lege nichts an.' }]); if (b.todo) doTodos(b.todo); } })); }
        const updM = patch => { const l = (this.state.chat || CHAT0).slice(); l[mi] = Object.assign({}, l[mi], { mail: Object.assign({}, l[mi].mail, patch) }); this.setState({ chat: l }); };
        if (m.kind === 'todo') base.todos = m.todos.map(td => { const x = td.id ? TASK[td.id] : null, gone = td.id && !TASKS.includes(x);
          return { title: td.title, sub: (td.who === 'Du' ? 'für dich' : 'für ' + td.who) + (td.proj ? ' · ' + td.proj : ' · ohne Projekt') + ' · fällig ' + fmt(D(td.due)) + ' · ' + String(td.h).replace('.', ',') + ' h' + (x ? ' · ' + this.kenn(x) : ''),
            state: gone ? 'Rückgängig gemacht' : ({ mir: '✓ In Meine Arbeit', projekt: '✓ Im Projekt zugewiesen, ohne Annahme', chef: '✓ Angelegt, du bist Chef von ' + td.who, annahme: '→ Anfrage an ' + td.who + ', muss annehmen', freigabe: '→ Geht zur Freigabe an ' + (td.boss || 'den Chef') })[td.mode],
            color: gone ? t.muted : (td.id ? GREEN : '#8764B8'), canAct: !!td.id && !gone, hasUndo: true, hasAlt: false, altLabel: '', alt: () => {}, open: () => this.openTask(td.id, s.screen), undo: () => { const i = TASKS.indexOf(x); if (i >= 0) TASKS.splice(i, 1); this.setState({ rev: (this.state.rev || 0) + 1 }); } }; });
        if (m.kind === 'status') { base.isTodo = true; const KL = { done: ['✓ Abgehakt', 'Wieder öffnen'], work: ['▶ In Arbeit (Fokus)', 'Zurück'], wait: ['⏳ Warten auf', 'Zurück'] };
          base.todos = (m.acts || []).map(a1 => { const x = TASK[a1.id]; if (!x) return null; const dn = this.isDone(x), cur = this.bucketName(x, this.bucketOf(x));
            if (a1.pick) return { title: this.kenn(x) + ' ' + x.title, sub: x.proj + ' · fällig ' + fmt(D(x.due)) + ' · jetzt: ' + cur, state: a1.kind === 'done' && dn ? '✓ Abgehakt' : 'Meintest du diese?', color: a1.kind === 'done' && dn ? GREEN : '#8764B8', canAct: true, hasUndo: false, hasAlt: !(a1.kind === 'done' && dn), altLabel: a1.kind === 'done' ? '✓ Diese abhaken' : 'Diese in Arbeit',
              alt: () => { if (a1.kind === 'done' && !this.isDone(x)) this.toggleDone(x.id); else if (a1.kind !== 'done') { const ab = this.bucketsOf(this.pkOf(x)).find(b => b.cat === (a1.kind === 'wait' ? 'wartet' : 'aktiv')); if (ab) this.bucketTo(x.id, ab.key); } this.setState({ rev: (this.state.rev || 0) + 1 }); }, open: () => this.openTask(x.id, s.screen), undo: () => {} };
            const still = a1.kind === 'done' ? dn : this.catOf(x, this.bucketOf(x)) === (a1.kind === 'wait' ? 'wartet' : 'aktiv');
            return { title: this.kenn(x) + ' ' + x.title, sub: x.proj + ' · fällig ' + fmt(D(x.due)) + (a1.wasDone && a1.kind === 'done' ? ' · war schon erledigt' : ''), state: still ? KL[a1.kind][0] : 'Rückgängig gemacht', color: still ? GREEN : t.muted, canAct: true, hasUndo: still, hasAlt: false, altLabel: '', alt: () => {},
              open: () => this.openTask(x.id, s.screen), undo: () => { if (a1.kind === 'done') { if (this.isDone(x) && !a1.wasDone) this.toggleDone(x.id); } else this.bucketTo(x.id, a1.prevB); this.setState({ rev: (this.state.rev || 0) + 1 }); } }; }).filter(Boolean)
            .concat((m.todos || []).map(td => ({ title: td.title, sub: (td.who === 'Du' ? 'neu für dich' : 'neu für ' + td.who) + (td.proj ? ' · ' + td.proj : '') + ' · fällig ' + fmt(D(td.due)), state: td.id ? '✓ Neu angelegt' : '→ Anfrage gesendet', color: GREEN, canAct: !!td.id, hasUndo: !!td.id, hasAlt: false, altLabel: '', alt: () => {}, open: () => this.openTask(td.id, s.screen), undo: () => { const i = TASKS.indexOf(TASK[td.id]); if (i >= 0) TASKS.splice(i, 1); this.setState({ rev: (this.state.rev || 0) + 1 }); } }))); }
        if (m.kind === 'mail') Object.assign(base, { subject: m.mail.subject, body: m.mail.body, setSubject: e => updM({ subject: e && e.target ? e.target.value : '' }), setBody: e => updM({ body: e && e.target ? e.target.value : '' }),
          tones: TONES.map(([k, l]) => ({ label: l, pressed: m.mail.tone === k ? 'true' : 'false', ring: m.mail.tone === k ? '#5B2D90' : t.border, bg: m.mail.tone === k ? t.soft : t.surface, go: () => { const r = this.polishMail(m.mail.body, k, { to: m.mail.to, subject: m.mail.subject }); updM({ body: r.text, tone: k, note: '✨ ' + l + ' überarbeitet. Deine Änderungen sind eingeflossen.' }); } })),
          hasNote: !!m.mail.note, note: m.mail.note || '',
          toOutlook: () => updM({ note: 'Würde jetzt als Entwurf in Outlook › Entwürfe liegen (Vorschau: simuliert, kein Outlook angebunden). Nutze „Im Mailprogramm öffnen“, um ihn wirklich zu öffnen.' }),
          mailto: () => { let ok = false; try { if (typeof window !== 'undefined' && window.open) ok = !!window.open('mailto:?subject=' + encodeURIComponent(m.mail.subject) + '&body=' + encodeURIComponent(m.mail.body), '_blank'); } catch (er) { ok = false; } updM({ note: ok ? 'Dein Mailprogramm öffnet den Entwurf.' : 'Der Browser lässt hier kein Mailprogramm öffnen. Kopieren geht immer.' }); },
          copy: () => { let ok = false; try { if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText('Betreff: ' + m.mail.subject + '\n\n' + m.mail.body); ok = true; } } catch (er) { ok = false; } updM({ note: ok ? 'Kopiert, mit Betreff.' : 'Kopieren hat der Browser blockiert. Text markieren und Strg+C.' }); } });
        return base; }) };

    // Change Requests (SM42)
    const CRK = s.screen === 'pn' && s.upSel ? s.upSel : 'sm42', CRFROM = CRK === 'sm42' ? 'planung' : 'pn';
    const crList = (s.crBy || {})[CRK] || CR_SEED[CRK] || [], setCr = (l, msg) => this.setState(Object.assign({ crBy: Object.assign({}, s.crBy, { [CRK]: l }) }, msg !== undefined ? { crMsg: msg } : {}));
    const crN = Object.assign({ title: '', desc: '', days: 0, cost: '', nodes: [] }, s.crNew || {}), setCrN = patch => this.setState({ crNew: Object.assign({}, crN, patch) });
    const CRC = { eingereicht: '#8A3707', 'bei H. Lorenz': '#8764B8', genehmigt: '#107C10', abgelehnt: '#C50F1F' };
    const crCost = v => +String(v || '0').replace(/\./g, '').replace(',', '.') || 0;
    const crApprover = cr => (cr.cost <= 5000 && cr.days <= 5 ? 'Du (Projektleitung)' : 'H. Lorenz (über 5.000 € oder mehr als 5 Tage)');
    const crNodes = []; const crWalk = l => l.forEach(n => { if (n.type !== 'phase') crNodes.push(n); if (n.children) crWalk(n.children); }); crWalk(PTREE_OF[CRK] || TREE); if (!crNodes.length) { const crW2 = l => l.forEach(n => { if (!(n.children || []).length) crNodes.push(n); if (n.children) crW2(n.children); }); crW2(PTREE_OF[CRK] || TREE); } crNodes.splice(12);
    const applyCr = cr => { (cr.nodes || []).forEach(id => { const n = NODE[id]; if (!n || !cr.days) return; const oldE = n.end; n.end = addDays(n.end, cr.days); if (n.type === 'gate') n.start = n.end; this.logH('n:' + id, 'Ende (' + cr.id + ')', fmt(D(oldE)), fmt(D(n.end))); });
      if (cr.cost) { const add = Object.assign({}, this.state.invAdd); add[CRK] = (add[CRK] || []).concat([[cr.id + ' · Nachtrag', fE(cr.cost) + ' · ' + cr.title, 'plan']]); this.setState({ invAdd: add }); } };
    const decide = (cr, ok) => { const l = crList.map(z => (z.id === cr.id ? Object.assign({}, z, { status: ok ? 'genehmigt' : 'abgelehnt', decided: (cr.status === 'bei H. Lorenz' ? 'H. Lorenz' : 'Du') + ', 13.11.' }) : z)); if (ok) applyCr(cr);
      setCr(l, cr.id + (ok ? ' genehmigt.' + (cr.days ? ' ' + cr.nodes.map(id => NODE[id] ? NODE[id].name : id).join(', ') + ' verschoben um ' + cr.days + ' Tage; im Gantt als Abweichung zur Baseline sichtbar.' : '') + (cr.cost ? ' ' + fE(cr.cost) + ' stehen unter Finanzen als Nachtrag.' : '') : ' abgelehnt.' + (cr.by === 'Du' ? '' : ' ' + cr.by + ' ist benachrichtigt.'))); this.setState({ rev: (this.state.rev || 0) + 1 }); };
    const crx = { count: '(' + crList.filter(c => c.status === 'eingereicht' || c.status === 'bei H. Lorenz').length + ' offen)', open: () => this.setState({ panel: { kind: 'crs', id: 'crs', from: CRFROM }, crMsg: '' }),
      hasMsg: !!s.crMsg, msg: s.crMsg || '',
      items: crList.map(c => ({ id: c.id, title: c.title, status: c.status, color: CRC[c.status] || t.strong, sub: 'von ' + c.by + ', ' + c.when + ' · ' + (c.days ? '+' + c.days + ' Tage' : 'kein Terminverzug') + ' · ' + (c.cost ? fE(c.cost) : 'keine Mehrkosten'), open: () => this.setState({ panel: { kind: 'cr', id: c.id, from: CRFROM } }) })),
      nTitle: crN.title, setTitle: e => setCrN({ title: e && e.target ? e.target.value : '' }), nDesc: crN.desc, setDesc: e => setCrN({ desc: e && e.target ? e.target.value : '' }), nCost: crN.cost, setCost: e => setCrN({ cost: e && e.target ? e.target.value : '' }),
      days: [0, 3, 5, 7, 14].map(d0 => ({ label: d0 ? '+' + d0 + ' Tage' : 'keine', pressed: crN.days === d0 ? 'true' : 'false', ring: crN.days === d0 ? accent : t.border, bg: crN.days === d0 ? t.soft : t.surface, go: () => setCrN({ days: d0 }) })),
      nodes: crNodes.map(n => { const on = crN.nodes.includes(n.id); return { label: (on ? '✓ ' : '+ ') + n.name, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: () => setCrN({ nodes: on ? crN.nodes.filter(z => z !== n.id) : crN.nodes.concat([n.id]) }) }; }),
      rule: 'Entscheidet: ' + crApprover({ cost: crCost(crN.cost), days: crN.days }), ruleColor: crCost(crN.cost) <= 5000 && crN.days <= 5 ? GREEN : '#8764B8',
      submit: () => { if (!crN.title.trim()) return this.setState({ crMsg: 'Bitte einen Titel eingeben.' }); if (crN.days && !crN.nodes.length) return this.setState({ crMsg: 'Bei einer Terminauswirkung bitte die betroffenen Meilensteine wählen.' });
        const cr = { id: 'CR-' + String(crList.length + 1).padStart(2, '0'), title: crN.title.trim(), desc: crN.desc || '', reason: crN.desc || '–', days: crN.days, cost: crCost(crN.cost), nodes: crN.nodes, by: 'Du', when: '13.11.' };
        const small = cr.cost <= 5000 && cr.days <= 5; cr.status = small ? 'eingereicht' : 'bei H. Lorenz';
        setCr(crList.concat([cr]), cr.id + ' eingereicht. ' + (small ? 'Du entscheidest als Projektleitung.' : 'Geht zur Freigabe an H. Lorenz.')); this.setState({ crNew: null }); } };
    const crCur = s.panel && s.panel.kind === 'cr' ? crList.find(c => c.id === s.panel.id) : null;
    const crd1 = crCur ? { back: () => this.setState({ panel: { kind: 'crs', id: 'crs', from: CRFROM } }), status: crCur.status, color: CRC[crCur.status] || t.strong, meta: 'von ' + crCur.by + ', ' + crCur.when + (crCur.decided ? ' · entschieden ' + crCur.decided : ''),
      desc: crCur.desc, reason: crCur.reason, daysText: crCur.days ? '+' + crCur.days + ' Tage' : 'kein Verzug', dayColor: crCur.days ? RED : GREEN, costText: crCur.cost ? fE(crCur.cost) : 'keine', nodesText: (crCur.nodes || []).map(id => NODE[id] ? NODE[id].name : id).join(', ') || '–', approver: crApprover(crCur),
      canDecide: crCur.status === 'eingereicht' || crCur.status === 'bei H. Lorenz', approveLabel: crCur.status === 'bei H. Lorenz' ? 'Als H. Lorenz genehmigen (Demo)' : 'Genehmigen und Termine anpassen', approve: () => decide(crCur, true), reject: () => decide(crCur, false),
      isDone: crCur.status === 'genehmigt' || crCur.status === 'abgelehnt', doneText: crCur.status === 'genehmigt' ? 'Genehmigt' + (crCur.decided ? ' (' + crCur.decided + ')' : '') + '. Termine und Budget sind angepasst, die Baseline zeigt die Abweichung.' : 'Abgelehnt' + (crCur.decided ? ' (' + crCur.decided + ')' : '') + '. Nichts wurde geändert.' }
      : { back: () => {}, status: '', color: t.strong, meta: '', desc: '', reason: '', daysText: '', dayColor: t.text, costText: '', nodesText: '', approver: '', canDecide: false, approveLabel: '', approve: () => {}, reject: () => {}, isDone: false, doneText: '' };

    // Import aus Excel / CSV (Einfügen aus der Zwischenablage, CSV-Datei)
    const ix_IMP_F = [['ignore', 'ignorieren'], ['title', 'Titel'], ['owner', 'Verantwortlich'], ['due', 'Fällig'], ['h', 'Aufwand'], ['bucket', 'Status/Bucket'], ['prio', 'Priorität'], ['proj', 'Projekt'], ['ms', 'Meilenstein']];
    const ix_IMP_SYN = { title: /^(titel|aufgabe|vorgang|vorgangsname|task|name|was|beschreibung|tätigkeit|todo|to-do)$/i, owner: /^(verantwortlich|bearbeiter|wer|owner|zuständig|ressource|ressourcennamen|person|mitarbeiter)$/i, due: /^(fällig|fällig am|termin|ende|enddatum|fertig bis|due|datum|deadline|bis)$/i, h: /^(aufwand|stunden|std|h|dauer|arbeit|schätzung)$/i, bucket: /^(status|bucket|stand|zustand)$/i, prio: /^(priorität|prio|priority|wichtigkeit)$/i, proj: /^(projekt|project|auftrag)$/i, ms: /^(meilenstein|phase|arbeitspaket|psp)$/i };
    const ix_IMP_SAMPLE = 'Aufgabe\tVerantwortlich\tFällig\tAufwand\tStatus\tPriorität\nKlemmenplan Schaltschrank 2 erstellen\tT. Brandt\t27.11.2026\t6\toffen\tHoch\nSchutzzaun Feld 3 bestellen\tWagner\t20.11.2026\t2\tin Arbeit\tMittel\nRoboterprogramm Greiferwechsel\tYilmaz\t04.12.2026\t12\toffen\tHoch\nCE-Dokumentation Kapitel 4\tDu\t11.12.2026\t8\twartet\tMittel\nAltes Angebot Festo archivieren\tDu\t02.11.2026\t1\terledigt\tNiedrig\nFAT-Termin mit Kunde abstimmen\tMüller\t18.11.2026\t1\toffen\tHoch';
    const ix_impRaw = s.impRaw || '';
    const ix_parseTable = txt => { const lines = txt.replace(/\r/g, '').split('\n').filter(l => l.trim()); if (!lines.length) return { head: [], rows: [], delim: '' };
      const delim = lines[0].indexOf('\t') >= 0 ? '\t' : ((lines[0].match(/;/g) || []).length >= (lines[0].match(/,/g) || []).length ? ';' : ',');
      const split = l => { const out = []; let cur = '', q = false; for (let k = 0; k < l.length; k++) { const ch = l[k]; if (ch === '"') { if (q && l[k + 1] === '"') { cur += '"'; k++; } else q = !q; } else if (ch === delim && !q) { out.push(cur.trim()); cur = ''; } else cur += ch; } out.push(cur.trim()); return out; };
      const all = lines.map(split); return { head: all[0], rows: all.slice(1), delim }; };
    const ix_tbl = ix_parseTable(ix_impRaw);
    const ix_autoMap = ix_tbl.head.map(h0 => { const k = Object.keys(ix_IMP_SYN).find(f => ix_IMP_SYN[f].test(h0.trim())); return k || 'ignore'; });
    const ix_map = ix_tbl.head.map((h0, i) => ((s.impMap || {})[i] !== undefined ? s.impMap[i] : ix_autoMap[i]));
    const ix_colOf = f => ix_map.indexOf(f);
    const ix_impDate = v => { v = String(v || '').trim(); if (!v) return null; let m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if (m) return m[1] + '-' + m[2].padStart(2, '0') + '-' + m[3].padStart(2, '0');
      m = v.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})?/); if (m) { const y = m[3] ? (m[3].length === 2 ? '20' + m[3] : m[3]) : (+m[2] >= 11 ? '2026' : '2027'); return y + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0'); }
      if (/^\d{5}$/.test(v)) { const d0 = new Date(Date.UTC(1899, 11, 30) + (+v) * 86400000); return d0.toISOString().slice(0, 10); } return null; };
    const ix_PEOPLE = Object.keys(AV);
    const ix_impOwner = v => { v = String(v || '').trim(); if (!v || /^(ich|du|mir|me)$/i.test(v)) return { who: 'Du', ok: true }; const hit = ix_PEOPLE.find(p => p.toLowerCase() === v.toLowerCase() || p.split(' ').pop().toLowerCase() === v.split(/[\s,]+/).pop().toLowerCase());
      return hit ? { who: hit, ok: true } : { who: 'Du', ok: false, raw: v }; };
    const ix_impBucket = v => { v = String(v || '').toLowerCase(); if (/erledigt|fertig|done|abgeschlossen|100/.test(v)) return 'Erledigt'; if (/arbeit|läuft|doing|begonnen|aktiv/.test(v)) return 'Fokus'; if (/wart|blockiert|hold/.test(v)) return 'Warten auf'; return 'Backlog'; };
    const ix_projOpts = ['Ohne Projekt'].concat(Object.values(PNAME_OF)).concat((s.uprojs || []).map(u => u.name));
    const ix_impProj = ix_projOpts.includes(s.impProj) ? s.impProj : 'SM42 Schraubstation';
    const ix_off = s.impOff || {};
    const ix_parsed = ix_tbl.rows.map((r, ri) => { const get = f => (ix_colOf(f) >= 0 ? r[ix_colOf(f)] || '' : ''); const title = get('title').trim(), ow = ix_impOwner(get('owner')), due = ix_impDate(get('due')), hRaw = get('h').replace(',', '.'), h = parseFloat(hRaw) || 2;
      const pr = /hoch|high|wichtig|dringend/i.test(get('prio')) ? (/dringend/i.test(get('prio')) ? 'Dringend' : 'Hoch') : (/niedrig|low/i.test(get('prio')) ? 'Niedrig' : 'Mittel');
      const pj = get('proj') ? (ix_projOpts.find(p => p.toLowerCase().indexOf(get('proj').toLowerCase()) >= 0 || get('proj').toLowerCase().indexOf((PCODE[p] || '~').toLowerCase()) >= 0) || ix_impProj) : ix_impProj;
      const notes = []; if (!title) notes.push('kein Titel, wird übersprungen'); if (!ow.ok) notes.push('„' + ow.raw + '“ unbekannt → bei dir'); if (get('due') && !due) notes.push('Datum „' + get('due') + '“ nicht lesbar → 20.11.'); if (!get('due')) notes.push('ohne Datum → 20.11.');
      if (title && TASKS.some(x => x.proj === pj && x.title.toLowerCase() === title.toLowerCase())) notes.push('gibt es schon im Projekt');
      return { ri, title, owner: ow.who, due: due || '2026-11-20', h, bucket: ix_impBucket(get('bucket')), prio: pr, proj: pj, notes, ok: !!title, dup: notes.some(n => /gibt es schon/.test(n)), on: !!title && !ix_off[ri] && !notes.some(n => /gibt es schon/.test(n)) }; });
    const ix_sel = ix_parsed.filter(r => r.on);
    const imp = { open: () => this.setState({ screen: 'import', panel: null, impMsg: '' }), back: () => this.setState({ screen: 'projekte' }),
      v2File: e => { const f = e && e.target && e.target.files && e.target.files[0]; if (!f) return; try { const rd = new FileReader(); rd.onload = () => this.loadV2(String(rd.result || '')); rd.onerror = () => this.setState({ v2Msg: 'Datei konnte nicht gelesen werden. Alternativ: Inhalt einfügen.' }); rd.readAsText(f, 'utf-8'); } catch (er) { this.setState({ v2Msg: 'Datei konnte nicht gelesen werden. Alternativ: Inhalt einfügen.' }); } },
      v2PasteOpen: !!s.v2Paste, v2PasteLabel: s.v2Paste ? 'Einfügen schließen' : 'Oder Inhalt einfügen', v2PasteToggle: () => this.setState({ v2Paste: !s.v2Paste }), v2Raw: s.v2Raw || '', v2SetRaw: e => this.setState({ v2Raw: e && e.target ? e.target.value : '' }), v2LoadRaw: () => this.loadV2(this.state.v2Raw || ''),
      v2HasMsg: !!s.v2Msg, v2Msg: s.v2Msg || '', v2Has: !!(s.v2Keys || []).length,
      v2List: (s.uprojs || []).filter(u => (s.v2Keys || []).includes(u.key)).map(u => { const tk = TASKS.filter(x => x.proj === u.name), dn = tk.filter(x => this.isDone(x)).length; return { code: u.code, name: u.name, color: u.color, sub: (u.v2status || '') + ' · ' + tk.length + ' Aufgaben, ' + dn + ' erledigt' + ((u.nodes || []).length ? ' · ' + u.nodes.length + ' Phasen' : ''), open: () => this.setState({ screen: 'pn', upSel: u.key, upTab: 'uebersicht', panel: null }) }; }),
      raw: ix_impRaw, setRaw: e => this.setState({ impRaw: e && e.target ? e.target.value : '', impMap: {}, impOff: {}, impMsg: '', impDone: false }), sample: () => this.setState({ impRaw: ix_IMP_SAMPLE, impMap: {}, impOff: {}, impMsg: '', impDone: false }), clear: () => this.setState({ impRaw: '', impMap: {}, impOff: {}, impMsg: '', impDone: false }),
      pickFile: e => { const f = e && e.target && e.target.files && e.target.files[0]; if (!f) return; if (/\.xlsx?$/i.test(f.name)) return this.setState({ impMsg: '.xlsx kann der Entwurf nicht lesen. In Excel „Speichern unter › CSV“ oder Zellen kopieren und einfügen.' });
        try { const rd = new FileReader(); rd.onload = () => this.setState({ impRaw: String(rd.result || ''), impMap: {}, impOff: {}, impMsg: '„' + f.name + '“ gelesen.', impDone: false }); rd.readAsText(f, 'utf-8'); } catch (er) { this.setState({ impMsg: 'Datei konnte nicht gelesen werden.' }); } },
      info: ix_tbl.head.length ? ix_tbl.rows.length + ' Zeilen, ' + ix_tbl.head.length + ' Spalten erkannt (' + ({ '\t': 'aus Excel kopiert', ';': 'CSV mit Semikolon', ',': 'CSV mit Komma' })[ix_tbl.delim] + ')' : '',
      hasData: ix_tbl.head.length > 0 && ix_tbl.rows.length > 0,
      cols: ix_tbl.head.map((h0, i) => ({ head: h0 || 'Spalte ' + (i + 1), sample: (ix_tbl.rows[0] || [])[i] || '–', opts: ix_IMP_F.map(([k, l]) => ({ label: l, pressed: ix_map[i] === k ? 'true' : 'false', ring: ix_map[i] === k ? accent : t.border, bg: ix_map[i] === k ? t.soft : t.surface, go: () => this.setState({ impMap: Object.assign({}, ix_map.reduce((o, v2, j) => Object.assign(o, { [j]: v2 }), {}), { [i]: k }) }) })) })),
      projs: ix_projOpts.map(p => ({ label: p, pressed: ix_impProj === p ? 'true' : 'false', ring: ix_impProj === p ? accent : t.border, bg: ix_impProj === p ? t.soft : t.surface, go: () => this.setState({ impProj: p }) })),
      projNote: ix_colOf('proj') >= 0 ? 'Die Spalte „Projekt“ gewinnt; das Ziel-Projekt gilt für Zeilen ohne erkennbares Projekt.' : 'Alle Zeilen landen in diesem Projekt. Im Projekt werden Personen direkt zugewiesen, ohne Annahme.',
      rows: ix_parsed.slice(0, 40).map(r => ({ title: r.title || '(leer)', owner: r.owner, due: fmt(D(r.due)), h: String(r.h).replace('.', ',') + ' h', bucket: r.bucket, note: r.notes.join(' · ') || '✓', noteColor: r.notes.length ? (r.ok && !r.dup ? '#A33F06' : RED) : GREEN,
        on: r.on ? 'true' : 'false', mark: r.on ? '✓' : '', fill: r.on ? accent : 'transparent', ring: r.on ? accent : t.strong, bg: r.on ? 'transparent' : t.surface2, toggle: () => { if (!r.ok) return; this.setState({ impOff: Object.assign({}, ix_off, { [r.ri]: !ix_off[r.ri] && r.on }) }); } })),
      more: ix_parsed.length > 40, moreText: '… und ' + (ix_parsed.length - 40) + ' weitere Zeilen.',
      sum: ix_sel.length + ' von ' + ix_parsed.length + ' Zeilen werden übernommen' + (ix_colOf('title') < 0 ? ' · Bitte eine Spalte als „Titel“ zuordnen' : ''), sumColor: ix_colOf('title') < 0 ? RED : t.text,
      hasMsg: !!s.impMsg, msg: s.impMsg || '', done: !!s.impDone, runLabel: ix_sel.length ? ix_sel.length + ' Aufgaben übernehmen' : 'Nichts zu übernehmen',
      run: () => { if (ix_colOf('title') < 0) return this.setState({ impMsg: 'Bitte zuerst eine Spalte als „Titel“ zuordnen.' }); if (!ix_sel.length) return this.setState({ impMsg: 'Keine Zeile ausgewählt.' });
        ix_sel.forEach(r => { const id = this.quickTask({ title: r.title, proj: r.proj, owner: r.owner, due: r.due, h: r.h, bucket: r.bucket }); if (TASK[id]) TASK[id].prio = r.prio; });
        const projs2 = Array.from(new Set(ix_sel.map(r => r.proj)));
        this.setState({ impDone: true, impLast: projs2[0], impOff: Object.assign({}, ix_off, ix_sel.reduce((o, r) => Object.assign(o, { [r.ri]: true }), {})), impMsg: ix_sel.length + ' Aufgaben übernommen in ' + projs2.join(', ') + '. Jede hat eine Kennung und erscheint in Board, Liste, Kalender und bei den Personen.' }); },
      goTarget: () => { const pk = PK_OF[s.impLast]; if (pk && PNAME_OF[pk]) this.setState({ screen: 'projekt', proj: pk, ptab: 'aufgaben', mview: Object.assign({}, s.mview, { [pk]: 'liste' }) }); else { const u = (s.uprojs || []).find(u2 => u2.name === s.impLast); if (u) this.setState({ screen: 'pn', upSel: u.key, upTab: 'aufgaben', upView: 'liste' }); else this.setState({ screen: 'arbeit', arbTab: 'aufgaben' }); } } };

    // Panel
    const blankChip = { label: '', bg: 'transparent', fg: t.text, bd: 'transparent' };
    let p = { isCrList: false, isCr: false, hasKid: false, kid: '', copyLink: () => {}, titleEdit: false, titleStatic: true, hasDoneBtn: false, crumbs: [], kindLabel: '', title: '', chip: blankChip, dates: '', isTask: false, isNode: false, isSettings: false, isStory: false, isVnode: false, hasMs: false, canJump: false, hasKids: false, hasTasks: false, kids: [], tasks: [], acs: [], noAc: false, shiftBtns: [], msChip: blankChip, isWissen: false, wtags: [], wfields: [], isTaskD: false, isNodeD: false, dueIso: '', setDue: () => {}, multiOk: false, multiNo: false, ownPick: [], coPick: [], coText: '', coOutside: '', nodeDateEdit: false, nodeDateFixed: false, nodeIsPoint: false, nodeStartIso: '', nodeEndIso: '', notPoint: false, setNodeStart: () => {}, setNodeEnd: () => {}, waitShow: false, waitAskNow: false, waitEditing: false, waitHas: false, waitText: '', waitSub: '', waitWho: [], waitUntil: [], waitCmp: noCmp, comments: [], hasComments: false, cmCount: '', cmCmp: noCmp, hasPMsg: false, pMsgText: '', isGate: false, gateHas: false, gateShowBtns: false, gateBtns: [], gateCmp: noCmp, gateLabel: '', gateWho: '', gateText: '', gateNote: '', gateReset: () => {}, helpBtn: blankChip, helpPressed: 'false', helpLabel: '', adoptLabel: '', origin: '', isNew: false };
    const pan = s.panel;
    const projCrumb = { label: 'SM42 Schraubstation', open: () => this.openProject('sm42') };
    const nodeCrumbs = id => { const chain = []; let c = PARENT[id]; while (c) { chain.unshift(c); c = PARENT[c]; } const rpk = this.pkOfNode(id), ru = (s.uprojs || []).find(u => u.key === rpk); return [NODE[id] && NODE[id].pd ? { label: 'Prüfstand Drehmoment', open: () => this.openProject('pd') } : (ru ? { label: ru.name, open: () => this.setState({ screen: 'pn', upSel: ru.key, upTab: 'planung', panel: null }) } : (PNAME_OF[rpk] ? { label: PNAME_OF[rpk], open: () => this.openProject(rpk) } : projCrumb))].concat(chain.map(cid => ({ label: NODE[cid].name, open: () => this.openNode(cid, pan.from) }))); };
    const inPlanung = s.screen === 'projekt' && s.ptab === 'planung';
    // Akte am Objekt: Überblick, Doku, Dateien, Zeiten, Kosten
    const akKind = pan && (pan.kind === 'task' || pan.kind === 'node') ? pan.kind : null;
    const akObj = akKind === 'task' ? TASK[pan.id] : (akKind === 'node' ? NODE[pan.id] : null);
    const akKey = akObj ? akKind[0] + ':' + pan.id : '__';
    const akPk = akKind === 'task' ? this.pkOf(akObj) : (akKind === 'node' ? this.pkOfNode(pan.id) : 'sm42');
    const AK0 = AKTE_SEED[akKey] || {};
    const akCur = () => Object.assign({ doku: [], files: [], times: [], inv: [] }, (this.state.akte || {})[akKey] || {});
    const akAll = k => (AK0[k] || []).concat(akCur()[k]);
    const akFiles = akAll('files').slice().reverse(), akVi = s.akView && s.akView.key === akKey && akFiles[s.akView.i] ? s.akView.i : -1;
    const akViewV = (() => { if (akVi < 0) return { on: false };
      const [ext, name, size, who, when] = akFiles[akVi], url = FILE_URL[name] || '', isImg = ext === 'IMG', isPdf = ext === 'PDF', go = d => () => this.setState({ akView: { key: akKey, i: (akVi + d + akFiles.length) % akFiles.length } });
      const docTitle = name.replace(/\.[a-z]+$/i, '').replace(/_/g, ' ');
      return { on: true, name, pos: (akVi + 1) + ' von ' + akFiles.length, prev: go(-1), next: go(1), close: () => this.setState({ akView: null }), url, hasUrl: !!url, noUrl: !url,
        realImg: !!url && isImg, realPdf: !!url && isPdf, mockImg: !url && isImg, mockPdf: !url && isPdf, noPrev: !isImg && !isPdf,
        caption: size + ' · hochgeladen von ' + who + ', ' + when, docTitle, lines: ['92%', '100%', '85%', '96%', '60%', '100%', '88%', '74%', '95%', '40%'],
        note: (/Anmerkung|Review|Stromlauf/i.test(name) ? 'Anmerkung ' + who + ': Schutztürkreis K3 und K7 prüfen.' : 'Seite 1 von ' + (2 + (name.length % 5))),
        download: () => this.setState({ akMsg: '„' + name + '“ würde jetzt heruntergeladen. (Vorschau: Beispieldatei, im fertigen Cockpit kommt sie aus der Dokumentenablage.)' }),
        hint: url ? 'Echte Datei aus deinem Upload, nur in diesem Browser.' : 'Beispieldatei: Die Vorschau ist im Entwurf nachgebildet. Dateien, die du über „Datei wählen …“ hochlädst, zeigt die Vorschau echt an. Im fertigen Cockpit öffnen PDFs und Bilder direkt hier, Office-Dateien in Word oder Excel Online.' }; })();
    const setAk = (k, item, msg, extra) => { const cur = akCur(); cur[k] = cur[k].concat([item]); this.setState(Object.assign({ akte: Object.assign({}, this.state.akte, { [akKey]: cur }), akMsg: msg }, extra || {})); };
    const akSub = akObj ? (s.pSub || 'details') : 'details';
    const pk3 = (on, label, go) => ({ label, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go });
    const akTitle = akObj ? (akObj.title || akObj.name) : '';
    const DOKC = { Notiz: '#5C5C5C', Protokoll: '#0F6CBD', Entscheidung: '#5B2D90', Messwert: '#0E7A6E', Abnahme: GREEN };
    const DOKCH = { Notiz: ['Mit Lieferant telefoniert', 'Nächster Schritt:'], Protokoll: ['Teilnehmer:', 'Ergebnis:', 'Offene Punkte:'], Entscheidung: ['Entschieden:', 'Begründung:', 'Alternativen:'], Messwert: ['Drehmoment Nm:', 'Temperatur °C:', 'Toleranz eingehalten'], Abnahme: ['Ohne Mängel abgenommen', 'Mit Restpunkten:', 'Unterschrift Kunde liegt vor'] };
    const EXTC = { PDF: '#A4262C', IMG: '#33691E', DOC: '#2B5797', XLS: '#107C10' };
    const tList = akAll('times'), tSum = tList.reduce((a, x) => a + x[2], 0);
    const akEst = akKind === 'task' ? estOf0(akObj) : (akObj ? ((akObj.tasks || []).reduce((a, id) => a + estOf0(TASK[id]), 0) || akObj.est || 8) : 0);
    const memA = (PMEMBERS[akPk] || []).map(m => m[0]).filter(n2 => n2 !== 'Kunde');
    const nCo = akKind === 'node' ? ((s.nodeCo || {})[pan.id] || []) : [];
    const invAll = akAll('inv'), invSum = invAll.reduce((a, x) => a + x[1], 0);
    const amtNum = parseFloat(String(s.akAmt || '').replace(/\./g, '').replace(',', '.')) || 0;
    const fmtE = v => v.toLocaleString('de-DE', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
    const ak = {
      descShown: akObj && akObj.desc ? akObj.desc : 'Noch keine Beschreibung. Mit ✎ schreiben.', descText: akObj ? (akObj.desc || '') : '', descEditing: !!akObj && s.descEdit === akKey, descView: !(akObj && s.descEdit === akKey),
      descStart: () => this.setState({ descEdit: akKey }), descDone: () => this.setState({ descEdit: null, akMsg: 'Beschreibung gespeichert.' }),
      descSet: e => { if (!akObj) return; akObj.desc = e && e.target ? e.target.value : akObj.desc; this.setState({ rev: (this.state.rev || 0) + 1 }); },
      has: !!akObj, details: akSub === 'details', doku: akSub === 'doku', dateien: akSub === 'dateien', zeit: akSub === 'zeit', kosten: akSub === 'kosten', verlauf: akSub === 'verlauf',
      hist: ((s.hist || {})[akKey] || HIST_SEED[akKey] || []).slice().reverse().map(([when, who, field, old, nw]) => ({ when, who, field, old: old || '–', nw: nw || '–', ini: ini(who), av: AV[who] || '#5C5C5C' })), noHist: !((s.hist || {})[akKey] || HIST_SEED[akKey] || []).length,
      tabs: [['details', 'Überblick', 0], ['doku', 'Doku', akAll('doku').length], ['dateien', 'Dateien', akAll('files').length], ['zeit', 'Zeiten', tList.length], ['kosten', 'Kosten', invAll.length], ['verlauf', 'Verlauf', ((s.hist || {})[akKey] || HIST_SEED[akKey] || []).length]].map(([k, l, n2]) => { const on = akSub === k;
        return { label: l + (n2 ? ' · ' + n2 : ''), sel: on ? 'true' : 'false', bg: on ? t.surface : 'transparent', fg: on ? t.text : t.muted, sh: on ? '0 1px 2px rgba(0,0,0,0.12)' : 'none', go: () => this.setState({ pSub: k, akMsg: '' }) }; }),
      hasMsg: !!s.akMsg, msg: s.akMsg || '',
      // Doku
      dokuTypes: Object.keys(DOKC).map(k => pk3(s.akTyp === k, k, () => this.setState({ akTyp: k }))),
      dokuList: akAll('doku').slice().reverse().map(([typ, who, when, text]) => ({ typ, who, when, text, ini: ini(who), av: AV[who] || '#5C5C5C', typBg: DOKC[typ] || t.strong })), noDoku: akAll('doku').length === 0,
      dokuCmp: akObj ? cmp('dk:' + akKey, { always: true, title: 'Neuer Eintrag: ' + s.akTyp, ph: 'Was ist passiert, was wurde festgelegt, welche Werte …', chips: DOKCH[s.akTyp] || [], send: 'Speichern', err: 'Bitte etwas eintragen.',
        onSend: v => setAk('doku', [s.akTyp, 'Du', 'heute 09:15', v], s.akTyp + ' gespeichert. Steht auch im Projekt-Logbuch, verknüpft mit „' + akTitle + '“.') }) : noCmp,
      // Dateien und Fotos
      files: akFiles.map(([ext, name, size, who, when], fi) => ({ ext: ext === 'IMG' ? '📷' : ext, name, sub: size + ' · ' + who + ' · ' + when, bg: EXTC[ext] || '#5C5C5C', big: ext === 'IMG' ? '64px' : '40px', open: () => this.setState({ akView: { key: akKey, i: fi } }) })), noFiles: akAll('files').length === 0,
      view: akViewV,
      addPhoto: () => setAk('files', ['IMG', 'Foto_13-11_09' + String(10 + akAll('files').length) + '.jpg', '2,1 MB', 'Du', 'heute'], 'Foto hochgeladen. Am Handy öffnet der Knopf direkt die Kamera.'),
      addDoc: () => setAk('files', ['PDF', 'Dokument_' + (akAll('files').length + 1) + '.pdf', '340 KB', 'Du', 'heute'], 'Abgelegt. Die Datei steht auch unter Projekt › Dokumente, verknüpft mit „' + akTitle + '“.'),
      pickFile: e => { const f = e && e.target && e.target.files && e.target.files[0]; if (!f) return; const ext = /\.(jpe?g|png|heic|gif)$/i.test(f.name) ? 'IMG' : (/\.pdf$/i.test(f.name) ? 'PDF' : (/\.xlsx?$/i.test(f.name) ? 'XLS' : 'DOC'));
        try { if (typeof URL !== 'undefined' && URL.createObjectURL) FILE_URL[f.name] = URL.createObjectURL(f); } catch (er) {}
        setAk('files', [ext, f.name, Math.max(1, Math.round((f.size || 1024) / 1024)).toLocaleString('de-DE') + ' KB', 'Du', 'heute'], '„' + f.name + '“ hochgeladen. Mit „Ansehen“ öffnest du die Vorschau.', { akView: { key: akKey, i: 0 } }); },
      // Zeiten
      estLabel: (Math.round(akEst * 10) / 10).toLocaleString('de-DE') + ' h', bookedLabel: (Math.round(tSum * 100) / 100).toLocaleString('de-DE') + ' h',
      bookedW: pct(Math.min(100, akEst ? tSum / akEst * 100 : 0)), bookedBg: tSum > akEst ? RED : accent,
      estNote: tSum > akEst ? 'Mehr gebucht als geschätzt. Schätzung anpassen oder Grund dokumentieren.' : 'Noch ' + (Math.round((akEst - tSum) * 10) / 10).toLocaleString('de-DE') + ' h bis zur Schätzung.',
      estEditable: akKind === 'task', estFixed: akKind === 'node', estFixedNote: 'Summe der Aufgaben dieses Meilensteins. Schätzung an den Aufgaben ändern.',
      estMinus: () => { if (akKind !== 'task') return; EST[akObj.id] = Math.max(0.5, akEst - 0.5); this.setState({ rev: (s.rev || 0) + 1, akMsg: 'Schätzung jetzt ' + EST[akObj.id].toLocaleString('de-DE') + ' h. Kapazität und Mein Tag rechnen neu.' }); },
      estPlus: () => { if (akKind !== 'task') return; EST[akObj.id] = akEst + 0.5; this.setState({ rev: (s.rev || 0) + 1, akMsg: 'Schätzung jetzt ' + EST[akObj.id].toLocaleString('de-DE') + ' h. Kapazität und Mein Tag rechnen neu.' }); },
      times: tList.slice().reverse().map(([day, who, h, note]) => ({ day, who, h: h.toLocaleString('de-DE') + ' h', note: note || '–', ini: ini(who), av: AV[who] || '#5C5C5C' })), noTimes: tList.length === 0,
      tHours: [0.5, 1, 1.5, 2, 3, 4].map(h => pk3(s.akH === h, h.toLocaleString('de-DE') + ' h', () => this.setState({ akH: h }))),
      tDays: [['heute', 'heute 13.11.'], ['gestern', 'Do 12.11.'], ['mi', 'Mi 11.11.']].map(([k, l]) => pk3(s.akD === k, l, () => this.setState({ akD: k }))),
      tWho: (akPk === 'sm42' ? ['Du'].concat(memA.filter(n2 => n2 !== 'Du')) : ['Du']).map(n2 => pk3(s.akWho === n2, n2, () => this.setState({ akWho: n2 }))), tWhoNote: akPk === 'sm42' ? 'Als Projektleitung kannst du auch für andere buchen (z. B. nachgetragen).' : '',
      timeCmp: akObj ? cmp('tm:' + akKey, { always: true, optional: true, title: 'Notiz zur Buchung (freiwillig)', ph: 'Was hast du gemacht?', chips: ['Recherche', 'Abstimmung', 'Umsetzung', 'Test', 'Doku'], send: 'Zeit buchen',
        onSend: v => setAk('times', [({ heute: '13.11.', gestern: '12.11.', mi: '11.11.' })[s.akD], s.akWho, s.akH, v], s.akH.toLocaleString('de-DE') + ' h für ' + (s.akWho === 'Du' ? 'dich' : s.akWho) + ' gebucht. Erscheint im Wochenzettel KW 46.') }) : noCmp,
      // Kosten und Rechnungen
      invList: invAll.slice().reverse().map(([sup, amount, kind, status, note]) => ({ sup, amount: fmtE(amount), kind, status, note, stBg: /freigegeben|bezahlt/.test(status) ? GREEN : (/bei /.test(status) ? '#8764B8' : t.strong) })), noInv: invAll.length === 0,
      invSum: invAll.length ? 'Summe an diesem Objekt: ' + fmtE(invSum) : '',
      ...(() => { const q = (s.akSupQ || '').trim().toLowerCase(), all = SUPPLIERS.concat((s.supAdd || []).map(n2 => [n2, 'neu', 'vom Einkauf noch zu prüfen']));
        const used = ['Würth', 'Bosch Rexroth', 'Festo'], hits = q ? all.filter(x => x[0].toLowerCase().indexOf(q) >= 0 || x[1].indexOf(q) >= 0 || x[2].toLowerCase().indexOf(q) >= 0).slice(0, 12) : all.filter(x => used.includes(x[0]) || x[0] === s.akSup);
        const sel = all.find(x => x[0] === s.akSup) || [s.akSup, 'neu', ''];
        return { sups: hits.map(([n2, nr, what]) => Object.assign(pk3(s.akSup === n2, n2, () => this.setState({ akSup: n2, akSupQ: '' })), { title: 'Kreditor ' + nr + ' · ' + what })),
          supQ: s.akSupQ || '', setSupQ: e => this.setState({ akSupQ: e && e.target ? e.target.value : '' }), supSel: s.akSup, supInfo: sel[1] === 'neu' ? 'neuer Lieferant, Einkauf legt die Stammdaten an' : 'Kreditor ' + sel[1] + ' · ' + sel[2],
          supHead: q ? (hits.length ? hits.length + ' Treffer in ' + all.length + ' Lieferanten aus SAP' : 'Kein Treffer in den ' + all.length + ' Lieferanten aus SAP.') : 'Zuletzt verwendet · Suche durchsucht alle ' + all.length + ' Lieferanten aus SAP',
          supNew: !!q && !all.some(x => x[0].toLowerCase() === q), supAdd: () => { const n2 = (this.state.akSupQ || '').trim(); if (!n2) return; this.setState({ supAdd: (this.state.supAdd || []).concat([n2]), akSup: n2, akSupQ: '', akMsg: '„' + n2 + '“ als neuer Lieferant übernommen. Der Einkauf prüft die Stammdaten, bevor die Rechnung bezahlt wird.' }); } }; })(),
      kinds: ['Material', 'Dienstleistung', 'Reisekosten', 'Werkzeug'].map(n2 => pk3(s.akKind === n2, n2, () => this.setState({ akKind: n2 }))),
      amt: s.akAmt || '', setAmt: e => this.setState({ akAmt: e && e.target ? e.target.value : '' }),
      amtChips: ['240', '1.480', '6.900'].map(v2 => pk3(s.akAmt === v2, v2 + ' €', () => this.setState({ akAmt: v2 }))),
      rule: 'Bis 5.000 € gibt die Projektleitung (' + (PL_OF[akPk] === 'Du' ? 'du' : PL_OF[akPk]) + ') frei, darüber H. Lorenz. Danach geht die Rechnung an die Buchhaltung.' + (amtNum ? ' Dieser Betrag: ' + (amtNum > 5000 ? 'Freigabe durch H. Lorenz.' : (PL_OF[akPk] === 'Du' ? 'gibst du selbst frei.' : 'Freigabe durch ' + PL_OF[akPk] + '.')) : ''),
      belegText: s.akBeleg ? '✓ Beleg angehängt: Rechnung_' + s.akSup.replace(/\s/g, '') + '.pdf' : 'Noch kein Beleg', belegColor: s.akBeleg ? GREEN : t.muted,
      addBeleg: () => this.setState({ akBeleg: true }),
      submitInv: () => { if (!amtNum) return this.setState({ akMsg: 'Bitte den Betrag eintragen.' }); if (!s.akBeleg) return this.setState({ akMsg: 'Bitte den Beleg anhängen: Foto oder PDF der Rechnung.' });
        const pl = PL_OF[akPk], status = amtNum > 5000 ? 'bei H. Lorenz' : (pl === 'Du' ? 'freigegeben' : 'bei ' + pl), note = amtNum > 5000 ? 'über 5.000 €: Freigabe Bereichsleitung' : (pl === 'Du' ? 'von dir freigegeben, geht an die Buchhaltung' : 'Freigabe Projektleitung');
        const add = Object.assign({}, this.state.invAdd); add[akPk] = (add[akPk] || []).concat([[s.akSup + ' · ' + s.akKind, fmtE(amtNum) + ' · ' + akTitle, status === 'freigegeben' ? 'plan' : 'pruefung']]);
        if ((s.uprojs || []).some(u0 => u0.key === akPk)) { const pi = Object.assign({}, this.state.pInv); pi[akPk] = (pi[akPk] || []).concat([{ id: 'iv' + Date.now().toString(36), sup: s.akSup, amt: amtNum, kind: s.akKind, where: akTitle, beleg: 'Rechnung_' + s.akSup.replace(/\s/g, '') + '.pdf', status: status === 'freigegeben' ? 'freigegeben' : status, appr: amtNum > 5000 ? 'H. Lorenz' : (pl === 'Du' ? 'Du' : pl), date: fmt(TODAY) }]); this.setState({ pInv: pi }); }
        setAk('inv', [s.akSup, amtNum, s.akKind, status, note], 'Rechnung über ' + fmtE(amtNum) + ' eingereicht: ' + note + '. Steht auch unter Projekt › Finanzen.', { akAmt: '', akBeleg: false, invAdd: add }); },
      // Beteiligte am Meilenstein
      nOwn: akKind === 'node' ? memA.concat(['Geschäftsführung', 'Kunde']).map(n2 => pk3(akObj.owner === n2, n2, () => { akObj.owner = n2; this.setState({ rev: (s.rev || 0) + 1, akMsg: n2 + ' ist jetzt verantwortlich für „' + akTitle + '“.' }); })) : [],
      nCo: akKind === 'node' ? memA.filter(n2 => n2 !== akObj.owner).map(n2 => { const on = nCo.includes(n2); return pk3(on, (on ? '✓ ' : '+ ') + n2, () => this.setState({ nodeCo: Object.assign({}, s.nodeCo, { [pan.id]: on ? nCo.filter(c2 => c2 !== n2) : nCo.concat([n2]) }), akMsg: on ? n2 + ' ist nicht mehr beteiligt.' : n2 + ' ist beteiligt und sieht den Meilenstein in Meine Arbeit.' })); }) : [],
      nCoText: akKind === 'node' ? (nCo.length ? 'Beteiligt: ' + nCo.join(', ') + '. Außerdem alle Bearbeiter der Aufgaben darunter.' : 'Nur die Bearbeiter der Aufgaben darunter.') : ''
    };
    if (pan && pan.kind === 'task') {
      const x = TASK[pan.id], ts = this.taskStatus(x), ms = x.ms ? NODE[x.ms] : null;
      p = Object.assign(p, {
        isTask: true, isTaskD: ak.details, kindLabel: 'Aufgabe', title: x.title, chip: this.chip(ts, t, accent), dates: 'Fällig ' + fmt(D(x.due)) + '2026',
        crumbs: ms ? nodeCrumbs(ms.id).concat([{ label: ms.name, open: () => this.openNode(ms.id, pan.from) }]) : [{ label: x.proj, open: () => {} }],
        proj: x.proj, bucket: this.bucketName(x, this.bucketOf(x)), bucketBg: this.bucketColor(x, this.bucketOf(x)), prio: x.prio, prioBg: PRIO[x.prio], owner: this.ownerOf(x), desc: x.desc,
        hasMs: !!ms, msName: ms ? ms.name : '', msChip: ms ? this.chip(this.nodeStatus(ms), t, accent) : blankChip,
        openMs: () => ms && this.openNode(ms.id, pan.from), canJump: !!ms && !inPlanung, jump: () => ms && this.jumpTo(ms.id),
        doneLabel: this.isDone(x) ? 'Wieder öffnen' : 'Als erledigt markieren', toggleDone: () => this.toggleDone(x.id),
        ...(() => { const editable = !x.story && !x.kb, dn = this.isDone(x), propOpen = s.propOpen, bks = this.bucketsOf(this.pkOf(x)), curB = this.bucketOf(x);
          const lbs = (s.lbl || {})[x.id] || LBL_SEED[x.id] || [], setL = list => this.setState({ lbl: Object.assign({}, s.lbl, { [x.id]: list }) });
          const ck = (s.chk || {})[x.id] || (CHK_SEED[x.id] || []).map(([tt, d]) => ({ t: tt, d })), setC = list => this.setState({ chk: Object.assign({}, this.state.chk, { [x.id]: list }) }), nDone = ck.filter(c => c.d).length;
          const prop = (k, icon, label, value, dot, opts) => { const op = propOpen === k && !!opts; return { icon, label, value, dot: dot || 'transparent', dotDisp: dot ? 'inline-block' : 'none', open: op, openA: op ? 'true' : 'false', caret: opts ? (op ? '▴' : '▾') : '', cursor: opts ? 'pointer' : 'default',
            toggle: () => (opts ? this.setState({ propOpen: op ? null : k }) : null), opts: opts || [] }; };
          const L = s.lnk || LNK_SEED, LT = [['blockiert durch', 'blockiert'], ['blockiert', 'blockiert durch'], ['ist Vorgänger von', 'ist Nachfolger von'], ['ist Nachfolger von', 'ist Vorgänger von'], ['verwandt mit', 'verwandt mit'], ['Duplikat von', 'hat Duplikat']];
          const inv = ty => (LT.find(z => z[0] === ty) || [ty, ty])[1], lnkType = s.lnkType || 'blockiert durch', setL2 = obj => this.setState({ lnk: obj });
          const mine = (L[x.id] || []).map(([ty, o], i) => ({ ty, o, del: () => setL2(Object.assign({}, L, { [x.id]: (L[x.id] || []).filter((z, k) => k !== i) })) }));
          const theirs = []; Object.keys(L).forEach(k => (L[k] || []).forEach(([ty, o], i) => { if (o === x.id) theirs.push({ ty: inv(ty), o: k, del: () => setL2(Object.assign({}, L, { [k]: L[k].filter((z, j) => j !== i) })) }); }));
          const allL = mine.concat(theirs).filter(l => TASK[l.o]), blk = this.blockersOf(x.id), lq = (s.lnkQ || '').toLowerCase();
          const hits = lq.length >= 2 ? TASKS.filter(z => z.id !== x.id && !allL.some(l => l.o === z.id) && ((z.title || '').toLowerCase().indexOf(lq) >= 0 || this.kenn(z).toLowerCase().indexOf(lq) >= 0)).slice(0, 6) : [];
          const delAsk = s.delAsk === x.id;
          const lnkPart = { hasKid: true, kid: this.kenn(x), copyLink: () => { const url = (typeof location !== 'undefined' ? location.origin + location.pathname : '') + '#' + this.kenn(x); let ok = false; try { if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(url); ok = true; } } catch (er) { ok = false; } this.setState({ pMsg: ok ? 'Link kopiert: ' + url : 'Direkter Link: ' + url }); },
            lnks: allL.map(l => { const z = TASK[l.o], dn = this.isDone(z); return { type: l.ty, kid: this.kenn(z), title: z.title, strike: dn ? 'line-through' : 'none', color: /blockiert/.test(l.ty) ? (dn ? GREEN : RED) : accentText, open: () => this.openTask(z.id, pan.from), del: l.del }; }),
            lnkNone: allL.length === 0 && !s.lnkOpen, lnkOpen: !!s.lnkOpen, lnkBtn: s.lnkOpen ? 'Fertig' : '+ Verknüpfen', lnkToggle: () => this.setState({ lnkOpen: !s.lnkOpen, lnkQ: '' }),
            lnkBlocked: blk.length > 0, lnkBlockText: 'Blockiert durch ' + blk.map(o => this.kenn(TASK[o]) + ' „' + TASK[o].title + '“').join(', ') + '. Erst wenn das erledigt ist, kann es hier weitergehen.',
            lnkTypes: LT.filter(z => ['blockiert durch', 'blockiert', 'ist Vorgänger von', 'verwandt mit', 'Duplikat von'].includes(z[0])).map(([ty]) => ({ label: ty, pressed: lnkType === ty ? 'true' : 'false', ring: lnkType === ty ? accent : t.border, bg: lnkType === ty ? t.soft : t.surface, go: () => this.setState({ lnkType: ty }) })),
            lnkQ: s.lnkQ || '', setLnkQ: e => this.setState({ lnkQ: e && e.target ? e.target.value : '' }),
            lnkHits: hits.map(z => ({ kid: this.kenn(z), title: z.title, proj: z.proj, go: () => { setL2(Object.assign({}, L, { [x.id]: (L[x.id] || []).concat([[lnkType, z.id]]) })); this.logH('t:' + x.id, 'Verknüpfung', '', lnkType + ' ' + this.kenn(z)); this.setState({ lnkQ: '', pMsg: '„' + x.title + '“ ' + lnkType + ' „' + z.title + '“.' }); } })),
            delAsk, delIdle: !delAsk, delAskGo: () => this.setState({ delAsk: x.id }), delNo: () => this.setState({ delAsk: null }), delYes: () => this.trashTask(x.id) };
          return { ...lnkPart, hasDoneBtn: true, titleEdit: editable, titleStatic: !editable, setTitle: e => { const v = e && e.target ? e.target.value : x.title; if (!v.trim()) return; x.title = v; this.setState({ rev: (s.rev || 0) + 1 }); },
            doneA: dn ? 'true' : 'false', doneMark: dn ? '✓' : '', doneFill: dn ? GREEN : 'transparent', doneRing: dn ? GREEN : t.strong, doneStrike: dn ? 'line-through' : 'none',
            props: [prop('proj', '▣', 'Projekt', x.proj, PROJCOL[x.proj] || null, null),
              prop('bucket', '▤', 'Bucket', this.bucketName(x, curB), this.bucketColor(x, curB), editable ? bks.map(b => ({ label: b.name, dot: b.color, pressed: curB === b.key ? 'true' : 'false', ring: curB === b.key ? accent : t.border, go: () => { this.bucketTo(x.id, b.key); this.setState({ propOpen: null }); } })) : null),
              prop('priv', '🔒', 'Sichtbarkeit', x.priv ? 'Privat (nur ich)' : 'Normal', x.priv ? '#5C5C5C' : null, this.ownerOf(x) === 'Du' ? [[false, 'Normal'], [true, 'Privat (nur ich)']].map(([v0, l]) => ({ label: l, dot: v0 ? '#5C5C5C' : 'transparent', pressed: !!x.priv === v0 ? 'true' : 'false', ring: !!x.priv === v0 ? accent : t.border, go: () => { this.logH('t:' + x.id, 'Sichtbarkeit', x.priv ? 'privat' : 'normal', v0 ? 'privat' : 'normal'); x.priv = v0; this.setState({ rev: (s.rev || 0) + 1, propOpen: null, panelMsg: v0 ? 'Privat: Kollegen und Vorgesetzte sehen nur „🔒 privat“ und die Dauer.' : '' }); } })) : null),
              prop('prio', '⚑', 'Priorität', x.prio, PRIO[x.prio], Object.keys(PRIO).map(pr => ({ label: pr, dot: PRIO[pr], pressed: x.prio === pr ? 'true' : 'false', ring: x.prio === pr ? accent : t.border, go: () => { this.logH('t:' + x.id, 'Priorität', x.prio, pr); x.prio = pr; this.setState({ rev: (s.rev || 0) + 1, propOpen: null }); } })))],
            lbls: this.labelsOf(this.pkOf(x)).map(([k, l0, c]) => { const l = this.lblName(this.pkOf(x), k), on = lbs.includes(k), ed = !!s.lblEdit; return { label: (ed ? (on ? '✓ ' : '+ ') : '') + l, disp: on || ed ? 'inline-block' : 'none', pressed: on ? 'true' : 'false', ring: c, bg: on ? c : 'transparent', fg: on ? '#FFFFFF' : t.text, go: () => (ed ? setL(on ? lbs.filter(z => z !== k) : lbs.concat([k])) : this.setState({ lblEdit: true })) }; }),
            lblNone: !lbs.length && !s.lblEdit, lblBtn: s.lblEdit ? 'Fertig' : (lbs.length ? 'Ändern' : '+ Etikett'), lblToggle: () => this.setState({ lblEdit: !s.lblEdit }),
            chk: ck.map((c, i) => ({ text: c.t, checked: c.d ? 'true' : 'false', mark: c.d ? '✓' : '', fill: c.d ? GREEN : 'transparent', ring: c.d ? GREEN : t.strong, strike: c.d ? 'line-through' : 'none',
              toggle: () => setC(ck.map((z, k) => (k === i ? { t: z.t, d: !z.d } : z))), setText: e => setC(ck.map((z, k) => (k === i ? { t: e && e.target ? e.target.value : z.t, d: z.d } : z))),
              up: () => { if (!i) return; const o = ck.slice(); [o[i - 1], o[i]] = [o[i], o[i - 1]]; setC(o); }, del: () => setC(ck.filter((z, k) => k !== i)),
              ...(() => { const HS = [0.5, 1, 1.5, 2, 3, 4], h0 = c.h || 1, tid = c.task && TASK[c.task] ? c.task : null, inF = !!tid && this.bucketOf(TASK[tid]) === 'Fokus', fmtHh = v => v.toLocaleString('de-DE') + ' h';
                const patchC = p => setC(((this.state.chk || {})[x.id] || ck).map((z, k) => (k === i ? Object.assign({}, z, p) : z)));
                const ensure = () => { if (tid) return tid; const nid = this.quickTask({ title: c.t + ' (' + x.title + ')', proj: x.proj, due: x.due < '2026-11-13' ? '2026-11-13' : x.due, owner: 'Du', h: h0, bucket: 'Fokus' }); patchC({ task: nid }); return nid; };
                const SL = [['Früh 7:00', '2026-11-13', 7], ['Mittag 11:30', '2026-11-13', 11.5], ['Nachmittag 13:30', '2026-11-13', 13.5], ['Morgen 7:00', '2026-11-16', 7]];
                const planKey = 'ckp:' + x.id + ':' + i, pl = (this.state.ckPlan || {})[planKey];
                return { hLabel: fmtHh(h0), hCycle: () => { const nh = HS[(HS.indexOf(h0) + 1) % HS.length]; patchC({ h: nh }); if (tid) EST[tid] = nh; },
                  fokusIc: inF ? '★' : '☆', fokusFg: inF ? accent : t.muted, fokusBd: inF ? accent : t.border, fokusAria: inF ? 'Im Fokus (eigene Aufgabe). Klick nimmt ihn heraus.' : 'Diesen Punkt als eigene Aufgabe in den Fokus legen',
                  fokus: () => { if (inF) return this.toggleFocus(tid); const nid = ensure(); if (tid) this.toggleFocus(nid); this.setState({ pMsg: '„' + c.t + '“ liegt jetzt als eigene Aufgabe (' + fmtHh(h0) + ') in deinem Fokus.' }); },
                  planOpen: this.state.ckPlanOpen === planKey, planToggle: () => this.setState({ ckPlanOpen: this.state.ckPlanOpen === planKey ? null : planKey }), hasPlan: !!pl, planText: pl ? '🕘 eingeplant: ' + pl : '',
                  slots: SL.map(([lab, iso, st]) => ({ label: lab, go: () => { const nid = ensure(); const cur = ((this.state.dayPlan || {})[iso] || []).filter(p => p.id !== nid); let a0 = st; const clash = b => cur.some(p => b < p.start + p.h && b + h0 > p.start); while (clash(a0) && a0 + h0 <= 17) a0 += 0.5;
                    const hh = v => String(Math.floor(v)).padStart(2, '0') + ':' + (v % 1 ? '30' : '00'), when = (iso === '2026-11-13' ? 'heute ' : 'Mo 16.11. ') + hh(a0) + '–' + hh(a0 + h0);
                    this.setState({ dayPlan: Object.assign({}, this.state.dayPlan, { [iso]: cur.concat([{ id: nid, start: a0, h: h0 }]) }), ckPlan: Object.assign({}, this.state.ckPlan, { [planKey]: when }), ckPlanOpen: null, pMsg: '„' + c.t + '“ eingeplant: ' + when + (a0 !== st ? ' (nächste freie Zeit)' : '') + '. Steht in Mein Tag planen.' }); } })) }; })() })),
            chkHas: ck.length > 0, chkSum: ck.length ? nDone + ' von ' + ck.length + ' erledigt' : '', chkW: pct(ck.length ? nDone / ck.length * 100 : 0),
            chkNew: s.chkNew || '', setChkNew: e => this.setState({ chkNew: e && e.target ? e.target.value : '' }),
            chkAdd: () => { const tt = (this.state.chkNew || '').trim(); if (!tt) return; setC(ck.concat([{ t: tt, d: false }])); this.setState({ chkNew: '' }); } }; })()
      });
      // Warten auf: auf wen, warum, bis wann nachfassen
      const wcat = !x.story && !x.kb && this.catOf(x, this.bucketOf(x)) === 'wartet', w = s.wait[x.id];
      const WHO = Array.from(new Set((PMEMBERS[this.pkOf(x)] || []).map(m => m[0]).filter(n2 => n2 !== 'Du' && n2 !== 'Kunde').concat(['Kunde', 'Lieferant', 'Einkauf', 'Qualität'])));
      const wd = Object.assign({ who: w ? w.who : (/Lieferant|Angebot/.test(x.desc) ? 'Lieferant' : WHO[0]), until: w ? w.until : '18.11.' }, s.waitDraft[x.id] || {});
      const setWd = patch => () => this.setState({ waitDraft: Object.assign({}, s.waitDraft, { [x.id]: Object.assign({}, wd, patch) }) });
      const pk2 = (on, label, patch) => ({ label, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: setWd(patch) });
      const editing = !w || s.waitEdit === x.id;
      const cm = (COMMENTS[x.id] || []).concat(s.comments[x.id] || []);
      const mentionable = Array.from(new Set([this.ownerOf(x)].concat((PMEMBERS[this.pkOf(x)] || []).map(m => m[0])).filter(n2 => n2 !== 'Du' && n2 !== 'Kunde'))).slice(0, 3);
      const pkT = this.pkOf(x), inProjT = !!this.pnm(pkT) && x.proj === this.pnm(pkT), co = this.coOf(x), own = this.ownerOf(x);
      const memT = inProjT ? (PMEMBERS[pkT] || []).map(m => m[0]).filter(n2 => n2 !== 'Kunde') : [];
      const shareH = estOf0(x) / (1 + co.length);
      p = Object.assign(p, {
        dueIso: x.due, setDue: e => this.setDue(x.id, e && e.target ? e.target.value : ''),
        multiOk: inProjT, multiNo: !inProjT,
        ownPick: memT.map(n2 => ({ label: n2, pressed: own === n2 ? 'true' : 'false', ring: own === n2 ? accent : t.border, bg: own === n2 ? t.soft : t.surface, go: () => { if (own !== n2) { this.reassign(x.id, n2); this.setState({ coOv: Object.assign({}, this.state.coOv, { [x.id]: co.filter(c2 => c2 !== n2) }) }); } } })),
        coPick: memT.filter(n2 => n2 !== own).map(n2 => { const on = co.includes(n2); return { label: (on ? '✓ ' : '+ ') + n2, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface,
          go: () => this.setState({ coOv: Object.assign({}, this.state.coOv, { [x.id]: on ? co.filter(c2 => c2 !== n2) : co.concat([n2]) }), pMsg: on ? n2 + ' ist nicht mehr beteiligt.' : n2 + ' arbeitet mit und wird benachrichtigt. Im Projekt ohne Annahme.' }) }; }),
        coText: co.length ? 'Aufwand ' + estOf0(x).toLocaleString('de-DE') + ' h, gleich verteilt: je ' + (Math.round(shareH * 10) / 10).toLocaleString('de-DE') + ' h für ' + [own].concat(co).join(', ') + '. Verantwortlich bleibt ' + own + '.' : 'Nur ' + own + ' arbeitet daran. Weitere Personen mit + hinzufügen.',
        coOutside: 'Außerhalb eines Projekts hat eine Aufgabe eine Person; wer mithelfen soll, bekommt eine eigene Aufgabe (mit Annahme oder Freigabe).',
        waitShow: wcat || s.waitAsk === x.id, waitAskNow: s.waitAsk === x.id && !w, waitEditing: editing, waitHas: !!w && !editing,
        waitText: w ? 'Wartet auf ' + w.who + ' seit ' + w.since + (w.why ? ': „' + w.why + '“' : '') : '',
        waitSub: w ? (w.until && w.until !== 'ohne' ? 'Nachfassen am ' + w.until + '. Das Cockpit erinnert dich an dem Tag und kann ' + w.who + ' direkt anschreiben.' : 'Ohne Nachfass-Termin.') : '',
        waitWho: WHO.map(n2 => pk2(wd.who === n2, n2, { who: n2 })), waitUntil: ['16.11.', '18.11.', '20.11.', '27.11.', 'ohne'].map(d => pk2(wd.until === d, d === 'ohne' ? 'ohne Termin' : d, { until: d })),
        waitCmp: editing ? cmp('wt:' + x.id, { always: true, optional: true, title: 'Warum wartest du? (freiwillig, hilft beim Nachfassen)', ph: 'z. B. Angebot angefragt am 04.11., Rückmeldung zugesagt bis 11.11.', chips: ['Angebot', 'Freigabe', 'Zeichnung / Plan', 'Teile / Lieferung', 'Rückmeldung Kunde'], send: 'Speichern',
          onSend: v => this.setState({ wait: Object.assign({}, this.state.wait, { [x.id]: { who: wd.who, why: v || (w ? w.why : ''), until: wd.until, since: w ? w.since : '13.11.' } }), waitAsk: null, waitEdit: null, pMsg: wd.who + ' sieht in der Aufgabe, dass du wartest.' }) }) : noCmp,
        waitChange: () => this.setState({ waitEdit: x.id }), waitNudge: () => this.setState({ pMsg: 'Nachricht an ' + (w ? w.who : '') + ' gesendet: „Kurze Erinnerung: ' + x.title + '. Wie ist der Stand?“ Steht auch unten im Verlauf.', comments: Object.assign({}, s.comments, { [x.id]: (s.comments[x.id] || []).concat([['Du', 'gerade eben', 'Erinnerung an ' + (w ? w.who : '') + ': Wie ist der Stand?']]) }) }),
        comments: cm.map(([who, when, text]) => ({ who, when, text, ini: ini(who), av: AV[who] || '#5C5C5C' })), hasComments: cm.length > 0, cmCount: cm.length ? '(' + cm.length + ')' : '',
        cmCmp: cmp('cm:' + x.id, { always: true, title: 'Kommentar oder Nachricht', ph: 'Schreiben … @ benachrichtigt Personen und Teams', chips: mentionable.map(n2 => '@' + n2), send: 'Senden', err: 'Bitte etwas schreiben.',
          onSend: v => this.setState({ comments: Object.assign({}, this.state.comments, { [x.id]: (this.state.comments[x.id] || []).concat([['Du', 'gerade eben', v]]) }), pMsg: /@/.test(v) ? 'Gesendet. Erwähnte Personen bekommen eine Nachricht im Posteingang.' : 'Kommentar gespeichert. Alle Beteiligten sehen ihn an der Aufgabe.' }) }),
        hasPMsg: !!s.pMsg, pMsgText: s.pMsg || ''
      });
    } else if (pan && pan.kind === 'node') {
      const n = NODE[pan.id], ns = this.nodeStatus(n), gr0 = s.gateRes[n.id];
      const GATE_CHIP = { ok: { label: '✓ Bestanden', bg: GREEN, fg: '#FFFFFF', bd: GREEN }, auflage: { label: '✓ Bestanden mit Auflage', bg: '#FFF4CE', fg: '#5C4300', bd: '#C19C00' }, nein: { label: '✗ Nicht bestanden', bg: RED, fg: '#FFFFFF', bd: RED } };
      const GATE_DEF = {
        ok: { label: 'Bestanden', title: 'Kommentar fürs Gate-Protokoll (freiwillig)', optional: true, chips: ['Alle Punkte erfüllt', 'Protokoll liegt in Dokumente'], send: 'Bestanden speichern' },
        auflage: { label: 'Mit Auflage bestanden', title: 'Auflage: was, bis wann, wer?', chips: ['bis 20.11.', 'bis 27.11.', 'Verantwortlich: ' + n.owner, 'Nachweis im Gate-Protokoll'], send: 'Mit Auflage bestehen', err: 'Bitte die Auflage beschreiben.' },
        nein: { label: 'Nicht bestanden', title: 'Begründung und was bis zum Nachtermin passieren muss', chips: ['Nachtermin in 2 Wochen', 'Punkte aus der Checkliste offen', 'Kunde nicht einverstanden'], send: 'Nicht bestanden speichern', err: 'Bitte begründen, damit das Team weiß, was fehlt.' } };
      const gOpen = Object.keys(GATE_DEF).find(k => s.cmpOpen === 'gt:' + n.id + ':' + k);
      const hasKidsN = !!(n.children && n.children.length);
      const isMsN = n.kindLabel === 'Meilenstein' || (n.type === 'gate' && n.msPoint), isPt = n.type === 'gate';
      const msTo = rangeOn => { const P0 = NODE[PARENT[n.id]]; if (rangeOn) { let st = this.isoAdd(n.end, -7); if (P0 && st < P0.start) st = P0.start; Object.assign(n, { type: 'ms', msPoint: false, start: st, children: n.children || [], kindLabel: 'Meilenstein' }); }
        else { Object.assign(n, { type: 'gate', msPoint: true, start: n.end, kindLabel: 'Meilenstein' }); delete n.children; }
        this.setState({ rev: (this.state.rev || 0) + 1, akMsg: rangeOn ? '„' + n.name + '“ hat jetzt einen Zeitraum: ' + fmt(D(n.start)) + ' bis ' + fmt(D(n.end)) + '. Beginn und Ende darunter ändern.' : '„' + n.name + '“ ist jetzt ein Termin am ' + fmt(D(n.end)) + '.' }); };
      const depsN = this.depsOf(), predsN = (depsN[n.id] || []).filter(id => NODE[id]), succN = Object.keys(depsN).filter(k => (depsN[k] || []).includes(n.id) && NODE[k]);
      const ancOf = (a, b) => { let x = PARENT[b]; while (x) { if (x === a) return true; x = PARENT[x]; } return false; };
      const poolN = this.projNodes(n.id).filter(x => x.id !== n.id && !predsN.includes(x.id) && !ancOf(x.id, n.id) && !ancOf(n.id, x.id) && !this.dependsOn(x.id, n.id, depsN)).sort((a, b) => (a.end < b.end ? -1 : 1));
      const setDeps = (nd, msg) => { const pm = (nd[n.id] || []).map(pid => this.pushNote(pid, nd)).join(''); this.setState({ deps: nd, rev: (this.state.rev || 0) + 1, akMsg: msg + pm }); };
      Object.assign(p, { depPreds: predsN.map(id => ({ label: NODE[id].name + ' (' + (NODE[id].type === 'gate' ? fmt(D(NODE[id].end)) : 'bis ' + fmt(D(NODE[id].end))) + ')', rm: 'Abhängigkeit von ' + NODE[id].name + ' entfernen', go: () => setDeps(Object.assign({}, depsN, { [n.id]: predsN.filter(x => x !== id) }), 'Abhängigkeit entfernt.') })),
        noPreds: !predsN.length, depSuccs: succN.map(id => ({ label: NODE[id].name, go: () => this.openNode(id, 'planung') })), hasSuccs: succN.length > 0,
        depOpen: s.depOpen === n.id, depToggle: () => this.setState({ depOpen: s.depOpen === n.id ? null : n.id }), depBtn: s.depOpen === n.id ? 'Fertig' : '+ Vorgänger',
        depPool: poolN.slice(0, 14).map(x => ({ label: (x.type === 'phase' ? '▭ ' : (x.type === 'gate' ? (x.msPoint ? '◆ ' : '▣ ') : '▬ ')) + x.name, go: () => setDeps(Object.assign({}, depsN, { [n.id]: predsN.concat([x.id]) }), '„' + n.name + '“ beginnt jetzt nach „' + x.name + '“.') })) });
      Object.assign(p, { msModeShow: isMsN && !hasKidsN, msModes: [[true, '◆ Termin (Stichtag)'], [false, '▬ Zeitraum (von–bis)']].map(([pt, l]) => ({ label: l, pressed: isPt === pt ? 'true' : 'false', ring: isPt === pt ? accent : t.border, bg: isPt === pt ? t.soft : t.surface, go: () => { if (isPt !== pt) msTo(!pt); } })),
        nodeDateEdit: !hasKidsN, nodeDateFixed: hasKidsN, nodeIsPoint: n.type === 'gate', nodeStartIso: n.start, nodeEndIso: n.end, notPoint: n.type !== 'gate',
        setNodeStart: e => this.setNodeDate(n.id, 'start', e && e.target ? e.target.value : ''), setNodeEnd: e => this.setNodeDate(n.id, 'end', e && e.target ? e.target.value : '') });
      const isGate = n.type === 'gate' && !n.msPoint;
      if (isGate) Object.assign(p, {
        gatePack: () => { this.setState({ akMsg: 'Gate-Unterlagen werden erzeugt …' }); this.pptGate(n.id, t, accent).then(() => this.setState({ akMsg: 'Gate-Unterlagen heruntergeladen: Checkliste, Stand bis zum Gate, offene Punkte, Risiken, Entscheidungsvorlage mit Empfehlung und Protokollvorlage. Die Entscheidung trägst du danach hier unter „Gate-Entscheidung“ ein.' })).catch(e => this.setState({ akMsg: 'Fehler: ' + (e && e.message ? e.message : e) })); },
        isGate: true, gateHas: !!gr0, gateLabel: gr0 ? GATE_CHIP[gr0.r].label : '', gateWho: gr0 ? gr0.by + ', ' + gr0.when : '', gateText: gr0 && gr0.text ? '„' + gr0.text + '“' : '',
        gateShowBtns: !gr0 && !gOpen, gateBtns: Object.keys(GATE_DEF).map(k => ({ label: GATE_DEF[k].label, bg: k === 'ok' ? GREEN : (k === 'nein' ? t.surface : t.surface), fg: k === 'ok' ? '#FFFFFF' : t.text, bd: k === 'ok' ? GREEN : (k === 'nein' ? RED : '#C19C00'), go: openCmp('gt:' + n.id + ':' + k) })),
        gateCmp: gOpen ? cmp('gt:' + n.id + ':' + gOpen, Object.assign({}, GATE_DEF[gOpen], { onSend: v => {
          if (gOpen !== 'nein') n.done = true;
          let extra = '';
          if (gOpen === 'auflage') { const pk = this.pkOfNode(n.id), tid = 'tauf' + Object.keys(this.state.gateRes).length + n.id; const own = ['Geschäftsführung', 'Kunde'].includes(n.owner) ? 'Du' : n.owner;
            const tk = { id: tid, title: 'Auflage ' + n.name.split(':')[0] + ': ' + v.slice(0, 60), proj: this.pnm(pk), due: '2026-11-27', bucket: 'Fokus', prio: 'Hoch', owner: own, mine: own === 'Du', ms: n.id, desc: 'Auflage aus der Gate-Entscheidung vom 13.11.: ' + v };
            TASKS.push(tk); TASK[tid] = tk; n.tasks = (n.tasks || []).concat([tid]); extra = ' Die Auflage steht als Aufgabe bei ' + (own === 'Du' ? 'dir' : own) + '.'; }
          this.setState({ rev: (this.state.rev || 0) + 1, gateRes: Object.assign({}, this.state.gateRes, { [n.id]: { r: gOpen, text: v, by: 'Du', when: '13.11.' } }), mvMsg: n.name + ': ' + GATE_CHIP[gOpen].label.replace(/^[✓✗] /, '') + '.' + extra });
        } })) : noCmp,
        gateNote: 'Bestanden: Gate grün. Mit Auflage: bestanden, die Auflage wird eine Aufgabe mit Termin. Nicht bestanden: Gate bleibt offen, das Team sieht die Begründung.',
        gateReset: () => { const o = Object.assign({}, s.gateRes); delete o[n.id]; n.done = false; this.setState({ gateRes: o, rev: (s.rev || 0) + 1 }); } });
      const kids = (n.children || []).map(k => ({ icon: k.msPoint ? '◆' : (k.type === 'gate' ? '◈' : '▭'), name: k.name, date: fmt(D(k.end)), chip: this.chip(this.nodeStatus(k), t, accent), open: () => this.openNode(k.id, pan.from) }));
      const tks = (n.tasks || []).map(id => { const x = TASK[id], ts = this.taskStatus(x); return { title: x.title, chip: this.chip(ts, t, accent), dueLabel: this.dueLabel(x), strike: ts === 'erledigt' ? 'line-through' : 'none', open: () => this.openTask(id, pan.from) }; });
      const items = (n.children || []).map(k => this.nodeStatus(k) === 'erledigt').concat((n.tasks || []).map(id => this.isDone(TASK[id])));
      const nPk = this.pkOfNode(n.id), nProj = this.pnm(nPk), nMem = uniqA(['Du'].concat((PMEMBERS[nPk] || []).map(m => m[0]).filter(m => m !== 'Kunde'))), ntW = nMem.includes(s.ntWho) ? s.ntWho : (nMem.includes(n.owner) ? n.owner : 'Du');
      const loose = TASKS.filter(x => x.proj === nProj && !x.ms && !x.story && !x.kb && !this.isDone(x) && !(n.tasks || []).includes(x.id)).slice(0, 6);
      const linkTask = (id, msg) => { const x = TASK[id]; Object.values(NODE).forEach(o => { if (o.tasks && o.id !== n.id) o.tasks = o.tasks.filter(z => z !== id); }); x.ms = n.id; n.tasks = (n.tasks || []).concat([id]); this.setState({ rev: (this.state.rev || 0) + 1, akMsg: msg }); };
      const ntAddF = () => { const tt = (this.state.ntText || '').trim(); if (!tt) return this.setState({ akMsg: 'Erst einen Titel eingeben.' }); const due = (this.state.ntDueBy || {})[n.id] || n.end;
        const id = this.quickTask({ title: tt, proj: nProj, owner: ntW, due, ms: n.id }); n.tasks = (n.tasks || []).concat([id]);
        this.setState({ ntText: '', akMsg: '„' + tt + '“ angelegt' + (ntW !== 'Du' ? ' für ' + ntW + ', ohne Annahme (im Projekt)' : '') + ', fällig ' + fmt(D(due)) + ' Zählt jetzt in den Fortschritt von „' + n.name + '“.' + (due > n.end ? ' Achtung: liegt nach dem Ende des ' + (n.kindLabel || 'Meilensteins') + '.' : '') }); };
      const nDone = items.filter(Boolean).length;
      p = Object.assign(p, {
        isNode: true, isNodeD: ak.details, titleEdit: !n.pd, titleStatic: !!n.pd, hasDoneBtn: false, doneStrike: 'none', setTitle: e => { const v = e && e.target ? e.target.value : n.name; if (!v.trim()) return; n.name = v; this.setState({ rev: (s.rev || 0) + 1 }); }, kindLabel: n.kindLabel || KIND[n.type], title: n.name, chip: gr0 ? GATE_CHIP[gr0.r] : this.chip(ns, t, accent),
        dates: n.type === 'gate' ? 'Termin ' + fmt(D(n.end)) : fmt(D(n.start)) + ' – ' + fmt(D(n.end)),
        crumbs: nodeCrumbs(n.id), owner: n.owner,
        progress: items.length ? Math.round(nDone / items.length * 100) + ' % (' + nDone + ' von ' + items.length + ')' : (ns === 'erledigt' ? '100 %' : 'noch nicht begonnen'),
        noTasks: tks.length === 0, tkSum: tks.length ? tks.filter(z => z.strike !== 'none').length + ' von ' + tks.length + ' erledigt' : '',
        ntText: s.ntText || '', setNtText: e => this.setState({ ntText: e && e.target ? e.target.value : '' }), ntDue: (s.ntDueBy || {})[n.id] || n.end, setNtDue: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) this.setState({ ntDueBy: Object.assign({}, this.state.ntDueBy, { [n.id]: v }) }); },
        ntWho: nMem.slice(0, 7).map(m => ({ name: m, short: m === 'Du' ? 'ich' : m.split(' ').pop(), ini: ini(m), av: AV[m] || accent, pressed: ntW === m ? 'true' : 'false', ring: ntW === m ? accent : t.border, go: () => this.setState({ ntWho: m }) })),
        kidsShow: n.type === 'phase' || n.type === 'ms' || kids.length > 0, noKids: kids.length === 0, kidsTitle: n.type === 'phase' ? 'Arbeitspakete, Meilensteine und Gates' : 'Untermeilensteine und Gates', kidsSum: kids.length ? kids.filter(k => k.chip.label === '✓ Erledigt' || /erledigt/i.test(k.chip.label)).length + ' von ' + kids.length + ' erledigt' : '',
        ...(() => { const nk = s.nkKind || 'ms', nkS = (s.nkStartBy || {})[n.id] || n.start, nkE = (s.nkEndBy || {})[n.id] || n.end, nkW = nMem.includes(s.nkWho) ? s.nkWho : (nMem.includes(n.owner) ? n.owner : 'Du');
          const KINDS = [['ms', '◆', 'Meilenstein (Termin)'], ['msr', '▬', 'Meilenstein (von–bis)'], ['gate', '▣', 'Quality Gate'], ['ap', '▭', 'Arbeitspaket']], rng = nk === 'ap' || nk === 'msr';
          const setBy = (key, v) => this.setState({ [key]: Object.assign({}, this.state[key], { [n.id]: v }) });
          return { nkKinds: KINDS.map(([k, ic, l]) => ({ icon: ic, label: l, pressed: nk === k ? 'true' : 'false', ring: nk === k ? accent : t.border, bg: nk === k ? t.soft : t.surface, go: () => this.setState({ nkKind: k }) })),
            nkName: s.nkName || '', setNkName: e => this.setState({ nkName: e && e.target ? e.target.value : '' }), nkPh: ({ ms: 'z. B. Grundgestell ausgerichtet', msr: 'z. B. Mechanik montiert', gate: 'z. B. Abnahme Montage', ap: 'z. B. Pneumatik verschlauchen' })[nk],
            nkIsAp: rng, nkIsGate: nk === 'gate', nkStart: nkS, nkEnd: nkE, nkDateLabel: rng ? 'Ende' : 'Termin', setNkStart: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) setBy('nkStartBy', v); }, setNkEnd: e => { const v = e && e.target ? e.target.value : ''; if (/^\d{4}-\d\d-\d\d$/.test(v)) setBy('nkEndBy', v); },
            nkWhoLabel: nk === 'gate' ? 'Entscheidet' : 'Verantwortlich', nkWho: nMem.concat(nk === 'gate' ? ['Geschäftsführung'] : []).slice(0, 8).map(m => ({ name: m, short: m === 'Du' ? 'ich' : m.split(' ').pop(), ini: ini(m), av: AV[m] || '#5C5C5C', pressed: nkW === m ? 'true' : 'false', ring: nkW === m ? accent : t.border, go: () => this.setState({ nkWho: m }) })),
            nkBtn: ({ ms: 'Meilenstein anlegen', msr: 'Meilenstein anlegen', gate: 'Gate anlegen', ap: 'Arbeitspaket anlegen' })[nk],
            nkAdd: () => { const name = (this.state.nkName || '').trim(); if (!name) return this.setState({ akMsg: 'Erst einen Namen eingeben.' }); if (rng && nkE < nkS) return this.setState({ akMsg: 'Das Ende liegt vor dem Beginn.' });
              const id = 'nk' + (s.rev || 0) + '_' + Object.keys(NODE).length, kl = ({ ms: 'Meilenstein', msr: 'Meilenstein', gate: 'Quality Gate', ap: 'Arbeitspaket' })[nk];
              const c = { id, name, type: rng ? 'ms' : 'gate', start: rng ? nkS : nkE, end: nkE, owner: nkW, tasks: [], done: false, kindLabel: kl, msPoint: nk === 'ms', checks: nk === 'gate' ? ['Checkliste vollständig', 'Dokumente freigegeben', 'Offene Punkte bewertet'] : [] };
              if (rng) c.children = [];
              n.children = (n.children || []).concat([c]); NODE[id] = c; PARENT[id] = n.id;
              const fitM = this.fitInto(c, n) + this.autoDep(id);
              this.setState({ rev: (s.rev || 0) + 1, nkName: '', akMsg: kl + ' „' + name + '“ unter „' + n.name + '“ angelegt, ' + (rng ? fmt(D(c.start)) + ' bis ' + fmt(D(c.end)) : 'Termin ' + fmt(D(c.end))) + '. Steht sofort im Gantt' + (nkW !== 'Du' ? ', ' + nkW + ' ist benachrichtigt' : '') + '.' + fitM }); } }; })(),
        ntAdd: ntAddF, ntHasLoose: loose.length > 0, ntLoose: loose.map(x => ({ label: x.title, title: x.title + ' · fällig ' + fmt(D(x.due)) + ' · ' + this.ownerOf(x), go: () => linkTask(x.id, '„' + x.title + '“ gehört jetzt zu „' + n.name + '“.') })),
        kids, hasKids: kids.length > 0, shiftBtns: [['◀ 1 Woche früher', 'move', -7], ['1 Woche später ▶', 'move', 7]].concat(n.type !== 'gate' ? [['Start +1 Woche (kürzer)', 'start', 7], ['Ende −1 Woche (kürzer)', 'end', -7], ['Ende +1 Woche (länger)', 'end', 7]] : []).map(([label, md, d]) => ({ label, go: () => this.shiftNode(n.id, md, d) })), tasks: tks, hasTasks: tks.length > 0, canJump: !inPlanung, jump: () => this.jumpTo(n.id)
      });
    } else if (pan && pan.kind === 'crs') {
      p = Object.assign(p, { isCrList: true, kindLabel: 'SM42 Schraubstation', title: 'Change Requests', crumbs: [{ label: 'SM42 Schraubstation', open: () => this.openProject('sm42') }] });
    } else if (pan && pan.kind === 'cr' && crCur) {
      p = Object.assign(p, { isCr: true, kindLabel: 'Change Request ' + crCur.id, title: crCur.title, crumbs: [{ label: 'Change Requests', open: () => this.setState({ panel: { kind: 'crs', id: 'crs', from: 'planung' } }) }] });
    } else if (pan && pan.kind === 'story') {
      const st2 = STORIES[pan.id], a = s.acs[pan.id], status = st2.sprint === 4 ? s.sst[pan.id] : (s.plan5.includes(pan.id) ? 'Sprint 5 geplant' : 'Product Backlog');
      p = Object.assign(p, {
        isStory: true, kindLabel: 'User Story · ' + st2.key, title: st2.title,
        chip: status === 'Done' ? { label: '✓ Done', bg: GREEN, fg: '#FFFFFF', bd: GREEN } : { label: status, bg: t.surface, fg: t.text, bd: t.strong },
        dates: st2.sprint === 4 ? 'Sprint 4 · 02.11.–13.11.' : '',
        crumbs: [{ label: 'Retrofit Linie 2', open: () => this.openProject('rl2') }, { label: 'Epic ' + st2.epic, open: () => this.setState({ sview: 'backlog' }) }],
        role: st2.role, goal: st2.goal, benefit: st2.benefit, epic: st2.epic, mo: st2.mo, sp: st2.sp + ' SP', owner: st2.owner,
        acCount: a.filter(Boolean).length + '/' + a.length, noAc: st2.ac.length === 0,
        acs: st2.ac.map((text, i) => ({ text, pressed: a[i] ? 'true' : 'false', mark: a[i] ? '✓' : '', bg: a[i] ? GREEN : 'transparent', bd: a[i] ? GREEN : t.strong, strike: a[i] ? 'line-through' : 'none',
          toggle: () => { const acs = Object.assign({}, s.acs); acs[pan.id] = a.slice(); acs[pan.id][i] = !a[i]; this.setState({ acs, boardMsg: '' }); } }))
      });
    } else if (pan && pan.kind === 'vnode') {
      const v = VNODE[pan.id], stv = this.vStatus(v), pr = VNODE[v.pair], done = v.kids.filter(k => k[2]).length;
      p = Object.assign(p, {
        isVnode: true, kindLabel: 'V-Ebene', title: v.name, chip: this.chip(stv, t, accent), dates: fmt(D(v.start)) + D(v.start).getFullYear() + ' – ' + fmt(D(v.end)) + D(v.end).getFullYear(),
        crumbs: [{ label: 'Prüfstand Drehmoment', open: () => this.openProject('pd') }], owner: v.owner,
        progress: Math.round(done / v.kids.length * 100) + ' % (' + done + ' von ' + v.kids.length + ')',
        kidsTitle: v.side === 'R' ? 'Testfälle' : 'Untermeilensteine und Arbeitspakete',
        kids: v.kids.map(([name, date, ok]) => ({ name, date: fmt(D(date)), chip: this.chip(ok ? 'erledigt' : (D(date) < TODAY ? 'ueberfaellig' : 'plan'), t, accent) })),
        pairLabel: v.side === 'R' ? 'Verifiziert die Ebene' : (v.side === 'B' ? 'Wird geprüft durch' : 'Wird verifiziert durch'),
        pairName: pr.name, coverage: 'Abdeckung ' + (v.side === 'R' ? v.cov : pr.cov) + ' %',
        openPair: () => this.setState({ panel: { kind: 'vnode', id: pr.id, from: 'vmodel' } })
      });
    } else if (pan && pan.kind === 'wissen') {
      const w = WK[pan.id], hp = !!s.wHelp[w.id];
      p = Object.assign(p, {
        isWissen: true, kindLabel: w.cat + (w.kind ? (w.kind === 'gut' ? ' · lief gut' : ' · verbessern') : ''), title: w.title,
        chip: { label: w.cat, bg: W_CAT[w.cat], fg: '#FFFFFF', bd: W_CAT[w.cat] }, dates: w.date,
        crumbs: [{ label: 'Wissen', open: () => this.setState({ screen: 'wissen', panel: null }) }],
        origin: w.origin, owner: w.author,
        wtags: w.tags.map(tg => ({ label: tg, go: () => this.setState({ screen: 'wissen', wtag: tg }) })),
        wfields: w.f.map(([label, text]) => ({ label, text })),
        helpPressed: hp ? 'true' : 'false', helpLabel: (hp ? '✓ Hilfreich ' : 'Hilfreich ') + (w.help + (hp ? 1 : 0)),
        helpBtn: hp ? { bg: GREEN, fg: '#FFFFFF', bd: GREEN } : { bg: t.surface, fg: t.text, bd: t.strong },
        toggleHelp: () => { const h = Object.assign({}, s.wHelp); h[w.id] = !h[w.id]; this.setState({ wHelp: h }); },
        adoptLabel: w.cat === 'Vorlage' ? 'In Projekt übernehmen' : 'Als Aufgabe übernehmen',
        adopt: () => { if (w.cat === 'Vorlage') { if ((s.userTpl || []).some(u2 => u2.name === w.title)) return this.setState({ wMsg: '„' + w.title + '“ steht schon unter „+ Neues Projekt“.' });
            this.setState({ userTpl: (s.userTpl || []).concat([{ key: 'utw' + (s.userTpl || []).length, name: w.title, stufe: 2, model: 'Wasserfall', from: null, nodes: [], base: /Sondermaschine/.test(w.title) ? 'sm' : (/Inbetriebnahme/.test(w.title) ? 'ibn' : null) }]), wMsg: '„' + w.title + '“ steht ab jetzt als Vorlage unter Projekte › „+ Neues Projekt“.' }); return; }
          const id = this.quickTask({ title: 'Lesson anwenden: ' + w.title, proj: 'SM42 Schraubstation', due: '2026-11-27' });
          this.setState({ wMsg: 'Als Aufgabe in SM42 angelegt (Backlog, fällig 27.11.): „Lesson anwenden: ' + w.title + '“.', wLastTask: id }); },
        canJump: !!w.okey, jump: () => w.okey && this.openProject(w.okey)
      });
    } else if (pan && pan.kind === 'new') {
      p = Object.assign(p, { isNew: true, kindLabel: 'Neu', title: s.nt.ctx && PNAME_OF[s.nt.ctx] ? 'Neu in ' + PNAME_OF[s.nt.ctx] : 'Neu anlegen', dates: s.nt.ctx && PNAME_OF[s.nt.ctx] ? 'Aufgabe, Meilenstein, Quality Gate oder Phase' : 'Aufgabe, Projekt oder Projektantrag' });
    } else if (pan && pan.kind === 'settings') {
      p = Object.assign(p, { isSettings: true, kindLabel: 'Projekteinstellungen', title: set.title, crumbs: [{ label: PJS.name, open: () => (SKU ? this.setState({ panel: null }) : this.openProject(SK)) }] });
    }

    return {
      t, accent, accentText, rowH, tr, nav, is, other: { title: o[0], text: o[1] },
      langs: LANGS.map(([k, label, title]) => ({ label, title, pressed: s.lang === k ? 'true' : 'false', bg: s.lang === k ? t.surface : 'transparent', fg: s.lang === k ? t.text : t.muted, go: () => this.setState({ lang: k }) })),
      langBtn, langDe: s.lang === 'de' ? 'true' : 'false', langEn: s.lang === 'en' ? 'true' : 'false',
      setDe: () => this.setState({ lang: 'de' }), setEn: () => this.setState({ lang: 'en' }),
      hasOverdue: overdueCount > 0, overdueCount, hasUnread: unreadCount > 0, unreadCount,
      counters, groups, filterHint,
      ibl: Object.assign(ibl, { kiCount: String(DRAFTS.length) }), dashX, dashLayouts, dashReset, editDash: s.editDash, toggleEdit: () => this.setState({ editDash: !s.editDash }), editBtn, wBorder, palette, focus, inboxPreview, inTab, inTabs, inOpenCls: s.inOpen ? 'open' : '', inClose: () => this.setState({ inOpen: false }), myLoad, loadLine, week,
      inboxFilters, inboxList, ib, gateChecks, timesheet, criteria,
      teamTabs, tm, kws: KWS,
      mx: (() => { const TM = { analyse: 'risk', risiken: 'risk', zeiten: 'zeit', kapazitaet: 'res', status: 'status', opl: 'opl', abschluss: 'close', aenderungen: 'cr', verlauf: 'audit' };
        if (s.screen === 'pn' && s.upSel) { const U0 = (s.uprojs || []).find(u => u.key === s.upSel); if (U0) { const ps0 = Object.assign({ stufe: U0.stufe, mods: U0.mods || {} }, (s.psetBy || {})[U0.key] || {}); return this.modX(U0.key, TM[s.upTab] || '', t, accent, k => { const m = P_MODS.find(x => x[0] === k); return ps0.mods && ps0.mods[k] !== undefined ? ps0.mods[k] : (m ? m[2] <= ps0.stufe : true); }); } }
        return this.modX(s.screen === 'projekt' ? s.proj : null, TM[s.ptab] || '', t, accent, modC); })(),
      mbr: this.memberUI(OVK, t, accent, modC('raci')), projects: projectsAll, ...(() => { const sp = this.tabSplit(ptabs.filter(x => x.show !== false)); return { ptabs: sp.main, ptMore: sp }; })(), pnw, pn, pt, msCounters, nextMs, projOverdue, team, board,
      members, raciCols: PRACI[OVK].cols, raciRows, akv, akvBtn, akvIsTable: s.akv === 'tabelle' ? 'true' : 'false', akvIsDiagram: s.akv === 'diagramm' ? 'true' : 'false',
      akvShowTable: s.akv === 'tabelle', akvShowDiagram: s.akv === 'diagramm',
      akvTable: () => this.setState({ akv: 'tabelle' }), akvDiagram: () => this.setState({ akv: 'diagramm' }),
      anfHint: (n0 => ({ has: n0 > 0, label: n0 + (n0 === 1 ? ' Aufgaben-Anfrage wartet' : ' Aufgaben-Anfragen warten') + ' im Posteingang', go: () => this.setState({ screen: 'eingang', anfOpen: true, panel: null }) }))(reqMe.filter(q2 => q2.acts.length).length),
      anfBox: (n0 => ({ open: s.anfOpen !== false, openA: s.anfOpen !== false ? 'true' : 'false', icon: s.anfOpen !== false ? '▾' : '▸', bg: s.anfOpen !== false ? t.soft : t.surface, count: n0 ? n0 + ' offen' : 'nichts offen', toggle: () => this.setState({ anfOpen: s.anfOpen === false }) }))(reqMe.filter(q2 => q2.acts.length).length),
      arb: (() => { const hid = s.arbHide || {}, vis = ARB_T.filter(x => !hid[x[0]]).map(x => x[0]), cur = vis.includes(s.arbTab) ? s.arbTab : 'aufgaben';
        return { tag: cur === 'tag', aufgaben: cur === 'aufgaben', fokus: cur === 'fokus', anfragen: false, besprechung: cur === 'besprechung', fokusInline: cur === 'aufgaben' && !!hid.fokus,
          cfgOpen: !!s.arbCfg, cfgToggle: () => this.setState({ arbCfg: !s.arbCfg }),
          opts: ARB_T.filter(x => x[3]).map(([k, ic, l]) => { const on = !hid[k]; return { label: (on ? '✓ ' : '+ ') + l, pressed: on ? 'true' : 'false', ring: on ? accent : t.border, bg: on ? t.soft : t.surface, go: () => this.setState({ arbHide: Object.assign({}, this.state.arbHide, { [k]: on }) }) }; }) }; })(), mt, ntf,
      arbTabs: ARB_T.filter(x => !(s.arbHide || {})[x[0]]).map(([k, icon, label]) => { const vis2 = ARB_T.filter(x => !(s.arbHide || {})[x[0]]).map(x => x[0]), cur2 = vis2.includes(s.arbTab) ? s.arbTab : 'aufgaben', on = cur2 === k, n2 = k === 'fokus' ? TASKS.filter(x => x.mine && this.bucketOf(x) === 'Fokus' && !this.isDone(x)).length : 0;
        return { icon, label, sel: on ? 'true' : 'false', bg: on ? t.surface : 'transparent', fg: on ? t.text : t.muted, sh: on ? '0 1px 2px rgba(0,0,0,0.12)' : 'none', hasBadge: n2 > 0, badge: String(n2), go: () => this.setState({ arbTab: k }) }; }),
      imp, crx, crd1, chat, trs: (tl => ({ count: tl.length ? '(' + tl.length + ')' : '', open: !!s.trashOpen, openA: s.trashOpen ? 'true' : 'false', bg: s.trashOpen ? t.soft : t.surface, toggle: () => this.setState({ trashOpen: !s.trashOpen, trMsg: '' }),
        hasMsg: !!s.trMsg, msg: s.trMsg || '', empty: tl.length === 0,
        items: tl.map(e => { const x = TASK[e.id] || { title: e.id, proj: '' }; return { kid: x.kid || '', title: x.title, sub: x.proj + ' · gelöscht ' + e.when + ' von ' + (e.by === 'Du' ? 'dir' : e.by) + ' · noch 30 Tage', restore: () => this.restoreTask(e.id), purge: () => this.setState({ trash: this.state.trash.filter(z => z.id !== e.id), trMsg: '„' + x.title + '“ endgültig gelöscht.' }) }; }) }))(s.trash || []),
      ko, km, sr, pw, dr, ak: Object.assign(ak, { ppl: mkPpl(ak.nOwn || [], ak.nCo || [], ak.nCoText || '', 'n') }), docs, log, budget, hours, invoices, finSum, dy, ovw, ovx, tp, kiAd, weekHasMsg: !!s.weekMsg, weekMsg: s.weekMsg || '',
      bl: (() => { const all = Object.values(NODE).filter(n => blMap[n.id]), moved = all.filter(n => dd(D(blMap[n.id][1]), D(n.end)) !== 0), late = moved.filter(n => dd(D(blMap[n.id][1]), D(n.end)) > 0), mx = moved.reduce((m0, n) => Math.max(m0, dd(D(blMap[n.id][1]), D(n.end))), 0);
        return { onA: blOn ? 'true' : 'false', ring: blOn ? accent : t.border, btn: blOn ? '▬ Baseline an' : '▬ Baseline aus', toggle: () => this.setState({ blOn: !blOn }),
          text: blCur ? 'Baseline vom ' + blCur.date + ': ' + (moved.length ? moved.length + ' Termine verschoben, ' + late.length + ' später' + (mx > 0 ? ', größte Verschiebung +' + mx + ' Tage' : '') + '. Grauer Balken = Plan laut Baseline.' : 'alle Termine wie geplant.') : 'Noch keine Baseline gespeichert.',
          save: () => { const map = {}; Object.values(NODE).forEach(n => { if (!n.pd) map[n.id] = [n.start, n.end]; }); this.setState({ blBy: Object.assign({}, s.blBy, { sm42: { date: '13.11.2026', map } }), blMsg: 'Neue Baseline gespeichert (13.11.2026). Die alte bleibt im Verlauf; Abweichungen zählen ab jetzt gegen diesen Stand.' }); },
          hasMsg: !!s.blMsg, msg: s.blMsg || '' }; })(),
      mta: this.mtaUI({ key: 'sm42', tree: TREE, blMap, blDate: blCur ? blCur.date : '', reports: MTA_REPORTS, hist: MTA_HIST, t, accent, accentText }),

      months, monthLines, todayLeft, rows, legend, toggleAll, toggleAllLabel: allOpen ? 'Alle zuklappen' : 'Alle aufklappen',
      stacey, staceyZone, staceyRec,
      pj, pjPlaceholder, goPlanung: () => this.setState({ ptab: mainTab }),
      zy, ring, sprintStrip, rCfg, ptl, pTabMeOpts, pTabMeOpen, pTabMeToggle, kbHead, kbLanes, laneBtns, kbKpis, kbMsg, cfd, kbGrid, kbMinW, kbAddCol, kbAdd, kbReport,
      scrumViews, sv, backlog, planLeft, planRight, plan, capacity, sboard, burn, boardMsg, goalBtns, reviewRows, review, retro, retroInfo, sp5, moodBtns, moodAvg, velocity, scrumKpis,
      vnodes, vlinks,
      mv, fo, dash, paletteItems, mo, dashHasMsg: !!s.dashMsg, dashMsg: s.dashMsg,
      openMobil: () => this.setState({ screen: 'mobil', panel: null, moScreen: 'list', moMsg: '' }),
      focusRows, themeBars, prioSug, applySug, aThemes, aFocusHint,
      adViews, ad, orgTop, orgTeams, orgDetail, orgTargets, orgHist, orgPeople, rules, pfBtns, pf, groupsAd, vertrList, vtPick,
      adHasMsg: !!s.adMsg, adMsg: s.adMsg, adRing: s.screen === 'admin' || s.screen === 'profil' ? accent : '#FFFFFF', wKiOpen: !!s.wKi, wKiOpenA: s.wKi ? 'true' : 'false', wKiBtn: s.wKi ? '🧠 KI-Vorschläge ausblenden' : '🧠 KI-Vorschläge zum Pflegen', wKiToggle: () => this.setState({ wKi: !s.wKi }),
      wSideOpen: !!s.wSide, wSideOpenA: s.wSide ? 'true' : 'false', wSideBtn: s.wSide ? 'Häufige Themen und Lessons Learned ausblenden' : 'Häufige Themen und Lessons Learned', wSideToggle: () => this.setState({ wSide: !s.wSide }),
      navShow: (h => ({ projekte: !h.projekte, teams: !h.teams, wissen: !h.wissen, berichte: !h.berichte, eingang: !h.eingang }))(s.navHide || {}), navCls: s.navOpen ? 'open' : '', navOpen: !!s.navOpen, navOpenA: s.navOpen ? 'true' : 'false',
      burger: () => this.setState({ navOpen: !s.navOpen }), navClose: () => this.setState({ navOpen: false }), navCfg: () => this.setState({ screen: 'profil', navOpen: false, panel: null, profMsg: 'Unter „Darstellung und Sprache“ legst du fest, welche Bereiche im Menü und welche Reiter in Meine Arbeit erscheinen.' }),
      openProfil: () => this.setState({ screen: 'profil', panel: null, profMsg: '' }), prf,
      openAdmin: () => this.setState({ screen: 'admin', panel: null, adMsg: '' }),
      vtSave: () => this.setState({ vtSet: true, adMsg: 'Vertretung festgelegt: ' + s.vtBy + ' gibt vom 21.12.2026 bis 06.01.2027 an deiner Stelle frei. ' + s.vtBy + ' ist benachrichtigt.' }),
      aSteps, aIs, aClar, aTech, aZone, aTeams, aEff, aStart, aCap, aNoCap: aCap.length === 0, aSum, aNext, aBack, myAntraege, zt,
      aHasMsg: !!s.aMsg, aMsg: s.aMsg, aDraft: () => this.setState({ aMsg: 'Entwurf gespeichert. Du findest ihn unter Projekte › Meine Anträge.' }),
      openAntrag: () => this.setState({ screen: 'antrag', aStep: 1, panel: null, aMsg: '' }), goProjekte: () => this.setState({ screen: 'projekte' }),
      nt, reqMe, reqMeCount: REQ_ME.length, sent, hasSent: s.sent.length > 0, reqLoad,
      openNew: () => { const inP = s.screen === 'projekt' && PNAME_OF[s.proj], inU = s.screen === 'pn' && (s.uprojs || []).find(u => u.key === s.upSel); this.setState({ panel: { kind: 'new', id: 'new', from: s.screen }, nt: Object.assign({}, s.nt, { who: 'ich', title: '', parent: null, owner: 'Du', ctx: inP ? s.proj : null, proj: inP ? PNAME_OF[s.proj] : (inU ? inU.name : 'Ohne Projekt'), kind: 'aufgabe', co: [], due: '2026-11-20' }) }); },
      rBoard: () => { this.setState({ rMsg: 'Lenkungskreis-Deck wird erzeugt …' }); this.pptBoard(t, accent).then(n0 => this.setState({ rMsg: 'Lenkungskreis-Deck mit ' + n0 + ' Folien heruntergeladen: Portfolio, eine Folie je Projekt, Ressourcenkonflikte, Entscheidungsbedarf.' })).catch(e => this.setState({ rMsg: 'Fehler: ' + (e && e.message ? e.message : e) })); },
      tdl: this.layUI('teamsdash', ['plan', 'kap', 'eingang', 'quali', 'zert'], { plan: 'Tagesplanung', kap: 'Kapazität 6 Wochen', eingang: 'Team-Eingang', quali: 'Qualifikationsmatrix', zert: 'Zertifikate' }, [], t, accent, { kap: 'half', eingang: 'half', quali: 'half', zert: 'half' }),
      cfmOn: !!s.cfm, cfmText: s.cfm || '', cfmOk: () => { const b = this._cfmBtn; this._cfmBtn = null; this.setState({ cfm: null }); if (b && b.isConnected) { b.__ecOk = true; b.click(); } }, cfmNo: () => { this._cfmBtn = null; this.setState({ cfm: null }); },
      rViews, rv1, rConf, rKpis, rHasMsg: !!s.rMsg, rMsg: s.rMsg, rFilterOn: s.rFilter !== 'alle', rFilterLabel: RF[s.rFilter] || '',
      rClearFilter: () => this.setState({ rFilter: 'alle' }), portRows, portEmpty: portRows.length === 0, portAll,
      rMonths, rToday: rp('2026-11-13'), roadRows, capRows, reportRows, rAutoBtn, rAutoPressed: s.rAuto ? 'true' : 'false',
      rToggleAuto: () => this.setState({ rAuto: !s.rAuto, rMsg: s.rAuto ? 'Automatischer Versand aus.' : 'Der Statusbericht geht ab jetzt jeden Freitag um 12:00 an die Geschäftsführung.' }),
      rExport: () => { const esc = v => String(v == null ? '' : v).replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch]);
        const rowsH = reportRows.map(r => '<tr><td>' + esc(r.rank) + '</td><td><b>' + esc(r.name) + '</b><br><small>' + esc(r.sub) + '</small></td><td>' + esc(r.model) + '</td></tr>').join('');
        const html = '<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Statusbericht KW 46</title><style>body{font-family:Segoe UI,Arial,sans-serif;margin:32px;color:#1b1b1b}h1{font-size:22px}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ddd;padding:8px;text-align:left;vertical-align:top}small{color:#616161}@media print{button{display:none}}</style></head><body><h1>Statusbericht KW 46 · Engineering Cockpit</h1><p>Stand 13.11.2026 · ' + reportRows.length + ' Projekte nach Priorität</p><table><tr><th>#</th><th>Projekt</th><th>Modell</th></tr>' + rowsH + '</table><p><button onclick="window.print()">Als PDF drucken</button></p></body></html>';
        let ok = false; try { if (typeof Blob !== 'undefined' && typeof document !== 'undefined') { const url = URL.createObjectURL(new Blob([html], { type: 'text/html' })), a = document.createElement('a'); a.href = url; a.download = 'Statusbericht_KW46.html'; document.body.appendChild(a); a.click(); a.remove(); ok = true; } } catch (er) { ok = false; }
        this.setState({ rMsg: ok ? 'Statusbericht_KW46.html heruntergeladen. Öffnen und „Als PDF drucken“ wählen. Im fertigen Cockpit erzeugt der Server das PDF direkt.' : 'Der Browser hat den Download blockiert. Im fertigen Cockpit erzeugt der Server das PDF.' }); },
      rMail: () => { const body = 'Hallo,\n\nanbei der Statusbericht KW 46:\n\n' + reportRows.map(r => r.rank + '. ' + r.name + ' – ' + r.sub).join('\n') + '\n\nViele Grüße';
        let ok = false; try { if (typeof window !== 'undefined' && window.open) { ok = !!window.open('mailto:?subject=' + encodeURIComponent('Statusbericht KW 46') + '&body=' + encodeURIComponent(body), '_blank'); } } catch (er) { ok = false; }
        this.setState({ rMsg: ok ? 'Dein Mailprogramm öffnet einen Entwurf mit dem Statusbericht. Empfänger eintragen und senden.' : 'Der Browser lässt hier kein Mailprogramm öffnen. Im fertigen Cockpit legt der Server den Entwurf über Microsoft Graph in Outlook ab.' }); },
      wNew: () => this.setState({ wMsg: 'Erfassung: Beobachtung, Ursache, Empfehlung, Themen und Projekt. Beim Projektabschluss fragt das Cockpit automatisch danach.' }),
      wCats, wTagOn: !!s.wtag, wTag: s.wtag || '', wClearTag: () => this.setState({ wtag: null }), wHasMsg: !!s.wMsg, wMsg: s.wMsg,
      wSuggest, wList, wEmpty: wList.length === 0, wTopics, wProj,
      panelOpen: !!pan, p: Object.assign(p, { ppl: mkPpl(p.ownPick || [], p.coPick || [], p.coText || '', 'p') }), settings,
      closePanel: () => this.setState({ panel: null, highlight: null }),
      openSettings: () => this.setState({ panel: { kind: 'settings', id: 'settings', from: s.screen === 'pn' ? 'pn' : 'projekt' }, setSub: null, setMsg: '' }), set
    };
  }
}

return Component;
})();
