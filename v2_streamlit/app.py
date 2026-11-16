"""
╔══════════════════════════════════════════════════════╗
║     ENGINEERING COCKPIT  v2.0  –  Teamwork Style     ║
╚══════════════════════════════════════════════════════╝
Start: streamlit run app.py
"""
import streamlit as st
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

from database import init_database
from dal import get_dashboard_stats, get_eskalations_updates

st.set_page_config(
    page_title="Engineering Cockpit",
    page_icon="⚙️",
    layout="wide",
    initial_sidebar_state="expanded",
)

if "db_initialized" not in st.session_state:
    try:
        init_database()
        st.session_state.db_initialized = True
        st.session_state.db_error = None
    except Exception as e:
        st.session_state.db_error = str(e)
        st.session_state.db_initialized = True  # Trotzdem weitermachen (SQLite Fallback)

# DB-Fehler anzeigen ohne App zu stoppen
if st.session_state.get("db_error"):
    pass  # Fehler wird in der Sidebar angezeigt

if "last_eskalation_check" not in st.session_state:
    try:
        get_eskalations_updates()
    except Exception:
        pass
    try:
        from dal import verarbeite_wiederkehrende_tasks
        verarbeite_wiederkehrende_tasks()
    except Exception:
        pass
    st.session_state.last_eskalation_check = True

# Hintergrund-Benachrichtigungen (Windows Desktop Notifications)
if "notif_checker_started" not in st.session_state:
    try:
        from benachrichtigungen import starte_checker
        starte_checker()
    except Exception:
        pass
    st.session_state.notif_checker_started = True

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800&family=Fira+Code:wght@400;500&display=swap');

:root {
    --white:        #FFFFFF;
    --bg:           #F4F5FA;
    --bg2:          #ECEEF5;
    --sidebar-bg:   #1B1F3B;
    --sidebar-hover:#262C50;
    --sidebar-active:#3B4280;
    --sidebar-text: #8890B8;
    --border:       #E2E5F0;
    --border-dark:  #CDD0E0;
    --primary:      #4461D7;
    --primary-light:#EEF1FC;
    --primary-dark: #3350C4;
    --green:        #16A34A;
    --green-light:  #DCFCE7;
    --yellow:       #D97706;
    --yellow-light: #FEF3C7;
    --red:          #DC2626;
    --red-light:    #FEE2E2;
    --orange:       #EA580C;
    --orange-light: #FFEDD5;
    --purple:       #7C3AED;
    --text-primary:   #1E2235;
    --text-secondary: #5B6488;
    --text-muted:     #9099BE;
    --sans: 'Nunito Sans', sans-serif;
    --mono: 'Fira Code', monospace;
    --shadow-sm: 0 1px 3px rgba(30,34,53,0.08);
    --shadow-md: 0 4px 12px rgba(30,34,53,0.10);
}

html, body, [data-testid="stAppViewContainer"] {
    background: var(--bg) !important;
    color: var(--text-primary) !important;
    font-family: var(--sans) !important;
}

[data-testid="stSidebar"] {
    background: var(--sidebar-bg) !important;
    border-right: none !important;
    min-width: 220px !important;
    max-width: 220px !important;
}
[data-testid="stSidebar"] * { color: var(--sidebar-text) !important; font-family: var(--sans) !important; }
[data-testid="stSidebar"] .stRadio > div { flex-direction: column !important; gap: 2px !important; }
[data-testid="stSidebar"] .stRadio label {
    display: flex !important; align-items: center !important;
    padding: 9px 16px !important; border-radius: 6px !important;
    cursor: pointer !important; transition: all 0.15s !important;
    font-size: 0.875rem !important; font-weight: 600 !important;
    color: var(--sidebar-text) !important; margin: 0 8px !important;
}
[data-testid="stSidebar"] .stRadio label:hover { background: var(--sidebar-hover) !important; color: #FFFFFF !important; }
[data-testid="stSidebar"] .stRadio input[type="radio"] { display: none !important; }
[data-testid="stSidebar"] [data-baseweb="radio"] > div:first-child { display: none !important; }

.main .block-container { padding: 0 !important; max-width: 100% !important; }

/* Metric Cards */
[data-testid="metric-container"] {
    background: var(--white) !important;
    border: 1px solid var(--border) !important;
    border-radius: 10px !important;
    padding: 18px 20px !important;
    box-shadow: var(--shadow-sm) !important;
}
[data-testid="stMetricValue"] { font-family: var(--mono) !important; font-size: 1.8rem !important; font-weight: 500 !important; color: var(--text-primary) !important; }
[data-testid="stMetricLabel"] { font-size: 0.72rem !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 0.07em !important; color: var(--text-muted) !important; }

/* Buttons */
.stButton > button {
    font-family: var(--sans) !important; font-size: 0.8rem !important; font-weight: 700 !important;
    border-radius: 6px !important; border: 1px solid var(--border) !important;
    background: var(--white) !important; color: var(--text-secondary) !important;
    padding: 5px 14px !important; transition: all 0.15s !important;
}
.stButton > button:hover { border-color: var(--primary) !important; color: var(--primary) !important; background: var(--primary-light) !important; }
.stButton > button[kind="primary"] { background: var(--primary) !important; border-color: var(--primary) !important; color: #FFFFFF !important; }
.stButton > button[kind="primary"]:hover { background: var(--primary-dark) !important; }

/* Inputs */
.stTextInput > div > div > input, .stTextArea > div > div > textarea, .stNumberInput > div > div > input {
    background: var(--white) !important; border: 1px solid var(--border-dark) !important;
    border-radius: 6px !important; color: var(--text-primary) !important; font-family: var(--sans) !important;
}
.stTextInput > div > div > input:focus, .stTextArea > div > div > textarea:focus {
    border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(68,97,215,0.12) !important;
}
.stSelectbox > div > div { background: var(--white) !important; border: 1px solid var(--border-dark) !important; border-radius: 6px !important; }

/* Tabs */
.stTabs [data-baseweb="tab-list"] { background: transparent !important; border-bottom: 2px solid var(--border) !important; gap: 0 !important; padding: 0 !important; }
.stTabs [data-baseweb="tab"] { background: transparent !important; color: var(--text-muted) !important; border-bottom: 2px solid transparent !important; margin-bottom: -2px !important; font-family: var(--sans) !important; font-size: 0.82rem !important; font-weight: 700 !important; padding: 10px 18px !important; }
.stTabs [aria-selected="true"] { color: var(--primary) !important; border-bottom-color: var(--primary) !important; }

/* Expander */
.streamlit-expanderHeader { background: var(--white) !important; border: 1px solid var(--border) !important; border-radius: 8px !important; color: var(--text-primary) !important; font-family: var(--sans) !important; font-weight: 600 !important; font-size: 0.875rem !important; }

/* Form */
[data-testid="stForm"] { background: var(--white) !important; border: 1px solid var(--border) !important; border-radius: 10px !important; padding: 20px !important; box-shadow: var(--shadow-sm) !important; }

/* Labels */
.stTextInput label, .stTextArea label, .stSelectbox label, .stNumberInput label, .stMultiSelect label, .stCheckbox label {
    font-size: 0.78rem !important; font-weight: 700 !important; color: var(--text-secondary) !important;
}

hr { border-color: var(--border) !important; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border-dark); border-radius: 3px; }
#MainMenu, footer, .stDeployButton { visibility: hidden; display: none; }
</style>
""", unsafe_allow_html=True)

# ── CSS-HACKS ZUM SÄUBERN DER SIDEBAR ─────────────────────────────────────────
# Muss vor dem Auth-Gate stehen, damit die native Streamlit-Seitenliste (aus
# pages/) auch schon auf der Login-Seite versteckt ist, nicht erst danach.
st.markdown("""
    <style>
        /* 1. Versteckt die automatische Streamlit-Navigation */
        [data-testid="stSidebarNav"] {
            display: none;
        }

        /* 2. Versteckt den Collapse-Button (keyboard_double_arrow) */
        [data-testid="stSidebarCollapseButton"] {
            display: none;
        }

        /* 3. Versteckt den gesamten Header-Bereich der Sidebar */
        [data-testid="stSidebarHeader"] {
            display: none;
        }

        /* 4. Verringert den oberen Abstand (Padding), damit dein Logo oben steht */
        .st-emotion-cache-1gv3u8r {
            padding-top: 1rem;
        }

        /* Optional: Style für das Radio-Menü (Abstände anpassen) */
        .st-ae {
            gap: 0.1rem;
        }
    </style>
""", unsafe_allow_html=True)

# ── Auth-Gate ────────────────────────────────────────────────────────────────
import auth
from pages.login import get_cookie_manager, COOKIE_NAME

_cookie_manager = get_cookie_manager()

if "user" not in st.session_state:
    _token = _cookie_manager.get(COOKIE_NAME)
    _user = auth.validate_session(_token) if _token else None
    if _user:
        st.session_state["user"] = _user

if not st.session_state.get("user"):
    from pages.login import show as show_login
    show_login(_cookie_manager)
    st.stop()

current_user = st.session_state["user"]

with st.sidebar:
    # ── DEIN LOGO / HEADER BEREICH ──────────────────────────────────────────
    stats = get_dashboard_stats()
    st.markdown(f"""
    <div style="padding:10px 16px 20px; border-bottom:1px solid rgba(255,255,255,0.08); margin-bottom:15px;">
        <div style="display:flex; align-items:center; gap:12px;">
            <div style="background:#4461D7; width:38px; height:38px; border-radius:10px;
                        display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0;
                        box-shadow: 0 4px 10px rgba(68,97,215,0.3);">⚙️</div>
            <div>
                <div style="font-family:'Nunito Sans',sans-serif; font-weight:800; font-size:1.0rem; color:#FFFFFF; line-height:1.1;"> Engineering</div>
                <div style="font-family:'Fira Code',monospace; font-size:0.65rem; color:#4461D7; font-weight:600; margin-top:2px; letter-spacing:0.5px;">Cockpit v2.0</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # ── ANGEMELDETER USER + LOGOUT ───────────────────────────────────────────
    st.markdown(f"""
    <div style="padding:0 16px 10px;display:flex;align-items:center;gap:6px;">
        <span style="color:#8890B8;font-size:0.78rem;">👤 {current_user['display_name']}</span>
    </div>
    """, unsafe_allow_html=True)
    if st.button("🚪 Abmelden", key="logout_btn", use_container_width=True):
        _old_token = _cookie_manager.get(COOKIE_NAME)
        auth.revoke_session(_old_token)
        _cookie_manager.delete(COOKIE_NAME, key="del_session")
        st.session_state.pop("user", None)
        st.rerun()

    # ── DEINE MANUELLE NAVIGATION ───────────────────────────────────────────
    # Nutze das Radio-Widget als Navigation
    nav_items = [
        "🏠   Dashboard",
        "📋   Meine Tasks",
        "🗂️   Kanban Board",
        "📁   Projekte",
        "📤   Projekt einreichen",
    ]
    if auth.require_role(current_user, "geschaeftsfuehrung", "admin"):
        nav_items.append("✅   Genehmigung")
    nav_items += [
        "🔍   Technik-Gedächtnis",
        "👥   Stakeholder",
        "🧑‍💼   Mein Profil",
        "🤖   KI-Assistent",
        "⚙   Automation",
        "📊   Wochenbericht",
        "⚙️   Einstellungen",
    ]
    page = st.radio("nav", nav_items, label_visibility="collapsed")

    st.markdown(f"""
    <div style="margin-top:16px; padding:12px 8px 0; border-top:1px solid rgba(255,255,255,0.07);">
        <div style="font-family:'Fira Code',monospace; font-size:0.6rem; color:#4461D7;
                    text-transform:uppercase; letter-spacing:0.12em; padding:0 8px; margin-bottom:8px;">Heute</div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 8px;">
            <span style="color:#8890B8;font-size:0.78rem;">▶ Im Fokus</span>
            <span style="background:#4461D7;color:#fff;border-radius:10px;padding:1px 8px;font-size:0.7rem;font-weight:700;">{stats['fokus_tasks']}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 8px;">
            <span style="color:#8890B8;font-size:0.78rem;">⏳ Warten auf</span>
            <span style="background:#D97706;color:#fff;border-radius:10px;padding:1px 8px;font-size:0.7rem;font-weight:700;">{stats['warten_tasks']}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 8px;">
            <span style="color:#8890B8;font-size:0.78rem;">🚨 Eskaliert</span>
            <span style="background:{'#DC2626' if stats['eskaliert']>0 else '#374151'};color:#fff;border-radius:10px;padding:1px 8px;font-size:0.7rem;font-weight:700;">{stats['eskaliert']}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 8px;">
            <span style="color:#8890B8;font-size:0.78rem;">⚡ Quick-Wins</span>
            <span style="background:#16A34A;color:#fff;border-radius:10px;padding:1px 8px;font-size:0.7rem;font-weight:700;">{stats['quick_wins']}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 8px;">
            <span style="color:#8890B8;font-size:0.78rem;">📁 Projekte</span>
            <span style="background:#374151;color:#fff;border-radius:10px;padding:1px 8px;font-size:0.7rem;font-weight:700;">{stats['aktive_projekte']}</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

# ── Globale Schnellsuche ──────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("---")
    st.markdown('<div style="padding:0 8px 4px;font-family:monospace;font-size:0.6rem;color:#4461D7;text-transform:uppercase;letter-spacing:0.1em;">Schnellsuche</div>', unsafe_allow_html=True)
    q = st.text_input("", placeholder="🔍 Task, Projekt, Lösung...",
                       label_visibility="collapsed", key="global_search_q")
    if q and len(q) >= 2:
        from dal import fulltext_search
        sr = fulltext_search(q)
        total = sum(len(v) for v in sr.values())
        if total == 0:
            st.markdown('<div style="font-size:0.72rem;color:#9099BE;padding:4px 8px;">Keine Treffer</div>', unsafe_allow_html=True)
        else:
            for p in sr["projekte"][:3]:
                farbe = p.get("farbe","#4461D7") or "#4461D7"
                st.markdown(f'<div style="padding:5px 8px;border-radius:5px;margin:2px 0;background:#262C50;cursor:pointer;"><span style="font-size:0.75rem;color:{farbe};font-weight:600;">📁 {p["name"][:35]}</span></div>', unsafe_allow_html=True)
            for t in sr["tasks"][:4]:
                farbe = t.get("projekt_farbe","#4461D7") or "#4461D7"
                st.markdown(f'<div style="padding:5px 8px;border-radius:5px;margin:2px 0;background:#262C50;cursor:pointer;"><span style="font-size:0.75rem;color:#E2E8F0;font-weight:600;">📋 {t["titel"][:35]}</span><br><span style="font-size:0.65rem;color:{farbe};">◆ {(t.get("projekt_name") or "–")[:20]}</span></div>', unsafe_allow_html=True)
            for i in sr["interaktionen"][:2]:
                icon = {"Loesung":"💡","Mail":"📧","Snippet":"🔧"}.get(i["typ"],"📝")
                st.markdown(f'<div style="padding:5px 8px;border-radius:5px;margin:2px 0;background:#262C50;"><span style="font-size:0.72rem;color:#E2E8F0;">{icon} {i["inhalt"][:40]}…</span></div>', unsafe_allow_html=True)
            if total > 6:
                st.markdown(f'<div style="font-size:0.68rem;color:#4461D7;padding:4px 8px;">+{total-6} weitere → Technik-Gedächtnis</div>', unsafe_allow_html=True)

if "Dashboard" in page:
    from pages.dashboard import show; show()
elif "Meine Tasks" in page:
    from pages.meine_tasks import show; show()
elif "Kanban" in page:
    from pages.kanban import show; show()
elif "Projekt einreichen" in page:
    from pages.projekt_antrag import show; show()
elif "Genehmigung" in page:
    from pages.genehmigung import show; show()
elif "Projekte" in page:
    from pages.projekte import show; show()
elif "Technik" in page:
    from pages.gedaechtnis import show; show()
elif "Stakeholder" in page:
    from pages.stakeholder import show; show()
elif "Mein Profil" in page:
    from pages.mein_profil import show; show()
elif "KI" in page:
    from pages.ki_assistent import show; show()
elif "Gantt" in page:
    from pages.gantt import show; show()
elif "Automation" in page:
    from pages.phase3_automation import show; show()
elif "Wochenbericht" in page:
    from pages.wochenbericht_ui import show; show()
elif "Einstellungen" in page:
    from pages.einstellungen import show; show()
