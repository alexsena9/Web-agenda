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
  setDoc,
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
    const unsubTurnos = onSnapshot(collection(db, "turnos"), (snapshot) => {
      const turnosList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTurnos(turnosList);
    });
    return () => unsubTurnos();
  }, []);

  useEffect(() => {
    const unsubConfig = onSnapshot(
      doc(db, "configuracion", "negocio"),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.servicios) setServicios(data.servicios);
          if (data.horarios) setHorarios(data.horarios);
        } else {
          const configInicial = {
            servicios: [
              { nombre: "Corte Clásico", precio: "1000" },
              { nombre: "Barba", precio: "500" },
            ],
            horarios: { inicio: 9, fin: 19 },
          };
          setDoc(doc(db, "configuracion", "negocio"), configInicial);
        }
      },
    );
    return () => unsubConfig();
  }, []);

  useEffect(() => {
    const unsubClientes = onSnapshot(collection(db, "clientes"), (snapshot) => {
      const clientesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(clientesList);
    });
    return () => unsubClientes();
  }, []);

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
      const { id, ...dataParaSubir } = nuevoTurno;
      await addDoc(collection(db, "turnos"), dataParaSubir);

      if (nuevoTurno.estado !== "Bloqueado") {
        const nombreBuscado = nuevoTurno.cliente.toLowerCase().trim();
        const clienteExistente = clientes.find(
          (c) => c.nombre?.toLowerCase().trim() === nombreBuscado,
        );

        if (clienteExistente) {
          const clienteRef = doc(db, "clientes", clienteExistente.id);
          await updateDoc(clienteRef, {
            cantidadTurnos: (clienteExistente.cantidadTurnos || 0) + 1,
          });
        } else {
          await addDoc(collection(db, "clientes"), {
            nombre: nuevoTurno.cliente,
            fechaRegistro: new Date().toLocaleDateString(),
            cantidadTurnos: 1,
          });
        }
      }
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
    }
  };

  const updateConfig = async (nuevaConfig) => {
    try {
      const configRef = doc(db, "configuracion", "negocio");
      await setDoc(configRef, nuevaConfig, { merge: true });
    } catch (error) {
      console.error("Error al actualizar configuración:", error);
    }
  };

  if (ruta === "/reservar")
    return (
      <VistaPublica
        turnos={turnos}
        onAddTurno={handleAddTurno}
        servicios={servicios}
        horarios={horarios}
      />
    );

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
            setServicios={(nuevos) => updateConfig({ servicios: nuevos })}
            horarios={horarios}
            setHorarios={(nuevos) => updateConfig({ horarios: nuevos })}
            clientes={clientes}
            turnos={turnos}
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

  if (ruta === "/") {
    return (
      <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-dark text-white">
        <div className="text-center">
          <Scissors size={64} className="mb-4 text-primary" />
          <h1 className="display-4 fw-bold">Barbería App</h1>
          <div className="mt-4 d-flex gap-3 justify-content-center">
            <button
              onClick={() => navegar("/reservar")}
              className="btn btn-primary btn-lg px-4"
            >
              Reservar Turno
            </button>
            <button
              onClick={() => navegar("/admin")}
              className="btn btn-outline-light btn-lg px-4"
            >
              Panel Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

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
