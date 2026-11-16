"""Meine Tasks – List View im Teamwork-Stil"""
import streamlit as st
from dal import get_tasks, get_tasks_sortiert, get_all_projekte, create_task, update_task, delete_task, get_interaktionen, create_interaktion, get_stakeholder, berechne_dringlichkeit
from pages.helpers import topbar, aufwand_badge, status_badge, prio_badge, eskalation_badge, section_header, alert, task_card_list
from datetime import datetime


AUFWAND_OPTS = ["2m","15m","2h","4h+"]
STATUS_TABS  = [("Alle",""), ("Backlog","Backlog"), ("Fokus","Fokus"), ("Warten auf","Warten_auf"), ("Erledigt","Erledigt")]


def show():
    # --- TOPBAR ---
# Stelle sicher, dass topbar() einen validen String zurückgibt
    try:
        st.markdown(topbar("Meine Tasks", "Alle Tasks · List View"), unsafe_allow_html=True)
    except:
        st.title("Meine Tasks")

    # --- DATEN LADEN ---
    projekte = get_all_projekte(status_filter=["Begonnen","Unterbrochen"])
    stakeholder = get_stakeholder()
    tasks = get_tasks_sortiert() # Initiales Laden

    # --- QUICK ADD ---
    with st.expander("➕ Neuen Task anlegen"):
        with st.form("new_task_form"):
            t_titel = st.text_input("Titel *")
            nc1, nc2 = st.columns(2)
            with nc1:
                t_aufwand = st.selectbox("Aufwand", AUFWAND_OPTS, index=1)
            with nc2:
                t_prio = st.selectbox("Priorität", [1, 2, 3], index=1,
                                       format_func=lambda x: {1: "🔴 Hoch", 2: "🟡 Mittel", 3: "⚪ Niedrig"}[x])
            if st.form_submit_button("Anlegen"):
                if t_titel:
                    create_task(None, t_titel, aufwandsklasse=t_aufwand, prioritaet=t_prio)
                    st.rerun()

    # --- FILTER BAR ---
    st.markdown('<div style="background:white; border:1px solid #DDD; padding:15px; border-radius:10px;">', unsafe_allow_html=True)
    c1, c2, c3 = st.columns(3)
    with c1:
        f_status = st.selectbox("Status", ["Alle","Backlog","Fokus","Warten_auf","Erledigt"])
    with c2:
        f_prio = st.multiselect("Priorität", [1,2,3], format_func=lambda x: {1:"Hoch",2:"Mittel",3:"Niedrig"}[x])
    with c3:
        nur_krit = st.checkbox("Nur Kritisch")
    st.markdown('</div>', unsafe_allow_html=True)

    # --- FILTER LOGIK ---
    if f_status != "Alle":
        tasks = [t for t in tasks if t["status"] == f_status]
    if f_prio:
        tasks = [t for t in tasks if t["prioritaet"] in f_prio]
    if nur_krit:
        tasks = [t for t in tasks if t.get("kritischer_pfad")]

    # --- TASK LISTE ---
    st.write(f"**{len(tasks)} Tasks gefunden**")

    for t in tasks:
        # 1. Variablen vorbereiten
        t_id = t.get("id")
        t_farbe = t.get("projekt_farbe") or "#4461D7"
        t_titel = t.get("titel", "Unbenannter Task")
        t_status = t.get("status", "Backlog")
        t_prio = t.get("prioritaet", 2)
        
        # 2. Badges direkt hier generieren (Keine externen Funktionen nötig)
        prio_html = {
            1: '<span style="background:#FEE2E2; color:#DC2626; padding:2px 8px; border-radius:10px; font-size:10px;">🔴 HOCH</span>',
            2: '<span style="background:#FEF3C7; color:#D97706; padding:2px 8px; border-radius:10px; font-size:10px;">🟡 MITTEL</span>',
            3: '<span style="background:#F4F5FA; color:#9099BE; padding:2px 8px; border-radius:10px; font-size:10px;">⚪ NIEDRIG</span>'
        }.get(t_prio, "")

        status_html = f'<span style="background:#ECEEF5; color:#9099BE; padding:2px 8px; border-radius:10px; font-size:10px;">{t_status}</span>'

        # 3. HTML Karte rendern
        st.markdown(f"""
        <div style="background:white; border:1px solid #EEE; border-left:5px solid {t_farbe}; padding:12px; border-radius:8px; margin-bottom:5px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div style="font-weight:bold; color:#1E2235;">{t_titel}</div>
                    <div style="font-size:11px; color:#999;">◆ {t.get('projekt_name', 'Kein Projekt')}</div>
                </div>
                <div style="display:flex; gap:5px;">
                    {prio_html}
                    {status_html}
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        # 4. Aktionen
        with st.expander("Details & Aktionen"):
            col_a, col_b = st.columns(2)
            with col_a:
                if st.button("Erledigt ✅", key=f"done_{t_id}"):
                    update_task(t_id, status="Erledigt")
                    st.rerun()
            with col_b:
                if st.button("Löschen 🗑", key=f"del_{t_id}"):
                    delete_task(t_id)
                    st.rerun()