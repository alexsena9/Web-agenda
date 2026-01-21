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

import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
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
    const qTurnos = query(
      collection(db, "turnos"),
      orderBy("fecha", "asc"),
      orderBy("hora", "asc"),
    );
    const unsubTurnos = onSnapshot(qTurnos, (snap) => {
      setTurnos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubClientes = onSnapshot(collection(db, "clientes"), (snap) => {
      setClientes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

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
      await addDoc(collection(db, "turnos"), {
        cliente: nuevoTurno.cliente.toLowerCase().trim(),
        telefono: nuevoTurno.telefono.trim(),
        servicio: nuevoTurno.servicio,
        precio: nuevoTurno.precio || 0,
        fecha: nuevoTurno.fecha,
        hora: nuevoTurno.hora,
        estado: "Pendiente",
        fechaRegistro: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error al agregar turno:", error);
    }
  };

  const handleCompletarTurno = async (turno) => {
    try {
      const existe = clientes.find((c) => c.telefono === turno.telefono);
      if (!existe) {
        await addDoc(collection(db, "clientes"), {
          nombre: turno.cliente,
          telefono: turno.telefono,
          totalVisitas: 1,
          ultimaVisita: turno.fecha,
          fechaRegistro: new Date().toISOString(),
        });
      } else {
        await updateDoc(doc(db, "clientes", existe.id), {
          totalVisitas: (existe.totalVisitas || 0) + 1,
          ultimaVisita: turno.fecha,
        });
      }
      await deleteDoc(doc(db, "turnos", turno.id));
    } catch (error) {
      console.error("Error al completar turno:", error);
    }
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
            onCompletar={handleCompletarTurno}
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
            onLogout={() => {
              sessionStorage.removeItem("isAuth");
              setIsAuthenticated(false);
              navegar("/");
            }}
          />
        );
      default:
        return (
          <Dashboard
            turnos={turnos}
            setView={setView}
            onNewTurn={() => setIsModalOpen(true)}
          />
        );
    }
  };

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

  if (ruta === "/") {
    return (
      <div className="min-vh-100 vw-100 d-flex align-items-center justify-content-center bg-dark text-white text-center">
        <div>
          <h1 className="display-3 fw-bold mb-5">Barbería Premium</h1>
          <div className="d-flex flex-column flex-md-row gap-3">
            <button
              onClick={() => navegar("/reservar")}
              className="btn btn-primary btn-lg px-5 py-4 rounded-5 fw-bold"
            >
              PEDIR TURNO
            </button>
            <button
              onClick={() => navegar("/admin")}
              className="btn btn-outline-light btn-lg px-5 py-4 rounded-5 fw-bold"
            >
              ADMINISTRACIÓN
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
      <main className="flex-grow-1 p-3 p-md-4">{renderView()}</main>
      <NuevoTurnoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        servicios={servicios}
        onAddTurno={handleAddTurno}
        turnos={turnos}
        horarios={horarios}
        bloqueos={bloqueos}
      />
    </div>
  );
}

export default App;
