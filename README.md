# Vettora — AI-Powered Resume Analyzer & Voice Mock Interviewer

> **Land more job interviews with intelligent ATS optimization, skill gap insights, and realistic voice-enabled mock interviews.**

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| 🖥️ **Frontend (Vercel)** | [hack-in-motion-ricr-him-1236-b8so-two.vercel.app](https://hack-in-motion-ricr-him-1236-b8so-two.vercel.app) |
| ⚙️ **Backend API (Render)** | [hackinmotion-ricr-him-1236.onrender.com](https://hackinmotion-ricr-him-1236.onrender.com) |

### 🔑 Demo Login Credentials

For quick evaluation, you can log in using these test credentials (or sign up with any email/Google account):

| Field | Value |
|---|---|
| **Email** | `nikkcr3141@gmail.com` |
| **Password** | `NikhiL@54` |

> **Note**: The backend is hosted on Render's free tier and may take **30–60 seconds to wake up** on first request after inactivity.

---

## 📌 Project Overview

**Vettora** is a comprehensive career readiness platform built to help candidates navigate modern automated hiring systems (ATS) and excel in technical interviews. 

Over 75% of resumes are filtered out before reaching a human recruiter due to non-standard formatting, missing keywords, or unquantified bullet points. Vettora solves this by providing:
1. **In-depth ATS & Skill Gap Analysis**: Detailed scoring, section audits, and job description matching.
2. **AI Voice Mock Interviews**: Tailored 10-question interview sessions (7 technical + 3 behavioral) generated directly from your resume, featuring interactive voice dictation and instant AI feedback.

---

## ✨ Main Features & Capabilities

### 📄 1. Smart Resume Evaluation & ATS Audit
- **Format & Structure Checks**: Detects text extractability, contact information, section hierarchies, and layout readability.
- **Measurable Achievement Scoring**: Flags vague descriptions and recommends quantifiable impact statements using strong action verbs.
- **Job Description Matcher**: Compares your resume against any job posting to surface exact matching skills, partial skills, and missing qualifications.

### 🎙️ 2. Voice-Enabled AI Mock Interviewer
- **Personalized Questions**: Generates 10 targeted questions (3 behavioral + 7 technical tiered from easy to hard) based on your uploaded resume and target role.
- **Natural Voice Assistant**:
  - **Text-to-Speech (TTS)**: The AI interviewer reads each question aloud in natural speech with animated voice waves.
  - **Speech-to-Text (STT)**: Dictate answers in real-time using live voice recognition.
- **Instant Answer Feedback**: Evaluates answers across **Clarity**, **Relevance**, and **Completeness** with actionable tips.
- **Comprehensive Summary**: Delivers an overall rating out of 10, an assessment verdict, key strengths, growth areas, and a full question-by-question review.

### 📊 3. Interactive User Dashboard & History
- **Performance Highlights**: Displays your **Highest Score** and **Lowest Score** alongside the analyzed resume names.
- **Past Resume Reports**: View, re-inspect, or delete past detailed analysis reports.
- **Interview History & Detailed Review**: Review past mock interview sessions, replay scores, and track your interview progress over time.

---

## 🛠️ Tech Stack & Database

### 💻 Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router 7
- **Styling**: TailwindCSS 4 + Custom Design Tokens (Vanilla CSS variables)
- **Voice APIs**: Web Speech API (`SpeechSynthesis` & `webkitSpeechRecognition`)
- **Authentication**: Firebase Authentication (Email/Password + Google OAuth)

### ⚙️ Backend
- **Framework**: Python 3.11+ / Django 6.1 + Django REST Framework (DRF)
- **AI Engine**: Google Gemini API (`google-genai` / `gemini-flash-latest` with multi-model fallback)
- **Document Parsing**: PyMuPDF (`fitz`) for PDF and `python-docx` for Word documents
- **CORS & Auth**: `django-cors-headers`, Firebase Admin SDK (`firebase_admin`)

### 🗄️ Database Models
- **`UserProfile`**: Linked to Firebase UID, storing display name, email, and authentication timestamps.
- **`ResumeAnalysis`**: Stores resume text, overall score, section breakdown, job match matrix, strengths, and recommendations.
- **`MockInterview`**: Stores interview sessions, target role, overall rating, verdict, strengths, and growth areas.
- **`InterviewQuestion`**: Stores each generated question, category, difficulty, candidate answer, individual scores, and feedback.

---

## 🔄 Application Workflow

```
[User Signs Up / In]
       │
       ├──► [Dashboard]
       │       ├── Upload Resume (.pdf / .docx) + Target Job Description
       │       ├── Instant Analysis: ATS Score, Skill Gap, Bullet Improvements
       │       └── Review Past Scans & Highest/Lowest Score Highlights
       │
       └──► [Mock Interview]
               ├── Choose Target Role + Upload Resume
               ├── AI Generates 10 Custom Questions (7 Tech + 3 Behavioral)
               ├── Voice Interaction (AI speaks questions, user speaks answers)
               ├── Real-time Answer Feedback (Clarity, Relevance, Completeness)
               └── Performance Summary & Session Review History
```

---

## 🚀 How to Run Locally

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher) & **npm**
- **Python** (v3.10 or higher) & **pip**
- **Git**
- A free **Google Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))
- A free **Firebase Project** for authentication

---

### 2. Clone the Repository
```bash
git clone https://github.com/nikhil-verma54/HackInMotion-RICR-HIM-1236.git
cd HackInMotion-RICR-HIM-1236
```

---

### 3. Backend Setup

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up Environment Variables**:
   Create a `.env` file inside the `backend/` directory:
   ```env
   DJANGO_SECRET_KEY=your_django_secret_key
   DJANGO_DEBUG=True
   GEMINI_API_KEY=your_google_gemini_api_key
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
   DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```

5. **Apply Migrations**:
   ```bash
   python manage.py migrate
   ```

6. **Start the Backend Server**:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   *The Django API will be running at `http://127.0.0.1:8000/`.*

---

### 4. Frontend Setup

1. **Open a new terminal and navigate to `frontend`**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase Environment Variables**:
   Create a `.env` file inside the `frontend/` directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```
   *The application will be live at `http://localhost:5173/`.*

---

## 📡 API Reference Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/verify/` | `POST` | Authenticate user with Firebase token |
| `/api/auth/logout/` | `POST` | Log out and clear session |
| `/api/resume/upload/` | `POST` | Upload and parse resume file |
| `/api/resume/analyze/` | `POST` | Analyze resume against optional job description |
| `/api/resume/dashboard/` | `GET` | Retrieve user stats, scores, and past analyses |
| `/api/resume/history/<id>/` | `GET` / `DELETE` | View details or remove a past scan |
| `/api/resume/interview/start/` | `POST` | Generate questions and initiate interview session |
| `/api/resume/interview/<id>/answer/` | `POST` | Evaluate answer for a specific question |
| `/api/resume/interview/<id>/finish/` | `POST` | Compute final evaluation summary and verdict |
| `/api/resume/interview/history/` | `GET` | List past mock interview sessions |
| `/api/resume/interview/<id>/detail/` | `GET` | Full review with all questions, answers, and tips |

---

## 📄 License & Attribution
Developed with ❤️ for **HackInMotion**. Feel free to contribute, open issues, and submit pull requests!