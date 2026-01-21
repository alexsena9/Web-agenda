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
    new Date().toLocaleDateString("en-CA"),
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
        <div className="text-start">
          <h2 className="fw-bold mb-1 text-dark">Agenda Diaria</h2>
          <p className="text-muted mb-0">
            Gestiona las citas del día seleccionado
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 bg-white p-2 rounded-4 shadow-sm border">
          <Calendar className="text-primary ms-2" size={20} />
          <input
            type="date"
            className="form-control border-0 fw-bold shadow-none"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-3">
        {turnosHoy.length > 0 ? (
          turnosHoy.map((t) => (
            <div key={t.id} className="col-12 col-xl-6">
              <div
                className={`card border-0 shadow-sm rounded-5 overflow-hidden ${t.estado === "Completado" ? "opacity-75" : ""}`}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className={`p-3 rounded-circle ${t.estado === "Completado" ? "bg-success text-white" : "bg-primary bg-opacity-10 text-primary"}`}
                      >
                        {t.estado === "Completado" ? (
                          <Check size={24} />
                        ) : (
                          <Clock size={24} />
                        )}
                      </div>
                      <div>
                        <h4 className="fw-bold mb-0 text-dark">{t.hora} hs</h4>
                        <span
                          className={`badge rounded-pill ${t.estado === "Completado" ? "bg-success bg-opacity-10 text-success" : "bg-warning bg-opacity-10 text-warning"}`}
                        >
                          {t.estado || "Pendiente"}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      {t.estado !== "Completado" && (
                        <button
                          onClick={() => onCompletar(t.id)}
                          className="btn btn-light rounded-circle p-2 text-success shadow-sm"
                        >
                          <Check size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => onEliminar(t.id)}
                        className="btn btn-light rounded-circle p-2 text-danger shadow-sm"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-light rounded-4 p-3 mb-3 text-start">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <User size={18} className="text-muted" />
                      <span className="fw-bold text-capitalize">
                        {t.cliente}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <Phone size={18} className="text-muted" />
                      <span>{t.telefono}</span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-2">
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
                    <a
                      href={whatsappLink(t)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success rounded-4 px-4 d-flex align-items-center gap-2"
                    >
                      <MessageCircle size={18} /> Confirmar
                    </a>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agenda;
