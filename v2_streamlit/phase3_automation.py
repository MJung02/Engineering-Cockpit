"""
Engineering Cockpit – Phase 3: Ordner-Automation
Smart Folder · File-Watcher · Outlook-Kalender-Sync
Läuft lokal auf Windows – kein Cloud-Dienst nötig
"""
import os
import sys
import shutil
import json
import threading
from datetime import datetime, timedelta
from pathlib import Path

# ── Plattform-Guards ──────────────────────────────────────────────────────────
IS_WINDOWS = sys.platform == "win32"

# watchdog für File-Watcher (optional)
try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
    WATCHDOG_OK = True
except ImportError:
    WATCHDOG_OK = False

# win32com für Outlook (optional, nur Windows)
try:
    import win32com.client as win32
    WIN32_OK = True
except ImportError:
    WIN32_OK = False


# ═══════════════════════════════════════════════════════════════════════════════
# SMART FOLDER – Ordnerstruktur + Vorlagen beim Projektstart
# ═══════════════════════════════════════════════════════════════════════════════

# Standard-Ordnerstruktur für ein Maschinenbau-Projekt
STANDARD_STRUKTUR = [
    "01_Anforderungen",
    "02_Planung",
    "02_Planung/Gantt",
    "03_Konstruktion",
    "03_Konstruktion/CAD",
    "03_Konstruktion/Zeichnungen",
    "04_Elektro",
    "04_Elektro/E-Plan",
    "04_Elektro/SPS",
    "04_Elektro/SPS/Programme",
    "04_Elektro/SPS/Datenpunkte",
    "05_Software",
    "05_Software/PowerApps",
    "05_Software/Skripte",
    "06_Protokolle",
    "07_Abnahme",
    "08_Archiv",
]

# Vorlagen-Dateinamen (werden aus templates/ kopiert falls vorhanden)
VORLAGEN = {
    "02_Planung/Gantt":   "Gantt_Template.xlsx",
    "06_Protokolle":      "Protokoll_Template.docx",
    "07_Abnahme":         "Abnahmeprotokoll_Template.docx",
    "01_Anforderungen":   "Lasten_Pflichtenheft_Template.docx",
}

TEMPLATES_DIR = Path(__file__).parent / "templates"


def create_projekt_ordner(basis_pfad: str, projekt_name: str,
                           kostenstelle: str = "") -> dict:
    """
    Legt die komplette Ordnerstruktur für ein neues Projekt an.
    Kopiert Vorlagen-Dateien wenn vorhanden.
    Gibt Ergebnis-Dict zurück: {success, pfad, erstellt, vorlagen_kopiert, fehler}
    """
    if not basis_pfad:
        return {"success": False, "fehler": "Kein Basispfad angegeben."}

    # Ordnername aus Projektnamen erstellen (Windows-safe)
    sicherer_name = "".join(c for c in projekt_name if c.isalnum() or c in " -_()").strip()
    sicherer_name = sicherer_name[:80]
    if kostenstelle:
        ordner_name = f"{kostenstelle}_{sicherer_name}"
    else:
        ordner_name = sicherer_name

    root = Path(basis_pfad) / ordner_name
    erstellt = []
    vorlagen_kopiert = []
    fehler = []

    try:
        # Root anlegen
        root.mkdir(parents=True, exist_ok=True)
        erstellt.append(str(root))

        # Unterordner
        for rel_pfad in STANDARD_STRUKTUR:
            ziel = root / rel_pfad
            ziel.mkdir(parents=True, exist_ok=True)
            erstellt.append(str(ziel))

        # README im Root
        readme = root / "_PROJEKT_INFO.txt"
        readme.write_text(
            f"Projekt: {projekt_name}\n"
            f"Kostenstelle: {kostenstelle}\n"
            f"Erstellt: {datetime.now().strftime('%d.%m.%Y %H:%M')}\n"
            f"Ordner: {root}\n",
            encoding="utf-8"
        )

        # Vorlagen kopieren
        for rel_ziel, dateiname in VORLAGEN.items():
            quelle = TEMPLATES_DIR / dateiname
            ziel_datei = root / rel_ziel / dateiname
            if quelle.exists():
                shutil.copy2(quelle, ziel_datei)
                vorlagen_kopiert.append(dateiname)

        return {
            "success": True,
            "pfad": str(root),
            "erstellt": len(erstellt),
            "vorlagen_kopiert": vorlagen_kopiert,
            "fehler": fehler,
        }

    except PermissionError as e:
        return {"success": False, "fehler": f"Kein Zugriff: {e}"}
    except Exception as e:
        return {"success": False, "fehler": str(e)}


def ordner_existiert(pfad: str) -> bool:
    return bool(pfad) and Path(pfad).exists()


def ordner_inhalt(pfad: str, tiefe: int = 2) -> list:
    """Gibt Ordnerinhalt als flache Liste zurück (max. tiefe Ebenen)."""
    result = []
    root = Path(pfad)
    if not root.exists():
        return result
    try:
        for item in sorted(root.rglob("*")):
            rel = item.relative_to(root)
            ebene = len(rel.parts) - 1
            if ebene < tiefe:
                result.append({
                    "name": item.name,
                    "pfad": str(item),
                    "rel_pfad": str(rel),
                    "ist_ordner": item.is_dir(),
                    "ebene": ebene,
                    "groesse": item.stat().st_size if item.is_file() else 0,
                    "geaendert": datetime.fromtimestamp(item.stat().st_mtime).strftime("%d.%m.%Y %H:%M") if item.exists() else "",
                    "suffix": item.suffix.lower() if item.is_file() else "",
                })
    except Exception:
        pass
    return result


# ═══════════════════════════════════════════════════════════════════════════════
# FILE-WATCHER – Neue Dateien im Projektordner auto-verknüpfen
# ═══════════════════════════════════════════════════════════════════════════════

# Relevante Dateiendungen für Maschinenbau-Projekte
RELEVANTE_ENDUNGEN = {
    ".pdf":   "Dokument (PDF)",
    ".docx":  "Word-Dokument",
    ".xlsx":  "Excel-Tabelle",
    ".pptx":  "Präsentation",
    ".dwg":   "CAD-Zeichnung (DWG)",
    ".dxf":   "CAD-Zeichnung (DXF)",
    ".step":  "3D-Modell (STEP)",
    ".stp":   "3D-Modell (STP)",
    ".zap":   "EPLAN Projekt",
    ".elp":   "EPLAN Projekt",
    ".ap16":  "TIA Portal Projekt",
    ".ap17":  "TIA Portal Projekt",
    ".ap18":  "TIA Portal Projekt",
    ".ap19":  "TIA Portal Projekt",
    ".s7p":   "Step7 Projekt",
    ".mwp":   "WinCC Projekt",
    ".msapp": "Power App",
    ".zip":   "Archiv",
}


class _ProjektFileHandler(FileSystemEventHandler):
    """Watchdog-Handler: meldet neue/geänderte Dateien an Callback."""
    def __init__(self, callback, projekt_id: int):
        super().__init__()
        self.callback = callback
        self.projekt_id = projekt_id

    def on_created(self, event):
        if not event.is_directory:
            self._verarbeite(event.src_path, "neu")

    def on_modified(self, event):
        if not event.is_directory:
            self._verarbeite(event.src_path, "geaendert")

    def _verarbeite(self, pfad: str, aktion: str):
        p = Path(pfad)
        endung = p.suffix.lower()
        if endung in RELEVANTE_ENDUNGEN:
            self.callback({
                "projekt_id": self.projekt_id,
                "dateiname":  p.name,
                "pfad":       pfad,
                "typ":        RELEVANTE_ENDUNGEN[endung],
                "aktion":     aktion,
                "zeitstempel": datetime.now().isoformat(),
            })


class FileWatcherManager:
    """
    Verwaltet File-Watcher für mehrere Projektordner.
    Thread-safe, startet/stoppt Observer per Projekt.
    """
    def __init__(self):
        self._observers: dict[int, Observer] = {}
        self._lock = threading.Lock()
        self.neue_dateien: list[dict] = []   # Puffer für UI

    def starte_watcher(self, projekt_id: int, pfad: str) -> bool:
        """Startet Watcher für einen Projektordner. Gibt True bei Erfolg zurück."""
        if not WATCHDOG_OK:
            return False
        if not pfad or not Path(pfad).exists():
            return False
        with self._lock:
            if projekt_id in self._observers:
                self._observers[projekt_id].stop()
            handler  = _ProjektFileHandler(self._on_datei, projekt_id)
            observer = Observer()
            observer.schedule(handler, pfad, recursive=True)
            observer.daemon = True
            observer.start()
            self._observers[projekt_id] = observer
        return True

    def stoppe_watcher(self, projekt_id: int):
        with self._lock:
            if projekt_id in self._observers:
                self._observers[projekt_id].stop()
                del self._observers[projekt_id]

    def stoppe_alle(self):
        with self._lock:
            for obs in self._observers.values():
                obs.stop()
            self._observers.clear()

    def aktive_watcher(self) -> list[int]:
        with self._lock:
            return list(self._observers.keys())

    def _on_datei(self, info: dict):
        self.neue_dateien.append(info)
        # Max 100 Einträge im Puffer
        if len(self.neue_dateien) > 100:
            self.neue_dateien = self.neue_dateien[-100:]

    def pop_neue_dateien(self) -> list[dict]:
        """Gibt neue Dateien zurück und leert den Puffer."""
        with self._lock:
            result = list(self.neue_dateien)
            self.neue_dateien.clear()
            return result


# Singleton
_watcher_manager = FileWatcherManager()


def get_watcher_manager() -> FileWatcherManager:
    return _watcher_manager


# ═══════════════════════════════════════════════════════════════════════════════
# OUTLOOK-SYNC – Termine und Follow-Ups anlegen
# ═══════════════════════════════════════════════════════════════════════════════

def outlook_verfuegbar() -> bool:
    return WIN32_OK and IS_WINDOWS


def _get_outlook():
    """Gibt Outlook-Instanz zurück (COM)."""
    try:
        outlook = win32.Dispatch("Outlook.Application")
        return outlook
    except Exception as e:
        raise RuntimeError(f"Outlook nicht verfügbar: {e}")


def erstelle_outlook_termin(
    betreff:     str,
    start:       datetime,
    dauer_min:   int   = 60,
    ort:         str   = "",
    body:        str   = "",
    erinnerung:  int   = 15,   # Minuten vorher
    wichtigkeit: int   = 1,    # 0=niedrig 1=normal 2=hoch
) -> dict:
    """
    Legt einen Termin im Outlook-Kalender an.
    Gibt {success, id, fehler} zurück.
    """
    if not outlook_verfuegbar():
        return {"success": False, "fehler": "Outlook/win32com nicht verfügbar."}
    try:
        outlook   = _get_outlook()
        termin    = outlook.CreateItem(1)   # 1 = olAppointmentItem
        termin.Subject    = betreff
        termin.Start      = start.strftime("%Y-%m-%d %H:%M")
        termin.Duration   = dauer_min
        termin.Location   = ort
        termin.Body       = body
        termin.ReminderMinutesBeforeStart = erinnerung
        termin.Importance = wichtigkeit
        # Display(True) = Outlook öffnet den Termin – du prüfst und speicherst selbst
        termin.Display(True)
        return {"success": True, "id": "", "fehler": ""}
    except Exception as e:
        return {"success": False, "fehler": str(e)}


def erstelle_outlook_aufgabe(
    betreff:    str,
    faellig:    datetime,
    body:       str  = "",
    wichtigkeit: int = 1,
) -> dict:
    """Legt eine Aufgabe in Outlook an."""
    if not outlook_verfuegbar():
        return {"success": False, "fehler": "Outlook/win32com nicht verfügbar."}
    try:
        outlook  = _get_outlook()
        aufgabe  = outlook.CreateItem(3)   # 3 = olTaskItem
        aufgabe.Subject    = betreff
        aufgabe.DueDate    = faellig.strftime("%Y-%m-%d")
        aufgabe.Body       = body
        aufgabe.Importance = wichtigkeit
        # Display(True) = Outlook öffnet die Aufgabe – du prüfst und speicherst selbst
        aufgabe.Display(True)
        return {"success": True, "id": "", "fehler": ""}
    except Exception as e:
        return {"success": False, "fehler": str(e)}


def erstelle_followup_mail(
    an:      str,
    betreff: str,
    body:    str,
    senden:  bool = False,   # False = nur Entwurf öffnen
) -> dict:
    """
    Öffnet oder versendet eine Outlook-Mail.
    senden=False: öffnet den Entwurf (Nutzer kann noch prüfen).
    """
    if not outlook_verfuegbar():
        return {"success": False, "fehler": "Outlook/win32com nicht verfügbar."}
    try:
        outlook = _get_outlook()
        mail    = outlook.CreateItem(0)   # 0 = olMailItem
        mail.To      = an
        mail.Subject = betreff
        mail.Body    = body
        if senden:
            mail.Send()
            return {"success": True, "aktion": "gesendet", "fehler": ""}
        else:
            mail.Display(True)   # Öffnet Outlook-Fenster
            return {"success": True, "aktion": "entwurf_geoeffnet", "fehler": ""}
    except Exception as e:
        return {"success": False, "fehler": str(e)}


def lese_heutige_termine() -> list[dict]:
    """Liest heutige Termine aus Outlook für den Fokus-Check."""
    if not outlook_verfuegbar():
        return []
    try:
        outlook  = _get_outlook()
        kalender = outlook.GetNamespace("MAPI").GetDefaultFolder(9)  # 9 = Kalender
        items    = kalender.Items
        items.IncludeRecurrences = True
        items.Sort("[Start]")
        heute_str  = datetime.now().strftime("%d.%m.%Y")
        morgen_str = (datetime.now() + timedelta(days=1)).strftime("%d.%m.%Y")
        items      = items.Restrict(
            f"[Start] >= '{heute_str} 00:00' AND [Start] < '{morgen_str} 00:00'"
        )
        termine = []
        for item in items:
            try:
                termine.append({
                    "betreff":  item.Subject,
                    "start":    str(item.Start),
                    "ende":     str(item.End),
                    "ort":      item.Location or "",
                    "dauer":    item.Duration,
                })
            except Exception:
                pass
        return termine
    except Exception:
        return []


def berechne_maker_time(termine: list[dict]) -> dict:
    """
    Berechnet verfügbare Maker-Time zwischen Terminen.
    Gibt Blöcke freier Zeit zurück (>45 Min = nutzbar).
    """
    arbeitsstart = datetime.now().replace(hour=7, minute=30, second=0, microsecond=0)
    arbeitsende  = datetime.now().replace(hour=17, minute=0, second=0, microsecond=0)

    # Termin-Blöcke parsen
    bloecke = []
    for t in termine:
        try:
            start_str = str(t["start"])
            ende_str  = str(t["ende"])
            # Robustes Parsen verschiedener Outlook-Formate
            for fmt in ["%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%d.%m.%Y %H:%M"]:
                try:
                    s = datetime.strptime(start_str[:19], fmt)
                    e = datetime.strptime(ende_str[:19], fmt)
                    bloecke.append((s, e))
                    break
                except ValueError:
                    continue
        except Exception:
            pass

    bloecke.sort()

    # Freie Slots berechnen
    freie_slots = []
    aktuell = arbeitsstart
    for (s, e) in bloecke:
        if s > aktuell and (s - aktuell).seconds >= 45 * 60:
            freie_slots.append({
                "von":        aktuell.strftime("%H:%M"),
                "bis":        s.strftime("%H:%M"),
                "dauer_min":  int((s - aktuell).seconds / 60),
            })
        if e > aktuell:
            aktuell = e

    if aktuell < arbeitsende and (arbeitsende - aktuell).seconds >= 45 * 60:
        freie_slots.append({
            "von":       aktuell.strftime("%H:%M"),
            "bis":       arbeitsende.strftime("%H:%M"),
            "dauer_min": int((arbeitsende - aktuell).seconds / 60),
        })

    gesamt_min = sum(s["dauer_min"] for s in freie_slots)
    return {
        "freie_slots": freie_slots,
        "gesamt_maker_min": gesamt_min,
        "termine_heute": len(termine),
    }
