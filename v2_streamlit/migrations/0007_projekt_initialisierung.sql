-- Phase C: Straubel-Projekt-Initialisierungs-Assistent (C.1-C.6).
-- 1:1-Erweiterung zu projekte, kontinuierlich editierbar (nicht ein
-- Einmal-Wizard - siehe C.7 kontinuierliches Fortschreiben).

ALTER TABLE projekte ADD COLUMN abschluss_ergebnis TEXT;
-- 'erfolgreich' | 'gescheitert' | 'neutral' - nur bei status='Archiv' relevant,
-- Grundlage fuer die Lessons-Learned-Auswertung in C.3.

CREATE TABLE projekt_initialisierung (
    projekt_id                  INTEGER PRIMARY KEY REFERENCES projekte(id) ON DELETE CASCADE,

    -- C.1 Zielstellung & Erfolgskriterien
    ziele                       TEXT,
    erfolgskriterien            TEXT,

    -- C.2 Kritische Erfolgsfaktoren
    kritische_erfolgsfaktoren   TEXT,

    -- C.3 Lessons Learned (eigene Notizen des Nutzers zu C.3-KI-Ergebnissen)
    lessons_learned             TEXT,

    -- C.4 Projektart & Komplexitaet (Straubel-Kriterienkatalog)
    reichweite_mehrere_fb       BOOLEAN,
    ressourcenbindung_pct       NUMERIC(5,2),
    budget_teur                 NUMERIC(12,2),
    dauer_wochen                NUMERIC(6,1),
    strategische_prio           SMALLINT,
    abhaengigkeiten             BOOLEAN,
    komplexitaet                TEXT,   -- 'gering' | 'Aufgabe' | 'Problem' | 'komplexes Problem'
    risikoklasse                TEXT,   -- 'A' | 'B' | 'C'
    einstufung                  TEXT,   -- berechnet: 'ASTA' | 'Massnahme' | 'EPM'

    -- C.5 Genereller Ansatz / Vorgehensmodell-Wahl (Stacy-Matrix)
    anforderungsklarheit        TEXT,   -- 'klar' | 'unklar'
    loesungsklarheit            TEXT,   -- 'klar' | 'unklar'
    vorgehensmodell             TEXT,   -- final gewaehlt (kann von Empfehlung abweichen)

    -- C.6 Projektdesign
    scope_abgrenzung            TEXT,
    rahmenbedingungen           TEXT,

    company_id                  UUID REFERENCES companies(id),
    aktualisiert_am             TIMESTAMPTZ NOT NULL DEFAULT now()
);
