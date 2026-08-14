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

  return (
    <header
      className="navbar"
      style={{
        padding: "0 clamp(14px, 3vw, 24px)",
        height: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #e2e8f0",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            ✦
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
            Resume<span style={{ color: "#4f46e5" }}>AI</span>
          </span>
        </Link>

        {/* Center Links: Home, About, Dashboard */}
        <nav style={{ display: "flex", alignItems: "center", gap: "clamp(12px, 2.5vw, 24px)" }}>
          <Link
            to="/"
            style={{
              fontSize: 14,
              fontWeight: isActive("/") ? 700 : 500,
              color: isActive("/") ? "#4f46e5" : "#475569",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            Home
          </Link>

          <Link
            to="/about"
            style={{
              fontSize: 14,
              fontWeight: isActive("/about") ? 700 : 500,
              color: isActive("/about") ? "#4f46e5" : "#475569",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            About
          </Link>

          {user && (
            <Link
              to="/dashboard"
              style={{
                fontSize: 14,
                fontWeight: isActive("/dashboard") ? 700 : 500,
                color: isActive("/dashboard") ? "#4f46e5" : "#475569",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              Dashboard
            </Link>
          )}

          {user && (
            <Link
              to="/interview"
              style={{
                fontSize: 14,
                fontWeight: isActive("/interview") ? 700 : 500,
                color: isActive("/interview") ? "#4f46e5" : "#475569",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              Interview
            </Link>
          )}
        </nav>

        {/* Right side: User Profile / Auth buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      border: "2px solid #e2e8f0",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "#4f46e5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    {initials}
                  </div>
                )}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0f172a",
                    maxWidth: 100,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                  }}
                  className="hidden sm:inline-block"
                >
                  {displayName}
                </span>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "1px solid #e2e8f0",
                  color: "#64748b",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Link
                to="/login"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                  textDecoration: "none",
                  padding: "6px 10px",
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  background: "#4f46e5",
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
