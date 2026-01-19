import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./views/Dashboard";
import Agenda from "./views/Agenda";
import Clientes from "./views/Clientes";
import Configuracion from "./views/Configuracion";
import NuevoTurnoModal from "./components/NuevoTurnoModal";
import "./App.css";

function App() {
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
      : ["Corte de Cabello", "Barba", "Tratamiento Facial"];
  });

  useEffect(() => {
    localStorage.setItem("web_agenda_turnos", JSON.stringify(turnos));
    localStorage.setItem("web_agenda_clientes", JSON.stringify(clientes));
    localStorage.setItem("web_agenda_servicios", JSON.stringify(servicios));
  }, [turnos, clientes, servicios]);

  const handleAddTurno = (nuevoTurno) => {
    setTurnos([...turnos, nuevoTurno]);

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
  };

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard turnos={turnos} />;
      case "agenda":
        return <Agenda turnos={turnos} setTurnos={setTurnos} />;
      case "clientes":
        return <Clientes clientes={clientes} setClientes={setClientes} />;
      case "config":
        return (
          <Configuracion servicios={servicios} setServicios={setServicios} />
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
        servicios={servicios}
      />
    </div>
  );
}

export default App;
