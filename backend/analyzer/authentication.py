from firebase_admin import auth
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

from authentication.models import UserProfile
from config.firebase import init_firebase


class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # Ensure Firebase Admin is initialized
        try:
            init_firebase()
        except Exception:
            pass

        # Try multiple sources for the Authorization header to handle
        # different server/WSGI environments.
        auth_header = (
            request.headers.get("Authorization")
            or request.META.get("HTTP_AUTHORIZATION")
            or request.META.get("Authorization")
        )

        if not auth_header:
            # Check for a Django session containing firebase_uid as a fallback
            try:
                session_uid = request.session.get("firebase_uid")
                if session_uid:
                    user = UserProfile.objects.filter(firebase_uid=session_uid).first()
                    if user:
                        return (user, None)
            except Exception:
                pass

            return None

        if not auth_header.startswith("Bearer "):
            raise AuthenticationFailed(
                "Invalid authorization header format. Expected 'Bearer <token>'."
            )

        id_token = auth_header.split("Bearer ", 1)[1].strip()

        if not id_token:
            raise AuthenticationFailed("Firebase ID token is missing.")

        try:
            decoded_token = auth.verify_id_token(id_token)

            firebase_uid = decoded_token.get("uid")
            email = decoded_token.get("email") or ""
            name = decoded_token.get("name")
            picture = decoded_token.get("picture")

            # Get or create UserProfile for valid Firebase token
            user, created = UserProfile.objects.get_or_create(
                firebase_uid=firebase_uid,
                defaults={
                    "email": email,
                    "name": name,
                    "photo_url": picture,
                },
            )

            # Keep profile information updated if changed
            if not created and (
                user.email != email or user.name != name or user.photo_url != picture
            ):
                if email:
                    user.email = email
                if name:
                    user.name = name
                if picture:
                    user.photo_url = picture
                user.save()

            return (user, decoded_token)

        except AuthenticationFailed:
            raise

        except auth.ExpiredIdTokenError as exc:
            raise AuthenticationFailed(
                "Firebase ID token has expired. Please refresh your session."
            ) from exc

        except auth.InvalidIdTokenError as exc:
            raise AuthenticationFailed("Invalid Firebase ID token.") from exc

        except Exception as exc:
            raise AuthenticationFailed(f"Firebase authentication error: {exc}") from exc
