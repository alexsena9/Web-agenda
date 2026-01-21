import React, { useState } from "react";
import {
  Scissors,
  CheckCircle,
  ChevronLeft,
  CalendarOff,
  Clock,
  AlertCircle,
} from "lucide-react";

const VistaPublica = ({
  turnos,
  servicios,
  horarios,
  bloqueos,
  onAddTurno,
}) => {
  const [paso, setPaso] = useState(1);
  const [servicio, setServicio] = useState(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const esDiaBloqueado = (bloqueos || []).some(
    (b) => b.tipo === "dia" && b.valor === fecha,
  );

  const getHorasDisponibles = () => {
    const hInicio = horarios?.inicio
      ? parseInt(horarios.inicio.split(":")[0])
      : 9;
    const hFin = horarios?.fin ? parseInt(horarios.fin.split(":")[0]) : 19;

    let list = [];
    for (let i = hInicio; i < hFin; i++) {
      const hStr = `${i.toString().padStart(2, "0")}:00`;

      const estaOcupado = (turnos || []).some(
        (t) => t.fecha === fecha && t.hora === hStr && t.estado !== "Cancelado",
      );

      const estaBloqueadoManualmente = (bloqueos || []).some(
        (b) => b.tipo === "hora" && b.fecha === fecha && b.valor === hStr,
      );

      list.push({
        hora: hStr,
        disponible: !estaOcupado && !estaBloqueadoManualmente,
        motivo: estaBloqueadoManualmente
          ? "BLOQUEADO"
          : estaOcupado
            ? "OCUPADO"
            : null,
      });
    }
    return list;
  };

  const handleFinalizar = () => {
    if (nombre && telefono) {
      onAddTurno({
        cliente: nombre,
        telefono,
        servicio: servicio.nombre,
        precio: servicio.precio,
        fecha,
        hora,
        estado: "Pendiente",
      });
      setPaso(4);
    }
  };

  return (
    <div className="min-vh-100 bg-dark text-white p-3 p-md-5">
      <div className="container" style={{ maxWidth: "500px" }}>
        {paso < 4 && (
          <div className="text-center mb-5">
            <div className="bg-primary d-inline-block p-3 rounded-4 shadow-sm mb-3">
              <Scissors size={32} />
            </div>
            <h2 className="fw-bold">Reserva tu Turno</h2>
          </div>
        )}

        {paso === 1 && (
          <div className="animate-fade-in text-start">
            <h5 className="mb-4 fw-bold text-center">Selecciona un servicio</h5>
            <div className="d-flex flex-column gap-3">
              {servicios.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setServicio(s);
                    setPaso(2);
                  }}
                  className="btn btn-outline-light border-0 bg-secondary bg-opacity-25 p-4 rounded-4 d-flex justify-content-between align-items-center"
                >
                  <span className="fw-bold">{s.nombre}</span>
                  <span className="badge bg-primary rounded-pill px-3 py-2">
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
              className="btn btn-link text-white p-0 mb-4 text-decoration-none d-flex align-items-center gap-2"
            >
              <ChevronLeft size={20} /> Volver
            </button>
            <h5 className="mb-4 fw-bold">Fecha y Hora</h5>

            <div className="mb-4">
              <label className="small fw-bold text-muted mb-2 text-uppercase">
                Elegir Fecha
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="form-control bg-secondary border-0 text-white py-3 rounded-4"
                value={fecha}
                onChange={(e) => {
                  setFecha(e.target.value);
                  setHora("");
                }}
              />
            </div>

            {esDiaBloqueado ? (
              <div className="text-center py-5 bg-danger bg-opacity-10 rounded-5 border border-danger border-opacity-25">
                <CalendarOff size={48} className="text-danger mb-3" />
                <h6 className="fw-bold">No Disponible</h6>
                <p className="small text-muted mb-0">
                  Lo sentimos, la barbería permanecerá cerrada este día.
                </p>
              </div>
            ) : (
              <div>
                <label className="small fw-bold text-muted mb-2 text-uppercase">
                  Horarios
                </label>
                <div className="row g-2">
                  {getHorasDisponibles().map((h) => (
                    <div key={h.hora} className="col-4 text-center">
                      <button
                        disabled={!h.disponible}
                        onClick={() => setHora(h.hora)}
                        className={`btn w-100 py-3 rounded-4 fw-bold transition-all ${
                          hora === h.hora
                            ? "btn-primary border-primary shadow-primary"
                            : h.disponible
                              ? "btn-outline-light border-opacity-25"
                              : "btn-dark text-muted opacity-25"
                        }`}
                      >
                        <div style={{ fontSize: "14px" }}>{h.hora}</div>
                        {!h.disponible && (
                          <div style={{ fontSize: "8px", marginTop: "2px" }}>
                            {h.motivo}
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                {hora && (
                  <button
                    onClick={() => setPaso(3)}
                    className="btn btn-primary w-100 py-3 rounded-4 fw-bold mt-4 shadow-sm"
                  >
                    Continuar con la reserva
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {paso === 3 && (
          <div className="animate-fade-in text-start">
            <button
              onClick={() => setPaso(2)}
              className="btn btn-link text-white p-0 mb-4 text-decoration-none d-flex align-items-center gap-2"
            >
              <ChevronLeft size={20} /> Volver
            </button>
            <h5 className="mb-4 fw-bold">Tus Datos</h5>
            <div className="bg-secondary bg-opacity-25 p-4 rounded-5 mb-4 border border-white border-opacity-10">
              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Servicio:</span>
                <span className="fw-bold text-primary">{servicio.nombre}</span>
              </div>
              <div className="d-flex justify-content-between small">
                <span className="text-muted">Cita:</span>
                <span className="fw-bold">
                  {fecha} a las {hora} hs
                </span>
              </div>
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control bg-secondary border-0 text-white py-3 rounded-4 shadow-none"
                placeholder="Nombre Completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                type="tel"
                className="form-control bg-secondary border-0 text-white py-3 rounded-4 shadow-none"
                placeholder="WhatsApp (Ej: 1122334455)"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            <button
              onClick={handleFinalizar}
              disabled={!nombre || !telefono}
              className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow-primary"
            >
              CONFIRMAR TURNO
            </button>
          </div>
        )}

        {paso === 4 && (
          <div className="text-center py-5 animate-fade-in">
            <div className="mb-4 d-inline-block p-4 bg-success bg-opacity-10 rounded-circle">
              <CheckCircle size={80} className="text-success" />
            </div>
            <h2 className="fw-bold mb-2">¡Turno Confirmado!</h2>
            <p className="opacity-75">
              Te esperamos el {fecha} a las {hora} hs.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="btn btn-outline-light px-5 py-3 rounded-4 fw-bold mt-4 border-opacity-25"
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VistaPublica;
