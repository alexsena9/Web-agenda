import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  CheckCircle,
  Circle,
  List,
  Calendar as CalendarIcon,
  Lock,
} from "lucide-react";
import { db } from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

const Agenda = ({ turnos, horarios }) => {
  const [fechaReferencia, setFechaReferencia] = useState(new Date());
  const [modoVista, setModoVista] = useState("semana");

  const wsLogo =
    "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";

  const generarHoras = () => {
    let lista = [];
    for (let i = horarios.inicio; i <= horarios.fin; i++) {
      lista.push(`${i.toString().padStart(2, "0")}:00`);
    }
    return lista;
  };

  const enviarWhatsApp = (turno) => {
    const mensaje = `Hola ${turno.cliente}, te recuerdo tu cita de *${turno.servicio}* hoy a las ${turno.hora} hs. ¡Te esperamos!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  const toggleCompletado = async (id, estadoActual) => {
    try {
      const turnoRef = doc(db, "turnos", id);
      await updateDoc(turnoRef, {
        estado: estadoActual === "Completado" ? "Pendiente" : "Completado",
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const eliminarTurno = async (id) => {
    if (window.confirm("¿Deseas eliminar este registro (Cita o Bloqueo)?")) {
      try {
        await deleteDoc(doc(db, "turnos", id));
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
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
          <p className="text-muted mb-0 small">
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
          <div className="btn-group shadow-sm bg-white rounded-3 border overflow-hidden">
            <button
              onClick={() => setModoVista("dia")}
              className={`btn btn-sm px-3 border-0 ${modoVista === "dia" ? "btn-primary text-white" : "bg-white text-muted"}`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setModoVista("semana")}
              className={`btn btn-sm px-3 border-0 ${modoVista === "semana" ? "btn-primary text-white" : "bg-white text-muted"}`}
            >
              <CalendarIcon size={18} />
            </button>
          </div>

          <div className="btn-group bg-white shadow-sm rounded-3 border overflow-hidden">
            <button
              onClick={() => cambiarFecha(modoVista === "semana" ? -7 : -1)}
              className="btn btn-white border-end"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setFechaReferencia(new Date())}
              className="btn btn-white fw-bold small border-end px-3"
            >
              Hoy
            </button>
            <button
              onClick={() => cambiarFecha(modoVista === "semana" ? 7 : 1)}
              className="btn btn-white"
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
              {turnosDelDia.map((turno) => {
                const isBloqueo = turno.estado === "Bloqueado";
                return (
                  <div
                    key={turno.id}
                    className={`card border-0 border-start border-4 shadow-sm p-3 rounded-4 bg-white d-flex flex-row align-items-center justify-content-between ${isBloqueo ? "border-secondary" : turno.estado === "Completado" ? "border-success opacity-75" : "border-primary"}`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className={`bg-light p-2 rounded-3 text-center fw-bold ${isBloqueo ? "text-muted" : "text-primary"}`}
                        style={{ minWidth: "65px" }}
                      >
                        {turno.hora}
                      </div>
                      <div>
                        <h6
                          className={`fw-bold mb-0 ${turno.estado === "Completado" ? "text-decoration-line-through text-muted" : ""}`}
                        >
                          {isBloqueo && (
                            <Lock size={14} className="me-2 text-muted" />
                          )}
                          {turno.cliente}
                        </h6>
                        <span className="text-muted small">
                          {isBloqueo ? "Horario no disponible" : turno.servicio}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex gap-3 align-items-center">
                      {!isBloqueo && (
                        <>
                          <img
                            src={wsLogo}
                            alt="WhatsApp"
                            onClick={() => enviarWhatsApp(turno)}
                            style={{
                              width: "24px",
                              height: "24px",
                              cursor: "pointer",
                            }}
                            className="hover-scale"
                          />
                          <button
                            onClick={() =>
                              toggleCompletado(turno.id, turno.estado)
                            }
                            className="btn btn-link p-0 text-primary border-0"
                          >
                            {turno.estado === "Completado" ? (
                              <CheckCircle size={24} className="text-success" />
                            ) : (
                              <Circle size={24} className="opacity-25" />
                            )}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => eliminarTurno(turno.id)}
                        className="btn btn-link p-0 text-danger border-0 opacity-50"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-dashed">
              <p className="text-muted mb-0">No hay registros para este día.</p>
            </div>
          )}
        </div>
      )}

      {modoVista === "semana" && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden animate-fade-up">
          <div className="table-responsive" style={{ width: "100%" }}>
            <table
              className="table table-bordered mb-0"
              style={{ minWidth: "1000px", tableLayout: "fixed" }}
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
                      const isBloqueo = turno?.estado === "Bloqueado";

                      return (
                        <td
                          key={`${fechaKey}-${hora}`}
                          className="p-1"
                          style={{ height: "140px", width: "18%" }}
                        >
                          {turno && (
                            <div
                              className={`p-2 rounded-3 h-100 border-start border-4 shadow-sm d-flex flex-column ${isBloqueo ? "bg-secondary bg-opacity-10 border-secondary" : turno.estado === "Completado" ? "bg-success bg-opacity-10 border-success" : "bg-primary bg-opacity-10 border-primary"}`}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <p
                                  className={`small fw-bold mb-0 text-truncate ${isBloqueo ? "text-muted" : turno.estado === "Completado" ? "text-decoration-line-through text-muted" : ""}`}
                                >
                                  {isBloqueo && (
                                    <Lock size={10} className="me-1" />
                                  )}
                                  {turno.cliente}
                                </p>
                                <button
                                  onClick={() => eliminarTurno(turno.id)}
                                  className="btn btn-link text-danger p-0 border-0"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <span
                                className="text-muted d-block text-truncate mb-1"
                                style={{ fontSize: "9px" }}
                              >
                                {isBloqueo
                                  ? "Personal / Descanso"
                                  : turno.servicio}
                              </span>

                              {!isBloqueo && (
                                <div className="mt-auto d-flex justify-content-between align-items-center">
                                  <div className="d-flex gap-2 align-items-center">
                                    <button
                                      onClick={() =>
                                        toggleCompletado(turno.id, turno.estado)
                                      }
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
                                    <img
                                      src={wsLogo}
                                      alt="WS"
                                      onClick={() => enviarWhatsApp(turno)}
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        cursor: "pointer",
                                      }}
                                      className="hover-scale"
                                    />
                                  </div>
                                  <span
                                    className="badge bg-white text-dark border fw-normal"
                                    style={{ fontSize: "9px" }}
                                  >
                                    {turno.hora}
                                  </span>
                                </div>
                              )}
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
