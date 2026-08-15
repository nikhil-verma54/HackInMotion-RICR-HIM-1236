from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from firebase_admin import auth
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.models import UserProfile
from config.firebase import init_firebase


@method_decorator(csrf_exempt, name="dispatch")
class FirebaseLoginView(APIView):
    def post(self, request):
        try:
            init_firebase()
        except Exception as exc:
            return Response(
                {"success": False, "error": f"Firebase initialization failed: {exc}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # ==========================================
        # 1. GET FIREBASE ID TOKEN
        # ==========================================

        id_token = request.data.get("idToken")

        if not id_token:
            return Response(
                {"success": False, "error": "Firebase ID token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # ==========================================
            # 2. VERIFY FIREBASE TOKEN
            # ==========================================

            decoded_token = auth.verify_id_token(id_token)

            # ==========================================
            # 3. GET FIREBASE USER DATA
            # ==========================================

            firebase_uid = decoded_token.get("uid")
            email = decoded_token.get("email")
            name = decoded_token.get("name")
            picture = decoded_token.get("picture")

            # ==========================================
            # 4. CREATE OR GET DJANGO USER
            # ==========================================

            user, created = UserProfile.objects.get_or_create(
                firebase_uid=firebase_uid,
                defaults={
                    "email": email or "",
                    "name": name,
                    "photo_url": picture,
                },
            )

            # ==========================================
            # 5. UPDATE EXISTING USER
            # ==========================================

            if not created:
                # Update information from Firebase
                user.email = email or ""
                user.name = name
                user.photo_url = picture
                user.save()

            # ==========================================
            # 6. CREATE DJANGO SESSION (for browser requests)
            # ==========================================

            try:
                request.session["firebase_uid"] = firebase_uid
                request.session.save()
            except Exception:
                pass  # session save failure is non-fatal

            # ==========================================
            # 7. SEND RESPONSE TO REACT
            # ==========================================

            return Response(
                {
                    "success": True,
                    "message": "Authentication successful.",
                    "user": {
                        "id": user.id,
                        "firebase_uid": user.firebase_uid,
                        "email": user.email,
                        "name": user.name,
                        "picture": user.photo_url,
                    },
                },
                status=status.HTTP_200_OK,
            )

        except Exception:
            return Response(
                {"success": False, "error": "Invalid or expired Firebase ID token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
