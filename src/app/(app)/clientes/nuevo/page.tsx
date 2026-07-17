import { createCliente } from "@/app/actions";

const TIPOS = ["Empresa fija", "Freelance", "Nuevo"];
const ESTADOS = ["Activo", "Onboarding", "En pausa", "Cerrado"];
const RIESGOS = ["Bajo", "Medio", "Alto"];
const SERVICIOS = ["SEO", "Ads", "Tracking", "CRO", "Automatizaciones", "IA"];

export default async function NuevoClientePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-lg font-semibold text-foreground">Nuevo cliente</h1>

      <form action={createCliente} className="mt-6 flex flex-col gap-4">
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
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="tipo" className="mb-1 block text-xs text-muted">
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              <option value="">—</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="estado" className="mb-1 block text-xs text-muted">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              defaultValue="Onboarding"
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

        <div>
          <p className="mb-1 block text-xs text-muted">Servicios activos</p>
          <div className="flex flex-wrap gap-3">
            {SERVICIOS.map((s) => (
              <label
                key={s}
                className="flex items-center gap-1.5 text-sm text-foreground"
              >
                <input
                  type="checkbox"
                  name="servicios_activos"
                  value={s}
                  className="accent-accent"
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="horas_contratadas_mes"
              className="mb-1 block text-xs text-muted"
            >
              Horas contratadas/mes
            </label>
            <input
              id="horas_contratadas_mes"
              name="horas_contratadas_mes"
              type="number"
              min="0"
              step="0.5"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <div>
            <label
              htmlFor="fee_mensual"
              className="mb-1 block text-xs text-muted"
            >
              Fee mensual
            </label>
            <input
              id="fee_mensual"
              name="fee_mensual"
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="contacto_principal"
              className="mb-1 block text-xs text-muted"
            >
              Contacto principal
            </label>
            <input
              id="contacto_principal"
              name="contacto_principal"
              type="text"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <div>
            <label
              htmlFor="nivel_riesgo"
              className="mb-1 block text-xs text-muted"
            >
              Nivel de riesgo
            </label>
            <select
              id="nivel_riesgo"
              name="nivel_riesgo"
              defaultValue="Bajo"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              {RIESGOS.map((r) => (
                <option key={r} value={r}>
                  {r}
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
          Crear cliente
        </button>
      </form>
    </div>
  );
}
