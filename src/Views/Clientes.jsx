import React, { useState } from "react";
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";

const Clientes = () => {
  const [clientes] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@example.com",
      telefono: "+54 11 1234-5678",
      servicios: 5,
    },
    {
      id: 2,
      nombre: "María García",
      email: "maria@example.com",
      telefono: "+54 11 8765-4321",
      servicios: 12,
    },
    {
      id: 3,
      nombre: "Carlos López",
      email: "carlos@example.com",
      telefono: "+54 11 5555-0000",
      servicios: 2,
    },
  ]);

  return (
    <div className="view-animate">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Base de Clientes</h2>
          <p className="text-muted">
            Administra la información de tus contactos.
          </p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 rounded-3 px-4 shadow-sm">
          <UserPlus size={18} />
          <span className="fw-bold">Nuevo Cliente</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
        <div className="input-group">
          <span className="input-group-text bg-transparent border-0 pe-0">
            <Search size={20} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder="Buscar por nombre, email o teléfono..."
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0 text-muted small fw-bold">
                  CLIENTE
                </th>
                <th className="py-3 border-0 text-muted small fw-bold">
                  CONTACTO
                </th>
                <th className="py-3 border-0 text-muted small fw-bold">
                  SERVICIOS
                </th>
                <th className="py-3 border-0 text-muted small fw-bold text-end px-4">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td className="px-4 py-3 border-0">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: "40px", height: "40px" }}
                      >
                        {cliente.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="mb-0 fw-bold">{cliente.nombre}</p>
                        <small className="text-muted">
                          ID: #{cliente.id.toString().padStart(4, "0")}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 border-0">
                    <div className="d-flex flex-column">
                      <div className="d-flex align-items-center gap-2 small text-muted">
                        <Mail size={14} /> {cliente.email}
                      </div>
                      <div className="d-flex align-items-center gap-2 small text-muted">
                        <Phone size={14} /> {cliente.telefono}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 border-0">
                    <span className="badge bg-light text-dark border rounded-pill px-3">
                      {cliente.servicios} turnos
                    </span>
                  </td>
                  <td className="py-3 border-0 text-end px-4">
                    <div className="btn-group">
                      <button className="btn btn-sm btn-light border-0 rounded-circle p-2 text-primary me-1">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-sm btn-light border-0 rounded-circle p-2 text-danger">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
