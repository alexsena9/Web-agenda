import React, { useState } from "react";
import {
  Scissors,
  Trash2,
  Plus,
  Clock,
  Search,
  UserMinus,
  LogOut,
  CalendarOff,
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
    if (fechaBloqueo && !bloqueos.includes(fechaBloqueo)) {
      setBloqueos([...bloqueos, fechaBloqueo]);
      setFechaBloqueo("");
    }
  };

  return (
    <div className="animate-fade-in pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0 text-dark">Configuración</h2>
        <button
          onClick={onLogout}
          className="btn btn-danger rounded-4 px-4 py-2 d-flex align-items-center gap-2 shadow-sm border-0"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm rounded-5 p-4 h-100">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Clock size={20} className="text-primary" /> Horario Comercial
            </h5>
            <div className="mb-3">
              <label className="small fw-bold text-muted mb-2">
                HORA APERTURA
              </label>
              <input
                type="time"
                className="form-control bg-light border-0 py-2 rounded-3 shadow-none"
                value={horarios.inicio}
                onChange={(e) =>
                  setHorarios({ ...horarios, inicio: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="small fw-bold text-muted mb-2">
                HORA CIERRE
              </label>
              <input
                type="time"
                className="form-control bg-light border-0 py-2 rounded-3 shadow-none"
                value={horarios.fin}
                onChange={(e) =>
                  setHorarios({ ...horarios, fin: e.target.value })
                }
              />
            </div>
            <hr />
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-danger">
              <CalendarOff size={18} /> Bloquear Días
            </h6>
            <div className="d-flex gap-2">
              <input
                type="date"
                className="form-control bg-light border-0 py-2 rounded-3 shadow-none"
                value={fechaBloqueo}
                onChange={(e) => setFechaBloqueo(e.target.value)}
              />
              <button
                onClick={agregarBloqueo}
                className="btn btn-danger rounded-3 px-3"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="mt-3 overflow-auto" style={{ maxHeight: "150px" }}>
              {bloqueos.map((f, i) => (
                <div
                  key={i}
                  className="d-flex justify-content-between align-items-center p-2 bg-light rounded-3 mb-2 animate-fade-in"
                >
                  <span className="small fw-bold">{f}</span>
                  <button
                    onClick={() =>
                      setBloqueos(bloqueos.filter((date) => date !== f))
                    }
                    className="btn btn-sm text-danger p-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm rounded-5 p-4 h-100">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Scissors size={20} className="text-primary" /> Servicios
            </h5>
            <div className="d-flex gap-2 mb-4">
              <input
                type="text"
                className="form-control bg-light border-0 py-2 rounded-3 shadow-none"
                placeholder="Nombre"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
              <input
                type="number"
                className="form-control bg-light border-0 py-2 rounded-3 shadow-none"
                placeholder="$"
                style={{ width: "80px" }}
                value={nuevoPrecio}
                onChange={(e) => setNuevoPrecio(e.target.value)}
              />
              <button
                onClick={agregarServicio}
                className="btn btn-primary rounded-3 px-3"
              >
                <Plus size={20} />
              </button>
            </div>
            <div
              className="list-group list-group-flush"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {servicios.map((s, i) => (
                <div
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 bg-transparent border-bottom"
                >
                  <div>
                    <span className="fw-bold d-block">{s.nombre}</span>
                    <small className="text-muted">${s.precio}</small>
                  </div>
                  <button
                    onClick={() =>
                      setServicios(servicios.filter((_, idx) => idx !== i))
                    }
                    className="btn btn-sm text-danger rounded-circle"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm rounded-5 p-4 h-100">
            <h5 className="fw-bold mb-3 text-danger d-flex align-items-center gap-2">
              <UserMinus size={20} /> Gestión de Clientes
            </h5>
            <div className="position-relative mb-3">
              <input
                type="text"
                className="form-control bg-light border-0 rounded-4 ps-5 py-2 shadow-none"
                placeholder="Buscar cliente..."
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search
                className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"
                size={18}
              />
            </div>
            <div
              className="list-group list-group-flush"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {clientes
                .filter((c) =>
                  c.nombre.toLowerCase().includes(query.toLowerCase()),
                )
                .map((c) => (
                  <div
                    key={c.id}
                    className="list-group-item d-flex justify-content-between align-items-center px-2 py-2 bg-transparent border-bottom"
                  >
                    <div>
                      <span className="small fw-bold text-capitalize">
                        {c.nombre}
                      </span>
                      <small
                        className="text-muted d-block"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {c.telefono}
                      </small>
                    </div>
                    <button
                      onClick={() => onEliminarCliente(c.id)}
                      className="btn btn-sm btn-outline-danger border-0 rounded-circle"
                    >
                      <Trash2 size={16} />
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
