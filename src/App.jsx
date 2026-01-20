import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./views/Dashboard";
import Agenda from "./views/Agenda";
import Clientes from "./views/Clientes";
import Configuracion from "./views/Configuracion";
import Login from "./views/Login";
import VistaPublica from "./views/VistaPublica";
import NuevoTurnoModal from "./components/NuevoTurnoModal";
import { Scissors, User, Settings, ArrowRight } from "lucide-react";
import "./App.css";

function App() {
  const [ruta, setRuta] = useState(window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("isAuth") === "true",
  );
  const [view, setView] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [turnos, setTurnos] = useState(
    () => JSON.parse(localStorage.getItem("web_agenda_turnos")) || [],
  );
  const [clientes, setClientes] = useState(
    () => JSON.parse(localStorage.getItem("web_agenda_clientes")) || [],
  );
  const [servicios, setServicios] = useState(
    () =>
      JSON.parse(localStorage.getItem("web_agenda_servicios")) || [
        "Corte Clásico",
        "Barba & Toalla Caliente",
        "Corte + Barba",
      ],
  );
  const [horarios, setHorarios] = useState(
    () =>
      JSON.parse(localStorage.getItem("web_agenda_horarios")) || {
        inicio: 9,
        fin: 19,
      },
  );

  useEffect(() => {
    localStorage.setItem("web_agenda_turnos", JSON.stringify(turnos));
    localStorage.setItem("web_agenda_clientes", JSON.stringify(clientes));
    localStorage.setItem("web_agenda_servicios", JSON.stringify(servicios));
    localStorage.setItem("web_agenda_horarios", JSON.stringify(horarios));
  }, [turnos, clientes, servicios, horarios]);

  useEffect(() => {
    const handleLocationChange = () => setRuta(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navegar = (path) => {
    window.history.pushState({}, "", path);
    setRuta(path);
  };

  const handleAddTurno = (nuevoTurno) => {
    setTurnos((prev) => [...prev, nuevoTurno]);
    if (nuevoTurno.estado !== "Bloqueado") {
      setClientes((prevClientes) => {
        const existe = prevClientes.find(
          (c) => c.nombre.toLowerCase() === nuevoTurno.cliente.toLowerCase(),
        );
        if (existe)
          return prevClientes.map((c) =>
            c.id === existe.id
              ? { ...c, cantidadTurnos: c.cantidadTurnos + 1 }
              : c,
          );
        return [
          ...prevClientes,
          {
            id: Date.now(),
            nombre: nuevoTurno.cliente,
            fechaRegistro: new Date().toLocaleDateString(),
            cantidadTurnos: 1,
          },
        ];
      });
    }
  };

  if (ruta === "/") {
    return (
      <div
        className="vh-100 vw-100 d-flex align-items-center justify-content-center p-0 m-0 overflow-hidden"
        style={{
          backgroundColor: "#0f172a",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)",
            zIndex: 0,
          }}
        ></div>

        <div className="container position-relative z-1 px-4">
          <div className="text-center mb-5 animate-fade-up">
            <div className="bg-primary d-inline-flex p-4 rounded-circle mb-4 shadow-primary">
              <Scissors size={48} className="text-white" />
            </div>
            <h1 className="text-white fw-bold display-3 mb-2 tracking-tighter">
              AgendaPro
            </h1>
            <p className="text-muted fs-5">
              La evolución de tu barbería comienza aquí
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-5 col-lg-4">
              <div
                onClick={() => navegar("/reservar")}
                className="card h-100 bg-white bg-opacity-5 border border-white border-opacity-10 p-4 p-lg-5 rounded-4 cursor-pointer portal-card transition-all"
              >
                <div className="bg-success bg-opacity-20 text-success p-3 rounded-3 d-inline-block mb-4">
                  <User size={32} />
                </div>
                <h3 className="text-white fw-bold mb-3">Reservar Turno</h3>
                <p className="text-secondary mb-4">
                  Agenda tu cita en menos de 1 minuto sin registros previos.
                </p>
                <div className="text-success fw-bold d-flex align-items-center gap-2">
                  Empezar ahora <ArrowRight size={18} />
                </div>
              </div>
            </div>

            <div className="col-12 col-md-5 col-lg-4">
              <div
                onClick={() => navegar("/admin")}
                className="card h-100 bg-white bg-opacity-5 border border-white border-opacity-10 p-4 p-lg-5 rounded-4 cursor-pointer portal-card transition-all"
              >
                <div className="bg-primary bg-opacity-20 text-primary p-3 rounded-3 d-inline-block mb-4">
                  <Settings size={32} />
                </div>
                <h3 className="text-white fw-bold mb-3">Panel Barbero</h3>
                <p className="text-secondary mb-4">
                  Gestiona tus horarios, clientes y estadísticas de negocio.
                </p>
                <div className="text-primary fw-bold d-flex align-items-center gap-2">
                  Acceder al panel <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (ruta === "/reservar") {
    return (
      <VistaPublica
        turnos={turnos}
        onAddTurno={handleAddTurno}
        servicios={servicios}
        horarios={horarios}
      />
    );
  }

  if (ruta === "/admin" && !isAuthenticated) {
    return (
      <Login
        onLogin={() => {
          setIsAuthenticated(true);
          sessionStorage.setItem("isAuth", "true");
          navegar("/admin");
        }}
      />
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
            onLogout={() => {
              setIsAuthenticated(false);
              sessionStorage.removeItem("isAuth");
              navegar("/");
            }}
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
      <main className="flex-grow-1 p-3 p-md-4 p-lg-5">
        <div className="container-fluid px-0" style={{ maxWidth: "1200px" }}>
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
