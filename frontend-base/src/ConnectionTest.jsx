import { useEffect, useState } from "react";
import { API_URL } from "./constants.js";
import { Button, Card, ErrorMessage, Input } from "./components/ui/index.js";

// Pantalla para comprobar la conexión con el backend (URL, CORS, servidor encendido).
// Sirve también de EJEMPLO del patrón que se usa en los ejercicios:
// el `fetch` se hace directamente dentro de un useEffect.
export default function ConnectionTest() {
  const [path, setPath] = useState("/");
  const [request, setRequest] = useState(null); // al cambiar, el useEffect hace la petición
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null); // { message, status } | null

  useEffect(() => {
    if (request === null) return;
    const controller = new AbortController(); // permite cancelar si el usuario vuelve a pedir

    async function load() {
      setLoading(true);
      setResult(null);
      setError(null);
      try {
        const response = await fetch(`${API_URL}${request.path}`, { signal: controller.signal });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          // el backend responde { message: "..." } con 400, 404, 409...
          setError({ message: data?.message ?? `Error ${response.status}`, status: response.status });
          return;
        }
        setResult(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError({ message: "No se pudo conectar con el servidor", status: 0 });
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort(); // limpieza
  }, [request]);

  function handleSubmit(event) {
    event.preventDefault();
    setRequest({ path }); // objeto nuevo → el efecto se ejecuta aunque la ruta sea la misma
  }

  return (
    <Card title="Probar conexión con el backend" className="max-w-2xl">
      <p className="mb-3 text-sm text-slate-500">
        Backend configurado en <code className="rounded bg-slate-100 px-1">{API_URL}</code> (variable <code>VITE_API_URL</code> del archivo <code>.env</code>)
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/products" />
        <Button type="submit" loading={loading}>
          Probar
        </Button>
      </form>
      <div className="mt-4 space-y-3">
        {error && <ErrorMessage message={error.message} status={error.status} />}
        {result && (
          <pre className="overflow-auto rounded bg-slate-900 p-3 text-sm text-green-300">{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    </Card>
  );
}
