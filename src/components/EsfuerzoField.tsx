"use client";

import { useState } from "react";

const OPCIONES: { label: string; horas: number | null }[] = [
  { label: "30min", horas: 0.5 },
  { label: "1h", horas: 1 },
  { label: "2h", horas: 2 },
  { label: "4h", horas: 4 },
  { label: "Personalizado", horas: null },
];

export function EsfuerzoField() {
  const [seleccion, setSeleccion] = useState(OPCIONES[1]);
  const [horas, setHoras] = useState<number | "">(1);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor="esfuerzo" className="mb-1 block text-xs text-muted">
          Esfuerzo
        </label>
        <select
          id="esfuerzo"
          name="esfuerzo"
          value={seleccion.label}
          onChange={(e) => {
            const opcion =
              OPCIONES.find((o) => o.label === e.target.value) ?? OPCIONES[1];
            setSeleccion(opcion);
            if (opcion.horas !== null) setHoras(opcion.horas);
          }}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        >
          {OPCIONES.map((o) => (
            <option key={o.label} value={o.label}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="esfuerzo_horas"
          className="mb-1 block text-xs text-muted"
        >
          Horas
        </label>
        <input
          id="esfuerzo_horas"
          name="esfuerzo_horas"
          type="number"
          min="0"
          step="0.5"
          value={horas}
          onChange={(e) =>
            setHoras(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </div>
    </div>
  );
}
