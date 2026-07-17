import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getClientesDirectorio } from "@/lib/data/clientes";

const RIESGO_TONE: Record<string, string> = {
  Alto: "bg-danger/15 text-danger",
  Medio: "bg-warning/15 text-warning",
  Bajo: "bg-border text-muted",
};

export default async function ClientesPage() {
  const supabase = await createClient();
  const clientes = await getClientesDirectorio(supabase);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Directorio de clientes
          </h1>
          <p className="text-sm text-muted">
            {clientes.length} cliente{clientes.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/clientes/nuevo"
          className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          + Nuevo cliente
        </Link>
      </div>

      {clientes.length === 0 && (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          Todavía no cargaste ningún cliente.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {clientes.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {c.nombre}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                {c.tipo && <span>{c.tipo}</span>}
                <span aria-hidden>·</span>
                <span>{c.estado}</span>
                {c.rentabilidad !== null && (
                  <>
                    <span aria-hidden>·</span>
                    <span>Rentabilidad: {c.rentabilidad}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {c.alerta_capacidad && (
                <span className="rounded-full bg-border px-2 py-0.5 text-xs font-medium text-foreground">
                  {c.alerta_capacidad}
                </span>
              )}
              {c.nivel_riesgo && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    RIESGO_TONE[c.nivel_riesgo] ?? RIESGO_TONE.Bajo
                  }`}
                >
                  Riesgo {c.nivel_riesgo}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
