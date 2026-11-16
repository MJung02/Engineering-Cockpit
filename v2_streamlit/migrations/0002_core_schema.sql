-- Recreates the current business schema (Projekte/Tasks/Interaktionen/Stakeholder/
-- Einstellungen/Meilensteine/Zeitbuchungen) as native Postgres DDL. Table names
-- lowercased (Postgres convention); column names kept as-is (already snake_case
-- German domain vocabulary) to avoid unnecessary churn across dal.py.

CREATE TABLE projekte (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            TEXT NOT NULL,
    kostenstelle    TEXT,
    status          TEXT NOT NULL DEFAULT 'Aktiv',
    ordner_pfad     TEXT,
    budget_cap      NUMERIC(12,2),
    start_datum     DATE,
    end_datum       DATE,
    beschreibung    TEXT,
    farbe           TEXT DEFAULT '#3B82F6',
    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now(),
    geaendert_am    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tasks (
    id                      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id              INTEGER REFERENCES projekte(id) ON DELETE CASCADE,
    titel                   TEXT NOT NULL,
    beschreibung            TEXT,
    aufwandsklasse          TEXT DEFAULT '15m',
    status                  TEXT DEFAULT 'Backlog',
    prioritaet              INTEGER DEFAULT 2,
    kritischer_pfad         BOOLEAN DEFAULT false,
    warten_auf_person       TEXT,
    warten_seit             TIMESTAMPTZ,
    eskalationsstufe        INTEGER DEFAULT 0,
    faellig_am              DATE,
    erledigt_am             TIMESTAMPTZ,
    wiederkehrend           TEXT,
    naechste_faelligkeit    DATE,
    meilenstein_id          INTEGER,
    erstellt_am             TIMESTAMPTZ NOT NULL DEFAULT now(),
    geaendert_am            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE interaktionen (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    task_id         INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    projekt_id      INTEGER REFERENCES projekte(id),
    typ             TEXT DEFAULT 'Notiz',
    inhalt          TEXT NOT NULL,
    person          TEXT,
    tags            TEXT,
    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE stakeholder (
    id      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    TEXT NOT NULL,
    email   TEXT,
    rolle   TEXT,
    firma   TEXT
);

CREATE TABLE einstellungen (
    schluessel  TEXT PRIMARY KEY,
    wert        TEXT
);

CREATE TABLE meilensteine (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id      INTEGER NOT NULL REFERENCES projekte(id) ON DELETE CASCADE,
    parent_id       INTEGER REFERENCES meilensteine(id) ON DELETE CASCADE,
    titel           TEXT NOT NULL,
    beschreibung    TEXT,
    start_datum     DATE,
    end_datum       DATE,
    status          TEXT DEFAULT 'Offen',
    reihenfolge     INTEGER DEFAULT 0,
    erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE tasks
    ADD CONSTRAINT fk_tasks_meilenstein
    FOREIGN KEY (meilenstein_id) REFERENCES meilensteine(id);

CREATE TABLE zeitbuchungen (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    task_id     INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    projekt_id  INTEGER REFERENCES projekte(id),
    gestartet   TIMESTAMPTZ NOT NULL DEFAULT now(),
    gestoppt    TIMESTAMPTZ,
    dauer_min   INTEGER,
    notiz       TEXT
);

CREATE INDEX idx_tasks_projekt_id ON tasks(projekt_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_meilenstein_id ON tasks(meilenstein_id);
CREATE INDEX idx_interaktionen_task_id ON interaktionen(task_id);
CREATE INDEX idx_interaktionen_projekt_id ON interaktionen(projekt_id);
CREATE INDEX idx_meilensteine_projekt_id ON meilensteine(projekt_id);
CREATE INDEX idx_meilensteine_parent_id ON meilensteine(parent_id);
CREATE INDEX idx_zeitbuchungen_task_id ON zeitbuchungen(task_id);
CREATE INDEX idx_zeitbuchungen_projekt_id ON zeitbuchungen(projekt_id);

INSERT INTO einstellungen (schluessel, wert) VALUES
    ('kapazitaet_projekt_pct', '60'),
    ('kapazitaet_adhoc_pct', '40'),
    ('follow_up_tage', '7')
ON CONFLICT (schluessel) DO NOTHING;
