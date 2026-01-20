import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Plus,
  Scissors,
  LogOut,
} from "lucide-react";

const Sidebar = ({ view, setView, onNewTurn }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Inicio",
      icon: <LayoutDashboard size={20} strokeWidth={1.5} />,
    },
    {
      id: "agenda",
      label: "Agenda",
      icon: <Calendar size={20} strokeWidth={1.5} />,
    },
    {
      id: "clientes",
      label: "Clientes",
      icon: <Users size={20} strokeWidth={1.5} />,
    },
    {
      id: "config",
      label: "Ajustes",
      icon: <Settings size={20} strokeWidth={1.5} />,
    },
  ];

  return (
    <>
      <aside
        className="d-none d-lg-flex flex-column bg-white border-end shadow-sm"
        style={{ width: "260px", height: "100vh", position: "sticky", top: 0 }}
      >
        <div className="p-4 d-flex align-items-center gap-3">
          <div className="bg-primary p-2 rounded-3 shadow-primary">
            <Scissors className="text-white" size={24} />
          </div>
          <h5
            className="fw-bold mb-0 text-dark"
            style={{
              fontSize: "1.1rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              letterSpacing: "-0.5px",
            }}
          >
            Agenda Barbería
          </h5>
        </div>

        <div className="px-3 mt-4 flex-grow-1">
          <button
            onClick={onNewTurn}
            className="btn btn-primary w-100 py-2 rounded-3 mb-4 d-flex align-items-center justify-content-center gap-2 shadow-sm transition-all hover-scale"
          >
            <Plus size={18} /> <span>Nuevo Turno</span>
          </button>

          <nav className="d-flex flex-column gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`btn d-flex align-items-center gap-3 px-3 py-2 rounded-3 border-0 transition-all ${
                  view === item.id
                    ? "bg-primary bg-opacity-10 text-primary fw-bold"
                    : "text-muted hover-bg-light"
                }`}
              >
                {item.icon}
                <span style={{ fontSize: "14px" }}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-top">
          <div className="d-flex align-items-center gap-3 text-muted small">
            <div className="bg-light p-2 rounded-circle">
              <Users size={16} />
            </div>
            <span>Admin v1.0</span>
          </div>
        </div>
      </aside>

      <nav
        className="d-lg-none fixed-bottom bg-white border-top d-flex justify-content-around align-items-center py-2 z-3"
        style={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`btn border-0 d-flex flex-column align-items-center gap-1 p-2 transition-all ${
              view === item.id ? "text-primary" : "text-muted"
            }`}
          >
            <div className={view === item.id ? "animate-bounce" : ""}>
              {item.icon}
            </div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: view === item.id ? "bold" : "normal",
              }}
            >
              {item.label}
            </span>
          </button>
        ))}

        <button
          onClick={onNewTurn}
          className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{
            width: "45px",
            height: "45px",
            marginTop: "-35px",
            border: "4px solid white",
          }}
        >
          <Plus size={24} />
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
