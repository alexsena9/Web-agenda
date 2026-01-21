import React, { useState } from "react";
import { X, User, Phone, Scissors, Check, AlertCircle } from "lucide-react";

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
    fecha: new Date().toISOString().split("T")[0],
    hora: "",
  });

  if (!isOpen) return null;

  const esBloqueado = (bloqueos || []).some(
    (b) => b.tipo === "dia" && b.valor === form.fecha,
  );

  const horas = () => {
    const inicio = parseInt(horarios?.inicio || "09");
    const fin = parseInt(horarios?.fin || "19");
    let res = [];
    for (let i = inicio; i < fin; i++) {
      const h = `${i.toString().padStart(2, "0")}:00`;
      const ocupado = turnos.some(
        (t) => t.fecha === form.fecha && t.hora === h,
      );
      const bloqueado = (bloqueos || []).some(
        (b) => b.tipo === "hora" && b.fecha === form.fecha && b.valor === h,
      );
      res.push({ h, ocupado, bloqueado });
    }
    return res;
  };

  const enviar = (e) => {
    e.preventDefault();
    if (!form.cliente || !form.telefono || !form.servicio || !form.hora) return;
    const s = servicios.find((x) => x.nombre === form.servicio);
    onAddTurno({ ...form, precio: s ? s.precio : 0 });
    setForm({
      cliente: "",
      telefono: "",
      servicio: "",
      fecha: new Date().toISOString().split("T")[0],
      hora: "",
    });
    onClose();
  };

  return (
    <div
      className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="card border-0 shadow-lg rounded-5 w-100 animate-fade-up mx-3"
        style={{ maxWidth: "450px" }}
      >
        <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Agendar Nuevo Turno</h5>
          <button
            onClick={onClose}
            className="btn btn-light rounded-circle p-2 border-0"
          >
            <X size={20} />
          </button>
        </div>
        <div className="card-body p-4 pt-0">
          <form onSubmit={enviar}>
            <div className="mb-3 text-start">
              <label className="small fw-bold text-muted mb-1">CLIENTE</label>
              <input
                type="text"
                required
                className="form-control bg-light border-0 py-2 shadow-none"
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
              />
            </div>
            <div className="mb-3 text-start">
              <label className="small fw-bold text-muted mb-1">WHATSAPP</label>
              <input
                type="tel"
                required
                className="form-control bg-light border-0 py-2 shadow-none"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </div>
            <div className="mb-3 text-start">
              <label className="small fw-bold text-muted mb-1">SERVICIO</label>
              <select
                required
                className="form-select bg-light border-0 py-2 shadow-none"
                value={form.servicio}
                onChange={(e) => setForm({ ...form, servicio: e.target.value })}
              >
                <option value="">Elegir servicio...</option>
                {servicios.map((s, i) => (
                  <option key={i} value={s.nombre}>
                    {s.nombre} - ${s.precio}
                  </option>
                ))}
              </select>
            </div>
            <div className="row g-2 mb-4 text-start">
              <div className="col-6">
                <label className="small fw-bold text-muted mb-1">FECHA</label>
                <input
                  type="date"
                  className="form-control bg-light border-0 py-2 shadow-none"
                  value={form.fecha}
                  onChange={(e) =>
                    setForm({ ...form, fecha: e.target.value, hora: "" })
                  }
                />
              </div>
              <div className="col-6">
                <label className="small fw-bold text-muted mb-1">HORA</label>
                <select
                  required
                  disabled={esBloqueado}
                  className="form-select bg-light border-0 py-2 shadow-none"
                  value={form.hora}
                  onChange={(e) => setForm({ ...form, hora: e.target.value })}
                >
                  <option value="">Hora...</option>
                  {horas().map((h) => (
                    <option
                      key={h.h}
                      value={h.h}
                      disabled={h.ocupado || h.bloqueado}
                    >
                      {h.h}{" "}
                      {h.bloqueado
                        ? "(Bloqueado)"
                        : h.ocupado
                          ? "(Ocupado)"
                          : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={esBloqueado}
              className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow-sm border-0"
            >
              Confirmar Turno
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default NuevoTurnoModal;
