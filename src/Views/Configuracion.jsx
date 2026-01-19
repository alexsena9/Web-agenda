import React, { useState } from "react";
import { Settings, Plus, Trash2, CheckCircle, Store } from "lucide-react";

const Configuracion = ({ servicios, setServicios }) => {
  const [nuevoServicio, setNuevoServicio] = useState("");

  const agregarServicio = (e) => {
    e.preventDefault();
    if (nuevoServicio.trim() === "") return;
    if (!servicios.includes(nuevoServicio)) {
      setServicios([...servicios, nuevoServicio]);
      setNuevoServicio("");
    }
  };

  const eliminarServicio = (nombre) => {
    if (servicios.length <= 1) {
      alert("Debes tener al menos un servicio disponible.");
      return;
    }
    setServicios(servicios.filter((s) => s !== nombre));
  };

  return (
    <div className="view-animate">
      <div className="mb-4">
        <h2 className="fw-bold">Configuración</h2>
        <p className="text-muted">
          Personaliza los detalles de tu negocio y servicios.
        </p>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <Store className="text-primary" size={24} />
              <h5 className="fw-bold mb-0">Servicios Ofrecidos</h5>
            </div>

            <form onSubmit={agregarServicio} className="d-flex gap-2 mb-4">
              <input
                type="text"
                className="form-control bg-light border-0 shadow-none"
                placeholder="Ej: Limpieza Facial"
                value={nuevoServicio}
                onChange={(e) => setNuevoServicio(e.target.value)}
              />
              <button type="submit" className="btn btn-primary rounded-3 px-3">
                <Plus size={20} />
              </button>
            </form>

            <ul className="list-group list-group-flush">
              {servicios.map((servicio, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center px-0 border-light"
                >
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle size={16} className="text-success" />
                    <span>{servicio}</span>
                  </div>
                  <button
                    onClick={() => eliminarServicio(servicio)}
                    className="btn btn-link text-danger p-0 border-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white">
            <Settings className="text-muted mb-3 mx-auto" size={40} />
            <h5 className="fw-bold">Más ajustes pronto</h5>
            <p className="text-muted small">
              Próximamente podrás configurar horarios de apertura, días no
              laborales y exportar tus datos a Excel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
