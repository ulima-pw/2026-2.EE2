// options: [{ value, label }]. Si se pasa `placeholder`, agrega una primera opción vacía.
export default function Select({ options = [], placeholder, className = "", ...props }) {
  return (
    <select
      className={`w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
