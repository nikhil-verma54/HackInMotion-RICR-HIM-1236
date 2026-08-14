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


class MockInterview(models.Model):
    STATUS_CHOICES = [
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    ]

    user = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="interviews"
    )
    job_role = models.CharField(max_length=255)
    resume_text = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="in_progress")
    overall_score = models.FloatField(null=True, blank=True)
    performance_summary = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.job_role} ({self.status})"


class InterviewQuestion(models.Model):
    interview = models.ForeignKey(
        MockInterview,
        on_delete=models.CASCADE,
        related_name="questions"
    )
    order = models.PositiveIntegerField(default=0)
    question_text = models.TextField()
    question_type = models.CharField(max_length=50, default="general")  # technical / behavioral
    user_answer = models.TextField(blank=True, null=True)
    ai_score = models.FloatField(null=True, blank=True)       # 0-10
    ai_feedback = models.JSONField(null=True, blank=True)     # {clarity, relevance, completeness, tip}
    answered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Q{self.order}: {self.question_text[:60]}"