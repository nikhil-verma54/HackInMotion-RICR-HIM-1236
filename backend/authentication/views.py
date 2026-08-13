from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Initialize Firebase Admin SDK
from config import firebase

from firebase_admin import auth

from .models import UserProfile


class FirebaseLoginView(APIView):

    def post(self, request):

        print("\n==============================")
        print("🔥 FIREBASE LOGIN REQUEST")
        print("==============================")

        # ==========================================
        # 1. GET FIREBASE ID TOKEN
        # ==========================================

        id_token = request.data.get("idToken")

        print("📦 Request data received")
        print("🔑 Token received:", bool(id_token))

        if not id_token:

            print("❌ No Firebase token received")

            return Response(
                {
                    "success": False,
                    "error": "Firebase ID token is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            # ==========================================
            # 2. VERIFY FIREBASE TOKEN
            # ==========================================

            print("🔵 Verifying Firebase ID token...")

            decoded_token = auth.verify_id_token(id_token)

            print("✅ FIREBASE TOKEN VERIFIED")

            # ==========================================
            # 3. GET FIREBASE USER DATA
            # ==========================================

            firebase_uid = decoded_token.get("uid")
            email = decoded_token.get("email")
            name = decoded_token.get("name")
            picture = decoded_token.get("picture")

            print("🆔 Firebase UID:", firebase_uid)
            print("📧 Email:", email)
            print("👨 Name:", name)
            print("🖼️ Picture:", picture)

            # ==========================================
            # 4. CREATE OR GET DJANGO USER
            # ==========================================

            user, created = UserProfile.objects.get_or_create(
                firebase_uid=firebase_uid,
                defaults={
                    "email": email or "",
                    "name": name,
                    "photo_url": picture,
                }
            )

            # ==========================================
            # 5. UPDATE EXISTING USER
            # ==========================================

            if created:

                print("🟢 NEW DJANGO USER CREATED")

            else:

                print("🟡 EXISTING DJANGO USER FOUND")

                # Update information from Firebase
                user.email = email or ""
                user.name = name
                user.photo_url = picture

                user.save()

            # ==========================================
            # 6. PRINT DJANGO USER INFORMATION
            # ==========================================

            print("🆔 Django User ID:", user.id)
            print("🔥 Firebase UID:", user.firebase_uid)
            print("📧 Django Email:", user.email)
            print("👨 Django Name:", user.name)

            print("==============================")
            print("🟢 DJANGO AUTHENTICATION SUCCESS")
            print("==============================\n")

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
                    }
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:

            print("\n==============================")
            print("❌ FIREBASE AUTHENTICATION FAILED")
            print("==============================")

            print("❌ Error type:", type(e).__name__)
            print("❌ Error:", str(e))

            print("==============================\n")

            return Response(
                {
                    "success": False,
                    "error": "Invalid or expired Firebase ID token."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )