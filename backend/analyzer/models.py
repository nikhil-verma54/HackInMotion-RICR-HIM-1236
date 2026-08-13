from django.db import models

# Create your models here.
from django.db import models


class UserProfile(models.Model):
    firebase_uid = models.CharField(
        max_length=128,
        unique=True
    )

    email = models.EmailField()

    name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    photo_url = models.URLField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.email