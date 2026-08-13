# urls.py

from django.urls import path
from .views import UploadResumeView, AnalyzeResumeView
from .views import UploadResumeView, AnalyzeResumeView, test_auth


urlpatterns = [
    path("upload/", UploadResumeView.as_view(), name="upload-resume"),
    path("analyze/", AnalyzeResumeView.as_view(), name="analyze-resume"),
    path("test-auth/", test_auth, name="test-auth"),
    path("analyze/", AnalyzeResumeView.as_view(), name="analyze-resume"),
]