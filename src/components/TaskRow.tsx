import type { TareaConCliente } from "@/lib/data/tareas";

function formatDeadline(deadline: string | null) {
  if (!deadline) return null;
  const date = new Date(`${deadline}T00:00:00`);
  return date.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

export function TaskRow({ tarea }: { tarea: TareaConCliente }) {
  const esVencidaHoy =
    tarea.deadline_interno &&
    tarea.deadline_interno <= new Date().toISOString().slice(0, 10);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 hover:bg-surface-hover transition-colors">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {tarea.nombre}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          {tarea.clientes?.nombre && <span>{tarea.clientes.nombre}</span>}
          {tarea.subtipo && (
            <>
              <span aria-hidden>·</span>
              <span>{tarea.subtipo}</span>
            </>
          )}
          {tarea.esfuerzo && (
            <>
              <span aria-hidden>·</span>
              <span>{tarea.esfuerzo}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {tarea.impacto === "Alto" && (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
            Alto impacto
          </span>
        )}
        {tarea.urgencia === "Hoy" && (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
            Hoy
          </span>
        )}
        {tarea.deadline_interno && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              esVencidaHoy
                ? "bg-danger/15 text-danger"
                : "bg-border text-muted"
            }`}
          >
            {formatDeadline(tarea.deadline_interno)}
          </span>
        )}
      </div>
    </div>
  );
}
