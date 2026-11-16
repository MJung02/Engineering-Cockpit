"""Gantt & Meilensteine – Projekt-Drill-down + Hierarchie mit Plotly Timeline"""
import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import date, datetime, timedelta
from dal import (get_all_projekte, get_projekt, update_projekt,
                 get_meilensteine, get_meilenstein, create_meilenstein,
                 update_meilenstein, delete_meilenstein,
                 get_tasks_fuer_meilenstein, get_meilenstein_fortschritt,
                 create_task, get_tasks, update_task, delete_task,
                 get_projekt_initialisierung)


def safe_date(val):
    if not val: return None
    if isinstance(val, date): return val
    if isinstance(val, datetime): return val.date()
    try: return date.fromisoformat(str(val).split("T")[0])
    except Exception: return None


# ─── GRAPHISCHES PLOTLY GANTT CHART (REINER TAG-BEZUG OHNE DUPLIKATE) ──────────
def _baue_plotly_gantt(projekt_id):
    """Holt die echten Meilensteine des Projekts und zeichnet die Plotly-Timeline.
    Verhindert doppelte Datumsanzeigen beim Reinzoomen durch erzwungene Tagesschritte (dtick="D1").
    """
    # Alle Meilensteine (auch Untermeilensteine) für dieses Projekt laden
    all_m = get_meilensteine(projekt_id, alle=True)
    
    data = []
    for m in all_m:
        sd = safe_date(m.get("start_datum"))
        ed = safe_date(m.get("end_datum"))
        
        if sd and ed:
            data.append({
                "Meilenstein": m["titel"],
                "Start": sd,
                "Ende": ed,
                "Status": m.get("status", "Offen")
            })
            
    if not data:
        st.info("Keine ausreichenden Meilenstein-Daten (Start- und Enddatum) für die grafische Timeline vorhanden.")
        return

    df = pd.DataFrame(data)
    
    # Farbschema passend zu den Status-Typen
    color_map = {
        "Offen": "#BDC3C7",          # Grau
        "In Bearbeitung": "#3498DB",  # Blau
        "Erledigt": "#2ECC71"         # Grün
    }
    
    fig = px.timeline(
        df, 
        x_start="Start", 
        x_end="Ende", 
        y="Meilenstein", 
        color="Status",
        color_discrete_map=color_map,
        title="🗓 Projekt-Gantt-Timeline"
    )
    
    fig.update_yaxes(autorange="reversed")
    
    # X-Achse: fester dtick="D1" ergab bei mehrwoechigen Projekten Dutzende
    # Tages-Ticks, die als unlesbarer, vertikal ueberlappender Textbrei
    # gerendert wurden. Tick-Abstand jetzt an die Projektdauer anpassen.
    spanne_tage = (df["Ende"].max() - df["Start"].min()).days
    if spanne_tage <= 21:
        dtick, tickformat = "D1", "%d.%m."
    elif spanne_tage <= 120:
        dtick, tickformat = 7 * 24 * 60 * 60 * 1000, "%d.%m."   # woechentlich (ms)
    else:
        dtick, tickformat = "M1", "%b %Y"                        # monatlich
    fig.update_xaxes(type="date", tickformat=tickformat, dtick=dtick, tickangle=-45)
    
    fig.update_layout(
        height=330, 
        legend_orientation="h", 
        legend_y=-0.2,
        margin=dict(l=20, r=20, t=40, b=20)
    )
    st.plotly_chart(fig, use_container_width=True)


# ─── Gantt-Balken (native Streamlit progress) ──────────────────────────────────
def _gantt_balken(start_d, end_d, heute, label, pct, farbe="#4461D7"):
    if not start_d or not end_d:
        st.caption("⚠ Kein Datum")
        st.progress(pct/100 if pct else 0)
        return
    dauer = max((end_d - start_d).days, 1)
    vergangen = (heute - start_d).days
    ueberfaellig = heute > end_d
    noch = (end_d - heute).days

    col1, col2, col3 = st.columns([3,1,1])
    with col1:
        st.progress(pct/100, text=f"{pct}% erledigt")
    with col2:
        st.caption(f"📅 {start_d.strftime('%d.%m.%y')} → {end_d.strftime('%d.%m.%y')}")
    with col3:
        if ueberfaellig:
            st.error(f"⏰ +{-noch}d")
        elif heute >= start_d:
            st.caption(f"⏳ noch {noch}d")
        else:
            st.caption(f"🔜 in {-vergangen}d")


# ─── Haupt-Einstiegsfunktion für app.py ────────────────────────────────────────
def show():
    st.title("📅 Gantt & Meilensteine")

    # Navigation State
    if "gantt_projekt_id" not in st.session_state:
        st.session_state.gantt_projekt_id = None
    if "gantt_meilenstein_id" not in st.session_state:
        st.session_state.gantt_meilenstein_id = None

    heute = date.today()

    # ── Breadcrumb ─────────────────────────────────────────────────────────────
    if st.session_state.gantt_projekt_id:
        p = get_projekt(st.session_state.gantt_projekt_id)
        if st.session_state.gantt_meilenstein_id:
            m = get_meilenstein(st.session_state.gantt_meilenstein_id)
            breadcrumb = f"Alle Projekte → {p['name']} → {m['titel'] if m else '?'}"
        else:
            breadcrumb = f"Alle Projekte → {p['name']}"
        cols = st.columns([4,1])
        with cols[0]: st.caption(f"📍 {breadcrumb}")
        with cols[1]:
            if st.button("← Zurück"):
                if st.session_state.gantt_meilenstein_id:
                    # Geh zur Meilenstein-Ebene zurück
                    m = get_meilenstein(st.session_state.gantt_meilenstein_id)
                    if m and m.get("parent_id"):
                        st.session_state.gantt_meilenstein_id = m["parent_id"]
                    else:
                        st.session_state.gantt_meilenstein_id = None
                else:
                    st.session_state.gantt_projekt_id = None
                st.rerun()

    st.divider()

    # ── ANSICHT 1: Alle Projekte ────────────────────────────────────────────────
    if not st.session_state.gantt_projekt_id:
        _ansicht_alle_projekte(heute)

    # ── ANSICHT 2: Ein Projekt mit Meilensteinen ───────────────────────────────
    elif not st.session_state.gantt_meilenstein_id:
        _ansicht_projekt(st.session_state.gantt_projekt_id, heute)

    # ── ANSICHT 3: Meilenstein mit Untermeilensteinen + Tasks ─────────────────
    else:
        _ansicht_meilenstein(st.session_state.gantt_meilenstein_id,
                             st.session_state.gantt_projekt_id, heute)


# ─── Ansicht 1: Alle Projekte ──────────────────────────────────────────────────
def _ansicht_alle_projekte(heute):
    sf_opts = ["Alle","Begonnen","Nicht gestartet","Unterbrochen","Abgebrochen","Abgelehnt","Beendet"]
    sf = st.radio("", sf_opts, index=sf_opts.index("Begonnen"),
                  horizontal=True, label_visibility="collapsed")
    projekte = get_all_projekte(status_filter=[sf] if sf != "Alle" else None)

    st.caption(f"{len(projekte)} Projekte · Doppelklick / Schaltfläche zum Drill-down")

    for p in projekte:
        meilensteine = get_meilensteine(p["id"], alle=True)
        tasks_p = get_tasks(projekt_id=p["id"])
        gesamt = len(tasks_p)
        done   = sum(1 for t in tasks_p if t.get("status") == "Erledigt")
        pct    = int(done/gesamt*100) if gesamt > 0 else 0
        start  = safe_date(p.get("start_datum"))
        end    = safe_date(p.get("end_datum"))

        with st.container(border=True):
            col_head, col_btn = st.columns([6, 1])
            with col_head:
                status_icon = {"Begonnen":"🟢","Nicht gestartet":"⚪","Unterbrochen":"🟡",
                               "Abgebrochen":"🔴","Abgelehnt":"🔴","Beendet":"⚫"}.get(p["status"],"○")
                st.markdown(f"**{status_icon} {p['name']}** "
                            f"`{p.get('kostenstelle','–')}` · "
                            f"{len(meilensteine)} Meilensteine · "
                            f"{gesamt} Tasks")
            with col_btn:
                if st.button("🔍 Öffnen", key=f"gp_{p['id']}", use_container_width=True,
                             type="primary"):
                    st.session_state.gantt_projekt_id = p["id"]
                    st.session_state.gantt_meilenstein_id = None
                    st.rerun()

            _gantt_balken(start, end, heute, p["name"], pct)

            # Mini-Meilenstein-Übersicht
            if meilensteine:
                for m in meilensteine[:3]:
                    m_start = safe_date(m.get("start_datum"))
                    m_end   = safe_date(m.get("end_datum"))
                    fp = get_meilenstein_fortschritt(m["id"])
                    indent = "   └ " if m.get("parent_id") else "   ├ "
                    
                    start_str = m_start.strftime('%d.%m') if m_start else '?'
                    end_str = m_end.strftime('%d.%m.%y') if m_end else '?'
                    
                    col1, col2 = st.columns([5, 1])
                    with col1:
                        st.caption(f"{indent}📍 {m['titel']} · {fp['pct']}% · {start_str} → {end_str}")
                    with col2:
                        st.progress(fp["pct"]/100)
                if len(meilensteine) > 3:
                    st.caption(f"   … +{len(meilensteine)-3} weitere Meilensteine")

    # Datum-Editor
    st.divider()
    with st.expander("📝 Projektdaten (Start/Ende) bearbeiten"):
        alle_p = get_all_projekte()
        for p in alle_p:
            with st.expander(f"◆ {p['name']}"):
                c1, c2, c3 = st.columns(3)
                with c1:
                    ns = st.date_input("Start", value=safe_date(p.get("start_datum")),
                                       key=f"gs_{p['id']}")
                with c2:
                    ne = st.date_input("Ende", value=safe_date(p.get("end_datum")),
                                       key=f"ge_{p['id']}")
                with c3:
                    st.markdown(" ")
                    if st.button("💾", key=f"gsave_{p['id']}", use_container_width=True):
                        update_projekt(p["id"],
                                       start_datum=str(ns) if ns else None,
                                       end_datum=str(ne) if ne else None)
                        st.success("✓"); st.rerun()


def _baue_v_modell_diagramm(phasen, heute):
    """Klassisches V-Modell-Diagramm (siehe Straubel-Foliensatz S2.8): erste
    Haelfte der Phasen bildet den absteigenden linken Arm (Anforderung ->
    Entwurf), letzte Phase ist die Spitze (Implementierung), zweite Haelfte
    der absteigenden Reihenfolge gespiegelt als aufsteigender rechter Arm
    (Test -> Abnahme) - mit Verifizierungs-/Validierungspfeilen dazwischen."""
    n = len(phasen)
    mitte = n // 2
    links = phasen[:mitte]
    spitze = phasen[mitte:mitte + 1] if n % 2 == 1 else []
    rechts = list(reversed(phasen[mitte + (1 if n % 2 == 1 else 0):]))

    breite, hoehe = 780, 90 + max(len(links), len(rechts)) * 90
    box_w, box_h = 190, 56

    def _ist_aktuell(ph):
        try:
            return ph.get("start_datum") and ph.get("end_datum") and \
                date.fromisoformat(str(ph["start_datum"])) <= heute <= date.fromisoformat(str(ph["end_datum"]))
        except Exception:
            return False

    def _box(ph, x, y):
        aktuell = _ist_aktuell(ph)
        farbe = "#16A34A" if aktuell else ("#4461D7" if ph.get("status") == "Erledigt" else "#9099BE")
        bg = "#DCFCE7" if aktuell else "#FFFFFF"
        marker = " 🟢" if aktuell else ""
        return (f'<rect x="{x}" y="{y}" width="{box_w}" height="{box_h}" rx="8" '
                f'fill="{bg}" stroke="{farbe}" stroke-width="2.5"/>'
                f'<text x="{x + box_w/2}" y="{y + box_h/2 + 5}" text-anchor="middle" '
                f'font-size="13" font-weight="700" fill="#1E2235">{ph["titel"][:22]}{marker}</text>')

    svg_parts = [f'<svg viewBox="0 0 {breite} {hoehe}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">']
    linie_pts_l, linie_pts_r = [], []
    for i, ph in enumerate(links):
        x, y = 20, 20 + i * 90
        svg_parts.append(_box(ph, x, y))
        linie_pts_l.append((x + box_w, y + box_h / 2))
    for i, ph in enumerate(rechts):
        x, y = breite - 20 - box_w, 20 + i * 90
        svg_parts.append(_box(ph, x, y))
        linie_pts_r.append((x, y + box_h / 2))
    if spitze:
        x, y = (breite - box_w) / 2, 20 + max(len(links), len(rechts)) * 90
        svg_parts.append(_box(spitze[0], x, y))

    # Verifizierungs-/Validierungspfeile zwischen gespiegelten Phasen
    for (lx, ly), (rx, ry) in zip(linie_pts_l, linie_pts_r):
        svg_parts.append(
            f'<line x1="{lx + 60}" y1="{ly}" x2="{rx - 60}" y2="{ry}" stroke="#CDD0E0" '
            f'stroke-width="1.5" stroke-dasharray="5,4"/>'
            f'<text x="{breite/2}" y="{ly - 6}" text-anchor="middle" font-size="10" '
            f'fill="#9099BE">Verifizierung</text>'
        )
    svg_parts.append("</svg>")
    st.markdown("".join(svg_parts), unsafe_allow_html=True)


# ─── Ansicht 2: Projekt-Meilensteine ──────────────────────────────────────────
def _ansicht_projekt(projekt_id, heute, zeige_v_modell=True):
    p = get_projekt(projekt_id)
    if not p:
        st.session_state.gantt_projekt_id = None; st.rerun(); return

    st.subheader(f"📁 {p['name']}")

    init = get_projekt_initialisierung(projekt_id) or {}
    vorgehensmodell = init.get("vorgehensmodell")
    phasen = [m for m in get_meilensteine(projekt_id, alle=True) if m.get("typ", "phase") == "phase"]
    phasen.sort(key=lambda m: (m.get("start_datum") or "9999", m.get("reihenfolge") or 0))

    if zeige_v_modell and vorgehensmodell == "V-Modell" and len(phasen) >= 3:
        st.markdown("##### 🔽🔼 V-Modell")
        _baue_v_modell_diagramm(phasen, heute)
        st.caption("Klassische Gantt-Ansicht darunter zur Datumsbearbeitung.")

    # Rendered das Plotly-Gantt direkt über den restlichen Projektdaten
    _baue_plotly_gantt(projekt_id)
    
    tasks_p = get_tasks(projekt_id=projekt_id)
    gesamt  = len(tasks_p)
    done    = sum(1 for t in tasks_p if t.get("status") == "Erledigt")
    pct     = int(done/gesamt*100) if gesamt > 0 else 0
    start   = safe_date(p.get("start_datum"))
    end     = safe_date(p.get("end_datum"))
    _gantt_balken(start, end, heute, p["name"], pct)

    st.divider()

    # Neuer Meilenstein
    with st.expander("➕ Neuen Meilenstein anlegen (Top-Level)"):
        with st.form("new_m_top"):
            c1, c2, c3 = st.columns([4,2,2])
            with c1: m_titel = st.text_input("Titel *")
            with c2: m_start = st.date_input("Start", value=None, key="nm_start")
            with c3: m_end   = st.date_input("Ende", value=None, key="nm_end")
            m_desc = st.text_area("Beschreibung", height=60)
            if st.form_submit_button("➕ Meilenstein anlegen", type="primary"):
                if m_titel:
                    create_meilenstein(projekt_id, m_titel, parent_id=None,
                                       beschreibung=m_desc,
                                       start_datum=str(m_start) if m_start else None,
                                       end_datum=str(m_end) if m_end else None)
                    st.success("✓"); st.rerun()

    # Meilensteine anzeigen
    meilensteine = get_meilensteine(projekt_id, parent_id=None)
    if not meilensteine:
        st.info("Noch keine Meilensteine. Jetzt anlegen ↑")
        return

    for m in meilensteine:
        fp = get_meilenstein_fortschritt(m["id"])
        m_start = safe_date(m.get("start_datum"))
        m_end   = safe_date(m.get("end_datum"))
        sub     = get_meilensteine(projekt_id, parent_id=m["id"])
        tasks_m = get_tasks_fuer_meilenstein(m["id"])

        status_icon = {"Erledigt":"✅","In Bearbeitung":"🔄","Offen":"📍"}.get(m["status"],"📍")
        ist_aktuell = bool(m_start and m_end and m_start <= heute <= m_end)
        gate_marker = " 🚦 Quality Gate" if m.get("ist_quality_gate") else ""

        with st.container(border=True):
            head1, head2 = st.columns([5, 1])
            with head1:
                aktuell_marker = ' <span style="background:#DCFCE7;color:#16A34A;border-radius:10px;padding:1px 8px;font-size:0.72rem;font-weight:700;">🟢 Wir sind hier</span>' if ist_aktuell else ""
                st.markdown(f"**{status_icon} {m['titel']}**{gate_marker} "
                            f"· {len(sub)} Untermeilensteine · {m['task_count']} Tasks"
                            f"{aktuell_marker}", unsafe_allow_html=True)
            with head2:
                if st.button("🔍 Öffnen", key=f"gm_{m['id']}", use_container_width=True,
                             type="primary"):
                    st.session_state.gantt_meilenstein_id = m["id"]
                    st.rerun()

            _gantt_balken(m_start, m_end, heute, m["titel"], fp["pct"])

            # Untermeilensteine kompakt
            if sub:
                for s in sub:
                    s_start = safe_date(s.get("start_datum"))
                    s_end   = safe_date(s.get("end_datum"))
                    sfp     = get_meilenstein_fortschritt(s["id"])
                    col1, col2, col3 = st.columns([4,2,1])
                    with col1:
                        st.caption(f"   └ 📍 {s['titel']} · {s['task_count']} Tasks")
                    with col2:
                        st.caption(f"{s_start.strftime('%d.%m') if s_start else '?'} → "
                                   f"{s_end.strftime('%d.%m.%y') if s_end else '?'}")
                    with col3:
                        st.progress(sfp["pct"]/100)

            # Status ändern
            with st.expander("⚙ Bearbeiten / Löschen"):
                ec1, ec2, ec3 = st.columns(3)
                with ec1:
                    ns = st.date_input("Start", value=m_start, key=f"ms_{m['id']}")
                with ec2:
                    ne = st.date_input("Ende", value=m_end, key=f"me_{m['id']}")
                with ec3:
                    nstatus = st.selectbox("Status", ["Offen","In Bearbeitung","Erledigt"],
                                            index=["Offen","In Bearbeitung","Erledigt"].index(
                                                m["status"]) if m["status"] in
                                                ["Offen","In Bearbeitung","Erledigt"] else 0,
                                            key=f"mst_{m['id']}")
                nc = st.columns(3)
                with nc[0]:
                    if st.button("💾 Speichern", key=f"msave_{m['id']}", use_container_width=True):
                        update_meilenstein(m["id"], status=nstatus,
                                           start_datum=str(ns) if ns else None,
                                           end_datum=str(ne) if ne else None)
                        st.rerun()
                with nc[2]:
                    if st.button("🗑 Löschen", key=f"mdel_{m['id']}", use_container_width=True):
                        delete_meilenstein(m["id"]); st.rerun()


# ─── Ansicht 3: Meilenstein-Detail ────────────────────────────────────────────
def _ansicht_meilenstein(meilenstein_id, projekt_id, heute):
    m = get_meilenstein(meilenstein_id)
    if not m:
        st.session_state.gantt_meilenstein_id = None; st.rerun(); return

    ebene = "Untermeilenstein" if m.get("parent_id") else "Meilenstein"
    fp = get_meilenstein_fortschritt(meilenstein_id)
    m_start = safe_date(m.get("start_datum"))
    m_end   = safe_date(m.get("end_datum"))

    st.subheader(f"📍 {m['titel']}")
    st.caption(f"{ebene} · Status: {m['status']}")
    _gantt_balken(m_start, m_end, heute, m["titel"], fp["pct"])

    tab1, tab2, tab3 = st.tabs(["📋 Tasks", "📍 Untermeilensteine", "⚙ Einstellungen"])

    with tab1:
        # Neuer Task
        with st.form(f"new_task_m_{meilenstein_id}"):
            tc1, tc2, tc3 = st.columns([4,1,1])
            with tc1: t_titel = st.text_input("Task-Titel *")
            with tc2: t_aw = st.selectbox("Aufwand", ["2m","15m","2h","4h+"])
            with tc3: t_pr = st.selectbox("Prio", [1,2,3], index=1,
                                           format_func=lambda x:{1:"🔴",2:"🟡",3:"⚪"}[x])
            if st.form_submit_button("➕ Task anlegen", type="primary"):
                if t_titel:
                    tid = create_task(projekt_id, t_titel, aufwandsklasse=t_aw, prioritaet=t_pr)
                    # Task mit Meilenstein verknüpfen
                    update_task(tid, meilenstein_id=meilenstein_id)
                    st.rerun()

        tasks = get_tasks_fuer_meilenstein(meilenstein_id)
        aufwand_icons = {"2m":"⚡","15m":"🕐","2h":"⏱","4h+":"🔴"}
        prio_icons    = {1:"🔴",2:"🟡",3:"⚪"}

        for grp, lbl in [("Fokus","▶ FOKUS"),("Warten_auf","⏳ WARTEN"),
                          ("Backlog","📥 BACKLOG"),("Erledigt","✓ ERLEDIGT")]:
            gt = [t for t in tasks if t.get("status") == grp]
            if not gt: continue
            st.caption(f"**{lbl}** ({len(gt)})")
            for t in gt:
                ca, cb, cc = st.columns([5,1,1])
                with ca:
                    aw = aufwand_icons.get(t.get("aufwandsklasse","15m"),"⏱")
                    pr = prio_icons.get(t.get("prioritaet",2),"🟡")
                    st.markdown(f"{pr} {aw} {t['titel']}")
                nxt = {"Backlog":"Fokus","Fokus":"Erledigt","Warten_auf":"Erledigt","Erledigt":"Backlog"}
                nxt_l = {"Backlog":"▶","Fokus":"✅","Warten_auf":"✅","Erledigt":"↩"}
                with cb:
                    if st.button(nxt_l[grp], key=f"mt2_{t['id']}"):
                        update_task(t["id"], status=nxt[grp]); st.rerun()
                with cc:
                    if st.button("🗑", key=f"md2_{t['id']}"):
                        delete_task(t["id"]); st.rerun()
            st.divider()

        if not tasks:
            st.info("Noch keine Tasks. Jetzt anlegen ↑")

    with tab2:
        # Nur Top-Level Meilensteine können Untermeilensteine haben
        if m.get("parent_id"):
            st.info("ℹ Untermeilensteine können keine weiteren Untermeilensteine haben.")
            return

        with st.form(f"new_sub_{meilenstein_id}"):
            sc1, sc2, sc3 = st.columns([4,2,2])
            with sc1: s_titel = st.text_input("Titel *")
            with sc2: s_start = st.date_input("Start", value=None, key="ns_start")
            with sc3: s_end   = st.date_input("Ende", value=None, key="ns_end")
            if st.form_submit_button("➕ Untermeilenstein anlegen", type="primary"):
                if s_titel:
                    create_meilenstein(projekt_id, s_titel, parent_id=meilenstein_id,
                                       start_datum=str(s_start) if s_start else None,
                                       end_datum=str(s_end) if s_end else None)
                    st.rerun()

        sub = get_meilensteine(projekt_id, parent_id=meilenstein_id)
        if not sub:
            st.info("Noch keine Untermeilensteine.")
        for s in sub:
            sfp = get_meilenstein_fortschritt(s["id"])
            s_start = safe_date(s.get("start_datum"))
            s_end   = safe_date(s.get("end_datum"))
            with st.container(border=True):
                col1, col2 = st.columns([5,1])
                with col1:
                    st.markdown(f"**📍 {s['titel']}** · {s['task_count']} Tasks")
                    _gantt_balken(s_start, s_end, heute, s["titel"], sfp["pct"])
                with col2:
                    if st.button("🔍", key=f"sub_{s['id']}", help="Öffnen"):
                        st.session_state.gantt_meilenstein_id = s["id"]
                        st.rerun()
                    if st.button("🗑", key=f"sdel_{s['id']}", help="Löschen"):
                        delete_meilenstein(s["id"]); st.rerun()

    with tab3:
        with st.form(f"edit_m_{meilenstein_id}"):
            e_titel = st.text_input("Titel", value=m["titel"])
            ec1, ec2, ec3 = st.columns(3)
            with ec1: e_start = st.date_input("Start", value=m_start)
            with ec2: e_end   = st.date_input("Ende", value=m_end)
            with ec3: e_status = st.selectbox("Status", ["Offen","In Bearbeitung","Erledigt"],
                                               index=["Offen","In Bearbeitung","Erledigt"].index(
                                                   m["status"]) if m["status"] in
                                                   ["Offen","In Bearbeitung","Erledigt"] else 0)
            e_desc = st.text_area("Beschreibung", value=m.get("beschreibung","") or "", height=60)
            if st.form_submit_button("💾 Speichern", type="primary"):
                update_meilenstein(meilenstein_id, titel=e_titel, status=e_status,
                                   start_datum=str(e_start) if e_start else None,
                                   end_datum=str(e_end) if e_end else None,
                                   beschreibung=e_desc)
                st.success("✓"); st.rerun()

        if st.button("🗑 Meilenstein löschen (alle Tasks bleiben erhalten)", type="secondary"):
            delete_meilenstein(meilenstein_id)
            st.session_state.gantt_meilenstein_id = None
            st.rerun()