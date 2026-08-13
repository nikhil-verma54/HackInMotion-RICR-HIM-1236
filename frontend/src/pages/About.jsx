import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function About() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", background: "#f8fafc", color: "#0f172a", padding: "50px 24px 80px" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: 30,
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
              color: "#4338ca",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            <span>About ResumeAI</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, color: "#0f172a", margin: "0 0 14px", letterSpacing: "-0.5px" }}>
            Helping Job Seekers Beat the Automated Filter
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 680, margin: "0 auto" }}>
            We built ResumeAI to level the playing field between candidates and modern recruitment algorithms.
          </p>
        </div>

        {/* The Problem & Solution Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 32 }}>
          <div className="card-base" style={{ padding: "28px 24px", background: "#ffffff" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🤖</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>
              The Challenge
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
              Over 75% of qualified applicants are filtered out by Applicant Tracking Systems (ATS) due to formatting errors, missing keywords, or non-standard section headers before a recruiter ever reads their resume.
            </p>
          </div>

          <div className="card-base" style={{ padding: "28px 24px", background: "#ffffff" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>💡</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>
              Our Solution
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
              ResumeAI uses advanced semantic evaluation to inspect your resume like a senior technical recruiter and ATS parser combined. You get instant clarity on what works, what is missing, and how to fix it.
            </p>
          </div>
        </div>

        {/* What We Analyze */}
        <div className="card-base" style={{ padding: "32px", background: "#ffffff", marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>
            Core Evaluation Pillars
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#4f46e5", margin: "0 0 6px" }}>
                1. ATS Compatibility
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Audits document structure, text extractability, and hierarchy for seamless parsing.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0891b2", margin: "0 0 6px" }}>
                2. Skill Gap Identification
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Cross-references your demonstrated experience against target job requirements.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#16a34a", margin: "0 0 6px" }}>
                3. Measurable Impact
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Highlights bullet points that lack quantifiable outcomes and suggests stronger action verbs.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#9333ea", margin: "0 0 6px" }}>
                4. Interview Readiness
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Generates realistic interview questions tailored specifically to your experience.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Promise */}
        <div className="card-base" style={{ padding: "26px 30px", background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 36 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#166534", margin: "0 0 8px" }}>
            🔒 Privacy & Security Guarantee
          </h2>
          <p style={{ fontSize: 14, color: "#15803d", lineHeight: 1.65, margin: 0 }}>
            Your career documents belong strictly to you. Resume content is processed securely and is never sold, shared, or used to train public language models.
          </p>
        </div>

        {/* Call to action */}
        <div style={{ textAlign: "center" }}>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="btn-primary"
            style={{
              padding: "14px 32px",
              fontSize: 15,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {user ? "Open Your Dashboard →" : "Get Started for Free →"}
          </Link>
        </div>

      </div>
    </div>
  );
}
