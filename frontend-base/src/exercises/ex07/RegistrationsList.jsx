import { Button, Card, Table } from "../../components/ui/index.js";

export default function RegistrationsList({ workshop, registrations, onClose }) {
  return (
    <Card
      title={`Inscritos en ${workshop.name}`}
      actions={
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <Table
        columns={[
          { key: "studentCode", header: "Código" },
          { key: "fullName", header: "Nombre" },
          { key: "email", header: "Correo" },
        ]}
        rows={registrations}
        emptyText="Aún no hay inscritos"
      />
    </Card>
  );
}
