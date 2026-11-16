"""
Engineering Cockpit - Migration Runner
Applies numbered .sql files from migrations/ in filename order, tracking applied
filenames in a schema_migrations table. Deliberately not Alembic - a handful of
plain DDL files is simpler to reason about for a solo maintainer; swappable for
Alembic later since Alembic can also run raw SQL migrations.
"""
import pathlib

MIGRATIONS_DIR = pathlib.Path(__file__).parent / "migrations"


def _ensure_tracking_table(cursor):
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename    TEXT PRIMARY KEY,
            applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    """)


def _applied_filenames(cursor) -> set:
    cursor.execute("SELECT filename FROM schema_migrations")
    return {row[0] for row in cursor.fetchall()}


def apply_pending(conn) -> list:
    """Applies all pending .sql migrations in migrations/ in filename order.
    Each migration runs in its own transaction. Returns list of applied filenames."""
    cursor = conn.cursor()
    _ensure_tracking_table(cursor)
    conn.commit()

    applied_already = _applied_filenames(cursor)
    files = sorted(MIGRATIONS_DIR.glob("*.sql"))
    newly_applied = []

    for path in files:
        if path.name in applied_already:
            continue
        sql = path.read_text()
        try:
            cursor.execute(sql)
            cursor.execute(
                "INSERT INTO schema_migrations (filename) VALUES (%s)", (path.name,)
            )
            conn.commit()
            newly_applied.append(path.name)
            print(f"[Migration] applied {path.name}")
        except Exception as e:
            conn.rollback()
            print(f"[Migration] FAILED on {path.name}: {type(e).__name__}: {e}")
            raise

    cursor.close()
    return newly_applied
