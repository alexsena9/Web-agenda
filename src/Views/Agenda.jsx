import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquare,
  Trash2,
  Check,
  Lock,
  Unlock,
} from "lucide-react";
import { db } from "../firebase";
import {
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  collection,
} from "firebase/firestore";

const Agenda = ({ turnos, horarios }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = React.useState(
    new Date().toISOString().split("T")[0],
  );

  const cambiarFecha = (dias) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaSeleccionada(nuevaFecha.toISOString().split("T")[0]);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      try {
        await deleteDoc(doc(db, "turnos", id));
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleCompletar = async (id, estadoActual) => {
    const nuevoEstado =
      estadoActual === "Completado" ? "Pendiente" : "Completado";
    try {
      await updateDoc(doc(db, "turnos", id), { estado: nuevoEstado });
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const contactarWhatsApp = (nombre, fecha, hora) => {
    const mensaje = `Hola ${nombre}, te escribo de la barbería para recordarte tu turno el día ${fecha} a las ${hora}.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  const toggleBloqueo = async (hora, turnoExistente) => {
    if (turnoExistente) {
      if (turnoExistente.estado === "Bloqueado") {
        await deleteDoc(doc(db, "turnos", turnoExistente.id));
      }
    } else {
      try {
        await addDoc(collection(db, "turnos"), {
          cliente: "HORARIO BLOQUEADO",
          servicio: "Descanso / Personal",
          fecha: fechaSeleccionada,
          hora: hora,
          estado: "Bloqueado",
        });
      } catch (error) {
        console.error("Error al bloquear:", error);
      }
    }
  };

  const horas = [];
  for (let i = horarios.inicio; i <= horarios.fin; i++) {
    horas.push(`${i.toString().padStart(2, "0")}:00`);
  }

  return (
    <div className="animate-fade-in text-start">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Agenda Diaria</h2>
          <p className="text-muted mb-0">
            Gestiona tus citas y bloqueos rápidos
          </p>
        </div>
        <div className="d-flex align-items-center bg-white border rounded-3 p-1 shadow-sm">
          <button
            onClick={() => cambiarFecha(-1)}
            className="btn btn-link text-dark p-2"
          >
            <ChevronLeft size={20} />
          </button>
          <input
            type="date"
            className="form-control border-0 fw-bold text-center"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            style={{ width: "160px" }}
          />
          <button
            onClick={() => cambiarFecha(1)}
            className="btn btn-link text-dark p-2"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="list-group list-group-flush">
          {horas.map((hora) => {
            const turno = turnos.find(
              (t) => t.fecha === fechaSeleccionada && t.hora === hora,
            );
            const esBloqueo = turno?.estado === "Bloqueado";

            return (
              <div
                key={hora}
                className={`list-group-item p-3 transition-all ${esBloqueo ? "bg-danger bg-opacity-10" : ""}`}
              >
                <div className="row align-items-center">
                  <div className="col-auto">
                    <div
                      className="fw-bold text-primary d-flex align-items-center gap-2"
                      style={{ minWidth: "70px" }}
                    >
                      <Clock size={16} className="text-muted" />
                      {hora}
                    </div>
                  </div>

                  <div className="col">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        {turno ? (
                          <>
                            <h6
                              className={`mb-0 fw-bold ${turno.estado === "Completado" ? "text-decoration-line-through text-muted" : esBloqueo ? "text-danger" : "text-dark"}`}
                            >
                              {turno.cliente}
                            </h6>
                            <small className="text-muted d-block">
                              {turno.servicio}{" "}
                              {turno.precio ? `($${turno.precio})` : ""}
                            </small>
                          </>
                        ) : (
                          <span className="text-muted small fst-italic">
                            Disponible para citas
                          </span>
                        )}
                      </div>

                      <div className="d-flex gap-2">
                        {turno && !esBloqueo && (
                          <>
                            <button
                              title="Marcar como completado"
                              className={`btn btn-sm rounded-3 border-0 ${turno.estado === "Completado" ? "btn-success" : "btn-light text-muted"}`}
                              onClick={() =>
                                handleCompletar(turno.id, turno.estado)
                              }
                            >
                              <Check size={16} />
                            </button>

                            <button
                              title="Enviar recordatorio"
                              onClick={() =>
                                contactarWhatsApp(
                                  turno.cliente,
                                  turno.fecha,
                                  turno.hora,
                                )
                              }
                              className="btn btn-sm btn-light text-primary rounded-3 border-0"
                            >
                              <MessageSquare size={16} />
                            </button>
                          </>
                        )}

                        <button
                          className={`btn btn-sm rounded-3 border-0 ${esBloqueo ? "btn-danger shadow-sm" : "btn-light text-muted"}`}
                          onClick={() => toggleBloqueo(hora, turno)}
                          title={
                            esBloqueo
                              ? "Desbloquear horario"
                              : "Bloquear horario"
                          }
                        >
                          {esBloqueo ? (
                            <Lock size={16} className="text-white" />
                          ) : (
                            <Unlock size={16} />
                          )}
                        </button>

                        {turno && (
                          <button
                            className="btn btn-sm btn-light text-danger rounded-3 border-0"
                            onClick={() => handleEliminar(turno.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
