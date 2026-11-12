import Alert from "./Alert.jsx";

// Muestra el `message` que devuelve el backend. Distingue visualmente por código HTTP:
//   400 → advertencia (datos inválidos)   409 → conflicto   404 / otros → error
// Uso:  <ErrorMessage message={error?.message} status={error?.status} />
const titles = { 0: "Sin conexión", 400: "Datos inválidos", 404: "No encontrado", 409: "Conflicto" };

export default function ErrorMessage({ message, status }) {
  if (!message) return null;
  const tone = status === 400 || status === 409 ? "warning" : "error";
  return (
    <Alert tone={tone} title={titles[status] ?? "Error"}>
      {message}
    </Alert>
  );
}
