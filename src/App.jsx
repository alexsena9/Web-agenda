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
  getDocs,
  where,
} from "firebase/firestore";
import { Scissors, UserCog, CalendarDays } from "lucide-react";

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
    const qTurnos = query(collection(db, "turnos"), orderBy("fecha", "asc"));
    const unsubTurnos = onSnapshot(qTurnos, (snapshot) => {
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

      const clientesRef = collection(db, "clientes");
      const q = query(
        clientesRef,
        where("telefono", "==", nuevoTurno.telefono),
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(collection(db, "clientes"), {
          nombre: nuevoTurno.cliente.toLowerCase(),
          telefono: nuevoTurno.telefono,
          fechaRegistro: new Date().toISOString().split("T")[0],
          totalVisitas: 1,
        });
      } else {
        const clienteDoc = querySnapshot.docs[0];
        const datosActuales = clienteDoc.data();
        await updateDoc(doc(db, "clientes", clienteDoc.id), {
          totalVisitas: (datosActuales.totalVisitas || 0) + 1,
          ultimoTurno: nuevoTurno.fecha,
        });
      }
    } catch (e) {
      console.error("Error al registrar turno/cliente:", e);
    }
  };

  const syncConfig = async (id, data) => {
    try {
      await setDoc(doc(db, "configuracion", id), data, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  const renderAdminContent = () => {
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

  if (ruta === "/login") {
    return (
      <Login
        onLogin={() => {
          sessionStorage.setItem("isAuth", "true");
          setIsAuthenticated(true);
          navegar("/admin");
        }}
      />
    );
  }

  if (ruta === "/admin") {
    if (!isAuthenticated) {
      navegar("/login");
      return null;
    }
    return (
      <div className="d-flex flex-column flex-lg-row min-vh-100 bg-light">
        <Sidebar
          view={view}
          setView={setView}
          onNewTurn={() => setIsModalOpen(true)}
        />
        <main className="flex-grow-1 p-3 p-md-4">{renderAdminContent()}</main>
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

  return (
    <div
      className="min-vh-100 vw-100 d-flex align-items-center justify-content-center bg-dark text-white p-4 text-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="portal-card p-5 rounded-5 shadow-lg"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="bg-primary d-inline-block p-3 rounded-circle mb-4">
          <Scissors size={40} className="text-white" />
        </div>
        <h1 className="fw-bold mb-2">Barbería Premium</h1>
        <p className="text-white  mb-5 small text-uppercase tracking-widest">
          Reserva y Gestión
        </p>
        <div className="d-grid gap-3">
          <button
            onClick={() => navegar("/reservar")}
            className="btn btn-primary btn-lg py-3 rounded-4 fw-bold d-flex align-items-center justify-content-center gap-2"
          >
            <CalendarDays size={22} /> RESERVAR TURNO
          </button>
          <button
            onClick={() => navegar("/admin")}
            className="btn btn-outline-light btn-lg py-3 rounded-4 fw-bold d-flex align-items-center justify-content-center gap-2"
          >
            <UserCog size={22} /> PANEL DE CONTROL
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
