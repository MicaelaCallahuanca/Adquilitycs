import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBacklogMaestro } from "@/lib/data/tareas";
import { BucketSelect } from "@/components/BucketSelect";

export default async function BacklogMaestroPage() {
  const supabase = await createClient();
  const buckets = await getBacklogMaestro(supabase);
  const total = buckets.reduce((sum, b) => sum + b.tareas.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Backlog Maestro
          </h1>
          <p className="text-sm text-muted">
            {total} tarea{total === 1 ? "" : "s"} en backlog, ordenadas por
            score de prioridad.
          </p>
        </div>
        <Link
          href="/tareas/nueva"
          className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          + Nueva tarea
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {buckets.map(({ bucket, tareas }) => (
          <div key={bucket} className="min-w-0">
            <p className="mb-2 text-xs font-medium text-muted">
              {bucket} ({tareas.length})
            </p>
            <div className="flex flex-col gap-2">
              {tareas.map((tarea) => (
                <div
                  key={tarea.id}
                  className="rounded-lg border border-border bg-surface px-3 py-2"
                >
                  <Link
                    href={`/tareas/${tarea.id}`}
                    className="block truncate text-sm text-foreground hover:text-accent"
                    title={tarea.nombre}
                  >
                    {tarea.nombre}
                  </Link>
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
                    <BucketSelect
                      tareaId={tarea.id}
                      bucket={tarea.backlog_bucket}
                    />
                  </div>
                </div>
              ))}
              {tareas.length === 0 && (
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
