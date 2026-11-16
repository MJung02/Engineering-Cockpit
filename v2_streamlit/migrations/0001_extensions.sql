-- Extensions needed by later migrations:
-- citext   -> case-insensitive email column on users
-- pgcrypto -> gen_random_uuid() for UUID primary keys on users/companies/sessions
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
