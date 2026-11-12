export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 ${className}`}
      {...props}
    />
  );
}
