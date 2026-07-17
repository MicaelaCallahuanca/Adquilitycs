import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type ContactoRow = Database["public"]["Tables"]["contactos"]["Row"];
type NegocioServicioRow = Database["public"]["Tables"]["negocio_servicios"]["Row"];

export type NegocioDirectorioItem =
  Database["public"]["Views"]["v_negocios_metricas"]["Row"] & {
    contactos: { id: string; nombre: string; es_principal: boolean }[];
    servicios: { id: string; servicio: string }[];
  };

export type NegocioFicha = Database["public"]["Tables"]["negocios"]["Row"] & {
  negocio_contactos: { es_principal: boolean; contactos: ContactoRow | null }[];
  negocio_servicios: NegocioServicioRow[];
};

export async function getNegociosEnRiesgoCount(
  supabase: SupabaseClient<Database>,
) {
  const { count, error } = await supabase
    .from("negocios")
    .select("id", { count: "exact", head: true })
    .eq("nivel_riesgo", "Alto");

  if (error) throw error;
  return count ?? 0;
}

// Vista Directorio de Negocios (sección 6): nombre, tipo, estado,
// % capacidad, rentabilidad, riesgo, contactos y servicios contratados.
// Las métricas (rentabilidad, alerta de capacidad) salen de la vista
// v_negocios_metricas, que ya suma horas/fee desde negocio_servicios.
// Contactos y servicios se traen vía join sobre la tabla negocios.
export async function getNegociosDirectorio(
  supabase: SupabaseClient<Database>,
): Promise<NegocioDirectorioItem[]> {
  const [{ data: metricas, error: metricasError }, { data: relaciones, error: relacionesError }] =
    await Promise.all([
      supabase
        .from("v_negocios_metricas")
        .select("*")
        .order("nombre", { ascending: true }),
      supabase.from("negocios").select(
        `id,
        negocio_contactos ( es_principal, contactos ( id, nombre ) ),
        negocio_servicios ( id, servicio )`,
      ),
    ]);

  if (metricasError) throw metricasError;
  if (relacionesError) throw relacionesError;

  const relacionesPorNegocio = new Map(
    (relaciones ?? []).map((negocio) => [negocio.id, negocio]),
  );

  return (metricas ?? []).map((m) => {
    const relacion = m.id ? relacionesPorNegocio.get(m.id) : undefined;

    return {
      ...m,
      contactos: (relacion?.negocio_contactos ?? [])
        .filter((nc) => nc.contactos)
        .map((nc) => ({
          id: nc.contactos!.id,
          nombre: nc.contactos!.nombre,
          es_principal: nc.es_principal,
        })),
      servicios: (relacion?.negocio_servicios ?? []).map((s) => ({
        id: s.id,
        servicio: s.servicio,
      })),
    };
  });
}

export async function getNegociosParaSelect(
  supabase: SupabaseClient<Database>,
) {
  const { data, error } = await supabase
    .from("negocios")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// Ficha de negocio (sección 6): trae el negocio con sus contactos y
// servicios contratados vía join, para poder listarlos/editarlos.
export async function getNegocioById(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<NegocioFicha | null> {
  const { data, error } = await supabase
    .from("negocios")
    .select(
      `*,
      negocio_contactos ( es_principal, contactos ( * ) ),
      negocio_servicios ( * )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as NegocioFicha | null;
}
