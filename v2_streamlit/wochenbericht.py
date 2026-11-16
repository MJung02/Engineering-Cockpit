"""
Engineering Cockpit – Wochenbericht Export
Generiert Excel-Statusbericht + einfaches HTML/PDF für Jour-fixe
"""
import io
import os
from datetime import datetime, timedelta, date, timezone

try:
    import openpyxl
    from openpyxl.styles import (Font, PatternFill, Alignment,
                                  Border, Side, GradientFill)
    from openpyxl.utils import get_column_letter
    OPENPYXL_OK = True
except ImportError:
    OPENPYXL_OK = False


def export_verfuegbar() -> bool:
    return OPENPYXL_OK


# ── Farbpalette ────────────────────────────────────────────────────────────────
C_HEADER   = "1B1F3B"   # Sidebar-Dunkelblau
C_PRIMARY  = "4461D7"   # Akzentblau
C_GREEN    = "16A34A"
C_YELLOW   = "D97706"
C_RED      = "DC2626"
C_ORANGE   = "EA580C"
C_LIGHT    = "EEF1FC"
C_WHITE    = "FFFFFF"
C_MUTED    = "9099BE"
C_BG       = "F4F5FA"


def _cell_style(ws, row, col, value="", bold=False, bg=None, fg="1E2235",
                align="left", border=False, wrap=False, size=10):
    cell = ws.cell(row=row, column=col, value=value)
    cell.font = Font(name="Calibri", bold=bold, color=fg, size=size)
    cell.alignment = Alignment(horizontal=align, vertical="center", wrap_text=wrap)
    if bg:
        cell.fill = PatternFill("solid", fgColor=bg)
    if border:
        thin = Side(style="thin", color="E2E5F0")
        cell.border = Border(left=thin, right=thin, top=thin, bottom=thin)
    return cell


def _status_color(status: str) -> str:
    return {"Fokus": C_PRIMARY, "Warten_auf": C_YELLOW,
            "Erledigt": C_GREEN, "Backlog": C_MUTED}.get(status, C_MUTED)


def _esk_color(stufe: int) -> str:
    return [C_MUTED, C_YELLOW, C_ORANGE, C_RED][min(stufe, 3)]


def erstelle_wochenbericht_excel(projekte: list, tasks: list,
                                  interaktionen: list) -> bytes:
    """
    Erstellt einen vollständigen Excel-Wochenbericht.
    Gibt bytes zurück (für st.download_button).
    """
    if not OPENPYXL_OK:
        raise RuntimeError("pip install openpyxl")

    wb = openpyxl.Workbook()
    wb.remove(wb.active)   # Default-Sheet entfernen

    heute    = datetime.now()
    kw_start = heute - timedelta(days=heute.weekday())
    kw_end   = kw_start + timedelta(days=6)
    kw_str   = f"KW {heute.isocalendar()[1]} · {kw_start.strftime('%d.%m.')} – {kw_end.strftime('%d.%m.%Y')}"

    # ── Sheet 1: Übersicht ────────────────────────────────────────────────────
    ws1 = wb.create_sheet("Übersicht")
    ws1.sheet_view.showGridLines = False
    ws1.column_dimensions["A"].width = 3
    ws1.column_dimensions["B"].width = 32
    ws1.column_dimensions["C"].width = 16
    ws1.column_dimensions["D"].width = 14
    ws1.column_dimensions["E"].width = 14
    ws1.column_dimensions["F"].width = 14
    ws1.column_dimensions["G"].width = 14
    ws1.column_dimensions["H"].width = 14
    ws1.row_dimensions[1].height = 8

    # Header
    ws1.merge_cells("B2:H2")
    _cell_style(ws1, 2, 2, "ENGINEERING COCKPIT – WOCHENBERICHT",
                bold=True, bg=C_HEADER, fg=C_WHITE, align="center", size=14)
    ws1.row_dimensions[2].height = 36

    ws1.merge_cells("B3:H3")
    _cell_style(ws1, 3, 2, kw_str, bg=C_PRIMARY, fg=C_WHITE, align="center", size=11)
    ws1.row_dimensions[3].height = 22

    ws1.merge_cells("B4:H4")
    _cell_style(ws1, 4, 2, f"Erstellt: {heute.strftime('%d.%m.%Y %H:%M')}",
                bg=C_LIGHT, fg=C_MUTED, align="center", size=9)
    ws1.row_dimensions[4].height = 18

    # KPI-Karten
    fokus_n  = sum(1 for t in tasks if t["status"] == "Fokus")
    warten_n = sum(1 for t in tasks if t["status"] == "Warten_auf")
    erledigt_n = sum(1 for t in tasks if t["status"] == "Erledigt")
    esk_n    = sum(1 for t in tasks if (t.get("eskalationsstufe") or 0) >= 2)
    aktive_p = sum(1 for p in projekte if p["status"] == "Begonnen")

    ws1.row_dimensions[6].height = 14
    ws1.row_dimensions[7].height = 40
    ws1.row_dimensions[8].height = 20

    kpis = [
        ("B", "Aktive Projekte", aktive_p, C_PRIMARY),
        ("C", "Im Fokus",        fokus_n,  C_PRIMARY),
        ("E", "Warten auf",      warten_n, C_YELLOW),
        ("F", "Eskaliert",       esk_n,    C_RED),
        ("H", "Erledigt KW",     erledigt_n, C_GREEN),
    ]
    for col, label, val, color in kpis:
        c = ord(col) - ord("A") + 1
        _cell_style(ws1, 7, c, val, bold=True, bg=color, fg=C_WHITE,
                    align="center", size=20)
        _cell_style(ws1, 8, c, label, bg=C_LIGHT, fg="5B6488",
                    align="center", size=9)

    # Projekt-Tabelle
    ws1.row_dimensions[10].height = 22
    headers = ["Projekt", "Kostenstelle", "Status", "Fokus", "Warten", "Erledigt", "Offen", "Fortschritt"]
    for i, h in enumerate(headers):
        _cell_style(ws1, 10, i+2, h, bold=True, bg=C_HEADER, fg=C_WHITE,
                    align="center" if i > 1 else "left", border=True, size=9)

    for row_i, p in enumerate(projekte, start=11):
        p_tasks = [t for t in tasks if t.get("projekt_id") == p["id"]]
        gesamt  = len(p_tasks)
        f_n = sum(1 for t in p_tasks if t["status"] == "Fokus")
        w_n = sum(1 for t in p_tasks if t["status"] == "Warten_auf")
        e_n = sum(1 for t in p_tasks if t["status"] == "Erledigt")
        o_n = sum(1 for t in p_tasks if t["status"] != "Erledigt")
        pct = f"{int(e_n/gesamt*100)}%" if gesamt > 0 else "0%"

        bg = C_WHITE if row_i % 2 == 0 else C_BG
        scol = {"Begonnen": C_GREEN, "Unterbrochen": C_YELLOW,
                "Abgebrochen": C_RED, "Abgelehnt": C_RED}.get(p["status"], C_MUTED)

        _cell_style(ws1, row_i, 2, p["name"], bg=bg, border=True)
        _cell_style(ws1, row_i, 3, p.get("kostenstelle","–"), bg=bg, border=True, align="center", fg=C_MUTED, size=9)
        _cell_style(ws1, row_i, 4, p["status"], bold=True, bg=scol, fg=C_WHITE, border=True, align="center", size=9)
        _cell_style(ws1, row_i, 5, f_n, bg=bg, border=True, align="center", fg=C_PRIMARY)
        _cell_style(ws1, row_i, 6, w_n, bg=bg, border=True, align="center", fg=C_YELLOW if w_n > 0 else C_MUTED)
        _cell_style(ws1, row_i, 7, e_n, bg=bg, border=True, align="center", fg=C_GREEN)
        _cell_style(ws1, row_i, 8, o_n, bg=bg, border=True, align="center")
        _cell_style(ws1, row_i, 9, pct, bold=True, bg=bg, border=True, align="center",
                    fg=C_GREEN if e_n == gesamt and gesamt > 0 else C_PRIMARY)
        ws1.row_dimensions[row_i].height = 18

    # ── Sheet 2: Eskalationen ─────────────────────────────────────────────────
    ws2 = wb.create_sheet("⚠ Eskalationen")
    ws2.sheet_view.showGridLines = False
    ws2.column_dimensions["A"].width = 3
    ws2.column_dimensions["B"].width = 40
    ws2.column_dimensions["C"].width = 20
    ws2.column_dimensions["D"].width = 16
    ws2.column_dimensions["E"].width = 14
    ws2.column_dimensions["F"].width = 14

    ws2.merge_cells("B2:F2")
    _cell_style(ws2, 2, 2, "ESKALATIONEN & WARTEN-AUF",
                bold=True, bg=C_RED, fg=C_WHITE, align="center", size=13)
    ws2.row_dimensions[2].height = 30

    headers_esk = ["Task", "Projekt", "Warten auf", "Seit (Tage)", "Eskalation"]
    for i, h in enumerate(headers_esk):
        _cell_style(ws2, 4, i+2, h, bold=True, bg=C_HEADER, fg=C_WHITE, border=True, size=9)
    ws2.row_dimensions[4].height = 20

    esk_tasks = sorted(
        [t for t in tasks if t["status"] == "Warten_auf"],
        key=lambda t: -(t.get("eskalationsstufe") or 0)
    )
    esk_labels = ["–", "⚠ Reminder", "🔴 Follow-Up", "🚨 ESKALATION"]
    for row_i, t in enumerate(esk_tasks, start=5):
        esk = t.get("eskalationsstufe", 0) or 0
        tage = 0
        if t.get("warten_seit"):
            try:
                ws_dt = datetime.fromisoformat(str(t["warten_seit"]))
                tage = (datetime.now(timezone.utc) - ws_dt).days
            except Exception:
                pass
        esk_col = [C_MUTED, C_YELLOW, C_ORANGE, C_RED][min(esk, 3)]
        bg = C_WHITE if row_i % 2 == 0 else C_BG
        _cell_style(ws2, row_i, 2, t["titel"][:70], bg=bg, border=True)
        _cell_style(ws2, row_i, 3, t.get("projekt_name","–"), bg=bg, border=True, fg="5B6488", size=9)
        _cell_style(ws2, row_i, 4, t.get("warten_auf_person","–"), bg=bg, border=True, fg=C_ORANGE if esk >= 2 else "1E2235")
        _cell_style(ws2, row_i, 5, tage, bg=bg, border=True, align="center",
                    fg=C_RED if tage > 14 else C_YELLOW if tage > 7 else "1E2235")
        _cell_style(ws2, row_i, 6, esk_labels[min(esk, 3)], bold=esk >= 2,
                    bg=esk_col if esk >= 2 else bg, fg=C_WHITE if esk >= 2 else "1E2235",
                    border=True, align="center", size=9)
        ws2.row_dimensions[row_i].height = 18

    if not esk_tasks:
        ws2.merge_cells("B5:F5")
        _cell_style(ws2, 5, 2, "✓ Keine offenen Eskalationen – alles im grünen Bereich!",
                    bg=C_GREEN, fg=C_WHITE, align="center")
        ws2.row_dimensions[5].height = 24

    # ── Sheet 3: Alle Tasks ───────────────────────────────────────────────────
    ws3 = wb.create_sheet("Alle Tasks")
    ws3.sheet_view.showGridLines = False
    ws3.column_dimensions["A"].width = 3
    ws3.column_dimensions["B"].width = 42
    ws3.column_dimensions["C"].width = 22
    ws3.column_dimensions["D"].width = 12
    ws3.column_dimensions["E"].width = 10
    ws3.column_dimensions["F"].width = 12
    ws3.column_dimensions["G"].width = 10
    ws3.column_dimensions["H"].width = 12

    ws3.merge_cells("B2:H2")
    _cell_style(ws3, 2, 2, "ALLE TASKS – GESAMTÜBERSICHT",
                bold=True, bg=C_HEADER, fg=C_WHITE, align="center", size=13)
    ws3.row_dimensions[2].height = 28

    headers_t = ["Task", "Projekt", "Status", "Aufwand", "Priorität", "Dringlichkeit", "Krit. Pfad", "Fällig am"]
    for i, h in enumerate(headers_t):
        _cell_style(ws3, 4, i+2, h, bold=True, bg=C_PRIMARY, fg=C_WHITE, border=True, size=9, align="center" if i > 0 else "left")
    ws3.row_dimensions[4].height = 20

    status_order = {"Fokus": 0, "Warten_auf": 1, "Backlog": 2, "Erledigt": 3}
    sorted_tasks = sorted(tasks, key=lambda t: (status_order.get(t["status"], 9), -(t.get("_score", 0))))

    for row_i, t in enumerate(sorted_tasks, start=5):
        bg = C_WHITE if row_i % 2 == 0 else C_BG
        status_col = {"Fokus": C_PRIMARY, "Warten_auf": C_YELLOW, "Erledigt": C_GREEN, "Backlog": C_MUTED}.get(t["status"], C_MUTED)
        prio_str = {1:"🔴 Hoch", 2:"🟡 Mittel", 3:"⚪ Niedrig"}.get(t.get("prioritaet",2),"–")
        score = t.get("_score", 0)
        score_col = C_RED if score >= 70 else C_ORANGE if score >= 45 else C_PRIMARY if score >= 25 else C_MUTED

        _cell_style(ws3, row_i, 2, t["titel"][:80], bg=bg, border=True)
        _cell_style(ws3, row_i, 3, t.get("projekt_name","–"), bg=bg, border=True, fg="5B6488", size=9)
        _cell_style(ws3, row_i, 4, t["status"].replace("_"," "), bold=True, bg=status_col, fg=C_WHITE, border=True, align="center", size=9)
        _cell_style(ws3, row_i, 5, t.get("aufwandsklasse","–"), bg=bg, border=True, align="center", size=9)
        _cell_style(ws3, row_i, 6, prio_str, bg=bg, border=True, align="center", size=9)
        _cell_style(ws3, row_i, 7, f"{score:.0f}", bold=score>=70, bg=bg, border=True, align="center", fg=score_col, size=9)
        _cell_style(ws3, row_i, 8, "✓" if t.get("kritischer_pfad") else "", bg=bg, border=True, align="center", fg=C_PRIMARY)
        _cell_style(ws3, row_i, 9, str(t.get("faellig_am","–") or "–"), bg=bg, border=True, align="center", fg=C_MUTED, size=9)
        ws3.row_dimensions[row_i].height = 16

    # ── Sheet 4: Logbuch der Woche ────────────────────────────────────────────
    ws4 = wb.create_sheet("Logbuch Woche")
    ws4.sheet_view.showGridLines = False
    ws4.column_dimensions["A"].width = 3
    ws4.column_dimensions["B"].width = 16
    ws4.column_dimensions["C"].width = 12
    ws4.column_dimensions["D"].width = 22
    ws4.column_dimensions["E"].width = 50
    ws4.column_dimensions["F"].width = 14

    ws4.merge_cells("B2:F2")
    _cell_style(ws4, 2, 2, f"LOGBUCH – {kw_str}",
                bold=True, bg=C_HEADER, fg=C_WHITE, align="center", size=13)
    ws4.row_dimensions[2].height = 28

    # Nur Interaktionen der letzten 7 Tage
    cutoff = datetime.now(timezone.utc) - timedelta(days=7)
    kw_inter = []
    for i in interaktionen:
        try:
            ts = datetime.fromisoformat(str(i["erstellt_am"]))
            if ts >= cutoff:
                kw_inter.append(i)
        except Exception:
            pass

    headers_l = ["Datum", "Typ", "Projekt", "Inhalt", "Tags"]
    for idx, h in enumerate(headers_l):
        _cell_style(ws4, 4, idx+2, h, bold=True, bg=C_PRIMARY, fg=C_WHITE, border=True, size=9)
    ws4.row_dimensions[4].height = 20

    typ_icons = {"Notiz":"📝","Loesung":"💡","Mail":"📧","Call":"📞","Snippet":"🔧"}
    for row_i, i in enumerate(kw_inter[:50], start=5):
        bg = C_WHITE if row_i % 2 == 0 else C_BG
        ts_str = str(i.get("erstellt_am",""))[:16]
        typ    = i.get("typ","Notiz")
        typ_col= C_GREEN if typ == "Loesung" else C_PRIMARY if typ == "Snippet" else C_MUTED
        _cell_style(ws4, row_i, 2, ts_str, bg=bg, border=True, fg=C_MUTED, size=9)
        _cell_style(ws4, row_i, 3, f"{typ_icons.get(typ,'')} {typ}", bg=typ_col if typ in ('Loesung','Snippet') else bg,
                    fg=C_WHITE if typ in ('Loesung','Snippet') else "1E2235", border=True, size=9, align="center")
        _cell_style(ws4, row_i, 4, i.get("projekt_name","–"), bg=bg, border=True, fg="5B6488", size=9)
        _cell_style(ws4, row_i, 5, i.get("inhalt","")[:120], bg=bg, border=True, wrap=True)
        _cell_style(ws4, row_i, 6, i.get("tags","–") or "–", bg=bg, border=True, fg=C_MUTED, size=9)
        ws4.row_dimensions[row_i].height = 28

    if not kw_inter:
        ws4.merge_cells("B5:F5")
        _cell_style(ws4, 5, 2, "Keine Logbuch-Einträge in dieser Woche.", fg=C_MUTED, align="center")

    # Alle Sheets: Freeze-Pane + AutoFilter
    for ws in [ws1, ws3]:
        try:
            ws.freeze_panes = "B11" if ws == ws1 else "B5"
        except Exception:
            pass

    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    return buf.read()


def erstelle_taetigkeitsnachweis_excel(projekt_name: str, buchungen: list) -> bytes:
    """Personenbezogener Taetigkeitsnachweis fuer Foerder-/Forschungsprojekte:
    Datum, Person, Rolle, Stunden, Taetigkeit (Notiz) je abgeschlossener
    Zeitbuchung, plus Stunden-Summe je Person. buchungen: Rueckgabe von
    dal.get_zeitbuchungen(projekt_id=...)."""
    if not OPENPYXL_OK:
        raise RuntimeError("pip install openpyxl")

    wb = openpyxl.Workbook()
    wb.remove(wb.active)
    ws = wb.create_sheet("Tätigkeitsnachweis")
    ws.sheet_view.showGridLines = False
    for col, w in {"A": 3, "B": 14, "C": 22, "D": 18, "E": 10, "F": 50}.items():
        ws.column_dimensions[col].width = w

    ws.merge_cells("B2:F2")
    _cell_style(ws, 2, 2, f"TÄTIGKEITSNACHWEIS – {projekt_name}", bold=True,
                bg=C_HEADER, fg=C_WHITE, align="center", size=13)
    ws.row_dimensions[2].height = 30
    ws.merge_cells("B3:F3")
    _cell_style(ws, 3, 2, f"Erstellt: {datetime.now().strftime('%d.%m.%Y %H:%M')}",
                bg=C_LIGHT, fg=C_MUTED, align="center", size=9)

    header_row = 5
    for i, h in enumerate(["Datum", "Person", "Rolle", "Stunden", "Tätigkeit"]):
        _cell_style(ws, header_row, 2 + i, h, bold=True, bg=C_PRIMARY, fg=C_WHITE,
                    align="center", border=True)

    row = header_row + 1
    summe_je_person = {}
    sortiert = sorted(buchungen, key=lambda x: (x.get("user_name") or "–", str(x.get("gestartet"))))
    for b in sortiert:
        stunden = round((b.get("dauer_min") or 0) / 60, 2)
        person = b.get("user_name") or "– kein Bearbeiter –"
        _cell_style(ws, row, 2, str(b.get("gestartet"))[:10], border=True)
        _cell_style(ws, row, 3, person, border=True)
        _cell_style(ws, row, 4, b.get("rolle") or "–", border=True)
        _cell_style(ws, row, 5, stunden, align="right", border=True)
        _cell_style(ws, row, 6, b.get("notiz") or "–", border=True, wrap=True)
        summe_je_person[person] = summe_je_person.get(person, 0) + stunden
        row += 1

    row += 1
    _cell_style(ws, row, 2, "Summe je Person", bold=True, bg=C_LIGHT)
    row += 1
    for person, summe in summe_je_person.items():
        _cell_style(ws, row, 2, person, border=True)
        _cell_style(ws, row, 5, round(summe, 2), align="right", border=True, bold=True)
        row += 1

    ws.freeze_panes = f"B{header_row + 1}"

    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    return buf.read()


def erstelle_html_bericht(projekte: list, tasks: list) -> str:
    """Simpler HTML-Bericht als Fallback wenn kein openpyxl."""
    heute = datetime.now().strftime("%d.%m.%Y")
    fokus = [t for t in tasks if t["status"] == "Fokus"]
    esk   = [t for t in tasks if (t.get("eskalationsstufe") or 0) >= 2]

    rows_proj = ""
    for p in projekte:
        pt = [t for t in tasks if t.get("projekt_id") == p["id"]]
        pct = int(sum(1 for t in pt if t["status"]=="Erledigt") / len(pt) * 100) if pt else 0
        rows_proj += f"<tr><td><b>{p['name']}</b></td><td>{p['status']}</td><td>{len(pt)}</td><td>{pct}%</td></tr>"

    return f"""<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>body{{font-family:sans-serif;font-size:13px;color:#1E2235;margin:24px}}
h1{{color:#1B1F3B}}h2{{color:#4461D7;border-bottom:2px solid #EEF1FC;padding-bottom:4px}}
table{{border-collapse:collapse;width:100%}}th{{background:#1B1F3B;color:#fff;padding:8px;text-align:left}}
td{{padding:7px 8px;border-bottom:1px solid #E2E5F0}}</style></head>
<body><h1>Engineering Cockpit – Wochenbericht {heute}</h1>
<h2>Projekte</h2><table><tr><th>Projekt</th><th>Status</th><th>Tasks</th><th>Fortschritt</th></tr>
{rows_proj}</table>
<h2>Eskalationen ({len(esk)})</h2>
{'<p style="color:#16A34A">✓ Keine Eskalationen</p>' if not esk else '<ul>'+''.join(f'<li><b>{t["titel"]}</b> → {t.get("warten_auf_person","?")}</li>' for t in esk)+'</ul>'}
</body></html>"""


def erstelle_projekt_praesentation(projekt: dict, init: dict, statusbericht: str,
                                   meilenstein_fortschritt: list, risiken: list) -> str:
    """Phase H: praesentierbare Einzelprojekt-Seite (Jour-fixe/GF-Update) -
    Ziel/Fortschritt/Risiko-Zusammenfassung statt nur KPI-Tabellen wie im
    allgemeinen Wochenbericht oben."""
    heute = datetime.now().strftime("%d.%m.%Y")

    ms_rows = "".join(
        f'<tr><td>{m["titel"]}</td><td>{m["done"]}/{m["gesamt"]}</td>'
        f'<td><div style="background:#ECEEF5;border-radius:6px;overflow:hidden;height:14px;">'
        f'<div style="background:#4461D7;width:{m["pct"]}%;height:100%;"></div></div> {m["pct"]}%</td></tr>'
        for m in meilenstein_fortschritt
    ) or '<tr><td colspan="3">Keine Meilensteine erfasst.</td></tr>'

    risiko_rows = "".join(
        f'<tr><td>{r["beschreibung"]}</td><td>{r.get("kategorie") or "–"}</td>'
        f'<td style="text-align:center;font-weight:700;'
        f'color:{"#DC2626" if (r.get("risikoprioritaet") or 0) >= 6 else "#D97706" if (r.get("risikoprioritaet") or 0) >= 3 else "#16A34A"};">'
        f'{r.get("risikoprioritaet") or "–"}</td><td>{r.get("status") or "Offen"}</td></tr>'
        for r in risiken[:10]
    ) or '<tr><td colspan="4">Keine Risiken erfasst.</td></tr>'

    statusbericht_html = (statusbericht or "Noch kein KI-Statusbericht erstellt.").replace("\n", "<br>")
    ziele_html = (init.get("ziele") or "–").replace("\n", "<br>")

    return f"""<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>{projekt['name']} – Projektstand {heute}</title>
<style>
body{{font-family:'Segoe UI',Arial,sans-serif;font-size:14px;color:#1E2235;margin:0;background:#F4F5FA;}}
.wrap{{max-width:880px;margin:0 auto;padding:32px;}}
.header{{background:#1B1F3B;color:#fff;padding:28px 32px;border-radius:0 0 12px 12px;margin:-32px -32px 24px;}}
.header h1{{margin:0;font-size:1.6rem;}}
.header .sub{{color:#8890B8;font-size:0.85rem;margin-top:6px;}}
h2{{color:#4461D7;border-bottom:2px solid #EEF1FC;padding-bottom:6px;font-size:1.05rem;}}
.card{{background:#fff;border:1px solid #E2E5F0;border-radius:10px;padding:20px 24px;margin-bottom:20px;
       box-shadow:0 1px 3px rgba(30,34,53,0.06);}}
table{{border-collapse:collapse;width:100%;margin-top:8px;}}
th{{background:#1B1F3B;color:#fff;padding:8px 10px;text-align:left;font-size:0.8rem;}}
td{{padding:8px 10px;border-bottom:1px solid #E2E5F0;font-size:0.85rem;}}
</style></head>
<body><div class="wrap">
<div class="header">
<h1>📁 {projekt['name']}</h1>
<div class="sub">Projektstand zum {heute} · Status: {projekt.get('status','?')}</div>
</div>

<div class="card"><h2>🎯 Ziele</h2><p>{ziele_html}</p></div>

<div class="card"><h2>📊 Status-Zusammenfassung</h2><p>{statusbericht_html}</p></div>

<div class="card"><h2>📍 Meilenstein-Fortschritt</h2>
<table><tr><th>Meilenstein</th><th>Tasks</th><th>Fortschritt</th></tr>{ms_rows}</table></div>

<div class="card"><h2>⚠ Risiken</h2>
<table><tr><th>Risiko</th><th>Kategorie</th><th>Priorität</th><th>Status</th></tr>{risiko_rows}</table></div>

</div></body></html>"""
