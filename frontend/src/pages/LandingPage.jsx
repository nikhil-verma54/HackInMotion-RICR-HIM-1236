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

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    color: "#4f46e5",
    bg: "#eef2ff",
    title: "ATS Compatibility",
    desc: "Checks formatting, headers, and section structure to ensure applicant tracking systems parse your content correctly.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    color: "#0891b2",
    bg: "#ecfeff",
    title: "Job Matching & Skill Gaps",
    desc: "Compares your resume with target job postings to surface matched skills, partial matches, and missing qualifications.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    color: "#16a34a",
    bg: "#f0fdf4",
    title: "Strengths & Improvements",
    desc: "Identifies strong achievements and flags weak bullet points that need quantifiable impact.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
      </svg>
    ),
    color: "#9333ea",
    bg: "#faf5ff",
    title: "AI Mock Interviews",
    desc: "Generates realistic interview questions tailored to your experience with voice assistant feedback.",
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const handleGetStarted = () => navigate(user ? "/dashboard" : "/register");

  return (
    <div style={{ minHeight: "calc(100vh - 62px)", background: "#f4f6fb", color: "#0f172a", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          padding: "clamp(60px,9vw,110px) 20px clamp(50px,7vw,80px)",
          textAlign: "center",
          background: "linear-gradient(180deg, #ffffff 0%, #f4f6fb 100%)",
          borderBottom: "1px solid #e8ecf4",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: "min(800px,90vw)", height: "min(400px,50vw)", background: "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
          {/* Badge */}
          <div
            className="anim-fade-up"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 99, background: "#eef2ff", border: "1px solid #c7d2fe", color: "#4338ca", fontSize: 12.5, fontWeight: 600, marginBottom: 28, letterSpacing: "0.01em" }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4f46e5", display: "inline-block" }} />
            AI-Powered Career Intelligence
          </div>

          {/* Headline */}
          <h1
            className="anim-fade-up-1"
            style={{ fontSize: "clamp(32px,5.5vw,60px)", fontWeight: 900, lineHeight: 1.12, letterSpacing: "-0.04em", color: "#0f172a", margin: "0 0 22px" }}
          >
            Optimize Your Resume.{" "}
            <span className="gradient-text">Land More Interviews.</span>
          </h1>

          {/* Sub */}
          <p
            className="anim-fade-up-2"
            style={{ fontSize: "clamp(15px,2vw,18px)", color: "#475569", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 40px" }}
          >
            Instant ATS score, skill gap analysis, bullet-point improvements, and AI mock interviews — all in one place.
          </p>

          {/* CTAs */}
          <div className="anim-fade-up-3" style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 56 }}>
            <button
              onClick={handleGetStarted}
              className="btn-primary anim-pulse-glow"
              style={{ padding: "15px 34px", fontSize: 15.5, borderRadius: 13 }}
            >
              {user ? "Go to Dashboard →" : "Analyze Your Resume →"}
            </button>
            <Link
              to="/about"
              className="btn-secondary"
              style={{ padding: "15px 28px", fontSize: 15.5, borderRadius: 13, textDecoration: "none" }}
            >
              Learn More
            </Link>
          </div>

          {/* Metrics */}
          <div
            className="anim-fade-up-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 1,
              background: "#e8ecf4",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              maxWidth: 700,
              margin: "0 auto",
              boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
            }}
          >
            {[
              { value: "Instant", label: "ATS compatibility score" },
              { value: "Skill gap", label: "job requirement match" },
              { value: "Actionable", label: "bullet-point suggestions" },
            ].map((m, i) => (
              <div key={i} style={{ background: "#ffffff", padding: "18px 20px" }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: i === 0 ? "#4f46e5" : i === 1 ? "#0891b2" : "#16a34a", marginBottom: 3 }}>{m.value}</div>
                <div style={{ fontSize: 12.5, color: "#64748b" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "clamp(60px,8vw,90px) 20px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, color: "#0f172a", margin: "0 0 10px", letterSpacing: "-0.03em" }}>
            Everything you need to get hired
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
            Professional-grade resume intelligence in one clean dashboard.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="card-base card-hover"
              style={{ padding: "26px 24px" }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: f.bg,
                  color: f.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{f.title}</h3>
              <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "clamp(60px,8vw,90px) 20px", background: "#ffffff", borderTop: "1px solid #e8ecf4", borderBottom: "1px solid #e8ecf4" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, color: "#0f172a", margin: "0 0 10px", letterSpacing: "-0.03em" }}>How it works</h2>
            <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>Up and running in under two minutes.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {[
              { n: "01", title: "Create a free account", desc: "Sign up instantly with Google or email to access your personal resume workspace." },
              { n: "02", title: "Upload resume & job details", desc: "Drop in your PDF or DOCX and optionally paste the job description you're targeting." },
              { n: "03", title: "Review scores & act on insights", desc: "Get a full breakdown — ATS score, skill gap matrix, and concrete improvement suggestions." },
            ].map((s, i) => (
              <div key={i} className="card-base card-hover" style={{ padding: "28px 24px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4f46e5", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{s.n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 9px", letterSpacing: "-0.01em" }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 44 }}>
            <button onClick={handleGetStarted} className="btn-primary" style={{ padding: "14px 32px", fontSize: 15, borderRadius: 12 }}>
              {user ? "Open Dashboard →" : "Get Started Free →"}
            </button>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "clamp(60px,8vw,90px) 20px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.03em" }}>Common questions</h2>
          <p style={{ fontSize: 14.5, color: "#64748b", margin: 0 }}>Everything you need to know before getting started.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="card-base"
              style={{ padding: "18px 22px", cursor: "pointer", transition: "border-color 0.18s", borderColor: openFaq === i ? "#c7d2fe" : "#e2e8f0" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: "#1e293b", lineHeight: 1.4 }}>{faq.q}</span>
                <span style={{ fontSize: 16, color: openFaq === i ? "#4f46e5" : "#94a3b8", flexShrink: 0, fontWeight: 700, transition: "color 0.18s", transform: openFaq === i ? "rotate(45deg)" : "none", transitionProperty: "transform, color" }}>+</span>
              </div>
              {openFaq === i && (
                <p style={{ marginTop: 12, fontSize: 13.5, color: "#475569", lineHeight: 1.7, borderTop: "1px solid #f1f5f9", paddingTop: 12, margin: "12px 0 0" }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#ffffff", borderTop: "1px solid #e8ecf4", padding: "26px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Vettora
          </span>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>© {new Date().getFullYear()} Vettora. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20 }}>
            {[{ to: "/about", label: "About" }, { to: "/login", label: "Sign In" }, { to: "/register", label: "Register" }].map(l => (
              <Link key={l.to} to={l.to} style={{ fontSize: 13, color: "#64748b", textDecoration: "none", transition: "color 0.18s" }}
                onMouseEnter={e => e.target.style.color = "#4f46e5"}
                onMouseLeave={e => e.target.style.color = "#64748b"}
              >{l.label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
