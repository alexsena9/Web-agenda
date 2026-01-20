import React, { useState } from "react";
import {
  Scissors,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  MapPin,
  User,
  ChevronLeft,
} from "lucide-react";

const VistaPublica = ({ turnos, onAddTurno, servicios, horarios }) => {
  const [reserva, setReserva] = useState({
    cliente: "",
    servicio: servicios[0],
    fecha: "",
    hora: "",
  });
  const [exito, setExito] = useState(false);

  const getHorasDisponibles = (fecha) => {
    const lista = [];
    for (let i = horarios.inicio; i <= horarios.fin; i++) {
      const h = `${i.toString().padStart(2, "0")}:00`;

      if (!turnos.find((t) => t.fecha === fecha && t.hora === h)) {
        lista.push(h);
      }
    }
    return lista;
  };

  const handleConfirmar = (e) => {
    e.preventDefault();
    if (reserva.cliente && reserva.fecha && reserva.hora) {
      onAddTurno({
        ...reserva,
        estado: "Pendiente",
      });
      setExito(true);
    }
  };

  if (exito)
    return (
      <div className="min-vh-100 vw-100 d-flex align-items-center justify-content-center bg-white p-4 text-center position-fixed top-0 start-0 z-3">
        <div className="animate-fade-up" style={{ maxWidth: "400px" }}>
          <div className="bg-success bg-opacity-10 text-success p-4 rounded-circle d-inline-block mb-4">
            <CheckCircle size={64} strokeWidth={1.5} />
          </div>
          <h2 className="fw-bold mb-3" style={{ color: "#1e293b" }}>
            ¡Cita Confirmada!
          </h2>
          <p className="text-muted fs-5">
            Gracias <strong>{reserva.cliente}</strong>. Tu cita quedó agendada.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="btn btn-dark w-100 py-3 rounded-pill mt-4 fw-bold shadow-sm"
            style={{ transition: "all 0.3s" }}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-vh-100 vw-100 bg-white d-flex flex-column animate-fade-in position-absolute top-0 start-0">
      <header
        className="bg-dark text-white pt-5 pb-5 px-4 text-center position-relative"
        style={{ borderRadius: "0 0 40px 40px" }}
      >
        <button
          onClick={() => (window.location.href = "/")}
          className="btn btn-link text-white position-absolute top-0 start-0 mt-4 ms-3 p-2 opacity-50"
          style={{ border: "none", boxShadow: "none" }}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="position-relative z-1">
          <div className="bg-primary d-inline-flex p-3 rounded-circle mb-3 shadow-primary">
            <Scissors size={28} className="text-white" />
          </div>
          <h1 className="fw-bold display-6 mb-1 text-white">Agenda Barbería</h1>
          <div className="d-flex justify-content-center align-items-center gap-3 small opacity-75 text-white">
            <span className="d-flex align-items-center gap-1">
              <Star
                size={14}
                className="text-warning"
                style={{ fill: "#ffc107" }}
              />{" "}
              4.9
            </span>
            <span className="d-flex align-items-center gap-1">
              <MapPin size={14} /> Ciudad de Paysandú
            </span>
          </div>
        </div>
      </header>

      <main
        className="container flex-grow-1 py-5 px-4"
        style={{ maxWidth: "650px" }}
      >
        <form onSubmit={handleConfirmar}>
          <section className="mb-5">
            <h5 className="fw-bold mb-4 text-dark">
              1. Selecciona el servicio
            </h5>
            <div className="row g-3">
              {servicios.map((s) => (
                <div key={s} className="col-12 col-md-6">
                  <div
                    onClick={() => setReserva({ ...reserva, servicio: s })}
                    className={`p-3 rounded-4 border-2 cursor-pointer transition-all d-flex justify-content-between align-items-center h-100 service-card-public ${
                      reserva.servicio === s
                        ? "border-primary bg-primary bg-opacity-5"
                        : "border-light bg-light bg-opacity-30"
                    }`}
                  >
                    <span className="fw-semibold text-dark">{s}</span>
                    {reserva.servicio === s && (
                      <CheckCircle size={20} className="text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-5">
            <h5 className="fw-bold mb-4 text-dark">2. Fecha y Horario</h5>
            <div className="card border-0 bg-light bg-opacity-50 p-4 rounded-4">
              <input
                type="date"
                className="form-control border-0 py-3 mb-4 rounded-3 shadow-sm"
                min={new Date().toISOString().split("T")[0]}
                required
                onChange={(e) =>
                  setReserva({ ...reserva, fecha: e.target.value, hora: "" })
                }
              />

              {reserva.fecha && (
                <div
                  className="d-grid gap-2"
                  style={{
                    gridTemplateColumns: "repeat(auto-fill, minmax(85px, 1fr))",
                  }}
                >
                  {getHorasDisponibles(reserva.fecha).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setReserva({ ...reserva, hora: h })}
                      className={`btn py-2 rounded-3 fw-bold btn-hora-public ${
                        reserva.hora === h
                          ? "btn-primary border-primary"
                          : "bg-white border-light text-dark"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="mb-5">
            <h5 className="fw-bold mb-4 text-dark">3. Tus datos</h5>
            <input
              type="text"
              className="form-control form-control-lg border-0 bg-light py-3 rounded-4"
              placeholder="Nombre completo"
              required
              value={reserva.cliente}
              onChange={(e) =>
                setReserva({ ...reserva, cliente: e.target.value })
              }
            />
          </section>

          <button
            type="submit"
            disabled={!reserva.hora || !reserva.cliente}
            className="btn btn-dark w-100 py-4 rounded-4 fw-bold shadow-lg border-0"
            style={{ fontSize: "1.1rem" }}
          >
            CONFIRMAR MI TURNO
          </button>
        </form>
      </main>
    </div>
  );
};

export default VistaPublica;
