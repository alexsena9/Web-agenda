import React, { useState } from "react";
import { X, Calendar, Lock, AlertCircle, Clock, User } from "lucide-react";

const NuevoTurnoModal = ({
  isOpen,
  onClose,
  onAddTurno,
  servicios,
  turnos,
}) => {
  const [isBlocking, setIsBlocking] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    cliente: "",
    servicio: servicios[0] || "",
    fecha: "",
    hora: "",
    notas: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const existe = turnos.find(
      (t) => t.fecha === formData.fecha && t.hora === formData.hora,
    );
    if (existe) {
      setError(`Este horario ya está ocupado por ${existe.cliente}.`);
      return;
    }

    const dataAEnviar = isBlocking
      ? {
          id: Date.now(),
          cliente: "HORARIO BLOQUEADO",
          servicio: "Descanso / Personal",
          fecha: formData.fecha,
          hora: formData.hora,
          estado: "Bloqueado",
        }
      : {
          ...formData,
          id: Date.now(),
          estado: "Pendiente",
        };

    onAddTurno(dataAEnviar);

    setFormData({
      cliente: "",
      servicio: servicios[0],
      fecha: "",
      hora: "",
      notas: "",
    });
    setIsBlocking(false);
    setError("");
    onClose();
  };

  return (
    <div
      className="modal-overlay d-flex align-items-center justify-content-center px-3"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(4px)",
        zIndex: 2000,
      }}
    >
      <div
        className="bg-white rounded-4 shadow-lg w-100 overflow-hidden"
        style={{ maxWidth: "450px" }}
      >
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light">
          <h5 className="fw-bold mb-0 text-dark">Programar Agenda</h5>
          <button onClick={onClose} className="btn btn-link text-muted p-0">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="d-flex bg-light p-1 rounded-3 mb-4 border">
            <button
              type="button"
              onClick={() => {
                setIsBlocking(false);
                setError("");
              }}
              className={`btn btn-sm flex-grow-1 py-2 rounded-2 border-0 d-flex align-items-center justify-content-center gap-2 transition-all ${!isBlocking ? "bg-white shadow-sm fw-bold text-primary" : "text-muted"}`}
            >
              <Calendar size={16} /> Cita Cliente
            </button>
            <button
              type="button"
              onClick={() => {
                setIsBlocking(true);
                setError("");
              }}
              className={`btn btn-sm flex-grow-1 py-2 rounded-2 border-0 d-flex align-items-center justify-content-center gap-2 transition-all ${isBlocking ? "bg-white shadow-sm fw-bold text-dark" : "text-muted"}`}
            >
              <Lock size={16} /> Bloquear Horario
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 border-0 bg-danger bg-opacity-10 text-danger mb-3">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label small fw-bold text-muted mb-1">
                  FECHA
                </label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light border-0">
                    <Calendar size={14} />
                  </span>
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
              </div>
              <div className="col-6">
                <label className="form-label small fw-bold text-muted mb-1">
                  HORA
                </label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light border-0">
                    <Clock size={14} />
                  </span>
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
            </div>

            {!isBlocking ? (
              <>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted mb-1">
                    CLIENTE
                  </label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light border-0">
                      <User size={14} />
                    </span>
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
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted mb-1">
                    SERVICIO
                  </label>
                  <select
                    className="form-select form-select-sm bg-light border-0"
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
              </>
            ) : (
              <div className="mb-4 p-3 rounded-3 border border-dashed text-center bg-light">
                <Lock size={24} className="text-muted mb-2 opacity-50" />
                <p className="small text-muted mb-0 px-2">
                  El espacio seleccionado quedará marcado como{" "}
                  <strong>no disponible</strong> en tu agenda semanal y diaria.
                </p>
              </div>
            )}

            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-light flex-grow-1 py-2 fw-semibold text-muted border-0"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`btn flex-grow-1 py-2 fw-bold shadow-sm ${isBlocking ? "btn-dark" : "btn-primary"}`}
              >
                {isBlocking ? "Bloquear Hora" : "Confirmar Cita"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoTurnoModal;
