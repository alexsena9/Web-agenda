import React, { useState } from "react";
import { Lock, User, LogIn, Scissors } from "lucide-react";

const Login = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user === "admin" && pass === "1234") {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center bg-dark"
      style={{
        backgroundImage:
          "radial-gradient(circle at top right, #3b82f622, transparent), radial-gradient(circle at bottom left, #1d4ed822, transparent)",
        backgroundColor: "#0f172a",
      }}
    >
      <div
        className="card border-0 shadow-lg p-4 p-md-5 rounded-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#1e293b",
          color: "#f8fafc",
        }}
      >
        <div className="text-center mb-5">
          <div className="bg-primary d-inline-block p-3 rounded-circle mb-3 shadow-primary">
            <Scissors size={32} className="text-white" />
          </div>
          <h3 className="fw-bold mb-1">Agenda Barbería</h3>
          <p className="text-muted small">Panel de Gestión Profesional</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger py-2 small border-0 bg-danger bg-opacity-10 text-danger mb-4 animate-shake">
              Usuario o contraseña incorrectos.
            </div>
          )}

          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">
              USUARIO
            </label>
            <div className="input-group">
              <span
                className="input-group-text border-0 bg-slate-700 text-muted"
                style={{ backgroundColor: "#334155" }}
              >
                <User size={18} />
              </span>
              <input
                type="text"
                className="form-control border-0 bg-slate-700 text-white py-2"
                style={{ backgroundColor: "#334155" }}
                placeholder="admin"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">
              CONTRASEÑA
            </label>
            <div className="input-group">
              <span
                className="input-group-text border-0 bg-slate-700 text-muted"
                style={{ backgroundColor: "#334155" }}
              >
                <Lock size={18} />
              </span>
              <input
                type="password"
                className="form-control border-0 bg-slate-700 text-white py-2"
                style={{ backgroundColor: "#334155" }}
                placeholder="1234"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
          >
            <LogIn size={20} /> Entrar al Panel
          </button>

          <div className="text-center mt-4">
            <p className="text-muted" style={{ fontSize: "12px" }}>
              Credenciales para demo: <br />
              <span className="text-primary">User: admin / Pass: 1234</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
