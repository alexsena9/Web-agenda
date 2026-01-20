import React, { useState, useEffect } from "react";
import Sidebar from "./Layout/Sidebar";
import Dashboard from "./Views/Dashboard";
import Agenda from "./Views/Agenda";
import Clientes from "./Views/Clientes";
import Configuracion from "./Views/Configuracion";
import Login from "./Views/Login";
import VistaPublica from "./Views/VistaPublica";
import NuevoTurnoModal from "./Components/NuevoTurnoModal";
import { Scissors, User, Settings, ArrowRight } from "lucide-react";
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
  const [horarios, setHorarios] = useState({ inicio: "09:00", fin: "19:00" });
  const [bloqueos, setBloqueos] = useState([]);

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
          setHorarios(data.horarios || { inicio: "09:00", fin: "19:00" });
          setBloqueos(data.bloqueos || []);
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

  const handleLogout = () => {
    sessionStorage.removeItem("isAuth");
    setIsAuthenticated(false);
    navegar("/");
  };

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
            onCompletar={(t) => deleteDoc(doc(db, "turnos", t.id))}
            onEliminar={(t) => deleteDoc(doc(db, "turnos", t.id))}
          />
        );
      case "clientes":
        return (
          <Clientes
            clientes={clientes}
            onEliminar={(id) => deleteDoc(doc(db, "clientes", id))}
          />
        );
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
            bloqueos={bloqueos}
            setBloqueos={(n) =>
              updateDoc(doc(db, "configuracion", "negocio"), { bloqueos: n })
            }
            clientes={clientes}
            onEliminarCliente={(id) => deleteDoc(doc(db, "clientes", id))}
            onLogout={handleLogout}
          />
        );
      default:
        return <Dashboard turnos={turnos} setView={setView} />;
    }
  };

  if (ruta === "/") {
    return (
      <div
        className="min-vh-100 vw-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
        style={{ backgroundColor: "#020617" }}
      >
        <div className="container position-relative z-1 py-4 px-3 text-center">
          <div className="bg-primary p-4 rounded-circle d-inline-flex shadow-lg mb-4">
            <Scissors size={50} className="text-white" />
          </div>
          <h1 className="display-4 fw-bold text-white mb-5 animate-fade-up">
            Barbería Premium
          </h1>
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-5">
              <div
                onClick={() => navegar("/reservar")}
                className="card portal-card p-5 rounded-5 border-0 shadow-lg h-100"
              >
                <User size={50} className="text-success mb-3 mx-auto" />
                <h2 className="text-white fw-bold">Reservar Cita</h2>
                <div className="mt-auto text-success fw-bold">
                  Entrar <ArrowRight size={18} />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-5">
              <div
                onClick={() => navegar("/admin")}
                className="card portal-card p-5 rounded-5 border-0 shadow-lg h-100"
              >
                <Settings size={50} className="text-primary mb-3 mx-auto" />
                <h2 className="text-white fw-bold">Panel Admin</h2>
                <div className="mt-auto text-primary fw-bold">
                  Acceder <ArrowRight size={18} />
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
        bloqueos={bloqueos}
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
        onAddTurno={handleAddTurno}
      />
    </div>
  );
}
export default App;
