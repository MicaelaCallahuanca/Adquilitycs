import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNegocioById } from "@/lib/data/negocios";
import { getContactosParaSelect } from "@/lib/data/contactos";
import { updateNegocio, deleteNegocio } from "@/app/actions";
import { ConfirmButton } from "@/components/ConfirmButton";
import { ContactosEditor, type ContactoFila } from "@/components/ContactosEditor";
import { ServiciosEditor, type ServicioFila } from "@/components/ServiciosEditor";

const TIPOS = ["Empresa fija", "Freelance", "Nuevo"];
const ESTADOS = ["Activo", "Onboarding", "En pausa", "Cerrado"];
const RIESGOS = ["Bajo", "Medio", "Alto"];

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
  const [negocio, contactosExistentes] = await Promise.all([
    getNegocioById(supabase, id),
    getContactosParaSelect(supabase),
  ]);

  if (!negocio) notFound();

  const updateNegocioConId = updateNegocio.bind(null, id);
  const deleteNegocioConId = deleteNegocio.bind(null, id);

  const contactosIniciales: ContactoFila[] = negocio.negocio_contactos
    .filter((nc) => nc.contactos)
    .map((nc, i) => ({
      key: `contacto-${i}`,
      contactoId: nc.contactos!.id,
      nombre: nc.contactos!.nombre,
      email: nc.contactos!.email ?? "",
      telefono: nc.contactos!.telefono ?? "",
      rol: nc.contactos!.rol ?? "",
    }));
  const principalIndex = negocio.negocio_contactos.findIndex(
    (nc) => nc.es_principal,
  );

  const serviciosIniciales: ServicioFila[] = negocio.negocio_servicios.map(
    (s, i) => ({
      key: `servicio-${i}`,
      servicio: s.servicio,
      fechaInicio: s.fecha_inicio ?? "",
      feeMensual: s.fee_mensual !== null ? String(s.fee_mensual) : "",
      horasContratadasMes:
        s.horas_contratadas_mes !== null ? String(s.horas_contratadas_mes) : "",
    }),
  );

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-lg font-semibold text-foreground">
        Editar negocio
      </h1>

      <form action={updateNegocioConId} className="mt-6 flex flex-col gap-4">
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
            defaultValue={negocio.nombre}
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
              defaultValue={negocio.tipo ?? ""}
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
              defaultValue={negocio.estado}
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
              defaultValue={negocio.fecha_inicio ?? ""}
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
              defaultValue={negocio.nivel_riesgo}
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
            defaultValue={negocio.proxima_fecha_clave ?? ""}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <ContactosEditor
          existentes={contactosExistentes}
          initial={contactosIniciales}
          initialPrincipalIndex={principalIndex >= 0 ? principalIndex : 0}
        />

        <ServiciosEditor initial={serviciosIniciales} />

        {error && <p className="text-xs text-danger">{error}</p>}

        <button
          type="submit"
          className="mt-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Guardar cambios
        </button>
      </form>

      <form action={deleteNegocioConId} className="mt-4">
        <ConfirmButton
          confirmText={`¿Eliminar "${negocio.nombre}"? Sus tareas quedan sin negocio asignado. Esta acción no se puede deshacer.`}
          className="text-xs text-danger hover:opacity-80"
        >
          Eliminar negocio
        </ConfirmButton>
      </form>
    </div>
  );
}
