import React, { useState } from "react";
import {
  X,
  User,
  Scissors,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";

const NuevoTurnoModal = ({ isOpen, onClose, onAddTurno }) => {
  const [formData, setFormData] = useState({
    cliente: "",
    servicio: "Corte de Cabello",
    fecha: "",
    hora: "",
    estado: "Pendiente",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTurno({ ...formData, id: Date.now() });
    setFormData({
      cliente: "",
      servicio: "Corte de Cabello",
      fecha: "",
      hora: "",
      estado: "Pendiente",
    });
    onClose();
  };

  return (
    <div className="modal-overlay d-flex align-items-center justify-content-center">
      <div className="modal-content-custom bg-white p-4 rounded-4 shadow-lg animate-fade-up">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">Agendar Nuevo Turno</h4>
          <button
            onClick={onClose}
            className="btn btn-light rounded-circle p-2 border-0"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">
              CLIENTE
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <User size={18} />
              </span>
              <input
                type="text"
                className="form-control bg-light border-0 shadow-none"
                placeholder="Nombre completo"
                value={formData.cliente}
                onChange={(e) =>
                  setFormData({ ...formData, cliente: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">
              SERVICIO
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <Scissors size={18} />
              </span>
              <select
                className="form-select bg-light border-0 shadow-none"
                value={formData.servicio}
                onChange={(e) =>
                  setFormData({ ...formData, servicio: e.target.value })
                }
              >
                <option>Corte de Cabello</option>
                <option>Barba</option>
                <option>Tratamiento Facial</option>
                <option>Consultoría</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label small fw-bold text-muted">
                FECHA
              </label>
              <input
                type="date"
                className="form-control bg-light border-0 shadow-none"
                value={formData.fecha}
                onChange={(e) =>
                  setFormData({ ...formData, fecha: e.target.value })
                }
                required
              />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label small fw-bold text-muted">
                HORA
              </label>
              <input
                type="time"
                className="form-control bg-light border-0 shadow-none"
                value={formData.hora}
                onChange={(e) =>
                  setFormData({ ...formData, hora: e.target.value })
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 rounded-3 fw-bold mt-3 shadow-sm"
          >
            CONFIRMAR TURNO
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevoTurnoModal;
