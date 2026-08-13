import firebase_admin
from firebase_admin import credentials
from django.conf import settings
import os


if not firebase_admin._apps:
    cred = credentials.Certificate(
        settings.FIREBASE_SERVICE_ACCOUNT
    )

    firebase_admin.initialize_app(cred)