import { useState } from "react";
import { Card, Tabs } from "../../components/ui/index.js";
import RoomFilters from "./RoomFilters.jsx";
import RoomList from "./RoomList.jsx";
import AvailabilityGrid from "./AvailabilityGrid.jsx";
import ReservationForm from "./ReservationForm.jsx";
import MyReservationsFilters from "./MyReservationsFilters.jsx";
import ReservationList from "./ReservationList.jsx";
import { SAMPLE_RESERVATIONS, SAMPLE_ROOMS, SAMPLE_SLOTS } from "./sample.js";

const VIEWS = [
  { id: "search", label: "Buscar sala" },
  { id: "reserve", label: "Reservar" },
  { id: "mine", label: "Mis reservas" },
];

// EJERCICIO 10 — Reserva de salas (integrador)
// Los componentes visuales ya están hechos: conéctelos con el backend.
// Además debe escribir el hook `useFetch` (src/hooks/useFetch.js) y usarlo en al menos dos vistas.
export default function RoomsPage() {
  const [view, setView] = useState("search");

  // ---- Vista 1: Buscar sala ----
  // TODO 1: GET /rooms con los filtros (useFetch o useEffect).
  const [rooms] = useState(SAMPLE_ROOMS);
  const buildings = [...new Set(rooms.map((r) => r.building))];
  const [filters, setFilters] = useState({ building: "", minCapacity: "", projector: false, whiteboard: false });

  // TODO 2: GET /rooms/:id/availability?date=YYYY-MM-DD cuando haya sala y fecha elegidas.
  const [room, setRoom] = useState(null);
  const [date, setDate] = useState("");
  const [slots] = useState(SAMPLE_SLOTS);
  const [selectedHours, setSelectedHours] = useState([]);

  // TODO 3: lógica de selección: solo bloques CONSECUTIVOS (máx. 3).
  //         De `selectedHours` salen `startHour` y `hours` del formulario de reserva.
  function handleSelectHour(hour) {
    setSelectedHours((h) => (h.includes(hour) ? h.filter((x) => x !== hour) : [...h, hour].sort((a, b) => a - b)));
  }

  // ---- Vista 2: Reservar ----
  // TODO 4: validaciones del cliente (campos requeridos, rango de horas) → clientErrors.
  // TODO 5: POST /rooms/:id/reservations. Al terminar: mostrar el código y recargar la disponibilidad.
  const [form, setForm] = useState({ studentCode: "", attendees: "" });
  const [clientErrors, setClientErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [reserveError, setReserveError] = useState(null); // { message, status } | null
  const [reserved, setReserved] = useState(null);
  async function handleReserve() {}

  // ---- Vista 3: Mis reservas ----
  // TODO 6: GET /students/:studentCode/reservations?status=...&upcoming=true (useFetch).
  // TODO 7: handleCancel → window.confirm + POST /reservations/:code/cancel con { studentCode } y recargar la lista.
  const [mine, setMine] = useState({ studentCode: "", status: "", upcoming: false });
  const [reservations] = useState(SAMPLE_RESERVATIONS);
  const [mineError, setMineError] = useState(null);
  async function handleCancel() {}

  const startHour = selectedHours[0] ?? "";
  const hours = selectedHours.length || "";

  return (
    <div className="space-y-4">
      <Tabs tabs={VIEWS} active={view} onChange={setView} />

      {view === "search" && (
        <div className="space-y-4">
          <Card title="Salas">
            <RoomFilters filters={filters} buildings={buildings} onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))} />
          </Card>
          <RoomList rooms={rooms} selectedId={room?.id} onSelect={setRoom} />
          <AvailabilityGrid
            room={room}
            date={date}
            onDateChange={setDate}
            slots={slots}
            selectedHours={selectedHours}
            onSelectHour={handleSelectHour}
          />
        </div>
      )}

      {view === "reserve" && (
        <ReservationForm
          room={room}
          values={{ ...form, date, startHour, hours }}
          onChange={(k, v) => (k === "date" ? setDate(v) : setForm((f) => ({ ...f, [k]: v })))}
          onSubmit={handleReserve}
          submitting={submitting}
          clientErrors={clientErrors}
          error={reserveError}
          success={reserved}
        />
      )}

      {view === "mine" && (
        <Card title="Mis reservas">
          <div className="space-y-4">
            <MyReservationsFilters
              {...mine}
              onChange={(k, v) => setMine((m) => ({ ...m, [k]: v }))}
              onSearch={() => {}}
            />
            <ReservationList reservations={reservations} onCancel={handleCancel} error={mineError} />
          </div>
        </Card>
      )}
    </div>
  );
}
