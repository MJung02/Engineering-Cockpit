# Engineering Cockpit 3.0 – Anforderungsbeschreibung

| | |
|---|---|
| Dokument | Anforderungsbeschreibung (Lastenheft) |
| Version | 0.4 (Entwurf) |
| Änderungen | 0.6: LPA-Anbindung nach der echten LPA-API präzisiert (REQ-INT-026 bis -028), neu REQ-INT-030 bis -032, Konzept [LPA_ANBINDUNG.md](LPA_ANBINDUNG.md) · 0.5: Schnittstellen MCP, REST-API v1, LPA-Anbindung mit Zwei-Wege-Abgleich und Gegenvalidierung (REQ-INT-024 bis -029) · 0.2: Buckets (REQ-KANBAN-010 bis -014), Projektrollen mit Rechten (REQ-RECHT-009 bis -015) · 0.3: Ansichten (REQ-ANS), Suche und gespeicherte Ansichten (REQ-SUCHE), Papierkorb (REQ-PAPIER), Projektstrukturplan (REQ-PSP), Kapazitätsabgleich (REQ-RES-009 bis -011), Wochenzettel (REQ-ZEIT), Lessons Learned (REQ-LL), Automatisierungsrezepte (REQ-AUTO), weitere Integrationen (REQ-INT-007 bis -011), Apps und Einführung (REQ-NF-012 bis -016) · 0.4: Navigation (REQ-NAV), Termin-Ampel (REQ-AMPEL), Gestaltung (REQ-UI), Dashboards (REQ-DASH, ersetzt REQ-PORT-004), grafische Analysen (REQ-ANA), Organisationsstruktur (REQ-ORG, klärt OP-02), Projektanträge (REQ-ANTRAG); Mehrsprachigkeit (REQ-NF-008 auf M angehoben, REQ-NF-017 bis -021); Planungsfaktor und planbare Zeit (REQ-KAP-008 bis -011, REQ-KAP-001 und REQ-PRIO-003 angepasst) |
| Stand | 12.11.2026 |
| Grundlage | Review der Version 2.0.0 und Abstimmung im Chat vom 12.11.2026 |
| Zugehörig | [USER_STORIES.md](USER_STORIES.md) |

---

## 1. Zweck und Ziel

Das Engineering Cockpit soll Projekte jeder Größe abbilden: von einer Aufgabenliste für eine Person bis zum regulierten Kundenprojekt mit Anforderungen, Baselines und Freigaben. Es wird zuerst vom Autor selbst genutzt und danach für Teams und Unternehmen geöffnet.

Ein einfaches Projekt darf dabei nicht komplizierter aussehen als eine To-do-Liste. Komplexität wird pro Projekt zugeschaltet (Stufen und Module), nicht standardmäßig angezeigt.

### 1.1 Zielgruppen

- Unternehmen, Abteilungen, Teams, lose Gruppen
- Fachbereiche: Elektrotechnik, Automatisierungstechnik, Maschinenbau, Konstruktion, Softwareentwicklung, Instandhaltung
- Rollen: Geschäftsführung bzw. Vorgesetzte („Chef“), Projektleiter, Teamleiter, Mitarbeiter, externe Gäste (Kunde, Lieferant)

### 1.2 Abgrenzung

- Kein ERP: Rechnungen, Belege und Ersatzteile werden nur so weit geführt, wie sie für die Projektsteuerung gebraucht werden.
- Kein Chat-Ersatz für Slack oder Teams. Kommunikation läuft am Objekt (Kommentar, Erwähnung) und wird bei Bedarf an Teams/Slack weitergeleitet.

---

## 2. Konventionen

**Anforderungs-ID:** `REQ-<Bereich>-<Nr>`, z. B. `REQ-GANTT-004`. IDs werden nie neu vergeben, gestrichene Anforderungen bleiben mit Status „gestrichen“ stehen.

**Priorität (MoSCoW):**
- **M** – Must: ohne diese Funktion ist die Phase nicht abgeschlossen
- **S** – Should: wichtig, kann um eine Phase verschoben werden
- **C** – Could: wenn Zeit bleibt
- **W** – Won't (vorerst): bewusst nicht in diesem Release

**Phase:** Umsetzungsphase aus Kapitel 14.

**Stand:** ✅ vorhanden in 2.0.0 · 🔧 vorhanden, muss ausgebaut werden · 🆕 neu

---

## 3. Ausgangslage (Version 2.0.0)

### 3.1 Vorhanden und zu erhalten

| Bereich | Funktion |
|---|---|
| Persönliche Steuerung | Aufwandsklassen (2 min / 15 min / 2 h / 4 h+), „Warten auf“ mit Eskalation nach 7/14/21 Tagen, Quick-Wins, Dringlichkeits-Score, Maker-Time, „Meine Tasks“ |
| Projekte | Projektantrag mit Genehmigung, Initialisierung, Einstufung, Empfehlung des Vorgehensmodells, Meilensteine mit Untermeilensteinen, Quality-Gate-Kennzeichen, Sprints |
| Planung | Gantt (Plotly, nur Anzeige), Scrum-Board, V-Modell-Tab, Ressourcen in %, Rollen, Stundensätze |
| Steuerung | Risiken (EW × TW, Maßnahmenklasse, Restrisiko), RACI, AKV, Budget, Zeiterfassung, Belege, Rechnungskalkulation, Berichtspflichten mit Nachweisen, Schätzverfahren (2-Punkt, 3-Punkt, Story Points) |
| Dokumente | Lasten- und Pflichtenheft (KI-gestützt), Vorlagen mit Gliederung, User Stories (MoSCoW) |
| Wissen | Technik-Gedächtnis, Logbuch, Mail-Drop-Zone, Stakeholder |
| KI | Anthropic, Ollama oder lokales GGUF-Modell; Mail-Parsing, Statusbericht, Risiko- und Strukturvorschläge |
| Plattform | Postgres mit Migrationen, Login mit argon2, Session-Tokens gehasht, Rollen, SSO über Entra ID, Outlook über COM, Datei-Watcher |

### 3.2 Bekannte Mängel (in Phase 0 zu beheben)

| ID | Mangel | Fundstelle |
|---|---|---|
| DEF-01 | Benutzereingaben werden ungefiltert als HTML ausgegeben (246 Stellen mit `unsafe_allow_html`, kein Escaping): Stored XSS | `app.py`, `pages/*.py` |
| DEF-02 | XSRF-Schutz deaktiviert, App lauscht auf `0.0.0.0` | `.streamlit/config.toml`, `START.bat` |
| DEF-03 | Keine Berechtigungsprüfung pro Projekt; `company_id` wird in Abfragen nicht gefiltert | `dal.py` |
| DEF-04 | Projektzähler fragt `status='Aktiv'` ab, den es seit Migration 0018 nicht mehr gibt | `dal.py:398`, `gantt.py:141,223` |
| DEF-05 | Navigationspunkt „Gantt“ wird geroutet, ist aber nicht in der Navigation | `app.py` |
| DEF-06 | Suche mit `LIKE` unterscheidet Groß- und Kleinschreibung | `dal.fulltext_search` |
| DEF-07 | Kein Versionsverwaltungssystem, keine automatisierten Tests | Projektordner |
| DEF-08 | `START.bat` fehlerhaft, `.venv` ist eine macOS-Umgebung, 2,4-GB-Modell im OneDrive-Ordner, README veraltet | Projektordner |
| DEF-09 | Benachrichtigungen, Outlook und Datei-Watcher laufen im Serverprozess statt beim jeweiligen Nutzer | `benachrichtigungen.py`, `phase3_automation.py` |
| DEF-10 | Löschen ist endgültig: `ON DELETE CASCADE` entfernt ein Projekt samt Tasks, Logbuch, Risiken und Nachweisen sofort und ohne Wiederherstellung | `migrations/*.sql`, `dal.delete_*` |

---

## 4. Grundkonzept

### 4.1 Komplexitätsstufen (REQ-STUFE)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-STUFE-001 | Jedes Projekt hat genau eine Stufe: **1 Liste**, **2 Projekt**, **3 Gesteuertes Projekt**, **4 Reguliert/komplex**. | M | 1 | 🆕 |
| REQ-STUFE-002 | Die Stufe legt fest, welche Module standardmäßig sichtbar sind (Tabelle unten). | M | 1 | 🆕 |
| REQ-STUFE-003 | Einzelne Module können pro Projekt zusätzlich an- oder abgeschaltet werden, unabhängig von der Stufe. | M | 1 | 🆕 |
| REQ-STUFE-004 | Die Stufe kann jederzeit erhöht werden. Beim Absenken bleiben vorhandene Daten erhalten und werden nur ausgeblendet. | M | 1 | 🆕 |
| REQ-STUFE-005 | Beim Anlegen schlägt das System eine Stufe vor, abgeleitet aus der vorhandenen Einstufung (`berechne_einstufung`). | S | 1 | 🔧 |
| REQ-STUFE-006 | **Projekt-Assistent „+ Neues Projekt“** (auch über „+ Neu“ › Projekt): 1. Vorgehen wählen: **Liste und Board**, **Kanban**, **Wasserfall** (Phasen, Meilensteine, Quality Gates), **V-Modell**, **Scrum**; darunter die Beispiele zu diesem Vorgehen, jeweils „Leer“ plus fertige Strukturen (Wasserfall: Sondermaschine, SPS-Inbetriebnahme, Retrofit, Konstruktionsprojekt; Kanban: Wartungsplanung; V-Modell: Sicherheitsfunktion; Scrum: Softwareprojekt; Liste: Kleines Vorhaben). Eigene Vorlagen erscheinen beim passenden Vorgehen, 2. Name, Start, Farbe, Mitglieder, 3. Stufe 1–4 mit Modulen einzeln. Zusammenfassung zeigt, was entsteht (Phasen, Gates mit Checklisten, Startaufgaben). Ohne Freigabe sofort angelegt; für Vorhaben mit Budget bleibt „Projekt einreichen“. | M | 1 | 🆕 |
| REQ-STUFE-007 | **Reiter folgen den Modulen:** Ein Projekt zeigt nur die Bereiche seiner Stufe und der zugeschalteten Module (Planung ↔ Meilensteine, Team ↔ Ressourcen/RACI, Analyse ↔ Risiken/RACI/Statusbericht, Dokumente, Finanzen ↔ Budget). Änderungen wirken sofort, Daten bleiben beim Ausblenden erhalten. | M | 1 | 🆕 |
| REQ-STUFE-008 | **Eigene Projekte können alles, was die Beispielprojekte können:** Aufgaben an Projektmitglieder vergeben (Wer-Auswahl beim Anlegen, im Detail Beteiligte mit Suche), Planung als Zeitplan mit Phasen und darunter Meilensteinen, Gates und Arbeitspaketen (Balken, Status, heute-Linie). Klick öffnet das volle Detail mit Untermeilensteinen, Aufgaben anlegen, Gate-Entscheidung, Beteiligten und Verlauf. Ist RACI/AKV oder Ressourcen eingeschaltet, gibt es den Reiter „Team“: Mitglieder mit Rolle (Owner, Bearbeiter, Mitwirkender, Leser), Freigabegrenze (AKV) und eine RACI-Matrix über Phasen und Gates mit Prüfung „genau ein A je Zeile“. Ein eingeschaltetes Modul hat immer eine Stelle, an der man es bedienen kann. | M | 1 | 🆕 |

| Modul | Stufe 1 | Stufe 2 | Stufe 3 | Stufe 4 |
|---|:-:|:-:|:-:|:-:|
| Tasks, Kanban, Kommentare, Fälligkeiten, Liste, Tabelle, Kalender, Dateien, Lessons Learned | ● | ● | ● | ● |
| Meilensteine, PSP, Timeline, Gantt/V/Scrum-Ansicht, Zeiterfassung, Dokumente | | ● | ● | ● |
| Ressourcen und Kapazität, Budget, Risiko, RACI/AKV, Statusbericht, Baseline | | | ● | ● |
| Anforderungen mit Verfolgbarkeit, Change Requests, Freigabe-Workflows, Testfälle, Audit-Ansicht | | | | ● |

### 4.2 Projektvorlagen (REQ-VORL)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-VORL-001 | Ein Projekt kann aus einer Vorlage angelegt werden. Die Vorlage enthält Stufe, Vorgehensmodell, Meilenstein- und Taskstruktur, Quality Gates mit Checklisten, Rollen und Dokumentvorlagen. | M | 1 | 🆕 |
| REQ-VORL-002 | Mitgelieferte Vorlagen: Sondermaschine (Wasserfall), SPS-Inbetriebnahme, Retrofit, Konstruktionsprojekt, Softwareprojekt (Scrum), Sicherheitsfunktion (V-Modell), Wartungsplanung. | S | 3 | 🆕 |
| REQ-VORL-003 | Jedes bestehende Projekt kann als neue Vorlage gespeichert werden. Termine werden dabei relativ zum Projektstart abgelegt. | S | 3 | 🆕 |

### 4.3 Navigation und Übersichtlichkeit (REQ-NAV)

Leitregel: **Jede häufige Aktion ist mit höchstens zwei Klicks erreichbar.** Was zusammengehört, steht in einem Bereich statt in eigenen Reitern.

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-NAV-001 | **Hauptnavigation** mit höchstens 7 Einträgen: **Start** (persönliches Dashboard), **Meine Arbeit** (Tasks, Kalender, Wochenzettel), **Projekte** (inkl. „Projekt einreichen“), **Teams**, **Wissen** (Technik-Gedächtnis, Lessons Learned, Stakeholder), **Berichte** (Portfolio, Dashboards), **Posteingang** (Benachrichtigungen, Freigaben, Genehmigungen) mit Zähler. Einstellungen, Profil und Administration liegen hinter dem Avatar oben rechts, der KI-Assistent als schwebender Knopf auf jeder Seite. Ersetzt die heutigen 13 Navigationspunkte. | M | 2 | 🔧 |
| REQ-NAV-002 | **Projektnavigation** mit höchstens 7 Bereichen statt der heutigen 9 bis 12 Reiter: **Übersicht**, **Aufgaben** (Board, Liste, Tabelle, Kalender als umschaltbare Ansichten), **Planung** (PSP, Gantt bzw. V-Diagramm bzw. Backlog/Sprints, Meilensteine, Quality Gates), **Team** (Mitglieder, Ressourcen, RACI, AKV), **Analyse** (Scope, Kontext, Umfeld, Stacey, Risiken, Lessons Learned), **Dokumente** (Dateien, Lasten-/Pflichtenheft, Berichte, Logbuch), **Finanzen** (Budget, Zeiten, Belege, Rechnung, Nachweise). Bereiche ohne aktives Modul (REQ-STUFE-003) werden ausgeblendet. | M | 2 | 🔧 |
| REQ-NAV-003 | Jedes Projekt hat oben rechts einen **Einstellungsknopf** (Zahnrad) für Stammdaten, Stufe und Module, Vorgehensmodell, Buckets, Mitglieder und Rollen, Automatisierungen, Archivieren und Löschen. Ersetzt den heutigen Reiter „Projekt bearbeiten“. | M | 2 | 🔧 |
| REQ-NAV-004 | **Durchklicken aus jeder Visualisierung:** Ein Klick auf ein Element im Gantt, V-Diagramm, PSP, Backlog, Sprint-Review, Board, Kalender, Dashboard-Widget oder Diagrammsegment öffnet dessen **Detailbereich** mit Untermeilensteinen, Tasks, Kommentaren, Dateien und Historie. Ein Diagrammsegment (z. B. „7 überfällig“) öffnet die gefilterte Liste dieser 7 Objekte. | M | 2 | 🆕 |
| REQ-NAV-005 | Der Detailbereich öffnet als **Seitenpanel** rechts, die Visualisierung bleibt sichtbar. Ein Knopf „Im Projekt öffnen“ springt in den vollständigen Projektkontext an genau diese Stelle (Planung mit aufgeklapptem Meilenstein, markiertem Task). | M | 2 | 🆕 |
| REQ-NAV-006 | Ein Klick auf einen Task in **Meine Arbeit**, im Dashboard oder in der Suche öffnet das Seitenpanel; „Im Projekt öffnen“ springt in das Projekt mit diesem Task im Mittelpunkt. | M | 2 | 🆕 |
| REQ-NAV-007 | **Brotkrumen** (Projekt › Phase › Meilenstein › Task) im Detailbereich; jedes Glied ist anklickbar. Zurück-Taste des Browsers und Handys funktioniert erwartungsgemäß. | M | 2 | 🆕 |
| REQ-NAV-008 | Jede Seite, jede Ansicht mit Filter und jedes Objekt hat eine eigene **URL** (Deep Link), die man teilen und als Lesezeichen speichern kann. | M | 2 | 🆕 |
| REQ-NAV-009 | **Schnellanlage** von Task, Meilenstein, Störung und Projektantrag von überall über einen „+ Neu“-Knopf und Strg+M (REQ-SUCHE-008). *Tastenkürzel: **Strg+M** setzt den Cursor in die Suche, **Strg+Shift+M** öffnet den KI-Assistenten (Strg+K ist im Browser bereits mit der Websuche belegt).* | M | 2 | 🆕 |
| REQ-NAV-010 | **Meine Arbeit in drei Reitern:** *Mein Tag* (Zeitachse mit Outlook-Terminen und eingeplanten Aufgaben), *Meine Aufgaben* (Zähler, Fokus, Liste/Board/Kalender/Gantt/Meilensteine), *Anfragen* (Aufgaben von anderen zum Annehmen, Einwand, Ablehnen; von mir vergebene). Der Reiter Anfragen zeigt die Zahl offener Anfragen. | M | 2 | 🆕 |
| REQ-NAV-011 | **Projekteinstellungen vollständig bedienbar:** Stammdaten (Farbe, Kostenstelle), Stufe und Module, Vorgehensmodell mit „Als Vorlage speichern“, Buckets, Mitglieder und Rechte, Automatisierungen, Archivieren/Wiederherstellen und Löschen mit Bestätigung. | M | 2 | 🆕 |
| REQ-NAV-012 | **Details als Seitenfeld oder Pop-up:** Jeder Nutzer wählt im Profil, ob Aufgaben, Meilensteine und Gates rechts am Rand (Liste bleibt sichtbar, Breite ziehbar) oder als Pop-up in der Mitte öffnen; Umschalten auch direkt im Detail. Pop-up schließt mit Klick daneben oder ✕. | M | 2 | 🆕 |

### 4.4 Statusfarben und Termin-Ampel (REQ-AMPEL)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-AMPEL-001 | Jedes terminierte Objekt (Task, Meilenstein, Phase, Gate, Sprint, Story, Wartung, Arbeitspaket, Berichtspflicht) hat einen **Terminstatus**: **erledigt** = grün, **im Plan** = weiß bzw. neutral, **überfällig** = rot. | M | 2 | 🔧 |
| REQ-AMPEL-002 | Optional ein vierter Zustand **gefährdet** = gelb: noch nicht überfällig, aber Puffer aufgebraucht oder die Prognose aus Fortschritt und Restaufwand überschreitet den Termin. Pro Nutzer bzw. Projekt ein- und ausschaltbar. | S | 3 | 🆕 |
| REQ-AMPEL-003 | Der Terminstatus wird **in jeder Visualisierung** gleich dargestellt: Balkenfarbe im Gantt, Knotenfarbe im V-Diagramm und PSP, Kartenrand im Board, Zeilenmarkierung in Liste und Tabelle, Punkt im Kalender, Farbe in Dashboards. | M | 2 | 🆕 |
| REQ-AMPEL-004 | Elternobjekte zeigen den schlechtesten Status ihrer Kinder als kleinen Hinweis (z. B. Meilenstein grün umrandet, aber roter Punkt „2 Untermeilensteine überfällig“). | M | 2 | 🆕 |
| REQ-AMPEL-005 | Eine **Legende** ist in jeder Visualisierung einblendbar; ein Klick auf einen Legendeneintrag filtert (z. B. nur Rote zeigen). | M | 2 | 🆕 |
| REQ-AMPEL-006 | Farben sind farbfehlsichtigkeitstauglich: Zusätzlich zur Farbe ein Symbol (✓ erledigt, ! überfällig, ⚠ gefährdet). | M | 2 | 🆕 |
| REQ-AMPEL-007 | Dasselbe Prinzip gilt für **Kosten** (im Budget, gefährdet, überschritten), **Qualität** (Gate bestanden, offen, nicht bestanden) und **Risiken** (Risikoprioritäts-Farbskala). | M | 3 | 🔧 |
| REQ-AMPEL-008 | **Meine Arbeit** zeigt oben drei Zähler „überfällig“, „heute fällig“, „im Plan“; ein Klick filtert die Liste. Standardgruppierung: Überfällig, Heute, Diese Woche, Später, Ohne Termin. | M | 2 | 🔧 |

### 4.5 Gestaltung und Individualisierung (REQ-UI)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-UI-001 | Gestaltung angelehnt an **Microsoft Fluent 2** bzw. **iOS**: Systemschrift (Segoe UI Variable bzw. SF Pro), abgerundete Ecken (8–12 px), weiche Schatten, viel Weißraum, klare Symbole (ein einheitliches Icon-Set statt Emojis), dezente Animationen (≤ 200 ms) beim Öffnen, Ziehen und Abhaken. | M | 2 | 🆕 |
| REQ-UI-002 | **Farbige Statusfelder** wie bei monday.com: Status, Priorität, Typ und Auswahlfelder als vollflächige farbige Felder bzw. Pillen; ein Klick öffnet die Auswahl direkt in der Zeile. Unter jeder Spalte optional ein **Farbbalken** mit der Verteilung (z. B. 3 grün, 2 rot). | M | 2 | 🆕 |
| REQ-UI-003 | **Gruppen mit Farbe**: Gruppen in Tabelle und Liste (z. B. Sprint, Phase, Bucket) haben einen farbigen Rand und Titel, Summen in der Fußzeile, sind auf- und zuklappbar. | M | 2 | 🆕 |
| REQ-UI-004 | **Individualisierbar je Nutzer:** heller, dunkler oder System-Modus; Akzentfarbe; Dichte (kompakt, normal, luftig); Startseite; sichtbare Spalten und Kartenfelder. | M | 2 | 🆕 |
| REQ-UI-005 | **Individualisierbar je Projekt:** Projektfarbe und Symbol bzw. Titelbild; Farben und Namen der Statuswerte, Buckets, Prioritäten und Auswahlfelder; Kartenlayout (welche Felder auf der Karte stehen). | M | 2 | 🔧 |
| REQ-UI-006 | **Firmenweit** durch den Administrator: Logo, Primärfarbe, Standard-Farbpalette. | S | 3 | 🆕 |
| REQ-UI-007 | Personen werden mit **Avatar** (Foto oder Initialen in Farbe) angezeigt, Teams mit Symbol und Farbe. | M | 2 | 🆕 |
| REQ-UI-008 | Kontrast der Texte mindestens 4,5:1 (WCAG AA) in hellem und dunklem Modus, auch auf farbigen Statusfeldern. | M | 2 | 🆕 |
| REQ-UI-009 | **Feste Leisten:** Seitenleiste links, Kopfzeile mit Suche oben und das Detailpanel rechts bleiben beim Scrollen stehen; nur der Inhaltsbereich scrollt. Auf schmalen Bildschirmen (unter 1000 px) scrollt die ganze Seite. | M | 2 | 🆕 |
| REQ-UI-010 | **Profil und Einstellungen** über das Profilbild oben rechts: Profilbild und Farbe, Berufsbezeichnung, Telefon, Standort; Team und Vorgesetzter aus dem Organigramm (nur lesen); Fähigkeiten mit Stufe 1–4 (ab Stufe 3 bestätigt die Teamleitung) und Zertifikate mit Ablaufdatum; Farbschema Hell/Dunkel/System, Dichte, Akzentfarbe; Sprache; Sollzeit, Arbeitstage, planbarer Anteil, Arbeitsbeginn; Vertretung; Benachrichtigungen (Kanäle, Tagesübersicht, Ruhezeit); Kalenderverbindung; KI-Entwürfe. Die Sprachwahl steht nicht mehr in der Kopfzeile. Die Verwaltung ist von dort für Berechtigte erreichbar. | M | 2 | 🆕 |
| REQ-UI-011 | **Detailfeld rechts:** Breite per Ziehen am linken Rand und per Knopf (breiter/schmaler, 320–1100 px), „⤢ Groß“ zeigt das Feld über die ganze Breite, „⤡“ zurück. Die Breite bleibt je Nutzer gespeichert. Beschreibungen von Aufgaben, Meilensteinen und Gates sind dort direkt editierbar (✎). | M | 2 | 🆕 |
| REQ-UI-012 | **KI-Vorschläge als Stapel:** Entwürfe, Antwortvorschläge und Wissens-Vorschläge erscheinen einzeln („Vorschlag 2 von 7“) mit ‹ › zum Blättern und einer kleinen Sprungleiste. Nach einer Aktion kommt automatisch der nächste. So bleibt der Posteingang übersichtlich. | M | 2 | 🆕 |
| REQ-UI-013 | **Posteingang anpassen:** KI-Entwürfe oben, unten oder eingeklappt; Liste und Inhalt nebeneinander oder untereinander; Liste links oder rechts; Breite der Liste in 4 Stufen oder per Ziehen an der Trennlinie; Zeilen normal oder kompakt; maximale Höhe der Liste. Je Nutzer gespeichert, „Standard“ setzt zurück. | S | 2 | 🆕 |
| REQ-UI-014 | **Beteiligte als Personenliste:** Avatar, Name und Rolle (Verantwortlich, Beteiligt) untereinander; „Ändern“ beim Verantwortlichen, ✕ zum Entfernen, „+ Person“ öffnet eine Suche mit „+ Beteiligt“ und „Verantwortlich“. Ersetzt die Knopf-Wolken. | M | 2 | 🆕 |

### 4.6 Dashboards (REQ-DASH)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-DASH-001 | Dashboards werden per **Drag & Drop** aus Widgets gebaut: Widget aus einer Leiste ins Raster ziehen, Größe am Rand ändern, verschieben, entfernen. | M | 3 | 🆕 |
| REQ-DASH-002 | Es gibt ein **persönliches Dashboard** („Start“, übergreifend über alle eigenen Projekte und Aufgaben), ein **Dashboard je Projekt** (Bereich „Übersicht“) und **geteilte Dashboards** für Teams, Bereiche oder das Portfolio. | M | 3 | 🆕 |
| REQ-DASH-003 | Widgets mindestens: Kennzahl, Ampelzähler (überfällig/heute/im Plan), Aufgabenliste aus gespeicherter Ansicht, Mini-Board, Mini-Gantt bzw. Meilenstein-Zeitstrahl, Kalender, Diagramm (Balken, Kreis, Linie), Burndown/Velocity, Workload, Budget-Verlauf, Risiko-Matrix, Notiz/Text, Links. | M | 3 | 🆕 |
| REQ-DASH-004 | Jedes Widget hat eine Datenquelle (Projekt, mehrere Projekte, gespeicherte Ansicht, Team) und eigene Filter; Klick auf Werte öffnet die Objekte (REQ-NAV-004). | M | 3 | 🆕 |
| REQ-DASH-005 | Mitgelieferte Dashboard-Vorlagen: „Mein Tag“, „Projektleiter“, „Chef/Portfolio“, „Scrum-Team“, „Instandhaltung“. | S | 3 | 🆕 |
| REQ-DASH-006 | Dashboards sind auf dem Handy als einspaltige Liste der Widgets lesbar. | M | 3 | 🆕 |
| REQ-DASH-007 | **Projektübersicht anpassbar** wie das Start-Dashboard, je Projekt und Person: Kacheln ziehen, Größe ändern (schmal, mittel, ganze Breite), ausblenden, zurücksetzen. Zusätzliche Kacheln: Meine Aufgaben hier, Budget, Letzte Aktivität, Themen, KI-Zusammenfassung. Die Projektleitung kann ein Layout als Standard für alle Mitglieder setzen. | S | 3 | 🆕 |
| REQ-DASH-008 | **Die nächsten 5 Arbeitstage:** Aufgaben, Termine und Meilensteine lassen sich per Ziehen auf einen anderen Tag legen. Aufgaben ändern das Fälligkeitsdatum, Meilensteine verschieben sich im Plan (REQ-GANTT), Termine erzeugen einen neuen Terminvorschlag an die Teilnehmer. | S | 2 | 🆕 |
| REQ-DASH-009 | **Start-Dashboard frei anpassen:** Kacheln ziehen oder mit ◀ ▶ verschieben (Tastatur, Touch), Breite in 4 Stufen, Höhe automatisch, kompakt (mit Scrollen) oder hoch, ausblenden und wieder einblenden. Zusatzkacheln mit echten Daten: Termine heute, Team-Eingang (Team wählbar), Meilensteine und Gates (Zeitraum wählbar), ablaufende Zertifikate (Zeitraum wählbar), KI-Vorschläge, Notiz. Einstellungen je Kachel über ⚙. Fertige Layouts für Projektleitung, Teamleitung und Instandhaltung; „Zurücksetzen“. Gespeichert je Nutzer. | M | 2 | 🆕 |

---

## 5. Kern-Datenmodell (REQ-KERN)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-KERN-001 | Es gibt ein allgemeines **Arbeitsobjekt** mit Typ. Mindesttypen: Task, Meilenstein, Phase, Quality Gate, User Story, Epic, Anforderung, Testfall, Bug, Change Request, Wartungsauftrag, Störmeldung. | M | 1 | 🆕 |
| REQ-KERN-002 | Arbeitsobjekte sind beliebig tief hierarchisch: Phase → Meilenstein → Untermeilenstein → Task → Teilaufgabe. | M | 1 | 🔧 |
| REQ-KERN-003 | Jeder Typ hat einen eigenen, konfigurierbaren Statusablauf (Zustände und erlaubte Übergänge). | M | 1 | 🆕 |
| REQ-KERN-004 | Administratoren können pro Typ und Projekt **eigene Felder** anlegen (Text, Zahl, Datum, Auswahl, Person, Team, Verweis). Beispiel: „Schaltplan-Nr.“, „SPS-Baustein“. | M | 1 | 🆕 |
| REQ-KERN-005 | Arbeitsobjekte können verknüpft werden. Verknüpfungsarten: *ist Vorgänger von* (mit Abhängigkeitstyp), *blockiert*, *verifiziert*, *abgeleitet aus*, *betrifft Anlage*, *Duplikat von*, *gehört zu Epic*. *Im Entwurf: blockiert durch/blockiert, Vorgänger/Nachfolger, verwandt, Duplikat; Suche nach Titel oder Kennung; Gegenrichtung wird automatisch angezeigt; Karten zeigen „⛔ blockiert“; Verschieben einer blockierten Aufgabe in einen aktiven Bucket warnt.* | M | 1 | 🆕 |
| REQ-KERN-006 | Jede Änderung an einem Arbeitsobjekt wird historisiert: Zeitpunkt, Benutzer, Feld, alter Wert, neuer Wert. Die Historie ist nicht änderbar. *Im Entwurf: Reiter „Verlauf“ an Aufgaben und Meilensteinen (Bucket, Status, Verantwortlich, Fällig, Priorität, Verknüpfung, Löschen, Wiederherstellen).* | M | 1 | 🆕 |
| REQ-KERN-007 | Bestehende Daten (Tasks, Meilensteine, Sprints, User Stories, Risiken, Interaktionen) werden per Migration verlustfrei in das neue Modell überführt. | M | 1 | 🆕 |
| REQ-KERN-008 | Jedes Arbeitsobjekt hat eine projektweit eindeutige, lesbare Kennung (z. B. `SM42-117`) und einen direkten Link. *Im Entwurf: Kennung im Kopf des Details (z. B. SM42-101), „Link kopieren“, Stichwortfilter findet auch Kennungen.* | M | 1 | 🆕 |
| REQ-KERN-009 | **Akte an jedem Arbeitsobjekt** (Aufgabe, Meilenstein, Gate) mit Reitern: *Überblick* (Beschreibung, Beteiligte, Termine, Kommentare), *Doku* (Einträge mit Art Notiz, Protokoll, Entscheidung, Messwert, Abnahme; erscheinen im Projekt-Logbuch), *Dateien* (Fotos direkt von der Kamera, Dokumente; zugleich unter Projekt › Dokumente verknüpft), *Zeiten* (Schätzung ändern, Zeit buchen, Projektleitung auch für andere; erscheint im Wochenzettel), *Kosten*. | M | 2 | 🆕 |
| REQ-KERN-010 | **Rechnung einreichen** am Objekt: Lieferant, Kostenart, Betrag, Beleg (Foto oder PDF, Pflicht). Freigabe nach Betragsgrenze aus den AKV (bis 5.000 € Projektleitung, darüber Bereichsleitung), danach Buchhaltung. Die Rechnung erscheint unter Projekt › Finanzen mit Status. *Im Entwurf: Projekt › Finanzen › „+ Rechnung einreichen“ (Lieferant, Kostenart, Betrag, Zuordnung, Beleg Pflicht). Freigabe bis zur eigenen AKV-Grenze sofort, sonst Projektleitung bzw. H. Lorenz; freigegebene Rechnungen zählen ins Ist. Rechnungen aus Aufgabe/Meilenstein › Kosten erscheinen dort ebenfalls.* | S | 4 | 🆕 |
| REQ-KERN-011 | **Dateien ansehen:** PDFs und Bilder in der Akte öffnen sich in einer Vorschau im Detailbereich, mit Blättern zwischen den Dateien, Herunterladen und „in neuem Tab“. Office-Dateien öffnen in Word oder Excel Online (Microsoft 365), andere Typen zum Herunterladen. Rechte wie am Objekt. | M | 2 | 🆕 |
| REQ-KERN-012 | **Lieferant frei wählen:** Suchfeld über alle Lieferanten aus dem ERP (Name, Kreditor-Nr., Warengruppe), zuletzt verwendete zuerst. Gibt es den Lieferanten nicht, kann er als neuer Lieferant eingetragen werden; der Einkauf prüft die Stammdaten, bevor bezahlt wird. | M | 2 | 🆕 |

### 5.1 Ansichten auf dieselben Daten (REQ-ANS)

Alle Ansichten zeigen dieselben Arbeitsobjekte. Eine Änderung in einer Ansicht ist sofort in allen anderen sichtbar (REQ-VM-003). Jede Ansicht respektiert die Rechte der Projektrolle (REQ-RECHT-011).

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-ANS-001 | Ein Projekt, ein Team-Bereich oder eine projektübergreifende Auswahl kann in folgenden Ansichten geöffnet werden: **Liste**, **Tabelle**, **Board**, **Timeline/Gantt**, **Kalender**, **Workload**, **Diagramm**, **Dateien**, **Karte**, **PSP** (Kapitel 6.7), **V-Diagramm** (bei V-Modell). | M | 2 | 🔧 |
| REQ-ANS-002 | Pro Projekt kann man beliebig viele Ansichten als Tabs anlegen, benennen, sortieren und löschen (z. B. „Board Montage“, „Kalender IBN“). | M | 2 | 🆕 |
| REQ-ANS-003 | **Tabelle:** Spalten frei wählbar inkl. eigener Felder, Inline-Bearbeitung, Sortieren, Gruppieren, Summen- und Mittelwertzeile, **Formelspalten** (z. B. `Aufwand_Ist / Aufwand_Plan`), Export nach Excel. | M | 2 | 🆕 |
| REQ-ANS-004 | **Timeline:** vereinfachte Zeitleiste ohne Abhängigkeitslogik für Stufe 1–2, gruppierbar nach Person, Team oder Bucket. Ab Stufe 2 umschaltbar auf den vollen Gantt (Kapitel 6.2). | S | 2 | 🆕 |
| REQ-ANS-005 | **Kalender:** Monats-, Wochen- und Tagesansicht mit Tasks, Meilensteinen, Gates, Wartungen und Abwesenheiten; Termine per Ziehen verschieben. | M | 2 | 🆕 |
| REQ-ANS-006 | **Workload:** Personen (bzw. Teams) × Zeit mit den zugewiesenen Tasks als Balken und der Auslastung je Tag/Woche. Tasks lassen sich per Ziehen auf eine andere Person oder einen anderen Zeitraum umplanen. Ergänzt die Heatmap aus REQ-RES-001. | M | 3 | 🆕 |
| REQ-ANS-007 | **Diagramm:** Balken, Säulen, Kreis, Linie und Kennzahl für beliebige gefilterte Mengen, gruppiert nach einem Feld (z. B. offene Tasks je Person, Störungen je Anlage). In Dashboards einbettbar (REQ-PORT-004). | S | 3 | 🆕 |
| REQ-ANS-008 | **Dateien:** alle Anhänge eines Projekts als Liste oder Galerie mit Vorschau, Filter nach Typ, Objekt, Person, Datum; Versionsliste je Datei. | M | 2 | 🆕 |
| REQ-ANS-009 | **Karte:** Objekte mit Ort (Standort, Baustelle, Kunde, Anlage) auf einer Landkarte. Zusätzlich ein **Hallenplan**: Bild oder PDF des Layouts mit Anlagen als Pins, Farbe nach offenen Störungen. | C | 4 | 🆕 |
| REQ-ANS-010 | Die Standardansicht je Projekt richtet sich nach dem Vorgehensmodell (REQ-VM-002) und ist änderbar. | M | 2 | 🆕 |
| REQ-ANS-011 | **Ansichten nach Zweck getrennt, überall gleich bedient:** Eine einheitliche Umschaltleiste zeigt je Ort nur die passenden Ansichten. **Projekt › Aufgaben** (Arbeiten): Liste · Board · Kalender · Personen; bei Kanban-Projekten zusätzlich das Kanban-Board mit WIP-Limits als erste Sicht. **Projekt › Planung** (Planen und Nachweisen): die Modellsicht (Gantt mit Abhängigkeiten bei Wasserfall, V-Diagramm beim V-Modell, Scrum-Zyklus bei Scrum) · Gantt · PSP · Meilensteine · Verfolgbarkeit; bei Kanban-Projekten Wartungsplan als Gantt, Meilensteine und Einsatzplanung je Person. **Meine Arbeit** (persönlich, projektübergreifend): Liste · Board · Kalender · Gantt als persönlicher Zeitplan · Meilensteine. Beim V-Modell bleibt der Gantt bewusst verfügbar: Das V zeigt, was zusammengehört (Spezifikation ↔ Test), der Gantt zeigt, wann es passiert und wo sich Ebenen überlappen. Die zuletzt gewählte Ansicht wird je Ort und Person gemerkt; „Im Gantt zeigen“ öffnet immer die Modellsicht der Planung. | M | 2 | 🆕 |
| REQ-ANS-012 | **Meilensteine** als eigene Ansicht: Zeitstrahl mit Rauten in Ampelfarbe (REQ-AMPEL) und darunter eine Tabelle mit Phase bzw. Projekt, Termin, Status, Fortschritt und offenen Aufgaben. In Meine Arbeit zeigt sie die Meilensteine, an denen eigene Aufgaben hängen. | M | 2 | 🆕 |
| REQ-ANS-013 | **PSP** als Ansicht: im Projekt der Strukturplan (REQ-PSP) mit Nummerierung und Status je Arbeitspaket; in Meine Arbeit die eigenen Aufgaben als Baum Projekt → Meilenstein → Aufgabe. | M | 2 | 🆕 |
| REQ-ANS-014 | **Gantt** als Ansicht: im Projekt Phasen und Meilensteine kompakt mit Sprung in den vollständigen Gantt (Kapitel 6.2); in Meine Arbeit die eigenen Aufgaben als Balken, Dauer aus Aufwand und planbarer Zeit pro Tag (REQ-KAP-008), Ende am Fälligkeitstag. | M | 2 | 🆕 |
| REQ-ANS-015 | **Verfolgbarkeit** als Ansicht: im Projekt Anforderung → Meilenstein → Aufgaben → Nachweis (Prüfschritt FAT/SAT, Validierung) mit Abdeckung und einer Liste der Aufgaben ohne Anforderung; in Meine Arbeit je eigener Aufgabe Meilenstein, Anforderung und Nachweis. Lücken (kein Nachweis, ohne Bezug) sind farbig markiert. Grundlage: REQ-ANF. | M | 5 | 🆕 |
| REQ-ANS-016 | **Fokus:** Jede Aufgabe lässt sich in jeder Ansicht mit einem Stern in den Fokus legen (entspricht dem Bucket „Fokus“, REQ-KANBAN-010). Meine Arbeit zeigt oben „Mein Fokus“ in selbst gewählter Reihenfolge mit der Summe der Aufwände gegen die planbare Zeit des Tages (z. B. 6 h von 5,6 h, rot bei Überschreitung) und schlägt überfällige Aufgaben vor, die noch nicht im Fokus sind. | M | 2 | 🆕 |
| REQ-ANS-017 | **Personen** als Ansicht: je Person die Stunden aus offenen Aufgaben je Kalenderwoche gegen ihren Projektanteil (Anteil × planbare Zeit, REQ-KAP-009), farbig im Anteil / über 80 % / über dem Anteil; darunter die offenen Aufgaben als Marken. Überfällige zählen in die laufende Woche. In der Planung der Instandhaltung zusätzlich die Qualifikationen je Person (Einsatzplanung, REQ-RES). | M | 3 | 🆕 |
| REQ-ANS-018 | **Kalender mit Beteiligten:** Jeder Eintrag zeigt das Kürzel der verantwortlichen Person; eine Personenleiste filtert den Kalender auf eine Person. | M | 2 | 🆕 |
| REQ-ANS-019 | **Drag & Drop überall, wo es Sinn ergibt:** Karten im Board, Kanban und Sprint-Board; Aufgaben in der Ansicht Personen auf eine andere Person; Balken im Gantt (verschieben, am rechten Ende Dauer ändern, Phasen nehmen ihre Meilensteine mit); Kacheln im Dashboard. Alle Regeln gelten auch beim Ziehen (WIP-Limit, Done nur mit erfüllten Akzeptanzkriterien, Stories nur über die Sprint-Planung, Freigaben nach REQ-AUFG). Jede Ziehen-Aktion hat eine Alternative per Knopf oder Tastatur (← →, „1 Woche später“, „Dauer +1 Woche“). | M | 2 | 🆕 |
| REQ-ANS-020 | **Board-Zeilen (Swimlanes):** im Projekt nach Person, in Meine Arbeit nach Projekt. Ziehen einer Karte in die Zeile einer anderen Person weist die Aufgabe neu zu (im Projekt ohne Freigabe, REQ-AUFG-002) und benachrichtigt die Person. | S | 2 | 🆕 |

### 5.2 Suche, Filter und gespeicherte Ansichten (REQ-SUCHE)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-SUCHE-001 | **Globale Suche** über alle Arbeitsobjekte, Kommentare, Logbuch, Lessons Learned und **Dateiinhalte** (PDF, Word, Excel, Text), ohne Unterscheidung von Groß- und Kleinschreibung, mit deutscher Wortstammbildung und Toleranz für Tippfehler. | M | 2 | 🔧 |
| REQ-SUCHE-002 | Die Suche zeigt nur Treffer, die der Nutzer lesen darf. | M | 2 | 🆕 |
| REQ-SUCHE-003 | **Filter** nach allen Feldern inkl. eigener Felder, kombinierbar mit UND/ODER, auch relative Termine („fällig in den nächsten 7 Tagen“, „geändert seit letztem Montag“). | M | 2 | 🆕 |
| REQ-SUCHE-004 | Zusätzlich eine **Textabfrage** für Fortgeschrittene, z. B. `projekt = SM42 AND bucket = "Warten auf" AND fällig < heute`. | C | 6 | 🆕 |
| REQ-SUCHE-005 | Ansichten mit ihren Filtern, Sortierungen, Gruppierungen und Spalten können **gespeichert** werden: **persönlich** oder **geteilt** (für ein Projekt, ein Team oder alle). | M | 2 | 🆕 |
| REQ-SUCHE-006 | Gespeicherte Ansichten sind als Favorit in die Navigation übernehmbar und als Grundlage für Diagramme, Dashboards und Automatisierungen nutzbar. | S | 3 | 🆕 |
| REQ-SUCHE-007 | **Massenbearbeitung:** mehrere Objekte markieren und gemeinsam ändern (Bucket, Person, Team, Fälligkeit, Feld, Löschen), mit Vorschau der Anzahl betroffener Objekte. | M | 2 | 🆕 |
| REQ-SUCHE-008 | **Befehlspalette** (Strg+M, nicht Strg+K, das der Browser für die Websuche nutzt) und Tastaturkürzel für die häufigsten Aktionen (neuer Task, Suche, Ansicht wechseln). | S | 2 | 🆕 |
| REQ-SUCHE-009 | **Sofortsuche in der Kopfzeile:** ab zwei Zeichen ein Ergebnisfenster mit Gruppen Aufgaben, Meilensteine und Gates, Projekte, Wissen, Dateien und Doku, Kommentare, Personen; Klick öffnet das Objekt (bei Dateien und Doku direkt im passenden Reiter der Akte). Teilwörter genügen, Groß- und Kleinschreibung egal. | M | 2 | 🆕 |

### 5.3 Papierkorb (REQ-PAPIER)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-PAPIER-001 | Gelöschte Projekte, Arbeitsobjekte, Kommentare, Dateien und Buckets kommen in einen **Papierkorb** und sind 30 Tage lang wiederherstellbar (Frist einstellbar). *Im Entwurf: „In den Papierkorb“ mit Rückfrage im Aufgaben-Detail; Projekte › Papierkorb mit Wiederherstellen und Endgültig löschen.* | M | 0 | 🆕 |
| REQ-PAPIER-002 | Die Wiederherstellung stellt das Objekt mit allen Unterobjekten, Verknüpfungen, Dateien und der Historie wieder her. | M | 0 | 🆕 |
| REQ-PAPIER-003 | Jeder Projektnutzer sieht im Papierkorb, was er selbst gelöscht hat; Owner und Administratoren sehen alles aus ihren Projekten. Endgültiges Löschen dürfen nur Owner und Administratoren. | M | 0 | 🆕 |
| REQ-PAPIER-004 | Nach Ablauf der Frist wird endgültig gelöscht. Vorher werden die Owner 7 Tage im Voraus benachrichtigt, wenn ein ganzes Projekt betroffen ist. | S | 1 | 🆕 |
| REQ-PAPIER-005 | Neben „Löschen“ gibt es **Archivieren**: Das Projekt bleibt unverändert lesbar und durchsuchbar, erscheint aber nicht mehr in aktiven Listen. | M | 1 | 🔧 |

---

## 6. Vorgehensmodelle

### 6.1 Allgemein (REQ-VM)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-VM-001 | Jedes Projekt ab Stufe 2 hat ein Vorgehensmodell: **Wasserfall**, **V-Modell**, **Scrum**, **Kanban**, **Hybrid** (Phasen mit Sprints innerhalb einer Phase). | M | 1 | 🔧 |
| REQ-VM-002 | Planung, Durchführung und Verlaufsauswertung unterscheiden sich je Modell (Tabelle unten). Das System zeigt pro Modell die passende Standardansicht. | M | 2 | 🆕 |
| REQ-VM-003 | Alle Ansichten arbeiten auf denselben Daten. Eine Änderung im Gantt ist sofort im V-Diagramm, in der Liste und im Board sichtbar. | M | 2 | 🆕 |
| REQ-VM-004 | Das Vorgehensmodell kann während des Projekts gewechselt werden. Ein Assistent zeigt, welche Strukturen umgedeutet werden (z. B. Phasen → Sprints). | C | 5 | 🆕 |

| Modell | Planung | Durchführung | Verlauf und Bewertung |
|---|---|---|---|
| Wasserfall | Gantt mit Phasen, Meilensteinen, Abhängigkeiten, Quality Gates | Taskliste und Board pro Phase, Gate-Freigaben | Baseline-Vergleich, Meilenstein-Trendanalyse, Fertigstellungsgrad, Earned Value (Stufe 3+) |
| V-Modell | V-Diagramm mit Spezifikations- und Testebenen | Umsetzung je Ebene, Tests gegen die Gegenebene | Testabdeckung je Ebene, offene Verifikationen, Gate-Status |
| Scrum | Product Backlog, Refinement, Sprint Planning | Sprint-Board, Daily-Ansicht | Burndown, Burnup, Velocity, Sprint Review, Retrospektive |
| Kanban | Board mit Spalten, WIP-Limits, Swimlanes | Board | Cumulative Flow Diagram, Durchlauf- und Zykluszeit, Durchsatz |
| Hybrid | Gantt für Phasen, Backlog und Sprints innerhalb der Umsetzungsphase | Kombination | Kennzahlen beider Seiten |

### 6.2 Wasserfall und Gantt (REQ-GANTT)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-GANTT-001 | Balken für Phasen, Meilensteine und Tasks lassen sich per Maus **verschieben** (Start und Ende gleichzeitig). | M | 2 | 🆕 |
| REQ-GANTT-002 | Balken lassen sich am linken oder rechten Rand **verlängern und verkürzen**. | M | 2 | 🆕 |
| REQ-GANTT-003 | Jede Änderung ist auch **schriftlich** möglich: über eine Tabelle links vom Diagramm (Name, Start, Ende, Dauer, Aufwand, Vorgänger, Verantwortlich) und über einen Dialog per Doppelklick. | M | 2 | 🆕 |
| REQ-GANTT-004 | **Abhängigkeiten** werden per Ziehen von Balken zu Balken angelegt oder in der Vorgänger-Spalte eingetragen. Unterstützt werden Ende-Anfang (EA), Anfang-Anfang (AA), Ende-Ende (EE), Anfang-Ende (AE), jeweils mit Vorlauf oder Verzug in Arbeitstagen. Schreibweise in der Tabelle z. B. `12EA+2T`. | M | 2 | 🆕 |
| REQ-GANTT-005 | Beim Verschieben eines Vorgängers werden abhängige Elemente automatisch nachgezogen (automatische Terminierung). Pro Element kann stattdessen „manuell terminiert“ gesetzt werden. | M | 2 | 🆕 |
| REQ-GANTT-006 | Untermeilensteine und Tasks werden unter ihrem Eltern-Element eingerückt dargestellt und lassen sich auf- und zuklappen. Der Elternbalken umspannt automatisch seine Kinder. | M | 2 | 🔧 |
| REQ-GANTT-007 | **Quality Gates** werden als Raute dargestellt und können per Klick oder Ziehen eingefügt werden. Ein Gate hat eine Checkliste, einen oder mehrere Freigebende und den Status offen / bestanden / bestanden mit Auflagen / nicht bestanden. | M | 2 | 🔧 |
| REQ-GANTT-008 | Pro Gate einstellbar: **hart** (Folgephase kann erst nach Freigabe auf „In Arbeit“ gesetzt werden) oder **weich** (nur Warnung). | M | 2 | 🆕 |
| REQ-GANTT-009 | Der **kritische Pfad** wird nach der Netzplantechnik (CPM, Vorwärts- und Rückwärtsrechnung) berechnet und rot hervorgehoben. Für jedes Element werden Gesamtpuffer und freier Puffer angezeigt. | M | 3 | 🆕 |
| REQ-GANTT-010 | Der kritische Pfad kann zusätzlich **manuell definiert** werden: Elemente per Klick oder Kontextmenü als „kritisch“ markieren. Manuell markierte und berechnete kritische Elemente sind optisch unterscheidbar. Abweichungen werden angezeigt („manuell kritisch, aber 5 Tage Puffer“). | M | 3 | 🔧 |
| REQ-GANTT-011 | Zeitskala zoombar: Tag, Woche, Monat, Quartal, Jahr. Heute-Linie, Wochenenden und Feiertage (Bundesland wählbar) sind markiert. | M | 2 | 🆕 |
| REQ-GANTT-012 | **Baseline:** Der aktuelle Plan kann benannt eingefroren werden („Stand Kick-off“). Bis zu 5 Baselines je Projekt; eine davon wird als grauer Schattenbalken unter dem Ist-Plan angezeigt. *Im Entwurf (SM42-Gantt): Baseline an/aus, grauer Balken unter jedem verschobenen Element, „+4 T. zur Baseline“ in Rot bzw. früher in Grün, Zusammenfassung „3 Termine verschoben, größte Verschiebung +7 Tage“, „Neue Baseline speichern“.* | M | 3 | 🆕 |
| REQ-GANTT-013 | Fortschritt in % wird im Balken angezeigt. Er wird bei Elternelementen aus den Kindern berechnet (gewichtet nach Aufwand) und kann bei Blattelementen manuell gesetzt werden. | M | 2 | 🔧 |
| REQ-GANTT-014 | Rückgängig und Wiederholen für alle Planänderungen der laufenden Sitzung (mindestens 50 Schritte). | S | 2 | 🆕 |
| REQ-GANTT-015 | Termineinschränkungen pro Element: „nicht vor“, „nicht nach“, „fester Termin“. Verletzungen werden markiert. | S | 3 | 🆕 |
| REQ-GANTT-016 | Meilenstein-Trendanalyse (MTA) aus den Baselines und den Terminänderungen der Historie. *Im Entwurf:* Planung › „📈 Meilenstein-Trend“ in allen Projekten; Berichtsstände aus den gespeicherten Baselines, Linien je Meilenstein, Diagonale = erreicht, Tabelle mit Abweichung und Trend. | S | 3 | 🆕 |
| REQ-GANTT-017 | Export als PDF und PNG (DIN A3 quer, mit Legende) sowie Import und Export im MS-Project-XML-Format. | S | 6 | 🆕 |
| REQ-GANTT-018 | Balken haben **an beiden Enden einen Griff:** links ändert den Start, rechts das Ende; nach innen ziehen macht kürzer, nach außen länger. Gilt im großen Gantt und im Gantt jeder Planung. Knöpfe als Alternative: „Start +1 Woche“, „Ende −1 Woche“, „Ende +1 Woche“. | M | 2 | 🆕 |
| REQ-GANTT-019 | **Gate-Entscheidung** mit drei Ergebnissen: *Bestanden*, *Mit Auflage bestanden*, *Nicht bestanden*. Auflage und „nicht bestanden“ brauchen einen Text (was, bis wann, wer). Eine Auflage wird automatisch eine Aufgabe mit Termin am Gate; das Gate zeigt gelb, bis sie erledigt ist. Die Entscheidung steht im Gate-Protokoll und lässt sich zurücknehmen. | M | 2 | 🆕 |
| REQ-GANTT-020 | **Datum von Hand:** Fälligkeit von Aufgaben, Termin von Meilensteinen und Gates, Start und Ende von Arbeitspaketen lassen sich per Datumsfeld eintragen, auch beim Anlegen. Phasen mit Unterpunkten leiten ihre Dauer ab und zeigen das. | M | 1 | 🆕 |

### 6.3 V-Modell (REQ-VMOD)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-VMOD-001 | Das V-Modell wird als **V-Diagramm** dargestellt: linker Ast Spezifikation, Spitze Umsetzung, rechter Ast Integration und Test. | M | 2 | 🔧 |
| REQ-VMOD-002 | Die Ebenen sind frei konfigurierbar: hinzufügen, umbenennen, löschen, Reihenfolge ändern. Standardvorlage: Anforderungsdefinition ↔ Abnahmetest, Systementwurf ↔ Systemtest, Architektur/Grobentwurf ↔ Integrationstest, Modul-/Feinentwurf ↔ Modultest, Spitze Implementierung. | M | 2 | 🆕 |
| REQ-VMOD-003 | Jede Ebene ist ein Meilenstein (bzw. eine Phase) mit Untermeilensteinen und Tasks. Ein Klick auf eine Ebene öffnet deren Inhalt; Untergliederungen werden im Diagramm aufklappbar angezeigt. | M | 2 | 🆕 |
| REQ-VMOD-004 | Gegenüberliegende Ebenen sind durch eine horizontale **Verifikationsbeziehung** verbunden. Weitere Beziehungen können per Ziehen zwischen Ebenen oder einzelnen Elementen angelegt werden. | M | 2 | 🆕 |
| REQ-VMOD-005 | Zeitliche Abhängigkeiten zwischen Ebenen und Elementen werden wie im Gantt gepflegt (REQ-GANTT-004) und sind in beiden Ansichten identisch. Ein Umschalter wechselt zwischen V-Ansicht und Gantt-Ansicht desselben Projekts. | M | 2 | 🆕 |
| REQ-VMOD-006 | Am Ende jeder Ebene kann ein Quality Gate gesetzt werden (REQ-GANTT-007/008). | M | 2 | 🔧 |
| REQ-VMOD-007 | Anforderungen auf dem linken Ast werden mit Testfällen auf dem rechten Ast verknüpft. Jede Ebene zeigt die Testabdeckung (Anteil der Anforderungen mit mindestens einem bestandenen Testfall). | S | 5 | 🆕 |
| REQ-VMOD-008 | Farbliche Statusanzeige je Ebene: nicht begonnen, in Arbeit, abgeschlossen, Gate offen, Gate nicht bestanden. | M | 2 | 🆕 |

### 6.4 Scrum (REQ-SCRUM)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-SCRUM-001 | **Product Backlog** als sortierbare Liste von Epics, User Stories und Bugs. Rangfolge per Ziehen; Filter nach Epic, MoSCoW, Status, Team. | M | 2 | 🔧 |
| REQ-SCRUM-002 | **Refinement:** Stories schätzen (Story Points, Fibonacci 1–21, oder Stunden), aufteilen, Akzeptanzkriterien ergänzen. Optional Planning Poker für mehrere Teilnehmer. | S | 3 | 🔧 |
| REQ-SCRUM-003 | **Definition of Ready** und **Definition of Done** als Checklisten je Projekt. Eine Story kann erst eingeplant werden, wenn die DoR erfüllt ist (abschaltbar). | M | 2 | 🆕 |
| REQ-SCRUM-004 | **Sprint Planning:** Sprint mit Ziel, Start, Ende anlegen; Stories aus dem Backlog in den Sprint ziehen. Die Kapazität des Teams wird aus Projektanteil, Abwesenheiten und Sprintlänge berechnet (REQ-KAP-003) und gegen die geplanten Punkte bzw. Stunden angezeigt. | M | 2 | 🔧 |
| REQ-SCRUM-005 | **Sprint-Board** mit den Spalten To Do, In Arbeit, Review, Done (konfigurierbar). Stories mit ihren Teilaufgaben als Swimlanes. | M | 2 | 🔧 |
| REQ-SCRUM-006 | Eine Story wird erst „Done“, wenn alle Akzeptanzkriterien abgehakt und die DoD erfüllt ist. | M | 2 | 🆕 |
| REQ-SCRUM-007 | **Burndown- und Burnup-Diagramm** je Sprint, täglich automatisch fortgeschrieben. | M | 3 | 🆕 |
| REQ-SCRUM-008 | **Sprint Review:** Für jede Story wird festgehalten: angenommen / nicht angenommen, mit Kommentar. Das Sprintziel wird bewertet: erreicht / teilweise / nicht erreicht. Nicht fertige Stories gehen wahlweise zurück ins Backlog oder in den nächsten Sprint. *Im Entwurf: Retrospektive mit Erklärung, Karten „Lief gut“/„Verbessern“, „→ Maßnahme“ mit verantwortlicher Person, Maßnahme wird Aufgabe.* | M | 3 | 🆕 |
| REQ-SCRUM-009 | **Retrospektive:** Einträge in den Spalten „lief gut“, „verbessern“, „Maßnahmen“. Maßnahmen werden zu Tasks mit Verantwortlichem. Optional eine Stimmungsbewertung 1–5 pro Teilnehmer. | M | 3 | 🔧 |
| REQ-SCRUM-010 | **Kennzahlen:** Velocity (letzte 6 Sprints), Zuverlässigkeit der Zusage (fertige / zugesagte Punkte), Anteil ungeplanter Arbeit, Zykluszeit pro Story. | M | 3 | 🆕 |
| REQ-SCRUM-011 | Releaseplanung: Prognose, in welchem Sprint ein Epic fertig wird, auf Basis der mittleren Velocity. | C | 7 | 🆕 |
| REQ-SCRUM-012 | **Scrum-Zyklus grafisch** als Einstiegsansicht: Product Backlog → Sprint-Planung → Sprint Backlog → Sprint (Ring mit Zeitfortschritt und erledigten Story Points, Daily-Schleife) → Inkrement → Review → Retrospektive, mit Rückfluss ins Backlog und in die nächste Planung. Jede Station zeigt ihre aktuellen Kennzahlen und öffnet per Klick die zugehörige Ansicht. Die aktuelle Station (z. B. „Review heute“) ist hervorgehoben. | M | 2 | 🔧 |
| REQ-SCRUM-013 | **Sprint-Zeitleiste** bis zum Release: abgeschlossene Sprints mit Velocity (grün), laufender Sprint (Akzentfarbe), nächster Sprint in Planung, spätere Sprints, Release-Marke. Klick öffnet den jeweiligen Sprint. | S | 3 | 🆕 |

### 6.5 Kanban (REQ-KANBAN)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-KANBAN-001 | Boards können frei erstellt werden: pro Projekt, pro Team, persönlich oder projektübergreifend. | M | 2 | 🔧 |
| REQ-KANBAN-002 | Spalten (**Buckets**, wie in Microsoft Planner) sind konfigurierbar: Name, Reihenfolge, Farbe, zugeordnete Statuskategorie. | M | 2 | 🔧 |
| REQ-KANBAN-010 | Neue Boards starten mit den Standard-Buckets **Backlog**, **Fokus**, **Warten auf**, **Erledigt**. | M | 2 | ✅ |
| REQ-KANBAN-011 | Berechtigte Nutzer (REQ-RECHT-010) können Buckets **anlegen**, **umbenennen**, **verschieben** und **löschen**, auch die Standard-Buckets. | M | 2 | 🆕 |
| REQ-KANBAN-012 | Jeder Bucket gehört zu einer Statuskategorie: *offen*, *in Arbeit*, *wartend*, *erledigt*. Davon hängen Eskalation (*wartend*), Erledigt-Datum und Kennzahlen (*erledigt*) ab, nicht vom Namen. Ein umbenannter „Warten auf“-Bucket eskaliert also weiter. | M | 2 | 🆕 |
| REQ-KANBAN-013 | Beim Löschen eines Buckets, der noch Karten enthält, muss ein Ziel-Bucket gewählt werden, in den die Karten verschoben werden. Der letzte Bucket der Kategorie *erledigt* kann nicht gelöscht werden. | M | 2 | 🆕 |
| REQ-KANBAN-014 | Bucket-Sets können als Vorlage gespeichert und in anderen Boards bzw. Projektvorlagen wiederverwendet werden. | S | 3 | 🆕 |
| REQ-KANBAN-003 | Karten werden per **Drag & Drop** zwischen Spalten und innerhalb einer Spalte verschoben. | M | 2 | 🆕 |
| REQ-KANBAN-004 | **WIP-Limits** pro Spalte. Überschreitung wird farbig angezeigt und optional verhindert. | M | 2 | 🆕 |
| REQ-KANBAN-005 | **Swimlanes** nach Person, Team, Projekt, Priorität oder einem eigenen Feld. | S | 2 | 🆕 |
| REQ-KANBAN-006 | Kartenalterung: Karten, die länger als X Tage in einer Spalte liegen, werden markiert. Die bestehende Eskalation für „Warten auf“ bleibt als Spezialfall erhalten. | M | 2 | 🔧 |
| REQ-KANBAN-007 | Serviceklassen: Expedite, fester Termin, Standard, intangibel. Expedite-Karten erscheinen in einer eigenen Spur oben. | S | 3 | 🆕 |
| REQ-KANBAN-008 | Kennzahlen: Cumulative Flow Diagram, Durchlaufzeit, Zykluszeit, Durchsatz pro Woche. | S | 3 | 🆕 |
| REQ-KANBAN-009 | Aufwandsklassen, Quick-Wins und Dringlichkeits-Score bleiben als Kartenattribute und Sortieroption erhalten. | M | 2 | ✅ |
| REQ-KANBAN-015 | **Warten auf mit Person und Grund:** Wird eine Aufgabe in einen Bucket der Kategorie *wartend* gezogen, fragt das Cockpit: auf wen (Projektmitglied, Kunde, Lieferant, Einkauf, Qualität), warum (frei, mit Vorschlägen) und wann nachfassen. Die Karte zeigt „⏳ wartet auf …“, die Eskalation (REQ-KANBAN-006) erinnert am Nachfass-Termin, „Jetzt nachfassen“ schreibt die Person direkt an. | M | 2 | 🆕 |
| REQ-KANBAN-016 | **Buckets direkt im Board verwalten:** Spaltenname in der Überschrift umbenennen, mit ◀ ▶ verschieben, mit 🗑 löschen (Aufgaben wandern in den ersten offenen Bucket, die letzte Erledigt-Spalte bleibt), „+ Spalte (Bucket)“ in der Werkzeugleiste. Gilt nicht für Scrum (Status-Workflow) und Kanban mit WIP-Limits. *Im Entwurf auch im Instandhaltungs-Board: Spalten anlegen, umbenennen, verschieben, löschen, WIP-Limit per Klick; „+ Auftrag“ je Spalte.* | M | 2 | 🆕 |
| REQ-KANBAN-017 | **Direkt anlegen, wo man gerade ist:** „+ Aufgabe“ unten in jeder Spalte (bei Zeilen nach Person für diese Person), Eingabezeile oben in der Liste (Titel, Fällig, Wer), „+“ an jedem Kalendertag (fällig an diesem Tag), „+ Aufgabe für …“ in der Personen-Ansicht. Kein Formular nötig, Details später im Detailbereich. | M | 2 | 🆕 |

### 6.6 User Stories und Akzeptanzkriterien (REQ-STORY)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-STORY-001 | User Stories werden im Format „Als **Rolle** möchte ich **Ziel**, damit **Nutzen**“ erfasst. Rolle, Ziel und Nutzen sind getrennte Felder. | M | 1 | ✅ |
| REQ-STORY-002 | Eine Story hat eine **Liste** von Akzeptanzkriterien statt eines Freitextfelds. Jedes Kriterium ist einzeln abhakbar und optional im Format Gegeben / Wenn / Dann formuliert. | M | 1 | 🔧 |
| REQ-STORY-003 | Stories gehören optional zu einem Epic und können mit Anforderungen und Testfällen verknüpft werden. | M | 1 | 🆕 |
| REQ-STORY-004 | Eine Story kann in mehrere Stories aufgeteilt werden; die Herkunft bleibt als Verknüpfung erhalten. | S | 3 | 🆕 |
| REQ-STORY-005 | Der bestehende KI-Interview-Assistent für User Stories bleibt und erzeugt künftig Akzeptanzkriterien als Liste. | S | 3 | 🔧 |
| REQ-STORY-006 | User Stories und Akzeptanzkriterien sind in allen Vorgehensmodellen verfügbar, nicht nur in Scrum (z. B. als Anforderungsbasis im Wasserfall). | M | 1 | 🆕 |

### 6.7 Projektstrukturplan (REQ-PSP)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-PSP-001 | Der **Projektstrukturplan** wird als Baumdiagramm von oben nach unten dargestellt: Projekt → Teilprojekte → Teilaufgaben → **Arbeitspakete**. Alternativ als eingerückte Liste. | M | 2 | 🆕 |
| REQ-PSP-002 | Jedes Element erhält automatisch einen **PSP-Code** (z. B. `1.2.3`). Beim Umsortieren werden die Codes neu vergeben; der bisherige Code bleibt in der Historie. | M | 2 | 🆕 |
| REQ-PSP-003 | Elemente können im Diagramm per Klick angelegt und per Ziehen umgehängt werden. Die Änderung wirkt sofort auf Gantt, Liste und alle anderen Ansichten. | M | 2 | 🆕 |
| REQ-PSP-004 | Gliederung wahlweise **objektorientiert** (nach Baugruppen, z. B. Mechanik/Elektrik/Software), **funktionsorientiert** (nach Tätigkeiten) oder **phasenorientiert** (nach Projektphasen). Die gewählte Gliederung wird beim Anlegen aus der Vorlage übernommen. | S | 2 | 🆕 |
| REQ-PSP-005 | **Arbeitspaketbeschreibung** je Arbeitspaket: Ziel, Inhalt, Ergebnis/Liefergegenstand, Voraussetzungen, Aufwand, Kosten, Verantwortlicher, Start, Ende, Abnahmekriterien. | M | 2 | 🆕 |
| REQ-PSP-006 | Jedes Element zeigt Fortschritt, Verantwortlichen und Ampel; Aufwand und Kosten werden von unten nach oben summiert. | M | 2 | 🆕 |
| REQ-PSP-007 | Die RACI-Matrix (vorhanden) verwendet die Arbeitspakete des PSP als Zeilen. | S | 2 | 🔧 |
| REQ-PSP-008 | Export als PDF (A3 quer) und Excel. | S | 2 | 🆕 |

### 6.8 Projektanalysen grafisch (REQ-ANA)

Alle Analysen sind **grafisch und tabellarisch** umschaltbar. Änderungen in der Grafik (z. B. Ziehen eines Faktors) wirken auf dieselben Daten wie die Tabelle.

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-ANA-001 | **Scope-Diagramm:** Projekt als Systemgrenze in der Mitte; „im Scope“ innerhalb, „nicht im Scope“ außerhalb, Schnittstellen zu Nachbarsystemen als Pfeile. Einträge per Ziehen zwischen innen und außen verschieben. Grundlage sind `scope_im` und `scope_out`, künftig als Einzeleinträge statt Freitext. | M | 3 | 🔧 |
| REQ-ANA-002 | **Kontext- und Umfelddiagramm:** Projekt im Zentrum, innerer Ring **intern**, äußerer Ring **extern**, linke Hälfte **sachlich**, rechte Hälfte **sozial** (Personen, Gruppen). Kreisgröße nach Wichtigkeit, Farbe nach Einstellung zum Projekt (unterstützend grün, neutral grau, kritisch rot). Grundlage ist die vorhandene Tabelle `kontextfaktoren`. | M | 3 | 🔧 |
| REQ-ANA-003 | **Stakeholder-Portfolio:** Matrix Einfluss × Einstellung (bzw. Einfluss × Betroffenheit) mit den Stakeholdern als Punkte; Quadranten mit Strategie (einbinden, zufriedenstellen, informieren, beobachten). Punkte per Ziehen umsetzen. | M | 3 | 🆕 |
| REQ-ANA-004 | **Stacey-Matrix:** Achsen **Anforderungsklarheit** und **Lösungs-/Technologiesicherheit** als stufenlose Skala statt nur „klar/unklar“; Zonen einfach, kompliziert, komplex, chaotisch farbig hinterlegt. Das Projekt ist ein ziehbarer Punkt; das empfohlene Vorgehensmodell (`empfehle_vorgehensmodell`) erscheint sofort. Die Bewertung kann im Verlauf wiederholt werden; der Verlauf des Punkts wird angezeigt. | M | 3 | 🔧 |
| REQ-ANA-005 | **RACI-Matrix** als echte Matrix: Zeilen = Arbeitspakete (aus dem PSP, REQ-PSP-007), Spalten = Personen und Teams, Zellen = R, A, C, I farbig. Zelle per Klick durchschalten. Prüfung: genau ein **A** pro Zeile, mindestens ein **R**; Verstöße rot markiert. | M | 3 | 🔧 |
| REQ-ANA-006 | **AKV-Darstellung** (Aufgaben, Kompetenzen, Verantwortung) wahlweise als **Tabelle** (Person × A/K/V) oder als **Diagramm** (je Person eine Karte bzw. ein Dreieck mit den drei Feldern). Warnung, wenn Verantwortung ohne passende Kompetenz eingetragen ist. | M | 3 | 🔧 |
| REQ-ANA-007 | **Risikomatrix** (Eintrittswahrscheinlichkeit × Tragweite) mit Risiken als Punkte; Vorher- und Nachher-Position (Restrisiko) mit Pfeil verbunden. | M | 3 | 🔧 |
| REQ-ANA-008 | Alle Analysediagramme sind als PNG und PDF exportierbar und in Dokumente bzw. Statusberichte einbindbar. | S | 3 | 🆕 |
| REQ-ANA-009 | Die KI-Analyse für Scope, Kontext und Umfeld (`analysiere_scope_kontext_umfeld`) befüllt die Diagramme als Vorschlag, den der Nutzer übernimmt oder verwirft. | S | 3 | 🔧 |

---

## 7. Zeit, Kapazität und Priorität

### 7.1 Dauer aus Aufwand und Projektanteil (REQ-KAP)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-KAP-001 | Tasks haben einen **Aufwand** in Stunden (aus Aufwandsklasse vorbelegt, frei änderbar). Die **Dauer** in Arbeitstagen wird berechnet als: Dauer = Aufwand ÷ (planbare Stunden pro Tag × Projektanteil der Person), siehe REQ-KAP-008. Beispiel: 35-h-Woche, Planungsfaktor 80 % → 5,6 h/Tag planbar; 16 h Aufwand bei 50 % Anteil = 16 ÷ 2,8 ≈ 5,7 → 6 Arbeitstage. | M | 3 | 🆕 |
| REQ-KAP-008 | **Planungsfaktor:** Von der Sollarbeitszeit ist nur ein Teil planbar, der Rest geht an Besprechungen, Ad-hoc-Anfragen, Störungen und Verwaltung. Der Faktor ist einstellbar: unternehmensweit (Standard 80 %, üblich sind 75 %), je Team und je Person überschreibbar. **Planbare Zeit = Sollarbeitszeit × Planungsfaktor**, z. B. 35 h × 80 % = 28 h pro Woche. | M | 3 | 🆕 |
| REQ-KAP-013 | **Gesetzt und vorgeschlagen:** In *Mein Tag* sind Fokusaufgaben, fällige und nicht geschaffte Aufgaben gesetzt. Für die restlichen freien Lücken schlägt die KI Aufgaben aus dem Backlog vor (Priorität, Fälligkeit, passende Dauer) mit Begründung; „Übernehmen“ oder „Anderer Vorschlag“. | S | 3 | 🆕 |
| REQ-KAP-014 | **Übertrag:** Eine an einem Tag eingeplante Aufgabe erscheint an späteren Tagen nicht mehr zum Einplanen, außer ihre Zeit ist vorbei und sie ist nicht erledigt („↻ Fr 07:00–07:30 nicht geschafft“) oder sie wurde nur teilweise eingeplant („↻ Rest 1 h“). Vorbei und offen wird im Tag markiert, mit „✓ erledigt“. | M | 3 | 🆕 |
| REQ-KAP-015 | **Abwesenheiten selbst eintragen:** Im Profil Urlaub, Schulung, Dienstreise, Gleittag oder Krank mit Zeitraum. Die Tage sind in Mein Tag und in der Tagesplanung des Teams sofort gesperrt. Das Cockpit listet, was in der Zeit fällig ist, mit „An Vertretung geben“ oder „Vorher erledigen“ (in den Fokus). Urlaube aus der Zeitwirtschaft werden übernommen. | M | 2 | 🆕 |
| REQ-KAP-016 | **Feiertage je Standort:** Jede Person hat einen Standort (Profil, Teamverwaltung). Teamplanung, Kapazität, Gantt und Fälligkeiten nutzen den Feiertagskalender dieses Standorts (Bundesland bzw. Land). Gemischte Teams zeigen Feiertage pro Person; ein Feiertag nur an einem Standort sperrt nur dessen Personen. | M | 2 | 🆕 |
| REQ-KAP-017 | **Eine Kapazitätsrechnung für alles:** 100 % = planbare Wochenstunden (Standard 35 h × 80 % = 28 h). Projektanteile werden je Person über alle Projekte summiert und an jeder Stelle gleich gezeigt: Team-Reiter („gesamt 130 % ⚠“), Einladen (Vorschau der Gesamtlast vor dem Hinzufügen), Teamplanung und Auslastung. Über 100 % wird gewarnt; die Klärung läuft über die Teamleitung. | M | 2 | 🆕 |
| REQ-KAP-009 | **Projektanteile beziehen sich auf die planbare Zeit.** Stunden je Projekt und Woche = planbare Zeit × Anteil (z. B. 28 h × 40 % = 11,2 h). Die Summe aller Anteile einer Person darf 100 % nicht überschreiten, sonst passt die Zuteilung nicht in ihre Kapazität und das System warnt. Wird ein Anteil erhöht oder gesenkt, ändern sich die verfügbaren Stunden und damit die Dauern der Tasks (REQ-KAP-003). | M | 3 | 🆕 |
| REQ-KAP-010 | Alle Auslastungsanzeigen (Heatmap, Workload, Meine Auslastung, Sprint-Kapazität) rechnen gegen die planbare Zeit. 100 % bedeutet: die planbare Zeit ist voll verplant. Umschaltbar auf eine Anzeige gegen die Sollarbeitszeit. | M | 3 | 🆕 |
| REQ-KAP-011 | Die Auswertung Plan gegen Ist zeigt, wie viel der tatsächlich gebuchten Zeit ungeplant war, und schlägt bei dauerhafter Abweichung eine Anpassung des Planungsfaktors vor (z. B. „Team Instandhaltung: Ø 34 % ungeplant, Faktor 66 % statt 80 % empfohlen“). | S | 3 | 🆕 |
| REQ-KAP-002 | Abwesenheiten (Urlaub, Krankheit, Schulung) und Feiertage verlängern die Dauer entsprechend. | M | 3 | 🆕 |
| REQ-KAP-003 | Ändert sich der Projektanteil einer Person, werden Dauer und Ende ihrer offenen Tasks neu berechnet und Nachfolger über die Abhängigkeiten nachgezogen. Vor dem Übernehmen zeigt das System die Auswirkung auf Meilensteine und Projektende an. | M | 3 | 🆕 |
| REQ-KAP-004 | Meilenstein- und Phasendauer ergeben sich aus ihren Tasks. Ein fest gesetzter Meilensteintermin, der dadurch nicht mehr haltbar ist, wird rot markiert. | M | 3 | 🆕 |
| REQ-KAP-005 | Pro Task kann statt der Berechnung eine feste Dauer gesetzt werden (z. B. Lieferzeit 6 Wochen, unabhängig vom Anteil). | M | 3 | 🆕 |
| REQ-KAP-006 | Sind mehrere Personen einem Task zugewiesen, wird der Aufwand auf sie verteilt; die Dauer richtet sich nach der Person, die am längsten braucht. | S | 3 | 🆕 |
| REQ-KAP-007 | Sollarbeitszeit pro Woche, Arbeitstage und Tagesverteilung pro Person sind einstellbar (Teilzeit, Schichtmodell). | M | 3 | 🆕 |
| REQ-KAP-012 | **Mein Tag:** Zeitachse des Arbeitstags im **30-Minuten-Raster** (Achse mit :30-Marken, Blöcke mit −30/+30) mit den Terminen aus Outlook (Microsoft 365) und den eingeplanten Aufgaben. Aufgaben aus Fokus und Fälligen werden per Ziehen oder Klick in eine freie Zeit gelegt; Überschneidungen werden abgewiesen. Das Cockpit zeigt Termine, Eingeplantes und freie Zeit und warnt, wenn der Fokus mehr Stunden braucht als frei sind. „Fokus automatisch einplanen“ füllt freie Lücken und kürzt, wenn nötig, mit Hinweis auf den Rest. | M | 3 | 🆕 |

### 7.2 Priorität und Ressourcenvergabe durch den Vorgesetzten (REQ-PRIO)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-PRIO-001 | Der Vorgesetzte (Rolle Geschäftsführung oder Bereichsleiter) legt die **Projektpriorität** fest (Rangfolge im Portfolio) und den **Projektanteil in %** je Mitarbeiter und Projekt. | M | 3 | 🔧 |
| REQ-PRIO-002 | Mitarbeiter können einen abweichenden Anteil **vorschlagen**. Der Vorschlag wird erst nach Freigabe durch den Vorgesetzten wirksam. (Ändert die bisherige Regel aus Migration 0006, nach der Nutzer ihren Anteil selbst setzen.) | M | 3 | 🔧 |
| REQ-PRIO-003 | Die Summe der Anteile einer Person über alle Projekte wird angezeigt; über 100 % der planbaren Zeit wird gewarnt. Der heutige Ad-hoc-Anteil (`kapazitaet_projekt_pct` 60 / `kapazitaet_adhoc_pct` 40) geht im Planungsfaktor (REQ-KAP-008) auf. | M | 3 | 🔧 |
| REQ-PRIO-004 | Die Projektpriorität fließt in den Dringlichkeits-Score der Tasks ein. | S | 3 | 🔧 |
| REQ-PRIO-005 | Jede Änderung von Priorität oder Anteil wird mit Begründung historisiert und den betroffenen Mitarbeitern gemeldet. | M | 3 | 🆕 |

### 7.3 Kapazitätsplanung und Qualifikationen (REQ-RES)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-RES-001 | **Kapazitäts-Heatmap**: Personen × Kalenderwochen, Zellenfarbe nach Auslastung (< 80 % grün, 80–100 % gelb, > 100 % rot). Filterbar nach Team und Abteilung. | M | 3 | 🆕 |
| REQ-RES-002 | **Abwesenheiten** pflegen: Urlaub, Krankheit, Schulung, Dienstreise, Bereitschaft. Import aus Outlook-Kalender optional. | M | 3 | 🆕 |
| REQ-RES-003 | **Qualifikationsmatrix**: Skill × Person mit Stufe 1–4 (1 = Grundkenntnis, 4 = kann schulen). Skills sind frei definierbar und gruppierbar (z. B. Elektrotechnik → „TIA Portal“, „EPLAN“). | M | 3 | 🔧 |
| REQ-RES-004 | **Zertifikate und Berechtigungen** mit Ablaufdatum (z. B. Elektrofachkraft, Schaltberechtigung, Staplerschein). Warnung 60 und 30 Tage vor Ablauf an Person und Vorgesetzten. | M | 3 | 🆕 |
| REQ-RES-005 | Tasks und Wartungsaufträge können **benötigte Skills** (mit Mindeststufe) und **benötigte Zertifikate** angeben. | M | 3 | 🆕 |
| REQ-RES-006 | **Zuteilungsvorschlag**: Für einen Auftrag listet das System passende Personen, sortiert nach Erfüllung der Skills, gültigen Zertifikaten, freier Kapazität im Zeitraum und Schicht. Die Begründung wird angezeigt. | M | 3 | 🆕 |
| REQ-RES-007 | Schichtmodelle (Früh, Spät, Nacht, Bereitschaft) und Schichtplan je Team. | S | 4 | 🆕 |
| REQ-RES-008 | Personen ohne Login (z. B. Produktion) bleiben planbar. | M | 3 | ✅ |
| REQ-RES-009 | **Automatischer Kapazitätsabgleich:** Auf Knopfdruck verschiebt das System Tasks innerhalb ihres Puffers bzw. ihrer Einschränkungen so, dass keine Person über 100 % ausgelastet ist. Reihenfolge nach Projektpriorität und Task-Priorität. | S | 3 | 🆕 |
| REQ-RES-010 | Der Abgleich läuft immer zuerst als **Vorschlag**: Liste der Verschiebungen mit altem und neuem Termin und Auswirkung auf Meilensteine. Übernahme ganz, teilweise oder gar nicht. | M | 3 | 🆕 |
| REQ-RES-011 | Elemente auf dem kritischen Pfad, fest terminierte Elemente und manuell terminierte Elemente werden nicht verschoben. Was sich nicht auflösen lässt, wird als Konflikt gemeldet. | M | 3 | 🆕 |
| REQ-RES-012 | **KI-Verteilungsvorschlag für die Teamleitung** (Erweiterung von REQ-RES-006): für die Woche je Aufgabe Person und Tag, für die Grobplanung je Bedarf Person und Startmonat. Reihenfolge: zuerst Qualifikation, dann Auslastung; in der Grobplanung darf die KI den Start um bis zu 3 Monate schieben, wenn es dann ohne Überlast passt. Geht es nicht ohne Überlast, sagt sie das offen („nur mit Mehrarbeit“, „Projektleitung fragen“) statt es zu verstecken. Einzeln oder alle übernehmen. | M | 3 | 🆕 |
| REQ-RES-013 | **Grobplanung bis 6 Monate:** je Person und Monat die Auslastung aus Projektanteilen, wiederkehrenden Aufgaben und zugewiesenen Bedarfen; Bedarfe aus Projekten ohne Person (z. B. „MES-Anbindung: SPS-Schnittstellen, 40 % von Januar bis Mai, Profinet ≥ 3“) werden per Ziehen oder Klick einer Person ab einem Monat zugeordnet. Wechsel zwischen Woche (Tage) und 6 Monaten. | M | 3 | 🆕 |
| REQ-RES-014 | **Wiederkehrende Aufgaben:** Jede Aufgabe kann sich wiederholen (täglich, wöchentlich, monatlich, quartalsweise, jährlich, nach Betriebsstunden, vgl. REQ-IH-002). Nach Erledigung legt das Cockpit die nächste an. Wiederkehrende Aufgaben zählen in Kapazität und Grobplanung und stehen je Team in einer Liste; Karten zeigen „🔁 wöchentlich“. | M | 2 | 🆕 |
| REQ-RES-015 | **Tagesplanung im Team bis 6 Monate:** Die Teamleitung verteilt Aufgaben auf Person und Tag für jeden Arbeitstag bis 26 Wochen voraus. Ansichten: *1 Woche* mit Details je Tag, *4 Wochen kompakt* als Raster mit Stunden je Tag; Blättern mit ‹ ›, Sprung zu Monat oder zur Fälligkeit einer Aufgabe. Jeder Tag rechnet: Projektanteile (aus der Grobplanung REQ-RES-013), wiederkehrende Aufgaben an ihrem echten Termin (z. B. „2. Dienstag“), verteilte Aufgaben. Urlaub, Schulung, Feiertage und Betriebsruhe sind gesperrt; in der Instandhaltung ist Betriebsruhe als Wartungsfenster planbar. Ein Klick auf einen Monat der Grobplanung öffnet ihn Tag für Tag. Die KI-Verteilung wählt bei späterer Fälligkeit den ersten passenden Tag bis dahin. | M | 3 | 🆕 |

### 7.4 Zeiterfassung und Wochenzettel (REQ-ZEIT)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-ZEIT-001 | Zeiten werden per Stoppuhr am Task oder manuell erfasst. | M | – | ✅ |
| REQ-ZEIT-002 | **Wochenzettel:** Raster Tasks × Wochentage zum schnellen Eintragen; geplante Tasks der Woche sind vorbelegt; Summe pro Tag und Woche, Abgleich gegen Soll-Arbeitszeit. | M | 3 | 🆕 |
| REQ-ZEIT-003 | Der Mitarbeiter **reicht** den Wochenzettel **ein**; der Vorgesetzte bzw. Projektleiter **gibt frei** oder **gibt mit Kommentar zurück**. Freigegebene Wochen sind gesperrt. | M | 3 | 🆕 |
| REQ-ZEIT-004 | Erinnerung an fehlende Wochenzettel (z. B. Freitag 14 Uhr) und Übersicht der offenen Freigaben für Vorgesetzte. | S | 3 | 🆕 |
| REQ-ZEIT-005 | Nur freigegebene Zeiten fließen in Budget-Ist, Rechnung und Kennzahlen; nicht freigegebene sind als „vorläufig“ gekennzeichnet. | M | 3 | 🔧 |
| REQ-ZEIT-006 | Export der Zeiten nach Excel bzw. CSV für Lohn- oder ERP-Systeme. | S | 3 | 🆕 |

### 7.5 Aufgaben anlegen, annehmen und freigeben (REQ-AUFG)

Wer eine Aufgabe für eine andere Person anlegt, durchläuft je nach Herkunft einen von vier Wegen. Maßgeblich sind das Team (REQ-TEAM) und der Chef laut Organisationsstruktur (REQ-ORG-004).

| Herkunft der Aufgabe | Freigabe durch Chef der Person | Annahme durch die Person |
|---|---|---|
| Ich lege sie für mich selbst an | nein | nein |
| **Im Projekt** (nach Projektrolle, REQ-RECHT) | nein | nein |
| Vom eigenen Chef (direkt oder höher in der Struktur) | nein | nein |
| **Von einem Kollegen aus meinem Team**, außerhalb eines Projekts | nein | **ja** |
| **Von außerhalb meines Teams**, außerhalb eines Projekts | **ja** | nein |

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-AUFG-001 | **Eigene Aufgaben:** Jeder kann für sich selbst Aufgaben anlegen, in einem Projekt (gemäß Projektrolle) oder ohne Projekt. Sie sind sofort aktiv und zählen in die eigene planbare Zeit (REQ-KAP-008). Würde die Auslastung einer Woche über 100 % steigen, erscheint vor dem Speichern ein Hinweis. | M | 1 | 🔧 |
| REQ-AUFG-002 | **Aufgaben im Projekt:** Wer laut Projektrolle Tasks zuweisen darf, weist Projektmitgliedern Aufgaben **direkt** zu, ohne Freigabe und ohne Annahme. Die Kapazität ist über den freigegebenen Projektanteil (REQ-PRIO-001) geregelt. Übersteigt die Summe der Projektaufgaben einer Person ihren Projektanteil, warnt das System den Projektleiter. | M | 1 | 🔧 |
| REQ-AUFG-003 | **Von Teamkollegen:** Mitglieder desselben Teams können sich außerhalb von Projekten gegenseitig Aufgaben zuordnen, **ohne Freigabe durch den Chef**. Die empfangende Person muss die Aufgabe **annehmen**; alternativ lehnt sie ab (mit Begründung) oder schlägt einen anderen Termin vor, den der Absender bestätigt. Erst nach der Annahme ist die Aufgabe aktiv und zählt in die Kapazität. | M | 1 | 🆕 |
| REQ-AUFG-004 | **Von außerhalb des Teams:** Kommt eine Aufgabe außerhalb eines Projekts von einer Person, die nicht im Team der empfangenden Person ist, muss der **Chef der empfangenden Person** sie freigeben (bei Abwesenheit die Vertretung). Bis dahin hat sie den Status „Angefragt – wartet auf Freigabe“, ist für die empfangende Person sichtbar, zählt aber nicht in die Kapazität und kann nicht gebucht werden. Nach der Freigabe ist sie ohne weitere Annahme aktiv. | M | 1 | 🆕 |
| REQ-AUFG-005 | Die Freigabe nach REQ-AUFG-004 erscheint im Posteingang des Chefs mit Titel, Anfragendem, Aufwand, Fälligkeit und der **Auswirkung auf die Auslastung** der Person je Woche (vorher → nachher, bezogen auf die planbare Zeit). **Entscheidungen:** Freigeben · Freigeben mit Änderung (Termin, Aufwand) · an eine andere Person geben (mit Zuteilungsvorschlag nach Kapazität und Qualifikation, REQ-RES-006) · Rückfrage · Ablehnen mit Pflichtbegründung. Beide Seiten werden benachrichtigt. | M | 1 | 🆕 |
| REQ-AUFG-006 | **Vom eigenen Chef:** Ist der Anlegende Chef der empfangenden Person (direkt oder höher in der Struktur), ist die Aufgabe sofort aktiv. | M | 1 | 🆕 |
| REQ-AUFG-007 | **Einwand:** Bei einer Anfrage nach REQ-AUFG-004 kann die empfangende Person vor der Entscheidung einen Einwand schreiben (z. B. „Termin zu knapp“). Er wird dem Chef in der Freigabe angezeigt. | M | 1 | 🆕 |
| REQ-AUFG-008 | Beim Anlegen zeigt das Formular den zutreffenden Weg als Ablauf (z. B. „Du gibst ab → M. Yilmaz nimmt an → M. Yilmaz arbeitet“), die Auslastung der Person vorher und nachher sowie ihr Team und ihren Chef. Der Knopf benennt die Folge: „Aufgabe zuweisen“, „An … senden“ oder „Zur Freigabe senden“. | M | 1 | 🆕 |
| REQ-AUFG-009 | **Erinnerung und Eskalation:** Offene Annahmen erinnern die empfangende Person nach 1 Arbeitstag; offene Freigaben erinnern den Chef nach 2 und gehen nach 5 Arbeitstagen zusätzlich an die Vertretung (Fristen einstellbar). Der Absender sieht jederzeit den Stand („Wartet auf Annahme durch M. Yilmaz“, „Wartet auf Freigabe S. Keller seit 3 Tagen“). | S | 3 | 🆕 |
| REQ-AUFG-010 | **Anfrage an ein ganzes Team:** Geht eine Aufgabe an @Team, landet sie im Team-Eingang. Kommt sie von außerhalb des Teams, entscheidet die Teamleitung über Annahme und Zuweisung; die Zuweisung an ein Mitglied gilt dann als Freigabe. | S | 3 | 🆕 |
| REQ-AUFG-011 | Jede Anfrage, Annahme, Ablehnung und Freigabe wird mit Zeitpunkt, Personen und Begründung historisiert und ist am Task sichtbar. Ändert der Absender nachträglich Aufwand oder Termin über einen einstellbaren Schwellwert hinaus, läuft derselbe Weg erneut. | M | 1 | 🆕 |
| REQ-AUFG-012 | **Teamleitung verteilt direkt:** Aufgaben aus dem Team-Eingang weist die Teamleitung ohne Annahme zu, in einem **Wochenplan** Person × Tag mit Stunden je Tag gegen die planbare Zeit, vorhandenen Aufgaben und Abwesenheiten. Ziehen auf Person und Tag oder Klick-Klick; die Zelle zeigt beim Auswählen, ob die Qualifikation passt; Überlast und fehlende Qualifikation werden gemeldet, aber nicht verhindert. | M | 3 | 🆕 |
| REQ-AUFG-013 | **„Neu“ ist kontextabhängig:** Ein Menü legt Aufgabe, Meilenstein, Quality Gate (mit Checklisten-Vorlage und Entscheider), Phase/Arbeitspaket oder Projektantrag an. Im Projekt ist das Projekt vorbelegt; „Außerhalb des Projekts anlegen“ hebt das auf. Meilensteine und Gates erscheinen sofort im Gantt, in den Meilensteinen und im Kalender. | M | 2 | 🆕 |
| REQ-AUFG-014 | **Mehrere Beteiligte im Projekt:** Eine Aufgabe hat genau eine verantwortliche Person und beliebig viele, die mitarbeiten; im Projekt ohne Annahme. Der Aufwand wird gleich verteilt (änderbar) und zählt anteilig in Personen-Ansicht und Kapazität; Kalender und Karten zeigen „+n“. Außerhalb eines Projekts bleibt es bei einer Person, Mithilfe läuft als eigene Aufgabe mit Annahme bzw. Freigabe (REQ-AUFG-002 ff.). Meilensteine und Gates haben eine verantwortliche Person und weitere Beteiligte. | M | 2 | 🆕 |
| REQ-AUFG-015 | **Aufgabe an ein Team geben:** Beim Anlegen gibt es „Ich“, „Eine Person“ und „Ein Team“. An ein Team geht die Aufgabe in den Team-Eingang; die Teamleitung (oder jemand aus dem Team) verteilt sie in der Tagesplanung. Optional: welche Qualifikation nötig ist. Bis zur Verteilung zählt sie in die Team-Kapazität. Unter „Von mir vergeben“ sieht der Absender, wer sie bekommen hat. | M | 2 | 🆕 |
| REQ-AUFG-016 | **Anlegen-Dialog übersichtlich:** gegliedert in *Was*, *Wer*, *Wann und wie viel*, *Projekt*; Selteneres (Wiederholen, Arbeiten mit) unter „Weitere Optionen“ eingeklappt, mit Zusammenfassung in der Kopfzeile. Personenliste kompakt einzeilig. | M | 2 | 🆕 |
| REQ-AUFG-017 | **Aufgaben-Detail wie in Planner:** Titel direkt im Kopf bearbeiten, runder Erledigt-Kreis daneben; Eigenschaften als kompakte Zeilen mit Symbol (Projekt, Bucket, Priorität, Fällig), Auswahl klappt in der Zeile auf. Prioritäten: Dringend, Hoch, Mittel, Niedrig. | M | 2 | 🆕 |
| REQ-AUFG-018 | **Checkliste an der Aufgabe:** Punkte hinzufügen, abhaken, umbenennen, nach oben schieben, löschen; Fortschrittsbalken und „2 von 5 erledigt“. Karten zeigen „☑ 2/5“. | M | 2 | 🆕 |
| REQ-AUFG-019 | **Etiketten:** sechs farbige Etiketten je Projekt (z. B. Mechanik, Elektrik, Software, Kunde, Einkauf, Sicherheit), umbenennbar in den Projekteinstellungen › Etiketten (mit Anzahl der Aufgaben je Etikett); an der Aufgabe an- und abwählen, auf Karten sichtbar, in Listen filterbar. | S | 2 | 🆕 |
| REQ-AUFG-020 | **Filterleiste in allen Aufgaben-Ansichten** (Liste, Board, Kalender, Personen, in Projekten und in Meine Arbeit): Stichwort, Person (inkl. „Mir zugewiesen“ und Beteiligte), Priorität, Fällig (überfällig, heute, diese Woche, nächste Woche, später), Etikett. Aktive Filter sind hervorgehoben, „Filter löschen“ und „5 von 30 Aufgaben“. Der Filter gilt je Ansicht und bleibt beim Wechsel zwischen Liste und Board erhalten. | M | 2 | 🆕 |
| REQ-AUFG-021 | **Aufgaben direkt am Meilenstein, Gate oder Arbeitspaket anlegen:** Im Detail unter „Aufgaben“ eine Eingabezeile mit Titel, Fälligkeit (Vorschlag: Ende des Meilensteins) und Person aus dem Projekt; die Aufgabe hängt sofort am Meilenstein und zählt in dessen Fortschritt. Liegt die Fälligkeit nach dem Ende, weist das Cockpit darauf hin. „Vorhandene zuordnen“ hängt Aufgaben des Projekts ohne Meilenstein mit einem Klick an. | M | 2 | 🆕 |
| REQ-AUFG-022 | **Gruppieren nach** in der Liste: Meilenstein bzw. Sprint (Standard im Projekt), Status (Standard in Meine Arbeit), Bucket, Person, Fälligkeit, Priorität, Etikett. Gruppen ohne Aufgaben werden ausgeblendet; die Gruppierung gilt je Ansicht. | M | 2 | 🆕 |
| REQ-AUFG-023 | **Gespeicherte Ansichten:** Filter und Gruppierung als Knopf speichern („+ Als Ansicht speichern“, Name aus den Filtern, z. B. „Meine · Überfällig“). Ein Klick stellt sie wieder her, die aktive ist hervorgehoben, ✕ löscht. Je Projekt und in Meine Arbeit eigene Ansichten; Vorschläge wie „Meine überfälligen“ sind mitgeliefert. | S | 2 | 🆕 |
| REQ-AUFG-024 | **Titel von Meilensteinen, Gates und Phasen** direkt im Kopf des Details bearbeiten, wie bei Aufgaben (ohne Erledigt-Kreis; Gates werden über die Gate-Entscheidung abgeschlossen). | M | 2 | 🆕 |
| REQ-AUFG-025 | **Untermeilensteine, Gates und Arbeitspakete direkt im Detail anlegen:** In Phasen und Arbeitspaketen steht unter „Untermeilensteine und Gates“ eine Zeile mit Art (◆ Meilenstein, ◈ Quality Gate mit Standard-Checkliste, ▭ Arbeitspaket mit Beginn und Ende), Name, Termin und Verantwortlich bzw. Entscheider. Das neue Element erscheint sofort im Gantt; liegt es später, verlängert sich das übergeordnete Element und die Meldung sagt das. Ende vor Beginn wird abgelehnt. *Im Entwurf zusätzlich in der Planung: Phase mit Beginn und Ende, Meilenstein mit Termin, Gate mit „Fällig am“, Phase wählbar; Termine in der Spalte „Termin“ direkt änderbar (Owner, Bearbeiter), Zeitstrahl mit „‹ früher / später ›“.* | M | 2 | 🆕 |

---

## 8. Teams, Rollen und Berechtigungen

### 8.1 Teams (REQ-TEAM)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-TEAM-001 | Teams können angelegt werden (z. B. Konstruktion, Instandhaltung, Automatisierung, Softwareentwicklung). Ein Team hat Mitglieder und einen oder mehrere Teamleiter. Eine Person kann mehreren Teams angehören. | M | 1 | 🆕 |
| REQ-TEAM-002 | In Kommentaren, Logbuch und Interaktionen kann ein ganzes Team per **@Team** angesprochen werden (z. B. `@Instandhaltung`). Alle Mitglieder erhalten eine Benachrichtigung. | M | 1 | 🆕 |
| REQ-TEAM-003 | Arbeitsobjekte können einem **Team** statt einer Person zugewiesen werden. Sie landen im Team-Eingang; der Teamleiter oder ein Mitglied übernimmt sie. | M | 1 | 🆕 |
| REQ-TEAM-004 | Jedes Team hat ein eigenes Board und eine Kapazitätsübersicht über alle Projekte. | S | 3 | 🆕 |
| REQ-TEAM-005 | Teams können als Ganzes einem Projekt mit einer Projektrolle hinzugefügt werden (Kapitel 8.3). | M | 1 | 🆕 |

### 8.2 Erwähnungen und Benachrichtigungen (REQ-KOMM)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-KOMM-001 | Kommentare an jedem Arbeitsobjekt, mit @Person und @Team, Anhängen und Antworten (Threads). | M | 1 | 🆕 |
| REQ-KOMM-002 | Benachrichtigungscenter in der App (gelesen/ungelesen) mit Link auf das Objekt. | M | 1 | 🆕 |
| REQ-KOMM-003 | Benachrichtigungen zusätzlich per Mail (sofort oder als tägliche Zusammenfassung) und optional an Microsoft Teams bzw. Slack. Einstellbar pro Nutzer. | S | 6 | 🔧 |
| REQ-KOMM-004 | Nutzer können Objekte beobachten und erhalten dann alle Änderungen. | S | 1 | 🆕 |
| REQ-KOMM-005 | Jede Aufgabe hat im Detailpanel einen Bereich **Kommentare und Nachrichten** mit Verlauf und Eingabefeld; @Person und @Team benachrichtigen im Posteingang, Antworten auf die Benachrichtigungs-Mail landen im Verlauf. | M | 1 | 🆕 |
| REQ-KOMM-006 | **Begründung als Text:** Einwand, Ablehnung, anderer Termin, Rückfrage, Antwort, Zurückstellen, „mit Kommentar zurückgeben“ und Gate-Auflagen öffnen ein Textfeld mit anklickbaren Vorschlägen. Ohne Text wird nicht gesendet (außer wo freiwillig). Die Gegenseite sieht den Text wörtlich. | M | 1 | 🆕 |
| REQ-KOMM-007 | **Benachrichtigungen (Glocke) in der Kopfzeile:** Zähler ungelesen, Liste mit Filter Alle, @Erwähnungen, Freigaben, Fristen; Klick springt zum Objekt und markiert gelesen; „Alle gelesen“; ⚙ führt zu den Einstellungen. Auch Rückmeldungen wie „R. Fischer hat … an D. Petrov gegeben“. | M | 2 | 🆕 |
| REQ-KOMM-008 | **Besprechungen mit Protokoll:** In Meine Arbeit › Besprechungen stehen die Termine aus Outlook mit Teilnehmern und Tagesordnung. Mitschrift frei tippen; „✨ Protokoll aus Mitschrift“ trennt Beschlüsse, Informationen und Maßnahmen (Wer, Bis). Maßnahmen werden einzeln oder alle als Aufgaben angelegt (externe als Erinnerung beim Protokollführer). Protokoll an die Teilnehmer senden und unter Dokumente ablegen. | M | 2 | 🆕 |
| REQ-KOMM-009 | **Aufgaben-Anfragen im Posteingang:** Anfragen anderer an mich (annehmen, anderer Termin, ablehnen, Einwand) und „Von mir vergeben“ stehen als aufklappbarer Bereich im Posteingang, nicht mehr als eigener Reiter in Meine Arbeit. Meine Arbeit zeigt nur einen Hinweis „2 Aufgaben-Anfragen warten im Posteingang ›“. | M | 2 | 🆕 |

### 8.3 Berechtigungen (REQ-RECHT)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-RECHT-001 | **Systemrollen:** Administrator, Geschäftsführung/Vorgesetzter, Projektleiter, Mitarbeiter, Gast. | M | 0 | 🔧 |
| REQ-RECHT-002 | **Projektrollen** je Projekt, vergeben an Personen oder Teams: **Owner** (alles inkl. Rechtevergabe und Löschen), **Bearbeiter** (anlegen und ändern), **Mitwirkender** (nur eigene bzw. zugewiesene Objekte ändern, kommentieren), **Leser** (nur lesen), **Gast** (nur freigegebene Bereiche lesen und kommentieren). | M | 1 | 🆕 |
| REQ-RECHT-003 | Rechte werden pro Modul feiner einstellbar: z. B. Budget und Rechnung nur für Owner und Geschäftsführung sichtbar. | M | 1 | 🆕 |
| REQ-RECHT-004 | Der Vorgesetzte hat **Leserecht auf alle Projekte** seiner Mitarbeiter bzw. seines Bereichs, einschließlich Projekten, die ein Mitarbeiter selbst angelegt hat. Schreibrecht nur, wenn er im Projekt eine Rolle mit Schreibrecht hat. | M | 1 | 🆕 |
| REQ-RECHT-005 | Jede Abfrage wird serverseitig nach Firma und Berechtigung gefiltert. Die Oberfläche blendet nur aus, sie ist nicht die Sicherung. | M | 0 | 🆕 |
| REQ-RECHT-006 | Gäste sehen nur Projekte, zu denen sie eingeladen wurden, und dort nur freigegebene Objekte. | S | 6 | 🆕 |
| REQ-RECHT-007 | Persönliche Notizen und private Tasks können als „privat“ markiert werden und sind dann nur für den Ersteller sichtbar. Für Vorgesetzte gilt REQ-RECHT-004 dafür nicht: sie sehen weder Titel noch Inhalt, in Auslastung und Teamplanung nur einen Block „privat“ (OP-03, entschieden). | M | 1 | 🆕 |
| REQ-RECHT-008 | Änderungen an Rollen und Rechten werden im Audit-Log festgehalten. | M | 1 | 🆕 |
| REQ-RECHT-009 | Der **Projektleiter ist Administrator seines Projekts** (Projektrolle Owner). Er verwaltet Mitglieder, Teams und Projektrollen selbst, ohne den System-Administrator. | M | 1 | 🆕 |
| REQ-RECHT-010 | Der Projektleiter kann **eigene Projektrollen** anlegen, umbenennen und löschen (z. B. „Konstrukteur“, „Inbetriebnehmer“, „Kunde“). Die Rollen aus REQ-RECHT-002 sind vorbelegt und änderbar. | M | 1 | 🆕 |
| REQ-RECHT-011 | Pro Projektrolle wird je **Berechtigungsbereich** eine Stufe festgelegt: *kein Zugriff*, *lesen*, *nur eigene/zugewiesene ändern*, *anlegen und ändern*, *löschen*. Bereiche siehe Tabelle unten. | M | 1 | 🆕 |
| REQ-RECHT-012 | Die Oberfläche passt sich der Rolle an: Fehlt z. B. das Recht „Ablaufplan ändern“, sind Gantt und V-Diagramm nur lesbar (kein Ziehen, keine Tabellenbearbeitung). Der Server prüft jede Aktion zusätzlich (REQ-RECHT-005). | M | 1 | 🆕 |
| REQ-RECHT-013 | Ein Projekt hat immer mindestens einen Owner. Der letzte Owner kann sich nicht selbst entfernen oder herabstufen. | M | 1 | 🆕 |
| REQ-RECHT-014 | Projektrollen samt Berechtigungen werden mit der Projektvorlage gespeichert (REQ-VORL-001). | S | 3 | 🆕 |
| REQ-RECHT-015 | Eine Matrix „Rolle × Berechtigungsbereich“ zeigt dem Projektleiter alle Rechte auf einer Seite; ein Prüfmodus „Projekt ansehen als Rolle X“ zeigt die Sicht dieser Rolle. | S | 2 | 🆕 |

**Berechtigungsbereiche je Projekt (REQ-RECHT-011)**

| Bereich | Beispiele für Aktionen |
|---|---|
| Ablaufplan | Phasen, Meilensteine, Termine, Abhängigkeiten, kritischen Pfad, Baseline ändern (Gantt, V-Modell) |
| Quality Gates | Gates anlegen, Checkliste pflegen, Gate freigeben (Freigeben ist ein eigenes Recht) |
| Tasks | anlegen, ändern, zuweisen, löschen; „nur eigene“ für Mitwirkende |
| Board | Buckets anlegen, umbenennen, löschen, WIP-Limits setzen |
| Backlog und Sprints | Stories priorisieren, Sprint planen, Sprint abschließen, Review und Retro |
| Dateien | hochladen, neue Version ablegen, löschen |
| Dokumente | Lasten-/Pflichtenheft und Berichte bearbeiten, Status „final“ setzen |
| Anforderungen und Tests | Anforderungen ändern, Baselines, Change Requests stellen bzw. freigeben, Testergebnisse eintragen |
| Risiko, RACI, AKV | ansehen, ändern |
| Budget, Zeiten, Belege, Rechnung | ansehen, buchen, ändern, freigeben |
| Kommentare und Logbuch | lesen, schreiben, fremde Beiträge löschen |
| Mitglieder und Rollen | einladen, entfernen, Rollen vergeben, Rollen definieren |
| Projekteinstellungen | Stufe, Module, Vorgehensmodell, archivieren, löschen |

### 8.4 Organisationsstruktur (REQ-ORG)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-ORG-001 | Der Administrator pflegt die **Organisationsstruktur** als Baum: Unternehmen → Standort → Bereich → Abteilung → Team (Ebenen frei benennbar). | M | 1 | 🆕 |
| REQ-ORG-002 | Jede Organisationseinheit hat eine **Leitung** (eine oder mehrere Personen) und Mitglieder. Jede Person hat genau einen **disziplinarischen Vorgesetzten** und optional fachliche Vorgesetzte. | M | 1 | 🆕 |
| REQ-ORG-003 | Ein **Organigramm** zeigt die Struktur grafisch; Personen und Einheiten lassen sich per Ziehen umhängen. Ein Klick auf eine Einheit zeigt Mitglieder, Projekte und Auslastung. | S | 3 | 🆕 |
| REQ-ORG-004 | Die Struktur bestimmt, wer „Chef“ im Sinne von REQ-PRIO-001, REQ-RECHT-004, REQ-ZEIT-003, REQ-AUFG-004 und REQ-ANTRAG ist: der disziplinarische Vorgesetzte bzw. die Leitung der Einheit, aufwärts entlang der Struktur. | M | 1 | 🆕 |
| REQ-ORG-005 | **Benutzergruppen** (z. B. „Freigeber Rechnung“, „Gate-Prüfer Elektrik“) sind unabhängig von der Struktur definierbar und als Empfänger in Rechten, Freigaben, Automatisierungen und Erwähnungen nutzbar. | M | 1 | 🆕 |
| REQ-ORG-006 | **Vertretung:** Ein Vorgesetzter kann für einen Zeitraum eine Vertretung mit seinen Freigaberechten benennen. | S | 3 | 🆕 |
| REQ-ORG-007 | Organisationseinheiten und Vorgesetzte können aus Entra ID übernommen werden (Attribute `department`, `manager`), ergänzend zu REQ-INT-009. | C | 6 | 🆕 |
| REQ-ORG-008 | Änderungen an der Struktur werden historisiert; Freigaben und Auswertungen verwenden die zum jeweiligen Zeitpunkt gültige Struktur. | S | 3 | 🆕 |
| REQ-ORG-009 | **Umhängen und offene Freigaben:** Wechselt eine Person die Einheit, gehen ihre **offenen** Freigaben und Annahmen sofort an den neuen Chef bzw. das neue Team; bereits entschiedene bleiben beim bisherigen Chef. Das System zeigt vor dem Speichern, wie viele offene Vorgänge betroffen sind. | M | 1 | 🆕 |
| REQ-ORG-010 | **Freigabewege an einer Stelle:** Die Verwaltung zeigt alle Freigabewege (Aufgabe im Projekt, von Teamkollegen, von außerhalb des Teams, Wochenzettel, Projektanteil, Projektantrag, Quality Gate) mit Entscheider und **Erinnerungsfrist in Arbeitstagen**. Fristen und Schwellen (z. B. Antrag ab 100 T€ zusätzlich an die Geschäftsführung) sind dort einstellbar. | M | 1 | 🆕 |
| REQ-ORG-011 | Die **Verwaltung** ist über das Profilbild erreichbar, nicht über die Hauptnavigation (REQ-NAV-001). Bereiche: Organigramm, Personen, Freigabewege, Gruppen und Vertretung. Sichtbar nur für Administratoren; Vorgesetzte sehen ihre eigene Einheit und ihre Vertretung. | M | 1 | 🆕 |

---

## 9. Portfolio, Berichte und Lessons Learned

### 9.1 Portfolio und Berichte (REQ-PORT)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-PORT-001 | Portfolio-Ansicht für Vorgesetzte: alle Projekte mit Priorität, Ampel (Termin, Kosten, Qualität), Fortschritt, nächster Meilenstein, Projektleiter. | M | 3 | 🆕 |
| REQ-PORT-002 | Projekt-Zeitstrahl über alle Projekte (Gantt auf Projektebene). | S | 3 | 🆕 |
| REQ-PORT-003 | Statusbericht je Projekt (KI-gestützt, vorhanden) mit Export als PDF und Word. | M | 3 | 🔧 |
| REQ-PORT-004 | Eigene Dashboards aus Widgets. Ersetzt durch Kapitel 4.6 (REQ-DASH), dort mit Prio M in Phase 3. | – | – | gestrichen |
| REQ-PORT-005 | Wochenbericht bleibt erhalten. | M | – | ✅ |
| REQ-PORT-006 | **Kapazitätsdeckung nach Priorität:** je Team Bedarf (h/Woche aus den Projektanteilen) gegen planbare Kapazität (REQ-KAP-008). Die Projekte werden in der Rangfolge aus REQ-PRIO-001 eingeplant; der nicht gedeckte Teil wird je Projekt und Team ausgewiesen (Balken mit Kapazitätslinie, rot schraffiert) und in der Portfolio-Tabelle als Spalte „Ressourcen“ gezeigt. Ändert der Vorgesetzte die Rangfolge, rechnet die Ansicht sofort neu. | M | 3 | 🆕 |
| REQ-PORT-007 | Der Portfolio-Statusbericht (alle Projekte, Ampeln, Stand, nächste Schritte, Ressourcen, **Entscheidungsbedarf**) wird aus den Daten erzeugt, kann je Projekt ergänzt und **zeitgesteuert** verschickt werden (z. B. jeden Freitag 12:00 an die Geschäftsführung). | S | 3 | 🆕 |
| REQ-PORT-008 | Die Kennzahl-Kacheln über dem Portfolio (kritisch, Ressourcenlücke, noch nicht gestartet) filtern die Tabelle per Klick (REQ-DASH, Drill-down). | M | 3 | 🆕 |

### 9.2 Lessons Learned (REQ-LL)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-LL-001 | Lessons Learned können **jederzeit im Projekt** erfasst werden, nicht nur am Ende: Was ist passiert, Ursache, Auswirkung (Zeit, Kosten, Qualität), was lief gut bzw. schlecht, **Empfehlung** für künftige Projekte. | M | 3 | 🔧 |
| REQ-LL-002 | Einträge werden verschlagwortet: Fachbereich, Phase, Anlage/Produkt, Kunde, Lieferant, Vorgehensmodell, freie Tags. | M | 3 | 🆕 |
| REQ-LL-003 | **Abschluss-Retrospektive** beim Projektende: geführter Ablauf mit Soll-Ist-Vergleich (Termin, Kosten, Aufwand aus Baseline und Zeiterfassung), Sammeln der Lessons Learned, Bewertung durch die Beteiligten, Abschlussbericht als PDF. Das Projekt kann erst nach diesem Schritt auf „Beendet“ gesetzt werden (abschaltbar). | M | 3 | 🔧 |
| REQ-LL-004 | Lessons Learned aller Projekte bilden eine **projektübergreifende Wissensdatenbank**, durchsuchbar (REQ-SUCHE-001) und filterbar nach den Schlagworten; gemeinsam mit dem Technik-Gedächtnis. | M | 3 | 🔧 |
| REQ-LL-005 | Beim Anlegen eines Projekts und beim Start jeder Phase schlägt das System passende Lessons Learned aus ähnlichen Projekten vor (Schlagworte, Beschreibung, KI-Ähnlichkeit). Die bestehende KI-Analyse (`analysiere_lessons_learned`) wird dafür weiterverwendet. | M | 3 | 🔧 |
| REQ-LL-006 | Aus einer Lesson Learned können **Maßnahmen** entstehen: Task, neues Risiko im Risikoregister, Änderung an einer Projektvorlage oder Checkliste eines Quality Gates. Die Umsetzung der Maßnahme wird verfolgt. | M | 3 | 🆕 |
| REQ-LL-007 | Häufig wiederkehrende Probleme (gleiche Schlagworte in mehreren Projekten) werden in einer Auswertung sichtbar und fließen in die Risikovorschläge ein (`schlage_risiken_vor`). | S | 7 | 🔧 |
| REQ-LL-008 | Sichtbarkeit je Eintrag: Projekt, Bereich oder ganzes Unternehmen. Einträge können anonymisiert veröffentlicht werden. | S | 3 | 🆕 |
| REQ-LL-009 | Einträge im Bereich **Wissen** (Lessons Learned, Technik-Gedächtnis, Vorlagen) können als **„Hilfreich“** markiert werden. Die Zahl fließt in die Reihenfolge von Suche und Vorschlägen ein. Der Bereich zeigt „Für dich vorgeschlagen“ passend zu den nächsten Meilensteinen und Aufträgen des Nutzers, mit Begründung. | S | 3 | 🆕 |
| REQ-LL-010 | **KI pflegt Wissen und Vorlagen mit:** Die KI liest Kommentare, Doku, Gate-Protokolle und Abschlussberichte und schlägt vor: neue Lessons Learned (vorformuliert als Beobachtung, Ursache, Empfehlung), doppelte Einträge zusammenführen, Technik-Gedächtnis einer Anlage ergänzen, Vorlagen verbessern, wenn mehrere Projekte denselben Punkt ergänzen, und veraltete Einträge prüfen lassen. Jeder Vorschlag wird vor dem Speichern bearbeitet oder verworfen; nichts wird ohne Zustimmung geändert. Im Profil abschaltbar. | S | 4 | 🆕 |
| REQ-LL-011 | **Wissen übernehmen:** Eine Lesson Learned wird mit „Übernehmen“ eine Aufgabe im gewählten Projekt („Lesson anwenden: …“). Eine Vorlage aus Wissen steht danach im Projekt-Assistenten unter „+ Neues Projekt“, mit Phasen, Gates und Startaufgaben der zugehörigen Grundvorlage. | S | 3 | 🆕 |

### 9.3 Projektanträge, Bewertung und Zuteilung (REQ-ANTRAG)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-ANTRAG-001 | Jeder Nutzer kann einen **Projektantrag** einreichen: Titel, Problem bzw. Anlass, Ziel, erwarteter Nutzen, grober Aufwand und Kosten, gewünschter Termin, betroffene Bereiche, Anhänge. Entwürfe sind speicherbar. | M | 1 | ✅ |
| REQ-ANTRAG-002 | Der Antrag geht an den zuständigen Vorgesetzten laut Organisationsstruktur (REQ-ORG-004) bzw. an ein festgelegtes Gremium und erscheint dort im Posteingang. | M | 1 | 🔧 |
| REQ-ANTRAG-003 | **Bewertung** nach einstellbaren Kriterien mit Gewichtung (Standard: Nutzen, strategische Passung, Dringlichkeit, Risiko, Aufwand); daraus ein Punktwert. Mehrere Bewerter möglich; Mittelwert und Streuung sichtbar. | M | 3 | 🆕 |
| REQ-ANTRAG-004 | **Rückfragen** an den Antragsteller als Kommentar-Thread; Status „Rückfrage“ bis zur Antwort. | M | 1 | 🆕 |
| REQ-ANTRAG-005 | **Entscheidung:** genehmigt, zurückgestellt (mit Wiedervorlagedatum), abgelehnt (mit Begründung). Bei Genehmigung legt der Chef nur fest, **wer** das Projekt leitet, mit welcher **Priorität** im Portfolio und ab wann es startet, sowie die Frist für den Kick-off. **Wie** umgesetzt wird (Vorgehensmodell, Vorlage, User Stories, Erfolgsfaktoren) entscheidet die Projektleitung im Kick-off (REQ-ANTRAG-012); der Vorschlag aus dem Antrag wird ihr nur angezeigt. *(geändert)* | M | 3 | 🔧 |
| REQ-ANTRAG-006 | Der Antragsteller sieht jederzeit den Status seines Antrags (eingereicht, in Bewertung, Rückfrage, genehmigt, zurückgestellt, abgelehnt) und wird bei jeder Änderung benachrichtigt. | M | 1 | 🔧 |
| REQ-ANTRAG-007 | **Antragsportfolio** für Vorgesetzte: alle Anträge als Board nach Status und als Matrix Nutzen × Aufwand; Vergleich mit freier Kapazität der Teams (REQ-RES-001) vor der Entscheidung. | S | 3 | 🆕 |
| REQ-ANTRAG-009 | Der Antrag ist ein **geführter Ablauf in vier Schritten** (Idee · Einordnung · Aufwand und Termin · Prüfen und einreichen). In der Einordnung beantwortet der Antragsteller zwei Fragen (Klarheit des Ergebnisses, Bekanntheit der Technik); daraus schlägt das System die **Stacey-Zone, das Vorgehensmodell und die Stufe** vor (REQ-ANA). Der Vorschlag ist für den Chef sichtbar, aber nicht bindend. | M | 1 | 🆕 |
| REQ-ANTRAG-010 | Wählt der Antragsteller die betroffenen Bereiche, zeigt das Formular deren **heutige freie Kapazität** nach den aktuellen Portfolio-Prioritäten (REQ-PORT-006) mit dem Hinweis, dass Priorität und Start die Bereichsleitung festlegt. | S | 3 | 🆕 |
| REQ-ANTRAG-011 | Bei der Zuteilung (REQ-ANTRAG-005) wählt der Chef den **Rang im Portfolio**. Dabei zeigt eine Vorschau, ob der Bedarf des neuen Projekts gedeckt ist und **welche bestehenden Projekte wie viele Stunden pro Woche verlieren**. Nach dem Anlegen steht das Projekt sofort im Portfolio, in der Roadmap und in der Kapazitätsansicht. | M | 3 | 🆕 |
| REQ-ANTRAG-012 | **Pflicht-Kick-off nach der Genehmigung:** Die Projektleitung bekommt eine Aufgabe und eine Erinnerung (Glocke) und plant den Kick-off bis zur Frist: Datum, Uhrzeit, Dauer, Ort, Teilnehmer (Projektleitung, Antragsteller und Auftraggeber sind Pflicht), Einladung mit fester Agenda (Projekt erklären, Umfang, User Stories, Erfolgsfaktoren und Abnahmekriterien, Vorgehensmodell und Vorlage, Rollen, Risiken, nächste Schritte). Ein Termin nach der Frist wird markiert und dem Auftraggeber gemeldet. Bis zum Abschluss hat das Projekt den Status „Kick-off ausstehend“. | M | 3 | 🆕 |
| REQ-ANTRAG-013 | **Kick-off-Ergebnisse und Projektstart:** Im Kick-off werden Ziel, Erfolgsfaktoren (messbar, mit Vorschlägen), User Stories („Als … möchte ich … damit …“), Nicht im Umfang, Risiken, Vorgehensmodell und Vorlage festgehalten. „Kick-off abschließen“ geht erst mit Einladung, mindestens einem Erfolgsfaktor, einer User Story und einem Vorgehensmodell; dann entsteht das Projekt aus der Vorlage, User Stories werden Aufgaben, Erfolgsfaktoren werden die Checkliste der Gates und stehen in der Projektübersicht, Risiken im Risikoregister. | M | 3 | 🆕 |
| REQ-ANTRAG-008 | Optional ein **Antragsformular ohne Login** für andere Abteilungen oder Werke (vgl. externe Formulare), das als Antrag im System landet. | C | 6 | 🆕 |

### 9.4 Themen und strategischer Fokus (REQ-THEMA)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-THEMA-001 | **Themenkatalog**, gepflegt in der Verwaltung, mit Name und Farbe. Standard: Qualität · Umwelt · Audit und Normen · Kosteneinsparung · Steigerung Produktivität · Einsparung von Ressourcen · Entlastung Betriebspersonal · Arbeitsbedingungen und Sicherheit. Themen können ergänzt, umbenannt und archiviert werden. | M | 3 | 🆕 |
| REQ-THEMA-002 | Jedes Projekt und jeder Antrag hat **ein Hauptthema und bis zu zwei Nebenthemen**. Optional je Thema ein erwarteter Beitrag mit Einheit (z. B. 18.000 €/Jahr, 120 h Stillstand/Jahr, 4 t CO₂/Jahr), der beim Projektabschluss mit dem Ist verglichen wird (REQ-LL-003). | M | 3 | 🆕 |
| REQ-THEMA-003 | **Strategischer Fokus:** Der Vorgesetzte legt je Thema eine Gewichtung fest (Kein, Niedrig, Mittel, Hoch). Der Fokus gilt für seine Einheit und ist mit Datum historisiert. | M | 3 | 🆕 |
| REQ-THEMA-004 | **Verteilung Ist gegen Soll:** Die Ansicht „Themen & Fokus“ zeigt je Thema den Anteil am Wochenbedarf aller Projekte (Hauptthema zwei Drittel, Nebenthemen zusammen ein Drittel; einstellbar) gegen den Anteil, den der Fokus vorsieht. Abweichungen ab 8 Prozentpunkten werden hervorgehoben. Optional dieselbe Sicht für Budget. | M | 3 | 🆕 |
| REQ-THEMA-005 | **Prioritätsvorschlag:** Aus dem Fokus berechnet das System je Projekt Punkte (Gewicht des Hauptthemas voll, der Nebenthemen halb) und schlägt eine Rangfolge mit Auf- und Absteigern vor. Der Vorgesetzte übernimmt ihn per Klick oder ändert ihn; die Übernahme wird mit Begründung historisiert (REQ-PRIO-005). | S | 3 | 🆕 |
| REQ-THEMA-006 | Im Projektantrag wählt der Antragsteller die Themen; das Formular zeigt die aktuellen Schwerpunkte der Bereichsleitung. Das Kriterium **„Strategische Passung“** der Antragsbewertung (REQ-ANTRAG-003) wird aus dem Fokus der gewählten Themen vorbelegt. | M | 3 | 🆕 |
| REQ-THEMA-007 | Themen sind in Portfolio, Roadmap, Berichten, Dashboards und Suche als Spalte, Filter und Gruppierung verfügbar. | M | 3 | 🆕 |

---

## 10. Instandhaltung (REQ-IH)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-IH-001 | **Anlagenstruktur** als Baum: Werk → Halle → Linie → Maschine → Baugruppe. Jede Anlage hat Stammdaten, Dokumente (Schaltpläne, Handbücher) und eine Historie aller Aufträge. | M | 4 | 🆕 |
| REQ-IH-002 | **Wartungspläne** zeitbasiert (z. B. alle 3 Monate) und zählerbasiert (z. B. alle 5.000 Betriebsstunden). Wartungsaufträge werden automatisch erzeugt, mit Vorlaufzeit. | M | 4 | 🔧 |
| REQ-IH-003 | **Störmeldung** per QR-Code an der Anlage: Scannen mit dem Handy öffnet ein Formular mit vorausgefüllter Anlage; Foto und Beschreibung anhängen. | M | 4 | 🆕 |
| REQ-IH-004 | Wartungsaufträge und Störungen werden über den Zuteilungsvorschlag (REQ-RES-006) an Personen oder an das Team Instandhaltung vergeben. | M | 4 | 🆕 |
| REQ-IH-005 | **Mobile Rückmeldung**: Auftrag annehmen, Zeit buchen, verbrauchtes Material, Notiz, Foto, abschließen. Nutzbar ohne Netz mit späterer Synchronisation. | S | 4 | 🆕 |
| REQ-IH-006 | Kennzahlen je Anlage: MTBF, MTTR, Verfügbarkeit, Anzahl Störungen, Kosten. | S | 4 | 🆕 |
| REQ-IH-007 | Ersatzteile je Anlage mit Mindestbestand und Warnung bei Unterschreitung. | C | 4 | 🆕 |

---

## 11. Engineering und Anforderungsmanagement (REQ-ANF)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-ANF-001 | Anforderungen als Arbeitsobjekte mit ID, Titel, Text, Typ (funktional, nicht funktional, Sicherheit, Norm), Quelle, Status und Version. | M | 5 | 🆕 |
| REQ-ANF-002 | **Verfolgbarkeits-Matrix**: Anforderung → User Story/Task → Testfall → Testergebnis. Lücken (Anforderung ohne Test) werden markiert. *Im Entwurf (eigene Projekte):* Reiter Anforderungen: je Anforderung verknüpfte Aufgaben, Testfälle mit Status (offen, bestanden, fehlgeschlagen) und Nachweis-Ampel; ein fehlgeschlagener Test legt eine Fehleraufgabe mit Verweis auf Anforderung und Test an. | M | 5 | 🆕 |
| REQ-ANF-003 | **Baselines** über Anforderungen; zwei Stände können verglichen werden (neu, geändert, gelöscht). | M | 5 | 🆕 |
| REQ-ANF-004 | **Change Requests** mit Beschreibung, betroffenen Objekten, Auswirkung auf Termin und Kosten und Freigabe-Workflow (ein- oder mehrstufig). *Im Entwurf: Change Requests im SM42-Gantt („📝 Change Requests“): Titel, Beschreibung, Terminauswirkung (+0 bis +14 Tage), Mehrkosten, betroffene Meilensteine. Bis 5.000 € und 5 Tage entscheidet die Projektleitung, darüber H. Lorenz. Genehmigt verschiebt die Termine (im Verlauf protokolliert, in der Baseline als Abweichung sichtbar) und bucht die Kosten als Nachtrag unter Finanzen; abgelehnt ändert nichts.* | M | 5 | 🆕 |
| REQ-ANF-005 | **Testfälle und Abnahmeprotokolle** (FAT, SAT, IBN) mit Schritten, erwartetem Ergebnis, Ist-Ergebnis, Unterschrift/Freigabe und PDF-Export. | M | 5 | 🆕 |
| REQ-ANF-006 | Lasten- und Pflichtenheft werden aus den Anforderungen erzeugt (KI-Unterstützung bleibt). | S | 5 | 🔧 |
| REQ-ANF-007 | Revisionen von Zeichnungen und Stücklisten mit Freigabestatus; Verweis auf Git-Commits oder Tags für SPS- und Softwarestände. | S | 5 | 🔧 |
| REQ-ANF-008 | Import und Export von Anforderungen über Excel und ReqIF. | S | 6 | 🆕 |

---

## 12. Automatisierung und Integrationen (REQ-INT)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-INT-001 | **Regel-Engine** ohne Programmierung: Auslöser (Statuswechsel, Feldänderung, Termin, Zeitablauf) → Bedingung → Aktion (Feld setzen, zuweisen, benachrichtigen, Task anlegen). Die bestehende Eskalation wird als mitgelieferte Regel umgesetzt. Details in Kapitel 12.1. | M | 3 | 🔧 |
| REQ-INT-002 | REST-API mit Token-Authentifizierung für alle Arbeitsobjekte; Webhooks für Änderungen. | M | 2 | 🆕 |
| REQ-INT-003 | Kalender und Mail über Microsoft Graph statt Outlook-COM, pro Nutzer autorisiert. | S | 6 | 🔧 |
| REQ-INT-004 | Mail-Eingang: Eine Mail an die Projektadresse wird zum Task bzw. Logbucheintrag; die KI erkennt Termine und Personen (Mail-Parsing vorhanden). | C | 6 | 🔧 |
| REQ-INT-005 | Import aus Excel (Tasks, Anforderungen, Personen) mit Spaltenzuordnung; Export jeder Liste nach Excel. *Im Entwurf: Projekte › „⇪ Import aus Excel“. Zellen aus Excel kopieren und einfügen (Tabulator) oder CSV mit Semikolon/Komma wählen. Spalten werden aus der Überschrift erkannt (Aufgabe/Titel, Verantwortlich/Bearbeiter, Fällig/Termin, Aufwand/Stunden, Status, Priorität, Projekt, Meilenstein) und sind änderbar. Personen über Nachname, Datum als 27.11.2026, 2026-11-27 oder Excel-Zahl, Status wird Bucket (offen → Backlog, in Arbeit → Fokus, wartet → Warten auf, erledigt → Erledigt). Vorschau mit Hinweisen (unbekannte Person, fehlendes Datum, gibt es schon) und Haken je Zeile; Dubletten werden nicht doppelt angelegt. .xlsx direkt liest der Server in der echten App.* | M | 3 | 🔧 |
| REQ-INT-006 | Microsoft Teams und Slack: Benachrichtigungen senden, Task aus Nachricht anlegen. | C | 6 | 🆕 |
| REQ-INT-007 | **Import aus anderen Tools:** Jira (CSV/JSON), Trello (JSON), Microsoft Planner (Excel-Export bzw. Graph), MS Project (XML), Excel/CSV. Mit Zuordnung von Feldern, Status/Buckets und Personen, Vorschau und Probelauf ohne Speichern. | S | 6 | 🆕 |
| REQ-INT-008 | **Kalender-Abo (iCal):** Jeder Nutzer erhält eine persönliche, geheime iCal-URL mit seinen Tasks, Meilensteinen, Gates und Wartungen; zusätzlich je Projekt und Team. In Outlook, Google und Apple-Kalender abonnierbar. URL jederzeit neu erzeugbar (macht die alte ungültig). | M | 3 | 🆕 |
| REQ-INT-009 | **Benutzerabgleich mit Entra ID (SCIM 2.0):** Benutzer und Gruppen werden automatisch angelegt, geändert und deaktiviert. Entra-Gruppen können Teams (REQ-TEAM-001) zugeordnet werden. Ergänzt das bestehende SSO. | S | 6 | 🔧 |
| REQ-INT-010 | Anbindung an **Power Automate**, **n8n** bzw. **Zapier** über einen Connector auf Basis der REST-API und Webhooks (REQ-INT-002). Darüber sind Hunderte weiterer Dienste erreichbar, ohne jede Integration selbst zu bauen. | S | 6 | 🆕 |
| REQ-INT-011 | Ausgehende **Webhooks** und eingehende Webhook-Auslöser stehen auch als Aktion bzw. Auslöser in den Automatisierungsrezepten zur Verfügung. | S | 6 | 🆕 |
| REQ-INT-012 | **Fokuszeit nach Outlook:** Eingeplante Aufgaben aus „Mein Tag“ werden auf Wunsch als „Fokuszeit“ (beschäftigt, Inhalt privat) in den Outlook-Kalender geschrieben; Änderungen in Outlook erscheinen im Cockpit nach wenigen Minuten (Microsoft Graph, REQ-INT-003). | S | 3 | 🆕 |
| REQ-INT-013 | **KI-Entwürfe:** Der KI-Assistent bereitet Mails (z. B. Nachfassen bei „Warten auf“, Abholung, Bestellung), Termineinladungen mit freien Zeiten aller Teilnehmer aus Outlook, den wöchentlichen Statusbericht und Antworten auf Kommentare vor, jeweils mit „Warum“ und bei Bedarf mehreren Fassungen (z. B. kurz/ausführlich). **Mails werden über Microsoft Graph als Entwurf in Outlook › Entwürfe abgelegt**, Termine öffnen sich in Outlook vorausgefüllt (Teilnehmer, Zeit, Raum, Agenda); fertig gemacht und gesendet wird in Outlook. „Direkt senden“ ist zusätzlich möglich. „Später“ und „Verwerfen“; nichts wird ohne Klick gesendet. Je Art im Profil abschaltbar. | S | 4 | 🆕 |
| REQ-INT-014 | **Antwortvorschläge auf eingehende Mails:** Der Server liest neue Mails des Nutzers über Microsoft Graph, ordnet sie Projekten, Aufgaben oder Meilensteinen zu (Absender, Betreff, Bestellnummer, Inhalt) und zeigt sie im Posteingang mit dem Original, dem Grund der Zuordnung und zwei bis drei Antwortfassungen (z. B. Annehmen, Nachhaken, Eskalieren). Dazu eine passende Aktion: Meilenstein prüfen, Gate öffnen, Aufgabe erledigt setzen und Anhang in die Akte legen. Die Antwort geht als Entwurf nach Outlook oder direkt. Nur Mails mit Projektbezug, private Mails werden nicht ausgewertet. | S | 4 | 🆕 |
| REQ-INT-015 | **Hauptschalter „KI-Hilfe mit Outlook“** je Nutzer im Profil: aus heißt, der Server liest keine Mails dieses Nutzers, legt nichts in Outlook ab und bereitet keine Termine vor. Vorschläge im Cockpit (z. B. Antworten auf Kommentare) bleiben. Der Posteingang verlinkt direkt dorthin. | M | 2 | 🆕 |
| REQ-INT-016 | **Fokuszeit erkennen:** Outlook-Termine mit Titel oder Kategorie „Fokuszeit“ (auch „Focus“, „Blocker“) zählen in *Mein Tag* nicht als belegt, sondern als bevorzugter Platz für Aufgaben. Sie erscheinen als grünes Band hinter den Aufgaben; automatisches Einplanen und KI-Vorschläge füllen sie zuerst. Termine, die andere trotzdem hineinlegen, haben Vorrang. Im Profil abschaltbar. | M | 2 | 🆕 |
| REQ-INT-017 | **KI-Assistent als Chat** (Knopf „✨ Assistent“ unten rechts auf jeder Seite): legt aus normalen Sätzen To-dos an, auch mehrere auf einmal (je Zeile). Erkennt Person („L. Wagner soll …“, „für K. Weber“, „erinnere mich“), Projekt (SM42, Retrofit, Prüfstand, Instandhaltung, eigene Projekte), Termin (heute, morgen, Wochentag, „bis 24.11.“, nächste Woche, Monatsende) und Aufwand („3 h“). Es gelten die normalen Regeln: eigene und Projektaufgaben sofort, Teamkollegen müssen annehmen, außerhalb des Teams Freigabe durch den Chef. Jede Anlage mit Öffnen und Rückgängig. Beantwortet auch „Was steht heute an?“ und verschiebt („SM42-102 auf Montag“). Läuft auf dem lokalen Modell des Servers (REQ-NF-022). | M | 3 | 🆕 |
| REQ-INT-018 | **Mail aus Stichpunkten:** „Mail an Hr. Maier (Rexroth): …“ oder eingefügter Rohtext wird eine fertige Mail: Betreff, passende Anrede (Du/Sie je nach Empfänger), Abkürzungen ausgeschrieben, Fragen als Liste, Gruß. Betreff und Text sind danach frei bearbeitbar; „Nochmal überarbeiten“ in den Tönen Freundlich, Formell, Kürzer, Mit Frist übernimmt die eigenen Änderungen. Ausgabe als Outlook-Entwurf (Graph), im Mailprogramm öffnen oder kopieren. | M | 3 | 🆕 |
| REQ-INT-019 | **KI-Überarbeitung in den Posteingangs-Entwürfen:** Jeder Mail- und Antwortentwurf ist frei bearbeitbar und lässt sich danach mit „Mit KI überarbeiten“ (Freundlicher, Formeller, Kürzer, Mit Frist) beliebig oft neu fassen; ein Hinweis sagt, was geändert wurde. | M | 2 | 🆕 |
| REQ-INT-020 | **Status per Chat melden:** Sätze wie „Stromlaufplan der Schutztür habe ich schon freigegeben“, „bin gerade am FB_Zuführung testen dran“ oder „warte noch auf …“ legen keine neue Aufgabe an, sondern finden die passende offene Aufgabe (Titelwörter, auch bei Tippfehlern und anderer Wortform) und haken sie ab, legen sie in den Fokus bzw. nach „Warten auf“ – jeweils mit Rückgängig. Ist der Treffer nicht eindeutig, fragt der Assistent mit Auswahl („Meintest du diese?“ › „Diese abhaken“). Gibt es keine passende Aufgabe, sagt er das statt etwas anzulegen. Mehrere Meldungen in einer Nachricht werden einzeln verarbeitet. | M | 3 | 🆕 |
| REQ-INT-021 | **Normal mit dem Assistenten schreiben:** To-dos entstehen nur bei klarem Wunsch („To-do: …“, „erinnere mich …“, „L. Wagner soll …“, „Für X: …“, Aufzählung). Sonst antwortet der Assistent und fragt „Soll ich daraus ein To-do machen?“ mit „Als To-do anlegen“ und „Nein“. Umschalter im Chat: To-dos sofort anlegen oder immer erst nachfragen (mit Vorschau Titel, Person, Projekt, Termin). Grüße, Dank und „Was kannst du?“ werden beantwortet. | M | 3 | 🆕 |
| REQ-INT-022 | **Hilfe zur Software im Chat:** Fragen wie „Wo trage ich meinen Urlaub ein?“, „Wie lege ich ein Projekt an?“, „Wo finde ich gelöschte Aufgaben?“ beantwortet der Assistent mit dem Weg (Menü › Bereich › Knopf) und einem Knopf „Hinbringen ›“, der direkt dorthin springt; der Chat bleibt offen. Grundlage ist eine gepflegte Hilfe je Funktion; im Betrieb ergänzt das lokale Modell freie Fragen aus Hilfe und Wissensseiten. Ohne Treffer sagt er das und schlägt Formulierungen vor. | M | 3 | 🆕 |
| REQ-INT-023 | **Übernahme aus v2.0:** Projekte, Aufgaben, Meilensteine/Phasen, Stakeholder, Interaktionen, Zeitbuchungen und Positionen werden aus der v2.0-Datenbank (MS SQL Server oder PostgreSQL) übernommen. Status, Aufwandsklassen und Phasenbaum werden abgebildet; nichts geht verloren, nicht abbildbare Felder landen in der Beschreibung. | M | 1 | 🆕 |
| REQ-INT-024 | **MCP-Schnittstelle (Model Context Protocol):** Das Cockpit stellt einen MCP-Server bereit. KI-Assistenten und Agenten (z. B. Claude) können darüber mit den Rechten des angemeldeten Nutzers Aufgaben, Projekte, Termine, offene Punkte und Statusberichte lesen sowie Aufgaben anlegen und ändern. Jeder Zugriff steht im Verlauf (Quelle „MCP“). | S | 6 | 🆕 |
| REQ-INT-025 | **Öffentliche REST-API v1:** Dokumentiert als OpenAPI, versioniert, mit Service-Konten für Fremdsysteme, Rate-Limits und Webhooks je Objektart (REQ-INT-002). Grundlage für MCP, LPA-Anbindung und Power Automate. | M | 2 | 🆕 |
| REQ-INT-026 | **Anbindung an das LPA-Tool (Layered Process Audits):** Maßnahmen laufen über die LPA-REST-API v1 (Schema `lpa.measure.v1`) als Aufgaben ins Cockpit: `GET /api/v1/massnahmen?nur_neue=true&zugewiesen=true` alle 5 Minuten, Anlage per Upsert über `lpa_id`, danach `POST …/{id}/uebertragen` mit der Aufgaben-ID (`external_task_id`). Quelle „LPA“, Ebene, Bereich, Periode, Frage und Befund, Frist, Verantwortlicher (über E-Mail/Entra ID), Bilder als geschützte Anhänge. Die Aufgaben erscheinen in *Meine Arbeit*, im Team und, falls zugeordnet, im Projekt. Details: [LPA_ANBINDUNG.md](LPA_ANBINDUNG.md). | M | 6 | 🆕 |
| REQ-INT-027 | **Zwei-Wege-Abgleich des Status:** Statuswechsel im Cockpit gehen sofort per `POST …/{id}/status` an das LPA-Tool (offen → OPEN, in Arbeit → IN_PROGRESS, erledigt → DONE, mit Erledigt-Kommentar als `note`). Änderungen im LPA-Tool (Frist, Verantwortliche, Status) kommen per Webhook und zusätzlich per `GET …?status=alle&seit=<letzter Lauf>` als Sicherheitsnetz. Zuordnung über `lpa_id` und `external_task_id`; Doppelanlagen sind ausgeschlossen. | M | 6 | 🆕 |
| REQ-INT-028 | **Gegenvalidierung:** „Erledigt“ im Cockpit führt zu DONE. Endgültig abgeschlossen ist eine Maßnahme erst mit VERIFIED (Wirksamkeit, setzt nur der Auditor). Setzt das LPA-Tool sie nach DONE wieder auf OPEN (nicht wirksam), öffnet das Cockpit die Aufgabe und legt eine Klärungsaufgabe an. Bei Widerspruch (LPA DONE, VERIFIED oder REJECTED, im Cockpit offen) markiert das Cockpit einen Konflikt mit den Wahlmöglichkeiten „übernehmen“ oder „klären“ und protokolliert beide Stände im Verlauf. VERIFIED und REJECTED sendet das Cockpit nie. | M | 6 | 🆕 |
| REQ-INT-029 | **Sync-Monitor für Administratoren:** letzte Synchronisation je Schnittstelle, Fehler, offene Konflikte, erneut senden, Protokoll exportieren. Benachrichtigung, wenn ein Abgleich länger als eine Stunde fehlschlägt. | S | 6 | 🆕 |
| REQ-INT-030 | **Führendes System je Feld:** Das LPA-Tool führt Befund, Frage, Audit-Daten, Frist, Verantwortlichen und Wirksamkeit; das Cockpit führt Umsetzung (IN_PROGRESS, DONE), Kommentare, Teilaufgaben und Zeiten. Zuordnung `audit.org_unit` → Team/Projekt über eine Tabelle in der Verwaltung; ohne Treffer bei der verantwortlichen Person landet die Aufgabe im Eingang der LPA-Koordination. | M | 6 | 🆕 |
| REQ-INT-031 | **Robustheit:** Alle Aufrufe sind wiederholbar (idempotent). Bricht ein Lauf ab, holt der nächste nach; `seit` mit einer Minute Überlappung. Optional Push: Webhook des LPA-Tools an `/hooks/lpa`, Antwort mit `external_task_id`; Pull bleibt als Sicherheitsnetz aktiv. | M | 6 | 🆕 |
| REQ-INT-032 | **Sicherheit der Anbindung:** Der API-Schlüssel (`lpa_…`) liegt nur im Backend als Server-Geheimnis, nie im Browser, Repository oder Log; Wechsel ohne Ausfall. Bilder werden nur an angemeldete Nutzer mit Leserecht durchgereicht. Absicherung des Webhooks mit dem LPA-Tool abstimmen (offene Frage). | M | 6 | 🆕 |

### 12.1 Automatisierungsrezepte (REQ-AUTO)

| ID | Anforderung | Prio | Phase | Stand |
|---|---|---|---|---|
| REQ-AUTO-001 | Automatisierungen werden als **Satz zum Anklicken** gebaut: „**Wenn** *Auslöser*, **und** *Bedingung*, **dann** *Aktion*.“ Jeder kursive Teil ist ein Auswahlfeld. Beispiel: „Wenn sich der **Status** von **Task SM42-117** ändert, dann sende **mir** eine **Mail**.“ | M | 3 | 🆕 |
| REQ-AUTO-002 | **Auslöser:** Objekt angelegt; Status/Bucket geändert (von/nach); Feld geändert; Person/Team zugewiesen; Kommentar oder Erwähnung; Datei hochgeladen; Fälligkeit erreicht bzw. X Tage vorher/nachher; Objekt X Tage unverändert; Gate freigegeben/abgelehnt; Sprint gestartet/beendet; Zeitplan (täglich, wöchentlich, monatlich); eingehender Webhook. | M | 3 | 🆕 |
| REQ-AUTO-003 | **Geltungsbereich:** ein einzelnes Objekt (z. B. nur Task 1), alle Objekte einer gespeicherten Ansicht, ein Projekt, ein Team, alle eigenen Projekte. | M | 3 | 🆕 |
| REQ-AUTO-004 | **Bedingungen:** Feldwerte, Typ, Priorität, Person, Team, Projektstufe, kritischer Pfad; mit UND/ODER kombinierbar. | M | 3 | 🆕 |
| REQ-AUTO-005 | **Aktionen:** Mail senden (an mich, Person, Team, Rolle, Feldwert); App-Benachrichtigung; Teams-/Slack-Nachricht; Status/Bucket/Feld setzen; zuweisen (auch per Zuteilungsvorschlag REQ-RES-006); Task oder Teilaufgabe anlegen (auch aus Vorlage); Kommentar schreiben; Objekt verschieben; Fälligkeit verschieben; Webhook aufrufen. Mehrere Aktionen pro Regel. | M | 3 | 🆕 |
| REQ-AUTO-006 | In Texten der Aktionen sind **Platzhalter** wie `{Titel}`, `{Projekt}`, `{Status alt}`, `{Status neu}`, `{Link}` nutzbar. | M | 3 | 🆕 |
| REQ-AUTO-007 | Ein **Rezeptkatalog** liefert mindestens 30 fertige Vorlagen, z. B.: „Warten auf > 7 Tage → Erinnerung“ (heutige Eskalation), „Task erledigt → Projektleiter informieren“, „Gate abgelehnt → Auflagen-Tasks anlegen“, „Zertifikat läuft in 30 Tagen ab → Teamleiter informieren“, „Störung mit Priorität hoch → Team Instandhaltung per Teams“, „Jeden Montag 7 Uhr → Wochenübersicht per Mail“. | S | 3 | 🔧 |
| REQ-AUTO-008 | Jeder Nutzer darf **persönliche** Regeln für Objekte anlegen, die er lesen darf (z. B. Mail an sich selbst). **Projektweite** Regeln erfordern das Recht „Projekteinstellungen“. | M | 3 | 🆕 |
| REQ-AUTO-009 | Jede Regel hat ein **Ausführungsprotokoll** (Zeitpunkt, Auslöser, Ergebnis, Fehler), kann pausiert, kopiert und getestet werden („Probelauf an Objekt X“). | M | 3 | 🆕 |
| REQ-AUTO-010 | Schutz gegen Endlosschleifen: Eine Regel löst sich nicht selbst erneut aus; maximal 10 verkettete Regelausführungen pro ursprünglicher Änderung. | M | 3 | 🆕 |
| REQ-AUTO-011 | Statt einer Mail pro Ereignis kann eine **Sammelmail** (stündlich, täglich) gewählt werden. | S | 3 | 🆕 |

---

## 13. Nicht funktionale Anforderungen (REQ-NF)

| ID | Anforderung | Prio | Phase |
|---|---|---|---|
| REQ-NF-001 | Alle Benutzereingaben werden bei der Ausgabe kontextgerecht maskiert (HTML, Attribute, URLs). Kein Zusammenbau von HTML aus Rohdaten. | M | 0 |
| REQ-NF-002 | XSRF-Schutz aktiv, Session-Cookie `HttpOnly`, `Secure`, `SameSite=Lax`. | M | 0 |
| REQ-NF-003 | Antwortzeit: Board und Liste mit 500 Karten in unter 1 s, Gantt mit 1.000 Elementen in unter 2 s, Drag & Drop ohne spürbare Verzögerung (< 100 ms bis zur optischen Rückmeldung). | M | 2 |
| REQ-NF-004 | Oberfläche nutzbar auf Desktop ab 1366 px und auf Smartphones ab 360 px Breite (Instandhaltung, Meine Tasks, Störmeldung, Kommentare). | M | 2 |
| REQ-NF-005 | Änderungen anderer Nutzer erscheinen ohne Neuladen innerhalb von 5 s. Gleichzeitige Änderung desselben Feldes wird erkannt und gemeldet. | S | 2 |
| REQ-NF-006 | Tägliches Backup der Datenbank mit 30 Tagen Aufbewahrung, getestete Wiederherstellung. | M | 0 |
| REQ-NF-007 | KI-Funktionen sind optional; ohne KI bleibt jede Funktion manuell nutzbar. Ein lokales Modell muss für sensible Daten wählbar sein. | M | – |
| REQ-NF-008 | **Mehrsprachige Oberfläche:** Jeder Nutzer wählt seine Sprache selbst (Profil), unabhängig von den anderen. Zum Start **Deutsch, Englisch, Spanisch, Polnisch und Türkisch**, weitere Sprachen (z. B. Tschechisch, Französisch) ohne Programmänderung ergänzbar. Alle Oberflächentexte liegen zentral in Sprachdateien, kein fest eingebauter Text im Code. *Klarstellung 16.11.2026:* Übersetzt werden Bedienelemente und Systemtexte. Von Nutzern geschriebene Inhalte (Titel, Beschreibungen, Kommentare) bleiben in der Sprache, in der sie geschrieben wurden. | M | 2 |
| REQ-NF-017 | Datums-, Zahlen- und Währungsformate, Wochenbeginn und Feiertagskalender richten sich nach der gewählten Region (z. B. 13.11.2026 vs. 11/13/2026, 1.234,50 € vs. €1,234.50). | M | 2 |
| REQ-NF-018 | Systemtexte werden übersetzt mitgeliefert: Standard-Buckets, Statuswerte, Rollen, Vorlagen, Rezeptkatalog, Hilfe-Center, Mails und Push-Nachrichten. Mails gehen in der Sprache des Empfängers raus. | M | 3 |
| REQ-NF-019 | Von Nutzern eingegebene Inhalte (Tasks, Kommentare, Dokumente) werden nicht automatisch übersetzt. Optional lässt sich ein Inhalt per KI in die eigene Sprache übersetzen anzeigen; das Original bleibt maßgeblich und sichtbar. | S | 7 |
| REQ-NF-020 | Eigene Felder, Buckets, Statuswerte und Rollen können vom Ersteller mit Bezeichnungen in mehreren Sprachen versehen werden; fehlt eine Übersetzung, wird die Standardsprache des Unternehmens angezeigt. | S | 3 |
| REQ-NF-021 | Layouts vertragen längere Texte (Deutsch ist bis zu 30 % länger als Englisch) ohne abgeschnittene Beschriftungen; die Architektur schließt Schriften von rechts nach links (z. B. Arabisch) nicht aus. | S | 2 |
| REQ-NF-022 | **KI auf dem Cockpit-Server:** Das Cockpit läuft auf einem Server im Firmennetz und nutzt dort das GGUF-Modell aus `models/` (derzeit Phi-3.5 mini, 2,4 GB, rund 4 GB RAM) über `llama-cpp-python` im eigenen Prozess, ohne Ollama und ohne Cloud. `KI_BACKEND=lokal`; relative Pfade gelten ab dem Projektordner; fehlt die Datei, wird die erste `.gguf` in `models/` genommen. Das Modell wird einmal geladen und von allen Nutzern geteilt. Die Verwaltung zeigt das aktive Modell und die Nutzung je Funktion. | M | 2 | 🔧 |
| REQ-NF-023 | **Serverbetrieb:** KI-Aufträge laufen in einer Warteschlange im Hintergrund, die Oberfläche bleibt bedienbar und zeigt „wird erstellt“. Outlook, Kalender und Mail laufen über Microsoft Graph mit Freigabe je Nutzer (REQ-INT-003), nicht über Outlook auf einem Arbeitsplatz. Datei-Ablage, Benachrichtigungen und Erinnerungen laufen im Server, nicht beim Nutzer (DEF-09). | M | 2 | 🆕 |
| REQ-NF-009 | Quellcode in Git; automatisierte Tests für Datenzugriff, Berechtigungen, Terminberechnung (CPM, Dauer aus Anteil) und Migrationen; Tests laufen bei jedem Commit. | M | 0 |
| REQ-NF-010 | Datenschutz: Hosting in Deutschland bzw. On-Premises möglich; personenbezogene Daten (Abwesenheiten, Qualifikationen) nur für berechtigte Rollen sichtbar. | M | 3 |
| REQ-NF-011 | Barrierearmut: Tastaturbedienung für alle Planungsfunktionen (Gantt-Änderung auch ohne Maus über Tabelle und Dialog, siehe REQ-GANTT-003). | S | 2 |
| REQ-NF-012 | **Installierbare Web-App (PWA)** für Android und iOS mit **Push-Benachrichtigungen**, Startbildschirm-Symbol und Offline-Zwischenspeicher für Meine Tasks, Aufträge und Störmeldung. | M | 2 |
| REQ-NF-013 | **Native Apps** für iOS und Android (Kamera, QR-Scan, Offline-Betrieb, Push), sobald die PWA an Grenzen stößt. | C | 7 |
| REQ-NF-014 | **Einführung im Tool:** Beim ersten Start ein Beispielprojekt pro Vorgehensmodell, das man durchklicken und löschen kann; eine kurze geführte Tour (abschaltbar). | S | 3 |
| REQ-NF-015 | **Hilfe direkt im Tool:** Tooltips an allen Fachbegriffen (z. B. „Gesamtpuffer“, „WIP-Limit“, „Quality Gate“), ein „?“ je Seite mit Link auf den passenden Handbuchabschnitt, durchsuchbares Hilfe-Center. Das bestehende `docs/HANDBUCH.html` wird dafür überführt. | S | 3 |
| REQ-NF-016 | Leere Seiten erklären, was hier hingehört, und bieten die passende Aktion an („Noch keine Buckets – Standard-Buckets anlegen?“). | S | 2 |

---

## 14. Umsetzungsphasen

| Phase | Inhalt | Ergebnis |
|---|---|---|
| 0 | Fundament: Git, Tests, DEF-01 bis DEF-10, Backup, Papierkorb | Sichere, wartbare Basis ohne Datenverlust |
| 1 | Kern-Datenmodell, Stufen, Vorlagen (Grundlage), Organisationsstruktur und Benutzergruppen, Teams, Kommentare, Projekt- und Modulrechte, Archivieren, Projektantrag mit Rückfrage und Statusverfolgung, Aufgaben für andere mit Annahme (Team) bzw. Freigabe durch den Chef (außerhalb des Teams) | Ein Modell für alle Projektarten |
| 2 | REST-API, neues Frontend im Fluent-/iOS-Stil, neue Navigation (7 Haupt-, 7 Projektbereiche, Einstellungsknopf), Durchklicken mit Seitenpanel, Termin-Ampel überall, farbige Statusfelder, Ansichten (Liste, Tabelle, Board, Timeline, Kalender, Dateien), PSP, Gantt und V-Modell interaktiv, Scrum- und Kanban-Board mit Drag & Drop, globale Suche, gespeicherte Ansichten, Massenbearbeitung, PWA mit Push | Schön, übersichtlich, mit wenigen Klicks |
| 3 | Kritischer Pfad, Baseline, MTA, Dauer aus Projektanteil, Kapazität, Workload, Kapazitätsabgleich, Abwesenheiten, Qualifikationen, Zuteilungsvorschlag, Wochenzettel, Portfolio, Dashboards per Drag & Drop, grafische Analysen (Scope, Umfeld, Stakeholder, Stacey, RACI, AKV, Risiko), Antragsbewertung und Zuteilung, Scrum-Kennzahlen, Lessons Learned, Automatisierungsrezepte, iCal, Einführung und Hilfe | Steuerung über alle Projekte und Personen |
| 4 | Instandhaltung, Karte und Hallenplan | Wartung und Störungen mit Personalplanung |
| 5 | Anforderungsmanagement, Change Requests, Testfälle, FAT/SAT | Regulierte und komplexe Projekte |
| 6 | Graph, Teams/Slack, Mail-Eingang, Gäste, Import aus Jira/Trello/Planner/MS Project, SCIM, Power Automate/n8n, ReqIF, Textabfrage | Anbindung an die Umgebung |
| 7 | Dashboards, Releaseprognose, KI „Frag dein Projekt“, Auswertung wiederkehrender Probleme, native Apps | Auswertung |

---

## 15. Offene Punkte

| Nr | Frage | Auswirkung |
|---|---|---|
| OP-01 | ~~Technik: FastAPI + React oder Streamlit?~~ **Entschieden am 16.11.2026:** FastAPI (Python, übernimmt KI-Dienst, Datenzugriff, Migrationen und SSO aus v2.0) + React mit Fluent UI v9. Streamlit wird nicht weiter ausgebaut. Start nach der Testphase des Entwurfs. | Phase 2 und alle interaktiven Anforderungen |
| OP-02 | ~~Wer ist „Vorgesetzter“?~~ **Geklärt in 0.4:** Vorgesetzter ist, wer laut Organisationsstruktur disziplinarisch vorgesetzt ist bzw. die Einheit leitet (REQ-ORG-004). Offen bleibt nur, ob fachliche Vorgesetzte dieselben Leserechte bekommen. | REQ-RECHT-004, REQ-PRIO-001 |
| OP-03 | ~~Dürfen Vorgesetzte private Tasks sehen?~~ **Entschieden am 16.11.2026:** Nein, nie. Private Aufgaben sieht nur die Person selbst; in Auslastung und Teamplanung erscheint höchstens ein Block „privat“ ohne Titel und Inhalt (REQ-RECHT-007). | Datenschutz, Betriebsrat |
| OP-04 | ~~Feiertagskalender?~~ **Entschieden am 16.11.2026:** mehrere Standorte. Jede Person hat einen Standort; der Standort bestimmt den Feiertagskalender (u. a. Nordrhein-Westfalen, Hessen, Baden-Württemberg, Thüringen und Auslandsstandorte). Siehe REQ-KAP-016. | REQ-GANTT-011, REQ-KAP-002 |
| OP-05 | ~~Rechte am Code und Nebentätigkeit klären~~ **Geklärt am 16.11.2026:** Der Code gehört dem Entwickler (privates Projekt); die Nutzung im Betrieb ist erlaubt. | Vertrieb |
| OP-06 | ~~Darf der Projektleiter ohne Freigabe Aufgaben vergeben?~~ **Geklärt am 13.11.2026:** Im Projekt wird direkt nach Projektrolle zugewiesen, ohne Freigabe und Annahme (REQ-AUFG-002). Außerhalb von Projekten nehmen Teamkollegen an (REQ-AUFG-003), bei Anfragen von außerhalb des Teams gibt der Chef frei (REQ-AUFG-004). | REQ-AUFG |
