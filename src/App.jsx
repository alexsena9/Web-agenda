import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./views/Dashboard";
import Agenda from "./views/Agenda";
import Clientes from "./views/Clientes";
import NuevoTurnoModal from "./components/NuevoTurnoModal";
import "./App.css";

function App() {
  const [view, setView] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [turnos, setTurnos] = useState(() => {
    const savedTurnos = localStorage.getItem("web_agenda_turnos");
    return savedTurnos ? JSON.parse(savedTurnos) : [];
  });

  useEffect(() => {
    localStorage.setItem("web_agenda_turnos", JSON.stringify(turnos));
  }, [turnos]);

  const handleAddTurno = (nuevoTurno) => {
    setTurnos([...turnos, nuevoTurno]);
  };

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard turnos={turnos} />;
      case "agenda":
        return <Agenda turnos={turnos} setTurnos={setTurnos} />;
      case "clientes":
        return <Clientes />;
      case "config":
        return (
          <div className="view-animate p-4 bg-white rounded-4 shadow-sm">
            <h3 className="fw-bold">Configuración</h3>
            <p className="text-muted">
              Personaliza los servicios y horarios de tu negocio.
            </p>
          </div>
        );
      default:
        return <Dashboard turnos={turnos} />;
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar
        view={view}
        setView={setView}
        onNewTurn={() => setIsModalOpen(true)}
      />

      <main
        className="flex-grow-1 p-4 p-md-5"
        style={{ overflowY: "auto", maxHeight: "100vh" }}
      >
        <div className="container-fluid px-0">{renderView()}</div>
      </main>

      <NuevoTurnoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTurno={handleAddTurno}
      />
    </div>
  );
}

export default App;
