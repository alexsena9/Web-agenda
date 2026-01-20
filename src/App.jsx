import React, { useState, useEffect } from "react";
import Sidebar from "./Layout/Sidebar";
import Dashboard from "./Views/Dashboard";
import Agenda from "./Views/Agenda";
import Clientes from "./Views/Clientes";
import Configuracion from "./Views/Configuracion";
import Login from "./Views/Login";
import VistaPublica from "./Views/VistaPublica";
import NuevoTurnoModal from "./Components/NuevoTurnoModal";
import {
  Scissors,
  User,
  Settings,
  ArrowRight,
  Wind,
  Smile,
  Smartphone,
} from "lucide-react";
import "./App.css";

import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function App() {
  const [ruta, setRuta] = useState(window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("isAuth") === "true",
  );
  const [view, setView] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [turnos, setTurnos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [horarios, setHorarios] = useState({ inicio: 9, fin: 19 });

  useEffect(() => {
    const manejarCambioRuta = () => {
      setRuta(window.location.pathname);
    };

    window.addEventListener("popstate", manejarCambioRuta);

    return () => window.removeEventListener("popstate", manejarCambioRuta);
  }, []);

  const navegar = (path) => {
    window.history.pushState({}, "", path);
    setRuta(path);
  };

  useEffect(() => {
    const unsubTurnos = onSnapshot(collection(db, "turnos"), (snap) =>
      setTurnos(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    const unsubClientes = onSnapshot(collection(db, "clientes"), (snap) =>
      setClientes(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    const unsubConfig = onSnapshot(
      doc(db, "configuracion", "negocio"),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setServicios(data.servicios || []);
          setHorarios(data.horarios || { inicio: 9, fin: 19 });
        }
      },
    );
    return () => {
      unsubTurnos();
      unsubClientes();
      unsubConfig();
    };
  }, []);

  const handleAddTurno = async (nuevoTurno) => {
    try {
      const { id, ...dataParaSubir } = nuevoTurno;
      await addDoc(collection(db, "turnos"), dataParaSubir);
    } catch (error) {
      console.error(error);
    }
  };

  const BarberPattern = () => (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 opacity-[0.05] pointer-events-none"
      style={{ zIndex: 0, overflow: "hidden" }}
    >
      <div
        className="d-flex flex-wrap gap-5 p-5"
        style={{ transform: "rotate(-15deg) scale(1.2)" }}
      >
        {[...Array(120)].map((_, i) => {
          const icons = [Scissors, Wind, Smile, Smartphone];
          const Icon = icons[i % icons.length];
          return (
            <Icon key={i} size={40} className="text-white" strokeWidth={1} />
          );
        })}
      </div>
    </div>
  );

  if (ruta === "/") {
    return (
      <div
        className="vh-100 vw-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
        style={{ backgroundColor: "#020617" }}
      >
        <BarberPattern />
        <div
          className="container position-relative z-1 py-5 px-4 rounded-5 animate-fade-in"
          style={{
            maxWidth: "900px",
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="text-center mb-5">
            <div
              className="bg-primary p-4 rounded-circle d-inline-flex shadow-lg mb-4"
              style={{ boxShadow: "0 0 40px rgba(13, 110, 253, 0.5)" }}
            >
              <Scissors size={50} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="display-3 fw-bold text-white mb-2">
              Agenda Barbería
            </h1>
            <p className="text-white fs-5 opacity-75">
              Gestión profesional de citas
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-6">
              <div
                onClick={() => navegar("/reservar")}
                className="card portal-card border-0 rounded-4 p-4 h-100 text-start shadow-sm"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  cursor: "pointer",
                }}
              >
                <div className="bg-success p-3 rounded-3 d-inline-block mb-3">
                  <User size={28} className="text-white" />
                </div>
                <h3 className="fw-bold text-white mb-2">Reservar Turno</h3>
                <div className="mt-auto d-flex align-items-center gap-2 fw-bold text-success">
                  Reservar ahora <ArrowRight size={18} />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div
                onClick={() => navegar("/admin")}
                className="card portal-card border-0 rounded-4 p-4 h-100 text-start shadow-sm"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  cursor: "pointer",
                }}
              >
                <div className="bg-primary p-3 rounded-3 d-inline-block mb-3">
                  <Settings size={28} className="text-white" />
                </div>
                <h3 className="fw-bold text-white mb-2">Panel Admin</h3>
                <div className="mt-auto d-flex align-items-center gap-2 fw-bold text-primary">
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
        servicios={servicios}
        horarios={horarios}
        onAddTurno={handleAddTurno}
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
        return <Agenda turnos={turnos} horarios={horarios} />;
      case "clientes":
        return <Clientes clientes={clientes} />;
      case "config":
        return (
          <Configuracion
            servicios={servicios}
            setServicios={(n) =>
              updateDoc(doc(db, "configuracion", "negocio"), { servicios: n })
            }
            horarios={horarios}
            setHorarios={(n) =>
              updateDoc(doc(db, "configuracion", "negocio"), { horarios: n })
            }
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
      <main className="flex-grow-1 p-3 p-md-5">
        <div className="container-fluid" style={{ maxWidth: "1200px" }}>
          {renderView()}
        </div>
      </main>
      <NuevoTurnoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        servicios={servicios}
        turnos={turnos}
      />
    </div>
  );
}

export default App;
