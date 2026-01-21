import React, { useState } from "react";
import {
  Check,
  Trash2,
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Agenda = ({ turnos, onCompletar, onEliminar }) => {
  const [filtroFecha, setFiltroFecha] = useState(
    new Date().toISOString().split("T")[0],
  );

  const cambiarDia = (offset) => {
    const fecha = new Date(filtroFecha + "T12:00:00");
    fecha.setDate(fecha.getDate() + offset);
    setFiltroFecha(fecha.toISOString().split("T")[0]);
  };

  const turnosHoy = turnos
    .filter((t) => t.fecha === filtroFecha)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const whatsappLink = (t) => {
    const msg = `Hola ${t.cliente}, confirmamos tu turno de ${t.servicio} para el día ${t.fecha} a las ${t.hora} hs.`;
    return `https://wa.me/${t.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="animate-fade-in text-start">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Agenda Diaria</h2>
          <p className="text-muted mb-0">
            Gestiona las citas del día seleccionado
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 bg-white p-2 rounded-4 shadow-sm">
          <button
            onClick={() => cambiarDia(-1)}
            className="btn btn-light rounded-circle p-2 border-0"
          >
            <ChevronLeft size={20} />
          </button>

          <input
            type="date"
            className="form-control border-0 fw-bold shadow-none"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            style={{ width: "160px", cursor: "pointer" }}
          />

          <button
            onClick={() => cambiarDia(1)}
            className="btn btn-light rounded-circle p-2 border-0"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="row g-3">
        {turnosHoy.length > 0 ? (
          turnosHoy.map((t) => (
            <div key={t.id} className="col-12 col-xl-6">
              <div
                className={`card border-0 shadow-sm rounded-5 overflow-hidden transition-all ${
                  t.estado === "Completado" ? "opacity-75 bg-light" : "bg-white"
                }`}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-4 text-primary">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h4 className="fw-bold mb-0">{t.hora} hs</h4>
                        <span
                          className={`badge rounded-pill ${
                            t.estado === "Completado"
                              ? "bg-success text-success"
                              : "bg-warning text-warning"
                          } bg-opacity-10 px-3`}
                        >
                          {t.estado}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      {t.estado !== "Completado" && (
                        <button
                          onClick={() => onCompletar(t.id)}
                          className="btn btn-success rounded-circle p-2 shadow-sm border-0"
                          title="Completar"
                        >
                          <Check size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => onEliminar(t.id)}
                        className="btn btn-outline-danger rounded-circle p-2 border-0"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-light rounded-4 p-3 mb-3">
                    <div className="d-flex align-items-center gap-2 mb-2 text-dark">
                      <User size={18} className="text-primary" />
                      <span className="fw-bold text-capitalize">
                        {t.cliente}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <Phone size={16} />
                      <span>{t.telefono}</span>
                      <a
                        href={whatsappLink(t)}
                        target="_blank"
                        rel="noreferrer"
                        className="ms-auto text-success text-decoration-none d-flex align-items-center gap-1 fw-bold"
                      >
                        <MessageCircle size={16} /> Contactar
                      </a>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center px-2">
                    <div>
                      <small
                        className="text-muted d-block text-uppercase fw-bold mb-1"
                        style={{ fontSize: "0.65rem" }}
                      >
                        Servicio
                      </small>
                      <span className="fw-bold text-dark">
                        <Scissors size={14} className="me-1 text-primary" />
                        {t.servicio}
                      </span>
                    </div>
                    <div className="text-end">
                      <small
                        className="text-muted d-block text-uppercase fw-bold mb-1"
                        style={{ fontSize: "0.65rem" }}
                      >
                        Precio
                      </small>
                      <span className="fw-bold text-dark text-primary">
                        ${t.precio}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="bg-white rounded-5 p-5 shadow-sm d-inline-block w-100 border border-light">
              <Calendar size={60} className="text-muted opacity-25 mb-3" />
              <h4 className="fw-bold text-muted">
                No hay citas para esta fecha
              </h4>
              <button
                onClick={() =>
                  setFiltroFecha(new Date().toISOString().split("T")[0])
                }
                className="btn btn-link text-primary text-decoration-none mt-2 fw-bold"
              >
                Volver a hoy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agenda;
