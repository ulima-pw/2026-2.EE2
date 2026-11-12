import { Button, Card, ErrorMessage, Field, Input, Alert } from "../../components/ui/index.js";

// Formulario controlado: el estado (values) vive en la página y se modifica con onChange(campo, valor).
// error: { message, status } | null     success: string | null
export default function RegistrationForm({
  workshop,
  values,
  onChange,
  onSubmit,
  onCancel,
  submitting,
  error,
  success,
}) {
  return (
    <Card title={`Inscripción: ${workshop.name}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-3"
      >
        <Field label="Código de alumno" hint="8 dígitos">
          <Input value={values.studentCode} onChange={(e) => onChange("studentCode", e.target.value)} />
        </Field>
        <Field label="Nombre completo">
          <Input value={values.fullName} onChange={(e) => onChange("fullName", e.target.value)} />
        </Field>
        <Field label="Correo" hint="@aloe.ulima.edu.pe">
          <Input type="email" value={values.email} onChange={(e) => onChange("email", e.target.value)} />
        </Field>

        {error && <ErrorMessage message={error.message} status={error.status} />}
        {success && <Alert tone="success">{success}</Alert>}

        <div className="flex gap-2">
          <Button type="submit" loading={submitting}>
            Enviar inscripción
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cerrar
          </Button>
        </div>
      </form>
    </Card>
  );
}
