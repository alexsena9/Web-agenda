import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  PlusCircle,
} from "lucide-react";

const Sidebar = ({ view, setView, onNewTurn }) => {
  const menuItems = [
    { id: "dashboard", name: "Panel", icon: <LayoutDashboard size={24} /> },
    { id: "agenda", name: "Agenda", icon: <Calendar size={24} /> },
    { id: "clientes", name: "Clientes", icon: <Users size={24} /> },
    { id: "config", name: "Ajustes", icon: <Settings size={24} /> },
  ];

  return (
    <>
      <div
        className="d-none d-lg-flex flex-column bg-white border-end vh-100 shadow-sm"
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
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 shadow-sm"
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
      </div>

      <div
        className="d-lg-none fixed-bottom bg-white border-top d-flex justify-content-around align-items-center py-2 shadow-lg"
        style={{ zIndex: 1050 }}
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`btn border-0 d-flex flex-column align-items-center p-2 ${
              view === item.id ? "text-primary" : "text-muted"
            }`}
          >
            {item.icon}
            <span style={{ fontSize: "10px" }} className="fw-bold mt-1">
              {item.name}
            </span>
          </button>
        ))}
        <button
          onClick={onNewTurn}
          className="btn btn-primary rounded-circle shadow-lg p-3"
          style={{ marginTop: "-45px", border: "4px solid white" }}
        >
          <PlusCircle size={24} />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
