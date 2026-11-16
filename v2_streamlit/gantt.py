"""
Engineering Cockpit – Gantt & Zeitplan
Meilenstein-Ansicht + Task-Abhängigkeiten (Blocked by)
"""
import streamlit as st
from datetime import datetime, date, timedelta
from pages.helpers import topbar, alert, section_header
from dal import get_all_projekte, get_tasks, get_task, update_task, db_cursor
import sqlite3


# ═══════════════════════════════════════════════════════════════════════════════
# ABHÄNGIGKEITEN-TABELLE (wird beim ersten Aufruf angelegt)
# ═══════════════════════════════════════════════════════════════════════════════

def _init_abhaengigkeiten():
    try:
        with db_cursor() as (conn, cursor):
            is_sqlite = isinstance(conn, sqlite3.Connection)
            if is_sqlite:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS TaskAbhaengigkeiten (
                        id              INTEGER PRIMARY KEY AUTOINCREMENT,
                        task_id         INTEGER REFERENCES Tasks(id) ON DELETE CASCADE,
                        blockiert_durch INTEGER REFERENCES Tasks(id) ON DELETE CASCADE,
                        UNIQUE(task_id, blockiert_durch)
                    )
                """)
            else:
                cursor.execute("""
                    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TaskAbhaengigkeiten' AND xtype='U')
                    CREATE TABLE TaskAbhaengigkeiten (
                        id              INT IDENTITY(1,1) PRIMARY KEY,
                        task_id         INT REFERENCES Tasks(id),
                        blockiert_durch INT REFERENCES Tasks(id),
                        CONSTRAINT uq_ta UNIQUE(task_id, blockiert_durch)
                    )
                """)
    except Exception:
        pass


def get_abhaengigkeiten(task_id: int) -> list:
    _init_abhaengigkeiten()
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT a.*, t.titel AS blocker_titel, t.status AS blocker_status
            FROM TaskAbhaengigkeiten a
            JOIN Tasks t ON a.blockiert_durch = t.id
            WHERE a.task_id = ?
        """, (task_id,))
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def add_abhaengigkeit(task_id: int, blockiert_durch: int):
    _init_abhaengigkeiten()
    with db_cursor() as (_, cursor):
        try:
            cursor.execute(
                "INSERT OR IGNORE INTO TaskAbhaengigkeiten (task_id, blockiert_durch) VALUES (?,?)",
                (task_id, blockiert_durch)
            )
        except Exception:
            pass


def remove_abhaengigkeit(task_id: int, blockiert_durch: int):
    with db_cursor() as (_, cursor):
        cursor.execute(
            "DELETE FROM TaskAbhaengigkeiten WHERE task_id=? AND blockiert_durch=?",
            (task_id, blockiert_durch)
        )


def ist_blockiert(task_id: int) -> bool:
    """True wenn mind. eine Abhängigkeit noch nicht erledigt ist."""
    deps = get_abhaengigkeiten(task_id)
    return any(d.get("blocker_status") != "Erledigt" for d in deps)


# ═══════════════════════════════════════════════════════════════════════════════
# GANTT-RENDERING (reines HTML/CSS — kein Plotly nötig)
# ═══════════════════════════════════════════════════════════════════════════════

def _gantt_html(projekte: list) -> str:
    """Rendert einen Gantt-Chart als HTML-String."""
    heute = date.today()

    # Zeitachse: frühstes Start bis spätestes Ende (max. 18 Monate)
    alle_starts = []
    alle_enden  = []
    for p in projekte:
        if p.get("start_datum"):
            try: alle_starts.append(date.fromisoformat(str(p["start_datum"])))
            except Exception: pass
        if p.get("end_datum"):
            try: alle_enden.append(date.fromisoformat(str(p["end_datum"])))
            except Exception: pass

    if not alle_starts:
        alle_starts = [heute - timedelta(days=30)]
    if not alle_enden:
        alle_enden = [heute + timedelta(days=180)]

    t_start = min(alle_starts)
    t_ende  = max(alle_enden)
    t_gesamt = max((t_ende - t_start).days, 1)

    # Monate für Kopfzeile
    monate = []
    m = t_start.replace(day=1)
    while m <= t_ende:
        monate.append(m)
        if m.month == 12:
            m = m.replace(year=m.year+1, month=1)
        else:
            m = m.replace(month=m.month+1)

    GANTT_W = 800   # px Gesamtbreite der Balken-Area

    def pct(d: date) -> float:
        return max(0.0, min(100.0, (d - t_start).days / t_gesamt * 100))

    # Kopfzeile — Monate
    monat_cells = ""
    for m in monate:
        if m.month == 13: continue
        m_end = m.replace(month=m.month+1) if m.month < 12 else m.replace(year=m.year+1, month=1)
        w_pct = min(100, (min(m_end, t_ende) - max(m, t_start)).days / t_gesamt * 100)
        monat_cells += f'<div style="width:{w_pct:.1f}%;min-width:0;text-align:center;font-size:10px;color:#5B6488;font-weight:600;border-right:1px solid #E2E5F0;padding:3px 0;overflow:hidden;">{m.strftime("%b %y")}</div>'

    # Heute-Linie
    heute_pct = pct(heute)
    heute_line = f'<div style="position:absolute;left:{heute_pct:.1f}%;top:0;bottom:0;width:2px;background:#DC2626;z-index:10;opacity:0.7;"><div style="position:absolute;top:-14px;left:-12px;font-size:9px;color:#DC2626;font-weight:700;white-space:nowrap;">Heute</div></div>'

    # Projekt-Zeilen
    zeilen = ""
    for p in projekte:
        farbe = p.get("farbe","#4461D7") or "#4461D7"
        status_col = {"Aktiv":"#16A34A","Pausiert":"#D97706","Archiv":"#9099BE"}.get(p["status"],"#9099BE")

        # Balken
        balken = ""
        if p.get("start_datum") and p.get("end_datum"):
            try:
                ps = date.fromisoformat(str(p["start_datum"]))
                pe = date.fromisoformat(str(p["end_datum"]))
                links = pct(ps)
                breite = pct(pe) - links
                if breite > 0:
                    # Fortschrittsbalken
                    tasks_p = get_tasks(projekt_id=p["id"])
                    gesamt = len(tasks_p)
                    done = sum(1 for t in tasks_p if t["status"] == "Erledigt")
                    done_pct = done/gesamt*100 if gesamt > 0 else 0
                    balken = f"""
                    <div style="position:absolute;left:{links:.1f}%;width:{breite:.1f}%;height:22px;top:6px;
                                border-radius:4px;background:{farbe}22;border:1.5px solid {farbe};overflow:hidden;">
                        <div style="width:{done_pct:.0f}%;height:100%;background:{farbe};opacity:0.7;"></div>
                        <div style="position:absolute;left:6px;top:2px;font-size:10px;color:#1E2235;font-weight:700;white-space:nowrap;overflow:hidden;">
                            {p['name'][:30]} · {done_pct:.0f}%
                        </div>
                    </div>"""
            except Exception:
                pass

        zeilen += f"""
        <div style="display:flex;align-items:center;border-bottom:1px solid #F4F5FA;min-height:36px;">
            <div style="width:200px;flex-shrink:0;padding:6px 10px;font-size:12px;font-weight:700;color:#1E2235;
                        border-right:1px solid #E2E5F0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:{farbe};margin-right:6px;"></span>
                {p['name'][:28]}
            </div>
            <div style="flex:1;position:relative;height:36px;">
                {heute_line if zeilen == '' else ''}
                {balken if balken else '<div style="padding:8px;font-size:11px;color:#9099BE;">Kein Datum gesetzt</div>'}
            </div>
        </div>"""

    html = f"""
    <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:10px;overflow:hidden;
                box-shadow:0 1px 3px rgba(30,34,53,0.06);margin-bottom:16px;">
        <!-- Kopfzeile -->
        <div style="display:flex;border-bottom:2px solid #E2E5F0;">
            <div style="width:200px;flex-shrink:0;padding:8px 10px;font-size:11px;font-weight:700;
                        color:#9099BE;text-transform:uppercase;letter-spacing:0.07em;border-right:1px solid #E2E5F0;">
                Projekt
            </div>
            <div style="flex:1;display:flex;position:relative;overflow:hidden;">
                {monat_cells}
            </div>
        </div>
        <!-- Zeilen -->
        <div style="position:relative;">
            {zeilen if zeilen else '<div style="padding:20px;color:#9099BE;font-size:13px;">Keine Projekte mit Datumsangaben.</div>'}
        </div>
    </div>
    """
    return html


# ═══════════════════════════════════════════════════════════════════════════════
# SEITE
# ═══════════════════════════════════════════════════════════════════════════════

def show():
    _init_abhaengigkeiten()
    st.markdown(topbar("Gantt & Zeitplan", "Meilensteine · Abhängigkeiten · Zeitachse"), unsafe_allow_html=True)
    st.markdown('<div style="padding:0 28px;">', unsafe_allow_html=True)

    tab1, tab2 = st.tabs(["📅 Gantt-Ansicht", "🔗 Task-Abhängigkeiten"])

    # ── TAB 1: GANTT ──────────────────────────────────────────────────────────
    with tab1:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Zeitachse aller Projekte basierend auf Start- und Enddatum. Fortschrittsbalken zeigt
            erledigte Tasks. Heute-Linie rot markiert.
        </div>
        """, unsafe_allow_html=True)

        sf_filter = st.radio("", ["Alle","Aktiv","Pausiert","Archiv"],
                              horizontal=True, label_visibility="collapsed")
        status_filter = None if sf_filter == "Alle" else [sf_filter]
        projekte = get_all_projekte(status_filter=status_filter)

        if projekte:
            st.markdown(_gantt_html(projekte), unsafe_allow_html=True)
        else:
            st.markdown(alert("Keine Projekte gefunden.", "info"), unsafe_allow_html=True)

        # Datum-Editor
        st.markdown(section_header("Projektdaten bearbeiten"), unsafe_allow_html=True)
        st.markdown('<div style="font-size:0.78rem;color:#9099BE;margin-bottom:8px;">Start/Ende direkt hier setzen — Gantt aktualisiert sich automatisch.</div>', unsafe_allow_html=True)

        from dal import update_projekt
        for p in projekte:
            farbe = p.get("farbe","#4461D7") or "#4461D7"
            with st.expander(f"◆ {p['name']}", expanded=False):
                gc1, gc2, gc3 = st.columns(3)
                with gc1:
                    start_val = None
                    if p.get("start_datum"):
                        try: start_val = date.fromisoformat(str(p["start_datum"]))
                        except Exception: pass
                    new_start = st.date_input("Startdatum", value=start_val, key=f"gs_{p['id']}")
                with gc2:
                    end_val = None
                    if p.get("end_datum"):
                        try: end_val = date.fromisoformat(str(p["end_datum"]))
                        except Exception: pass
                    new_end = st.date_input("Enddatum (geplant)", value=end_val, key=f"ge_{p['id']}")
                with gc3:
                    st.markdown("<div style='height:28px'></div>", unsafe_allow_html=True)
                    if st.button("💾 Speichern", key=f"gsave_{p['id']}", use_container_width=True, type="primary"):
                        update_projekt(p["id"],
                                       start_datum=str(new_start) if new_start else None,
                                       end_datum=str(new_end) if new_end else None)
                        st.success("✓ Gespeichert"); st.rerun()

    # ── TAB 2: ABHÄNGIGKEITEN ─────────────────────────────────────────────────
    with tab2:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Definiere welche Tasks andere blockieren. Blockierte Tasks werden im Kanban
            und in "Meine Tasks" mit einem 🔒-Symbol markiert.
        </div>
        """, unsafe_allow_html=True)

        alle_tasks = get_tasks(status=["Backlog","Fokus","Warten_auf"])
        task_map   = {t["id"]: t for t in alle_tasks}

        # Neue Abhängigkeit
        st.markdown(section_header("Neue Abhängigkeit anlegen"), unsafe_allow_html=True)

        if not alle_tasks:
            st.markdown(alert("Keine offenen Tasks vorhanden. Zuerst Tasks anlegen.", "info"), unsafe_allow_html=True)
        else:
            def _fmt_task(x):
                t = task_map.get(x)
                if not t:
                    return str(x)
                titel = (t.get("titel") or "–")[:45]
                proj  = (t.get("projekt_name") or "–")[:15]
                return f"{titel} ({proj})"

            ac1, ac2, ac3 = st.columns([3,3,1])
            with ac1:
                sel_task = st.selectbox("Task", [t["id"] for t in alle_tasks],
                                         format_func=_fmt_task,
                                         key="dep_task", label_visibility="visible")
            with ac2:
                moegliche_blocker = [t for t in alle_tasks if t["id"] != sel_task]
                sel_blocker = st.selectbox("wird blockiert durch",
                                    [t["id"] for t in moegliche_blocker],
                                    format_func=lambda x: (task_map.get(x) or {}).get("titel", str(x))[:45],
                                    key="dep_blocker", label_visibility="visible")
        with ac3:
            st.markdown("<div style='height:28px'></div>", unsafe_allow_html=True)
            if st.button("➕ Setzen", type="primary", use_container_width=True):
                add_abhaengigkeit(sel_task, sel_blocker)
                st.success("Abhängigkeit gesetzt!"); st.rerun()

        # Bestehende Abhängigkeiten
        st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
        st.markdown(section_header("Bestehende Abhängigkeiten"), unsafe_allow_html=True)

        hat_abh = False
        for t in alle_tasks:
            deps = get_abhaengigkeiten(t["id"])
            if not deps:
                continue
            hat_abh = True
            farbe = t.get("projekt_farbe","#4461D7") or "#4461D7"
            blockiert = any(d.get("blocker_status") != "Erledigt" for d in deps)

            st.markdown(f"""
            <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                        padding:12px 16px;margin-bottom:8px;border-left:3px solid {farbe};
                        box-shadow:0 1px 3px rgba(30,34,53,0.06);">
                <div style="font-weight:700;font-size:0.875rem;color:#1E2235;margin-bottom:6px;">
                    {'🔒 ' if blockiert else '✓ '}{t['titel'][:70]}
                    <span style="font-size:0.72rem;color:{farbe};margin-left:8px;">◆ {t.get('projekt_name','–')}</span>
                </div>
                <div style="font-size:0.78rem;color:#5B6488;">Blockiert durch:</div>
            </div>
            """, unsafe_allow_html=True)

            for dep in deps:
                b_status = dep.get("blocker_status","")
                b_ok = b_status == "Erledigt"
                d1, d2 = st.columns([5,1])
                with d1:
                    st.markdown(f"""
                    <div style="background:{'#F0FDF4' if b_ok else '#FEF2F2'};border-radius:6px;
                                padding:7px 14px;margin:3px 0 3px 16px;font-size:0.82rem;
                                border-left:3px solid {'#16A34A' if b_ok else '#DC2626'};">
                        {'✅' if b_ok else '🔴'} {dep.get('blocker_titel','?')[:60]}
                        <span style="font-size:0.7rem;color:#9099BE;margin-left:8px;">{b_status}</span>
                    </div>
                    """, unsafe_allow_html=True)
                with d2:
                    if st.button("✕", key=f"dep_rm_{t['id']}_{dep['blockiert_durch']}", use_container_width=True):
                        remove_abhaengigkeit(t["id"], dep["blockiert_durch"])
                        st.rerun()

        if not hat_abh:
            st.markdown(alert("Noch keine Abhängigkeiten definiert.", "info"), unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)
