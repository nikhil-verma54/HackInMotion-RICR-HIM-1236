import os

import firebase_admin
from django.conf import settings
from firebase_admin import credentials


def init_firebase():
    """Initialize Firebase Admin SDK if not already initialized."""
    if not firebase_admin._apps:
        service_account_path = getattr(settings, "FIREBASE_SERVICE_ACCOUNT", None)
        if service_account_path and os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
        else:
            firebase_admin.initialize_app()
    return firebase_admin.get_app()


# Auto-initialize on import
try:
    init_firebase()
except Exception:
    pass
