@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║    Engineering Cockpit – Installation        ║
echo  ╚══════════════════════════════════════════════╝
echo.

echo  [1/4] Kernpakete installieren...
pip3 install streamlit "psycopg[binary,pool]" python-dotenv argon2-cffi extra-streamlit-components openpyxl watchdog anthropic plyer
if %ERRORLEVEL% NEQ 0 (
    echo  [FEHLER] pip install fehlgeschlagen. Python und pip pruefen.
    pause & exit /b 1
)

echo.
echo  [!!!] WICHTIG: PostgreSQL wird jetzt benoetigt ^(kein SQLite/MSSQL mehr^).
echo  Lokal per Docker: "docker compose up -d" im Projektordner ausfuehren,
echo  bevor die App gestartet wird.

echo.
echo  [2/4] pywin32 fuer Outlook-Sync installieren...
pip3 install pywin32 --only-binary=pywin32
REM Kein Fehler-Abbruch — pywin32 ist optional

echo.
echo  [2b] Lokales KI-Modell: llama-cpp-python (fertig gebaut, nur CPU, kein Compiler noetig)...
pip3 install llama-cpp-python --prefer-binary --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cpu
if %ERRORLEVEL% NEQ 0 (
    echo  [HINWEIS] llama-cpp-python nicht installiert. KI-Funktionen bleiben aus, alles andere laeuft.
)

echo.
echo  [3/4] .env Konfigurationsdatei anlegen...
if not exist ".env" (
    copy .env.example .env >nul
    echo  [OK] .env erstellt.
    echo  [!!!] WICHTIG: .env jetzt anpassen ^(Notepad .env^)
) else (
    echo  [OK] .env bereits vorhanden.
)

echo.
echo  [4/4] Streamlit-Test...
streamlit --version
if %ERRORLEVEL% NEQ 0 (
    echo  [FEHLER] streamlit nicht gefunden. Sicherstellen dass pip install erfolgreich war.
    pause & exit /b 1
)

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║  Installation erfolgreich!                   ║
echo  ║                                              ║
echo  ║  Naechste Schritte:                          ║
echo  ║  1. .env oeffnen und anpassen                ║
echo  ║     ^(Notepad .env^)                          ║
echo  ║  2. START.bat doppelklicken                  ║
echo  ╚══════════════════════════════════════════════╝
echo.
pause
