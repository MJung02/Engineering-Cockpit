"""Dashboard – Teamwork.com Stil"""
import streamlit as st
from datetime import datetime
from dal import (get_dashboard_stats, get_tasks, get_tasks_sortiert, get_stakeholder_warteliste,
                 get_interaktionen, get_all_projekte, update_task, create_interaktion, create_task)
from pages.helpers import (topbar, badge, aufwand_badge, status_badge,
                            prio_badge, eskalation_badge, section_header, alert, task_card_list)
import ki_service

def show():
    # Topbar rendern
    st.markdown(topbar("Dashboard", "Guten Morgen – dein Überblick"), unsafe_allow_html=True)

    # Hauptcontainer für Padding
    with st.container():
        # ── Daily-Log (Phase G) ──────────────────────────────────────────────
        with st.expander("📓 Daily-Log — Was habe ich heute gemacht?", expanded=False):
            st.caption(
                "Freitext eintragen - die KI ordnet automatisch bestehenden Projekten zu, "
                "erkennt Fortschritt und schlägt konkrete Folge-Tasks vor."
            )
            log_text = st.text_area("Tagesrückblick", height=100, key="daily_log_text",
                                    placeholder="z.B. Heute mit Hendrik über Maschine 3 gesprochen, "
                                                "Testmethoden-Entwurf für Risiko-Projekt fertig, "
                                                "morgen noch die SPS-Datenpunktliste prüfen...")
            if st.button("✨ Analysieren & zuordnen", type="primary", key="daily_log_btn",
                        disabled=not ki_service.ki_verfuegbar() or not log_text):
                aktive_projekte = get_all_projekte(status_filter=["Begonnen"])
                try:
                    with st.spinner("KI analysiert deinen Tagesrückblick..."):
                        ergebnis = ki_service.analysiere_tagesrueckblick(log_text, aktive_projekte)
                    st.session_state["daily_log_ergebnis"] = ergebnis
                    st.session_state["daily_log_orig"] = log_text
                except Exception as e:
                    st.error(f"Analyse fehlgeschlagen: {e}")

            ergebnis = st.session_state.get("daily_log_ergebnis")
            if ergebnis:
                proj_by_name = {p["name"]: p["id"] for p in get_all_projekte()}
                if ergebnis.get("naechste_schritte"):
                    st.info(f"**Nächste Schritte:** {ergebnis['naechste_schritte']}")
                for i, eintrag in enumerate(ergebnis.get("eintraege", [])):
                    pid = proj_by_name.get(eintrag["projekt_name"])
                    if not pid:
                        continue
                    fortschritt_icon = {"gut": "🟢", "neutral": "🟡", "verzoegert": "🔴"}.get(eintrag["fortschritt"], "🟡")
                    ec1, ec2 = st.columns([5, 1])
                    with ec1:
                        st.markdown(f"{fortschritt_icon} **{eintrag['projekt_name']}** — {eintrag['kernaussage']}")
                    with ec2:
                        if st.button("💾 Speichern", key=f"dl_save_{i}_{eintrag['projekt_name']}", use_container_width=True):
                            create_interaktion(eintrag["kernaussage"], projekt_id=pid, typ="Tagesrueckblick")
                            st.success("Gespeichert!")
                for i, task in enumerate(ergebnis.get("neue_tasks", [])):
                    pid = proj_by_name.get(task["projekt_name"])
                    if not pid:
                        continue
                    tc1, tc2 = st.columns([5, 1])
                    with tc1:
                        st.markdown(f"📋 Vorschlag für **{task['projekt_name']}**: {task['titel']}")
                    with tc2:
                        if st.button("➕ Anlegen", key=f"dl_task_{i}", use_container_width=True):
                            create_task(pid, task["titel"], aufwandsklasse=task["aufwandsklasse"])
                            st.success("Task angelegt!")

        # KPI Row
        stats = get_dashboard_stats()
        c1, c2, c3, c4, c5 = st.columns(5)
        c1.metric("Aktive Projekte", stats["aktive_projekte"])
        c2.metric("Im Fokus", stats["fokus_tasks"])
        c3.metric("Warten auf", stats["warten_tasks"])
        c4.metric("🚨 Eskaliert", stats["eskaliert"])
        c5.metric("⚡ Quick-Wins", stats["quick_wins"])

        st.markdown("<div style='height:20px'></div>", unsafe_allow_html=True)

        # ── Eskalations-Alert ─────────────────────────────────────────────────
        eskaliert = [t for t in get_tasks(status="Warten_auf") if (t.get("eskalationsstufe") or 0) >= 2]
        if eskaliert:
            names = ", ".join(f"<b>{t['warten_auf_person']}</b> ({t['titel'][:35]})" for t in eskaliert[:3])
            st.markdown(alert(f"{len(eskaliert)} Eskalation(en) erfordern Handlung: {names}", "danger"), unsafe_allow_html=True)

        # ── 2-Spalten-Layout ──────────────────────────────────────────────────
        left, right = st.columns([3, 2], gap="large")

        with left:
            # ── Fokus Tasks ───────────────────────────────────────────────────
            fokus = get_tasks_sortiert(status="Fokus")
            st.markdown(section_header("Im Fokus", len(fokus)), unsafe_allow_html=True)

            if not fokus:
                st.markdown(alert("Keine Fokus-Tasks. Ziehe Tasks aus dem Backlog in den Fokus.", "info"), unsafe_allow_html=True)
            
            for t in fokus:
                # Rendert die Karte
                st.markdown(task_card_list(t), unsafe_allow_html=True)
                
                # Buttons direkt unter der Karte
                ca, cb, _ = st.columns([1, 1, 2])
                with ca:
                    if st.button("✅ Erledigt", key=f"d_done_{t['id']}", use_container_width=True):
                        update_task(t["id"], status="Erledigt")
                        st.rerun()
                with cb:
                    if st.button("↩ Backlog", key=f"d_bk_{t['id']}", use_container_width=True):
                        update_task(t["id"], status="Backlog")
                        st.rerun()
                st.markdown("<div style='margin-bottom:15px;'></div>", unsafe_allow_html=True)

            # ── Quick-Wins ────────────────────────────────────────────────────
            st.markdown("<br>", unsafe_allow_html=True)
            qw = [t for t in get_tasks_sortiert(status="Backlog") if t["aufwandsklasse"] in ("2m","15m")][:5]
            st.markdown(section_header("⚡ Quick-Wins", len(qw)), unsafe_allow_html=True)

            if not qw:
                st.markdown('<div style="font-size:0.82rem;color:#9099BE;padding:8px 0;">Keine Quick-Wins.</div>', unsafe_allow_html=True)
            for t in qw:
                farbe = t.get("projekt_farbe","#4461D7") or "#4461D7"
                # Quick-Win Zeile
                st.markdown(f"""
                <div style="background:#FFFFFF; border:1px solid #E2E5F0; border-radius:8px; padding:10px 16px; margin-bottom:6px; display:flex; align-items:center; gap:12px; border-left:3px solid {farbe};">
                    <div style="flex:1; font-size:0.85rem; font-weight:700; color:#1E2235;">
                        {t['titel'][:70]}
                    </div>
                    <div style="display:flex; gap:6px; align-items:center;">
                        {aufwand_badge(t['aufwandsklasse'])}
                        <span style="font-size:0.72rem; color:{farbe}; font-weight:600; white-space:nowrap;">
                            ◆ {(t.get('projekt_name') or '–')[:20]}
                        </span>
                    </div>
                </div>
                """, unsafe_allow_html=True)
                if st.button("▶ In Fokus", key=f"d_qw_{t['id']}", use_container_width=True):
                    update_task(t["id"], status="Fokus")
                    st.rerun()

            # ── Warten auf ────────────────────────────────────────────────────
            st.markdown("<br>", unsafe_allow_html=True)
            warten = get_tasks_sortiert(status="Warten_auf")
            st.markdown(section_header("⏳ Warten auf Rückmeldung", len(warten)), unsafe_allow_html=True)
            for t in warten[:5]:
                st.markdown(task_card_list(t), unsafe_allow_html=True)
                st.markdown("<div style='margin-bottom:10px;'></div>", unsafe_allow_html=True)

        with right:
            # ── Stakeholder Radar ─────────────────────────────────────────────
            st.markdown(section_header("👥 Stakeholder-Radar"), unsafe_allow_html=True)
            warteliste = get_stakeholder_warteliste()
            if not warteliste:
                st.markdown(alert("Keine offenen Anfragen.", "success"), unsafe_allow_html=True)
            for w in warteliste:
                esk = w.get("max_eskalation") or 0
                esk_col = ["#9099BE","#D97706","#EA580C","#DC2626"][min(esk,3)]
                esk_bg  = ["#ECEEF5","#FEF3C7","#FFEDD5","#FEE2E2"][min(esk,3)]
                esk_icon= ["●","⚠","🔴","🚨"][min(esk,3)]
                st.markdown(f"""
                <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                            padding:12px 16px;margin-bottom:8px;box-shadow:0 1px 3px rgba(30,34,53,0.06);
                            border-left:3px solid {esk_col};">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div style="font-weight:700;font-size:0.9rem;color:#1E2235;">{esk_icon} {w['warten_auf_person']}</div>
                        <span style="background:{esk_bg};color:{esk_col};border-radius:10px;padding:2px 10px;font-size:0.72rem;font-weight:700;">
                            {w['anzahl']} offen
                        </span>
                    </div>
                </div>
                """, unsafe_allow_html=True)

            # ── Projekt-Status ────────────────────────────────────────────────
            st.markdown("<br>", unsafe_allow_html=True)
            st.markdown(section_header("📁 Aktive Projekte"), unsafe_allow_html=True)
            projekte = get_all_projekte(status_filter=["Begonnen"])
            for p in projekte:
                tasks_p = get_tasks(projekt_id=p["id"])
                gesamt = len(tasks_p)
                offen  = sum(1 for t in tasks_p if t["status"] != "Erledigt")
                fokus_n = sum(1 for t in tasks_p if t["status"] == "Fokus")
                warten_n = sum(1 for t in tasks_p if t["status"] == "Warten_auf")
                done = gesamt - offen
                pct  = int(done / gesamt * 100) if gesamt > 0 else 0
                farbe = p.get("farbe","#4461D7") or "#4461D7"
                st.markdown(f"""
                <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                            padding:14px 16px 12px;margin-bottom:8px;box-shadow:0 1px 3px rgba(30,34,53,0.06);
                            border-left:3px solid {farbe};">
                    <div style="font-weight:700;font-size:0.88rem;color:#1E2235;margin-bottom:4px;">{p['name'][:45]}</div>
                    <div style="display:flex;gap:14px;font-size:0.72rem;font-family:sans-serif;margin-bottom:8px;">
                        <span style="color:#4461D7;">{fokus_n} Fokus</span>
                        <span style="color:#D97706;">{warten_n} Warten</span>
                        <span style="color:#9099BE;">{offen}/{gesamt} offen</span>
                        <span style="color:#16A34A;">{pct}%</span>
                    </div>
                    <div style="background:#ECEEF5;height:5px;border-radius:3px;overflow:hidden;">
                        <div style="background:{farbe};width:{pct}%;height:5px;border-radius:3px;"></div>
                    </div>
                </div>
                """, unsafe_allow_html=True)

            # ── Letzte Aktivitäten ────────────────────────────────────────────
            st.markdown("<br>", unsafe_allow_html=True)
            st.markdown(section_header("🕐 Letzte Aktivitäten"), unsafe_allow_html=True)
            letzte = get_interaktionen(limit=6)
            for i in letzte:
                typ_icon = {"Notiz":"📝","Mail":"📧","Call":"📞","Loesung":"💡","Snippet":"🔧"}.get(i["typ"],"📝")
                ts = str(i["erstellt_am"])[:16] if i["erstellt_am"] else ""
                st.markdown(f"""
                <div style="padding:8px 0;border-bottom:1px solid #E2E5F0;">
                    <div style="font-size:0.82rem;color:#1E2235;">{typ_icon} {i['inhalt'][:65]}{'…' if len(i['inhalt'])>65 else ''}</div>
                    <div style="font-size:0.68rem;color:#9099BE;margin-top:2px;">
                        {ts} · {i.get('projekt_name') or '–'}
                    </div>
                </div>
                """, unsafe_allow_html=True)

if __name__ == "__main__":
    show()