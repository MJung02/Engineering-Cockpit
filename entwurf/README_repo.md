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
