import React from "react";
import {
  Users,
  CalendarCheck,
  TrendingUp,
  CheckCircle2,
  MessageSquare,
  UserPlus,
  Calendar,
  ArrowRight,
  Clock,
} from "lucide-react";

const Dashboard = ({ turnos, setView, onNewTurn }) => {
  const hoy = new Date().toLocaleDateString("en-CA");

  const turnosHoy = turnos.filter((t) => t.fecha === hoy);

  const completadosHoy = turnosHoy.filter(
    (t) => t.estado === "Completado",
  ).length;

  const pendientesHoy = turnosHoy.length - completadosHoy;

  const progresoHoy =
    turnosHoy.length > 0 ? (completadosHoy / turnosHoy.length) * 100 : 0;

  const horaActual = new Date().toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const proximoTurno = turnosHoy
    .filter((t) => t.estado !== "Completado" && t.hora >= horaActual)
    .sort((a, b) => a.hora.localeCompare(b.hora))[0];

  const enviarRecordatorio = (turno) => {
    const mensaje = `Hola ${turno.cliente}, te estamos esperando para tu turno de ${turno.servicio} a las ${turno.hora}.`;
    window.open(
      `https://wa.me/${turno.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`,
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Panel de Control</h2>
          <p className="text-muted mb-0">Resumen de actividad para hoy</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded-4 text-primary">
                <CalendarCheck size={24} />
              </div>
              <div>
                <h3 className="fw-bold mb-0">{turnosHoy.length}</h3>
                <small className="text-muted text-uppercase fw-bold">
                  Turnos Hoy
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 p-3 rounded-4 text-success">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="fw-bold mb-0">{completadosHoy}</h3>
                <small className="text-muted text-uppercase fw-bold">
                  Realizados
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-10 p-3 rounded-4 text-warning">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="fw-bold mb-0">{pendientesHoy}</h3>
                <small className="text-muted text-uppercase fw-bold">
                  Pendientes
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Próximos Turnos</h5>
              <button
                onClick={() => setView("agenda")}
                className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-1"
              >
                Ver agenda <ArrowRight size={16} />
              </button>
            </div>
            <div className="table-responsive px-4 pb-4">
              <table className="table align-middle mb-0">
                <thead className="text-muted small">
                  <tr>
                    <th>HORA</th>
                    <th>CLIENTE / SERVICIO</th>
                    <th className="text-end">ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  {turnosHoy.length > 0 ? (
                    turnosHoy
                      .sort((a, b) => a.hora.localeCompare(b.hora))
                      .map((t) => (
                        <tr key={t.id}>
                          <td style={{ width: "80px" }}>
                            <span className="fw-bold">{t.hora}</span>
                          </td>
                          <td>
                            <div className="fw-bold">{t.cliente}</div>
                            <small className="text-muted">{t.servicio}</small>
                          </td>
                          <td className="text-end">
                            {t.estado === "Completado" ? (
                              <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">
                                Realizado
                              </span>
                            ) : (
                              <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3">
                                Pendiente
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted">
                        No hay turnos para hoy
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-primary text-white">
            <h5 className="fw-bold mb-4">Siguiente Cita</h5>
            {proximoTurno ? (
              <div className="animate-fade-in">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    className="bg-white bg-opacity-20 p-3 rounded-circle"
                    style={{ width: "64px", height: "64px" }}
                  >
                    <Clock size={32} />
                  </div>
                  <div>
                    <h2 className="fw-bold mb-0">{proximoTurno.hora}</h2>
                    <p className="mb-0 opacity-75">{proximoTurno.cliente}</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-4 p-3 mb-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Calendar size={16} />
                    <span className="small">Hoy</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <MessageSquare size={16} />
                    <span className="small">{proximoTurno.servicio}</span>
                  </div>
                </div>
                <button
                  onClick={() => enviarRecordatorio(proximoTurno)}
                  className="btn btn-light w-100 rounded-4 py-3 fw-bold text-primary"
                >
                  Enviar Recordatorio
                </button>
              </div>
            ) : (
              <div className="text-center py-4 opacity-75">
                <p>No hay más citas para el resto del día.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
