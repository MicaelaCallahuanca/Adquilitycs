import { createClient } from "@/lib/supabase/server";
import { getClientesParaSelect } from "@/lib/data/clientes";
import { createConocimiento } from "@/app/actions";

const TIPOS = ["Técnico", "Cliente", "Estratégico"];
const CONFIANZAS = ["Verificado", "Inferido", "Borrador"];

export default async function NuevoConocimientoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const clientes = await getClientesParaSelect(supabase);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-lg font-semibold text-foreground">
        Nuevo documento
      </h1>

      <form action={createConocimiento} className="mt-6 flex flex-col gap-4">
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
            placeholder="Cliente X — accesos y particularidades de su CMS"
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
            <label
              htmlFor="cliente_id"
              className="mb-1 block text-xs text-muted"
            >
              Cliente (si aplica)
            </label>
            <select
              id="cliente_id"
              name="cliente_id"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              <option value="">Ninguno</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="servicio"
              className="mb-1 block text-xs text-muted"
            >
              Servicio
            </label>
            <input
              id="servicio"
              name="servicio"
              type="text"
              placeholder="SEO, Ads..."
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <div>
            <label
              htmlFor="confianza"
              className="mb-1 block text-xs text-muted"
            >
              Confianza
            </label>
            <select
              id="confianza"
              name="confianza"
              defaultValue="Borrador"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              {CONFIANZAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="contenido"
            className="mb-1 block text-xs text-muted"
          >
            Contenido
          </label>
          <textarea
            id="contenido"
            name="contenido"
            rows={8}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}

        <button
          type="submit"
          className="mt-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Crear documento
        </button>
      </form>
    </div>
  );
}
