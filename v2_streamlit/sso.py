"""
Engineering Cockpit - SSO ueber Microsoft Entra ID (Phase J)
Optionale msal-basierte OIDC-Anmeldung neben dem bestehenden E-Mail/Passwort-
Login (auth.py) - der bestehende Login bleibt unveraendert nutzbar, SSO ist
ein rein additiver zweiter Weg. Braucht eine Azure-AD-App-Registration
(externer Schritt durch die IT/Azure-AD-Admin-Rolle, siehe Einstellungen ->
SSO in der App fuer die Schritt-fuer-Schritt-Anleitung) - ohne gesetzte
Config-Werte ist sso_konfiguriert() False und die App verhaelt sich exakt
wie vorher.
"""
import os

try:
    import msal
    _MSAL_PKG = True
except ImportError:
    _MSAL_PKG = False

AZURE_TENANT_ID     = os.getenv("AZURE_TENANT_ID", "")
AZURE_CLIENT_ID     = os.getenv("AZURE_CLIENT_ID", "")
AZURE_CLIENT_SECRET = os.getenv("AZURE_CLIENT_SECRET", "")
AZURE_REDIRECT_URI  = os.getenv("AZURE_REDIRECT_URI", "http://localhost:8501")

SCOPES = ["User.Read"]


def sso_konfiguriert() -> bool:
    return bool(_MSAL_PKG and AZURE_TENANT_ID and AZURE_CLIENT_ID and AZURE_CLIENT_SECRET)


def _authority() -> str:
    return f"https://login.microsoftonline.com/{AZURE_TENANT_ID}"


def _msal_app():
    if not _MSAL_PKG:
        raise RuntimeError("pip install msal")
    return msal.ConfidentialClientApplication(
        AZURE_CLIENT_ID, authority=_authority(), client_credential=AZURE_CLIENT_SECRET
    )


def starte_login_flow() -> dict:
    """Erzeugt den Auth-Code-Flow inkl. State/PKCE (von msal selbst sicher
    verwaltet - nicht selbst nachbauen). Der zurueckgegebene Flow MUSS in
    st.session_state zwischengespeichert werden, bis der Redirect von
    Microsoft mit dem Code zurueckkommt (siehe pages/login.py)."""
    return _msal_app().initiate_auth_code_flow(SCOPES, redirect_uri=AZURE_REDIRECT_URI)


def verarbeite_rueckgabe(flow: dict, query_params: dict) -> dict:
    """Tauscht den Auth-Code aus dem Redirect gegen ein Token und gibt die
    ID-Token-Claims zurueck (email/preferred_username, name). Wirft
    RuntimeError bei Fehlern (z.B. abgelaufener Flow, falsche Redirect-URI)."""
    result = _msal_app().acquire_token_by_auth_code_flow(flow, query_params)
    if "error" in result:
        raise RuntimeError(result.get("error_description") or result["error"])
    return result["id_token_claims"]
