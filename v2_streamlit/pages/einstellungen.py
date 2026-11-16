"""Einstellungen – Teamwork.com Stil"""
import streamlit as st
from dal import (get_einstellung, set_einstellung, get_rollensaetze, upsert_rollensatz,
                 get_dokument_vorlage_datei, upsert_dokument_vorlage_datei)
from database import PG_CONFIG
from pages.helpers import topbar, alert, extrahiere_gliederung
import ki_service
import sso
import auth


def show():
    st.markdown(topbar("Einstellungen", "Konfiguration · Datenbank · Kapazitäten"), unsafe_allow_html=True)
    st.markdown('<div style="padding:0 28px;">', unsafe_allow_html=True)

    tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab8 = st.tabs(
        ["🗄 Datenbank", "⏱ Kapazitäten", "🤖 KI-Backend", "📋 Roadmap", "💰 Rollensätze",
         "🔐 SSO (Azure AD)", "📄 Dokument-Vorlagen", "👤 Mitarbeiter-Accounts"])

    with tab1:
        st.markdown(alert("✓ PostgreSQL verbunden", "success"), unsafe_allow_html=True)

        st.markdown(f"""
        <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:10px;
                    padding:20px 24px;box-shadow:0 1px 3px rgba(30,34,53,0.08);margin-bottom:16px;">
            <div style="font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#9099BE;margin-bottom:14px;">Verbindungsdetails</div>
            <table style="width:100%;border-collapse:collapse;font-size:0.84rem;">
                <tr style="border-bottom:1px solid #E2E5F0;">
                    <td style="padding:8px 0;color:#9099BE;font-weight:700;width:140px;">Host</td>
                    <td style="padding:8px 0;color:#1E2235;font-family:'Fira Code',monospace;">{PG_CONFIG.get('host','–')}:{PG_CONFIG.get('port','–')}</td>
                </tr>
                <tr style="border-bottom:1px solid #E2E5F0;">
                    <td style="padding:8px 0;color:#9099BE;font-weight:700;">Datenbank</td>
                    <td style="padding:8px 0;color:#1E2235;font-family:'Fira Code',monospace;">{PG_CONFIG.get('dbname','–')}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0;color:#9099BE;font-weight:700;">Nutzer</td>
                    <td style="padding:8px 0;color:#1E2235;font-family:'Fira Code',monospace;">{PG_CONFIG.get('user','–')}</td>
                </tr>
            </table>
        </div>
        """, unsafe_allow_html=True)

        st.markdown('<div style="font-size:0.78rem;font-weight:700;color:#5B6488;margin-bottom:6px;">Konfiguration via .env</div>', unsafe_allow_html=True)
        st.code("""# .env – Engineering Cockpit
EC_PG_HOST=localhost
EC_PG_PORT=5432
EC_PG_DATABASE=engineering_cockpit
EC_PG_USER=cockpit
EC_PG_PASSWORD=cockpit_dev_pw""", language="bash")

    with tab2:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;">
            Definiere, wie deine tägliche Arbeitszeit aufgeteilt werden soll. Das Dashboard nutzt diese Werte für Empfehlungen.
        </div>
        """, unsafe_allow_html=True)
        with st.form("kap_form"):
            k1, k2 = st.columns(2)
            with k1:
                kap_proj = st.slider("Projektarbeit (%)", 10, 90, int(get_einstellung("kapazitaet_projekt_pct",60)),
                                      help="Anteil deiner Zeit für strukturierte Projektarbeit")
            with k2:
                kap_adhoc = st.slider("Ad-hoc / Kleinkram (%)", 10, 90, int(get_einstellung("kapazitaet_adhoc_pct",40)),
                                       help="Anteil für 'Kannst du mal eben'-Anfragen")

            total = kap_proj + kap_adhoc
            if total != 100:
                st.markdown(alert(f"Summe = {total}% – muss 100% ergeben.", "warning"), unsafe_allow_html=True)

            # Visualisierung
            st.markdown(f"""
            <div style="background:#F4F5FA;border-radius:8px;padding:12px 16px;margin:10px 0;">
                <div style="font-size:0.72rem;font-weight:700;color:#9099BE;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Kapazitäts-Split</div>
                <div style="display:flex;height:22px;border-radius:6px;overflow:hidden;gap:2px;">
                    <div style="width:{kap_proj}%;background:#4461D7;display:flex;align-items:center;justify-content:center;font-size:0.72rem;color:#fff;font-weight:700;">
                        {kap_proj}%
                    </div>
                    <div style="width:{kap_adhoc}%;background:#D97706;display:flex;align-items:center;justify-content:center;font-size:0.72rem;color:#fff;font-weight:700;">
                        {kap_adhoc}%
                    </div>
                </div>
                <div style="display:flex;gap:20px;margin-top:6px;font-size:0.72rem;">
                    <span style="color:#4461D7;font-weight:600;">■ Projektarbeit</span>
                    <span style="color:#D97706;font-weight:600;">■ Ad-hoc</span>
                </div>
            </div>
            """, unsafe_allow_html=True)

            followup = st.slider("Follow-Up Grenze (Tage)", 2, 21, int(get_einstellung("follow_up_tage",7)),
                                  help="Nach X Tagen ohne Antwort wird 'Warten auf'-Task gelb markiert")

            st.markdown(f"""
            <div style="font-size:0.8rem;color:#5B6488;margin-top:4px;">
                Eskalationsstufen: Gelb nach <b>{followup}d</b> · Orange nach <b>{followup*2}d</b> · Rot (Eskalation) nach <b>{followup*3}d</b>
            </div>
            """, unsafe_allow_html=True)

            if st.form_submit_button("💾 Einstellungen speichern", type="primary"):
                set_einstellung("kapazitaet_projekt_pct", kap_proj)
                set_einstellung("kapazitaet_adhoc_pct", kap_adhoc)
                set_einstellung("follow_up_tage", followup)
                st.success("✓ Gespeichert!"); st.rerun()


    with tab3:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Konfiguriere welches KI-Backend für Mail-Parser, Fokus-Check und Task-Analyse genutzt wird.
            Ollama läuft lokal auf deinem PC – kein API-Key, kein Internet, IT-freundlich.
        </div>
        """, unsafe_allow_html=True)

        # Live-Status
        verfuegbar = ki_service.ki_verfuegbar()
        backend    = ki_service.ki_backend_name()
        ollama_ok  = ki_service._ollama_ping()
        anthropic_ok = ki_service._ANTHROPIC_PKG and bool(ki_service.CLAUDE_API_KEY)

        st.markdown(f"""
        <div style="background:{'#F0FDF4' if verfuegbar else '#FEF2F2'};border:1px solid {'#BBF7D0' if verfuegbar else '#FECACA'};
                    border-radius:10px;padding:16px 20px;margin-bottom:16px;border-left:4px solid {'#16A34A' if verfuegbar else '#DC2626'};">
            <div style="font-size:0.72rem;font-weight:700;color:{'#16A34A' if verfuegbar else '#DC2626'};text-transform:uppercase;letter-spacing:0.07em;margin-bottom:4px;">
                KI-Status
            </div>
            <div style="font-size:1rem;font-weight:700;color:#1E2235;">
                {'✓ ' + backend + ' bereit' if verfuegbar else '✗ Kein KI-Backend verfügbar'}
            </div>
        </div>
        """, unsafe_allow_html=True)

        lokal_ok = ki_service._lokales_modell_verfuegbar()

        # Status aller Backends
        c1, c2, c3 = st.columns(3)
        with c1:
            st.markdown(f"""
            <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:10px;padding:16px 18px;box-shadow:0 1px 3px rgba(30,34,53,0.06);">
                <div style="font-size:0.72rem;font-weight:700;color:#9099BE;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Ollama (lokal)</div>
                <div style="font-size:0.9rem;font-weight:700;color:{'#16A34A' if ollama_ok else '#DC2626'};">
                    {'✓ Läuft' if ollama_ok else '✗ Nicht erreichbar'}
                </div>
                <div style="font-size:0.75rem;color:#5B6488;margin-top:4px;">
                    URL: {ki_service.OLLAMA_URL}<br>
                    Modell: <b>{ki_service.OLLAMA_MODEL}</b>
                </div>
                {'<div style="background:#DCFCE7;border-radius:6px;padding:6px 10px;margin-top:8px;font-size:0.75rem;color:#14532D;">Empfehlung: phi3 (2 GB) – bereits geladen ✓</div>' if ollama_ok else '<div style="background:#FEF3C7;border-radius:6px;padding:6px 10px;margin-top:8px;font-size:0.75rem;color:#78350F;">ollama serve starten, dann App neu laden</div>'}
            </div>
            """, unsafe_allow_html=True)
        with c2:
            st.markdown(f"""
            <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:10px;padding:16px 18px;box-shadow:0 1px 3px rgba(30,34,53,0.06);">
                <div style="font-size:0.72rem;font-weight:700;color:#9099BE;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Anthropic Claude (Cloud)</div>
                <div style="font-size:0.9rem;font-weight:700;color:{'#16A34A' if anthropic_ok else '#9099BE'};">
                    {'✓ API-Key gesetzt' if anthropic_ok else '○ Kein API-Key'}
                </div>
                <div style="font-size:0.75rem;color:#5B6488;margin-top:4px;">
                    Modell: {ki_service.CLAUDE_MODEL[:30]}<br>
                    Key: {'sk-ant-…' if anthropic_ok else '– nicht konfiguriert –'}
                </div>
                {'<div style="background:#DCFCE7;border-radius:6px;padding:6px 10px;margin-top:8px;font-size:0.75rem;color:#14532D;">Stärkeres Modell als Ollama</div>' if anthropic_ok else '<div style="background:#EEF1FC;border-radius:6px;padding:6px 10px;margin-top:8px;font-size:0.75rem;color:#1E3A8A;">Optional – Ollama reicht vollständig</div>'}
            </div>
            """, unsafe_allow_html=True)
        with c3:
            st.markdown(f"""
            <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:10px;padding:16px 18px;box-shadow:0 1px 3px rgba(30,34,53,0.06);">
                <div style="font-size:0.72rem;font-weight:700;color:#9099BE;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Lokales Modell (eingebettet)</div>
                <div style="font-size:0.9rem;font-weight:700;color:{'#16A34A' if lokal_ok else '#DC2626'};">
                    {'✓ Datei gefunden' if lokal_ok else '✗ Keine Modell-Datei'}
                </div>
                <div style="font-size:0.75rem;color:#5B6488;margin-top:4px;">
                    Pfad: {ki_service.LOKAL_MODELL_PFAD}
                </div>
                {'<div style="background:#DCFCE7;border-radius:6px;padding:6px 10px;margin-top:8px;font-size:0.75rem;color:#14532D;">Kein Dienst nötig – läuft direkt im Prozess</div>' if lokal_ok else '<div style="background:#FEF3C7;border-radius:6px;padding:6px 10px;margin-top:8px;font-size:0.75rem;color:#78350F;">GGUF-Datei besorgen, Pfad unten eintragen</div>'}
            </div>
            """, unsafe_allow_html=True)

        st.markdown("<div style='height:16px'></div>", unsafe_allow_html=True)

        # Backend-Einstellungen ändern
        with st.form("ki_settings"):
            kb1, kb2 = st.columns(2)
            with kb1:
                new_backend = st.selectbox("KI-Backend",
                    ["auto", "ollama", "anthropic", "lokal"],
                    index=["auto","ollama","anthropic","lokal"].index(ki_service.KI_BACKEND) if ki_service.KI_BACKEND in ["auto","ollama","anthropic","lokal"] else 0,
                    help="auto = Anthropic > Ollama > lokales Modell")
                installierte_modelle = ki_service.get_ollama_modelle()
                modell_opts = installierte_modelle or ["phi3", "llama3", "mistral", "gemma2", "llama3.2"]
                new_model = st.selectbox("Ollama-Modell", modell_opts,
                    index=modell_opts.index(ki_service.OLLAMA_MODEL) if ki_service.OLLAMA_MODEL in modell_opts else 0,
                    help="Zeigt die tatsächlich lokal installierten Modelle (`ollama list`)."
                         if installierte_modelle else "Ollama nicht erreichbar - Standardliste, ggf. erst `ollama pull <modell>` ausführen.")
            with kb2:
                new_url = st.text_input("Ollama URL", value=ki_service.OLLAMA_URL)
                new_lokal_pfad = st.text_input("Pfad zur lokalen GGUF-Modell-Datei",
                    value=ki_service.LOKAL_MODELL_PFAD,
                    help="Datei manuell besorgen (siehe Anleitung unten), Pfad relativ oder absolut angeben.")
                st.markdown("""
                <div style="font-size:0.78rem;color:#5B6488;line-height:1.7;margin-top:8px;">
                    Änderungen werden in <code>.env</code> eingetragen.<br>
                    App-Neustart danach nötig.
                </div>
                """, unsafe_allow_html=True)
            if st.form_submit_button("💾 Einstellungen speichern", type="primary"):
                # .env Datei schreiben/aktualisieren
                env_path = ".env"
                try:
                    env_lines = open(env_path).readlines() if __import__("os").path.exists(env_path) else []
                except Exception:
                    env_lines = []
                keys_to_set = {
                    "KI_BACKEND": new_backend,
                    "OLLAMA_MODEL": new_model,
                    "OLLAMA_URL": new_url,
                    "LOKAL_MODELL_PFAD": new_lokal_pfad,
                }
                new_lines = []
                updated = set()
                for line in env_lines:
                    key = line.split("=")[0].strip()
                    if key in keys_to_set:
                        new_lines.append(f"{key}={keys_to_set[key]}\n")
                        updated.add(key)
                    else:
                        new_lines.append(line)
                for key, val in keys_to_set.items():
                    if key not in updated:
                        new_lines.append(f"{key}={val}\n")
                open(env_path, "w").writelines(new_lines)
                st.success("✓ .env gespeichert – bitte App neu starten (Streamlit neu laden)")

        # Ollama Live-Test
        st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
        if st.button("🧪 Ollama Live-Test starten", disabled=not ollama_ok):
            with st.spinner(f"Teste {ki_service.OLLAMA_MODEL}..."):
                try:
                    antwort = ki_service._llm_call(
                        "Antworte auf Deutsch in einem einzigen Satz.",
                        "Was ist ein Frequenzumrichter?",
                        max_tokens=100
                    )
                    st.markdown(f"""
                    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:12px 16px;margin-top:8px;">
                        <div style="font-size:0.72rem;font-weight:700;color:#16A34A;margin-bottom:4px;">KI-Antwort ({ki_service.OLLAMA_MODEL})</div>
                        <div style="font-size:0.875rem;color:#14532D;">{antwort[:300]}</div>
                    </div>
                    """, unsafe_allow_html=True)
                except Exception as e:
                    st.error(f"Test fehlgeschlagen: {e}")

        if st.button("🧪 Lokales Modell Live-Test starten", disabled=not lokal_ok):
            with st.spinner("Lade Modell und teste (erster Aufruf dauert länger)..."):
                try:
                    antwort = ki_service._llm_call(
                        "Antworte auf Deutsch in einem einzigen Satz.",
                        "Was ist ein Frequenzumrichter?",
                        max_tokens=100
                    )
                    st.markdown(f"""
                    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:12px 16px;margin-top:8px;">
                        <div style="font-size:0.72rem;font-weight:700;color:#16A34A;margin-bottom:4px;">KI-Antwort (lokales Modell)</div>
                        <div style="font-size:0.875rem;color:#14532D;">{antwort[:300]}</div>
                    </div>
                    """, unsafe_allow_html=True)
                except Exception as e:
                    st.error(f"Test fehlgeschlagen: {e}")

        # Installationsanleitung
        with st.expander("📖 Lokales eingebettetes Modell einrichten (Schritt-für-Schritt)"):
            st.markdown("""
            <div style="font-size:0.82rem;line-height:2;color:#1E2235;">
                <b>1. Paket installieren</b><br>
                &nbsp;&nbsp;<code>pip install llama-cpp-python</code><br><br>
                <b>2. Modell-Datei besorgen (einmalig, ca. 2-2.5 GB)</b><br>
                &nbsp;&nbsp;Auf <code>huggingface.co</code> nach <code>Phi-3.5-mini-instruct GGUF</code>
                oder <code>Llama-3.2-3B-Instruct GGUF</code> suchen, Q4_K_M-Variante herunterladen.<br>
                &nbsp;&nbsp;Datei in den Ordner <code>models/</code> im Projektverzeichnis legen.<br><br>
                <b>3. In .env eintragen</b><br>
                &nbsp;&nbsp;<code>KI_BACKEND=lokal</code><br>
                &nbsp;&nbsp;<code>LOKAL_MODELL_PFAD=models/&lt;dateiname&gt;.gguf</code><br><br>
                <b>4. App neu starten</b><br>
                &nbsp;&nbsp;<code>streamlit run app.py</code><br><br>
                Vorteil ggü. Ollama: kein separater Hintergrunddienst nötig, läuft direkt im
                Python-Prozess der App.
            </div>
            """, unsafe_allow_html=True)

        with st.expander("📖 Ollama Einrichtung (Schritt-für-Schritt)"):
            st.markdown("""
            <div style="font-size:0.82rem;line-height:2;color:#1E2235;">
                <b>1. Ollama herunterladen</b><br>
                &nbsp;&nbsp;→ <code>https://ollama.com/download/windows</code><br>
                &nbsp;&nbsp;Keine Admin-Rechte nötig – einfach installieren<br><br>
                <b>2. Modell laden (einmalig)</b><br>
                &nbsp;&nbsp;Windows-Eingabeaufforderung öffnen:<br>
                &nbsp;&nbsp;<code>ollama pull phi3</code> &nbsp;←&nbsp; empfohlen (2 GB, schnell)<br>
                &nbsp;&nbsp;<code>ollama pull llama3</code> &nbsp;←&nbsp; stärker (4 GB)<br><br>
                <b>3. Ollama starten</b><br>
                &nbsp;&nbsp;<code>ollama serve</code> &nbsp;←&nbsp; läuft im Hintergrund<br>
                &nbsp;&nbsp;Oder: Ollama Desktop-App starten (Tray-Icon)<br><br>
                <b>4. In .env eintragen</b><br>
                &nbsp;&nbsp;<code>KI_BACKEND=ollama</code><br>
                &nbsp;&nbsp;<code>OLLAMA_MODEL=phi3</code><br><br>
                <b>5. App neu starten</b><br>
                &nbsp;&nbsp;<code>streamlit run app.py</code>
            </div>
            """, unsafe_allow_html=True)


    with tab4:
        st.markdown("""
        <div style="background:#FFFFFF;border:1px solid #E2E5F0;border-radius:10px;
                    padding:20px 24px;box-shadow:0 1px 3px rgba(30,34,53,0.08);">
        """, unsafe_allow_html=True)
        roadmap = [
            ("✅","Phase A – Fundament","fertig","#16A34A","#F0FDF4",
             "PostgreSQL · Auth/Rollen · Personen-FKs · Kanban · Projektverwaltung · Follow-Up-Eskalation · Technik-Gedächtnis · Stakeholder-Radar"),
            ("✅","Phase B – Intake & Genehmigung","fertig","#16A34A","#F0FDF4",
             "Projektanträge, GF-Genehmigungs-Queue, Ressourcen-Zuteilung in % mit 100%-Deckelung"),
            ("✅","Phase C – Projekt-Initialisierung","fertig","#16A34A","#F0FDF4",
             "Ziele/Erfolgskriterien, Lessons Learned, Projektart-Einstufung, Vorgehensmodell-Wahl, Projektdesign – dauerhaft editierbar"),
            ("✅","Phase D – Risiko & Anforderungen","fertig","#16A34A","#F0FDF4",
             "Risikoregister mit FMEA-Koeffizient, RACI/AKV-Matrix, Stakeholder-Analyse"),
            ("✅","Phase E – Dokumenten-Generierung","fertig","#16A34A","#F0FDF4",
             "KI-Entwürfe für Lasten-/Pflichtenheft, Stücklisten, User-Story-Chat"),
            ("✅","Phase F – Vorgehensmodell-Engine","fertig","#16A34A","#F0FDF4",
             "Meilenstein-Struktur je Vorgehensmodell (Wasserfall/V-Modell/Scrum/hybrid), Scrum-Board, Gantt"),
            ("✅","Phase G – Kommunikation & Dokumentation","fertig","#16A34A","#F0FDF4",
             "Mail-Drop-Zone, Wochenbericht-Export, Daily-Log-KI"),
            ("✅","Phase H – Terminplanung & Präsentation","fertig","#16A34A","#F0FDF4",
             "KI-Terminvorschlag anhand RACI, Projektstand-Präsentationsexport"),
            ("✅","Phase I – Mitarbeiterprofile","fertig","#16A34A","#F0FDF4",
             "KI-abgeleitetes Kompetenzprofil aus bearbeiteten Aufgaben"),
            ("✅","Phase J – Infrastruktur","fertig","#16A34A","#F0FDF4",
             "SSO (Azure AD), lokales KI-Modell/Ollama-Support, Login/Sessions"),
            ("✅","Phase K – Kosten-/Zeitcontrolling","fertig","#16A34A","#F0FDF4",
             "Zeiterfassung mit Rollen-Stundensätzen, Budgetüberwachung, Belegverwaltung"),
            ("🔜","Aktuell – QA-Backlog nach Handbuch-Test","in Bearbeitung","#D97706","#FFFBEB",
             "Kleinere Ergänzungen, Workflow-Überarbeitungen und Bugfixes aus der ersten Nutzer-QA-Runde (Details: docs/INITIALISIERUNG.md, Abschnitt 8)"),
            ("○","Geplant – größere Features","Zukunft","#9099BE","#F4F5FA",
             "Mail-Parser-Automatisierung mit Antwortvorschlägen · Smart-Folder-Konventionen · PowerPoint-Export · echtes Hintergrund-Threading für KI-Aufrufe"),
        ]
        for icon, title, status, col, bg, desc in roadmap:
            st.markdown(f"""
            <div style="background:{bg};border:1px solid {'#BBF7D0' if col=='#16A34A' else '#E2E5F0'};
                        border-left:4px solid {col};border-radius:8px;padding:14px 18px;margin-bottom:12px;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <span style="font-size:1.1rem;">{icon}</span>
                    <span style="font-weight:800;font-size:0.95rem;color:#1E2235;">{title}</span>
                    <span style="background:{'#DCFCE7' if col=='#16A34A' else '#ECEEF5'};color:{col};border-radius:20px;padding:2px 10px;font-size:0.68rem;font-weight:700;">{status}</span>
                </div>
                <div style="font-size:0.8rem;color:#5B6488;line-height:1.6;">{desc}</div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

    with tab5:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Stundensätze je Einsatzrolle – Grundlage für die Ist-Kosten-Berechnung
            (Zeiterfassung × Stundensatz) in der Budgetüberwachung je Projekt.
            Ohne Stundensatz fließen Buchungen dieser Rolle nicht in die Ist-Kosten ein.
        </div>
        """, unsafe_allow_html=True)

        rollensaetze = get_rollensaetze()
        with st.form("rollensaetze_form"):
            neue_saetze = {}
            for r in rollensaetze:
                neue_saetze[r["rolle"]] = st.number_input(
                    f"{r['rolle']} (€/h)",
                    value=float(r["stundensatz"]) if r["stundensatz"] is not None else 0.0,
                    min_value=0.0, step=5.0, key=f"satz_{r['rolle']}"
                )
            if st.form_submit_button("💾 Stundensätze speichern", type="primary"):
                for rolle, satz in neue_saetze.items():
                    upsert_rollensatz(rolle, satz if satz > 0 else None)
                st.success("✓ Gespeichert!"); st.rerun()

    with tab6:
        st.markdown("""
        <div style="font-size:0.84rem;color:#5B6488;margin-bottom:16px;line-height:1.6;">
            Single Sign-On über Microsoft Entra ID (Azure AD) – ergänzt den bestehenden
            E-Mail/Passwort-Login, ersetzt ihn nicht. Braucht eine App-Registration in
            eurem Azure-AD-Tenant, die <b>nur jemand mit Azure-AD-Admin-Rechten</b> anlegen
            kann – nicht aus dieser App heraus möglich. Diese Seite ist für eure IT gedacht:
            Werte unten eintragen, dann ist SSO sofort aktiv.
        </div>
        """, unsafe_allow_html=True)

        konfiguriert = sso.sso_konfiguriert()
        st.markdown(alert(
            "✓ SSO konfiguriert und aktiv" if konfiguriert else "○ SSO noch nicht konfiguriert – Login läuft ausschließlich über E-Mail/Passwort",
            "success" if konfiguriert else "info"
        ), unsafe_allow_html=True)

        with st.expander("📖 Anleitung für die IT: Azure-AD-App-Registration anlegen", expanded=not konfiguriert):
            st.markdown("""
            <div style="font-size:0.82rem;line-height:2;color:#1E2235;">
                <b>1. App-Registration anlegen</b><br>
                &nbsp;&nbsp;Azure Portal → Microsoft Entra ID → App registrations → New registration<br>
                &nbsp;&nbsp;Name: z.B. "Engineering Cockpit"<br>
                &nbsp;&nbsp;Supported account types: "Accounts in this organizational directory only"<br><br>
                <b>2. Redirect URI hinterlegen</b><br>
                &nbsp;&nbsp;Platform: <b>Web</b><br>
                &nbsp;&nbsp;URI: die URL, unter der diese App erreichbar ist (z.B.
                <code>http://server-name:8501</code> oder die interne Domain) –
                muss exakt mit "Redirect-URI" unten übereinstimmen<br><br>
                <b>3. Client Secret erzeugen</b><br>
                &nbsp;&nbsp;Certificates & secrets → New client secret → Wert sofort kopieren
                (wird danach nicht mehr angezeigt)<br><br>
                <b>4. Werte hier eintragen</b><br>
                &nbsp;&nbsp;<b>Tenant ID</b>: Overview-Seite der App-Registration → "Directory (tenant) ID"<br>
                &nbsp;&nbsp;<b>Client ID</b>: Overview-Seite → "Application (client) ID"<br>
                &nbsp;&nbsp;<b>Client Secret</b>: der in Schritt 3 kopierte Wert<br><br>
                <b>5. API-Berechtigung (meist per Default schon vorhanden)</b><br>
                &nbsp;&nbsp;API permissions → Microsoft Graph → Delegated → <code>User.Read</code>
            </div>
            """, unsafe_allow_html=True)

        with st.form("sso_settings"):
            new_tenant = st.text_input("Tenant ID", value=sso.AZURE_TENANT_ID)
            new_client_id = st.text_input("Client ID", value=sso.AZURE_CLIENT_ID)
            new_client_secret = st.text_input("Client Secret", value=sso.AZURE_CLIENT_SECRET, type="password")
            new_redirect = st.text_input("Redirect-URI (muss in Azure exakt so hinterlegt sein)",
                                          value=sso.AZURE_REDIRECT_URI)
            st.caption("Änderungen werden in .env eingetragen. App-Neustart danach nötig.")
            if st.form_submit_button("💾 SSO-Konfiguration speichern", type="primary"):
                env_path = ".env"
                try:
                    env_lines = open(env_path).readlines() if __import__("os").path.exists(env_path) else []
                except Exception:
                    env_lines = []
                keys_to_set = {
                    "AZURE_TENANT_ID": new_tenant.strip(),
                    "AZURE_CLIENT_ID": new_client_id.strip(),
                    "AZURE_CLIENT_SECRET": new_client_secret.strip(),
                    "AZURE_REDIRECT_URI": new_redirect.strip(),
                }
                new_lines, updated = [], set()
                for line in env_lines:
                    key = line.split("=")[0].strip()
                    if key in keys_to_set:
                        new_lines.append(f"{key}={keys_to_set[key]}\n")
                        updated.add(key)
                    else:
                        new_lines.append(line)
                for key, val in keys_to_set.items():
                    if key not in updated:
                        new_lines.append(f"{key}={val}\n")
                open(env_path, "w").writelines(new_lines)
                st.success("✓ .env gespeichert – bitte App neu starten, damit SSO aktiv wird.")

    with tab7:
        st.caption(
            "Vorlagentext, der als Startpunkt für neue Lasten-/Pflichtenhefte dient, "
            "solange noch kein eigener Inhalt gespeichert wurde (KI-Entwurf oder manuelle "
            "Eingabe überschreiben das jederzeit)."
        )
        vc1, vc2 = st.columns(2)
        with vc1:
            st.markdown("**Lastenheft-Vorlage**")
            with st.form("vorlage_lastenheft_form"):
                vorlage_lh = st.text_area(
                    "Vorlage", value=get_einstellung("vorlage_lastenheft") or "",
                    height=220, label_visibility="collapsed",
                    placeholder="z.B. Gliederung: 1. Ausgangssituation 2. Ziele 3. Anforderungen ..."
                )
                if st.form_submit_button("💾 Speichern", type="primary"):
                    set_einstellung("vorlage_lastenheft", vorlage_lh)
                    st.success("Gespeichert!")
        with vc2:
            st.markdown("**Pflichtenheft-Vorlage**")
            with st.form("vorlage_pflichtenheft_form"):
                vorlage_pf = st.text_area(
                    "Vorlage", value=get_einstellung("vorlage_pflichtenheft") or "",
                    height=220, label_visibility="collapsed",
                    placeholder="z.B. Gliederung: 1. Lösungsansatz 2. Umsetzung 3. Abnahmekriterien ..."
                )
                if st.form_submit_button("💾 Speichern", type="primary", key="vorlage_pf_save"):
                    set_einstellung("vorlage_pflichtenheft", vorlage_pf)
                    st.success("Gespeichert!")

        st.markdown("---")
        st.markdown("**Projekt-Export-Vorlage (Word/PowerPoint hochladen)**")
        st.caption(
            "Lade eine Word- (.docx) oder PowerPoint-Datei (.pptx) hoch. Die Kapitel-/Folientitel "
            "(Gliederung) werden automatisch erkannt. Im Projekt-Tab 'Dokumente' kann die KI "
            "diese Gliederung dann mit Inhalt aus den Projektdaten befüllen und als Word-Datei exportieren."
        )
        bestehende_vorlage = get_dokument_vorlage_datei("projekt_export")
        if bestehende_vorlage:
            st.info(f"Aktuelle Vorlage: **{bestehende_vorlage['dateiname']}** · "
                   f"{len(bestehende_vorlage['gliederung'])} Kapitel erkannt: "
                   f"{', '.join(bestehende_vorlage['gliederung'][:6])}"
                   f"{' …' if len(bestehende_vorlage['gliederung']) > 6 else ''}")
        hochgeladene_datei = st.file_uploader("Vorlage hochladen", type=["docx", "pptx"],
                                              label_visibility="collapsed", key="vorlage_upload")
        if hochgeladene_datei is not None:
            try:
                dateiinhalt = hochgeladene_datei.getvalue()
                gliederung = extrahiere_gliederung(hochgeladene_datei.name, dateiinhalt)
                if not gliederung:
                    st.warning("Keine Überschriften/Folientitel erkannt - bitte Vorlage mit "
                              "Formatvorlagen 'Überschrift 1/2' (Word) bzw. Folientiteln (PowerPoint) verwenden.")
                else:
                    mimetype = ("application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                               if hochgeladene_datei.name.lower().endswith(".docx") else
                               "application/vnd.openxmlformats-officedocument.presentationml.presentation")
                    upsert_dokument_vorlage_datei("projekt_export", hochgeladene_datei.name,
                                                  dateiinhalt, mimetype, gliederung)
                    st.success(f"Vorlage gespeichert – {len(gliederung)} Kapitel erkannt: {', '.join(gliederung)}")
                    st.rerun()
            except Exception as e:
                st.error(f"Vorlage konnte nicht verarbeitet werden: {e}")

    with tab8:
        current_user = st.session_state.get("user")
        if not auth.require_role(current_user, "admin"):
            st.info("Diese Ansicht ist nur für Admins zugänglich.")
        else:
            alle_rollen = auth.get_all_roles()
            rollen_labels = {r["code"]: r["label"] for r in alle_rollen}

            st.markdown("**Bestehende Accounts**")
            for u in auth.get_alle_users_fuer_admin():
                status = "🟢 aktiv" if u["is_active"] else "🔴 deaktiviert"
                login_info = "mit Login" if u.get("hat_login", True) else "kein Login"
                rollen_text = ", ".join(rollen_labels.get(c, c) for c in u["rollen"]) or "– keine Rolle –"
                with st.expander(f"{u['display_name']} · {status} · {login_info} · {rollen_text}"):
                    st.caption(u.get("email") or "keine E-Mail (kein Login-Account)")
                    if u.get("hat_login", True):
                        sel_rollen = st.multiselect(
                            "Rollen", list(rollen_labels.keys()), default=u["rollen"],
                            format_func=lambda c: rollen_labels[c], key=f"admin_rollen_{u['id']}"
                        )
                        if st.button("💾 Rollen speichern", key=f"admin_rollen_save_{u['id']}"):
                            auth.set_user_rollen(u["id"], sel_rollen)
                            st.success("Gespeichert!"); st.rerun()

                        neues_pw = st.text_input("Neues Passwort setzen", type="password", key=f"admin_pw_{u['id']}")
                        if st.button("🔑 Passwort setzen", key=f"admin_pw_save_{u['id']}"):
                            if neues_pw:
                                auth.set_user_passwort(u["id"], neues_pw)
                                st.success("Passwort gesetzt!")

                    if u["is_active"]:
                        if st.button("🚫 Account deaktivieren", key=f"admin_deact_{u['id']}"):
                            auth.set_user_aktiv(u["id"], False); st.rerun()
                    else:
                        if st.button("✅ Account reaktivieren", key=f"admin_react_{u['id']}"):
                            auth.set_user_aktiv(u["id"], True); st.rerun()

            st.markdown("---")
            st.markdown("**Neuen Account anlegen**")
            with st.form("admin_neuer_account"):
                na_email = st.text_input("E-Mail")
                na_name = st.text_input("Name")
                na_pw = st.text_input("Passwort", type="password")
                na_rollen = st.multiselect("Rollen", list(rollen_labels.keys()),
                                           format_func=lambda c: rollen_labels[c])
                if st.form_submit_button("➕ Account anlegen", type="primary"):
                    if na_email.strip() and na_name.strip() and na_pw:
                        auth.create_user_mit_login(na_email.strip(), na_name.strip(), na_pw, role_codes=na_rollen)
                        st.success(f"Account für '{na_name}' angelegt!"); st.rerun()
                    else:
                        st.warning("E-Mail, Name und Passwort sind Pflichtfelder.")

    st.markdown('</div>', unsafe_allow_html=True)
