import React, { useState } from "react";
import {
  User,
  Search,
  Calendar,
  Phone,
  Mail,
  MoreVertical,
  Trash2,
} from "lucide-react";

const Clientes = ({ clientes }) => {
  const [busqueda, setBusqueda] = useState("");

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Mis Clientes</h2>
          <p className="text-muted mb-0">
            Gestiona la base de datos de tu barbería
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-4 shadow-sm border d-flex align-items-center">
          <span className="text-muted small fw-bold">TOTAL:</span>
          <span className="ms-2 fw-bold text-primary">{clientes.length}</span>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-5 mb-4">
        <div className="card-body p-3">
          <div className="input-group">
            <span className="input-group-text bg-transparent border-0 pe-0">
              <Search size={20} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-0 shadow-none py-2"
              placeholder="Buscar cliente por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row g-3">
        {clientesFiltrados.length > 0 ? (
          clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className="col-12 col-md-6 col-xl-4">
              <div className="card border-0 shadow-sm rounded-4 hover-shadow transition-all">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                      <User size={24} />
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <h6 className="fw-bold mb-0 text-dark text-truncate text-capitalize">
                        {cliente.nombre}
                      </h6>
                      <span className="badge bg-success bg-opacity-10 text-success small rounded-pill mt-1">
                        Cliente Activo
                      </span>
                    </div>
                  </div>

                  <div className="border-top pt-3 mt-3">
                    <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                      <Calendar size={14} />
                      <span>
                        Registrado:{" "}
                        {new Date(cliente.fechaRegistro).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <Phone size={14} />
                      <span>{cliente.telefono || "Sin teléfono"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="bg-white rounded-5 p-5 border-2 border-dashed">
              <User size={48} className="text-muted opacity-25 mb-3" />
              <h5 className="text-muted">No se encontraron clientes</h5>
              <p className="text-muted small mb-0">
                Los clientes se registran automáticamente al finalizar un turno.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clientes;
