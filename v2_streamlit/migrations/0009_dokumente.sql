-- Phase E: Dokumenten-Generierung. Lastenheft/Pflichtenheft als KI-Entwurf
-- (Freitext, editierbar), Kosten/Stueckliste als strukturierte Positionsliste
-- (eine Tabelle bedient beide Sichten - eine Stueckliste-Position IST eine
-- Kostenposition, nur mit typ='material'/'dienstleistung'), User-Stories aus
-- dem Interview-Chatbot.

CREATE TABLE projekt_dokumente (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id      INTEGER NOT NULL REFERENCES projekte(id) ON DELETE CASCADE,
    typ             TEXT NOT NULL,  -- 'lastenheft' | 'pflichtenheft'
    inhalt          TEXT,
    status          TEXT NOT NULL DEFAULT 'entwurf',  -- entwurf | final
    company_id      UUID REFERENCES companies(id),
    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now(),
    aktualisiert_am TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (projekt_id, typ)
);

CREATE TABLE projekt_positionen (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id      INTEGER NOT NULL REFERENCES projekte(id) ON DELETE CASCADE,
    typ             TEXT NOT NULL DEFAULT 'material',  -- material|dienstleistung|personal|sonstiges
    bezeichnung     TEXT NOT NULL,
    menge           NUMERIC(12,2) NOT NULL DEFAULT 1,
    einheit         TEXT NOT NULL DEFAULT 'Stk',
    einzelpreis     NUMERIC(12,2) NOT NULL DEFAULT 0,
    lieferant       TEXT,
    notiz           TEXT,
    company_id      UUID REFERENCES companies(id),
    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_projekt_positionen_projekt_id ON projekt_positionen(projekt_id);

CREATE TABLE user_stories (
    id                  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id          INTEGER NOT NULL REFERENCES projekte(id) ON DELETE CASCADE,
    rolle               TEXT NOT NULL,
    ziel                TEXT NOT NULL,
    nutzen              TEXT,
    akzeptanzkriterien  TEXT,
    prioritaet          TEXT NOT NULL DEFAULT 'Should',  -- MoSCoW: Must|Should|Could|Wont
    status              TEXT NOT NULL DEFAULT 'Entwurf',  -- Entwurf|Bestaetigt
    quelle              TEXT NOT NULL DEFAULT 'chatbot',  -- chatbot|manuell
    company_id          UUID REFERENCES companies(id),
    erstellt_am         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_user_stories_projekt_id ON user_stories(projekt_id);
