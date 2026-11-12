import { useState } from "react";
import { Card } from "../../components/ui/index.js";
import RecipeSearch from "./RecipeSearch.jsx";
import RecipeList from "./RecipeList.jsx";
import RecipeDetail from "./RecipeDetail.jsx";
import RatingForm from "./RatingForm.jsx";
import RatingsList from "./RatingsList.jsx";
import { SAMPLE_RATINGS, SAMPLE_RECIPES, SAMPLE_RECIPE_DETAIL } from "./sample.js";

// EJERCICIO 8 — Recetario con porciones y calificaciones
// Los componentes visuales ya están hechos: conéctelos con el backend.
export default function RecipesPage() {
  // Lista
  // TODO 1: GET /recipes?search=...&maxMinutes=... (useEffect que depende de search y maxMinutes).
  const [recipes, setRecipes] = useState(SAMPLE_RECIPES);
  const [search, setSearch] = useState("");
  const [maxMinutes, setMaxMinutes] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null); // { message, status } | null

  // Detalle
  // TODO 2: GET /recipes/:id?servings=N (useEffect con dependencias [selectedId, servings]).
  //         Evite que una respuesta antigua pise a una más reciente (AbortController o bandera `ignore`).
  const [selectedId, setSelectedId] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [servings, setServings] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Calificaciones
  // TODO 3: GET /recipes/:id/ratings?minScore=... (useEffect).
  const [ratings, setRatings] = useState(SAMPLE_RATINGS);
  const [minScore, setMinScore] = useState("");

  // TODO 4: POST /recipes/:id/ratings. Al terminar, actualizar promedio en el detalle Y en la lista.
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState(null);
  async function handleRate() {}

  // Mientras no haya backend, se muestra un detalle de ejemplo al seleccionar una receta.
  function handleSelect(id) {
    setSelectedId(id);
    setRecipe(SAMPLE_RECIPE_DETAIL);
    setServings(String(SAMPLE_RECIPE_DETAIL.baseServings));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
      <div className="space-y-4">
        <Card title="Recetas">
          <RecipeSearch
            search={search}
            maxMinutes={maxMinutes}
            onSearchChange={setSearch}
            onMaxMinutesChange={setMaxMinutes}
          />
        </Card>
        <RecipeList
          recipes={recipes}
          selectedId={selectedId}
          onSelect={handleSelect}
          loading={listLoading}
          error={listError}
        />
      </div>

      <div className="space-y-4">
        <RecipeDetail
          recipe={recipe}
          servings={servings}
          onServingsChange={setServings}
          loading={detailLoading}
          error={detailError}
        />
        {recipe && (
          <>
            <RatingForm
              score={score}
              comment={comment}
              onScoreChange={setScore}
              onCommentChange={setComment}
              onSubmit={handleRate}
              submitting={submitting}
              error={ratingError}
            />
            <RatingsList ratings={ratings} minScore={minScore} onMinScoreChange={setMinScore} />
          </>
        )}
      </div>
    </div>
  );
}
