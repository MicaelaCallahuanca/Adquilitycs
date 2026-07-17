import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getRentabilidadClientes, getKpisOperativos } from "@/lib/data/metricas";
import { StatTile } from "@/components/StatTile";

export default async function MetricasPage() {
  const supabase = await createClient();
  const [rentabilidad, kpis] = await Promise.all([
    getRentabilidadClientes(supabase),
    getKpisOperativos(supabase),
  ]);

  const maxHorasCategoria = Math.max(
    1,
    ...kpis.distribucion.map((d) => d.horas),
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Métricas / KPIs
        </h1>
        <p className="text-sm text-muted">
          Basado en tareas marcadas &quot;Hecho&quot; (salvo donde se indica).
          También sirve como Revisión mensual — son los mismos rollups.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Eficiencia
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatTile
            label="Horas facturables / trabajadas"
            value={
              kpis.pctFacturable !== null ? `${kpis.pctFacturable}%` : "—"
            }
          />
          <StatTile
            label="Cumplimiento de deadline interno"
            value={
              kpis.pctCumplimiento !== null ? `${kpis.pctCumplimiento}%` : "—"
            }
            tone={
              kpis.pctCumplimiento !== null && kpis.pctCumplimiento < 70
                ? "danger"
                : "default"
            }
          />
          <StatTile
            label="Horas totales trabajadas"
            value={kpis.horasTotales}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Distribución de tiempo por categoría
        </h2>
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface px-4 py-3">
          {kpis.distribucion.map((d) => (
            <div key={d.categoria}>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-foreground">{d.categoria}</span>
                <span className="text-muted">{d.horas}h</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{
                    width: `${(d.horas / maxHorasCategoria) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Rentabilidad por cliente
        </h2>
        <p className="mb-2 text-xs text-muted">
          Fee mensual ÷ horas consumidas — los primeros son los que hay que
          revisar.
        </p>
        {rentabilidad.length === 0 && (
          <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
            Sin clientes con fee mensual cargado.
          </p>
        )}
        <div className="flex flex-col gap-2">
          {rentabilidad.map((c) => (
            <Link
              key={c.id}
              href={`/clientes/${c.id}`}
              className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 hover:bg-surface-hover transition-colors"
            >
              <span className="text-sm text-foreground">{c.nombre}</span>
              <span className="text-sm text-muted">
                ${c.rentabilidad}/h · {c.horas_consumidas_mes}h este mes
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Tareas recurrentes sin SOP
        </h2>
        <p className="mb-2 text-xs text-muted">
          Mismo subtipo repetido 2+ veces, nunca vinculado a un proceso —
          candidatas a documentar.
        </p>
        {kpis.tareasRecurrentesSinSop.length === 0 && (
          <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
            No hay candidatas por ahora.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {kpis.tareasRecurrentesSinSop.map((c) => (
            <Link
              key={c.subtipo}
              href="/sops/nuevo"
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground hover:bg-surface-hover transition-colors"
            >
              {c.subtipo} ({c.total})
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
