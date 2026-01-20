import React, { useState } from "react";
import { Trash2, Plus, Scissors, Clock, LogOut } from "lucide-react";

const Configuracion = ({
  servicios,
  setServicios,
  horarios,
  setHorarios,
  onLogout,
}) => {
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");

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

  const eliminarServicio = (index) => {
    setServicios(servicios.filter((_, i) => i !== index));
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Configuración</h2>
        <button
          onClick={onLogout}
          className="btn btn-outline-danger d-flex align-items-center gap-2 rounded-4"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-5 p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Scissors size={20} className="text-primary" /> Servicios
            </h5>
            <div className="d-flex gap-2 mb-4">
              <input
                type="text"
                className="form-control bg-light border-0 py-2 shadow-none"
                placeholder="Servicio"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
              <input
                type="number"
                className="form-control bg-light border-0 py-2 shadow-none"
                placeholder="Precio"
                style={{ width: "120px" }}
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
            <div className="list-group list-group-flush">
              {servicios.map((s, i) => (
                <div
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center px-0 py-3"
                >
                  <div>
                    <p className="mb-0 fw-bold">{s.nombre}</p>
                    <p className="mb-0 text-muted small">${s.precio}</p>
                  </div>
                  <button
                    onClick={() => eliminarServicio(i)}
                    className="btn btn-light text-danger rounded-circle p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-5 p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Clock size={20} className="text-primary" /> Horarios
            </h5>
            <div className="mb-3">
              <label className="small fw-bold text-muted mb-2">APERTURA</label>
              <input
                type="number"
                className="form-control bg-light border-0 py-3"
                value={horarios.inicio}
                onChange={(e) =>
                  setHorarios({ ...horarios, inicio: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="mb-3">
              <label className="small fw-bold text-muted mb-2">CIERRE</label>
              <input
                type="number"
                className="form-control bg-light border-0 py-3"
                value={horarios.fin}
                onChange={(e) =>
                  setHorarios({ ...horarios, fin: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
