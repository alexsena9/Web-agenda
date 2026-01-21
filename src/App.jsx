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
  serverTimestamp,
  setDoc,
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

  useEffect(() => {
    const q = query(collection(db, "turnos"), orderBy("fecha", "asc"));
    const unsubTurnos = onSnapshot(q, (snapshot) => {
      setTurnos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubClientes = onSnapshot(collection(db, "clientes"), (snapshot) => {
      setClientes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubConfig = onSnapshot(
      collection(db, "configuracion"),
      (snapshot) => {
        snapshot.docs.forEach((d) => {
          if (d.id === "servicios") setServicios(d.data().lista || []);
          if (d.id === "horarios") setHorarios(d.data());
          if (d.id === "bloqueos") setBloqueos(d.data().lista || []);
        });
      },
    );

    return () => {
      unsubTurnos();
      unsubClientes();
      unsubConfig();
    };
  }, []);

  const navegar = (path) => {
    window.history.pushState({}, "", path);
    setRuta(path);
  };

  const handleAddTurno = async (nuevoTurno) => {
    try {
      await addDoc(collection(db, "turnos"), {
        ...nuevoTurno,
        createdAt: serverTimestamp(),
      });

      const existe = clientes.some((c) => c.telefono === nuevoTurno.telefono);
      if (!existe) {
        await addDoc(collection(db, "clientes"), {
          nombre: nuevoTurno.cliente,
          telefono: nuevoTurno.telefono,
          fechaRegistro: new Date().toLocaleDateString("en-CA"),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const syncConfig = async (id, data) => {
    try {
      await setDoc(doc(db, "configuracion", id), data, { merge: true });
    } catch (e) {
      console.error(e);
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
            onCompletar={(id) =>
              updateDoc(doc(db, "turnos", id), { estado: "Completado" })
            }
            onEliminar={(id) => deleteDoc(doc(db, "turnos", id))}
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
            setServicios={(lista) => syncConfig("servicios", { lista })}
            horarios={horarios}
            setHorarios={(h) => syncConfig("horarios", h)}
            bloqueos={bloqueos}
            setBloqueos={(lista) => syncConfig("bloqueos", { lista })}
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
        return <Dashboard turnos={turnos} setView={setView} />;
    }
  };

  if (ruta === "/reservar") {
    return (
      <VistaPublica
        turnos={turnos}
        servicios={servicios}
        horarios={horarios}
        bloqueos={bloqueos}
        onAddTurno={handleAddTurno}
      />
    );
  }

  if (!isAuthenticated)
    return (
      <Login
        onLogin={() => {
          sessionStorage.setItem("isAuth", "true");
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
