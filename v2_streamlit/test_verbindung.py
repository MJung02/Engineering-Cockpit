"""
Engineering Cockpit – MS SQL Verbindungstest
Führe aus mit: python test_verbindung.py
Zeigt genau was funktioniert und was nicht.
"""
import sys
import os

# .env laden
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✓ .env geladen")
except ImportError:
    print("⚠ python-dotenv nicht installiert – pip install python-dotenv")

print()
print("=" * 55)
print("  Engineering Cockpit – Verbindungstest")
print("=" * 55)

# ── 1. pyodbc prüfen ──────────────────────────────────────
print()
print("[1] pyodbc prüfen...")
try:
    import pyodbc
    print(f"  ✓ pyodbc installiert: {pyodbc.version}")
except ImportError:
    print("  ✗ pyodbc fehlt – pip install pyodbc")
    sys.exit(1)

# ── 2. ODBC Treiber prüfen ────────────────────────────────
print()
print("[2] Verfügbare ODBC Treiber:")
treiber = pyodbc.drivers()
sql_treiber = [t for t in treiber if "SQL Server" in t]
if sql_treiber:
    for t in sql_treiber:
        print(f"  ✓ {t}")
    bester_treiber = sql_treiber[-1]  # Neuester
else:
    print("  ✗ Kein SQL Server ODBC Treiber gefunden!")
    print("    → https://learn.microsoft.com/de-de/sql/connect/odbc/download-odbc-driver-for-sql-server")
    sys.exit(1)

# ── 3. Konfiguration lesen ────────────────────────────────
print()
print("[3] Konfiguration:")
server   = os.getenv("EC_SQL_SERVER",   r"N200282\SQL_Test")
database = os.getenv("EC_SQL_DATABASE", "EngineeringCockpit")
driver   = os.getenv("EC_SQL_DRIVER",   bester_treiber)
trusted  = os.getenv("EC_SQL_TRUSTED",  "yes")
trust_cert = os.getenv("EC_SQL_TRUST_CERT", "yes")
use_sqlite = os.getenv("EC_USE_SQLITE", "false").lower() == "true"

print(f"  Server:   {server}")
print(f"  Database: {database}")
print(f"  Driver:   {driver}")
print(f"  Auth:     {'Windows (Trusted)' if trusted == 'yes' else 'SQL-Auth'}")
print(f"  TrustCert:{trust_cert}")
print(f"  SQLite:   {'JA (Fallback aktiv – MS SQL wird NICHT genutzt!)' if use_sqlite else 'Nein (MS SQL wird genutzt)'}")

if use_sqlite:
    print()
    print("  ⚠ EC_USE_SQLITE=true in .env → MS SQL wird ignoriert!")
    print("    Setze EC_USE_SQLITE=false um MS SQL zu nutzen.")

# ── 4. Verbindung testen ──────────────────────────────────
print()
print("[4] Verbindung testen...")
conn_str = (
    f"DRIVER={{{driver}}};"
    f"SERVER={server};"
    f"DATABASE={database};"
    f"Trusted_Connection={trusted};"
    f"TrustServerCertificate={trust_cert};"
    f"Connection Timeout=10;"
)
print(f"  Verbindungsstring: {conn_str}")
print()

try:
    conn = pyodbc.connect(conn_str, timeout=10)
    cursor = conn.cursor()

    # SQL Server Version
    cursor.execute("SELECT @@VERSION")
    version = cursor.fetchone()[0].split("\n")[0]
    print(f"  ✓ Verbindung erfolgreich!")
    print(f"  ✓ Server: {version}")

    # Datenbank prüfen
    cursor.execute("SELECT DB_NAME()")
    db_name = cursor.fetchone()[0]
    print(f"  ✓ Datenbank: {db_name}")

    # Tabellen prüfen
    cursor.execute("""
        SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME
    """)
    tabellen = [r[0] for r in cursor.fetchall()]
    if tabellen:
        print(f"  ✓ Vorhandene Tabellen ({len(tabellen)}): {', '.join(tabellen)}")
    else:
        print(f"  ○ Keine Tabellen – werden beim App-Start automatisch angelegt")

    conn.close()

    print()
    print("=" * 55)
    print("  ✅ ALLES OK – App kann gestartet werden!")
    print("     streamlit run app.py")
    print("=" * 55)

except pyodbc.Error as e:
    print(f"  ✗ Verbindung fehlgeschlagen!")
    print(f"  Fehler: {e}")
    print()
    print("  Mögliche Ursachen & Lösungen:")
    err = str(e).lower()
    if "login timeout" in err or "network" in err or "not found" in err:
        print(f"  → Server '{server}' nicht erreichbar")
        print(f"    · Servername korrekt? (Groß/Kleinschreibung egal)")
        print(f"    · SQL Server Browser Service läuft?")
        print(f"      Dienste → 'SQL Server Browser' → Starten")
        print(f"    · Firewall: TCP Port 1433 freigegeben?")
        print(f"    · In SSMS verbindbar? → Gleiche Verbindungsdaten testen")
    elif "login failed" in err:
        print(f"  → Windows-Authentifizierung fehlgeschlagen")
        print(f"    · Als dieser Windows-User berechtigt?")
        print(f"    · In SSMS mit Windows-Auth verbindbar?")
    elif "cannot open database" in err:
        print(f"  → Datenbank '{database}' nicht gefunden")
        print(f"    · Datenbank in SSMS anlegen:")
        print(f"      Rechtsklick auf 'Datenbanken' → Neue Datenbank → '{database}'")
    else:
        print(f"  → Unbekannter Fehler – vollständige Meldung oben prüfen")
    print()
    print("  → Fallback: EC_USE_SQLITE=true in .env → App startet mit lokaler SQLite-DB")

except Exception as e:
    print(f"  ✗ Unerwarteter Fehler: {type(e).__name__}: {e}")
