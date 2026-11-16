# ⚙️ Engineering Cockpit v1.0

Zentrales Steuerungselement für Projektingenieure im Maschinenbau & SPS-Umfeld.

---

## 🚀 Installation

### Schritt 1 – Python & Dependencies

```bash
# Python 3.11+ empfohlen
pip install -r requirements.txt
```

### Schritt 2 – PostgreSQL starten

Seit Phase A ist PostgreSQL die einzige unterstützte Datenbank (kein MSSQL/SQLite
mehr). Lokal am einfachsten per Docker Compose:

```bash
docker compose up -d
```

### Schritt 3 – Konfiguration

```bash
cp .env.example .env
# .env anpassen falls nötig (Standardwerte passen zur docker-compose.yml)
```

### Schritt 4 – Ersten Nutzer anlegen

```bash
python seed.py
# Fragt interaktiv nach Firmenname, E-Mail und Passwort für den Owner-Account
```

### Schritt 5 – Starten

```bash
streamlit run app.py
```

Die App öffnet sich automatisch im Browser unter http://localhost:8501 und
verlangt jetzt einen Login (siehe Schritt 4).

---

## 📁 Projektstruktur

```
engineering_cockpit/
├── app.py              # Hauptapp + Navigation + CSS
├── database.py         # DB-Verbindung + Schema-Init
├── dal.py              # Data Access Layer (alle DB-Operationen)
├── requirements.txt    # Python-Abhängigkeiten
├── .env.example        # Konfigurations-Vorlage
└── pages/
    ├── dashboard.py    # Morgendliche Übersicht + KPIs
    ├── kanban.py       # Global Kanban (alle Tasks, alle Projekte)
    ├── projekte.py     # Projekt-CRUD + Detailansicht
    ├── gedaechtnis.py  # Technik-Gedächtnis + Volltextsuche
    ├── stakeholder.py  # Stakeholder-Radar + Follow-Up
    └── einstellungen.py # Config + DB-Status + Roadmap
```

---

## 🗂 Features Phase 1

| Feature | Beschreibung |
|---|---|
| **Global Kanban** | Alle Tasks aller Projekte in einer Ansicht (Backlog → Fokus → Warten auf → Erledigt) |
| **Aufwandsklassen** | ⚡2min · 🕐15min · ⏱2h · 🔴4h+ für gezielte Tagesplanung |
| **Eskalations-System** | Automatisch: Gelb (7d) → Orange (14d) → Rot (21d) |
| **Mail-Entwürfe** | Automatische Follow-Up-Mails bei eskalierten Tasks |
| **Quick-Wins** | Dashboard schlägt Tasks ≤15min für Lückenfüller vor |
| **Technik-Gedächtnis** | Volltextsuche über Tasks + Logbuch + Lösungen |
| **Mail Drop-Zone** | Schnell erfassen: Mail-Inhalt → Archiv |
| **Stakeholder-Radar** | Wer blockiert gerade was? |
| **MS SQL + SQLite** | Produktiv auf SQL Server, lokal mit SQLite testbar |

---

## 🔮 Roadmap

- **Phase 2**: KI-Tagesplanung, Mail-Parser (Deadlines erkennen), Context-Switch-Warnung
- **Phase 3**: Outlook-Sync, Auto-Folder bei Projektanlage, Datei-Watcher

---

## 🛠 Troubleshooting

**"ODBC Driver not found"**  
→ ODBC Driver 17 for SQL Server installieren (siehe Schritt 3)

**"Login failed for user"**  
→ SQL Server: Mixed Authentication aktivieren oder Windows-Auth nutzen (EC_SQL_TRUSTED=yes)

**Schnelltest ohne SQL Server**  
→ EC_USE_SQLITE=true in .env setzen. SQLite-Datei wird automatisch erstellt.
