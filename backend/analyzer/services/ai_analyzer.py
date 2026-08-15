import json
import re

from django.conf import settings
from google import genai

from .resume_schema import RESUME_SCHEMA

client = genai.Client(api_key=settings.GEMINI_API_KEY)
PRIMARY_MODEL = getattr(settings, "GEMINI_MODEL", "gemini-flash-latest")
FALLBACK_MODELS = [PRIMARY_MODEL, "gemini-flash-latest", "gemini-flash-lite-latest"]
# Deduplicate while preserving order
MODELS_TO_TRY = list(dict.fromkeys(FALLBACK_MODELS))


def _clean_json_str(raw: str):
    """Safely cleans and extracts JSON from Gemini output."""
    raw = raw.strip()
    if "```" in raw:
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", raw)
        if match:
            raw = match.group(1).strip()

    first_bracket = min([i for i in [raw.find("["), raw.find("{")] if i != -1], default=-1)
    if first_bracket != -1:
        if raw[first_bracket] == "[":
            last_bracket = raw.rfind("]")
        else:
            last_bracket = raw.rfind("}")
        if last_bracket != -1:
            raw = raw[first_bracket : last_bracket + 1]

    return json.loads(raw)


def _generate_with_fallback(contents, config=None):
    """Generate content trying primary model first, falling back to backup models on 404/503/429."""
    last_error = None
    for model_name in MODELS_TO_TRY:
        try:
            if config:
                return client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=config,
                )
            return client.models.generate_content(
                model=model_name,
                contents=contents,
            )
        except Exception as exc:
            last_error = exc
            continue
    raise last_error


# ---------------------------------------------------------------------------
# STRUCTURED RESUME EXTRACTION
# Uses RESUME_SCHEMA to extract name, skills, experience, education, projects.
# ---------------------------------------------------------------------------


def parse_resume_structure(resume_text: str) -> dict:
    """
    Convert raw resume text into structured JSON using RESUME_SCHEMA.
    Returns a dict with keys: name, email, phone, summary, skills,
    education, experience, projects, certifications, achievements.
    Falls back to an empty dict on failure so callers are never broken.
    """
    if not resume_text or not resume_text.strip():
        return {}

    prompt = (
        "Extract structured information from the resume below. "
        "Return only the fields you can find evidence for; leave optional fields empty.\n\n"
        f"RESUME:\n{resume_text}"
    )

    try:
        response = _generate_with_fallback(
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": RESUME_SCHEMA,
            },
        )
        return _clean_json_str(response.text)
    except Exception:
        # Structured extraction is additive — never crash the main pipeline.
        return {}


# ---------------------------------------------------------------------------
# AI ANALYSIS (JD match, scoring, gap analysis, suggestions)
# ---------------------------------------------------------------------------


def analyze_resume(resume_text: str, job_description: str | None = None) -> dict:

    if job_description:
        evaluation_mode = f"""
Evaluate the resume against the provided Job Description.

The Job Description is the target role.

You must distinguish between:
- matched skills
- partially demonstrated skills
- missing skills

Do not assume that a related technology automatically proves
experience with a more specific technology.

For example:
"REST API" does not automatically prove "Django REST Framework".
"Django" does not automatically prove "Django REST Framework".
"Cloud" does not automatically prove "AWS".

JOB DESCRIPTION:
{job_description}
"""
    else:
        evaluation_mode = """
Evaluate the resume as a standalone professional resume.

There is no target Job Description, so focus on:
- resume quality
- completeness
- technical depth
- ATS compatibility
- professional experience
- projects
- achievements
- writing quality
"""

    prompt = f"""
You are an expert technical recruiter, ATS evaluator,
resume reviewer, and career advisor.

Analyze the resume deeply, objectively, and conservatively.

{evaluation_mode}

IMPORTANT EVALUATION RULES:

1. Use ONLY information supported by the resume and job description.

2. NEVER invent experience, skills, achievements, companies,
technologies, certifications, responsibilities, dates, or results.

3. Do not assume that a broad skill proves a specific skill.

4. Distinguish carefully between:
   - MATCHED
   - PARTIAL
   - MISSING

5. MATCHED means the resume explicitly demonstrates the skill.

6. PARTIAL means the resume contains related evidence but does
not explicitly demonstrate the requested skill.

7. MISSING means there is no meaningful evidence of the skill.

8. Every skill evaluation must contain evidence explaining the status.

9. If evidence is unavailable, say:
   "No evidence found in the resume."

10. Do not reward keyword stuffing.

11. Evaluate actual technical work, responsibilities,
projects, and experience.

12. Give stronger evaluations to:
   - specific technical implementations
   - real-world experience
   - measurable achievements
   - clearly explained responsibilities
   - technically detailed projects

13. Penalize:
   - vague descriptions
   - generic claims
   - unsupported claims
   - formatting problems
   - lack of measurable impact

14. Evaluate ATS compatibility based on:
   - structure
   - readability
   - section organization
   - formatting
   - potential parsing issues

15. Do not evaluate protected personal characteristics.

16. The overall score must be your professional model judgment.
Do NOT use a simple hard-coded mathematical formula.

17. All scores must be between 0 and 100.

18. Every score explanation must be consistent with its score.

19. If a Job Description is provided, job_match must represent
suitability for THAT PARTICULAR ROLE.

20. Do not give a high score simply because many technologies
are listed.

CRITICAL GAPS:

Identify only the most important deficiencies that could
significantly reduce suitability for the target role.

Prioritize gaps based on:
- requirement importance
- relevance to target role
- absence of evidence
- potential hiring impact

Do not simply repeat every missing skill.

QUICK WINS:

Identify realistic improvements the candidate can make quickly.

Examples:
- fixing formatting
- explicitly mentioning an already demonstrated technology
- improving project descriptions
- adding truthful measurable results
- reorganizing skills

Never recommend inventing experience or achievements.

INTERVIEW QUESTIONS:

Generate technical and role-relevant interview questions based
ONLY on technologies, projects, experience, and gaps actually
present in the resume and JD.

Do not invent experience and then ask questions as if the
candidate possesses it.

SCORING:

The overall score represents the quality and competitiveness
of the resume, not simply keyword matching.

For JD-based analysis:

- Required skills have higher importance than preferred skills.
- Direct evidence is stronger than keyword-only mentions.
- Partial evidence must not be treated as a full match.
- Missing required skills should meaningfully affect job_match.
- Relevant experience and projects should increase suitability.
- Formatting, clarity, measurable impact, technical depth,
  and completeness must also influence the evaluation.

RESUME:

{resume_text}

Return ONLY valid JSON matching the requested response schema.
"""

    try:
        response = _generate_with_fallback(
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": {
                    "type": "OBJECT",
                    "properties": {
                        "overall_score": {"type": "NUMBER"},
                        "summary": {"type": "STRING"},
                        "scores": {
                            "type": "OBJECT",
                            "properties": {
                                "ats_compatibility": {"type": "NUMBER"},
                                "skills_quality": {"type": "NUMBER"},
                                "experience_quality": {"type": "NUMBER"},
                                "project_quality": {"type": "NUMBER"},
                                "achievement_impact": {"type": "NUMBER"},
                                "education_certifications": {"type": "NUMBER"},
                                "structure_completeness": {"type": "NUMBER"},
                                "writing_quality": {"type": "NUMBER"},
                                "technical_depth": {"type": "NUMBER"},
                                "career_relevance": {"type": "NUMBER"},
                            },
                        },
                        "score_explanations": {
                            "type": "OBJECT",
                            "properties": {
                                "ats_compatibility": {"type": "STRING"},
                                "skills_quality": {"type": "STRING"},
                                "experience_quality": {"type": "STRING"},
                                "project_quality": {"type": "STRING"},
                                "achievement_impact": {"type": "STRING"},
                                "education_certifications": {"type": "STRING"},
                                "structure_completeness": {"type": "STRING"},
                                "writing_quality": {"type": "STRING"},
                                "technical_depth": {"type": "STRING"},
                                "career_relevance": {"type": "STRING"},
                            },
                        },
                        "strengths": {"type": "ARRAY", "items": {"type": "STRING"}},
                        "weaknesses": {"type": "ARRAY", "items": {"type": "STRING"}},
                        "suggestions": {"type": "ARRAY", "items": {"type": "STRING"}},
                        "missing_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
                        "skill_analysis": {
                            "type": "ARRAY",
                            "items": {
                                "type": "OBJECT",
                                "properties": {
                                    "skill": {"type": "STRING"},
                                    "status": {"type": "STRING"},
                                    "evidence": {"type": "STRING"},
                                    "importance": {"type": "STRING"},
                                },
                            },
                        },
                        "job_match": {
                            "type": "OBJECT",
                            "properties": {
                                "applicable": {"type": "BOOLEAN"},
                                "match_score": {"type": "NUMBER"},
                                "matched_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
                                "partial_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
                                "missing_required_skills": {
                                    "type": "ARRAY",
                                    "items": {"type": "STRING"},
                                },
                                "missing_preferred_skills": {
                                    "type": "ARRAY",
                                    "items": {"type": "STRING"},
                                },
                                "explanation": {"type": "STRING"},
                            },
                        },
                    },
                },
            },
        )
        return _clean_json_str(response.text)
    except Exception as exc:
        raise RuntimeError(f"Gemini analysis failed: {exc}") from exc
