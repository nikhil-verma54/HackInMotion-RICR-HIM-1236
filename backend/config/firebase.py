import json
import logging
import os

import firebase_admin
from django.conf import settings
from firebase_admin import credentials

logger = logging.getLogger(__name__)


def init_firebase():
    """Initialize Firebase Admin SDK if not already initialized.

    Priority:
    1. FIREBASE_SERVICE_ACCOUNT_JSON env var (JSON string) — used on Render/production.
    2. Local serviceAccountKey.json file — used in local development.
    3. Raises RuntimeError if neither is available.
    """
    if firebase_admin._apps:
        return firebase_admin.get_app()

    # Option 1: JSON string in environment variable (for Render & CI/CD)
    sa_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if sa_json:
        try:
            sa_dict = json.loads(sa_json)
        except json.JSONDecodeError as e:
            raise RuntimeError(
                f"FIREBASE_SERVICE_ACCOUNT_JSON is set but contains invalid JSON: {e}\n"
                "Make sure you pasted the entire JSON as a single line with no extra line breaks."
            ) from e

        cred = credentials.Certificate(sa_dict)
        firebase_admin.initialize_app(cred)
        logger.info("Firebase initialized from FIREBASE_SERVICE_ACCOUNT_JSON env var.")
        return firebase_admin.get_app()

    # Option 2: Local file for development
    service_account_path = getattr(settings, "FIREBASE_SERVICE_ACCOUNT", None)
    if service_account_path and os.path.exists(service_account_path):
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        logger.info("Firebase initialized from local serviceAccountKey.json.")
        return firebase_admin.get_app()

    raise RuntimeError(
        "Firebase credentials not found. "
        "Set FIREBASE_SERVICE_ACCOUNT_JSON env var (production) "
        "or place serviceAccountKey.json in backend/firebase/ (local dev)."
    )


# Auto-initialize on import — log the error instead of silently swallowing it
try:
    init_firebase()
except Exception as exc:
    logger.error("Firebase initialization failed at import: %s", exc)
