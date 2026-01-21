import React, { useState } from "react";
import { Scissors, CheckCircle, ChevronLeft, CalendarOff } from "lucide-react";

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
        (t) => t.fecha === fecha && t.hora === hStr,
      );
      const bloqueado = (bloqueos || []).some(
        (b) => b.tipo === "hora" && b.fecha === fecha && b.valor === hStr,
      );
      list.push({ valor: hStr, ocupado, bloqueado });
    }
    return list;
  };

  const handleFinalizar = async () => {
    if (!nombre || !telefono || !servicio || !hora) return;
    await onAddTurno({
      cliente: nombre,
      telefono,
      servicio: servicio.nombre,
      precio: servicio.precio,
      fecha,
      hora,
    });
    setPaso(4);
  };

  return (
    <div className="min-vh-100 p-3 p-md-5 bg-dark text-white">
      <div className="mx-auto" style={{ maxWidth: "500px" }}>
        {paso === 1 && (
          <div className="animate-fade-in">
            <h2 className="fw-bold mb-4 text-center">Nuestros Servicios</h2>
            {servicios.map((s, i) => (
              <div
                key={i}
                onClick={() => {
                  setServicio(s);
                  setPaso(2);
                }}
                className="card bg-secondary bg-opacity-25 border-0 p-4 rounded-4 mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">{s.nombre}</h5>
                  <span className="text-primary fw-bold">${s.precio}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {paso === 2 && (
          <div className="animate-fade-in text-start">
            <button
              onClick={() => setPaso(1)}
              className="btn btn-link text-white mb-3 p-0 text-decoration-none d-flex align-items-center gap-1"
            >
              <ChevronLeft size={18} /> Volver
            </button>
            <h4 className="fw-bold mb-4">Selecciona Fecha y Hora</h4>
            <input
              type="date"
              className="form-control bg-secondary border-0 text-white py-3 rounded-4 mb-4 shadow-none"
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                setHora("");
              }}
            />
            {esDiaBloqueado ? (
              <div className="text-center py-4 bg-danger bg-opacity-10 rounded-4 border border-danger border-opacity-25">
                <CalendarOff className="text-danger mb-2" />
                <p className="text-danger fw-bold mb-0">
                  No hay disponibilidad para este día.
                </p>
              </div>
            ) : (
              <div className="row g-2">
                {getHorasDisponibles().map((h, i) => (
                  <div key={i} className="col-4">
                    <button
                      disabled={h.ocupado || h.bloqueado}
                      onClick={() => {
                        setHora(h.valor);
                        setPaso(3);
                      }}
                      className={`btn w-100 py-3 rounded-4 fw-bold ${hora === h.valor ? "btn-primary" : "btn-outline-light border-0 bg-secondary bg-opacity-25"}`}
                    >
                      {h.valor}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {paso === 3 && (
          <div className="animate-fade-in text-start">
            <button
              onClick={() => setPaso(2)}
              className="btn btn-link text-white mb-3 p-0 text-decoration-none d-flex align-items-center gap-1"
            >
              <ChevronLeft size={18} /> Volver
            </button>
            <h4 className="fw-bold mb-4">Tus Datos</h4>
            <div className="bg-primary bg-opacity-10 p-3 rounded-4 mb-4 border border-primary border-opacity-25">
              <div className="small fw-bold text-primary text-uppercase mb-1">
                Resumen
              </div>
              <div className="fw-bold">
                {servicio.nombre} - {fecha} a las {hora} hs.
              </div>
            </div>
            <input
              type="text"
              className="form-control bg-secondary border-0 text-white py-3 rounded-4 mb-3"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="tel"
              className="form-control bg-secondary border-0 text-white py-3 rounded-4 mb-4"
              placeholder="WhatsApp (Ej: 1122334455)"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <button
              onClick={handleFinalizar}
              className="btn btn-primary w-100 py-3 rounded-4 fw-bold"
            >
              RESERVAR AHORA
            </button>
          </div>
        )}
        {paso === 4 && (
          <div className="text-center py-5 animate-fade-in">
            <CheckCircle size={80} className="text-success mb-4" />
            <h2 className="fw-bold mb-2">¡Reservado!</h2>
            <p className="opacity-75 text-start text-center">
              Te esperamos el {fecha} a las {hora}.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="btn btn-primary px-5 py-3 rounded-4 fw-bold mt-4"
            >
              CERRAR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default VistaPublica;
