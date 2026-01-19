import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  CheckCircle,
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
    if (window.confirm("¿Estás seguro de que quieres eliminar este turno?")) {
      setTurnos(turnos.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="view-animate">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Calendario Semanal</h2>
          <p className="text-muted">Gestiona tus citas y disponibilidad.</p>
        </div>
        <div className="btn-group bg-white shadow-sm rounded-3">
          <button className="btn btn-outline-light text-dark border-end px-3">
            <ChevronLeft size={18} />
          </button>
          <button className="btn btn-outline-light text-dark fw-bold px-4">
            Esta Semana
          </button>
          <button className="btn btn-outline-light text-dark border-start px-3">
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
                  <Clock size={18} className="text-muted" />
                </th>
                {dias.map((dia) => (
                  <th key={dia} className="p-3 border-0">
                    <span className="fw-bold d-block">{dia}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horas.map((hora) => (
                <tr key={hora}>
                  <td className="text-center text-muted small fw-medium py-4 bg-light bg-opacity-50">
                    {hora}
                  </td>
                  {dias.map((dia) => {
                    const turnoEnSlot = turnos.find(
                      (t) =>
                        getDiaSemana(t.fecha) === dia &&
                        t.hora.startsWith(hora.split(":")[0]),
                    );

                    return (
                      <td
                        key={`${dia}-${hora}`}
                        className="calendar-slot p-1"
                        style={{ height: "110px", verticalAlign: "top" }}
                      >
                        {turnoEnSlot && (
                          <div className="bg-primary-subtle text-primary p-2 rounded-3 h-100 border-start border-primary border-4 shadow-sm position-relative d-flex flex-column justify-content-between">
                            <div>
                              <div className="d-flex justify-content-between align-items-start">
                                <p
                                  className="small fw-bold mb-0 text-truncate"
                                  style={{ maxWidth: "80%" }}
                                >
                                  {turnoEnSlot.cliente}
                                </p>
                                <button
                                  onClick={() => eliminarTurno(turnoEnSlot.id)}
                                  className="btn btn-link text-danger p-0 border-0"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <p
                                className="mb-0 text-dark opacity-75"
                                style={{ fontSize: "10px" }}
                              >
                                {turnoEnSlot.servicio}
                              </p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-1">
                              <span
                                className="badge bg-primary text-white"
                                style={{ fontSize: "9px" }}
                              >
                                {turnoEnSlot.hora} hs
                              </span>
                              <CheckCircle
                                size={14}
                                className="text-success opacity-50"
                              />
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
