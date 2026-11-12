import { Alert, Card, Field, Input, Select } from "../../components/ui/index.js";

// warnings: arreglo de textos que devuelve el backend (cupón inválido, etc.)
export default function CheckoutOptions({
  districts,
  district,
  onDistrictChange,
  couponCode,
  onCouponChange,
  currency,
  onCurrencyChange,
  warnings = [],
}) {
  return (
    <Card title="Entrega y descuentos">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Distrito">
          <Select
            value={district}
            onChange={(e) => onDistrictChange(e.target.value)}
            placeholder="Seleccione"
            options={districts.map((d) => ({ value: d, label: d }))}
          />
        </Field>
        <Field label="Cupón">
          <Input value={couponCode} onChange={(e) => onCouponChange(e.target.value)} placeholder="ULIMA10" />
        </Field>
        <Field label="Moneda">
          <Select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            options={[
              { value: "PEN", label: "Soles (PEN)" },
              { value: "USD", label: "Dólares (USD)" },
            ]}
          />
        </Field>
      </div>
      {warnings.length > 0 && (
        <div className="mt-3 space-y-1">
          {warnings.map((w) => (
            <Alert key={w} tone="warning">
              {w}
            </Alert>
          ))}
        </div>
      )}
    </Card>
  );
}
