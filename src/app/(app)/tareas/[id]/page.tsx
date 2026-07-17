import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTareaById } from "@/lib/data/tareas";
import { getNegociosParaSelect } from "@/lib/data/negocios";
import { getSopsParaSelect } from "@/lib/data/sops";
import { updateTarea, deleteTarea } from "@/app/actions";
import { EsfuerzoField } from "@/components/EsfuerzoField";
import { ConfirmButton } from "@/components/ConfirmButton";

const CATEGORIAS = ["Producción", "Comercial", "Gestión", "Formación"];
const IMPACTOS = ["Alto", "Medio", "Bajo"];
const URGENCIAS = ["Hoy", "Esta semana", "Próxima semana"];

export default async function EditarTareaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const [tarea, clientes, sops] = await Promise.all([
    getTareaById(supabase, id),
    getNegociosParaSelect(supabase),
    getSopsParaSelect(supabase),
  ]);

  if (!tarea) notFound();

  const updateTareaConId = updateTarea.bind(null, id);
  const deleteTareaConId = deleteTarea.bind(null, id);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-lg font-semibold text-foreground">Editar tarea</h1>
      <p className="mt-1 text-sm text-muted">Estado: {tarea.estado}</p>

      <form action={updateTareaConId} className="mt-6 flex flex-col gap-4">
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
            defaultValue={tarea.nombre}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <div>
          <label
            htmlFor="cliente_id"
            className="mb-1 block text-xs text-muted"
          >
            Cliente
          </label>
          <select
            id="cliente_id"
            name="cliente_id"
            defaultValue={tarea.cliente_id ?? ""}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            <option value="">Interna (sin cliente)</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="categoria"
              className="mb-1 block text-xs text-muted"
            >
              Categoría
            </label>
            <select
              id="categoria"
              name="categoria"
              defaultValue={tarea.categoria ?? ""}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              <option value="">—</option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subtipo" className="mb-1 block text-xs text-muted">
              Subtipo
            </label>
            <input
              id="subtipo"
              name="subtipo"
              type="text"
              defaultValue={tarea.subtipo ?? ""}
              placeholder="SEO, Ads, Reporte..."
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="impacto" className="mb-1 block text-xs text-muted">
              Impacto
            </label>
            <select
              id="impacto"
              name="impacto"
              defaultValue={tarea.impacto ?? ""}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              <option value="">—</option>
              {IMPACTOS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="urgencia"
              className="mb-1 block text-xs text-muted"
            >
              Urgencia
            </label>
            <select
              id="urgencia"
              name="urgencia"
              defaultValue={tarea.urgencia ?? ""}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              <option value="">—</option>
              {URGENCIAS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="sop_id" className="mb-1 block text-xs text-muted">
            SOP vinculado
          </label>
          <select
            id="sop_id"
            name="sop_id"
            defaultValue={tarea.sop_id ?? ""}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            <option value="">Ninguno</option>
            {sops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <EsfuerzoField
          defaultEsfuerzo={tarea.esfuerzo}
          defaultHoras={tarea.esfuerzo_horas}
        />

        <div>
          <label
            htmlFor="deadline_real"
            className="mb-1 block text-xs text-muted"
          >
            Deadline real
          </label>
          <input
            id="deadline_real"
            name="deadline_real"
            type="date"
            defaultValue={tarea.deadline_real ?? ""}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="notas" className="mb-1 block text-xs text-muted">
            Notas
          </label>
          <textarea
            id="notas"
            name="notas"
            rows={3}
            defaultValue={tarea.notas ?? ""}
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

      <form action={deleteTareaConId} className="mt-4">
        <ConfirmButton
          confirmText={`¿Eliminar "${tarea.nombre}"? Esta acción no se puede deshacer.`}
          className="text-xs text-danger hover:opacity-80"
        >
          Eliminar tarea
        </ConfirmButton>
      </form>
    </div>
  );
}
