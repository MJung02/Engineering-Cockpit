# Engineering Cockpit — Initialisierung (Gesamtplanung Phase B+)

Status: **genehmigt, in Initialisierung** (Phase A/Foundation ist umgesetzt und
verifiziert — Postgres, Auth, Rollen, Personen-FKs. Dieses Dokument plant alles
danach.)

**Fortschritt:** Phasen A–I umgesetzt, Phase J teilweise (B: Intake/Genehmigung,
C: Straubel-Assistent, D: Risiko/RACI, E: Dokumenten-Generierung, F:
Vorgehensmodell-Engine, G: Daily-Log + KI-Statuszusammenfassung — Mail-/
Meeting-Aggregation laeuft bewusst ueber manuelles Einfuegen in den bereits
existierenden Mail-Parser, kein Graph-API-Live-Zugriff; Teams-Live-Anbindung
bleibt an Phase J/SSO gebunden; H: KI-Terminplanung anhand RACI +
Praesentations-Export; I: Mitarbeiterprofile — Abteilung/Kompetenzen manuell +
KI-Ableitung aus tatsaechlich per bearbeiter_user_id zugeordneten Aufgaben,
neue Seite "Mein Profil"; J (nur lokales Modell-Teilstueck): drittes
KI-Backend `KI_BACKEND=lokal` via llama-cpp-python direkt im Python-Prozess,
Phi-3.5-mini-instruct-Q4_K_M.gguf in `models/` heruntergeladen und live
getestet, aktiver Default bleibt bewusst `ollama` — Umschalten ist manuell in
den Einstellungen moeglich. SSO ueber Microsoft Entra ID aus Phase J ist NICHT
umgesetzt — blockiert auf eine Azure-AD-App-Registration durch IT/Admin-Rolle,
externer Schritt, aber Code + Einstellungsseite dafür sind jetzt vorbereitet
(siehe unten); **Phase K vollständig**: Zeiterfassung mit Rollen +
Budgetüberwachung, Belegverwaltung, Zwischenberichte/Nachweise,
Kostenkalkulation/Rechnungsstellung, Schätzverfahren — Details siehe
Abschnitt Phase K unten). Lokales KI-Backend seit Phase F auf
`qwen2.5:7b-instruct` (Ollama) umgestellt — `phi3` war bei strukturierten
Mehrfach-Ausgaben (verschachtelte Listen) zu unzuverlässig, `qwen3.6:35b`
(23GB) sprengt die 8GB RAM der Zielmaschine. Lesson Learned: bei lokalen
Modellen grundsätzlich zeilenbasierte Formate statt verschachteltem JSON
verwenden und KI-Ausgaben nie ungeprüft übernehmen (Typ-/Duplikat-Filter
in Code, nicht nur im Prompt).

Dieses Dokument folgt bewusst dem Vorgehen, das Prof. Straubel für die
Initialisierung *jedes* Projekts lehrt — angewendet auf das Projekt "Engineering
Cockpit als Produkt" selbst: Zielstellung/Erfolgskriterien → kritische
Erfolgsfaktoren → Lessons Learned → Projektart/Komplexität → genereller Ansatz →
Projektdesign → kontinuierliches Fortschreiben.

---

## 1. Zielstellung & Erfolgskriterien

**Ziel:** Aus dem persönlichen Projekt-Tool ein Produkt machen, mit dem eine
Organisation den gesamten Projektlebenszyklus abbildet — von der freien
Ideen-/Problem-Einreichung durch jede:n Mitarbeiter:in über die
Geschäftsführungs-Entscheidung (ablehnen/pausieren/archivieren/genehmigen +
Projektleitung + Ressourcen-Zuteilung in %) bis zur laufenden, KI-unterstützten
Umsetzung, Dokumentation und Berichterstattung.

**Erfolgskriterien (messbar):**
- Ein Vorhaben lässt sich von Einreichung bis Genehmigung ohne Medienbruch
  (kein Excel, keine Mail-Kette) durchlaufen.
- Für jedes genehmigte Projekt existiert automatisch ein initialer Satz:
  Ziel-/Erfolgskriterien, kritische Erfolgsfaktoren, Risikoregister,
  Stakeholder-Liste, RACI/AKV-Matrix, passendes Vorgehensmodell mit
  generierter Meilenstein-Struktur.
- Der Nutzer (du) muss für Status-Updates nur noch *einen* Tagesrückblick in
  Freitext eintragen — die Zuordnung zu Projekten/Tasks übernimmt die KI.
- Alle KI-Funktionen laufen ohne Abhängigkeit von einer in Unternehmen meist
  gesperrten Cloud-KI (Copilot ohne API-Zugriff ist der Normalfall).

---

## 2. Kritische Erfolgsfaktoren

1. **Kein Big-Bang-Rewrite.** Jede Phase muss wie Phase A eigenständig lauffähig
   und verifizierbar sein — sonst kippt die Motivation und das Tool wird nie
   fertig genutzt.
2. **KI-Unabhängigkeit von Unternehmens-Restriktionen.** Wenn die Kernfunktionen
   (Ideen-Einreichung, Genehmigung, Task-Board) an eine nicht verfügbare
   Cloud-KI gekoppelt sind, scheitert die Einführung im Unternehmen komplett.
3. **Rollen/Rechte müssen vor jedem Feature stehen, das "wer darf was
   entscheiden" berührt** (Genehmigung, Ressourcen-Zuteilung) — genau dafür
   wurde die `roles`/`user_roles`-Struktur in Phase A vorbereitet.
4. **Datenschutz bei Dokumenten-Aggregation** (Mails, Teams-Nachrichten,
   Meeting-Mitschnitte) — das ist der sensibelste Teil des ganzen Vorhabens und
   braucht von Anfang an eine bewusste Entscheidung, was gespeichert wird und
   was nur zur Laufzeit verarbeitet und wieder verworfen wird.
5. **Der Nutzer will so wenig wie möglich selbst tun** — jede manuelle
   Fleißarbeit (Lastenheft schreiben, Meilensteine anlegen, Mails formulieren)
   muss KI-generiert und nur noch bestätigt werden, nicht von Hand erstellt.

---

## 3. Lessons Learned

Kein bestehendes Projektportfolio zum Auswerten vorhanden (Neuvorhaben) — daher
zwei Quellen:

**a) Aus Phase A selbst:**
- Inkrementelles Vorgehen mit Verifikation nach jedem Schritt hat funktioniert
  (10 Schritte, jeder einzeln im Browser getestet) — genauso weitermachen.
- Migrationen vom bestehenden System auf ein neues Fundament bringen
  überraschende Detail-Bugs mit sich, die nicht offensichtlich sind (z.B. der
  Timezone-Bug: SQLite-Text-Timestamps vs. Postgres `TIMESTAMPTZ` brachen
  mehrere `except: pass`-Stellen still — sowas wird bei der KI-Integration in
  Dokumente/Mails/Meetings genauso passieren und muss aktiv gesucht werden,
  nicht nur gehofft.
- Externe Streamlit-Komponenten (Cookie-Manager) haben Timing-Eigenheiten, die
  Tests erst aufdecken — bei der KI-Integration (v.a. lokales Modell) ist mit
  ähnlichen Reifegrad-Problemen zu rechnen.

**b) Reflexiv als Produktfeature:** Das von dir gewünschte "KI schaut sich alte
Projekte an (gescheitert, offen, pausiert, gut abgeschlossen) und leitet
Lessons Learned ab" wird selbst zu einem Epic (**Phase C.3**) — das System lernt
kontinuierlich aus seinen eigenen abgeschlossenen Projekten, sobald genug
Projektbestand vorhanden ist.

---

## 4. Projektart & Komplexität (Einstufung nach Straubel-Kriterienkatalog)

| Kriterium | Einschätzung |
|---|---|
| Reichweite | Mehrere Fachbereiche potenziell betroffen (IT/Engineering, perspektivisch Geschäftsführung als Nutzer) → **ja** |
| Ressourcenbindung | Hoch — durchgehende Eigenentwicklung neben Haupttätigkeit |
| Budget | Gering (Eigenentwicklung, ggf. später API-Kosten) |
| Strategische Priorisierung | Hoch (soll zum Produkt werden) |
| Abhängigkeiten | Ja — baut direkt auf Phase-A-Fundament auf |
| Komplexität | Hoch — Domänen-Mix aus PM-Theorie, KI-Integration, Auth/Multi-User, Dokumentenverarbeitung |
| Risiko | Mittel-hoch — großer Funktionsumfang, ein Entwickler, aber jede Phase einzeln abnehmbar |

**Einstufung: Einzelprojektmanagement (EPM)**, das sich intern in klar
geschnittene Teilvorhaben (die Phasen B–J unten) gliedert — bei
Weiterwachsen (z.B. echtes Entwicklerteam, mehrere parallele Kundenprojekte)
Übergang zu **Programm-Management (PRM)** sinnvoll, aber jetzt nicht nötig.

---

## 5. Genereller Ansatz (Vorgehensmodell)

- **Kein Wasserfall**: Anforderungen (deine eigenen) entwickeln sich mit jeder
  genutzten Phase weiter, klassische vollständige Vorab-Spezifikation ist hier
  kontraproduktiv.
- **Kein klassisches Scrum**: kein Team, keine Sprint-Zeremonien nötig.
- **Gewählt: Hybrides, inkrementelles Vorgehen** (wie in Phase A gelebt) —
  jede Phase ist ein abgeschlossenes, produktiv nutzbares Slice, das *vor*
  Beginn der nächsten Phase im echten Betrieb verifiziert wird. Priorisierung
  der Phasenreihenfolge unten ist ein Vorschlag, kein Fixpunkt — nach jeder
  Phase wird neu priorisiert (passt zum von dir gewünschten "kontinuierlichen
  Fortschreiben").

---

## 6. Projektdesign — Phasen-Übersicht

Jede Phase liefert für sich nutzbaren Mehrwert. Aufwand grob geschätzt:
**S** = wenige Sessions, **M** = mehrere Sessions, **L** = deutlich größer,
**XL** = eigenes Teilprojekt mit mehreren Unter-Phasen.

### Phase B — Ideen-/Projekt-Intake & Genehmigungs-Workflow (L)
- Jede:r angemeldete Mitarbeiter:in kann eine Idee/ein Problem/einen
  Projektantrag einreichen (Freitext + Grunddaten, angelehnt an den
  ASTA/Maßnahme/EPM/PRM-Kriterienkatalog aus deinen Unterlagen zur
  Vor-Einstufung).
- Geschäftsführung/Gremium (Rolle `geschaeftsfuehrung`, ggf. später echte
  `Gremium`/`committee`-Gruppe — Schema in Phase A dafür vorbereitet) sieht
  eine Warteschlange und kann: **ablehnen / auf Warten setzen / archivieren /
  genehmigen**.
- Bei Genehmigung: Zuweisung Projektleitung (eine oder mehrere Personen) +
  **Ressourcen-Zuteilung in %** pro zugewiesener Person.
- **Kapazitätsmodell**: eine Person kann max. **100% Gesamt-Auslastung** über
  alle Projekte haben; 100% entsprechen **75% ihrer tatsächlichen
  Anwesenheitszeit** (Rest = Linientätigkeit/Ad-hoc/Pausen/Meetings außerhalb
  Projekten — passt zum bereits in Phase 1 vorhandenen
  Kapazitäts-Slider-Konzept in `pages/einstellungen.py`, wird hier auf
  Personen- statt nur Instanz-Ebene gehoben).
- **Der formale Intake ist ein zusätzlicher Pfad, kein Ersatz.** Das direkte
  Anlegen von Projekten/Tasks (wie heute in `pages/projekte.py`/
  `pages/meine_tasks.py`) bleibt vollständig erhalten — nicht jedes Projekt
  läuft über GF-Genehmigung. Viele Vorhaben entstehen informell/selbst
  gewählt, ohne dass ein Chef sie zugewiesen hat.
- **`anteil_pct` ist daher immer selbst editierbar**, nicht nur vom GF bei
  formaler Genehmigung setzbar: jede:r Nutzer:in kann für jedes eigene
  Projekt (formal zugewiesen ODER selbst angelegt) seinen/ihren
  Zeitanteil in % hinterlegen/ändern. Bei GF-zugewiesenen Projekten ist der
  vom GF gesetzte Wert der Startwert, danach vom Mitarbeiter korrigierbar
  (kein Freigabe-Zwang für die eigene Prozent-Angabe — nur die
  100%-Gesamt-Deckelung wird geprüft und ggf. als Warnung angezeigt, wenn
  überschritten).
- Datenmodell: neue Tabelle `projektantraege` (nur für den formalen
  Genehmigungs-Pfad, Status:
  eingereicht/abgelehnt/wartend/archiviert/genehmigt), neue Tabelle
  `projekt_ressourcen` (`user_id`, `projekt_id`, `anteil_pct`,
  `quelle`: 'gf_zugewiesen' | 'selbst_gewaehlt' — gilt für **alle** Projekte,
  nicht nur GF-genehmigte).

### Phase C — Straubel-Projekt-Initialisierungs-Assistent (XL, mehrere Unter-Slices)
Ein geführter Assistent, der bei Genehmigung eines Projekts automatisch
startet und die von dir genannte Schrittfolge abbildet:

- **C.1 Zielstellung & Erfolgskriterien** — strukturiertes Formular +
  KI-Vorschlag basierend auf der Freitext-Beschreibung aus Phase B.
- **C.2 Kritische Erfolgsfaktoren** — KI schlägt vor, Nutzer bestätigt/ändert.
- **C.3 Lessons Learned** — KI durchsucht abgeschlossene/gescheiterte/pausierte
  Alt-Projekte in der DB nach Ähnlichkeit (Projektart, Tags, Beschreibung) und
  fasst relevante Erkenntnisse zusammen (erst ab einer gewissen Projektanzahl
  sinnvoll — Platzhalter-Antwort "noch keine Vergleichsdaten" für die
  Anfangszeit).
- **C.4 Projektart & Komplexität** — automatisierte Einstufung nach dem
  ASTA/Maßnahme/EPM/PRM-Kriterienkatalog (Reichweite, Ressourcenbindung,
  Budget, Priorität, Abhängigkeiten, Komplexität, Risikoklasse) — die
  Kriterien-Tabelle aus deinen Unterlagen wird als Regel-/Scoring-Engine
  hinterlegt, nicht nur als Freitext-KI-Rätselraten.
- **C.5 Genereller Ansatz / Vorgehensmodell-Wahl** — Entscheidungsunterstützung
  Wasserfall / V-Modell / Scrum / inkrementell / hybrid, basierend auf
  Komplexität (Stacy-Matrix, siehe Phase D) + Projektmerkmalen.
- **C.6 Projektdesign** — Scope/Abgrenzung, Rahmenbedingungen dokumentieren.
- **C.7 Kontinuierliches Fortschreiben** — der Assistent bleibt als "Projekt-Setup
  bearbeiten" dauerhaft aufrufbar, nicht nur ein Einmal-Wizard.

### Phase D — Risiko- & Anforderungs-Toolkit (L)
- **Risikoregister** pro Projekt: Eintrittswahrscheinlichkeit × Tragweite =
  Risikopriorität, Rangfolge, Maßnahmenklasse
  (vermeiden/vermindern/verlagern/begrenzen/akzeptieren), Restrisiko nach
  Maßnahme (1:1 das Schema aus deinen Unterlagen).
- **SMEA-Analyse** als strukturierte Variante des Risikoregisters.
- **RACI-/AKV-Matrix**: pro Arbeitspaket/Meilenstein Rollen zuordenbar
  (Responsible/Accountable/Consulted/Informed), UI als Matrix-Editor.
- **Stacy-Matrix**: Einordnung Anforderungsklarheit × Lösungsklarheit zur
  Ansatz-Entscheidung in Phase C.5.
- **KANO-Modell**: Anforderungen als Basis-/Leistungs-/Begeisterungsfaktor
  klassifizierbar (manuell oder KI-gestützt aus Freitext-Anforderungen
  vorklassifiziert).
- **Stakeholder-Analyse**: bestehende `Stakeholder`-Tabelle wird erweitert um
  Einfluss/Interesse-Einstufung, im Projektverlauf laufend pflegbar
  (nicht nur einmalig).

### Phase E — Dokumenten-Generierung (M)
- Automatische Erstellung von **Lastenheft/Pflichtenheft-Entwürfen** aus den
  in Phase C/D erfassten Daten (Ziele, Anforderungen, Scope) — KI formuliert
  den Fließtext, Nutzer bestätigt/editiert.
- **Kostenbeschreibung**, **Stücklisten** als strukturierte Tabellen mit
  Export.
- **User-Story/Job-Story-Chatbot**: konversationelle Erfassung von
  Leistungsbeschreibungen, die daraus strukturierte User-Stories ableitet.

### Phase F — Vorgehensmodell-Engine (L)
- Nach Wahl des Vorgehensmodells (Phase C.5) automatische Generierung der
  Meilenstein → Untermeilenstein → Task/Arbeitspaket-Hierarchie:
  - Wasserfall/V-Modell: klassische Phasenfolge mit Quality Gates.
  - Scrum/inkrementell: Product-Backlog-Struktur, Sprints als
    Meilensteine.
  - Hybrid: Mischform je nach Projektteil.
- Fristen/Quality-Gates/Partner-Termine im bestehenden Gantt-Modul sichtbar
  (baut auf `pages/gantt.py` auf, keine Neuentwicklung nötig).
- **Modellspezifische grafische Ansicht, passend zum gewählten/KI-empfohlenen
  Vorgehensmodell** — nicht nur eine generische Ansicht für alle:
  - Wasserfall/V-Modell/inkrementell: Phasenplan/Gantt (bestehendes Modul).
  - Scrum: eigenes Scrum-Board mit Backlog, Sprint-Planung, Sprint-Board
    (To-Do/In Progress/Review/Done), Daily-Scrum-Ansicht, Sprint-Review/
    Retro-Protokoll, Sprint-Ziel/-Thema je Sprint.
  - Hybrid: Kombination der jeweiligen Teilansichten je Projektabschnitt.
  - Immer sichtbar: "wo stehen wir gerade" (aktuelle Phase/aktueller Sprint
    hervorgehoben).
- **Projektstrukturplan (PSP)**: wird aus der Leistungsbeschreibung
  (Features/Epics/User-Storys, aus Phase E) automatisch abgeleitet.
  Unterstützt verschiedene Gliederungsprinzipien — phasenorientiert,
  objektorientiert, funktionsorientiert, gemischt — mit einer
  Entscheidungslogik (ähnlich der Vorgehensmodell-Wahl in C.5), die anhand
  der Projektmerkmale die passendste Gliederung vorschlägt, nicht pauschal
  eine fest verdrahtete Variante.

### Phase G — Kommunikations- & Dokumentations-Hub (XL, datenschutzsensibel)
- Aggregation von: E-Mails (Betreff/Kernaussage, nicht zwingend Volltext
  dauerhaft speichern — Datenschutz-Entscheidung nötig, siehe kritische
  Erfolgsfaktoren), Dateien im Projektordner (`phase3_automation.py`'s
  File-Watcher existiert schon als Basis), Teams-Nachrichten (Graph-API,
  benötigt Azure-App-Berechtigung — hängt an Phase J/SSO-Infrastruktur),
  Meeting-Zusammenfassungen (Transkript → KI-Zusammenfassung).
- Alles fließt in eine KI-gestützte, laufend aktualisierte
  Projekt-Status-Zusammenfassung statt manueller Statusberichte.
- **Daily-Log**: ein Freitextfeld pro Tag ("was habe ich gemacht") — KI
  ordnet Einträge automatisch bestehenden Projekten/Tasks zu, aktualisiert
  Fortschritt, schlägt neue Tasks/nächste Schritte vor.
- **Tagesvorschläge**: baut auf dem bestehenden KI-Assistent
  (`pages/ki_assistent.py`, Fokus-Check) auf, erweitert um die
  Daily-Log-Historie als Kontext.

### Phase H — Terminplanung & Präsentations-Export (M)
- KI schlägt Termine vor und erstellt Einladungen (Vor-Ort/Online-Entscheidung
  auf Basis von RACI/AKV — wer muss physisch anwesend sein vs. wer nur
  informiert wird).
- **HTML-Export** des aktuellen Projektstands als präsentierbare Seite
  (Download), nutzt bestehende Wochenbericht-Logik als Basis, erweitert um
  Ziel/Fortschritt/Risiko-Zusammenfassung statt nur KPI-Tabellen.

### Phase I — Mitarbeiterprofile (S)
- Jede:r Mitarbeiter:in pflegt eigene Aufgaben/To-Dos, Abteilung, Kompetenzen.
- KI erweitert das Profil kontextuell aus den tatsächlich bearbeiteten
  Aufgaben (z.B. "arbeitet häufig an SPS-Themen" leitet sich aus Tags/Projekten
  ab, nicht manuell gepflegt).

### Phase J — Infrastruktur quer zu allen Phasen (L)
- **SSO über Microsoft Entra ID**: OIDC-Login via `msal`-Bibliothek,
  App-Registration in Azure AD nötig (**braucht Mitwirkung deiner
  IT/Azure-AD-Admin-Rolle** — das kannst nicht du allein aus der App heraus
  einrichten, das ist ein blockierender externer Schritt).
  **Code-seitig vorbereitet:** neues Modul `sso.py` (msal Auth-Code-Flow
  inkl. State/PKCE), `auth.get_or_create_sso_user` (Auto-Provisionierung
  beim ersten SSO-Login), `pages/login.py` zeigt den Microsoft-Button nur an
  wenn konfiguriert (bestehender E-Mail/Passwort-Login bleibt unveraendert
  Standard). Neue Einstellungen-Seite **"🔐 SSO (Azure AD)"** ist explizit
  für die IT gedacht: Schritt-für-Schritt-Anleitung zur Azure-AD-App-
  Registration (App anlegen, Redirect-URI, Client Secret, API-Berechtigung
  `User.Read`) plus Formular zum Eintragen von Tenant-ID/Client-ID/Client-
  Secret/Redirect-URI (schreibt nach `.env`) — sobald die IT diese vier
  Werte einträgt, ist SSO ohne weitere Codeänderung aktiv. Der eigentliche
  OAuth-Redirect-Roundtrip konnte mangels echtem Azure-Tenant nicht end-to-
  end getestet werden.
- **Lokales, eingebettetes KI-Modell**: `llama-cpp-python` lädt ein
  quantisiertes GGUF-Modell (Vorschlag: Phi-3.5-mini-instruct oder
  Llama-3.2-3B-Instruct, ca. 2–4 GB) direkt im Python-Prozess — kein
  Ollama-Dienst, kein externer Server, kein API-Key nötig, läuft komplett
  offline im Firmennetz. Wird in `ki_service.py` als dritte, neue
  Standard-Backend-Option ergänzt (bisher: Anthropic/Ollama) — Anthropic
  bleibt optionale Fallback-Wahl, wenn doch mal ein privater API-Key
  verfügbar ist.

### Phase K — Kosten-, Zeit- & Ressourcencontrolling (XL, v.a. für Förder-/Forschungsprojekte)

- **Zeiterfassung mit Rollenzuordnung**: baut auf der bestehenden
  `Zeitbuchungen`-Tabelle auf, ergänzt um Rollen-/Einsatzart je Buchung
  (Elektriker, Produktioner, Ingenieur, Programmierer, Projektleiter,
  Geschäftsführer) — jede Rolle hat einen eigenen Stundensatz für die
  Abrechnung.
- **Belegverwaltung**: Rechnungen/Belege projektbezogen einreichen und
  ablegen — Material, Dienstleistungen, Bewirtung/Essen,
  Kilometerabrechnungen, Hotelunterkünfte, sonstige Spesen. Jeweils mit
  Betrag, Kategorie, Beleg-Upload/Ablage.
- **Budgetüberwachung**: laufender Abgleich Plan-Budget (bestehendes
  `budget_cap`-Feld auf `projekte`) vs. Ist-Ausgaben (Zeiten × Stundensätze +
  Belege), zentrale Budget-/Ressourcen-Übersicht je Projekt.
- **Zwischenberichte & Nachweise**: Berichts-/Nachweispflichten mit
  konfigurierbarem Rhythmus (quartalsweise / halbjährlich / jährlich /
  einmalig über die gesamte Projektlaufzeit), inkl. Ablage der eingereichten
  Dokumente direkt im Projekt als eigener Nachweis.
- **Kostenkalkulation & Rechnungsstellung**: Kostenkalkulation je Projekt;
  Erstellung von Vor- und Endrechnung, **händisch nachbearbeitbar**;
  Kalkulation mit Skonto, Gewinn und Rabatt jeweils in %.
- **Schätzverfahren**: mehrere Schätzmethoden für Zeiten und Kosten
  (Material, Mitarbeiterkosten, sonstige vorhabenspezifische Kosten,
  AfA-Kosten, Gesamtbudget) — 2-Punkt-Schätzung, 3-Punkt-Schätzung (PERT) und
  Story-Points-basierte relative Schätzung für agile Vorgehensmodelle (Phase F).

Datenmodell-Ausblick (bei Umsetzung zu verfeinern): `mitarbeiter_rollensaetze`
(Rolle × Stundensatz, ggf. je Company), `belege` (Kategorie, Betrag, Datei,
Projekt-Bezug), `berichtspflichten` (Rhythmus, Fälligkeiten, Nachweis-Ablage),
`rechnungen` (Vor-/Endrechnung, Positionen, Skonto/Gewinn/Rabatt-%,
editierbar), `schaetzungen` (Methode, Werte, Ergebnis je Kostenart/Zeit).

Priorität/Einordnung in die Gesamt-Reihenfolge noch offen — passt inhaltlich
in die Nähe von Phase E (Dokumenten-Generierung) und D (Budget hängt eng mit
Risiko/Ressourcen zusammen), wird aber bewusst als eigene Phase geführt statt
in E hineingequetscht, da der Umfang (Zeiterfassung+Abrechnung+Belege+
Berichte+Kalkulation+Schätzverfahren) für sich schon EPM-Größe hat.

**Slice 1 umgesetzt** (Zeiterfassung mit Rollenzuordnung + Budgetüberwachung):
`zeitbuchungen.rolle` (Einsatzrolle je Buchung, `user_id` gab es schon seit
Phase A/Migration 0005), neue Tabelle `mitarbeiter_rollensaetze` (6 Rollen,
Stundensatz konfigurierbar in Einstellungen → Rollensätze), neuer Tab
"💰 Budget" je Projekt (Plan-Budget aus `projekte.budget_cap` vs. Ist-Kosten
aus Zeiten × Stundensatz, inkl. Warnung bei Buchungen ohne konfigurierten
Satz). Erweitert um **Tätigkeitsnachweis**: das bestehende `notiz`-Feld beim
Stoppen der Zeiterfassung ist jetzt explizit als "Tätigkeit (was genau wurde
gemacht)" beschriftet; im Budget-Tab gibt es eine nach Person gruppierte
Aufschlüsselung (Datum/Rolle/Stunden/Tätigkeit je Buchung) plus Excel-Export
(`wochenbericht.erstelle_taetigkeitsnachweis_excel`) - Grundlage für
Personennachweise in Förder-/Forschungsprojekten. Erweitert um **manuelle/
rückwirkende Zeitbuchung** (`dal.erfasse_zeitbuchung_manuell`, UI-Abschnitt
"Zeit manuell nachtragen" in Wochenbericht → Zeiterfassung): der Live-Timer
allein deckte nur Kanban-Task-Arbeit des eingeloggten Nutzers ab - jetzt
lassen sich zusätzlich Meetings/Vor-/Nachbereitung ohne Task (`task_id`
bleibt NULL, Spalte war schon nullable) sowie Zeiten für andere Personen
(Kolleg:innen) frei erfassen, inkl. Datum/Rolle/Tätigkeit.

**Slice 2 umgesetzt** (Belegverwaltung): neue Tabelle `belege` (Kategorie
Material/Dienstleistung/Bewirtung/Kilometer/Hotel/Sonstiges, Betrag,
Beschreibung, Belegdatum, optionale Datei als BYTEA inkl. Download), neuer
Abschnitt "📎 Belege" im Budget-Tab je Projekt mit Erfassungsformular und
Liste inkl. Löschen. `get_projekt_budget_status` liefert jetzt
`ist_kosten` (Zeiten), `ist_kosten_belege`, `ist_kosten_gesamt` und die
Auslastung basiert auf der Summe aus beidem statt nur Zeitkosten.

**Phase K vollständig umgesetzt.** Slice 3 (Zwischenberichte & Nachweise):
neue Tabellen `berichtspflichten` (Rhythmus quartalsweise/halbjaehrlich/
jaehrlich/einmalig) + `berichtsnachweise` (Datei je Fälligkeit, BYTEA);
Fälligkeiten werden aus Rhythmus berechnet, nicht einzeln gepflegt. Slice 4
(Kostenkalkulation & Rechnungsstellung): neue Tabelle `rechnungskalkulationen`
(Grundbetrag i.d.R. = Summe der Positionen/Stückliste aus Phase E, Gewinn/
Rabatt/Skonto in %, Endbetrag händisch überschreibbar), Rechnungstext bewusst
deterministisch per Template statt KI generiert (kein Halluzinationsrisiko
bei Finanzdokumenten) und in `projekt_dokumente` (typ=vorrechnung/
endrechnung) editierbar abgelegt. Slice 5 (Schätzverfahren): neue Tabelle
`schaetzungen` mit 2-Punkt-, 3-Punkt-(PERT)- und Story-Points-Methode. Alle
drei Bereiche im neuen Tab "🧾 Rechnung & Nachweise" je Projekt, per
DAL-Test und Browser verifiziert.

Nebenbei behoben: `erzeuge_meilenstein_struktur` (Phase F, "Struktur
generieren"-Button) hatte durch eine fehlerhafte Einfügung in einer
früheren Phase-I-Session sein `return`-Statement verloren (Funktion gab
`None` zurück, verwaister Toter Code lag am Dateiende) - wieder korrekt
verdrahtet und verifiziert.

---

## 7. Kontinuierliches Fortschreiben

Dieses Dokument wird nach jeder abgeschlossenen Phase aktualisiert: Status,
tatsächlicher Aufwand, neue Lessons Learned, Anpassung der Reihenfolge. Es ist
kein Einmal-Dokument, sondern die lebende Grundlage — genau wie es der
Assistent aus Phase C.7 für jedes einzelne Kundenprojekt später auch leisten
soll.

---

## 8. Backlog aus erster QA-Runde mit dem Handbuch (2026-07-06)

Nutzer hat die App anhand von `docs/HANDBUCH.html` durchgetestet und eine
grosse Liste an Bugs/Verbesserungen zurückgemeldet. **In dieser Session
bereits behoben:** Schnellsuche zeigte nur Tasks statt auch Projekte;
KI-Aufrufe ohne sichtbares Lade-Feedback (jetzt `st.spinner` an allen
Stellen — echtes Hintergrund-Threading bleibt als Punkt unten offen);
"Meine Tasks"-Erledigt-Button ohne sichtbaren Effekt (Ursache:
`berechne_dringlichkeit` ignorierte den Status, erledigte Tasks blieben an
alter Sortierposition — jetzt Score=0 bei Status "Erledigt"); "Meine
Tasks"-Schnellanlage ohne Aufwand/Prio-Feld; KI-Kompetenzprofil antwortete
teils auf Chinesisch (Prompt ergänzt um explizite Sprachvorgabe);
User-Story-Interview wiederholte Rückfragen (Umstellung von fehleranfälligem
JSON auf das im Projekt etablierte zeilenbasierte Format, wie bei
Terminplanung/Vorgehensstruktur bereits gemacht).

**Noch offen — nächste Session(s), grob nach Aufwand geordnet:**

*Kleinere Ergänzungen:*
- Projekt-Start-/Enddatum auch im Tab "Projekt bearbeiten" editierbar (bisher nur beim Anlegen)
- Ressourcen-Tab: Bug bei Hinzufügen weiterer Personen mit % prüfen/beheben
- Mitarbeiter (auch ohne Login-Account, z.B. Produktioner) einem Projekt zuweisen + für sie Zeit erfassen können
- AKV-Tabellenansicht (Aufgaben/Kompetenzen/Verantwortung) neben der bestehenden RACI-Matrix
- Risikoregister: KI-Unterstützung beim Erstellen von Risiken; FMEA-Koeffizient und Gesamtsumme Risiko/Restrisiko je Projekt
- Dokument-Vorlagen (Lasten-/Pflichtenheft etc.) in Einstellungen hinterlegbar, Export nicht nur als .txt
- Tags im Technik-Gedächtnis entfernen (wird laut Nutzer nicht verwendet)
- Kanban: Tasks >2 Monate erledigt in aufklappbarem Archiv-Bereich ausblenden
- Genehmigung: direkter Zugriffsschutz ggf. entfernen, da Nav bereits filtert (niedrige Prio, Doppelabsicherung)
- Admin-UI zum Anlegen/Verwalten von Mitarbeiter-Accounts (bisher nur seed.py/direkter DB-Zugriff)
- Einstellungen → Roadmap-Tab inhaltlich aktualisieren (zeigt noch alte 3-Phasen-Grobplanung)
- Projektstatus auf feste Werte einschränken (Begonnen/Nicht gestartet/Unterbrochen/Abgebrochen/Abgelehnt/Beendet), Standardfilter beim Öffnen auf "Begonnen" statt "Alle"

*Mittlere Workflow-Überarbeitungen:*
- Kritischer Pfad: Definition wird aktuell nirgends ausgewertet (nur Anzeige) — echte kritische-Pfad-Berechnung oder zumindest Filterung/Priorisierung danach
- "Projekt-Design"-Tab: Zweck klären bzw. mit Initialisierung zusammenlegen
- Terminplanung: Vor-Ort/Online-Entscheidung soll auch Standort der Beteiligten sowie Termindauer (nur Workshops/lange Themen vor Ort) berücksichtigen
- "Struktur generieren" darf bei erneutem Klick nicht immer wieder neue Meilensteine/Tasks duplizieren, sondern abgleichen/ergänzen/optimieren
- Kompetenzprofil: KI-Ableitung UND manuelle Pflege sollen nebeneinander sichtbar bleiben (aktuell wirkt es wie entweder/oder)
- "Mein Profil → Eigene Aufgaben" vs. Kanban/Meine Tasks: Redundanz auflösen (vermutlich eine gemeinsame Task-Quelle mit `bearbeiter_user_id`-Filter statt eigener Liste)
- Zeiterfassung: Schnellauswahl mehrerer Personen gleichzeitig (z.B. gemeinsames Meeting) statt Einzeleingabe
- Arbeitszeit im Profil hinterlegen (Std./Tag, Zeitfenster) → automatische Kapazitätsberechnung je Projekt/Meilenstein (Formel vom Nutzer vorgegeben: Arbeitszeit × Anwesenheitsfaktor × Projektanteil-%)
- Gantt & Zeitplan: gewähltes Vorgehensmodell (Wasserfall/V-Modell/Scrum) grafisch darstellen; Redundanz zwischen Projekt-Tab-Anzeige (V-Modell/Scrum-Board) und separatem Gantt-Modul auflösen — evtl. Gantt direkt in den Projekt-Tab integrieren statt eigene Navigation
- Schätzverfahren: nicht nur ein eigener Bereich im Projekt, sondern überall verfügbar wo Zeit/Kosten anfallen (Task-Anlage, Budget, etc.), inkl. Kosten-Schätzung (nicht nur Zeit); Story Points brauchen einen konfigurierbaren Zeit-Referenzwert (z.B. 1 SP = X Minuten), aus dem sich die Zeit automatisch ableitet

*Größere Features:*
- Mail-Parser: automatische Vorschläge (kein manuelles Einfügen mehr nötig), generierter Antworttext, Outlook-Entwurf-Erstellung, "durchwischbare" Liste aller offenen Mails/Vorschläge
- Smart Folder: erweiterbare/frei ergänzbare Ordnerstruktur, automatischer Ordnerpfad je neuem Projekt, definierte Ablage-Konventionen für alle Dokumenttypen (Excel/CSV/Word/Text/HTML/PowerPoint), Export/Import eines abgeschlossenen Projekts (JSON o.ä.) für andere Standorte/Teams
- Präsentations-Export: zusätzlich PowerPoint-Format (mit Vorlage aus Einstellungen), umfassendere Status-Präsentation (Themenbeschreibung, Erfolgskriterien, Leistungsbeschreibung, Lasten-/Pflichtenheft-Kurzfassung, RACI, AKV, Risiken, Budget, Kosten, Projektplan/Vorgehensmodell-Status in einem Dokument)
- Echtes Hintergrund-Threading für KI-Aufrufe (aktuell nur `st.spinner`-Feedback, App bleibt während der ~10s Wartezeit blockiert)

---

## Offene Annahmen — bitte bestätigen oder korrigieren

1. Reihenfolge der Phasen B–J: Vorschlag ist inhaltlich sinnvoll geordnet
   (Intake → Initialisierung → Risiko/Anforderungen → Dokumente →
   Vorgehensmodell → Kommunikation → Termine/Reporting → Profile →
   Infrastruktur), aber **du kennst deinen tatsächlichen Alltagsnutzen** am
   besten — z.B. könnte Phase G (Daily-Log-KI) für dich persönlich schon
   früher wichtiger sein als Phase D/E.
2. Phase G (Dokumenten-Aggregation aus Mails/Teams) ist der
   datenschutzsensibelste Teil — hier sollte vor der Umsetzung explizit
   festgelegt werden, was dauerhaft gespeichert vs. nur zur Laufzeit
   verarbeitet wird.
3. Phase J/SSO braucht einen externen Schritt (Azure-App-Registration) —
   sobald du dazu bereit bist, sag Bescheid, dann bereite ich die
   technische Seite (Redirect-URIs, benötigte Berechtigungen/Scopes) so vor,
   dass deine IT nur noch eine kurze Freigabe erteilen muss.
