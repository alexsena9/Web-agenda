import React, { useState } from "react";
import {
  Plus,
  Trash2,
  LogOut,
  Clock,
  Scissors,
  CheckCircle,
  Search,
  UserMinus,
} from "lucide-react";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

const Configuracion = ({
  servicios = [],
  setServicios,
  horarios,
  setHorarios,
  onLogout,
  clientes = [],
  turnos = [],
}) => {
  const [nuevoServicio, setNuevoServicio] = useState("");
  const [precioServicio, setPrecioServicio] = useState("");
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  const handleAddServicio = (e) => {
    e.preventDefault();
    if (nuevoServicio.trim() && precioServicio.trim()) {
      setServicios([
        ...servicios,
        { nombre: nuevoServicio.trim(), precio: precioServicio.trim() },
      ]);
      setNuevoServicio("");
      setPrecioServicio("");
      triggerAlert();
    }
  };

  const handleRemoveServicio = (index) => {
    setServicios(servicios.filter((_, i) => i !== index));
    triggerAlert();
  };

  const handleEliminarCliente = async (id) => {
    if (window.confirm("¿Eliminar este cliente de forma permanente?")) {
      try {
        await deleteDoc(doc(db, "clientes", id));
        triggerAlert();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const triggerAlert = () => {
    setShowSavedAlert(true);
    setTimeout(() => setShowSavedAlert(false), 2000);
  };

  const sugerenciasClientes =
    busquedaCliente.length > 1 && Array.isArray(clientes)
      ? clientes.filter((c) =>
          c?.nombre?.toLowerCase().includes(busquedaCliente.toLowerCase()),
        )
      : [];

  return (
    <div className="animate-fade-in pb-5 text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Configuración</h2>
          <p className="text-muted mb-0">
            Gestión de servicios y base de datos
          </p>
        </div>
        <button
          onClick={onLogout}
          className="btn btn-outline-danger d-flex align-items-center gap-2 rounded-3 fw-bold px-3"
        >
          <LogOut size={18} /> Salir
        </button>
      </div>

      {showSavedAlert && (
        <div className="alert alert-success border-0 shadow-sm d-flex align-items-center gap-2 py-2">
          <CheckCircle size={18} /> Cambios guardados en la nube
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Scissors size={20} className="text-primary" /> Servicios
            </h5>
            <form onSubmit={handleAddServicio} className="mb-4">
              <div className="row g-2">
                <div className="col-7">
                  <input
                    type="text"
                    className="form-control bg-light border-0"
                    placeholder="Nombre..."
                    value={nuevoServicio}
                    onChange={(e) => setNuevoServicio(e.target.value)}
                  />
                </div>
                <div className="col-3">
                  <input
                    type="number"
                    className="form-control bg-light border-0"
                    placeholder="$"
                    value={precioServicio}
                    onChange={(e) => setPrecioServicio(e.target.value)}
                  />
                </div>
                <div className="col-2">
                  <button className="btn btn-primary w-100" type="submit">
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </form>
            <div className="list-group list-group-flush">
              {servicios.map((s, i) => (
                <div
                  key={i}
                  className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-bottom"
                >
                  <div>
                    <span className="fw-bold text-dark d-block">
                      {s.nombre}
                    </span>
                    <span className="text-success fw-bold small">
                      ${s.precio}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveServicio(i)}
                    className="btn btn-link text-danger p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <UserMinus size={20} className="text-danger" /> Clientes
              registrados
            </h5>
            <div className="position-relative mb-3">
              <Search
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                size={16}
              />
              <input
                type="text"
                className="form-control bg-light border-0 ps-5"
                placeholder="Buscar por nombre..."
                value={busquedaCliente}
                onChange={(e) => setBusquedaCliente(e.target.value)}
              />
            </div>
            {sugerenciasClientes.map((c) => (
              <div
                key={c.id}
                className="d-flex justify-content-between align-items-center p-2 border-bottom"
              >
                <span className="small fw-bold">{c.nombre}</span>
                <button
                  onClick={() => handleEliminarCliente(c.id)}
                  className="btn btn-sm btn-outline-danger border-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Clock size={20} className="text-warning" /> Horarios
            </h5>
            <div className="row g-3">
              <div className="col-6">
                <label className="small fw-bold text-muted text-uppercase">
                  Inicio
                </label>
                <select
                  className="form-select bg-light border-0"
                  value={horarios.inicio}
                  onChange={(e) =>
                    setHorarios({
                      ...horarios,
                      inicio: parseInt(e.target.value),
                    })
                  }
                >
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}:00
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="small fw-bold text-muted text-uppercase">
                  Fin
                </label>
                <select
                  className="form-select bg-light border-0"
                  value={horarios.fin}
                  onChange={(e) =>
                    setHorarios({ ...horarios, fin: parseInt(e.target.value) })
                  }
                >
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
