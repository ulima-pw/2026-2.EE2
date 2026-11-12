import { Alert, Button, Card, ErrorMessage, Field, Input } from "../../components/ui/index.js";

// customer: { name, phone }   error: { message, status } | null   createdOrder: { code, ... } | null
export default function ConfirmOrder({ customer, onCustomerChange, onConfirm, submitting, disabled, error, createdOrder }) {
  return (
    <Card title="Confirmar pedido">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nombre">
          <Input value={customer.name} onChange={(e) => onCustomerChange("name", e.target.value)} />
        </Field>
        <Field label="Teléfono">
          <Input value={customer.phone} onChange={(e) => onCustomerChange("phone", e.target.value)} />
        </Field>
      </div>
      <div className="mt-3 space-y-3">
        {error && <ErrorMessage message={error.message} status={error.status} />}
        {createdOrder && <Alert tone="success" title="¡Pedido recibido!">Tu código es <b>{createdOrder.code}</b></Alert>}
        <Button onClick={onConfirm} loading={submitting} disabled={disabled}>
          Confirmar pedido
        </Button>
      </div>
    </Card>
  );
}
