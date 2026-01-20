import React, { useState } from "react";
import {
  Scissors,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const VistaPublica = ({ turnos, onAddTurno, servicios, horarios }) => {
  const [paso, setPaso] = useState(1);
  const [reserva, setReserva] = useState({
    cliente: "",
    servicio: servicios[0],
    fecha: "",
    hora: "",
  });
  const [mensajeExito, setMensajeExito] = useState(false);

  const getHorasDisponibles = (fecha) => {
    const lista = [];
    for (let i = horarios.inicio; i <= horarios.fin; i++) {
      const hora = `${i.toString().padStart(2, "0")}:00`;
      const ocupado = turnos.find((t) => t.fecha === fecha && t.hora === hora);
      if (!ocupado) lista.push(hora);
    }
    return lista;
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    onAddTurno({ ...reserva, id: Date.now(), estado: "Pendiente" });
    setMensajeExito(true);
  };

  if (mensajeExito) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white p-4 text-center">
        <div className="animate-fade-up">
          <div className="bg-success bg-opacity-10 text-success p-4 rounded-circle d-inline-block mb-4">
            <CheckCircle size={60} />
          </div>
          <h2 className="fw-bold">¡Cita Reservada!</h2>
          <p className="text-muted">
            Hola <strong>{reserva.cliente}</strong>, tu cita para{" "}
            <strong>{reserva.servicio}</strong> ha sido agendada con éxito.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary px-5 py-3 rounded-pill fw-bold mt-4 shadow"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5 px-3">
      <div className="mx-auto" style={{ maxWidth: "500px" }}>
        <div className="text-center mb-5">
          <div className="bg-dark text-white p-3 rounded-circle d-inline-block mb-3 shadow">
            <Scissors size={30} />
          </div>
          <h2 className="fw-bold">Barbería Elite</h2>
          <p className="text-muted">Reserva tu lugar en segundos</p>
        </div>

        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          <form onSubmit={handlesubmit}>
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">
                ¿QUIÉN VIENE?
              </label>
              <input
                type="text"
                className="form-control border-0 bg-light py-3 rounded-3"
                placeholder="Ingresa tu nombre"
                required
                value={reserva.cliente}
                onChange={(e) =>
                  setReserva({ ...reserva, cliente: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">
                ¿QUÉ SERVICIO NECESITAS?
              </label>
              <select
                className="form-select border-0 bg-light py-3 rounded-3"
                value={reserva.servicio}
                onChange={(e) =>
                  setReserva({ ...reserva, servicio: e.target.value })
                }
              >
                {servicios.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <label className="form-label small fw-bold text-muted">
                  FECHA
                </label>
                <input
                  type="date"
                  className="form-control border-0 bg-light py-3 rounded-3"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={reserva.fecha}
                  onChange={(e) =>
                    setReserva({ ...reserva, fecha: e.target.value, hora: "" })
                  }
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-bold text-muted">
                  HORA
                </label>
                <select
                  className="form-select border-0 bg-light py-3 rounded-3"
                  required
                  disabled={!reserva.fecha}
                  value={reserva.hora}
                  onChange={(e) =>
                    setReserva({ ...reserva, hora: e.target.value })
                  }
                >
                  <option value="">Seleccionar...</option>
                  {reserva.fecha &&
                    getHorasDisponibles(reserva.fecha).map((h) => (
                      <option key={h} value={h}>
                        {h} hs
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
            >
              RESERVAR AHORA <ArrowRight size={20} />
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-muted small">
          © 2026 Barbería Elite · Montevideo, UY
        </p>
      </div>
    </div>
  );
};

export default VistaPublica;
