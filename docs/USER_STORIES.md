# Engineering Cockpit 3.0 – User Stories

| | |
|---|---|
| Dokument | User Stories mit Akzeptanzkriterien |
| Version | 0.4 (Entwurf) |
| Änderungen | 0.2: US-056 bis US-058 (Buckets), US-086 bis US-089 (Projektrollen) · 0.3: US-123 bis US-126 (Import, iCal, SCIM, Power Automate), EP-13 bis EP-18 (Ansichten, Suche, Papierkorb, PSP, Automatisierung, Lessons Learned, Wochenzettel, Kapazitätsabgleich, App, Einführung) · 0.4: EP-19 bis EP-23 (Ampel und Navigation, Gestaltung und Dashboards, grafische Analysen, Projektanträge, Organisation), EP-24 (Sprachen) |
| Stand | 12.11.2026 |
| Zugehörig | [ANFORDERUNGEN.md](ANFORDERUNGEN.md) |

## Aufbau

Jede Story hat:

- **ID** `US-<Nr>`, gruppiert nach Epic `EP-<Nr>`
- **Story** im Format: Als *Rolle* möchte ich *Ziel*, damit *Nutzen*
- **Akzeptanzkriterien** im Format Gegeben / Wenn / Dann, einzeln prüfbar
- **Prio** nach MoSCoW (M, S, C), **Phase** laut Anforderungsbeschreibung Kapitel 14
- **Anforderungen**: Verweis auf die REQ-IDs (Verfolgbarkeit)

## Rollen

| Rolle | Beschreibung |
|---|---|
| Projektleiter | Plant und steuert Projekte (in der Eigennutzung: ich) |
| Vorgesetzter | Geschäftsführung oder Bereichsleitung; setzt Prioritäten und Projektanteile |
| Mitarbeiter | Bearbeitet Tasks in einem oder mehreren Projekten |
| Teamleiter | Leitet ein Team (z. B. Instandhaltung) und verteilt Team-Aufträge |
| Product Owner | Verantwortet das Backlog in Scrum-Projekten |
| Scrum Master | Moderiert Sprint-Ereignisse |
| Instandhalter | Führt Wartungen und Störungsbehebungen durch, oft am Handy |
| Gast | Externer Kunde oder Lieferant mit eingeschränktem Zugriff |
| Administrator | Pflegt Benutzer, Teams, Felder, Vorlagen |

## Definition of Done (für alle Stories)

- Alle Akzeptanzkriterien erfüllt und durch automatisierte Tests abgedeckt, wo sinnvoll
- Berechtigungen serverseitig geprüft (REQ-RECHT-005), Eingaben maskiert (REQ-NF-001)
- Änderungen erscheinen in der Historie (REQ-KERN-006)
- Im Handbuch beschrieben

---

## EP-01 Projektstufen und Vorlagen

### US-001 Einfaches Projekt ohne Ballast
Als **Projektleiter** möchte ich ein Projekt in Stufe 1 anlegen, das nur Tasks, Board und Kommentare zeigt, damit kleine Vorhaben nicht in Formularen untergehen.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-STUFE-001, -002

- [ ] Gegeben ein neues Projekt mit Stufe 1, wenn ich es öffne, dann sehe ich nur die Bereiche Tasks, Board und Kommentare.
- [ ] Gegeben ein Projekt in Stufe 1, wenn ich die Projekteinstellungen öffne, dann kann ich die Stufe auf 2, 3 oder 4 erhöhen.
- [ ] Gegeben ein Projekt in Stufe 3 mit Risiken, wenn ich auf Stufe 2 absenke, dann sind die Risiken ausgeblendet, aber nach erneutem Erhöhen wieder vollständig da.

### US-002 Module einzeln zuschalten
Als **Projektleiter** möchte ich einzelne Module wie „Risiko“ auch in Stufe 2 einschalten, damit ich nicht wegen einer Funktion die ganze Stufe wechseln muss.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-STUFE-003

- [ ] Gegeben ein Projekt in Stufe 2, wenn ich das Modul „Risiko“ aktiviere, dann erscheint der Bereich Risiko, alle anderen Stufe-3-Module bleiben ausgeblendet.

### US-003 Projekt aus Vorlage
Als **Projektleiter** möchte ich ein Projekt aus der Vorlage „Sondermaschine“ anlegen, damit Phasen, Meilensteine, Quality Gates und Dokumentvorlagen sofort stehen.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-VORL-001, -002

- [ ] Gegeben die Vorlage „Sondermaschine“, wenn ich ein Projekt mit Start 01.02. daraus anlege, dann sind alle Phasen, Meilensteine und Gates relativ zu diesem Datum terminiert.
- [ ] Die Quality Gates haben die Checklisten aus der Vorlage.

### US-004 Eigenes Projekt als Vorlage speichern
Als **Projektleiter** möchte ich ein abgeschlossenes Projekt als Vorlage speichern, damit ich bewährte Strukturen wiederverwende.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-VORL-003

- [ ] Gegeben ein Projekt, wenn ich „Als Vorlage speichern“ wähle, dann enthält die Vorlage Struktur, Dauern und Abhängigkeiten, aber keine Zeitbuchungen, Kommentare oder Personen.

---

## EP-02 Wasserfall und Gantt

### US-010 Meilenstein per Maus verschieben
Als **Projektleiter** möchte ich einen Meilenstein im Gantt mit der Maus verschieben, damit ich Terminänderungen schnell einplane.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-GANTT-001, -005

- [ ] Gegeben ein Balken vom 03.03. bis 14.03., wenn ich ihn um 5 Arbeitstage nach rechts ziehe, dann läuft er vom 10.03. bis 21.03.
- [ ] Gegeben ein Nachfolger mit Abhängigkeit EA, wenn ich den Vorgänger verschiebe, dann wird der Nachfolger automatisch mitverschoben.
- [ ] Gegeben ein Nachfolger mit „manuell terminiert“, wenn ich den Vorgänger verschiebe, dann bleibt er stehen und die verletzte Abhängigkeit wird rot markiert.

### US-011 Dauer per Maus ändern
Als **Projektleiter** möchte ich einen Balken am Rand verlängern oder verkürzen, damit ich die Dauer direkt im Diagramm anpasse.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-GANTT-002

- [ ] Wenn ich den rechten Rand eines Balkens ziehe, dann ändert sich nur das Ende; der Start bleibt.
- [ ] Wenn ich den linken Rand ziehe, dann ändert sich nur der Start.
- [ ] Während des Ziehens wird das neue Datum als Tooltip angezeigt.

### US-012 Planung über Tabelle und Dialog
Als **Projektleiter** möchte ich Start, Ende, Dauer und Vorgänger auch in einer Tabelle eintippen, damit ich genau und ohne Maus planen kann.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-GANTT-003, REQ-NF-011

- [ ] Gegeben die Tabelle links vom Gantt, wenn ich in der Spalte „Dauer“ „10T“ eingebe, dann wird das Ende neu berechnet und der Balken passt sich sofort an.
- [ ] Wenn ich in der Spalte „Vorgänger“ `12EA+2T` eingebe, dann entsteht eine Ende-Anfang-Abhängigkeit zu Element 12 mit 2 Tagen Verzug.
- [ ] Ein Doppelklick auf einen Balken öffnet einen Dialog mit allen Feldern.
- [ ] Ungültige Eingaben (z. B. Ende vor Start, zirkuläre Abhängigkeit) werden mit Begründung abgelehnt.

### US-013 Abhängigkeiten ziehen
Als **Projektleiter** möchte ich eine Abhängigkeit durch Ziehen von einem Balken zum anderen anlegen, damit die Reihenfolge sichtbar und verbindlich ist.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-GANTT-004

- [ ] Wenn ich vom Ende von Balken A zum Anfang von Balken B ziehe, dann entsteht eine EA-Abhängigkeit, dargestellt als Pfeil.
- [ ] Ein Klick auf den Pfeil erlaubt, den Typ (EA, AA, EE, AE) und den Vor- oder Verzug zu ändern oder die Abhängigkeit zu löschen.
- [ ] Eine Abhängigkeit, die einen Kreis bilden würde, wird verhindert.

### US-014 Untermeilensteine und Tasks gliedern
Als **Projektleiter** möchte ich unter einem Meilenstein Untermeilensteine und Tasks anlegen und auf- und zuklappen, damit große Pläne übersichtlich bleiben.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-GANTT-006, REQ-KERN-002

- [ ] Wenn ich einen Task per Einrücken unter einen Meilenstein schiebe, dann wird er dessen Kind.
- [ ] Der Elternbalken umspannt immer den frühesten Start und das späteste Ende seiner Kinder.
- [ ] Zugeklappte Elemente zeigen nur den Elternbalken mit Fortschritt.

### US-015 Quality Gate einfügen
Als **Projektleiter** möchte ich ein Quality Gate zwischen zwei Phasen setzen, damit die nächste Phase erst nach Prüfung startet.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-GANTT-007, -008

- [ ] Wenn ich zwischen zwei Phasen „Quality Gate einfügen“ wähle, dann erscheint eine Raute mit Abhängigkeit zur Folgephase.
- [ ] Ich kann eine Checkliste und einen oder mehrere Freigebende hinterlegen.
- [ ] Gegeben ein hartes Gate im Status „offen“, wenn jemand einen Task der Folgephase auf „In Arbeit“ setzt, dann wird das abgelehnt mit Hinweis auf das Gate.
- [ ] Gegeben ein weiches Gate im Status „offen“, dann ist der Statuswechsel möglich, aber es erscheint eine Warnung.

### US-016 Gate freigeben
Als **Vorgesetzter** möchte ich ein Quality Gate prüfen und mit „bestanden“, „bestanden mit Auflagen“ oder „nicht bestanden“ bewerten, damit die Entscheidung nachvollziehbar ist.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-GANTT-007, REQ-KERN-006

- [ ] Gegeben ich bin als Freigebender eingetragen, dann erhalte ich eine Benachrichtigung, sobald alle Checklistenpunkte abgehakt sind.
- [ ] Bei „bestanden mit Auflagen“ muss ich mindestens eine Auflage eintragen; jede Auflage wird ein Task.
- [ ] Die Entscheidung wird mit Person, Zeitpunkt und Kommentar historisiert.

### US-017 Kritischen Pfad sehen
Als **Projektleiter** möchte ich den berechneten kritischen Pfad rot sehen, damit ich weiß, welche Verzögerung das Projektende verschiebt.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-GANTT-009

- [ ] Gegeben ein Netz mit Abhängigkeiten, dann sind alle Elemente mit Gesamtpuffer 0 rot markiert.
- [ ] Für jedes Element werden Gesamtpuffer und freier Puffer in Tagen angezeigt (Tabelle und Tooltip).
- [ ] Wenn ich ein Element mit 3 Tagen Puffer um 4 Tage verlängere, dann wird es kritisch und das Projektende verschiebt sich um 1 Tag.

### US-018 Kritischen Pfad selbst festlegen
Als **Projektleiter** möchte ich Elemente per Klick als kritisch markieren, damit ich fachlich kritische Arbeiten (z. B. Lieferung Schaltschrank) hervorhebe, auch wenn die Rechnung Puffer zeigt.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-GANTT-010

- [ ] Über Kontextmenü oder ein Kontrollkästchen in der Tabelle kann ich „kritisch (manuell)“ setzen.
- [ ] Manuell kritische Elemente haben einen roten Rahmen, berechnet kritische eine rote Füllung; beides gleichzeitig ist möglich.
- [ ] Ein Filter „nur kritisch“ zeigt wahlweise berechnete, manuelle oder beide.
- [ ] Hat ein manuell kritisches Element Puffer, wird der Puffer als Hinweis angezeigt.

### US-019 Baseline einfrieren und vergleichen
Als **Projektleiter** möchte ich den Plan beim Kick-off als Baseline speichern, damit ich später Soll und Ist vergleichen kann.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-GANTT-012, -016

- [ ] Wenn ich „Baseline speichern“ mit Namen „Kick-off“ wähle, dann werden Start, Ende und Aufwand aller Elemente eingefroren.
- [ ] Im Gantt erscheint die gewählte Baseline als grauer Balken unter dem Ist-Balken.
- [ ] Die Tabelle zeigt die Abweichung in Tagen je Element.
- [ ] Aus Baselines und Historie wird eine Meilenstein-Trendanalyse erzeugt.

### US-020 Zoomen und Feiertage
Als **Projektleiter** möchte ich zwischen Tag, Woche, Monat, Quartal und Jahr zoomen und Feiertage sehen, damit ich kurz- und langfristig planen kann.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-GANTT-011

- [ ] Wochenenden und Feiertage des eingestellten Bundeslands sind grau hinterlegt und zählen nicht als Arbeitstage.
- [ ] Eine Linie markiert heute.

### US-021 Planänderung rückgängig machen
Als **Projektleiter** möchte ich versehentliche Verschiebungen rückgängig machen, damit ich gefahrlos ausprobieren kann.
**Prio** S · **Phase** 2 · **Anforderungen** REQ-GANTT-014

- [ ] Strg+Z macht die letzte Planänderung rückgängig, Strg+Y stellt sie wieder her, mindestens 50 Schritte.

---

## EP-03 V-Modell

### US-030 V-Diagramm anlegen
Als **Projektleiter** möchte ich mein Projekt als V sehen, mit Spezifikation links, Umsetzung unten und Tests rechts, damit Entwicklungs- und Prüfebenen zusammen sichtbar sind.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-VMOD-001, -002

- [ ] Gegeben ein neues V-Modell-Projekt, dann ist das V mit den fünf Standardebenen vorbelegt.
- [ ] Ich kann Ebenen hinzufügen, umbenennen, löschen und die Reihenfolge ändern; das V wird dabei neu gezeichnet.
- [ ] Gegenüberliegende Ebenen sind durch eine waagrechte Linie verbunden.

### US-031 Ebene untergliedern
Als **Projektleiter** möchte ich in einer Ebene Untermeilensteine und Tasks anlegen und im V aufklappen, damit auch die Detailplanung im V-Modell bleibt.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-VMOD-003

- [ ] Ein Klick auf eine Ebene öffnet ihre Untergliederung als Liste.
- [ ] Aufgeklappte Ebenen zeigen ihre Untermeilensteine als kleinere Knoten am V-Ast.
- [ ] Jede Ebene zeigt Fortschritt in %.

### US-032 Abhängigkeiten im V
Als **Projektleiter** möchte ich Abhängigkeiten zwischen Ebenen und einzelnen Elementen im V ziehen, damit die Reihenfolge auch hier stimmt.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-VMOD-004, -005

- [ ] Wenn ich im V von Element A nach Element B ziehe, dann entsteht dieselbe Abhängigkeit, die ich im Gantt sehen würde.
- [ ] Ein Umschalter wechselt zwischen V- und Gantt-Ansicht; Änderungen in einer Ansicht sind in der anderen sofort sichtbar.

### US-033 Gate am Ende einer Ebene
Als **Projektleiter** möchte ich am Ende jeder Ebene ein Quality Gate setzen, damit z. B. der Systementwurf freigegeben ist, bevor die Architektur beginnt.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-VMOD-006, REQ-GANTT-008

- [ ] Gates erscheinen als Raute am Übergang zwischen zwei Ebenen und verhalten sich wie im Gantt (hart/weich).

### US-034 Testabdeckung je Ebene
Als **Projektleiter** möchte ich je Ebene sehen, wie viele Anforderungen schon durch bestandene Tests verifiziert sind, damit ich weiß, wo die Abnahme hängt.
**Prio** S · **Phase** 5 · **Anforderungen** REQ-VMOD-007, REQ-ANF-002

- [ ] Gegeben 20 Anforderungen auf Ebene „Systementwurf“, davon 15 mit bestandenem Systemtest, dann zeigt die Ebene „75 % verifiziert“.
- [ ] Ein Klick zeigt die 5 nicht verifizierten Anforderungen.

---

## EP-04 Scrum

### US-039 Scrum-Zyklus auf einen Blick
Als **Projektleiter** möchte ich den Scrum-Ablauf als Grafik sehen, mit dem aktuellen Stand an jeder Station, damit ich und mein Chef sofort erkennen, wo das Team im Sprint steht.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-SCRUM-012, -013

- [ ] Die Grafik zeigt Product Backlog, Sprint-Planung, Sprint Backlog, Sprint mit Daily, Inkrement, Review und Retrospektive mit Pfeilen und Rückfluss.
- [ ] Der Sprint-Ring zeigt außen den Zeitfortschritt (Tag 10 von 10) und innen die erledigten Story Points (21 von 26).
- [ ] Die heutige Station ist hervorgehoben und mit „heute“ markiert.
- [ ] Ein Klick auf eine Station öffnet die passende Ansicht (z. B. Sprint → Sprint-Board, Review → Review).
- [ ] Darunter zeigt eine Zeitleiste alle Sprints bis zum Release mit Velocity der abgeschlossenen Sprints.

### US-040 Product Backlog priorisieren
Als **Product Owner** möchte ich die Stories im Backlog per Ziehen sortieren, damit die wichtigste immer oben steht.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-SCRUM-001

- [ ] Die Reihenfolge bleibt nach Neuladen erhalten.
- [ ] Ich kann nach Epic, MoSCoW, Status und Team filtern.

### US-041 Story mit Akzeptanzkriterien anlegen
Als **Product Owner** möchte ich eine Story mit Rolle, Ziel, Nutzen und einer Liste von Akzeptanzkriterien anlegen, damit klar ist, wann sie fertig ist.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-STORY-001, -002

- [ ] Rolle, Ziel und Nutzen sind getrennte Pflichtfelder (Nutzen optional).
- [ ] Ich kann beliebig viele Akzeptanzkriterien anlegen, umsortieren und löschen.
- [ ] Ein Kriterium kann optional im Format Gegeben / Wenn / Dann erfasst werden.
- [ ] Bestehende Stories mit Freitext-Kriterien werden bei der Migration zeilenweise in einzelne Kriterien umgewandelt.

### US-042 Stories schätzen
Als **Scrum-Team** möchten wir Stories in Story Points schätzen, damit wir den Sprint realistisch planen.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-SCRUM-002

- [ ] Auswahl der Werte 1, 2, 3, 5, 8, 13, 21.
- [ ] Im Planning Poker geben alle Teilnehmer verdeckt ab; aufgedeckt wird gleichzeitig; Ausreißer werden markiert.

### US-043 Definition of Ready prüfen
Als **Scrum Master** möchte ich, dass nur Stories mit erfüllter DoR eingeplant werden, damit der Sprint nicht mit unklaren Stories startet.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-SCRUM-003

- [ ] Gegeben eine Story mit offenem DoR-Punkt, wenn ich sie in den Sprint ziehe, dann wird das abgelehnt (bei aktivierter Prüfung) bzw. gewarnt (bei deaktivierter).

### US-044 Sprint planen gegen Kapazität
Als **Scrum-Team** möchten wir beim Sprint Planning sehen, wie viel Kapazität wir haben, damit wir uns nicht überladen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-SCRUM-004, REQ-KAP-001, -002

- [ ] Gegeben 35-h-Woche und Planungsfaktor 80 % (5,6 h/Tag planbar), 3 Personen mit 100 %, 50 % und 50 % Projektanteil, 10 Arbeitstage Sprint, die dritte Person 2 Tage Urlaub, dann zeigt das System 56 + 28 + 22,4 = 106,4 h planbare Kapazität.
- [ ] Beim Hineinziehen von Stories wird „geplant / verfügbar“ laufend aktualisiert, in Stunden oder Punkten (anhand der mittleren Velocity).
- [ ] Ein Sprintziel ist Pflicht.

### US-045 Sprint umsetzen
Als **Mitarbeiter** möchte ich im Sprint-Board meine Teilaufgaben von To Do über In Arbeit und Review nach Done ziehen, damit der Stand für alle sichtbar ist.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-SCRUM-005, REQ-KANBAN-003

- [ ] Stories erscheinen als Swimlanes mit ihren Teilaufgaben.
- [ ] Eine Story kann erst nach Done, wenn alle Akzeptanzkriterien abgehakt sind und die DoD erfüllt ist (REQ-SCRUM-006).

### US-046 Burndown verfolgen
Als **Scrum Master** möchte ich ein Burndown-Diagramm sehen, damit wir früh merken, ob das Sprintziel wackelt.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-SCRUM-007

- [ ] Ideallinie und Ist-Linie werden täglich fortgeschrieben, auch ohne dass jemand die Seite öffnet.
- [ ] Nachträglich hinzugefügte Stories sind im Burnup als Anstieg der Gesamtlinie erkennbar.

### US-047 Sprint Review bewerten
Als **Product Owner** möchte ich im Review jede Story annehmen oder ablehnen und das Sprintziel bewerten, damit das Ergebnis dokumentiert ist.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-SCRUM-008

- [ ] Für jede Story: „angenommen“ oder „nicht angenommen“ mit Kommentar.
- [ ] Sprintziel: erreicht / teilweise / nicht erreicht.
- [ ] Nicht fertige Stories kann ich ins Backlog oder in den nächsten Sprint verschieben; ihre Restpunkte werden übernommen.
- [ ] Das Review-Protokoll ist als PDF exportierbar.

### US-048 Retrospektive mit Maßnahmen
Als **Scrum Master** möchte ich die Retro mit den Spalten „lief gut“, „verbessern“, „Maßnahmen“ führen, damit Verbesserungen nicht vergessen werden.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-SCRUM-009

- [ ] Jede Maßnahme wird ein Task mit Verantwortlichem und Fälligkeit.
- [ ] Offene Maßnahmen der letzten Retro werden zu Beginn der nächsten angezeigt.
- [ ] Optional gibt jeder eine Stimmung 1–5 ab; der Verlauf über die Sprints ist sichtbar.

### US-049 Team-Kennzahlen
Als **Projektleiter** möchte ich Velocity und Zusagezuverlässigkeit über die letzten 6 Sprints sehen, damit ich Termine für Epics belastbar nennen kann.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-SCRUM-010, -011

- [ ] Velocity als Balkendiagramm (zugesagt vs. fertig) pro Sprint.
- [ ] Zusagezuverlässigkeit = fertige ÷ zugesagte Punkte in %.

---

## EP-05 Kanban

### US-050 Eigenes Board erstellen
Als **Teamleiter** möchte ich ein Board für mein Team mit eigenen Spalten anlegen, damit es zu unserem Ablauf passt.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KANBAN-001, -002

- [ ] Ich kann ein Board pro Projekt, pro Team, persönlich oder projektübergreifend anlegen.
- [ ] Spalten kann ich benennen, sortieren und einem Status zuordnen.

### US-051 Karten ziehen
Als **Mitarbeiter** möchte ich Karten per Drag & Drop verschieben, damit Statuswechsel einen Handgriff dauern.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KANBAN-003, REQ-NF-003

- [ ] Die Karte bewegt sich ohne spürbare Verzögerung, der Status wird gespeichert, andere Nutzer sehen die Änderung innerhalb von 5 s.
- [ ] Auf dem Smartphone geht das per langem Drücken.

### US-052 WIP-Limit
Als **Teamleiter** möchte ich pro Spalte ein WIP-Limit setzen, damit wir weniger gleichzeitig anfangen und mehr fertig machen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KANBAN-004

- [ ] Bei Überschreitung färbt sich der Spaltenkopf rot.
- [ ] Bei „hartem“ Limit wird das Hineinziehen abgelehnt.

### US-053 Swimlanes
Als **Teamleiter** möchte ich das Board nach Person oder Projekt in Swimlanes teilen, damit ich Engpässe einzelner Personen erkenne.
**Prio** S · **Phase** 2 · **Anforderungen** REQ-KANBAN-005

### US-054 Liegengebliebene Karten erkennen
Als **Projektleiter** möchte ich Karten markiert sehen, die zu lange in einer Spalte liegen, damit nichts versandet. Die bestehende Eskalation für „Warten auf“ soll bleiben.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KANBAN-006, -009

- [ ] Schwellwert in Tagen pro Spalte einstellbar.
- [ ] „Warten auf“ eskaliert weiterhin nach 7/14/21 Tagen (Schwelle aus den Einstellungen).
- [ ] Aufwandsklasse und Quick-Win-Kennzeichen sind auf der Karte sichtbar.

### US-055 Fluss auswerten
Als **Teamleiter** möchte ich Cumulative Flow und Durchlaufzeit sehen, damit ich Engpässe im Ablauf finde.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-KANBAN-008

### US-056 Buckets selbst anlegen und benennen
Als **Projektleiter** möchte ich Buckets wie in Microsoft Planner selbst anlegen, umbenennen und sortieren, damit das Board zu meinem Projekt passt (z. B. „Konstruktion“, „Bestellung“, „Montage“, „IBN“).
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KANBAN-002, -010, -011

- [ ] Gegeben ein neues Board, dann hat es die Buckets Backlog, Fokus, Warten auf, Erledigt.
- [ ] Über „+ Bucket“ lege ich einen neuen Bucket an; der Name ist direkt editierbar.
- [ ] Ein Klick auf den Bucket-Namen erlaubt Umbenennen; Ziehen am Bucket-Kopf ändert die Reihenfolge.
- [ ] Für jeden Bucket wähle ich eine Statuskategorie (offen, in Arbeit, wartend, erledigt).

### US-057 Bucket löschen ohne Karten zu verlieren
Als **Projektleiter** möchte ich einen Bucket löschen und dabei entscheiden, wohin seine Karten kommen, damit keine Aufgabe verloren geht.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KANBAN-011, -013

- [ ] Gegeben ein leerer Bucket, wenn ich „Löschen“ wähle, dann wird er nach einer Rückfrage gelöscht.
- [ ] Gegeben ein Bucket mit 7 Karten, wenn ich „Löschen“ wähle, dann muss ich einen Ziel-Bucket auswählen; erst danach wird gelöscht und die 7 Karten liegen im Ziel-Bucket.
- [ ] Gegeben nur noch ein Bucket der Kategorie „erledigt“, dann ist „Löschen“ für ihn gesperrt, mit Hinweis.

### US-058 Logik hängt an der Kategorie, nicht am Namen
Als **Projektleiter** möchte ich „Warten auf“ in „Warten auf Kunde“ umbenennen können, ohne dass die Eskalation aufhört, damit ich Namen frei wählen kann.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KANBAN-012

- [ ] Gegeben ein Bucket der Kategorie „wartend“ mit beliebigem Namen, dann eskalieren seine Karten nach 7/14/21 Tagen.
- [ ] Gegeben eine Karte wird in einen Bucket der Kategorie „erledigt“ gezogen, dann wird das Erledigt-Datum gesetzt und sie zählt in Burndown, Durchsatz und Fortschritt.

---

## EP-06 Zeit, Projektanteil und Priorität

### US-060 Dauer aus Projektanteil
Als **Mitarbeiter** möchte ich, dass die Dauer meiner Tasks aus Aufwand und meinem Projektanteil berechnet wird, damit der Plan meiner echten Verfügbarkeit entspricht.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-KAP-001, -002, -007

- [ ] Gegeben ein Task mit 14 h Aufwand, 35-h-Woche, Planungsfaktor 80 % (5,6 h/Tag) und 50 % Anteil, dann beträgt die Dauer 14 ÷ 2,8 = 5 Arbeitstage.
- [ ] Gegeben derselbe Task und 1 Tag Urlaub im Zeitraum, dann endet er einen Arbeitstag später.
- [ ] Gegeben eine Teilzeitkraft mit 20-h-Woche (5 Tage), Faktor 80 % und 100 % Anteil, dann dauern 8 h Aufwand 8 ÷ 3,2 = 2,5 → 3 Arbeitstage.

### US-065 Planungsfaktor festlegen
Als **Vorgesetzter** möchte ich festlegen, welcher Anteil der Sollarbeitszeit planbar ist (bei uns 80 %), damit Projekte nicht mit 100 % der Arbeitszeit verplant werden und Platz für Besprechungen, Störungen und Ad-hoc-Arbeit bleibt.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-KAP-008, -009, -010, -011

- [ ] Ich stelle den Faktor unternehmensweit ein (Standard 80 %) und kann ihn je Team oder Person überschreiben (z. B. Instandhaltung 65 % wegen vieler Störungen).
- [ ] Gegeben 35-h-Woche und 80 %, dann zeigt das Profil „28 h planbar pro Woche“.
- [ ] Gegeben Projektanteile 50 % + 40 % + 20 % = 110 %, dann erscheint eine Warnung „Zuteilung passt nicht in die planbare Zeit (30,8 h von 28 h)“.
- [ ] Gegeben ein Anteil wird von 40 % auf 20 % gesenkt, dann sinken die Projektstunden von 11,2 h auf 5,6 h pro Woche und die Dauern der offenen Tasks verlängern sich entsprechend, mit Vorschau vor dem Übernehmen (US-061).
- [ ] Alle Auslastungsanzeigen rechnen gegen die planbare Zeit; 100 % bedeutet „planbare Zeit voll verplant“.

### US-061 Anteil ändert den Plan
Als **Projektleiter** möchte ich vor dem Übernehmen eines geänderten Projektanteils sehen, welche Meilensteine sich verschieben, damit ich die Folgen kenne.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-KAP-003, -004

- [ ] Gegeben ein Anteil wird von 50 % auf 25 % gesenkt, dann zeigt eine Vorschau alle betroffenen Tasks und Meilensteine mit altem und neuem Termin und die Verschiebung des Projektendes.
- [ ] Erst nach Bestätigen wird der Plan geändert.
- [ ] Fest terminierte Meilensteine, die nicht mehr haltbar sind, werden rot markiert.

### US-062 Feste Dauer
Als **Projektleiter** möchte ich für Lieferzeiten eine feste Dauer setzen, damit sie nicht vom Projektanteil abhängen.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-KAP-005

- [ ] Gegeben ein Task „Lieferung Antriebe“ mit fester Dauer 30 Arbeitstage, dann bleibt die Dauer bei Anteilsänderungen gleich.

### US-063 Vorgesetzter setzt Priorität und Anteil
Als **Vorgesetzter** möchte ich Projektpriorität und Projektanteil meiner Mitarbeiter festlegen, damit klar ist, woran mit wie viel Zeit gearbeitet wird.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-PRIO-001, -003, -005

- [ ] Ich sehe pro Mitarbeiter alle Projekte mit Anteil und die Summe; über 100 % ist rot.
- [ ] Ich kann die Projekte im Portfolio per Ziehen in eine Rangfolge bringen.
- [ ] Bei jeder Änderung muss ich eine Begründung eingeben; betroffene Mitarbeiter werden benachrichtigt.

### US-064 Mitarbeiter schlägt Anteil vor
Als **Mitarbeiter** möchte ich einen anderen Projektanteil vorschlagen, damit ich auf Überlastung hinweisen kann, ohne selbst die Priorität zu ändern.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-PRIO-002

- [ ] Mein Vorschlag erscheint beim Vorgesetzten zur Freigabe.
- [ ] Bis zur Freigabe gilt der bisherige Anteil.

---

## EP-07 Personalplanung und Qualifikationen

### US-070 Auslastung über Wochen sehen
Als **Vorgesetzter** möchte ich eine Heatmap aller Mitarbeiter über die nächsten 12 Wochen sehen, damit ich Überlastungen vor dem Entstehen erkenne.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-RES-001

- [ ] Zellen sind grün (< 80 %), gelb (80–100 %), rot (> 100 %).
- [ ] Ein Klick auf eine Zelle zeigt die Tasks und Projekte dieser Woche.
- [ ] Filter nach Team und Abteilung.

### US-071 Abwesenheit eintragen
Als **Mitarbeiter** möchte ich meinen Urlaub eintragen, damit meine Tasks und Sprints automatisch realistisch geplant werden.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-RES-002, REQ-KAP-002

- [ ] Nach dem Eintragen verlängern sich betroffene Tasks entsprechend und mein Projektleiter wird benachrichtigt, wenn sich ein Meilenstein verschiebt.

### US-072 Qualifikationen pflegen
Als **Teamleiter** möchte ich für jede Person Skills mit Stufe 1–4 pflegen, damit ich weiß, wer was kann.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-RES-003

- [ ] Skills sind gruppiert (z. B. Elektrotechnik → TIA Portal, EPLAN; Konstruktion → SolidWorks).
- [ ] Die Matrix Person × Skill ist filterbar und nach Excel exportierbar.
- [ ] KI-abgeleitete Kompetenzen (vorhanden) erscheinen als Vorschlag, den ich übernehme oder verwerfe.

### US-073 Zertifikate überwachen
Als **Teamleiter Instandhaltung** möchte ich Zertifikate mit Ablaufdatum pflegen und rechtzeitig gewarnt werden, damit niemand ohne gültige Berechtigung arbeitet.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-RES-004

- [ ] Warnung 60 und 30 Tage vor Ablauf an die Person und den Teamleiter.
- [ ] Abgelaufene Zertifikate werden rot angezeigt und beim Zuteilungsvorschlag berücksichtigt.

### US-074 Passende Person finden
Als **Teamleiter** möchte ich für einen Auftrag eine Liste geeigneter Personen bekommen, damit ich schnell und begründet zuteile.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-RES-005, -006

- [ ] Gegeben ein Auftrag mit Skill „Siemens S7 ≥ 3“, Zertifikat „Elektrofachkraft“ und Fälligkeit Freitag, dann zeigt die Liste nur Personen mit gültigem Zertifikat, sortiert nach Skill-Stufe und freier Kapazität bis Freitag.
- [ ] Zu jeder Person steht die Begründung (z. B. „S7 Stufe 4, 12 h frei, Frühschicht“).
- [ ] Ein Klick weist den Auftrag zu.

---

## EP-08 Teams, Kommunikation und Rechte

### US-080 Teams anlegen
Als **Administrator** möchte ich Teams wie Konstruktion, Instandhaltung, Automatisierung und Softwareentwicklung anlegen, damit Arbeit und Kommunikation nach Teams laufen kann.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-TEAM-001

- [ ] Ein Team hat Name, Mitglieder und mindestens einen Teamleiter.
- [ ] Eine Person kann in mehreren Teams sein.

### US-081 Ganzes Team ansprechen
Als **Projektleiter** möchte ich in einem Kommentar `@Instandhaltung` schreiben, damit alle Mitglieder des Teams informiert sind.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-TEAM-002, REQ-KOMM-001, -002

- [ ] Beim Tippen von `@` werden Personen und Teams vorgeschlagen.
- [ ] Alle Teammitglieder erhalten eine Benachrichtigung mit Link auf den Kommentar.
- [ ] Mitglieder ohne Leserecht auf das Projekt erhalten nur den Hinweis, dass sie erwähnt wurden, ohne Inhalt, und der Verfasser wird darauf hingewiesen.

### US-082 Auftrag an ein Team
Als **Projektleiter** möchte ich einen Task dem Team Konstruktion statt einer Person zuweisen, damit das Team selbst entscheidet, wer ihn übernimmt.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-TEAM-003

- [ ] Der Task erscheint im Team-Eingang.
- [ ] Ein Mitglied kann „Übernehmen“ klicken; danach ist es Bearbeiter, das Team bleibt als zuständiges Team eingetragen.

### US-083 Projektrollen vergeben
Als **Projekt-Owner** möchte ich Personen und Teams Leserecht, Bearbeitungsrecht oder Owner-Recht geben, damit jeder nur das kann, was er soll.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-RECHT-002, -003, -005, -008

- [ ] Rollen: Owner, Bearbeiter, Mitwirkender, Leser, Gast.
- [ ] Gegeben ein Leser, wenn er per API oder Oberfläche einen Task ändern will, dann lehnt der Server ab (HTTP 403).
- [ ] Gegeben ein Mitwirkender, dann kann er nur ihm zugewiesene Objekte ändern, aber alle kommentieren.
- [ ] Budget und Rechnung kann ich für alle außer Owner und Vorgesetzte ausblenden.
- [ ] Jede Rechteänderung steht im Audit-Log.

### US-084 Vorgesetzter schaut in Projekte
Als **Vorgesetzter** möchte ich alle Projekte meiner Mitarbeiter lesen können, auch die selbst angelegten, damit ich den Überblick habe.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-RECHT-004, -007

- [ ] Ich sehe alle Projekte meines Bereichs im Portfolio, ohne dass mich jemand einladen muss.
- [ ] Ändern kann ich nur, wenn ich im Projekt eine Rolle mit Schreibrecht habe.
- [ ] Als „privat“ markierte persönliche Notizen sehe ich nicht (vorbehaltlich OP-03).

### US-085 Änderungen nachvollziehen
Als **Projektleiter** möchte ich bei jedem Objekt sehen, wer wann was geändert hat, damit ich Abweichungen erklären kann.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-KERN-006

- [ ] Die Historie zeigt Zeitpunkt, Person, Feld, alten und neuen Wert.
- [ ] Die Historie kann niemand bearbeiten oder löschen, auch kein Administrator über die Oberfläche.

### US-086 Projektleiter verwaltet sein Projekt
Als **Projektleiter** möchte ich Mitglieder und Teams meines Projekts selbst einladen, entfernen und ihnen Rollen geben, damit ich dafür keinen System-Administrator brauche.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-RECHT-009, -013

- [ ] Als Owner sehe ich in den Projekteinstellungen den Bereich „Mitglieder und Rollen“.
- [ ] Ich kann Personen und ganze Teams hinzufügen und ihnen eine Projektrolle zuweisen.
- [ ] Gegeben ich bin der einzige Owner, wenn ich mich herabstufen will, dann wird das abgelehnt mit dem Hinweis, zuerst einen weiteren Owner zu bestimmen.

### US-087 Eigene Projektrollen definieren
Als **Projektleiter** möchte ich eigene Rollen wie „Konstrukteur“ oder „Kunde“ anlegen und pro Bereich festlegen, was sie dürfen, damit z. B. nicht jeder den Ablaufplan ändern oder Dateien ablegen kann.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-RECHT-010, -011, -015

- [ ] Die Rollen Owner, Bearbeiter, Mitwirkender, Leser, Gast sind vorbelegt; ich kann sie ändern, kopieren, umbenennen und eigene anlegen.
- [ ] Für jede Rolle stelle ich je Bereich (Ablaufplan, Quality Gates, Tasks, Board, Backlog/Sprints, Dateien, Dokumente, Anforderungen, Risiko, Budget, Kommentare, Mitglieder, Projekteinstellungen) die Stufe ein: kein Zugriff, lesen, nur eigene ändern, anlegen und ändern, löschen.
- [ ] Alle Rollen und Rechte sehe ich in einer Matrix auf einer Seite.
- [ ] Eine Rolle, die noch Mitgliedern zugewiesen ist, kann ich erst löschen, nachdem ich eine Ersatzrolle gewählt habe.

### US-088 Rechte werden durchgesetzt
Als **Projektleiter** möchte ich, dass Mitglieder ohne Recht „Ablaufplan ändern“ den Gantt nur ansehen und ohne Recht „Dateien hochladen“ nichts ablegen können, damit der Plan und die Ablage sauber bleiben.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-RECHT-005, -012

- [ ] Gegeben die Rolle „Konstrukteur“ mit Ablaufplan = lesen, dann sind im Gantt und im V-Diagramm Ziehen, Größenänderung und Tabellenbearbeitung deaktiviert.
- [ ] Gegeben die Rolle „Kunde“ mit Dateien = lesen, dann ist der Hochladen-Knopf ausgeblendet, und ein direkter API-Aufruf zum Hochladen wird mit HTTP 403 abgelehnt.
- [ ] Gegeben die Rolle „Mitwirkender“ mit Tasks = nur eigene, dann kann sie zugewiesene Tasks ändern, fremde nur lesen und kommentieren.
- [ ] Gegeben Board = lesen, dann kann die Person Karten nicht zwischen Buckets ziehen und keine Buckets verwalten.

### US-089 Projekt als andere Rolle ansehen
Als **Projektleiter** möchte ich das Projekt in der Sicht einer Rolle ansehen, damit ich prüfen kann, ob meine Rechte richtig eingestellt sind.
**Prio** S · **Phase** 2 · **Anforderungen** REQ-RECHT-015

- [ ] Über „Ansehen als …“ wähle ich eine Rolle; die Oberfläche zeigt genau deren Rechte, ein Banner weist auf den Prüfmodus hin.
- [ ] Im Prüfmodus kann ich nichts ändern.

---

## EP-09 Portfolio

### US-090 Alle Projekte auf einen Blick
Als **Vorgesetzter** möchte ich alle Projekte mit Priorität, Ampel, Fortschritt und nächstem Meilenstein sehen, damit ich entscheiden kann, wo ich eingreife.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-PORT-001, -002

- [ ] Ampel Termin: rot, wenn ein Meilenstein auf dem kritischen Pfad mehr als 5 Arbeitstage hinter der Baseline liegt (Schwelle einstellbar).
- [ ] Ampel Kosten: rot, wenn Ist + Restschätzung das Budget um mehr als 10 % übersteigt.
- [ ] Umschaltbar auf einen Zeitstrahl aller Projekte.

### US-091 Statusbericht exportieren
Als **Projektleiter** möchte ich einen Statusbericht als PDF oder Word erzeugen, damit ich ihn ohne Nacharbeit verschicken kann.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-PORT-003

### US-092 Sehen, was die Priorität kostet
Als **Vorgesetzter** möchte ich beim Verschieben eines Projekts in der Rangfolge sofort sehen, welche Projekte dadurch Kapazität verlieren, damit ich Prioritäten bewusst setze.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-PORT-006, REQ-PRIO-001, REQ-KAP-008

- [ ] Gegeben Team Automatisierung mit 4 Personen (4 × 28 h = 112 h planbar) und Bedarf SM42 60 h, Retrofit 40 h, Prüfstand 20 h, wenn die Rangfolge SM42, Retrofit, Prüfstand ist, dann fehlen dem Prüfstand 8 h/Woche.
- [ ] Wenn ich den Prüfstand vor Retrofit setze, dann ist der Prüfstand gedeckt und Retrofit fehlen 8 h/Woche.
- [ ] Die Portfolio-Tabelle zeigt je Projekt „Gedeckt“ (grün) oder „x h/Wo fehlen“ (rot) mit den betroffenen Teams.
- [ ] Jede Änderung der Rangfolge wird mit Begründung historisiert (REQ-PRIO-005).

### US-093 Statusbericht automatisch an die Geschäftsführung
Als **Vorgesetzter** möchte ich, dass der Portfolio-Statusbericht jeden Freitag automatisch an die Geschäftsführung geht, damit ich ihn nicht von Hand zusammenstelle.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-PORT-007

- [ ] Der Bericht enthält je Projekt Ampeln, Stand, nächste Schritte, Ressourcenlage und offenen Entscheidungsbedarf (rot hervorgehoben).
- [ ] Projektleiter können ihren Abschnitt bis zum Versand ergänzen; ohne Ergänzung wird der erzeugte Text verwendet.

---

## EP-10 Instandhaltung

### US-100 Anlagenstruktur
Als **Teamleiter Instandhaltung** möchte ich Werk, Halle, Linie, Maschine und Baugruppe als Baum pflegen, damit jeder Auftrag einer Anlage zugeordnet ist.
**Prio** M · **Phase** 4 · **Anforderungen** REQ-IH-001

- [ ] Je Anlage: Stammdaten, Dokumente, Historie aller Aufträge und Störungen.

### US-101 Wartungsplan
Als **Teamleiter Instandhaltung** möchte ich Wartungspläne nach Zeit oder Betriebsstunden anlegen, damit Wartungsaufträge automatisch entstehen.
**Prio** M · **Phase** 4 · **Anforderungen** REQ-IH-002

- [ ] Gegeben ein Plan „alle 3 Monate, 10 Tage Vorlauf“, dann wird der Auftrag 10 Tage vor Fälligkeit erzeugt und dem Team Instandhaltung zugewiesen.
- [ ] Gegeben ein Plan „alle 5.000 h“ und ein gemeldeter Zählerstand von 4.800 h, dann wird ein Auftrag erzeugt, sobald die Prognose die Schwelle innerhalb der Vorlaufzeit erreicht.

### US-102 Störung per QR-Code melden
Als **Maschinenbediener** möchte ich den QR-Code an der Maschine scannen und eine Störung mit Foto melden, damit die Instandhaltung sofort Bescheid weiß.
**Prio** M · **Phase** 4 · **Anforderungen** REQ-IH-003

- [ ] Nach dem Scan ist die Anlage vorausgefüllt; Pflicht sind nur Beschreibung und Dringlichkeit.
- [ ] Die Störung erscheint innerhalb von 5 s im Team-Eingang Instandhaltung und löst eine Benachrichtigung aus.

### US-103 Auftrag am Handy abschließen
Als **Instandhalter** möchte ich Aufträge am Handy annehmen, Zeit und Material buchen und abschließen, auch ohne Netz, damit ich nicht zurück an den PC muss.
**Prio** S · **Phase** 4 · **Anforderungen** REQ-IH-005

- [ ] Ohne Netz erfasste Daten werden bei Verbindung synchronisiert; Konflikte werden angezeigt.

### US-104 Anlagen-Kennzahlen
Als **Vorgesetzter** möchte ich MTBF, MTTR und Verfügbarkeit je Anlage sehen, damit ich Investitionen begründen kann.
**Prio** S · **Phase** 4 · **Anforderungen** REQ-IH-006

---

## EP-11 Anforderungen und Engineering

### US-110 Anforderungen verfolgen
Als **Projektleiter** möchte ich jede Anforderung mit Stories, Tasks und Testfällen verknüpfen, damit ich bei der Abnahme jede Anforderung belegen kann.
**Prio** M · **Phase** 5 · **Anforderungen** REQ-ANF-001, -002

- [ ] Die Verfolgbarkeits-Matrix zeigt pro Anforderung die verknüpften Objekte und den Teststatus.
- [ ] Anforderungen ohne Testfall sind markiert.

### US-111 Anforderungsstände vergleichen
Als **Projektleiter** möchte ich den Stand „Angebot“ mit dem Stand „Abnahme“ vergleichen, damit ich Mehraufwand gegenüber dem Kunden belegen kann.
**Prio** M · **Phase** 5 · **Anforderungen** REQ-ANF-003

- [ ] Der Vergleich listet neue, geänderte und gelöschte Anforderungen mit Textunterschied.

### US-112 Änderungsantrag
Als **Projektleiter** möchte ich einen Change Request mit Auswirkung auf Termin und Kosten stellen und freigeben lassen, damit Änderungen nicht unkontrolliert ins Projekt laufen.
**Prio** M · **Phase** 5 · **Anforderungen** REQ-ANF-004

- [ ] Der CR verweist auf betroffene Anforderungen und Tasks.
- [ ] Nach Freigabe werden die Änderungen übernommen und eine neue Baseline vorgeschlagen.

### US-113 FAT/SAT-Protokoll
Als **Inbetriebnehmer** möchte ich Testfälle mit Schritten abarbeiten und das Abnahmeprotokoll als PDF erzeugen, damit FAT und SAT dokumentiert sind.
**Prio** M · **Phase** 5 · **Anforderungen** REQ-ANF-005

- [ ] Je Schritt: erwartetes Ergebnis, Ist-Ergebnis, bestanden/nicht bestanden, Foto.
- [ ] Nicht bestandene Schritte erzeugen automatisch einen Bug-Task.
- [ ] Das PDF enthält Freigabe mit Name und Datum beider Seiten.

---

## EP-12 Integrationen und Automatisierung

### US-120 Regel ohne Programmierung
Als **Projektleiter** möchte ich Regeln wie „Wenn Status Warten länger als 7 Tage, dann Mail an Verantwortlichen“ selbst anlegen, damit Routinen automatisch laufen.
**Prio** S · **Phase** 6 · **Anforderungen** REQ-INT-001

### US-121 Excel-Import
Als **Projektleiter** möchte ich eine bestehende Excel-Projektliste importieren, damit ich nicht alles neu abtippe.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-INT-005

- [ ] Spalten werden per Auswahl den Feldern zugeordnet; eine Vorschau zeigt die ersten 20 Zeilen und Fehler vor dem Import.

### US-122 Benachrichtigung in Teams
Als **Mitarbeiter** möchte ich Erwähnungen auch in Microsoft Teams bekommen, damit ich nichts verpasse, wenn die App nicht offen ist.
**Prio** C · **Phase** 6 · **Anforderungen** REQ-KOMM-003, REQ-INT-006

### US-123 Import aus anderen Tools
Als **Projektleiter** möchte ich meine Projekte aus Jira, Trello, Planner oder MS Project übernehmen, damit ich ohne Abtippen umsteigen kann.
**Prio** S · **Phase** 6 · **Anforderungen** REQ-INT-007

- [ ] Ich wähle Quelle und Datei, ordne Felder, Status bzw. Buckets und Personen zu.
- [ ] Ein Probelauf zeigt, wie viele Objekte angelegt würden und welche Zeilen Fehler haben, ohne etwas zu speichern.
- [ ] Nach dem Import sind Hierarchie und Abhängigkeiten (bei MS Project) erhalten.

### US-124 Termine im Outlook-Kalender
Als **Mitarbeiter** möchte ich meine Tasks und Meilensteine als Kalender in Outlook abonnieren, damit ich sie neben meinen Terminen sehe.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-INT-008

- [ ] In „Mein Profil“ kopiere ich meine persönliche iCal-URL und abonniere sie in Outlook.
- [ ] Änderungen im Tool erscheinen nach der nächsten Aktualisierung des Kalenders.
- [ ] Mit „Neue URL erzeugen“ wird die alte URL sofort ungültig.

### US-125 Benutzer automatisch aus Entra ID
Als **Administrator** möchte ich, dass neue Kollegen aus Entra ID automatisch angelegt und Ausgeschiedene deaktiviert werden, damit niemand vergessen wird und Ehemalige keinen Zugriff behalten.
**Prio** S · **Phase** 6 · **Anforderungen** REQ-INT-009

- [ ] Gegeben ein Nutzer wird in Entra ID deaktiviert, dann ist er im Tool innerhalb von 40 Minuten deaktiviert, seine Tasks bleiben erhalten und der Projektleiter wird informiert.
- [ ] Gegeben die Entra-Gruppe „Instandhaltung“ ist dem Team Instandhaltung zugeordnet, dann werden Gruppenmitglieder automatisch Teammitglieder.

### US-126 Anbindung an Power Automate
Als **Projektleiter** möchte ich das Tool mit Power Automate verbinden, damit ich Dienste anbinden kann, für die es keine eigene Integration gibt.
**Prio** S · **Phase** 6 · **Anforderungen** REQ-INT-010, -011

---

## EP-13 Ansichten, Suche und Papierkorb

### US-130 Dieselben Daten in vielen Ansichten
Als **Projektleiter** möchte ich mein Projekt wahlweise als Liste, Tabelle, Board, Timeline, Kalender, Workload, Diagramm, Dateien oder Karte sehen, damit ich je nach Frage die passende Sicht habe.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-ANS-001, -002, -010

- [ ] Über „+ Ansicht“ lege ich eine neue Ansicht an, benenne sie und sie erscheint als Tab.
- [ ] Gegeben ich verschiebe einen Task im Kalender, dann ist das neue Datum sofort in Tabelle, Board und Gantt sichtbar.
- [ ] Ansichten, für die mir das Recht fehlt (z. B. Budget-Spalten), zeigen diese Daten nicht.

### US-142 Passende Ansichten an jedem Ort
Als **Nutzer** möchte ich unter Aufgaben die Arbeitsansichten (Liste, Board, Kalender) und unter Planung die Planungsansichten (Modellsicht, Gantt, PSP, Meilensteine, Verfolgbarkeit) mit einem Klick wechseln, damit ich dieselben Daten so sehe, wie es gerade passt, ohne dass Aufgaben und Planung vermischt werden.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-ANS-011 bis -015

- [ ] Die Umschaltleiste ist an allen Orten gleich aufgebaut, zeigt aber nur die Ansichten, die dorthin gehören; die gewählte Ansicht bleibt je Ort gespeichert.
- [ ] Im V-Modell-Projekt zeigt die Verfolgbarkeit je Spezifikationsebene die gepaarte Testebene, Arbeitspakete, Testfälle und die Abdeckung in Prozent.
- [ ] Ein Klick auf eine Aufgabe oder einen Meilenstein öffnet in jeder Ansicht das Seitenpanel.
- [ ] Gegeben die Anforderung „Pneumatik mit Energietrennung“ ohne Prüfschritt, dann zeigt die Verfolgbarkeit „Nachweis fehlt“ in Rot.
- [ ] Im Board kann ich Karten mit ← → zwischen den Buckets verschieben; die Liste zeigt sofort den neuen Bucket.

### US-143 Aufgaben in den Fokus legen
Als **Mitarbeiter** möchte ich Aufgaben mit einem Stern in meinen Fokus legen und sortieren, damit ich weiß, was ich heute erledige, und sehe, ob es in meinen Tag passt.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-ANS-016, REQ-KAP-008

- [ ] Der Stern legt eine Aufgabe in den Bucket „Fokus“ und nimmt sie mit einem zweiten Klick wieder heraus (zurück in den vorherigen Bucket).
- [ ] „Mein Fokus“ zeigt die Aufgaben in meiner Reihenfolge (↑ ↓) mit Aufwand; gegeben 2 h und 4 h im Fokus und 5,6 h planbar pro Tag, dann steht dort „6 h von 5,6 h“ in Rot.
- [ ] Überfällige Aufgaben, die nicht im Fokus sind, werden vorgeschlagen und lassen sich mit einem Klick hinzufügen.

### US-144 Sehen, wer was hat
Als **Projektleiter** möchte ich je Person sehen, wie viele Stunden aus meinem Projekt in welcher Woche anliegen, und Aufgaben per Ziehen umverteilen, damit niemand über seinem Anteil liegt.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANS-017, REQ-ANS-019, REQ-KAP-009

- [ ] Gegeben S. Keller mit 40 % Anteil (11,2 h/Woche) und 14 h offenen Aufgaben in KW 47, dann ist die Zelle KW 47 rot.
- [ ] Ziehe ich eine Aufgabe auf L. Wagner, ist sie sofort dort, beide Zeilen rechnen neu und L. Wagner wird benachrichtigt.

### US-145 Ziehen statt Klicken
Als **Nutzer** möchte ich Karten, Balken und Kacheln mit der Maus ziehen, damit Planen sich anfühlt wie auf dem Whiteboard.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-ANS-019, -020, REQ-GANTT, REQ-DASH-001

- [ ] Board, Kanban und Sprint-Board: Karte in eine andere Spalte ziehen ändert den Status; die Zielspalte wird beim Darüberziehen hervorgehoben.
- [ ] Gegeben das WIP-Limit „In Arbeit“ ist erreicht, wenn ich eine weitere Karte hineinziehe, dann bleibt sie stehen und ich sehe den Grund.
- [ ] Gantt: Balken ziehen verschiebt Start und Ende, der Griff am rechten Ende ändert die Dauer; die Phase passt sich an; die Baseline bleibt erhalten.
- [ ] Jede Ziehen-Aktion geht auch per Knopf oder Tastatur.

### US-146 Im Kalender sehen, wer beteiligt ist
Als **Nutzer** möchte ich im Kalender an jedem Eintrag sehen, wer verantwortlich ist, und auf eine Person filtern, damit ich Termine schnell abstimmen kann.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-ANS-018

- [ ] Jeder Eintrag zeigt das Kürzel der Person; ein Klick auf eine Person in der Leiste blendet alle anderen aus.

### US-131 Tabelle mit Formeln
Als **Projektleiter** möchte ich eine Tabelle mit eigenen Spalten und Formeln wie in Excel, damit ich Auswertungen direkt im Tool mache.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-ANS-003

- [ ] Gegeben die Spalten Aufwand Plan und Aufwand Ist, wenn ich die Formelspalte `Aufwand_Ist / Aufwand_Plan` anlege, dann zeigt sie je Zeile den Quotienten in %.
- [ ] Ich kann gruppieren (z. B. nach Bucket) und sehe je Gruppe die Summe.
- [ ] Zellen sind direkt bearbeitbar; Export nach Excel übernimmt die sichtbaren Spalten.

### US-132 Kalender
Als **Mitarbeiter** möchte ich meine Tasks, Meilensteine und Abwesenheiten in einem Kalender sehen und per Ziehen verschieben, damit ich die Woche plane.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-ANS-005

### US-133 Workload umplanen
Als **Teamleiter** möchte ich in der Workload-Ansicht einen Task von einer überlasteten Person auf eine freie ziehen, damit ich Überlast direkt abbaue.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANS-006

- [ ] Gegeben Person A ist in KW 12 bei 130 %, wenn ich einen 8-h-Task auf Person B ziehe, dann sinkt A und steigt B sofort entsprechend.
- [ ] Fehlt Person B ein benötigter Skill oder ein Zertifikat (REQ-RES-005), erscheint eine Warnung.

### US-134 Diagramm aus einer Ansicht
Als **Vorgesetzter** möchte ich aus einer gefilterten Menge ein Diagramm erzeugen, etwa „offene Störungen je Anlage“, damit ich ohne Excel auswerte.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-ANS-007

### US-135 Alle Dateien eines Projekts
Als **Projektleiter** möchte ich alle Anhänge eines Projekts an einer Stelle sehen, damit ich die aktuelle Zeichnung nicht in 40 Tasks suchen muss.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-ANS-008

- [ ] Filter nach Dateityp, Objekt, Person und Datum; Vorschau für PDF und Bilder.
- [ ] Je Datei sehe ich alle Versionen und kann eine ältere öffnen.

### US-136 Hallenplan
Als **Teamleiter Instandhaltung** möchte ich den Hallenplan mit allen Anlagen als Pins sehen, eingefärbt nach offenen Störungen, damit ich auf einen Blick sehe, wo es brennt.
**Prio** C · **Phase** 4 · **Anforderungen** REQ-ANS-009

### US-137 Alles finden
Als **Mitarbeiter** möchte ich mit einem Suchfeld Tasks, Kommentare, Lessons Learned und Inhalte von PDFs finden, auch bei Tippfehlern, damit ich Wissen schnell wiederfinde.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-SUCHE-001, -002

- [ ] Gegeben ein Task „Motorschutzschalter getauscht“, wenn ich „motorschutz“ oder „Motorschuzschalter“ suche, dann wird er gefunden.
- [ ] Gegeben ein PDF mit dem Text „Drehmoment 45 Nm“, wenn ich „45 Nm“ suche, dann wird das PDF mit Fundstelle angezeigt.
- [ ] Treffer aus Projekten ohne mein Leserecht erscheinen nicht.

### US-138 Ansicht speichern und teilen
Als **Projektleiter** möchte ich eine gefilterte Ansicht („Alles, was diese Woche fällig ist und auf dem kritischen Pfad liegt“) speichern und mit dem Team teilen, damit alle dieselbe Liste nutzen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-SUCHE-003, -005, -006

- [ ] Beim Speichern wähle ich: persönlich, Projekt, Team oder alle.
- [ ] Relative Filter („diese Woche“) werden bei jedem Öffnen neu berechnet.
- [ ] Ich kann die Ansicht als Favorit in die Navigation legen.

### US-139 Viele Tasks auf einmal ändern
Als **Projektleiter** möchte ich 30 Tasks markieren und gemeinsam einer Person zuweisen und um eine Woche verschieben, damit ich das nicht 30-mal einzeln mache.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-SUCHE-007

- [ ] Vor dem Ausführen wird die Anzahl betroffener Objekte angezeigt.
- [ ] Objekte, für die mir das Recht fehlt, werden übersprungen und gemeldet.
- [ ] Die Massenänderung lässt sich mit einem Klick rückgängig machen.

### US-140 Gelöschtes wiederherstellen
Als **Projektleiter** möchte ich versehentlich gelöschte Tasks oder Projekte aus dem Papierkorb zurückholen, damit ein Fehlklick keine Arbeit vernichtet.
**Prio** M · **Phase** 0 · **Anforderungen** REQ-PAPIER-001, -002, -003, -004

- [ ] Gegeben ich lösche ein Projekt mit 120 Tasks, dann liegt es im Papierkorb und ist 30 Tage wiederherstellbar.
- [ ] Nach dem Wiederherstellen sind alle Tasks, Kommentare, Dateien, Abhängigkeiten und die Historie wieder da.
- [ ] Endgültiges Löschen ist nur für Owner und Administratoren möglich und verlangt eine Bestätigung mit Eingabe des Projektnamens.

### US-141 Projekt archivieren
Als **Projektleiter** möchte ich ein abgeschlossenes Projekt archivieren statt löschen, damit es durchsuchbar bleibt, aber meine Listen nicht füllt.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-PAPIER-005

---

## EP-14 Projektstrukturplan

### US-150 PSP als Baum
Als **Projektleiter** möchte ich mein Projekt als Projektstrukturplan von oben nach unten sehen und bearbeiten, damit ich den Umfang vollständig gliedere, bevor ich terminiere.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-PSP-001, -002, -003

- [ ] Jedes Element trägt automatisch einen Code (1, 1.1, 1.1.1 …).
- [ ] Per Klick auf „+“ unter einem Element lege ich ein Kind an; per Ziehen hänge ich Elemente um, die Codes werden neu vergeben.
- [ ] Ein im PSP angelegtes Arbeitspaket erscheint sofort im Gantt (ohne Termin, markiert als „noch nicht terminiert“).

### US-151 Gliederung wählen
Als **Projektleiter** möchte ich zwischen objekt-, funktions- und phasenorientierter Gliederung wählen, damit der PSP zu meinem Projekt passt (z. B. Sondermaschine nach Baugruppen).
**Prio** S · **Phase** 2 · **Anforderungen** REQ-PSP-004

### US-152 Arbeitspaket beschreiben
Als **Projektleiter** möchte ich für jedes Arbeitspaket Ziel, Inhalt, Ergebnis, Voraussetzungen, Aufwand, Kosten, Verantwortlichen und Abnahmekriterien festhalten, damit der Verantwortliche genau weiß, was er liefern muss.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-PSP-005, -006

- [ ] Aufwand und Kosten der Arbeitspakete werden nach oben summiert und am Projektknoten angezeigt.
- [ ] Die Arbeitspaketbeschreibung ist als PDF exportierbar.

### US-153 PSP drucken
Als **Projektleiter** möchte ich den PSP als PDF in A3 quer exportieren, damit ich ihn im Kick-off aufhängen kann.
**Prio** S · **Phase** 2 · **Anforderungen** REQ-PSP-008

---

## EP-15 Automatisierung

### US-160 Mail bei Statusänderung eines Tasks
Als **Projektleiter** möchte ich festlegen: „Wenn sich der Status von Task 1 ändert, dann sende mir eine Mail“, damit ich wichtige Änderungen sofort mitbekomme.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-AUTO-001, -002, -003, -005, -006, -008

- [ ] Am Task wähle ich „Automatisieren“ und bekomme den Satz „Wenn … dann …“ mit Auswahlfeldern.
- [ ] Gegeben die Regel „Wenn Status von SM42-117 sich ändert, dann Mail an mich“, wenn jemand den Task von „Fokus“ nach „Warten auf“ zieht, dann erhalte ich innerhalb von 2 Minuten eine Mail mit Titel, altem und neuem Status und Link.
- [ ] Die Regel darf ich als normaler Projektnutzer anlegen, weil sie nur mich benachrichtigt.

### US-161 Regel für ein ganzes Projekt
Als **Projektleiter** möchte ich Regeln für alle Tasks eines Projekts anlegen, z. B. „Wenn ein Task nach Erledigt gezogen wird und auf dem kritischen Pfad liegt, dann Teams-Nachricht an das Team Konstruktion“.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-AUTO-003, -004, -005, -008

- [ ] Projektweite Regeln erfordern das Recht „Projekteinstellungen“.
- [ ] Bedingungen lassen sich mit UND/ODER kombinieren.

### US-162 Rezept aus dem Katalog
Als **Mitarbeiter** möchte ich fertige Rezepte aus einem Katalog mit einem Klick übernehmen und anpassen, damit ich nicht jede Regel selbst bauen muss.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-AUTO-007

- [ ] Der Katalog enthält mindestens 30 Rezepte, gruppiert nach Thema (Termine, Eskalation, Qualität, Instandhaltung, Berichte).
- [ ] Die heutige Eskalation „Warten auf“ ist als Rezept vorhanden und standardmäßig aktiv.

### US-163 Regel prüfen und überwachen
Als **Projektleiter** möchte ich sehen, wann eine Regel gelaufen ist und ob sie fehlgeschlagen ist, und sie vorher testen können, damit ich mich auf die Automatisierung verlassen kann.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-AUTO-009, -010

- [ ] Das Protokoll zeigt je Ausführung Zeitpunkt, Auslöser, Ergebnis und ggf. Fehlertext.
- [ ] „Probelauf an Objekt X“ zeigt, was passieren würde, ohne es auszuführen.
- [ ] Zwei Regeln, die sich gegenseitig auslösen würden, brechen nach 10 Durchläufen ab und erzeugen eine Warnung.

### US-164 Sammelmail statt Mailflut
Als **Mitarbeiter** möchte ich Benachrichtigungen aus Regeln als tägliche Sammelmail bekommen, damit mein Postfach nicht überläuft.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-AUTO-011

---

## EP-16 Lessons Learned

### US-170 Erkenntnis sofort festhalten
Als **Mitarbeiter** möchte ich eine Lesson Learned direkt dann erfassen, wenn etwas schiefgeht oder gut läuft, damit sie nicht bis zum Projektende vergessen ist.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-LL-001, -002

- [ ] Felder: Was ist passiert, Ursache, Auswirkung (Zeit, Kosten, Qualität), Empfehlung; Schlagworte für Fachbereich, Phase, Anlage, Kunde, Lieferant.
- [ ] Ich kann die Lesson Learned aus einem Task, Kommentar oder Risiko heraus anlegen; die Verknüpfung bleibt erhalten.

### US-171 Projektabschluss mit Rückblick
Als **Projektleiter** möchte ich beim Projektende durch einen geführten Abschluss mit Soll-Ist-Vergleich und Lessons-Learned-Runde gehen, damit jedes Projekt sauber ausgewertet wird.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-LL-003

- [ ] Der Ablauf zeigt Termin-, Kosten- und Aufwandsabweichung gegenüber der Baseline.
- [ ] Alle Beteiligten können Beiträge und eine Bewertung abgeben.
- [ ] Am Ende entsteht ein Abschlussbericht als PDF; erst dann lässt sich der Status „Beendet“ setzen (sofern aktiviert).

### US-172 Aus früheren Projekten lernen
Als **Projektleiter** möchte ich beim Anlegen eines neuen Projekts passende Lessons Learned aus ähnlichen Projekten angezeigt bekommen, damit ich dieselben Fehler nicht wiederhole.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-LL-004, -005

- [ ] Gegeben ein neues Projekt mit Schlagwort „Kunde X“ und „Schweißroboter“, dann werden Lessons Learned mit diesen Schlagworten zuerst angezeigt.
- [ ] Zu Beginn jeder Phase werden die Lessons Learned dieser Phase aus ähnlichen Projekten eingeblendet.
- [ ] Ich kann einen Vorschlag mit „übernehmen“ als Risiko oder Task in mein Projekt holen.

### US-173 Maßnahmen umsetzen
Als **Vorgesetzter** möchte ich, dass aus Lessons Learned Maßnahmen werden, deren Umsetzung verfolgt wird, z. B. eine neue Prüfung in der Checkliste eines Quality Gates, damit sich wirklich etwas ändert.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-LL-006

- [ ] Maßnahmentypen: Task, Risiko, Änderung einer Vorlage, Änderung einer Gate-Checkliste.
- [ ] Eine Übersicht zeigt offene und umgesetzte Maßnahmen über alle Projekte.

### US-174 Wiederkehrende Probleme erkennen
Als **Vorgesetzter** möchte ich sehen, welche Probleme in mehreren Projekten wiederkehren, damit ich Ursachen grundsätzlich angehe.
**Prio** S · **Phase** 7 · **Anforderungen** REQ-LL-007, -008

### US-175 Wissen bewerten und vorgeschlagen bekommen
Als **Mitarbeiter** möchte ich hilfreiche Einträge markieren und passend zu meinen nächsten Aufgaben Einträge vorgeschlagen bekommen, damit gutes Wissen nach oben kommt.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-LL-009, REQ-LL-005

- [ ] Gegeben mein Meilenstein „Wareneingang Schaltschrank“ in zwei Wochen, dann wird die Checkliste Inbetriebnahme Schaltschrank mit dieser Begründung vorgeschlagen.
- [ ] Ein Klick auf „Hilfreich“ erhöht die Zahl um 1, ein zweiter Klick nimmt es zurück.
- [ ] Aus einem Eintrag kann ich mit einem Klick eine Aufgabe in meinem Projekt anlegen (REQ-LL-006).

---

## EP-17 Zeiterfassung und Kapazitätsabgleich

### US-180 Wochenzettel ausfüllen
Als **Mitarbeiter** möchte ich meine Zeiten in einem Wochenraster eintragen, in dem meine geplanten Tasks schon stehen, damit die Zeiterfassung in 5 Minuten erledigt ist.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ZEIT-002, -004

- [ ] Die Zeilen sind mit meinen Tasks der Woche vorbelegt; weitere Tasks füge ich per Suche hinzu.
- [ ] Ich sehe je Tag die Summe und die Abweichung zur Soll-Arbeitszeit.
- [ ] Freitag 14 Uhr erhalte ich eine Erinnerung, wenn die Woche noch nicht eingereicht ist.

### US-181 Wochenzettel freigeben
Als **Vorgesetzter** möchte ich eingereichte Wochenzettel freigeben oder mit Kommentar zurückgeben, damit nur geprüfte Zeiten in Budget und Rechnung fließen.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ZEIT-003, -005, -006

- [ ] Ich sehe alle offenen Freigaben in einer Liste und kann mehrere auf einmal freigeben.
- [ ] Freigegebene Wochen kann der Mitarbeiter nicht mehr ändern.
- [ ] Nicht freigegebene Zeiten sind in Budget und Rechnung als „vorläufig“ gekennzeichnet.

### US-182 Überlast automatisch auflösen
Als **Projektleiter** möchte ich, dass das System Tasks so verschiebt, dass niemand über 100 % ausgelastet ist, und mir das vorher zeigt, damit ich nicht von Hand jonglieren muss.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-RES-009, -010, -011

- [ ] „Kapazität abgleichen“ erzeugt eine Liste der Verschiebungen mit altem und neuem Termin und den betroffenen Meilensteinen.
- [ ] Ich kann alle, einzelne oder keine Verschiebungen übernehmen.
- [ ] Tasks auf dem kritischen Pfad, fest und manuell terminierte Tasks bleiben unverändert; was sich nicht auflösen lässt, wird als Konflikt aufgeführt.

---

## EP-18 App, Einführung und Hilfe

### US-190 App auf dem Handy
Als **Instandhalter** möchte ich das Tool als App auf meinem Handy installieren und Push-Nachrichten bekommen, damit ich neue Aufträge sofort sehe.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-NF-012, -013

- [ ] Über „Zum Startbildschirm hinzufügen“ erscheint ein App-Symbol.
- [ ] Bei Zuweisung oder Erwähnung kommt eine Push-Nachricht, auch wenn die App geschlossen ist.
- [ ] Meine Tasks und Aufträge sind ohne Netz lesbar.

### US-191 Mit Beispielprojekt starten
Als **neuer Nutzer** möchte ich beim ersten Start ein Beispielprojekt und eine kurze Tour bekommen, damit ich ohne Schulung loslegen kann.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-NF-014, -016

- [ ] Je Vorgehensmodell gibt es ein Beispielprojekt; ich kann es mit einem Klick löschen.
- [ ] Die Tour lässt sich überspringen und später wieder starten.

### US-192 Hilfe dort, wo ich sie brauche
Als **Mitarbeiter** möchte ich Fachbegriffe wie „Gesamtpuffer“ per Tooltip erklärt bekommen und von jeder Seite zum passenden Handbuchabschnitt springen, damit ich nicht suchen muss.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-NF-015

---

## EP-19 Übersicht, Ampel und Navigation

### US-200 Meine Aufgaben auf einen Blick
Als **Mitarbeiter** möchte ich schnell sehen, welche meiner Aufgaben überfällig sind, welche heute fällig sind und welche im Plan liegen, damit ich weiß, womit ich anfange.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-AMPEL-001, -008

- [ ] Oben in „Meine Arbeit“ stehen drei Zähler: überfällig (rot), heute fällig, im Plan; ein Klick filtert die Liste.
- [ ] Die Liste ist gruppiert nach Überfällig, Heute, Diese Woche, Später, Ohne Termin.
- [ ] Gegeben ein Task mit Fälligkeit gestern und Status nicht erledigt, dann steht er rot in der Gruppe „Überfällig“.

### US-201 Meilensteine farbig nach Terminstatus
Als **Projektleiter** möchte ich in jeder Visualisierung sehen, welche Meilensteine erledigt (grün), im Plan (weiß) oder überfällig (rot) sind, damit ich ohne Lesen erkenne, wo es hakt.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-AMPEL-001, -003, -004, -005, -006

- [ ] Gantt-Balken, V-Diagramm-Knoten, PSP-Knoten, Board-Karten, Kalendereinträge und Tabellenzeilen verwenden dieselben Farben.
- [ ] Gegeben ein Meilenstein im Plan mit zwei überfälligen Untermeilensteinen, dann trägt er einen roten Hinweis „2 überfällig“.
- [ ] Zusätzlich zur Farbe ist ein Symbol sichtbar (✓, !).
- [ ] Ein Klick auf „überfällig“ in der Legende blendet alles andere aus.

### US-202 Frühwarnung gelb
Als **Projektleiter** möchte ich optional einen gelben Zustand „gefährdet“ sehen, wenn der Puffer aufgebraucht ist oder die Prognose den Termin reißt, damit ich reagiere, bevor es rot wird.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-AMPEL-002, -007

### US-203 Aus der Grafik direkt an die Stelle
Als **Nutzer** möchte ich auf einen Meilenstein im Gantt, im V-Diagramm, im PSP, im Backlog oder im Sprint-Review klicken und sofort seine Untermeilensteine und Aufgaben sehen, damit ich nicht über Reiter suchen muss.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-NAV-004, -005, -007

- [ ] Ein Klick öffnet rechts ein Seitenpanel mit Untermeilensteinen, Tasks, Kommentaren, Dateien und Historie; die Grafik bleibt sichtbar.
- [ ] Im Panel kann ich einen Untermeilenstein anklicken und gelange eine Ebene tiefer; Brotkrumen führen zurück.
- [ ] Ein Klick auf ein Diagrammsegment „7 überfällig“ öffnet die Liste dieser 7 Objekte.

### US-204 Vom Task ins Projekt springen
Als **Mitarbeiter** möchte ich von einem Task in „Meine Arbeit“ oder im Dashboard mit einem Klick ins Projekt springen, damit ich den ganzen Zusammenhang sehe.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-NAV-005, -006, -008

- [ ] Klick auf den Task öffnet das Seitenpanel; „Im Projekt öffnen“ zeigt das Projekt mit aufgeklapptem Meilenstein und markiertem Task.
- [ ] Die Browser-Zurück-Taste bringt mich zu meiner Liste zurück, mit denselben Filtern.
- [ ] Die URL des Tasks kann ich kopieren und einem Kollegen schicken.

### US-205 Weniger Reiter
Als **Nutzer** möchte ich zusammengehörige Funktionen in einem Bereich finden statt in vielen ähnlichen Reitern, damit das Projekt übersichtlich bleibt.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-NAV-001, -002

- [ ] Die Hauptnavigation hat höchstens 7 Einträge, die Projektnavigation höchstens 7 Bereiche.
- [ ] Board, Liste, Tabelle und Kalender sind Ansichten im Bereich „Aufgaben“, keine eigenen Reiter.
- [ ] RACI, AKV, Ressourcen und Mitglieder stehen gemeinsam im Bereich „Team“.
- [ ] Bereiche ohne aktives Modul sind ausgeblendet.

### US-206 Einstellungsknopf im Projekt
Als **Projektleiter** möchte ich alle Projekteinstellungen hinter einem Zahnrad oben rechts finden, damit sie nicht als eigener Reiter zwischen der Arbeit stehen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-NAV-003

- [ ] Das Zahnrad ist nur sichtbar, wenn ich das Recht „Projekteinstellungen“ habe.
- [ ] Dort finde ich Stammdaten, Stufe und Module, Vorgehensmodell, Buckets, Mitglieder und Rollen, Automatisierungen, Archivieren und Löschen.

### US-207 Schnell etwas anlegen
Als **Nutzer** möchte ich von jeder Seite aus mit „+ Neu“ oder Strg+M einen Task, Meilenstein, eine Störung oder einen Projektantrag anlegen, damit ich dafür nicht navigieren muss.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-NAV-009

---

## EP-20 Gestaltung und Dashboards

### US-210 Moderne, farbige Oberfläche
Als **Nutzer** möchte ich eine Oberfläche im Stil von Microsoft bzw. iOS mit farbigen Statusfeldern wie bei monday.com, damit die Arbeit mit dem Tool angenehm ist und Zustände sofort ins Auge fallen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-UI-001, -002, -003, -007, -008

- [ ] Status, Priorität und Typ sind farbige Felder; ein Klick öffnet die Auswahl direkt in der Zeile.
- [ ] Gruppen (Sprint, Phase, Bucket) haben farbigen Rand und Titel und eine Summenzeile mit Farbverteilung.
- [ ] Personen erscheinen mit Avatar.
- [ ] Ein einheitliches Icon-Set ersetzt die heutigen Emojis.
- [ ] Alle Texte erreichen mindestens Kontrast 4,5:1 in hell und dunkel.

### US-211 Eigene Farben und Darstellung
Als **Nutzer** möchte ich hellen oder dunklen Modus, Akzentfarbe und Dichte selbst wählen, damit das Tool zu mir passt.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-UI-004

### US-212 Projekt individuell gestalten
Als **Projektleiter** möchte ich Projektfarbe, Symbol, Farben und Namen der Status, Buckets und Prioritäten sowie die Felder auf den Karten festlegen, damit das Projekt zu unserem Ablauf passt.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-UI-005, -006

### US-213 Persönliches Dashboard bauen
Als **Nutzer** möchte ich mir meine Startseite per Drag & Drop aus Widgets zusammenstellen, z. B. Ampelzähler, meine Aufgabenliste, Kalender und Meilensteine meiner Projekte, damit ich morgens alles auf einen Blick habe.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-DASH-001, -002, -003, -004, -006

- [ ] Widgets ziehe ich aus einer Leiste ins Raster, ändere die Größe am Rand und verschiebe sie.
- [ ] Jedes Widget hat eine Datenquelle (Projekt, mehrere Projekte, gespeicherte Ansicht, Team) und eigene Filter.
- [ ] Klick auf einen Wert im Widget öffnet die zugehörigen Objekte.
- [ ] Auf dem Handy erscheinen die Widgets untereinander.

### US-214 Projekt-Dashboard
Als **Projektleiter** möchte ich für jedes Projekt eine Übersicht als Dashboard mit Meilenstein-Zeitstrahl, Ampel, Burndown oder Budget-Verlauf und Risikomatrix, damit ich und mein Chef den Stand sofort sehen.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-DASH-002, -003, -005

- [ ] Beim Anlegen eines Projekts wird die zum Vorgehensmodell passende Dashboard-Vorlage eingesetzt.
- [ ] Ich kann das Dashboard für alle Projektmitglieder freigeben.

---

## EP-21 Projektanalysen grafisch

### US-220 Scope sichtbar machen
Als **Projektleiter** möchte ich den Scope als Diagramm mit Systemgrenze sehen, innen „im Scope“, außen „nicht im Scope“, damit die Abgrenzung im Kick-off für alle klar ist.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANA-001, -008

- [ ] Einträge kann ich per Ziehen zwischen innen und außen verschieben.
- [ ] Bestehender Freitext aus `scope_im` und `scope_out` wird bei der Migration zeilenweise in Einträge umgewandelt.

### US-221 Umfeld als Grafik
Als **Projektleiter** möchte ich die Umfeldanalyse als Kreisdiagramm sehen (intern innen, extern außen, sachlich links, sozial rechts, Größe nach Wichtigkeit, Farbe nach Einstellung), damit ich Einflüsse auf einen Blick erkenne.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANA-002, -009

- [ ] Ein Klick auf einen Faktor öffnet dessen Details; neue Faktoren lege ich per Klick in den passenden Sektor an.
- [ ] Umschalten auf Tabellenansicht zeigt dieselben Daten.

### US-222 Stakeholder-Portfolio
Als **Projektleiter** möchte ich meine Stakeholder in einer Matrix Einfluss × Einstellung sehen und verschieben, damit ich die passende Strategie je Stakeholder ableite.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANA-003

### US-223 Stacey-Matrix
Als **Projektleiter** möchte ich mein Projekt als Punkt in der Stacey-Matrix setzen und sofort das empfohlene Vorgehensmodell sehen, damit die Wahl begründet ist.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANA-004

- [ ] Ich ziehe den Punkt stufenlos; die Zonen einfach, kompliziert, komplex, chaotisch sind farbig hinterlegt.
- [ ] Die Empfehlung aktualisiert sich beim Ziehen.
- [ ] Spätere Neubewertungen zeigen den Verlauf des Punkts.

### US-224 RACI als Matrix
Als **Projektleiter** möchte ich die RACI als Matrix aus Arbeitspaketen und Personen sehen und Zellen per Klick setzen, damit Zuständigkeiten vollständig und widerspruchsfrei sind.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANA-005, REQ-PSP-007

- [ ] Ein Klick auf eine Zelle schaltet leer → R → A → C → I → leer.
- [ ] Zeilen ohne genau ein A oder ohne R sind rot markiert.
- [ ] Die Zeilen kommen aus den Arbeitspaketen des PSP.

### US-225 AKV als Tabelle oder Diagramm
Als **Projektleiter** möchte ich Aufgaben, Kompetenzen und Verantwortung je Person als Tabelle oder Diagramm sehen, damit ich Lücken zwischen Verantwortung und Kompetenz erkenne.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANA-006

- [ ] Umschalter Tabelle / Diagramm.
- [ ] Hinweis, wenn einer Person Verantwortung ohne passende Kompetenz zugewiesen ist.

### US-226 Risikomatrix
Als **Projektleiter** möchte ich Risiken als Punkte in der Matrix Eintrittswahrscheinlichkeit × Tragweite sehen, mit Pfeil zur Position nach der Maßnahme, damit die Wirkung der Maßnahmen sichtbar wird.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANA-007

---

## EP-22 Projektanträge

### US-230 Projekt einreichen
Als **Mitarbeiter** möchte ich eine Projektidee mit Anlass, Ziel, Nutzen und grobem Aufwand einreichen und den Stand verfolgen, damit gute Ideen nicht verloren gehen.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-ANTRAG-001, -002, -006

- [ ] Ich kann einen Entwurf speichern und später einreichen.
- [ ] Nach dem Einreichen landet der Antrag bei meinem Vorgesetzten laut Organisationsstruktur.
- [ ] Ich sehe jederzeit den Status und werde bei jeder Änderung benachrichtigt.
- [ ] Der Antrag führt mich in vier Schritten durch Idee, Einordnung, Aufwand und Termin, Prüfen und Einreichen (REQ-ANTRAG-009).
- [ ] Gegeben „Ergebnis teilweise klar“ und „Technik völlig neu“, dann schlägt die Einordnung „Komplex: Scrum“ vor.
- [ ] Unter „Meine Anträge“ sehe ich je Antrag den Ablauf Eingereicht → Bewertung → Entscheidung → Projekt angelegt und kann Rückfragen direkt beantworten.

### US-231 Rückfrage zum Antrag
Als **Vorgesetzter** möchte ich Rückfragen zu einem Antrag stellen, damit ich vor der Entscheidung alle Informationen habe.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-ANTRAG-004

### US-232 Antrag bewerten
Als **Vorgesetzter** möchte ich Anträge nach gewichteten Kriterien bewerten und mit anderen Anträgen vergleichen, damit wir die richtigen Projekte machen.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANTRAG-003, -007

- [ ] Kriterien und Gewichte sind einstellbar; der Punktwert wird berechnet.
- [ ] Bei mehreren Bewertern sehe ich Mittelwert und Streuung.
- [ ] Das Antragsportfolio zeigt alle Anträge als Matrix Nutzen × Aufwand und die freie Kapazität der Teams.

### US-233 Genehmigen und zuteilen
Als **Vorgesetzter** möchte ich einen Antrag genehmigen und dabei in einem Schritt Projektleiter, Teams, Projektanteile, Priorität, Vorlage und Termine festlegen, damit das Projekt sofort startklar angelegt wird.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANTRAG-005, REQ-PRIO-001

- [ ] Nach „Genehmigen und anlegen“ existiert das Projekt mit diesen Angaben; der Antrag verweist darauf.
- [ ] Projektleiter und Teammitglieder werden benachrichtigt.
- [ ] Bei „zurückgestellt“ ist ein Wiedervorlagedatum Pflicht, bei „abgelehnt“ eine Begründung.
- [ ] Beim Wählen des Rangs sehe ich, ob das neue Projekt gedeckt ist und welche Projekte wie viele Stunden pro Woche verlieren (REQ-ANTRAG-011); danach steht es sofort im Portfolio.

---

## EP-23 Organisation und Benutzergruppen

### US-240 Organisationsstruktur pflegen
Als **Administrator** möchte ich Bereiche, Abteilungen und Teams mit Leitung und Mitgliedern pflegen und für jede Person den Vorgesetzten festlegen, damit klar ist, wer wem unterstellt ist.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-ORG-001, -002, -004, -008

- [ ] Gegeben Person A ist Abteilung Instandhaltung zugeordnet und deren Leitung ist B, dann ist B für A der Vorgesetzte für Leserechte, Anteile, Wochenzettel und Anträge.
- [ ] Änderungen an der Struktur stehen in der Historie.
- [ ] Gegeben M. Yilmaz wechselt von Automatisierung nach Konstruktion, dann gehen offene Freigaben für M. Yilmaz an L. Wagner; bereits entschiedene bleiben bei S. Keller (REQ-ORG-009).
- [ ] Die Liste „Personen“ zeigt je Person Einheit, disziplinarischen und fachlichen Chef sowie eine geplante Vertretung.

### US-241 Organigramm
Als **Administrator** möchte ich die Struktur als Organigramm sehen und Personen per Ziehen umhängen, damit Umorganisationen schnell gepflegt sind.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-ORG-003

### US-242 Benutzergruppen
Als **Administrator** möchte ich Gruppen wie „Gate-Prüfer Elektrik“ unabhängig vom Organigramm bilden, damit ich Freigaben, Rechte und Benachrichtigungen an Gruppen statt an Einzelpersonen hänge.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-ORG-005

### US-243 Vertretung
Als **Vorgesetzter** möchte ich für meinen Urlaub eine Vertretung mit meinen Freigaberechten benennen, damit Anträge und Wochenzettel nicht liegen bleiben.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-ORG-006

- [ ] Ich wähle Person und Zeitraum; die Vertretung wird benachrichtigt und erhält nur für diesen Zeitraum meine Freigaberechte.

### US-244 Freigabewege einstellen
Als **Administrator** möchte ich alle Freigabewege mit Entscheider und Erinnerungsfrist an einer Stelle sehen und einstellen, damit die Regeln für alle gleich und nachvollziehbar sind.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-ORG-010, -011, REQ-AUFG, REQ-KAP-008

- [ ] Die Übersicht listet: Aufgabe im Projekt, von Teamkollegen, von außerhalb des Teams, Wochenzettel, Projektanteil, Projektantrag, Quality Gate.
- [ ] Die Erinnerungsfrist ist je Weg zwischen 1 und 10 Arbeitstagen einstellbar.
- [ ] Der Planungsfaktor (Standard 80 %) ist dort einstellbar und zeigt die planbaren Stunden (35 h → 28 h).

---

## EP-24 Sprachen

### US-250 Eigene Sprache wählen
Als **Nutzer** möchte ich die Sprache der Oberfläche selbst wählen, damit auch Kollegen an anderen Standorten das Tool in ihrer Sprache nutzen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-NF-008, -017, -021

- [ ] In „Mein Profil“ wähle ich Sprache und Region; die Oberfläche wechselt sofort, ohne neues Anmelden.
- [ ] Gegeben ich wähle Englisch, dann sehe ich Menüs, Buckets, Status und Hilfe auf Englisch, während ein Kollege gleichzeitig Deutsch sieht.
- [ ] Datum und Zahlen erscheinen im Format meiner Region.
- [ ] Keine Beschriftung ist abgeschnitten, auch nicht bei langen deutschen Wörtern.

### US-251 Mails in meiner Sprache
Als **Mitarbeiter** möchte ich Benachrichtigungen und Mails in meiner eingestellten Sprache bekommen, damit ich sie sofort verstehe.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-NF-018

### US-252 Eigene Bezeichnungen übersetzen
Als **Projektleiter** möchte ich meine eigenen Buckets, Felder und Rollen in mehreren Sprachen benennen, damit internationale Teammitglieder sie verstehen.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-NF-020

### US-253 Kommentar übersetzen lassen
Als **Mitarbeiter** möchte ich einen Kommentar eines Kollegen per Klick in meine Sprache übersetzen lassen, damit Sprachgrenzen die Zusammenarbeit nicht bremsen.
**Prio** S · **Phase** 7 · **Anforderungen** REQ-NF-019

- [ ] Die Übersetzung ist als solche gekennzeichnet; das Original bleibt sichtbar.

---

## EP-25 Aufgaben anlegen, annehmen und freigeben

### US-260 Aufgabe für mich selbst anlegen
Als **Mitarbeiter** möchte ich mir selbst schnell eine Aufgabe anlegen, mit oder ohne Projekt, damit ich nichts vergesse.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-AUFG-001

- [ ] „+ Neu“ ist von jeder Seite erreichbar; mit „Für mich“ steht die Aufgabe nach einem Klick in Meine Arbeit.
- [ ] Gegeben meine Auslastung KW 47 von 86 % (von 28 h), wenn ich 16 h anlege, dann zeigt das Formular „86 % → 143 % · über der planbaren Zeit“; speichern ist trotzdem möglich.

### US-261 Im Projekt direkt zuweisen
Als **Projektleiter** möchte ich Projektmitgliedern Aufgaben direkt zuweisen, ohne Freigabe und Annahme, damit die Projektarbeit nicht ausgebremst wird.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-AUFG-002, REQ-RECHT

- [ ] Wähle ich im Formular ein Projekt, heißt der Knopf „Aufgabe zuweisen“ und die Aufgabe ist sofort aktiv.
- [ ] Übersteigen die Projektaufgaben einer Person ihren freigegebenen Projektanteil, sehe ich eine Warnung.
- [ ] Ohne passendes Recht in der Projektrolle kann ich nur mir selbst Aufgaben zuweisen.

### US-262 Aufgabe an einen Teamkollegen geben
Als **Mitarbeiter** möchte ich einem Kollegen aus meinem Team nach Absprache eine Aufgabe geben, ohne den Chef zu fragen, damit wir uns im Team selbst organisieren.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-AUFG-003, -008

- [ ] Gegeben M. Yilmaz ist in meinem Team und ich wähle „Ohne Projekt“, dann zeigt das Formular „Du gibst ab → M. Yilmaz nimmt an → M. Yilmaz arbeitet“ und der Knopf heißt „An M. Yilmaz senden“.
- [ ] Unter „Von dir vergeben“ steht „Wartet auf Annahme durch M. Yilmaz“, bis angenommen oder abgelehnt wurde.

### US-263 Aufgabe vom Teamkollegen annehmen
Als **Mitarbeiter** möchte ich Aufgaben von Teamkollegen annehmen, ablehnen oder einen anderen Termin vorschlagen, damit nichts ohne mein Wissen in meiner Liste landet.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-AUFG-003

- [ ] Meine Arbeit zeigt oben „Neue Aufgaben für dich“ mit „Bitte annehmen · Teamkollege“ und den Knöpfen Annehmen, Anderer Termin, Ablehnen.
- [ ] Nach „Annehmen“ steht die Aufgabe in meiner Liste und zählt in meine Kapazität; die Auslastung vorher → nachher wird angezeigt.
- [ ] Nach „Ablehnen“ wird der Absender informiert und kann die Aufgabe jemand anderem geben.

### US-264 Anfrage von außerhalb des Teams als Chef freigeben
Als **Vorgesetzter** möchte ich Aufgaben, die meine Mitarbeitenden von außerhalb ihres Teams bekommen sollen, mit Blick auf ihre Auslastung freigeben, damit niemand von außen überlastet wird.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-AUFG-004, -005, -007, REQ-RES-006

- [ ] Gegeben L. Wagner (Konstruktion) fragt für S. Keller (Automatisierung) 6 h ohne Projekt an und S. Keller hat 92 % in KW 47, dann zeigt meine Freigabe „92 % → 113 %“ in Rot, den Einwand von S. Keller und einen Vorschlag mit freier Kapazität.
- [ ] Ich kann freigeben, mit neuem Termin freigeben, an eine andere Person geben oder mit Begründung ablehnen.
- [ ] Bis zur Entscheidung sieht S. Keller die Aufgabe als „Wartet auf Freigabe“ und kann einen Einwand schreiben.

### US-265 Keine Anfrage bleibt liegen
Als **Absender** möchte ich, dass offene Annahmen und Freigaben erinnert werden und bei Abwesenheit an die Vertretung gehen, damit meine Aufgabe nicht liegen bleibt.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-AUFG-009, -010

- [ ] Offene Annahme: Erinnerung an die Person nach 1 Arbeitstag.
- [ ] Offene Freigabe: Erinnerung an den Chef nach 2, an die Vertretung nach 5 Arbeitstagen; ist der Chef abwesend, sofort an die Vertretung.

---

## EP-26 Themen und strategischer Fokus

### US-270 Projekte Themen zuordnen
Als **Projektleiter** möchte ich meinem Projekt ein Hauptthema und Nebenthemen mit erwartetem Beitrag geben, damit sichtbar ist, wozu das Projekt beiträgt.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-THEMA-001, -002, -007

- [ ] Ich wähle höchstens drei Themen; das erste ist das Hauptthema.
- [ ] Im Portfolio stehen die Themen als farbige Marken unter dem Projektnamen; danach kann ich filtern und gruppieren.
- [ ] Beim Projektabschluss wird der erwartete Beitrag (z. B. 18.000 €/Jahr) mit dem erreichten verglichen.

### US-271 Fokus setzen und Verteilung sehen
Als **Vorgesetzter** möchte ich festlegen, auf welche Themen der Bereich setzt, und sehen, ob die Kapazität dorthin fließt, damit Strategie und Arbeit zusammenpassen.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-THEMA-003, -004

- [ ] Je Thema stelle ich Kein, Niedrig, Mittel oder Hoch ein.
- [ ] Gegeben Kosteneinsparung „Hoch“ und nur ein laufendes Projekt mit diesem Hauptthema, dann zeigt die Verteilung bei Kosteneinsparung „ist“ deutlich unter „soll“ und hebt die Abweichung hervor.

### US-272 Priorität aus dem Fokus vorschlagen lassen
Als **Vorgesetzter** möchte ich eine Rangfolge vorgeschlagen bekommen, die zu meinem Fokus passt, damit ich die Prioritäten schnell neu ordnen kann.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-THEMA-005, REQ-PRIO-005

- [ ] Der Vorschlag zeigt je Projekt Punkte und wie viele Plätze es auf- oder absteigt.
- [ ] „Vorschlag übernehmen“ ändert die Rangfolge im Portfolio; die Kapazitätsansicht rechnet sofort neu und die Projektleitungen werden informiert.

### US-273 Themen im Antrag
Als **Mitarbeiter** möchte ich beim Antrag sehen, welche Themen der Bereichsleitung gerade wichtig sind, und meine Themen wählen, damit ich meine Idee passend begründen kann.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-THEMA-006

- [ ] Die Einordnung im Antrag zeigt „Aktueller Fokus: …“ und lässt bis zu drei Themen wählen.
- [ ] In der Bewertung ist „Strategische Passung“ aus dem Fokus vorbelegt und kann vom Bewerter geändert werden.

## EP-27 Tagesplanung, Rückmeldungen und Feinschliff

### US-280 Meinen Tag mit Outlook planen
Als **Mitarbeiter** möchte ich meine Outlook-Termine und Aufgaben auf einer Zeitachse sehen und Aufgaben in freie Zeiten ziehen, damit ich weiß, wann ich was heute schaffe und nicht zu viel in den Fokus nehme.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-KAP-012, REQ-INT-012

- [ ] Gegeben heute 3,5 h Termine in Outlook, dann zeigt „Mein Tag“ sie als Blöcke und rechnet die freie Zeit aus.
- [ ] Ziehe ich eine 2-h-Aufgabe auf 11:00 und um 12:00 ist Mittagspause, dann wird sie abgewiesen und ich sehe, womit sie sich überschneidet.
- [ ] Braucht mein Fokus 6 h, frei sind aber 4 h, dann warnt das Cockpit, bevor ich anfange.
- [ ] „Als Fokuszeit in Outlook blocken“ trägt die Blöcke als „beschäftigt“ ein.

### US-281 Begründen statt nur klicken
Als **Mitarbeiter** möchte ich bei Einwand, Ablehnung, anderem Termin oder Rückfrage einen eigenen Text schreiben, damit die andere Seite weiß, was los ist.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-KOMM-006, REQ-AUFG, REQ-ANTRAG-004

- [ ] Jede dieser Aktionen öffnet ein Textfeld mit Vorschlägen; ein Vorschlag wird angehängt, nicht ersetzt.
- [ ] Ohne Text kommt der Hinweis „Bitte kurz begründen“, nichts wird gesendet.
- [ ] Bei der Rückfrage im Antrag kann ich jede Zahl schreiben, „ca. 18.000 €“ ist nur ein Vorschlag.

### US-282 Gate mit Auflage
Als **Entscheider** möchte ich ein Gate bestanden, mit Auflage bestanden oder nicht bestanden setzen, damit Auflagen nicht vergessen werden.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-GANTT-019

- [ ] „Mit Auflage bestanden“ verlangt einen Text; danach steht die Auflage als Aufgabe mit Termin am Gate.
- [ ] Das Gate zeigt gelb „Bestanden mit Auflage“, bis die Auflage erledigt ist.

### US-283 Warten auf wen
Als **Mitarbeiter** möchte ich beim Schieben nach „Warten auf“ eintragen, auf wen und warum ich warte, damit ich gezielt nachfassen kann.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KANBAN-015

- [ ] Nach dem Ziehen öffnet sich die Aufgabe mit der Frage „Auf wen wartest du?“ und einem Vorschlag.
- [ ] Die Karte zeigt „⏳ wartet auf L. Wagner“; „Jetzt nachfassen“ schreibt L. Wagner an und steht im Verlauf.

### US-284 Kommentar an der Aufgabe
Als **Mitarbeiter** möchte ich an einer Aufgabe Kommentare schreiben und Personen mit @ erwähnen, damit die Abstimmung an der Aufgabe bleibt.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-KOMM-001, REQ-KOMM-005

- [ ] Im Detailpanel stehen Verlauf und Eingabefeld; @T. Brandt erzeugt bei T. Brandt eine Nachricht im Posteingang.
- [ ] Auf Karten zeigt „💬 2“, dass es Kommentare gibt.

### US-285 Meilenstein und Gate anlegen
Als **Projektleiter** möchte ich über „Neu“ auch Meilensteine, Quality Gates und Phasen anlegen, im Projekt direkt für dieses Projekt.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-AUFG-013, REQ-GANTT-007

- [ ] Im Projekt ist das Projekt vorbelegt; ein Meilenstein mit Titel, Phase und Termin steht danach im Gantt und in den Meilensteinen.
- [ ] Ein Quality Gate bekommt Entscheider und eine Checkliste aus Vorlage (Konstruktionsfreigabe, FAT, SAT).

### US-286 Teamleitung verteilt die Woche
Als **Teamleitung** möchte ich Aufgaben aus dem Team-Eingang auf Person und Tag ziehen und dabei Stunden, Urlaub und Qualifikation sehen, damit die Arbeit fair verteilt ist.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-AUFG-012, REQ-RES, REQ-KAP

- [ ] Wähle ich eine Aufgabe, sind Zellen grün, wenn die Qualifikation passt, und gelb, wenn sie fehlt.
- [ ] Nach dem Zuweisen steigen die Stunden der Zelle; über 5,6 h wird sie rot. Die Person muss nicht annehmen.

### US-287 Projektübersicht nach meinem Bedarf
Als **Projektmitglied** möchte ich die Übersicht eines Projekts selbst zusammenstellen, damit ich sehe, was mir in diesem Projekt wichtig ist.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-DASH-007

- [ ] „Übersicht anpassen“: Kacheln ziehen, breiter/schmaler, ausblenden, hinzufügen; je Projekt gespeichert.

### US-288 Gantt kürzer ziehen
Als **Projektleiter** möchte ich Balken am Anfang und am Ende ziehen, um sie kürzer oder länger zu machen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-GANTT-018

- [ ] Rechten Griff nach links ziehen verkürzt, linken Griff nach rechts ziehen verkürzt; nie kürzer als ein Tag.

### US-289 Termine in den nächsten 5 Arbeitstagen verschieben
Als **Mitarbeiter** möchte ich auf der Startseite Aufgaben und Termine auf einen anderen Tag ziehen.
**Prio** S · **Phase** 2 · **Anforderungen** REQ-DASH-008

- [ ] Eine Aufgabe auf Montag ziehen setzt die Fälligkeit auf Montag und zeigt das als Meldung.

### US-290 KI ohne Cloud
Als **Administrator** möchte ich, dass das Cockpit das lokale Modell aus dem Ordner nutzt, weil Cloud-KI und Ollama bei uns nicht erlaubt sind.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-NF-007, REQ-NF-022

- [ ] Mit `KI_BACKEND=lokal` und einer `.gguf` in `models/` zeigen die KI-Funktionen „Lokales Modell (…gguf)“.
- [ ] Die Verwaltung zeigt das aktive Modell und lässt KI je Funktion ein- und ausschalten.

## EP-28 Akte, Beteiligte, Profil und KI-Entwürfe

### US-291 Mein Tag getrennt von meinen Aufgaben
Als **Mitarbeiter** möchte ich meinen Tag, meine Aufgaben und Anfragen auf getrennten Reitern sehen, damit die Seite nicht überladen ist.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-NAV-010

- [ ] Meine Arbeit öffnet mit „Mein Tag“; die anderen Reiter sind ein Klick entfernt.
- [ ] Der Reiter „Anfragen“ zeigt die Zahl offener Anfragen.

### US-292 KI füllt die Lücken
Als **Mitarbeiter** möchte ich, dass Fokus und Fälliges gesetzt sind und die KI für freie Lücken passende Aufgaben aus meinem Backlog vorschlägt.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-KAP-013

- [ ] Gegeben 14:30–15:30 ist frei, dann steht dort ein Vorschlag mit Begründung (Priorität, Fälligkeit, Dauer).
- [ ] „Anderer Vorschlag“ zeigt die nächste passende Aufgabe, „Übernehmen“ plant sie ein.

### US-293 Geplantes erscheint nicht doppelt
Als **Mitarbeiter** möchte ich eine für Freitag geplante Aufgabe am Montag nicht noch einmal angeboten bekommen, außer ich habe sie nicht geschafft.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-KAP-014

- [ ] Freitag 14:00 geplant, Freitag ist erst 9:00: Montag zeigt die Aufgabe nicht.
- [ ] Freitag 7:00–7:30 geplant, vorbei und offen: Montag zeigt „↻ Fr 07:00–07:30 nicht geschafft“.
- [ ] Nur 1 von 2 h eingeplant: Montag zeigt „↻ Rest 1 h“.

### US-294 Datum selbst eintragen
Als **Projektleiter** möchte ich Fälligkeit, Termin, Start und Ende als Datum eintippen oder wählen können, nicht nur verschieben.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-GANTT-020

- [ ] Datumsfeld in Aufgabe, Meilenstein, Gate und beim Anlegen; Ende vor Start wird angepasst.
- [ ] Bei einer Phase mit Unterpunkten steht, dass sich die Dauer daraus ergibt.

### US-295 Mehrere Leute an einer Aufgabe
Als **Projektleiter** möchte ich im Projekt mehrere Personen an eine Aufgabe setzen, eine davon verantwortlich.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-AUFG-014

- [ ] Gegeben 4 h Aufwand und zwei Beteiligte, dann zählen je 2 h in der Ansicht Personen.
- [ ] Karte und Kalender zeigen „+1“; der Filter nach Person findet die Aufgabe bei beiden.

### US-296 Akte am Objekt
Als **Bearbeiter** möchte ich beim Klick auf Aufgabe, Meilenstein oder Gate dokumentieren, Fotos und Dateien ablegen, Zeit buchen und Rechnungen einreichen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KERN-009, REQ-KERN-010

- [ ] Reiter Überblick, Doku, Dateien, Zeiten, Kosten mit Anzahl.
- [ ] Ein Messwert-Eintrag erscheint im Projekt-Logbuch; ein Foto auch unter Projekt › Dokumente.
- [ ] Eine Rechnung über 6.900 € geht an H. Lorenz, eine über 1.480 € gibt die Projektleitung frei; ohne Beleg wird nicht eingereicht.

### US-297 Mein Profil
Als **Nutzer** möchte ich Profilbild, Berufsbezeichnung, Fähigkeiten, Sprache, Hell/Dunkel und Benachrichtigungen an einer Stelle einstellen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-UI-010, REQ-NF-008

- [ ] Klick aufs Profilbild öffnet „Profil und Einstellungen“; Dunkel wirkt sofort.
- [ ] Eine neue Fähigkeit bekommt Stufe 1; ab Stufe 3 steht „bestätigt durch Teamleitung“.

### US-298 KI schreibt vor, ich schicke ab
Als **Projektleiter** möchte ich, dass die KI Nachfass-Mails, Termineinladungen und den Wochenbericht vorbereitet, damit ich nur noch prüfe und sende.
**Prio** S · **Phase** 4 · **Anforderungen** REQ-INT-013, REQ-NF-022, REQ-NF-023

- [ ] Im Posteingang stehen Entwürfe mit „Warum“, Empfängern und vorbelegtem Text.
- [ ] Bei einem Termin wähle ich eine der freien Zeiten aus Outlook; erst „Einladung senden“ verschickt.
- [ ] Verworfene Entwürfe kommen nicht wieder.

### US-299 Feld rechts größer
Als **Nutzer** möchte ich das rechte Detailfeld breiter ziehen oder groß machen, um in Ruhe zu beschreiben und zu bearbeiten.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-UI-011

- [ ] Ziehen am linken Rand ändert die Breite; ◂ ▸ in 160-px-Schritten; ⤢ über die ganze Breite.
- [ ] ✎ öffnet die Beschreibung als großes Textfeld.

### US-300 KI läuft auf dem Server
Als **Administrator** möchte ich, dass die KI auf dem Cockpit-Server läuft und niemand blockiert wird, während sie rechnet.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-NF-022, REQ-NF-023

- [ ] Zwei Nutzer starten gleichzeitig eine Zusammenfassung: beide sehen „wird erstellt“, die Seite bleibt bedienbar, die Ergebnisse kommen nacheinander.

### US-301 In halben Stunden planen
Als **Mitarbeiter** möchte ich Blöcke in „Mein Tag“ in 30-Minuten-Schritten verlängern und kürzen.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-KAP-012

- [ ] Die Zeitachse zeigt volle und halbe Stunden; −30 und +30 am Block ändern die Dauer und melden die neue Zeit.

### US-302 Entwurf landet in Outlook
Als **Projektleiter** möchte ich, dass ein KI-Mailentwurf in Outlook › Entwürfe landet, damit ich ihn dort mit Anhängen und Signatur fertig mache.
**Prio** S · **Phase** 4 · **Anforderungen** REQ-INT-013

- [ ] „In Outlook als Entwurf“ legt die Mail mit Empfänger, Betreff und meinem bearbeiteten Text in Outlook ab.
- [ ] Ein Termin öffnet sich in Outlook vorausgefüllt mit der gewählten freien Zeit; die Einladung sende ich dort.
- [ ] „Direkt senden“ geht ebenfalls; die Mail steht dann in „Gesendete Elemente“.

### US-303 Antwort auf eine Lieferantenmail
Als **Projektleiter** möchte ich auf eingehende Mails zu meinen Projekten fertige Antwortvorschläge bekommen.
**Prio** S · **Phase** 4 · **Anforderungen** REQ-INT-014

- [ ] Gegeben eine Auftragsbestätigung mit späterem Liefertermin, dann zeigt der Posteingang die Mail, den betroffenen Meilenstein und die Fassungen Annehmen, Nachhaken, Eskalieren.
- [ ] „⚡ Meilenstein öffnen und Termin prüfen“ springt zum Meilenstein.
- [ ] Bei „Ölwechsel erledigt, Foto anbei“ setzt eine Aktion die Aufgabe auf erledigt und legt das Foto in die Akte.

### US-304 Alles finden
Als **Nutzer** möchte ich oben ein Stichwort tippen und sofort Aufgaben, Meilensteine, Wissen, Dateien, Doku, Kommentare und Personen dazu sehen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-SUCHE-001, REQ-SUCHE-009

- [ ] „servo“ findet die Aufgabe, den Meilenstein, den Lessons-Learned-Eintrag und das Angebot als Datei.
- [ ] Ein Treffer bei Doku öffnet das Objekt direkt im Reiter Doku.

## EP-29 KI als Mitplaner und Wissenspfleger

### US-305 Fokuszeit ist Arbeitszeit
Als **Mitarbeiter** mit fester Fokuszeit von 10 bis 12 Uhr in Outlook möchte ich, dass „Mein Tag“ diese Zeit als Platz für Aufgaben behandelt, nicht als Termin.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-INT-016, REQ-KAP-012

- [ ] Die Fokuszeit erscheint grün hinter den Aufgaben; ich kann Aufgaben hineinziehen.
- [ ] „Fokus automatisch einplanen“ füllt zuerst die Fokuszeit.
- [ ] Legt jemand trotzdem einen Termin hinein, gilt nur der Rest der Fokuszeit als frei.

### US-306 Ein Vorschlag nach dem anderen
Als **Nutzer** möchte ich KI-Vorschläge einzeln durchgehen statt alle auf einmal zu sehen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-UI-012

- [ ] Der Posteingang zeigt „Vorschlag 1 von 7“ mit ‹ ›; nach „In Outlook als Entwurf“ kommt der nächste.

### US-307 KI-Hilfe mit Outlook abschalten
Als **Nutzer** möchte ich die KI-Hilfe mit Outlook für mich ausschalten können.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-INT-015

- [ ] Im Profil gibt es den Hauptschalter; aus heißt: keine Mails gelesen, keine Entwürfe oder Termine in Outlook.
- [ ] Der Posteingang hat einen direkten Link dorthin.

### US-308 KI schlägt Wissen vor
Als **Projektleiter** möchte ich, dass die KI aus Kommentaren und Doku Lessons Learned, Technik-Gedächtnis und Vorlagen-Verbesserungen vorschlägt.
**Prio** S · **Phase** 4 · **Anforderungen** REQ-LL-010

- [ ] Der Vorschlag ist vorformuliert (Beobachtung, Ursache, Empfehlung) und vor dem Speichern bearbeitbar.
- [ ] Doppelte Einträge lassen sich mit einem Klick zusammenführen; Bewertungen bleiben erhalten.

### US-309 KI hilft beim Verteilen
Als **Teamleitung** möchte ich einen Vorschlag, wer welche Aufgabe an welchem Tag übernimmt, damit Qualifikation und Auslastung passen.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-RES-006, REQ-RES-012

- [ ] Der Vorschlag nennt je Aufgabe Person, Tag und Grund; „Alle übernehmen“ verteilt alles auf einmal.
- [ ] Gegeben die Woche ist voll, dann steht beim Vorschlag „nur mit Mehrarbeit“ und ein Hinweis, auf KW 48 zu legen.

### US-310 Ein halbes Jahr vorausplanen
Als **Teamleitung** möchte ich bis zu 6 Monate im Voraus sehen und planen, wer wann wie ausgelastet ist, und Bedarf aus Projekten Personen zuordnen.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-RES-013, REQ-RES-012

- [ ] Ziehe ich „MES-Anbindung, 40 %, Jan–Mai“ auf eine Person im Januar, steigen ihre Monate Januar bis Mai um 40 Punkte.
- [ ] Die KI schiebt einen Bedarf um bis zu 3 Monate, wenn es dann ohne Überlast passt, und sagt das.

### US-311 Wartung, die sich wiederholt
Als **Instandhaltungsleiter** möchte ich Wartungen einmal als wiederkehrende Aufgabe anlegen, damit sie automatisch wiederkommen und in der Planung zählen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-RES-014, REQ-IH-002

- [ ] „+ Wiederkehrende Aufgabe“ öffnet „Neu“ mit Wiederholung, im Projekt Instandhaltung.
- [ ] Nach Erledigung entsteht die nächste Aufgabe; die Karte zeigt „🔁 wöchentlich“.

## EP-30 Planen und Arbeiten nach eigenem Geschmack

### US-312 Ein halbes Jahr Tag für Tag
Als **Teamleitung** möchte ich Aufgaben für jeden Arbeitstag bis zu 6 Monate im Voraus auf Personen verteilen.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-RES-015, REQ-RES-013

- [ ] Ich blättere mit ‹ › von KW 47 bis KW 19 oder springe über „Jan“, „Feb“ … direkt in den Monat.
- [ ] „4 Wochen, kompakt“ zeigt je Person und Tag die Stunden; Urlaub (U), Schulung (S), Feiertag (FT) und Betriebsruhe (BR) sind gesperrt.
- [ ] Gegeben K. Weber hat „Wochenwartung jeden Montag“, dann steht sie an jedem Montag mit 0,5 h, ohne dass ich sie eintrage.
- [ ] Wähle ich eine Aufgabe mit Fälligkeit 15.01., bietet das Cockpit „Zur Fälligkeit springen“ an; ein Tag nach der Fälligkeit ist gelb umrandet.

### US-313 Aufgabe ans Team statt an eine Person
Als **Projektleiter** möchte ich eine Aufgabe an das Team Instandhaltung geben, ohne selbst zu entscheiden, wer sie macht.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-AUFG-015

- [ ] Unter „Wer erledigt es?“ wähle ich „Ein Team“ und sehe je Team Leitung, Auslastung und offene Aufgaben.
- [ ] Nach dem Absenden liegt die Aufgabe im Team-Eingang; R. Fischer wird benachrichtigt.
- [ ] Sobald sie verteilt ist, zeigt „Von mir vergeben“ Person und Tag.

### US-314 Ein Anlegen-Dialog, der nicht erschlägt
Als **Nutzer** möchte ich beim Anlegen nur sehen, was ich meistens brauche.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-AUFG-016

- [ ] Wiederholen und „Arbeiten mit“ sind eingeklappt; die Kopfzeile zeigt, was gesetzt ist (z. B. „🔁 wöchentlich“).

### US-315 Mein Dashboard, meine Kacheln
Als **Teamleitung** möchte ich auf der Startseite Team-Eingang, Auslastung und Zertifikate vorne haben.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-DASH-009

- [ ] Layout „Teamleitung“ lädt diese Anordnung mit einem Klick; danach kann ich weiter ziehen, verschieben, Breite und Höhe ändern.
- [ ] Ohne Maus verschiebe ich Kacheln mit ◀ ▶.
- [ ] In „Meilensteine und Gates“ stelle ich über ⚙ den Zeitraum auf 90 Tage.

### US-316 Posteingang so, wie ich lese
Als **Nutzer mit großem Bildschirm** möchte ich die Nachrichtenliste breiter und rechts haben und die KI-Entwürfe einklappen.
**Prio** S · **Phase** 2 · **Anforderungen** REQ-UI-013

- [ ] „⚙ Ansicht anpassen“ bietet Position, Breite, Dichte und Höhe; die Einstellung bleibt nach dem Neuladen.

### US-317 Belege ansehen, ohne herunterzuladen
Als **Projektleiter** möchte ich ein abgelegtes PDF oder Foto direkt in der Akte ansehen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KERN-011

- [ ] Klick auf die Datei öffnet die Vorschau; ‹ › blättert zur nächsten Datei; „Herunterladen“ und „Neuer Tab“ sind da.

### US-318 Jeder Lieferant, nicht nur fünf
Als **Mitarbeiter** möchte ich beim Einreichen einer Rechnung jeden Lieferanten finden oder einen neuen eintragen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KERN-012, REQ-KERN-010

- [ ] „Pilz“ oder „70059“ im Suchfeld findet Pilz (Sicherheitstechnik).
- [ ] Gibt es keinen Treffer, übernimmt „+ als neuen Lieferanten verwenden“ den Namen; der Einkauf prüft ihn vor der Zahlung.

## EP-31 Einfach anfangen, alles im Griff

### US-319 Projekt in einer Minute
Als **Konstrukteur** möchte ich ein kleines Projekt ohne Antrag anlegen, damit ich sofort Aufgaben verteilen kann.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-STUFE-006, REQ-STUFE-001

- [ ] „+ Neues Projekt“ › „Leere Liste“ › Name › „Projekt anlegen“ öffnet das Board mit Backlog, Fokus, Warten auf, Erledigt.
- [ ] Ohne Name erscheint „Bitte einen Namen eingeben“, nichts wird angelegt.

### US-320 Sondermaschine aus Vorlage
Als **Projektleiter** möchte ich aus der Vorlage „Sondermaschine“ mit Start 23.11. anlegen, damit Phasen, Gates und Startaufgaben sofort stehen.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-STUFE-006, REQ-VORL-001, REQ-VORL-002

- [ ] Es entstehen 4 Phasen, 4 Quality Gates mit Checkliste und 6 Aufgaben, terminiert ab dem Start.
- [ ] Ein Gate „Mit Auflage“ legt die Auflage als Aufgabe an.
- [ ] Unter ⚙ Einstellungen speichere ich das Projekt als eigene Vorlage; sie steht danach im Assistenten.

### US-321 Stufe ändern, Reiter folgen
Als **Projektleiter** möchte ich die Instandhaltung von Stufe 1 auf 3 heben und sehe sofort Team, Analyse und Finanzen.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-STUFE-004, REQ-STUFE-007, REQ-NAV-011

- [ ] Senke ich wieder ab, verschwinden die Reiter; Daten bleiben und sind beim Erhöhen wieder da.

### US-322 Meine Spalten
Als **Projektleiter** möchte ich im Board eine Spalte „In Prüfung“ anlegen, umbenennen und verschieben, ohne in die Einstellungen zu gehen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KANBAN-016

- [ ] „+ Spalte (Bucket)“ legt sie vor „Erledigt“ an; der Name ist direkt in der Überschrift änderbar.
- [ ] 🗑 löscht sie; ihre Aufgaben landen im Backlog, die Meldung sagt wie viele.

### US-323 Anlegen ohne Umweg
Als **Nutzer** möchte ich in Board, Liste, Kalender und Personen eine Aufgabe direkt eintippen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KANBAN-017

- [ ] „+“ am 20.11. im Kalender legt eine Aufgabe fällig am 20.11. an.
- [ ] „+ Aufgabe für L. Wagner“ in Personen legt sie mit L. Wagner als Verantwortlichem an.

### US-324 Details so, wie ich arbeite
Als **Nutzer** möchte ich wählen, ob Details rechts oder als Pop-up öffnen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-NAV-012

- [ ] ⧉ im Detail schaltet auf Pop-up, ⇥ zurück; die Wahl gilt auch nach dem Neuladen.

### US-325 Beteiligte auf einen Blick
Als **Projektleiter** möchte ich sehen, wer verantwortlich und wer beteiligt ist, und Personen über eine Suche hinzufügen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-UI-014, REQ-AUFG-013

- [ ] „+ Person“ › „wag“ findet L. Wagner; „+ Beteiligt“ fügt hinzu, ✕ entfernt.

### US-326 Urlaub eintragen, Aufgaben übergeben
Als **Mitarbeiter** möchte ich meinen Urlaub vom 18. bis 20.11. eintragen und sehen, was in der Zeit fällig ist.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KAP-015

- [ ] Nach „Eintragen“ steht in der Tagesplanung bei mir „Urlaub“ an diesen Tagen.
- [ ] „An S. Keller geben“ macht die Vertretung verantwortlich und benachrichtigt sie.

### US-327 Nichts Wichtiges verpassen
Als **Projektleiter** möchte ich an der Glocke sehen, wer mich erwähnt hat und was ich freigeben muss.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KOMM-007

- [ ] Der Filter „@ Erwähnungen“ zeigt nur Erwähnungen; Klick öffnet die Aufgabe.

### US-328 Aus der Besprechung direkt Aufgaben
Als **Projektleiter** möchte ich aus meiner Mitschrift ein Protokoll und Aufgaben machen, ohne alles abzutippen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KOMM-008

- [ ] „T. Brandt passt Stromlaufplan an bis 20.11.“ wird eine Maßnahme für T. Brandt, fällig 20.11.
- [ ] „Alle offenen Maßnahmen als Aufgaben“ legt sie im Projekt an; die Liste zeigt danach „Protokoll im Entwurf“ bzw. „versendet“.

### US-329 Aufgabe aufräumen in einem Blick
Als **Nutzer** möchte ich Titel, Bucket und Priorität direkt im Detail ändern, ohne Formular.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-AUFG-017

- [ ] Klick auf „Priorität“ klappt Dringend, Hoch, Mittel, Niedrig auf; die Wahl gilt sofort auf der Karte.
- [ ] Der Kreis vor dem Titel hakt die Aufgabe ab; der Titel wird durchgestrichen.

### US-330 Checkliste statt Unteraufgaben-Flut
Als **Techniker** möchte ich kleine Schritte als Checkliste an der Aufgabe abhaken.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-AUFG-018, REQ-AUFG-019

- [ ] „Punkt hinzufügen“ legt einen Punkt an; die Karte zeigt „☑ 1/5“.
- [ ] Etikett „Elektrik“ erscheint auf der Karte als „● Elektrik“.

### US-331 Nur sehen, was gerade zählt
Als **Projektleiter** möchte ich im Board nur die überfälligen Aufgaben von L. Wagner mit Etikett „Elektrik“ sehen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-AUFG-020, REQ-AUFG-019

- [ ] Person › L. Wagner, Fällig › Überfällig: Board, Liste und Kalender zeigen nur diese Aufgaben, oben steht „2 von 8 Aufgaben“.
- [ ] „Filter löschen“ zeigt wieder alles.
- [ ] Benenne ich in den Projekteinstellungen „Elektrik“ in „Schaltschrank“ um, heißt das Etikett überall so.

### US-332 Aufgaben am Meilenstein anlegen
Als **Projektleiter** möchte ich im Meilenstein „Mechanische Montage“ direkt eine Aufgabe für S. Keller anlegen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-AUFG-021

- [ ] „Aufgabe hinzufügen“, Wer › Keller, Hinzufügen: Die Aufgabe steht in der Liste des Meilensteins, der Fortschritt zeigt „0 von 3“.
- [ ] Ohne Titel erscheint „Erst einen Titel eingeben“.
- [ ] „Vorhandene zuordnen“ zeigt Aufgaben des Projekts ohne Meilenstein.

### US-333 Liste so gruppieren, wie ich denke
Als **Projektleiter** möchte ich die Aufgabenliste nach Person gruppieren, um zu sehen, wer wie viel hat.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-AUFG-022

- [ ] „Gruppieren nach › Person“ zeigt Du (4), L. Wagner (1), S. Keller (2), T. Brandt (1).

### US-334 Meine Lieblingsansicht mit einem Klick
Als **Projektleiter** möchte ich „Meine überfälligen“ mit einem Klick aufrufen, statt jedes Mal die Filter zu setzen.
**Prio** S · **Phase** 2 · **Anforderungen** REQ-AUFG-023

- [ ] Priorität › Hoch und Gruppieren nach › Person, dann „+ Als Ansicht speichern“: Es entsteht „Hoch · nach Person“.
- [ ] Klick auf die Ansicht stellt Filter und Gruppierung wieder her; ✕ löscht sie.

### US-335 Meilenstein umbenennen
Als **Projektleiter** möchte ich einen Meilenstein direkt im Detail umbenennen.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-AUFG-024

### US-336 Untermeilenstein und Gate gleich mit anlegen
Als **Projektleiter** möchte ich im Arbeitspaket „Mechanische Montage“ einen Meilenstein „Grundgestell ausgerichtet“ und ein Gate „Abnahme Montage“ anlegen, ohne in einen anderen Dialog zu wechseln.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-AUFG-025

- [ ] ◆ Meilenstein, Name, Termin 27.11., „Meilenstein anlegen“: Er steht unter „Untermeilensteine und Gates“ und im Gantt.
- [ ] ◈ Quality Gate mit Termin 10.12.: „Mechanische Montage“ reicht danach bis 10.12., die Meldung sagt es.
- [ ] ▭ Arbeitspaket mit Ende vor Beginn: „Das Ende liegt vor dem Beginn.“

### US-337 Aus Wissen wird Arbeit
Als **Projektleiter** möchte ich eine Lesson Learned direkt als Aufgabe übernehmen und eine Vorlage aus Wissen beim nächsten Projekt nutzen.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-LL-011

### US-338 Genehmigen, nicht vorschreiben
Als **Bereichsleiter** möchte ich beim Genehmigen nur Projektleitung, Priorität, Start und Kick-off-Frist festlegen; wie umgesetzt wird, entscheidet die Projektleitung.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANTRAG-005

- [ ] Der Dialog zeigt keine Auswahl für Vorgehensmodell und Vorlage, nur den Hinweis auf den Vorschlag aus dem Antrag.
- [ ] Nach „Genehmigen und M. Yilmaz beauftragen“ hat M. Yilmaz eine Aufgabe „Kick-off … planen und durchführen (Pflicht)“ und eine Erinnerung an der Glocke.

### US-339 Kick-off mit Agenda und Ergebnissen
Als **Projektleitung** möchte ich den Kick-off planen und die Ergebnisse so festhalten, dass daraus direkt das Projekt entsteht.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANTRAG-012, REQ-ANTRAG-013

- [ ] H. Lorenz lässt sich als Teilnehmer nicht abwählen („muss beim Kick-off dabei sein“).
- [ ] Ein Datum nach der Frist wird rot markiert.
- [ ] Ohne User Story erscheint „Noch nicht vollständig: … mindestens eine User Story …“.
- [ ] Nach dem Abschluss läuft das Projekt als Scrum; „US-1: Den Greifer ohne Werkzeug wechseln“ steht als Aufgabe, die Erfolgsfaktoren in der Übersicht.

### US-340 Anfragen dort, wo Anfragen hingehören
Als **Nutzer** möchte ich Aufgaben-Anfragen im Posteingang beantworten statt in Meine Arbeit.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KOMM-009

### US-341 Wer blockiert wen?
Als **Projektleiter** möchte ich sehen, dass „Pneumatikplan prüfen“ auf „Stromlaufplan Schutztür freigeben“ wartet.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KERN-005, REQ-KERN-008

- [ ] Im Detail steht „⛔ Blockiert durch SM42-101 …“, die Karte zeigt „⛔ blockiert“.
- [ ] „+ Verknüpfen“ › „ist Vorgänger von“ › Suche „SM42-10“ › Treffer anklicken legt die Verknüpfung an; bei der anderen Aufgabe steht automatisch „ist Nachfolger von“.

### US-342 Was hat sich geändert?
Als **Projektleiter** möchte ich im Reiter „Verlauf“ sehen, wer wann Bucket, Termin oder Verantwortlichen geändert hat.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KERN-006

### US-343 Versehentlich gelöscht
Als **Nutzer** möchte ich eine gelöschte Aufgabe aus dem Papierkorb zurückholen, mit Verknüpfungen und Verlauf.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-PAPIER-001, REQ-PAPIER-002

- [ ] „In den Papierkorb“ fragt nach; danach steht die Aufgabe unter Projekte › Papierkorb mit „Wiederherstellen“.

### US-344 To-dos per Chat
Als **Projektleiter** möchte ich dem Assistenten „L. Wagner soll in SM42 bis Freitag den Greifer prüfen, 3 h“ schreiben, und die Aufgabe ist angelegt.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-INT-017

- [ ] Antwort: „Greifer prüfen · für L. Wagner · SM42 · fällig 20.11. · 3 h · ✓ Im Projekt zugewiesen“, mit Öffnen und Rückgängig.
- [ ] Drei Zeilen in einer Nachricht ergeben drei To-dos.
- [ ] „Für J. Novak: SPS-Backup prüfen“ geht als Anfrage an J. Novak (Teamkollege muss annehmen).

### US-345 Aus Stichpunkten eine gute Mail
Als **Nutzer** möchte ich meine Stichpunkte einfügen und eine fertige, höfliche Mail bekommen, die ich noch anpassen kann.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-INT-018, REQ-INT-019

- [ ] „Mail an Hr. Maier (Rexroth): liefertermin kw 50 ok? brauchen doku asap …“ ergibt „Hallo Herr Maier, …“ mit „so bald wie möglich“ und den Fragen als Liste.
- [ ] Nach eigener Änderung macht „Formell“ daraus „Sehr geehrter Herr Maier, …“, ohne Floskeln doppelt einzufügen.
- [ ] Im Posteingang lässt sich jeder Entwurf genauso überarbeiten.

### US-346 Erledigtes einfach erzählen
Als **Nutzer** möchte ich dem Assistenten schreiben, was ich erledigt habe oder gerade mache, und er pflegt meine Aufgaben.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-INT-020

- [ ] „Stromlaufplan der Schutztür habe ich schon freigeben. Weiterhin bin ich gerade am SPS-Baustein FB_Zuführung testen dran“ hakt SM42-101 ab und legt SM42-103 in den Fokus; es entsteht keine neue Aufgabe.
- [ ] „Das Angebot habe ich erledigt“ fragt „Meintest du diese?“ mit „Diese abhaken“.
- [ ] „Rückgängig“ öffnet die Aufgabe wieder.

### US-347 Einfach schreiben, ohne dass sofort Aufgaben entstehen
Als **Nutzer** möchte ich dem Assistenten etwas erzählen, ohne dass er gleich ein To-do anlegt.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-INT-021

- [ ] „Der Kunde hat heute angerufen wegen der Lieferung“ ergibt „Soll ich daraus ein To-do machen?“ mit zwei Knöpfen.
- [ ] Im Modus „To-dos: erst fragen“ zeigt „To-do: Schaltschrank fotografieren bis Montag“ erst eine Vorschau mit „Anlegen“.

### US-348 Der Assistent zeigt mir den Weg
Als **neuer Nutzer** möchte ich fragen, wo ich etwas finde, und direkt dorthin springen.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-INT-022

- [ ] „Wo trage ich meinen Urlaub ein?“ erklärt den Weg und „Zum Profil ›“ öffnet das Profil; der Chat bleibt offen.
- [ ] Eine Frage ohne Bezug zur Software („Wie hoch ist der Mount Everest?“) wird ehrlich als nicht hinterlegt beantwortet.

### US-349 Änderung beantragen und sauber nachziehen
Als **Konstrukteur** möchte ich eine Änderung (Hub +50 mm) mit Terminfolge und Kosten beantragen, und nach der Genehmigung sind Plan und Budget angepasst.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANF-004

- [ ] +7 Tage oder über 5.000 € gehen an H. Lorenz, sonst entscheidet die Projektleitung.
- [ ] Genehmigt: „Mechanische Montage“ endet 7 Tage später, der Verlauf zeigt „Ende (CR-01)“, unter Finanzen steht der Nachtrag.

### US-350 Plan gegen Ist auf einen Blick
Als **Projektleiter** möchte ich im Gantt sehen, welche Termine gegenüber dem ursprünglichen Plan gerutscht sind.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-GANTT-012

- [ ] Verschobene Elemente zeigen einen grauen Baseline-Balken und „+4 T. zur Baseline“.
- [ ] „Neue Baseline speichern“ setzt den Vergleich auf den heutigen Stand.

### US-351 Meine Excel-Liste übernehmen
Als **Projektleiter** möchte ich meine bisherige Aufgabenliste aus Excel ins Cockpit übernehmen, ohne alles abzutippen.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-INT-005, REQ-INT-007

- [ ] Zellen samt Überschrift kopieren und einfügen: Spalten „Aufgabe, Verantwortlich, Fällig, Aufwand, Status, Priorität“ werden automatisch zugeordnet.
- [ ] „Wagner“ wird L. Wagner, „Müller“ (unbekannt) landet mit Hinweis bei mir.
- [ ] Nach „5 Aufgaben übernehmen“ steht jede mit Kennung im Projekt; ein zweiter Import derselben Liste legt nichts doppelt an.

### US-352 Projekt nach Vorgehen anlegen
Als **Projektleiter** möchte ich zuerst wählen, wie wir arbeiten (Liste und Board, Kanban, Wasserfall, V-Modell, Scrum), und dann ein Beispiel wie „Sondermaschine“ übernehmen oder leer starten.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-STUFE-006

### US-353 Mein eigenes Projekt voll nutzen
Als **Projektleiter eines neuen Projekts** möchte ich Aufgaben an mein Team vergeben, Meilensteine und Gates in Phasen anlegen und eine RACI-Matrix pflegen, genau wie in den bestehenden Projekten.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-STUFE-008

- [ ] Beim Anlegen in Liste oder Board wähle ich „Wer“ aus den Projektmitgliedern; im Detail kann ich Beteiligte suchen und hinzufügen.
- [ ] Ein Meilenstein am 01.12. landet in der Phase „Entwurf“; Klick auf „Entwurf“ zeigt ihn unter „Untermeilensteine und Gates“.
- [ ] Mit RACI/AKV eingeschaltet erscheint der Reiter „Team“; ein Klick auf eine Zelle setzt R, A, C, I.

### US-354 Meine Projekte aus v2.0 mitnehmen
Als **Projektleiter** möchte ich meine Projekte, Aufgaben und Phasen aus v2.0 übernehmen, damit ich nicht neu anfangen muss.
**Prio** M · **Phase** 1 · **Anforderungen** REQ-INT-023

- [ ] Nach der Übernahme stehen alle Projekte mit Status (Begonnen, Unterbrochen, Beendet), Aufgaben, Aufwand und Phasen im Cockpit.
- [ ] Notizen und Mails aus v2.0 hängen an der jeweiligen Aufgabe.

### US-355 Feiertage meines Standorts
Als **Teamleiter mit Kollegen an mehreren Standorten** möchte ich, dass die Teamplanung für jede Person deren Feiertage sperrt.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KAP-016

- [ ] J. Novak (Tschechien) ist am 17.11. gesperrt, die Kollegen in NRW nicht; die Kopfzeile nennt, wer frei hat.

### US-356 Termine im Trend sehen
Als **Projektleiter** möchte ich sehen, welche Meilensteine von Bericht zu Bericht nach hinten rutschen, um früh gegenzusteuern.
**Prio** S · **Phase** 3 · **Anforderungen** REQ-GANTT-016

### US-357 Anforderungen nachweisen
Als **Projektleiter eines regulierten Projekts** möchte ich je Anforderung Testfälle führen und auf einen Blick sehen, was nachgewiesen ist.
**Prio** M · **Phase** 3 · **Anforderungen** REQ-ANF-002, REQ-ANF-005

- [ ] Ein fehlgeschlagener Test legt automatisch eine Fehleraufgabe an.
- [ ] Die Abdeckung zeigt „x von y Anforderungen nachgewiesen“.

### US-358 Überbuchung erkennen
Als **Teamleiter** möchte ich beim Einladen sehen, wie viel Prozent eine Person danach insgesamt verplant ist.
**Prio** M · **Phase** 2 · **Anforderungen** REQ-KAP-017

---

## Verfolgbarkeit Anforderung → Story (Auszug)

| Anforderungsbereich | Stories |
|---|---|
| REQ-STUFE, REQ-VORL | US-001 bis US-004 |
| REQ-GANTT | US-010 bis US-021 |
| REQ-VMOD | US-030 bis US-034 |
| REQ-SCRUM, REQ-STORY | US-039 bis US-049 |
| REQ-KANBAN | US-050 bis US-058 |
| REQ-KAP, REQ-PRIO | US-060 bis US-065 |
| REQ-RES | US-070 bis US-074 |
| REQ-TEAM, REQ-KOMM, REQ-RECHT, REQ-KERN-006 | US-080 bis US-089 |
| REQ-PORT | US-090 bis US-093 |
| REQ-IH | US-100 bis US-104 |
| REQ-ANF | US-110 bis US-113 |
| REQ-INT | US-120 bis US-126 |
| REQ-AUTO | US-160 bis US-164 |
| REQ-ANS, REQ-SUCHE, REQ-PAPIER | US-130 bis US-146 |
| REQ-KAP-012, REQ-KOMM-005/006, REQ-GANTT-018/019, REQ-KANBAN-015, REQ-AUFG-012/013, REQ-DASH-007/008, REQ-NF-022 | US-280 bis US-290 |
| REQ-NAV-010, REQ-UI-010/011, REQ-KAP-013/014, REQ-GANTT-020, REQ-AUFG-014, REQ-KERN-009/010, REQ-INT-013, REQ-NF-022/023 | US-291 bis US-300 |
| REQ-KAP-012, REQ-INT-013/014, REQ-SUCHE-009 | US-301 bis US-304 |
| REQ-UI-012, REQ-INT-015/016, REQ-LL-010, REQ-RES-012 bis 014 | US-305 bis US-311 |
| REQ-RES-015, REQ-AUFG-015/016, REQ-DASH-009, REQ-UI-013, REQ-KERN-011/012 | US-312 bis US-318 |
| REQ-STUFE-006/007, REQ-NAV-011/012, REQ-KANBAN-016/017, REQ-UI-014 | US-319 bis US-325 |
| REQ-KAP-015, REQ-KOMM-007/008 | US-326 bis US-328 |
| REQ-AUFG-017 bis 019 | US-329, US-330 |
| REQ-AUFG-020 | US-331 |
| REQ-AUFG-021 | US-332 |
| REQ-AUFG-022 bis 024 | US-333 bis US-335 |
| REQ-AUFG-025, REQ-LL-011 | US-336, US-337 |
| REQ-ANTRAG-005, -012, -013, REQ-KOMM-009 | US-338 bis US-340 |
| REQ-KERN-005, -006, -008, REQ-PAPIER-001/002 | US-341 bis US-343 |
| REQ-INT-017 bis 019 | US-344, US-345 |
| REQ-INT-020 | US-346 |
| REQ-INT-021, REQ-INT-022 | US-347, US-348 |
| REQ-ANF-004, REQ-GANTT-012 | US-349, US-350 |
| REQ-INT-005, REQ-INT-007 | US-351 |
| REQ-STUFE-006, REQ-STUFE-008 | US-352, US-353 |
| REQ-INT-023 | US-354 |
| REQ-KAP-016 | US-355 |
| REQ-GANTT-016 | US-356 |
| REQ-ANF-002, REQ-ANF-005 | US-357 |
| REQ-KAP-017 | US-358 |
| REQ-PSP | US-150 bis US-153 |
| REQ-LL | US-170 bis US-175 |
| REQ-ZEIT, REQ-RES-009 bis -011 | US-180 bis US-182 |
| REQ-NF-012 bis -016 | US-190 bis US-192 |
| REQ-NAV, REQ-AMPEL | US-200 bis US-207 |
| REQ-UI, REQ-DASH | US-210 bis US-214 |
| REQ-ANA | US-220 bis US-226 |
| REQ-ANTRAG | US-230 bis US-233 |
| REQ-ORG | US-240 bis US-244 |
| REQ-NF-008, REQ-NF-017 bis -021 | US-250 bis US-253 |
| REQ-AUFG | US-260 bis US-265 |
| REQ-THEMA | US-270 bis US-273 |

Noch ohne eigene Story: REQ-KERN-001 bis -005, -007, -008 (technische Grundlage), REQ-NF-001 bis -011 (gelten über die Definition of Done), REQ-VM-004, REQ-SUCHE-004, REQ-SUCHE-008, REQ-ANTRAG-008, REQ-ORG-007. REQ-PORT-004 ist gestrichen (ersetzt durch REQ-DASH).
