from django.db import models
from authentication.models import UserProfile


class ResumeAnalysis(models.Model):
    user = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="analyses"
    )
    filename = models.CharField(max_length=255)
    overall_score = models.IntegerField(default=0)
    job_description = models.TextField(blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    analysis_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.filename} ({self.overall_score})"