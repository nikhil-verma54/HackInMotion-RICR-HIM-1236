import json
import re

from django.conf import settings
from google import genai

client = genai.Client(api_key=settings.GEMINI_API_KEY)
PRIMARY_MODEL = getattr(settings, "GEMINI_MODEL", "gemini-flash-latest")
FALLBACK_MODELS = [PRIMARY_MODEL, "gemini-flash-latest", "gemini-flash-lite-latest"]
MODELS_TO_TRY = list(dict.fromkeys(FALLBACK_MODELS))


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


def clean_json_response(raw: str):
    """Safely extracts and parses JSON from Gemini responses."""
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


def generate_questions(
    resume_text: str, job_role: str, structured_resume: dict | None = None
) -> list[dict]:
    """
    Generate 10 interview questions based on candidate's resume and target job role:
    - 7 Technical questions arranged from Easy to Hard
    - 3 Behavioral questions
    Returns a list of dicts: [{ "question": str, "type": "technical"|"behavioral", "difficulty": "Easy"|"Medium"|"Hard"|"Behavioral" }]
    """
    structured_context = ""
    if structured_resume and isinstance(structured_resume, dict):
        skills = structured_resume.get("skills") or []
        experience = structured_resume.get("experience") or []
        projects = structured_resume.get("projects") or []
        structured_context = f"""
STRUCTURED PROFILE HIGHLIGHTS:
- Identified Skills: {", ".join(str(s) for s in skills[:15]) if skills else "N/A"}
- Experience Items: {len(experience)} positions
- Key Projects: {", ".join(p.get("name", "Project") for p in projects[:5] if isinstance(p, dict)) if projects else "N/A"}
"""

    prompt = f"""
You are an expert technical interviewer and hiring manager.
Based on the candidate's resume and target job role, generate exactly 10 interview questions.

STRUCTURE (Total 10 Questions):
1. Question 1 (Technical - Easy): Basic foundational concepts/tools mentioned in candidate's resume.
2. Question 2 (Technical - Easy): Core fundamentals relevant to target role and resume projects.
3. Question 3 (Technical - Medium): Implementation details, problem solving, or architectural decisions in their past projects.
4. Question 4 (Technical - Medium): Practical scenarios, edge cases, debugging, or optimization related to their tech stack.
5. Question 5 (Technical - Medium/Advanced): Best practices, design patterns, API/system integration, or testing.
6. Question 6 (Technical - Hard): Deep-dive technical challenge, system scalability, complex concurrency, security, or architectural trade-offs.
7. Question 7 (Technical - Hard): Advanced architectural or performance design question specifically challenging their senior technical competence.
8. Question 8 (Behavioral): Conflict resolution, teamwork, or handling disagreement on technical choices.
9. Question 9 (Behavioral): Managing tight deadlines, failure/mistake handling, and adaptability under pressure.
10. Question 10 (Behavioral): Leadership, ownership, mentorship, or driving a project to successful delivery.

TARGET JOB ROLE: {job_role}

{structured_context}

CANDIDATE'S RESUME:
{resume_text}

Rules:
- Technical questions MUST be specific to the skills, libraries, frameworks, databases, and projects explicitly stated in the resume.
- Behavioral questions must probe real situations from their work experience and engineering collaboration.
- Progressive difficulty for technical questions: Easy -> Medium -> Hard.
- Do NOT output markdown code blocks with extra text. Return ONLY a valid JSON array.

Return ONLY valid JSON in this exact structure:
[
  {{"order": 1, "question": "...", "type": "technical", "difficulty": "Easy"}},
  {{"order": 2, "question": "...", "type": "technical", "difficulty": "Easy"}},
  {{"order": 3, "question": "...", "type": "technical", "difficulty": "Medium"}},
  {{"order": 4, "question": "...", "type": "technical", "difficulty": "Medium"}},
  {{"order": 5, "question": "...", "type": "technical", "difficulty": "Medium"}},
  {{"order": 6, "question": "...", "type": "technical", "difficulty": "Hard"}},
  {{"order": 7, "question": "...", "type": "technical", "difficulty": "Hard"}},
  {{"order": 8, "question": "...", "type": "behavioral", "difficulty": "Behavioral"}},
  {{"order": 9, "question": "...", "type": "behavioral", "difficulty": "Behavioral"}},
  {{"order": 10, "question": "...", "type": "behavioral", "difficulty": "Behavioral"}}
]
"""
    response = _generate_with_fallback(contents=prompt)
    return clean_json_response(response.text)


def evaluate_answer(question: str, answer: str, resume_text: str, job_role: str) -> dict:
    """
    Evaluate a single interview answer.
    Returns: { clarity: int, relevance: int, completeness: int, overall: float, tip: str }
    """
    prompt = f"""
You are an expert technical interviewer evaluating a candidate's interview answer.

TARGET JOB ROLE: {job_role}

INTERVIEW QUESTION: {question}

CANDIDATE'S ANSWER: {answer}

CANDIDATE'S RESUME (for context): {resume_text[:2000]}

Evaluate the answer on 3 dimensions (score 1–10 each):
1. Clarity — Is the answer clear, coherent, and well-structured?
2. Relevance — Does the answer directly address the question and role requirements?
3. Completeness — Is the answer thorough with concrete technical/practical examples?

Also provide a constructive tip for improvement (1–2 sentences).

Return ONLY valid JSON in this exact format:
{{
  "clarity": <1-10>,
  "relevance": <1-10>,
  "completeness": <1-10>,
  "overall": <average of three, rounded to 1 decimal>,
  "tip": "..."
}}
"""
    response = _generate_with_fallback(contents=prompt)
    return clean_json_response(response.text)


def generate_summary(job_role: str, qa_pairs: list[dict]) -> dict:
    """
    Generate an overall performance summary after all questions are answered.
    qa_pairs: [{ "question": str, "answer": str, "score": float }]
    Returns: { overall_score: float, strengths: [str], improvements: [str], verdict: str }
    """
    qa_text = ""
    for i, qa in enumerate(qa_pairs, 1):
        qa_text += f"\nQ{i}: {qa['question']}\nAnswer: {qa['answer']}\nScore: {qa['score']}/10\n"

    prompt = f"""
You are a senior hiring manager providing final feedback after a comprehensive 10-question mock interview.

TARGET JOB ROLE: {job_role}

INTERVIEW Q&A WITH SCORES:
{qa_text}

Provide a comprehensive performance summary. Be honest, professional, and encouraging.

Return ONLY valid JSON in this exact format:
{{
  "overall_score": <average score rounded to 1 decimal>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["area to improve 1", "area to improve 2", "area to improve 3"],
  "verdict": "A 2-3 sentence overall verdict on the candidate's readiness for the role."
}}
"""
    response = _generate_with_fallback(contents=prompt)
    return clean_json_response(response.text)
