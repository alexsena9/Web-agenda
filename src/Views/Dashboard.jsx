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

  const ahora = new Date();
  const horaActual =
    ahora.getHours().toString().padStart(2, "0") +
    ":" +
    ahora.getMinutes().toString().padStart(2, "0");

  const proximoTurno = turnosHoy
    .filter((t) => t.estado !== "Completado" && t.hora >= horaActual)
    .sort((a, b) => a.hora.localeCompare(b.hora))[0];

  const enviarRecordatorio = (turno) => {
    const mensaje = `Hola ${turno.cliente}, te estamos esperando para tu turno de ${turno.servicio} a las ${turno.hora} hs.`;
    window.open(
      `https://wa.me/${turno.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`,
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="text-start">
          <h2 className="fw-bold mb-1 text-dark">Panel Principal</h2>
          <p className="text-muted mb-0">Estado actual de tu barbería</p>
        </div>
        <button
          onClick={onNewTurn}
          className="btn btn-primary rounded-4 px-4 py-2 d-flex align-items-center gap-2 shadow-sm border-0"
        >
          <UserPlus size={20} />
          <span className="d-none d-md-inline fw-bold">Nuevo Turno</span>
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-5 p-3 text-start h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded-4 text-primary">
                <CalendarCheck size={24} />
              </div>
              <div>
                <h3 className="fw-bold mb-0">{turnosHoy.length}</h3>
                <small className="text-muted fw-bold">Turnos hoy</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-5 p-3 text-start h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 p-3 rounded-4 text-success">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="fw-bold mb-0">{completadosHoy}</h3>
                <small className="text-muted fw-bold">Realizados</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-5 p-3 text-start h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-10 p-3 rounded-4 text-warning">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="fw-bold mb-0">{pendientesHoy}</h3>
                <small className="text-muted fw-bold">Pendientes</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-5 p-4 text-start">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Próxima Cita</h5>
              <button
                onClick={() => setView("agenda")}
                className="btn btn-link text-primary text-decoration-none p-0 fw-bold small d-flex align-items-center gap-1"
              >
                Ver agenda <ArrowRight size={16} />
              </button>
            </div>

            {proximoTurno ? (
              <div className="bg-light rounded-5 p-4 border border-2 border-primary border-opacity-10">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary p-3 rounded-circle text-white shadow-primary">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="fw-bold mb-1">{proximoTurno.hora} HS</h4>
                      <h5 className="text-dark text-capitalize mb-0">
                        {proximoTurno.cliente}
                      </h5>
                      <span className="badge bg-white text-primary border border-primary border-opacity-25 rounded-pill px-3 mt-2">
                        {proximoTurno.servicio}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => enviarRecordatorio(proximoTurno)}
                    className="btn btn-success rounded-4 px-4 py-3 d-flex align-items-center justify-content-center gap-2 fw-bold"
                  >
                    <MessageSquare size={20} />
                    Enviar Recordatorio
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 bg-light rounded-5 border border-dashed">
                <Calendar size={40} className="text-muted mb-2 opacity-25" />
                <p className="text-muted mb-0">No hay más turnos para hoy</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-5 p-4 h-100 text-start">
            <h5 className="fw-bold mb-4">Resumen del Día</h5>
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small fw-bold">EFECTIVIDAD</span>
                <span className="text-primary small fw-bold">
                  {Math.round(progresoHoy)}%
                </span>
              </div>
              <div
                className="progress rounded-pill shadow-sm"
                style={{ height: "10px" }}
              >
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${progresoHoy}%` }}
                ></div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr className="text-muted small">
                    <th>HORA</th>
                    <th>CLIENTE</th>
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
                            <div className="fw-bold text-capitalize">
                              {t.cliente}
                            </div>
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
