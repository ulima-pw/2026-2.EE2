# frontend-base

Proyecto base **React + Vite + Tailwind CSS** con la **interfaz de los ejercicios 6 al 10 ya construida** y lista para conectarse al backend Express.

> No hay que crear componentes visuales: en cada ejercicio se **modifican los existentes** (estado, efectos, llamadas a la API y, si hace falta, su aspecto).

```bash
npm install
cp .env.example .env   # si aún no existe .env
npm run dev            # http://localhost:5173
```

Requiere Node 20.19 o superior.

## Estructura

| Ubicación | Qué contiene |
|-----------|--------------|
| `.env` | `VITE_API_URL`: URL del backend (por defecto `http://localhost:3000`). |
| `src/constants.js` | Exporta `API_URL` (se importa en las páginas para armar las URLs de `fetch`). |
| `src/components/ui/` | Kit de componentes: `Button`, `Field`, `Input`, `Select`, `Checkbox`, `Card`, `Badge`, `Alert`, `ErrorMessage`, `Loading`, `Table`, `StarRating`, `Tabs`. |
| `src/exercises/ex06` … `ex10` | Componentes visuales de cada ejercicio + una página con el estado y los `// TODO`. Cada carpeta trae `sample.js` con datos de ejemplo. |
| `src/exercises/ex09/cartReducer.js` | Esqueleto del reducer del carrito (se implementa). |
| `src/hooks/useFetch.js` | Esqueleto del hook del ejercicio 10 (se implementa). |
| `src/ConnectionTest.jsx` | Pantalla "Probar conexión" con el backend. **Es el ejemplo** de `fetch` dentro de un `useEffect` (con `AbortController`, `response.ok` y manejo de errores). |
| `src/App.jsx` | Menú con una pestaña por ejercicio. |

## Cómo se trabaja

1. Abra la página del ejercicio (`src/exercises/exNN/…Page.jsx`) y busque los `// TODO`.
2. Reemplace los datos de ejemplo por datos del backend haciendo el **`fetch` directamente dentro de `useEffect`** (no hay capa `api.js`) y guardando el resultado con `useState`. Los `POST` se hacen en el *handler* del evento (envío del formulario, clic).
3. Si las `props` de un componente no alcanzan, modifique ese componente (no cree otro).
4. Los errores del backend se guardan como `{ message, status }` y se muestran con `ErrorMessage` (distingue `400`, `404` y `409`).

El backend debe tener `app.use(cors())` habilitado.
