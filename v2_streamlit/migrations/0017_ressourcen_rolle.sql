-- Speichert die (typischerweise über die ganze Projektlaufzeit stabile)
-- Einsatzrolle einer Person je Projekt direkt an der Ressourcen-Zuordnung,
-- damit sie in der Zeiterfassung automatisch vorbelegt werden kann statt
-- bei jeder Buchung erneut ausgewaehlt werden zu muessen. Rollenwechsel
-- bleiben moeglich, sind aber die Ausnahme, nicht die Regel.

ALTER TABLE projekt_ressourcen ADD COLUMN rolle TEXT;
