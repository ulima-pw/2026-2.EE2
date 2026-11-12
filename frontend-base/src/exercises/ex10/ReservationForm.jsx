import { Alert, Button, Card, ErrorMessage, Field, Input } from "../../components/ui/index.js";

// values: { studentCode, date, startHour, hours, attendees }
// clientErrors: { campo: "mensaje" } (validaciones del cliente)   error: { message, status } | null (backend)
// success: { code } | null
export default function ReservationForm({ room, values, onChange, onSubmit, submitting, clientErrors = {}, error, success }) {
  return (
    <Card title="Reservar">
      {!room && <p className="text-sm text-slate-500">Primero elija una sala en “Buscar sala”.</p>}
      {room && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-3"
        >
          <p className="text-sm text-slate-600">
            Sala: <b>{room.name}</b> (capacidad {room.capacity})
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Código de alumno" error={clientErrors.studentCode}>
              <Input value={values.studentCode} onChange={(e) => onChange("studentCode", e.target.value)} />
            </Field>
            <Field label="Fecha" error={clientErrors.date}>
              <Input type="date" value={values.date} onChange={(e) => onChange("date", e.target.value)} />
            </Field>
            <Field label="Hora de inicio" hint="Se completa al elegir bloques en la grilla" error={clientErrors.startHour}>
              <Input value={values.startHour} readOnly />
            </Field>
            <Field label="Horas" hint="Entre 1 y 3" error={clientErrors.hours}>
              <Input value={values.hours} readOnly />
            </Field>
            <Field label="Asistentes" error={clientErrors.attendees}>
              <Input type="number" min="1" value={values.attendees} onChange={(e) => onChange("attendees", e.target.value)} />
            </Field>
          </div>
          {error && <ErrorMessage message={error.message} status={error.status} />}
          {success && (
            <Alert tone="success" title="¡Reserva confirmada!">
              Tu código es <b>{success.code}</b>
            </Alert>
          )}
          <Button type="submit" loading={submitting}>
            Confirmar reserva
          </Button>
        </form>
      )}
    </Card>
  );
}
