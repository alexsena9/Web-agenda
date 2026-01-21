import React, { useState } from "react";
import {
  Scissors,
  CheckCircle,
  ChevronLeft,
  CalendarOff,
  Clock,
  Calendar,
  User,
  Phone,
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
      const ocupado = (turnos || []).some(
        (t) => t.fecha === fecha && t.hora === hStr && t.estado !== "Cancelado",
      );
      const bloqueado = (bloqueos || []).some(
        (b) => b.tipo === "hora" && b.fecha === fecha && b.valor === hStr,
      );

      list.push({
        hora: hStr,
        disponible: !ocupado && !bloqueado,
        motivo: bloqueado || ocupado ? "NO DISPONIBLE" : null,
      });
    }
    return list;
  };

  const handleFinalizar = (e) => {
    if (e) e.preventDefault();
    if (nombre.trim() && telefono.trim() && servicio && fecha && hora) {
      onAddTurno({
        cliente: nombre.trim(),
        telefono: telefono.trim(),
        servicio: servicio.nombre,
        precio: servicio.precio,
        fecha: fecha,
        hora: hora,
        estado: "Pendiente",
      });
      setPaso(4);
    }
  };

  return (
    <div
      className="min-vh-100 bg-dark text-white p-3 p-md-5 d-flex align-items-center justify-content-center"
      style={{
        background: "radial-gradient(circle at top, #1e293b 0%, #020617 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="w-100" style={{ maxWidth: "480px" }}>
        {paso < 4 && (
          <div className="text-center mb-5">
            <div
              className="d-inline-block p-3 rounded-circle shadow-lg mb-3"
              style={{
                background: "#3b82f6",
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
              }}
            >
              <Scissors size={32} className="text-white" />
            </div>
            <h1 className="fw-black h2 mb-1 text-white">Reserva tu Turno</h1>
            <p
              className="fw-bold small text-uppercase tracking-widest"
              style={{ color: "#3b82f6" }}
            >
              Barbería Premium
            </p>
          </div>
        )}

        {paso === 1 && (
          <div className="animate-fade-in">
            <h5 className="mb-4 fw-bold text-center text-white-50">
              Selecciona un servicio
            </h5>
            <div className="d-flex flex-column gap-3">
              {servicios.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setServicio(s);
                    setPaso(2);
                  }}
                  className="btn border-0 text-start p-4 rounded-5 d-flex justify-content-between align-items-center transition-all"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <span className="fw-bold h5 mb-0 text-white">{s.nombre}</span>
                  <span
                    className="badge rounded-pill px-4 py-2"
                    style={{ fontSize: "1rem", background: "#3b82f6" }}
                  >
                    ${s.precio}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {paso === 2 && (
          <div className="animate-fade-in">
            <button
              type="button"
              onClick={() => setPaso(1)}
              className="btn btn-link text-white-50 p-0 mb-4 text-decoration-none d-flex align-items-center gap-2"
            >
              <ChevronLeft size={20} /> Cambiar servicio
            </button>

            <div
              className="p-4 rounded-5 mb-4"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <label
                className="small fw-black text-uppercase tracking-wider mb-3 d-flex align-items-center gap-2"
                style={{ color: "#ffffff" }}
              >
                <Calendar size={18} /> 1. Elige la Fecha
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="form-control bg-transparent border-0 text-white py-2 shadow-none text-center h4 fw-bold"
                value={fecha}
                onChange={(e) => {
                  setFecha(e.target.value);
                  setHora("");
                }}
                style={{ colorScheme: "dark" }}
              />
            </div>

            {esDiaBloqueado ? (
              <div
                className="text-center py-5 rounded-5 border border-danger border-opacity-25"
                style={{ background: "rgba(220, 38, 38, 0.05)" }}
              >
                <CalendarOff size={48} className="text-danger mb-3" />
                <h6 className="fw-bold text-white">Día No Disponible</h6>
                <p className="small text-white-50 mb-0 px-4">
                  Lo sentimos, la barbería permanecerá cerrada este día.
                </p>
              </div>
            ) : (
              <div>
                <label
                  className="small fw-black text-uppercase tracking-wider mb-3 d-flex align-items-center gap-2 ps-2"
                  style={{ color: "#ffffff" }}
                >
                  <Clock size={18} /> 2. Horarios disponibles
                </label>
                <div className="row g-2">
                  {getHorasDisponibles().map((h) => (
                    <div key={h.hora} className="col-4">
                      <button
                        type="button"
                        disabled={!h.disponible}
                        onClick={() => setHora(h.hora)}
                        className={`btn w-100 py-3 rounded-4 fw-bold transition-all border-0 ${
                          hora === h.hora
                            ? "shadow-lg text-white"
                            : "text-white"
                        }`}
                        style={{
                          background:
                            hora === h.hora
                              ? "#3b82f6"
                              : h.disponible
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(255,255,255,0.01)",
                          border:
                            hora === h.hora
                              ? "none"
                              : "1px solid rgba(255,255,255,0.05)",
                          opacity: h.disponible ? 1 : 0.2,
                        }}
                      >
                        <div className="small">{h.hora}</div>
                        {!h.disponible && (
                          <div style={{ fontSize: "7px", marginTop: "2px" }}>
                            {h.motivo}
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                {hora && (
                  <button
                    type="button"
                    onClick={() => setPaso(3)}
                    className="btn w-100 py-3 rounded-4 fw-black mt-4 shadow-lg border-0 text-white"
                    style={{ background: "#3b82f6" }}
                  >
                    CONTINUAR CON LA RESERVA
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {paso === 3 && (
          <div className="animate-fade-in">
            <button
              type="button"
              onClick={() => setPaso(2)}
              className="btn btn-link text-white-50 p-0 mb-4 text-decoration-none d-flex align-items-center gap-2"
            >
              <ChevronLeft size={20} /> Cambiar fecha u hora
            </button>

            <div
              className="p-4 rounded-5 mb-4"
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <div className="d-flex justify-content-between mb-2">
                <span className="text-white-50 small text-uppercase">
                  Servicio
                </span>
                <span className="fw-bold" style={{ color: "#3b82f6" }}>
                  {servicio?.nombre}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-white-50 small text-uppercase">
                  Fecha y Hora
                </span>
                <span className="fw-bold text-white">
                  {fecha} • {hora} hs
                </span>
              </div>
            </div>

            <form onSubmit={handleFinalizar}>
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="position-relative">
                  <User
                    size={18}
                    className="position-absolute top-50 start-0 translate-middle-y ms-3"
                    style={{ color: "#3b82f6" }}
                  />
                  <input
                    type="text"
                    required
                    className="form-control bg-white bg-opacity-5 border border-white border-opacity-10 text-white py-3 ps-5 rounded-4 shadow-none"
                    placeholder="Tu nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="position-relative">
                  <Phone
                    size={18}
                    className="position-absolute top-50 start-0 translate-middle-y ms-3"
                    style={{ color: "#3b82f6" }}
                  />
                  <input
                    type="tel"
                    required
                    className="form-control bg-white bg-opacity-5 border border-white border-opacity-10 text-white py-3 ps-5 rounded-4 shadow-none"
                    placeholder="Tu WhatsApp"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!nombre || !telefono}
                className="btn w-100 py-3 rounded-4 fw-black shadow-lg border-0 text-white"
                style={{ background: "#3b82f6" }}
              >
                CONFIRMAR TURNO AHORA
              </button>
            </form>
          </div>
        )}

        {paso === 4 && (
          <div className="text-center py-5 animate-fade-in">
            <div
              className="mb-4 d-inline-block p-4 rounded-circle shadow-lg"
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
              }}
            >
              <CheckCircle size={80} className="text-success" />
            </div>
            <h2 className="fw-black mb-2 text-white">¡Reserva Exitosa!</h2>
            <p className="text-white-50 mb-4">
              Gracias {nombre.split(" ")[0]}, tu turno ha sido agendado
              correctamente.
            </p>

            <div
              className="p-4 rounded-5 mb-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h4 className="fw-bold mb-0" style={{ color: "#ffffff" }}>
                {fecha} a las {hora} hs
              </h4>
            </div>

            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="btn btn-outline-light px-5 py-3 rounded-4 fw-bold border-opacity-25"
            >
              VOLVER AL INICIO
            </button>
          </div>
        )}
      </div>

      <style>{`
        .fw-black { font-weight: 900; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .tracking-widest { letter-spacing: 0.3em; }
        .btn:hover { transform: scale(1.02); opacity: 0.9; }
        .btn:disabled { opacity: 0.5; transform: none; }
        input::placeholder { color: rgba(255,255,255,0.4) !important; }
        input:focus { background-color: rgba(255,255,255,0.1) !important; color: white !important; }
      `}</style>
    </div>
  );
};

export default VistaPublica;
