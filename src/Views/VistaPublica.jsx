import React, { useState } from "react";
import {
  Scissors,
  Calendar,
  Clock,
  User,
  CheckCircle,
  ChevronLeft,
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

  const esDiaBloqueado = bloqueos.includes(fecha);

  const getHorasDisponibles = () => {
    const start = parseInt(horarios.inicio.split(":")[0]);
    const end = parseInt(horarios.fin.split(":")[0]);
    let list = [];
    for (let i = start; i < end; i++) {
      const h = `${i.toString().padStart(2, "0")}:00`;
      const ocupado = turnos.some((t) => t.fecha === fecha && t.hora === h);
      if (!ocupado) list.push(h);
    }
    return list;
  };

  return (
    <div
      className="min-vh-100 p-3 p-md-5"
      style={{ backgroundColor: "#020617" }}
    >
      <div className="mx-auto" style={{ maxWidth: "600px" }}>
        <div className="text-center mb-5 animate-fade-in">
          <div className="bg-primary p-3 rounded-circle d-inline-flex mb-3">
            <Scissors size={30} className="text-white" />
          </div>
          <h2 className="text-white fw-bold">Reserva tu Cita</h2>
        </div>

        {paso === 1 && (
          <div className="row g-3 animate-fade-up">
            {servicios.map((s, i) => (
              <div key={i} className="col-12">
                <div
                  onClick={() => {
                    setServicio(s);
                    setPaso(2);
                  }}
                  className="card portal-card border-0 p-4 rounded-4"
                >
                  <div className="d-flex justify-content-between align-items-center text-white">
                    <h5 className="fw-bold mb-0">{s.nombre}</h5>
                    <span className="fw-bold text-primary">${s.precio}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {paso === 2 && (
          <div className="animate-fade-up bg-white bg-opacity-5 p-4 rounded-5 border border-white border-opacity-10 text-white">
            <button
              onClick={() => setPaso(1)}
              className="btn btn-link text-white text-decoration-none p-0 mb-4"
            >
              <ChevronLeft /> Volver
            </button>
            <h6 className="fw-bold opacity-50 mb-3 small uppercase tracking-wider">
              SELECCIONA FECHA Y HORA
            </h6>
            <input
              type="date"
              className="form-control bg-dark border-0 text-white py-3 rounded-4 mb-4 shadow-none"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />

            {esDiaBloqueado ? (
              <div className="text-center p-4 bg-danger bg-opacity-10 rounded-4 border border-danger border-opacity-20 text-danger fw-bold">
                Día no disponible o cerrado
              </div>
            ) : (
              <div className="row g-2">
                {getHorasDisponibles().map((h) => (
                  <div key={h} className="col-4">
                    <button
                      onClick={() => {
                        setHora(h);
                        setPaso(3);
                      }}
                      className="btn btn-outline-light w-100 py-2 rounded-3 border-opacity-25"
                    >
                      {h}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {paso === 3 && (
          <div className="animate-fade-up bg-white bg-opacity-5 p-4 rounded-5 border border-white border-opacity-10 text-white">
            <button
              onClick={() => setPaso(2)}
              className="btn btn-link text-white text-decoration-none p-0 mb-4"
            >
              <ChevronLeft /> Volver
            </button>
            <input
              type="text"
              className="form-control bg-dark border-0 text-white py-3 rounded-4 mb-3"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="tel"
              className="form-control bg-dark border-0 text-white py-3 rounded-4 mb-4"
              placeholder="WhatsApp (Ej: 11223344)"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <button
              onClick={() => {
                onAddTurno({
                  cliente: nombre,
                  telefono,
                  servicio: servicio.nombre,
                  precio: servicio.precio,
                  fecha,
                  hora,
                  estado: "Confirmado",
                });
                setPaso(4);
              }}
              className="btn btn-primary w-100 py-3 rounded-4 fw-bold"
            >
              Agendar Ahora
            </button>
          </div>
        )}

        {paso === 4 && (
          <div className="text-center animate-fade-in text-white py-5">
            <CheckCircle size={80} className="text-success mb-4" />
            <h2 className="fw-bold mb-3">¡Reserva Exitosa!</h2>
            <p className="opacity-75">
              Te esperamos el {fecha} a las {hora}.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="btn btn-primary px-5 py-3 rounded-4 fw-bold mt-4"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default VistaPublica;
