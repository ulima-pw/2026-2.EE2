import { Badge, ErrorMessage, Loading } from "../../components/ui/index.js";

// error: { message, status } | null
export default function QuoteList({ quotes, loading, error }) {
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} status={error.status} />;
  if (quotes.length === 0) return <p className="text-sm text-slate-500">No hay frases para esos filtros.</p>;
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {quotes.map((q) => (
        <li key={q.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-slate-800">“{q.text}”</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            — {q.author} <Badge>{q.category}</Badge>
          </p>
        </li>
      ))}
    </ul>
  );
}
