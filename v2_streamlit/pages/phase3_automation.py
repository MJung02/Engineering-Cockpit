"""Phase 3 – Automation: Smart Folder · File-Watcher · Outlook-Sync"""
import streamlit as st
from datetime import datetime, timedelta, timezone
from pathlib import Path
from pages.helpers import topbar, alert, section_header
from dal import get_all_projekte, update_projekt, get_tasks, create_interaktion
import phase3_automation as p3


# ── Status-Badges ─────────────────────────────────────────────────────────────
def _ok_badge(text):
    return f'<span style="background:#DCFCE7;color:#16A34A;border-radius:20px;padding:2px 10px;font-size:0.72rem;font-weight:700;">✓ {text}</span>'

def _warn_badge(text):
    return f'<span style="background:#FEF3C7;color:#D97706;border-radius:20px;padding:2px 10px;font-size:0.72rem;font-weight:700;">⚠ {text}</span>'

def _err_badge(text):
    return f'<span style="background:#FEE2E2;color:#DC2626;border-radius:20px;padding:2px 10px;font-size:0.72rem;font-weight:700;">✗ {text}</span>'


def show():
    st.markdown(topbar("Automation", "Smart Folder · File-Watcher · Outlook-Sync"), unsafe_allow_html=True)
    st.markdown('<div style="padding:0 28px;">', unsafe_allow_html=True)

    # Feature-Verfügbarkeit
    watchdog_ok = p3.WATCHDOG_OK
    outlook_ok  = p3.outlook_verfuegbar()

    # Status-Leiste
    st.markdown(f"""
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;">
        {_ok_badge("Smart Folder")}
        {_ok_badge("File-Watcher") if watchdog_ok else _warn_badge("File-Watcher (pip install watchdog)")}
        {_ok_badge("Outlook-Sync") if outlook_ok else _warn_badge("Outlook (Windows + win32com)")}
    </div>
    """, unsafe_allow_html=True)

    if not watchdog_ok or not outlook_ok:
        fehlend = []
        if not watchdog_ok: fehlend.append("<code>pip install watchdog</code> → File-Watcher")
        if not outlook_ok:  fehlend.append("<code>pip install pywin32</code> → Outlook-Sync (nur Windows)")
        st.markdown(alert(
            "Optionale Pakete für volle Phase-3-Funktionalität: " + " &nbsp;|&nbsp; ".join(fehlend),
            "info"
        ), unsafe_allow_html=True)

    tab1, tab2, tab3 = st.tabs(["📁 Smart Folder", "👁 File-Watcher", "📅 Outlook-Sync"])

    # ══════════════════════════════════════════════════════════════════════════
    # TAB 1: SMART FOLDER
    # ══════════════════════════════════════════════════════════════════════════
    with tab1:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Beim Anlegen eines neuen Projekts wird automatisch die komplette Ordnerstruktur
            (Anforderungen, Planung, Elektro/SPS, Protokolle …) erstellt und Vorlagen hineinkopiert.
        </div>
        """, unsafe_allow_html=True)

        projekte = get_all_projekte(status_filter=["Begonnen", "Unterbrochen"])

        # ── Ordner für bestehendes Projekt anlegen ────────────────────────────
        st.markdown(section_header("Ordnerstruktur für Projekt anlegen"), unsafe_allow_html=True)

        sf1, sf2 = st.columns([3, 2], gap="large")
        with sf1:
            proj_opts = {p["id"]: p["name"] for p in projekte}
            sel_proj_id = st.selectbox("Projekt wählen",
                                        list(proj_opts.keys()),
                                        format_func=lambda x: proj_opts.get(x, "–"))
            sel_proj = next((p for p in projekte if p["id"] == sel_proj_id), None)

            basis_pfad = st.text_input(
                "Basis-Pfad (Netzlaufwerk oder lokal)",
                value=sel_proj.get("ordner_pfad", "") or r"C:\Projekte" if sel_proj else r"C:\Projekte",
                placeholder=r"\\server\projekte  oder  C:\Projekte"
            )

            c_a, c_b = st.columns(2)
            with c_a:
                mit_kst = st.checkbox("Kostenstelle im Ordnernamen", value=True)
            with c_b:
                vorschau = st.checkbox("Vorschau Struktur", value=True)

            if st.button("📁 Ordnerstruktur anlegen", type="primary", use_container_width=True):
                if sel_proj and basis_pfad:
                    kst = sel_proj.get("kostenstelle", "") if mit_kst else ""
                    with st.spinner("Erstelle Ordner..."):
                        result = p3.create_projekt_ordner(basis_pfad, sel_proj["name"], kst)
                    if result["success"]:
                        # Pfad in DB speichern
                        update_projekt(sel_proj_id, ordner_pfad=result["pfad"])
                        st.success(f"✓ {result['erstellt']} Ordner erstellt unter: {result['pfad']}")
                        if result["vorlagen_kopiert"]:
                            st.info(f"📄 Vorlagen kopiert: {', '.join(result['vorlagen_kopiert'])}")
                        st.rerun()
                    else:
                        st.error(f"Fehler: {result['fehler']}")

        with sf2:
            if vorschau:
                st.markdown("""
                <div style="background:#F4F5FA;border:1px solid #E2E5F0;border-radius:8px;padding:14px;font-family:'Fira Code',monospace;font-size:0.72rem;color:#5B6488;line-height:1.9;">
                    <div style="font-weight:700;color:#1E2235;margin-bottom:8px;">Ordnerstruktur-Vorschau</div>
                    📁 KST_ProjektName/<br>
                    &nbsp;&nbsp;📄 _PROJEKT_INFO.txt<br>
                    &nbsp;&nbsp;📁 01_Anforderungen/<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;📄 Lasten_Pflichtenheft_Template.docx<br>
                    &nbsp;&nbsp;📁 02_Planung/<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;📁 Gantt/<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📄 Gantt_Template.xlsx<br>
                    &nbsp;&nbsp;📁 03_Konstruktion/<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;📁 CAD/ · 📁 Zeichnungen/<br>
                    &nbsp;&nbsp;📁 04_Elektro/<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;📁 E-Plan/ · 📁 SPS/<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📁 Programme/ · 📁 Datenpunkte/<br>
                    &nbsp;&nbsp;📁 05_Software/<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;📁 PowerApps/ · 📁 Skripte/<br>
                    &nbsp;&nbsp;📁 06_Protokolle/<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;📄 Protokoll_Template.docx<br>
                    &nbsp;&nbsp;📁 07_Abnahme/<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;📄 Abnahmeprotokoll_Template.docx<br>
                    &nbsp;&nbsp;📁 08_Archiv/
                </div>
                """, unsafe_allow_html=True)

        # ── Bestehende Projektordner ──────────────────────────────────────────
        st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
        st.markdown(section_header("Projektordner – Übersicht"), unsafe_allow_html=True)

        for p in projekte:
            pfad = p.get("ordner_pfad", "") or ""
            existiert = p3.ordner_existiert(pfad)
            farbe = p.get("farbe", "#4461D7") or "#4461D7"
            status_icon = "✓" if existiert else "○"
            status_col = "#16A34A" if existiert else "#9099BE"

            pa, pb = st.columns([5, 1])
            with pa:
                st.markdown(f"""
                <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                            padding:11px 16px;margin-bottom:6px;border-left:3px solid {farbe};
                            box-shadow:0 1px 3px rgba(30,34,53,0.06);">
                    <div style="display:flex;align-items:center;justify-content:space-between;">
                        <div style="font-weight:700;font-size:0.875rem;color:#1E2235;">{p['name']}</div>
                        <span style="color:{status_col};font-size:0.75rem;font-weight:700;">{status_icon} {'Ordner vorhanden' if existiert else 'Kein Ordner'}</span>
                    </div>
                    <div style="font-size:0.72rem;color:#9099BE;font-family:'Fira Code',monospace;margin-top:3px;">
                        {pfad if pfad else '– kein Pfad gesetzt –'}
                    </div>
                </div>
                """, unsafe_allow_html=True)
            with pb:
                if existiert and st.button("📂 Öffnen", key=f"open_{p['id']}", use_container_width=True):
                    import subprocess
                    try:
                        subprocess.Popen(f'explorer "{pfad}"')
                    except Exception as e:
                        st.error(str(e))

        # ── Ordner-Inhalt Browser ─────────────────────────────────────────────
        st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
        st.markdown(section_header("Ordner-Inhalt Browser"), unsafe_allow_html=True)

        browse_proj = st.selectbox("Projekt für Browser",
                                    [p for p in projekte if p3.ordner_existiert(p.get("ordner_pfad",""))],
                                    format_func=lambda p: p["name"],
                                    key="browse_proj")
        if browse_proj:
            inhalt = p3.ordner_inhalt(browse_proj["ordner_pfad"], tiefe=2)
            if inhalt:
                for item in inhalt[:40]:
                    einzug = "&nbsp;" * (item["ebene"] * 4)
                    icon = "📁" if item["ist_ordner"] else _datei_icon(item["suffix"])
                    groesse = f" · {item['groesse']//1024} KB" if item["groesse"] > 0 else ""
                    st.markdown(f"""
                    <div style="font-family:'Fira Code',monospace;font-size:0.75rem;color:#5B6488;
                                padding:2px 0;border-bottom:0.5px solid #F4F5FA;">
                        {einzug}{icon} <span style="color:#1E2235;font-weight:{'700' if item['ist_ordner'] else '400'};">{item['name']}</span>
                        <span style="color:#9099BE;">{groesse} {item['geaendert'] if not item['ist_ordner'] else ''}</span>
                    </div>
                    """, unsafe_allow_html=True)

    # ══════════════════════════════════════════════════════════════════════════
    # TAB 2: FILE-WATCHER
    # ══════════════════════════════════════════════════════════════════════════
    with tab2:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Der File-Watcher überwacht Projektordner im Hintergrund. Werden neue relevante Dateien
            abgelegt (PDF, E-Plan, TIA Portal, CAD …), erscheinen sie hier und können mit einem
            Klick ins Technik-Gedächtnis verknüpft werden.
        </div>
        """, unsafe_allow_html=True)

        if not watchdog_ok:
            st.markdown(alert(
                "File-Watcher benötigt das <code>watchdog</code> Paket: <code>pip install watchdog</code>",
                "warning"
            ), unsafe_allow_html=True)

        wm = p3.get_watcher_manager()
        aktive = wm.aktive_watcher()

        # Watcher starten/stoppen
        st.markdown(section_header("Watcher verwalten"), unsafe_allow_html=True)
        proj_mit_pfad = [p for p in get_all_projekte(status_filter=["Begonnen"])
                         if p3.ordner_existiert(p.get("ordner_pfad",""))]

        if not proj_mit_pfad:
            st.markdown(alert("Keine aktiven Projekte mit vorhandenem Ordnerpfad. Erst im Tab 'Smart Folder' Ordner anlegen.", "info"), unsafe_allow_html=True)
        else:
            for p in proj_mit_pfad:
                aktiv = p["id"] in aktive
                farbe = p.get("farbe","#4461D7") or "#4461D7"
                w1, w2 = st.columns([5, 1])
                with w1:
                    st.markdown(f"""
                    <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                                padding:10px 16px;margin-bottom:6px;border-left:3px solid {farbe};">
                        <div style="display:flex;align-items:center;justify-content:space-between;">
                            <div>
                                <span style="font-weight:700;font-size:0.875rem;color:#1E2235;">{p['name']}</span>
                                <span style="font-family:'Fira Code',monospace;font-size:0.68rem;color:#9099BE;margin-left:8px;">{p['ordner_pfad'][:50]}</span>
                            </div>
                            {'<span style="background:#DCFCE7;color:#16A34A;border-radius:10px;padding:1px 8px;font-size:0.68rem;font-weight:700;">● Live</span>' if aktiv else '<span style="color:#9099BE;font-size:0.72rem;">○ Inaktiv</span>'}
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
                with w2:
                    if aktiv:
                        if st.button("⏹ Stop", key=f"fw_stop_{p['id']}", use_container_width=True):
                            wm.stoppe_watcher(p["id"]); st.rerun()
                    else:
                        if st.button("▶ Start", key=f"fw_start_{p['id']}", use_container_width=True,
                                     disabled=not watchdog_ok):
                            ok = wm.starte_watcher(p["id"], p["ordner_pfad"])
                            if ok: st.success(f"Watcher gestartet für {p['name']}")
                            else:  st.error("Start fehlgeschlagen")
                            st.rerun()

        # Neue Dateien anzeigen
        st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
        st.markdown(section_header("Erkannte neue Dateien"), unsafe_allow_html=True)

        if st.button("🔄 Aktualisieren", use_container_width=False):
            st.rerun()

        neue = wm.neue_dateien
        if not neue:
            st.markdown("""
            <div style="text-align:center;padding:32px 0;color:#9099BE;font-size:0.84rem;">
                Keine neuen Dateien erkannt. Starte Watcher und lege Dateien im Projektordner ab.
            </div>
            """, unsafe_allow_html=True)
        else:
            for datei in reversed(neue[-20:]):
                proj_name = next((p["name"] for p in projekte if p["id"] == datei["projekt_id"]), "–")
                icon = _datei_icon(Path(datei["dateiname"]).suffix.lower())
                ts = datei["zeitstempel"][:16] if datei.get("zeitstempel") else ""
                d1, d2 = st.columns([5, 1])
                with d1:
                    st.markdown(f"""
                    <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                                padding:10px 16px;margin-bottom:6px;
                                border-left:3px solid {'#16A34A' if datei['aktion']=='neu' else '#D97706'};">
                        <div style="font-weight:700;font-size:0.875rem;color:#1E2235;">
                            {icon} {datei['dateiname']}
                        </div>
                        <div style="font-size:0.72rem;color:#9099BE;font-family:'Fira Code',monospace;margin-top:3px;">
                            {datei['typ']} · {proj_name} · {ts}
                            <span style="margin-left:8px;color:{'#16A34A' if datei['aktion']=='neu' else '#D97706'};">
                                {'● Neu' if datei['aktion']=='neu' else '✎ Geändert'}
                            </span>
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
                with d2:
                    if st.button("💾 Verknüpfen", key=f"fw_link_{datei['zeitstempel']}_{datei['dateiname']}", use_container_width=True):
                        create_interaktion(
                            inhalt=f"Neue Datei erkannt: {datei['dateiname']} ({datei['typ']})\nPfad: {datei['pfad']}",
                            projekt_id=datei["projekt_id"],
                            typ="Notiz",
                            tags=Path(datei["dateiname"]).suffix.lstrip(".")
                        )
                        wm.neue_dateien.remove(datei)
                        st.success("Verknüpft!"); st.rerun()

        # Info welche Endungen überwacht werden
        with st.expander("Überwachte Dateiendungen"):
            cols = st.columns(3)
            items = list(p3.RELEVANTE_ENDUNGEN.items())
            for i, (endung, beschreibung) in enumerate(items):
                with cols[i % 3]:
                    st.markdown(f'<div style="font-size:0.78rem;padding:2px 0;"><code>{endung}</code> <span style="color:#5B6488;">{beschreibung}</span></div>', unsafe_allow_html=True)

    # ══════════════════════════════════════════════════════════════════════════
    # TAB 3: OUTLOOK-SYNC
    # ══════════════════════════════════════════════════════════════════════════
    with tab3:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Lege Outlook-Termine für Meilensteine an, erstelle Follow-Up Mails direkt aus
            eskalierten Warten-auf-Tasks oder lies deine heutigen Termine für den Fokus-Check aus.
        </div>
        """, unsafe_allow_html=True)

        if not outlook_ok:
            st.markdown(alert(
                "Outlook-Sync benötigt Windows + <code>pip install pywin32</code>. "
                "Auf anderen Systemen: Mail-Entwürfe manuell in Outlook kopieren.",
                "warning"
            ), unsafe_allow_html=True)

        ot1, ot2, ot3 = st.columns(3)
        with ot1: st.markdown(_ok_badge("Outlook") if outlook_ok else _err_badge("Outlook"), unsafe_allow_html=True)
        with ot2: st.markdown(_ok_badge("Windows") if p3.IS_WINDOWS else _err_badge("Windows"), unsafe_allow_html=True)
        with ot3: st.markdown(_ok_badge("win32com") if p3.WIN32_OK else _err_badge("pywin32"), unsafe_allow_html=True)

        st.markdown("<div style='height:12px'></div>", unsafe_allow_html=True)

        ol_tab1, ol_tab2, ol_tab3 = st.tabs(["📅 Termin anlegen", "✉ Follow-Up Mail", "🌅 Heutige Termine"])

        # ── Outlook Termin anlegen ────────────────────────────────────────────
        with ol_tab1:
            with st.form("outlook_termin"):
                ot_a, ot_b = st.columns(2)
                with ot_a:
                    ot_betreff = st.text_input("Betreff *", placeholder="Meilenstein: Abnahme Maschine 1")
                    ot_datum   = st.date_input("Datum", value=datetime.now().date() + timedelta(days=7))
                    ot_zeit    = st.time_input("Uhrzeit", value=datetime.now().replace(hour=10, minute=0).time())
                    ot_dauer   = st.number_input("Dauer (Minuten)", min_value=15, max_value=480, value=60, step=15)
                with ot_b:
                    ot_ort     = st.text_input("Ort / Teams-Link", placeholder="Besprechungsraum 1 / Teams")
                    ot_wichtig = st.selectbox("Wichtigkeit", [0, 1, 2],
                                              format_func=lambda x: {0:"Niedrig",1:"Normal",2:"Hoch"}[x], index=1)
                    ot_erinnerung = st.number_input("Erinnerung (Minuten vorher)", value=15, min_value=0)
                    ot_proj    = st.selectbox("Verknüpftes Projekt",
                                              [None] + get_all_projekte(status_filter=["Begonnen"]),
                                              format_func=lambda x: "–" if x is None else x["name"][:35])
                ot_body = st.text_area("Beschreibung", height=80,
                                       placeholder="Agenda, Vorbereitung, Teilnehmer...")
                submitted = st.form_submit_button("📅 Termin in Outlook anlegen", type="primary",
                                                   disabled=not outlook_ok)
                if submitted:
                    dt_start = datetime.combine(ot_datum, ot_zeit)
                    proj_info = f"\nProjekt: {ot_proj['name']}" if ot_proj else ""
                    result = p3.erstelle_outlook_termin(
                        betreff=ot_betreff,
                        start=dt_start,
                        dauer_min=int(ot_dauer),
                        ort=ot_ort,
                        body=ot_body + proj_info,
                        erinnerung=int(ot_erinnerung),
                        wichtigkeit=int(ot_wichtig),
                    )
                    if result["success"]:
                        st.success(f"✓ Termin angelegt: {ot_betreff} am {ot_datum.strftime('%d.%m.%Y')} {ot_zeit.strftime('%H:%M')}")
                    else:
                        st.error(f"Fehler: {result['fehler']}")

        # ── Follow-Up Mail ────────────────────────────────────────────────────
        with ol_tab2:
            st.markdown("""
            <div style="font-size:0.82rem;color:#5B6488;margin-bottom:12px;">
                Generiert Follow-Up Mails aus eskalierten "Warten auf"-Tasks.
                Bei installiertem pywin32 öffnet sich Outlook direkt mit dem Entwurf.
            </div>
            """, unsafe_allow_html=True)

            from dal import get_tasks
            warten_tasks = get_tasks(status="Warten_auf")
            esk_tasks = [t for t in warten_tasks if (t.get("eskalationsstufe") or 0) >= 1]

            if not esk_tasks:
                st.markdown(alert("Keine eskalierten Tasks – alles grün!", "success"), unsafe_allow_html=True)
            else:
                from dal import get_stakeholder
                stakeholder = get_stakeholder()
                sh_mail_map = {s["name"]: s.get("email","") for s in stakeholder}

                for t in esk_tasks:
                    esk = t.get("eskalationsstufe",0)
                    person = t.get("warten_auf_person","–")
                    tage = 0
                    if t.get("warten_seit"):
                        try:
                            ws = datetime.fromisoformat(str(t["warten_seit"]))
                            tage = (datetime.now(timezone.utc) - ws).days
                        except Exception:
                            pass
                    esk_col = ["#9099BE","#D97706","#EA580C","#DC2626"][min(esk,3)]
                    esk_label = ["","Reminder","Follow-Up","ESKALATION"][min(esk,3)]
                    farbe = t.get("projekt_farbe","#4461D7") or "#4461D7"

                    with st.expander(f"{esk_label}: {t['titel'][:60]} → {person} ({tage}d)", expanded=(esk>=2)):
                        mail_an  = sh_mail_map.get(person, "")
                        betreff  = f"Follow-Up: {t['titel']}"
                        body     = (
                            f"Hallo {person},\n\n"
                            f"ich möchte kurz den Status zu folgendem Punkt erfragen:\n\n"
                            f"→ {t['titel']}\n"
                            f"(Projekt: {t.get('projekt_name','–')})\n\n"
                            f"Wir warten seit {tage} Tagen auf eine Rückmeldung.\n"
                            f"Könntest du mir den aktuellen Stand mitteilen?\n\n"
                            f"Vielen Dank und viele Grüße"
                        )
                        m1, m2 = st.columns(2)
                        with m1:
                            edit_an     = st.text_input("An (E-Mail)", value=mail_an, key=f"ml_an_{t['id']}")
                            edit_betr   = st.text_input("Betreff", value=betreff, key=f"ml_btr_{t['id']}")
                        with m2:
                            edit_body   = st.text_area("Text", value=body, height=140, key=f"ml_body_{t['id']}")
                        b1, b2 = st.columns(2)
                        with b1:
                            if st.button("📧 In Outlook öffnen", key=f"ml_open_{t['id']}", use_container_width=True,
                                         disabled=not outlook_ok):
                                result = p3.erstelle_followup_mail(edit_an, edit_betr, edit_body, senden=False)
                                if result["success"]: st.success("Outlook-Entwurf geöffnet!")
                                else: st.error(result["fehler"])
                        with b2:
                            if st.button("📋 Text kopieren", key=f"ml_copy_{t['id']}", use_container_width=True):
                                st.code(f"An: {edit_an}\nBetreff: {edit_betr}\n\n{edit_body}")

        # ── Heutige Termine ───────────────────────────────────────────────────
        with ol_tab3:
            st.markdown("""
            <div style="font-size:0.82rem;color:#5B6488;margin-bottom:12px;">
                Liest deine heutigen Outlook-Termine aus und berechnet deine verfügbare Maker-Time
                für den Fokus-Check.
            </div>
            """, unsafe_allow_html=True)

            if st.button("🔄 Termine laden", type="primary", disabled=not outlook_ok):
                with st.spinner("Lese Outlook-Kalender..."):
                    termine = p3.lese_heutige_termine()
                    maker   = p3.berechne_maker_time(termine)
                    st.session_state["outlook_termine"] = termine
                    st.session_state["maker_time"]      = maker

            termine = st.session_state.get("outlook_termine")
            maker   = st.session_state.get("maker_time")

            if not outlook_ok:
                # Manuelle Eingabe als Fallback
                st.markdown(alert("Outlook nicht verfügbar – manuelle Eingabe:", "info"), unsafe_allow_html=True)
                n_meetings = st.number_input("Meetings heute (Anzahl)", 0, 10, 2)
                meeting_min = st.number_input("Gesamtdauer Meetings (Minuten)", 0, 480, 90, step=15)
                freie_min = max(0, 8*60 - meeting_min)
                st.markdown(f"""
                <div style="background:#EEF1FC;border-radius:8px;padding:14px 16px;margin-top:12px;">
                    <div style="font-size:0.72rem;font-weight:700;color:#4461D7;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;">Geschätzte Maker-Time</div>
                    <div style="font-size:1.8rem;font-weight:500;color:#1E2235;font-family:'Fira Code',monospace;">{freie_min // 60}h {freie_min % 60}min</div>
                    <div style="font-size:0.78rem;color:#5B6488;margin-top:4px;">von 8h Arbeitstag – {n_meetings} Meetings ({meeting_min} Min)</div>
                </div>
                """, unsafe_allow_html=True)
            elif termine is not None:
                m1, m2, m3 = st.columns(3)
                m1.metric("Termine heute", maker["termine_heute"])
                m2.metric("Maker-Time gesamt", f"{maker['gesamt_maker_min']//60}h {maker['gesamt_maker_min']%60}min")
                m3.metric("Freie Blöcke", len(maker["freie_slots"]))

                if maker["freie_slots"]:
                    st.markdown(section_header("Freie Zeitblöcke"), unsafe_allow_html=True)
                    for slot in maker["freie_slots"]:
                        farbe = "#16A34A" if slot["dauer_min"] >= 90 else "#D97706" if slot["dauer_min"] >= 45 else "#9099BE"
                        st.markdown(f"""
                        <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                                    padding:10px 16px;margin-bottom:6px;border-left:3px solid {farbe};">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <div style="font-weight:700;color:#1E2235;">{slot['von']} – {slot['bis']}</div>
                                <div style="font-size:0.78rem;color:{farbe};font-weight:700;">{slot['dauer_min']} Min {'→ Deep Work' if slot['dauer_min']>=90 else '→ Quick-Wins'}</div>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)

                if termine:
                    st.markdown(section_header("Termine heute"), unsafe_allow_html=True)
                    for t in termine:
                        start = str(t["start"])[11:16]
                        ende  = str(t["ende"])[11:16]
                        st.markdown(f"""
                        <div style="background:#F4F5FA;border-radius:6px;padding:8px 14px;margin-bottom:4px;
                                    font-size:0.82rem;display:flex;gap:12px;align-items:center;">
                            <span style="font-family:'Fira Code',monospace;color:#4461D7;font-weight:700;flex-shrink:0;">{start}–{ende}</span>
                            <span style="color:#1E2235;font-weight:600;">{t['betreff']}</span>
                            {f'<span style="color:#9099BE;font-size:0.72rem;">{t["ort"]}</span>' if t.get("ort") else ""}
                        </div>
                        """, unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)


def _datei_icon(suffix: str) -> str:
    m = {".pdf":"📄",".docx":"📝",".xlsx":"📊",".pptx":"📊",
         ".dwg":"📐",".dxf":"📐",".step":"🔩",".stp":"🔩",
         ".zap":"⚡",".elp":"⚡",".ap16":"💻",".ap17":"💻",
         ".ap18":"💻",".ap19":"💻",".s7p":"💻",".zip":"🗜",".msapp":"📱"}
    return m.get(suffix, "📎")
