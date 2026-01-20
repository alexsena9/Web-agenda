import React, { useState } from "react";
import {
  Settings,
  Plus,
  Trash2,
  Save,
  LogOut,
  Clock,
  Scissors,
  Database,
  CheckCircle,
} from "lucide-react";

const Configuracion = ({
  servicios,
  setServicios,
  horarios,
  setHorarios,
  onLogout,
}) => {
  const [nuevoServicio, setNuevoServicio] = useState("");
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  const handleAddServicio = (e) => {
    e.preventDefault();
    if (nuevoServicio.trim()) {
      const actualizados = [...servicios, nuevoServicio.trim()];
      setServicios(actualizados);
      setNuevoServicio("");
      triggerAlert();
    }
  };

  const handleRemoveServicio = (index) => {
    const actualizados = servicios.filter((_, i) => i !== index);
    setServicios(actualizados);
    triggerAlert();
  };

  const handleHorarioChange = (e) => {
    const { name, value } = e.target;
    setHorarios({
      ...horarios,
      [name]: parseInt(value),
    });
    triggerAlert();
  };

  const triggerAlert = () => {
    setShowSavedAlert(true);
    setTimeout(() => setShowSavedAlert(false), 2000);
  };

  return (
    <div className="animate-fade-in pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Configuración</h2>
          <p className="text-muted mb-0">
            Personaliza los servicios y horarios de tu negocio
          </p>
        </div>
        <button
          onClick={onLogout}
          className="btn btn-outline-danger d-flex align-items-center gap-2 rounded-3 fw-bold px-3"
        >
          <LogOut size={18} /> Salir
        </button>
      </div>

      {showSavedAlert && (
        <div className="alert alert-success border-0 shadow-sm d-flex align-items-center gap-2 animate-fade-in py-2">
          <CheckCircle size={18} /> Sincronizado con la nube con éxito
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3">
                <Scissors size={20} />
              </div>
              <h5 className="fw-bold mb-0 text-dark">Servicios Ofrecidos</h5>
            </div>

            <form onSubmit={handleAddServicio} className="mb-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-light border-0 py-2 ps-3"
                  placeholder="Ej: Corte Degradado, Perfilado de Cejas..."
                  value={nuevoServicio}
                  onChange={(e) => setNuevoServicio(e.target.value)}
                />
                <button
                  className="btn btn-primary px-4 fw-bold d-flex align-items-center gap-2"
                  type="submit"
                >
                  <Plus size={18} /> Agregar
                </button>
              </div>
            </form>

            <div className="list-group list-group-flush border-top">
              {servicios.map((servicio, index) => (
                <div
                  key={index}
                  className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-bottom"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2 rounded-circle text-muted">
                      <CheckCircle size={14} />
                    </div>
                    <span className="fw-semibold text-dark">{servicio}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveServicio(index)}
                    className="btn btn-link text-danger p-2 hover-bg-danger-light rounded-3"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-3">
                <Clock size={20} />
              </div>
              <h5 className="fw-bold mb-0 text-dark">Horario de Atención</h5>
            </div>

            <div className="row g-3">
              <div className="col-6">
                <label className="form-label small fw-bold text-muted">
                  HORA APERTURA
                </label>
                <select
                  name="inicio"
                  className="form-select bg-light border-0 py-2"
                  value={horarios.inicio}
                  onChange={handleHorarioChange}
                >
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}:00 hs
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label small fw-bold text-muted">
                  HORA CIERRE
                </label>
                <select
                  name="fin"
                  className="form-select bg-light border-0 py-2"
                  value={horarios.fin}
                  onChange={handleHorarioChange}
                >
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}:00 hs
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="small text-muted mt-3 mb-0">
              * Estos horarios definen los espacios disponibles que verán tus
              clientes en la web de reservas.
            </p>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Database size={20} className="text-primary" />
              <h5 className="fw-bold mb-0">Estado de la Base</h5>
            </div>
            <p className="small opacity-75 mb-0">
              Todos tus datos están siendo respaldados y sincronizados en tiempo
              real por <strong>Firebase Cloud</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
