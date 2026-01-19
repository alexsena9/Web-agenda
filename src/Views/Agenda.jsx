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
  List,
  Calendar as CalendarIcon,
} from "lucide-react";

const Agenda = ({ turnos, setTurnos, horarios }) => {
  const [fechaReferencia, setFechaReferencia] = useState(new Date());
  const [modoVista, setModoVista] = useState("semana"); // 'semana' o 'dia'

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

  const toggleCompletado = (id) => {
    setTurnos(
      turnos.map((t) =>
        t.id === id
          ? {
              ...t,
              estado: t.estado === "Completado" ? "Pendiente" : "Completado",
            }
          : t,
      ),
    );
  };

  const horas = generarHoras();
  const formatearFecha = (date) => date.toISOString().split("T")[0];

  const cambiarFecha = (offset) => {
    const d = new Date(fechaReferencia);
    d.setDate(d.getDate() + offset);
    setFechaReferencia(d);
  };

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

  const turnosDelDia = turnos
    .filter((t) => t.fecha === formatearFecha(fechaReferencia))
    .sort((a, b) => a.hora.localeCompare(b.hora));

  return (
    <div className="view-animate text-start">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-0">Agenda</h2>
          <p className="text-muted mb-0">
            {modoVista === "semana"
              ? `Semana del ${semana[0].toLocaleDateString()}`
              : fechaReferencia.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
          </p>
        </div>

        <div className="d-flex gap-2">
          <div className="btn-group shadow-sm border rounded-3 bg-white">
            <button
              onClick={() => setModoVista("dia")}
              className={`btn btn-sm ${modoVista === "dia" ? "btn-primary" : "btn-white border-0 text-muted"}`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setModoVista("semana")}
              className={`btn btn-sm ${modoVista === "semana" ? "btn-primary" : "btn-white border-0 text-muted"}`}
            >
              <CalendarIcon size={18} />
            </button>
          </div>

          <div className="btn-group bg-white shadow-sm rounded-3 border">
            <button
              onClick={() => cambiarFecha(modoVista === "semana" ? -7 : -1)}
              className="btn btn-link text-dark border-end"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setFechaReferencia(new Date())}
              className="btn btn-link text-dark text-decoration-none fw-bold small border-end px-3"
            >
              Hoy
            </button>
            <button
              onClick={() => cambiarFecha(modoVista === "semana" ? 7 : 1)}
              className="btn btn-link text-dark"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {modoVista === "dia" && (
        <div className="animate-fade-up">
          {turnosDelDia.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {turnosDelDia.map((turno) => (
                <div
                  key={turno.id}
                  className={`card border-0 border-start border-4 shadow-sm p-3 rounded-4 ${turno.estado === "Completado" ? "border-success bg-success bg-opacity-10 opacity-75" : "border-primary bg-white"}`}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="bg-light p-2 rounded-3 text-center"
                        style={{ minWidth: "60px" }}
                      >
                        <span className="fw-bold d-block">{turno.hora}</span>
                        <small
                          className="text-muted"
                          style={{ fontSize: "10px" }}
                        >
                          HORA
                        </small>
                      </div>
                      <div>
                        <h6
                          className={`fw-bold mb-0 ${turno.estado === "Completado" ? "text-decoration-line-through text-muted" : ""}`}
                        >
                          {turno.cliente}
                        </h6>
                        <span
                          className="badge bg-primary bg-opacity-10 text-primary border-0 fw-medium"
                          style={{ fontSize: "11px" }}
                        >
                          {turno.servicio}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => enviarRecordatorio(turno)}
                        className="btn btn-light text-success rounded-circle p-2 shadow-sm"
                        title="Contactar"
                      >
                        <MessageSquare size={18} />
                      </button>
                      <button
                        onClick={() => toggleCompletado(turno.id)}
                        className="btn btn-light text-primary rounded-circle p-2 shadow-sm"
                      >
                        {turno.estado === "Completado" ? (
                          <CheckCircle size={18} className="text-success" />
                        ) : (
                          <Circle size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  {turno.notes && (
                    <div className="mt-2 p-2 bg-light rounded-3 d-flex align-items-start gap-2">
                      <Info size={14} className="mt-1 text-muted" />
                      <p className="mb-0 small text-muted">{turno.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-dashed">
              <CalendarIcon size={48} className="text-muted mb-3 opacity-25" />
              <p className="text-muted">No hay turnos para este día.</p>
            </div>
          )}
        </div>
      )}

      {modoVista === "semana" && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden animate-fade-up">
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
                          style={{ height: "140px", width: "18%" }}
                        >
                          {turno && (
                            <div
                              className={`p-2 rounded-3 h-100 border-start border-4 shadow-sm d-flex flex-column ${turno.estado === "Completado" ? "bg-success bg-opacity-10 border-success" : "bg-primary bg-opacity-10 border-primary"}`}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <div
                                  className="text-truncate"
                                  style={{ maxWidth: "80%" }}
                                >
                                  <p
                                    className={`small fw-bold mb-0 ${turno.estado === "Completado" ? "text-decoration-line-through" : ""}`}
                                  >
                                    {turno.cliente}
                                  </p>
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
                              <span
                                className="text-muted d-block text-truncate mb-1"
                                style={{ fontSize: "9px" }}
                              >
                                {turno.servicio}
                              </span>

                              <div className="mt-auto d-flex justify-content-between align-items-center">
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
                                    className="btn btn-sm btn-outline-success border-0 rounded-3 p-2"
                                    title="WhatsApp"
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
      )}
    </div>
  );
};

export default Agenda;
