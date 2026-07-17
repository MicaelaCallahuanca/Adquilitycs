import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClienteById } from "@/lib/data/clientes";
import { updateCliente, deleteCliente } from "@/app/actions";
import { ConfirmButton } from "@/components/ConfirmButton";

const TIPOS = ["Empresa fija", "Freelance", "Nuevo"];
const ESTADOS = ["Activo", "Onboarding", "En pausa", "Cerrado"];
const RIESGOS = ["Bajo", "Medio", "Alto"];
const SERVICIOS = ["SEO", "Ads", "Tracking", "CRO", "Automatizaciones", "IA"];

export default async function EditarClientePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const cliente = await getClienteById(supabase, id);

  if (!cliente) notFound();

  const updateClienteConId = updateCliente.bind(null, id);
  const deleteClienteConId = deleteCliente.bind(null, id);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-lg font-semibold text-foreground">
        Editar cliente
      </h1>

      <form action={updateClienteConId} className="mt-6 flex flex-col gap-4">
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
            defaultValue={cliente.nombre}
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
              defaultValue={cliente.tipo ?? ""}
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
              defaultValue={cliente.estado}
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
                  defaultChecked={cliente.servicios_activos.includes(s)}
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
              defaultValue={cliente.horas_contratadas_mes ?? ""}
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
              defaultValue={cliente.fee_mensual ?? ""}
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
              defaultValue={cliente.contacto_principal ?? ""}
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
              defaultValue={cliente.nivel_riesgo}
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
          Guardar cambios
        </button>
      </form>

      <form action={deleteClienteConId} className="mt-4">
        <ConfirmButton
          confirmText={`¿Eliminar "${cliente.nombre}"? Sus tareas quedan sin cliente asignado. Esta acción no se puede deshacer.`}
          className="text-xs text-danger hover:opacity-80"
        >
          Eliminar cliente
        </ConfirmButton>
      </form>
    </div>
  );
}
