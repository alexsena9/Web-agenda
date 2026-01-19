import React, { useState } from "react";
import {
  Search,
  User,
  Calendar,
  MessageSquare,
  Trash2,
  Filter,
} from "lucide-react";

const Clientes = ({ clientes, setClientes }) => {
  const [busqueda, setBusqueda] = useState("");

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const eliminarCliente = (id) => {
    if (window.confirm("¿Eliminar cliente de la base de datos?")) {
      setClientes(clientes.filter((c) => c.id !== id));
    }
  };

  const contactar = (nombre) => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent("Hola " + nombre + "!")}`,
      "_blank",
    );
  };

  return (
    <div className="view-animate text-start">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-0">Directorio de Clientes</h2>
          <p className="text-muted mb-0">
            Total: {clientes.length} clientes registrados
          </p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <Search size={20} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0 shadow-none"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        {clientesFiltrados.length > 0 ? (
          clientesFiltrados.map((c) => (
            <div key={c.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 h-100 card-hover">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle">
                      <User size={24} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">{c.nombre}</h6>
                      <small className="text-muted">
                        Desde: {c.fechaRegistro}
                      </small>
                    </div>
                  </div>
                  <button
                    onClick={() => eliminarCliente(c.id)}
                    className="btn btn-link text-danger p-0 border-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <hr className="my-3 opacity-25" />

                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={14} className="text-primary" />
                    <span className="small fw-bold">
                      {c.cantidadTurnos} turnos
                    </span>
                  </div>
                  <button
                    onClick={() => contactar(c.nombre)}
                    className="btn btn-success btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
                  >
                    <MessageSquare size={14} /> Mensaje
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">
              No se encontraron clientes con esa búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clientes;
