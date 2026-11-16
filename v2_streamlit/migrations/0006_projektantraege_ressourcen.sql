-- Phase B: Ideen-/Projekt-Intake + Ressourcen-Zuteilung in %.
-- projektantraege ist ein zusaetzlicher Pfad, kein Ersatz fuer direktes
-- Projekt-Anlegen (projekte bleibt weiterhin frei nutzbar).
-- projekt_ressourcen gilt fuer ALLE Projekte (GF-zugewiesen oder selbst
-- gewaehlt), anteil_pct ist immer vom betroffenen Nutzer selbst editierbar.

CREATE TABLE projektantraege (
    id                      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titel                   TEXT NOT NULL,
    beschreibung            TEXT,
    eingereicht_von         UUID REFERENCES users(id),
    status                  TEXT NOT NULL DEFAULT 'Eingereicht',
    projekt_id              INTEGER REFERENCES projekte(id),
    entschieden_von         UUID REFERENCES users(id),
    entschieden_am          TIMESTAMPTZ,
    entscheidung_kommentar  TEXT,
    company_id              UUID REFERENCES companies(id),
    erstellt_am             TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_projektantraege_status ON projektantraege(status);
CREATE INDEX idx_projektantraege_eingereicht_von ON projektantraege(eingereicht_von);

CREATE TABLE projekt_ressourcen (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id      INTEGER NOT NULL REFERENCES projekte(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    anteil_pct      NUMERIC(5,2) NOT NULL DEFAULT 0,
    quelle          TEXT NOT NULL DEFAULT 'selbst_gewaehlt',
    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now(),
    geaendert_am    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (projekt_id, user_id)
);
CREATE INDEX idx_projekt_ressourcen_user ON projekt_ressourcen(user_id);
CREATE INDEX idx_projekt_ressourcen_projekt ON projekt_ressourcen(projekt_id);
