from django.urls import path
from .views import (
    UploadResumeView,
    AnalyzeResumeView,
    test_auth,
    dashboard,
    analysis_detail,
    start_interview,
    submit_answer,
    finish_interview,
    interview_history,
    interview_detail,
)


urlpatterns = [
    path("upload/", UploadResumeView.as_view(), name="upload-resume"),
    path("analyze/", AnalyzeResumeView.as_view(), name="analyze-resume"),
    path("test-auth/", test_auth, name="test-auth"),
    path("dashboard/", dashboard, name="dashboard"),
    path("history/<int:analysis_id>/", analysis_detail, name="analysis-detail"),

    # Mock Interview endpoints
    path("interview/start/", start_interview, name="interview-start"),
    path("interview/<int:interview_id>/answer/", submit_answer, name="interview-answer"),
    path("interview/<int:interview_id>/finish/", finish_interview, name="interview-finish"),
    path("interview/history/", interview_history, name="interview-history"),
    path("interview/<int:interview_id>/detail/", interview_detail, name="interview-detail"),
]