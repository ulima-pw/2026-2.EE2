import { Card, ErrorMessage, Field, Input, Loading, StarRating } from "../../components/ui/index.js";

export default function RecipeDetail({ recipe, servings, onServingsChange, loading, error }) {
  if (error) return <ErrorMessage message={error.message} status={error.status} />;
  if (!recipe) return <Card>Seleccione una receta para ver el detalle.</Card>;
  return (
    <Card title={recipe.title}>
      <p className="flex items-center gap-2 text-sm text-slate-500">
        {recipe.minutes} min ·
        {recipe.averageRating === null ? (
          "Sin calificaciones"
        ) : (
          <>
            <StarRating value={recipe.averageRating} size="text-base" /> {recipe.averageRating} ({recipe.ratingCount})
          </>
        )}
      </p>

      <Field label={`Porciones (receta base: ${recipe.baseServings})`} className="mt-4 w-40">
        <Input
          type="number"
          min="1"
          max="20"
          value={servings}
          onChange={(e) => onServingsChange(e.target.value)}
        />
      </Field>

      {loading && <Loading text="Actualizando cantidades..." />}

      <h3 className="mt-4 font-semibold text-slate-700">Ingredientes</h3>
      <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
        {recipe.ingredients.map((i) => (
          <li key={i.name}>
            {i.quantity} {i.unit} de {i.name}
          </li>
        ))}
      </ul>

      <h3 className="mt-4 font-semibold text-slate-700">Preparación</h3>
      <ol className="mt-1 list-inside list-decimal space-y-1 text-sm text-slate-700">
        {recipe.steps.map((s, idx) => (
          <li key={idx}>{s}</li>
        ))}
      </ol>
    </Card>
  );
}
