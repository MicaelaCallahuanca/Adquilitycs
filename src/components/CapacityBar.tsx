function toneFor(pct: number) {
  if (pct > 100) return { bar: "bg-danger", text: "text-danger" };
  if (pct >= 80) return { bar: "bg-warning", text: "text-warning" };
  return { bar: "bg-success", text: "text-success" };
}

export function CapacityBar({
  pct,
  asignadaH,
  disponibleH,
}: {
  pct: number | null;
  asignadaH: number | null;
  disponibleH: number | null;
}) {
  if (pct === null) {
    return <p className="text-sm text-muted">Sin datos de capacidad.</p>;
  }

  const { bar, text } = toneFor(pct);
  const anchoBarra = Math.min(pct, 100);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className={`text-sm font-medium ${text}`}>{pct}% usada</span>
        <span className="text-xs text-muted">
          {asignadaH ?? 0}h / {disponibleH ?? 0}h
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${bar}`}
          style={{ width: `${anchoBarra}%` }}
        />
      </div>
    </div>
  );
}
