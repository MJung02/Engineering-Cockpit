"""Stakeholder – mit AD-Import"""
import streamlit as st
from datetime import datetime, timezone
from dal import (get_stakeholder, create_stakeholder, get_stakeholder_warteliste,
                 get_tasks, update_task, import_ad_kontakte, bulk_import_stakeholder)
from pages.helpers import aufwand_badge, esk_label, warten_info


def show():
    st.title("👥 Stakeholder")
    st.caption("Personen · Offene Anfragen · AD-Import")

    tab1, tab2, tab3 = st.tabs(["📊 Anfragen", "👤 Adressbuch", "🏢 AD-Import"])

    # ── Tab 1: Warteliste ───────────────────────────────────────────────────────
    with tab1:
        st.subheader("Aktuelle Anfragen-Verteilung")
        warteliste = get_stakeholder_warteliste()

        if not warteliste:
            st.success("✓ Keine offenen Warten-Auf-Anfragen – alles grün!")
        else:
            for w in warteliste:
                esk = w.get("max_eskalation") or 0
                esk_l = esk_label(esk)
                icon = ["●","⚠","🔴","🚨"][min(esk,3)]
                label = f"{icon} **{w['warten_auf_person']}** – {w['anzahl']} offen {esk_l if esk else ''}"

                with st.expander(label, expanded=(esk >= 2)):
                    person_tasks = get_tasks(status="Warten_auf",
                                             warten_auf_person=w["warten_auf_person"])
                    for t in person_tasks:
                        tage = 0
                        if t.get("warten_seit"):
                            try:
                                ws = datetime.fromisoformat(str(t["warten_seit"]))
                                tage = (datetime.now(timezone.utc) - ws).days
                            except Exception:
                                pass
                        esk_t = t.get("eskalationsstufe", 0) or 0

                        with st.container(border=True):
                            col1, col2 = st.columns([4, 1])
                            with col1:
                                st.markdown(f"**{t['titel'][:65]}**")
                                st.caption(f"◆ {t.get('projekt_name','–')} · "
                                           f"Wartet seit {tage} Tagen · "
                                           f"{aufwand_badge(t['aufwandsklasse'])}")
                                if esk_t >= 1:
                                    st.warning(esk_label(esk_t))
                            with col2:
                                if st.button("✅ Erhalten", key=f"stk_done_{t['id']}",
                                             use_container_width=True):
                                    update_task(t["id"], status="Fokus",
                                                warten_auf_person=None, eskalationsstufe=0)
                                    st.rerun()

                        # Follow-Up Mail
                        if esk_t >= 2:
                            person = w["warten_auf_person"]
                            sh = get_stakeholder()
                            mail_an = next((s.get("email","") for s in sh if s["name"] == person), "")
                            mail_text = (
                                f"Betreff: Follow-Up: {t['titel']}\n\n"
                                f"Hallo {person},\n\n"
                                f"ich möchte kurz den Status zu folgendem Punkt erfragen:\n\n"
                                f"→ {t['titel']}\n"
                                f"(Projekt: {t.get('projekt_name','–')})\n\n"
                                f"Wir warten seit {tage} Tagen auf eine Rückmeldung.\n"
                                f"Könntest du mir den aktuellen Stand mitteilen?\n\n"
                                f"Viele Grüße"
                            )
                            with st.expander(f"📧 Mail-Entwurf an {person}"):
                                if mail_an:
                                    st.info(f"📧 An: **{mail_an}**")
                                st.text_area("Entwurf (kopieren → Outlook)",
                                             value=mail_text, height=200,
                                             key=f"mail_{t['id']}")

    # ── Tab 2: Adressbuch ───────────────────────────────────────────────────────
    with tab2:
        st.subheader("Stakeholder-Adressbuch")

        # Suche
        suche = st.text_input("🔍 Suchen", placeholder="Name, E-Mail, Rolle...",
                               label_visibility="collapsed")

        with st.expander("➕ Neuen Stakeholder manuell anlegen"):
            with st.form("new_sh"):
                sc1, sc2 = st.columns(2)
                with sc1:
                    s_n = st.text_input("Name *")
                    s_e = st.text_input("E-Mail")
                with sc2:
                    s_r = st.text_input("Rolle / Funktion")
                    s_f = st.text_input("Firma / Abteilung")
                if st.form_submit_button("✅ Anlegen", type="primary"):
                    if s_n:
                        create_stakeholder(s_n, s_e, s_r, s_f)
                        st.success(f"✓ {s_n} angelegt!")
                        st.rerun()

        stakeholder = get_stakeholder()

        # Filter
        if suche:
            stakeholder = [s for s in stakeholder
                           if suche.lower() in s["name"].lower()
                           or suche.lower() in (s.get("email") or "").lower()
                           or suche.lower() in (s.get("rolle") or "").lower()
                           or suche.lower() in (s.get("firma") or "").lower()]

        st.caption(f"{len(stakeholder)} Kontakte")

        for s in stakeholder:
            offen = get_tasks(status="Warten_auf", warten_auf_person=s["name"])
            with st.container(border=True):
                col1, col2 = st.columns([5, 1])
                with col1:
                    badge = f"  🟡 `{len(offen)} offen`" if offen else ""
                    st.markdown(f"**{s['name']}**{badge}")
                    info_parts = [x for x in [
                        s.get("rolle") or "",
                        s.get("firma") or "",
                        s.get("email") or ""
                    ] if x]
                    if info_parts:
                        st.caption(" · ".join(info_parts))

    # ── Tab 3: AD-Import ────────────────────────────────────────────────────────
    with tab3:
        st.subheader("🏢 Active Directory Import")
        st.markdown("""
Importiere Kontakte direkt aus dem EJOT Active Directory.
Bestehende Einträge werden **nicht überschrieben**.
Nur Personen mit E-Mail-Adresse werden importiert.
        """)

        # Voraussetzung prüfen
        try:
            import ldap3
            ldap_ok = True
        except ImportError:
            ldap_ok = False

        if not ldap_ok:
            st.warning("⚠ ldap3 nicht installiert.")
            st.code("pip install ldap3")
            st.caption("Nach der Installation App neu starten.")

        with st.container(border=True):
            st.subheader("Verbindungseinstellungen")
            col1, col2 = st.columns(2)
            with col1:
                ad_server = st.text_input("AD-Server",
                                           value=st.session_state.get("ad_server",
                                                                        "ldap://N200282"),
                                           placeholder="ldap://DOMAIN-CONTROLLER")
                ad_base = st.text_input("Base DN",
                                         value=st.session_state.get("ad_base",
                                                                      "dc=ejot,dc=de"),
                                         placeholder="dc=ejot,dc=de")
            with col2:
                ad_filter = st.selectbox("Filter", [
                    "Alle Benutzer mit E-Mail",
                    "Nur aktive Benutzer",
                    "Bestimmte Abteilung",
                ])
                if ad_filter == "Bestimmte Abteilung":
                    ad_dept = st.text_input("Abteilung", placeholder="Engineering")
                else:
                    ad_dept = None

                # Verbindungstest
                if st.button("🔌 Verbindung testen", disabled=not ldap_ok):
                    with st.spinner("Verbinde mit AD..."):
                        try:
                            from ldap3 import Server as LS, Connection, ALL
                            srv = LS(ad_server, get_info=ALL)
                            conn = Connection(srv, auto_bind=True)
                            st.success(f"✓ Verbunden: {ad_server}")
                            st.session_state["ad_server"] = ad_server
                            st.session_state["ad_base"] = ad_base
                        except Exception as e:
                            st.error(f"Verbindung fehlgeschlagen: {e}")
                            st.caption("Tipp: App muss im Firmennetzwerk laufen. "
                                       "Windows-Auth wird automatisch genutzt.")

        st.divider()

        # Import-Vorschau + Ausführen
        col_a, col_b = st.columns([2,3])
        with col_a:
            if st.button("🔍 Vorschau laden", type="primary",
                          disabled=not ldap_ok, use_container_width=True):
                with st.spinner("Lade AD-Kontakte..."):
                    try:
                        kontakte = import_ad_kontakte(ad_server, ad_base)
                        if ad_dept:
                            kontakte = [k for k in kontakte
                                        if ad_dept.lower() in (k.get("firma","")).lower()]
                        st.session_state["ad_vorschau"] = kontakte
                        st.success(f"✓ {len(kontakte)} Kontakte gefunden")
                    except RuntimeError as e:
                        st.error(str(e))
                    except Exception as e:
                        st.error(f"Fehler: {e}")
                        st.caption("Stelle sicher dass der AD-Server erreichbar ist "
                                   "und du im Firmennetz bist.")

        with col_b:
            vorschau = st.session_state.get("ad_vorschau", [])
            if vorschau:
                bestehende = {s["name"] for s in get_stakeholder()}
                neu = [k for k in vorschau if k["name"] not in bestehende]
                st.metric("Gefunden", len(vorschau))
                st.metric("Neu (noch nicht in Cockpit)", len(neu))
                if st.button(f"✅ {len(neu)} neue Kontakte importieren",
                              type="primary", disabled=len(neu)==0, use_container_width=True):
                    with st.spinner("Importiere..."):
                        imported = bulk_import_stakeholder(vorschau)
                    st.success(f"✓ {imported} Kontakte importiert!")
                    st.session_state.pop("ad_vorschau", None)
                    st.rerun()

        # Vorschau-Tabelle
        if st.session_state.get("ad_vorschau"):
            vorschau = st.session_state["ad_vorschau"]
            bestehende = {s["name"] for s in get_stakeholder()}
            st.subheader(f"Vorschau ({len(vorschau)} Kontakte)")

            import pandas as pd
            df = pd.DataFrame(vorschau)
            df["Status"] = df["name"].apply(
                lambda x: "✓ Bereits vorhanden" if x in bestehende else "🆕 Neu"
            )
            st.dataframe(df[["name","email","rolle","firma","Status"]],
                          use_container_width=True,
                          column_config={
                              "name":   st.column_config.TextColumn("Name"),
                              "email":  st.column_config.TextColumn("E-Mail"),
                              "rolle":  st.column_config.TextColumn("Rolle"),
                              "firma":  st.column_config.TextColumn("Abteilung"),
                              "Status": st.column_config.TextColumn("Status"),
                          })

        # CSV-Import als Alternative
        st.divider()
        st.subheader("📄 Alternative: CSV-Import")
        st.caption("Falls AD nicht direkt erreichbar: Exportiere Kontakte aus Outlook/AD "
                   "als CSV und importiere sie hier.")

        uploaded = st.file_uploader("CSV hochladen",
                                     type=["csv"],
                                     help="Spalten: name, email, rolle, firma")
        if uploaded:
            import pandas as pd
            import io
            try:
                df = pd.read_csv(io.StringIO(uploaded.read().decode("utf-8-sig")))
                st.dataframe(df.head(10))
                # Spalten mappen
                col_map = {}
                possible_name  = [c for c in df.columns if "name" in c.lower() or "anzeige" in c.lower()]
                possible_email = [c for c in df.columns if "mail" in c.lower()]
                possible_rolle = [c for c in df.columns if "titel" in c.lower() or "rolle" in c.lower() or "funktion" in c.lower()]
                possible_firma = [c for c in df.columns if "abteil" in c.lower() or "firma" in c.lower() or "dept" in c.lower()]

                mc1, mc2 = st.columns(2)
                with mc1:
                    name_col  = st.selectbox("Name-Spalte",  df.columns.tolist(),
                                              index=df.columns.tolist().index(possible_name[0]) if possible_name else 0)
                    email_col = st.selectbox("E-Mail-Spalte", ["–"]+df.columns.tolist(),
                                              index=df.columns.tolist().index(possible_email[0])+1 if possible_email else 0)
                with mc2:
                    rolle_col = st.selectbox("Rolle-Spalte",  ["–"]+df.columns.tolist(),
                                              index=df.columns.tolist().index(possible_rolle[0])+1 if possible_rolle else 0)
                    firma_col = st.selectbox("Abteilung-Spalte", ["–"]+df.columns.tolist(),
                                              index=df.columns.tolist().index(possible_firma[0])+1 if possible_firma else 0)

                if st.button("✅ CSV importieren", type="primary"):
                    kontakte_csv = []
                    for _, row in df.iterrows():
                        kontakte_csv.append({
                            "name":  str(row[name_col]) if name_col else "",
                            "email": str(row[email_col]) if email_col != "–" else "",
                            "rolle": str(row[rolle_col]) if rolle_col != "–" else "",
                            "firma": str(row[firma_col]) if firma_col != "–" else "",
                        })
                    imported = bulk_import_stakeholder(kontakte_csv)
                    st.success(f"✓ {imported} neue Kontakte importiert!")
                    st.rerun()

            except Exception as e:
                st.error(f"CSV-Fehler: {e}")
