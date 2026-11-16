-- Phase I: Mitarbeiterprofile. Aufgaben brauchen einen echten Bearbeiter
-- (bisher gab es nur warten_auf_user_id = "wartet auf", keine Zuordnung "wer
-- bearbeitet das") sowie Themen-Tags, damit die KI daraus Kompetenzen ableiten
-- kann statt sie manuell pflegen zu muessen.

ALTER TABLE tasks ADD COLUMN bearbeiter_user_id UUID REFERENCES users(id);
ALTER TABLE tasks ADD COLUMN tags TEXT;
CREATE INDEX idx_tasks_bearbeiter ON tasks(bearbeiter_user_id);

CREATE TABLE mitarbeiterprofile (
    user_id             UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_id          UUID REFERENCES companies(id),
    abteilung           TEXT,
    kompetenzen         TEXT,  -- manuell gepflegt
    kompetenzen_ki      TEXT,  -- von der KI aus bearbeiteten Aufgaben abgeleitet
    kompetenzen_ki_am   TIMESTAMPTZ,
    aktualisiert_am     TIMESTAMPTZ NOT NULL DEFAULT now()
);
