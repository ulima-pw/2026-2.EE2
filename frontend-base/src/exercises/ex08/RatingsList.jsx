import { Card, Field, Select, StarRating } from "../../components/ui/index.js";

export default function RatingsList({ ratings, minScore, onMinScoreChange }) {
  return (
    <Card
      title="Comentarios"
      actions={
        <Field className="w-40">
          <Select
            value={minScore}
            onChange={(e) => onMinScoreChange(e.target.value)}
            placeholder="Todas las estrellas"
            options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}+ estrellas` }))}
          />
        </Field>
      }
    >
      {ratings.length === 0 && <p className="text-sm text-slate-500">Sin comentarios.</p>}
      <ul className="divide-y divide-slate-100">
        {ratings.map((r, i) => (
          <li key={r.id ?? i} className="py-2">
            <StarRating value={r.score} size="text-base" />
            <p className="text-sm text-slate-700">{r.comment || <em className="text-slate-400">Sin comentario</em>}</p>
            <p className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
