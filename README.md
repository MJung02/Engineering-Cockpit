# Engineering Cockpit

**Klickbarer Entwurf online: https://mjung02.github.io/Engineering-Cockpit/**

Das ist ein **Entwurf zum Ausprobieren**, noch kein fertiges Tool:

- Alle Daten sind Beispieldaten (SM42 Schraubstation, Retrofit Linie 2, Prüfstand Drehmoment, Instandhaltung Halle 2).
- **Nichts wird gespeichert.** Neu laden setzt alles zurück. Jeder sieht seine eigene Kopie.
- KI-Assistent, Outlook und Mails sind simuliert.

## Was testen?

1. **Mein Tag / Meine Aufgaben:** Aufgaben anlegen, abhaken, verschieben, als privat markieren
2. **Projekte:** „+ Neues Projekt“ anlegen, Board, Gantt in der Planung, Team einladen, Change Requests, Meilenstein-Trend
3. **Teams:** Teamplanung über 6 Monate, Aufgaben per Ziehen verteilen, Standorte und Feiertage
4. **Posteingang:** Freigaben, Anfragen, Mail-Entwürfe mit KI überarbeiten
5. **Assistent** (unten rechts oder Strg+Umschalt+M): Aufgaben per Text anlegen, „Wo finde ich …?“

Auffälligkeiten bitte mit kurzer Beschreibung melden: Was gemacht? Was erwartet? Was ist passiert? Am besten mit Bildschirmfoto.

## Neu nach der sechsten Testrunde (17.11.2026)

- **Ressourcenkonflikte über Projekte hinweg:** Das Cockpit rechnet je Person und Woche (KW 47–52) die Grundlast aus der Linie, die Aufgaben aller Projekte und die Abwesenheiten zusammen.
  - Wer über seine planbare Zeit (32 h/Woche) kommt, steht mit Aufteilung nach Projekt in der Liste.
  - Der Vorschlag nimmt eine Aufgabe aus dem Projekt mit der niedrigsten Priorität. Sie lässt sich um eine Woche verschieben oder an eine Kollegin bzw. einen Kollegen mit Luft im selben Projekt geben.
  - Zu sehen unter Berichte › Ressourcenkonflikte (ganzer Bereich) und im Projekt-Reiter Kapazität (Personen des Projekts).
- **Abhängigkeiten im Gantt:** Im Detail jedes Elements legst du unter „Abhängigkeiten · beginnt nach“ mit „+ Vorgänger“ fest, was vorher fertig sein muss (Ende → Anfang). Im Gantt steht dann „↳ nach …“ unter dem Namen.
  - Verschiebt sich ein Vorgänger nach hinten, rücken die Nachfolger automatisch mit. Die Meldung nennt, wer um wie viele Tage gerückt ist.
  - Passt ein Nachfolger dadurch nicht mehr in seine Phase, meldet das Cockpit einen Konflikt.
  - Kreise (A nach B nach A) lassen sich nicht anlegen.
- **Kritischer Pfad:** Rot umrandete Balken liegen ohne Puffer auf der Kette zum spätesten Termin. Verzögern sie sich, verschiebt sich das Ende.
- **Meilenstein von–bis auch in eigenen Projekten:** Im Reiter Planung gibt es beim Anlegen „Meilenstein (Termin)“ und „Meilenstein (von–bis)“.
- **Quality Gates als ▣** jetzt auch in der Meilenstein-Zeitleiste und im Gantt der eigenen Projekte.
- Die Reiter Risiken, Zeiten, Kapazität, Statusbericht, Change Requests und Verlauf sind ins Englische, Spanische, Polnische und Türkische übersetzt.

## Neu nach der fünften Testrunde (17.11.2026)

- **Meilenstein als Termin oder Zeitraum:** Im Detail eines Meilensteins schaltest du unter „Art“ zwischen „◆ Termin (Stichtag)“ und „▬ Zeitraum (von–bis)“ um. Beim Anlegen gibt es „Meilenstein (Termin)“ und „Meilenstein (von–bis)“.
- Die Meldung vom Anlegen verschwindet, wenn du ein anderes Element öffnest.
- **Gantt-Grenzen:** Ein Untermeilenstein liegt immer im Zeitraum seines Meilensteins, ein Meilenstein immer in seiner Phase.
  - Verschieben, Verlängern und Datumseingaben stoppen an der Grenze, und eine Meldung nennt die Grenze.
  - Die übergeordnete Phase ändert sich dabei nicht mehr.
  - Eine Phase lässt sich nicht kürzer machen als ihr Inhalt.
  - Neu angelegte oder in eine Phase gezogene Elemente werden in deren Zeitraum gelegt.
- **Meilenstein und Quality Gate** sehen im Gantt verschieden aus: Ein Meilenstein ist eine Raute ◆, ein Gate ein Quadrat ▣ mit „G“.
- **Stacey-Hilfe im Assistenten:** standardmäßig eingeklappt („Hilfe bei der Wahl des Vorgehensmodells“). Die Fragen nennen jetzt die Achse (senkrecht: Anforderungen, waagrecht: Lösung/Technik).
- **Vorlagen:** Suchfeld und zunächst nur 4 Vorschläge, mit „Alle anzeigen“. Das bleibt auch bei vielen Vorlagen übersichtlich.
- **Mitglieder beim Projekt anlegen:** Suche über alle 500 Kolleginnen und Kollegen (Name oder Team). Ausgewählte stehen als Chips mit ✕, dazu Vorschläge aus dem eigenen Team.
- **AKV:** Die Normalansicht ist eine lesbare Tabelle oder ein Diagramm mit Karten je Person. Bearbeiten geht nur über ✎ (nur Owner), mit „Speichern“ und „Abbrechen“.
- **KI-Knopf:** ist jetzt ein runder Knopf. Ist rechts ein Panel offen, wandert er nach links unten. Unter dem Seiteninhalt bleibt Platz, damit er keine Knöpfe verdeckt.

## Neu nach der vierten Testrunde (17.11.2026)

- **Module mit eigener Funktion:** Jedes zugeschaltete Modul bekommt einen eigenen Reiter im Projekt.
  - **Risiken:** Register mit Bewertung, Maßnahme, Verantwortlichem, Status und Risikomatrix (statt der Stacey-Matrix).
  - **Zeiten:** Buchen auf Aufgaben, Summe je Person, Wochenzettel einreichen.
  - **Kapazität:** Auslastung je Person für die nächsten 4 Wochen, Warnung bei Überplanung, Ausgleich mit einem Klick.
  - **Statusbericht:** Ampeln aus den Daten, Texte vorbefüllt, Bericht senden.
  - **Change Requests:** einreichen, genehmigen oder ablehnen; genehmigte Mehrkosten stehen als Nachtrag unter Finanzen.
  - **Verlauf (Audit):** alle Änderungen im Projekt, filterbar, Export als CSV.
- **Anforderungen und Testfälle** lassen sich nur im V-Modell einschalten.
- **Stacey-Matrix:** im Assistenten „Neues Projekt“ sofort sichtbar und anklickbar. In bestehenden Projekten steht sie unter ⚙ › Vorgehensmodell.
- **Finanzen:** zeigen Kostenstelle und Innenauftrag. Beides pflegst du unter ⚙ › Stammdaten.
- **Team-Reiter:** neue Bereiche Auslastung, Abwesenheiten (mit Warnung bei fälligen Aufgaben) sowie Kontakte und Stakeholder. Über „⚙ Ansicht anpassen“ ziehst du Bereiche am ⠿, stellst halbe oder ganze Breite ein und blendest sie mit ✕ aus.
- **„+ Neu“ außerhalb eines Projekts:** nur Aufgabe, Projekt und Projektantrag. Meilensteine, Gates und Phasen legst du im Projekt an.
- **Handy:** Der Projektkopf ist kompakt, und das ⚙ steht neben dem Namen. Aufgabenlisten erscheinen als Karten. Der gewählte Reiter rutscht automatisch in Sicht. Der ✨-Knopf verdeckt nichts mehr. Die Teamplanung läuft nicht mehr über den Rand.

## Neu nach der dritten Testrunde (17.11.2026)

- **Vorgehensmodell wechseln wirkt:** Scrum stellt das Board auf Product Backlog, Sprint-Backlog, In Arbeit, Review, Done um und legt 4 Sprints an; V-Modell legt die Ebenen mit Gates an und schaltet Anforderungen und Testfälle ein; Wasserfall legt Phasen mit Gates an; Kanban stellt das Board um; Liste blendet die Planung aus. Vorhandene Phasen bleiben.
- **Planung:** ⠿ ziehen ändert die Reihenfolge, auf eine Phase gezogen landet ein Meilenstein oder Gate darin. „+“ an jeder Phase bereitet das Anlegen vor, Enter legt an.
- **Eigene Rollen** benennen und löschen (⚙ › Mitglieder, Rollen und Rechte).
- **Etiketten** erklärt, eigene anlegen und löschen (⚙ › Etiketten).
- **Team-Reiter** in jedem Projekt immer sichtbar; Bereiche ein-/ausblenden und ordnen (⚙ Ansicht anpassen). In den Beispielprojekten lassen sich die übrigen Reiter für sich ausblenden (⚙ Meine Reiter).
- **Berichte:** Reiter per Ziehen ordnen, über ⚙ ausblenden.
- **Vorlagen verwalten** im Assistenten: eigene löschen, mitgelieferte ausblenden.
- **Handy (iPhone):** Kopfzeile in einer Zeile, Reiter wischbar, größere Schrift, kein Zoom in Eingabefeldern, Assistent als runder Knopf, Nachrichten im Posteingang als Vollbild, „Die nächsten 5 Arbeitstage“ untereinander mit „⇄ Verschieben“ und „⤓ Hierher“ statt Ziehen.

## Neu nach der zweiten Testrunde (17.11.2026)

- **Handy:** Menü hinter ☰ (Hamburger), Inhalte rücken zusammen.
- **Menü anpassen:** Projekte, Teams, Wissen, Berichte, Posteingang einzeln ausblendbar (⚙ Menü anpassen bzw. Profil › Darstellung).
- **Meine Arbeit:** Reiter in der Reihenfolge Meine Aufgaben, Fokus, Mein Tag planen, Besprechungsnotizen; alle außer Meine Aufgaben ausblendbar (⚙). „Liste zeigen: Überfällig · Heute · Im Plan · Erledigt“ steht direkt über der Liste.
- **Dashboard:** Klick auf Überfällig/Heute/… öffnet Meine Aufgaben schon gefiltert; Klick auf eine Nachricht öffnet sie im Posteingang. Kacheln (Start, Projektübersicht) und Themen lassen sich jederzeit per Ziehen umordnen.
- **Checklisten:** Jeder Punkt hat eine Dauer, ☆ legt ihn als eigene Aufgabe in den Fokus, 🕘 plant ihn früh, mittags, nachmittags oder morgen ein.
- **Prioritätsfarben** im Profil frei wählbar; Details öffnen standardmäßig als Pop-up (umschaltbar).
- **Posteingang** mit Unterreitern (Nachrichten, Neue Aufgaben, Entwürfe); **Wissen** und **Mein Tag** mit zugeklappten Zusatzbereichen.
- **Neues Projekt:** Stacey-Matrix direkt im Assistenten mit Empfehlung; Hinweis, ob eine Freigabe nötig ist. Vorgehensmodell im Projekt wechselbar (⚙ › Vorgehensmodell).
- **Sichtbarkeit:** Owner legt je Rolle fest, welche Reiter sichtbar sind (⚙ › Sichtbarkeit der Reiter, mit „Ansicht testen als“); jeder blendet für sich Reiter aus (⚙ Meine Reiter).
- **RACI/AKV** auch ohne Phasen nutzbar (eigene Zeilen); **Personensuche** über alle 500 Kollegen beim Einladen und beim Vergeben von Aufgaben.

## Neu nach der ersten Testrunde (16.11.2026)

- **Termine direkt ändern:** In der Planung stehen Beginn, Ende und Termin als Datumsfelder in der Spalte „Termin“ (für Owner und Bearbeiter). Fälligkeiten in der Aufgabenliste ebenso.
- **Zeitstrahl:** beginnt einen Monat vor dem frühesten Termin; „‹ früher“ und „später ›“ blättern weiter.
- **Anlegen in der Planung:** Phase mit Beginn und Ende, Meilenstein mit Termin, Quality Gate mit „Fällig am“; Zuordnung zur Phase wählbar, die Phase verlängert sich bei Bedarf.
- **AKV** im Reiter Team (eigene Projekte): Aufgaben, Kompetenzen, Verantwortung je Person, verknüpft mit RACI und Freigabegrenze.
- **Rechnungen** im Reiter Finanzen: einreichen mit Beleg, Freigabe nach AKV (bis zur eigenen Grenze selbst, darüber Projektleitung bzw. H. Lorenz), freigegebene Rechnungen zählen ins Ist.
- **Scrum (Retrofit Linie 2):** „Sprint 5 starten“ funktioniert; die Retrospektive ist erklärt, Karten und Maßnahmen lassen sich anlegen, Maßnahmen werden Aufgaben.
- **Kanban (Instandhaltung Halle 2):** „+ Auftrag“ in jeder Spalte, „Störung melden“, Karte anklicken zum Bearbeiten, Spalten anlegen, umbenennen, verschieben, löschen, WIP-Limit per Klick auf die Zahl.

## Ordner

| Ordner / Datei | Inhalt |
|---|---|
| `index.html`, `app.js`, `dc-runtime.js` | die Seite für GitHub Pages |
| `entwurf/` | Quelle des Entwurfs (`Main.dc.html`) und Werkzeuge (`build_pages.py`, `pack.py`, Selbsttest, v2-Umsetzer) |
| `docs/` | Anforderungen, User Stories, Handbuch |
| `v2_streamlit/` | bisherige App v2.0 (Streamlit), ohne `.env`, KI-Modell und Datenbank |

## Aktualisieren

1. `python entwurf\pack.py` im Projektordner ausführen → Ordner `github_upload/` ist neu gebaut.
2. Inhalt von `github_upload/` ins Repository legen (git push oder GitHub › *Add file › Upload files*).
3. Nach ca. 1 Minute ist https://mjung02.github.io/Engineering-Cockpit/ aktuell (ggf. Strg+F5).

GitHub Pages einmalig einschalten: *Settings › Pages › Deploy from a branch › main / (root)*.

## Nicht ins Repository

`.env` (Passwörter), `models/*.gguf` (KI-Modell, 2,3 GB), `.venv`, Datenbanken und echte Projektdaten (`v2_export`, `cockpit_import.json`). Die `.gitignore` verhindert das.
