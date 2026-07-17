import { createClient } from "@/lib/supabase/server";
import { getTareasHoy } from "@/lib/data/tareas";
import { TaskRow } from "@/components/TaskRow";

export default async function VistaHoyPage() {
  const supabase = await createClient();
  const tareas = await getTareasHoy(supabase);

  const grupos = new Map<string, typeof tareas>();
  for (const tarea of tareas) {
    const clienteNombre = tarea.negocios?.nombre ?? "Interno";
    const grupo = grupos.get(clienteNombre) ?? [];
    grupo.push(tarea);
    grupos.set(clienteNombre, grupo);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Vista Hoy</h1>
        <p className="text-sm text-muted">
          Tareas en progreso, marcadas para hoy, o con deadline interno hoy —
          ordenadas por score de prioridad.
        </p>
      </div>

      {tareas.length === 0 && (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          No hay tareas para hoy.
        </p>
      )}

      {[...grupos.entries()].map(([cliente, tareasCliente]) => (
        <section key={cliente}>
          <h2 className="mb-2 text-sm font-semibold text-muted">{cliente}</h2>
          <div className="flex flex-col gap-2">
            {tareasCliente.map((tarea) => (
              <TaskRow key={tarea.id} tarea={tarea} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
