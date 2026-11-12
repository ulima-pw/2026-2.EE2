import { Button, Field, Select } from "../../components/ui/index.js";

export default function QuoteFilters({
  authors,
  categories,
  author,
  category,
  onAuthorChange,
  onCategoryChange,
  onRandom,
  loadingRandom,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <Field label="Autor">
        <Select
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          placeholder="Todos los autores"
          options={authors.map((a) => ({ value: a, label: a }))}
        />
      </Field>
      <Field label="Categoría">
        <Select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          placeholder="Todas las categorías"
          options={categories.map((c) => ({ value: c, label: c }))}
        />
      </Field>
      <Button onClick={onRandom} loading={loadingRandom}>
        Frase aleatoria
      </Button>
    </div>
  );
}
