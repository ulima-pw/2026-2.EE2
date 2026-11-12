import { Checkbox, Field, Input, Select } from "../../components/ui/index.js";

// filters: { building, minCapacity, projector, whiteboard }   onChange(campo, valor)
export default function RoomFilters({ filters, buildings, onChange }) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Field label="Edificio" className="w-48">
        <Select
          value={filters.building}
          onChange={(e) => onChange("building", e.target.value)}
          placeholder="Todos"
          options={buildings.map((b) => ({ value: b, label: b }))}
        />
      </Field>
      <Field label="Capacidad mínima" className="w-40">
        <Input
          type="number"
          min="1"
          value={filters.minCapacity}
          onChange={(e) => onChange("minCapacity", e.target.value)}
        />
      </Field>
      <Checkbox label="Proyector" checked={filters.projector} onChange={(e) => onChange("projector", e.target.checked)} className="pb-2" />
      <Checkbox label="Pizarra" checked={filters.whiteboard} onChange={(e) => onChange("whiteboard", e.target.checked)} className="pb-2" />
    </div>
  );
}
