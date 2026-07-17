"use client";

import { useId, useState } from "react";

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent";

const SERVICIOS = ["SEO", "Ads", "Tracking", "CRO", "Automatizaciones", "IA"];

export type ServicioFila = {
  key: string;
  servicio: string;
  fechaInicio: string;
  feeMensual: string;
  horasContratadasMes: string;
};

function filaVacia(key: string): ServicioFila {
  return { key, servicio: "", fechaInicio: "", feeMensual: "", horasContratadasMes: "" };
}

export function ServiciosEditor({ initial }: { initial?: ServicioFila[] }) {
  const baseId = useId();
  const [filas, setFilas] = useState<ServicioFila[]>(
    initial && initial.length > 0 ? initial : [filaVacia(`${baseId}-0`)],
  );

  function actualizarFila(index: number, cambios: Partial<ServicioFila>) {
    setFilas((prev) =>
      prev.map((fila, i) => (i === index ? { ...fila, ...cambios } : fila)),
    );
  }

  function agregarFila() {
    setFilas((prev) => [...prev, filaVacia(`${baseId}-${prev.length}`)]);
  }

  function eliminarFila(index: number) {
    setFilas((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted">Servicios contratados</p>
      {filas.map((fila, index) => (
        <div
          key={fila.key}
          className="flex flex-col gap-2 rounded-md border border-border p-3"
        >
          <div className="flex items-center justify-between gap-2">
            <select
              name="servicio_nombre"
              value={fila.servicio}
              onChange={(e) =>
                actualizarFila(index, { servicio: e.target.value })
              }
              className={inputClass}
            >
              <option value="">—</option>
              {SERVICIOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {filas.length > 1 && (
              <button
                type="button"
                onClick={() => eliminarFila(index)}
                className="shrink-0 text-xs text-danger hover:opacity-80"
              >
                Quitar
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-xs text-muted">
                Fecha de inicio
              </label>
              <input
                name="servicio_fecha_inicio"
                type="date"
                value={fila.fechaInicio}
                onChange={(e) =>
                  actualizarFila(index, { fechaInicio: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">
                Fee mensual
              </label>
              <input
                name="servicio_fee_mensual"
                type="number"
                min="0"
                step="0.01"
                value={fila.feeMensual}
                onChange={(e) =>
                  actualizarFila(index, { feeMensual: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">
                Horas/mes
              </label>
              <input
                name="servicio_horas_contratadas_mes"
                type="number"
                min="0"
                step="0.5"
                value={fila.horasContratadasMes}
                onChange={(e) =>
                  actualizarFila(index, {
                    horasContratadasMes: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={agregarFila}
        className="self-start text-xs text-accent hover:opacity-80"
      >
        + Agregar servicio
      </button>
    </div>
  );
}
