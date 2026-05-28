import React from "react";
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setToken } from "../services/api.js";

export function AdminLogin() {
  const [email, setEmail] = useState("admin@edu4migration.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await api.login(email, password);
      setToken(result.token);
      navigate("/admin");
    } catch (err) {
      setError("Login failed. Check the backend is running and the credentials are correct.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <form className="login-card" onSubmit={submit}>
        <div className="login-icon"><LockKeyhole size={26} /></div>
        <h1>Admin panel</h1>
        <p>Protected access for editing homepage content, news, and media references.</p>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
        </label>
        {error ? <div className="form-error">{error}</div> : null}
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
