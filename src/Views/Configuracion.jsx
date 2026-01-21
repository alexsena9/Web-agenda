import React, { useState } from "react";
import {
  Scissors,
  Trash2,
  Plus,
  Clock,
  Search,
  UserMinus,
  LogOut,
  Ban,
} from "lucide-react";

const Configuracion = ({
  servicios,
  setServicios,
  horarios,
  setHorarios,
  bloqueos,
  setBloqueos,
  clientes,
  onEliminarCliente,
  onLogout,
}) => {
  const [query, setQuery] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [fechaBloqueo, setFechaBloqueo] = useState("");
  const [horaBloqueo, setHoraBloqueo] = useState("");

  const agregarServicio = () => {
    if (nuevoNombre && nuevoPrecio) {
      setServicios([
        ...servicios,
        { nombre: nuevoNombre, precio: nuevoPrecio },
      ]);
      setNuevoNombre("");
      setNuevoPrecio("");
    }
  };

  const agregarBloqueo = () => {
    if (fechaBloqueo) {
      const tipo = horaBloqueo ? "hora" : "dia";
      const nuevo = horaBloqueo
        ? { tipo, fecha: fechaBloqueo, valor: horaBloqueo }
        : { tipo, valor: fechaBloqueo };
      setBloqueos([...bloqueos, nuevo]);
      setFechaBloqueo("");
      setHoraBloqueo("");
    }
  };

  return (
    <div className="animate-fade-in pb-5 text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Configuración</h2>
        <button
          onClick={onLogout}
          className="btn btn-outline-danger rounded-4 px-3"
        >
          <LogOut size={18} className="me-2" /> Salir
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-5 p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
              <Clock size={20} /> Horarios de Atención
            </h5>
            <div className="row g-3">
              <div className="col-6">
                <label className="small fw-bold text-muted">APERTURA</label>
                <input
                  type="time"
                  className="form-control border-0 bg-light"
                  value={horarios.inicio}
                  onChange={(e) =>
                    setHorarios({ ...horarios, inicio: e.target.value })
                  }
                />
              </div>
              <div className="col-6">
                <label className="small fw-bold text-muted">CIERRE</label>
                <input
                  type="time"
                  className="form-control border-0 bg-light"
                  value={horarios.fin}
                  onChange={(e) =>
                    setHorarios({ ...horarios, fin: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-5 p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
              <Scissors size={20} /> Servicios y Precios
            </h5>
            <div className="d-flex gap-2 mb-3">
              <input
                type="text"
                className="form-control border-0 bg-light"
                placeholder="Nombre"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
              <input
                type="number"
                className="form-control border-0 bg-light"
                style={{ width: "100px" }}
                placeholder="$"
                value={nuevoPrecio}
                onChange={(e) => setNuevoPrecio(e.target.value)}
              />
              <button
                onClick={agregarServicio}
                className="btn btn-primary rounded-3"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="list-group list-group-flush">
              {servicios.map((s, i) => (
                <div
                  key={i}
                  className="list-group-item d-flex justify-content-between bg-transparent border-bottom px-0"
                >
                  <span className="fw-bold">
                    {s.nombre} - ${s.precio}
                  </span>
                  <button
                    onClick={() =>
                      setServicios(servicios.filter((_, idx) => idx !== i))
                    }
                    className="btn text-danger p-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-5 p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger">
              <Ban size={20} /> Bloqueos Especiales
            </h5>
            <div className="row g-2 mb-3">
              <div className="col-6">
                <input
                  type="date"
                  className="form-control border-0 bg-light"
                  value={fechaBloqueo}
                  onChange={(e) => setFechaBloqueo(e.target.value)}
                />
              </div>
              <div className="col-4">
                <input
                  type="time"
                  className="form-control border-0 bg-light"
                  value={horaBloqueo}
                  onChange={(e) => setHoraBloqueo(e.target.value)}
                />
              </div>
              <div className="col-2">
                <button
                  onClick={agregarBloqueo}
                  className="btn btn-danger w-100 rounded-3"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            <div className="list-group list-group-flush">
              {bloqueos.map((b, i) => (
                <div
                  key={i}
                  className="list-group-item d-flex justify-content-between bg-transparent px-0 border-bottom small"
                >
                  <span>
                    {b.tipo === "dia"
                      ? `Día: ${b.valor}`
                      : `Hora: ${b.valor} (${b.fecha})`}
                  </span>
                  <button
                    onClick={() =>
                      setBloqueos(bloqueos.filter((_, idx) => idx !== i))
                    }
                    className="btn text-danger p-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-5 p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-secondary">
              <UserMinus size={20} /> Gestión de Clientes
            </h5>
            <div className="position-relative mb-3">
              <Search
                className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"
                size={16}
              />
              <input
                type="text"
                className="form-control border-0 bg-light ps-5"
                placeholder="Buscar cliente..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="overflow-auto" style={{ maxHeight: "200px" }}>
              {clientes
                .filter((c) =>
                  c.nombre.toLowerCase().includes(query.toLowerCase()),
                )
                .map((c) => (
                  <div
                    key={c.id}
                    className="d-flex justify-content-between align-items-center py-2 border-bottom"
                  >
                    <div>
                      <div className="fw-bold small">{c.nombre}</div>
                      <small className="text-muted">{c.telefono}</small>
                    </div>
                    <button
                      onClick={() => onEliminarCliente(c.id)}
                      className="btn text-danger p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
