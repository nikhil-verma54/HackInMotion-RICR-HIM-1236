from django.contrib import admin

from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "name", "firebase_uid", "created_at")
    search_fields = ("email", "name", "firebase_uid")
    readonly_fields = ("created_at", "updated_at")
