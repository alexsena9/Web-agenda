import React, { useState } from "react";
import {
  Scissors,
  User,
  Settings,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Wind,
  Smile,
  Smartphone,
  Calendar,
  Clock,
  CreditCard,
} from "lucide-react";

const VistaPublica = ({ turnos, onAddTurno, servicios, horarios }) => {
  const [paso, setPaso] = useState(1);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [nombre, setNombre] = useState("");

  const volverAlInicio = () => {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const BarberPattern = () => {
    const icons = [Scissors, Wind, Smile, Smartphone];
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 opacity-[0.05] pointer-events-none"
        style={{ zIndex: 0, overflow: "hidden" }}
      >
        <div
          className="d-flex flex-wrap gap-5 p-5"
          style={{ transform: "rotate(-15deg) scale(1.5)" }}
        >
          {[...Array(100)].map((_, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Icon key={i} size={42} className="text-white" strokeWidth={1} />
            );
          })}
        </div>
      </div>
    );
  };

  const generarHoras = () => {
    const lista = [];
    for (let i = horarios.inicio; i <= horarios.fin; i++) {
      lista.push(`${i.toString().padStart(2, "0")}:00`);
    }
    return lista;
  };

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
      className="vw-100 vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
      style={{ backgroundColor: "#020617" }}
    >
      <BarberPattern />

      <div className="container position-relative z-1 d-flex justify-content-center px-3">
        <div
          className="card border-0 rounded-5 shadow-2xl animate-fade-up w-100"
          style={{
            maxWidth: "500px",
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {paso < 4 && (
            <div className="p-4 text-center border-bottom border-white border-opacity-10">
              <button
                onClick={paso === 1 ? volverAlInicio : () => setPaso(paso - 1)}
                className="btn btn-link position-absolute start-0 top-0 mt-4 ms-3 text-white opacity-50 text-decoration-none"
              >
                <ChevronLeft size={20} />
              </button>
              <h4 className="fw-bold text-white mb-0">Reserva tu Turno</h4>
              <div
                className="progress mt-3 mx-auto"
                style={{
                  height: "4px",
                  width: "100px",
                  background: "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="progress-bar bg-primary"
                  style={{ width: `${(paso / 3) * 100}%`, transition: "0.5s" }}
                ></div>
              </div>
            </div>
          )}

          <div className="card-body p-4 p-md-5">
            {paso === 1 && (
              <div className="animate-fade-in">
                <h5 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                  <Scissors size={20} className="text-primary" /> 1. Elige un
                  servicio
                </h5>
                <div className="d-grid gap-3">
                  {servicios.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setServicioSeleccionado(s);
                        setPaso(2);
                      }}
                      className="btn border-0 text-start p-3 rounded-4 d-flex justify-content-between align-items-center transition-all"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "white",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.1)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.05)")
                      }
                    >
                      <span className="fw-bold">{s.nombre}</span>
                      <span
                        className="badge rounded-pill px-3 py-2"
                        style={{
                          background: "rgba(25, 135, 84, 0.2)",
                          color: "#2ecc71",
                        }}
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
                <h5 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                  <Calendar size={20} className="text-primary" /> 2. Fecha y
                  hora
                </h5>
                <input
                  type="date"
                  className="form-control form-control-lg border-0 mb-4 rounded-4 text-white shadow-none"
                  style={{ background: "rgba(255, 255, 255, 0.05)" }}
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
                <div
                  className="row g-2 overflow-auto pr-2"
                  style={{ maxHeight: "250px" }}
                >
                  {generarHoras().map((h) => {
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
                          className={`btn w-100 py-3 rounded-4 fw-bold border-0 transition-all ${
                            ocupado
                              ? "opacity-25 bg-secondary text-white"
                              : "text-white"
                          }`}
                          style={{
                            background: ocupado
                              ? "transparent"
                              : "rgba(255, 255, 255, 0.05)",
                          }}
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
              <div className="animate-fade-in">
                <h5 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                  <CreditCard size={20} className="text-primary" /> 3. Confirma
                  tu cita
                </h5>
                <div
                  className="rounded-4 p-4 mb-4"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white opacity-50 small">
                      Servicio:
                    </span>
                    <span className="text-white fw-bold">
                      {servicioSeleccionado?.nombre}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-white opacity-50 small">Cuándo:</span>
                    <span className="text-white fw-bold">
                      {fecha} • {horaSeleccionada} HS
                    </span>
                  </div>
                  <div className="pt-3 border-top border-white border-opacity-10 d-flex justify-content-between align-items-center">
                    <span className="text-white fw-bold">Total a pagar:</span>
                    <span className="text-success h3 fw-bold mb-0">
                      ${servicioSeleccionado?.precio}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-white opacity-50 mb-2">
                    TU NOMBRE COMPLETO
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg border-0 rounded-4 text-white shadow-none"
                    style={{ background: "rgba(255, 255, 255, 0.08)" }}
                    placeholder="Ej: Carlos Sánchez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <button
                  disabled={!nombre}
                  onClick={handleFinalizar}
                  className="btn btn-primary btn-lg w-100 rounded-4 py-3 fw-bold shadow-lg"
                  style={{ boxShadow: "0 10px 20px rgba(13, 110, 253, 0.3)" }}
                >
                  Confirmar Reserva
                </button>
              </div>
            )}

            {paso === 4 && (
              <div className="text-center py-4 animate-fade-in">
                <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-block p-4 mb-4">
                  <CheckCircle2 size={64} strokeWidth={2.5} />
                </div>
                <h2 className="fw-bold text-white mb-3">¡Listo!</h2>
                <p className="text-white opacity-75 mb-5 px-3">
                  Tu turno ha sido agendado con éxito. ¡Te esperamos!
                </p>
                <button
                  onClick={volverAlInicio}
                  className="btn btn-outline-light btn-lg rounded-4 px-5 py-3 border-white border-opacity-25"
                >
                  Volver al Inicio
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
