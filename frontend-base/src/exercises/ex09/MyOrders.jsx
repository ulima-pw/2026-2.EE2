import { Badge, Button, Card, ErrorMessage, Field, Input, Table } from "../../components/ui/index.js";

// "Mis pedidos" por teléfono.
export default function MyOrders({ phone, onPhoneChange, onSearch, orders, loading, error }) {
  return (
    <Card title="Mis pedidos">
      <div className="flex items-end gap-2">
        <Field label="Teléfono" className="flex-1">
          <Input value={phone} onChange={(e) => onPhoneChange(e.target.value)} />
        </Field>
        <Button onClick={onSearch} loading={loading}>
          Ver pedidos
        </Button>
      </div>
      <div className="mt-3 space-y-3">
        {error && <ErrorMessage message={error.message} status={error.status} />}
        <Table
          columns={[
            { key: "code", header: "Código" },
            { key: "status", header: "Estado", render: (o) => <Badge tone="blue">{o.status}</Badge> },
            { key: "total", header: "Total", render: (o) => `${o.currency} ${Number(o.total).toFixed(2)}` },
          ]}
          rows={orders}
          emptyText="Sin pedidos"
        />
      </div>
    </Card>
  );
}
