-- Engt projekte.status auf feste Werte ein: Begonnen/Nicht gestartet/
-- Unterbrochen/Abgebrochen/Abgelehnt/Beendet statt bisher nur
-- Aktiv/Pausiert/Archiv. 'Archiv' war ein Sammelstatus fuer alle
-- Endzustaende, unterschieden nur ueber abschluss_ergebnis
-- (erfolgreich/gescheitert/neutral) - das wird jetzt direkt im Status
-- abgebildet: gescheitert -> Abgebrochen, sonst -> Beendet.

UPDATE projekte SET status = 'Begonnen'    WHERE status = 'Aktiv';
UPDATE projekte SET status = 'Unterbrochen' WHERE status = 'Pausiert';
UPDATE projekte SET status = 'Abgebrochen'  WHERE status = 'Archiv' AND abschluss_ergebnis = 'gescheitert';
UPDATE projekte SET status = 'Beendet'      WHERE status = 'Archiv';

ALTER TABLE projekte ADD CONSTRAINT projekte_status_check
    CHECK (status IN ('Begonnen','Nicht gestartet','Unterbrochen','Abgebrochen','Abgelehnt','Beendet'));

ALTER TABLE projekte ALTER COLUMN status SET DEFAULT 'Begonnen';
