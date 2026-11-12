import { Badge, Button, Card } from "../../components/ui/index.js";

export default function WorkshopCard({ workshop, onRegister, onViewRegistrations }) {
  const full = workshop.availableSlots === 0;
  return (
    <Card className={full ? "opacity-60" : ""}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-800">{workshop.name}</h3>
        <Badge tone={full ? "red" : "green"}>
          {full ? "Sin vacantes" : `${workshop.availableSlots} vacantes`}
        </Badge>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {workshop.instructor} · {workshop.day}
      </p>
      <div className="mt-4 flex gap-2">
        <Button disabled={full} onClick={() => onRegister(workshop)}>
          Inscribirme
        </Button>
        <Button variant="secondary" onClick={() => onViewRegistrations(workshop)}>
          Ver inscritos
        </Button>
      </div>
    </Card>
  );
}
