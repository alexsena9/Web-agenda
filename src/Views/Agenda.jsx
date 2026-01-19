import React from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

const Agenda = () => {
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

  return (
    <div className="view-animate">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Calendario Semanal</h2>
          <p className="text-muted">Haz clic en un espacio para agendar.</p>
        </div>
        <div className="btn-group bg-white shadow-sm rounded-3">
          <button className="btn btn-outline-light text-dark border-end">
            <ChevronLeft size={18} />
          </button>
          <button className="btn btn-outline-light text-dark fw-bold px-4">
            Mayo 19 - 25
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
            <thead className="bg-light">
              <tr>
                <th
                  className="text-center p-3 border-0"
                  style={{ width: "80px" }}
                >
                  <Clock size={18} className="text-muted" />
                </th>
                {dias.map((dia) => (
                  <th key={dia} className="text-center p-3 border-0">
                    <span className="fw-bold d-block">{dia}</span>
                    <small className="text-muted fw-normal">20 de Mayo</small>
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
                  {dias.map((dia) => (
                    <td
                      key={`${dia}-${hora}`}
                      className="calendar-slot p-1"
                      style={{ height: "90px" }}
                    >
                      {dia === "Martes" && hora === "11:00" && (
                        <div className="bg-primary-subtle text-primary p-2 rounded-3 h-100 border-start border-primary border-4 shadow-sm">
                          <p className="small fw-bold mb-0">Reunión Equipo</p>
                          <small style={{ fontSize: "11px" }}>Zoom</small>
                        </div>
                      )}
                    </td>
                  ))}
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
