from django.urls import path
from .views import (
    UploadResumeView,
    AnalyzeResumeView,
    test_auth,
    dashboard,
    analysis_detail,
)


urlpatterns = [
    path("upload/", UploadResumeView.as_view(), name="upload-resume"),
    path("analyze/", AnalyzeResumeView.as_view(), name="analyze-resume"),
    path("test-auth/", test_auth, name="test-auth"),
    path("dashboard/", dashboard, name="dashboard"),
    path("history/<int:analysis_id>/", analysis_detail, name="analysis-detail"),
]