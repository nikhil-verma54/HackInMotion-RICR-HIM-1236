from firebase_admin import auth
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

from .models import UserProfile

# IMPORTANT: initialize Firebase Admin SDK
from config import firebase


class FirebaseAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):

        print("\n==============================")
        print("🔐 FIREBASE API AUTHENTICATION")
        print("==============================")

        auth_header = request.headers.get("Authorization")

        print("📨 Authorization header received:", bool(auth_header))

        if not auth_header:
            print("⚪ No Authorization header")
            return None

        if not auth_header.startswith("Bearer "):
            print("❌ Invalid Authorization header")

            raise AuthenticationFailed(
                "Invalid authorization header."
            )

        id_token = auth_header.split("Bearer ", 1)[1].strip()

        if not id_token:
            print("❌ Firebase ID token missing")

            raise AuthenticationFailed(
                "Firebase ID token is missing."
            )

        try:

            print("🔵 Verifying Firebase ID token...")

            decoded_token = auth.verify_id_token(id_token)

            firebase_uid = decoded_token.get("uid")
            email = decoded_token.get("email")
            name = decoded_token.get("name")
            picture = decoded_token.get("picture")

            print("✅ Firebase token verified")
            print("🆔 UID:", firebase_uid)
            print("📧 Email:", email)
            print("👨 Name:", name)

            # ==========================================
            # GET OR CREATE DJANGO USER
            # ==========================================

            user, created = UserProfile.objects.get_or_create(
                firebase_uid=firebase_uid,
                defaults={
                    "email": email,
                    "name": name,
                    "photo_url": picture,
                }
            )

            if created:

                print("🆕 New Django UserProfile created")
                print("🆔 Django ID:", user.id)

            else:

                print("👤 Existing Django UserProfile found")
                print("🆔 Django ID:", user.id)

                # Update latest Firebase information
                user.email = email
                user.name = name
                user.photo_url = picture
                user.save(
                    update_fields=[
                        "email",
                        "name",
                        "photo_url",
                        "updated_at",
                    ]
                )

            print("==============================")
            print("🟢 AUTHENTICATION SUCCESSFUL")
            print("==============================\n")

            # IMPORTANT:
            # request.user will now be UserProfile
            return (user, decoded_token)

        except Exception as e:

            print("\n❌ FIREBASE AUTHENTICATION FAILED")
            print("❌ Error type:", type(e).__name__)
            print("❌ Error:", str(e))
            print("==============================\n")

            raise AuthenticationFailed(
                "Invalid or expired Firebase token."
            )