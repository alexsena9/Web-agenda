import React, { useState } from "react";
import { Search, Trash2, User, MessageCircle, Calendar } from "lucide-react";

const Clientes = ({ clientes, setClientes }) => {
  const [busqueda, setBusqueda] = useState("");

  const eliminarCliente = (id) => {
    if (window.confirm("¿Eliminar este cliente borrará su historial?")) {
      setClientes(clientes.filter((c) => c.id !== id));
    }
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="view-animate text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Base de Clientes</h2>
          <p className="text-muted">
            Gestiona tus contactos y su historial de visitas.
          </p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
        <div className="input-group">
          <span className="input-group-text bg-transparent border-0 pe-0">
            <Search size={20} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder="Escribe el nombre del cliente para buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3 border-0 text-muted small fw-bold">
                  CLIENTE
                </th>
                <th className="py-3 border-0 text-muted small fw-bold text-center">
                  HISTORIAL
                </th>
                <th className="py-3 border-0 text-muted small fw-bold text-end px-4">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className="px-4 py-3 border-0">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <User size={20} />
                        </div>
                        <div>
                          <p className="mb-0 fw-bold">{cliente.nombre}</p>
                          <small className="text-muted">
                            Miembro desde {cliente.fechaRegistro}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 border-0 text-center">
                      <span className="badge bg-light text-primary border border-primary-subtle rounded-pill px-3">
                        {cliente.cantidadTurnos} turnos
                      </span>
                    </td>
                    <td className="py-3 border-0 text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                        <a
                          href={`https://wa.me/?text=Hola%20${cliente.nombre},%20te%20escribo%20desde%20la%20agenda.`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-light text-success rounded-circle p-2 border-0"
                          title="Contactar por WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </a>
                        <button
                          onClick={() => eliminarCliente(cliente.id)}
                          className="btn btn-sm btn-light text-danger rounded-circle p-2 border-0"
                          title="Eliminar Cliente"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-5 text-muted">
                    {busqueda
                      ? "No se encontraron clientes con ese nombre."
                      : "No hay clientes registrados."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
