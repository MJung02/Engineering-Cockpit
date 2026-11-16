-- Scope-, Kontext- & Umfeldanalyse: ergaenzt C.6 Projektdesign um eine
-- strukturierte Abgrenzung (im Scope / explizit ausgeschlossen) und eine
-- klassische Umfeldanalyse (sachlich/sozial x intern/extern). Speist zudem
-- die Stacy-Matrix-Vorschlaege in C.5 (Anforderungs-/Loesungsklarheit).

ALTER TABLE projekt_initialisierung ADD COLUMN scope_im TEXT;
ALTER TABLE projekt_initialisierung ADD COLUMN scope_out TEXT;

CREATE TABLE kontextfaktoren (
    id                    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id            INTEGER NOT NULL REFERENCES projekte(id) ON DELETE CASCADE,
    bezeichnung           TEXT NOT NULL,
    typ                   TEXT NOT NULL DEFAULT 'sachlich',  -- sachlich | sozial
    herkunft              TEXT NOT NULL DEFAULT 'intern',    -- intern | extern
    einfluss_auf_projekt  TEXT,
    einfluss_von_projekt  TEXT,
    wichtigkeit           SMALLINT NOT NULL DEFAULT 2,       -- 1 gering, 2 mittel, 3 hoch
    company_id            UUID REFERENCES companies(id),
    erstellt_am           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_kontextfaktoren_projekt_id ON kontextfaktoren(projekt_id);
