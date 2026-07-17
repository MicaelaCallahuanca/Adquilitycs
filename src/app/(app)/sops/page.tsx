import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSopsGaleria, type PasoSop } from "@/lib/data/sops";

const ESTADO_TONE: Record<string, string> = {
  Vigente: "bg-success/15 text-success",
  "Necesita revisión": "bg-warning/15 text-warning",
  Obsoleto: "bg-border text-muted",
};

export default async function SopsPage() {
  const supabase = await createClient();
  const sops = await getSopsGaleria(supabase);

  const grupos = new Map<string, typeof sops>();
  for (const sop of sops) {
    const servicio = sop.servicio ?? "Sin servicio";
    const grupo = grupos.get(servicio) ?? [];
    grupo.push(sop);
    grupos.set(servicio, grupo);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">SOPs</h1>
          <p className="text-sm text-muted">
            {sops.length} proceso{sops.length === 1 ? "" : "s"} documentado
            {sops.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/sops/nuevo"
          className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          + Nuevo SOP
        </Link>
      </div>

      {sops.length === 0 && (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          Todavía no documentaste ningún proceso.
        </p>
      )}

      {[...grupos.entries()].map(([servicio, sopsServicio]) => (
        <section key={servicio}>
          <h2 className="mb-2 text-sm font-semibold text-muted">
            {servicio}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sopsServicio.map((sop) => {
              const pasos = (sop.pasos as PasoSop[] | null) ?? [];
              return (
                <div
                  key={sop.id}
                  className="rounded-lg border border-border bg-surface px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {sop.nombre}
                    </p>
                    {sop.estado && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                          ESTADO_TONE[sop.estado] ?? ESTADO_TONE.Vigente
                        }`}
                      >
                        {sop.estado}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {sop.tipo} · usado en {sop.usado_en_tareas ?? 0} tarea
                    {sop.usado_en_tareas === 1 ? "" : "s"}
                  </p>

                  {pasos.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-1">
                      {pasos.slice(0, 5).map((paso, i) => (
                        <li
                          key={i}
                          className="truncate text-xs text-foreground"
                        >
                          {i + 1}. {paso.texto}
                        </li>
                      ))}
                      {pasos.length > 5 && (
                        <li className="text-xs text-muted">
                          +{pasos.length - 5} más
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
