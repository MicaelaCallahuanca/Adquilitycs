import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  getTareasHoy,
  getTareasVenciendo48h,
  getTareasEsperandoClienteLargo,
  getTareasSemanaKanban,
} from "@/lib/data/tareas";
import { getClientesEnRiesgoCount } from "@/lib/data/clientes";
import { getSemanaActual } from "@/lib/data/semanas";
import { TaskRow } from "@/components/TaskRow";
import { StatTile } from "@/components/StatTile";

export default async function HomePage() {
  const supabase = await createClient();

  const [tareasHoy, venciendo48h, esperandoLargo, riesgoCount, semana, kanban] =
    await Promise.all([
      getTareasHoy(supabase),
      getTareasVenciendo48h(supabase),
      getTareasEsperandoClienteLargo(supabase),
      getClientesEnRiesgoCount(supabase),
      getSemanaActual(supabase),
      getTareasSemanaKanban(supabase),
    ]);

  const pctCapacidad = semana?.pct_capacidad_usada ?? null;
  const sobrecargada = pctCapacidad !== null && pctCapacidad > 100;

  return (
    <div className="flex flex-col gap-8">
      {sobrecargada && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          🔴 Semana sobrecargada — revisar antes de aceptar tareas nuevas.
        </div>
      )}

      {/* Franja superior — Ahora */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Ahora
          </h2>
          <Link
            href="/hoy"
            className="text-xs font-medium text-accent hover:opacity-80"
          >
            Ver Vista Hoy completa →
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {tareasHoy.length === 0 && (
            <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
              No hay tareas para hoy. Vista Hoy vacía.
            </p>
          )}
          {tareasHoy.slice(0, 5).map((tarea) => (
            <TaskRow key={tarea.id} tarea={tarea} />
          ))}
        </div>
      </section>

      {/* Franja media — Estado del sistema */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Estado del sistema
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label="% Capacidad usada (semana)"
            value={pctCapacidad !== null ? `${pctCapacidad}%` : "—"}
            tone={
              sobrecargada
                ? "danger"
                : pctCapacidad !== null && pctCapacidad >= 80
                  ? "warning"
                  : "default"
            }
          />
          <StatTile
            label="Tareas venciendo en 48h"
            value={venciendo48h}
            tone={venciendo48h > 0 ? "warning" : "default"}
          />
          <StatTile
            label="Clientes en riesgo"
            value={riesgoCount}
            tone={riesgoCount > 0 ? "danger" : "default"}
          />
          <StatTile
            label="Esperando cliente +5 días"
            value={esperandoLargo}
            tone={esperandoLargo > 0 ? "warning" : "default"}
          />
        </div>
      </section>

      {/* Franja inferior — Semana (Kanban compacto) */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Semana
          </h2>
          <Link
            href="/semana"
            className="text-xs font-medium text-accent hover:opacity-80"
          >
            Ver Vista Semana completa →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {kanban.map((columna) => (
            <div key={columna.estado} className="min-w-0">
              <p className="mb-2 truncate text-xs font-medium text-muted">
                {columna.estado} ({columna.tareas.length})
              </p>
              <div className="flex flex-col gap-1.5">
                {columna.tareas.slice(0, 4).map((tarea) => (
                  <div
                    key={tarea.id}
                    className="truncate rounded-md border border-border bg-surface px-2 py-1.5 text-xs text-foreground"
                    title={tarea.nombre}
                  >
                    {tarea.nombre}
                  </div>
                ))}
                {columna.tareas.length === 0 && (
                  <div className="rounded-md border border-dashed border-border px-2 py-1.5 text-xs text-muted">
                    Vacío
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
