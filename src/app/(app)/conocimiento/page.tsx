import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getConocimientoLista } from "@/lib/data/conocimiento";

const CONFIANZA_TONE: Record<string, string> = {
  Verificado: "bg-success/15 text-success",
  Inferido: "bg-warning/15 text-warning",
  Borrador: "bg-border text-muted",
};

export default async function ConocimientoPage() {
  const supabase = await createClient();
  const items = await getConocimientoLista(supabase);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Conocimiento
          </h1>
          <p className="text-sm text-muted">
            Contexto y referencia — no procesos repetibles (eso son los{" "}
            <Link href="/sops" className="text-accent hover:opacity-80">
              SOPs
            </Link>
            ).
          </p>
        </div>
        <Link
          href="/conocimiento/nuevo"
          className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          + Nuevo documento
        </Link>
      </div>

      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          Todavía no cargaste ningún documento.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/conocimiento/${item.id}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 hover:bg-surface-hover transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {item.nombre}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                {item.tipo && <span>{item.tipo}</span>}
                {item.clientes?.nombre && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{item.clientes.nombre}</span>
                  </>
                )}
                {item.servicio && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{item.servicio}</span>
                  </>
                )}
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                CONFIANZA_TONE[item.confianza] ?? CONFIANZA_TONE.Borrador
              }`}
            >
              {item.confianza}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
