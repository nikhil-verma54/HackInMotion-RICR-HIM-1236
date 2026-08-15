# serializers.py

from rest_framework import serializers


class ResumeUploadSerializer(serializers.Serializer):
    resume = serializers.FileField()
    job_description = serializers.CharField(
        required=True,
        allow_blank=False,
        allow_null=False,
        trim_whitespace=True,
    )

    def validate_job_description(self, value: str) -> str:
        """Reject job descriptions that are empty or contain only whitespace."""
        if not value or not value.strip():
            raise serializers.ValidationError(
                "Job description is required and cannot be empty or whitespace-only. "
                "Provide a job description to enable JD match scoring."
            )
        return value.strip()
