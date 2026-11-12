import { useState } from "react";
import { Card } from "../../components/ui/index.js";
import WorkshopFilters from "./WorkshopFilters.jsx";
import WorkshopCard from "./WorkshopCard.jsx";
import RegistrationForm from "./RegistrationForm.jsx";
import RegistrationsList from "./RegistrationsList.jsx";
import { SAMPLE_REGISTRATIONS, SAMPLE_WORKSHOPS } from "./sample.js";

const EMPTY_FORM = { studentCode: "", fullName: "", email: "" };

// EJERCICIO 7 — Inscripción a talleres
// Los componentes visuales ya están hechos: conéctelos con el backend.
export default function WorkshopsPage() {
  // TODO 1: reemplazar por GET /workshops (con los filtros `day` y `onlyAvailable`) usando useEffect.
  const [workshops, setWorkshops] = useState(SAMPLE_WORKSHOPS);
  const [day, setDay] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const [selected, setSelected] = useState(null); // taller para inscribirse
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null); // { message, status } | null
  const [success, setSuccess] = useState(null);

  const [viewing, setViewing] = useState(null); // taller del que se ven los inscritos
  const [registrations, setRegistrations] = useState(SAMPLE_REGISTRATIONS);

  const handleFormChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  function handleRegister(workshop) {
    setSelected(workshop);
    setForm(EMPTY_FORM);
    setError(null);
    setSuccess(null);
  }

  // TODO 2: POST /workshops/:id/registrations con `form`.
  //   - Éxito: mostrar mensaje (setSuccess), limpiar el formulario y actualizar las vacantes de la lista.
  //   - Error: setError({ message: data.message, status: response.status }) cuando `response.ok` es false.
  //   (El POST va aquí, en el handler del evento; los GET que cargan datos van en useEffect.)
  async function handleSubmit() {}

  // TODO 3: GET /workshops/:id/registrations y guardar el resultado con setRegistrations.
  async function handleViewRegistrations(workshop) {
    setViewing(workshop);
  }

  return (
    <div className="space-y-4">
      <Card title="Talleres disponibles">
        <WorkshopFilters
          day={day}
          onDayChange={setDay}
          onlyAvailable={onlyAvailable}
          onOnlyAvailableChange={setOnlyAvailable}
        />
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workshops.map((w) => (
          <WorkshopCard
            key={w.id}
            workshop={w}
            onRegister={handleRegister}
            onViewRegistrations={handleViewRegistrations}
          />
        ))}
      </div>

      {selected && (
        <RegistrationForm
          workshop={selected}
          values={form}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={() => setSelected(null)}
          submitting={submitting}
          error={error}
          success={success}
        />
      )}
      {viewing && (
        <RegistrationsList workshop={viewing} registrations={registrations} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}
