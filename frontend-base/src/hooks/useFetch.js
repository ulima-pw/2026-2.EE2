// EJERCICIO 10 — Custom hook reutilizable (lo debe escribir usted).
//
//   const { data, loading, error, reload } = useFetch(path);
//
// Requisitos:
//   - Si `path` es null, NO hace la petición.
//   - Vuelve a pedir los datos cuando cambia `path` y cuando se llama a `reload()`.
//   - Cancela o ignora respuestas antiguas (AbortController o bandera `ignore`).
//   - `error` guarda { message, status } o null (el backend responde { message } cuando `response.ok` es false).
//   - Se usa en al menos dos vistas.
//
// Pista: dentro del useEffect use `fetch(`${API_URL}${path}`, { signal })`; vea el ejemplo en src/ConnectionTest.jsx.
export function useFetch(path) {
  // TODO
  return { data: null, loading: false, error: null, reload: () => {} };
}
