from firebase_admin import auth
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

from authentication.models import UserProfile


class FirebaseAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):

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
                session_uid = None

                try:
                    session_uid = request.session.get("firebase_uid")
                except Exception:
                    session_uid = None

                if session_uid:
                    user = UserProfile.objects.filter(
                        firebase_uid=session_uid
                    ).first()

                    if user:
                        return (user, None)

            except Exception as e:
                pass

            return None

        if not auth_header.startswith("Bearer "):
            raise AuthenticationFailed(
                "Invalid authorization header."
            )

        id_token = auth_header.split("Bearer ", 1)[1].strip()

        if not id_token:
            raise AuthenticationFailed(
                "Firebase ID token is missing."
            )

        try:
            decoded_token = auth.verify_id_token(id_token)

            firebase_uid = decoded_token.get("uid")
            email = decoded_token.get("email")
            name = decoded_token.get("name")
            picture = decoded_token.get("picture")

            # Find the Django UserProfile
            user = UserProfile.objects.filter(
                firebase_uid=firebase_uid
            ).first()

            if not user:
                raise AuthenticationFailed(
                    "User profile does not exist. Please login first."
                )

            # Keep Firebase data updated
            user.email = email or user.email
            user.name = name
            user.photo_url = picture
            user.save()

            return (user, decoded_token)

        except AuthenticationFailed:
            raise

        except Exception as e:
            raise AuthenticationFailed(
                "Invalid or expired Firebase token."
            )