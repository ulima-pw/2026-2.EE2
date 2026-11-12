import { Field, Input } from "../../components/ui/index.js";

export default function RecipeSearch({ search, maxMinutes, onSearchChange, onMaxMinutesChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
      <Field label="Buscar" hint="Título o ingrediente">
        <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Ej. arroz" />
      </Field>
      <Field label="Tiempo máx. (min)">
        <Input
          type="number"
          min="1"
          value={maxMinutes}
          onChange={(e) => onMaxMinutesChange(e.target.value)}
        />
      </Field>
    </div>
  );
}
