import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const avatarUrl = user?.photoURL;
  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    fontSize: 14,
    fontWeight: 500,
    color: isActive(path) ? "#4f46e5" : "#64748b",
    textDecoration: "none",
    padding: "4px 2px",
    borderBottom: isActive(path) ? "2px solid #4f46e5" : "2px solid transparent",
    transition: "color 0.18s, border-color 0.18s",
    letterSpacing: "-0.01em",
  });

  return (
    <header
      className="navbar"
      style={{ padding: "0 clamp(16px, 3vw, 32px)", height: 62 }}
    >
      <div
        style={{
          maxWidth: 1160,
          width: "100%",
          height: "100%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            ✦
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
            Vettora
          </span>
        </Link>

        {/* Center nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "clamp(18px, 3vw, 32px)" }}>
          <Link to="/" style={navLinkStyle("/")}>Home</Link>
          <Link to="/about" style={navLinkStyle("/about")}>About</Link>
          {user && <Link to="/dashboard" style={navLinkStyle("/dashboard")}>Dashboard</Link>}
          {user && <Link to="/interview" style={navLinkStyle("/interview")}>Interview</Link>}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {user ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 10px 4px 6px",
                  borderRadius: 99,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0 }}
                  />
                ) : (
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                )}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#334155",
                    maxWidth: 90,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {displayName}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="btn-ghost"
                style={{ padding: "6px 12px", fontSize: 13, borderRadius: 8 }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: "#475569",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderRadius: 8,
                  transition: "color 0.18s",
                }}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="btn-primary"
                style={{ padding: "8px 18px", fontSize: 13.5, textDecoration: "none", borderRadius: 9 }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
