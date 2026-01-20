import React, { useState } from "react";
import { X, Calendar, Clock, User, Scissors } from "lucide-react";

const NuevoTurnoModal = ({
  isOpen,
  onClose,
  onAddTurno,
  servicios,
  turnos,
}) => {
  const [nuevo, setNuevo] = useState({
    cliente: "",
    servicio: servicios[0],
    fecha: new Date().toISOString().split("T")[0],
    hora: "09:00",
    estado: "Pendiente",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const ocupado = turnos.find(
      (t) => t.fecha === nuevo.fecha && t.hora === nuevo.hora,
    );

    if (ocupado) {
      alert("Este horario ya está reservado. Por favor elige otro.");
      return;
    }

    onAddTurno(nuevo);
    onClose();
    setNuevo({ ...nuevo, cliente: "" });
  };

  return (
    <div
      className="modal-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="bg-white rounded-4 shadow-lg p-4 animate-fade-up"
        style={{ width: "90%", maxWidth: "450px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">Agendar Nuevo Turno</h4>
          <button
            onClick={onClose}
            className="btn btn-light rounded-circle p-2"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="small fw-bold text-muted mb-2">CLIENTE</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <User size={18} />
              </span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Nombre del cliente"
                required
                value={nuevo.cliente}
                onChange={(e) =>
                  setNuevo({ ...nuevo, cliente: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="small fw-bold text-muted mb-2">SERVICIO</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <Scissors size={18} />
              </span>
              <select
                className="form-select bg-light border-0"
                value={nuevo.servicio}
                onChange={(e) =>
                  setNuevo({ ...nuevo, servicio: e.target.value })
                }
              >
                {servicios.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6">
              <label className="small fw-bold text-muted mb-2">FECHA</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <Calendar size={18} />
                </span>
                <input
                  type="date"
                  className="form-control bg-light border-0"
                  required
                  value={nuevo.fecha}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, fecha: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="col-6">
              <label className="small fw-bold text-muted mb-2">HORA</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <Clock size={18} />
                </span>
                <input
                  type="time"
                  className="form-control bg-light border-0"
                  required
                  value={nuevo.hora}
                  onChange={(e) => setNuevo({ ...nuevo, hora: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm"
          >
            Confirmar Reserva
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevoTurnoModal;
