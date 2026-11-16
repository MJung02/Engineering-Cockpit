"""Projekte – Teamwork.com Stil"""
from datetime import date
import streamlit as st
from dal import (get_all_projekte, get_projekt, create_projekt, update_projekt,
                 delete_projekt, get_tasks, create_task, delete_task, update_task,
                 get_interaktionen, create_interaktion,
                 get_projekt_ressourcen, set_projekt_ressource, get_gesamtauslastung,
                 get_projekt_initialisierung, upsert_projekt_initialisierung,
                 berechne_einstufung, empfehle_vorgehensmodell,
                 get_alte_projekte_fuer_lessons_learned,
                 create_risiko, get_risiken, update_risiko, delete_risiko,
                 set_raci_eintrag, get_raci_matrix,
                 get_projekt_dokument, upsert_projekt_dokument,
                 get_projekt_positionen, create_projekt_position, delete_projekt_position,
                 get_user_stories, create_user_story, update_user_story, delete_user_story,
                 get_kontextfaktoren, create_kontextfaktor, update_kontextfaktor, delete_kontextfaktor,
                 get_stakeholder,
                 get_meilensteine, get_meilenstein, update_meilenstein, delete_meilenstein,
                 get_tasks_fuer_meilenstein, erzeuge_meilenstein_struktur, get_sprints,
                 get_meilenstein_fortschritt, get_projekt_budget_status, get_zeitbuchungen,
                 create_beleg, get_belege, get_beleg, delete_beleg, BELEG_KATEGORIEN,
                 create_schaetzung, get_schaetzungen, delete_schaetzung,
                 create_berichtspflicht, get_berichtspflichten, delete_berichtspflicht,
                 berechne_faelligkeiten, reiche_berichtsnachweis_ein,
                 get_berichtsnachweise, get_berichtsnachweis,
                 upsert_rechnungskalkulation, get_rechnungskalkulation, generiere_rechnungstext,
                 get_rollensaetze, get_rolle_fuer_person_projekt,
                 get_einstellung, get_akv_eintraege, upsert_akv_eintrag,
                 get_dokument_vorlage_datei)
from auth import get_users, create_mitarbeiter_ohne_login, create_user_mit_login
import ki_service
import wochenbericht as wb_mod
import pages.gantt as gantt_mod
from pages.helpers import (topbar, aufwand_badge, status_badge, prio_badge, alert, section_header,
                           badge, text_zu_docx_bytes, kapitel_zu_docx_bytes)


PROJEKT_STATUS_WERTE = ["Begonnen","Nicht gestartet","Unterbrochen","Abgebrochen","Abgelehnt","Beendet"]
STATUS_COLORS = {"Begonnen":"#16A34A","Nicht gestartet":"#9099BE","Unterbrochen":"#D97706",
                 "Abgebrochen":"#DC2626","Abgelehnt":"#991B1B","Beendet":"#64748B"}
STATUS_BG     = {"Begonnen":"#DCFCE7","Nicht gestartet":"#ECEEF5","Unterbrochen":"#FEF3C7",
                 "Abgebrochen":"#FEE2E2","Abgelehnt":"#FEE2E2","Beendet":"#F1F5F9"}
FARBEN = {
    "Blau":"#4461D7","Indigo":"#4F46E5","Lila":"#7C3AED","Cyan":"#0891B2",
    "Grün":"#16A34A","Gelb-Orange":"#D97706","Orange":"#EA580C","Rot":"#DC2626","Grau":"#6B7280"
}


def show():
    st.markdown(topbar("Projekte", "Alle Projekte verwalten"), unsafe_allow_html=True)
    st.markdown('<div style="padding:0 28px;">', unsafe_allow_html=True)

    if "detail_projekt" not in st.session_state:
        st.session_state.detail_projekt = None

    with st.expander("➕ Neues Projekt anlegen", expanded=False):
        with st.form("new_proj"):
            pc1, pc2 = st.columns(2)
            with pc1:
                p_name   = st.text_input("Projektname *", placeholder="z.B. SPS-Umprogrammierung Maschine 6")
                p_kst    = st.text_input("Kostenstelle", placeholder="KST-4711")
                p_start  = st.date_input("Startdatum", value=None)
            with pc2:
                p_farbe_n = st.selectbox("Farbe", list(FARBEN.keys()))
                p_status  = st.selectbox("Status", PROJEKT_STATUS_WERTE)
                p_end     = st.date_input("Enddatum", value=None)
            p_budget = st.number_input("Budget-Cap (€)", min_value=0.0, step=500.0, value=0.0)
            p_pfad   = st.text_input("Ordnerpfad", placeholder=r"\\server\projekte\maschine6")
            p_desc   = st.text_area("Beschreibung", height=72)
            if st.form_submit_button("✅ Projekt anlegen", type="primary"):
                if p_name:
                    create_projekt(name=p_name, kostenstelle=p_kst, status=p_status,
                                   farbe=FARBEN[p_farbe_n], beschreibung=p_desc, ordner_pfad=p_pfad,
                                   budget_cap=p_budget if p_budget>0 else None,
                                   start_datum=str(p_start) if p_start else None,
                                   end_datum=str(p_end) if p_end else None)
                    st.success(f"'{p_name}' angelegt!"); st.rerun()
                else:
                    st.error("Bitte Projektname angeben.")

    if st.session_state.detail_projekt:
        _detail(st.session_state.detail_projekt)
    else:
        _liste()

    st.markdown('</div>', unsafe_allow_html=True)


def _liste():
    sf_opts = ["Alle"] + PROJEKT_STATUS_WERTE
    sf = st.radio("", sf_opts, index=sf_opts.index("Begonnen"), horizontal=True, label_visibility="collapsed")
    status_filter = None if sf == "Alle" else [sf]
    projekte = get_all_projekte(status_filter=status_filter)

    if not projekte:
        st.markdown(alert("Keine Projekte gefunden.", "info"), unsafe_allow_html=True)
        return

    st.markdown(f"""
    <div style="display:flex;align-items:center;margin-bottom:12px;gap:8px;">
        <span style="font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#9099BE;">
            {len(projekte)} Projekte
        </span>
    </div>
    """, unsafe_allow_html=True)

    for p in projekte:
        tasks = get_tasks(projekt_id=p["id"])
        gesamt = len(tasks)
        offen  = sum(1 for t in tasks if t["status"] != "Erledigt")
        fokus  = sum(1 for t in tasks if t["status"] == "Fokus")
        warten = sum(1 for t in tasks if t["status"] == "Warten_auf")
        pct    = int((gesamt-offen)/gesamt*100) if gesamt>0 else 0
        farbe  = p.get("farbe","#4461D7") or "#4461D7"
        scol   = STATUS_COLORS.get(p["status"],"#9099BE")
        sbg    = STATUS_BG.get(p["status"],"#ECEEF5")

        meta_bits = [p.get('kostenstelle','') or '–']
        if p.get('ordner_pfad'):
            meta_bits.append(f"📁 {p['ordner_pfad'][:45]}")
        if p.get('start_datum') and p.get('end_datum'):
            meta_bits.append(f"{p['start_datum']} → {p['end_datum']}")
        meta_line = " · ".join(meta_bits)

        budget_html = f'<span style="color:#9099BE;">€ {p["budget_cap"]:,.0f}</span>' if p.get("budget_cap") else ""
        beschr_txt = p.get("beschreibung") or ""
        beschr_html = (
            f'<div style="font-size:0.78rem;color:#5B6488;margin-top:10px;">'
            f'{beschr_txt[:120]}{"…" if len(beschr_txt) > 120 else ""}</div>'
        ) if beschr_txt else ""

        c1, c2 = st.columns([6,1])
        with c1:
            # Alles auf einer Zeile: eine Leerzeile innerhalb eines st.markdown-
            # HTML-Blocks lässt Streamlits Markdown-Parser aus dem Raw-HTML-Modus
            # herausfallen und den Rest als Text rendern statt als HTML.
            st.markdown(
                f'<div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:10px;'
                f'padding:16px 20px 14px 20px;margin-bottom:10px;'
                f'box-shadow:0 1px 3px rgba(30,34,53,0.08);border-left:4px solid {farbe};">'
                f'<div style="display:flex;justify-content:space-between;align-items:flex-start;">'
                f'<div style="flex:1;">'
                f'<div style="font-weight:800;font-size:1rem;color:#1E2235;margin-bottom:3px;">{p["name"]}</div>'
                f'<div style="font-size:0.75rem;color:#9099BE;font-family:\'Fira Code\',monospace;">{meta_line}</div>'
                f'</div>'
                f'<span style="background:{sbg};color:{scol};border-radius:20px;padding:3px 12px;'
                f'font-size:0.72rem;font-weight:700;flex-shrink:0;margin-left:12px;">{p["status"]}</span>'
                f'</div>'
                f'<div style="display:flex;gap:20px;margin:10px 0 8px;font-size:0.75rem;font-family:\'Fira Code\',monospace;">'
                f'<span style="color:#4461D7;font-weight:600;">{fokus} Fokus</span>'
                f'<span style="color:#D97706;font-weight:600;">{warten} Warten</span>'
                f'<span style="color:#9099BE;">{offen}/{gesamt} offen</span>'
                f'<span style="color:#16A34A;font-weight:600;">{pct}% done</span>'
                f'{budget_html}'
                f'</div>'
                f'<div style="background:#ECEEF5;height:5px;border-radius:3px;overflow:hidden;">'
                f'<div style="background:{farbe};width:{pct}%;height:5px;border-radius:3px;"></div>'
                f'</div>'
                f'{beschr_html}'
                f'</div>',
                unsafe_allow_html=True
            )
        with c2:
            st.markdown("<div style='padding-top:24px;'>", unsafe_allow_html=True)
            if st.button("📋 Details", key=f"proj_det_{p['id']}", use_container_width=True, type="primary"):
                st.session_state.detail_projekt = p["id"]; st.rerun()
            st.markdown("</div>", unsafe_allow_html=True)


def _detail(pid):
    p = get_projekt(pid)
    if not p:
        st.session_state.detail_projekt = None; return

    if st.button("← Zurück"):
        st.session_state.detail_projekt = None; st.rerun()

    farbe = p.get("farbe","#4461D7") or "#4461D7"
    scol  = STATUS_COLORS.get(p["status"],"#9099BE")
    sbg   = STATUS_BG.get(p["status"],"#ECEEF5")

    st.markdown(f"""
    <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:10px;
                padding:20px 24px;margin-bottom:20px;box-shadow:0 1px 3px rgba(30,34,53,0.08);
                border-left:5px solid {farbe};">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
                <div style="font-weight:800;font-size:1.15rem;color:#1E2235;">{p['name']}</div>
                <div style="font-size:0.78rem;color:#9099BE;font-family:'Fira Code',monospace;margin-top:4px;">
                    {p.get('kostenstelle','') or '–'} · {p.get('start_datum','') or '?'} → {p.get('end_datum','') or '?'}
                </div>
            </div>
            <span style="background:{sbg};color:{scol};border-radius:20px;padding:4px 14px;font-size:0.78rem;font-weight:700;">{p['status']}</span>
        </div>
        {f'<div style="margin-top:10px;font-size:0.85rem;color:#5B6488;">{p["beschreibung"]}</div>' if p.get("beschreibung") else ""}
    </div>
    """, unsafe_allow_html=True)

    init_top = get_projekt_initialisierung(pid) or {}
    vorgehensmodell_top = init_top.get("vorgehensmodell")
    zeigt_scrum_board = vorgehensmodell_top in ("Scrum", "Inkrementell", "Hybrid")
    zeigt_v_modell_tab = vorgehensmodell_top == "V-Modell"
    zeigt_gantt_tab = not zeigt_scrum_board  # bei Scrum uebernimmt das Scrum-Board die Ablaufsicht

    tab_namen = ["📋 Tasks", "📝 Logbuch", "⚙ Projekt bearbeiten", "👥 Ressourcen", "🎯 Initialisierung",
                "⚠ Risiko & RACI", "📄 Dokumente", "💰 Budget", "🧾 Rechnung & Nachweise"]
    if zeigt_gantt_tab:
        tab_namen.append("📅 Gantt")
    if zeigt_scrum_board:
        tab_namen.append("🏉 Scrum-Board")
    if zeigt_v_modell_tab:
        tab_namen.append("📐 V-Modell")
    tabs = st.tabs(tab_namen)
    tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab_budget, tab_rechnung = tabs[:9]
    idx = 9
    tab_gantt = None
    if zeigt_gantt_tab:
        tab_gantt = tabs[idx]; idx += 1
    tab8 = None
    if zeigt_scrum_board:
        tab8 = tabs[idx]; idx += 1
    tab_vmodell = None
    if zeigt_v_modell_tab:
        tab_vmodell = tabs[idx]; idx += 1

    with tab1:
        with st.form(f"pt_{pid}"):
            tc1, tc2, tc3, tc4 = st.columns([4,1,1,1])
            with tc1: t_t = st.text_input("Task-Titel *")
            with tc2: t_aw = st.selectbox("Aufwand", ["2m","15m","2h","4h+"])
            with tc3: t_pr = st.selectbox("Prio", [1,2,3], index=1, format_func=lambda x:{1:"🔴",2:"🟡",3:"⚪"}[x])
            with tc4: t_kr = st.checkbox("🔗 Krit.")
            if st.form_submit_button("➕ Task", type="primary"):
                if t_t:
                    create_task(pid, t_t, aufwandsklasse=t_aw, prioritaet=t_pr, kritischer_pfad=t_kr)
                    st.rerun()

        tasks = get_tasks(projekt_id=pid)
        for grp_status, grp_label, grp_col in [
            ("Fokus","▶ FOKUS","#4461D7"), ("Warten_auf","⏳ WARTEN","#D97706"),
            ("Backlog","📥 BACKLOG","#9099BE"), ("Erledigt","✓ ERLEDIGT","#16A34A")
        ]:
            gt = [t for t in tasks if t["status"] == grp_status]
            if not gt: continue
            st.markdown(f"""
            <div style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;
                        color:{grp_col};padding:12px 0 6px;border-bottom:2px solid #E2E5F0;margin-bottom:8px;">
                {grp_label} ({len(gt)})
            </div>
            """, unsafe_allow_html=True)
            for t in gt:
                ca, cb, cc, cd = st.columns([5,1,1,1])
                krit = " 🔗" if t.get("kritischer_pfad") else ""
                wp = f" · ⏳ {t['warten_auf_person']}" if t.get("warten_auf_person") else ""
                with ca:
                    st.markdown(f'<div style="font-size:0.875rem;font-weight:600;color:#1E2235;padding:8px 0;">{t["titel"]}{krit}<span style="font-size:0.72rem;color:#D97706;">{wp}</span></div>', unsafe_allow_html=True)
                with cb: st.markdown(aufwand_badge(t["aufwandsklasse"]), unsafe_allow_html=True)
                nxt = {"Backlog":"Fokus","Fokus":"Erledigt","Warten_auf":"Erledigt","Erledigt":"Backlog"}
                nxt_l = {"Backlog":"▶","Fokus":"✅","Warten_auf":"✅","Erledigt":"↩"}
                with cc:
                    if st.button(nxt_l[grp_status], key=f"pdt_{t['id']}"):
                        update_task(t["id"], status=nxt[grp_status]); st.rerun()
                with cd:
                    if st.button("🗑", key=f"pdd_{t['id']}"):
                        delete_task(t["id"]); st.rerun()

    with tab2:
        with st.form(f"pl_{pid}"):
            l_i = st.text_area("Eintrag *", height=90, placeholder="Mail-Inhalt, Lösung, Erkenntnis...")
            lc1, lc2, lc3 = st.columns(3)
            with lc1: l_t = st.selectbox("Typ", ["Notiz","Mail","Loesung","Snippet","Call"])
            with lc2: l_p = st.text_input("Person")
            with lc3: l_g = st.text_input("Tags (kommagetrennt)")
            if st.form_submit_button("💾 Speichern", type="primary"):
                if l_i:
                    create_interaktion(l_i, projekt_id=pid, typ=l_t,
                                       person=l_p or None, tags=l_g or None)
                    st.rerun()

        for i in get_interaktionen(projekt_id=pid, limit=30):
            icon = {"Notiz":"📝","Loesung":"💡","Mail":"📧","Call":"📞","Snippet":"🔧"}.get(i["typ"],"📝")
            ts = str(i["erstellt_am"])[:16] if i["erstellt_am"] else ""
            st.markdown(f"""
            <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                        padding:12px 16px;margin-bottom:8px;box-shadow:0 1px 3px rgba(30,34,53,0.06);">
                <div style="font-size:0.875rem;color:#1E2235;">{icon} {i['inhalt']}</div>
                <div style="font-size:0.68rem;color:#9099BE;font-family:'Fira Code',monospace;margin-top:6px;">
                    {ts}{f" · {i['person']}" if i.get('person') else ""}{f' · 🏷 {i["tags"]}' if i.get("tags") else ""}
                </div>
            </div>
            """, unsafe_allow_html=True)

    with tab3:
        with st.form(f"pe_{pid}"):
            ec1, ec2 = st.columns(2)
            with ec1:
                e_n = st.text_input("Name", value=p["name"])
                e_k = st.text_input("Kostenstelle", value=p.get("kostenstelle","") or "")
                e_s = st.selectbox("Status", PROJEKT_STATUS_WERTE,
                                    index=PROJEKT_STATUS_WERTE.index(p["status"])
                                    if p["status"] in PROJEKT_STATUS_WERTE else 0)
            with ec2:
                e_pf = st.text_input("Ordnerpfad", value=p.get("ordner_pfad","") or "")
                e_b  = st.number_input("Budget (€)", value=float(p.get("budget_cap") or 0), step=500.0)
                e_fn = st.selectbox("Farbe", list(FARBEN.keys()),
                                     index=list(FARBEN.values()).index(p.get("farbe","#4461D7"))
                                     if p.get("farbe") in FARBEN.values() else 0)
            ec3, ec4 = st.columns(2)
            with ec3:
                e_start = st.date_input("Startdatum", value=date.fromisoformat(str(p["start_datum"])) if p.get("start_datum") else None)
            with ec4:
                e_end = st.date_input("Enddatum", value=date.fromisoformat(str(p["end_datum"])) if p.get("end_datum") else None)
            e_d = st.text_area("Beschreibung", value=p.get("beschreibung","") or "", height=72)
            if e_s in ("Beendet", "Abgebrochen"):
                st.caption("Abschlussbewertung wird automatisch aus dem Status übernommen "
                           "(Grundlage für Lessons Learned künftiger Projekte).")
            if st.form_submit_button("💾 Speichern", type="primary"):
                update_kwargs = dict(name=e_n, kostenstelle=e_k, status=e_s,
                               ordner_pfad=e_pf, budget_cap=e_b if e_b>0 else None,
                               farbe=FARBEN[e_fn], beschreibung=e_d,
                               start_datum=str(e_start) if e_start else None,
                               end_datum=str(e_end) if e_end else None)
                if e_s == "Beendet":
                    update_kwargs["abschluss_ergebnis"] = "erfolgreich"
                elif e_s == "Abgebrochen":
                    update_kwargs["abschluss_ergebnis"] = "gescheitert"
                update_projekt(pid, **update_kwargs)
                st.success("Gespeichert!"); st.rerun()
        st.markdown("---")
        if st.button("🗑 Projekt löschen (unwiderruflich)"):
            delete_projekt(pid)
            st.session_state.detail_projekt = None; st.rerun()

    with tab4:
        st.caption(
            "Zeitanteil in % gilt für jedes Projekt — egal ob per GF-Genehmigung "
            "zugewiesen oder selbst gewählt. Jede Person kann ihren eigenen Anteil "
            "jederzeit anpassen; die Gesamtauslastung über alle Projekte sollte "
            "100% nicht übersteigen (100% = 75% der Anwesenheitszeit)."
        )
        ress = get_projekt_ressourcen(projekt_id=pid)
        if ress:
            for r in ress:
                rc1, rc2 = st.columns([3, 1])
                with rc1:
                    quelle_label = "GF-zugewiesen" if r["quelle"] == "gf_zugewiesen" else "Selbst gewählt"
                    login_label = "" if r.get("hat_login", True) else " &nbsp;·&nbsp; <span style='color:#D97706;font-size:0.75rem;'>kein Login</span>"
                    rolle_label = f" &nbsp;·&nbsp; <span style='color:#4461D7;font-size:0.75rem;'>{r['rolle']}</span>" if r.get("rolle") else ""
                    st.markdown(f"**{r['user_name']}** &nbsp;·&nbsp; <span style='color:#9099BE;font-size:0.75rem;'>{quelle_label}</span>{login_label}{rolle_label}",
                                unsafe_allow_html=True)
                with rc2:
                    st.caption(f"{r['anteil_pct']}%")
        else:
            st.info("Noch niemandem ein Zeitanteil zugeordnet.")

        st.markdown("---")
        with st.expander("➕ Mitarbeiter ohne Login-Account anlegen (z.B. Produktioner)"):
            with st.form(f"neuer_mitarbeiter_{pid}"):
                neuer_name = st.text_input("Name")
                if st.form_submit_button("Anlegen"):
                    if neuer_name.strip():
                        create_mitarbeiter_ohne_login(neuer_name.strip())
                        st.success(f"'{neuer_name.strip()}' angelegt – jetzt unten auswählbar.")
                        st.rerun()

        with st.expander("➕ Mitarbeiter mit Login-Account anlegen (z.B. neue:r Kolleg:in)"):
            st.caption("Jede:r kann hier neue Kolleg:innen-Accounts anlegen, ohne dass Admin/Geschäftsführung nötig ist.")
            with st.form(f"neuer_mitarbeiter_login_{pid}"):
                nl_email = st.text_input("E-Mail")
                nl_name = st.text_input("Name")
                nl_pw = st.text_input("Passwort (wird der Person mitgeteilt)", type="password")
                if st.form_submit_button("Anlegen"):
                    if nl_email.strip() and nl_name.strip() and nl_pw:
                        try:
                            create_user_mit_login(nl_email.strip(), nl_name.strip(), nl_pw,
                                                  role_codes=["mitarbeiter"])
                            st.success(f"'{nl_name.strip()}' angelegt – jetzt unten auswählbar.")
                            st.rerun()
                        except Exception as e:
                            st.error(f"Anlegen fehlgeschlagen (z.B. E-Mail bereits vergeben): {e}")
                    else:
                        st.warning("E-Mail, Name und Passwort sind Pflichtfelder.")

        st.markdown("**Anteil hinzufügen / ändern**")
        st.caption("Die Rolle bleibt i.d.R. über die gesamte Projektlaufzeit stabil und wird gemerkt.")
        users = get_users()
        user_opts = {u["id"]: u["display_name"] for u in users}
        rc1, rc2 = st.columns([3, 1])
        with rc1:
            sel_user = st.selectbox("Person", list(user_opts.keys()), format_func=lambda x: user_opts[x], key=f"res_person_{pid}")
        with rc2:
            sel_pct = st.number_input("Anteil (%)", min_value=0, max_value=100, value=25, step=5, key=f"res_pct_{pid}")

        rollen_opts = [r["rolle"] for r in get_rollensaetze()]
        sel_rolle = None
        if rollen_opts:
            gespeicherte_rolle = get_rolle_fuer_person_projekt(pid, sel_user)
            sel_rolle = st.selectbox(
                "Rolle im Projekt", rollen_opts,
                index=rollen_opts.index(gespeicherte_rolle) if gespeicherte_rolle in rollen_opts else 0,
                key=f"res_rolle_{pid}_{sel_user}"
            )

        if st.button("💾 Speichern", type="primary", key=f"res_speichern_{pid}"):
            set_projekt_ressource(pid, sel_user, sel_pct, rolle=sel_rolle)
            auslastung = get_gesamtauslastung(sel_user)
            if auslastung > 100:
                st.warning(f"⚠ {user_opts[sel_user]} ist jetzt mit {auslastung:.0f}% über alle Projekte ausgelastet (>100%).")
            st.success("Gespeichert!")
            st.rerun()

    with tab5:
        st.caption(
            "Straubel-Vorgehen: Ziele/Erfolgskriterien → kritische Erfolgsfaktoren → "
            "Lessons Learned → Projektart/Komplexität → Vorgehensmodell → Projektdesign. "
            "Jederzeit editierbar, kein Einmal-Wizard."
        )
        init = get_projekt_initialisierung(pid) or {}

        # C.1 + C.2 ─────────────────────────────────────────────────────────
        with st.expander("🎯 Ziele, Erfolgskriterien & kritische Erfolgsfaktoren", expanded=True):
            if ki_service.ki_verfuegbar():
                if st.button("✨ KI-Vorschlag aus Projektbeschreibung", key=f"ki_init_{pid}"):
                    try:
                        with st.spinner("KI erstellt Vorschlag..."):
                            vorschlag = ki_service.schlage_initialisierung_vor(p.get("beschreibung") or p["name"])
                        st.session_state[f"ki_vorschlag_{pid}"] = vorschlag
                    except Exception as e:
                        st.error(f"KI-Vorschlag fehlgeschlagen: {e}")
            vorschlag = st.session_state.get(f"ki_vorschlag_{pid}")
            if vorschlag:
                st.info(
                    f"**KI-Vorschlag** (unten manuell übernehmen):\n\n"
                    f"**Ziele:** {vorschlag.get('ziele','')}\n\n"
                    f"**Erfolgskriterien:** {vorschlag.get('erfolgskriterien','')}\n\n"
                    f"**Kritische Erfolgsfaktoren:** {vorschlag.get('kritische_erfolgsfaktoren','')}"
                )
            with st.form(f"c1c2_{pid}"):
                ziele = st.text_area("Ziele", value=init.get("ziele") or "", height=90)
                erfolgskriterien = st.text_area("Erfolgskriterien", value=init.get("erfolgskriterien") or "", height=90)
                kef = st.text_area("Kritische Erfolgsfaktoren", value=init.get("kritische_erfolgsfaktoren") or "", height=90)
                if st.form_submit_button("💾 Speichern", type="primary"):
                    upsert_projekt_initialisierung(pid, ziele=ziele, erfolgskriterien=erfolgskriterien,
                                                   kritische_erfolgsfaktoren=kef)
                    st.success("Gespeichert!"); st.rerun()

        # C.3 ───────────────────────────────────────────────────────────────
        with st.expander("📚 Lessons Learned"):
            alte = get_alte_projekte_fuer_lessons_learned(exclude_projekt_id=pid)
            if not alte:
                st.info("Noch keine abgeschlossenen/pausierten Alt-Projekte als Vergleichsbasis vorhanden.")
            else:
                st.caption(f"{len(alte)} Alt-Projekt(e) als Vergleichsbasis gefunden.")
                if ki_service.ki_verfuegbar():
                    if st.button("✨ KI-Analyse Alt-Projekte", key=f"ll_ki_{pid}"):
                        try:
                            with st.spinner("KI analysiert Alt-Projekte..."):
                                ergebnis = ki_service.analysiere_lessons_learned(p.get("beschreibung") or p["name"], alte)
                            st.session_state[f"ll_ergebnis_{pid}"] = ergebnis
                        except Exception as e:
                            st.error(f"KI-Analyse fehlgeschlagen: {e}")
                ergebnis = st.session_state.get(f"ll_ergebnis_{pid}")
                if ergebnis:
                    st.info(f"**Zusammenfassung:** {ergebnis.get('zusammenfassung','')}\n\n"
                           f"**Empfehlungen:** {ergebnis.get('empfehlungen','')}")
                for a in alte[:10]:
                    erg_icon = {"erfolgreich": "✅", "gescheitert": "❌"}.get(a.get("abschluss_ergebnis"), "➖")
                    st.markdown(f"{erg_icon} **{a['name']}** ({a['status']}) — {(a.get('beschreibung') or '')[:100]}")
            with st.form(f"ll_notiz_{pid}"):
                ll_notiz = st.text_area("Eigene Lessons-Learned-Notizen", value=init.get("lessons_learned") or "", height=80)
                if st.form_submit_button("💾 Speichern"):
                    upsert_projekt_initialisierung(pid, lessons_learned=ll_notiz)
                    st.success("Gespeichert!"); st.rerun()

        # C.4 ───────────────────────────────────────────────────────────────
        with st.expander("🏷 Projektart & Komplexität (Einstufung)"):
            with st.form(f"c4_{pid}"):
                cc1, cc2 = st.columns(2)
                with cc1:
                    mehrere_fb = st.checkbox("Mehrere Fachbereiche betroffen", value=bool(init.get("reichweite_mehrere_fb")))
                    ress_pct = st.number_input("Ressourcenbindung (%)", 0, 100, value=int(init.get("ressourcenbindung_pct") or 0))
                    budget_teur = st.number_input("Budget (TEUR)", 0.0, value=float(init.get("budget_teur") or 0))
                    dauer_wochen = st.number_input("Geschätzte Dauer (Wochen)", 0.0, value=float(init.get("dauer_wochen") or 0))
                with cc2:
                    strat_prio = st.slider("Strategische Priorität (1-10)", 1, 10, value=int(init.get("strategische_prio") or 1))
                    abhaeng = st.checkbox("Andere Vorhaben hängen hiervon ab", value=bool(init.get("abhaengigkeiten")))
                    komplex_opts = ["gering", "Aufgabe", "Problem", "komplexes Problem"]
                    komplexitaet = st.selectbox("Komplexität", komplex_opts,
                                                index=komplex_opts.index(init.get("komplexitaet") or "gering"))
                    risiko_opts = ["A", "B", "C"]
                    risikoklasse = st.selectbox("Risikoklasse", risiko_opts,
                                                index=risiko_opts.index(init.get("risikoklasse") or "A"))
                if st.form_submit_button("🧮 Einstufen & Speichern", type="primary"):
                    einstufung = berechne_einstufung(mehrere_fb, ress_pct, budget_teur, dauer_wochen,
                                                     strat_prio, abhaeng, komplexitaet, risikoklasse)
                    upsert_projekt_initialisierung(pid, reichweite_mehrere_fb=mehrere_fb,
                        ressourcenbindung_pct=ress_pct, budget_teur=budget_teur, dauer_wochen=dauer_wochen,
                        strategische_prio=strat_prio, abhaengigkeiten=abhaeng, komplexitaet=komplexitaet,
                        risikoklasse=risikoklasse, einstufung=einstufung)
                    st.success(f"Eingestuft als: **{einstufung}**"); st.rerun()
            if init.get("einstufung"):
                badge_color = {"ASTA": "muted", "Massnahme": "yellow", "EPM": "purple"}.get(init["einstufung"], "muted")
                st.markdown(f"Aktuelle Einstufung: {badge(init['einstufung'], badge_color)}", unsafe_allow_html=True)

        # C.4.5 ─────────────────────────────────────────────────────────────
        KF_TYP_LABELS = {"sachlich": "⚙ Sachlich", "sozial": "👥 Sozial"}
        KF_HERKUNFT_LABELS = {"intern": "Intern", "extern": "Extern"}
        with st.expander("🌐 Scope, Kontext & Umfeld-Analyse"):
            st.caption(
                "KI leitet Scope-Abgrenzung, Umfeldfaktoren und eine Einschätzung für "
                "die Vorgehensmodell-Wahl aus Projektbeschreibung, Zielen, Logbuch, "
                "Stakeholdern und User-Stories ab - du prüfst/ergänzt nur noch."
            )
            if ki_service.ki_verfuegbar():
                if st.button("✨ KI-Analyse erstellen", key=f"ki_scope_{pid}"):
                    try:
                        interaktionen_sk = get_interaktionen(projekt_id=pid, limit=15)
                        stakeholder_sk = get_stakeholder()
                        stories_sk = get_user_stories(pid)
                        with st.spinner("KI analysiert Scope/Kontext/Umfeld..."):
                            ergebnis = ki_service.analysiere_scope_kontext_umfeld(
                                p, init, interaktionen_sk, stakeholder_sk, stories_sk
                            )
                        upsert_projekt_initialisierung(pid, scope_im=ergebnis.get("scope_im", ""),
                                                       scope_out=ergebnis.get("scope_out", ""))
                        for kf in ergebnis.get("kontextfaktoren", []):
                            create_kontextfaktor(
                                pid, (kf.get("bezeichnung") or "")[:200],
                                kf.get("typ") if kf.get("typ") in KF_TYP_LABELS else "sachlich",
                                kf.get("herkunft") if kf.get("herkunft") in KF_HERKUNFT_LABELS else "intern",
                                kf.get("einfluss_auf_projekt"), kf.get("einfluss_von_projekt"),
                                int(kf.get("wichtigkeit") or 2)
                            )
                        st.session_state[f"stacy_vorschlag_{pid}"] = {
                            "anforderungsklarheit": ergebnis.get("anforderungsklarheit_vorschlag"),
                            "loesungsklarheit": ergebnis.get("loesungsklarheit_vorschlag"),
                            "begruendung": ergebnis.get("vorgehensmodell_begruendung"),
                        }
                        st.success(
                            "Analyse erstellt - Scope unten befüllt, Vorgehensmodell-Vorschlag "
                            "jetzt im nächsten Abschnitt (Stacy-Matrix)."
                        )
                        st.rerun()
                    except Exception as e:
                        st.error(f"KI-Analyse fehlgeschlagen: {e}")

            with st.form(f"scope_{pid}"):
                sk1, sk2 = st.columns(2)
                with sk1:
                    scope_im = st.text_area("Im Scope enthalten", value=init.get("scope_im") or "", height=110)
                with sk2:
                    scope_out = st.text_area("Explizit ausgeschlossen", value=init.get("scope_out") or "", height=110)
                if st.form_submit_button("💾 Speichern", type="primary"):
                    upsert_projekt_initialisierung(pid, scope_im=scope_im, scope_out=scope_out)
                    st.success("Gespeichert!"); st.rerun()

            st.markdown("**Umfeldfaktoren**")
            kontextfaktoren = get_kontextfaktoren(pid)
            if kontextfaktoren:
                st.caption("Erneutes 'KI-Analyse erstellen' fügt weitere Faktoren hinzu - bestehende bleiben erhalten.")
                for kf in kontextfaktoren:
                    wichtig_color = {1: "muted", 2: "yellow", 3: "red"}.get(kf["wichtigkeit"], "muted")
                    titel = (f"{kf['bezeichnung']} · {KF_TYP_LABELS.get(kf['typ'], kf['typ'])} / "
                            f"{KF_HERKUNFT_LABELS.get(kf['herkunft'], kf['herkunft'])}")
                    with st.expander(titel):
                        st.markdown(badge(f"Wichtigkeit {kf['wichtigkeit']}", wichtig_color), unsafe_allow_html=True)
                        with st.form(f"kf_edit_{kf['id']}"):
                            kf_bez = st.text_input("Bezeichnung", value=kf["bezeichnung"])
                            kfc1, kfc2 = st.columns(2)
                            with kfc1:
                                typ_keys = list(KF_TYP_LABELS.keys())
                                kf_typ = st.selectbox("Typ", typ_keys,
                                                      index=typ_keys.index(kf["typ"]) if kf["typ"] in typ_keys else 0,
                                                      format_func=lambda x: KF_TYP_LABELS[x], key=f"kf_typ_{kf['id']}")
                            with kfc2:
                                herk_keys = list(KF_HERKUNFT_LABELS.keys())
                                kf_herkunft = st.selectbox("Herkunft", herk_keys,
                                                           index=herk_keys.index(kf["herkunft"]) if kf["herkunft"] in herk_keys else 0,
                                                           format_func=lambda x: KF_HERKUNFT_LABELS[x], key=f"kf_herk_{kf['id']}")
                            kf_auf = st.text_area("Einfluss auf das Projekt", value=kf.get("einfluss_auf_projekt") or "",
                                                  height=60, key=f"kf_auf_{kf['id']}")
                            kf_von = st.text_area("Einfluss des Projekts darauf", value=kf.get("einfluss_von_projekt") or "",
                                                  height=60, key=f"kf_von_{kf['id']}")
                            kf_wichtig = st.selectbox("Wichtigkeit", [1, 2, 3], index=kf["wichtigkeit"] - 1,
                                                      format_func=lambda x: {1: "1 - gering", 2: "2 - mittel", 3: "3 - hoch"}[x],
                                                      key=f"kf_wicht_{kf['id']}")
                            if st.form_submit_button("💾 Speichern", type="primary"):
                                update_kontextfaktor(kf["id"], kf_bez, kf_typ, kf_herkunft, kf_auf, kf_von, kf_wichtig)
                                st.success("Gespeichert!"); st.rerun()
                        if st.button("🗑 Löschen", key=f"del_kf_{kf['id']}"):
                            delete_kontextfaktor(kf["id"]); st.rerun()
            else:
                st.info("Noch keine Umfeldfaktoren erfasst.")

            with st.expander("➕ Neuer Umfeldfaktor"):
                with st.form(f"neuer_kf_{pid}"):
                    nkf_bez = st.text_input("Bezeichnung *")
                    nkfc1, nkfc2 = st.columns(2)
                    with nkfc1:
                        nkf_typ = st.selectbox("Typ", list(KF_TYP_LABELS.keys()),
                                               format_func=lambda x: KF_TYP_LABELS[x], key=f"nkf_typ_{pid}")
                    with nkfc2:
                        nkf_herkunft = st.selectbox("Herkunft", list(KF_HERKUNFT_LABELS.keys()),
                                                    format_func=lambda x: KF_HERKUNFT_LABELS[x], key=f"nkf_herk_{pid}")
                    nkf_auf = st.text_area("Einfluss auf das Projekt", height=60, key=f"nkf_auf_{pid}")
                    nkf_von = st.text_area("Einfluss des Projekts darauf", height=60, key=f"nkf_von_{pid}")
                    nkf_wichtig = st.selectbox("Wichtigkeit", [1, 2, 3], index=1,
                                               format_func=lambda x: {1: "1 - gering", 2: "2 - mittel", 3: "3 - hoch"}[x],
                                               key=f"nkf_wicht_{pid}")
                    if st.form_submit_button("➕ Anlegen", type="primary"):
                        if nkf_bez.strip():
                            create_kontextfaktor(pid, nkf_bez.strip(), nkf_typ, nkf_herkunft,
                                                 nkf_auf or None, nkf_von or None, nkf_wichtig)
                            st.success("Angelegt!"); st.rerun()

        # C.5 ───────────────────────────────────────────────────────────────
        with st.expander("🧭 Vorgehensmodell-Wahl (Stacy-Matrix)"):
            stacy_vorschlag = st.session_state.get(f"stacy_vorschlag_{pid}")
            if stacy_vorschlag:
                st.info(
                    f"**KI-Einschätzung aus Scope-/Kontextanalyse:** "
                    f"Anforderungsklarheit = {stacy_vorschlag.get('anforderungsklarheit') or '–'}, "
                    f"Lösungsklarheit = {stacy_vorschlag.get('loesungsklarheit') or '–'}\n\n"
                    f"{stacy_vorschlag.get('begruendung') or ''}"
                )
            with st.form(f"c5_{pid}"):
                klar_opts = ["klar", "unklar"]
                default_anford = ((stacy_vorschlag or {}).get("anforderungsklarheit")
                                  or init.get("anforderungsklarheit") or "klar")
                default_loesung = ((stacy_vorschlag or {}).get("loesungsklarheit")
                                   or init.get("loesungsklarheit") or "klar")
                sc1, sc2 = st.columns(2)
                with sc1:
                    anford = st.selectbox("Anforderungsklarheit", klar_opts,
                                          index=klar_opts.index(default_anford) if default_anford in klar_opts else 0)
                with sc2:
                    loesung = st.selectbox("Lösungs-/Technologieklarheit", klar_opts,
                                           index=klar_opts.index(default_loesung) if default_loesung in klar_opts else 0)
                empfehlung = empfehle_vorgehensmodell(anford, loesung)
                st.caption(f"Empfehlung nach Stacy-Matrix: **{empfehlung}**")
                modelle = ["Wasserfall", "V-Modell", "Scrum", "Inkrementell", "Hybrid"]
                default_modell = init.get("vorgehensmodell") or empfehlung
                vorgehen = st.selectbox("Gewähltes Vorgehensmodell", modelle,
                                        index=modelle.index(default_modell) if default_modell in modelle else 0)
                if st.form_submit_button("💾 Speichern", type="primary"):
                    upsert_projekt_initialisierung(pid, anforderungsklarheit=anford, loesungsklarheit=loesung,
                                                   vorgehensmodell=vorgehen)
                    st.session_state.pop(f"stacy_vorschlag_{pid}", None)
                    st.success(f"Vorgehensmodell gespeichert: {vorgehen}"); st.rerun()

            st.markdown("---")
            st.markdown("**🏗 Meilenstein-/Sprint-Struktur generieren**")
            vorhandene_meilensteine = get_meilensteine(pid, alle=True)
            if not init.get("vorgehensmodell"):
                st.caption("Erst Vorgehensmodell oben speichern, dann Struktur generieren.")
            else:
                st.caption(
                    f"KI leitet aus Zielen, Scope und User-Stories eine passende "
                    f"{init['vorgehensmodell']}-Struktur ab (Phasen/Sprints + Arbeitspakete)."
                )
                if vorhandene_meilensteine:
                    st.caption(
                        f"Es existieren bereits {len(vorhandene_meilensteine)} Meilenstein(e)/Sprint(s). "
                        "Erneutes Generieren gleicht gleichnamige Meilensteine/Tasks ab (aktualisiert sie), "
                        "statt sie zu duplizieren."
                    )
                if ki_service.ki_verfuegbar():
                    if st.button("✨ Struktur generieren", key=f"ki_vorgehen_{pid}"):
                        try:
                            stories_vg = get_user_stories(pid)
                            with st.spinner("KI generiert Vorgehensstruktur..."):
                                struktur = ki_service.generiere_vorgehensstruktur(p, init, stories_vg)
                            ergebnis = erzeuge_meilenstein_struktur(pid, struktur, projekt_start=p.get("start_datum"))
                            st.success(
                                f"{ergebnis['meilensteine_angelegt']} Meilenstein(e)/Sprint(s) neu angelegt, "
                                f"{ergebnis['meilensteine_aktualisiert']} aktualisiert, "
                                f"{ergebnis['tasks_angelegt']} Task(s) angelegt - sichtbar im Tab 'Gantt'"
                                + (" sowie im Scrum-Board." if init["vorgehensmodell"] in
                                   ("Scrum", "Inkrementell", "Hybrid") else ".")
                            )
                            st.rerun()
                        except Exception as e:
                            st.error(f"Struktur-Generierung fehlgeschlagen: {e}")
                else:
                    st.info("Kein KI-Backend verfügbar (siehe Einstellungen).")

        # C.6 ───────────────────────────────────────────────────────────────
        with st.expander("📐 Projektdesign"):
            with st.form(f"c6_{pid}"):
                scope = st.text_area("Scope / Abgrenzung", value=init.get("scope_abgrenzung") or "", height=90)
                rahmen = st.text_area("Rahmenbedingungen", value=init.get("rahmenbedingungen") or "", height=90)
                if st.form_submit_button("💾 Speichern", type="primary"):
                    upsert_projekt_initialisierung(pid, scope_abgrenzung=scope, rahmenbedingungen=rahmen)
                    st.success("Gespeichert!"); st.rerun()

    with tab6:
        EW_TW_LABELS = {1: "1 - gering", 2: "2 - mittel", 3: "3 - hoch"}
        MASSNAHMENKLASSEN = ["–", "vermeiden", "vermindern", "verlagern", "begrenzen", "akzeptieren"]

        st.markdown("#### ⚠️ Risikoregister")
        st.caption("Risikopriorität (FMEA-Koeffizient) = Eintrittswahrscheinlichkeit × Tragweite. Sortiert nach Rangfolge.")
        risiken = get_risiken(pid)
        if risiken:
            summe_risiko = sum(r["risikoprioritaet"] or 0 for r in risiken)
            summe_restrisiko = sum(
                r["restrisiko"] if r.get("restrisiko") is not None else (r["risikoprioritaet"] or 0)
                for r in risiken
            )
            mc1, mc2 = st.columns(2)
            with mc1:
                st.metric("Gesamtsumme Risiko (FMEA-Koeffizient)", summe_risiko)
            with mc2:
                st.metric("Gesamtsumme Restrisiko", summe_restrisiko)
        if risiken:
            for r in risiken:
                prio = r["risikoprioritaet"] or 0
                prio_color = "red" if prio >= 6 else ("orange" if prio >= 3 else "muted")
                titel = f"{r['beschreibung']} · Priorität {prio}"
                with st.expander(titel, expanded=False):
                    st.markdown(badge(f"Priorität {prio}", prio_color), unsafe_allow_html=True)
                    if r.get("restrisiko") is not None:
                        st.caption(f"Restrisiko nach Maßnahme: {r['restrisiko']}")
                    with st.form(f"risiko_edit_{r['id']}"):
                        rc1, rc2 = st.columns(2)
                        with rc1:
                            besch = st.text_input("Beschreibung", value=r["beschreibung"])
                            kat = st.text_input("Kategorie", value=r.get("kategorie") or "")
                            ew = st.selectbox("Eintrittswahrscheinlichkeit", [1, 2, 3],
                                              index=r["eintrittswahrscheinlichkeit"] - 1,
                                              format_func=lambda x: EW_TW_LABELS[x])
                            tw = st.selectbox("Tragweite", [1, 2, 3], index=r["tragweite"] - 1,
                                              format_func=lambda x: EW_TW_LABELS[x])
                        with rc2:
                            mk_default = r.get("massnahmenklasse") or "–"
                            mk = st.selectbox("Maßnahmenklasse", MASSNAHMENKLASSEN,
                                              index=MASSNAHMENKLASSEN.index(mk_default) if mk_default in MASSNAHMENKLASSEN else 0)
                            ma = st.text_area("Maßnahme", value=r.get("massnahme") or "", height=60)
                            mk_kosten = st.number_input("Kosten Maßnahme (€)", value=float(r.get("massnahme_kosten") or 0))
                            status_opts = ["Offen", "In Umsetzung", "Erledigt"]
                            status = st.selectbox("Status", status_opts,
                                                  index=status_opts.index(r.get("status") or "Offen"))
                        st.markdown("**Nach Maßnahme (Restrisiko):**")
                        rc3, rc4 = st.columns(2)
                        with rc3:
                            ew_nach = st.selectbox("EW nach Maßnahme", [0, 1, 2, 3],
                                                   index=int(r.get("ew_nach_massnahme") or 0))
                        with rc4:
                            tw_nach = st.selectbox("TW nach Maßnahme", [0, 1, 2, 3],
                                                   index=int(r.get("tw_nach_massnahme") or 0))
                        if st.form_submit_button("💾 Speichern", type="primary"):
                            update_risiko(r["id"], besch, kat or None, ew, tw,
                                         None if mk == "–" else mk, ma or None,
                                         mk_kosten if mk_kosten > 0 else None,
                                         ew_nach or None, tw_nach or None, status)
                            st.success("Gespeichert!"); st.rerun()
                    if st.button("🗑 Risiko löschen", key=f"del_risiko_{r['id']}"):
                        delete_risiko(r["id"]); st.rerun()
        else:
            st.info("Noch keine Risiken erfasst.")

        if ki_service.ki_verfuegbar():
            if st.button("✨ KI-Vorschlag für Risiken", key=f"ki_risiko_{pid}"):
                try:
                    with st.spinner("KI schlägt Risiken vor..."):
                        vorschlaege = ki_service.schlage_risiken_vor(p["name"], p.get("beschreibung"))
                    st.session_state[f"ki_risiken_vorschlag_{pid}"] = vorschlaege
                except Exception as e:
                    st.error(f"KI-Vorschlag fehlgeschlagen: {e}")
            risiko_vorschlaege = st.session_state.get(f"ki_risiken_vorschlag_{pid}")
            if risiko_vorschlaege:
                st.caption("KI-Vorschläge — einzeln übernehmen oder verwerfen:")
                for i, v in enumerate(risiko_vorschlaege):
                    vc1, vc2 = st.columns([5, 1])
                    with vc1:
                        st.markdown(f"**{v['beschreibung']}** · {v.get('kategorie') or '–'} · "
                                    f"EW {v['eintrittswahrscheinlichkeit']} · TW {v['tragweite']}")
                    with vc2:
                        if st.button("Übernehmen", key=f"ki_risiko_uebernehmen_{pid}_{i}"):
                            create_risiko(pid, v["beschreibung"], v.get("kategorie"),
                                         v["eintrittswahrscheinlichkeit"], v["tragweite"])
                            risiko_vorschlaege.pop(i)
                            st.session_state[f"ki_risiken_vorschlag_{pid}"] = risiko_vorschlaege
                            st.success("Risiko angelegt!"); st.rerun()

        with st.expander("➕ Neues Risiko"):
            with st.form(f"neues_risiko_{pid}"):
                nr_b = st.text_input("Beschreibung")
                nr_k = st.text_input("Kategorie (optional)")
                nc1, nc2 = st.columns(2)
                with nc1:
                    nr_ew = st.selectbox("Eintrittswahrscheinlichkeit", [1, 2, 3],
                                         format_func=lambda x: EW_TW_LABELS[x], key=f"nr_ew_{pid}")
                with nc2:
                    nr_tw = st.selectbox("Tragweite", [1, 2, 3],
                                         format_func=lambda x: EW_TW_LABELS[x], key=f"nr_tw_{pid}")
                if st.form_submit_button("➕ Risiko anlegen", type="primary"):
                    if nr_b.strip():
                        create_risiko(pid, nr_b.strip(), nr_k.strip() or None, nr_ew, nr_tw)
                        st.success("Risiko angelegt!"); st.rerun()

        st.markdown("---")
        ansicht = st.radio("Ansicht", ["Nach Arbeitspaket (RACI)", "Nach Person (AKV)"],
                            horizontal=True, key=f"raci_ansicht_{pid}", label_visibility="collapsed")
        if ansicht == "Nach Arbeitspaket (RACI)":
            st.markdown("#### 🧩 RACI-Matrix")
            st.caption("R = Responsible (durchführend) · A = Accountable (verantwortlich) · "
                      "C = Consulted (beratend) · I = Informed (informiert)")
            matrix = get_raci_matrix(pid)
            if matrix:
                pakete = {}
                for m in matrix:
                    pakete.setdefault(m["arbeitspaket"], []).append(m)
                for paket, eintraege in pakete.items():
                    zeile = " · ".join(f"{e['user_name']}: **{e['rolle']}**" for e in eintraege)
                    st.markdown(f"**{paket}** — {zeile}")
            else:
                st.info("Noch keine RACI-Zuordnungen.")
        else:
            st.markdown("#### 📋 AKV-Tabelle")
            st.caption("Aufgaben/Kompetenzen/Verantwortung je Person – unabhängig von der RACI-Matrix, "
                       "direkt hier pflegen.")
            ressourcen = get_projekt_ressourcen(projekt_id=pid)
            if not ressourcen:
                st.info("Erst im Tab 'Ressourcen' Personen dem Projekt zuordnen, dann hier AKV pflegen.")
            else:
                akv_bestand = {a["user_id"]: a for a in get_akv_eintraege(pid)}
                akv_rows = [
                    {
                        "user_id": r["user_id"],
                        "Person": r["user_name"],
                        "Aufgaben": (akv_bestand.get(r["user_id"]) or {}).get("aufgaben") or "",
                        "Kompetenzen": (akv_bestand.get(r["user_id"]) or {}).get("kompetenzen") or "",
                        "Verantwortung": (akv_bestand.get(r["user_id"]) or {}).get("verantwortung") or "",
                    }
                    for r in ressourcen
                ]
                edited = st.data_editor(
                    akv_rows, use_container_width=True, hide_index=True,
                    column_config={
                        "user_id": None,
                        "Person": st.column_config.TextColumn(disabled=True),
                    },
                    key=f"akv_editor_{pid}"
                )
                if st.button("💾 AKV speichern", key=f"akv_save_{pid}"):
                    for row in edited:
                        upsert_akv_eintrag(pid, row["user_id"], row["Aufgaben"] or None,
                                           row["Kompetenzen"] or None, row["Verantwortung"] or None)
                    st.success("Gespeichert!"); st.rerun()

        with st.expander("➕ RACI-Zuordnung hinzufügen"):
            with st.form(f"raci_{pid}"):
                meilensteine_raci = get_meilensteine(pid, alle=True)
                tasks_raci = get_tasks(projekt_id=pid)
                vorhandene_ap = ["– Freitext unten verwenden –"] + \
                    [m["titel"] for m in meilensteine_raci] + [t["titel"] for t in tasks_raci]
                sel_ap = st.selectbox("Arbeitspaket / Meilenstein (bestehend)", vorhandene_ap)
                ap = st.text_input("...oder neuer Name (Freitext, hat Vorrang)")
                users = get_users()
                user_opts = {u["id"]: u["display_name"] for u in users}
                sel_u = st.selectbox("Person", list(user_opts.keys()), format_func=lambda x: user_opts[x])
                rolle_labels = {"R": "R - Responsible (durchführend)", "A": "A - Accountable (verantwortlich)",
                               "C": "C - Consulted (beratend)", "I": "I - Informed (informiert)"}
                sel_rolle = st.selectbox("Rolle", ["R", "A", "C", "I"], format_func=lambda x: rolle_labels[x])
                if st.form_submit_button("💾 Speichern", type="primary"):
                    ap_final = ap.strip() or (sel_ap if sel_ap != "– Freitext unten verwenden –" else "")
                    if ap_final:
                        set_raci_eintrag(pid, ap_final, sel_u, sel_rolle)
                        st.success("Gespeichert!"); st.rerun()
                    else:
                        st.warning("Bitte ein bestehendes Arbeitspaket wählen oder einen Freitext eingeben.")

        st.markdown("---")
        st.markdown("#### 📅 Terminplanung")
        st.caption(
            "KI entscheidet anhand der RACI-Matrix oben, wer vor Ort dabei sein muss (R/A) "
            "und wer online/nur zur Information teilnimmt (C/I), und erstellt passende Einladungstexte."
        )
        raci_matrix_termin = get_raci_matrix(pid)
        if not raci_matrix_termin:
            st.info("Erst RACI-Zuordnungen oben anlegen, dann Terminvorschlag erstellen.")
        elif ki_service.ki_verfuegbar():
            anlass = st.text_input("Anlass des Termins", placeholder="z.B. Kickoff Umsetzungsphase", key=f"termin_anlass_{pid}")
            if st.button("✨ Terminvorschlag erstellen", key=f"termin_btn_{pid}", disabled=not anlass):
                try:
                    with st.spinner("KI erstellt Terminvorschlag..."):
                        termin = ki_service.generiere_terminvorschlag(p["name"], anlass, raci_matrix_termin)
                    st.session_state[f"termin_ergebnis_{pid}"] = termin
                except Exception as e:
                    st.error(f"Terminvorschlag fehlgeschlagen: {e}")
            termin = st.session_state.get(f"termin_ergebnis_{pid}")
            if termin:
                st.info(f"**Terminvorschlag:** {termin.get('terminvorschlag') or '–'}")
                vor_ort = [t for t in termin.get("teilnehmer", []) if t["modus"] == "vor_ort"]
                online = [t for t in termin.get("teilnehmer", []) if t["modus"] == "online"]
                tc1, tc2 = st.columns(2)
                with tc1:
                    st.markdown("**🏢 Vor Ort**")
                    for t in vor_ort:
                        st.markdown(f"- **{t['name']}** — {t['begruendung']}")
                    if termin.get("einladung_vor_ort"):
                        with st.expander("✉ Einladungstext Vor-Ort"):
                            st.text(termin["einladung_vor_ort"])
                with tc2:
                    st.markdown("**💻 Online / zur Information**")
                    for t in online:
                        st.markdown(f"- **{t['name']}** — {t['begruendung']}")
                    if termin.get("einladung_online"):
                        with st.expander("✉ Einladungstext Online"):
                            st.text(termin["einladung_online"])
        else:
            st.info("Kein KI-Backend verfügbar (siehe Einstellungen).")

    with tab7:
        st.markdown("#### 📊 Status-Zusammenfassung")
        st.caption(
            "KI fasst Tasks, Meilenstein-Fortschritt und die jüngsten Logbuch-Einträge "
            "(Mails, Notizen, Tagesrückblicke, eingefügte Meeting-Zusammenfassungen) "
            "zu einem laufenden Statusbericht zusammen - ersetzt den manuellen Bericht."
        )
        statusbericht = get_projekt_dokument(pid, "statusbericht")
        if ki_service.ki_verfuegbar():
            if st.button("✨ Status jetzt aktualisieren", key=f"ki_status_{pid}"):
                try:
                    alle_tasks = get_tasks(projekt_id=pid)
                    task_stats = {
                        "gesamt": len(alle_tasks),
                        "erledigt": sum(1 for t in alle_tasks if t["status"] == "Erledigt"),
                        "in_fokus": sum(1 for t in alle_tasks if t["status"] == "Fokus"),
                        "wartend": sum(1 for t in alle_tasks if t["status"] == "Warten_auf"),
                    }
                    top_meilensteine = get_meilensteine(pid, parent_id=None)
                    ms_fortschritt = [
                        {"titel": m["titel"], **get_meilenstein_fortschritt(m["id"])}
                        for m in top_meilensteine
                    ]
                    letzte_eintraege = get_interaktionen(projekt_id=pid, limit=12)
                    with st.spinner("KI erstellt Statuszusammenfassung..."):
                        ergebnis = ki_service.generiere_statusbericht(p, task_stats, ms_fortschritt, letzte_eintraege)
                    upsert_projekt_dokument(pid, "statusbericht", ergebnis.get("statusbericht", ""))
                    st.success("Status aktualisiert!"); st.rerun()
                except Exception as e:
                    st.error(f"Status-Update fehlgeschlagen: {e}")
        if statusbericht and statusbericht.get("inhalt"):
            st.markdown(statusbericht["inhalt"])
            st.caption(f"Zuletzt aktualisiert: {str(statusbericht.get('aktualisiert_am'))[:16]}")
        else:
            st.info("Noch kein Statusbericht erstellt.")

        init_export = get_projekt_initialisierung(pid) or {}
        top_meilensteine_export = get_meilensteine(pid, parent_id=None)
        ms_fortschritt_export = [
            {"titel": m["titel"], **get_meilenstein_fortschritt(m["id"])}
            for m in top_meilensteine_export
        ]
        praesentation_html = wb_mod.erstelle_projekt_praesentation(
            p, init_export, (statusbericht or {}).get("inhalt"),
            ms_fortschritt_export, get_risiken(pid)
        )
        st.download_button(
            "⬇ Projektstand als Präsentationsseite (HTML) exportieren",
            praesentation_html, file_name=f"Projektstand_{p['name']}.html",
            mime="text/html", key=f"dl_praesentation_{pid}"
        )

        st.markdown("---")
        st.markdown("#### 📑 Projekt-Export aus hochgeladener Vorlage")
        vorlage_datei = get_dokument_vorlage_datei("projekt_export")
        if not vorlage_datei:
            st.info("Noch keine Vorlage hinterlegt. Unter Einstellungen → Dokument-Vorlagen "
                    "eine Word-/PowerPoint-Datei hochladen.")
        elif not ki_service.ki_verfuegbar():
            st.info("KI-Backend nicht verfügbar - Vorlagen-Export benötigt KI.")
        else:
            st.caption(f"Vorlage: {vorlage_datei['dateiname']} · "
                      f"{len(vorlage_datei['gliederung'])} Kapitel erkannt")
            if st.button("✨ Projektexport aus Vorlage erstellen", key=f"ki_vorlage_export_{pid}"):
                try:
                    projekt_kontext = {
                        "name": p["name"],
                        "beschreibung": p.get("beschreibung"),
                        "ziele": init_export.get("ziele"),
                        "erfolgskriterien": init_export.get("erfolgskriterien"),
                        "kritische_erfolgsfaktoren": init_export.get("kritische_erfolgsfaktoren"),
                        "scope_abgrenzung": init_export.get("scope_abgrenzung"),
                        "meilensteine": ms_fortschritt_export,
                        "risiken": [{"beschreibung": r["beschreibung"], "prioritaet": r["risikoprioritaet"]}
                                   for r in get_risiken(pid)],
                        "statusbericht": (statusbericht or {}).get("inhalt"),
                    }
                    with st.spinner("KI befüllt die Vorlagen-Kapitel..."):
                        kapitel = ki_service.fuelle_vorlage_kapitel(vorlage_datei["gliederung"], projekt_kontext)
                    st.session_state[f"vorlage_export_docx_{pid}"] = kapitel_zu_docx_bytes(
                        f"{p['name']} – Projektexport", kapitel)
                    st.success("Export erstellt – jetzt herunterladbar.")
                except Exception as e:
                    st.error(f"Export fehlgeschlagen: {e}")
            if st.session_state.get(f"vorlage_export_docx_{pid}"):
                st.download_button(
                    "⬇ Als Word-Datei herunterladen", st.session_state[f"vorlage_export_docx_{pid}"],
                    file_name=f"Projektexport_{p['name']}.docx",
                    mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    key=f"dl_vorlage_export_{pid}"
                )

        st.markdown("---")
        st.markdown("#### 📄 Lastenheft & Pflichtenheft")
        st.caption(
            "KI erstellt einen Entwurf aus Zielen, Anforderungen und Scope "
            "(Tab 'Initialisierung') - du bestätigst/editierst den Text."
        )
        init7 = get_projekt_initialisierung(pid) or {}
        risiken7 = get_risiken(pid)

        doku_col1, doku_col2 = st.columns(2)
        with doku_col1:
            st.markdown("**Lastenheft** *(WAS & WOFÜR)*")
            lastenheft = get_projekt_dokument(pid, "lastenheft")
            if ki_service.ki_verfuegbar():
                if st.button("✨ KI-Entwurf erstellen", key=f"ki_lastenheft_{pid}"):
                    try:
                        with st.spinner("KI erstellt Lastenheft-Entwurf..."):
                            ergebnis = ki_service.generiere_lastenheft(p, init7, risiken7)
                        upsert_projekt_dokument(pid, "lastenheft", ergebnis.get("lastenheft", ""))
                        st.success("Entwurf erstellt!"); st.rerun()
                    except Exception as e:
                        st.error(f"KI-Entwurf fehlgeschlagen: {e}")
            with st.form(f"lastenheft_{pid}"):
                lh_default = (lastenheft or {}).get("inhalt") or get_einstellung("vorlage_lastenheft") or ""
                lh_text = st.text_area("Inhalt", value=lh_default, height=280)
                lh_status_opts = ["entwurf", "final"]
                lh_status_default = (lastenheft or {}).get("status") or "entwurf"
                lh_status = st.selectbox("Status", lh_status_opts,
                                         index=lh_status_opts.index(lh_status_default))
                if st.form_submit_button("💾 Speichern", type="primary"):
                    upsert_projekt_dokument(pid, "lastenheft", lh_text, status=lh_status)
                    st.success("Gespeichert!"); st.rerun()
            if lastenheft and lastenheft.get("inhalt"):
                dlc1, dlc2 = st.columns(2)
                with dlc1:
                    st.download_button("⬇ Als Textdatei", lastenheft["inhalt"],
                                       file_name=f"Lastenheft_{p['name']}.txt", key=f"dl_lh_{pid}")
                with dlc2:
                    st.download_button("⬇ Als Word-Datei", text_zu_docx_bytes(f"Lastenheft – {p['name']}", lastenheft["inhalt"]),
                                       file_name=f"Lastenheft_{p['name']}.docx",
                                       mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                       key=f"dl_lh_docx_{pid}")

        with doku_col2:
            st.markdown("**Pflichtenheft** *(WIE)*")
            pflichtenheft = get_projekt_dokument(pid, "pflichtenheft")
            if ki_service.ki_verfuegbar():
                if not lastenheft or not lastenheft.get("inhalt"):
                    st.caption("Erst Lastenheft erstellen - das Pflichtenheft baut darauf auf.")
                elif st.button("✨ KI-Entwurf erstellen", key=f"ki_pflichtenheft_{pid}"):
                    try:
                        with st.spinner("KI erstellt Pflichtenheft-Entwurf..."):
                            ergebnis = ki_service.generiere_pflichtenheft(p, init7, lastenheft["inhalt"])
                        upsert_projekt_dokument(pid, "pflichtenheft", ergebnis.get("pflichtenheft", ""))
                        st.success("Entwurf erstellt!"); st.rerun()
                    except Exception as e:
                        st.error(f"KI-Entwurf fehlgeschlagen: {e}")
            with st.form(f"pflichtenheft_{pid}"):
                pf_default = (pflichtenheft or {}).get("inhalt") or get_einstellung("vorlage_pflichtenheft") or ""
                pf_text = st.text_area("Inhalt", value=pf_default, height=280)
                pf_status_opts = ["entwurf", "final"]
                pf_status_default = (pflichtenheft or {}).get("status") or "entwurf"
                pf_status = st.selectbox("Status", pf_status_opts,
                                         index=pf_status_opts.index(pf_status_default), key=f"pf_status_{pid}")
                if st.form_submit_button("💾 Speichern", type="primary", key=f"pf_save_{pid}"):
                    upsert_projekt_dokument(pid, "pflichtenheft", pf_text, status=pf_status)
                    st.success("Gespeichert!"); st.rerun()
            if pflichtenheft and pflichtenheft.get("inhalt"):
                dpc1, dpc2 = st.columns(2)
                with dpc1:
                    st.download_button("⬇ Als Textdatei", pflichtenheft["inhalt"],
                                       file_name=f"Pflichtenheft_{p['name']}.txt", key=f"dl_pf_{pid}")
                with dpc2:
                    st.download_button("⬇ Als Word-Datei", text_zu_docx_bytes(f"Pflichtenheft – {p['name']}", pflichtenheft["inhalt"]),
                                       file_name=f"Pflichtenheft_{p['name']}.docx",
                                       mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                       key=f"dl_pf_docx_{pid}")

        st.markdown("---")
        st.markdown("#### 💶 Kostenbeschreibung & Stückliste")
        st.caption(
            "Eine Positionsliste für beide Sichten: Material/Dienstleistung = Stückliste, "
            "alle Positionen zusammen = Kostenbeschreibung gegen Budget."
        )
        positionen = get_projekt_positionen(pid)
        TYP_LABELS = {"material": "🔩 Material", "dienstleistung": "🛠 Dienstleistung",
                      "personal": "👤 Personal", "sonstiges": "📦 Sonstiges"}
        if positionen:
            gesamt = sum(float(pos["gesamtpreis"] or 0) for pos in positionen)
            budget = float(p.get("budget_cap") or 0)
            kc1, kc2, kc3 = st.columns(3)
            kc1.metric("Summe Positionen", f"{gesamt:,.2f} €")
            kc2.metric("Budget", f"{budget:,.2f} €" if budget else "–")
            if budget:
                diff = budget - gesamt
                kc3.metric("Verbleibend", f"{diff:,.2f} €")
                if diff < 0:
                    st.warning(f"⚠ Budget um {abs(diff):,.2f} € überschritten.")
            for typ, label in TYP_LABELS.items():
                gruppe = [pos for pos in positionen if pos["typ"] == typ]
                if not gruppe:
                    continue
                st.markdown(f"**{label}**")
                for pos in gruppe:
                    pc1, pc2, pc3, pc4 = st.columns([4, 1.5, 1.5, 0.6])
                    with pc1:
                        lieferant_txt = f" · {pos['lieferant']}" if pos.get("lieferant") else ""
                        st.markdown(f"{pos['bezeichnung']}{lieferant_txt}")
                    with pc2:
                        st.caption(f"{pos['menge']} {pos['einheit']} × {float(pos['einzelpreis']):,.2f} €")
                    with pc3:
                        st.markdown(f"**{float(pos['gesamtpreis']):,.2f} €**")
                    with pc4:
                        if st.button("🗑", key=f"del_pos_{pos['id']}"):
                            delete_projekt_position(pos["id"]); st.rerun()

            import pandas as pd
            export_df = pd.DataFrame([{
                "Typ": TYP_LABELS.get(pos["typ"], pos["typ"]),
                "Bezeichnung": pos["bezeichnung"],
                "Menge": pos["menge"],
                "Einheit": pos["einheit"],
                "Einzelpreis (€)": float(pos["einzelpreis"]),
                "Gesamtpreis (€)": float(pos["gesamtpreis"]),
                "Lieferant": pos.get("lieferant") or "",
            } for pos in positionen])
            exp_col1, exp_col2 = st.columns(2)
            with exp_col1:
                st.download_button("⬇ Als CSV exportieren", export_df.to_csv(index=False).encode("utf-8-sig"),
                                   file_name=f"Kosten_Stueckliste_{p['name']}.csv", key=f"dl_csv_{pid}")
            with exp_col2:
                import io
                xbuf = io.BytesIO()
                export_df.to_excel(xbuf, index=False, sheet_name="Stückliste")
                st.download_button("⬇ Als Excel exportieren", xbuf.getvalue(),
                                   file_name=f"Kosten_Stueckliste_{p['name']}.xlsx", key=f"dl_xlsx_{pid}")
        else:
            st.info("Noch keine Positionen erfasst.")

        with st.expander("➕ Neue Position"):
            with st.form(f"neue_position_{pid}"):
                np_typ = st.selectbox("Typ", list(TYP_LABELS.keys()), format_func=lambda x: TYP_LABELS[x])
                np_bez = st.text_input("Bezeichnung *")
                npc1, npc2, npc3 = st.columns(3)
                with npc1:
                    np_menge = st.number_input("Menge", min_value=0.0, value=1.0, step=1.0)
                with npc2:
                    np_einheit = st.text_input("Einheit", value="Stk")
                with npc3:
                    np_preis = st.number_input("Einzelpreis (€)", min_value=0.0, value=0.0, step=10.0)
                np_lieferant = st.text_input("Lieferant (optional)")
                if st.form_submit_button("➕ Position anlegen", type="primary"):
                    if np_bez.strip():
                        create_projekt_position(pid, np_typ, np_bez.strip(), np_menge, np_einheit or "Stk",
                                                np_preis, np_lieferant.strip() or None)
                        st.success("Position angelegt!"); st.rerun()

        st.markdown("---")
        st.markdown("#### 💬 User-Story-Interview")
        st.caption(
            "Beschreibe eine Anforderung in eigenen Worten - die KI fragt wie in einem echten "
            "Interview nach, bis Rolle, Ziel, Nutzen und Akzeptanzkriterien vollständig sind, "
            "damit keine Basisanforderung vergessen wird."
        )

        chat_key = f"story_chat_{pid}"
        if chat_key not in st.session_state:
            st.session_state[chat_key] = []

        for msg in st.session_state[chat_key]:
            with st.chat_message("user" if msg["rolle"] == "user" else "assistant"):
                st.markdown(msg["text"])

        pending_story_key = f"pending_story_{pid}"

        if not ki_service.ki_verfuegbar():
            st.warning("Kein KI-Backend verfügbar - das Interview braucht eine KI-Verbindung (siehe Einstellungen).")
        else:
            chat_input = st.chat_input("Beschreibe eine Anforderung...", key=f"chat_input_{pid}")
            if chat_input:
                st.session_state[chat_key].append({"rolle": "user", "text": chat_input})
                try:
                    with st.spinner("KI antwortet..."):
                        ergebnis = ki_service.user_story_interview(st.session_state[chat_key], p["name"])
                    antwort = ergebnis.get("antwort", "")
                    st.session_state[chat_key].append({"rolle": "assistent", "text": antwort})
                    if ergebnis.get("story_bereit") and ergebnis.get("story"):
                        st.session_state[pending_story_key] = ergebnis["story"]
                except Exception as e:
                    st.session_state[chat_key].append({"rolle": "assistent", "text": f"⚠ Fehler: {e}"})
                st.rerun()

        pending = st.session_state.get(pending_story_key)
        if pending:
            st.markdown("##### ✅ Story bereit zur Bestätigung")
            with st.form(f"story_confirm_{pid}"):
                s_rolle = st.text_input("Rolle", value=pending.get("rolle", ""))
                s_ziel = st.text_input("Ziel", value=pending.get("ziel", ""))
                s_nutzen = st.text_input("Nutzen", value=pending.get("nutzen", ""))
                s_ak = st.text_area("Akzeptanzkriterien", value=pending.get("akzeptanzkriterien", ""), height=90)
                prio_opts = ["Must", "Should", "Could", "Wont"]
                prio_default = pending.get("prioritaet") or "Should"
                s_prio = st.selectbox("Priorität (MoSCoW)", prio_opts,
                                      index=prio_opts.index(prio_default) if prio_default in prio_opts else 1)
                sc1, sc2 = st.columns(2)
                with sc1:
                    if st.form_submit_button("💾 Story speichern", type="primary"):
                        create_user_story(pid, s_rolle, s_ziel, s_nutzen, s_ak, s_prio,
                                          status="Bestaetigt", quelle="chatbot")
                        st.session_state.pop(pending_story_key, None)
                        st.success("Story gespeichert!"); st.rerun()
                with sc2:
                    if st.form_submit_button("✖ Verwerfen"):
                        st.session_state.pop(pending_story_key, None)
                        st.rerun()

        if st.button("🔄 Interview zurücksetzen", key=f"reset_chat_{pid}"):
            st.session_state.pop(chat_key, None)
            st.session_state.pop(pending_story_key, None)
            st.rerun()

        stories = get_user_stories(pid)
        if stories:
            st.markdown("##### 📋 Erfasste User-Stories")
            for s in stories:
                prio_color = {"Must": "red", "Should": "orange", "Could": "muted",
                             "Wont": "muted"}.get(s["prioritaet"], "muted")
                with st.expander(f"{s['rolle']} {s['ziel']}"):
                    st.markdown(badge(s["prioritaet"], prio_color), unsafe_allow_html=True)
                    if s.get("nutzen"):
                        st.caption(s["nutzen"])
                    if s.get("akzeptanzkriterien"):
                        st.markdown("**Akzeptanzkriterien:**")
                        st.markdown(s["akzeptanzkriterien"])
                    with st.form(f"story_edit_{s['id']}"):
                        se_rolle = st.text_input("Rolle", value=s["rolle"])
                        se_ziel = st.text_input("Ziel", value=s["ziel"])
                        se_nutzen = st.text_input("Nutzen", value=s.get("nutzen") or "")
                        se_ak = st.text_area("Akzeptanzkriterien", value=s.get("akzeptanzkriterien") or "", height=80)
                        prio_opts2 = ["Must", "Should", "Could", "Wont"]
                        se_prio = st.selectbox("Priorität", prio_opts2,
                                               index=prio_opts2.index(s["prioritaet"]) if s["prioritaet"] in prio_opts2 else 1,
                                               key=f"se_prio_{s['id']}")
                        status_opts2 = ["Entwurf", "Bestaetigt"]
                        se_status = st.selectbox("Status", status_opts2,
                                                 index=status_opts2.index(s["status"]) if s["status"] in status_opts2 else 0,
                                                 key=f"se_status_{s['id']}")
                        if st.form_submit_button("💾 Speichern", type="primary"):
                            update_user_story(s["id"], se_rolle, se_ziel, se_nutzen, se_ak, se_prio, se_status)
                            st.success("Gespeichert!"); st.rerun()
                    if st.button("🗑 Story löschen", key=f"del_story_{s['id']}"):
                        delete_user_story(s["id"]); st.rerun()
        else:
            st.info("Noch keine User-Stories erfasst.")

    def _baue_scrum_zyklus_diagramm(sprint, heute):
        """Scrum-Zyklus (Straubel-Foliensatz S2.8): Product Backlog -> Sprint
        Planning -> Sprint (Daily Scrum umschließt die Umsetzung) -> Review ->
        Retrospektive -> zurück in den Product Backlog fürs nächste Inkrement.
        Aktuelle Phase wird anhand der Sprint-Position von 'heute' geschätzt."""
        try:
            start = date.fromisoformat(str(sprint["start_datum"]))
            ende = date.fromisoformat(str(sprint["end_datum"]))
            dauer = max((ende - start).days, 1)
            vergangen = (heute - start).days
        except Exception:
            vergangen, dauer = 0, 1

        if vergangen <= 0:
            aktiv = "Sprint Planning"
        elif vergangen >= dauer:
            aktiv = "Retrospektive"
        elif vergangen >= dauer - 1:
            aktiv = "Review"
        else:
            aktiv = "Umsetzung / Daily Scrum"

        stufen = ["Product Backlog", "Sprint Planning", "Umsetzung / Daily Scrum", "Review", "Retrospektive"]
        n = len(stufen)
        box_w, box_h, gap = 150, 54, 26
        breite = n * box_w + (n - 1) * gap + 20
        svg = [f'<svg viewBox="0 0 {breite} 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">']
        for i, stufe in enumerate(stufen):
            x = 10 + i * (box_w + gap)
            y = 20
            ist_aktiv = (stufe == aktiv)
            farbe = "#16A34A" if ist_aktiv else "#4461D7"
            bg = "#DCFCE7" if ist_aktiv else "#EEF1FC"
            marker = " 🟢" if ist_aktiv else ""
            svg.append(f'<rect x="{x}" y="{y}" width="{box_w}" height="{box_h}" rx="10" '
                      f'fill="{bg}" stroke="{farbe}" stroke-width="2.5"/>')
            svg.append(f'<text x="{x + box_w/2}" y="{y + box_h/2 + 5}" text-anchor="middle" '
                      f'font-size="12" font-weight="700" fill="#1E2235">{stufe}{marker}</text>')
            if i < n - 1:
                ax = x + box_w
                svg.append(f'<line x1="{ax}" y1="{y + box_h/2}" x2="{ax + gap}" y2="{y + box_h/2}" '
                          f'stroke="#9099BE" stroke-width="2" marker-end="url(#arrow)"/>')
        # Rueckpfeil Retrospektive -> Product Backlog (naechster Sprint)
        last_x = 10 + (n - 1) * (box_w + gap) + box_w / 2
        first_x = 10 + box_w / 2
        svg.append(
            f'<path d="M {last_x} {20+box_h} Q {breite/2} 108 {first_x} {20+box_h}" '
            f'fill="none" stroke="#CDD0E0" stroke-width="1.5" stroke-dasharray="5,4" marker-end="url(#arrow)"/>'
        )
        svg.append('<text x="' + str(breite/2) + '" y="115" text-anchor="middle" font-size="10" '
                  'fill="#9099BE">nächster Sprint</text>')
        svg.insert(1, '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" '
                     'orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9099BE"/></marker></defs>')
        svg.append("</svg>")
        st.markdown("".join(svg), unsafe_allow_html=True)

    with tab_budget:
        st.markdown("#### 💰 Budgetüberwachung")
        st.caption("Plan-Budget vs. Ist-Kosten aus Zeiterfassung × Rollen-Stundensatz + Belege "
                   "(Stundensätze in Einstellungen → Rollensätze pflegen).")
        budget_status = get_projekt_budget_status(pid)
        if budget_status["budget_cap"] is None:
            st.info("Kein Plan-Budget hinterlegt – trage ein Budget im Tab 'Projekt bearbeiten' ein.")
        else:
            auslastung = budget_status["auslastung_pct"] or 0
            farbe = "#DC2626" if auslastung >= 100 else ("#D97706" if auslastung >= 80 else "#16A34A")
            bc1, bc2, bc3, bc4 = st.columns(4)
            bc1.metric("Plan-Budget", f"€ {budget_status['budget_cap']:,.0f}")
            bc2.metric("Zeitkosten", f"€ {budget_status['ist_kosten']:,.0f}")
            bc3.metric("Belege", f"€ {budget_status['ist_kosten_belege']:,.0f}")
            bc4.metric("Auslastung gesamt", f"{auslastung:.0f}%")
            st.markdown(f"""
            <div style="background:#F4F5FA;border-radius:8px;height:14px;overflow:hidden;margin:8px 0 16px;">
                <div style="width:{min(auslastung,100)}%;background:{farbe};height:100%;"></div>
            </div>
            """, unsafe_allow_html=True)
            if auslastung >= 100:
                st.markdown(alert("Budget überschritten (Zeitkosten + Belege).", "danger"), unsafe_allow_html=True)
            elif auslastung >= 80:
                st.markdown(alert("Budget zu über 80% ausgelastet.", "warning"), unsafe_allow_html=True)

        if budget_status.get("ist_minuten_unbewertet"):
            std = budget_status["ist_minuten_unbewertet"] / 60
            st.markdown(alert(f"{std:.1f}h ohne konfigurierten Stundensatz gebucht – fließen nicht in die Ist-Kosten ein.", "warning"), unsafe_allow_html=True)

        if budget_status["rollen"]:
            st.markdown("##### Aufschlüsselung nach Rolle")
            for r in budget_status["rollen"]:
                std = (r["minuten"] or 0) / 60
                kosten_txt = f"€ {r['kosten']:,.0f}" if r["kosten"] is not None else "– kein Stundensatz –"
                st.markdown(f"- **{r['rolle']}**: {std:.1f}h · {kosten_txt}")
        else:
            st.info("Noch keine abgeschlossenen Zeitbuchungen für dieses Projekt.")

        st.markdown("---")
        st.markdown("##### 📎 Belege")
        st.caption("Material, Dienstleistungen, Bewirtung, Kilometer, Hotel, Sonstiges – "
                   "projektbezogen mit Betrag, Kategorie und optionalem Beleg-Upload.")

        with st.expander("➕ Neuen Beleg erfassen"):
            with st.form(f"neuer_beleg_{pid}"):
                bl1, bl2 = st.columns(2)
                with bl1:
                    b_kategorie = st.selectbox("Kategorie", BELEG_KATEGORIEN)
                    b_betrag = st.number_input("Betrag (€)", min_value=0.0, step=1.0)
                with bl2:
                    b_datum = st.date_input("Belegdatum", value=date.today())
                    b_beschreibung = st.text_input("Beschreibung", placeholder="z.B. Klemmen für Anlage 3, Taxi zum Kunden...")
                b_datei = st.file_uploader("Beleg-Datei (optional)", type=["pdf", "jpg", "jpeg", "png"])
                if st.form_submit_button("💾 Beleg speichern", type="primary"):
                    if b_betrag > 0:
                        current_user_beleg = st.session_state.get("user") or {}
                        create_beleg(
                            pid, current_user_beleg.get("id"), b_kategorie, b_betrag,
                            beschreibung=b_beschreibung.strip() or None, beleg_datum=b_datum,
                            dateiname=b_datei.name if b_datei else None,
                            dateiinhalt=b_datei.getvalue() if b_datei else None,
                            mimetype=b_datei.type if b_datei else None,
                        )
                        st.success("✓ Beleg gespeichert!"); st.rerun()
                    else:
                        st.warning("Bitte einen Betrag > 0 angeben.")

        belege_pid = get_belege(projekt_id=pid)
        if not belege_pid:
            st.info("Noch keine Belege für dieses Projekt erfasst.")
        else:
            for bl in belege_pid:
                with st.container(border=True):
                    col_bl1, col_bl2 = st.columns([4, 1])
                    with col_bl1:
                        st.markdown(f"**{bl['kategorie']}** · € {float(bl['betrag']):,.2f} · {str(bl['beleg_datum'])}")
                        meta = [x for x in [bl.get("beschreibung"), bl.get("user_name")] if x]
                        if meta:
                            st.caption(" · ".join(meta))
                    with col_bl2:
                        if bl.get("dateiname"):
                            beleg_voll = get_beleg(bl["id"])
                            st.download_button("⬇ Datei", beleg_voll["dateiinhalt"],
                                                file_name=beleg_voll["dateiname"],
                                                mime=beleg_voll.get("mimetype") or "application/octet-stream",
                                                key=f"dl_beleg_{bl['id']}")
                        if st.button("🗑 Löschen", key=f"del_beleg_{bl['id']}"):
                            delete_beleg(bl["id"]); st.rerun()

        st.markdown("---")
        st.markdown("##### 📋 Tätigkeitsnachweis")
        st.caption("Wer hat wie lange in welcher Rolle woran gearbeitet – für Förder-/Forschungsprojekt-Nachweise.")
        buchungen_pid = get_zeitbuchungen(projekt_id=pid)
        if not buchungen_pid:
            st.info("Noch keine abgeschlossenen Zeitbuchungen für dieses Projekt.")
        else:
            je_person = {}
            for b in buchungen_pid:
                person = b.get("user_name") or "– kein Bearbeiter –"
                je_person.setdefault(person, []).append(b)
            for person, eintraege in je_person.items():
                gesamt_std = sum((e.get("dauer_min") or 0) for e in eintraege) / 60
                with st.expander(f"**{person}** – {gesamt_std:.1f}h gesamt ({len(eintraege)} Buchungen)"):
                    for e in sorted(eintraege, key=lambda x: str(x.get("gestartet")), reverse=True):
                        std = (e.get("dauer_min") or 0) / 60
                        datum = str(e.get("gestartet"))[:10]
                        rolle_txt = e.get("rolle") or "– keine Rolle –"
                        taetigkeit = e.get("notiz") or "– keine Tätigkeit erfasst –"
                        st.markdown(f"- {datum} · **{rolle_txt}** · {std:.1f}h – {taetigkeit}")

            nachweis_excel = wb_mod.erstelle_taetigkeitsnachweis_excel(p["name"], buchungen_pid)
            st.download_button(
                "⬇ Tätigkeitsnachweis als Excel exportieren",
                nachweis_excel, file_name=f"Taetigkeitsnachweis_{p['name']}.xlsx",
                mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                key=f"dl_taetigkeitsnachweis_{pid}"
            )

    with tab_rechnung:
        # ── Kostenkalkulation & Rechnungsstellung ────────────────────────────
        st.markdown("#### 🧮 Kostenkalkulation & Rechnungsstellung")
        st.caption("Grundbetrag = Summe der Positionen/Stückliste (Tab 'Dokumente'). "
                   "Gewinn/Rabatt/Skonto in %, Endbetrag danach händisch nachbearbeitbar.")
        positionen_re = get_projekt_positionen(pid)
        summe_positionen = sum(float(pos["gesamtpreis"] or 0) for pos in positionen_re)

        for re_typ, re_label in [("vorrechnung", "Vorrechnung"), ("endrechnung", "Endrechnung")]:
            st.markdown(f"##### {re_label}")
            kalk = get_rechnungskalkulation(pid, re_typ) or {}
            with st.form(f"kalk_{re_typ}_{pid}"):
                kc1, kc2 = st.columns(2)
                with kc1:
                    k_grundbetrag = st.number_input(
                        "Grundbetrag (€)", min_value=0.0, step=10.0,
                        value=float(kalk.get("grundbetrag") or summe_positionen),
                        key=f"gb_{re_typ}_{pid}")
                    k_gewinn = st.number_input("Gewinn (%)", value=float(kalk.get("gewinn_pct") or 0),
                                                step=1.0, key=f"gw_{re_typ}_{pid}")
                with kc2:
                    k_rabatt = st.number_input("Rabatt (%)", value=float(kalk.get("rabatt_pct") or 0),
                                                step=1.0, key=f"rb_{re_typ}_{pid}")
                    k_skonto = st.number_input("Skonto (%)", value=float(kalk.get("skonto_pct") or 0),
                                                step=1.0, key=f"sk_{re_typ}_{pid}")
                if st.form_submit_button(f"💾 {re_label} berechnen & speichern", type="primary"):
                    upsert_rechnungskalkulation(pid, re_typ, k_grundbetrag, k_gewinn, k_rabatt, k_skonto)
                    text = generiere_rechnungstext(p["name"], re_typ, positionen_re,
                                                    get_rechnungskalkulation(pid, re_typ))
                    upsert_projekt_dokument(pid, re_typ, text)
                    st.success(f"{re_label} berechnet und Entwurf erzeugt!"); st.rerun()

            kalk_aktuell = get_rechnungskalkulation(pid, re_typ)
            if kalk_aktuell:
                st.metric(f"Endbetrag ({re_label})", f"€ {float(kalk_aktuell['endbetrag']):,.2f}")
                dok = get_projekt_dokument(pid, re_typ)
                if dok and dok.get("inhalt"):
                    with st.expander(f"📄 {re_label}-Entwurf (händisch nachbearbeitbar)"):
                        re_text = st.text_area("Text", value=dok["inhalt"], height=220,
                                                key=f"re_text_{re_typ}_{pid}", label_visibility="collapsed")
                        if st.button("💾 Text speichern", key=f"re_save_{re_typ}_{pid}"):
                            upsert_projekt_dokument(pid, re_typ, re_text)
                            st.success("Gespeichert!"); st.rerun()
                        st.download_button(f"⬇ {re_label} als Textdatei", dok["inhalt"],
                                            file_name=f"{re_label}_{p['name']}.txt",
                                            key=f"dl_re_{re_typ}_{pid}")
            st.markdown("---")

        # ── Zwischenberichte & Nachweise ──────────────────────────────────────
        st.markdown("#### 📅 Zwischenberichte & Nachweise")
        st.caption("Berichtspflichten mit Rhythmus (z.B. Fördergeber-Zwischenbericht) – "
                   "je Fälligkeit einen Nachweis (Datei) hinterlegen.")
        berichtspflichten_pid = get_berichtspflichten(pid)
        if not berichtspflichten_pid:
            st.info("Noch keine Berichtspflichten für dieses Projekt angelegt.")
        for bp in berichtspflichten_pid:
            with st.container(border=True):
                col_bp1, col_bp2 = st.columns([5, 1])
                with col_bp1:
                    st.markdown(f"**{bp['bezeichnung']}** · {bp['rhythmus']} · Start {bp['start_datum']}")
                with col_bp2:
                    if st.button("🗑", key=f"del_bp_{bp['id']}"):
                        delete_berichtspflicht(bp["id"]); st.rerun()

                nachweise = get_berichtsnachweise(bp["id"])
                nachweis_daten = {n["faelligkeit_datum"] for n in nachweise}
                for faelligkeit in berechne_faelligkeiten(bp):
                    erledigt = faelligkeit in nachweis_daten
                    ueberfaellig = not erledigt and faelligkeit < date.today()
                    status_icon = "✅" if erledigt else ("🔴" if ueberfaellig else "⏳")
                    st.markdown(f"{status_icon} **{faelligkeit}**" +
                                (" – eingereicht" if erledigt else " – offen"))
                    if not erledigt:
                        with st.expander(f"Nachweis für {faelligkeit} einreichen", expanded=False):
                            with st.form(f"nachweis_{bp['id']}_{faelligkeit}"):
                                n_datei = st.file_uploader("Nachweis-Datei", type=["pdf", "jpg", "jpeg", "png"],
                                                            key=f"nf_{bp['id']}_{faelligkeit}")
                                n_notiz = st.text_input("Notiz (optional)", key=f"nn_{bp['id']}_{faelligkeit}")
                                if st.form_submit_button("✅ Als eingereicht markieren"):
                                    current_user_bp = st.session_state.get("user") or {}
                                    reiche_berichtsnachweis_ein(
                                        bp["id"], faelligkeit, user_id=current_user_bp.get("id"),
                                        dateiname=n_datei.name if n_datei else None,
                                        dateiinhalt=n_datei.getvalue() if n_datei else None,
                                        mimetype=n_datei.type if n_datei else None,
                                        notiz=n_notiz.strip() or None,
                                    )
                                    st.success("Nachweis erfasst!"); st.rerun()
                    else:
                        n = next(n for n in nachweise if n["faelligkeit_datum"] == faelligkeit)
                        if n.get("dateiname"):
                            voll = get_berichtsnachweis(n["id"])
                            st.download_button("⬇ Nachweis-Datei", voll["dateiinhalt"],
                                                file_name=voll["dateiname"],
                                                mime=voll.get("mimetype") or "application/octet-stream",
                                                key=f"dl_nachweis_{n['id']}")

        with st.expander("➕ Neue Berichtspflicht"):
            with st.form(f"neue_berichtspflicht_{pid}"):
                bp_bez = st.text_input("Bezeichnung *", placeholder="z.B. Zwischenbericht Fördergeber XY")
                bp_rhythmus = st.selectbox("Rhythmus", ["einmalig", "quartalsweise", "halbjaehrlich", "jaehrlich"])
                bp_start = st.date_input("Start-/Fälligkeitsdatum", value=date.today())
                if st.form_submit_button("➕ Anlegen", type="primary"):
                    if bp_bez.strip():
                        create_berichtspflicht(pid, bp_bez.strip(), bp_rhythmus, bp_start)
                        st.success("Berichtspflicht angelegt!"); st.rerun()

        st.markdown("---")

        # ── Schätzverfahren ───────────────────────────────────────────────────
        st.markdown("#### 📐 Schätzverfahren")
        st.caption("2-Punkt- und 3-Punkt-Schätzung (PERT) für Zeiten/Kosten, Story-Points für agile Vorgehensmodelle.")
        schaetzungen_pid = get_schaetzungen(pid)
        if not schaetzungen_pid:
            st.info("Noch keine Schätzungen für dieses Projekt.")
        for s in schaetzungen_pid:
            with st.container(border=True):
                col_s1, col_s2 = st.columns([5, 1])
                with col_s1:
                    methode_label = {"zwei_punkt": "2-Punkt", "drei_punkt": "3-Punkt (PERT)",
                                     "story_points": "Story Points"}.get(s["methode"], s["methode"])
                    einheit_txt = "SP" if s["methode"] == "story_points" else s["einheit"]
                    st.markdown(f"**{s['bezeichnung']}** · {methode_label} · Ergebnis: **{float(s['ergebnis']):.2f} {einheit_txt}**")
                with col_s2:
                    if st.button("🗑", key=f"del_schaetzung_{s['id']}"):
                        delete_schaetzung(s["id"]); st.rerun()

        with st.expander("➕ Neue Schätzung"):
            with st.form(f"neue_schaetzung_{pid}"):
                s_bez = st.text_input("Was wird geschätzt? *", placeholder="z.B. SPS-Programmierung Anlage 3")
                s_methode = st.selectbox("Methode", ["zwei_punkt", "drei_punkt", "story_points"],
                                          format_func=lambda x: {"zwei_punkt": "2-Punkt-Schätzung",
                                                                  "drei_punkt": "3-Punkt-Schätzung (PERT)",
                                                                  "story_points": "Story Points (relativ, agil)"}[x])
                sc1, sc2, sc3 = st.columns(3)
                with sc1:
                    s_opt = st.number_input("Optimistisch", min_value=0.0, step=1.0, key=f"s_opt_{pid}")
                with sc2:
                    s_wahr = st.number_input("Wahrscheinlich", min_value=0.0, step=1.0, key=f"s_wahr_{pid}")
                with sc3:
                    s_pess = st.number_input("Pessimistisch", min_value=0.0, step=1.0, key=f"s_pess_{pid}")
                s_sp = st.number_input("Story Points", min_value=0.0, step=1.0, key=f"s_sp_{pid}")
                s_einheit = st.selectbox("Einheit (bei 2-/3-Punkt)", ["Stunden", "Tage"], key=f"s_einheit_{pid}")
                if st.form_submit_button("➕ Schätzung anlegen", type="primary"):
                    if s_bez.strip():
                        create_schaetzung(pid, s_bez.strip(), s_methode,
                                          optimistisch=s_opt or None, wahrscheinlich=s_wahr or None,
                                          pessimistisch=s_pess or None, story_points=s_sp or None,
                                          einheit=s_einheit)
                        st.success("Schätzung angelegt!"); st.rerun()

    if tab8 is not None:
        with tab8:
            heute = date.today()
            sprints = get_sprints(pid)
            if not sprints:
                st.info(
                    "Noch keine Sprints angelegt. Gehe zu Tab 'Initialisierung' → "
                    "'Vorgehensmodell-Wahl' → 'Struktur generieren', um Sprints "
                    "automatisch anzulegen (oder lege sie manuell in Gantt & Zeitplan an)."
                )
            else:
                def _sprint_ist_aktuell(s):
                    try:
                        return s.get("start_datum") and s.get("end_datum") and \
                            date.fromisoformat(str(s["start_datum"])) <= heute <= date.fromisoformat(str(s["end_datum"]))
                    except Exception:
                        return False

                sprint_labels = {}
                for s in sprints:
                    marker = " 🟢 Aktuell" if _sprint_ist_aktuell(s) else ""
                    sprint_labels[s["id"]] = f"{s['titel']}{marker}"

                aktueller_sprint_id = next((s["id"] for s in sprints if _sprint_ist_aktuell(s)), sprints[0]["id"])
                sel_sprint_id = st.selectbox(
                    "Sprint", list(sprint_labels.keys()), format_func=lambda x: sprint_labels[x],
                    index=list(sprint_labels.keys()).index(aktueller_sprint_id),
                    key=f"sprint_sel_{pid}"
                )
                sprint = get_meilenstein(sel_sprint_id)

                st.markdown("##### 🔄 Scrum-Zyklus")
                _baue_scrum_zyklus_diagramm(sprint, heute)

                sc1, sc2 = st.columns([3, 1])
                with sc1:
                    st.markdown(f"**🎯 Sprint-Ziel:** {sprint.get('beschreibung') or '–'}")
                    st.caption(f"{sprint.get('start_datum') or '?'} → {sprint.get('end_datum') or '?'}")
                with sc2:
                    if _sprint_ist_aktuell(sprint):
                        st.markdown(badge("🟢 Läuft gerade", "green"), unsafe_allow_html=True)

                with st.expander("✏ Sprint-Ziel bearbeiten"):
                    with st.form(f"sprintziel_{sel_sprint_id}"):
                        neues_ziel = st.text_area("Sprint-Ziel", value=sprint.get("beschreibung") or "", height=70)
                        if st.form_submit_button("💾 Speichern", type="primary"):
                            update_meilenstein(sel_sprint_id, beschreibung=neues_ziel)
                            st.success("Gespeichert!"); st.rerun()

                sprint_tasks = get_tasks_fuer_meilenstein(sel_sprint_id)
                st.markdown("---")
                st.markdown("#### 📋 Sprint-Board")
                board_cfg = [
                    ("Backlog", "📥 To Do", "#9099BE", "#F4F5FA"),
                    ("Fokus", "▶ In Progress", "#4461D7", "#EEF1FC"),
                    ("Warten_auf", "👀 Review", "#D97706", "#FFFBEB"),
                    ("Erledigt", "✓ Done", "#16A34A", "#F0FDF4"),
                ]
                next_map = {
                    "Backlog": [("▶ In Progress", "Fokus")],
                    "Fokus": [("👀 Review", "Warten_auf"), ("↩ To Do", "Backlog")],
                    "Warten_auf": [("✓ Done", "Erledigt"), ("↩ In Progress", "Fokus")],
                    "Erledigt": [("↩ In Progress", "Fokus")],
                }
                board_cols = st.columns(4, gap="small")
                for col_widget, (status_key, col_label, col_color, col_bg) in zip(board_cols, board_cfg):
                    col_tasks = [t for t in sprint_tasks if t["status"] == status_key]
                    with col_widget:
                        st.markdown(
                            f'<div style="background:{col_bg};border:1px solid #E2E5F0;border-radius:8px;'
                            f'padding:8px 10px;margin-bottom:8px;border-top:3px solid {col_color};">'
                            f'<span style="font-size:0.72rem;font-weight:800;color:{col_color};">{col_label}</span> '
                            f'<span style="font-size:0.68rem;color:{col_color};">({len(col_tasks)})</span></div>',
                            unsafe_allow_html=True
                        )
                        for t in col_tasks:
                            st.markdown(
                                f'<div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:6px;'
                                f'padding:8px 10px;margin-bottom:6px;font-size:0.8rem;color:#1E2235;">{t["titel"]}</div>',
                                unsafe_allow_html=True
                            )
                            for lbl, nst in next_map.get(status_key, []):
                                if st.button(lbl, key=f"sb_{sel_sprint_id}_{t['id']}_{nst}", use_container_width=True):
                                    update_task(t["id"], status=nst); st.rerun()

                st.markdown("---")
                st.markdown("#### 📦 Product Backlog")
                st.caption("Tasks ohne Sprint-Zuordnung - hier einem Sprint zuweisen.")
                backlog_tasks = get_tasks(projekt_id=pid, ohne_meilenstein=True)
                if backlog_tasks:
                    for t in backlog_tasks:
                        bc1, bc2 = st.columns([4, 2])
                        with bc1:
                            st.markdown(f"{t['titel']}")
                        with bc2:
                            if st.button(f"→ {sprint['titel']}", key=f"pull_{t['id']}", use_container_width=True):
                                update_task(t["id"], meilenstein_id=sel_sprint_id)
                                st.rerun()
                else:
                    st.info("Product Backlog ist leer.")
                with st.expander("➕ Neuer Task (direkt in Product Backlog)"):
                    with st.form(f"neuer_backlog_task_{pid}"):
                        nbt_titel = st.text_input("Titel *")
                        nbt_aw = st.selectbox("Aufwand", ["2m", "15m", "2h", "4h+"], index=1)
                        if st.form_submit_button("➕ Anlegen", type="primary"):
                            if nbt_titel.strip():
                                create_task(pid, nbt_titel.strip(), aufwandsklasse=nbt_aw)
                                st.success("Angelegt!"); st.rerun()

                st.markdown("---")
                st.markdown("#### 📝 Sprint-Review / Retro")
                retro_notizen = get_interaktionen(meilenstein_id=sel_sprint_id, limit=20)
                if retro_notizen:
                    for n in retro_notizen:
                        icon = {"Review": "🔍", "Retro": "🔄"}.get(n["typ"], "📝")
                        st.markdown(f"{icon} **{n['typ']}** · {str(n['erstellt_am'])[:16]}  \n{n['inhalt']}")
                else:
                    st.caption("Noch keine Review-/Retro-Notizen für diesen Sprint.")
                with st.form(f"retro_{sel_sprint_id}"):
                    retro_typ = st.selectbox("Typ", ["Review", "Retro"])
                    retro_text = st.text_area("Notiz", height=80,
                                              placeholder="Was lief gut? Was verbessern? Ergebnis der Sprint-Review...")
                    if st.form_submit_button("💾 Speichern", type="primary"):
                        if retro_text.strip():
                            create_interaktion(retro_text.strip(), projekt_id=pid, typ=retro_typ,
                                              meilenstein_id=sel_sprint_id)
                            st.success("Gespeichert!"); st.rerun()

    if tab_gantt is not None:
        with tab_gantt:
            heute_g = date.today()
            if st.session_state.get("gantt_meilenstein_id"):
                gantt_mod._ansicht_meilenstein(st.session_state["gantt_meilenstein_id"], pid, heute_g)
                if st.button("← Zurück zur Projekt-Übersicht", key=f"gantt_tab_back_{pid}"):
                    st.session_state["gantt_meilenstein_id"] = None
                    st.rerun()
            else:
                gantt_mod._ansicht_projekt(pid, heute_g, zeige_v_modell=False)

    if tab_vmodell is not None:
        with tab_vmodell:
            phasen_vm = [m for m in get_meilensteine(pid, alle=True) if m.get("typ", "phase") == "phase"]
            phasen_vm.sort(key=lambda m: (m.get("start_datum") or "9999", m.get("reihenfolge") or 0))
            if len(phasen_vm) >= 3:
                gantt_mod._baue_v_modell_diagramm(phasen_vm, date.today())
            else:
                st.info("Mindestens 3 Phasen-Meilensteine nötig für die V-Modell-Darstellung "
                        "(Tab 'Gantt' → Meilensteine anlegen).")
