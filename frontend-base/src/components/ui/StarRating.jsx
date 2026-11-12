// Solo lectura:  <StarRating value={4.2} />
// Interactivo:   <StarRating value={score} onChange={setScore} />
export default function StarRating({ value = 0, onChange, size = "text-xl" }) {
  return (
    <span className={`inline-flex ${size}`} aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = (
          <span className={n <= Math.round(value) ? "text-amber-400" : "text-slate-300"}>★</span>
        );
        return onChange ? (
          <button key={n} type="button" onClick={() => onChange(n)} className="px-0.5 hover:scale-110">
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </span>
  );
}
