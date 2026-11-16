"""Kanban Board – Teamwork.com Stil"""
import streamlit as st
from datetime import datetime, timezone, timedelta
from dal import get_tasks, get_tasks_sortiert, get_all_projekte, get_stakeholder, create_task, update_task, delete_task, get_interaktionen, create_interaktion, berechne_dringlichkeit
from auth import get_users
from pages.helpers import topbar, aufwand_badge, status_badge, prio_badge, eskalation_badge, alert


def show():
    st.markdown(topbar("Kanban Board", "Alle Projekte · Board View"), unsafe_allow_html=True)

    st.markdown('<div style="padding:0 28px;">', unsafe_allow_html=True)

    projekte = get_all_projekte(status_filter=["Begonnen","Unterbrochen"])
    proj_map = {p["id"]: p for p in projekte}
    stakeholder = get_stakeholder()

    # ── Toolbar ───────────────────────────────────────────────────────────────
    st.markdown("""
    <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:10px;
                padding:12px 16px;margin-bottom:16px;box-shadow:0 1px 3px rgba(30,34,53,0.06);">
    """, unsafe_allow_html=True)
    tc1, tc2, tc3, tc4, tc5 = st.columns([3,2,2,1,1])
    with tc1:
        proj_opts = {0:"Alle Projekte"} | {p["id"]:p["name"][:35] for p in projekte}
        sel_proj = st.selectbox("Projekt", list(proj_opts.keys()), format_func=lambda x: proj_opts[x], label_visibility="collapsed")
    with tc2:
        person_namen = sorted({t["warten_auf_person"] for t in get_tasks(status="Warten_auf") if t.get("warten_auf_person")})
        if "kb_filter_person" not in st.session_state: st.session_state["kb_filter_person"] = 0
    sel_person = st.selectbox("Person", ["Alle"]+person_namen, label_visibility="collapsed", key="kb_filter_person")
    with tc3:
        sel_aufwand = st.multiselect("Aufwand", ["2m","15m","2h","4h+"], placeholder="Alle Aufwände",
                                   label_visibility="collapsed", key="kb_filter_aufwand")
    with tc4:
        nur_krit = st.checkbox("🔗 Krit.", help="Nur kritischer Pfad", key="kb_filter_krit")
    with tc5:
        if st.button("➕ Task", type="primary", use_container_width=True):
            st.session_state["kb_new_task"] = True
    st.markdown("</div>", unsafe_allow_html=True)

    # Quick-Add Formular
    if st.session_state.get("kb_new_task"):
        with st.form("kb_new_form"):
            nc1, nc2, nc3, nc4 = st.columns([4,2,1,1])
            with nc1: n_titel = st.text_input("Titel *")
            with nc2:
                n_proj = st.selectbox("Projekt", [p["id"] for p in projekte],
                                       format_func=lambda x: proj_map[x]["name"][:30] if x in proj_map else "–")
            with nc3: n_aufwand = st.selectbox("Aufwand", ["2m","15m","2h","4h+"])
            with nc4: n_prio = st.selectbox("Prio", [1,2,3], index=1,
                                              format_func=lambda x:{1:"🔴",2:"🟡",3:"⚪"}[x])
            cols = st.columns([1,1])
            with cols[0]:
                if st.form_submit_button("➕ Anlegen", type="primary"):
                    if n_titel:
                        create_task(n_proj, n_titel, aufwandsklasse=n_aufwand, prioritaet=n_prio)
                        st.session_state["kb_new_task"] = False
                        st.rerun()
            with cols[1]:
                if st.form_submit_button("✕ Abbrechen"):
                    st.session_state["kb_new_task"] = False
                    st.rerun()

    # ── Tasks laden & filtern ─────────────────────────────────────────────────
    tasks = get_tasks_sortiert(projekt_id=sel_proj if sel_proj != 0 else None,
                             warten_auf_person=sel_person if sel_person != "Alle" else None)
    if sel_aufwand:
        tasks = [t for t in tasks if t["aufwandsklasse"] in sel_aufwand]
    if nur_krit:
        tasks = [t for t in tasks if t.get("kritischer_pfad")]
    # Score bereits durch get_tasks_sortiert gesetzt; Ergebnis nach Filter neu sortieren
    tasks.sort(key=lambda t: -t.get("_score", berechne_dringlichkeit(t)))

    # ── 4 Kanban Spalten ──────────────────────────────────────────────────────
    col_cfg = [
        ("Backlog",    "📥 Backlog",    "#9099BE", "#F4F5FA"),
        ("Fokus",      "▶ Fokus",       "#4461D7", "#EEF1FC"),
        ("Warten_auf", "⏳ Warten auf", "#D97706", "#FFFBEB"),
        ("Erledigt",   "✓ Erledigt",   "#16A34A", "#F0FDF4"),
    ]

    kb_cols = st.columns(4, gap="small")
    for col_widget, (status_key, col_label, col_color, col_bg) in zip(kb_cols, col_cfg):
        col_tasks = [t for t in tasks if t["status"] == status_key]
        with col_widget:
            # Spalten-Header
            st.markdown(f"""
            <div style="background:{col_bg};border:1px solid #E2E5F0;border-radius:10px;
                        padding:12px 14px;margin-bottom:10px;border-top:3px solid {col_color};">
                <div style="display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-size:0.78rem;font-weight:800;text-transform:uppercase;
                                letter-spacing:0.08em;color:{col_color};">{col_label}</span>
                    <span style="background:{'rgba(0,0,0,0.08)'};color:{col_color};border-radius:10px;
                                padding:1px 8px;font-size:0.72rem;font-weight:700;">{len(col_tasks)}</span>
                </div>
            </div>
            """, unsafe_allow_html=True)

            # Erledigt-Tasks, die vor >2 Monaten abgeschlossen wurden, wandern
            # in ein aufklappbares Archiv statt die Spalte dauerhaft zu fuellen.
            archiv_tasks = []
            if status_key == "Erledigt":
                grenze = datetime.now(timezone.utc) - timedelta(days=60)
                archiv_tasks = [t for t in col_tasks if t.get("erledigt_am") and
                                datetime.fromisoformat(str(t["erledigt_am"])) < grenze]
                sichtbare_tasks = [t for t in col_tasks if t not in archiv_tasks]
            else:
                sichtbare_tasks = col_tasks

            # Task Cards
            def render_card(t):
                farbe = t.get("projekt_farbe","#4461D7") or "#4461D7"
                esk = t.get("eskalationsstufe", 0) or 0
                krit = " 🔗" if t.get("kritischer_pfad") else ""
                esk_top = ["","2px solid #D97706","2px solid #EA580C","2px solid #DC2626"][min(esk,3)]

                wp_html = ""
                if t.get("warten_auf_person"):
                    try:
                        ws = datetime.fromisoformat(str(t["warten_seit"]))
                        tage = (datetime.now(timezone.utc) - ws).days
                        esk_col = ["#9099BE","#D97706","#EA580C","#DC2626"][min(esk,3)]
                        wp_html = f'<div style="font-size:0.7rem;color:{esk_col};font-family:\'Fira Code\',monospace;margin-top:4px;">⏳ {t["warten_auf_person"]} · {tage}d</div>'
                    except Exception:
                        wp_html = f'<div style="font-size:0.7rem;color:#D97706;">⏳ {t["warten_auf_person"]}</div>'

                faellig_html = ""
                if t.get("faellig_am"):
                    faellig_html = f'<span style="font-size:0.65rem;color:#9099BE;font-family:\'Fira Code\',monospace;">📅 {t["faellig_am"]}</span>'

                st.markdown(f"""
                <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                            padding:12px 14px;margin-bottom:8px;
                            box-shadow:0 1px 4px rgba(30,34,53,0.08);
                            border-left:3px solid {farbe};
                            {f'border-top:{esk_top};' if esk>0 else ''}">
                    <div style="font-size:0.84rem;font-weight:700;color:#1E2235;line-height:1.4;margin-bottom:8px;">
                        {t['titel'][:65]}{krit}
                    </div>
                    <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:6px;">
                        {aufwand_badge(t['aufwandsklasse'])}
                        {prio_badge(t['prioritaet'])}
                    </div>
                    <div style="font-size:0.7rem;color:{farbe};font-weight:600;">◆ {(t.get('projekt_name') or '–')[:22]}</div>
                    {wp_html}
                    {f'<div style="margin-top:4px;">{faellig_html}</div>' if t.get("faellig_am") else ""}
                </div>
                """, unsafe_allow_html=True)

                # Aktionen
                with st.expander("···", expanded=False):
                    next_map = {
                        "Backlog":    [("▶ Fokus","Fokus"),    ("⏳ Warten","Warten_auf")],
                        "Fokus":      [("✅ Erledigt","Erledigt"), ("↩ Backlog","Backlog")],
                        "Warten_auf": [("✅ Erledigt","Erledigt"), ("▶ Fokus","Fokus")],
                        "Erledigt":   [("↩ Backlog","Backlog")],
                    }
                    btns = next_map.get(status_key, [])
                    b_cols = st.columns(len(btns)) if btns else [st.container()]
                    for col, (lbl, nst) in zip(b_cols, btns):
                        with col:
                            if st.button(lbl, key=f"kb_{lbl}_{t['id']}", use_container_width=True):
                                update_task(t["id"], status=nst); st.rerun()

                    # Person setzen (echte Mitarbeiter:innen -> user_id-FK, externe
                    # Kontakte/Abteilungen -> Freitext-Fallback, siehe Phase A Plan)
                    user_by_name = {u["display_name"]: u["id"] for u in get_users()}
                    externe_namen = sorted({s["name"] for s in stakeholder} - set(user_by_name.keys()))
                    alle_namen = sorted(user_by_name.keys()) + externe_namen
                    wp_def = t.get("warten_auf_person") or "–"
                    wp_sel = st.selectbox("⏳ Warten auf", ["–"]+alle_namen,
                                           index=0 if wp_def=="–" else (["–"]+alle_namen).index(wp_def) if wp_def in alle_namen else 0,
                                           key=f"kb_wp_{t['id']}")
                    if st.button("Person setzen", key=f"kb_swp_{t['id']}", use_container_width=True):
                        if wp_sel == "–":
                            update_task(t["id"], warten_auf_person=None, warten_auf_user_id=None)
                        elif wp_sel in user_by_name:
                            update_task(t["id"], warten_auf_user_id=user_by_name[wp_sel],
                                        warten_auf_person=None, status="Warten_auf")
                        else:
                            update_task(t["id"], warten_auf_person=wp_sel,
                                        warten_auf_user_id=None, status="Warten_auf")
                        st.rerun()

                    # Notiz
                    notiz = st.text_area("📝 Schnellnotiz", key=f"kb_n_{t['id']}", height=65, placeholder="Notiz, Lösung, Mail...")
                    nt_cols = st.columns(2)
                    with nt_cols[0]:
                        ntyp = st.selectbox("Typ", ["Notiz","Loesung","Mail","Snippet"], key=f"kb_nt_{t['id']}")
                    with nt_cols[1]:
                        if st.button("💾 Speichern", key=f"kb_sn_{t['id']}", use_container_width=True):
                            if notiz:
                                create_interaktion(notiz, task_id=t["id"], projekt_id=t["projekt_id"], typ=ntyp)
                                st.success("✓"); st.rerun()

                    # Letzte Einträge
                    eintr = get_interaktionen(task_id=t["id"], limit=2)
                    for i in eintr:
                        icon = {"Notiz":"📝","Loesung":"💡","Mail":"📧","Snippet":"🔧"}.get(i["typ"],"📝")
                        st.markdown(f"""
                        <div style="background:#F4F5FA;border-radius:5px;padding:6px 10px;margin-top:4px;font-size:0.75rem;color:#5B6488;">
                            {icon} {i['inhalt'][:80]}
                        </div>
                        """, unsafe_allow_html=True)

                    if st.button("🗑 Löschen", key=f"kb_del_{t['id']}", use_container_width=True):
                        delete_task(t["id"]); st.rerun()

            for t in sichtbare_tasks:
                render_card(t)

            if archiv_tasks:
                with st.expander(f"🗄 Archiv ({len(archiv_tasks)}, älter als 2 Monate erledigt)"):
                    for t in archiv_tasks:
                        render_card(t)

    st.markdown('</div>', unsafe_allow_html=True)
