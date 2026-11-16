"""Projekt-Antrag – jede:r kann eine Idee/ein Projekt einreichen (Phase B)"""
import streamlit as st
from dal import create_projektantrag, get_projektantraege
from pages.helpers import topbar, section_header, badge

STATUS_BADGE = {
    "Eingereicht": ("⏳ Eingereicht", "yellow"),
    "Genehmigt":   ("✅ Genehmigt",   "green"),
    "Abgelehnt":   ("❌ Abgelehnt",   "red"),
    "Wartend":     ("⏸ Wartend",     "orange"),
    "Archiviert":  ("🗄 Archiviert",  "muted"),
}


def show():
    st.markdown(topbar("Projekt einreichen", "Idee oder Vorhaben zur Genehmigung vorschlagen"),
                unsafe_allow_html=True)
    st.markdown('<div style="padding:0 28px;">', unsafe_allow_html=True)

    current_user = st.session_state["user"]

    with st.expander("➕ Neue Idee / neues Projekt einreichen", expanded=True):
        with st.form("projekt_antrag_form", clear_on_submit=True):
            titel = st.text_input("Titel")
            beschreibung = st.text_area(
                "Beschreibung", height=120,
                placeholder="Worum geht es? Warum ist das wichtig? Was soll erreicht werden?"
            )
            submitted = st.form_submit_button("📤 Einreichen", type="primary")
        if submitted:
            if not titel.strip():
                st.error("Titel darf nicht leer sein.")
            else:
                create_projektantrag(titel.strip(), beschreibung.strip(), current_user["id"])
                st.success("Antrag eingereicht — die Geschäftsführung sieht ihn in der Genehmigungs-Queue.")
                st.rerun()

    st.markdown(section_header("Meine eingereichten Anträge"), unsafe_allow_html=True)

    meine = get_projektantraege(eingereicht_von=current_user["id"])
    if not meine:
        st.info("Noch keine Anträge eingereicht.")
    else:
        for a in meine:
            label, color = STATUS_BADGE.get(a["status"], (a["status"], "muted"))
            with st.container(border=True):
                st.markdown(
                    f'<div style="display:flex;justify-content:space-between;align-items:center;">'
                    f'<b>{a["titel"]}</b>{badge(label, color)}</div>',
                    unsafe_allow_html=True
                )
                if a.get("beschreibung"):
                    st.caption(a["beschreibung"][:200])
                if a["status"] != "Eingereicht":
                    entscheider = a.get("entschieden_von_name") or "–"
                    st.markdown(
                        f'<span style="font-size:0.75rem;color:#5B6488;">Entschieden von {entscheider}'
                        + (f' · Kommentar: {a["entscheidung_kommentar"]}' if a.get("entscheidung_kommentar") else "")
                        + (f' · Projekt: {a["projekt_name"]}' if a.get("projekt_name") else "")
                        + '</span>', unsafe_allow_html=True
                    )

    st.markdown('</div>', unsafe_allow_html=True)
