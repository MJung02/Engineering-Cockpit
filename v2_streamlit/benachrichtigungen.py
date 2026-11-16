"""
Engineering Cockpit – Benachrichtigungs-Service
Windows Desktop-Notifications via plyer (keine Admin-Rechte nötig)
Läuft als Hintergrund-Thread, prüft alle 30 Minuten auf neue Eskalationen.
"""
import os
import sys
import threading
import time
from datetime import datetime

IS_WINDOWS = sys.platform == "win32"

try:
    from plyer import notification as plyer_notif
    PLYER_OK = True
except ImportError:
    PLYER_OK = False

# ── Konfiguration ─────────────────────────────────────────────────────────────
CHECK_INTERVAL_MIN  = int(os.getenv("NOTIF_INTERVAL_MIN", "30"))
NOTIF_ENABLED       = os.getenv("NOTIF_ENABLED", "true").lower() == "true"
APP_ICON            = os.path.join(os.path.dirname(__file__), "assets", "icon.ico")


def benachrichtigung_verfuegbar() -> bool:
    return PLYER_OK and IS_WINDOWS


def sende_benachrichtigung(titel: str, nachricht: str, dringlichkeit: str = "normal"):
    """
    Sendet eine Windows-Desktop-Benachrichtigung.
    dringlichkeit: normal | hoch
    """
    if not PLYER_OK:
        return False
    try:
        timeout = 5 if dringlichkeit == "normal" else 10
        icon = APP_ICON if os.path.exists(APP_ICON) else ""
        plyer_notif.notify(
            title=f"⚙ Engineering Cockpit – {titel}",
            message=nachricht[:200],
            app_name="Engineering Cockpit",
            app_icon=icon or None,
            timeout=timeout,
        )
        return True
    except Exception as e:
        print(f"[Benachrichtigung] Fehler: {e}")
        return False


# ── Hintergrund-Checker ───────────────────────────────────────────────────────
class EskalationsChecker:
    """
    Läuft im Hintergrund, prüft regelmäßig auf neue Eskalationen
    und sendet Windows-Benachrichtigungen.
    """
    def __init__(self):
        self._thread: threading.Thread | None = None
        self._stop_event = threading.Event()
        self._letzte_bekannte_esk: set = set()   # task_ids die bereits gemeldet wurden
        self._laeuft = False

    def starte(self):
        if self._laeuft or not NOTIF_ENABLED:
            return
        if not benachrichtigung_verfuegbar():
            return
        self._stop_event.clear()
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()
        self._laeuft = True
        print(f"[Benachrichtigung] Checker gestartet (alle {CHECK_INTERVAL_MIN} Min)")

    def stoppe(self):
        self._stop_event.set()
        self._laeuft = False

    def _loop(self):
        # Sofort beim Start einmal prüfen
        self._pruefen()
        while not self._stop_event.wait(CHECK_INTERVAL_MIN * 60):
            self._pruefen()

    def _pruefen(self):
        try:
            from dal import get_tasks, get_eskalations_updates
            # Eskalationen aktualisieren
            get_eskalations_updates()
            # Neue kritische Eskalationen (Stufe 3) holen
            rote = [t for t in get_tasks(status="Warten_auf")
                    if (t.get("eskalationsstufe") or 0) >= 3]
            orange = [t for t in get_tasks(status="Warten_auf")
                      if (t.get("eskalationsstufe") or 0) == 2]

            neue_rote = [t for t in rote if t["id"] not in self._letzte_bekannte_esk]
            neue_orange = [t for t in orange if t["id"] not in self._letzte_bekannte_esk]

            if neue_rote:
                namen = ", ".join(t.get("warten_auf_person","?") for t in neue_rote[:3])
                sende_benachrichtigung(
                    titel="🚨 ESKALATION",
                    nachricht=f"{len(neue_rote)} Task(s) kritisch eskaliert!\n{namen}",
                    dringlichkeit="hoch"
                )
                for t in neue_rote:
                    self._letzte_bekannte_esk.add(t["id"])

            elif neue_orange:
                namen = ", ".join(t.get("warten_auf_person","?") for t in neue_orange[:3])
                sende_benachrichtigung(
                    titel="⚠ Follow-Up fällig",
                    nachricht=f"{len(neue_orange)} Task(s) brauchen Follow-Up.\n{namen}",
                    dringlichkeit="normal"
                )
                for t in neue_orange:
                    self._letzte_bekannte_esk.add(t["id"])

            # Erledigte aus bekannten entfernen
            alle_ids = {t["id"] for t in get_tasks(status="Warten_auf")}
            self._letzte_bekannte_esk &= alle_ids

        except Exception as e:
            print(f"[Benachrichtigung] Checker-Fehler: {e}")

    @property
    def laeuft(self) -> bool:
        return self._laeuft


# Singleton
_checker = EskalationsChecker()


def get_checker() -> EskalationsChecker:
    return _checker


def starte_checker():
    """Wird beim App-Start aufgerufen."""
    _checker.starte()


# ── Manuelle Benachrichtigungen (aus UI auslösbar) ────────────────────────────
def benachrichtige_task_faellig(task_titel: str, projekt: str, tage: int):
    sende_benachrichtigung(
        titel="📅 Task fällig",
        nachricht=f"{task_titel}\nProjekt: {projekt} – fällig in {tage} Tag(en)"
    )


def benachrichtige_fokus_erinnerung(task_titel: str):
    sende_benachrichtigung(
        titel="▶ Fokus-Erinnerung",
        nachricht=f"Noch in Bearbeitung: {task_titel}"
    )


def teste_benachrichtigung():
    """Test-Notification aus Einstellungsseite."""
    return sende_benachrichtigung(
        titel="✓ Test erfolgreich",
        nachricht="Engineering Cockpit Benachrichtigungen funktionieren korrekt."
    )
