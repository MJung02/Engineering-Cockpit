-- Adds a nullable company_id FK to every business table so a future multi-
-- tenant SaaS scenario doesn't require a breaking migration - no tenant
-- isolation (RLS) is enabled yet, this column is inert until something
-- filters by it. Also adds the two small "who" gaps flagged in the plan:
-- projekte.owner_user_id (who is the Projektleiter) and
-- zeitbuchungen.user_id (who logged this time entry).

ALTER TABLE projekte ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE projekte ADD COLUMN owner_user_id UUID REFERENCES users(id);

ALTER TABLE tasks ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE interaktionen ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE stakeholder ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE einstellungen ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE meilensteine ADD COLUMN company_id UUID REFERENCES companies(id);

ALTER TABLE zeitbuchungen ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE zeitbuchungen ADD COLUMN user_id UUID REFERENCES users(id);

CREATE INDEX idx_projekte_company_id ON projekte(company_id);
CREATE INDEX idx_tasks_company_id ON tasks(company_id);
CREATE INDEX idx_interaktionen_company_id ON interaktionen(company_id);
CREATE INDEX idx_stakeholder_company_id ON stakeholder(company_id);
CREATE INDEX idx_meilensteine_company_id ON meilensteine(company_id);
CREATE INDEX idx_zeitbuchungen_company_id ON zeitbuchungen(company_id);
CREATE INDEX idx_zeitbuchungen_user_id ON zeitbuchungen(user_id);

-- Backfill existing rows to the sole seeded company (no-op if none exists yet).
UPDATE projekte SET company_id = (SELECT id FROM companies ORDER BY created_at LIMIT 1) WHERE company_id IS NULL;
UPDATE tasks SET company_id = (SELECT id FROM companies ORDER BY created_at LIMIT 1) WHERE company_id IS NULL;
UPDATE interaktionen SET company_id = (SELECT id FROM companies ORDER BY created_at LIMIT 1) WHERE company_id IS NULL;
UPDATE stakeholder SET company_id = (SELECT id FROM companies ORDER BY created_at LIMIT 1) WHERE company_id IS NULL;
UPDATE einstellungen SET company_id = (SELECT id FROM companies ORDER BY created_at LIMIT 1) WHERE company_id IS NULL;
UPDATE meilensteine SET company_id = (SELECT id FROM companies ORDER BY created_at LIMIT 1) WHERE company_id IS NULL;
UPDATE zeitbuchungen SET company_id = (SELECT id FROM companies ORDER BY created_at LIMIT 1) WHERE company_id IS NULL;
