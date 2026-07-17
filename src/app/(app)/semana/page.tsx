import { createClient } from "@/lib/supabase/server";
import { getTareasKanbanCompleto } from "@/lib/data/tareas";
import { EstadoSelect } from "@/components/EstadoSelect";

export default async function VistaSemanaPage() {
  const supabase = await createClient();
  const kanban = await getTareasKanbanCompleto(supabase);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Vista Semana
        </h1>
        <p className="text-sm text-muted">
          Backlog → Esta semana → Hoy → En progreso → Esperando cliente → En
          revisión → Hecho.
        </p>
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
                      {tarea.clientes?.nombre ?? "Interna"}
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
