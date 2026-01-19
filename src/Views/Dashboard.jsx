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
  const hoy = new Date().toISOString().split("T")[0];

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
    const mensaje = `Hola ${turno.cliente}, te estamos esperando para tu turno de las ${turno.hora} hs.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  return (
    <div className="view-animate text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">¡Hola, Alexis!</h2>
          <p className="text-muted">Esto es lo que tienes para hoy.</p>
        </div>
        <button
          onClick={onNewTurn}
          className="btn btn-primary rounded-pill px-4 d-none d-md-block shadow-sm"
        >
          + Nuevo Turno
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div
            className="d-flex gap-3 overflow-auto pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            <button
              onClick={() => setView("agenda")}
              className="btn btn-white shadow-sm border-0 rounded-4 p-3 text-start flex-shrink-0"
              style={{ minWidth: "160px" }}
            >
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 mb-2 d-inline-block">
                <Calendar size={20} />
              </div>
              <p className="mb-0 fw-bold">Ver Agenda</p>
              <small className="text-muted">Ir al calendario</small>
            </button>
            <button
              onClick={() => setView("clientes")}
              className="btn btn-white shadow-sm border-0 rounded-4 p-3 text-start flex-shrink-0"
              style={{ minWidth: "160px" }}
            >
              <div className="bg-success bg-opacity-10 text-success p-2 rounded-3 mb-2 d-inline-block">
                <Users size={20} />
              </div>
              <p className="mb-0 fw-bold">Clientes</p>
              <small className="text-muted">Lista de contactos</small>
            </button>
            <button
              onClick={onNewTurn}
              className="btn btn-white shadow-sm border-0 rounded-4 p-3 text-start flex-shrink-0"
              style={{ minWidth: "160px" }}
            >
              <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-3 mb-2 d-inline-block">
                <UserPlus size={20} />
              </div>
              <p className="mb-0 fw-bold">Agendar</p>
              <small className="text-muted">Crear nueva cita</small>
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-dark text-white overflow-hidden position-relative">
            <div className="position-relative" style={{ zIndex: 1 }}>
              <h5 className="opacity-75 mb-4">Próximo Cliente</h5>
              {proximoTurno ? (
                <div className="d-md-flex justify-content-between align-items-end">
                  <div>
                    <h1 className="display-4 fw-bold mb-2">
                      {proximoTurno.cliente}
                    </h1>
                    <div className="d-flex align-items-center gap-3 mb-4 mb-md-0">
                      <span className="badge bg-primary px-3 py-2 rounded-pill fs-6">
                        <Clock size={18} className="me-2" /> {proximoTurno.hora}{" "}
                        hs
                      </span>
                      <span className="text-white-50">
                        {proximoTurno.servicio}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => enviarRecordatorio(proximoTurno)}
                      className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2"
                    >
                      <MessageSquare size={18} /> Avisar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <h3 className="opacity-50">
                    No hay más turnos pendientes por ahora.
                  </h3>
                </div>
              )}
            </div>
            <div
              className="position-absolute end-0 bottom-0 opacity-10"
              style={{ marginRight: "-20px", marginBottom: "-20px" }}
            >
              <Users size={200} />
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-3">Progreso de Hoy</h5>
            <div className="text-center mb-4">
              <div className="position-relative d-inline-block">
                <h2 className="fw-bold mb-0 mt-3">
                  {Math.round(progresoHoy)}%
                </h2>
                <p className="text-muted small">Completado</p>
              </div>
            </div>
            <div
              className="progress rounded-pill mb-4"
              style={{ height: "10px" }}
            >
              <div
                className="progress-bar bg-success"
                style={{ width: `${progresoHoy}%` }}
              ></div>
            </div>
            <div className="d-flex justify-content-between border-top pt-3">
              <div className="text-center border-end w-50">
                <h4 className="fw-bold mb-0 text-primary">{pendientesHoy}</h4>
                <small className="text-muted small">Pendientes</small>
              </div>
              <div className="text-center w-50">
                <h4 className="fw-bold mb-0 text-success">{completadosHoy}</h4>
                <small className="text-muted small">Realizados</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: LISTA RÁPIDA DE HOY */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Turnos de Hoy</h5>
              <button
                onClick={() => setView("agenda")}
                className="btn btn-link text-primary text-decoration-none small fw-bold"
              >
                Ver todo <ArrowRight size={16} />
              </button>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
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
      </div>
    </div>
  );
};

export default Dashboard;
