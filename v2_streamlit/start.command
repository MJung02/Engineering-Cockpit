#!/bin/bash
# Engineering Cockpit - Start-Skript für macOS
# Doppelklick im Finder startet Docker (Postgres) + Streamlit-App.
cd "$(dirname "$0")"

echo "=================================================="
echo "         Engineering Cockpit wird gestartet"
echo "=================================================="

echo "Starte Datenbank (Docker)..."
docker compose up -d

echo "Starte Streamlit..."
.venv/bin/python3 -m streamlit run app.py --server.port 8501

read -p "Drücke Enter zum Schließen..."
