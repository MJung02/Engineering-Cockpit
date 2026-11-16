"""Wochenbericht – Export, Zeiterfassung, Benachrichtigungen"""
import streamlit as st
from datetime import datetime, timedelta
from pages.helpers import topbar, alert, section_header
from dal import (get_all_projekte, get_tasks, get_tasks_sortiert,
                 get_interaktionen, get_zeitbuchungen, get_zeitstatistik,
                 starte_zeiterfassung, stoppe_zeiterfassung,
                 setze_wiederkehrend, get_rollensaetze, erfasse_zeitbuchung_manuell,
                 get_rolle_fuer_person_projekt)
from auth import get_users
import wochenbericht as wb_mod
import benachrichtigungen as notif_mod


def _min_to_str(minuten: int) -> str:
    if minuten is None or minuten == 0:
        return "–"
    h = minuten // 60
    m = minuten % 60
    return f"{h}h {m}min" if h > 0 else f"{m}min"


def show():
    st.markdown(topbar("Wochenbericht & Tools", "Export · Zeiterfassung · Benachrichtigungen"), unsafe_allow_html=True)
    st.markdown('<div style="padding:0 28px;">', unsafe_allow_html=True)

    tab1, tab2, tab3, tab4 = st.tabs(["📊 Wochenbericht", "⏱ Zeiterfassung", "🔄 Wiederkehrend", "🔔 Benachrichtigungen"])

    # ══════════════════════════════════════════════════════════════════════════
    # TAB 1: WOCHENBERICHT EXPORT
    # ══════════════════════════════════════════════════════════════════════════
    with tab1:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Generiert einen vollständigen Statusbericht für Jour-fixe, Montagsbriefings
            oder Projektabstimmungen. Excel mit 4 Sheets: Übersicht, Eskalationen, alle Tasks, Logbuch.
        </div>
        """, unsafe_allow_html=True)

        if not wb_mod.OPENPYXL_OK:
            st.markdown(alert("Excel-Export benötigt: <code>pip install openpyxl</code>", "warning"), unsafe_allow_html=True)

        # Vorschau
        projekte  = get_all_projekte(status_filter=["Begonnen","Unterbrochen"])
        tasks     = get_tasks_sortiert()
        interakt  = get_interaktionen(limit=200)

        heute = datetime.now()
        kw    = heute.isocalendar()[1]
        kw_start = heute - timedelta(days=heute.weekday())

        # KPI-Vorschau
        fokus_n    = sum(1 for t in tasks if t["status"] == "Fokus")
        warten_n   = sum(1 for t in tasks if t["status"] == "Warten_auf")
        erledigt_n = sum(1 for t in tasks if t["status"] == "Erledigt")
        esk_n      = sum(1 for t in tasks if (t.get("eskalationsstufe") or 0) >= 2)

        st.markdown(f"""
        <div style="background:#1B1F3B;border-radius:10px;padding:20px 24px;margin-bottom:20px;">
            <div style="font-size:0.72rem;font-weight:700;color:#4461D7;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">
                Wochenbericht KW {kw} · {kw_start.strftime('%d.%m.')} – {(kw_start+timedelta(days=6)).strftime('%d.%m.%Y')}
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:12px;">
                <div style="text-align:center;"><div style="font-size:1.6rem;font-weight:700;color:#4461D7;font-family:'Fira Code',monospace;">{len(projekte)}</div><div style="font-size:0.7rem;color:#8890B8;">Projekte</div></div>
                <div style="text-align:center;"><div style="font-size:1.6rem;font-weight:700;color:#00D4FF;font-family:'Fira Code',monospace;">{fokus_n}</div><div style="font-size:0.7rem;color:#8890B8;">Im Fokus</div></div>
                <div style="text-align:center;"><div style="font-size:1.6rem;font-weight:700;color:{'#DC2626' if esk_n > 0 else '#16A34A'};font-family:'Fira Code',monospace;">{esk_n}</div><div style="font-size:0.7rem;color:#8890B8;">Eskaliert</div></div>
                <div style="text-align:center;"><div style="font-size:1.6rem;font-weight:700;color:#16A34A;font-family:'Fira Code',monospace;">{erledigt_n}</div><div style="font-size:0.7rem;color:#8890B8;">Erledigt</div></div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        # Export-Buttons
        ec1, ec2 = st.columns(2)
        with ec1:
            if wb_mod.OPENPYXL_OK:
                if st.button("📥 Excel-Bericht herunterladen", type="primary", use_container_width=True):
                    with st.spinner("Erstelle Excel-Bericht..."):
                        try:
                            excel_bytes = wb_mod.erstelle_wochenbericht_excel(projekte, tasks, interakt)
                            dateiname = f"EC_Wochenbericht_KW{kw}_{heute.strftime('%Y%m%d')}.xlsx"
                            st.download_button(
                                label="💾 Jetzt herunterladen",
                                data=excel_bytes,
                                file_name=dateiname,
                                mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                use_container_width=True
                            )
                        except Exception as e:
                            st.error(f"Fehler: {e}")
            else:
                st.button("📥 Excel (pip install openpyxl)", disabled=True, use_container_width=True)
        with ec2:
            if st.button("📄 HTML-Bericht (Fallback)", use_container_width=True):
                html = wb_mod.erstelle_html_bericht(projekte, tasks)
                dateiname = f"EC_Bericht_KW{kw}.html"
                st.download_button(
                    label="💾 HTML herunterladen",
                    data=html.encode("utf-8"),
                    file_name=dateiname,
                    mime="text/html",
                    use_container_width=True
                )

        # Eskalations-Preview
        esk_tasks = [t for t in tasks if (t.get("eskalationsstufe") or 0) >= 1]
        if esk_tasks:
            st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
            st.markdown(section_header(f"⚠ Eskalationen ({len(esk_tasks)})", None), unsafe_allow_html=True)
            for t in esk_tasks[:5]:
                esk = t.get("eskalationsstufe",0)
                esk_col = ["#9099BE","#D97706","#EA580C","#DC2626"][min(esk,3)]
                st.markdown(f"""
                <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-left:3px solid {esk_col};
                            border-radius:8px;padding:10px 16px;margin-bottom:6px;">
                    <div style="font-weight:700;font-size:0.875rem;">{t['titel'][:70]}</div>
                    <div style="font-size:0.72rem;color:#9099BE;margin-top:3px;">
                        ⏳ {t.get('warten_auf_person','?')} · {t.get('projekt_name','–')}
                    </div>
                </div>
                """, unsafe_allow_html=True)

    # ══════════════════════════════════════════════════════════════════════════
    # TAB 2: ZEITERFASSUNG
    # ══════════════════════════════════════════════════════════════════════════
    with tab2:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Starte und stoppe Zeiterfassung je Task. Das System vergleicht Plan-Aufwand
            (Aufwandsklasse) mit dem tatsächlichen Ist-Aufwand.
        </div>
        """, unsafe_allow_html=True)

        # Aktive Zeiterfassung anzeigen
        if "aktive_zeitbuchung" in st.session_state:
            buch = st.session_state["aktive_zeitbuchung"]
            start_dt = datetime.fromisoformat(buch["gestartet"])
            vergangen = int((datetime.now() - start_dt).total_seconds() / 60)

            st.markdown(f"""
            <div style="background:#EEF1FC;border:2px solid #4461D7;border-radius:10px;
                        padding:16px 20px;margin-bottom:16px;animation:pulse 2s infinite;">
                <div style="font-size:0.72rem;font-weight:700;color:#4461D7;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:4px;">
                    ● LÄUFT – Zeiterfassung aktiv
                </div>
                <div style="font-size:1rem;font-weight:700;color:#1E2235;margin-bottom:4px;">{buch['task_titel']}</div>
                <div style="font-size:0.875rem;color:#4461D7;font-family:'Fira Code',monospace;">{vergangen} Minuten</div>
            </div>
            """, unsafe_allow_html=True)

            notiz = st.text_input(
                "Tätigkeit (was genau wurde gemacht) *",
                placeholder="z.B. SPS programmiert, Daten XYZ ausgewertet, Dokumentation erstellt...",
                key="zeit_notiz",
                help="Wird im Tätigkeitsnachweis je Projekt (Tab 'Budget') mit Person, Rolle und Stunden aufgeführt – wichtig für Förder-/Forschungsprojekt-Nachweise."
            )
            sc1, sc2 = st.columns(2)
            with sc1:
                if st.button("⏹ Stoppen", type="primary", use_container_width=True):
                    dauer = stoppe_zeiterfassung(buch["id"], notiz)
                    st.success(f"✓ {_min_to_str(dauer)} gebucht für '{buch['task_titel'][:40]}'")
                    del st.session_state["aktive_zeitbuchung"]
                    st.rerun()
            with sc2:
                if st.button("✕ Abbrechen", use_container_width=True):
                    del st.session_state["aktive_zeitbuchung"]
                    st.rerun()
        else:
            # Task auswählen und starten
            st.markdown(section_header("Zeiterfassung starten"), unsafe_allow_html=True)
            fokus_tasks = get_tasks(status="Fokus")
            alle_off = get_tasks(status=["Backlog","Fokus","Warten_auf"])

            zt1, zt2, zt3 = st.columns([3,1.4,1])
            with zt1:
                task_opts = {t["id"]: f"{t['titel'][:50]} ({(t.get('projekt_name') or '–')[:20]})" for t in alle_off}
                sel_zt = st.selectbox("Task", list(task_opts.keys()),
                                       format_func=lambda x: task_opts.get(x,"–"),
                                       label_visibility="collapsed")
            with zt2:
                rollen_opts = [r["rolle"] for r in get_rollensaetze()]
                sel_rolle = st.selectbox("Rolle", rollen_opts, label_visibility="collapsed") if rollen_opts else None
            with zt3:
                if st.button("▶ Starten", type="primary", use_container_width=True) and sel_zt:
                    t = next((t for t in alle_off if t["id"] == sel_zt), None)
                    current_user = st.session_state.get("user") or {}
                    buch_id = starte_zeiterfassung(sel_zt, t["projekt_id"] if t else None,
                                                    user_id=current_user.get("id"), rolle=sel_rolle)
                    st.session_state["aktive_zeitbuchung"] = {
                        "id": buch_id,
                        "task_titel": t["titel"] if t else "–",
                        "gestartet": datetime.now().isoformat(),
                    }
                    st.rerun()

        # ── Manuelle/rückwirkende Zeiterfassung ──────────────────────────────
        # Deckt ab, was der Live-Timer nicht kann: Meetings inkl. Vor-/Nach-
        # bereitung ohne eigenen Kanban-Task, und Zeiten, die man nachträglich
        # für Kolleg:innen einträgt statt nur für sich selbst.
        st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
        st.markdown(section_header("Zeit manuell nachtragen"), unsafe_allow_html=True)
        st.caption("Für Meetings, Vor-/Nachbereitung oder andere Aufgaben ohne Kanban-Task – "
                   "und um Zeiten für Kolleg:innen einzutragen, nicht nur für dich selbst.")
        alle_projekte_manuell = get_all_projekte(status_filter=["Begonnen", "Unterbrochen"])
        alle_user = get_users()
        rollen_opts_manuell = [r["rolle"] for r in get_rollensaetze()]
        if not alle_projekte_manuell:
            st.info("Kein aktives Projekt vorhanden.")
        else:
            # Projekt/Person bewusst ausserhalb eines st.form, damit die
            # Rolle-Vorbelegung unten sofort auf die aktuelle Auswahl reagiert
            # (st.form wuerde Aenderungen erst nach dem Absenden sehen).
            mc1, mc2 = st.columns(2)
            with mc1:
                proj_opts_m = {p["id"]: p["name"] for p in alle_projekte_manuell}
                sel_proj_m = st.selectbox("Projekt", list(proj_opts_m.keys()),
                                           format_func=lambda x: proj_opts_m[x], key="manuell_projekt")
                user_opts_m = {u["id"]: u["display_name"] for u in alle_user}
                current_user_m = st.session_state.get("user") or {}
                default_uid = current_user_m.get("id")
                uid_list = list(user_opts_m.keys())
                sel_user_m = st.selectbox("Person", uid_list,
                                           index=uid_list.index(default_uid) if default_uid in uid_list else 0,
                                           format_func=lambda x: user_opts_m[x], key="manuell_person")
            with mc2:
                if rollen_opts_manuell:
                    gespeicherte_rolle_m = get_rolle_fuer_person_projekt(sel_proj_m, sel_user_m)
                    sel_rolle_m = st.selectbox(
                        "Rolle", rollen_opts_manuell,
                        index=rollen_opts_manuell.index(gespeicherte_rolle_m) if gespeicherte_rolle_m in rollen_opts_manuell else 0,
                        key=f"manuell_rolle_{sel_proj_m}_{sel_user_m}"
                    )
                else:
                    sel_rolle_m = None
                sel_datum_m = st.date_input("Datum", value=datetime.now().date())
            with st.form("manuelle_zeitbuchung"):
                dauer_h = st.number_input("Dauer (Stunden)", min_value=0.0, step=0.25, value=1.0)
                taetigkeit_m = st.text_input(
                    "Tätigkeit (was genau wurde gemacht) *",
                    placeholder="z.B. Kickoff-Meeting vorbereitet und durchgeführt, Projektbesprechung Nachbereitung..."
                )
                if st.form_submit_button("➕ Zeit erfassen", type="primary"):
                    if taetigkeit_m.strip() and dauer_h > 0:
                        erfasse_zeitbuchung_manuell(
                            sel_proj_m, sel_user_m, sel_rolle_m,
                            dauer_min=int(round(dauer_h * 60)),
                            notiz=taetigkeit_m.strip(),
                            datum=datetime.combine(sel_datum_m, datetime.min.time())
                        )
                        st.success(f"✓ {dauer_h:.2f}h für {user_opts_m[sel_user_m]} erfasst!")
                        st.rerun()
                    else:
                        st.warning("Bitte Dauer und Tätigkeit angeben.")

        # Statistik
        st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
        st.markdown(section_header("Ist-Aufwand je Projekt"), unsafe_allow_html=True)
        stats = get_zeitstatistik()

        if stats["projekte"]:
            for p in stats["projekte"][:8]:
                gesamt_h = (p.get("gesamt_min") or 0) // 60
                gesamt_m = (p.get("gesamt_min") or 0) % 60
                st.markdown(f"""
                <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                            padding:10px 16px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
                    <div style="font-weight:700;font-size:0.875rem;">{p.get('projekt_name','–')}</div>
                    <div style="font-family:'Fira Code',monospace;font-size:0.82rem;color:#4461D7;font-weight:700;">
                        {gesamt_h}h {gesamt_m}min <span style="color:#9099BE;font-size:0.7rem;">({p.get('buchungen',0)} Buchungen)</span>
                    </div>
                </div>
                """, unsafe_allow_html=True)

            # Plan vs. Ist je Aufwandsklasse
            if stats["aufwand_stats"]:
                st.markdown(section_header("Plan vs. Ist je Aufwandsklasse"), unsafe_allow_html=True)
                for a in stats["aufwand_stats"]:
                    if not a.get("anzahl"): continue
                    abw = a.get("abweichung_pct", 0)
                    abw_col = "#DC2626" if abw > 50 else "#D97706" if abw > 20 else "#16A34A"
                    st.markdown(f"""
                    <div style="display:flex;justify-content:space-between;align-items:center;
                                padding:7px 0;border-bottom:1px solid #F4F5FA;font-size:0.82rem;">
                        <span style="font-weight:700;color:#1E2235;">{a.get('aufwandsklasse','–')}</span>
                        <span style="color:#5B6488;">{a.get('anzahl',0)} Tasks</span>
                        <span style="color:#9099BE;">Plan: {_min_to_str(a.get('plan_min',0))}</span>
                        <span style="color:#4461D7;">Ist: {_min_to_str(a.get('ist_min',0))}</span>
                        <span style="color:{abw_col};font-weight:700;">{'+' if abw > 0 else ''}{abw:.0f}%</span>
                    </div>
                    """, unsafe_allow_html=True)
        else:
            st.markdown(alert("Noch keine Zeitbuchungen. Starte die Zeiterfassung für einen Task.", "info"), unsafe_allow_html=True)

    # ══════════════════════════════════════════════════════════════════════════
    # TAB 3: WIEDERKEHRENDE TASKS
    # ══════════════════════════════════════════════════════════════════════════
    with tab3:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Definiere Tasks die sich automatisch wiederholen – z.B. wöchentlicher SPS-Status-Check
            oder monatliches Backup. Nach dem Erledigen wird der nächste Termin automatisch gesetzt.
        </div>
        """, unsafe_allow_html=True)

        alle_tasks = get_tasks(status=["Backlog","Fokus","Erledigt"])
        task_map   = {t["id"]: t for t in alle_tasks}

        # Wiederkehrend setzen
        st.markdown(section_header("Wiederkehrung für Task setzen"), unsafe_allow_html=True)
        wc1, wc2, wc3 = st.columns([3,2,1])
        with wc1:
            sel_wt = st.selectbox("Task", [t["id"] for t in alle_tasks],
                                   format_func=lambda x: f"{task_map[x]['titel'][:50]}" if x in task_map else str(x),
                                   label_visibility="collapsed")
        with wc2:
            intervall = st.selectbox("Wiederholung",
                                      ["– keine –","taeglich","woechentlich","monatlich"],
                                      format_func=lambda x: {"– keine –":"– keine –","taeglich":"Täglich","woechentlich":"Wöchentlich","monatlich":"Monatlich"}.get(x,x),
                                      label_visibility="collapsed")
        with wc3:
            if st.button("💾 Setzen", type="primary", use_container_width=True):
                iv = None if intervall == "– keine –" else intervall
                setze_wiederkehrend(sel_wt, iv)
                st.success("✓ Gespeichert"); st.rerun()

        # Übersicht wiederkehrender Tasks
        st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
        st.markdown(section_header("Aktive Wiederholungen"), unsafe_allow_html=True)

        wt_tasks = [t for t in get_tasks() if t.get("wiederkehrend")]
        if not wt_tasks:
            st.markdown(alert("Keine wiederkehrenden Tasks konfiguriert.", "info"), unsafe_allow_html=True)
        else:
            iv_icon = {"taeglich":"📅 Täglich","woechentlich":"📅 Wöchentlich","monatlich":"📅 Monatlich"}
            for t in wt_tasks:
                farbe = t.get("projekt_farbe","#4461D7") or "#4461D7"
                iv = t.get("wiederkehrend","")
                naechste = t.get("naechste_faelligkeit","–") or "–"
                st.markdown(f"""
                <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                            padding:11px 16px;margin-bottom:6px;border-left:3px solid {farbe};">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <div style="font-weight:700;font-size:0.875rem;color:#1E2235;">{t['titel'][:65]}</div>
                            <div style="font-size:0.72rem;color:{farbe};margin-top:3px;">◆ {t.get('projekt_name','–')}</div>
                        </div>
                        <div style="text-align:right;flex-shrink:0;margin-left:12px;">
                            <div style="background:#EEF1FC;color:#4461D7;border-radius:10px;padding:2px 10px;font-size:0.72rem;font-weight:700;">{iv_icon.get(iv,iv)}</div>
                            <div style="font-size:0.68rem;color:#9099BE;margin-top:3px;">Nächste: {naechste}</div>
                        </div>
                    </div>
                </div>
                """, unsafe_allow_html=True)

    # ══════════════════════════════════════════════════════════════════════════
    # TAB 4: BENACHRICHTIGUNGEN
    # ══════════════════════════════════════════════════════════════════════════
    with tab4:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Windows Desktop-Benachrichtigungen bei Eskalationen – auch wenn das Cockpit
            nicht im Vordergrund ist.
        </div>
        """, unsafe_allow_html=True)

        verfuegbar = notif_mod.benachrichtigung_verfuegbar()
        checker    = notif_mod.get_checker()

        # Status
        st.markdown(f"""
        <div style="background:{'#F0FDF4' if verfuegbar else '#FEF3C7'};border:1px solid {'#BBF7D0' if verfuegbar else '#FDE68A'};
                    border-radius:10px;padding:16px 20px;margin-bottom:16px;border-left:4px solid {'#16A34A' if verfuegbar else '#D97706'};">
            <div style="font-weight:700;font-size:0.9rem;color:#1E2235;margin-bottom:4px;">
                {'✓ Benachrichtigungen verfügbar' if verfuegbar else '⚠ plyer nicht installiert'}
            </div>
            <div style="font-size:0.78rem;color:#5B6488;">
                {'Hintergrund-Checker läuft: ' + ('✓ Aktiv' if checker.laeuft else '○ Gestoppt') if verfuegbar else 'pip install plyer  →  App neu starten'}
            </div>
        </div>
        """, unsafe_allow_html=True)

        nc1, nc2, nc3 = st.columns(3)
        with nc1:
            if st.button("🧪 Test-Benachrichtigung", use_container_width=True,
                          disabled=not verfuegbar):
                ok = notif_mod.teste_benachrichtigung()
                if ok: st.success("Benachrichtigung gesendet!")
                else:  st.error("Fehler beim Senden")
        with nc2:
            if st.button("▶ Checker starten", use_container_width=True,
                          disabled=not verfuegbar or checker.laeuft):
                notif_mod.starte_checker()
                st.success("Checker gestartet"); st.rerun()
        with nc3:
            if st.button("⏹ Checker stoppen", use_container_width=True,
                          disabled=not checker.laeuft):
                checker.stoppe()
                st.rerun()

        # Einstellungen
        st.markdown(section_header("Einstellungen"), unsafe_allow_html=True)
        st.markdown(f"""
        <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;padding:14px 16px;font-size:0.82rem;line-height:2;color:#5B6488;">
            <b>Prüfintervall:</b> alle {notif_mod.CHECK_INTERVAL_MIN} Minuten<br>
            <b>Aktiviert:</b> {'Ja' if notif_mod.NOTIF_ENABLED else 'Nein'}<br>
            <b>Windows:</b> {'Ja' if notif_mod.IS_WINDOWS else 'Nein'}<br>
            <b>plyer:</b> {'Installiert ✓' if notif_mod.PLYER_OK else 'Nicht installiert – pip install plyer'}<br>
            <br>
            Einstellungen in <code>.env</code>:<br>
            <code>NOTIF_ENABLED=true</code><br>
            <code>NOTIF_INTERVAL_MIN=30</code>
        </div>
        """, unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)
