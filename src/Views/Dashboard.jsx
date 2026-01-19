import React from "react";
import { Users, CalendarCheck, TrendingUp, AlertCircle } from "lucide-react";

const StatCard = ({ title, value, icon, color }) => (
  <div className="col-md-3 mb-3">
    <div className="card border-0 shadow-sm rounded-4 p-3">
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

const Dashboard = () => (
  <div className="view-animate">
    <div className="mb-4">
      <h2 className="fw-bold">Panel de Control</h2>
      <p className="text-muted">Resumen operativo de hoy.</p>
    </div>

    <div className="row mb-4">
      <StatCard
        title="Turnos Hoy"
        value="12"
        icon={<CalendarCheck />}
        color="primary"
      />
      <StatCard title="Clientes" value="154" icon={<Users />} color="success" />
      <StatCard
        title="Ingresos"
        value="$45.200"
        icon={<TrendingUp />}
        color="info"
      />
      <StatCard
        title="Avisos"
        value="2"
        icon={<AlertCircle />}
        color="warning"
      />
    </div>

    <div className="card border-0 shadow-sm rounded-4 p-4">
      <h5 className="fw-bold mb-4">Actividad Reciente</h5>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Marcos Rivas</strong>
              </td>
              <td>Consultoría IT</td>
              <td>
                <span className="badge bg-success-subtle text-success rounded-pill px-3">
                  Completado
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Lucía Soler</strong>
              </td>
              <td>Diseño Web</td>
              <td>
                <span className="badge bg-warning-subtle text-warning rounded-pill px-3">
                  En espera
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Dashboard;
