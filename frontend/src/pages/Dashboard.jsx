import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ============================================================
// HELPER: Score colour & labels
// ============================================================
function scoreColor(score) {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#4f46e5";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function scoreLabel(score) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Work";
  return "Critical Gaps";
}

// ============================================================
// CIRCULAR SCORE RING (LIGHT THEME)
// ============================================================
function ScoreRing({ score, size = 135, strokeWidth = 10, label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </svg>
      <div style={{ position: "absolute", textAlign: "center" }}>
        <div style={{ fontSize: size > 100 ? 28 : 17, fontWeight: 800, color, lineHeight: 1 }}>
          {Math.round(score)}
        </div>
        {label && (
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginTop: 4 }}>{label}</div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MINI SCORE BAR
// ============================================================
function ScoreBar({ label, score, explanation }) {
  const [expanded, setExpanded] = useState(false);
  const color = scoreColor(score);

  return (
    <div
      className="card-base card-hover"
      style={{ padding: "14px 18px", cursor: "pointer", background: "#ffffff" }}
      onClick={() => setExpanded((v) => !v)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
              {label}
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color }}>
              {Math.round(score)}%
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${score}%`,
                background: color,
              }}
            />
          </div>
        </div>
        <span style={{ fontSize: 13, color: "#94a3b8", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}>▾</span>
      </div>
      {expanded && explanation && (
        <p style={{ marginTop: 10, fontSize: 12, color: "#64748b", lineHeight: 1.6, borderTop: "1px solid #f1f5f9", paddingTop: 8, margin: "10px 0 0" }}>
          {explanation}
        </p>
      )}
    </div>
  );
}

// ============================================================
// SKILL BADGE
// ============================================================
function SkillBadge({ skill, status }) {
  const cls =
    status?.toLowerCase() === "matched"
      ? "skill-matched"
      : status?.toLowerCase() === "partial"
      ? "skill-partial"
      : "skill-missing";

  return (
    <span
      className={cls}
      style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}
    >
      {skill}
    </span>
  );
}

// ============================================================
// LIST SECTION
// ============================================================
function ListSection({ title, items, icon, bg, border, textColor }) {
  if (!items?.length) return null;
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: "20px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: textColor, margin: 0 }}>{title}</h4>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: textColor, lineHeight: 1.6 }}>
            <span style={{ flexShrink: 0 }}>•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCORE_LABELS = {
  ats_compatibility: "ATS Compatibility",
  skills_quality: "Skills Quality",
  experience_quality: "Experience Quality",
  project_quality: "Project Quality",
  achievement_impact: "Achievement Impact",
  education_certifications: "Education & Certifications",
  structure_completeness: "Structure & Completeness",
  writing_quality: "Writing Quality",
  technical_depth: "Technical Depth",
  career_relevance: "Career Relevance",
};

// ============================================================
// DASHBOARD
// ============================================================
export default function Dashboard() {
  const { user, logout, djangoRequest } = useAuth();
  const navigate = useNavigate();

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState(null);
  const [pastAnalyses, setPastAnalyses] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Interview history state
  const [pastInterviews, setPastInterviews] = useState([]);
  const [loadingInterviews, setLoadingInterviews] = useState(false);

  // Upload & Active Scan State
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [activeAnalysisTitle, setActiveAnalysisTitle] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const fileInputRef = useRef(null);

  // Fetch Dashboard & Past Analyses
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoadingDashboard(true);
      const res = await djangoRequest("/api/resume/dashboard/");
      if (res && res.success) {
        setDashboardData(res);
        setPastAnalyses(res.past_analyses || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoadingDashboard(false);
    }
  }, [djangoRequest]);

  // Fetch interview history
  const fetchInterviewHistory = useCallback(async () => {
    try {
      setLoadingInterviews(true);
      const res = await djangoRequest("/api/resume/interview/history/");
      if (res && res.interviews) {
        setPastInterviews(res.interviews);
      }
    } catch (err) {
      console.error("Failed to load interview history:", err);
    } finally {
      setLoadingInterviews(false);
    }
  }, [djangoRequest]);

  useEffect(() => {
    fetchDashboardData();
    fetchInterviewHistory();
  }, [fetchDashboardData, fetchInterviewHistory]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.match(/\.(pdf|docx)$/i)) {
      setError("Only PDF and DOCX files are supported.");
      return;
    }
    setFile(f);
    setError("");
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a resume file first.");
      return;
    }
    setError("");
    setAnalyzing(true);
    setActiveAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      if (jobDescription.trim()) {
        formData.append("job_description", jobDescription.trim());
      }

      const data = await djangoRequest("/api/resume/analyze/", {
        method: "POST",
        body: formData,
      });

      if (data.success) {
        setActiveAnalysis(data.analysis);
        setActiveAnalysisTitle(file.name);
        setActiveTab("overview");
        fetchDashboardData(); // Refresh history & stats
      } else {
        setError(data.error || "Analysis failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Failed to analyze resume.");
    } finally {
      setAnalyzing(false);
    }
  };

  // View past analysis from history
  const handleViewPastAnalysis = async (analysisId) => {
    setError("");
    try {
      const res = await djangoRequest(`/api/resume/history/${analysisId}/`);
      if (res && res.success) {
        setActiveAnalysis(res.analysis);
        setActiveAnalysisTitle(res.filename);
        setActiveTab("overview");
        window.scrollTo({ top: 400, behavior: "smooth" });
      }
    } catch (err) {
      setError("Could not load past analysis details.");
    }
  };

  // Delete past analysis
  const handleDeletePastAnalysis = async (e, analysisId) => {
    e.stopPropagation();
    try {
      const res = await djangoRequest(`/api/resume/history/${analysisId}/`, {
        method: "DELETE",
      });
      if (res && res.success) {
        setPastAnalyses((prev) => prev.filter((item) => item.id !== analysisId));
        if (activeAnalysis && activeAnalysis.id === analysisId) {
          setActiveAnalysis(null);
        }
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Failed to delete analysis:", err);
    }
  };

  const avatarUrl = user?.photoURL;
  const displayName = dashboardData?.user?.name || user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", background: "#f8fafc", color: "#0f172a" }}>

      {/* ── MAIN CONTAINER ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 60px" }}>

        {/* ── USER STATS OVERVIEW ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
          <div className="card-base" style={{ padding: "20px 22px", background: "#ffffff" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Account Profile
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
              {displayName}
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              {user?.email}
            </div>
          </div>

          <div className="card-base" style={{ padding: "20px 22px", background: "#ffffff" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Total Resumes Scanned
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#4f46e5", marginTop: 4 }}>
              {dashboardData?.stats?.total_scans ?? 0}
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              Saved in history
            </div>
          </div>

          <div className="card-base" style={{ padding: "20px 22px", background: "#ffffff" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Highest Score
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981", marginTop: 4 }}>
              {dashboardData?.stats?.highest_score !== null && dashboardData?.stats?.highest_score !== undefined
                ? `${dashboardData.stats.highest_score}%`
                : "—"}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                marginTop: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={dashboardData?.stats?.highest_resume_name || "No scans yet"}
            >
              {dashboardData?.stats?.highest_resume_name || "No scans yet"}
            </div>
          </div>

          <div className="card-base" style={{ padding: "20px 22px", background: "#ffffff" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Lowest Score
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b", marginTop: 4 }}>
              {dashboardData?.stats?.lowest_score !== null && dashboardData?.stats?.lowest_score !== undefined
                ? `${dashboardData.stats.lowest_score}%`
                : "—"}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                marginTop: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={dashboardData?.stats?.lowest_resume_name || "No scans yet"}
            >
              {dashboardData?.stats?.lowest_resume_name || "No scans yet"}
            </div>
          </div>
        </div>

        {/* ── UPLOAD NEW SCAN ── */}
        <div className="card-base" style={{ padding: "30px", marginBottom: 28, background: "#ffffff" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" }}>
            Scan a Resume
          </h2>

          <div
            className={`upload-zone${dragOver ? " drag-over" : ""}`}
            style={{ padding: "32px 20px", textAlign: "center", marginBottom: 18 }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {file ? (
              <div>
                <div style={{ fontSize: 34, marginBottom: 6 }}>📄</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{file.name}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {(file.size / 1024).toFixed(1)} KB · Click to change
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 38, marginBottom: 8 }}>📁</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
                  Drop your resume file here, or <span style={{ color: "#4f46e5" }}>browse</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  PDF and DOCX formats supported
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Target Job Description <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job requirements for exact keyword matching..."
              rows={3}
              style={{
                width: "100%",
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#0f172a",
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                padding: "11px 14px",
                borderRadius: 10,
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            disabled={analyzing || !file}
            onClick={handleAnalyze}
            style={{ width: "100%", padding: "13px", fontSize: 15 }}
          >
            {analyzing ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid #ffffff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
                Analyzing Resume...
              </span>
            ) : (
              "Analyze Resume & Save Report"
            )}
          </button>
        </div>

        {/* ── ACTIVE ANALYSIS REPORT VIEW ── */}
        {activeAnalysis && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Analysis Report: <span style={{ color: "#4f46e5" }}>{activeAnalysisTitle}</span>
              </h2>
              <button
                onClick={() => setActiveAnalysis(null)}
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  color: "#475569",
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close Report ✕
              </button>
            </div>

            {/* Top Score Summary */}
            <div
              className="card-base"
              style={{
                padding: "26px",
                marginBottom: 20,
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 28,
                alignItems: "center",
                background: "#ffffff",
              }}
            >
              <div style={{ textAlign: "center", minWidth: 135 }}>
                <ScoreRing score={activeAnalysis.overall_score} size={135} strokeWidth={11} label="Overall Score" />
                <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: scoreColor(activeAnalysis.overall_score) }}>
                  {scoreLabel(activeAnalysis.overall_score)}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", letterSpacing: 1 }}>
                  Executive Summary
                </span>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "6px 0 0" }}>
                  {activeAnalysis.summary}
                </p>

                {activeAnalysis.job_match?.applicable && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                      Target Match: <span style={{ color: "#4f46e5" }}>{activeAnalysis.job_match.match_score}%</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {activeAnalysis.job_match.explanation}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
              {[
                { id: "overview", label: "Score Breakdown" },
                { id: "strengths", label: "Strengths & Weaknesses" },
                { id: "skills", label: "Skill Analysis" },
                ...(activeAnalysis.job_match?.applicable ? [{ id: "jobmatch", label: "Job Match Details" }] : []),
                { id: "suggestions", label: "Actionable Suggestions" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === "overview" && activeAnalysis.scores && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {Object.entries(activeAnalysis.scores).map(([key, value]) => (
                  <ScoreBar
                    key={key}
                    label={SCORE_LABELS[key] || key}
                    score={value}
                    explanation={activeAnalysis.score_explanations?.[key]}
                  />
                ))}
              </div>
            )}

            {/* Tab: Strengths & Weaknesses */}
            {activeTab === "strengths" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 }}>
                <ListSection
                  title="Key Strengths"
                  items={activeAnalysis.strengths}
                  icon="💪"
                  bg="#f0fdf4"
                  border="#bbf7d0"
                  textColor="#15803d"
                />
                <ListSection
                  title="Areas for Improvement"
                  items={activeAnalysis.weaknesses}
                  icon="⚠️"
                  bg="#fffbeb"
                  border="#fef3c7"
                  textColor="#b45309"
                />
                {activeAnalysis.missing_skills?.length > 0 && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <ListSection
                      title="Missing Critical Skills"
                      items={activeAnalysis.missing_skills}
                      icon="🔍"
                      bg="#fef2f2"
                      border="#fecaca"
                      textColor="#b91c1c"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Tab: Skill Analysis */}
            {activeTab === "skills" && activeAnalysis.skill_analysis?.length > 0 && (
              <div className="card-base" style={{ padding: 22, background: "#ffffff" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 14px" }}>
                  Skill Evaluation Matrix
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {activeAnalysis.skill_analysis.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "180px 100px 1fr",
                        gap: 16,
                        alignItems: "center",
                        padding: "12px 14px",
                        background: "#f8fafc",
                        borderRadius: 10,
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{s.skill}</span>
                      <SkillBadge skill={s.status} status={s.status} />
                      <span style={{ fontSize: 13, color: "#64748b" }}>{s.evidence}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Job Match */}
            {activeTab === "jobmatch" && activeAnalysis.job_match?.applicable && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
                <div className="card-base" style={{ padding: 18, background: "#ffffff" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#166534", marginBottom: 10 }}>
                    Matched Skills
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {activeAnalysis.job_match.matched_skills?.map((s, i) => (
                      <SkillBadge key={i} skill={s} status="matched" />
                    ))}
                  </div>
                </div>

                <div className="card-base" style={{ padding: 18, background: "#ffffff" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 10 }}>
                    Partial Skills
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {activeAnalysis.job_match.partial_skills?.map((s, i) => (
                      <SkillBadge key={i} skill={s} status="partial" />
                    ))}
                  </div>
                </div>

                <div className="card-base" style={{ padding: 18, background: "#ffffff" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#991b1b", marginBottom: 10 }}>
                    Missing Required Skills
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {activeAnalysis.job_match.missing_required_skills?.map((s, i) => (
                      <SkillBadge key={i} skill={s} status="missing" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Suggestions */}
            {activeTab === "suggestions" && (
              <div className="card-base" style={{ padding: 22, background: "#ffffff" }}>
                <ListSection
                  title="Recommended Action Items"
                  items={activeAnalysis.suggestions}
                  icon="💡"
                  bg="#f5f3ff"
                  border="#ddd6fe"
                  textColor="#6d28d9"
                />
              </div>
            )}
          </div>
        )}

        {/* ── PAST ANALYSES HISTORY ── */}
        <div className="card-base" style={{ padding: "26px", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Past Resume Analyses
            </h2>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              {pastAnalyses.length} scan{pastAnalyses.length === 1 ? "" : "s"} saved
            </span>
          </div>

          {loadingDashboard ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: "#64748b", fontSize: 14 }}>
              Loading your past resume analyses...
            </div>
          ) : pastAnalyses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 0", background: "#f8fafc", borderRadius: 12, border: "1px dashed #cbd5e1" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>No past analyses yet</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                Upload your resume above to generate and save your first detailed report.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pastAnalyses.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleViewPastAnalysis(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#c7d2fe";
                    e.currentTarget.style.background = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 800,
                        color: scoreColor(item.overall_score),
                      }}
                    >
                      {item.overall_score}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                        {item.filename}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                        {new Date(item.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {item.has_job_description && " · With Job Description"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#4f46e5" }}>
                      View Report →
                    </span>
                    <button
                      onClick={(e) => handleDeletePastAnalysis(e, item.id)}
                      title="Delete scan"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        fontSize: 15,
                        padding: "4px 8px",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── MOCK INTERVIEW SECTION ── */}
        <div style={{ marginTop: 40 }}>
          {/* Section header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ fontSize: "clamp(18px,3vw,22px)", fontWeight: 800, color: "#0f172a", margin: 0 }}>🎙️ Mock Interviews</h2>
              <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0" }}>AI-powered interview practice tailored to your resume</p>
            </div>
            <button
              onClick={() => navigate("/interview")}
              style={{ padding: "10px 22px", background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              ＋ Start New Interview
            </button>
          </div>

          {loadingInterviews ? (
            <div style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>Loading interview history…</div>
          ) : pastInterviews.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "clamp(28px,5vw,48px)", textAlign: "center", border: "1.5px dashed #c7d2fe" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎙️</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>No interviews yet</h3>
              <p style={{ color: "#64748b", margin: "0 0 20px", fontSize: 14 }}>Practice answering interview questions and get instant AI feedback</p>
              <button
                onClick={() => navigate("/interview")}
                style={{ padding: "12px 28px", background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
              >
                Start Your First Interview →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pastInterviews.map((iv) => {
                const ivScore = iv.overall_score !== null ? Number(iv.overall_score).toFixed(1) : null;
                const ivScoreColor = ivScore >= 7 ? "#16a34a" : ivScore >= 5 ? "#d97706" : "#dc2626";
                const ivScoreBg = ivScore >= 7 ? "#dcfce7" : ivScore >= 5 ? "#fef3c7" : "#fee2e2";
                return (
                  <div
                    key={iv.id}
                    className="card-base card-hover"
                    style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", cursor: "default" }}
                  >
                    {/* Score badge */}
                    {ivScore !== null ? (
                      <div style={{ background: ivScoreBg, borderRadius: 12, padding: "10px 14px", textAlign: "center", flexShrink: 0 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: ivScoreColor }}>{ivScore}</div>
                        <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>/ 10</div>
                      </div>
                    ) : (
                      <div style={{ background: "#f1f5f9", borderRadius: 12, padding: "10px 14px", textAlign: "center", flexShrink: 0 }}>
                        <div style={{ fontSize: 14, color: "#94a3b8" }}>—</div>
                      </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>{iv.job_role}</div>
                      <div style={{ fontSize: 13, color: "#64748b", display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <span>{iv.answered_count}/{iv.question_count} questions answered</span>
                        <span>•</span>
                        <span>{new Date(iv.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      {iv.verdict && (
                        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                          {iv.verdict}
                        </p>
                      )}
                    </div>

                    {/* Status pill + action */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 99,
                        background: iv.status === "completed" ? "#dcfce7" : "#fef3c7",
                        color: iv.status === "completed" ? "#15803d" : "#b45309"
                      }}>
                        {iv.status === "completed" ? "Completed" : "In Progress"}
                      </span>
                      <button
                        onClick={() => navigate("/interview")}
                        style={{ fontSize: 13, fontWeight: 600, color: "#4f46e5", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        Practice Again →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}