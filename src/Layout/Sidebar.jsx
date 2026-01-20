import React from "react";
import {
  Scissors,
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  PlusCircle,
} from "lucide-react";

const Sidebar = ({ view, setView, onNewTurn }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Panel Principal",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "agenda", label: "Agenda Diaria", icon: <Calendar size={20} /> },
    { id: "clientes", label: "Directorio Clientes", icon: <Users size={20} /> },
    { id: "config", label: "Configuración", icon: <Settings size={20} /> },
  ];

  return (
    <aside
      className="bg-white border-end d-flex flex-column"
      style={{ width: "280px", minHeight: "100vh", position: "sticky", top: 0 }}
    >
      <div className="p-4 d-flex align-items-center gap-3">
        <div
          className="bg-primary p-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center"
          style={{ minWidth: "42px", height: "42px" }}
        >
          <Scissors className="text-white" size={24} />
        </div>
        <h5
          className="fw-bold mb-0 text-dark"
          style={{
            fontSize: "1.05rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            letterSpacing: "-0.3px",
            paddingRight: "10px",
          }}
        >
          AgendaProBarbería
        </h5>
      </div>

      <div className="px-3 mb-4 text-start">
        <button
          onClick={onNewTurn}
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 shadow-primary"
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
            className={`w-100 border-0 d-flex align-items-center gap-3 px-3 py-2 mb-1 rounded-3 transition-all ${
              view === item.id
                ? "bg-primary bg-opacity-10 text-primary fw-bold"
                : "bg-transparent text-secondary hover-bg-light"
            }`}
            style={{ textAlign: "left" }}
          >
            {item.icon}
            <span style={{ fontSize: "14px" }}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-top">
        <div className="d-flex align-items-center gap-2 text-muted">
          <div
            className="bg-success rounded-circle"
            style={{ width: "8px", height: "8px" }}
          ></div>
          <span style={{ fontSize: "12px" }} className="fw-medium">
            Servidor Activo
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
