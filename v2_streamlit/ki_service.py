"""
Engineering Cockpit – KI-Service (Phase 2 + Ollama-Support + Phase J lokales Modell)
Unterstützt: Anthropic API (Cloud) | Ollama (lokal, eigener Dienst) |
lokales eingebettetes GGUF-Modell (Phase J, laeuft direkt im Python-Prozess,
kein separater Dienst noetig)
"""
import os, json, re, urllib.request, urllib.error
from datetime import datetime

# ── Anthropic (optional) ──────────────────────────────────────────────────────
try:
    import anthropic as _anthropic_lib
    _ANTHROPIC_PKG = True
except ImportError:
    _ANTHROPIC_PKG = False

CLAUDE_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
CLAUDE_MODEL   = "claude-sonnet-4-20250514"

# ── Ollama (lokal, kein API-Key, aber eigener Hintergrunddienst noetig) ───────
OLLAMA_URL   = os.getenv("OLLAMA_URL",   "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "phi3")    # phi3=2GB empfohlen; llama3=4GB; mistral=4GB

# ── Lokales, eingebettetes Modell (Phase J - kein Dienst, kein API-Key, laeuft
# direkt im Python-Prozess ueber llama-cpp-python) ────────────────────────────
try:
    from llama_cpp import Llama as _Llama
    _LLAMA_CPP_PKG = True
except ImportError:
    _LLAMA_CPP_PKG = False

_BASIS_ORDNER = os.path.dirname(os.path.abspath(__file__))


def _finde_lokales_modell(pfad: str) -> str:
    """Relative Pfade gelten ab dem Projektordner (nicht ab dem Startordner).
    Fehlt die angegebene Datei, wird die erste .gguf-Datei in models/ genommen."""
    if not os.path.isabs(pfad):
        pfad = os.path.join(_BASIS_ORDNER, pfad)
    if os.path.exists(pfad):
        return pfad
    ordner = os.path.join(_BASIS_ORDNER, "models")
    if os.path.isdir(ordner):
        kandidaten = sorted(f for f in os.listdir(ordner) if f.lower().endswith(".gguf"))
        if kandidaten:
            return os.path.join(ordner, kandidaten[0])
    return pfad


LOKAL_MODELL_PFAD    = _finde_lokales_modell(os.getenv("LOKAL_MODELL_PFAD", "models/lokales-modell.gguf"))
LOKAL_MODELL_CTX     = int(os.getenv("LOKAL_MODELL_CTX", "4096"))
LOKAL_MODELL_THREADS = int(os.getenv("LOKAL_MODELL_THREADS", str(os.cpu_count() or 4)))

_lokales_modell_instanz = None


def _lokales_modell_verfuegbar() -> bool:
    return _LLAMA_CPP_PKG and os.path.exists(LOKAL_MODELL_PFAD)


def _get_lokales_modell():
    """Laedt das GGUF-Modell einmalig und haelt es im Prozessspeicher (Laden
    dauert je nach Groesse mehrere Sekunden - Singleton statt Neuladen pro Call)."""
    global _lokales_modell_instanz
    if _lokales_modell_instanz is None:
        if not _LLAMA_CPP_PKG:
            raise RuntimeError("pip install llama-cpp-python")
        if not os.path.exists(LOKAL_MODELL_PFAD):
            raise RuntimeError(f"Modell-Datei nicht gefunden: {LOKAL_MODELL_PFAD}")
        _lokales_modell_instanz = _Llama(
            model_path=LOKAL_MODELL_PFAD, n_ctx=LOKAL_MODELL_CTX,
            n_threads=LOKAL_MODELL_THREADS, verbose=False,
        )
    return _lokales_modell_instanz


# ── Aktiver Backend ───────────────────────────────────────────────────────────
KI_BACKEND = os.getenv("KI_BACKEND", "auto")   # auto|anthropic|ollama|lokal – auto bevorzugt Anthropic, dann Ollama, dann lokales Modell


def _resolve_backend() -> str | None:
    """Ermittelt das tatsaechlich zu nutzende Backend. Bei 'auto' Prioritaet
    Anthropic (API-Key gesetzt) > Ollama (Dienst laeuft) > lokales Modell
    (GGUF-Datei vorhanden) - erhaelt die bisherige auto-Logik und haengt die
    neue dritte Option nur ans Ende der Kette an."""
    if KI_BACKEND in ("anthropic", "ollama", "lokal"):
        return KI_BACKEND
    if _ANTHROPIC_PKG and CLAUDE_API_KEY:
        return "anthropic"
    if _ollama_ping():
        return "ollama"
    if _lokales_modell_verfuegbar():
        return "lokal"
    return None


def _ollama_ping() -> bool:
    try:
        req = urllib.request.urlopen(f"{OLLAMA_URL}/api/tags", timeout=2)
        return req.status == 200
    except Exception:
        return False


def get_ollama_modelle() -> list:
    """Fragt die tatsaechlich lokal installierten Ollama-Modelle ab (nicht
    eine hartcodierte Wunschliste - vermeidet Auswahl nicht vorhandener
    Modelle bzw. Fehlen tatsaechlich installierter)."""
    try:
        req = urllib.request.urlopen(f"{OLLAMA_URL}/api/tags", timeout=2)
        data = json.loads(req.read())
        return [m["name"] for m in data.get("models", [])]
    except Exception:
        return []


def ki_verfuegbar() -> bool:
    backend = _resolve_backend()
    if backend == "anthropic":
        return _ANTHROPIC_PKG and bool(CLAUDE_API_KEY)
    if backend == "ollama":
        return _ollama_ping()
    if backend == "lokal":
        return _lokales_modell_verfuegbar()
    return False


def ki_backend_name() -> str:
    backend = _resolve_backend()
    if backend == "anthropic" and _ANTHROPIC_PKG and CLAUDE_API_KEY:
        return "Anthropic Claude"
    if backend == "ollama" and _ollama_ping():
        return f"Ollama ({OLLAMA_MODEL})"
    if backend == "lokal" and _lokales_modell_verfuegbar():
        return f"Lokales Modell ({os.path.basename(LOKAL_MODELL_PFAD)})"
    return "Nicht konfiguriert"


def _llm_call(system: str, user: str, max_tokens: int = 1000) -> str:
    """Unified LLM-Call: wählt automatisch Anthropic, Ollama oder das lokale
    eingebettete Modell (siehe _resolve_backend)."""
    backend = _resolve_backend()
    if backend == "anthropic":
        if not _ANTHROPIC_PKG:
            raise RuntimeError("pip install anthropic")
        if not CLAUDE_API_KEY:
            raise RuntimeError("ANTHROPIC_API_KEY nicht gesetzt")
        client = _anthropic_lib.Anthropic(api_key=CLAUDE_API_KEY)
        resp = client.messages.create(
            model=CLAUDE_MODEL, max_tokens=max_tokens,
            system=system,
            messages=[{"role": "user", "content": user}]
        )
        return resp.content[0].text.strip()
    elif backend == "lokal":
        modell = _get_lokales_modell()
        resp = modell.create_chat_completion(
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            max_tokens=max_tokens,
        )
        return resp["choices"][0]["message"]["content"].strip()
    else:
        # Ollama (auch der Fallback, wenn kein Backend eindeutig verfuegbar
        # ist - liefert dann die bestehende Fehlermeldung statt still zu scheitern)
        if not _ollama_ping():
            raise RuntimeError(
                f"Ollama nicht erreichbar unter {OLLAMA_URL}. "
                "Stelle sicher dass 'ollama serve' läuft."
            )
        payload = json.dumps({
            "model": OLLAMA_MODEL,
            "prompt": f"System: {system}\n\nUser: {user}",
            "stream": False,
            "options": {"num_predict": max_tokens}
        }).encode()
        req = urllib.request.Request(
            f"{OLLAMA_URL}/api/generate",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=180) as resp:
            data = json.loads(resp.read())
            return data.get("response", "").strip()


def _parse_json(raw: str) -> dict:
    raw = re.sub(r"^```json\s*", "", raw.strip())
    raw = re.sub(r"\s*```$", "", raw)
    # Manchmal gibt Ollama Praeambeln UND Nachtext aus - JSON-Objekt anhand
    # der Klammertiefe exakt ausschneiden statt json.loads() auf den ganzen
    # (moeglicherweise verunreinigten) Rest anzuwenden.
    start = raw.find("{")
    if start == -1:
        return json.loads(raw, strict=False)
    depth = 0
    in_string = False
    escape = False
    for i, ch in enumerate(raw[start:], start=start):
        if escape:
            escape = False
            continue
        if ch == "\\":
            escape = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                # strict=False: lokale Modelle (z.B. Ollama phi3) escapen
                # Zeilenumbrueche in String-Werten oft nicht korrekt - das
                # waere sonst ein hartes Kontrollzeichen-Decode-Fehler.
                return json.loads(raw[start:i + 1], strict=False)
    return json.loads(raw[start:], strict=False)


# ── Mail-Parser ───────────────────────────────────────────────────────────────
MAIL_SYSTEM = """Du bist Assistent eines Projektingenieurs im Maschinenbau.
Analysiere den Text und antworte NUR mit validem JSON (kein Markdown, kein Präfix):
{
  "zusammenfassung": "1-2 Sätze Kernaussage",
  "personen": ["Name1"],
  "deadlines": [{"text": "Was bis wann", "datum": "YYYY-MM-DD oder null", "dringlichkeit": "hoch|mittel|niedrig"}],
  "tasks": [{"titel": "Konkreter Task (max 80 Zeichen)", "aufwandsklasse": "2m|15m|2h|4h+", "prioritaet": 1}],
  "warten_auf": "Person oder null",
  "tags": ["tag1"],
  "typ": "Mail|Notiz|Call|Loesung|Snippet"
}
Regeln: 2m=<5Min, 15m=5-30Min, 2h=30Min-3h, 4h+=über 3h. prioritaet 1=heute/kritisch."""

def parse_mail(text: str) -> dict:
    raw = _llm_call(MAIL_SYSTEM, f"Analysiere:\n\n{text}", max_tokens=800)
    return _parse_json(raw)


# ── Fokus-Check ───────────────────────────────────────────────────────────────
FOKUS_SYSTEM = """Du bist persönlicher Assistent eines Ingenieurs im Sondermaschinenbau.
Erstelle einen knappen Tagesplan. Antworte NUR mit validem JSON:
{
  "begruessung": "Kurze direkte Begrüßung",
  "fokus_empfehlung": "Welcher Task zuerst und warum (2-3 Sätze)",
  "wichtigste_3": [{"task_id": 0, "grund": "Kurze Begründung"}],
  "eskalations_alarm": "null oder Warnung",
  "quick_win_tipp": "Ein konkreter Quick-Win",
  "tages_fokus": "Prägnantes Motto max 10 Wörter"
}"""

def fokus_check(tasks_fokus, tasks_warten, eskaliert, quick_wins, projekte) -> dict:
    ctx = {
        "datum": datetime.now().strftime("%A, %d.%m.%Y"),
        "fokus_tasks": [{"id": t["id"], "titel": t["titel"], "prioritaet": t["prioritaet"]} for t in tasks_fokus[:5]],
        "warten_auf":  [{"id": t["id"], "titel": t["titel"], "person": t.get("warten_auf_person",""), "eskalation": t.get("eskalationsstufe",0)} for t in tasks_warten[:5]],
        "eskaliert":   [{"titel": t["titel"], "person": t.get("warten_auf_person",""), "stufe": t.get("eskalationsstufe",0)} for t in eskaliert[:3]],
        "quick_wins":  [{"id": t["id"], "titel": t["titel"]} for t in quick_wins[:3]],
        "aktive_projekte": len(projekte)
    }
    raw = _llm_call(FOKUS_SYSTEM, f"Erstelle Fokus-Check:\n{json.dumps(ctx, ensure_ascii=False)}", max_tokens=700)
    return _parse_json(raw)


# ── Context-Switch-Tracker ────────────────────────────────────────────────────
class ContextSwitchTracker:
    def __init__(self, max_switches: int = 3, fenster_minuten: int = 60):
        self.max_switches = max_switches
        self.fenster_minuten = fenster_minuten
        self.events: list = []

    def task_gestartet(self, projekt_id: int, projekt_name: str):
        now = datetime.now()
        self.events.append({"projekt_id": projekt_id, "projekt_name": projekt_name, "ts": now})
        cutoff = now.timestamp() - self.fenster_minuten * 60
        self.events = [e for e in self.events if e["ts"].timestamp() > cutoff]

    def analyse(self) -> dict:
        if len(self.events) < 2:
            return {"anzahl_switches": 0, "eindeutige_projekte": [], "warnung": False, "warnung_text": ""}
        eindeutige = list({e["projekt_id"]: e["projekt_name"] for e in self.events}.values())
        wechsel, letztes = 0, None
        for e in self.events:
            if letztes is not None and e["projekt_id"] != letztes:
                wechsel += 1
            letztes = e["projekt_id"]
        warn = wechsel >= self.max_switches
        text = (f"⚠ Hoher Kontext-Wechsel-Verlust! {wechsel}× Projektwechsel in 60 Min "
                f"({', '.join(eindeutige[:3])}). Fokussiere dich für die nächsten 90 Min auf ein Projekt."
                if warn else "")
        return {"anzahl_switches": wechsel, "eindeutige_projekte": eindeutige, "warnung": warn, "warnung_text": text}

    def reset(self):
        self.events = []


# ── Projekt-Initialisierung (Phase C - Straubel-Vorgehen) ─────────────────────
INIT_SYSTEM = """Du unterstützt die Initialisierung eines Projekts nach dem
Vorgehen: Zielstellung/Erfolgskriterien -> kritische Erfolgsfaktoren -> Lessons
Learned. Antworte NUR mit validem JSON (kein Markdown, kein Präfix):
{
  "ziele": "2-4 konkrete, SMART formulierte Ziele als Fließtext",
  "erfolgskriterien": "3-5 messbare Erfolgskriterien als Liste (durch Zeilenumbruch getrennt)",
  "kritische_erfolgsfaktoren": "3-5 kritische Erfolgsfaktoren als Liste (durch Zeilenumbruch getrennt)"
}
Beziehe dich konkret auf die gegebene Projektbeschreibung, keine Allgemeinplätze."""

def schlage_initialisierung_vor(beschreibung: str) -> dict:
    raw = _llm_call(INIT_SYSTEM, f"Projektbeschreibung:\n\n{beschreibung}", max_tokens=800)
    return _parse_json(raw)


LESSONS_SYSTEM = """Du analysierst abgeschlossene/pausierte Alt-Projekte auf
Lessons Learned für ein neues, ähnliches Projekt. Antworte NUR mit validem JSON:
{
  "zusammenfassung": "2-4 Sätze: was lief bei ähnlichen Alt-Projekten gut/schlecht",
  "empfehlungen": "2-4 konkrete Empfehlungen für das neue Projekt als Liste (durch Zeilenumbruch getrennt)"
}"""

def analysiere_lessons_learned(neue_beschreibung: str, alte_projekte: list) -> dict:
    kontext = [
        {"name": p["name"], "status": p["status"], "ergebnis": p.get("abschluss_ergebnis"),
         "beschreibung": (p.get("beschreibung") or "")[:200]}
        for p in alte_projekte[:10]
    ]
    raw = _llm_call(
        LESSONS_SYSTEM,
        f"Neues Projekt:\n{neue_beschreibung}\n\nAlt-Projekte:\n{json.dumps(kontext, ensure_ascii=False)}",
        max_tokens=600
    )
    return _parse_json(raw)


# ── Dokumenten-Generierung (Phase E) ───────────────────────────────────────────
LASTENHEFT_SYSTEM = """Du erstellst den Entwurf eines Lastenhefts fuer ein
Projekt im Maschinen-/Anlagenbau bzw. IT-Umfeld. Ein Lastenheft beschreibt WAS
und WOFUER aus Sicht des Auftraggebers - nicht WIE es technisch umgesetzt wird.
Nutze ausschliesslich die gegebenen Projektdaten, erfinde keine Fakten.

Antworte AUSSCHLIESSLICH mit dem fertigen Fließtext selbst (kein JSON, kein
Markdown, keine Einleitung wie "Hier ist..."). Ein mehrseitiger Fließtext
laesst sich in einem JSON-String nicht zuverlaessig escapen - deshalb reiner
Text als Ausgabeformat. Gliedere in genau diese Abschnitte:
1. Ausgangssituation
2. Zielsetzung
3. Leistungsumfang
4. Abgrenzung / Nicht-Ziele
5. Rahmenbedingungen
6. Anforderungen (als Liste)
7. Risiken / Randbedingungen"""

def generiere_lastenheft(projekt: dict, init: dict, risiken: list) -> dict:
    kontext = {
        "projekt": projekt.get("name"),
        "beschreibung": projekt.get("beschreibung"),
        "ziele": init.get("ziele"),
        "erfolgskriterien": init.get("erfolgskriterien"),
        "kritische_erfolgsfaktoren": init.get("kritische_erfolgsfaktoren"),
        "scope_abgrenzung": init.get("scope_abgrenzung"),
        "rahmenbedingungen": init.get("rahmenbedingungen"),
        "risiken": [{"beschreibung": r["beschreibung"], "kategorie": r.get("kategorie")} for r in risiken[:10]],
    }
    raw = _llm_call(LASTENHEFT_SYSTEM, json.dumps(kontext, ensure_ascii=False), max_tokens=1600)
    return {"lastenheft": raw.strip()}


PFLICHTENHEFT_SYSTEM = """Du erstellst den Entwurf eines Pflichtenhefts auf
Basis eines bereits vorliegenden Lastenhefts. Ein Pflichtenheft beschreibt WIE
der Auftragnehmer die Anforderungen aus dem Lastenheft technisch/organisatorisch
umsetzt.

Antworte AUSSCHLIESSLICH mit dem fertigen Fließtext selbst (kein JSON, kein
Markdown, keine Einleitung). Gliedere in genau diese Abschnitte:
1. Technisches Umsetzungskonzept
2. Vorgehensmodell und Meilensteine
3. Schnittstellen / Systemgrenzen
4. Qualitaets- und Testkriterien
5. Liefergegenstaende
6. Mitwirkungspflichten Auftraggeber"""

def generiere_pflichtenheft(projekt: dict, init: dict, lastenheft_text: str) -> dict:
    kontext = {
        "projekt": projekt.get("name"),
        "vorgehensmodell": init.get("vorgehensmodell"),
        "lastenheft": lastenheft_text,
    }
    raw = _llm_call(PFLICHTENHEFT_SYSTEM, json.dumps(kontext, ensure_ascii=False), max_tokens=1600)
    return {"pflichtenheft": raw.strip()}


# ── Scope-, Kontext- & Umfeldanalyse (ergaenzt C.6, speist C.5) ───────────────
SCOPE_KONTEXT_SYSTEM = """Du fuehrst fuer ein Projekt eine klassische
Scope-Abgrenzung und Umfeldanalyse durch, ausschliesslich auf Basis der
gegebenen Projektdaten (Beschreibung, Ziele, Erfolgskriterien, Logbuch-
Eintraege, Stakeholder, bereits erfasste User-Stories). Erfinde keine Fakten -
wo Informationen fehlen, formuliere plausible, klar als Annahme markierte
Vorschlaege, die der Nutzer nur noch bestaetigen oder korrigieren muss.

Eine Umfeldanalyse ordnet Einflussfaktoren in zwei Dimensionen ein:
- sachlich (Technik, Normen, IT-Systeme, gesetzliche Vorgaben, Prozesse)
  vs. sozial (Personen, Abteilungen, Gremien, externe Partner)
- intern (im Unternehmen) vs. extern (ausserhalb)

Zusaetzlich schaetzt du die Stacy-Matrix-Dimensionen ein, die die
Vorgehensmodell-Wahl (Wasserfall/V-Modell/Inkrementell/Scrum) bestimmen:
- Anforderungsklarheit: sind Ziel und Leistungsumfang klar oder noch unklar?
- Loesungsklarheit: ist die technische Loesung/Technologie klar oder unklar?

Nested JSON mit verschachtelten Listen ist fuer dich fehleranfaellig - antworte
deshalb AUSSCHLIESSLICH in exakt diesem zeilenbasierten Format (kein JSON,
kein Markdown, keine zusaetzlichen Erklaerungen):

SCOPE_IM: <Fließtext, was klar zum Projektumfang gehoert>
SCOPE_OUT: <Fließtext, was explizit NICHT zum Umfang gehoert>
ANFORDERUNGSKLARHEIT: klar oder unklar
LOESUNGSKLARHEIT: klar oder unklar
BEGRUENDUNG: <hier deine konkrete Begruendung als eigene Saetze einfuegen, warum diese Einschaetzung und was das fuer die Vorgehensmodell-Wahl bedeutet - schreibe die Begruendung selbst, kopiere diesen Beispielsatz nicht>
KONTEXTFAKTOREN:
<eine Zeile pro Faktor, GENAU 6 Felder getrennt durch das Zeichen | in dieser Reihenfolge:>
Bezeichnung|sachlich oder sozial|intern oder extern|Einfluss auf das Projekt|Einfluss des Projekts darauf|Wichtigkeit 1-3

Beispielzeile:
IT-Sicherheitsrichtlinie|sachlich|intern|Definiert Mindeststandards fuer Datenverarbeitung|Projekt muss Richtlinie einhalten|3

Liefere 4 bis 8 Zeilen unter KONTEXTFAKTOREN, moeglichst gemischt aus allen
vier Kombinationen sachlich/sozial x intern/extern. Verwende das Zeichen |
nirgendwo sonst im Text."""

def _parse_scope_kontext_text(raw: str) -> dict:
    """Zeilenbasierter Parser statt JSON - robust gegen die haeufigen
    Kaputt-JSON-Ausgaben kleiner lokaler Modelle bei verschachtelten Listen
    (siehe SCOPE_KONTEXT_SYSTEM)."""
    result = {
        "scope_im": "", "scope_out": "",
        "anforderungsklarheit_vorschlag": "klar", "loesungsklarheit_vorschlag": "klar",
        "vorgehensmodell_begruendung": "", "kontextfaktoren": [],
    }
    in_kontextfaktoren = False
    for line in raw.strip().splitlines():
        stripped = line.strip().lstrip("-*").strip()
        if not stripped:
            continue
        upper = stripped.upper()
        if upper.startswith("SCOPE_IM:"):
            result["scope_im"] = stripped.split(":", 1)[1].strip()
            in_kontextfaktoren = False
        elif upper.startswith("SCOPE_OUT:"):
            result["scope_out"] = stripped.split(":", 1)[1].strip()
            in_kontextfaktoren = False
        elif upper.startswith("ANFORDERUNGSKLARHEIT:"):
            result["anforderungsklarheit_vorschlag"] = (
                "unklar" if "unklar" in stripped.split(":", 1)[1].lower() else "klar")
            in_kontextfaktoren = False
        elif upper.startswith("LOESUNGSKLARHEIT:"):
            result["loesungsklarheit_vorschlag"] = (
                "unklar" if "unklar" in stripped.split(":", 1)[1].lower() else "klar")
            in_kontextfaktoren = False
        elif upper.startswith("BEGRUENDUNG:"):
            result["vorgehensmodell_begruendung"] = stripped.split(":", 1)[1].strip()
            in_kontextfaktoren = False
        elif upper.startswith("KONTEXTFAKTOREN"):
            in_kontextfaktoren = True
        elif in_kontextfaktoren and "|" in stripped:
            parts = [p.strip() for p in stripped.split("|")]
            if len(parts) >= 6:
                bez, typ, herkunft, auf, von, wichtig = parts[:6]
                digits = "".join(ch for ch in wichtig if ch.isdigit())
                wichtig_n = min(3, max(1, int(digits))) if digits else 2
                result["kontextfaktoren"].append({
                    "bezeichnung": bez,
                    "typ": "sozial" if "sozial" in typ.lower() else "sachlich",
                    "herkunft": "extern" if "extern" in herkunft.lower() else "intern",
                    "einfluss_auf_projekt": auf,
                    "einfluss_von_projekt": von,
                    "wichtigkeit": wichtig_n,
                })
    return result


def analysiere_scope_kontext_umfeld(projekt: dict, init: dict, interaktionen: list,
                                    stakeholder: list, user_stories: list) -> dict:
    kontext = {
        "projekt": projekt.get("name"),
        "beschreibung": projekt.get("beschreibung"),
        "ziele": init.get("ziele"),
        "erfolgskriterien": init.get("erfolgskriterien"),
        "kritische_erfolgsfaktoren": init.get("kritische_erfolgsfaktoren"),
        "logbuch": [
            {"typ": i.get("typ"), "inhalt": (i.get("inhalt") or "")[:200]}
            for i in interaktionen[:15]
        ],
        "stakeholder": [
            {"name": s.get("name"), "rolle": s.get("rolle")} for s in stakeholder[:15]
        ],
        "user_stories": [
            {"rolle": s.get("rolle"), "ziel": s.get("ziel")} for s in user_stories[:15]
        ],
    }
    raw = _llm_call(SCOPE_KONTEXT_SYSTEM, json.dumps(kontext, ensure_ascii=False), max_tokens=1800)
    return _parse_scope_kontext_text(raw)


# ── User-Story-Interview-Chatbot (Phase E) ────────────────────────────────────
USER_STORY_CHAT_SYSTEM = """Du bist ein erfahrener Requirements Engineer und
fuehrst ein strukturiertes Interview mit einem Mitarbeiter, um die
Leistungsbeschreibung eines Projekts vollstaendig als User-Stories zu erfassen.

Verhalte dich wie in einem echten Interview: stelle IMMER nur eine konkrete
Rueckfrage nach der anderen, wenn Rolle, Ziel, Nutzen oder Akzeptanzkriterien
fehlen oder unklar sind. Denke aktiv an Dinge, die Nutzer typischerweise
vergessen: Fehler-/Ausnahmefaelle, Randbedingungen, Berechtigungen/Rollen,
Nicht-Ziele, Mengen-/Performance-Anforderungen.

WICHTIG - Abschlussregel: Sobald im bisherigen Gespraechsverlauf (a) eine
erkennbare Rolle, (b) ein erkennbares Ziel, (c) ein erkennbarer Nutzen UND
(d) mindestens ein konkretes, pruefbares Akzeptanzkriterium genannt wurden,
MUSST du "story_bereit": true setzen - auch wenn theoretisch noch weitere
Randfaelle denkbar waeren. Frage hoechstens EINMAL zu einem fehlenden der
vier Punkte nach, nie mehrfach zum selben Punkt. Wenn der Nutzer explizit
sagt, die Story sei fertig/vollstaendig/abschliessen, akzeptiere das sofort
und setze "story_bereit": true mit den bisher genannten Informationen.

Nested JSON ist fuer dich fehleranfaellig (du wiederholst sonst bereits
beantwortete Rueckfragen) - antworte AUSSCHLIESSLICH in diesem
zeilenbasierten Format (kein JSON, kein Markdown, keine Erklaerungen):

ANTWORT: <deine naechste Interview-Frage oder Rueckmeldung auf Deutsch>
STORY_BEREIT: ja oder nein
ROLLE: <Rolle, nur ausfuellen wenn STORY_BEREIT=ja, sonst LEER>
ZIEL: <Ziel, nur ausfuellen wenn STORY_BEREIT=ja, sonst LEER>
NUTZEN: <Nutzen, nur ausfuellen wenn STORY_BEREIT=ja, sonst LEER>
AKZEPTANZKRITERIEN: <Kriterium 1>|<Kriterium 2>|<Kriterium 3>
PRIORITAET: Must oder Should oder Could oder Wont"""


def _parse_user_story_text(raw: str) -> dict:
    felder = {}
    for line in raw.strip().splitlines():
        stripped = line.strip().lstrip("-*").strip()
        if ":" not in stripped:
            continue
        key, _, wert = stripped.partition(":")
        felder[key.strip().upper()] = wert.strip()

    story_bereit = felder.get("STORY_BEREIT", "nein").lower().startswith("ja")
    story = None
    if story_bereit:
        ak = felder.get("AKZEPTANZKRITERIEN", "")
        ak_text = "\n".join(k.strip() for k in ak.split("|") if k.strip())
        story = {
            "rolle": felder.get("ROLLE", ""),
            "ziel": felder.get("ZIEL", ""),
            "nutzen": felder.get("NUTZEN", ""),
            "akzeptanzkriterien": ak_text,
            "prioritaet": felder.get("PRIORITAET", "Should"),
        }
    return {"antwort": felder.get("ANTWORT", ""), "story_bereit": story_bereit, "story": story}


def user_story_interview(verlauf: list, projekt_kontext: str) -> dict:
    """verlauf: Liste von {'rolle': 'user'|'assistent', 'text': str} in
    chronologischer Reihenfolge - kompletter Chat-Verlauf als Kontext, damit
    das Interview konsistent nachfragt statt Fragen zu wiederholen."""
    ctx = {"projekt": projekt_kontext, "verlauf": verlauf}
    raw = _llm_call(USER_STORY_CHAT_SYSTEM, json.dumps(ctx, ensure_ascii=False), max_tokens=900)
    return _parse_user_story_text(raw)


# ── Vorgehensmodell-Engine (Phase F) ──────────────────────────────────────────
VORGEHENSSTRUKTUR_SYSTEM = """Du leitest aus den Projektdaten eine konkrete
Meilenstein-/Sprint- und Arbeitspaket-Struktur ab. Das Vorgehensmodell steht
im Feld "vorgehensmodell" der Eingabe bereits FEST - das ist eine bereits
getroffene Entscheidung, keine offene Frage. Du generierst NUR die zu genau
diesem einen Modell passende Struktur, niemals ein anderes Modell. Nutze wo
vorhanden die User-Stories als Grundlage fuer die Arbeitspakete/Tasks -
erfinde nur, wo nichts vorliegt.

WICHTIG zu PARENT-TITEL: Fast alle Meilensteine sind gleichrangige
TOP-LEVEL-Elemente mit PARENT-TITEL = LEER. Verkette NIEMALS Phasen oder
Sprints nacheinander als Eltern-Kind-Kette (Phase 2 ist NICHT das Kind von
Phase 1!). PARENT-TITEL wird ausschliesslich beim Vorgehensmodell "Hybrid"
verwendet, und zwar NUR fuer Sprints, die unter der einen Umsetzungsphase
haengen - alle anderen Meilensteine (auch bei Hybrid) bleiben PARENT-TITEL=LEER.

Wenn "vorgehensmodell" == "Wasserfall" oder "V-Modell":
  Erzeuge NUR top-level PHASE-Meilensteine in klassischer Reihenfolge
  (z.B. Anforderungsanalyse, Entwurf, Umsetzung, Test, Abnahme), alle mit
  PARENT-TITEL = LEER. Markiere den Uebergang zwischen kritischen Phasen als
  Quality Gate (ist_gate=ja).
Wenn "vorgehensmodell" == "Scrum" oder "Inkrementell":
  Erzeuge NUR top-level SPRINT-Meilensteine (2 Wochen je Sprint, Anzahl aus
  der Projektdauer ableiten, mindestens 2), alle mit PARENT-TITEL = LEER,
  jeweils mit einem kurzen Sprintziel als Beschreibung. Erzeuge KEINE
  Phasen wie Anforderungsanalyse/Entwurf/Test - nur Sprints. Verteile die
  Arbeitspakete auf die Sprints.
Wenn "vorgehensmodell" == "Hybrid":
  Erzeuge PHASE-Meilensteine (PARENT-TITEL = LEER), aber zusaetzlich 2-3
  SPRINT-Meilensteine mit PARENT-TITEL = Titel der Umsetzungsphase.

Nested JSON ist fuer dich fehleranfaellig - antworte AUSSCHLIESSLICH in
diesem zeilenbasierten Format (kein JSON, kein Markdown, keine Erklaerungen):

MEILENSTEIN: <Titel>|<Typ: phase oder sprint>|<Parent-Titel oder LEER>|<Start-Woche als Zahl ab 1>|<Dauer in Wochen als Zahl>|<ist_gate: ja oder nein>|<Kurzbeschreibung oder Sprintziel>
TASK: <Titel>|<Meilenstein-Titel EXAKT wie in der zugehoerigen MEILENSTEIN-Zeile, ohne Projektname davor>|<Aufwandsklasse: 2m, 15m, 2h oder 4h+>

WICHTIG zu TASK-Titeln: Der Task-Titel ist ein KONKRETES, kleines Arbeitspaket
und darf NIEMALS mit dem Meilenstein-Titel identisch oder fast identisch sein.

FALSCH: MEILENSTEIN: Anforderungsanalyse|...
        TASK: Anforderungsanalyse|Anforderungsanalyse|2m   <- verboten, das ist nur der Meilenstein-Name

RICHTIG: MEILENSTEIN: Anforderungsanalyse|...
         TASK: Interviews mit Fachabteilung fuehren|Anforderungsanalyse|2h
         TASK: Lastenheft-Entwurf mit Stakeholdern abstimmen|Anforderungsanalyse|4h+

Liefere zuerst alle MEILENSTEIN-Zeilen, danach alle TASK-Zeilen. Erzeuge
3 bis 6 Meilensteine/Sprints und mindestens 2 konkrete Tasks PRO Meilenstein.
Verwende das Zeichen | nirgendwo sonst im Text."""

def _parse_vorgehensstruktur_text(raw: str) -> dict:
    """Zeilenbasierter Parser statt JSON - siehe Lessons Learned aus der
    Scope-/Kontextanalyse: verschachtelte JSON-Listen sind bei lokalen
    Modellen die haeufigste Fehlerquelle."""
    meilensteine, tasks = [], []
    for line in raw.strip().splitlines():
        stripped = line.strip().lstrip("-*").strip()
        if stripped.upper().startswith("MEILENSTEIN:"):
            parts = [p.strip() for p in stripped.split(":", 1)[1].split("|")]
            if len(parts) >= 7:
                titel, typ, parent, start_w, dauer_w, ist_gate, beschr = parts[:7]
                digits_start = "".join(ch for ch in start_w if ch.isdigit())
                digits_dauer = "".join(ch for ch in dauer_w if ch.isdigit())
                meilensteine.append({
                    "titel": titel,
                    "typ": "sprint" if "sprint" in typ.lower() else "phase",
                    "parent_titel": parent or None,
                    "start_woche": int(digits_start) if digits_start else 1,
                    "dauer_wochen": int(digits_dauer) if digits_dauer else 2,
                    "ist_gate": "ja" in ist_gate.lower(),
                    "beschreibung": beschr,
                })
        elif stripped.upper().startswith("TASK:"):
            parts = [p.strip() for p in stripped.split(":", 1)[1].split("|")]
            if len(parts) >= 3:
                titel, meilenstein_titel, aufwand = parts[:3]
                aufwand_norm = aufwand if aufwand in ("2m", "15m", "2h", "4h+") else "15m"
                tasks.append({
                    "titel": titel,
                    "meilenstein_titel": meilenstein_titel,
                    "aufwandsklasse": aufwand_norm,
                })
    return {"meilensteine": meilensteine, "tasks": tasks}


def generiere_vorgehensstruktur(projekt: dict, init: dict, user_stories: list) -> dict:
    vorgehensmodell = init.get("vorgehensmodell") or "Wasserfall"
    kontext = {
        "projekt": projekt.get("name"),
        "vorgehensmodell": vorgehensmodell,
        "ziele": init.get("ziele"),
        "scope_im": init.get("scope_im"),
        "dauer_wochen": float(init["dauer_wochen"]) if init.get("dauer_wochen") is not None else None,
        "start_datum": str(projekt.get("start_datum") or ""),
        "user_stories": [
            {"rolle": s.get("rolle"), "ziel": s.get("ziel"), "prioritaet": s.get("prioritaet")}
            for s in user_stories[:20]
        ],
    }
    raw = _llm_call(VORGEHENSSTRUKTUR_SYSTEM, json.dumps(kontext, ensure_ascii=False), max_tokens=2000)
    result = _parse_vorgehensstruktur_text(raw)

    # Modelle halten sich nicht immer an die Typ-Vorgabe (z.B. eine
    # uebrige Phase trotz Scrum) - nicht vertrauen, hart filtern.
    if vorgehensmodell in ("Scrum", "Inkrementell"):
        result["meilensteine"] = [m for m in result["meilensteine"] if m["typ"] == "sprint"]
    elif vorgehensmodell in ("Wasserfall", "V-Modell"):
        result["meilensteine"] = [m for m in result["meilensteine"] if m["typ"] == "phase"]
    # Hybrid: beide Typen zulaessig.

    gueltige_titel = {m["titel"] for m in result["meilensteine"]}
    result["tasks"] = [
        t for t in result["tasks"]
        if t["titel"].strip().lower() != t["meilenstein_titel"].strip().lower()
    ]
    # Tasks ohne (mehr) passenden Meilenstein landen im Product Backlog statt
    # verworfen zu werden - meilenstein_titel bleibt dafuer ggf. unaufgeloest,
    # das uebernimmt die aufrufende UI beim Einfuegen.
    for t in result["tasks"]:
        if t["meilenstein_titel"] not in gueltige_titel:
            t["meilenstein_titel"] = None
    return result


# ── Daily-Log (Phase G) ────────────────────────────────────────────────────────
TAGESRUECKBLICK_SYSTEM = """Du ordnest den taeglichen Freitext-Rueckblick eines
Mitarbeiters automatisch bestehenden Projekten zu, damit der Nutzer nicht
manuell zuordnen muss. Nutze AUSSCHLIESSLICH Projektnamen aus der gegebenen
Liste - erfinde keine neuen Projekte.

Antworte AUSSCHLIESSLICH in diesem zeilenbasierten Format (kein JSON, kein
Markdown, keine Erklaerungen):

PROJEKT: <Projektname EXAKT aus der Liste>|<Kernaussage: was wurde fuer dieses Projekt gemacht>|<Fortschritt: gut, neutral oder verzoegert>
TASK: <Konkreter neuer Folge-Task-Titel>|<Projektname EXAKT aus der Liste>|<Aufwandsklasse: 2m, 15m, 2h oder 4h+>
NAECHSTE_SCHRITTE: <1-2 Saetze, was als naechstes am wichtigsten ist>

Erzeuge TASK-Zeilen nur fuer wirklich neue, konkrete Folgeaufgaben - nicht fuer
bereits erledigte Taetigkeiten. Wenn eine Aussage keinem Projekt aus der Liste
zuzuordnen ist, ignoriere sie."""

def _parse_tagesrueckblick_text(raw: str) -> dict:
    eintraege, tasks, naechste_schritte = [], [], ""
    for line in raw.strip().splitlines():
        stripped = line.strip().lstrip("-*").strip()
        upper = stripped.upper()
        if upper.startswith("PROJEKT:"):
            parts = [p.strip() for p in stripped.split(":", 1)[1].split("|")]
            if len(parts) >= 3:
                projekt, kernaussage, fortschritt = parts[:3]
                eintraege.append({
                    "projekt_name": projekt, "kernaussage": kernaussage,
                    "fortschritt": fortschritt if fortschritt.lower() in ("gut", "neutral", "verzoegert") else "neutral",
                })
        elif upper.startswith("TASK:"):
            parts = [p.strip() for p in stripped.split(":", 1)[1].split("|")]
            if len(parts) >= 3:
                titel, projekt, aufwand = parts[:3]
                tasks.append({
                    "titel": titel, "projekt_name": projekt,
                    "aufwandsklasse": aufwand if aufwand in ("2m", "15m", "2h", "4h+") else "15m",
                })
        elif upper.startswith("NAECHSTE_SCHRITTE:"):
            naechste_schritte = stripped.split(":", 1)[1].strip()
    return {"eintraege": eintraege, "neue_tasks": tasks, "naechste_schritte": naechste_schritte}


def analysiere_tagesrueckblick(text: str, aktive_projekte: list) -> dict:
    kontext = {"text": text, "projekte": [p["name"] for p in aktive_projekte]}
    raw = _llm_call(TAGESRUECKBLICK_SYSTEM, json.dumps(kontext, ensure_ascii=False), max_tokens=900)
    return _parse_tagesrueckblick_text(raw)


# ── KI-Projekt-Statuszusammenfassung (Phase G) ─────────────────────────────────
STATUSBERICHT_SYSTEM = """Du erstellst eine kurze, laufend aktualisierbare
Status-Zusammenfassung fuer ein Projekt - sie ersetzt einen manuell
geschriebenen Statusbericht. Nutze ausschliesslich die gegebenen Daten
(Task-Zahlen, Meilenstein-Fortschritt, juengste Logbuch-Eintraege wie Mails,
Notizen, Tagesrueckblicke, eingefuegte Meeting-Zusammenfassungen).

Antworte AUSSCHLIESSLICH mit dem fertigen Text (kein JSON, kein Markdown,
keine Einleitung), gegliedert in genau diese Abschnitte:
1. Gesamtstatus (Ampel Gruen/Gelb/Rot + 1 Satz Begruendung)
2. Was ist seit dem letzten Update passiert
3. Aktueller Fokus
4. Risiken / Blocker
5. Naechste Schritte"""

def generiere_statusbericht(projekt: dict, task_stats: dict, meilenstein_fortschritt: list,
                            interaktionen: list) -> dict:
    kontext = {
        "projekt": projekt.get("name"),
        "task_stats": task_stats,
        "meilenstein_fortschritt": meilenstein_fortschritt,
        "juengste_eintraege": [
            {"typ": i.get("typ"), "inhalt": (i.get("inhalt") or "")[:250]}
            for i in interaktionen[:12]
        ],
    }
    raw = _llm_call(STATUSBERICHT_SYSTEM, json.dumps(kontext, ensure_ascii=False), max_tokens=1200)
    return {"statusbericht": raw.strip()}


# ── Terminplanung (Phase H) ────────────────────────────────────────────────────
TERMIN_SYSTEM = """Du bereitest einen Projekttermin vor. Auf Basis der
RACI/AKV-Zuordnung entscheidest du, wer physisch VOR_ORT dabei sein muss und
wer nur ONLINE/informiert teilnehmen muss: R (Responsible) und A
(Accountable) sollten in der Regel vor Ort sein, C (Consulted) ist meist
online ausreichend, I (Informed) muss oft gar nicht live teilnehmen, sondern
nur informiert werden - erwaehne solche Personen trotzdem als ONLINE mit
Hinweis "nur zur Information".

Antworte AUSSCHLIESSLICH in exakt diesem Format (kein JSON, kein Markdown):

TERMINVORSCHLAG: <konkreter, plausibler Vorschlag wann/in welchem Zeitrahmen>
TEILNEHMER: <Name>|<vor_ort oder online>|<kurze Begruendung anhand der RACI-Rolle>
(eine TEILNEHMER-Zeile pro Person)
---EINLADUNG_VOR_ORT---
<Einladungstext fuer die Vor-Ort-Teilnehmer, inkl. Anlass, Betreff-Zeile>
---EINLADUNG_ONLINE---
<Einladungstext fuer die Online-/Informed-Teilnehmer>"""

def _parse_termin_text(raw: str) -> dict:
    kopf, *rest = re.split(r"---EINLADUNG_VOR_ORT---", raw, maxsplit=1)
    einladung_vor_ort, einladung_online = "", ""
    if rest:
        teile = re.split(r"---EINLADUNG_ONLINE---", rest[0], maxsplit=1)
        einladung_vor_ort = teile[0].strip()
        if len(teile) > 1:
            einladung_online = teile[1].strip()

    terminvorschlag, teilnehmer = "", []
    for line in kopf.strip().splitlines():
        stripped = line.strip().lstrip("-*").strip()
        upper = stripped.upper()
        if upper.startswith("TERMINVORSCHLAG:"):
            terminvorschlag = stripped.split(":", 1)[1].strip()
        elif upper.startswith("TEILNEHMER:"):
            parts = [p.strip() for p in stripped.split(":", 1)[1].split("|")]
            if len(parts) >= 3:
                name, modus, begruendung = parts[:3]
                teilnehmer.append({
                    "name": name,
                    "modus": "vor_ort" if "vor_ort" in modus.lower().replace(" ", "_") else "online",
                    "begruendung": begruendung,
                })
    return {
        "terminvorschlag": terminvorschlag,
        "teilnehmer": teilnehmer,
        "einladung_vor_ort": einladung_vor_ort,
        "einladung_online": einladung_online,
    }


def generiere_terminvorschlag(projekt_name: str, anlass: str, raci_eintraege: list) -> dict:
    kontext = {
        "projekt": projekt_name,
        "anlass": anlass,
        "raci": [
            {"person": r["user_name"], "rolle": r["rolle"], "arbeitspaket": r["arbeitspaket"]}
            for r in raci_eintraege
        ],
    }
    raw = _llm_call(TERMIN_SYSTEM, json.dumps(kontext, ensure_ascii=False), max_tokens=1200)
    return _parse_termin_text(raw)


# ── Mitarbeiterprofile (Phase I) ───────────────────────────────────────────────
KOMPETENZ_SYSTEM = """Du leitest aus den tatsaechlich bearbeiteten Aufgaben einer
Person deren fachliche Schwerpunkte/Kompetenzen ab - diese werden NICHT manuell
gepflegt, sondern aus Aufgaben-Titeln, Tags und Projekten erschlossen. Sei
konkret und knapp, keine Allgemeinplaetze wie "Teamplayer" oder "motiviert".
Wenn die Datenbasis zu duenn oder zu unspezifisch ist, sag das ehrlich statt
zu spekulieren.

Antworte AUSSCHLIESSLICH auf Deutsch und AUSSCHLIESSLICH mit einer kurzen
Stichpunktliste (3-6 Punkte, Bindestrich-Liste), kein JSON, kein
Markdown-Header, keine Einleitung, keine andere Sprache."""


def analysiere_mitarbeiterkompetenzen(user_name: str, tasks: list) -> dict:
    kontext = {
        "person": user_name,
        "bearbeitete_aufgaben": [
            {"titel": t.get("titel"), "tags": t.get("tags"),
             "projekt": t.get("projekt_name"), "status": t.get("status")}
            for t in tasks
        ],
    }
    raw = _llm_call(KOMPETENZ_SYSTEM, json.dumps(kontext, ensure_ascii=False), max_tokens=500)
    return {"kompetenzen_ki": raw.strip()}


# ── Risikoregister (Phase K Backlog) ──────────────────────────────────────────
RISIKO_SYSTEM = """Du schlaegst typische Projektrisiken vor, basierend auf
Projektname und -beschreibung. Denke an technische, terminliche, personelle
und kaufmaennische Risikoarten. Schaetze Eintrittswahrscheinlichkeit (EW) und
Tragweite (TW) jeweils auf einer Skala 1 (gering) bis 3 (hoch) ein.

Antworte AUSSCHLIESSLICH auf Deutsch und AUSSCHLIESSLICH in exakt diesem
Format (kein JSON, kein Markdown), 3-6 Zeilen:

RISIKO: <Beschreibung>|<Kategorie>|<EW 1-3>|<TW 1-3>
(eine RISIKO-Zeile pro vorgeschlagenem Risiko)"""


def _parse_risiken_text(raw: str) -> list:
    vorschlaege = []
    for line in raw.strip().splitlines():
        stripped = line.strip().lstrip("-*").strip()
        if not stripped.upper().startswith("RISIKO:"):
            continue
        parts = [p.strip() for p in stripped.split(":", 1)[1].split("|")]
        if len(parts) < 4:
            continue
        beschreibung, kategorie, ew, tw = parts[:4]
        try:
            ew_i, tw_i = int(ew), int(tw)
        except ValueError:
            continue
        vorschlaege.append({
            "beschreibung": beschreibung,
            "kategorie": kategorie or None,
            "eintrittswahrscheinlichkeit": max(1, min(3, ew_i)),
            "tragweite": max(1, min(3, tw_i)),
        })
    return vorschlaege


def schlage_risiken_vor(projekt_name: str, beschreibung: str) -> list:
    kontext = {"projekt": projekt_name, "beschreibung": beschreibung or ""}
    raw = _llm_call(RISIKO_SYSTEM, json.dumps(kontext, ensure_ascii=False), max_tokens=600)
    return _parse_risiken_text(raw)


# ── Dokument-Vorlagen-Export (Backlog: Word/PowerPoint-Vorlage hochladen,
# Gliederung erkennen, beim Projekt-Export mit Projektdaten befuellen) ────────
KAPITEL_SYSTEM = """Du befuellst eine vorgegebene Kapitelstruktur (Gliederung
einer hochgeladenen Word-/PowerPoint-Vorlage) mit Inhalt aus den mitgelieferten
Projektdaten. Nutze AUSSCHLIESSLICH die mitgelieferten Projektdaten - erfinde
niemals Fakten, Namen, Orte oder Ereignisse, die nicht im Kontext stehen. Wenn
zu einem Kapitel keine passenden Daten vorhanden sind, schreibe ehrlich "Keine
Daten zu diesem Kapitel vorhanden" statt zu erfinden.

Antworte AUSSCHLIESSLICH auf Deutsch und AUSSCHLIESSLICH in exakt diesem
Format (kein JSON, kein Markdown):

---KAPITEL: <Kapitelname exakt wortgleich aus der Gliederung kopiert, inkl. Nummerierung>---
<Freitext-Inhalt fuer dieses Kapitel, mehrere Absaetze durch Leerzeile getrennt>
(ein ---KAPITEL:---Block pro Gliederungspunkt, in der vorgegebenen Reihenfolge)"""


def _normalisiere_kapitelname(name: str) -> str:
    return re.sub(r"^[\d.\-–)\s]+", "", name).strip().lower()


def _parse_kapitel_text(raw: str, gliederung: list) -> dict:
    teile = re.split(r"---KAPITEL:\s*(.+?)---", raw)
    kapitel_roh = {}
    for i in range(1, len(teile), 2):
        name = teile[i].strip()
        inhalt = teile[i + 1].strip() if i + 1 < len(teile) else ""
        kapitel_roh[_normalisiere_kapitelname(name)] = inhalt
    return {titel: kapitel_roh.get(_normalisiere_kapitelname(titel), "") for titel in gliederung}


def fuelle_vorlage_kapitel(gliederung: list, projekt_kontext: dict) -> dict:
    kontext = {"gliederung": gliederung, "projekt": projekt_kontext}
    raw = _llm_call(KAPITEL_SYSTEM, json.dumps(kontext, ensure_ascii=False), max_tokens=3000)
    return _parse_kapitel_text(raw, gliederung)
