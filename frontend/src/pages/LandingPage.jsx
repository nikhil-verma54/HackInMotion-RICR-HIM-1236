import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FAQS = [
  {
    q: "How does the resume analysis work?",
    a: "Upload your resume (and optionally a target job description). Our intelligent analyzer assesses ATS readability, keyword alignment, measurable achievements, and section structure, delivering clear scores and instant suggestions.",
  },
  {
    q: "Why do I need to log in to analyze my resume?",
    a: "Logging in securely creates your personal profile so you can manage multiple resume scans, track improvements over time, and protect your private documents.",
  },
  {
    q: "What file types are accepted?",
    a: "We support PDF (.pdf) and Microsoft Word (.docx) files.",
  },
  {
    q: "Can I test my resume against a specific job posting?",
    a: "Yes. When analyzing your resume inside your dashboard, you can paste any target job description to get an exact match score and a list of matched and missing skills.",
  },
  {
    q: "Is my personal data kept private?",
    a: "Yes. Your resume data is confidential, processed securely, and never shared or sold.",
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", background: "#f8fafc", color: "#0f172a", overflowX: "hidden" }}>

      {/* ── HERO SECTION ── */}
      <section
        style={{
          position: "relative",
          padding: "clamp(50px, 8vw, 90px) 20px clamp(40px, 6vw, 70px)",
          textAlign: "center",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          borderBottom: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        {/* Soft background ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(300px, 70vw, 750px)",
            height: "clamp(200px, 40vw, 400px)",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.05) 50%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          
          {/* Animated Pill Badge */}
          <div
            className="anim-fade-up anim-float"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 30,
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
              color: "#4338ca",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 24,
              boxShadow: "0 2px 10px rgba(79, 70, 229, 0.1)",
            }}
          >
            <span>✨ Smart Resume Optimization</span>
          </div>

          {/* Main Headline */}
          <h1
            className="anim-fade-up-1"
            style={{
              fontSize: "clamp(30px, 5.2vw, 54px)",
              fontWeight: 900,
              lineHeight: 1.18,
              letterSpacing: "-1px",
              color: "#0f172a",
              margin: "0 0 20px",
            }}
          >
            Optimize Your Resume for ATS & <br />
            <span className="gradient-text">Land More Job Interviews</span>
          </h1>

          {/* Subtitle */}
          <p
            className="anim-fade-up-2"
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "#475569",
              lineHeight: 1.65,
              maxWidth: 680,
              margin: "0 auto 36px",
            }}
          >
            Get instant, actionable feedback on your resume. Check ATS readability, match job requirements, uncover missing skills, and strengthen your bullet points.
          </p>

          {/* Primary Action Button */}
          <div className="anim-fade-up-3" style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
            <button
              onClick={handleGetStarted}
              className="btn-primary anim-pulse-glow"
              style={{
                padding: "16px 36px",
                fontSize: 16,
              }}
            >
              {user ? "Go to Your Dashboard →" : "Analyze Your Resume Now →"}
            </button>
          </div>

          {/* Responsive Metrics Strip */}
          <div
            className="anim-fade-up-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 16,
              padding: "20px 24px",
              background: "#ffffff",
              borderRadius: 18,
              border: "1px solid #e2e8f0",
              boxShadow: "0 6px 20px -4px rgba(15, 23, 42, 0.05)",
              maxWidth: 780,
              margin: "0 auto",
            }}
          >
            <div style={{ padding: "6px 0" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#4f46e5" }}>Instant</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>ATS Compatibility Score</div>
            </div>
            <div style={{ padding: "6px 0", borderLeft: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Skill Gap</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>Job Requirement Match</div>
            </div>
            <div style={{ padding: "6px 0", borderLeft: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#10b981" }}>Actionable</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>Bullet Point Improvements</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" style={{ padding: "clamp(50px, 8vw, 80px) 20px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>
            Key Capabilities
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>
            Everything you need to evaluate and enhance your resume before applying.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            {
              icon: "🎯",
              title: "ATS Compatibility",
              desc: "Checks formatting, headers, and section structure to make sure applicant tracking systems parse your content accurately.",
            },
            {
              icon: "🔍",
              title: "Job Matching & Skill Gaps",
              desc: "Compares your resume with target job postings to show matched skills, partial matches, and missing qualifications.",
            },
            {
              icon: "⚡",
              title: "Strengths & Improvements",
              desc: "Identifies strong achievements and highlights weak or vague bullet points that need quantifiable impact.",
            },
            {
              icon: "🎙️",
              title: "Interview Question Prep",
              desc: "Generates role-relevant technical and behavioral questions based on your specific background and gaps.",
            },
          ].map((item, idx) => (
            <div key={idx} className="card-base card-hover" style={{ padding: "26px 22px" }}>
              <div style={{ fontSize: 30, marginBottom: 14 }}>{item.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION ── */}
      <section id="how-it-works" style={{ padding: "clamp(50px, 8vw, 80px) 20px", background: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
              How It Works
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>
              Get detailed insights in three straightforward steps.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              {
                step: "1",
                title: "Sign In & Open Workspace",
                desc: "Create your free account to access your personal resume analysis dashboard.",
              },
              {
                step: "2",
                title: "Upload Resume & Job Details",
                desc: "Upload your PDF or DOCX file, and optionally paste the job posting you are targeting.",
              },
              {
                step: "3",
                title: "Review Scores & Optimize",
                desc: "Get an instant score breakdown, skill match matrix, and recommendations to refine your resume.",
              },
            ].map((step, i) => (
              <div key={i} className="card-base card-hover" style={{ padding: "26px 22px" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#eef2ff",
                    color: "#4f46e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 14,
                    marginBottom: 14,
                  }}
                >
                  {step.step}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button onClick={handleGetStarted} className="btn-primary" style={{ padding: "14px 32px", fontSize: 15 }}>
              {user ? "Open Dashboard →" : "Get Started Now →"}
            </button>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" style={{ padding: "clamp(50px, 8vw, 80px) 20px", maxWidth: 780, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="card-base card-hover"
              style={{
                padding: "18px 22px",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>{faq.q}</span>
                <span style={{ fontSize: 18, color: "#64748b", fontWeight: 700 }}>
                  {openFaq === i ? "−" : "+"}
                </span>
              </div>
              {openFaq === i && (
                <p style={{ marginTop: 12, fontSize: 14, color: "#475569", lineHeight: 1.65, borderTop: "1px solid #f1f5f9", paddingTop: 10, margin: "12px 0 0" }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "28px 20px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
              Resume<span style={{ color: "#4f46e5" }}>AI</span>
            </span>
          </div>

          <div style={{ fontSize: 13, color: "#64748b" }}>
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <Link to="/about" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>
              About
            </Link>
            <Link to="/login" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>
              Sign In
            </Link>
            <Link to="/register" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>
              Register
            </Link>
            <Link to="/dashboard" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>
              Dashboard
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
