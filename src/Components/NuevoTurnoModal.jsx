import React, { useState } from "react";
import { X, User, Phone, Scissors, Clock, Check } from "lucide-react";

const NuevoTurnoModal = ({ isOpen, onClose, servicios, onAddTurno }) => {
  const [turno, setTurno] = useState({
    cliente: "",
    telefono: "",
    servicio: "",
    fecha: new Date().toISOString().split("T")[0],
    hora: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!turno.cliente || !turno.telefono || !turno.hora || !turno.servicio)
      return alert("Completa todos los campos");
    const s = servicios.find((x) => x.nombre === turno.servicio);
    onAddTurno({ ...turno, precio: s ? s.precio : 0 });
    onClose();
  };

  return (
    <div
      className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="card border-0 shadow-lg rounded-5 w-100 animate-fade-up mx-3"
        style={{ maxWidth: "450px" }}
      >
        <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Nuevo Turno</h5>
          <button
            onClick={onClose}
            className="btn btn-light rounded-circle p-2"
          >
            <X size={20} />
          </button>
        </div>
        <div className="card-body p-4 pt-0">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="small fw-bold text-muted mb-1">CLIENTE</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 shadow-none"
                  placeholder="Nombre"
                  onChange={(e) =>
                    setTurno({ ...turno, cliente: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="small fw-bold text-muted mb-1">WHATSAPP</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <Phone size={18} />
                </span>
                <input
                  type="tel"
                  className="form-control bg-light border-0 shadow-none"
                  placeholder="Número"
                  onChange={(e) =>
                    setTurno({ ...turno, telefono: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="small fw-bold text-muted mb-1">SERVICIO</label>
              <select
                className="form-select bg-light border-0 shadow-none"
                onChange={(e) =>
                  setTurno({ ...turno, servicio: e.target.value })
                }
              >
                <option value="">Seleccionar...</option>
                {servicios.map((s, i) => (
                  <option key={i} value={s.nombre}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="row g-2 mb-4">
              <div className="col-6">
                <input
                  type="date"
                  className="form-control bg-light border-0"
                  value={turno.fecha}
                  onChange={(e) =>
                    setTurno({ ...turno, fecha: e.target.value })
                  }
                />
              </div>
              <div className="col-6">
                <input
                  type="time"
                  className="form-control bg-light border-0"
                  onChange={(e) => setTurno({ ...turno, hora: e.target.value })}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
            >
              <Check size={20} /> Agendar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default NuevoTurnoModal;
