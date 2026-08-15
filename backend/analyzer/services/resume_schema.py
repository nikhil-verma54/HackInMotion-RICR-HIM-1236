RESUME_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "name": {"type": "STRING"},
        "email": {"type": "STRING"},
        "phone": {"type": "STRING"},
        "summary": {"type": "STRING"},
        "skills": {"type": "ARRAY", "items": {"type": "STRING"}},
        "education": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "degree": {"type": "STRING"},
                    "institution": {"type": "STRING"},
                    "field": {"type": "STRING"},
                    "start_year": {"type": "STRING"},
                    "end_year": {"type": "STRING"},
                },
            },
        },
        "experience": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "job_title": {"type": "STRING"},
                    "company": {"type": "STRING"},
                    "start_date": {"type": "STRING"},
                    "end_date": {"type": "STRING"},
                    "description": {"type": "STRING"},
                },
            },
        },
        "projects": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "name": {"type": "STRING"},
                    "description": {"type": "STRING"},
                    "technologies": {"type": "ARRAY", "items": {"type": "STRING"}},
                },
            },
        },
        "certifications": {"type": "ARRAY", "items": {"type": "STRING"}},
        "achievements": {"type": "ARRAY", "items": {"type": "STRING"}},
    },
}
