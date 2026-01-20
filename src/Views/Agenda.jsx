import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  MessageSquare,
  Trash2,
  Check,
} from "lucide-react";
import { db } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const Agenda = ({ turnos, horarios }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0],
  );

  const cambiarFecha = (dias) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaSeleccionada(nuevaFecha.toISOString().split("T")[0]);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este turno?")) {
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

  const horas = [];
  for (let i = horarios.inicio; i <= horarios.fin; i++) {
    horas.push(`${i.toString().padStart(2, "0")}:00`);
  }

  return (
    <div className="animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Agenda Diaria</h2>
          <p className="text-muted mb-0">
            Gestiona tus citas y horarios bloqueados
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

            return (
              <div
                key={hora}
                className={`list-group-item p-3 ${turno?.estado === "Bloqueado" ? "bg-light opacity-75" : ""}`}
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
                    {turno ? (
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6
                            className={`mb-0 fw-bold ${turno.estado === "Completado" ? "text-decoration-line-through text-muted" : "text-dark"}`}
                          >
                            {turno.cliente}
                          </h6>
                          <small className="text-muted d-block">
                            {turno.servicio}
                          </small>
                        </div>

                        <div className="d-flex gap-2">
                          {turno.estado !== "Bloqueado" && (
                            <>
                              <button
                                className={`btn btn-sm rounded-3 border-0 ${turno.estado === "Completado" ? "btn-success" : "btn-light text-muted"}`}
                                onClick={() =>
                                  handleCompletar(turno.id, turno.estado)
                                }
                              >
                                <Check size={16} />
                              </button>
                              <button className="btn btn-sm btn-light text-primary rounded-3 border-0">
                                <MessageSquare size={16} />
                              </button>
                            </>
                          )}
                          <button
                            className="btn btn-sm btn-light text-danger rounded-3 border-0"
                            onClick={() => handleEliminar(turno.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted small italic">
                        Disponible
                      </span>
                    )}
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
