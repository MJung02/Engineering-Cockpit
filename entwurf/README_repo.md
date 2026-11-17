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
