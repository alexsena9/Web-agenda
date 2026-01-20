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
      className="vw-100 vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(180deg, #0d6efd 0%, #003d99 100%)",
        position: "fixed",
        top: 0,
        left: 0,
        overflowY: "auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="container-fluid d-flex justify-content-center py-md-5 py-3">
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden animate-fade-up w-100"
          style={{
            maxWidth: "500px",
            minHeight: "650px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {paso < 4 && (
            <div className="bg-white p-4 text-center border-bottom">
              <div className="text-primary mb-2">
                <Scissors size={32} strokeWidth={2.5} />
              </div>
              <h4 className="fw-bold text-dark mb-0">Reserva tu Turno</h4>
              <p className="text-muted small mb-0">
                Gestión Profesional de Citas
              </p>

              <div
                className="progress mt-4"
                style={{ height: "6px", borderRadius: "10px" }}
              >
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated transition-all"
                  role="progressbar"
                  style={{ width: `${(paso / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="card-body p-4 d-flex flex-column flex-grow-1">
            {paso === 1 && (
              <div className="animate-fade-in">
                <h6 className="fw-bold text-dark mb-4 text-start text-uppercase small tracking-wider">
                  1. Elige el Servicio
                </h6>
                <div className="d-grid gap-3">
                  {servicios.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setServicioSeleccionado(s);
                        setPaso(2);
                      }}
                      className="btn btn-light border-0 text-start p-3 rounded-4 d-flex justify-content-between align-items-center shadow-sm-hover transition-all"
                    >
                      <div>
                        <span className="d-block fw-bold fs-5 text-dark">
                          {s.nombre}
                        </span>
                        <span className="text-muted smaller">
                          Ver disponibilidad
                        </span>
                      </div>
                      <span className="fw-bold text-primary fs-5">
                        ${s.precio}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paso === 2 && (
              <div className="animate-fade-in text-start flex-grow-1">
                <button
                  onClick={() => setPaso(1)}
                  className="btn btn-link text-decoration-none text-muted p-0 mb-4 d-flex align-items-center gap-1"
                >
                  <ChevronLeft size={16} /> Volver
                </button>
                <h6 className="fw-bold text-dark mb-3">2. Fecha y Hora</h6>

                <input
                  type="date"
                  className="form-control form-control-lg border-0 bg-light mb-4 rounded-3"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />

                <div
                  className="row g-2 overflow-auto custom-scroll"
                  style={{ maxHeight: "350px" }}
                >
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
                              ? "btn-light text-muted opacity-50"
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
              <div className="animate-fade-in text-start flex-grow-1 d-flex flex-column">
                <button
                  onClick={() => setPaso(2)}
                  className="btn btn-link text-decoration-none text-muted p-0 mb-4 d-flex align-items-center gap-1"
                >
                  <ChevronLeft size={16} /> Cambiar horario
                </button>

                <div
                  className="p-4 rounded-4 mb-4"
                  style={{ background: "#f0f7ff", border: "1px solid #cfe2ff" }}
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
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Hora:</span>
                    <span className="fw-bold">{horaSeleccionada} HS</span>
                  </div>
                  <hr className="my-3" />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">Precio Total:</span>
                    <span className="fw-bold text-primary fs-3">
                      ${servicioSeleccionado.precio}
                    </span>
                  </div>
                </div>

                <div className="mb-4 mt-auto">
                  <label className="form-label small fw-bold text-muted">
                    TU NOMBRE COMPLETO
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg bg-light border-0 rounded-3"
                    placeholder="Escribe tu nombre..."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <button
                  disabled={!nombre}
                  onClick={handleFinalizar}
                  className="btn btn-primary btn-lg w-100 rounded-4 py-3 fw-bold shadow-primary transition-all"
                >
                  Agendar Turno Ahora
                </button>
              </div>
            )}

            {paso === 4 && (
              <div className="text-center py-5 animate-fade-in flex-grow-1 d-flex flex-column justify-content-center">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-block p-4 mb-4 mx-auto">
                  <CheckCircle2
                    size={70}
                    className="text-success"
                    strokeWidth={1.5}
                  />
                </div>
                <h2 className="fw-bold text-dark mb-3">¡Reserva Exitosa!</h2>
                <p className="text-muted px-4 mb-5">
                  Todo listo, <strong>{nombre}</strong>. Tu cita ha sido
                  agendada. ¡Te esperamos!
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm"
                >
                  Finalizar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaPublica;
