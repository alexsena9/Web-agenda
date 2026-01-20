import React, { useState } from "react";
import {
  Scissors,
  Calendar,
  Clock,
  CreditCard,
  ChevronLeft,
  CheckCircle2,
  Wind,
  Smile,
  Smartphone,
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

  const BarberPattern = () => (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 opacity-[0.05] pointer-events-none"
      style={{ zIndex: 0, overflow: "hidden" }}
    >
      <div
        className="d-flex flex-wrap gap-4 p-3"
        style={{ transform: "rotate(-15deg) scale(1.2)" }}
      >
        {[...Array(50)].map((_, i) => (
          <Scissors key={i} size={25} className="text-white" strokeWidth={1} />
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="min-vh-100 vw-100 d-flex align-items-start align-items-md-center justify-content-center position-relative"
      style={{
        backgroundColor: "#020617",
        overflowY: "auto",
        padding: "20px 10px",
      }}
    >
      <BarberPattern />
      <div
        className="w-100 position-relative z-1"
        style={{ maxWidth: "450px" }}
      >
        <div
          className="card border-0 rounded-5 shadow-2xl overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {paso < 4 && (
            <div className="p-4 text-center border-bottom border-white border-opacity-10 position-relative">
              <button
                onClick={paso === 1 ? volverAlInicio : () => setPaso(paso - 1)}
                className="btn btn-link position-absolute start-0 top-50 translate-middle-y ms-2 text-white opacity-50 p-0"
              >
                <ChevronLeft size={24} />
              </button>
              <h5 className="fw-bold text-white mb-0">Reserva</h5>
            </div>
          )}

          <div className="card-body p-4">
            {paso === 1 && (
              <div className="animate-fade-in">
                <h6 className="text-white opacity-75 mb-4">
                  1. Selecciona el servicio
                </h6>
                <div className="d-grid gap-2">
                  {servicios.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setServicioSeleccionado(s);
                        setPaso(2);
                      }}
                      className="btn border-0 text-start p-3 rounded-4 d-flex justify-content-between align-items-center"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "white",
                      }}
                    >
                      <span className="fw-bold">{s.nombre}</span>
                      <span className="badge bg-success bg-opacity-25 text-success">
                        ${s.precio}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paso === 2 && (
              <div className="animate-fade-in">
                <h6 className="text-white opacity-75 mb-3">2. Fecha y hora</h6>
                <input
                  type="date"
                  className="form-control border-0 mb-4 rounded-4 text-white shadow-none text-center"
                  style={{ background: "rgba(255, 255, 255, 0.08)" }}
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
                <div className="row g-2">
                  {Array.from(
                    { length: horarios.fin - horarios.inicio + 1 },
                    (_, i) => {
                      const h = `${(horarios.inicio + i).toString().padStart(2, "0")}:00`;
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
                            className={`btn w-100 py-3 rounded-4 border-0 ${ocupado ? "opacity-25" : "text-white"}`}
                            style={{ background: "rgba(255, 255, 255, 0.05)" }}
                          >
                            {h}
                          </button>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            )}

            {paso === 3 && (
              <div className="animate-fade-in">
                <h6 className="text-white opacity-75 mb-4">
                  3. Confirmar datos
                </h6>
                <div
                  className="rounded-4 p-3 mb-4"
                  style={{ background: "rgba(255, 255, 255, 0.03)" }}
                >
                  <p className="text-white small mb-1">
                    Servicio: <strong>{servicioSeleccionado?.nombre}</strong>
                  </p>
                  <p className="text-white small mb-0">
                    Cita:{" "}
                    <strong>
                      {fecha} - {horaSeleccionada}
                    </strong>
                  </p>
                </div>
                <input
                  type="text"
                  className="form-control border-0 rounded-4 text-white mb-4 py-3"
                  style={{ background: "rgba(255, 255, 255, 0.08)" }}
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                <button
                  disabled={!nombre}
                  onClick={() => {
                    onAddTurno({
                      cliente: nombre,
                      servicio: servicioSeleccionado.nombre,
                      precio: servicioSeleccionado.precio,
                      fecha,
                      hora: horaSeleccionada,
                      estado: "Pendiente",
                    });
                    setPaso(4);
                  }}
                  className="btn btn-primary w-100 py-3 rounded-4 fw-bold"
                >
                  Confirmar Turno
                </button>
              </div>
            )}

            {paso === 4 && (
              <div className="text-center py-4 animate-fade-in">
                <CheckCircle2 size={60} className="text-success mb-3" />
                <h4 className="text-white fw-bold">¡Reservado!</h4>
                <p className="text-white opacity-50 mb-4">
                  Te esperamos {nombre}.
                </p>
                <button
                  onClick={volverAlInicio}
                  className="btn btn-outline-light rounded-4 px-5"
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
