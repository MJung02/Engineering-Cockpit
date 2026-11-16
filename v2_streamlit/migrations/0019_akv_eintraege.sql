-- AKV (Aufgaben/Kompetenzen/Verantwortung) ist ein eigenstaendiges
-- Organisations-Konzept, keine Ableitung aus der RACI-Matrix - Nutzer
-- pflegt es direkt pro Person und Projekt als Freitext.

CREATE TABLE akv_eintraege (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    projekt_id      INTEGER NOT NULL REFERENCES projekte(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    aufgaben        TEXT,
    kompetenzen     TEXT,
    verantwortung   TEXT,
    geaendert_am    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (projekt_id, user_id)
);
