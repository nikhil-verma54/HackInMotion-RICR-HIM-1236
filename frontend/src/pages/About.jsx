import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PILLARS = [
  {
    n: "01",
    color: "#4f46e5",
    bg: "#eef2ff",
    title: "ATS Compatibility",
    desc: "Audits document structure, text extractability, and section hierarchy for seamless ATS parsing.",
  },
  {
    n: "02",
    color: "#0891b2",
    bg: "#ecfeff",
    title: "Skill Gap Identification",
    desc: "Cross-references your demonstrated experience against target job requirements to surface what's missing.",
  },
  {
    n: "03",
    color: "#16a34a",
    bg: "#f0fdf4",
    title: "Measurable Impact",
    desc: "Highlights bullet points lacking quantifiable outcomes and suggests stronger, results-driven language.",
  },
  {
    n: "04",
    color: "#9333ea",
    bg: "#faf5ff",
    title: "Interview Readiness",
    desc: "Generates realistic, role-specific interview questions tailored to your actual experience.",
  },
];

export default function About() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: "calc(100vh - 62px)", background: "#f4f6fb", color: "#0f172a" }}>

      {/* Hero */}
      <section
        style={{
          padding: "clamp(50px,8vw,90px) 20px clamp(40px,6vw,70px)",
          textAlign: "center",
          background: "linear-gradient(180deg, #ffffff 0%, #f4f6fb 100%)",
          borderBottom: "1px solid #e8ecf4",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: "min(700px,90vw)", height: "min(300px,40vw)", background: "radial-gradient(ellipse, rgba(79,70,229,0.08) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 99, background: "#eef2ff", border: "1px solid #c7d2fe", color: "#4338ca", fontSize: 12.5, fontWeight: 600, marginBottom: 24, letterSpacing: "0.01em" }}>
            About Vettora
          </div>
          <h1 style={{ fontSize: "clamp(28px,4.5vw,48px)", fontWeight: 900, color: "#0f172a", margin: "0 0 18px", letterSpacing: "-0.04em", lineHeight: 1.12 }}>
            Helping job seekers{" "}
            <span style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              beat the filter
            </span>
          </h1>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, margin: 0 }}>
            We built Vettora to level the playing field between candidates and modern recruitment algorithms.
          </p>
        </div>
      </section>

      {/* Main content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(40px,6vw,70px) 20px" }}>

        {/* Problem & Solution */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, marginBottom: 28 }}>
          <div className="card-base" style={{ padding: "30px 26px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 20 }}>🤖</div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 10px", letterSpacing: "-0.02em" }}>The challenge</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
              Over 75% of qualified applicants are filtered out by Applicant Tracking Systems due to formatting errors, missing keywords, or non-standard section headers — before a recruiter even reads the resume.
            </p>
          </div>
          <div className="card-base" style={{ padding: "30px 26px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 20 }}>💡</div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Our solution</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
              Vettora uses advanced semantic evaluation to inspect your resume like a senior technical recruiter and ATS parser combined — giving you instant clarity on what works, what's missing, and exactly how to fix it.
            </p>
          </div>
        </div>

        {/* Evaluation Pillars */}
        <div className="card-base" style={{ padding: "32px 28px", marginBottom: 28 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Core evaluation pillars</h2>
            <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>Every analysis covers four critical dimensions of your resume.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {PILLARS.map((p, i) => (
              <div key={i}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: p.bg, color: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, letterSpacing: "0.05em", flexShrink: 0 }}>{p.n}</div>
                  <h3 style={{ fontSize: 14.5, fontWeight: 700, color: p.color, margin: 0, letterSpacing: "-0.01em" }}>{p.title}</h3>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 16,
            padding: "24px 28px",
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            marginBottom: 44,
          }}
        >
          <span style={{ fontSize: 22, flexShrink: 0 }}>🔒</span>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#166534", margin: "0 0 6px", letterSpacing: "-0.01em" }}>Privacy & security guarantee</h2>
            <p style={{ fontSize: 13.5, color: "#15803d", lineHeight: 1.65, margin: 0 }}>
              Your career documents belong strictly to you. Resume content is processed securely and is never sold, shared, or used to train public language models.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="btn-primary"
            style={{ padding: "14px 34px", fontSize: 15, textDecoration: "none", borderRadius: 12 }}
          >
            {user ? "Open Your Dashboard →" : "Get Started for Free →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
