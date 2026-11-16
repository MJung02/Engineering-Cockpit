"""
Engineering Cockpit - Data Access Layer
Alle Datenbankoperationen zentral gebündelt (PostgreSQL only, siehe Phase A Plan)
"""
from datetime import datetime, timedelta, timezone
from database import db_cursor


def _now():
    """Timezone-aware 'now' matching Postgres TIMESTAMPTZ columns - a naive
    datetime can't be compared against values read back from those columns
    (they come back tz-aware)."""
    return datetime.now(timezone.utc)


_default_company_id_cache = None


def _default_company_id():
    """Resolves to the sole seeded company (Phase A has exactly one). Lets
    create_* functions default company_id without callers needing to pass it
    explicitly - additive, no call-site breakage."""
    global _default_company_id_cache
    if _default_company_id_cache is None:
        with db_cursor() as (conn, cursor):
            cursor.execute("SELECT id FROM companies ORDER BY created_at LIMIT 1")
            row = cursor.fetchone()
            _default_company_id_cache = row[0] if row else None
    return _default_company_id_cache


# ═══════════════════════════════════════════════════════════════════════════════
# PROJEKTE
# ═══════════════════════════════════════════════════════════════════════════════

def get_all_projekte(status_filter=None):
    with db_cursor() as (conn, cursor):
        q = "SELECT * FROM Projekte"
        if status_filter:
            placeholders = ",".join(["%s"] * len(status_filter))
            q += f" WHERE status IN ({placeholders})"
            cursor.execute(q + " ORDER BY erstellt_am DESC", tuple(status_filter))
        else:
            cursor.execute(q + " ORDER BY erstellt_am DESC")
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def get_projekt(projekt_id):
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT * FROM Projekte WHERE id=%s", (projekt_id,))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        return dict(zip(cols, row)) if row else None


def create_projekt(name, kostenstelle="", status="Begonnen", farbe="#3B82F6",
                   beschreibung="", ordner_pfad="", budget_cap=None,
                   start_datum=None, end_datum=None, company_id=None,
                   owner_user_id=None):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO Projekte (name, kostenstelle, status, farbe, beschreibung,
                ordner_pfad, budget_cap, start_datum, end_datum, company_id, owner_user_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (name, kostenstelle, status, farbe, beschreibung,
              ordner_pfad, budget_cap, start_datum, end_datum,
              company_id or _default_company_id(), owner_user_id))
        return cursor.fetchone()[0]


def update_projekt(projekt_id, **kwargs):
    kwargs["geaendert_am"] = _now()
    fields = ", ".join(f"{k}=%s" for k in kwargs)
    values = list(kwargs.values()) + [projekt_id]
    with db_cursor() as (_, cursor):
        cursor.execute(f"UPDATE Projekte SET {fields} WHERE id=%s", values)


def delete_projekt(projekt_id):
    with db_cursor() as (_, cursor):
        cursor.execute("DELETE FROM Projekte WHERE id=%s", (projekt_id,))


# ═══════════════════════════════════════════════════════════════════════════════
# TASKS
# ═══════════════════════════════════════════════════════════════════════════════

def get_tasks(projekt_id=None, status=None, aufwandsklasse=None, warten_auf_person=None,
             warten_auf_user_id=None, meilenstein_id=None, ohne_meilenstein=False,
             bearbeiter_user_id=None):
    with db_cursor() as (conn, cursor):
        q = """
            SELECT t.*, p.name AS projekt_name, p.farbe AS projekt_farbe,
                   COALESCE(wu.display_name, t.warten_auf_person_legacy) AS warten_auf_person,
                   bu.display_name AS bearbeiter_name
            FROM Tasks t
            LEFT JOIN Projekte p ON t.projekt_id = p.id
            LEFT JOIN users wu ON wu.id = t.warten_auf_user_id
            LEFT JOIN users bu ON bu.id = t.bearbeiter_user_id
            WHERE 1=1
        """
        params = []
        if projekt_id:
            q += " AND t.projekt_id=%s"
            params.append(projekt_id)
        if status:
            if isinstance(status, list):
                q += f" AND t.status IN ({','.join(['%s']*len(status))})"
                params.extend(status)
            else:
                q += " AND t.status=%s"
                params.append(status)
        if aufwandsklasse:
            q += " AND t.aufwandsklasse=%s"
            params.append(aufwandsklasse)
        if warten_auf_person:
            # Matcht gegen den aufgelösten Anzeigenamen (FK-Name oder Legacy-Text),
            # damit UI-Filter mit bereits aufgelösten Namen (z.B. aus get_tasks())
            # unabhängig von der Quelle funktionieren.
            q += " AND COALESCE(wu.display_name, t.warten_auf_person_legacy)=%s"
            params.append(warten_auf_person)
        if warten_auf_user_id:
            q += " AND t.warten_auf_user_id=%s"
            params.append(warten_auf_user_id)
        if bearbeiter_user_id:
            q += " AND t.bearbeiter_user_id=%s"
            params.append(bearbeiter_user_id)
        if meilenstein_id:
            q += " AND t.meilenstein_id=%s"
            params.append(meilenstein_id)
        elif ohne_meilenstein:
            q += " AND t.meilenstein_id IS NULL"
        q += " ORDER BY t.prioritaet ASC, t.erstellt_am DESC"
        cursor.execute(q, tuple(params))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def get_task(task_id):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT t.*, p.name AS projekt_name, p.farbe AS projekt_farbe,
                   COALESCE(wu.display_name, t.warten_auf_person_legacy) AS warten_auf_person,
                   bu.display_name AS bearbeiter_name
            FROM Tasks t
            LEFT JOIN Projekte p ON t.projekt_id = p.id
            LEFT JOIN users wu ON wu.id = t.warten_auf_user_id
            LEFT JOIN users bu ON bu.id = t.bearbeiter_user_id
            WHERE t.id=%s
        """, (task_id,))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        return dict(zip(cols, row)) if row else None


def create_task(projekt_id, titel, beschreibung="", aufwandsklasse="15m",
                status="Backlog", prioritaet=2, kritischer_pfad=False,
                warten_auf_person=None, warten_auf_user_id=None, faellig_am=None,
                meilenstein_id=None, company_id=None, bearbeiter_user_id=None, tags=None):
    """warten_auf_person: Freitext-Fallback (externe Person/Abteilung, kein Login).
    warten_auf_user_id: bevorzugt, wenn eine echte(r) Mitarbeiter:in ausgewählt wurde.
    meilenstein_id: optionale Zuordnung zu Meilenstein/Sprint (Phase F).
    bearbeiter_user_id/tags: Aufgaben-Zuordnung + Themen-Tags (Phase I), Basis
    fuer die KI-Kompetenzableitung im Mitarbeiterprofil."""
    with db_cursor() as (conn, cursor):
        warten_seit = _now() if (warten_auf_person or warten_auf_user_id) else None
        cursor.execute("""
            INSERT INTO Tasks (projekt_id, titel, beschreibung, aufwandsklasse,
                status, prioritaet, kritischer_pfad, warten_auf_person_legacy,
                warten_auf_user_id, warten_seit, faellig_am, meilenstein_id, company_id,
                bearbeiter_user_id, tags)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (projekt_id, titel, beschreibung, aufwandsklasse,
              status, prioritaet, bool(kritischer_pfad), warten_auf_person,
              warten_auf_user_id, warten_seit, faellig_am, meilenstein_id,
              company_id or _default_company_id(), bearbeiter_user_id, tags))
        return cursor.fetchone()[0]


def update_task(task_id, **kwargs):
    if "warten_auf_person" in kwargs:
        kwargs["warten_auf_person_legacy"] = kwargs.pop("warten_auf_person")
    if (kwargs.get("warten_auf_person_legacy") or kwargs.get("warten_auf_user_id")) \
            and "warten_seit" not in kwargs:
        kwargs["warten_seit"] = _now()
    if kwargs.get("status") == "Erledigt":
        kwargs["erledigt_am"] = _now()
    kwargs["geaendert_am"] = _now()
    fields = ", ".join(f"{k}=%s" for k in kwargs)
    values = tuple(kwargs.values()) + (task_id,)
    with db_cursor() as (_, cursor):
        cursor.execute(f"UPDATE Tasks SET {fields} WHERE id=%s", values)


def delete_task(task_id):
    with db_cursor() as (_, cursor):
        cursor.execute("DELETE FROM Tasks WHERE id=%s", (task_id,))


def get_eskalations_updates():
    """Berechnet und aktualisiert Eskalationsstufen für 'Warten auf'-Tasks."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT id, warten_seit, eskalationsstufe
            FROM Tasks WHERE status='Warten_auf' AND warten_seit IS NOT NULL
        """)
        cols = [d[0] for d in cursor.description]
        tasks = [dict(zip(cols, row)) for row in cursor.fetchall()]

    # Einstellungen lesen
    tage = int(get_einstellung("follow_up_tage") or 7)
    updated = []
    for t in tasks:
        try:
            ws = datetime.fromisoformat(str(t["warten_seit"]))
        except Exception:
            continue
        diff = (_now() - ws).days
        if diff >= tage * 3:
            neue_stufe = 3
        elif diff >= tage * 2:
            neue_stufe = 2
        elif diff >= tage:
            neue_stufe = 1
        else:
            neue_stufe = 0
        if neue_stufe != t["eskalationsstufe"]:
            update_task(t["id"], eskalationsstufe=neue_stufe)
            updated.append(t["id"])
    return updated


# ═══════════════════════════════════════════════════════════════════════════════
# INTERAKTIONEN (Logbuch / Technik-Gedächtnis)
# ═══════════════════════════════════════════════════════════════════════════════

def get_interaktionen(task_id=None, projekt_id=None, typ=None, meilenstein_id=None, limit=50):
    with db_cursor() as (conn, cursor):
        q = """
            SELECT i.*, t.titel AS task_titel, p.name AS projekt_name,
                   COALESCE(pu.display_name, i.person_legacy) AS person
            FROM Interaktionen i
            LEFT JOIN Tasks t ON i.task_id = t.id
            LEFT JOIN Projekte p ON i.projekt_id = p.id
            LEFT JOIN users pu ON pu.id = i.person_user_id
            WHERE 1=1
        """
        params = []
        if task_id:
            q += " AND i.task_id=%s"
            params.append(task_id)
        if projekt_id:
            q += " AND i.projekt_id=%s"
            params.append(projekt_id)
        if typ:
            q += " AND i.typ=%s"
            params.append(typ)
        if meilenstein_id:
            q += " AND i.meilenstein_id=%s"
            params.append(meilenstein_id)
        q += " ORDER BY i.erstellt_am DESC"
        if limit:
            q += f" LIMIT {limit}"
        cursor.execute(q, tuple(params))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def create_interaktion(inhalt, task_id=None, projekt_id=None, typ="Notiz",
                       person=None, person_user_id=None, tags=None,
                       meilenstein_id=None, company_id=None):
    """person: Freitext-Fallback (externe Person, kein Login).
    person_user_id: bevorzugt, wenn eine echte(r) Mitarbeiter:in ausgewählt wurde.
    meilenstein_id: optionale Zuordnung zu einem Sprint fuer Sprint-Review/Retro (Phase F)."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO Interaktionen (task_id, projekt_id, typ, inhalt, person_legacy,
                person_user_id, tags, meilenstein_id, company_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (task_id, projekt_id, typ, inhalt, person, person_user_id, tags,
              meilenstein_id, company_id or _default_company_id()))
        return cursor.fetchone()[0]


def fulltext_search(suchbegriff):
    """Volltextsuche über Tasks, Interaktionen und Projekte."""
    results = {"tasks": [], "interaktionen": [], "projekte": []}
    if not suchbegriff or len(suchbegriff) < 2:
        return results
    term = f"%{suchbegriff}%"
    with db_cursor() as (conn, cursor):
        # Tasks
        cursor.execute("""
            SELECT t.*, p.name AS projekt_name, p.farbe AS projekt_farbe,
                   COALESCE(wu.display_name, t.warten_auf_person_legacy) AS warten_auf_person
            FROM Tasks t
            LEFT JOIN Projekte p ON t.projekt_id = p.id
            LEFT JOIN users wu ON wu.id = t.warten_auf_user_id
            WHERE t.titel LIKE %s OR t.beschreibung LIKE %s
            ORDER BY t.erstellt_am DESC
        """, (term, term))
        cols = [d[0] for d in cursor.description]
        results["tasks"] = [dict(zip(cols, row)) for row in cursor.fetchall()]

        # Interaktionen
        cursor.execute("""
            SELECT i.*, t.titel AS task_titel, p.name AS projekt_name,
                   COALESCE(pu.display_name, i.person_legacy) AS person
            FROM Interaktionen i
            LEFT JOIN Tasks t ON i.task_id = t.id
            LEFT JOIN Projekte p ON i.projekt_id = p.id
            LEFT JOIN users pu ON pu.id = i.person_user_id
            WHERE i.inhalt LIKE %s OR i.tags LIKE %s
            ORDER BY i.erstellt_am DESC
        """, (term, term))
        cols = [d[0] for d in cursor.description]
        results["interaktionen"] = [dict(zip(cols, row)) for row in cursor.fetchall()]

        # Projekte
        cursor.execute("""
            SELECT * FROM Projekte
            WHERE name LIKE %s OR beschreibung LIKE %s OR kostenstelle LIKE %s
        """, (term, term, term))
        cols = [d[0] for d in cursor.description]
        results["projekte"] = [dict(zip(cols, row)) for row in cursor.fetchall()]

    return results


# ═══════════════════════════════════════════════════════════════════════════════
# STAKEHOLDER
# ═══════════════════════════════════════════════════════════════════════════════

def get_stakeholder():
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT * FROM Stakeholder ORDER BY name")
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def get_stakeholder_warteliste():
    """Zeigt, bei welchen Personen die meisten offenen Anfragen hängen."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT COALESCE(wu.display_name, t.warten_auf_person_legacy) AS warten_auf_person,
                   COUNT(*) AS anzahl,
                   MAX(t.eskalationsstufe) AS max_eskalation
            FROM Tasks t
            LEFT JOIN users wu ON wu.id = t.warten_auf_user_id
            WHERE t.status='Warten_auf'
              AND (t.warten_auf_user_id IS NOT NULL OR t.warten_auf_person_legacy IS NOT NULL)
            GROUP BY COALESCE(wu.display_name, t.warten_auf_person_legacy)
            ORDER BY anzahl DESC
        """)
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def create_stakeholder(name, email="", rolle="", firma="", company_id=None):
    with db_cursor() as (conn, cursor):
        cursor.execute(
            "INSERT INTO Stakeholder (name, email, rolle, firma, company_id) VALUES (%s,%s,%s,%s,%s) RETURNING id",
            (name, email, rolle, firma, company_id or _default_company_id())
        )
        return cursor.fetchone()[0]


# ═══════════════════════════════════════════════════════════════════════════════
# EINSTELLUNGEN
# ═══════════════════════════════════════════════════════════════════════════════

def get_einstellung(schluessel, default=None):
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT wert FROM Einstellungen WHERE schluessel=%s", (schluessel,))
        row = cursor.fetchone()
        return row[0] if row else default


def set_einstellung(schluessel, wert):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO Einstellungen (schluessel, wert) VALUES (%s,%s)
            ON CONFLICT (schluessel) DO UPDATE SET wert = EXCLUDED.wert
        """, (schluessel, str(wert)))


# ═══════════════════════════════════════════════════════════════════════════════
# DASHBOARD-STATISTIKEN
# ═══════════════════════════════════════════════════════════════════════════════

def get_dashboard_stats():
    with db_cursor() as (conn, cursor):
        stats = {}
        cursor.execute("SELECT COUNT(*) FROM Projekte WHERE status='Aktiv'")
        stats["aktive_projekte"] = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM Tasks WHERE status='Fokus'")
        stats["fokus_tasks"] = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM Tasks WHERE status='Warten_auf'")
        stats["warten_tasks"] = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM Tasks WHERE status='Warten_auf' AND eskalationsstufe>=2")
        stats["eskaliert"] = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM Tasks WHERE status='Backlog'")
        stats["backlog"] = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM Tasks WHERE aufwandsklasse IN ('2m','15m') AND status='Backlog'")
        stats["quick_wins"] = cursor.fetchone()[0]

        return stats


# ═══════════════════════════════════════════════════════════════════════════════
# DRINGLICHKEITS-SCORE (Phase 4 – "bewusst offen" → jetzt implementiert)
# ═══════════════════════════════════════════════════════════════════════════════

def berechne_dringlichkeit(task: dict) -> float:
    """
    Gewichteter Dringlichkeits-Score 0–100 für einen Task.
    Höher = dringlicher. Wird für Sortierung in Kanban + Meine Tasks genutzt.

    Faktoren:
      Priorität          (1=Hoch→40, 2=Mittel→20, 3=Niedrig→5)
      Eskalationsstufe   (0→0, 1→10, 2→25, 3→40)
      Kritischer Pfad    (+15 wenn True)
      Fälligkeit         (+20 wenn heute/überfällig, +10 wenn ≤3 Tage)
      Wartezeit          (+5 wenn >14 Tage am Warten)
    """
    from datetime import date
    if task.get("status") == "Erledigt":
        return 0.0  # erledigte Tasks sollen sichtbar ans Ende der Sortierung fallen

    score = 0.0

    # Priorität
    prio_punkte = {1: 40, 2: 20, 3: 5}
    score += prio_punkte.get(task.get("prioritaet", 2), 20)

    # Eskalation
    esk_punkte = {0: 0, 1: 10, 2: 25, 3: 40}
    score += esk_punkte.get(min(task.get("eskalationsstufe", 0) or 0, 3), 0)

    # Kritischer Pfad
    if task.get("kritischer_pfad"):
        score += 15

    # Fälligkeit
    if task.get("faellig_am"):
        try:
            faellig = date.fromisoformat(str(task["faellig_am"]))
            delta = (faellig - date.today()).days
            if delta <= 0:
                score += 20    # Heute oder überfällig
            elif delta <= 3:
                score += 10    # In 3 Tagen
        except Exception:
            pass

    # Lange Wartezeit
    if task.get("warten_seit"):
        try:
            from datetime import datetime
            ws = datetime.fromisoformat(str(task["warten_seit"]))
            if (_now() - ws).days > 14:
                score += 5
        except Exception:
            pass

    return round(min(score, 100.0), 1)


def get_tasks_sortiert(projekt_id=None, status=None, aufwandsklasse=None,
                       warten_auf_person=None) -> list:
    """
    Lädt Tasks und sortiert nach Dringlichkeits-Score (absteigend).
    Drop-in-Ersatz für get_tasks() überall wo Sortierung wichtig ist.
    """
    tasks = get_tasks(projekt_id=projekt_id, status=status,
                      aufwandsklasse=aufwandsklasse,
                      warten_auf_person=warten_auf_person)
    for t in tasks:
        t["_score"] = berechne_dringlichkeit(t)
    tasks.sort(key=lambda t: -t["_score"])
    return tasks


# ═══════════════════════════════════════════════════════════════════════════════
# ZEITERFASSUNG – Ist-Aufwand vs. Plan-Aufwand
# ═══════════════════════════════════════════════════════════════════════════════

def starte_zeiterfassung(task_id: int, projekt_id: int = None, user_id=None, rolle: str = None) -> int:
    """Startet Zeiterfassung für einen Task. Gibt Buchungs-ID zurück.
    user_id/rolle (Phase K): wer bucht in welcher Einsatzrolle - Grundlage
    für die Ist-Kosten-Berechnung (Zeiten x Rollen-Stundensatz)."""
    with db_cursor() as (conn, cursor):
        cursor.execute(
            "INSERT INTO Zeitbuchungen (task_id, projekt_id, user_id, rolle) VALUES (%s,%s,%s,%s) RETURNING id",
            (task_id, projekt_id, user_id, rolle)
        )
        return cursor.fetchone()[0]


def erfasse_zeitbuchung_manuell(projekt_id: int, user_id, rolle: str, dauer_min: int,
                                notiz: str, task_id: int = None, datum=None) -> int:
    """Manuelle/rueckwirkende Zeitbuchung - im Unterschied zu starte_/stoppe_
    zeiterfassung kein Live-Timer, sondern direkte Erfassung im Nachhinein.
    Deckt Faelle ab, die der Live-Timer nicht abbildet: Meetings inkl.
    Vor-/Nachbereitung ohne zugehörigen Kanban-Task (task_id bleibt dann
    NULL - Spalte ist bewusst nullable), sowie Zeiten, die man fuer eine
    andere Person (Kolleg:in) nachtraegt (user_id ist frei waehlbar, nicht
    an den eingeloggten Nutzer gebunden). datum: Tag der Leistung, Default heute."""
    tag = datum or _now()
    if isinstance(tag, str):
        from datetime import datetime as _dt
        tag = _dt.fromisoformat(tag)
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO Zeitbuchungen (task_id, projekt_id, gestartet, gestoppt, dauer_min, notiz, user_id, rolle)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id
        """, (task_id, projekt_id, tag, tag, dauer_min, notiz, user_id, rolle))
        return cursor.fetchone()[0]


def stoppe_zeiterfassung(buchung_id: int, notiz: str = "") -> int:
    """Stoppt Zeiterfassung, berechnet Dauer in Minuten. Gibt Dauer zurück."""
    from datetime import datetime
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT gestartet FROM Zeitbuchungen WHERE id=%s", (buchung_id,))
        row = cursor.fetchone()
        if not row:
            return 0
        try:
            start = datetime.fromisoformat(str(row[0]))
            dauer_min = max(1, int((_now() - start).total_seconds() / 60))
        except Exception:
            dauer_min = 0
        cursor.execute(
            "UPDATE Zeitbuchungen SET gestoppt=%s, dauer_min=%s, notiz=%s WHERE id=%s",
            (_now(), dauer_min, notiz, buchung_id)
        )
        return dauer_min


def get_zeitbuchungen(task_id: int = None, projekt_id: int = None,
                      tage: int = 30) -> list:
    """Lädt Zeitbuchungen der letzten N Tage."""
    with db_cursor() as (conn, cursor):
        q = """
            SELECT z.*, t.titel AS task_titel, p.name AS projekt_name, u.display_name AS user_name
            FROM Zeitbuchungen z
            LEFT JOIN Tasks t ON z.task_id = t.id
            LEFT JOIN Projekte p ON z.projekt_id = p.id
            LEFT JOIN users u ON z.user_id = u.id
            WHERE z.gestoppt IS NOT NULL
        """
        params = []
        if task_id:
            q += " AND z.task_id=%s"
            params.append(task_id)
        if projekt_id:
            q += " AND z.projekt_id=%s"
            params.append(projekt_id)
        q += " ORDER BY z.gestartet DESC"
        cursor.execute(q, tuple(params))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def get_zeitstatistik(projekt_id: int = None) -> dict:
    """Berechnet Ist-Aufwand je Projekt und Aufwandsklassen-Vergleich."""
    with db_cursor() as (conn, cursor):
        q = """
            SELECT p.name AS projekt_name,
                   SUM(z.dauer_min) AS gesamt_min,
                   COUNT(z.id) AS buchungen
            FROM Zeitbuchungen z
            LEFT JOIN Projekte p ON z.projekt_id = p.id
            WHERE z.gestoppt IS NOT NULL
        """
        params = []
        if projekt_id:
            q += " AND z.projekt_id=%s"
            params.append(projekt_id)
        q += " GROUP BY p.name ORDER BY gesamt_min DESC"
        cursor.execute(q, tuple(params))
        cols = [d[0] for d in cursor.description]
        projekte = [dict(zip(cols, row)) for row in cursor.fetchall()]

        # Plan vs. Ist je Aufwandsklasse
        cursor.execute("""
            SELECT t.aufwandsklasse,
                   COUNT(DISTINCT t.id) AS anzahl,
                   COALESCE(SUM(z.dauer_min), 0) AS ist_min
            FROM Tasks t
            LEFT JOIN Zeitbuchungen z ON t.id = z.task_id AND z.gestoppt IS NOT NULL
            GROUP BY t.aufwandsklasse
        """)
        cols2 = [d[0] for d in cursor.description]
        aufwand_stats = [dict(zip(cols2, row)) for row in cursor.fetchall()]

        # Plan-Minuten je Klasse
        plan_map = {"2m": 2, "15m": 15, "2h": 120, "4h+": 240}
        for a in aufwand_stats:
            plan_min = plan_map.get(a["aufwandsklasse"], 15) * (a["anzahl"] or 1)
            a["plan_min"] = plan_min
            a["abweichung_pct"] = round((a["ist_min"] - plan_min) / plan_min * 100, 1) if plan_min > 0 else 0

        return {"projekte": projekte, "aufwand_stats": aufwand_stats}


# ═══════════════════════════════════════════════════════════════════════════════
# KOSTENCONTROLLING (Phase K Slice 1) - Rollen-Stundensaetze + Budgetueberwachung
# ═══════════════════════════════════════════════════════════════════════════════

def get_rollensaetze(company_id=None) -> list:
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT id, rolle, stundensatz, company_id
            FROM mitarbeiter_rollensaetze
            ORDER BY rolle
        """)
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def upsert_rollensatz(rolle: str, stundensatz, company_id=None):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            UPDATE mitarbeiter_rollensaetze SET stundensatz=%s
            WHERE rolle=%s AND company_id IS NOT DISTINCT FROM %s
        """, (stundensatz, rolle, company_id))
        if cursor.rowcount == 0:
            cursor.execute("""
                INSERT INTO mitarbeiter_rollensaetze (rolle, stundensatz, company_id)
                VALUES (%s,%s,%s)
            """, (rolle, stundensatz, company_id))


def get_projekt_budget_status(projekt_id: int) -> dict:
    """Plan-Budget (projekte.budget_cap) vs. Ist-Kosten aus Zeitbuchungen x
    Rollen-Stundensatz. Buchungen ohne Rolle oder ohne konfigurierten
    Stundensatz werden separat als 'unbewertete' Minuten ausgewiesen statt
    faelschlich mit 0 EUR in die Ist-Kosten einzufliessen."""
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT budget_cap FROM projekte WHERE id=%s", (projekt_id,))
        row = cursor.fetchone()
        budget_cap = float(row[0]) if row and row[0] is not None else None

        cursor.execute("""
            SELECT z.rolle, r.stundensatz, SUM(z.dauer_min) AS min_gesamt
            FROM zeitbuchungen z
            LEFT JOIN mitarbeiter_rollensaetze r ON r.rolle = z.rolle
            WHERE z.projekt_id=%s AND z.gestoppt IS NOT NULL
            GROUP BY z.rolle, r.stundensatz
        """, (projekt_id,))

        ist_kosten = 0.0
        ist_minuten_bewertet = 0
        ist_minuten_unbewertet = 0
        rollen = []
        for rolle, stundensatz, min_gesamt in cursor.fetchall():
            min_gesamt = min_gesamt or 0
            if stundensatz is not None:
                kosten = round(min_gesamt / 60 * float(stundensatz), 2)
                ist_kosten += kosten
                ist_minuten_bewertet += min_gesamt
            else:
                kosten = None
                ist_minuten_unbewertet += min_gesamt
            rollen.append({
                "rolle": rolle or "– keine Rolle –",
                "stundensatz": float(stundensatz) if stundensatz is not None else None,
                "minuten": min_gesamt,
                "kosten": kosten,
            })

        beleg_summe = get_belege_summe(projekt_id)["gesamt"]
        gesamt_ist = round(ist_kosten + beleg_summe, 2)

        return {
            "budget_cap": budget_cap,
            "ist_kosten": round(ist_kosten, 2),
            "ist_kosten_belege": beleg_summe,
            "ist_kosten_gesamt": gesamt_ist,
            "ist_minuten_bewertet": ist_minuten_bewertet,
            "ist_minuten_unbewertet": ist_minuten_unbewertet,
            "auslastung_pct": round(gesamt_ist / budget_cap * 100, 1) if budget_cap else None,
            "rollen": rollen,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# BELEGVERWALTUNG (Phase K Slice 2) - Rechnungen/Belege projektbezogen
# ═══════════════════════════════════════════════════════════════════════════════

BELEG_KATEGORIEN = ["Material", "Dienstleistung", "Bewirtung", "Kilometer", "Hotel", "Sonstiges"]


def create_beleg(projekt_id: int, user_id, kategorie: str, betrag, beschreibung: str = None,
                 beleg_datum=None, dateiname: str = None, dateiinhalt: bytes = None,
                 mimetype: str = None, company_id=None) -> int:
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO belege (projekt_id, user_id, kategorie, beschreibung, betrag,
                beleg_datum, dateiname, dateiinhalt, mimetype, company_id)
            VALUES (%s,%s,%s,%s,%s, COALESCE(%s, CURRENT_DATE), %s,%s,%s,%s)
            RETURNING id
        """, (projekt_id, user_id, kategorie, beschreibung, betrag,
              beleg_datum, dateiname, dateiinhalt, mimetype,
              company_id or _default_company_id()))
        return cursor.fetchone()[0]


def get_belege(projekt_id: int = None, user_id=None, status: str = None) -> list:
    """Metadaten ohne dateiinhalt (BYTEA) - fuer Listen-Ansichten, spart
    Bandbreite. Fuer den Download siehe get_beleg(beleg_id)."""
    with db_cursor() as (conn, cursor):
        q = """
            SELECT b.id, b.projekt_id, b.user_id, b.kategorie, b.beschreibung, b.betrag,
                   b.beleg_datum, b.dateiname, b.mimetype, b.status, b.erstellt_am,
                   u.display_name AS user_name, p.name AS projekt_name
            FROM belege b
            LEFT JOIN users u ON u.id = b.user_id
            LEFT JOIN projekte p ON p.id = b.projekt_id
            WHERE 1=1
        """
        params = []
        if projekt_id:
            q += " AND b.projekt_id=%s"; params.append(projekt_id)
        if user_id:
            q += " AND b.user_id=%s"; params.append(user_id)
        if status:
            q += " AND b.status=%s"; params.append(status)
        q += " ORDER BY b.beleg_datum DESC, b.id DESC"
        cursor.execute(q, tuple(params))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def get_beleg(beleg_id: int) -> dict | None:
    """Inklusive dateiinhalt - fuer den Download-Button."""
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT * FROM belege WHERE id=%s", (beleg_id,))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        return dict(zip(cols, row)) if row else None


def update_beleg_status(beleg_id: int, status: str):
    with db_cursor() as (_, cursor):
        cursor.execute("UPDATE belege SET status=%s WHERE id=%s", (status, beleg_id))


def delete_beleg(beleg_id: int):
    with db_cursor() as (_, cursor):
        cursor.execute("DELETE FROM belege WHERE id=%s", (beleg_id,))


def get_belege_summe(projekt_id: int) -> dict:
    """Summe aller Belege je Projekt, aufgeschluesselt nach Kategorie -
    fliesst in get_projekt_budget_status() als Sachkosten-Anteil der
    Ist-Kosten ein (neben den Zeitkosten aus Slice 1)."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT kategorie, SUM(betrag) AS summe, COUNT(*) AS anzahl
            FROM belege WHERE projekt_id=%s
            GROUP BY kategorie ORDER BY summe DESC
        """, (projekt_id,))
        cols = [d[0] for d in cursor.description]
        je_kategorie = [dict(zip(cols, row)) for row in cursor.fetchall()]
        gesamt = round(sum(float(k["summe"]) for k in je_kategorie), 2) if je_kategorie else 0.0
        for k in je_kategorie:
            k["summe"] = float(k["summe"])
        return {"gesamt": gesamt, "je_kategorie": je_kategorie}


# ═══════════════════════════════════════════════════════════════════════════════
# WIEDERKEHRENDE TASKS
# ═══════════════════════════════════════════════════════════════════════════════

def setze_wiederkehrend(task_id: int, intervall: str):
    """
    intervall: taeglich | woechentlich | monatlich | None (deaktivieren)
    """
    from datetime import date, timedelta
    naechste = None
    if intervall:
        heute = date.today()
        if intervall == "taeglich":
            naechste = (heute + timedelta(days=1)).isoformat()
        elif intervall == "woechentlich":
            naechste = (heute + timedelta(weeks=1)).isoformat()
        elif intervall == "monatlich":
            monat = heute.month + 1 if heute.month < 12 else 1
            jahr  = heute.year if heute.month < 12 else heute.year + 1
            naechste = heute.replace(year=jahr, month=monat).isoformat()
    update_task(task_id, wiederkehrend=intervall, naechste_faelligkeit=naechste)


def verarbeite_wiederkehrende_tasks():
    """
    Prüft erledigte wiederkehrende Tasks und legt automatisch den nächsten an.
    Wird beim App-Start aufgerufen.
    Gibt Liste neu angelegter Task-IDs zurück.
    """
    from datetime import date, timedelta
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT * FROM Tasks
            WHERE wiederkehrend IS NOT NULL
              AND status = 'Erledigt'
              AND naechste_faelligkeit IS NOT NULL
        """)
        cols = [d[0] for d in cursor.description]
        faellige = [dict(zip(cols, row)) for row in cursor.fetchall()]

    heute = date.today()
    neue_ids = []
    for t in faellige:
        try:
            naechste = date.fromisoformat(str(t["naechste_faelligkeit"]))
            if naechste <= heute:
                # Neuen Task anlegen
                new_id = create_task(
                    projekt_id=t["projekt_id"],
                    titel=t["titel"],
                    beschreibung=(t.get("beschreibung") or ""),
                    aufwandsklasse=t["aufwandsklasse"],
                    prioritaet=t["prioritaet"],
                    kritischer_pfad=bool(t.get("kritischer_pfad")),
                    faellig_am=naechste.isoformat(),
                )
                # Wiederkehrend-Einstellung übertragen
                setze_wiederkehrend(new_id, t["wiederkehrend"])
                neue_ids.append(new_id)
        except Exception:
            pass
    return neue_ids


# ═══════════════════════════════════════════════════════════════════════════════
# MEILENSTEINE – CRUD
# ═══════════════════════════════════════════════════════════════════════════════

def get_meilensteine(projekt_id: int, parent_id=None, alle: bool = False) -> list:
    """
    Lädt Meilensteine eines Projekts.
    parent_id=None → nur Top-Level (direkt unter Projekt)
    parent_id=X    → Untermeilensteine von X
    alle=True      → alle Ebenen flach
    """
    with db_cursor() as (conn, cursor):
        if alle:
            q = """SELECT m.*,
                          (SELECT COUNT(*) FROM Tasks t WHERE t.meilenstein_id = m.id) AS task_count,
                          (SELECT COUNT(*) FROM Meilensteine s WHERE s.parent_id = m.id) AS sub_count
                   FROM Meilensteine m
                   WHERE m.projekt_id = %s
                   ORDER BY m.reihenfolge, m.erstellt_am"""
            cursor.execute(q, (projekt_id,))
        elif parent_id is None:
            q = """SELECT m.*,
                          (SELECT COUNT(*) FROM Tasks t WHERE t.meilenstein_id = m.id) AS task_count,
                          (SELECT COUNT(*) FROM Meilensteine s WHERE s.parent_id = m.id) AS sub_count
                   FROM Meilensteine m
                   WHERE m.projekt_id = %s AND m.parent_id IS NULL
                   ORDER BY m.reihenfolge, m.erstellt_am"""
            cursor.execute(q, (projekt_id,))
        else:
            q = """SELECT m.*,
                          (SELECT COUNT(*) FROM Tasks t WHERE t.meilenstein_id = m.id) AS task_count,
                          (SELECT COUNT(*) FROM Meilensteine s WHERE s.parent_id = m.id) AS sub_count
                   FROM Meilensteine m
                   WHERE m.projekt_id = %s AND m.parent_id = %s
                   ORDER BY m.reihenfolge, m.erstellt_am"""
            cursor.execute(q, (projekt_id, parent_id))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def get_meilenstein(meilenstein_id: int) -> dict | None:
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT * FROM Meilensteine WHERE id = %s", (meilenstein_id,))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        return dict(zip(cols, row)) if row else None


def create_meilenstein(projekt_id: int, titel: str, parent_id=None,
                       beschreibung: str = "", start_datum=None,
                       end_datum=None, reihenfolge: int = 0,
                       ist_quality_gate: bool = False, typ: str = "phase",
                       company_id=None) -> int:
    with db_cursor() as (conn, cursor):
        cursor.execute("""INSERT INTO Meilensteine
            (projekt_id, parent_id, titel, beschreibung, start_datum, end_datum, reihenfolge,
             ist_quality_gate, typ, company_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id""",
            (projekt_id, parent_id, titel, beschreibung, start_datum, end_datum, reihenfolge,
             bool(ist_quality_gate), typ, company_id or _default_company_id()))
        return cursor.fetchone()[0]


def get_sprints(projekt_id: int) -> list:
    """Alle Meilensteine mit typ='sprint', unabhaengig von Parent-Ebene
    (bei Hybrid haengen Sprints unter einer Umsetzungsphase) - fuer das
    Scrum-Board (Phase F)."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT m.*, (SELECT COUNT(*) FROM Tasks t WHERE t.meilenstein_id = m.id) AS task_count
            FROM Meilensteine m
            WHERE m.projekt_id = %s AND m.typ = 'sprint'
            ORDER BY m.start_datum NULLS LAST, m.reihenfolge, m.erstellt_am
        """, (projekt_id,))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def update_meilenstein(meilenstein_id: int, **kwargs):
    if not kwargs:
        return
    fields = ", ".join(f"{k}=%s" for k in kwargs)
    values = tuple(kwargs.values()) + (meilenstein_id,)
    with db_cursor() as (_, cursor):
        cursor.execute(f"UPDATE Meilensteine SET {fields} WHERE id=%s", values)


def delete_meilenstein(meilenstein_id: int):
    with db_cursor() as (_, cursor):
        cursor.execute("DELETE FROM Meilensteine WHERE id=%s", (meilenstein_id,))


def get_tasks_fuer_meilenstein(meilenstein_id: int) -> list:
    """Alle Tasks die direkt einem Meilenstein zugeordnet sind."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT t.*, p.name AS projekt_name, p.farbe AS projekt_farbe,
                   COALESCE(wu.display_name, t.warten_auf_person_legacy) AS warten_auf_person
            FROM Tasks t
            LEFT JOIN Projekte p ON t.projekt_id = p.id
            LEFT JOIN users wu ON wu.id = t.warten_auf_user_id
            WHERE t.meilenstein_id = %s
            ORDER BY t.prioritaet, t.erstellt_am
        """, (meilenstein_id,))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def get_meilenstein_fortschritt(meilenstein_id: int) -> dict:
    """Berechnet Fortschritt eines Meilensteins inkl. Untermeilensteine."""
    tasks = get_tasks_fuer_meilenstein(meilenstein_id)
    sub = get_meilensteine(0, parent_id=meilenstein_id, alle=False)
    # Rekursiv Sub-Tasks holen
    alle_tasks = list(tasks)
    for s in sub:
        alle_tasks.extend(get_tasks_fuer_meilenstein(s["id"]))

    gesamt = len(alle_tasks)
    done   = sum(1 for t in alle_tasks if t.get("status") == "Erledigt")
    pct    = int(done / gesamt * 100) if gesamt > 0 else 0
    return {"gesamt": gesamt, "done": done, "pct": pct}


# ── AD-Import (Active Directory) ──────────────────────────────────────────────

def import_ad_kontakte(server: str = None, base_dn: str = None) -> list:
    """
    Importiert Kontakte aus Active Directory.
    Benötigt: pip install ldap3
    Gibt Liste von Dicts zurück: {name, email, rolle, firma}
    """
    try:
        from ldap3 import Server as LServer, Connection, ALL, SUBTREE
    except ImportError:
        raise RuntimeError("pip install ldap3")

    srv = LServer(server or "ldap://localhost", get_info=ALL)
    conn = Connection(srv, auto_bind=True)  # Windows Auth (Kerberos)

    conn.search(
        search_base=base_dn or "dc=ejot,dc=de",
        search_filter="(&(objectClass=person)(mail=*))",
        search_scope=SUBTREE,
        attributes=["cn","mail","title","department","company"]
    )

    kontakte = []
    for entry in conn.entries:
        kontakte.append({
            "name":  str(entry.cn) if entry.cn else "",
            "email": str(entry.mail) if entry.mail else "",
            "rolle": str(entry.title) if entry.title else "",
            "firma": str(entry.department) if entry.department else "",
        })
    return kontakte


def bulk_import_stakeholder(kontakte: list) -> int:
    """Importiert Liste von Kontakten in Stakeholder-Tabelle (überspringt Duplikate)."""
    imported = 0
    existing = {s["name"] for s in get_stakeholder()}
    for k in kontakte:
        if k["name"] and k["name"] not in existing:
            create_stakeholder(k["name"], k.get("email",""),
                               k.get("rolle",""), k.get("firma",""))
            existing.add(k["name"])
            imported += 1
    return imported


# ═══════════════════════════════════════════════════════════════════════════════
# PROJEKTANTRAEGE (Phase B - Ideen-/Projekt-Intake, zusaetzlich zum direkten
# Anlegen von Projekten, nicht als Ersatz dafuer)
# ═══════════════════════════════════════════════════════════════════════════════

def create_projektantrag(titel, beschreibung, eingereicht_von, company_id=None):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO projektantraege (titel, beschreibung, eingereicht_von, company_id)
            VALUES (%s,%s,%s,%s)
            RETURNING id
        """, (titel, beschreibung, eingereicht_von, company_id or _default_company_id()))
        return cursor.fetchone()[0]


def get_projektantraege(status=None, eingereicht_von=None):
    with db_cursor() as (conn, cursor):
        q = """
            SELECT a.*, eu.display_name AS eingereicht_von_name,
                   du.display_name AS entschieden_von_name,
                   p.name AS projekt_name
            FROM projektantraege a
            LEFT JOIN users eu ON eu.id = a.eingereicht_von
            LEFT JOIN users du ON du.id = a.entschieden_von
            LEFT JOIN projekte p ON p.id = a.projekt_id
            WHERE 1=1
        """
        params = []
        if status:
            if isinstance(status, list):
                q += f" AND a.status IN ({','.join(['%s']*len(status))})"
                params.extend(status)
            else:
                q += " AND a.status=%s"
                params.append(status)
        if eingereicht_von:
            q += " AND a.eingereicht_von=%s"
            params.append(eingereicht_von)
        q += " ORDER BY a.erstellt_am DESC"
        cursor.execute(q, tuple(params))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def get_projektantrag(antrag_id):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT a.*, eu.display_name AS eingereicht_von_name,
                   du.display_name AS entschieden_von_name,
                   p.name AS projekt_name
            FROM projektantraege a
            LEFT JOIN users eu ON eu.id = a.eingereicht_von
            LEFT JOIN users du ON du.id = a.entschieden_von
            LEFT JOIN projekte p ON p.id = a.projekt_id
            WHERE a.id=%s
        """, (antrag_id,))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        return dict(zip(cols, row)) if row else None


def entscheide_projektantrag(antrag_id, status, entschieden_von, kommentar=None, projekt_id=None):
    """status: Abgelehnt | Wartend | Archiviert | Genehmigt.
    Bei Genehmigt sollte projekt_id auf das neu angelegte (oder verknuepfte)
    Projekt zeigen - Projekt-Anlage selbst passiert im Aufrufer (Page-Ebene),
    damit hier keine impliziten Seiteneffekte auf das Projekt-Modell passieren."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            UPDATE projektantraege
            SET status=%s, entschieden_von=%s, entschieden_am=%s,
                entscheidung_kommentar=%s, projekt_id=COALESCE(%s, projekt_id)
            WHERE id=%s
        """, (status, entschieden_von, _now(), kommentar, projekt_id, antrag_id))


# ═══════════════════════════════════════════════════════════════════════════════
# PROJEKT-RESSOURCEN (Prozent-Zuteilung, fuer ALLE Projekte - GF-zugewiesen
# oder selbst gewaehlt - immer vom betroffenen Nutzer selbst editierbar)
# ═══════════════════════════════════════════════════════════════════════════════

def get_projekt_ressourcen(projekt_id=None, user_id=None):
    with db_cursor() as (conn, cursor):
        q = """
            SELECT r.*, u.display_name AS user_name, u.hat_login, p.name AS projekt_name
            FROM projekt_ressourcen r
            LEFT JOIN users u ON u.id = r.user_id
            LEFT JOIN projekte p ON p.id = r.projekt_id
            WHERE 1=1
        """
        params = []
        if projekt_id:
            q += " AND r.projekt_id=%s"
            params.append(projekt_id)
        if user_id:
            q += " AND r.user_id=%s"
            params.append(user_id)
        q += " ORDER BY p.name, u.display_name"
        cursor.execute(q, tuple(params))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def set_projekt_ressource(projekt_id, user_id, anteil_pct, quelle="selbst_gewaehlt", rolle=None):
    """Upsert: legt an oder aktualisiert den Anteil einer Person an einem
    Projekt. quelle bleibt 'gf_zugewiesen', wenn es das bereits war, ausser
    explizit anders gesetzt - der Anteil selbst ist immer editierbar. rolle
    bleibt unveraendert, wenn nicht explizit uebergeben (COALESCE), da sie
    typischerweise ueber die ganze Projektlaufzeit stabil ist."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO projekt_ressourcen (projekt_id, user_id, anteil_pct, quelle, rolle, geaendert_am)
            VALUES (%s,%s,%s,%s,%s,%s)
            ON CONFLICT (projekt_id, user_id)
            DO UPDATE SET anteil_pct=EXCLUDED.anteil_pct, geaendert_am=EXCLUDED.geaendert_am,
                          rolle=COALESCE(EXCLUDED.rolle, projekt_ressourcen.rolle)
        """, (projekt_id, user_id, anteil_pct, quelle, rolle, _now()))


def get_rolle_fuer_person_projekt(projekt_id, user_id):
    """Zuletzt gespeicherte Einsatzrolle dieser Person in diesem Projekt, um
    sie in der Zeiterfassung vorzubelegen (Rolle bleibt meist ueber die
    gesamte Projektlaufzeit stabil, z.B. 'Manuel Jung ist Programmierer')."""
    with db_cursor() as (conn, cursor):
        cursor.execute(
            "SELECT rolle FROM projekt_ressourcen WHERE projekt_id=%s AND user_id=%s",
            (projekt_id, user_id)
        )
        row = cursor.fetchone()
        return row[0] if row else None


def get_gesamtauslastung(user_id):
    """Summe aller anteil_pct eines Nutzers ueber alle (nicht archivierten)
    Projekte - fuer die 100%-Deckel-Warnung."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT COALESCE(SUM(r.anteil_pct), 0)
            FROM projekt_ressourcen r
            JOIN projekte p ON p.id = r.projekt_id
            WHERE r.user_id=%s AND p.status != 'Archiv'
        """, (user_id,))
        return float(cursor.fetchone()[0])


# ═══════════════════════════════════════════════════════════════════════════════
# PROJEKT-INITIALISIERUNG (Phase C - Straubel-Vorgehen: Ziele/Erfolgskriterien
# -> kritische Erfolgsfaktoren -> Lessons Learned -> Projektart/Komplexitaet ->
# Vorgehensmodell -> Projektdesign -> kontinuierliches Fortschreiben)
# ═══════════════════════════════════════════════════════════════════════════════

def get_projekt_initialisierung(projekt_id):
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT * FROM projekt_initialisierung WHERE projekt_id=%s", (projekt_id,))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        return dict(zip(cols, row)) if row else None


def upsert_projekt_initialisierung(projekt_id, company_id=None, **kwargs):
    """Legt an oder aktualisiert die Initialisierungs-Daten eines Projekts.
    Kontinuierlich wiederholbar (C.7) - kein Einmal-Wizard, jeder Aufruf
    ueberschreibt nur die uebergebenen Felder plus aktualisiert_am."""
    kwargs["aktualisiert_am"] = _now()
    kwargs["company_id"] = company_id or _default_company_id()
    cols = ["projekt_id"] + list(kwargs.keys())
    vals = [projekt_id] + list(kwargs.values())
    placeholders = ",".join(["%s"] * len(cols))
    update_clause = ", ".join(f"{k}=EXCLUDED.{k}" for k in kwargs)
    with db_cursor() as (conn, cursor):
        cursor.execute(f"""
            INSERT INTO projekt_initialisierung ({",".join(cols)})
            VALUES ({placeholders})
            ON CONFLICT (projekt_id) DO UPDATE SET {update_clause}
        """, vals)


def berechne_einstufung(reichweite_mehrere_fb=False, ressourcenbindung_pct=0,
                        budget_teur=0, dauer_wochen=0, strategische_prio=1,
                        abhaengigkeiten=False, komplexitaet="gering",
                        risikoklasse="A") -> str:
    """
    Ordnet ein Vorhaben nach dem Straubel-Kriterienkatalog ein
    (ASTA -> Massnahme -> EPM). Regel: ein erfuellter Grenzwert eines
    Kriteriums genuegt fuer die Einstufung in die naechsthoehere Organisations-
    form (siehe 08-MPM-Ermittlung Einstufung Priorisierung Vorhaben).
    Programm/PRM wird hier bewusst nicht automatisch vergeben - das ist eine
    zusaetzliche strategische GF-Entscheidung oberhalb der reinen Kriterien.
    """
    stufe = 0  # 0=ASTA, 1=Massnahme, 2=EPM

    if reichweite_mehrere_fb or abhaengigkeiten:
        stufe = max(stufe, 2)
    if ressourcenbindung_pct >= 20:
        stufe = max(stufe, 2)
    elif ressourcenbindung_pct >= 10:
        stufe = max(stufe, 1)
    if budget_teur >= 10:
        stufe = max(stufe, 2)
    elif budget_teur >= 5:
        stufe = max(stufe, 1)
    if dauer_wochen >= 4:
        stufe = max(stufe, 2)
    elif dauer_wochen >= 2:
        stufe = max(stufe, 1)
    if strategische_prio > 6:
        stufe = max(stufe, 2)
    elif strategische_prio > 1:
        stufe = max(stufe, 1)
    if komplexitaet in ("Problem", "komplexes Problem"):
        stufe = max(stufe, 2)
    elif komplexitaet == "Aufgabe":
        stufe = max(stufe, 1)
    if risikoklasse == "C":
        stufe = max(stufe, 2)
    elif risikoklasse == "B":
        stufe = max(stufe, 1)

    return {0: "ASTA", 1: "Massnahme", 2: "EPM"}[stufe]


def empfehle_vorgehensmodell(anforderungsklarheit: str, loesungsklarheit: str) -> str:
    """
    Stacy-Matrix-basierte Empfehlung: Anforderungsklarheit x Loesungs-
    /Technologieklarheit, jeweils 'klar' | 'unklar'.
    klar/klar        -> nahe Uebereinstimmung/Sicherheit -> Wasserfall
    klar/unklar      -> Loesung unklar, Ziel klar         -> V-Modell (Prototyping)
    unklar/klar      -> Ziel unklar, Loesung/Technik klar -> Inkrementell
    unklar/unklar    -> komplex/chaotisch                 -> Scrum
    """
    if anforderungsklarheit == "klar" and loesungsklarheit == "klar":
        return "Wasserfall"
    if anforderungsklarheit == "klar" and loesungsklarheit == "unklar":
        return "V-Modell"
    if anforderungsklarheit == "unklar" and loesungsklarheit == "klar":
        return "Inkrementell"
    return "Scrum"


def get_alte_projekte_fuer_lessons_learned(exclude_projekt_id=None):
    """Abgeschlossene/pausierte/abgebrochene Alt-Projekte als Grundlage fuer
    C.3 Lessons Learned - inkl. Abschlussbewertung (erfolgreich/gescheitert)."""
    with db_cursor() as (conn, cursor):
        q = """
            SELECT id, name, status, abschluss_ergebnis, beschreibung, kostenstelle
            FROM Projekte
            WHERE status IN ('Beendet', 'Abgebrochen', 'Unterbrochen')
        """
        params = []
        if exclude_projekt_id:
            q += " AND id != %s"
            params.append(exclude_projekt_id)
        q += " ORDER BY geaendert_am DESC"
        cursor.execute(q, tuple(params))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


# ═══════════════════════════════════════════════════════════════════════════════
# RISIKOREGISTER (Phase D - EW x TW = Risikopriotitaet, Massnahmenklasse,
# Restrisiko nach Massnahme)
# ═══════════════════════════════════════════════════════════════════════════════

def create_risiko(projekt_id, beschreibung, kategorie=None,
                  eintrittswahrscheinlichkeit=1, tragweite=1,
                  massnahmenklasse=None, massnahme=None, massnahme_kosten=None,
                  company_id=None):
    risikoprioritaet = eintrittswahrscheinlichkeit * tragweite
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO risiken (projekt_id, beschreibung, kategorie,
                eintrittswahrscheinlichkeit, tragweite, risikoprioritaet,
                massnahmenklasse, massnahme, massnahme_kosten, company_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (projekt_id, beschreibung, kategorie, eintrittswahrscheinlichkeit,
              tragweite, risikoprioritaet, massnahmenklasse, massnahme,
              massnahme_kosten, company_id or _default_company_id()))
        return cursor.fetchone()[0]


def get_risiken(projekt_id):
    """Sortiert nach Risikopriotitaet absteigend (Rangfolge)."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT * FROM risiken WHERE projekt_id=%s
            ORDER BY risikoprioritaet DESC NULLS LAST, erstellt_am DESC
        """, (projekt_id,))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def update_risiko(risiko_id, beschreibung, kategorie, eintrittswahrscheinlichkeit,
                  tragweite, massnahmenklasse, massnahme, massnahme_kosten,
                  ew_nach_massnahme=None, tw_nach_massnahme=None, status="Offen"):
    """Nimmt bewusst den vollstaendigen Datensatz entgegen (Formular-basierte
    UI) statt **kwargs, damit Risikopriotitaet/Restrisiko konsistent aus
    genau den Werten neu berechnet werden, die gerade gespeichert werden."""
    risikoprioritaet = eintrittswahrscheinlichkeit * tragweite
    restrisiko = (ew_nach_massnahme * tw_nach_massnahme
                  if ew_nach_massnahme and tw_nach_massnahme else None)
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            UPDATE risiken SET beschreibung=%s, kategorie=%s,
                eintrittswahrscheinlichkeit=%s, tragweite=%s, risikoprioritaet=%s,
                massnahmenklasse=%s, massnahme=%s, massnahme_kosten=%s,
                ew_nach_massnahme=%s, tw_nach_massnahme=%s, restrisiko=%s,
                status=%s, geaendert_am=%s
            WHERE id=%s
        """, (beschreibung, kategorie, eintrittswahrscheinlichkeit, tragweite,
              risikoprioritaet, massnahmenklasse, massnahme, massnahme_kosten,
              ew_nach_massnahme, tw_nach_massnahme, restrisiko, status,
              _now(), risiko_id))


def delete_risiko(risiko_id):
    with db_cursor() as (_, cursor):
        cursor.execute("DELETE FROM risiken WHERE id=%s", (risiko_id,))


# ═══════════════════════════════════════════════════════════════════════════════
# RACI / AKV-MATRIX (Phase D - Arbeitspaket x Person x Rolle)
# ═══════════════════════════════════════════════════════════════════════════════

def set_raci_eintrag(projekt_id, arbeitspaket, user_id, rolle, company_id=None):
    """Upsert: eine Person hat genau eine Rolle je Arbeitspaket."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO raci_eintraege (projekt_id, arbeitspaket, user_id, rolle, company_id)
            VALUES (%s,%s,%s,%s,%s)
            ON CONFLICT (projekt_id, arbeitspaket, user_id)
            DO UPDATE SET rolle=EXCLUDED.rolle
        """, (projekt_id, arbeitspaket, user_id, rolle, company_id or _default_company_id()))


def get_raci_matrix(projekt_id):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT r.*, u.display_name AS user_name
            FROM raci_eintraege r
            JOIN users u ON u.id = r.user_id
            WHERE r.projekt_id=%s
            ORDER BY r.arbeitspaket, u.display_name
        """, (projekt_id,))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def delete_raci_eintrag(raci_id):
    with db_cursor() as (_, cursor):
        cursor.execute("DELETE FROM raci_eintraege WHERE id=%s", (raci_id,))


def get_akv_eintraege(projekt_id):
    """AKV (Aufgaben/Kompetenzen/Verantwortung) ist eigenstaendig manuell
    gepflegt, keine Ableitung aus der RACI-Matrix."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT a.*, u.display_name AS user_name
            FROM akv_eintraege a
            JOIN users u ON u.id = a.user_id
            WHERE a.projekt_id=%s
            ORDER BY u.display_name
        """, (projekt_id,))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def upsert_akv_eintrag(projekt_id, user_id, aufgaben=None, kompetenzen=None, verantwortung=None):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO akv_eintraege (projekt_id, user_id, aufgaben, kompetenzen, verantwortung, geaendert_am)
            VALUES (%s,%s,%s,%s,%s,%s)
            ON CONFLICT (projekt_id, user_id)
            DO UPDATE SET aufgaben=EXCLUDED.aufgaben, kompetenzen=EXCLUDED.kompetenzen,
                          verantwortung=EXCLUDED.verantwortung, geaendert_am=EXCLUDED.geaendert_am
        """, (projekt_id, user_id, aufgaben, kompetenzen, verantwortung, _now()))


# ═══════════════════════════════════════════════════════════════════════════════
# DOKUMENTE (Phase E - Lastenheft/Pflichtenheft als KI-Entwurf, editierbar,
# kein Einmal-Wizard - genau wie projekt_initialisierung kontinuierlich
# fortschreibbar)
# ═══════════════════════════════════════════════════════════════════════════════

def get_projekt_dokument(projekt_id, typ):
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT * FROM projekt_dokumente WHERE projekt_id=%s AND typ=%s", (projekt_id, typ))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        return dict(zip(cols, row)) if row else None


def upsert_projekt_dokument(projekt_id, typ, inhalt, status="entwurf", company_id=None):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO projekt_dokumente (projekt_id, typ, inhalt, status, company_id, aktualisiert_am)
            VALUES (%s,%s,%s,%s,%s,%s)
            ON CONFLICT (projekt_id, typ) DO UPDATE SET
                inhalt=EXCLUDED.inhalt, status=EXCLUDED.status, aktualisiert_am=EXCLUDED.aktualisiert_am
        """, (projekt_id, typ, inhalt, status, company_id or _default_company_id(), _now()))


def upsert_dokument_vorlage_datei(typ, dateiname, dateiinhalt, mimetype, gliederung, company_id=None):
    """gliederung: Liste der erkannten Kapitel-/Folientitel, wird als
    Text (ein Titel pro Zeile) gespeichert."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO dokument_vorlagen_dateien (typ, dateiname, dateiinhalt, mimetype, gliederung, company_id)
            VALUES (%s,%s,%s,%s,%s,%s)
            ON CONFLICT (typ) DO UPDATE SET
                dateiname=EXCLUDED.dateiname, dateiinhalt=EXCLUDED.dateiinhalt,
                mimetype=EXCLUDED.mimetype, gliederung=EXCLUDED.gliederung
        """, (typ, dateiname, dateiinhalt, mimetype, "\n".join(gliederung),
              company_id or _default_company_id()))


def get_dokument_vorlage_datei(typ):
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT * FROM dokument_vorlagen_dateien WHERE typ=%s", (typ,))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        if not row:
            return None
        ergebnis = dict(zip(cols, row))
        ergebnis["gliederung"] = ergebnis["gliederung"].split("\n") if ergebnis["gliederung"] else []
        return ergebnis


# ═══════════════════════════════════════════════════════════════════════════════
# KOSTEN / STUECKLISTE (Phase E - eine Positionsliste bedient beide Sichten:
# Stueckliste = Positionen typ in material/dienstleistung, Kostenbeschreibung =
# alle Positionen gruppiert nach typ, Summe gegen budget_cap)
# ═══════════════════════════════════════════════════════════════════════════════

def get_projekt_positionen(projekt_id):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT *, (menge * einzelpreis) AS gesamtpreis FROM projekt_positionen
            WHERE projekt_id=%s ORDER BY typ, erstellt_am
        """, (projekt_id,))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def create_projekt_position(projekt_id, typ, bezeichnung, menge=1, einheit="Stk",
                            einzelpreis=0, lieferant=None, notiz=None, company_id=None):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO projekt_positionen (projekt_id, typ, bezeichnung, menge, einheit,
                einzelpreis, lieferant, notiz, company_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (projekt_id, typ, bezeichnung, menge, einheit, einzelpreis,
              lieferant, notiz, company_id or _default_company_id()))
        return cursor.fetchone()[0]


def delete_projekt_position(position_id):
    with db_cursor() as (_, cursor):
        cursor.execute("DELETE FROM projekt_positionen WHERE id=%s", (position_id,))


# ═══════════════════════════════════════════════════════════════════════════════
# USER-STORIES (Phase E - konversationell per Interview-Chatbot erfasst, siehe
# ki_service.user_story_interview)
# ═══════════════════════════════════════════════════════════════════════════════

def get_user_stories(projekt_id):
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT * FROM user_stories WHERE projekt_id=%s ORDER BY erstellt_am", (projekt_id,))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def create_user_story(projekt_id, rolle, ziel, nutzen=None, akzeptanzkriterien=None,
                      prioritaet="Should", status="Entwurf", quelle="chatbot", company_id=None):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO user_stories (projekt_id, rolle, ziel, nutzen, akzeptanzkriterien,
                prioritaet, status, quelle, company_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (projekt_id, rolle, ziel, nutzen, akzeptanzkriterien, prioritaet,
              status, quelle, company_id or _default_company_id()))
        return cursor.fetchone()[0]


def update_user_story(story_id, rolle, ziel, nutzen, akzeptanzkriterien, prioritaet, status):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            UPDATE user_stories SET rolle=%s, ziel=%s, nutzen=%s, akzeptanzkriterien=%s,
                prioritaet=%s, status=%s
            WHERE id=%s
        """, (rolle, ziel, nutzen, akzeptanzkriterien, prioritaet, status, story_id))


def delete_user_story(story_id):
    with db_cursor() as (_, cursor):
        cursor.execute("DELETE FROM user_stories WHERE id=%s", (story_id,))


# ═══════════════════════════════════════════════════════════════════════════════
# KONTEXTFAKTOREN (Scope-/Kontext-/Umfeldanalyse - ergaenzt C.6 Projektdesign;
# scope_im/scope_out liegen direkt auf projekt_initialisierung, siehe
# upsert_projekt_initialisierung)
# ═══════════════════════════════════════════════════════════════════════════════

def get_kontextfaktoren(projekt_id):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT * FROM kontextfaktoren WHERE projekt_id=%s
            ORDER BY typ, wichtigkeit DESC, erstellt_am
        """, (projekt_id,))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def create_kontextfaktor(projekt_id, bezeichnung, typ="sachlich", herkunft="intern",
                         einfluss_auf_projekt=None, einfluss_von_projekt=None,
                         wichtigkeit=2, company_id=None):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO kontextfaktoren (projekt_id, bezeichnung, typ, herkunft,
                einfluss_auf_projekt, einfluss_von_projekt, wichtigkeit, company_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (projekt_id, bezeichnung, typ, herkunft, einfluss_auf_projekt,
              einfluss_von_projekt, wichtigkeit, company_id or _default_company_id()))
        return cursor.fetchone()[0]


def update_kontextfaktor(kontextfaktor_id, bezeichnung, typ, herkunft,
                         einfluss_auf_projekt, einfluss_von_projekt, wichtigkeit):
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            UPDATE kontextfaktoren SET bezeichnung=%s, typ=%s, herkunft=%s,
                einfluss_auf_projekt=%s, einfluss_von_projekt=%s, wichtigkeit=%s
            WHERE id=%s
        """, (bezeichnung, typ, herkunft, einfluss_auf_projekt,
              einfluss_von_projekt, wichtigkeit, kontextfaktor_id))


def delete_kontextfaktor(kontextfaktor_id):
    with db_cursor() as (_, cursor):
        cursor.execute("DELETE FROM kontextfaktoren WHERE id=%s", (kontextfaktor_id,))


# ═══════════════════════════════════════════════════════════════════════════════
# VORGEHENSMODELL-ENGINE (Phase F - setzt das Ergebnis von
# ki_service.generiere_vorgehensstruktur in echte Meilensteine/Sprints und
# Tasks um. Nutzt die bestehende Meilenstein-Parent/Child-Hierarchie -
# Wasserfall/V-Modell: Top-Level-Phasen; Scrum/Inkrementell: Top-Level-
# Sprints; Hybrid: Sprints als Kinder der Umsetzungsphase.)
# ═══════════════════════════════════════════════════════════════════════════════

def erzeuge_meilenstein_struktur(projekt_id: int, struktur: dict, projekt_start=None) -> dict:
    """struktur: Rueckgabe von ki_service.generiere_vorgehensstruktur
    ({'meilensteine': [...], 'tasks': [...]}). Legt zuerst alle Top-Level-
    Meilensteine an (parent_titel leer), dann die mit Parent-Referenz, damit
    die Parent-ID beim Anlegen bereits bekannt ist. projekt_start: Basisdatum
    fuer start_woche-Berechnung, Default heute.

    Abgeglichen statt dupliziert: ein Meilenstein/Task mit demselben Titel
    (im selben Projekt bzw. unter demselben Meilenstein) wird bei erneutem
    Aufruf aktualisiert statt ein zweites Mal angelegt - sonst erzeugt jeder
    Klick auf 'Struktur generieren' einen weiteren, ueberlappenden Satz."""
    from datetime import date
    basis = projekt_start or date.today()
    if isinstance(basis, str):
        basis = date.fromisoformat(basis)

    bestehende_meilensteine = {m["titel"]: m for m in get_meilensteine(projekt_id, alle=True)}

    titel_zu_id = {}
    meilensteine = struktur.get("meilensteine", [])
    ohne_parent = [m for m in meilensteine if not m.get("parent_titel")]
    mit_parent = [m for m in meilensteine if m.get("parent_titel")]

    meilensteine_angelegt = 0
    meilensteine_aktualisiert = 0
    for reihenfolge, m in enumerate(ohne_parent + mit_parent):
        start_datum = basis + timedelta(weeks=max(0, m.get("start_woche", 1) - 1))
        end_datum = start_datum + timedelta(weeks=max(1, m.get("dauer_wochen", 1)))
        parent_id = titel_zu_id.get(m.get("parent_titel")) if m.get("parent_titel") else None
        vorhanden = bestehende_meilensteine.get(m["titel"])
        if vorhanden:
            update_meilenstein(
                vorhanden["id"], beschreibung=m.get("beschreibung") or "",
                start_datum=start_datum.isoformat(), end_datum=end_datum.isoformat()
            )
            mid = vorhanden["id"]
            meilensteine_aktualisiert += 1
        else:
            mid = create_meilenstein(
                projekt_id, m["titel"], parent_id=parent_id,
                beschreibung=m.get("beschreibung") or "",
                start_datum=start_datum.isoformat(), end_datum=end_datum.isoformat(),
                reihenfolge=reihenfolge, ist_quality_gate=bool(m.get("ist_gate")),
                typ=m.get("typ") or "phase",
            )
            meilensteine_angelegt += 1
        titel_zu_id[m["titel"]] = mid

    bestehende_tasks = {(t["titel"], t.get("meilenstein_id")) for t in get_tasks(projekt_id=projekt_id)}
    tasks_angelegt = 0
    for t in struktur.get("tasks", []):
        meilenstein_id = titel_zu_id.get(t.get("meilenstein_titel")) if t.get("meilenstein_titel") else None
        if (t["titel"], meilenstein_id) in bestehende_tasks:
            continue
        create_task(projekt_id, t["titel"], aufwandsklasse=t.get("aufwandsklasse") or "15m",
                    meilenstein_id=meilenstein_id)
        tasks_angelegt += 1

    return {"meilensteine_angelegt": meilensteine_angelegt,
            "meilensteine_aktualisiert": meilensteine_aktualisiert,
            "tasks_angelegt": tasks_angelegt}


# ═══════════════════════════════════════════════════════════════════════════════
# MITARBEITERPROFILE (Phase I - Abteilung/Kompetenzen pro Person; die
# KI-Kompetenzen werden nicht manuell gepflegt, sondern aus den tatsaechlich
# per bearbeiter_user_id zugeordneten Aufgaben abgeleitet.)
# ═══════════════════════════════════════════════════════════════════════════════

def get_mitarbeiterprofil(user_id) -> dict | None:
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT mp.*, u.display_name, u.email
            FROM mitarbeiterprofile mp
            JOIN users u ON u.id = mp.user_id
            WHERE mp.user_id=%s
        """, (user_id,))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        return dict(zip(cols, row)) if row else None


def upsert_mitarbeiterprofil(user_id, company_id=None, **kwargs):
    """kwargs: abteilung, kompetenzen (manuell), kompetenzen_ki (KI-Ableitung).
    kompetenzen_ki_am wird automatisch gesetzt, sobald kompetenzen_ki mitgegeben wird."""
    if "kompetenzen_ki" in kwargs and "kompetenzen_ki_am" not in kwargs:
        kwargs["kompetenzen_ki_am"] = _now()
    kwargs["aktualisiert_am"] = _now()
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT 1 FROM mitarbeiterprofile WHERE user_id=%s", (user_id,))
        if cursor.fetchone():
            fields = ", ".join(f"{k}=%s" for k in kwargs)
            cursor.execute(f"UPDATE mitarbeiterprofile SET {fields} WHERE user_id=%s",
                           tuple(kwargs.values()) + (user_id,))
        else:
            cols = ["user_id", "company_id"] + list(kwargs.keys())
            vals = [user_id, company_id or _default_company_id()] + list(kwargs.values())
            placeholders = ", ".join(["%s"] * len(vals))
            cursor.execute(
                f"INSERT INTO mitarbeiterprofile ({', '.join(cols)}) VALUES ({placeholders})",
                tuple(vals))


def get_alle_mitarbeiterprofile() -> list:
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT u.id AS user_id, u.display_name, u.email,
                   mp.abteilung, mp.kompetenzen, mp.kompetenzen_ki, mp.kompetenzen_ki_am
            FROM users u
            LEFT JOIN mitarbeiterprofile mp ON mp.user_id = u.id
            WHERE u.is_active = true
            ORDER BY u.display_name
        """)
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def get_taetigkeiten_fuer_mitarbeiter(user_id, limit=60) -> list:
    """Aufgaben, die tatsaechlich dieser Person zugeordnet sind - Grundlage
    fuer die KI-Kompetenzableitung (Titel/Tags/Projekt, keine manuelle Pflege)."""
    return get_tasks(bearbeiter_user_id=user_id)[:limit]


# ═══════════════════════════════════════════════════════════════════════════════
# SCHAETZVERFAHREN (Phase K Slice 5) - 2-Punkt, 3-Punkt (PERT), Story Points
# ═══════════════════════════════════════════════════════════════════════════════

def berechne_zwei_punkt_schaetzung(optimistisch, pessimistisch) -> float:
    return round((float(optimistisch) + float(pessimistisch)) / 2, 2)


def berechne_drei_punkt_schaetzung(optimistisch, wahrscheinlich, pessimistisch) -> float:
    """PERT-Formel: gewichtet den wahrscheinlichsten Wert vierfach."""
    return round((float(optimistisch) + 4 * float(wahrscheinlich) + float(pessimistisch)) / 6, 2)


def create_schaetzung(projekt_id: int, bezeichnung: str, methode: str,
                      optimistisch=None, wahrscheinlich=None, pessimistisch=None,
                      story_points=None, einheit: str = "Stunden", company_id=None) -> int:
    if methode == "zwei_punkt":
        ergebnis = berechne_zwei_punkt_schaetzung(optimistisch, pessimistisch)
    elif methode == "drei_punkt":
        ergebnis = berechne_drei_punkt_schaetzung(optimistisch, wahrscheinlich, pessimistisch)
    elif methode == "story_points":
        ergebnis = float(story_points)
    else:
        raise ValueError(f"Unbekannte Schaetzmethode: {methode}")

    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO schaetzungen (projekt_id, bezeichnung, methode, optimistisch,
                wahrscheinlich, pessimistisch, story_points, einheit, ergebnis, company_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (projekt_id, bezeichnung, methode, optimistisch, wahrscheinlich, pessimistisch,
              story_points, einheit, ergebnis, company_id or _default_company_id()))
        return cursor.fetchone()[0]


def get_schaetzungen(projekt_id: int) -> list:
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT * FROM schaetzungen WHERE projekt_id=%s ORDER BY erstellt_am DESC
        """, (projekt_id,))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def delete_schaetzung(schaetzung_id: int):
    with db_cursor() as (_, cursor):
        cursor.execute("DELETE FROM schaetzungen WHERE id=%s", (schaetzung_id,))


# ═══════════════════════════════════════════════════════════════════════════════
# ZWISCHENBERICHTE & NACHWEISE (Phase K Slice 3)
# ═══════════════════════════════════════════════════════════════════════════════

def create_berichtspflicht(projekt_id: int, bezeichnung: str, rhythmus: str,
                           start_datum=None, company_id=None) -> int:
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO berichtspflichten (projekt_id, bezeichnung, rhythmus, start_datum, company_id)
            VALUES (%s,%s,%s, COALESCE(%s, CURRENT_DATE), %s)
            RETURNING id
        """, (projekt_id, bezeichnung, rhythmus, start_datum, company_id or _default_company_id()))
        return cursor.fetchone()[0]


def get_berichtspflichten(projekt_id: int) -> list:
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT * FROM berichtspflichten WHERE projekt_id=%s AND aktiv=true
            ORDER BY start_datum
        """, (projekt_id,))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def delete_berichtspflicht(berichtspflicht_id: int):
    with db_cursor() as (_, cursor):
        cursor.execute("UPDATE berichtspflichten SET aktiv=false WHERE id=%s", (berichtspflicht_id,))


def berechne_faelligkeiten(berichtspflicht: dict, bis_datum=None) -> list:
    """Berechnet alle Faelligkeitstermine vom Start bis heute (+ naechster
    kommender Termin), abgeleitet aus dem Rhythmus. 'einmalig' hat genau
    einen Termin (den Start selbst)."""
    from datetime import date as _date
    heute = bis_datum or _date.today()
    start = berichtspflicht["start_datum"]
    if isinstance(start, str):
        start = _date.fromisoformat(start)

    rhythmus = berichtspflicht["rhythmus"]
    if rhythmus == "einmalig":
        return [start]

    monate_schritt = {"quartalsweise": 3, "halbjaehrlich": 6, "jaehrlich": 12}.get(rhythmus)
    if not monate_schritt:
        return [start]

    termine = []
    aktuell = start
    while aktuell <= heute + timedelta(days=31):  # inkl. naechstem kommenden Termin
        termine.append(aktuell)
        monat = aktuell.month - 1 + monate_schritt
        jahr = aktuell.year + monat // 12
        monat = monat % 12 + 1
        tag = min(aktuell.day, 28)
        aktuell = aktuell.replace(year=jahr, month=monat, day=tag)
    return termine


def reiche_berichtsnachweis_ein(berichtspflicht_id: int, faelligkeit_datum, user_id=None,
                                dateiname: str = None, dateiinhalt: bytes = None,
                                mimetype: str = None, notiz: str = None, company_id=None) -> int:
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO berichtsnachweise (berichtspflicht_id, faelligkeit_datum, dateiname,
                dateiinhalt, mimetype, user_id, notiz, company_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (berichtspflicht_id, faelligkeit_datum, dateiname, dateiinhalt, mimetype,
              user_id, notiz, company_id or _default_company_id()))
        return cursor.fetchone()[0]


def get_berichtsnachweise(berichtspflicht_id: int) -> list:
    """Metadaten ohne dateiinhalt - siehe get_berichtsnachweis() fuer Download."""
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT bn.id, bn.berichtspflicht_id, bn.faelligkeit_datum, bn.eingereicht_am,
                   bn.dateiname, bn.mimetype, bn.notiz, u.display_name AS user_name
            FROM berichtsnachweise bn
            LEFT JOIN users u ON u.id = bn.user_id
            WHERE bn.berichtspflicht_id=%s
            ORDER BY bn.faelligkeit_datum DESC
        """, (berichtspflicht_id,))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def get_berichtsnachweis(nachweis_id: int) -> dict | None:
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT * FROM berichtsnachweise WHERE id=%s", (nachweis_id,))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        return dict(zip(cols, row)) if row else None


# ═══════════════════════════════════════════════════════════════════════════════
# KOSTENKALKULATION & RECHNUNGSSTELLUNG (Phase K Slice 4)
# ═══════════════════════════════════════════════════════════════════════════════

def berechne_rechnungsbetrag(grundbetrag, gewinn_pct, rabatt_pct, skonto_pct) -> float:
    """Grundbetrag (i.d.R. Summe der Positionen/Stueckliste) -> + Gewinn% ->
    - Rabatt% -> - Skonto% (Skonto nur informativ als Referenzwert bei
    vorzeitiger Zahlung, haendisch nachbearbeitbar da Endbetrag separat
    ueberschreibbar gespeichert wird)."""
    betrag = float(grundbetrag) * (1 + float(gewinn_pct) / 100)
    betrag *= (1 - float(rabatt_pct) / 100)
    betrag *= (1 - float(skonto_pct) / 100)
    return round(betrag, 2)


def upsert_rechnungskalkulation(projekt_id: int, typ: str, grundbetrag, gewinn_pct=0,
                                rabatt_pct=0, skonto_pct=0, endbetrag=None, company_id=None):
    if endbetrag is None:
        endbetrag = berechne_rechnungsbetrag(grundbetrag, gewinn_pct, rabatt_pct, skonto_pct)
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO rechnungskalkulationen (projekt_id, typ, grundbetrag, gewinn_pct,
                rabatt_pct, skonto_pct, endbetrag, company_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT (projekt_id, typ) DO UPDATE SET
                grundbetrag=EXCLUDED.grundbetrag, gewinn_pct=EXCLUDED.gewinn_pct,
                rabatt_pct=EXCLUDED.rabatt_pct, skonto_pct=EXCLUDED.skonto_pct,
                endbetrag=EXCLUDED.endbetrag, aktualisiert_am=now()
        """, (projekt_id, typ, grundbetrag, gewinn_pct, rabatt_pct, skonto_pct,
              endbetrag, company_id or _default_company_id()))


def get_rechnungskalkulation(projekt_id: int, typ: str) -> dict | None:
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT * FROM rechnungskalkulationen WHERE projekt_id=%s AND typ=%s
        """, (projekt_id, typ))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        return dict(zip(cols, row)) if row else None


def generiere_rechnungstext(projekt_name: str, typ: str, positionen: list, kalkulation: dict) -> str:
    """Deterministisches Text-Template statt KI-Generierung - bei Finanz-
    dokumenten (Rechnungsbetraege) soll nichts halluziniert werden koennen.
    Ergebnis ist ohnehin haendisch nachbearbeitbar (in projekt_dokumente
    gespeichert)."""
    titel = "VORRECHNUNG" if typ == "vorrechnung" else "ENDRECHNUNG"
    zeilen = [f"{titel} – {projekt_name}", f"Datum: {_now().strftime('%d.%m.%Y')}", ""]
    if positionen:
        zeilen.append("Positionen:")
        for pos in positionen:
            zeilen.append(
                f"  - {pos['bezeichnung']}: {pos['menge']} {pos['einheit']} × "
                f"{float(pos['einzelpreis']):,.2f} € = {float(pos['gesamtpreis']):,.2f} €"
            )
        zeilen.append("")
    zeilen.append(f"Grundbetrag: {float(kalkulation['grundbetrag']):,.2f} €")
    zeilen.append(f"Gewinnzuschlag: {float(kalkulation['gewinn_pct']):.1f}%")
    zeilen.append(f"Rabatt: {float(kalkulation['rabatt_pct']):.1f}%")
    zeilen.append(f"Skonto (bei vorzeitiger Zahlung): {float(kalkulation['skonto_pct']):.1f}%")
    zeilen.append(f"")
    zeilen.append(f"ENDBETRAG: {float(kalkulation['endbetrag']):,.2f} €")
    return "\n".join(zeilen)
