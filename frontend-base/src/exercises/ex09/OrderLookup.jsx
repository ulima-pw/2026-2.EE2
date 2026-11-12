import { Badge, Button, Card, ErrorMessage, Field, Input } from "../../components/ui/index.js";

// "Consultar pedido" por código. order: pedido | null
export default function OrderLookup({ code, onCodeChange, onSearch, order, loading, error }) {
  return (
    <Card title="Consultar pedido">
      <div className="flex items-end gap-2">
        <Field label="Código" className="flex-1">
          <Input value={code} onChange={(e) => onCodeChange(e.target.value)} placeholder="PED-0001" />
        </Field>
        <Button onClick={onSearch} loading={loading}>
          Buscar
        </Button>
      </div>
      <div className="mt-3">
        {error && <ErrorMessage message={error.message} status={error.status} />}
        {order && (
          <p className="text-sm">
            <b>{order.code}</b> <Badge tone="blue">{order.status}</Badge> — Total: {order.currency} {Number(order.total).toFixed(2)}
          </p>
        )}
      </div>
    </Card>
  );
}
