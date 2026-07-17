import { createClient } from "@/lib/supabase/server";
import { getTareasKanbanCompleto } from "@/lib/data/tareas";
import { getOrCrearSemanaActual } from "@/lib/data/semanas";
import { EstadoSelect } from "@/components/EstadoSelect";
import { CapacityBar } from "@/components/CapacityBar";
import { marcarRevisionViernes } from "@/app/actions";

export default async function VistaSemanaPage() {
  const supabase = await createClient();
  const [kanban, semana] = await Promise.all([
    getTareasKanbanCompleto(supabase),
    getOrCrearSemanaActual(supabase),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Vista Semana
        </h1>
        <p className="text-sm text-muted">
          {semana?.semana_inicio} → {semana?.semana_fin} · Backlog → Esta
          semana → Hoy → En progreso → Esperando cliente → En revisión →
          Hecho.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface px-4 py-3">
        <CapacityBar
          pct={semana?.pct_capacidad_usada ?? null}
          asignadaH={semana?.capacidad_asignada_h ?? null}
          disponibleH={semana?.capacidad_disponible_h ?? null}
        />

        {semana?.revision_viernes_hecha ? (
          <p className="mt-3 text-xs text-success">
            ✓ Revisión de viernes hecha
            {semana.notas_revision ? ` — ${semana.notas_revision}` : ""}
          </p>
        ) : (
          semana?.id && (
            <form
              action={marcarRevisionViernes}
              className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end"
            >
              <input type="hidden" name="semana_id" value={semana.id} />
              <div className="flex-1">
                <label
                  htmlFor="notas_revision"
                  className="mb-1 block text-xs text-muted"
                >
                  Revisión de viernes — qué se aprendió, qué se movió
                </label>
                <input
                  id="notas_revision"
                  name="notas_revision"
                  type="text"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Marcar hecha
              </button>
            </form>
          )
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {kanban.map((columna) => (
          <div key={columna.estado} className="min-w-0">
            <p className="mb-2 text-xs font-medium text-muted">
              {columna.estado} ({columna.tareas.length})
            </p>
            <div className="flex flex-col gap-2">
              {columna.tareas.map((tarea) => (
                <div
                  key={tarea.id}
                  className="rounded-lg border border-border bg-surface px-3 py-2"
                >
                  <p className="truncate text-sm text-foreground" title={tarea.nombre}>
                    {tarea.nombre}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted">
                      {tarea.negocios?.nombre ?? "Interna"}
                    </span>
                    {tarea.impacto === "Alto" && (
                      <span className="shrink-0 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                        Alto
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <EstadoSelect tareaId={tarea.id} estado={tarea.estado} />
                  </div>
                </div>
              ))}
              {columna.tareas.length === 0 && (
                <div className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted">
                  Vacío
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
