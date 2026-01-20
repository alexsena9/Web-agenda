import React, { useState, useEffect } from "react";
import Sidebar from "./Layout/Sidebar";
import Dashboard from "./Views/Dashboard";
import Agenda from "./Views/Agenda";
import Clientes from "./Views/Clientes";
import Configuracion from "./Views/Configuracion";
import Login from "./Views/Login";
import VistaPublica from "./Views/VistaPublica";
import NuevoTurnoModal from "./Components/NuevoTurnoModal";
import "./App.css";

function App() {
  const [esRutaPublica, setEsRutaPublica] = useState(
    window.location.pathname === "/reservar",
  );

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("isAuth") === "true";
  });

  const [view, setView] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [turnos, setTurnos] = useState(() => {
    const saved = localStorage.getItem("web_agenda_turnos");
    return saved ? JSON.parse(saved) : [];
  });
  const [clientes, setClientes] = useState(() => {
    const saved = localStorage.getItem("web_agenda_clientes");
    return saved ? JSON.parse(saved) : [];
  });
  const [servicios, setServicios] = useState(() => {
    const saved = localStorage.getItem("web_agenda_servicios");
    return saved
      ? JSON.parse(saved)
      : ["Corte de Cabello", "Perfilado de Barba", "Servicio VIP"];
  });
  const [horarios, setHorarios] = useState(() => {
    const saved = localStorage.getItem("web_agenda_horarios");
    return saved ? JSON.parse(saved) : { inicio: 9, fin: 19 };
  });

  useEffect(() => {
    localStorage.setItem("web_agenda_turnos", JSON.stringify(turnos));
    localStorage.setItem("web_agenda_clientes", JSON.stringify(clientes));
    localStorage.setItem("web_agenda_servicios", JSON.stringify(servicios));
    localStorage.setItem("web_agenda_horarios", JSON.stringify(horarios));
  }, [turnos, clientes, servicios, horarios]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("isAuth", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isAuth");
  };

  const handleAddTurno = (nuevoTurno) => {
    setTurnos((prev) => [...prev, nuevoTurno]);

    if (nuevoTurno.estado !== "Bloqueado") {
      setClientes((prevClientes) => {
        const existe = prevClientes.find(
          (c) => c.nombre.toLowerCase() === nuevoTurno.cliente.toLowerCase(),
        );
        if (existe) {
          return prevClientes.map((c) =>
            c.id === existe.id
              ? { ...c, cantidadTurnos: c.cantidadTurnos + 1 }
              : c,
          );
        } else {
          return [
            ...prevClientes,
            {
              id: Date.now(),
              nombre: nuevoTurno.cliente,
              fechaRegistro: new Date().toLocaleDateString(),
              cantidadTurnos: 1,
            },
          ];
        }
      });
    }
  };

  if (esRutaPublica) {
    return (
      <VistaPublica
        turnos={turnos}
        onAddTurno={handleAddTurno}
        servicios={servicios}
        horarios={horarios}
        onIrAAdmin={() => setEsRutaPublica(false)}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={handleLogin} />

        <button
          onClick={() => {
            window.history.pushState({}, "", "/reservar");
            setEsRutaPublica(true);
          }}
          className="btn btn-sm btn-outline-light position-fixed bottom-0 end-0 m-3 opacity-50"
          style={{ zIndex: 1000 }}
        >
          Ver Vista de Cliente (Pública)
        </button>
      </>
    );
  }

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return (
          <Dashboard
            turnos={turnos}
            setView={setView}
            onNewTurn={() => setIsModalOpen(true)}
          />
        );
      case "agenda":
        return (
          <Agenda turnos={turnos} setTurnos={setTurnos} horarios={horarios} />
        );
      case "clientes":
        return <Clientes clientes={clientes} setClientes={setClientes} />;
      case "config":
        return (
          <Configuracion
            servicios={servicios}
            setServicios={setServicios}
            turnos={turnos}
            setTurnos={setTurnos}
            clientes={clientes}
            setClientes={setClientes}
            horarios={horarios}
            setHorarios={setHorarios}
            onLogout={handleLogout}
          />
        );
      default:
        return <Dashboard turnos={turnos} setView={setView} />;
    }
  };

  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100 bg-light">
      <Sidebar
        view={view}
        setView={setView}
        onNewTurn={() => setIsModalOpen(true)}
      />

      <main
        className="flex-grow-1 p-3 p-md-4 p-lg-5 mb-5 mb-lg-0"
        style={{ overflowY: "auto", maxHeight: "100vh" }}
      >
        <div
          className="container-fluid px-0"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          {renderView()}
        </div>
      </main>

      <NuevoTurnoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTurno={handleAddTurno}
        servicios={servicios}
        turnos={turnos}
      />
    </div>
  );
}

export default App;
