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
  deleteDoc,
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
    const manejarCambioRuta = () => setRuta(window.location.pathname);
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
      await addDoc(collection(db, "turnos"), nuevoTurno);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEliminarTurno = async (turno) => {
    try {
      const existe = clientes.some(
        (c) => c.nombre.toLowerCase() === turno.cliente.toLowerCase(),
      );
      if (!existe && turno.cliente) {
        await addDoc(collection(db, "clientes"), {
          nombre: turno.cliente,
          fechaRegistro: new Date().toISOString(),
          totalVisitas: 1,
        });
      }
      await deleteDoc(doc(db, "turnos", turno.id));
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
        className="d-flex flex-wrap gap-4 gap-md-5 p-3 p-md-5"
        style={{ transform: "rotate(-15deg) scale(1.2)" }}
      >
        {[...Array(60)].map((_, i) => {
          const icons = [Scissors, Wind, Smile, Smartphone];
          const Icon = icons[i % icons.length];
          return (
            <Icon key={i} size={30} className="text-white" strokeWidth={1} />
          );
        })}
      </div>
    </div>
  );

  if (ruta === "/") {
    return (
      <div
        className="min-vh-100 vw-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
        style={{ backgroundColor: "#020617" }}
      >
        <BarberPattern />
        <div className="container position-relative z-1 py-4 px-3">
          <div
            className="mx-auto p-4 p-md-5 rounded-5 animate-fade-up"
            style={{
              maxWidth: "800px",
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(15px)",
              WebkitBackdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="text-center mb-4 mb-md-5">
              <div className="bg-primary p-3 p-md-4 rounded-circle d-inline-flex shadow-lg mb-3">
                <Scissors size={35} className="text-white" strokeWidth={2.5} />
              </div>
              <h1 className="display-5 fw-bold text-white mb-2">
                Barbería App
              </h1>
              <p className="text-white opacity-75">
                Reserva tu cita o gestiona tu negocio
              </p>
            </div>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div
                  onClick={() => navegar("/reservar")}
                  className="card portal-card border-0 rounded-4 p-4 h-100 text-start"
                >
                  <div className="bg-success p-3 rounded-3 d-inline-block mb-3">
                    <User size={24} className="text-white" />
                  </div>
                  <h4 className="fw-bold text-white mb-2">Reservar</h4>
                  <div className="mt-auto text-success fw-bold">
                    Empezar <ArrowRight size={18} />
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div
                  onClick={() => navegar("/admin")}
                  className="card portal-card border-0 rounded-4 p-4 h-100 text-start"
                >
                  <div className="bg-primary p-3 rounded-3 d-inline-block mb-3">
                    <Settings size={24} className="text-white" />
                  </div>
                  <h4 className="fw-bold text-white mb-2">Administrar</h4>
                  <div className="mt-auto text-primary fw-bold">
                    Entrar <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (ruta === "/reservar")
    return (
      <VistaPublica
        turnos={turnos}
        servicios={servicios}
        horarios={horarios}
        onAddTurno={handleAddTurno}
      />
    );

  if (ruta === "/admin" && !isAuthenticated)
    return (
      <Login
        onLogin={() => {
          setIsAuthenticated(true);
          navegar("/admin");
        }}
      />
    );

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
          <Agenda
            turnos={turnos}
            horarios={horarios}
            onEliminarTurno={handleEliminarTurno}
          />
        );
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
      <main className="flex-grow-1 p-3 p-md-4">{renderView()}</main>
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
