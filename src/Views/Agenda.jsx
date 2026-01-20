import React from "react";
import {
  Trash2,
  Clock,
  User,
  Scissors,
  Calendar as CalendarIcon,
} from "lucide-react";

const Agenda = ({ turnos, horarios, onEliminarTurno }) => {
  const hoy = new Date().toISOString().split("T")[0];

  const turnosHoy = turnos
    .filter((t) => t.fecha === hoy)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  return (
    <div className="animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Agenda del Día</h2>
          <p className="text-muted mb-0 d-flex align-items-center gap-2">
            <CalendarIcon size={16} />{" "}
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-4 shadow-sm border">
          <span className="text-muted small fw-bold">TOTAL TURNOS:</span>
          <span className="ms-2 fw-bold text-primary">{turnosHoy.length}</span>
        </div>
      </div>

      <div className="row g-3">
        {turnosHoy.length > 0 ? (
          turnosHoy.map((turno) => (
            <div key={turno.id} className="col-12 col-xl-6">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="d-flex">
                  <div className="bg-primary d-flex align-items-center justify-content-center px-3 text-white">
                    <div className="text-center">
                      <Clock size={20} className="mb-1" />
                      <div className="fw-bold small">{turno.hora}</div>
                    </div>
                  </div>

                  <div className="card-body p-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <User size={16} className="text-primary" />
                        <h6 className="fw-bold mb-0 text-capitalize">
                          {turno.cliente}
                        </h6>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Scissors size={14} className="text-muted" />
                        <span className="text-muted small">
                          {turno.servicio}
                        </span>
                        <span className="badge bg-light text-dark border ms-2">
                          ${turno.precio}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `¿Finalizar turno de ${turno.cliente}? Se registrará como cliente.`,
                          )
                        ) {
                          onEliminarTurno(turno);
                        }
                      }}
                      className="btn btn-light text-danger rounded-circle p-2 hover-shadow"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="bg-white rounded-5 p-5 text-center border-2 border-dashed">
              <div className="opacity-25 mb-3">
                <CalendarIcon size={60} />
              </div>
              <h5 className="text-muted">No hay turnos programados para hoy</h5>
              <p className="text-muted small">
                Los nuevos turnos aparecerán aquí automáticamente
              </p>
            </div>
          </div>
        )}
      </div>

      {turnos.filter((t) => t.fecha > hoy).length > 0 && (
        <div className="mt-5">
          <h5 className="fw-bold text-dark mb-4">Próximos Días</h5>
          <div className="table-responsive bg-white rounded-4 shadow-sm border">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0 small text-muted">FECHA</th>
                  <th className="py-3 border-0 small text-muted">HORA</th>
                  <th className="py-3 border-0 small text-muted">CLIENTE</th>
                  <th className="py-3 border-0 small text-muted">SERVICIO</th>
                  <th className="py-3 border-0 small text-muted text-end px-4">
                    ACCIONES
                  </th>
                </tr>
              </thead>
              <tbody>
                {turnos
                  .filter((t) => t.fecha > hoy)
                  .sort((a, b) => a.fecha.localeCompare(b.fecha))
                  .map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 fw-medium small">{t.fecha}</td>
                      <td className="small">{t.hora}</td>
                      <td className="fw-bold small text-capitalize">
                        {t.cliente}
                      </td>
                      <td>
                        <span className="badge bg-primary bg-opacity-10 text-primary">
                          {t.servicio}
                        </span>
                      </td>
                      <td className="text-end px-4">
                        <button
                          onClick={() => onEliminarTurno(t)}
                          className="btn btn-sm text-danger"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
