"""
Engineering Cockpit - Login-Seite
"""
import time
from datetime import datetime, timedelta, timezone

import streamlit as st
import extra_streamlit_components as stx

import auth
import sso

COOKIE_NAME = "ec_session"


def get_cookie_manager():
    """Re-instantiated every rerun with a stable key (the standard pattern for
    Streamlit custom components) - it must NOT also be cached under the same
    name in st.session_state, since Streamlit ties that key to the widget
    itself and rejects a manual overwrite."""
    return stx.CookieManager(key="cookie_manager")


def show(cookie_manager):
    """cookie_manager is created once per rerun by the auth gate in app.py and
    passed in here - instantiating a second stx.CookieManager(key="cookie_manager")
    in the same run would raise StreamlitDuplicateElementKey."""
    st.markdown("""
    <style>
    [data-testid="stAppViewContainer"] {
        background: radial-gradient(circle at 20% 20%, #232a52 0%, #1B1F3B 55%, #14172c 100%) !important;
    }
    [data-testid="stHeader"] { background: transparent !important; }
    </style>
    <div style="max-width:400px;margin:64px auto 0;padding:36px 36px 28px;background:#FFFFFF;
                border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,0.35);
                border:1px solid rgba(255,255,255,0.08);">
        <div style="text-align:center;margin-bottom:22px;">
            <div style="background:#4461D7;width:52px;height:52px;border-radius:14px;
                        display:flex;align-items:center;justify-content:center;
                        font-size:1.6rem;margin:0 auto 14px;
                        box-shadow:0 8px 18px rgba(68,97,215,0.35);">⚙️</div>
            <div style="font-family:'Nunito Sans',sans-serif;font-weight:800;
                        font-size:1.3rem;color:#1E2235;letter-spacing:-0.01em;">Engineering Cockpit</div>
            <div style="font-family:'Fira Code',monospace;font-size:0.7rem;color:#9099BE;
                        margin-top:4px;letter-spacing:0.06em;">TEAM &middot; PROJEKTE &middot; PORTFOLIO</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # ── SSO-Rueckkehr von Microsoft (Phase J, nur aktiv wenn konfiguriert) ───
    # Microsoft leitet nach dem Login mit ?code=... auf dieselbe URL zurueck -
    # der vorher in st.session_state zwischengespeicherte Flow (State/PKCE,
    # von msal verwaltet) wird hier gegen ein Token eingetauscht.
    query_params = dict(st.query_params)
    if "code" in query_params and st.session_state.get("sso_flow"):
        try:
            claims = sso.verarbeite_rueckgabe(st.session_state.pop("sso_flow"), query_params)
            sso_email = claims.get("preferred_username") or claims.get("email")
            sso_name = claims.get("name") or sso_email
            user = auth.get_or_create_sso_user(sso_email, sso_name)
            token = auth.create_session(user["id"])
            expires_at = datetime.now(timezone.utc) + auth.SESSION_LIFETIME
            cookie_manager.set(COOKIE_NAME, token, key="set_session_sso", expires_at=expires_at)
            st.session_state["user"] = user
            st.query_params.clear()
            time.sleep(1.5)
            st.rerun()
        except Exception as e:
            st.session_state.pop("sso_flow", None)
            st.error(f"SSO-Anmeldung fehlgeschlagen: {e}")

    _, col, _ = st.columns([1, 2, 1])
    with col:
        with st.form("login_form"):
            email = st.text_input("E-Mail")
            password = st.text_input("Passwort", type="password")
            submitted = st.form_submit_button("Anmelden", type="primary", use_container_width=True)

        if submitted:
            user = auth.authenticate((email or "").strip(), password or "")
            if not user:
                st.error("E-Mail oder Passwort ist falsch.")
                return
            token = auth.create_session(user["id"])
            expires_at = datetime.now(timezone.utc) + auth.SESSION_LIFETIME
            cookie_manager.set(COOKIE_NAME, token, key="set_session", expires_at=expires_at)
            st.session_state["user"] = user
            # The cookie component writes document.cookie via a JS round-trip
            # inside an iframe - rerunning immediately can tear it down before
            # that write lands, so the cookie silently never gets set. A short
            # delay gives it time to complete (known extra_streamlit_components
            # timing quirk, not fixable from the Python side alone).
            time.sleep(1.5)
            st.rerun()

        if sso.sso_konfiguriert():
            st.markdown(
                "<div style='text-align:center;margin:14px 0;color:#9099BE;font-size:0.78rem;'>— oder —</div>",
                unsafe_allow_html=True)
            if st.button("🔑 Mit Microsoft anmelden", use_container_width=True):
                flow = sso.starte_login_flow()
                st.session_state["sso_flow"] = flow
                st.markdown(f'<meta http-equiv="refresh" content="0;url={flow["auth_uri"]}">',
                            unsafe_allow_html=True)
                st.stop()

        st.markdown("""
        <div style="text-align:center;margin-top:18px;">
            <span style="font-size:0.7rem;color:#9099BE;">
                Entwickelt von <b style="color:#5B6488;">Manuel Jung</b> &middot; © 2026
            </span>
        </div>
        """, unsafe_allow_html=True)
