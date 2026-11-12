// columns: [{ key, header, render?: (row) => node }]
export default function Table({ columns, rows, emptyText = "Sin resultados" }) {
  return (
    <div className="overflow-x-auto rounded border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 font-medium">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-3 py-4 text-center text-slate-500">
                {emptyText}
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr key={row.id ?? row.code ?? i} className="border-t border-slate-100">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
