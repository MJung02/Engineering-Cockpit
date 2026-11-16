-- Erlaubt das Hochladen einer echten Word-/PowerPoint-Datei als
-- Export-Vorlage: die Gliederung (Kapitel-/Folientitel) wird beim Upload
-- extrahiert und gespeichert, damit die KI beim Projekt-Export jedes
-- Kapitel mit passendem Inhalt aus den Projektdaten befuellen kann.
-- BYTEA-Speicherung analog zu belege.dateiinhalt (Migration 0014).

CREATE TABLE dokument_vorlagen_dateien (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    typ             TEXT NOT NULL UNIQUE,  -- z.B. 'projekt_export'
    dateiname       TEXT NOT NULL,
    dateiinhalt     BYTEA NOT NULL,
    mimetype        TEXT NOT NULL,
    gliederung      TEXT NOT NULL,  -- Kapitel-/Folientitel, ein Titel pro Zeile
    company_id      UUID REFERENCES companies(id),
    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now()
);
