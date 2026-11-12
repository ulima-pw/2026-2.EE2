import { Badge, Button, Card, ErrorMessage, Loading } from "../../components/ui/index.js";

export default function RoomList({ rooms, selectedId, onSelect, loading, error }) {
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} status={error.status} />;
  if (rooms.length === 0) return <p className="text-sm text-slate-500">No hay salas con esos filtros.</p>;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((r) => (
        <Card key={r.id} className={selectedId === r.id ? "ring-2 ring-blue-500" : ""}>
          <h3 className="font-semibold text-slate-800">{r.name}</h3>
          <p className="text-sm text-slate-500">
            {r.building} · {r.capacity} personas
          </p>
          <div className="mt-2 flex gap-1">
            {r.hasProjector && <Badge tone="blue">Proyector</Badge>}
            {r.hasWhiteboard && <Badge tone="green">Pizarra</Badge>}
          </div>
          <Button className="mt-3" variant={selectedId === r.id ? "secondary" : "primary"} onClick={() => onSelect(r)}>
            {selectedId === r.id ? "Seleccionada" : "Elegir sala"}
          </Button>
        </Card>
      ))}
    </div>
  );
}
