# Entwurf – Quelle und Werkzeuge

| Datei | Zweck |
|---|---|
| `Main.dc.html` | Quelle des klickbaren Entwurfs (Vorlage + Logik). Läuft auch als claude.ai-Artifact. |
| `dc-runtime.js` | eigene, schlanke Laufzeit, damit der Entwurf ohne claude.ai im Browser läuft |
| `build_pages.py` | baut aus `Main.dc.html` die Seite: `index.html`, `app.js`, `dc-runtime.js` |
| `pack.py` | baut den Ordner `github_upload/` (Seite + Quelle + Doku + v2.0-App, ohne Geheimnisse) |
| `selftest.js` | Klicktest im Browser: `index.html?selftest` öffnen, Ergebnis steht unten auf der Seite |
| `v2_zu_cockpit.py` | setzt einen v2.0-Datenexport (JSON je Tabelle) in `cockpit_import.json` um |

## Neue Version veröffentlichen

```
python entwurf\pack.py
```

Danach den Inhalt von `github_upload/` ins Repository `MJung02/Engineering-Cockpit` legen. GitHub Pages zeigt ihn unter https://mjung02.github.io/Engineering-Cockpit/.

## Eigene Daten aus v2.0 laden

1. Tabellen aus der v2.0-Datenbank als JSON exportieren (projekte, tasks, meilensteine, interaktionen, zeitbuchungen, projekt_positionen) in einen lokalen Ordner.
2. `v2_zu_cockpit.py` in diesen Ordner kopieren und starten → `cockpit_import.json`.
3. Im Entwurf: Projekte › Import › „Projekte aus v2.0 übernehmen“ → Datei wählen. Die Daten bleiben nur im eigenen Browser.

Echte Daten nie ins Repository legen.
