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
} from "lucide-react";

const Agenda = ({ turnos, onCompletar, onEliminar }) => {
  const [filtroFecha, setFiltroFecha] = useState(
    new Date().toISOString().split("T")[0],
  );

  const turnosHoy = turnos
    .filter((t) => t.fecha === filtroFecha)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const whatsappLink = (t) => {
    const msg = `Hola ${t.cliente}, confirmamos tu turno de ${t.servicio} para el día ${t.fecha} a las ${t.hora} hs.`;
    return `https://wa.me/${t.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Agenda Diaria</h2>
          <p className="text-muted mb-0">
            Gestiona las citas del día seleccionado
          </p>
        </div>
        <div className="bg-white p-2 rounded-4 shadow-sm d-flex align-items-center gap-2 border">
          <Calendar size={20} className="text-primary ms-2" />
          <input
            type="date"
            className="form-control border-0 shadow-none fw-bold text-dark"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-4">
        {turnosHoy.length > 0 ? (
          turnosHoy.map((t) => (
            <div
              key={t.id}
              className="col-12 col-md-6 col-xxl-4 animate-fade-up"
            >
              <div className="card border-0 shadow-sm rounded-5 h-100 overflow-hidden">
                <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-4 px-3 py-2 fw-bold d-flex align-items-center gap-2">
                    <Clock size={16} /> {t.hora} HS
                  </span>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => onCompletar(t)}
                      className="btn btn-success btn-sm rounded-circle p-2 border-0 shadow-sm"
                      title="Marcar como realizado"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => onEliminar(t)}
                      className="btn btn-outline-danger btn-sm rounded-circle p-2 border-0"
                      title="Eliminar cita"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="card-body px-4 pb-4 pt-3">
                  <div className="mb-3 text-start">
                    <h5 className="fw-bold text-dark text-capitalize mb-1">
                      {t.cliente}
                    </h5>
                    <a
                      href={whatsappLink(t)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-decoration-none d-flex align-items-center gap-2 text-success fw-bold small"
                    >
                      <MessageCircle size={16} /> {t.telefono}
                    </a>
                  </div>
                  <div className="bg-light rounded-4 p-3 border d-flex justify-content-between align-items-center">
                    <div className="text-start">
                      <small
                        className="text-muted d-block text-uppercase fw-bold"
                        style={{ fontSize: "0.65rem" }}
                      >
                        Servicio
                      </small>
                      <span className="fw-bold text-dark">
                        <Scissors size={14} className="me-1 text-primary" />{" "}
                        {t.servicio}
                      </span>
                    </div>
                    <div className="text-end">
                      <small
                        className="text-muted d-block text-uppercase fw-bold"
                        style={{ fontSize: "0.65rem" }}
                      >
                        Precio
                      </small>
                      <span className="fw-bold text-dark">${t.precio}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="bg-white rounded-5 p-5 shadow-sm d-inline-block w-100 border">
              <Calendar size={60} className="text-muted opacity-25 mb-3" />
              <h4 className="fw-bold text-muted">
                No hay citas para esta fecha
              </h4>
              <p className="text-muted mb-0">
                Los turnos agendados aparecerán aquí.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Agenda;
