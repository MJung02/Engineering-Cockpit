"""Gemeinsame UI-Hilfsfunktionen für alle Seiten"""
from datetime import datetime, timezone
import streamlit as st

# ═══════════════════════════════════════════════════════════════════════════════
# 1. LAYOUT KOMPONENTEN
# ═══════════════════════════════════════════════════════════════════════════════

def topbar(title, subtitle="", breadcrumb="Engineering Cockpit"):
    return f"""
    <div style="background:#FFFFFF; border-bottom:1px solid #E2E5F0; padding:0 28px;
                height:56px; display:flex; align-items:center; justify-content:space-between;
                box-shadow:0 1px 3px rgba(30,34,53,0.08); margin-bottom:24px;">
        <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; color:#9099BE;">{breadcrumb}</span>
            <span style="color:#CDD0E0;">›</span>
            <span style="font-size:0.875rem; font-weight:800; color:#1E2235;">{title}</span>
            {f'<span style="font-size:0.75rem; color:#9099BE; margin-left:4px;">— {subtitle}</span>' if subtitle else ""}
        </div>
    </div>
    """

def section_header(title, count=None):
    count_html = f'<span style="background:#ECEEF5;color:#9099BE;border-radius:10px;padding:1px 8px;font-size:0.72rem;font-weight:700;margin-left:8px;">{count}</span>' if count is not None else ""
    return f"""
    <div style="display:flex;align-items:center;padding:14px 0 10px;border-bottom:1px solid #E2E5F0;margin-bottom:12px;">
        <span style="font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#9099BE;">{title}</span>
        {count_html}
    </div>
    """

# ═══════════════════════════════════════════════════════════════════════════════
# 2. ALLGEMEINE BADGES & SPEZIAL-BADGES
# ═══════════════════════════════════════════════════════════════════════════════

def badge(text, color="primary"):
    """Universelle Badge-Funktion"""
    colors = {
        "primary": ("background:#EEF1FC; color:#4461D7;"),
        "green":   ("background:#DCFCE7; color:#16A34A;"),
        "yellow":  ("background:#FEF3C7; color:#D97706;"),
        "red":     ("background:#FEE2E2; color:#DC2626;"),
        "orange":  ("background:#FFEDD5; color:#EA580C;"),
        "muted":   ("background:#ECEEF5; color:#9099BE;"),
        "purple":  ("background:#F3EEFF; color:#7C3AED;"),
    }
    style = colors.get(color, colors["muted"])
    return f'<span style="display:inline-flex;align-items:center;padding:2px 9px;border-radius:20px;font-size:0.68rem;font-weight:700;{style}">{text}</span>'

def aufwand_badge(k):
    if not k: return ""
    m = {
        "2m":  ("⚡ 2 Min",  "background:#DCFCE7;color:#16A34A;"),
        "15m": ("🕐 15 Min", "background:#DBEAFE;color:#1D4ED8;"),
        "2h":  ("⏱ 2h",      "background:#FEF3C7;color:#D97706;"),
        "4h+": ("🔴 4h+",    "background:#FEE2E2;color:#DC2626;"),
    }
    label, style = m.get(k, (k, "background:#ECEEF5;color:#9099BE;"))
    return f'<span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:700;{style}">{label}</span>'

def status_badge(s):
    if not s: return ""
    m = {
        "Backlog":    ("Backlog",     "background:#ECEEF5;color:#9099BE;"),
        "Fokus":      ("▶ Fokus",      "background:#EEF1FC;color:#4461D7;"),
        "Warten_auf": ("⏳ Warten",    "background:#FEF3C7;color:#D97706;"),
        "Erledigt":   ("✓ Erledigt",  "background:#DCFCE7;color:#16A34A;"),
    }
    label, style = m.get(s, (s, "background:#ECEEF5;color:#9099BE;"))
    return f'<span style="display:inline-flex;align-items:center;padding:2px 9px;border-radius:20px;font-size:0.68rem;font-weight:700;{style}">{label}</span>'

def prio_badge(p):
    if p is None: return ""
    p_val = int(p) if str(p).isdigit() else p
    m = {1: ("🔴 Hoch","#FEE2E2","#DC2626"), 2: ("🟡 Mittel","#FEF3C7","#D97706"), 3: ("⚪ Niedrig","#F4F5FA","#9099BE")}
    label, bg, col = m.get(p_val, (str(p),"#F4F5FA","#9099BE"))
    return f'<span style="display:inline-flex;align-items:center;background:{bg};color:{col};padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:700;">{label}</span>'

def esk_label(stufe, warten_seit=None):
    """Alias für eskalation_badge, um den Import-Fehler zu beheben"""
    if not stufe or stufe == 0: return ""
    icons  = ["", "⚠", "🔴", "🚨"]
    labels = ["", "Reminder", "Follow-Up", "ESKALATION"]
    colors = ["#9099BE", "#D97706", "#EA580C", "#DC2626"]
    
    tage = ""
    if warten_seit:
        try:
            ws = datetime.fromisoformat(str(warten_seit))
            tage = f" · {(datetime.now(timezone.utc)-ws).days}d"
        except: pass
    
    idx = min(int(stufe), 3)
    return f'<span style="display:inline-flex;align-items:center;background:#FEE2E2;color:{colors[idx]};padding:2px 9px;border-radius:20px;font-size:0.68rem;font-weight:700;">{icons[idx]} {labels[idx]}{tage}</span>'

# Alias hinzufügen, falls im Code noch der alte Name genutzt wird
eskalation_badge = esk_label

def score_badge(score):
    if score is None: return ""
    s = float(score)
    if s >= 70: color = "#DC2626"; bg = "#FEE2E2"; icon = "🔥"
    elif s >= 45: color = "#D97706"; bg = "#FEF3C7"; icon = "⚡"
    else: return ""
    return f'<span style="display:inline-flex;background:{bg};color:{color};border-radius:10px;padding:1px 7px;font-size:0.65rem;font-weight:700;">{icon} {s:.0f}</span>'

# ═══════════════════════════════════════════════════════════════════════════════
# 3. TASK CARD & ALERTS
# ═══════════════════════════════════════════════════════════════════════════════

def task_card_list(t):
    aufwand = aufwand_badge(t.get('aufwandsklasse'))
    status = status_badge(t.get('status'))
    prio = prio_badge(t.get('prioritaet'))
    # Hier nutzen wir jetzt den Namen, der auch importiert wird
    eska = esk_label(t.get('eskalation_stufe'), warten_seit=t.get('warten_seit'))
    
    farbe = t.get("projekt_farbe", "#4461D7") or "#4461D7"
    return f"""
    <div style="background:#FFFFFF; border:1px solid #E2E5F0; border-radius:8px; 
                padding:12px 16px; margin-bottom:10px; box-shadow:0 1px 3px rgba(30,34,53,0.06);
                border-left:4px solid {farbe};">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
            <div style="flex:1;">
                <div style="font-size:0.9rem; font-weight:700; color:#1E2235; margin-bottom:4px;">{t['titel']}</div>
                <div style="font-size:0.75rem; color:#9099BE;">◆ {t.get('projekt_name', 'Kein Projekt')}</div>
            </div>
            <div style="display:flex; align-items:center; gap:6px; flex-shrink:0; flex-wrap:wrap; justify-content:flex-end;">
                {aufwand}{status}{prio}{eska}
            </div>
        </div>
    </div>
    """.strip()

def alert(text, kind="info", icon=None):
    cfg = {
        "danger":  ("#FEE2E2","#DC2626","#7F1D1D","🚨"),
        "warning": ("#FEF3C7","#D97706","#78350F","⚠️"),
        "info":    ("#EEF1FC","#4461D7","#1E3A8A","ℹ️"),
        "success": ("#DCFCE7","#16A34A","#14532D","✓"),
    }
    bg, border, col, d_icon = cfg.get(kind, cfg["info"])
    return f"""
    <div style="background:{bg};border-left:3px solid {border};color:{col};padding:12px 16px;
                border-radius:8px;margin-bottom:12px;font-size:0.84rem;display:flex;gap:10px;">
        <span>{icon or d_icon}</span><span>{text}</span>
    </div>
    """

def warten_info(text):
    """Zusätzliche Funktion für den Import in stakeholder.py"""
    return alert(text, kind="warning", icon="⏳")


def extrahiere_gliederung(dateiname: str, dateiinhalt: bytes) -> list:
    """Erkennt die Kapitelstruktur einer hochgeladenen Word- oder
    PowerPoint-Datei: bei .docx die Ueberschriften (Heading-Stile), bei
    .pptx die Folientitel."""
    import io
    name_lower = dateiname.lower()
    if name_lower.endswith(".docx"):
        from docx import Document
        doc = Document(io.BytesIO(dateiinhalt))
        return [p.text.strip() for p in doc.paragraphs
                if p.style and p.style.name.startswith("Heading") and p.text.strip()]
    elif name_lower.endswith(".pptx"):
        from pptx import Presentation
        prs = Presentation(io.BytesIO(dateiinhalt))
        titel = []
        for folie in prs.slides:
            if folie.shapes.title and folie.shapes.title.text.strip():
                titel.append(folie.shapes.title.text.strip())
        return titel
    else:
        raise ValueError("Nur .docx oder .pptx werden unterstützt.")


def kapitel_zu_docx_bytes(titel: str, kapitel: dict) -> bytes:
    """Baut aus einem Titel + einem Dict {Kapitelname: Inhalt} ein Word-
    Dokument mit einer Ueberschrift je Kapitel."""
    from docx import Document
    import io
    doc = Document()
    doc.add_heading(titel, level=0)
    for kapitel_titel, inhalt in kapitel.items():
        doc.add_heading(kapitel_titel, level=1)
        for absatz in (inhalt or "").split("\n\n"):
            doc.add_paragraph(absatz)
    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()


def text_zu_docx_bytes(titel: str, text: str) -> bytes:
    """Baut aus einem Titel + Freitext (z.B. Lasten-/Pflichtenheft) eine
    einfache Word-Datei als Bytes, fuer Download-Buttons neben dem
    bestehenden .txt-Export."""
    from docx import Document
    import io
    doc = Document()
    doc.add_heading(titel, level=1)
    for absatz in (text or "").split("\n\n"):
        doc.add_paragraph(absatz)
    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()