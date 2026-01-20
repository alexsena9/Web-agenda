import React, { useState } from "react";
import {
  User,
  Search,
  MessageCircle,
  Trash2,
  Phone,
  Calendar,
} from "lucide-react";

const Clientes = ({ clientes, onEliminar }) => {
  const [busqueda, setBusqueda] = useState("");
  const filtered = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.telefono.includes(busqueda),
  );

  return (
    <div className="animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h2 className="fw-bold mb-0">Directorio de Clientes</h2>
        <div className="position-relative">
          <input
            type="text"
            className="form-control border-0 shadow-sm rounded-4 ps-5 py-2"
            style={{ minWidth: "300px" }}
            placeholder="Buscar por nombre o teléfono..."
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Search
            className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"
            size={18}
          />
        </div>
      </div>
      <div className="row g-3">
        {filtered.map((c) => (
          <div key={c.id} className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-5 p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                  <User size={24} />
                </div>
                <div className="overflow-hidden">
                  <h6 className="fw-bold mb-0 text-capitalize text-truncate">
                    {c.nombre}
                  </h6>
                  <small className="text-muted d-flex align-items-center gap-1">
                    <Phone size={12} /> {c.telefono}
                  </small>
                </div>
              </div>
              <div className="bg-light p-2 rounded-3 mb-3 small text-muted d-flex align-items-center gap-2">
                <Calendar size={14} /> Registro:{" "}
                {new Date(c.fechaRegistro).toLocaleDateString()}
              </div>
              <div className="d-flex gap-2">
                <button
                  onClick={() => window.open(`https://wa.me/${c.telefono}`)}
                  className="btn btn-success rounded-4 flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <MessageCircle size={18} /> WhatsApp
                </button>
                <button
                  onClick={() => onEliminar(c.id)}
                  className="btn btn-outline-danger rounded-4 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Clientes;
