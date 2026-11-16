-- Foundation for multi-user access: companies (tenant placeholder, not full
-- multi-tenancy), users, roles (join table so a future Gremium/committee layer
-- is an additive INSERT, not a schema rewrite), sessions (server-side session
-- store for cookie-based auth - see auth.py).

CREATE TABLE companies (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    slug        TEXT UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id      UUID REFERENCES companies(id),
    email           CITEXT UNIQUE NOT NULL,
    display_name    TEXT NOT NULL,
    password_hash   TEXT NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at   TIMESTAMPTZ
);

CREATE TABLE roles (
    id      SMALLINT PRIMARY KEY,
    code    TEXT UNIQUE NOT NULL,
    label   TEXT NOT NULL
);

CREATE TABLE user_roles (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id     SMALLINT NOT NULL REFERENCES roles(id),
    company_id  UUID REFERENCES companies(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      TEXT NOT NULL UNIQUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at      TIMESTAMPTZ NOT NULL,
    last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_agent      TEXT,
    ip_address      INET
);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_users_company_id ON users(company_id);

INSERT INTO roles (id, code, label) VALUES
    (1, 'mitarbeiter', 'Mitarbeiter'),
    (2, 'projektleiter', 'Projektleiter'),
    (3, 'geschaeftsfuehrung', 'Geschäftsführung'),
    (4, 'admin', 'Administrator')
ON CONFLICT (id) DO NOTHING;
