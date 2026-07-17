import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getNegociosDirectorio } from "@/lib/data/negocios";

const RIESGO_TONE: Record<string, string> = {
  Alto: "bg-danger/15 text-danger",
  Medio: "bg-warning/15 text-warning",
  Bajo: "bg-border text-muted",
};

export default async function ClientesPage() {
  const supabase = await createClient();
  const negocios = await getNegociosDirectorio(supabase);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Directorio de negocios
          </h1>
          <p className="text-sm text-muted">
            {negocios.length} negocio{negocios.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/clientes/nuevo"
          className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          + Nuevo negocio
        </Link>
      </div>

      {negocios.length === 0 && (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          Todavía no cargaste ningún negocio.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {negocios.map((n) => (
          <div
            key={n.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <Link
                href={`/clientes/${n.id}`}
                className="block truncate text-sm font-medium text-foreground hover:text-accent"
              >
                {n.nombre}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                {n.tipo && <span>{n.tipo}</span>}
                <span aria-hidden>·</span>
                <span>{n.estado}</span>
                {n.rentabilidad !== null && (
                  <>
                    <span aria-hidden>·</span>
                    <span>Rentabilidad: {n.rentabilidad}</span>
                  </>
                )}
              </div>
              {(n.contactos.length > 0 || n.servicios.length > 0) && (
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                  {n.contactos.length > 0 && (
                    <span>
                      {n.contactos
                        .map(
                          (c) => c.nombre + (c.es_principal ? " (principal)" : ""),
                        )
                        .join(", ")}
                    </span>
                  )}
                  {n.servicios.length > 0 && (
                    <span>
                      {n.servicios.map((s) => s.servicio).join(" · ")}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {n.alerta_capacidad && (
                <span className="rounded-full bg-border px-2 py-0.5 text-xs font-medium text-foreground">
                  {n.alerta_capacidad}
                </span>
              )}
              {n.nivel_riesgo && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    RIESGO_TONE[n.nivel_riesgo] ?? RIESGO_TONE.Bajo
                  }`}
                >
                  Riesgo {n.nivel_riesgo}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
