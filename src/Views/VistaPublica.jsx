import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Scissors,
  User,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
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
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <div className="w-100" style={{ maxWidth: "450px" }}>
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate-fade-up">
          {paso < 4 && (
            <div className="bg-primary p-4 text-white text-center">
              <h4 className="fw-bold mb-1">Reserva tu Turno</h4>
              <p className="small opacity-75 mb-0">Paso {paso} de 3</p>
            </div>
          )}

          <div className="card-body p-4">
            {paso === 1 && (
              <div className="animate-fade-in">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <Scissors size={18} className="text-primary" /> Selecciona un
                  Servicio
                </h6>
                <div className="list-group border-0">
                  {servicios.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setServicioSeleccionado(s);
                        setPaso(2);
                      }}
                      className="list-group-item list-group-item-action border rounded-3 mb-2 d-flex justify-content-between align-items-center p-3"
                    >
                      <span className="fw-bold">{s.nombre}</span>
                      <span className="badge bg-success bg-opacity-10 text-success fs-6">
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
                  onClick={() => setPaso(1)}
                  className="btn btn-link text-muted p-0 mb-3 text-decoration-none small d-flex align-items-center gap-1"
                >
                  <ChevronLeft size={14} /> Volver a servicios
                </button>
                <h6 className="fw-bold mb-3">Fecha y Hora</h6>
                <input
                  type="date"
                  className="form-control mb-3 border-0 bg-light py-2"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
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
                          className={`btn w-100 py-2 small ${ocupado ? "btn-light opacity-50" : "btn-outline-primary"}`}
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
              <div className="animate-fade-in text-center">
                <h6 className="fw-bold mb-4">Confirma tus datos</h6>
                <div className="bg-light p-3 rounded-4 mb-4 text-start">
                  <p className="mb-1 small text-muted">
                    Servicio: <strong>{servicioSeleccionado.nombre}</strong>
                  </p>
                  <p className="mb-1 small text-muted">
                    Fecha:{" "}
                    <strong>
                      {fecha} a las {horaSeleccionada}
                    </strong>
                  </p>
                  <p className="mb-0 text-success fw-bold fs-5">
                    Total: ${servicioSeleccionado.precio}
                  </p>
                </div>
                <input
                  type="text"
                  className="form-control form-control-lg border-0 bg-light text-center mb-3"
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                <button
                  disabled={!nombre}
                  onClick={handleFinalizar}
                  className="btn btn-primary btn-lg w-100 rounded-3 shadow"
                >
                  Confirmar Reserva
                </button>
              </div>
            )}

            {paso === 4 && (
              <div className="text-center py-5 animate-fade-in">
                <div className="text-success mb-3">
                  <CheckCircle2 size={64} />
                </div>
                <h3 className="fw-bold">¡Listo, {nombre}!</h3>
                <p className="text-muted">
                  Tu cita para {servicioSeleccionado.nombre} ha sido agendada.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-outline-primary rounded-pill px-4"
                >
                  Volver al inicio
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
