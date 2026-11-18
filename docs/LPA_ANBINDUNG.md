# Anbindung LPA-Tool ↔ Engineering Cockpit

| | |
|---|---|
| Dokument | Schnittstellenkonzept für das echte Cockpit (nach der Testphase) |
| Stand | 18.11.2026 |
| Grundlage | REST-Schnittstelle des LPA-Tools, Version v1, Schema `lpa.measure.v1` |
| Anforderungen | [ANFORDERUNGEN.md](ANFORDERUNGEN.md), REQ-INT-026 bis -032 |
| Im Entwurf | Verwaltung › Integrationen (simuliert, gleicher Ablauf) |

Server-Adresse und API-Schlüssel stehen bewusst nicht in diesem öffentlichen Repository. Im Text steht dafür `https://<lpa-server>`.

## 1 Grundprinzip

Für den Abgleich muss jede Seite wissen, welche Aufgabe zu welcher Maßnahme gehört. Dafür gibt es zwei Anker:

| | LPA-Maßnahme | Cockpit-Aufgabe |
|---|---|---|
| kennt die Gegenseite über | `external_task_id` (Aufgaben-ID des Cockpits) | Feld `lpa_id` (= `id` der Maßnahme) |
| „schon übergeben?“ | `transferred_at` (Zeitstempel, sonst leer) | – |
| „geändert seit?“ | `updated_at` | `lpa_synced_at` (letzter Abgleich dieser Aufgabe) |

**Führendes System je Feld:**
- **Das LPA-Tool führt** bei Befund, Frage, Audit-Daten, Frist, Verantwortlichem und bei der Wirksamkeit: `VERIFIED` setzt nur der Auditor, `REJECTED` nur das LPA-Tool.
- **Das Cockpit führt** bei der Umsetzung: `IN_PROGRESS` und `DONE`, Kommentare, Teilaufgaben und Zeiten.

## 2 Zugang

- Der Hauptadmin des LPA-Tools legt unter *Einstellungen → API-Schlüssel* einen Schlüssel an (`lpa_…`, wird nur einmal angezeigt).
- Jede Anfrage trägt den Kopf `Authorization: Bearer lpa_…`.
- Im Cockpit liegt der Schlüssel nur im Backend als Server-Geheimnis (z. B. Umgebungsvariable `LPA_API_KEY` im Secret-Store). Er gelangt nie in den Browser, ins Repository oder ins Log. Wechsel des Schlüssels ohne Ausfall: neuen anlegen, im Cockpit tauschen, alten löschen.

## 3 Ablauf A: neue Maßnahmen übernehmen (Pull, alle 5 Minuten)

```
GET https://<lpa-server>/api/v1/massnahmen?nur_neue=true&zugewiesen=true
```

- `nur_neue=true` liefert nur Maßnahmen ohne `transferred_at`. So entsteht keine Aufgabe doppelt.
- `zugewiesen=true` liefert nur Maßnahmen mit verantwortlicher Person.

Für jedes Element in `items[]`:

1. **Aufgabe anlegen oder finden** über `lpa_id = item.id` (Upsert, nie blind anlegen).
2. **Übergabe zurückmelden:**
   ```
   POST https://<lpa-server>/api/v1/massnahmen/{id}/uebertragen
   {"external_task_id": "<Aufgaben-ID im Cockpit>"}
   ```
   Das setzt `transferred_at`. Beim nächsten Lauf fehlt die Maßnahme in `nur_neue`.

**Fehlerfall:** Bricht der Lauf zwischen Schritt 1 und 2 ab, liefert der nächste Lauf die Maßnahme noch einmal. Der Upsert findet die vorhandene Aufgabe über `lpa_id`, und nur Schritt 2 wird wiederholt. `uebertragen` und `status` sind idempotent und dürfen gefahrlos wiederholt werden.

## 4 Feldzuordnung (`lpa.measure.v1` → Cockpit-Aufgabe)

| LPA-Feld | Cockpit | Hinweis |
|---|---|---|
| `id` | `lpa_id`, Anzeige „LPA #42“ | eindeutig, unveränderlich |
| `title` | Titel | z. B. „LPA #42 · Bereich: …“ |
| `description` | Beschreibung | |
| `due_date` | Fällig | LPA führt; Änderungen kommen über Ablauf C |
| `status` | Status | Abbildung siehe Abschnitt 5 |
| `responsible.email` | Verantwortlich | Abgleich über Entra ID. Kein Treffer: Aufgabe landet im Eingang der LPA-Koordination |
| `audit.layer`, `audit.org_unit`, `audit.period` | Etiketten „LPA Ebene n“, Bereich, Periode | `org_unit` → Team oder Projekt über eine Zuordnungstabelle in der Verwaltung |
| `question.text`, `question.answer` | Beschreibung (Abschnitt „Befund“) | `NOK_OPEN` = nicht in Ordnung, offen |
| `url` | Link „Im LPA-Tool öffnen“ | |
| `images[]` | Anhänge | Abruf über `/api/v1/massnahmen/{id}/bilder/{bild-id}` mit Schlüssel. Das Cockpit reicht die Bilder nur an angemeldete Nutzer mit Leserecht durch (Proxy, keine öffentlichen Links) |

Jede übernommene Aufgabe trägt die Quelle „LPA“ und erscheint in *Meine Arbeit*, im Team und, falls zugeordnet, im Projekt.

## 5 Ablauf B: Status zurückmelden (sofort bei Änderung)

```
POST https://<lpa-server>/api/v1/massnahmen/{id}/status
{"status": "erledigt", "note": "Taster getauscht, Funktion geprüft"}
```

| Cockpit | sendet `status` | LPA-Status | Bemerkung |
|---|---|---|---|
| offen / wieder geöffnet | `offen` | `OPEN` | |
| in Arbeit (erster Fortschritt) | `in_progress` | `IN_PROGRESS` | |
| erledigt | `erledigt` | `DONE` | `note` = Erledigt-Kommentar, landet als Wirksamkeitsnotiz |
| – | (nie) | `VERIFIED` | setzt nur der Auditor im LPA-Tool |
| – | (nie) | `REJECTED` | setzt nur das LPA-Tool |

Die Schnittstelle versteht deutsche und englische Werte (`erledigt`, `umgesetzt`, `done`, `completed` → `DONE` usw.). Das Cockpit sendet immer die deutschen Werte aus der Tabelle.

## 6 Ablauf C: Änderungen nachziehen (Delta)

```
GET https://<lpa-server>/api/v1/massnahmen?status=alle&seit=<letzter Lauf>
```

- `seit` bezieht sich auf `updated_at`. Als Zeitpunkt nimmt das Cockpit den Start des letzten erfolgreichen Laufs minus eine Minute Überlappung, damit an der Grenze nichts verloren geht.
- Gefundene Maßnahmen aktualisieren die Aufgabe über `lpa_id`: Frist, Verantwortliche, Status. Danach gelten die Regeln aus Abschnitt 7.

## 7 Gegenvalidierung und Konflikte

| LPA-Status | Cockpit | Ergebnis |
|---|---|---|
| `OPEN` / `IN_PROGRESS` | offen | synchron |
| `DONE` | erledigt | **wartet auf Wirksamkeit**, die Aufgabe bleibt mit Hinweis sichtbar |
| `VERIFIED` | erledigt | synchron, abgeschlossen |
| `OPEN` (vorher `DONE`) | erledigt | **nicht wirksam:** Aufgabe wieder öffnen, Klärungsaufgabe an Verantwortliche und Projektleitung, Notiz des Auditors anzeigen |
| `DONE` / `VERIFIED` | offen | **Konflikt:** übernehmen oder klären (Klärungsaufgabe) |
| `REJECTED` | offen | **Konflikt:** Aufgabe als „verworfen“ schließen oder klären |
| `REJECTED` | erledigt | synchron (verworfen) |

Beide Stände und die Entscheidung stehen im Verlauf der Aufgabe.

## 8 Push statt Pull (optional)

- Der Hauptadmin trägt im LPA-Tool unter *Einstellungen → Teams* eine Webhook-Adresse ein, z. B. `https://<cockpit>/hooks/lpa`. Das LPA-Tool sendet dann bei jeder Zuweisung dieselbe JSON-Struktur.
- Antwortet das Cockpit mit `{"external_task_id": "…"}`, speichert das LPA-Tool die ID sofort. Der Schritt `uebertragen` entfällt dann.
- **Empfehlung:** Push für die schnelle Anlage, dazu Pull mit `nur_neue` alle 5 Minuten und `seit` als Sicherheitsnetz gegen verpasste Webhooks.
- Der Push braucht einen vom LPA-Server erreichbaren Endpunkt im Cockpit. Pull braucht nur ausgehende Verbindungen.

## 9 Betrieb

- **Sync-Monitor** (REQ-INT-029): letzter Lauf, Anzahl neu, geändert und gemeldet, Fehler, offene Konflikte, „erneut senden“.
- **Alarm,** wenn ein Abgleich länger als eine Stunde fehlschlägt.
- **Protokolle:** Das LPA-Tool protokolliert jeden Zugriff (IntegrationLog), das Cockpit jeden Aufruf mit Antwortcode. Für die Fehlersuche lassen sich beide über die Maßnahmen-ID verbinden.
- **Lasten:** ein Pull alle 5 Minuten mit `nur_neue` und `seit` holt nur Deltas.

## 10 Offene Fragen an das LPA-Tool

1. Wie sichert das LPA-Tool den Webhook ab (geheimer Kopf, Signatur, IP-Freigabe)?
2. Darf das Cockpit die Frist ändern, oder bleibt sie im LPA-Tool führend (Vorschlag: führend im LPA-Tool)?
3. Liefert `seit` auch Änderungen an Bildern und Verantwortlichen?
4. Gibt es Grenzen für die Anfragerate?
5. Wird `IN_PROGRESS` im LPA-Tool angezeigt, oder reicht `OPEN` → `DONE`?
