import { Button, Card, ErrorMessage, Field, StarRating } from "../../components/ui/index.js";

export default function RatingForm({ score, comment, onScoreChange, onCommentChange, onSubmit, submitting, error }) {
  return (
    <Card title="Califica esta receta">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-3"
      >
        <StarRating value={score} onChange={onScoreChange} size="text-3xl" />
        <Field label="Comentario (opcional, máx. 200 caracteres)">
          <textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            maxLength={200}
            rows={3}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        {error && <ErrorMessage message={error.message} status={error.status} />}
        <Button type="submit" loading={submitting} disabled={score === 0}>
          Enviar calificación
        </Button>
      </form>
    </Card>
  );
}
