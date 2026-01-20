import React from "react";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";

const Dashboard = ({ turnos, setView, onNewTurn }) => {
  const hoy = new Date().toISOString().split("T")[0];

  const turnosHoy = turnos.filter((t) => t.fecha === hoy);
  const pendientes = turnosHoy.filter((t) => t.estado === "Pendiente").length;

  return (
    <div className="animate-fade-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Panel de Control</h2>
          <p className="text-muted">Estado actual de tu barbería para hoy</p>
        </div>
        <button
          onClick={onNewTurn}
          className="btn btn-primary px-4 py-2 rounded-3 shadow-sm"
        >
          + Nuevo Turno
        </button>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
                <Calendar size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-0">Turnos Hoy</h6>
                <h3 className="fw-bold mb-0">{turnosHoy.length}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-10 p-3 rounded-3 text-warning">
                <Clock size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-0">Pendientes</h6>
                <h3 className="fw-bold mb-0">{pendientes}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success">
                <CheckCircle size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-0">Ingresos Est.</h6>
                <h3 className="fw-bold mb-0">${turnosHoy.length * 500}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Próximas Citas</h5>
          <button
            onClick={() => setView("agenda")}
            className="btn btn-link text-primary p-0 text-decoration-none small fw-bold"
          >
            Ver agenda completa
          </button>
        </div>
        <div className="list-group list-group-flush">
          {turnosHoy.length > 0 ? (
            turnosHoy.map((t) => (
              <div
                key={t.id}
                className="list-group-item p-4 border-0 border-bottom-light d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="bg-light p-2 rounded-circle text-dark fw-bold"
                    style={{
                      width: "45px",
                      height: "45px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {t.cliente.charAt(0)}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">{t.cliente}</h6>
                    <small className="text-muted">
                      {t.servicio} • {t.hora} hs
                    </small>
                  </div>
                </div>
                <span
                  className={`badge rounded-pill px-3 py-2 ${t.estado === "Pendiente" ? "bg-warning text-dark" : "bg-success text-white"}`}
                >
                  {t.estado}
                </span>
              </div>
            ))
          ) : (
            <div className="p-5 text-center text-muted">
              <p>No tienes citas para hoy todavía.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
