"""
Engineering Cockpit - Database Layer
PostgreSQL (single supported database as of Phase A - see
.claude/plans/reflective-marinating-leaf.md). A pooled connection is opened once
per process and reused across every Streamlit rerun and every user.
"""
import atexit
import os
from contextlib import contextmanager

from psycopg_pool import ConnectionPool

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

import migrations

PG_CONFIG = {
    "host":     os.getenv("EC_PG_HOST", "localhost"),
    "port":     os.getenv("EC_PG_PORT", "5432"),
    "dbname":   os.getenv("EC_PG_DATABASE", "engineering_cockpit"),
    "user":     os.getenv("EC_PG_USER", "cockpit"),
    "password": os.getenv("EC_PG_PASSWORD", ""),
}

_CONNINFO = (
    f"host={PG_CONFIG['host']} port={PG_CONFIG['port']} "
    f"dbname={PG_CONFIG['dbname']} user={PG_CONFIG['user']} "
    f"password={PG_CONFIG['password']}"
)

# Module-level singleton: created once when this module is first imported into
# the process. Streamlit caches imported modules across reruns (it does not
# re-execute top-level module code per interaction), so this pool survives for
# the lifetime of the server process rather than being recreated per rerun.
_pool = ConnectionPool(conninfo=_CONNINFO, min_size=1, max_size=10, open=True)
atexit.register(_pool.close)


@contextmanager
def db_cursor():
    """Context manager: yields (conn, cursor) from the pool, commits automatically
    on success, rolls back on error. Connection is returned to the pool (not
    closed) when the block exits."""
    with _pool.connection() as conn:
        cursor = conn.cursor()
        try:
            yield conn, cursor
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            cursor.close()


def init_database():
    """Applies all pending migrations from migrations/ against Postgres."""
    with _pool.connection() as conn:
        applied = migrations.apply_pending(conn)
    target = f"{PG_CONFIG['host']}:{PG_CONFIG['port']}/{PG_CONFIG['dbname']}"
    if applied:
        print(f"[OK] Datenbank initialisiert (Postgres @ {target}) - {len(applied)} neue Migration(en) angewendet.")
    else:
        print(f"[OK] Datenbank initialisiert (Postgres @ {target}) - Schema aktuell.")
