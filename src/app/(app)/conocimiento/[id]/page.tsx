import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getConocimientoById } from "@/lib/data/conocimiento";
import { getNegociosParaSelect } from "@/lib/data/negocios";
import { updateConocimiento, deleteConocimiento } from "@/app/actions";
import { ConfirmButton } from "@/components/ConfirmButton";

const TIPOS = ["Técnico", "Cliente", "Estratégico"];
const CONFIANZAS = ["Verificado", "Inferido", "Borrador"];

export default async function EditarConocimientoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const [item, clientes] = await Promise.all([
    getConocimientoById(supabase, id),
    getNegociosParaSelect(supabase),
  ]);

  if (!item) notFound();

  const updateConocimientoConId = updateConocimiento.bind(null, id);
  const deleteConocimientoConId = deleteConocimiento.bind(null, id);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-lg font-semibold text-foreground">
        Editar documento
      </h1>
      <p className="mt-1 text-sm text-muted">
        Última actualización: {item.ultima_actualizacion}
      </p>

      <form
        action={updateConocimientoConId}
        className="mt-6 flex flex-col gap-4"
      >
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
            defaultValue={item.nombre}
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
              defaultValue={item.tipo ?? ""}
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
              defaultValue={item.cliente_id ?? ""}
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
              defaultValue={item.servicio ?? ""}
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
              defaultValue={item.confianza}
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
            defaultValue={item.contenido ?? ""}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}

        <button
          type="submit"
          className="mt-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Guardar cambios
        </button>
      </form>

      <form action={deleteConocimientoConId} className="mt-4">
        <ConfirmButton
          confirmText={`¿Eliminar "${item.nombre}"? Esta acción no se puede deshacer.`}
          className="text-xs text-danger hover:opacity-80"
        >
          Eliminar documento
        </ConfirmButton>
      </form>
    </div>
  );
}
