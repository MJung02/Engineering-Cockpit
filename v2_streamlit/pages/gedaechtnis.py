"""Technik-Gedächtnis – Teamwork.com Stil"""
import streamlit as st
from dal import fulltext_search, create_interaktion, get_all_projekte, get_tasks
from pages.helpers import topbar, aufwand_badge, status_badge, alert


def show():
    st.markdown(topbar("Technik-Gedächtnis", "Volltextsuche · Wissensarchiv · Lösungsdatenbank"), unsafe_allow_html=True)
    st.markdown('<div style="padding:0 28px;">', unsafe_allow_html=True)

    # ── Mail / Text Drop-Zone ─────────────────────────────────────────────────
    with st.expander("📧 Schnell erfassen – Mail / Notiz / Lösung Drop-Zone", expanded=False):
        projekte = get_all_projekte(status_filter=["Begonnen","Unterbrochen"])
        tasks_alle = get_tasks(status=["Fokus","Backlog","Warten_auf"])
        st.markdown("""
        <div style="font-size:0.8rem;color:#5B6488;margin-bottom:10px;">
            Füge hier Mail-Inhalte, Teams-Nachrichten oder technische Lösungen ein – sie werden sofort durchsuchbar archiviert.
        </div>
        """, unsafe_allow_html=True)
        dc1, dc2 = st.columns([4,2])
        with dc1:
            drop_text = st.text_area("Inhalt *", height=100,
                                      placeholder="E-Mail einfügen, technische Lösung, Erkenntnisse...")
        with dc2:
            drop_proj = st.selectbox("Projekt",
                                      [None]+[p["id"] for p in projekte],
                                      format_func=lambda x: "– kein Projekt –" if x is None else
                                      next((p["name"][:30] for p in projekte if p["id"]==x),""))
            drop_typ  = st.selectbox("Typ", ["Notiz","Loesung","Mail","Snippet","Call"])
            drop_person = st.text_input("Person", placeholder="Manuel, Hendrik...")
        if st.button("💾 Im Archiv speichern", type="primary"):
            if drop_text:
                create_interaktion(drop_text, projekt_id=drop_proj, typ=drop_typ,
                                   person=drop_person or None)
                st.success("✓ Im Technik-Gedächtnis gespeichert!"); st.rerun()

    st.markdown("<div style='height:16px'></div>", unsafe_allow_html=True)

    # ── Suchleiste ────────────────────────────────────────────────────────────
    st.markdown("""
    <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:10px;
                padding:16px 20px;margin-bottom:16px;box-shadow:0 1px 3px rgba(30,34,53,0.06);">
        <div style="font-size:0.78rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;
                    color:#9099BE;margin-bottom:10px;">🔍 Deep Search – Volltext über alle Daten</div>
    """, unsafe_allow_html=True)
    sc1, sc2 = st.columns([6,1])
    with sc1:
        suchbegriff = st.text_input("Suche",
            placeholder="z.B. Frequenzumrichter Fehler · TIA Portal Export · Siemens S7-1500 · Power App SharePoint",
            label_visibility="collapsed")
    with sc2:
        search_btn = st.button("🔍 Suchen", type="primary", use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)

    # Schnell-Tags
    tags = ["SPS","E-Plan","Siemens","Frequenzumrichter","TIA Portal","Power App","SharePoint","Maschine 1"]
    t_cols = st.columns(len(tags))
    for i, tag in enumerate(tags):
        with t_cols[i]:
            if st.button(tag, key=f"stag_{tag}", use_container_width=True):
                suchbegriff = tag; search_btn = True

    st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)

    # ── Ergebnisse ────────────────────────────────────────────────────────────
    if suchbegriff and (search_btn or len(suchbegriff) > 2):
        results = fulltext_search(suchbegriff)
        total = sum(len(v) for v in results.values())

        if total == 0:
            st.markdown(alert(f'Keine Treffer für „{suchbegriff}"', "warning"), unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div style="background:#EEF1FC;border:1px solid #C7D2F5;border-radius:8px;
                        padding:10px 16px;margin-bottom:16px;font-size:0.84rem;color:#1E3A8A;">
                <b>{total} Treffer</b> für „{suchbegriff}" ·
                {len(results['tasks'])} Tasks ·
                {len(results['interaktionen'])} Logeinträge ·
                {len(results['projekte'])} Projekte
            </div>
            """, unsafe_allow_html=True)

            # Lösungen zuerst (Gold wert!)
            loesungen = [i for i in results["interaktionen"] if i["typ"] == "Loesung"]
            if loesungen:
                st.markdown("""
                <div style="font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;
                            color:#16A34A;padding:14px 0 8px;border-bottom:2px solid #DCFCE7;margin-bottom:12px;">
                    💡 Gefundene Lösungen
                </div>
                """, unsafe_allow_html=True)
                for i in loesungen:
                    ts = str(i["erstellt_am"])[:10] if i["erstellt_am"] else ""
                    st.markdown(f"""
                    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-left:4px solid #16A34A;
                                border-radius:8px;padding:14px 18px;margin-bottom:10px;
                                box-shadow:0 1px 3px rgba(22,163,74,0.08);">
                        <div style="font-size:0.88rem;color:#14532D;line-height:1.6;">{i['inhalt']}</div>
                        <div style="font-size:0.68rem;color:#16A34A;font-family:'Fira Code',monospace;margin-top:8px;">
                            💡 Lösung · {ts}
                            {f" · {i['projekt_name']}" if i.get('projekt_name') else ""}
                            {f" · Task: {i['task_titel']}" if i.get('task_titel') else ""}
                        </div>
                    </div>
                    """, unsafe_allow_html=True)

            # Tasks
            if results["tasks"]:
                st.markdown("""
                <div style="font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;
                            color:#4461D7;padding:14px 0 8px;border-bottom:2px solid #E2E5F0;margin-bottom:12px;">
                    📋 Tasks
                </div>
                """, unsafe_allow_html=True)
                for t in results["tasks"][:10]:
                    farbe = t.get("projekt_farbe","#4461D7") or "#4461D7"
                    st.markdown(f"""
                    <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-left:3px solid {farbe};
                                border-radius:8px;padding:11px 16px;margin-bottom:6px;
                                box-shadow:0 1px 3px rgba(30,34,53,0.06);">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <div style="font-weight:700;font-size:0.875rem;color:#1E2235;">{t['titel']}</div>
                            <div style="display:flex;gap:6px;">{aufwand_badge(t['aufwandsklasse'])} {status_badge(t['status'])}</div>
                        </div>
                        <div style="font-size:0.72rem;color:{farbe};font-weight:600;margin-top:4px;">
                            ◆ {t.get('projekt_name') or '–'} · {str(t.get('erstellt_am',''))[:10]}
                        </div>
                    </div>
                    """, unsafe_allow_html=True)

            # Andere Logeinträge
            andere = [i for i in results["interaktionen"] if i["typ"] != "Loesung"]
            if andere:
                st.markdown("""
                <div style="font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;
                            color:#9099BE;padding:14px 0 8px;border-bottom:2px solid #E2E5F0;margin-bottom:12px;">
                    📝 Logbuch-Einträge
                </div>
                """, unsafe_allow_html=True)
                for i in andere[:10]:
                    icon = {"Notiz":"📝","Mail":"📧","Call":"📞","Snippet":"🔧"}.get(i["typ"],"📝")
                    ts = str(i["erstellt_am"])[:16] if i["erstellt_am"] else ""
                    st.markdown(f"""
                    <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;
                                padding:11px 16px;margin-bottom:6px;box-shadow:0 1px 3px rgba(30,34,53,0.06);">
                        <div style="font-size:0.85rem;color:#1E2235;">{icon} {i['inhalt'][:160]}{'…' if len(i['inhalt'])>160 else ''}</div>
                        <div style="font-size:0.68rem;color:#9099BE;font-family:'Fira Code',monospace;margin-top:5px;">
                            {ts}{f" · {i['projekt_name']}" if i.get('projekt_name') else ""}{f" · {i['person']}" if i.get('person') else ""}
                        </div>
                    </div>
                    """, unsafe_allow_html=True)

            # Projekte
            if results["projekte"]:
                st.markdown("""
                <div style="font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;
                            color:#7C3AED;padding:14px 0 8px;border-bottom:2px solid #E2E5F0;margin-bottom:12px;">
                    📁 Projekte
                </div>
                """, unsafe_allow_html=True)
                for p in results["projekte"]:
                    farbe = p.get("farbe","#4461D7") or "#4461D7"
                    st.markdown(f"""
                    <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-left:3px solid {farbe};
                                border-radius:8px;padding:11px 16px;margin-bottom:6px;
                                box-shadow:0 1px 3px rgba(30,34,53,0.06);">
                        <div style="font-weight:700;color:#1E2235;">{p['name']}</div>
                        <div style="font-size:0.72rem;color:#9099BE;font-family:'Fira Code',monospace;margin-top:3px;">
                            {p.get('kostenstelle','') or '–'} · {p['status']}
                            {f" · {p['beschreibung'][:80]}" if p.get('beschreibung') else ""}
                        </div>
                    </div>
                    """, unsafe_allow_html=True)

    elif not suchbegriff:
        st.markdown("""
        <div style="text-align:center;padding:60px 0;color:#9099BE;">
            <div style="font-size:3.5rem;margin-bottom:16px;">🧠</div>
            <div style="font-weight:800;font-size:1.1rem;color:#5B6488;margin-bottom:8px;">Dein technisches Gedächtnis</div>
            <div style="font-size:0.82rem;max-width:400px;margin:0 auto;line-height:1.6;">
                Suche blitzschnell über alle Tasks, Mails, Notizen und Lösungen der letzten Jahre.<br>
                Beispiele: „Frequenzumrichter Fehler" · „TIA Portal Export" · „Power App SharePoint"
            </div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)
