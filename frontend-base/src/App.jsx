import { useState } from "react";
import { Tabs } from "./components/ui/index.js";
import ConnectionTest from "./ConnectionTest.jsx";
import QuotesPage from "./exercises/ex06/QuotesPage.jsx";
import WorkshopsPage from "./exercises/ex07/WorkshopsPage.jsx";
import RecipesPage from "./exercises/ex08/RecipesPage.jsx";
import OrderPage from "./exercises/ex09/OrderPage.jsx";
import RoomsPage from "./exercises/ex10/RoomsPage.jsx";

// Una pestaña por ejercicio. En su proyecto puede dejar solo la pestaña del ejercicio que está resolviendo.
const PAGES = [
  { id: "conexion", label: "Conexión", Page: ConnectionTest },
  { id: "ex06", label: "6. Frases", Page: QuotesPage },
  { id: "ex07", label: "7. Talleres", Page: WorkshopsPage },
  { id: "ex08", label: "8. Recetario", Page: RecipesPage },
  { id: "ex09", label: "9. Cotizador", Page: OrderPage },
  { id: "ex10", label: "10. Salas", Page: RoomsPage },
];

export default function App() {
  const [active, setActive] = useState("conexion");
  const { Page } = PAGES.find((p) => p.id === active);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <h1 className="text-xl font-bold text-slate-800">Programación Web — Talleres</h1>
          <Tabs tabs={PAGES} active={active} onChange={setActive} />
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <Page />
      </main>
    </div>
  );
}
