import React, { useState } from "react";
import {
  Plus,
  Trash2,
  CheckCircle,
  Store,
  Clock,
  Search,
  UserMinus,
  Database,
} from "lucide-react";

const Configuracion = ({
  servicios,
  setServicios,
  turnos,
  setTurnos,
  clientes,
  setClientes,
  horarios,
  setHorarios,
}) => {
  const [nuevoServicio, setNuevoServicio] = useState("");
  const [busquedaBorrar, setBusquedaBorrar] = useState("");

  const agregarServicio = (e) => {
    e.preventDefault();
    if (nuevoServicio.trim() === "" || servicios.includes(nuevoServicio))
      return;
    setServicios([...servicios, nuevoServicio]);
    setNuevoServicio("");
  };

  const eliminarServicio = (nombre) => {
    if (servicios.length <= 1)
      return alert("Debes tener al menos un servicio.");
    setServicios(servicios.filter((s) => s !== nombre));
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busquedaBorrar.toLowerCase()),
  );

  const eliminarClienteYTurnos = (clienteNombre, clienteId) => {
    if (
      window.confirm(
        `¿Seguro? Se borrará a "${clienteNombre}" y todos sus turnos registrados.`,
      )
    ) {
      setTurnos(
        turnos.filter(
          (t) => t.cliente.toLowerCase() !== clienteNombre.toLowerCase(),
        ),
      );
      setClientes(clientes.filter((c) => c.id !== clienteId));
    }
  };

  return (
    <div className="view-animate text-start">
      <div className="mb-4">
        <h2 className="fw-bold">Configuración</h2>
        <p className="text-muted">
          Gestión precisa de tu base de datos y jornada.
        </p>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-4">
              <Clock className="text-primary" size={24} />
              <h5 className="fw-bold mb-0">Jornada</h5>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">
                INICIO
              </label>
              <select
                className="form-select bg-light border-0"
                value={horarios.inicio}
                onChange={(e) =>
                  setHorarios({ ...horarios, inicio: parseInt(e.target.value) })
                }
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>
                    {i}:00 hs
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label small fw-bold text-muted">FIN</label>
              <select
                className="form-select bg-light border-0"
                value={horarios.fin}
                onChange={(e) =>
                  setHorarios({ ...horarios, fin: parseInt(e.target.value) })
                }
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>
                    {i}:00 hs
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-4">
              <Store className="text-primary" size={24} />
              <h5 className="fw-bold mb-0">Servicios</h5>
            </div>
            <form onSubmit={agregarServicio} className="d-flex gap-2 mb-3">
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Nuevo..."
                value={nuevoServicio}
                onChange={(e) => setNuevoServicio(e.target.value)}
              />
              <button type="submit" className="btn btn-primary px-3">
                <Plus size={20} />
              </button>
            </form>
            <div style={{ maxHeight: "150px", overflowY: "auto" }}>
              {servicios.map((s, i) => (
                <div
                  key={i}
                  className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded-3"
                >
                  <span className="small">{s}</span>
                  <Trash2
                    size={14}
                    className="text-danger cursor-pointer"
                    onClick={() => eliminarServicio(s)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 border-start border-warning border-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Database className="text-warning" size={24} />
              <h5 className="fw-bold mb-0">Limpiar Datos</h5>
            </div>

            <div className="input-group input-group-sm mb-3">
              <span className="input-group-text bg-light border-0">
                <Search size={14} />
              </span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Buscar cliente para borrar..."
                value={busquedaBorrar}
                onChange={(e) => setBusquedaBorrar(e.target.value)}
              />
            </div>

            <div style={{ maxHeight: "180px", overflowY: "auto" }}>
              {busquedaBorrar && clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((c) => (
                  <div
                    key={c.id}
                    className="d-flex justify-content-between align-items-center p-2 border-bottom"
                  >
                    <div className="text-truncate" style={{ maxWidth: "70%" }}>
                      <p className="mb-0 small fw-bold">{c.nombre}</p>
                      <small
                        className="text-muted"
                        style={{ fontSize: "10px" }}
                      >
                        {c.cantidadTurnos} turnos
                      </small>
                    </div>
                    <button
                      onClick={() => eliminarClienteYTurnos(c.nombre, c.id)}
                      className="btn btn-sm btn-outline-danger border-0"
                    >
                      <UserMinus size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted small py-4">
                  Busca un nombre para ver opciones de borrado.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
