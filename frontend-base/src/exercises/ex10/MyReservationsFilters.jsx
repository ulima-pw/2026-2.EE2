import { Button, Checkbox, Field, Input, Select } from "../../components/ui/index.js";

export default function MyReservationsFilters({ studentCode, status, upcoming, onChange, onSearch, loading }) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Field label="Código de alumno" className="w-48">
        <Input value={studentCode} onChange={(e) => onChange("studentCode", e.target.value)} />
      </Field>
      <Field label="Estado" className="w-44">
        <Select
          value={status}
          onChange={(e) => onChange("status", e.target.value)}
          placeholder="Todos"
          options={[
            { value: "ACTIVE", label: "Activas" },
            { value: "CANCELLED", label: "Canceladas" },
          ]}
        />
      </Field>
      <Checkbox label="Solo futuras" checked={upcoming} onChange={(e) => onChange("upcoming", e.target.checked)} className="pb-2" />
      <Button onClick={onSearch} loading={loading}>
        Buscar
      </Button>
    </div>
  );
}
