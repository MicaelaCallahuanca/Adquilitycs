import { createClient } from "@/lib/supabase/server";
import { createNegocio } from "@/app/actions";
import { getContactosParaSelect } from "@/lib/data/contactos";
import { ContactosEditor } from "@/components/ContactosEditor";
import { ServiciosEditor } from "@/components/ServiciosEditor";

const TIPOS = ["Empresa fija", "Freelance", "Nuevo"];
const ESTADOS = ["Activo", "Onboarding", "En pausa", "Cerrado"];
const RIESGOS = ["Bajo", "Medio", "Alto"];

export default async function NuevoClientePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const contactosExistentes = await getContactosParaSelect(supabase);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-lg font-semibold text-foreground">Nuevo negocio</h1>

      <form action={createNegocio} className="mt-6 flex flex-col gap-4">
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="fecha_inicio"
              className="mb-1 block text-xs text-muted"
            >
              Fecha de inicio de la relación
            </label>
            <input
              id="fecha_inicio"
              name="fecha_inicio"
              type="date"
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

        <div>
          <label
            htmlFor="proxima_fecha_clave"
            className="mb-1 block text-xs text-muted"
          >
            Próxima fecha clave
          </label>
          <input
            id="proxima_fecha_clave"
            name="proxima_fecha_clave"
            type="date"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <ContactosEditor existentes={contactosExistentes} />

        <ServiciosEditor />

        {error && <p className="text-xs text-danger">{error}</p>}

        <button
          type="submit"
          className="mt-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Crear negocio
        </button>
      </form>
    </div>
  );
}
