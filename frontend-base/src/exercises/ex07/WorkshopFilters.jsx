import { Checkbox, Field, Select } from "../../components/ui/index.js";
import { DAYS } from "./sample.js";

export default function WorkshopFilters({ day, onDayChange, onlyAvailable, onOnlyAvailableChange }) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Field label="Día" className="w-48">
        <Select
          value={day}
          onChange={(e) => onDayChange(e.target.value)}
          placeholder="Todos los días"
          options={DAYS.map((d) => ({ value: d, label: d }))}
        />
      </Field>
      <Checkbox
        label="Solo con vacantes"
        checked={onlyAvailable}
        onChange={(e) => onOnlyAvailableChange(e.target.checked)}
        className="pb-2"
      />
    </div>
  );
}
