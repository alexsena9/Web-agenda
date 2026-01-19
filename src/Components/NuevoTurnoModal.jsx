import React, { useState, useEffect } from "react";
import { X, User, Scissors, Clock, FileText, AlertCircle } from "lucide-react";

const NuevoTurnoModal = ({
  isOpen,
  onClose,
  onAddTurno,
  servicios,
  turnos,
}) => {
  const [formData, setFormData] = useState({
    cliente: "",
    servicio: servicios[0],
    fecha: "",
    hora: "",
    notas: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (servicios?.length > 0)
      setFormData((prev) => ({ ...prev, servicio: servicios[0] }));
  }, [servicios, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const existe = turnos.find(
      (t) => t.fecha === formData.fecha && t.hora === formData.hora,
    );

    if (existe) {
      setError(
        `¡Atención! Ya tienes un turno con ${existe.cliente} a esa hora.`,
      );
      return;
    }

    onAddTurno({ ...formData, id: Date.now(), estado: "Pendiente" });
    setFormData({
      cliente: "",
      servicio: servicios[0],
      fecha: "",
      hora: "",
      notas: "",
    });
    setError("");
    onClose();
  };

  return (
    <div
      className="modal-overlay d-flex align-items-center justify-content-center"
      style={{
        zIndex: 2000,
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        className="modal-content-custom bg-white p-4 rounded-4 shadow-lg animate-fade-up"
        style={{ width: "90%", maxWidth: "450px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Nuevo Turno</h4>
          <button
            onClick={() => {
              setError("");
              onClose();
            }}
            className="btn btn-light rounded-circle p-2 border-0"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label small fw-bold text-muted">
              CLIENTE
            </label>
            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Nombre completo"
              value={formData.cliente}
              onChange={(e) =>
                setFormData({ ...formData, cliente: e.target.value })
              }
              required
            />
          </div>

          <div className="row text-start">
            <div className="col-6 mb-3">
              <label className="form-label small fw-bold text-muted">
                FECHA
              </label>
              <input
                type="date"
                className="form-control bg-light border-0"
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
                className="form-control bg-light border-0"
                value={formData.hora}
                onChange={(e) =>
                  setFormData({ ...formData, hora: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="mb-3 text-start">
            <label className="form-label small fw-bold text-muted">
              SERVICIO
            </label>
            <select
              className="form-select bg-light border-0"
              value={formData.servicio}
              onChange={(e) =>
                setFormData({ ...formData, servicio: e.target.value })
              }
            >
              {servicios.map((s, idx) => (
                <option key={idx} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 text-start">
            <label className="form-label small fw-bold text-muted">
              NOTAS (OPCIONAL)
            </label>
            <textarea
              className="form-control bg-light border-0"
              rows="2"
              value={formData.notas}
              onChange={(e) =>
                setFormData({ ...formData, notas: e.target.value })
              }
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm"
          >
            GUARDAR TURNO
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevoTurnoModal;
