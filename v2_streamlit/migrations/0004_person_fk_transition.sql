-- Replaces free-text "who" fields with optional FKs to users, while keeping the
-- legacy text column permanently as an escape hatch (not every warten_auf_person/
-- person value is a real person with a login - e.g. "Einkauf" is a department).

ALTER TABLE tasks RENAME COLUMN warten_auf_person TO warten_auf_person_legacy;
ALTER TABLE tasks ADD COLUMN warten_auf_user_id UUID REFERENCES users(id);
CREATE INDEX idx_tasks_warten_auf_user_id ON tasks(warten_auf_user_id);

ALTER TABLE interaktionen RENAME COLUMN person TO person_legacy;
ALTER TABLE interaktionen ADD COLUMN person_user_id UUID REFERENCES users(id);
CREATE INDEX idx_interaktionen_person_user_id ON interaktionen(person_user_id);
