-- Phase K Abschluss: Zwischenberichte/Nachweise, Kostenkalkulation &
-- Rechnungsstellung, Schaetzverfahren. Positionen/Stueckliste (projekt_
-- positionen, Phase E) dient als Grundbetrags-Basis fuer die Rechnungs-
-- kalkulation, projekt_dokumente (Phase E) nimmt den editierbaren
-- Rechnungstext auf (typ='vorrechnung'|'endrechnung', UNIQUE(projekt_id,typ)
-- passt genau zu "eine Vor- und eine Endrechnung je Projekt").

CREATE TABLE berichtspflichten (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id      INTEGER NOT NULL REFERENCES projekte(id) ON DELETE CASCADE,
    bezeichnung     TEXT NOT NULL,
    rhythmus        TEXT NOT NULL DEFAULT 'einmalig',  -- quartalsweise|halbjaehrlich|jaehrlich|einmalig
    start_datum     DATE NOT NULL DEFAULT CURRENT_DATE,
    aktiv           BOOLEAN NOT NULL DEFAULT true,
    company_id      UUID REFERENCES companies(id),
    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_berichtspflichten_projekt_id ON berichtspflichten(projekt_id);

CREATE TABLE berichtsnachweise (
    id                  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    berichtspflicht_id  INTEGER NOT NULL REFERENCES berichtspflichten(id) ON DELETE CASCADE,
    faelligkeit_datum   DATE NOT NULL,
    eingereicht_am      TIMESTAMPTZ NOT NULL DEFAULT now(),
    dateiname           TEXT,
    dateiinhalt         BYTEA,
    mimetype            TEXT,
    user_id             UUID REFERENCES users(id),
    notiz               TEXT,
    company_id          UUID REFERENCES companies(id)
);
CREATE INDEX idx_berichtsnachweise_pflicht_id ON berichtsnachweise(berichtspflicht_id);

CREATE TABLE rechnungskalkulationen (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id      INTEGER NOT NULL REFERENCES projekte(id) ON DELETE CASCADE,
    typ             TEXT NOT NULL,  -- vorrechnung|endrechnung
    grundbetrag     NUMERIC(12,2) NOT NULL DEFAULT 0,
    gewinn_pct      NUMERIC(5,2) NOT NULL DEFAULT 0,
    rabatt_pct      NUMERIC(5,2) NOT NULL DEFAULT 0,
    skonto_pct      NUMERIC(5,2) NOT NULL DEFAULT 0,
    endbetrag       NUMERIC(12,2),  -- berechnet, haendisch ueberschreibbar
    company_id      UUID REFERENCES companies(id),
    aktualisiert_am TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (projekt_id, typ)
);

CREATE TABLE schaetzungen (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id      INTEGER NOT NULL REFERENCES projekte(id) ON DELETE CASCADE,
    bezeichnung     TEXT NOT NULL,
    methode         TEXT NOT NULL,  -- zwei_punkt|drei_punkt|story_points
    optimistisch    NUMERIC(10,2),
    wahrscheinlich  NUMERIC(10,2),
    pessimistisch   NUMERIC(10,2),
    story_points    NUMERIC(10,2),
    einheit         TEXT NOT NULL DEFAULT 'Stunden',  -- Stunden|Tage (irrelevant bei story_points)
    ergebnis        NUMERIC(10,2) NOT NULL,
    company_id      UUID REFERENCES companies(id),
    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_schaetzungen_projekt_id ON schaetzungen(projekt_id);
