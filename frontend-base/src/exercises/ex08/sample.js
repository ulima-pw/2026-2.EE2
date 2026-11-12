export const SAMPLE_RECIPES = [
  { id: 1, title: "Arroz con pollo", minutes: 60, averageRating: 4.5, ratingCount: 12 },
  { id: 2, title: "Tallarines verdes", minutes: 35, averageRating: 4.1, ratingCount: 8 },
  { id: 3, title: "Ensalada fresca", minutes: 15, averageRating: null, ratingCount: 0 },
];
export const SAMPLE_RECIPE_DETAIL = {
  id: 1,
  title: "Arroz con pollo",
  minutes: 60,
  baseServings: 4,
  averageRating: 4.5,
  ratingCount: 12,
  ingredients: [
    { name: "Arroz", quantity: 2, unit: "tazas" },
    { name: "Pollo", quantity: 800, unit: "g" },
  ],
  steps: ["Dorar el pollo.", "Agregar el arroz y el caldo.", "Cocinar 20 minutos."],
};
export const SAMPLE_RATINGS = [
  { id: 1, score: 5, comment: "Muy rica", createdAt: "2026-11-01T12:00:00Z" },
  { id: 2, score: 3, comment: "Le faltó sal", createdAt: "2026-10-28T09:30:00Z" },
];
