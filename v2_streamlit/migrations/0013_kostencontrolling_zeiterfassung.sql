-- Phase K (Slice 1): Zeiterfassung mit Rollenzuordnung + Budgetueberwachung.
-- zeitbuchungen.user_id gibt es bereits seit Migration 0005 (Bearbeiter der
-- Buchung) - hier kommt nur die fehlende Einsatzrolle dazu, damit Ist-Kosten
-- aus Zeiten x Rollen-Stundensatz berechnet werden koennen (Plan-Budget =
-- projekte.budget_cap, bereits vorhanden seit Phase A).

ALTER TABLE zeitbuchungen ADD COLUMN rolle TEXT;

CREATE TABLE mitarbeiter_rollensaetze (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rolle         TEXT NOT NULL,
    stundensatz   NUMERIC(10,2),  -- NULL = noch nicht konfiguriert
    company_id    UUID REFERENCES companies(id),
    UNIQUE (rolle, company_id)
);

INSERT INTO mitarbeiter_rollensaetze (rolle, stundensatz, company_id) VALUES
    ('Elektriker', NULL, NULL),
    ('Produktioner', NULL, NULL),
    ('Ingenieur', NULL, NULL),
    ('Programmierer', NULL, NULL),
    ('Projektleiter', NULL, NULL),
    ('Geschäftsführer', NULL, NULL);
