from django.db.models import Avg, Max
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)

from authentication.models import UserProfile
from .models import ResumeAnalysis
from .authentication import FirebaseAuthentication
from .serializers import ResumeUploadSerializer
from .services.pdf_parser import (
    extract_pdf_text,
    extract_docx_text,
)
from .services.ai_analyzer import analyze_resume


# ============================================================
# UPLOAD RESUME (TEXT EXTRACTION ONLY)
# ============================================================

class UploadResumeView(GenericAPIView):

    serializer_class = ResumeUploadSerializer
    parser_classes = [MultiPartParser, FormParser]

    authentication_classes = [FirebaseAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        resume = serializer.validated_data["resume"]
        file_name = resume.name.lower()

        try:
            if file_name.endswith(".pdf"):
                text = extract_pdf_text(resume)
            elif file_name.endswith(".docx"):
                text = extract_docx_text(resume)
            else:
                return Response(
                    {
                        "success": False,
                        "error": "Only PDF and DOCX files are supported.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not text:
                return Response(
                    {
                        "success": False,
                        "error": "Could not extract text from the resume.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

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
            return Response(
                {
                    "success": False,
                    "error": "Unable to process the resume.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ============================================================
# ANALYZE RESUME (AI ANALYSIS + SAVE TO HISTORY)
# ============================================================

class AnalyzeResumeView(GenericAPIView):

    serializer_class = ResumeUploadSerializer
    parser_classes = [MultiPartParser, FormParser]

    authentication_classes = [FirebaseAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        resume = serializer.validated_data["resume"]
        job_description = serializer.validated_data.get("job_description", "")
        file_name = resume.name.lower()

        try:
            # 1. Extract Text
            if file_name.endswith(".pdf"):
                text = extract_pdf_text(resume)
            elif file_name.endswith(".docx"):
                text = extract_docx_text(resume)
            else:
                return Response(
                    {
                        "success": False,
                        "error": "Only PDF and DOCX files are supported.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not text:
                return Response(
                    {
                        "success": False,
                        "error": "Could not extract text from the resume.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # 2. AI Analysis
            analysis = analyze_resume(
                resume_text=text,
                job_description=job_description,
            )

            # 3. Save to database history
            overall_score = int(analysis.get("overall_score") or 0)
            summary = str(analysis.get("summary") or "")

            saved_record = ResumeAnalysis.objects.create(
                user=request.user,
                filename=resume.name,
                overall_score=overall_score,
                job_description=job_description or "",
                summary=summary,
                analysis_data=analysis,
            )

            return Response(
                {
                    "success": True,
                    "analysis_id": saved_record.id,
                    "user": {
                        "id": request.user.id,
                        "firebase_uid": request.user.firebase_uid,
                        "email": request.user.email,
                    },
                    "filename": resume.name,
                    "created_at": saved_record.created_at.isoformat(),
                    "analysis": analysis,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {
                    "success": False,
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ============================================================
# DASHBOARD (USER STATS & PAST ANALYSES)
# ============================================================

@api_view(["GET"])
@authentication_classes([FirebaseAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def dashboard(request):

    user = request.user
    analyses_qs = ResumeAnalysis.objects.filter(user=user)

    total_scans = analyses_qs.count()
    highest_record = analyses_qs.order_by("-overall_score", "-created_at").first()
    lowest_record = analyses_qs.order_by("overall_score", "-created_at").first()

    past_analyses = [
        {
            "id": a.id,
            "filename": a.filename,
            "overall_score": a.overall_score,
            "summary": a.summary,
            "has_job_description": bool(a.job_description),
            "created_at": a.created_at.isoformat(),
        }
        for a in analyses_qs[:20]
    ]

    return Response({
        "success": True,
        "user": {
            "id": user.id,
            "firebase_uid": user.firebase_uid,
            "email": user.email,
            "name": user.name,
            "photo_url": user.photo_url,
            "created_at": user.created_at.isoformat() if hasattr(user, "created_at") and user.created_at else None,
        },
        "stats": {
            "total_scans": total_scans,
            "highest_score": highest_record.overall_score if highest_record else None,
            "highest_resume_name": highest_record.filename if highest_record else None,
            "lowest_score": lowest_record.overall_score if lowest_record else None,
            "lowest_resume_name": lowest_record.filename if lowest_record else None,
        },
        "past_analyses": past_analyses,
    })


# ============================================================
# SINGLE ANALYSIS DETAIL & DELETE
# ============================================================

@api_view(["GET", "DELETE"])
@authentication_classes([FirebaseAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def analysis_detail(request, analysis_id):

    try:
        record = ResumeAnalysis.objects.get(id=analysis_id, user=request.user)
    except ResumeAnalysis.DoesNotExist:
        return Response(
            {"success": False, "error": "Analysis record not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "DELETE":
        record.delete()
        return Response(
            {"success": True, "message": "Analysis record deleted successfully."},
            status=status.HTTP_200_OK,
        )

    return Response(
        {
            "success": True,
            "id": record.id,
            "filename": record.filename,
            "overall_score": record.overall_score,
            "job_description": record.job_description,
            "summary": record.summary,
            "created_at": record.created_at.isoformat(),
            "analysis": record.analysis_data,
        },
        status=status.HTTP_200_OK,
    )


# ============================================================
# TEST AUTH
# ============================================================

@api_view(["GET"])
@authentication_classes([FirebaseAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def test_auth(request):

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