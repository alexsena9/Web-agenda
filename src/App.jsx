import React, { useState, useEffect } from "react";
// Firebase
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

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

function App() {
  const [ruta, setRuta] = useState(window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("isAuth") === "true",
  );
  const [view, setView] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [turnos, setTurnos] = useState([]);
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
    const q = query(collection(db, "turnos"), orderBy("fecha", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setTurnos(docs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("web_agenda_servicios", JSON.stringify(servicios));
    localStorage.setItem("web_agenda_horarios", JSON.stringify(horarios));
  }, [servicios, horarios]);

  useEffect(() => {
    const handleLocationChange = () => setRuta(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navegar = (path) => {
    window.history.pushState({}, "", path);
    setRuta(path);
  };

  const handleAddTurno = async (nuevoTurno) => {
    try {
      await addDoc(collection(db, "turnos"), {
        ...nuevoTurno,
        createdAt: new Date(),
      });
    } catch (e) {
      console.error("Error al guardar en Firebase: ", e);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isAuth");
    navegar("/");
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
          zIndex: 1000,
        }}
      >
        <div className="container text-center position-relative z-1 px-4">
          <div className="bg-primary d-inline-flex p-4 rounded-circle mb-4 shadow-primary animate-bounce">
            <Scissors size={48} className="text-white" />
          </div>
          <h1 className="text-white fw-bold display-3 mb-2 tracking-tighter">
            AgendaPro
          </h1>
          <p className="text-muted fs-5 mb-5">
            Gestión profesional para tu barbería
          </p>

          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-5 col-lg-4">
              <div
                onClick={() => navegar("/reservar")}
                className="card h-100 bg-white bg-opacity-5 border border-white border-opacity-10 p-4 p-lg-5 rounded-4 cursor-pointer portal-card transition-all"
              >
                <User size={32} className="text-success mb-3" />
                <h3 className="text-white fw-bold mb-3">Soy Cliente</h3>
                <p className="text-secondary small mb-4">
                  Reserva tu turno en segundos.
                </p>
                <div className="text-success fw-bold d-flex align-items-center justify-content-center gap-2">
                  Empezar <ArrowRight size={18} />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-5 col-lg-4">
              <div
                onClick={() => navegar("/admin")}
                className="card h-100 bg-white bg-opacity-5 border border-white border-opacity-10 p-4 p-lg-5 rounded-4 cursor-pointer portal-card transition-all"
              >
                <Settings size={32} className="text-primary mb-3" />
                <h3 className="text-white fw-bold mb-3">Soy Barbero</h3>
                <p className="text-secondary small mb-4">
                  Administra tu agenda y clientes.
                </p>
                <div className="text-primary fw-bold d-flex align-items-center justify-content-center gap-2">
                  Ingresar <ArrowRight size={18} />
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
        return <Clientes turnos={turnos} />;
      case "config":
        return (
          <Configuracion
            servicios={servicios}
            setServicios={setServicios}
            turnos={turnos}
            horarios={horarios}
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

      <main className="flex-grow-1 p-3 p-md-4 p-lg-5 overflow-auto">
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
