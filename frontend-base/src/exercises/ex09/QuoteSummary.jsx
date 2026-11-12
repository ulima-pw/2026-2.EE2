import { Card, Loading } from "../../components/ui/index.js";

// Solo MUESTRA los valores que devuelve POST /quotes; no calcula nada.
export default function QuoteSummary({ quote, loading }) {
  const money = (n) => `${quote.currency === "USD" ? "US$" : "S/"} ${Number(n).toFixed(2)}`;
  return (
    <Card title="Resumen">
      {loading && <Loading text="Calculando..." />}
      {!quote && !loading && <p className="text-sm text-slate-500">Agrega platos para ver la cotización.</p>}
      {quote && (
        <dl className="space-y-1 text-sm">
          {quote.lines.map((l) => (
            <div key={l.productId} className="flex justify-between">
              <dt>
                {l.quantity} × {l.name}
              </dt>
              <dd>{money(l.lineTotal)}</dd>
            </div>
          ))}
          <hr className="my-2" />
          <Row label="Subtotal" value={money(quote.subtotal)} />
          <Row label="Descuento por cupón" value={`- ${money(quote.couponDiscount)}`} />
          <Row label="Descuento por volumen" value={`- ${money(quote.volumeDiscount)}`} />
          <Row label="Delivery" value={money(quote.delivery)} />
          <div className="flex justify-between border-t pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd>{money(quote.total)}</dd>
          </div>
        </dl>
      )}
    </Card>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-slate-600">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
