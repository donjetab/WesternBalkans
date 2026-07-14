import React from "react";
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setSession } from "../services/api.js";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await api.login(username, password);
      setSession(result);
      navigate("/admin");
    } catch (err) {
      setError("Login failed. Check the backend is running and the credentials are correct.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <form className="login-card" onSubmit={submit} autoComplete="off">
        <div className="login-icon"><LockKeyhole size={26} /></div>
        <h1>Admin Login</h1>
        {/* <p>Protected access for editing homepage content, news, and media references.</p> */}
        <label>
          Username
          <input
            autoComplete="username"
            name="edu4migration-admin-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            type="text"
            required
          />
        </label>
        <label>
          Password
          <input
            autoComplete="current-password"
            name="edu4migration-admin-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            required
          />
        </label>
        {error ? <div className="form-error">{error}</div> : null}
        <button className="btn btn-primary" style={{ marginTop: 15 }} disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
