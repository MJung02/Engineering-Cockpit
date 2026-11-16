-- Phase K (Slice 2): Belegverwaltung - Rechnungen/Belege projektbezogen
-- einreichen (Material, Dienstleistungen, Bewirtung, Kilometer, Hotel,
-- Sonstiges), inkl. Datei-Ablage direkt in der DB (bytea) statt
-- Dateisystem-Pfad, damit es unabhaengig vom Serverstandort funktioniert.
-- Ergaenzt die Ist-Kosten in der Budgetueberwachung (Phase K Slice 1) um
-- Sachkosten neben den Zeitkosten.

CREATE TABLE belege (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id      INTEGER NOT NULL REFERENCES projekte(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),
    kategorie       TEXT NOT NULL,  -- Material|Dienstleistung|Bewirtung|Kilometer|Hotel|Sonstiges
    beschreibung    TEXT,
    betrag          NUMERIC(12,2) NOT NULL,
    beleg_datum     DATE NOT NULL DEFAULT CURRENT_DATE,
    dateiname       TEXT,
    dateiinhalt     BYTEA,
    mimetype        TEXT,
    status          TEXT NOT NULL DEFAULT 'eingereicht',  -- eingereicht|geprueft|abgelehnt
    company_id      UUID REFERENCES companies(id),
    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_belege_projekt_id ON belege(projekt_id);
CREATE INDEX idx_belege_user_id ON belege(user_id);
