import { createSop } from "@/app/actions";

const SERVICIOS = [
  "SEO",
  "Ads",
  "Tracking",
  "Auditoría",
  "Onboarding",
  "Reportes",
  "Cierre mensual",
  "Facturación",
  "QA",
];
const TIPOS = ["Proceso", "Checklist", "Plantilla"];
const ESTADOS = ["Vigente", "Necesita revisión", "Obsoleto"];

export default async function NuevoSopPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-lg font-semibold text-foreground">Nuevo SOP</h1>
      <p className="mt-1 text-sm text-muted">
        Proceso repetible — se puede vincular a cualquier tarea que lo siga.
      </p>

      <form action={createSop} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="nombre" className="mb-1 block text-xs text-muted">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            autoFocus
            placeholder="Auditoría SEO"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="servicio"
              className="mb-1 block text-xs text-muted"
            >
              Servicio
            </label>
            <select
              id="servicio"
              name="servicio"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              <option value="">—</option>
              {SERVICIOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tipo" className="mb-1 block text-xs text-muted">
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              defaultValue="Proceso"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="pasos" className="mb-1 block text-xs text-muted">
            Pasos — uno por línea
          </label>
          <textarea
            id="pasos"
            name="pasos"
            rows={6}
            placeholder={"Revisar indexación\nAuditar Core Web Vitals\nChequear enlaces rotos"}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="dueño" className="mb-1 block text-xs text-muted">
              Dueño
            </label>
            <input
              id="dueño"
              name="dueño"
              type="text"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="estado" className="mb-1 block text-xs text-muted">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              defaultValue="Vigente"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}

        <button
          type="submit"
          className="mt-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Crear SOP
        </button>
      </form>
    </div>
  );
}
