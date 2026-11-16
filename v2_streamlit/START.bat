@echo off
setlocal
chcp 65001 >nul

echo ==================================================
echo           Engineering Cockpit Start
echo ==================================================

REM Relativer Pfad zum Ordner dieses Skripts - funktioniert unabhaengig
REM davon, wohin der Projektordner auf diesem Rechner kopiert wurde.
set "PROJEKT_PFAD=set PROJEKT_PFAD=C:\Users\manu17\OneDrive - EJOT Holding GmbH & Co. KG\Dokumente\01_Ejot\05_Projekte_offen\df_toexel\engineering_cockpit-4"


cd /d "%~dp0"

set "VENV_ACTIVATE=%~dp0.venv\Scripts\activate.bat"

echo Aktiviere Venv...
if exist "%VENV_ACTIVATE%" (
    call "%VENV_ACTIVATE%"
    echo Venv erfolgreich aktiviert.
) else (
    echo FEHLER: Venv nicht gefunden unter:
    echo %VENV_ACTIVATE%
    echo Einmalig einrichten: python -m venv .venv  ^&^&  INSTALL.bat
    pause
    exit /b
)

echo Starte Datenbank ^(Docker^)...
docker compose up -d

REM --server.address 0.0.0.0 macht die App im Firmennetz erreichbar
REM ^(nicht nur von diesem Rechner selbst^) - Windows-Firewall muss Port 8501
REM einmalig fuer eingehende Verbindungen freigeben, siehe README.
echo Starte Streamlit...
streamlit run app.py --server.port 8501 --server.address 0.0.0.0

pause