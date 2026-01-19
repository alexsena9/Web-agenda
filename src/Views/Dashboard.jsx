import React from "react";
import {
  Users,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  BarChart3,
} from "lucide-react";

const StatCard = ({ title, value, icon, color }) => (
  <div className="col-md-3 mb-3">
    <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
      <div className="d-flex align-items-center gap-3">
        <div
          className={`p-3 rounded-4 bg-${color} bg-opacity-10 text-${color}`}
        >
          {icon}
        </div>
        <div>
          <h6 className="text-muted small mb-1">{title}</h6>
          <h4 className="fw-bold mb-0">{value}</h4>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = ({ turnos }) => {
  const hoy = new Date().toISOString().split("T")[0];
  const turnosHoy = turnos.filter((t) => t.fecha === hoy).length;
  const clientesUnicos = [...new Set(turnos.map((t) => t.cliente))].length;
  const ingresosEstimados = turnos.length * 2500;

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const actividadPorDia = diasSemana.map((dia) => {
    const cantidad = turnos.filter((t) => {
      const fecha = new Date(t.fecha + "T00:00:00");
      const nombreDia = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ][fecha.getDay()];
      return nombreDia === dia;
    }).length;
    return { dia, cantidad };
  });

  const maxActividad = Math.max(...actividadPorDia.map((d) => d.cantidad), 1);

  return (
    <div className="view-animate text-start">
      <div className="mb-4">
        <h2 className="fw-bold">Panel de Control</h2>
        <p className="text-muted">Análisis de rendimiento de tu agenda.</p>
      </div>

      <div className="row mb-4">
        <StatCard
          title="Turnos Hoy"
          value={turnosHoy}
          icon={<CalendarCheck />}
          color="primary"
        />
        <StatCard
          title="Clientes"
          value={clientesUnicos}
          icon={<Users />}
          color="success"
        />
        <StatCard
          title="Ingresos Est."
          value={`$${ingresosEstimados}`}
          icon={<TrendingUp />}
          color="info"
        />
        <StatCard
          title="Total Turnos"
          value={turnos.length}
          icon={<AlertCircle />}
          color="warning"
        />
      </div>

      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-4">
              <BarChart3 className="text-primary" size={20} />
              <h5 className="fw-bold mb-0">Actividad Semanal</h5>
            </div>
            {actividadPorDia.map((item, index) => (
              <div key={index} className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small fw-medium">{item.dia}</span>
                  <span className="small text-muted">
                    {item.cantidad} turnos
                  </span>
                </div>
                <div
                  className="progress rounded-pill"
                  style={{ height: "8px" }}
                >
                  <div
                    className="progress-bar bg-primary rounded-pill transition-all"
                    style={{
                      width: `${(item.cantidad / maxActividad) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-7 mb-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4">Últimos Agendados</h5>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr className="text-muted small">
                    <th>CLIENTE</th>
                    <th>SERVICIO</th>
                    <th>HORA</th>
                  </tr>
                </thead>
                <tbody>
                  {turnos.length > 0 ? (
                    turnos
                      .slice(-4)
                      .reverse()
                      .map((t) => (
                        <tr key={t.id}>
                          <td className="fw-bold">{t.cliente}</td>
                          <td>{t.servicio}</td>
                          <td>
                            <span className="badge bg-light text-primary rounded-pill">
                              {t.hora} hs
                            </span>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No hay datos
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
