import React, { useState } from "react";
import { X, Calendar, Clock, User, Scissors } from "lucide-react";

const NuevoTurnoModal = ({ isOpen, onClose, onAddTurno, servicios }) => {
  const [formData, setFormData] = useState({
    cliente: "",
    servicio: "",
    precio: "",
    fecha: new Date().toISOString().split("T")[0],
    hora: "09:00",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTurno({ ...formData, estado: "Pendiente" });
    onClose();
    setFormData({
      cliente: "",
      servicio: "",
      precio: "",
      fecha: new Date().toISOString().split("T")[0],
      hora: "09:00",
    });
  };

  const handleServicioChange = (e) => {
    const serv = servicios.find((s) => s.nombre === e.target.value);
    if (serv) {
      setFormData({ ...formData, servicio: serv.nombre, precio: serv.precio });
    }
  };

  return (
    <div
      className="modal-overlay d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 9999,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-4 animate-fade-up"
        style={{ width: "95%", maxWidth: "420px" }}
      >
        <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center pb-0">
          <h5 className="fw-bold mb-0">Agendar Cita</h5>
          <button onClick={onClose} className="btn btn-link text-muted p-0">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="card-body p-4 text-start">
          <div className="mb-3">
            <label className="small fw-bold text-muted mb-2">CLIENTE</label>
            <input
              type="text"
              className="form-control bg-light border-0 py-2"
              required
              value={formData.cliente}
              onChange={(e) =>
                setFormData({ ...formData, cliente: e.target.value })
              }
              placeholder="Nombre completo"
            />
          </div>
          <div className="mb-3">
            <label className="small fw-bold text-muted mb-2">SERVICIO</label>
            <select
              className="form-select bg-light border-0 py-2"
              required
              onChange={handleServicioChange}
            >
              <option value="">Selecciona...</option>
              {servicios.map((s, i) => (
                <option key={i} value={s.nombre}>
                  {s.nombre} (${s.precio})
                </option>
              ))}
            </select>
          </div>
          <div className="row g-2 mb-4">
            <div className="col-6">
              <label className="small fw-bold text-muted mb-2">FECHA</label>
              <input
                type="date"
                className="form-control bg-light border-0 py-2"
                value={formData.fecha}
                onChange={(e) =>
                  setFormData({ ...formData, fecha: e.target.value })
                }
              />
            </div>
            <div className="col-6">
              <label className="small fw-bold text-muted mb-2">HORA</label>
              <input
                type="time"
                className="form-control bg-light border-0 py-2"
                value={formData.hora}
                onChange={(e) =>
                  setFormData({ ...formData, hora: e.target.value })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow"
          >
            Guardar Turno
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevoTurnoModal;
