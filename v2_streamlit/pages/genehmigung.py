"""GF-Genehmigungs-Queue für eingereichte Projekt-Anträge (Phase B)"""
import streamlit as st
import auth
from dal import get_projektantraege, entscheide_projektantrag, create_projekt, set_projekt_ressource
from auth import get_users
from pages.helpers import topbar, section_header, badge

STATUS_BADGE = {
    "Eingereicht": ("⏳ Eingereicht", "yellow"),
    "Wartend":     ("⏸ Wartend",     "orange"),
}


def show():
    current_user = st.session_state["user"]
    if not auth.require_role(current_user, "geschaeftsfuehrung", "admin"):
        st.error("Diese Seite ist nur für Geschäftsführung/Admin zugänglich.")
        return

    st.markdown(topbar("Genehmigung", "Eingereichte Projekt-Anträge entscheiden"), unsafe_allow_html=True)
    st.markdown('<div style="padding:0 28px;">', unsafe_allow_html=True)

    offene = get_projektantraege(status=["Eingereicht", "Wartend"])
    st.markdown(section_header("Offene Anträge", len(offene)), unsafe_allow_html=True)

    if not offene:
        st.success("✓ Keine offenen Anträge — alles entschieden.")
    else:
        users = get_users()
        for a in offene:
            label, color = STATUS_BADGE.get(a["status"], (a["status"], "muted"))
            with st.expander(f"{a['titel']}  ·  {label}", expanded=False):
                st.caption(f"Eingereicht von {a.get('eingereicht_von_name','–')} am {str(a['erstellt_am'])[:16]}")
                if a.get("beschreibung"):
                    st.write(a["beschreibung"])

                kommentar = st.text_input("Kommentar (optional)", key=f"kom_{a['id']}")

                c1, c2, c3 = st.columns(3)
                with c1:
                    if st.button("❌ Ablehnen", key=f"rej_{a['id']}", use_container_width=True):
                        entscheide_projektantrag(a["id"], "Abgelehnt", current_user["id"], kommentar or None)
                        st.rerun()
                with c2:
                    if st.button("⏸ Auf Warten setzen", key=f"wait_{a['id']}", use_container_width=True):
                        entscheide_projektantrag(a["id"], "Wartend", current_user["id"], kommentar or None)
                        st.rerun()
                with c3:
                    if st.button("🗄 Archivieren", key=f"arch_{a['id']}", use_container_width=True):
                        entscheide_projektantrag(a["id"], "Archiviert", current_user["id"], kommentar or None)
                        st.rerun()

                st.markdown("---")
                st.markdown("**✅ Genehmigen**")
                proj_name = st.text_input("Projektname", value=a["titel"], key=f"pname_{a['id']}")
                user_opts = {u["id"]: u["display_name"] for u in users}
                pl_id = st.selectbox(
                    "Projektleitung", list(user_opts.keys()),
                    format_func=lambda x: user_opts[x], key=f"pl_{a['id']}"
                )
                pct = st.number_input(
                    "Zeitanteil (%)", min_value=0, max_value=100, value=50, step=5,
                    key=f"pct_{a['id']}",
                    help="Weitere Personen/Anteile können nach der Genehmigung auf der Projekt-Detailseite ergänzt werden."
                )
                if st.button("✅ Genehmigen & Projekt anlegen", key=f"appr_{a['id']}", type="primary"):
                    pid = create_projekt(proj_name.strip() or a["titel"], owner_user_id=pl_id)
                    set_projekt_ressource(pid, pl_id, pct, quelle="gf_zugewiesen")
                    entscheide_projektantrag(a["id"], "Genehmigt", current_user["id"], kommentar or None, projekt_id=pid)
                    st.success(f"Projekt '{proj_name}' angelegt und Antrag genehmigt.")
                    st.rerun()

    st.markdown(section_header("Entschiedene Anträge (letzte 20)"), unsafe_allow_html=True)
    entschieden = [a for a in get_projektantraege() if a["status"] not in ("Eingereicht", "Wartend")][:20]
    if not entschieden:
        st.caption("Noch keine Entscheidungen getroffen.")
    else:
        for a in entschieden:
            b_map = {"Genehmigt": ("✅ Genehmigt", "green"), "Abgelehnt": ("❌ Abgelehnt", "red"),
                     "Archiviert": ("🗄 Archiviert", "muted")}
            label, color = b_map.get(a["status"], (a["status"], "muted"))
            st.markdown(
                f'<div style="padding:6px 0;display:flex;justify-content:space-between;">'
                f'<span>{a["titel"]}</span>{badge(label, color)}</div>',
                unsafe_allow_html=True
            )

    st.markdown('</div>', unsafe_allow_html=True)
