import React, { useState } from "react";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./views/Dashboard";
import Agenda from "./views/Agenda";
import "./App.css";

function App() {
  const [view, setView] = useState("dashboard");

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard />;
      case "agenda":
        return <Agenda />;
      case "clientes":
        return (
          <div className="view-animate p-4 bg-white rounded-4 shadow-sm">
            <h3>Base de Clientes</h3>
            <p>Próximamente...</p>
          </div>
        );
      case "config":
        return (
          <div className="view-animate p-4 bg-white rounded-4 shadow-sm">
            <h3>Configuración</h3>
            <p>Próximamente...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="d-flex min-vh-100">
      <Sidebar view={view} setView={setView} />
      <main className="flex-grow-1 p-4 p-md-5" style={{ overflowY: "auto" }}>
        <div className="container-fluid">{renderView()}</div>
      </main>
    </div>
  );
}

export default App;
