import { Badge, Button, ErrorMessage, Loading, Table } from "../../components/ui/index.js";

// onCancel(reservation): la página pide confirmación (window.confirm) y llama al backend.
export default function ReservationList({ reservations, onCancel, loading, error }) {
  if (loading) return <Loading />;
  return (
    <div className="space-y-3">
      {error && <ErrorMessage message={error.message} status={error.status} />}
      <Table
        columns={[
          { key: "code", header: "Código" },
          { key: "roomId", header: "Sala", render: (r) => `#${r.roomId}` },
          { key: "date", header: "Fecha" },
          { key: "hour", header: "Horario", render: (r) => `${r.startHour}:00 – ${r.startHour + r.hours}:00` },
          { key: "attendees", header: "Personas" },
          {
            key: "status",
            header: "Estado",
            render: (r) => <Badge tone={r.status === "ACTIVE" ? "green" : "gray"}>{r.status}</Badge>,
          },
          {
            key: "actions",
            header: "",
            render: (r) =>
              r.status === "ACTIVE" && (
                <Button variant="danger" onClick={() => onCancel(r)}>
                  Cancelar
                </Button>
              ),
          },
        ]}
        rows={reservations}
        emptyText="No hay reservas"
      />
    </div>
  );
}
