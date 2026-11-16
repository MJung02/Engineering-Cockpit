-- Erlaubt Personen ohne eigenen Login-Account (z.B. Produktioner) als
-- vollwertige users-Zeile anzulegen, damit sie ueber die bestehenden
-- FKs (projekt_ressourcen.user_id, zeitbuchungen.user_id) Ressourcen
-- zugewiesen bekommen und Zeit fuer sie erfasst werden kann, ohne dass
-- sie sich einloggen koennen.

ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN hat_login BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE users ADD CONSTRAINT users_login_erfordert_email_pw
    CHECK (hat_login = false OR (email IS NOT NULL AND password_hash IS NOT NULL));
