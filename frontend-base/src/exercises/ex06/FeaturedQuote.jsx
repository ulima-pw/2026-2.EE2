import { Badge } from "../../components/ui/index.js";

export default function FeaturedQuote({ quote }) {
  if (!quote) return null;
  return (
    <figure className="rounded-lg bg-blue-600 p-6 text-white shadow">
      <blockquote className="text-xl font-medium italic">“{quote.text}”</blockquote>
      <figcaption className="mt-3 flex items-center gap-2 text-sm">
        — {quote.author} <Badge tone="blue">{quote.category}</Badge>
      </figcaption>
    </figure>
  );
}
