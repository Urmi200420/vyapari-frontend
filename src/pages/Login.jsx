import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import GlassButton from "../components/GlassButton.jsx";

// Staff logins, opened from the sidebar: /login?role=admin  or  /login?role=delivery
const STAFF = {
  admin: {
    hello: "Staff access",
    title: "Admin login",
    tagline: "Manage items, stock, orders and sellers.",
  },
  delivery: {
    hello: "Delivery partner",
    title: "Delivery login",
    tagline: "See your assigned orders and drop addresses.",
  },
};

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // "admin", "delivery", or null for normal customer / seller login
  const staffRole = STAFF[params.get("role")] ? params.get("role") : null;
  const staff = staffRole ? STAFF[staffRole] : null;

  const [mode, setMode] = useState(!staff && params.get("mode") === "signup" ? "signup" : "login");
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      // Endpoints assumed from the Spring Boot AuthController; adjust if yours differ
      const url = mode === "login" ? "/api/login" : "/api/signup";
      const body =
        mode === "login"
          ? { email, password, ...(staffRole ? { role: staffRole } : {}) }
          : { email, password, role };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.text()) || "Something went wrong");
      const data = await res.json().catch(() => ({}));
      const who = data.role || staffRole || role;
      localStorage.setItem("vyapari_role", who);
      // sellers go to their dashboard; later: admin to /admin and delivery to /delivery
      navigate(who === "seller" ? "/seller/dashboard" : "/");
    } catch (err) {
      setError(err.message || "Could not reach the server");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <GlassButton to="/" className="back">
          ← Back to browsing
        </GlassButton>

        <h1 className={"stack-title auth-title" + (staff ? " staff" : "")}>
          {staff ? (
            <>
              <em>{staff.hello}</em>
              <strong>{staff.title}</strong>
            </>
          ) : (
            <>
              <em>{mode === "login" ? "Welcome back to" : "Come join"}</em>
              <strong>Vyapari</strong>
            </>
          )}
        </h1>
        <p className="tagline">{staff ? staff.tagline : "Buy anything. Sell everything."}</p>

        {/* customers and sellers can sign up; admin and delivery accounts cannot */}
        {!staff && (
          <div className="tabs">
            <button type="button" className={mode === "login" ? "on" : ""} onClick={() => setMode("login")}>
              Log in
            </button>
            <button type="button" className={mode === "signup" ? "on" : ""} onClick={() => setMode("signup")}>
              Sign up
            </button>
          </div>
        )}

        <form onSubmit={submit}>
          {mode === "signup" && !staff && (
            <div className="roles">
              <label className={role === "customer" ? "on" : ""}>
                <input
                  type="radio"
                  name="role"
                  checked={role === "customer"}
                  onChange={() => setRole("customer")}
                />
                🛒 I want to buy
              </label>
              <label className={role === "seller" ? "on" : ""}>
                <input
                  type="radio"
                  name="role"
                  checked={role === "seller"}
                  onChange={() => setRole("seller")}
                />
                🏪 I want to sell
              </label>
            </div>
          )}

          <label className="field">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label className="field">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </label>

          {error && <p className="error">{error}</p>}

          <GlassButton type="submit" variant="solid" block disabled={busy}>
            {busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </GlassButton>
        </form>

        {staff && (
          <p className="staff-switch">
            Not staff? <Link to="/login">Customer login</Link>
          </p>
        )}
      </div>
    </div>
  );
}