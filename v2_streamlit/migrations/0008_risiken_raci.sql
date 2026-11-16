-- Phase D: Risikoregister (Eintrittswahrscheinlichkeit x Tragweite =
-- Risikopriotitaet, Massnahmenklasse, Restrisiko - klassisches Schema aus
-- den Unterlagen) und RACI/AKV-Matrix (Arbeitspaket x Person x Rolle).

CREATE TABLE risiken (
    id                          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id                  INTEGER NOT NULL REFERENCES projekte(id) ON DELETE CASCADE,
    beschreibung                TEXT NOT NULL,
    kategorie                   TEXT,
    eintrittswahrscheinlichkeit SMALLINT NOT NULL DEFAULT 1,  -- 1=gering 2=mittel 3=hoch
    tragweite                   SMALLINT NOT NULL DEFAULT 1,  -- 1=gering 2=mittel 3=hoch
    risikoprioritaet             SMALLINT,                     -- berechnet: EW*TW
    massnahmenklasse            TEXT,  -- vermeiden|vermindern|verlagern|begrenzen|akzeptieren
    massnahme                   TEXT,
    massnahme_kosten            NUMERIC(12,2),
    ew_nach_massnahme            SMALLINT,
    tw_nach_massnahme            SMALLINT,
    restrisiko                  SMALLINT,                     -- berechnet: ew_nach*tw_nach
    status                      TEXT NOT NULL DEFAULT 'Offen', -- Offen|In Umsetzung|Erledigt
    company_id                  UUID REFERENCES companies(id),
    erstellt_am                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    geaendert_am                 TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_risiken_projekt_id ON risiken(projekt_id);
CREATE INDEX idx_risiken_prioritaet ON risiken(risikoprioritaet);

CREATE TABLE raci_eintraege (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id      INTEGER NOT NULL REFERENCES projekte(id) ON DELETE CASCADE,
    arbeitspaket    TEXT NOT NULL,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rolle           TEXT NOT NULL,  -- 'R' | 'A' | 'C' | 'I'
    company_id      UUID REFERENCES companies(id),
    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (projekt_id, arbeitspaket, user_id)
);
CREATE INDEX idx_raci_projekt_id ON raci_eintraege(projekt_id);
