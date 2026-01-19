import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  LogOut,
  PlusCircle,
} from "lucide-react";

const Sidebar = ({ view, setView, onNewTurn }) => {
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "agenda", name: "Mi Agenda", icon: <Calendar size={20} /> },
    { id: "clientes", name: "Clientes", icon: <Users size={20} /> },
    { id: "config", name: "Configuración", icon: <Settings size={20} /> },
  ];

  return (
    <div
      className="d-flex flex-column bg-white border-end vh-100 shadow-sm"
      style={{ width: "280px", position: "sticky", top: 0 }}
    >
      <div className="p-4">
        <h4 className="fw-bold text-primary mb-0">
          ALEXIS<span className="text-dark">AGENDA</span>
        </h4>
        <small className="text-muted fw-medium">Gestión Profesional</small>
      </div>

      <div className="px-3 mb-4">
        <button
          onClick={onNewTurn}
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 shadow-sm transition-all"
        >
          <PlusCircle size={18} />
          <span className="fw-bold">Nuevo Turno</span>
        </button>
      </div>

      <nav className="flex-grow-1 px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`btn w-100 d-flex align-items-center gap-3 px-3 py-2 mb-1 border-0 rounded-3 transition-all ${
              view === item.id
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover-bg-light"
            }`}
          >
            {item.icon}
            <span className="fw-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-top">
        <button className="btn btn-light w-100 d-flex align-items-center gap-3 text-danger border-0 hover-bg-light transition-all">
          <LogOut size={20} />
          <span className="fw-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
