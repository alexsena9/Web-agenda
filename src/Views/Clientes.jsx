import React from "react";
import { User, Trash2, Calendar, Hash, Search } from "lucide-react";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

const Clientes = ({ clientes }) => {
  const [busqueda, setBusqueda] = React.useState("");

  const handleEliminar = async (id) => {
    if (
      window.confirm(
        "¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.",
      )
    ) {
      try {
        await deleteDoc(doc(db, "clientes", id));
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        alert("No se pudo eliminar el cliente.");
      }
    }
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Base de Clientes</h2>
          <p className="text-muted mb-0">
            Gestiona la información de tus clientes recurrentes
          </p>
        </div>
        <div className="position-relative" style={{ maxWidth: "300px" }}>
          <Search
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            size={18}
          />
          <input
            type="text"
            className="form-control ps-5 py-2 border-0 shadow-sm rounded-3"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-3">
        {clientesFiltrados.map((cliente) => (
          <div key={cliente.id} className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-3 hover-shadow transition-all">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                  <User size={24} />
                </div>
                <button
                  onClick={() => handleEliminar(cliente.id)}
                  className="btn btn-link text-danger p-2 hover-bg-danger-light rounded-3"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <h5 className="fw-bold text-dark mb-1">{cliente.nombre}</h5>
              <div className="d-flex align-items-center gap-2 text-muted small mb-3">
                <Calendar size={14} /> Registrado: {cliente.fechaRegistro}
              </div>

              <div className="bg-light rounded-3 p-2 d-flex justify-content-between align-items-center">
                <span className="text-muted small fw-bold">TOTAL CITAS</span>
                <span className="badge bg-primary rounded-pill px-3">
                  {cliente.cantidadTurnos}
                </span>
              </div>
            </div>
          </div>
        ))}

        {clientesFiltrados.length === 0 && (
          <div className="col-12 text-center py-5">
            <div className="text-muted">
              No se encontraron clientes con ese nombre.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clientes;
