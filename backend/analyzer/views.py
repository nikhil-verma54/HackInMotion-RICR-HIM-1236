
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated

from .authentication import FirebaseAuthentication
from .serializers import ResumeUploadSerializer

from .services.pdf_parser import (
    extract_pdf_text,
    extract_docx_text,
)

from .services.ai_analyzer import analyze_resume


# ============================================================
# UPLOAD RESUME
# ============================================================

class UploadResumeView(GenericAPIView):

    serializer_class = ResumeUploadSerializer
    parser_classes = [MultiPartParser, FormParser]

    # Firebase authentication
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        print("\n==============================")
        print("📄 RESUME UPLOAD REQUEST")
        print("==============================")

        # ----------------------------------------------------
        # AUTHENTICATED USER
        # ----------------------------------------------------

        print("👤 Django User:", request.user)
        print("🆔 Django ID:", request.user.id)
        print("🔥 Firebase UID:", request.user.firebase_uid)
        print("📧 Email:", request.user.email)

        # ----------------------------------------------------
        # VALIDATE FILE
        # ----------------------------------------------------

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():

            print("❌ Resume validation failed")
            print(serializer.errors)

            return Response(
                {
                    "success": False,
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        resume = serializer.validated_data["resume"]

        file_name = resume.name.lower()

        print("📄 Filename:", resume.name)

        try:

            # ------------------------------------------------
            # EXTRACT TEXT
            # ------------------------------------------------

            if file_name.endswith(".pdf"):

                print("📕 PDF detected")

                text = extract_pdf_text(resume)

            elif file_name.endswith(".docx"):

                print("📘 DOCX detected")

                text = extract_docx_text(resume)

            else:

                print("❌ Unsupported file type")

                return Response(
                    {
                        "success": False,
                        "error": (
                            "Only PDF and DOCX files are supported."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ------------------------------------------------
            # CHECK EXTRACTED TEXT
            # ------------------------------------------------

            if not text:

                print("❌ Could not extract text")

                return Response(
                    {
                        "success": False,
                        "error": (
                            "Could not extract text from the resume."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            print("✅ Resume text extracted")
            print("📝 Text length:", len(text))

            print("==============================\n")

            return Response(
                {
                    "success": True,

                    "user": {
                        "id": request.user.id,
                        "firebase_uid": request.user.firebase_uid,
                        "email": request.user.email,
                    },

                    "filename": resume.name,

                    "text": text,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:

            print("\n❌ RESUME PROCESSING FAILED")
            print("❌ Error type:", type(e).__name__)
            print("❌ Error:", str(e))
            print("==============================\n")

            return Response(
                {
                    "success": False,
                    "error": "Unable to process the resume.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ============================================================
# ANALYZE RESUME
# ============================================================

class AnalyzeResumeView(GenericAPIView):

    serializer_class = ResumeUploadSerializer
    parser_classes = [MultiPartParser, FormParser]

    # Firebase authentication
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        print("\n==============================")
        print("🤖 RESUME ANALYSIS REQUEST")
        print("==============================")

        # ----------------------------------------------------
        # AUTHENTICATED USER
        # ----------------------------------------------------

        print("👤 Django User:", request.user)
        print("🆔 Django ID:", request.user.id)
        print("🔥 Firebase UID:", request.user.firebase_uid)
        print("📧 Email:", request.user.email)

        # ----------------------------------------------------
        # VALIDATE REQUEST
        # ----------------------------------------------------

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():

            print("❌ Request validation failed")
            print(serializer.errors)

            return Response(
                {
                    "success": False,
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        resume = serializer.validated_data["resume"]

        job_description = serializer.validated_data.get(
            "job_description",
            ""
        )

        file_name = resume.name.lower()

        print("📄 Filename:", resume.name)
        print(
            "💼 Job description received:",
            bool(job_description)
        )

        try:

            # ------------------------------------------------
            # EXTRACT RESUME TEXT
            # ------------------------------------------------

            if file_name.endswith(".pdf"):

                print("📕 PDF detected")

                text = extract_pdf_text(resume)

            elif file_name.endswith(".docx"):

                print("📘 DOCX detected")

                text = extract_docx_text(resume)

            else:

                print("❌ Unsupported file type")

                return Response(
                    {
                        "success": False,
                        "error": (
                            "Only PDF and DOCX files are supported."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ------------------------------------------------
            # CHECK TEXT
            # ------------------------------------------------

            if not text:

                print("❌ Could not extract resume text")

                return Response(
                    {
                        "success": False,
                        "error": (
                            "Could not extract text from the resume."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            print("✅ Resume text extracted")
            print("📝 Text length:", len(text))

            # ------------------------------------------------
            # AI ANALYSIS
            # ------------------------------------------------

            print("🤖 Starting AI resume analysis...")

            analysis = analyze_resume(
                resume_text=text,
                job_description=job_description,
            )

            print("✅ AI analysis completed")

            print("==============================\n")

            return Response(
                {
                    "success": True,

                    "user": {
                        "id": request.user.id,
                        "firebase_uid": request.user.firebase_uid,
                        "email": request.user.email,
                    },

                    "filename": resume.name,

                    "analysis": analysis,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:

            print("\n❌ RESUME ANALYSIS FAILED")
            print("❌ Error type:", type(e).__name__)
            print("❌ Error:", str(e))
            print("==============================\n")

            return Response(
                {
                    "success": False,
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ============================================================
# TEST FIREBASE AUTHENTICATION
# ============================================================

from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)


@api_view(["GET"])
@authentication_classes([FirebaseAuthentication])
@permission_classes([IsAuthenticated])
def test_auth(request):

    print("\n==============================")
    print("🧪 TEST AUTH REQUEST")
    print("==============================")

    print("👤 Django User:", request.user)
    print("🆔 Django ID:", request.user.id)
    print("🔥 Firebase UID:", request.user.firebase_uid)
    print("📧 Email:", request.user.email)
    print("👨 Name:", request.user.name)

    print("==============================\n")

    return Response(
        {
            "success": True,
            "message": "Firebase authentication successful.",

            "user": {
                "id": request.user.id,
                "firebase_uid": request.user.firebase_uid,
                "email": request.user.email,
                "name": request.user.name,
                "photo_url": request.user.photo_url,
            },
        },
        status=status.HTTP_200_OK,
    )

