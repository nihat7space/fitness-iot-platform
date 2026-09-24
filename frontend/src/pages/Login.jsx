import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "login") {
        await login({ identifier, password });
      } else {
        await register({ username, email, password });
      }
      navigate("/workouts");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card card">
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab${mode === "login" ? " active" : ""}`}
            onClick={() => { setMode("login"); setError(null); }}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`login-tab${mode === "register" ? " active" : ""}`}
            onClick={() => { setMode("register"); setError(null); }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "login" ? (
            <div className="field">
              <label>Username or email</label>
              <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            </div>
          ) : (
            <>
              <div className="field">
                <label>Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </>
          )}
          <div className="field">
            <label>Password</label>
            <input type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="error-banner">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
