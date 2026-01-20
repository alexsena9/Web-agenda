import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Scissors,
  User,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";

const VistaPublica = ({ turnos, onAddTurno, servicios, horarios }) => {
  const [paso, setPaso] = useState(1);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [nombre, setNombre] = useState("");

  const horas = [];
  for (let i = horarios.inicio; i <= horarios.fin; i++) {
    horas.push(`${i.toString().padStart(2, "0")}:00`);
  }

  const handleFinalizar = () => {
    onAddTurno({
      cliente: nombre,
      servicio: servicioSeleccionado.nombre,
      precio: servicioSeleccionado.precio,
      fecha: fecha,
      hora: horaSeleccionada,
      estado: "Pendiente",
    });
    setPaso(4);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="w-100" style={{ maxWidth: "480px" }}>
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden animate-fade-up"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          {paso < 4 && (
            <div className="bg-primary p-4 text-white text-center shadow-sm">
              <div className="bg-white bg-opacity-20 rounded-pill d-inline-block p-2 mb-3">
                <Scissors size={24} />
              </div>
              <h4 className="fw-bold mb-1">Agenda tu Cita</h4>
              <div className="d-flex justify-content-center gap-2 mt-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "35px",
                      height: "4px",
                      borderRadius: "2px",
                      backgroundColor:
                        paso >= i ? "#fff" : "rgba(255,255,255,0.3)",
                      transition: "0.3s",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          <div className="card-body p-4">
            {paso === 1 && (
              <div className="animate-fade-in">
                <h6 className="text-uppercase text-muted fw-bold small mb-3 tracking-wider text-start">
                  Paso 1: Elige un servicio
                </h6>
                <div className="d-grid gap-3">
                  {servicios.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setServicioSeleccionado(s);
                        setPaso(2);
                      }}
                      className="btn btn-outline-light border text-start p-3 rounded-4 d-flex justify-content-between align-items-center transition-all hover-shadow"
                      style={{ borderColor: "#eee" }}
                    >
                      <div>
                        <span className="d-block fw-bold text-dark fs-5">
                          {s.nombre}
                        </span>
                        <span className="text-muted small">
                          Duración estimada: 45 min
                        </span>
                      </div>
                      <span
                        className="badge rounded-pill px-3 py-2 fs-6"
                        style={{ backgroundColor: "#e7f0ff", color: "#007bff" }}
                      >
                        ${s.precio}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paso === 2 && (
              <div className="animate-fade-in text-start">
                <button
                  onClick={() => setPaso(1)}
                  className="btn btn-link text-decoration-none text-muted p-0 mb-4 d-flex align-items-center gap-2"
                >
                  <ChevronLeft size={18} />{" "}
                  <span className="small fw-bold">Volver a servicios</span>
                </button>
                <h6 className="text-uppercase text-muted fw-bold small mb-3 tracking-wider">
                  Paso 2: Fecha y Hora
                </h6>

                <div className="mb-4">
                  <label className="form-label small fw-bold">
                    Selecciona el día
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-lg border-0 bg-light rounded-3"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>

                <label className="form-label small fw-bold">
                  Horarios disponibles
                </label>
                <div className="row g-2">
                  {horas.map((h) => {
                    const ocupado = turnos.some(
                      (t) => t.fecha === fecha && t.hora === h,
                    );
                    return (
                      <div key={h} className="col-4">
                        <button
                          disabled={ocupado}
                          onClick={() => {
                            setHoraSeleccionada(h);
                            setPaso(3);
                          }}
                          className={`btn w-100 py-3 rounded-3 fw-bold transition-all ${
                            ocupado
                              ? "btn-light opacity-25"
                              : "btn-outline-primary"
                          }`}
                        >
                          {h}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {paso === 3 && (
              <div className="animate-fade-in text-start">
                <button
                  onClick={() => setPaso(2)}
                  className="btn btn-link text-decoration-none text-muted p-0 mb-4 d-flex align-items-center gap-2"
                >
                  <ChevronLeft size={18} />{" "}
                  <span className="small fw-bold">Cambiar horario</span>
                </button>

                <div
                  className="p-4 rounded-4 mb-4"
                  style={{
                    background: "#f8f9ff",
                    border: "1px dashed #c2d6ff",
                  }}
                >
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Servicio:</span>
                    <span className="fw-bold">
                      {servicioSeleccionado.nombre}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Fecha:</span>
                    <span className="fw-bold">{fecha}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Hora:</span>
                    <span className="fw-bold">{horaSeleccionada} HS</span>
                  </div>
                  <div className="pt-2 border-top d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">Total:</span>
                    <span className="fw-bold text-primary fs-4">
                      ${servicioSeleccionado.precio}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold">
                    Tu Nombre Completo
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <User size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-lg bg-light border-0"
                      placeholder="Ej: Carlos Sánchez"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  disabled={!nombre}
                  onClick={handleFinalizar}
                  className="btn btn-primary btn-lg w-100 rounded-4 py-3 fw-bold shadow-lg"
                >
                  Confirmar Cita
                </button>
              </div>
            )}

            {paso === 4 && (
              <div className="text-center py-5 animate-fade-in">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-block p-4 mb-4">
                  <CheckCircle2 size={60} className="text-success" />
                </div>
                <h2 className="fw-bold text-dark">¡Confirmado!</h2>
                <p className="text-muted px-4">
                  Gracias <strong>{nombre}</strong>, tu lugar está reservado
                  para el <strong>{fecha}</strong> a las{" "}
                  <strong>{horaSeleccionada}</strong>.
                </p>
                <div className="mt-4 pt-3 border-top mx-4">
                  <p className="small text-muted mb-3">
                    Se enviará un recordatorio por WhatsApp
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn btn-dark rounded-pill px-5 py-2"
                  >
                    Volver al inicio
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaPublica;
