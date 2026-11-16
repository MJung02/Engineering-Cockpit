"""Mein Profil – Phase I: Mitarbeiterprofile (Abteilung, Kompetenzen, eigene Aufgaben)"""
import streamlit as st
from dal import (get_tasks, create_task, update_task, delete_task, get_all_projekte,
                 get_mitarbeiterprofil, upsert_mitarbeiterprofil, get_alle_mitarbeiterprofile,
                 get_taetigkeiten_fuer_mitarbeiter)
from pages.helpers import topbar, status_badge, aufwand_badge
import ki_service


def _aufgaben_karte(t):
    status = status_badge(t.get("status"))
    aufwand = aufwand_badge(t.get("aufwandsklasse"))
    tags_html = f'<span style="font-size:0.72rem;color:#9099BE;">🏷 {t["tags"]}</span>' if t.get("tags") else ""
    st.markdown(f"""
    <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:8px;padding:10px 14px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
            <div>
                <div style="font-weight:700;color:#1E2235;font-size:0.88rem;">{t['titel']}</div>
                <div style="font-size:0.75rem;color:#9099BE;">◆ {t.get('projekt_name') or 'Kein Projekt'} {('· ' + tags_html) if tags_html else ''}</div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0;">{aufwand}{status}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)


def show():
    current_user = st.session_state["user"]
    try:
        st.markdown(topbar("Mein Profil", "Abteilung · Kompetenzen · eigene Aufgaben"), unsafe_allow_html=True)
    except Exception:
        st.title("Mein Profil")

    tab1, tab2 = st.tabs(["👤 Mein Profil", "🧑‍🤝‍🧑 Team-Übersicht"])

    # ── Tab 1: eigenes Profil ────────────────────────────────────────────────
    with tab1:
        profil = get_mitarbeiterprofil(current_user["id"]) or {}

        st.markdown("#### Stammdaten")
        with st.form("profil_stammdaten"):
            c1, c2 = st.columns(2)
            with c1:
                st.text_input("Name", value=current_user["display_name"], disabled=True)
            with c2:
                abteilung = st.text_input("Abteilung", value=profil.get("abteilung") or "")
            kompetenzen = st.text_area(
                "Kompetenzen (manuell)", value=profil.get("kompetenzen") or "",
                placeholder="z.B. SPS-Programmierung, Pneumatik, Lieferantenmanagement...",
                height=80)
            if st.form_submit_button("💾 Speichern", type="primary"):
                upsert_mitarbeiterprofil(current_user["id"], abteilung=abteilung.strip() or None,
                                          kompetenzen=kompetenzen.strip() or None)
                st.success("Profil gespeichert!")
                st.rerun()

        st.markdown("---")
        st.markdown("#### 🤖 KI-Kompetenzprofil")
        st.caption("Wird aus den tatsächlich bearbeiteten Aufgaben (Titel, Tags, Projekte) abgeleitet – "
                   "keine manuelle Pflege nötig.")

        eigene_aufgaben = get_taetigkeiten_fuer_mitarbeiter(current_user["id"])

        if ki_service.ki_verfuegbar():
            if st.button("✨ Kompetenzprofil aktualisieren", disabled=not eigene_aufgaben):
                try:
                    with st.spinner("KI analysiert deine Aufgaben..."):
                        ergebnis = ki_service.analysiere_mitarbeiterkompetenzen(
                            current_user["display_name"], eigene_aufgaben)
                    upsert_mitarbeiterprofil(current_user["id"], kompetenzen_ki=ergebnis.get("kompetenzen_ki"))
                    st.rerun()
                except Exception as e:
                    st.error(f"Kompetenzanalyse fehlgeschlagen: {e}")
            if not eigene_aufgaben:
                st.info("Noch keine eigenen Aufgaben zugeordnet – lege unten Aufgaben an, "
                        "dann kann die KI daraus dein Profil ableiten.")
        else:
            st.info("Kein KI-Backend verfügbar (siehe Einstellungen).")

        if profil.get("kompetenzen_ki"):
            st.markdown(profil["kompetenzen_ki"])
            st.caption(f"Zuletzt aktualisiert: {str(profil.get('kompetenzen_ki_am'))[:16]}")

        st.markdown("---")
        st.markdown(f"#### 📋 Eigene Aufgaben ({len(eigene_aufgaben)})")

        with st.expander("➕ Neue eigene Aufgabe"):
            with st.form("neue_eigene_aufgabe"):
                t_titel = st.text_input("Titel *")
                projekte = get_all_projekte(status_filter=["Begonnen", "Unterbrochen"])
                proj_ids = [None] + [p["id"] for p in projekte]
                proj_namen = {None: "– kein Projekt –"}
                proj_namen.update({p["id"]: p["name"] for p in projekte})
                sel_proj = st.selectbox("Projekt", proj_ids, format_func=lambda x: proj_namen[x])
                t_tags = st.text_input("Tags (Komma-getrennt)", placeholder="z.B. SPS, Inbetriebnahme")
                if st.form_submit_button("Anlegen"):
                    if t_titel:
                        create_task(sel_proj, t_titel, tags=t_tags.strip() or None,
                                    bearbeiter_user_id=current_user["id"])
                        st.rerun()

        if not eigene_aufgaben:
            st.info("Noch keine eigenen Aufgaben.")
        for t in eigene_aufgaben:
            _aufgaben_karte(t)
            with st.expander("Details & Aktionen", expanded=False):
                col_a, col_b = st.columns(2)
                with col_a:
                    if t["status"] != "Erledigt" and st.button("✅ Erledigt", key=f"profil_done_{t['id']}"):
                        update_task(t["id"], status="Erledigt")
                        st.rerun()
                with col_b:
                    if st.button("🗑 Löschen", key=f"profil_del_{t['id']}"):
                        delete_task(t["id"])
                        st.rerun()

    # ── Tab 2: Team-Übersicht ────────────────────────────────────────────────
    with tab2:
        st.markdown("#### Team – Abteilungen & Kompetenzen")
        st.caption("Read-only Übersicht, z.B. um herauszufinden, wer sich mit einem bestimmten Thema auskennt.")
        suche = st.text_input("🔍 Suche (Name, Abteilung, Kompetenz)", key="team_suche")

        profile = get_alle_mitarbeiterprofile()
        if suche:
            s = suche.lower()
            profile = [p for p in profile if
                       s in (p.get("display_name") or "").lower() or
                       s in (p.get("abteilung") or "").lower() or
                       s in (p.get("kompetenzen") or "").lower() or
                       s in (p.get("kompetenzen_ki") or "").lower()]

        for p in profile:
            with st.container(border=True):
                st.markdown(f"**{p['display_name']}**" + (f" · _{p['abteilung']}_" if p.get("abteilung") else ""))
                if p.get("kompetenzen"):
                    st.caption(f"Kompetenzen: {p['kompetenzen']}")
                if p.get("kompetenzen_ki"):
                    st.caption("🤖 KI-abgeleitet:")
                    st.markdown(p["kompetenzen_ki"])
                if not p.get("kompetenzen") and not p.get("kompetenzen_ki"):
                    st.caption("Noch kein Profil gepflegt.")
