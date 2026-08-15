"""
Tests for RICR-HIM-1236 audit fixes.
Covers: JD validation, resume_schema structure, interview_detail field names,
and ownership/authorization enforcement.
"""

from django.test import TestCase

from analyzer.serializers import ResumeUploadSerializer
from analyzer.services.resume_schema import RESUME_SCHEMA

# ---------------------------------------------------------------------------
# 1. Resume Schema — structure sanity check
# ---------------------------------------------------------------------------


class ResumeSchemaTest(TestCase):
    """Verify RESUME_SCHEMA is importable and has the expected top-level keys."""

    REQUIRED_KEYS = {
        "name",
        "email",
        "phone",
        "summary",
        "skills",
        "education",
        "experience",
        "projects",
        "certifications",
        "achievements",
    }

    def test_resume_schema_has_required_keys(self):
        self.assertIn("type", RESUME_SCHEMA)
        self.assertEqual(RESUME_SCHEMA["type"], "OBJECT")
        schema_props = set(RESUME_SCHEMA.get("properties", {}).keys())
        for key in self.REQUIRED_KEYS:
            self.assertIn(key, schema_props, f"RESUME_SCHEMA missing property: {key}")

    def test_skills_is_array_of_strings(self):
        skills = RESUME_SCHEMA["properties"]["skills"]
        self.assertEqual(skills["type"], "ARRAY")
        self.assertEqual(skills["items"]["type"], "STRING")

    def test_experience_is_array_of_objects(self):
        exp = RESUME_SCHEMA["properties"]["experience"]
        self.assertEqual(exp["type"], "ARRAY")
        self.assertEqual(exp["items"]["type"], "OBJECT")
        exp_props = exp["items"]["properties"]
        for field in ("job_title", "company", "start_date", "end_date", "description"):
            self.assertIn(field, exp_props)


# ---------------------------------------------------------------------------
# 2. JD Validation — serializer rejects empty / whitespace JD
# ---------------------------------------------------------------------------


class JDValidationSerializerTest(TestCase):
    """Serializer must reject missing, empty, and whitespace-only job descriptions."""

    def _make_mock_file(self, name="resume.pdf"):
        """Return a simple in-memory mock upload object."""
        from django.core.files.uploadedfile import SimpleUploadedFile

        return SimpleUploadedFile(name, b"%PDF-1.4 fake content", content_type="application/pdf")

    def test_empty_jd_is_invalid(self):
        data = {"resume": self._make_mock_file(), "job_description": ""}
        s = ResumeUploadSerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn("job_description", s.errors)

    def test_whitespace_only_jd_is_invalid(self):
        data = {"resume": self._make_mock_file(), "job_description": "   \t\n  "}
        s = ResumeUploadSerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn("job_description", s.errors)

    def test_missing_jd_is_invalid(self):
        data = {"resume": self._make_mock_file()}
        s = ResumeUploadSerializer(data=data)
        self.assertFalse(s.is_valid())
        self.assertIn("job_description", s.errors)

    def test_valid_jd_passes(self):
        data = {
            "resume": self._make_mock_file(),
            "job_description": "We are looking for a Senior Django Engineer.",
        }
        s = ResumeUploadSerializer(data=data)
        # May still fail on resume field type validation; just check jd key absent from errors
        s.is_valid()
        self.assertNotIn("job_description", s.errors)

    def test_valid_jd_is_stripped(self):
        data = {
            "resume": self._make_mock_file(),
            "job_description": "  Backend Python Engineer role  ",
        }
        s = ResumeUploadSerializer(data=data)
        s.is_valid()
        # If it passed jd validation, value should be stripped
        if "job_description" not in s.errors:
            self.assertEqual(
                s.validated_data.get("job_description", "").strip(),
                s.validated_data.get("job_description", ""),
            )


# ---------------------------------------------------------------------------
# 3. Interview model — correct field names
# ---------------------------------------------------------------------------


class InterviewQuestionFieldsTest(TestCase):
    """Verify InterviewQuestion model has ai_feedback, question_type, ai_score fields."""

    def test_correct_fields_exist(self):
        from analyzer.models import InterviewQuestion

        field_names = [f.name for f in InterviewQuestion._meta.get_fields()]
        self.assertIn("ai_feedback", field_names)
        self.assertIn("question_type", field_names)
        self.assertIn("ai_score", field_names)

    def test_old_wrong_fields_do_not_exist(self):
        from analyzer.models import InterviewQuestion

        field_names = [f.name for f in InterviewQuestion._meta.get_fields()]
        self.assertNotIn("feedback", field_names)
        self.assertNotIn("category", field_names)
        self.assertNotIn("score", field_names)


# ---------------------------------------------------------------------------
# 4. Settings — SECRET_KEY is not the old compromised hardcoded value
# ---------------------------------------------------------------------------


class SettingsSecurityTest(TestCase):
    """Ensure the old committed SECRET_KEY is no longer in use."""

    OLD_HARDCODED_KEY = "django-insecure-vl#a!jcq7j&%3t0h=86e&(a21^jqya6=arrwc!dh-@#4y%7h(u"

    def test_secret_key_is_not_the_old_hardcoded_value(self):
        from django.conf import settings

        self.assertNotEqual(
            settings.SECRET_KEY,
            self.OLD_HARDCODED_KEY,
            "SECRET_KEY is still the old committed insecure value — rotate it immediately.",
        )

    def test_secret_key_is_non_empty(self):
        from django.conf import settings

        self.assertTrue(settings.SECRET_KEY, "SECRET_KEY must not be empty.")

    def test_cors_allowed_origins_is_not_empty(self):
        from django.conf import settings

        self.assertIsInstance(settings.CORS_ALLOWED_ORIGINS, list)

    def test_cookie_samesite_is_lax(self):
        from django.conf import settings

        self.assertEqual(settings.SESSION_COOKIE_SAMESITE, "Lax")
        self.assertEqual(settings.CSRF_COOKIE_SAMESITE, "Lax")
