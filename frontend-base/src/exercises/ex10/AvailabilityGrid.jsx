import { Card, ErrorMessage, Field, Input, Loading } from "../../components/ui/index.js";

const pad = (h) => `${String(h).padStart(2, "0")}:00`;

// slots: [{ hour, available }]   selectedHours: [10, 11]   onSelectHour(hour)
// La lógica de "bloques consecutivos" la decide la página; aquí solo se dibuja.
export default function AvailabilityGrid({ room, date, onDateChange, slots, selectedHours, onSelectHour, loading, error }) {
  return (
    <Card title={room ? `Disponibilidad: ${room.name}` : "Disponibilidad"}>
      <Field label="Fecha" className="mb-3 w-48">
        <Input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
      </Field>
      {!room && <p className="text-sm text-slate-500">Elija una sala para ver sus horarios.</p>}
      {loading && <Loading />}
      {error && <ErrorMessage message={error.message} status={error.status} />}
      {room && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
          {slots.map((s) => {
            const selected = selectedHours.includes(s.hour);
            return (
              <button
                key={s.hour}
                type="button"
                disabled={!s.available}
                onClick={() => onSelectHour(s.hour)}
                className={`rounded border px-2 py-2 text-sm ${
                  !s.available
                    ? "cursor-not-allowed border-slate-200 bg-slate-200 text-slate-400 line-through"
                    : selected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white hover:border-blue-400"
                }`}
              >
                {pad(s.hour)}
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
