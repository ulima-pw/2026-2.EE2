import { useState } from "react";
import { Card } from "../../components/ui/index.js";
import QuoteFilters from "./QuoteFilters.jsx";
import FeaturedQuote from "./FeaturedQuote.jsx";
import QuoteList from "./QuoteList.jsx";
import { CATEGORIES, SAMPLE_AUTHORS, SAMPLE_QUOTES } from "./sample.js";

// EJERCICIO 6 — Frases célebres
// Los componentes visuales ya están hechos: conéctelos con el backend.
export default function QuotesPage() {
  // TODO 1: reemplazar los datos de ejemplo por datos del backend (fetch dentro de un useEffect;
  //         vea el ejemplo en src/ConnectionTest.jsx). Importe API_URL de "../../constants.js".
  const [quotes, setQuotes] = useState(SAMPLE_QUOTES);
  const [authors, setAuthors] = useState(SAMPLE_AUTHORS);

  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [error, setError] = useState(null); // { message, status } | null

  // TODO 2: useEffect → al cambiar `author` o `category`, pedir GET /quotes con esos filtros.
  // TODO 3: handleRandom → pedir GET /quotes/random?category=... y guardar el resultado con setFeatured.
  function handleRandom() {}

  return (
    <div className="space-y-4">
      <Card title="Frases célebres">
        <QuoteFilters
          authors={authors}
          categories={CATEGORIES}
          author={author}
          category={category}
          onAuthorChange={setAuthor}
          onCategoryChange={setCategory}
          onRandom={handleRandom}
          loadingRandom={loadingRandom}
        />
      </Card>
      <FeaturedQuote quote={featured} />
      <QuoteList quotes={quotes} loading={loading} error={error} />
    </div>
  );
}
