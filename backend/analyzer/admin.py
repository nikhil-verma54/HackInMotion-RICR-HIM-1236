from django.contrib import admin

from .models import ResumeAnalysis


@admin.register(ResumeAnalysis)
class ResumeAnalysisAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "filename", "overall_score", "created_at")
    list_filter = ("created_at", "overall_score")
    search_fields = ("filename", "user__email", "user__name", "summary")
    readonly_fields = ("created_at", "updated_at")
