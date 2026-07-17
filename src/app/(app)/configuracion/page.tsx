import { createClient } from "@/lib/supabase/server";
import { getConfiguracion } from "@/lib/data/configuracion";
import { updateConfiguracion } from "@/app/actions";

export default async function ConfiguracionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const configuracion = await getConfiguracion(supabase);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-lg font-semibold text-foreground">Configuración</h1>
      <p className="mt-1 text-sm text-muted">
        Capacidad semanal por defecto (sección 9) — se usa al crear
        automáticamente cada semana nueva. Las semanas ya creadas no cambian
        retroactivamente.
      </p>

      <form
        action={updateConfiguracion}
        className="mt-6 flex flex-col gap-4"
      >
        <div>
          <label
            htmlFor="capacidad_semanal_horas"
            className="mb-1 block text-xs text-muted"
          >
            Horas disponibles por semana
          </label>
          <input
            id="capacidad_semanal_horas"
            name="capacidad_semanal_horas"
            type="number"
            min="0"
            step="0.5"
            required
            defaultValue={configuracion.capacidad_semanal_horas}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
          <p className="mt-1 text-xs text-muted">
            Referencia del documento: ≈41.5h brutas, con ~15% reservado para
            imprevistos.
          </p>
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}

        <button
          type="submit"
          className="mt-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
