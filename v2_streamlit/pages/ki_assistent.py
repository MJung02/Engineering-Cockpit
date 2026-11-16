"""KI-Assistent – Phase 2: Mail-Parser · Fokus-Check · Context-Switch-Tracker"""
import streamlit as st
from datetime import datetime
from pages.helpers import topbar, alert, aufwand_badge, prio_badge, status_badge, section_header
from dal import (get_tasks, get_all_projekte, create_task, create_interaktion,
                 update_task, get_dashboard_stats)
import ki_service


def _ki_status_badge():
    if ki_service.ki_verfuegbar():
        return '<span style="background:#DCFCE7;color:#16A34A;border-radius:20px;padding:2px 10px;font-size:0.72rem;font-weight:700;">✓ KI aktiv</span>'
    return '<span style="background:#FEE2E2;color:#DC2626;border-radius:20px;padding:2px 10px;font-size:0.72rem;font-weight:700;">⚠ KI nicht konfiguriert</span>'


def show():
    st.markdown(topbar("KI-Assistent", "Mail-Parser · Fokus-Check · Context-Switch"), unsafe_allow_html=True)
    st.markdown('<div style="padding:0 28px;">', unsafe_allow_html=True)

    # KI-Status Banner
    if not ki_service.ki_verfuegbar():
        st.markdown(alert(
            "KI-Funktionen benötigen einen Anthropic API Key. Trage <b>ANTHROPIC_API_KEY=sk-ant-...</b> in deine .env ein und starte die App neu.",
            "warning"
        ), unsafe_allow_html=True)

    st.markdown(f'<div style="margin-bottom:16px;">{_ki_status_badge()}</div>', unsafe_allow_html=True)

    tab1, tab2, tab3 = st.tabs(["🌅 Fokus-Check", "📧 Mail-Parser", "🔄 Context-Switch"])

    # ══════════════════════════════════════════════════════════════════════════
    # TAB 1: MORGENDLICHER FOKUS-CHECK
    # ══════════════════════════════════════════════════════════════════════════
    with tab1:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Starte deinen Tag mit einem KI-generierten Fokus-Check. Der Assistent analysiert deine
            aktuellen Tasks, Eskalationen und Quick-Wins und gibt dir eine priorisierte Empfehlung.
        </div>
        """, unsafe_allow_html=True)

        # Aktueller Stand (immer sichtbar)
        stats = get_dashboard_stats()
        m1, m2, m3, m4 = st.columns(4)
        m1.metric("Im Fokus", stats["fokus_tasks"])
        m2.metric("Warten auf", stats["warten_tasks"])
        m3.metric("Eskaliert", stats["eskaliert"])
        m4.metric("Quick-Wins", stats["quick_wins"])

        st.markdown("<div style='height:12px'></div>", unsafe_allow_html=True)

        col_btn, col_info = st.columns([1, 3])
        with col_btn:
            generate = st.button("🌅 Fokus-Check starten", type="primary", use_container_width=True,
                                  disabled=not ki_service.ki_verfuegbar())
        with col_info:
            uhrzeit = datetime.now().strftime("%H:%M")
            datum   = datetime.now().strftime("%A, %d.%m.%Y")
            st.markdown(f'<div style="padding:10px 0;font-size:0.82rem;color:#5B6488;">{datum} · {uhrzeit} · Analysiert alle aktiven Tasks und Eskalationen</div>', unsafe_allow_html=True)

        if generate or st.session_state.get("fokus_result"):
            if generate:
                with st.spinner("KI analysiert deine Tasks..."):
                    try:
                        tasks_fokus  = get_tasks(status="Fokus")
                        tasks_warten = get_tasks(status="Warten_auf")
                        eskaliert    = [t for t in tasks_warten if (t.get("eskalationsstufe") or 0) >= 2]
                        quick_wins   = [t for t in get_tasks(status="Backlog") if t["aufwandsklasse"] in ("2m","15m")]
                        projekte     = get_all_projekte(status_filter=["Begonnen"])

                        result = ki_service.fokus_check(
                            tasks_fokus, tasks_warten, eskaliert, quick_wins, projekte
                        )
                        st.session_state["fokus_result"] = result
                        st.session_state["fokus_tasks_ref"] = {t["id"]: t for t in tasks_fokus + quick_wins}
                    except Exception as e:
                        st.error(f"Fehler: {e}")
                        st.session_state.pop("fokus_result", None)

            result = st.session_state.get("fokus_result")
            if result:
                # Tages-Motto
                st.markdown(f"""
                <div style="background:linear-gradient(135deg,#EEF1FC 0%,#F0F4FF 100%);
                            border:1px solid #C7D2F5;border-radius:12px;padding:20px 24px;margin-bottom:20px;">
                    <div style="font-size:0.72rem;font-weight:700;color:#4461D7;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">
                        Tages-Fokus
                    </div>
                    <div style="font-size:1.2rem;font-weight:800;color:#1E2235;margin-bottom:12px;">
                        {result.get('tages_fokus','')}
                    </div>
                    <div style="font-size:0.875rem;color:#5B6488;line-height:1.6;">
                        {result.get('begruessung','')}
                    </div>
                </div>
                """, unsafe_allow_html=True)

                # Eskalations-Alarm
                if result.get("eskalations_alarm") and result["eskalations_alarm"] != "null":
                    st.markdown(alert(result["eskalations_alarm"], "danger"), unsafe_allow_html=True)

                c_left, c_right = st.columns([3, 2], gap="large")

                with c_left:
                    # Fokus-Empfehlung
                    st.markdown(section_header("KI-Empfehlung für heute"), unsafe_allow_html=True)
                    st.markdown(f"""
                    <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:10px;
                                padding:16px 20px;box-shadow:0 1px 3px rgba(30,34,53,0.06);
                                border-left:4px solid #4461D7;">
                        <div style="font-size:0.875rem;color:#1E2235;line-height:1.7;">
                            {result.get('fokus_empfehlung','')}
                        </div>
                    </div>
                    """, unsafe_allow_html=True)

                    # Top 3 Tasks
                    st.markdown("<div style='height:12px'></div>", unsafe_allow_html=True)
                    st.markdown(section_header("Empfohlene Top-3 für heute"), unsafe_allow_html=True)
                    tasks_ref = st.session_state.get("fokus_tasks_ref", {})
                    for i, item in enumerate(result.get("wichtigste_3", [])[:3], 1):
                        t_id = item.get("task_id")
                        t    = tasks_ref.get(t_id)
                        titel = t["titel"] if t else f"Task #{t_id}"
                        farbe = t.get("projekt_farbe","#4461D7") if t else "#4461D7"
                        st.markdown(f"""
                        <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                                    padding:12px 16px;margin-bottom:8px;
                                    box-shadow:0 1px 3px rgba(30,34,53,0.06);
                                    border-left:3px solid {farbe};">
                            <div style="display:flex;align-items:flex-start;gap:10px;">
                                <div style="background:#EEF1FC;color:#4461D7;border-radius:50%;
                                            width:24px;height:24px;display:flex;align-items:center;
                                            justify-content:center;font-weight:800;font-size:0.75rem;flex-shrink:0;">
                                    {i}
                                </div>
                                <div style="flex:1;">
                                    <div style="font-weight:700;font-size:0.875rem;color:#1E2235;">{titel}</div>
                                    <div style="font-size:0.78rem;color:#5B6488;margin-top:3px;">{item.get('grund','')}</div>
                                </div>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                        if t:
                            if st.button(f"▶ In Fokus", key=f"fk_fokus_{t_id}"):
                                update_task(t_id, status="Fokus"); st.rerun()

                with c_right:
                    st.markdown(section_header("⚡ Quick-Win für heute"), unsafe_allow_html=True)
                    if result.get("quick_win_tipp"):
                        st.markdown(f"""
                        <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;
                                    padding:16px 20px;border-left:3px solid #16A34A;">
                            <div style="font-size:0.875rem;color:#14532D;line-height:1.6;">
                                ⚡ {result['quick_win_tipp']}
                            </div>
                        </div>
                        """, unsafe_allow_html=True)

                if st.button("🔄 Neuen Check generieren"):
                    st.session_state.pop("fokus_result", None)
                    st.rerun()

    # ══════════════════════════════════════════════════════════════════════════
    # TAB 2: MAIL-PARSER
    # ══════════════════════════════════════════════════════════════════════════
    with tab2:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Füge eine E-Mail, Teams-Nachricht oder Notiz ein. Die KI erkennt automatisch
            Deadlines, Personen, mögliche Tasks und schlägt Aufwandsklassen vor.
        </div>
        """, unsafe_allow_html=True)

        projekte = get_all_projekte(status_filter=["Begonnen","Unterbrochen"])
        proj_map = {p["id"]: p for p in projekte}

        c1, c2 = st.columns([5, 3], gap="large")
        with c1:
            mail_text = st.text_area(
                "E-Mail / Text einf&uuml;gen",
                height=200,
                placeholder="""Beispiel:

Von: hendrik@firma.de
Betreff: Maschine 3 - Dringend!

Hi, 

die Produktion meldet dass Maschine 3 seit gestern Abend Fehler F041 wirft.
Bitte bis Freitag 14:00 Uhr anschauen. 
Manuel braucht noch die Datenpunktliste für die SPS-Umprogrammierung.

VG Hendrik""",
                label_visibility="collapsed"
            )
            analyse_btn = st.button("🔍 KI analysieren", type="primary",
                                     disabled=not ki_service.ki_verfuegbar() or not mail_text)

        with c2:
            st.markdown("""
            <div style="background:#F4F5FA;border-radius:10px;padding:16px;font-size:0.8rem;color:#5B6488;line-height:1.8;">
                <div style="font-weight:700;color:#1E2235;margin-bottom:8px;">Was die KI erkennt:</div>
                📋 <b>Tasks</b> mit Aufwandsklasse &amp; Priorität<br>
                👥 <b>Personen</b> die erwähnt werden<br>
                📅 <b>Deadlines</b> und Dringlichkeit<br>
                ⏳ <b>Warten auf</b> – wer muss antworten?<br>
                🏷 <b>Tags</b> für das Technik-Gedächtnis<br>
                📁 <b>Typ</b> (Mail/Notiz/Call/Lösung)
            </div>
            """, unsafe_allow_html=True)

        if analyse_btn and mail_text:
            with st.spinner("KI analysiert den Text..."):
                try:
                    result = ki_service.parse_mail(mail_text)
                    st.session_state["mail_parse_result"] = result
                    st.session_state["mail_parse_text"]   = mail_text
                except Exception as e:
                    st.error(f"Analyse-Fehler: {e}")
                    st.session_state.pop("mail_parse_result", None)

        if st.session_state.get("mail_parse_result"):
            result = st.session_state["mail_parse_result"]
            orig_text = st.session_state.get("mail_parse_text","")
            st.markdown("---")

            # Zusammenfassung
            st.markdown(f"""
            <div style="background:#EEF1FC;border:1px solid #C7D2F5;border-radius:8px;
                        padding:12px 16px;margin-bottom:16px;">
                <div style="font-size:0.72rem;font-weight:700;color:#4461D7;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:4px;">KI-Zusammenfassung</div>
                <div style="font-size:0.875rem;color:#1E2235;">{result.get('zusammenfassung','')}</div>
            </div>
            """, unsafe_allow_html=True)

            ra, rb, rc = st.columns(3)
            with ra:
                if result.get("personen"):
                    st.markdown(f"""
                    <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;padding:12px 14px;">
                        <div style="font-size:0.72rem;font-weight:700;color:#9099BE;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">👥 Personen</div>
                        {''.join(f'<div style="font-size:0.85rem;color:#1E2235;padding:2px 0;">• {p}</div>' for p in result['personen'])}
                    </div>
                    """, unsafe_allow_html=True)
            with rb:
                if result.get("warten_auf") and result["warten_auf"] != "null":
                    st.markdown(f"""
                    <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:12px 14px;">
                        <div style="font-size:0.72rem;font-weight:700;color:#D97706;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">⏳ Warten auf</div>
                        <div style="font-size:0.875rem;font-weight:700;color:#92400E;">{result['warten_auf']}</div>
                    </div>
                    """, unsafe_allow_html=True)
            with rc:
                if result.get("deadlines"):
                    dl = result["deadlines"][0]
                    dring_col = {"hoch":"#DC2626","mittel":"#D97706","niedrig":"#16A34A"}.get(dl.get("dringlichkeit","mittel"),"#D97706")
                    st.markdown(f"""
                    <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:12px 14px;">
                        <div style="font-size:0.72rem;font-weight:700;color:{dring_col};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">📅 Deadline</div>
                        <div style="font-size:0.85rem;color:#1E2235;">{dl.get('text','')}</div>
                        {f'<div style="font-size:0.72rem;color:{dring_col};font-weight:700;margin-top:4px;">{dl["datum"]}</div>' if dl.get("datum") else ""}
                    </div>
                    """, unsafe_allow_html=True)

            # Erkannte Tasks
            if result.get("tasks"):
                st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
                st.markdown(section_header(f"📋 Erkannte Tasks ({len(result['tasks'])})", None), unsafe_allow_html=True)

                for i, task in enumerate(result["tasks"]):
                    ta, tb = st.columns([4, 2])
                    with ta:
                        st.markdown(f"""
                        <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                                    padding:11px 16px;box-shadow:0 1px 3px rgba(30,34,53,0.06);">
                            <div style="font-weight:700;font-size:0.875rem;color:#1E2235;">{task['titel']}</div>
                            <div style="display:flex;gap:6px;margin-top:6px;">
                                {aufwand_badge(task['aufwandsklasse'])} {prio_badge(task['prioritaet'])}
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                    with tb:
                        proj_sel_key = f"mp_proj_{i}"
                        if proj_sel_key not in st.session_state:
                            st.session_state[proj_sel_key] = projekte[0]["id"] if projekte else None

                        proj_opts = {p["id"]: p["name"][:28] for p in projekte}
                        sel_p = st.selectbox("Projekt", list(proj_opts.keys()),
                                              format_func=lambda x: proj_opts.get(x,"–"),
                                              key=proj_sel_key, label_visibility="collapsed")
                        if st.button(f"➕ Task anlegen", key=f"mp_add_{i}", use_container_width=True, type="primary"):
                            new_id = create_task(
                                sel_p, task["titel"],
                                aufwandsklasse=task["aufwandsklasse"],
                                prioritaet=task["prioritaet"],
                                warten_auf_person=result.get("warten_auf") if result.get("warten_auf") != "null" else None
                            )
                            # Original-Text als Logbucheintrag speichern
                            create_interaktion(
                                orig_text[:2000],
                                task_id=new_id, projekt_id=sel_p,
                                typ=result.get("typ","Mail"),
                                person=", ".join(result.get("personen",[])),
                                tags=", ".join(result.get("tags",[]))
                            )
                            st.success(f"✓ Task '{task['titel'][:40]}' angelegt!")

            # Tags + Im Gedächtnis speichern
            st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
            tags_str = ", ".join(result.get("tags", []))
            col_save1, col_save2 = st.columns([3, 1])
            with col_save1:
                if tags_str:
                    st.markdown(f'<div style="font-size:0.8rem;color:#5B6488;">🏷 Tags: <b>{tags_str}</b></div>', unsafe_allow_html=True)
            with col_save2:
                save_proj = st.selectbox("Zu Projekt", [None]+[p["id"] for p in projekte],
                                          format_func=lambda x: "–" if x is None else proj_map.get(x,{}).get("name","?")[:25],
                                          key="mp_save_proj", label_visibility="collapsed")
                if st.button("💾 Im Gedächtnis speichern", use_container_width=True):
                    create_interaktion(
                        orig_text[:3000],
                        projekt_id=save_proj,
                        typ=result.get("typ","Mail"),
                        person=", ".join(result.get("personen",[])),
                        tags=tags_str
                    )
                    st.success("✓ Im Technik-Gedächtnis gespeichert!")
                    st.session_state.pop("mail_parse_result", None)
                    st.rerun()

    # ══════════════════════════════════════════════════════════════════════════
    # TAB 3: CONTEXT-SWITCH-TRACKER
    # ══════════════════════════════════════════════════════════════════════════
    with tab3:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Der Context-Switch-Tracker überwacht, wie viele verschiedene Projekte du in der letzten
            Stunde bearbeitest hast. Zu viele Wechsel kosten mentale Energie – die App warnt dich.
        </div>
        """, unsafe_allow_html=True)

        # Tracker aus Session-State
        if "context_tracker" not in st.session_state:
            st.session_state["context_tracker"] = ki_service.ContextSwitchTracker(
                max_switches=3, fenster_minuten=60
            )
        tracker = st.session_state["context_tracker"]

        # Analyse
        analyse = tracker.analyse()

        # Status-Card
        wechsel = analyse["anzahl_switches"]
        warn = analyse["warnung"]
        status_farbe = "#DC2626" if warn else ("#D97706" if wechsel >= 2 else "#16A34A")
        status_bg    = "#FEE2E2" if warn else ("#FFFBEB" if wechsel >= 2 else "#DCFCE7")
        status_text  = "KRITISCH" if warn else ("ERHÖHT" if wechsel >= 2 else "GUT")

        st.markdown(f"""
        <div style="background:{status_bg};border:1px solid {status_farbe}33;border-radius:12px;
                    padding:20px 24px;margin-bottom:20px;border-left:4px solid {status_farbe};">
            <div style="display:flex;align-items:center;justify-content:space-between;">
                <div>
                    <div style="font-size:0.72rem;font-weight:700;color:{status_farbe};text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">
                        Kontext-Wechsel Status
                    </div>
                    <div style="font-size:1.8rem;font-weight:800;color:#1E2235;font-family:'Fira Code',monospace;">
                        {wechsel} Wechsel
                    </div>
                    <div style="font-size:0.82rem;color:#5B6488;margin-top:4px;">
                        in den letzten 60 Minuten · {len(analyse['eindeutige_projekte'])} Projekte
                    </div>
                </div>
                <div style="background:{status_farbe};color:#fff;border-radius:8px;padding:8px 16px;
                            font-weight:800;font-size:0.85rem;">
                    {status_text}
                </div>
            </div>
            {f'<div style="margin-top:12px;font-size:0.84rem;color:{status_farbe};font-weight:600;">{analyse["warnung_text"]}</div>' if warn else ""}
        </div>
        """, unsafe_allow_html=True)

        # Aktive Projekte anzeigen
        if analyse["eindeutige_projekte"]:
            st.markdown(f"""
            <div style="font-size:0.78rem;color:#5B6488;margin-bottom:8px;">
                Bearbeitete Projekte: <b>{" → ".join(analyse['eindeutige_projekte'][:5])}</b>
            </div>
            """, unsafe_allow_html=True)

        # Manuell Task-Bearbeitung erfassen
        st.markdown(section_header("Projekt-Bearbeitung erfassen"), unsafe_allow_html=True)
        st.markdown("""
        <div style="font-size:0.78rem;color:#9099BE;margin-bottom:8px;">
            Klicke wenn du mit der Arbeit an einem Projekt/Task beginnst. Der Tracker registriert den Wechsel.
        </div>
        """, unsafe_allow_html=True)

        projekte = get_all_projekte(status_filter=["Begonnen"])
        cols_p = st.columns(min(len(projekte), 3))
        for i, p in enumerate(projekte[:6]):
            with cols_p[i % 3]:
                farbe = p.get("farbe","#4461D7") or "#4461D7"
                st.markdown(f"""
                <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                            padding:10px 14px;margin-bottom:8px;border-left:3px solid {farbe};">
                    <div style="font-weight:700;font-size:0.82rem;color:#1E2235;">{p['name'][:35]}</div>
                </div>
                """, unsafe_allow_html=True)
                if st.button(f"▶ Starte {p['name'][:20]}", key=f"ct_start_{p['id']}", use_container_width=True):
                    tracker.task_gestartet(p["id"], p["name"])
                    st.success(f"✓ {p['name'][:30]} erfasst")
                    st.rerun()

        # Reset
        st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
        cb1, cb2 = st.columns([1,3])
        with cb1:
            if st.button("🔄 Tracker zurücksetzen", use_container_width=True):
                tracker.reset()
                st.success("Tracker zurückgesetzt."); st.rerun()

        # Hinweis: automatische Integration
        st.markdown("""
        <div style="background:#F4F5FA;border-radius:8px;padding:14px 16px;margin-top:16px;font-size:0.8rem;color:#5B6488;line-height:1.7;">
            <div style="font-weight:700;color:#1E2235;margin-bottom:4px;">💡 Automatische Erfassung</div>
            In einer zukünftigen Version erfasst der Tracker Wechsel automatisch,
            sobald du im Kanban oder in der Task-Liste einen Task einer anderen Projekts anklickst –
            ohne manuelles Erfassen.
        </div>
        """, unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)
