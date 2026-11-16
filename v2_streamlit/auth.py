"""
Engineering Cockpit - Authentication
Plain Python (Postgres + argon2 + secrets) - deliberately no streamlit import,
mirroring how dal.py is already framework-agnostic, so a future non-Streamlit
frontend could reuse this module unchanged (only the cookie transport at the
call site would need to change).
"""
import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from database import db_cursor

_hasher = PasswordHasher()
SESSION_LIFETIME = timedelta(days=14)


def _now():
    return datetime.now(timezone.utc)


def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return _hasher.verify(password_hash, password)
    except VerifyMismatchError:
        return False
    except Exception:
        return False


def get_user(user_id) -> dict | None:
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        return dict(zip(cols, row)) if row else None


def get_user_by_email(email: str) -> dict | None:
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT * FROM users WHERE email=%s AND is_active=true", (email,))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        return dict(zip(cols, row)) if row else None


def get_or_create_sso_user(email: str, display_name: str) -> dict:
    """Provisioniert beim ersten erfolgreichen SSO-Login automatisch einen
    User-Datensatz (Phase J) - der password_hash ist ein nie eingegebenes
    Zufalls-Passwort, da dieser Account ausschliesslich per SSO einloggt.
    Bestehende E-Mail/Passwort-Accounts bleiben davon unberuehrt."""
    from dal import _default_company_id
    bestehend = get_user_by_email(email)
    if bestehend:
        return bestehend
    zufalls_hash = hash_password(secrets.token_urlsafe(32))
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO users (company_id, email, display_name, password_hash)
            VALUES (%s,%s,%s,%s) RETURNING *
        """, (_default_company_id(), email, display_name, zufalls_hash))
        cols = [d[0] for d in cursor.description]
        return dict(zip(cols, cursor.fetchone()))


def get_users(company_id=None) -> list:
    with db_cursor() as (conn, cursor):
        if company_id:
            cursor.execute(
                "SELECT * FROM users WHERE is_active=true AND company_id=%s ORDER BY display_name, id",
                (company_id,)
            )
        else:
            cursor.execute("SELECT * FROM users WHERE is_active=true ORDER BY display_name, id")
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def create_mitarbeiter_ohne_login(display_name: str, company_id=None) -> dict:
    """Legt eine Person ohne eigenen Login an (z.B. Produktioner), damit sie
    ueber die bestehende user_id-FK Projekten als Ressource zugewiesen und
    fuer sie Zeit erfasst werden kann, ohne dass ein Account existiert."""
    from dal import _default_company_id
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO users (company_id, email, display_name, password_hash, hat_login)
            VALUES (%s, NULL, %s, NULL, false) RETURNING *
        """, (company_id or _default_company_id(), display_name))
        cols = [d[0] for d in cursor.description]
        return dict(zip(cols, cursor.fetchone()))


def get_roles_for_user(user_id) -> list:
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT r.code FROM roles r
            JOIN user_roles ur ON ur.role_id = r.id
            WHERE ur.user_id = %s
        """, (user_id,))
        return [row[0] for row in cursor.fetchall()]


def get_alle_users_fuer_admin(company_id=None) -> list:
    """Wie get_users(), aber inkl. deaktivierter Accounts und mit Rollen -
    fuer die Admin-Mitarbeiterverwaltung, wo auch inaktive Accounts sichtbar
    und reaktivierbar sein muessen."""
    with db_cursor() as (conn, cursor):
        if company_id:
            cursor.execute(
                "SELECT * FROM users WHERE company_id=%s ORDER BY display_name, id",
                (company_id,)
            )
        else:
            cursor.execute("SELECT * FROM users ORDER BY display_name, id")
        cols = [d[0] for d in cursor.description]
        users = [dict(zip(cols, row)) for row in cursor.fetchall()]
    for u in users:
        u["rollen"] = get_roles_for_user(u["id"])
    return users


def get_all_roles() -> list:
    with db_cursor() as (conn, cursor):
        cursor.execute("SELECT id, code, label FROM roles ORDER BY id")
        cols = [d[0] for d in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def create_user_mit_login(email: str, display_name: str, password: str,
                          role_codes: list = None, company_id=None) -> dict:
    """Legt einen vollwertigen Account (mit Login) fuer eine:n Mitarbeiter:in
    an - Gegenstueck zu create_mitarbeiter_ohne_login fuer Personen, die sich
    selbst einloggen koennen sollen."""
    from dal import _default_company_id
    cid = company_id or _default_company_id()
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO users (company_id, email, display_name, password_hash, hat_login)
            VALUES (%s,%s,%s,%s,true) RETURNING *
        """, (cid, email, display_name, hash_password(password)))
        cols = [d[0] for d in cursor.description]
        neuer_user = dict(zip(cols, cursor.fetchone()))
    if role_codes:
        set_user_rollen(neuer_user["id"], role_codes, company_id=cid)
    return neuer_user


def set_user_rollen(user_id, role_codes: list, company_id=None):
    """Ersetzt die Rollen eines Users vollstaendig durch role_codes (leere
    Liste = alle Rollen entfernen)."""
    with db_cursor() as (conn, cursor):
        cursor.execute("DELETE FROM user_roles WHERE user_id=%s", (user_id,))
        if role_codes:
            cursor.execute(
                "SELECT id, code FROM roles WHERE code = ANY(%s)", (role_codes,)
            )
            for role_id, _code in cursor.fetchall():
                cursor.execute(
                    "INSERT INTO user_roles (user_id, role_id, company_id) VALUES (%s,%s,%s)",
                    (user_id, role_id, company_id)
                )


def set_user_aktiv(user_id, aktiv: bool):
    with db_cursor() as (conn, cursor):
        cursor.execute("UPDATE users SET is_active=%s WHERE id=%s", (aktiv, user_id))


def set_user_passwort(user_id, neues_passwort: str):
    with db_cursor() as (conn, cursor):
        cursor.execute(
            "UPDATE users SET password_hash=%s WHERE id=%s",
            (hash_password(neues_passwort), user_id)
        )


def require_role(user: dict, *codes: str) -> bool:
    """Coarse permission check: does this user have any of the given role codes?"""
    if not user:
        return False
    return bool(set(get_roles_for_user(user["id"])) & set(codes))


def authenticate(email: str, password: str) -> dict | None:
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    with db_cursor() as (conn, cursor):
        cursor.execute("UPDATE users SET last_login_at=%s WHERE id=%s", (_now(), user["id"]))
    return user


def create_session(user_id, user_agent: str = None, ip_address: str = None) -> str:
    """Creates a session row, returns the raw token (caller sets it as a cookie).
    Only sha256(token) is stored - a DB leak alone can't hand out live sessions."""
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
    expires_at = _now() + SESSION_LIFETIME
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO sessions (user_id, token_hash, expires_at, user_agent, ip_address)
            VALUES (%s,%s,%s,%s,%s)
        """, (user_id, token_hash, expires_at, user_agent, ip_address))
    return raw_token


def validate_session(raw_token: str) -> dict | None:
    """Returns the user dict for a valid, non-expired session token, else None."""
    if not raw_token:
        return None
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
    with db_cursor() as (conn, cursor):
        cursor.execute("""
            SELECT u.* FROM sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.token_hash=%s AND s.expires_at > %s AND u.is_active=true
        """, (token_hash, _now()))
        cols = [d[0] for d in cursor.description]
        row = cursor.fetchone()
        if not row:
            return None
        cursor.execute("UPDATE sessions SET last_seen_at=%s WHERE token_hash=%s", (_now(), token_hash))
        return dict(zip(cols, row))


def revoke_session(raw_token: str):
    if not raw_token:
        return
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
    with db_cursor() as (conn, cursor):
        cursor.execute("DELETE FROM sessions WHERE token_hash=%s", (token_hash,))
