import React, { useState } from "react";
import {
  Search,
  User,
  Calendar,
  Trash2,
  MessageCircle,
  MoreVertical,
  ExternalLink,
} from "lucide-react";

import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

const Clientes = ({ clientes }) => {
  const [busqueda, setBusqueda] = useState("");

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const eliminarCliente = async (id) => {
    if (window.confirm("¿Deseas eliminar este cliente permanentemente?")) {
      try {
        await deleteDoc(doc(db, "clientes", id));
      } catch (error) {
        console.error("Error al eliminar cliente de Firebase:", error);
        alert("Hubo un error al intentar eliminar el cliente.");
      }
    }
  };

  const contactarWhatsApp = (nombre) => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent("Hola " + nombre + "!")}`,
      "_blank",
    );
  };

  return (
    <div className="view-animate text-start">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold mb-1 tracking-tight">Directorio</h2>
          <p className="text-muted small mb-0">
            Base de datos de confianza · {clientes.length} contactos
          </p>
        </div>
        <div className="d-none d-md-block">
          <div className="position-relative">
            <Search
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              size={18}
            />
            <input
              type="text"
              className="form-control bg-white border-0 shadow-sm ps-5 rounded-3"
              style={{ width: "300px", fontSize: "14px" }}
              placeholder="Buscar cliente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="d-md-none mb-4">
        <input
          type="text"
          className="form-control bg-white border-0 shadow-sm py-2 px-3 rounded-3"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light bg-opacity-50">
              <tr>
                <th
                  className="px-4 py-3 border-0 text-muted small fw-bold"
                  style={{ width: "40%" }}
                >
                  CLIENTE
                </th>
                <th className="py-3 border-0 text-muted small fw-bold">
                  REGISTRO
                </th>
                <th className="py-3 border-0 text-muted small fw-bold">
                  VISITAS
                </th>
                <th className="px-4 py-3 border-0 text-muted small fw-bold text-end">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody className="border-0">
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((c) => (
                  <tr key={c.id} className="border-bottom border-light">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-primary bg-opacity-10 text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "14px",
                          }}
                        >
                          {c.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{c.nombre}</div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "11px" }}
                          >
                            ID: {c.id.toString().slice(-5)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-muted small">
                        {c.fechaRegistro}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="badge bg-light text-primary rounded-pill px-3 fw-medium">
                        {c.cantidadTurnos}{" "}
                        {c.cantidadTurnos === 1 ? "visita" : "visitas"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          onClick={() => contactarWhatsApp(c.nombre)}
                          className="btn btn-sm btn-outline-success border-0 rounded-3 p-2"
                          title="Contactar"
                        >
                          <MessageCircle size={18} />
                        </button>
                        <button
                          onClick={() => eliminarCliente(c.id)}
                          className="btn btn-sm btn-outline-danger border-0 rounded-3 p-2"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    No se encontraron resultados para tu búsqueda.
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
