import React from "react";
import {
  Trash2,
  Clock,
  User,
  MessageCircle,
  CheckCircle,
  Calendar,
} from "lucide-react";

const Agenda = ({ turnos, onCompletar, onEliminar }) => {
  const hoy = new Date().toISOString().split("T")[0];
  const turnosHoy = turnos
    .filter((t) => t.fecha === hoy)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const enviarWpp = (tel, nombre) => {
    const msg = `Hola ${nombre}, te hablamos de la Barbería para confirmar tu turno.`;
    window.open(
      `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Agenda Diaria</h2>
        <div className="badge bg-white text-dark border p-2 px-3 rounded-pill shadow-sm">
          <Calendar size={16} className="me-2 text-primary" /> {hoy}
        </div>
      </div>
      <div className="row g-3">
        {turnosHoy.length > 0 ? (
          turnosHoy.map((t) => (
            <div key={t.id} className="col-12">
              <div className="card border-0 shadow-sm rounded-4 p-3">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="bg-primary text-white p-2 rounded-3 fw-bold shadow-sm d-flex flex-column align-items-center"
                      style={{ minWidth: "65px" }}
                    >
                      <Clock size={16} />
                      <span style={{ fontSize: "0.8rem" }}>{t.hora}</span>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-capitalize">
                        {t.cliente}
                      </h6>
                      <small className="text-muted">
                        {t.servicio} • ${t.precio}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => enviarWpp(t.telefono, t.cliente)}
                      className="btn btn-light text-success rounded-circle p-2 shadow-sm"
                    >
                      <MessageCircle size={20} />
                    </button>
                    <button
                      onClick={() => onCompletar(t)}
                      className="btn btn-light text-primary rounded-circle p-2 shadow-sm"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => onEliminar(t)}
                      className="btn btn-light text-danger rounded-circle p-2 shadow-sm"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5 bg-white rounded-5 border-2 border-dashed">
            <p className="text-muted mb-0">No hay turnos para hoy</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Agenda;
