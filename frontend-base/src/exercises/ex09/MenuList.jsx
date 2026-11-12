import { Badge, Button, Card } from "../../components/ui/index.js";

// Agrupa el menú por categoría y muestra un botón "Agregar" por plato.
export default function MenuList({ items, onAdd }) {
  const byCategory = items.reduce((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(byCategory).map(([category, list]) => (
        <Card key={category} title={category}>
          <ul className="divide-y divide-slate-100">
            {list.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-2">
                <div>
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-sm text-slate-500">S/ {Number(item.price).toFixed(2)}</p>
                </div>
                {item.available ? (
                  <Button onClick={() => onAdd(item)}>Agregar</Button>
                ) : (
                  <Badge tone="red">No disponible</Badge>
                )}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
