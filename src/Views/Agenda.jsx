import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  CheckCircle,
  Circle,
  MessageSquare,
  Info,
} from "lucide-react";

const Agenda = ({ turnos, setTurnos, horarios }) => {
  const [fechaReferencia, setFechaReferencia] = useState(new Date());

  const generarHoras = () => {
    let lista = [];
    for (let i = horarios.inicio; i <= horarios.fin; i++) {
      lista.push(`${i.toString().padStart(2, "0")}:00`);
    }
    return lista;
  };

  const enviarRecordatorio = (turno) => {
    const mensaje = `Hola ${turno.cliente}, te recuerdo tu turno para *${turno.servicio}* el día ${turno.fecha} a las ${turno.hora} hs. ¡Te esperamos!`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  const horas = generarHoras();
  const getLunes = (f) => {
    const d = new Date(f);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };
  const lunesActual = getLunes(fechaReferencia);
  const semana = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(lunesActual);
    d.setDate(lunesActual.getDate() + i);
    return d;
  });
  const formatearFecha = (date) => date.toISOString().split("T")[0];

  return (
    <div className="view-animate text-start">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-0">Agenda Semanal</h2>
          <p className="text-muted mb-0">
            Gestiona y recuerda citas a tus clientes.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={() => setFechaReferencia(new Date())}
            className="btn btn-white border shadow-sm"
          >
            Hoy
          </button>
          <div className="btn-group bg-white shadow-sm rounded-3">
            <button
              onClick={() => {
                const d = new Date(fechaReferencia);
                d.setDate(d.getDate() - 7);
                setFechaReferencia(d);
              }}
              className="btn btn-link text-dark border-end"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => {
                const d = new Date(fechaReferencia);
                d.setDate(d.getDate() + 7);
                setFechaReferencia(d);
              }}
              className="btn btn-link text-dark"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table
            className="table table-bordered mb-0"
            style={{ minWidth: "1000px" }}
          >
            <thead className="bg-light text-center">
              <tr>
                <th className="p-3 border-0" style={{ width: "80px" }}>
                  <Clock size={18} />
                </th>
                {semana.map((dia) => (
                  <th key={dia} className="p-3 border-0">
                    <span className="text-uppercase small text-muted d-block fw-bold">
                      {dia.toLocaleDateString("es-ES", { weekday: "short" })}
                    </span>
                    <span className="fs-5">{dia.getDate()}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horas.map((hora) => (
                <tr key={hora}>
                  <td className="text-center text-muted small py-4 bg-light bg-opacity-50">
                    {hora}
                  </td>
                  {semana.map((dia) => {
                    const fechaKey = formatearFecha(dia);
                    const turno = turnos.find(
                      (t) =>
                        t.fecha === fechaKey &&
                        t.hora.split(":")[0] === hora.split(":")[0],
                    );
                    return (
                      <td
                        key={`${fechaKey}-${hora}`}
                        className="p-1"
                        style={{ height: "130px", width: "18%" }}
                      >
                        {turno && (
                          <div
                            className={`p-2 rounded-3 h-100 border-start border-4 shadow-sm d-flex flex-column ${turno.estado === "Completado" ? "bg-success bg-opacity-10 border-success" : "bg-primary bg-opacity-10 border-primary"}`}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div
                                className="text-truncate"
                                style={{ maxWidth: "80%" }}
                              >
                                <p
                                  className={`small fw-bold mb-0 ${turno.estado === "Completado" ? "text-decoration-line-through text-muted" : ""}`}
                                >
                                  {turno.cliente}
                                </p>
                                <span
                                  className="text-muted"
                                  style={{ fontSize: "9px" }}
                                >
                                  {turno.servicio}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  setTurnos(
                                    turnos.filter((t) => t.id !== turno.id),
                                  )
                                }
                                className="btn btn-link text-danger p-0 border-0"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>

                            {turno.notas && (
                              <div
                                className="mt-1 text-muted d-flex align-items-center gap-1"
                                style={{ fontSize: "9px" }}
                              >
                                <Info size={10} />{" "}
                                <span className="text-truncate">
                                  {turno.notas}
                                </span>
                              </div>
                            )}

                            <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                              <div className="d-flex gap-1">
                                <button
                                  onClick={() => toggleCompletado(turno.id)}
                                  className="btn btn-link p-0 border-0"
                                >
                                  {turno.estado === "Completado" ? (
                                    <CheckCircle
                                      size={16}
                                      className="text-success"
                                    />
                                  ) : (
                                    <Circle
                                      size={16}
                                      className="text-primary opacity-50"
                                    />
                                  )}
                                </button>
                                <button
                                  onClick={() => enviarRecordatorio(turno)}
                                  className="btn btn-link p-0 border-0 text-success"
                                  title="Enviar recordatorio"
                                >
                                  <MessageSquare size={16} />
                                </button>
                              </div>
                              <span
                                className="badge bg-white text-dark border"
                                style={{ fontSize: "9px" }}
                              >
                                {turno.hora} hs
                              </span>
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
