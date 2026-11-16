"""
Engineering Cockpit - Seed Script
Run explicitly (NOT on every app start): python seed.py
Bootstraps the first company + owner account. Idempotent - skips if a
company already exists, so it's safe to leave lying around.
"""
import sys
import getpass

import database
import auth


def seed_company_and_owner():
    database.init_database()

    with database.db_cursor() as (conn, cursor):
        cursor.execute("SELECT COUNT(*) FROM companies")
        if cursor.fetchone()[0] > 0:
            print("[Seed] companies ist nicht leer - überspringe Bootstrap.")
            return

    company_name = input("Firmenname: ").strip() or "Meine Firma"
    with database.db_cursor() as (conn, cursor):
        cursor.execute(
            "INSERT INTO companies (name) VALUES (%s) RETURNING id",
            (company_name,)
        )
        company_id = cursor.fetchone()[0]
    print(f"[Seed] Company '{company_name}' angelegt ({company_id}).")

    email = input("Deine E-Mail: ").strip()
    display_name = input("Dein Anzeigename: ").strip() or email
    password = getpass.getpass("Passwort: ")
    password_confirm = getpass.getpass("Passwort (Wiederholung): ")
    if not email or password != password_confirm or not password:
        print("[Seed] Ungültige Eingabe oder Passwörter stimmen nicht überein. Abbruch.")
        sys.exit(1)

    password_hash = auth.hash_password(password)
    with database.db_cursor() as (conn, cursor):
        cursor.execute("""
            INSERT INTO users (company_id, email, display_name, password_hash)
            VALUES (%s,%s,%s,%s) RETURNING id
        """, (company_id, email, display_name, password_hash))
        user_id = cursor.fetchone()[0]

        # Owner bekommt admin (Systemverwaltung) + projektleiter (Alltagsrolle).
        cursor.execute("SELECT id FROM roles WHERE code IN ('admin','projektleiter')")
        role_ids = [r[0] for r in cursor.fetchall()]
        for role_id in role_ids:
            cursor.execute(
                "INSERT INTO user_roles (user_id, role_id, company_id) VALUES (%s,%s,%s)",
                (user_id, role_id, company_id)
            )
    print(f"[Seed] User '{email}' angelegt mit Rollen: admin, projektleiter.")


if __name__ == "__main__":
    seed_company_and_owner()
