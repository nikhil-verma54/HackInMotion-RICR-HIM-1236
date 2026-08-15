import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const POPULAR_ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Python Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Software Engineer",
];

// ─────────────────────────────────────────────
// Minimal SVG Icon set
// ─────────────────────────────────────────────
const Icon = {
  Bot: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="12" x="3" y="11" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" x2="8" y1="16" y2="16" />
      <line x1="16" x2="16" y1="16" y2="16" />
    </svg>
  ),
  Mic: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  ),
  MicOff: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" x2="22" y1="2" y2="22" />
      <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
      <path d="M5 10v2a7 7 0 0 0 12 5" />
      <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  ),
  Volume: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ),
  VolumeX: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </svg>
  ),
  Upload: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  ),
  FileText: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Check: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  ArrowRight: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" x2="19" y1="12" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  RotateCcw: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  ),
  Grid: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  ),
  History: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  ),
  X: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  ),
  AlertTriangle: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" x2="12" y1="9" y2="13" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  ),
};

const SpeechRecognition =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

// ─────────────────────────────────────────────
// Score helpers
// ─────────────────────────────────────────────
const scoreColor = (s) => (s >= 8 ? "#16a34a" : s >= 5 ? "#d97706" : "#dc2626");
const scoreBg = (s) => (s >= 8 ? "#f0fdf4" : s >= 5 ? "#fffbeb" : "#fef2f2");
const scoreBorder = (s) => (s >= 8 ? "#bbf7d0" : s >= 5 ? "#fef3c7" : "#fecaca");

const page = {
  minHeight: "calc(100vh - 62px)",
  background: "#f4f6fb",
  padding: "clamp(28px,5vw,52px) 16px",
};

export default function MockInterview() {
  const { djangoRequest } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState("setup");
  const [setupTab, setSetupTab] = useState("new"); // "new" | "history"

  // Setup state
  const [jobRole, setJobRole] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [starting, setStarting] = useState(false);
  const [setupError, setSetupError] = useState("");

  // History state
  const [pastSessions, setPastSessions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingDetailId, setLoadingDetailId] = useState(null);

  // Voice state
  const [voiceMode, setVoiceMode] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Interview state
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [allFeedback, setAllFeedback] = useState([]);

  // Summary state
  const [summary, setSummary] = useState(null);
  const [finishing, setFinishing] = useState(false);

  // ── Fetch past interview sessions ─────────────
  const fetchPastSessions = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const data = await djangoRequest("/api/resume/interview/history/");
      if (data && data.interviews) {
        setPastSessions(data.interviews);
      }
    } catch (err) {
      console.error("Failed to load interview history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [djangoRequest]);

  useEffect(() => {
    fetchPastSessions();
  }, [fetchPastSessions]);

  // ── View a past interview in full detail ──────
  const handleViewPastDetail = async (id) => {
    setLoadingDetailId(id);
    try {
      const data = await djangoRequest(`/api/resume/interview/${id}/detail/`);
      if (data && data.summary) {
        setJobRole(data.job_role || "Interview");
        setSummary(data.summary);
        // Map questions to feedback array
        const feedbackList = (data.questions || []).map((q) => ({
          question: q.question,
          feedback: q.feedback || {
            overall: q.score || 0,
            tip: q.user_answer ? "Recorded answer evaluated." : "Question skipped.",
          },
        }));
        setAllFeedback(feedbackList);
        setStep("summary");
      }
    } catch (err) {
      console.error("Failed to fetch interview detail:", err);
    } finally {
      setLoadingDetailId(null);
    }
  };

  // ── TTS ──────────────────────────────────────
  const speakText = useCallback((text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.98;
    u.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const v =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha"))
      ) || voices.find((v) => v.lang.startsWith("en"));
    if (v) u.voice = v;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  }, []);

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // ── STT ──────────────────────────────────────
  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      alert("Voice recognition requires Chrome or Edge.");
      return;
    }
    stopSpeaking();
    try {
      if (recognitionRef.current) recognitionRef.current.abort();
      const r = new SpeechRecognition();
      r.continuous = true;
      r.interimResults = true;
      r.lang = "en-US";
      r.onstart = () => setIsListening(true);
      r.onresult = (e) => {
        let t = "";
        for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + " ";
        setAnswer(t.trim());
      };
      r.onerror = (e) => {
        if (e.error === "not-allowed") alert("Microphone permission denied.");
        setIsListening(false);
      };
      r.onend = () => setIsListening(false);
      recognitionRef.current = r;
      r.start();
    } catch {
      setIsListening(false);
    }
  }, [stopSpeaking]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  useEffect(() => {
    if (step === "interview" && voiceMode && questions[currentIdx]?.question && !feedback) {
      const t = setTimeout(() => speakText(questions[currentIdx].question), 350);
      return () => clearTimeout(t);
    }
  }, [step, currentIdx, voiceMode, questions, feedback, speakText]);

  useEffect(
    () => () => {
      stopSpeaking();
      stopListening();
    },
    [stopSpeaking, stopListening]
  );

  const handleFileSelect = (f) => {
    if (!f) return;
    const n = f.name.toLowerCase();
    if (!n.endsWith(".pdf") && !n.endsWith(".docx")) {
      setSetupError("Please select a PDF or DOCX file.");
      return;
    }
    setFile(f);
    setSetupError("");
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  }, []);

  const handleStart = async () => {
    setSetupError("");
    if (!jobRole.trim()) {
      setSetupError("Please select or enter a target job role.");
      return;
    }
    if (!file) {
      setSetupError("Please upload your resume (PDF or DOCX).");
      return;
    }
    setStarting(true);
    try {
      const fd = new FormData();
      fd.append("job_role", jobRole.trim());
      fd.append("file", file);
      const data = await djangoRequest("/api/resume/interview/start/", {
        method: "POST",
        body: fd,
      });
      if (!data?.interview_id) throw new Error(data?.error || "Failed to start session.");
      setInterviewId(data.interview_id);
      setQuestions(data.questions || []);
      setCurrentIdx(0);
      setAnswer("");
      setFeedback(null);
      setAllFeedback([]);
      setStep("interview");
    } catch (err) {
      setSetupError(err.message || "Failed to initialize interview.");
    } finally {
      setStarting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    stopListening();
    stopSpeaking();
    if (!answer.trim() || answer.trim().length < 5) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const q = questions[currentIdx];
      const data = await djangoRequest(`/api/resume/interview/${interviewId}/answer/`, {
        method: "POST",
        body: { question_id: q.id, answer: answer.trim() },
      });
      if (!data?.feedback) throw new Error(data?.error || "Failed to evaluate answer.");
      setFeedback(data.feedback);
      setAllFeedback((prev) => [...prev, { question: q.question, feedback: data.feedback }]);
    } catch (err) {
      setFeedback({ error: err.message || "Evaluation error." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    stopSpeaking();
    stopListening();
    if (currentIdx === questions.length - 1) {
      await handleFinish();
    } else {
      setCurrentIdx((i) => i + 1);
      setAnswer("");
      setFeedback(null);
    }
  };

  const handleFinish = async () => {
    stopSpeaking();
    stopListening();
    setFinishing(true);
    try {
      const data = await djangoRequest(`/api/resume/interview/${interviewId}/finish/`, {
        method: "POST",
      });
      if (!data?.summary) throw new Error(data?.error || "Summary failed.");
      setSummary(data.summary);
      setStep("summary");
      fetchPastSessions(); // Refresh history
      if (voiceMode && data.summary?.verdict)
        speakText("Interview complete. " + data.summary.verdict);
    } catch (err) {
      setSummary({ error: err.message || "Summary failed." });
      setStep("summary");
    } finally {
      setFinishing(false);
    }
  };

  const resetAll = () => {
    stopSpeaking();
    stopListening();
    setStep("setup");
    setJobRole("");
    setFile(null);
    setInterviewId(null);
    setQuestions([]);
    setCurrentIdx(0);
    setAnswer("");
    setFeedback(null);
    setAllFeedback([]);
    setSummary(null);
    fetchPastSessions();
  };

  // ══════════════════════════════════════════════
  // SETUP SCREEN (NEW INTERVIEW + HISTORY TABS)
  // ══════════════════════════════════════════════
  if (step === "setup") {
    return (
      <div style={{ ...page, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div
          className="card-enter"
          style={{
            width: "100%",
            maxWidth: 640,
            background: "#ffffff",
            borderRadius: 20,
            padding: "clamp(24px,5vw,40px)",
            boxShadow: "0 4px 24px rgba(15,23,42,0.07)",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Top Bar with Brand & Tab Switcher */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "linear-gradient(135deg,#4f46e5,#6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                <Icon.Bot width="18" height="18" />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                    color: "#0f172a",
                    margin: "0 0 2px",
                    letterSpacing: "-0.03em",
                  }}
                >
                  AI Mock Interview
                </h1>
                <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
                  Resume-based questions & AI evaluation
                </p>
              </div>
            </div>

            {/* Tab Pill Switcher */}
            <div
              style={{
                display: "flex",
                background: "#f1f5f9",
                padding: 3,
                borderRadius: 10,
                border: "1px solid #e2e8f0",
              }}
            >
              <button
                type="button"
                onClick={() => setSetupTab("new")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 600,
                  border: "none",
                  background: setupTab === "new" ? "#ffffff" : "transparent",
                  color: setupTab === "new" ? "#4f46e5" : "#64748b",
                  boxShadow: setupTab === "new" ? "0 1px 4px rgba(0,0,0,0.05)" : "none",
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
              >
                New Session
              </button>
              <button
                type="button"
                onClick={() => {
                  setSetupTab("history");
                  fetchPastSessions();
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 600,
                  border: "none",
                  background: setupTab === "history" ? "#ffffff" : "transparent",
                  color: setupTab === "history" ? "#4f46e5" : "#64748b",
                  boxShadow: setupTab === "history" ? "0 1px 4px rgba(0,0,0,0.05)" : "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.18s",
                }}
              >
                <span>History</span>
                {pastSessions.length > 0 && (
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      background: setupTab === "history" ? "#eef2ff" : "#e2e8f0",
                      color: setupTab === "history" ? "#4f46e5" : "#475569",
                      padding: "2px 6px",
                      borderRadius: 99,
                    }}
                  >
                    {pastSessions.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* TAB 1: NEW INTERVIEW FORM */}
          {setupTab === "new" && (
            <div>
              {/* Voice toggle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "11px 15px",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ color: voiceMode ? "#4f46e5" : "#94a3b8" }}>
                    {voiceMode ? (
                      <Icon.Volume width="17" height="17" />
                    ) : (
                      <Icon.VolumeX width="17" height="17" />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                      Voice assistant
                    </div>
                    <div style={{ fontSize: 11.5, color: "#64748b" }}>
                      AI reads questions aloud, transcribes voice answers
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setVoiceMode((v) => !v)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 99,
                    border: `1px solid ${voiceMode ? "#c7d2fe" : "#e2e8f0"}`,
                    background: voiceMode ? "#eef2ff" : "#f1f5f9",
                    color: voiceMode ? "#4f46e5" : "#64748b",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                >
                  {voiceMode ? "Enabled" : "Muted"}
                </button>
              </div>

              {/* Job Role */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  Target job role <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Data Scientist…"
                  className="input-base"
                  style={{ fontSize: 14 }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 9 }}>
                  {POPULAR_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setJobRole(r)}
                      style={{
                        padding: "4px 11px",
                        background: jobRole === r ? "#4f46e5" : "#f1f5f9",
                        color: jobRole === r ? "#ffffff" : "#475569",
                        border: jobRole === r ? "1px solid #4f46e5" : "1px solid #e2e8f0",
                        borderRadius: 99,
                        fontSize: 11.5,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resume Upload */}
              <div style={{ marginBottom: 22 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  Resume file <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? "#4f46e5" : file ? "#a5b4fc" : "#cbd5e1"}`,
                    background: dragOver ? "#eef2ff" : file ? "#fafbff" : "#fafafa",
                    borderRadius: 14,
                    padding: "20px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                    }}
                  />
                  {file ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                      }}
                    >
                      <div style={{ color: "#4f46e5" }}>
                        <Icon.FileText width="20" height="20" />
                      </div>
                      <div style={{ textAlign: "left", flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>
                          {file.name}
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748b" }}>
                          {(file.size / 1024).toFixed(1)} KB · Ready to parse
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#94a3b8",
                          cursor: "pointer",
                          padding: 4,
                          display: "flex",
                          alignItems: "center",
                          borderRadius: 6,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                      >
                        <Icon.X width="16" height="16" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ color: "#94a3b8", display: "inline-flex", marginBottom: 6 }}>
                        <Icon.Upload width="22" height="22" />
                      </div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#334155" }}>
                        Click or drop resume file to begin
                      </div>
                      <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>
                        PDF or DOCX format
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error */}
              {setupError && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#dc2626",
                    padding: "10px 14px",
                    borderRadius: 10,
                    marginBottom: 16,
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Icon.AlertTriangle width="15" height="15" style={{ flexShrink: 0 }} />
                  {setupError}
                </div>
              )}

              <button
                onClick={handleStart}
                disabled={starting}
                className="btn-primary"
                style={{ width: "100%", padding: "12px", fontSize: 14.5, borderRadius: 11 }}
              >
                {starting ? (
                  <>
                    <span className="spinner" />
                    Generating 10 questions…
                  </>
                ) : (
                  <>
                    Start Mock Interview <Icon.ArrowRight width="16" height="16" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: INTERVIEW HISTORY LIST */}
          {setupTab === "history" && (
            <div style={{ animation: "fadeIn 0.25s ease" }}>
              {loadingHistory ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "36px 0",
                    color: "#64748b",
                    fontSize: 13.5,
                  }}
                >
                  <span className="spinner spinner-dark" style={{ marginRight: 8 }} />
                  Loading interview records…
                </div>
              ) : pastSessions.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "36px 16px",
                    background: "#f8fafc",
                    borderRadius: 14,
                    border: "1.5px dashed #cbd5e1",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "#eef2ff",
                      color: "#4f46e5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    <Icon.History width="20" height="20" />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                    No past interviews found
                  </div>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px" }}>
                    Take your first practice session to get scored feedback and track progress.
                  </p>
                  <button
                    onClick={() => setSetupTab("new")}
                    className="btn-primary"
                    style={{ padding: "8px 18px", fontSize: 13, borderRadius: 9 }}
                  >
                    Start an Interview →
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    maxHeight: 420,
                    overflowY: "auto",
                    paddingRight: 4,
                  }}
                >
                  {pastSessions.map((s) => {
                    const score =
                      s.overall_score !== null ? Number(s.overall_score).toFixed(1) : null;
                    return (
                      <div
                        key={s.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          padding: "12px 14px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          transition: "all 0.18s",
                        }}
                      >
                        {/* Left score + info */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          {score !== null ? (
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                background: scoreBg(Number(score)),
                                border: `1px solid ${scoreBorder(Number(score))}`,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 13.5,
                                  fontWeight: 800,
                                  color: scoreColor(Number(score)),
                                  lineHeight: 1,
                                }}
                              >
                                {score}
                              </div>
                              <div style={{ fontSize: 9, color: "#64748b", fontWeight: 600 }}>
                                /10
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                background: "#f1f5f9",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#94a3b8",
                                fontSize: 14,
                                flexShrink: 0,
                              }}
                            >
                              —
                            </div>
                          )}

                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                fontSize: 13.5,
                                fontWeight: 700,
                                color: "#0f172a",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {s.job_role}
                            </div>
                            <div
                              style={{
                                fontSize: 11.5,
                                color: "#64748b",
                                marginTop: 2,
                                display: "flex",
                                gap: 8,
                                flexWrap: "wrap",
                              }}
                            >
                              <span>
                                {new Date(s.created_at).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span>•</span>
                              <span>
                                {s.answered_count || 0}/{s.question_count || 10} questions
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right action button */}
                        <button
                          onClick={() => handleViewPastDetail(s.id)}
                          disabled={loadingDetailId === s.id}
                          className="btn-secondary"
                          style={{
                            padding: "6px 12px",
                            fontSize: 12,
                            borderRadius: 8,
                            flexShrink: 0,
                          }}
                        >
                          {loadingDetailId === s.id ? (
                            <span className="spinner spinner-dark" />
                          ) : (
                            "Review →"
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // INTERVIEW SCREEN
  // ══════════════════════════════════════════════
  if (step === "interview") {
    const currentQ = questions[currentIdx] || {};
    const isLast = currentIdx === questions.length - 1;

    return (
      <div style={{ ...page }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {/* Status bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: isListening ? "#ef4444" : isSpeaking ? "#4f46e5" : "#22c55e",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>
                {isListening ? "Listening…" : isSpeaking ? "AI speaking…" : "Interview in progress"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  if (voiceMode) stopSpeaking();
                  setVoiceMode((v) => !v);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12.5,
                  fontWeight: 500,
                  background: "#fff",
                  color: voiceMode ? "#4f46e5" : "#64748b",
                  border: `1px solid ${voiceMode ? "#c7d2fe" : "#e2e8f0"}`,
                  padding: "5px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                {voiceMode ? (
                  <Icon.Volume width="14" height="14" />
                ) : (
                  <Icon.VolumeX width="14" height="14" />
                )}
                Voice {voiceMode ? "on" : "off"}
              </button>
              <span
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  background: "#f1f5f9",
                  padding: "5px 10px",
                  borderRadius: 8,
                  fontWeight: 500,
                }}
              >
                {jobRole}
              </span>
            </div>
          </div>

          {/* Question card */}
          <div
            className={`card-enter ${isSpeaking ? "ai-speaking-border" : ""}`}
            style={{
              background: "#ffffff",
              borderRadius: 18,
              padding: "clamp(22px,4vw,36px)",
              boxShadow: "0 2px 16px rgba(15,23,42,0.05)",
              border: "1px solid #e2e8f0",
              marginBottom: 16,
            }}
          >
            {/* AI interviewer header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
                paddingBottom: 16,
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#4f46e5,#6366f1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  <Icon.Bot width="16" height="16" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                    AI Interviewer
                  </div>
                  {isSpeaking && (
                    <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 3 }}>
                      <span className="voice-wave-bar" style={{ animationDelay: "0s" }} />
                      <span className="voice-wave-bar" style={{ animationDelay: "0.2s" }} />
                      <span className="voice-wave-bar" style={{ animationDelay: "0.4s" }} />
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => (isSpeaking ? stopSpeaking() : speakText(currentQ.question))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12.5,
                  fontWeight: 500,
                  background: "transparent",
                  color: isSpeaking ? "#dc2626" : "#4f46e5",
                  border: "none",
                  padding: "5px 8px",
                  cursor: "pointer",
                  borderRadius: 6,
                }}
              >
                {isSpeaking ? (
                  <Icon.VolumeX width="15" height="15" />
                ) : (
                  <Icon.Volume width="15" height="15" />
                )}
                {isSpeaking ? "Stop" : "Play"}
              </button>
            </div>

            {/* Question */}
            <p
              style={{
                fontSize: "clamp(15px,2.5vw,18px)",
                fontWeight: 600,
                color: "#0f172a",
                lineHeight: 1.55,
                margin: "0 0 22px",
                letterSpacing: "-0.01em",
              }}
            >
              {currentQ.question}
            </p>

            {/* Answer area */}
            {!feedback && (
              <>
                {/* Voice control */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: isListening ? "#fef2f2" : "#f8fafc",
                    border: `1px solid ${isListening ? "#fecaca" : "#e2e8f0"}`,
                    borderRadius: 10,
                    padding: "10px 14px",
                    marginBottom: 12,
                    transition: "all 0.2s",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => (isListening ? stopListening() : startListening())}
                    className={isListening ? "mic-active" : ""}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: isListening ? "#ef4444" : "#4f46e5",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.2s",
                    }}
                    title={isListening ? "Stop recording" : "Speak your answer"}
                  >
                    {isListening ? (
                      <Icon.MicOff width="16" height="16" />
                    ) : (
                      <Icon.Mic width="16" height="16" />
                    )}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isListening ? "#dc2626" : "#334155",
                      }}
                    >
                      {isListening ? "Recording…" : "Voice input"}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#94a3b8" }}>
                      {isListening
                        ? "Speak clearly. Click again to stop."
                        : "Click mic to speak your answer"}
                    </div>
                  </div>
                  {isListening && (
                    <button
                      type="button"
                      onClick={stopListening}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#dc2626",
                        background: "#fee2e2",
                        border: "none",
                        borderRadius: 7,
                        padding: "4px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Done
                    </button>
                  )}
                </div>

                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type or speak your answer…"
                  rows={5}
                  className="input-base"
                  style={{ resize: "vertical", lineHeight: 1.6, marginBottom: 12, fontSize: 14 }}
                />

                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{answer.length} characters</span>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={submitting || answer.trim().length < 5}
                    className="btn-primary"
                    style={{ padding: "9px 20px", fontSize: 13.5, borderRadius: 9 }}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner" />
                        Evaluating…
                      </>
                    ) : (
                      "Submit Answer"
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Feedback */}
            {feedback && !feedback.error && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  {[
                    { label: "Clarity", val: feedback.clarity },
                    { label: "Relevance", val: feedback.relevance },
                    { label: "Completeness", val: feedback.completeness },
                    { label: "Overall", val: feedback.overall },
                  ].map(({ label, val }) => (
                    <div
                      key={label}
                      style={{
                        background: scoreBg(val),
                        border: `1px solid ${scoreBorder(val)}`,
                        borderRadius: 10,
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: scoreColor(val),
                          lineHeight: 1,
                        }}
                      >
                        {val}
                        <span style={{ fontSize: 10, fontWeight: 600 }}>/10</span>
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#64748b", fontWeight: 500, marginTop: 3 }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "12px 14px",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#334155",
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Feedback
                  </div>
                  <div style={{ color: "#475569", fontSize: 13.5, lineHeight: 1.6 }}>
                    {feedback.tip}
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  disabled={finishing}
                  className="btn-primary"
                  style={{ width: "100%", padding: "12px", fontSize: 14, borderRadius: 11 }}
                >
                  {finishing ? (
                    <>
                      <span className="spinner" />
                      Generating summary…
                    </>
                  ) : isLast ? (
                    <>
                      Finish Interview <Icon.Check width="15" height="15" />
                    </>
                  ) : (
                    <>
                      Next Question <Icon.ArrowRight width="15" height="15" />
                    </>
                  )}
                </button>
              </div>
            )}

            {feedback?.error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontSize: 13,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Icon.AlertTriangle width="15" height="15" style={{ flexShrink: 0 }} />
                {feedback.error}
              </div>
            )}
          </div>

          {/* Progress dots */}
          {questions.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
                marginTop: 4,
              }}
            >
              {questions.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === currentIdx ? 20 : 7,
                    height: 7,
                    borderRadius: 99,
                    background:
                      i < currentIdx ? "#4f46e5" : i === currentIdx ? "#4f46e5" : "#e2e8f0",
                    opacity: i === currentIdx ? 1 : i < currentIdx ? 0.6 : 0.4,
                    transition: "all 0.25s",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // SUMMARY SCREEN
  // ══════════════════════════════════════════════
  if (step === "summary") {
    if (summary?.error) {
      return (
        <div style={{ ...page, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 36,
              maxWidth: 440,
              textAlign: "center",
              border: "1px solid #e2e8f0",
            }}
          >
            <p style={{ color: "#dc2626", fontSize: 14, marginBottom: 16 }}>⚠️ {summary.error}</p>
            <button
              onClick={resetAll}
              className="btn-primary"
              style={{ padding: "10px 24px", fontSize: 14, borderRadius: 10 }}
            >
              Back to Interviews
            </button>
          </div>
        </div>
      );
    }

    const overall = summary?.overall_score || 0;

    return (
      <div style={{ ...page }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }} className="card-enter">
          {/* Hero score */}
          <div
            style={{
              background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
              borderRadius: 20,
              padding: "clamp(28px,5vw,48px)",
              textAlign: "center",
              marginBottom: 18,
              color: "#fff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
              }}
            />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  opacity: 0.6,
                  marginBottom: 12,
                }}
              >
                Interview Evaluation
              </div>
              <div
                style={{
                  fontSize: "clamp(52px,10vw,80px)",
                  fontWeight: 900,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {overall}
              </div>
              <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 16 }}>out of 10</div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 99,
                  padding: "5px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {jobRole}
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: "22px 24px",
              marginBottom: 16,
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                color: "#64748b",
                margin: "0 0 10px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Assessment Verdict
            </h3>
            <p style={{ color: "#0f172a", lineHeight: 1.7, margin: 0, fontSize: 14.5 }}>
              {summary?.verdict}
            </p>
          </div>

          {/* Strengths & improvements */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: 14,
                padding: "20px 22px",
                border: "1px solid #bbf7d0",
              }}
            >
              <h4
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#15803d",
                  margin: "0 0 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <Icon.Check width="14" height="14" /> Key Strengths
              </h4>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {(summary?.strengths || []).map((s, i) => (
                  <li
                    key={i}
                    style={{ color: "#374151", fontSize: 13.5, lineHeight: 1.65, marginBottom: 5 }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div
              style={{
                background: "#ffffff",
                borderRadius: 14,
                padding: "20px 22px",
                border: "1px solid #fed7aa",
              }}
            >
              <h4
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#c2410c",
                  margin: "0 0 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <Icon.ArrowRight width="14" height="14" /> Growth Areas
              </h4>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {(summary?.improvements || []).map((s, i) => (
                  <li
                    key={i}
                    style={{ color: "#374151", fontSize: 13.5, lineHeight: 1.65, marginBottom: 5 }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question breakdown */}
          {allFeedback.length > 0 && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: 16,
                padding: "22px 24px",
                marginBottom: 20,
                border: "1px solid #e2e8f0",
              }}
            >
              <h3
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: "#64748b",
                  margin: "0 0 14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Question Breakdown
              </h3>
              {allFeedback.map((item, i) => (
                <div
                  key={i}
                  style={{
                    paddingBottom: 12,
                    marginBottom: 12,
                    borderBottom: i < allFeedback.length - 1 ? "1px solid #f4f6fb" : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                      marginBottom: 4,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13.5,
                        color: "#0f172a",
                        margin: 0,
                        fontWeight: 500,
                        lineHeight: 1.45,
                        flex: 1,
                      }}
                    >
                      {item.question}
                    </p>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: 13.5,
                        color: scoreColor(item.feedback?.overall || 0),
                        flexShrink: 0,
                      }}
                    >
                      {item.feedback?.overall || 0}/10
                    </span>
                  </div>
                  <p style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.55 }}>
                    {item.feedback?.tip}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={resetAll}
              className="btn-primary"
              style={{
                flex: 1,
                minWidth: 160,
                padding: "12px",
                fontSize: 14,
                borderRadius: 11,
                gap: 7,
              }}
            >
              <Icon.RotateCcw width="15" height="15" /> Back to Interviews
            </button>
            <button
              onClick={() => {
                stopSpeaking();
                stopListening();
                navigate("/dashboard");
              }}
              className="btn-secondary"
              style={{
                flex: 1,
                minWidth: 160,
                padding: "12px",
                fontSize: 14,
                borderRadius: 11,
                gap: 7,
              }}
            >
              <Icon.Grid width="15" height="15" /> Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
