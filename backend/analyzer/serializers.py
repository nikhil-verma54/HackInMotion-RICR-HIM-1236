# serializers.py

from rest_framework import serializers


class ResumeUploadSerializer(serializers.Serializer):
    resume = serializers.FileField()
    job_description = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )