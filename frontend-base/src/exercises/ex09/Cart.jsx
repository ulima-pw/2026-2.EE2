import { Button, Card, Input } from "../../components/ui/index.js";

// items: [{ productId, name, quantity }]
export default function Cart({ items, onSetQuantity, onRemove, onClear }) {
  return (
    <Card
      title="Tu carrito"
      actions={
        items.length > 0 && (
          <Button variant="ghost" onClick={onClear}>
            Vaciar
          </Button>
        )
      }
    >
      {items.length === 0 && <p className="text-sm text-slate-500">Aún no agregaste platos.</p>}
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.productId} className="flex items-center gap-2">
            <span className="flex-1 text-sm text-slate-800">{i.name}</span>
            <Input
              type="number"
              min="1"
              className="w-20"
              value={i.quantity}
              onChange={(e) => onSetQuantity(i.productId, Number(e.target.value))}
            />
            <Button variant="danger" onClick={() => onRemove(i.productId)} aria-label={`Quitar ${i.name}`}>
              ✕
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
