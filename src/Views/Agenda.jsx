import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  CheckCircle,
  Circle,
} from "lucide-react";

const Agenda = ({ turnos, setTurnos }) => {
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const horas = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const getDiaSemana = (fechaStr) => {
    const fecha = new Date(fechaStr + "T00:00:00");
    const diasNombres = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return diasNombres[fecha.getDay()];
  };

  const eliminarTurno = (id) => {
    if (window.confirm("¿Eliminar este turno?")) {
      setTurnos(turnos.filter((t) => t.id !== id));
    }
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

  return (
    <div className="view-animate text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Calendario Semanal</h2>
          <p className="text-muted">
            Haz clic en el círculo para marcar turnos como realizados.
          </p>
        </div>
        <div className="btn-group bg-white shadow-sm rounded-3">
          <button className="btn btn-outline-light text-dark border-end">
            <ChevronLeft size={18} />
          </button>
          <button className="btn btn-outline-light text-dark fw-bold px-4">
            Enero 2026
          </button>
          <button className="btn btn-outline-light text-dark border-start">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table
            className="table table-bordered mb-0"
            style={{ minWidth: "900px" }}
          >
            <thead className="bg-light text-center">
              <tr>
                <th className="p-3 border-0" style={{ width: "80px" }}>
                  <Clock size={18} />
                </th>
                {dias.map((dia) => (
                  <th key={dia} className="p-3 border-0 fw-bold">
                    {dia}
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
                  {dias.map((dia) => {
                    const turno = turnos.find(
                      (t) =>
                        getDiaSemana(t.fecha) === dia &&
                        t.hora.startsWith(hora.split(":")[0]),
                    );

                    return (
                      <td
                        key={`${dia}-${hora}`}
                        className="p-1"
                        style={{ height: "110px" }}
                      >
                        {turno && (
                          <div
                            className={`p-2 rounded-3 h-100 border-start border-4 shadow-sm transition-all ${
                              turno.estado === "Completado"
                                ? "bg-success bg-opacity-10 border-success opacity-75"
                                : "bg-primary bg-opacity-10 border-primary"
                            }`}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <p
                                className={`small fw-bold mb-0 text-truncate ${turno.estado === "Completado" ? "text-decoration-line-through" : ""}`}
                              >
                                {turno.cliente}
                              </p>
                              <button
                                onClick={() => eliminarTurno(turno.id)}
                                className="btn btn-link text-danger p-0 border-0"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <p
                              className="small mb-1 text-muted"
                              style={{ fontSize: "10px" }}
                            >
                              {turno.servicio}
                            </p>

                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <span
                                className={`badge ${turno.estado === "Completado" ? "bg-success" : "bg-primary"} text-white`}
                                style={{ fontSize: "9px" }}
                              >
                                {turno.hora} hs
                              </span>
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
                                  <Circle size={16} className="text-primary" />
                                )}
                              </button>
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
