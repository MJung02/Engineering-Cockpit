-- Phase F: Vorgehensmodell-Engine. Meilensteine bilden bereits eine
-- Parent/Child-Hierarchie (siehe 0002_core_schema.sql) - fuer Wasserfall/
-- V-Modell/Inkrementell sind Top-Level-Meilensteine Phasen, fuer Scrum sind
-- Top-Level-Meilensteine Sprints (Sprint-Ziel liegt in beschreibung), fuer
-- Hybrid sind Sprints Untermeilensteine einer Umsetzungs-Phase. Keine neue
-- Tabelle noetig - nur additive Spalten.

ALTER TABLE meilensteine ADD COLUMN ist_quality_gate BOOLEAN NOT NULL DEFAULT false;
-- Markiert einen Meilenstein als Quality Gate (Wasserfall/V-Modell).

ALTER TABLE meilensteine ADD COLUMN typ TEXT NOT NULL DEFAULT 'phase';
-- 'phase' | 'sprint' - unterscheidet, ob dieser Meilenstein im Gantt
-- (Phase) oder im Scrum-Board (Sprint) dargestellt werden soll.

ALTER TABLE interaktionen ADD COLUMN meilenstein_id INTEGER REFERENCES meilensteine(id) ON DELETE SET NULL;
-- Ermoeglicht Sprint-Review-/Retro-Notizen, die einem Sprint (=Meilenstein)
-- zugeordnet sind statt nur einem Task oder Projekt.
