import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

const NuevoTurnoModal = ({
  isOpen,
  onClose,
  servicios,
  onAddTurno,
  turnos,
  horarios,
  bloqueos,
}) => {
  const [form, setForm] = useState({
    cliente: "",
    telefono: "",
    servicio: "",
    fecha: new Date().toLocaleDateString("en-CA"),
    hora: "",
  });

  if (!isOpen) return null;

  const diaBloqueado = bloqueos?.some(
    (b) => b.tipo === "dia" && b.valor === form.fecha,
  );

  const getHorasDisponibles = () => {
    const inicio = parseInt(horarios?.inicio?.split(":")[0] || 9);
    const fin = parseInt(horarios?.fin?.split(":")[0] || 19);
    let list = [];
    for (let i = inicio; i < fin; i++) {
      const hStr = `${i.toString().padStart(2, "0")}:00`;
      const ocupado = turnos.some(
        (t) => t.fecha === form.fecha && t.hora === hStr,
      );
      const bloqueado = bloqueos?.some(
        (b) => b.tipo === "hora" && b.fecha === form.fecha && b.valor === hStr,
      );
      list.push({
        hora: hStr,
        disabled: ocupado || bloqueado,
        motivo: bloqueado ? "Bloqueado" : "Ocupado",
      });
    }
    return list;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const srv = servicios.find((s) => s.nombre === form.servicio);
    onAddTurno({ ...form, precio: srv?.precio || 0, estado: "Pendiente" });
    onClose();
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-5 p-4 shadow-lg">
          <h4 className="fw-bold mb-4">Nuevo Turno</h4>
          <form onSubmit={handleSubmit} className="text-start">
            {diaBloqueado && (
              <div className="alert alert-danger rounded-4 py-2 small d-flex align-items-center gap-2">
                <AlertCircle size={16} /> Este día no se aceptan turnos.
              </div>
            )}
            <div className="mb-3">
              <label className="small fw-bold text-muted">CLIENTE</label>
              <input
                required
                className="form-control border-0 bg-light py-2"
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="small fw-bold text-muted">TELÉFONO</label>
              <input
                required
                className="form-control border-0 bg-light py-2"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="small fw-bold text-muted">SERVICIO</label>
              <select
                required
                className="form-select border-0 bg-light py-2"
                value={form.servicio}
                onChange={(e) => setForm({ ...form, servicio: e.target.value })}
              >
                <option value="">Selecciona servicio...</option>
                {servicios.map((s, i) => (
                  <option key={i} value={s.nombre}>
                    {s.nombre} (${s.precio})
                  </option>
                ))}
              </select>
            </div>
            <div className="row g-2 mb-4">
              <div className="col-6">
                <label className="small fw-bold text-muted">FECHA</label>
                <input
                  required
                  type="date"
                  className="form-control border-0 bg-light py-2"
                  value={form.fecha}
                  onChange={(e) =>
                    setForm({ ...form, fecha: e.target.value, hora: "" })
                  }
                />
              </div>
              <div className="col-6">
                <label className="small fw-bold text-muted">HORA</label>
                <select
                  required
                  disabled={diaBloqueado}
                  className="form-select border-0 bg-light py-2"
                  value={form.hora}
                  onChange={(e) => setForm({ ...form, hora: e.target.value })}
                >
                  <option value="">Hora...</option>
                  {getHorasDisponibles().map((h) => (
                    <option key={h.hora} value={h.hora} disabled={h.disabled}>
                      {h.hora} {h.disabled ? `(${h.motivo})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-light flex-grow-1 rounded-4 py-3 fw-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={diaBloqueado}
                className="btn btn-primary flex-grow-1 rounded-4 py-3 fw-bold"
              >
                Agendar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoTurnoModal;
