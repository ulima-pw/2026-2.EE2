import { ErrorMessage, Loading, StarRating } from "../../components/ui/index.js";

export default function RecipeList({ recipes, selectedId, onSelect, loading, error }) {
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} status={error.status} />;
  if (recipes.length === 0) return <p className="text-sm text-slate-500">No hay recetas.</p>;
  return (
    <ul className="space-y-2">
      {recipes.map((r) => (
        <li key={r.id}>
          <button
            type="button"
            onClick={() => onSelect(r.id)}
            className={`w-full rounded-lg border p-3 text-left transition hover:border-blue-400 ${
              selectedId === r.id ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"
            }`}
          >
            <p className="font-medium text-slate-800">{r.title}</p>
            <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              {r.minutes} min ·
              {r.averageRating === null ? (
                "Sin calificaciones"
              ) : (
                <>
                  <StarRating value={r.averageRating} size="text-sm" /> {r.averageRating} ({r.ratingCount})
                </>
              )}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}
