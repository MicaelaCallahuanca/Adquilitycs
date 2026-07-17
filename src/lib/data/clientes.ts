import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function getClientesEnRiesgoCount(
  supabase: SupabaseClient<Database>,
) {
  const { count, error } = await supabase
    .from("clientes")
    .select("id", { count: "exact", head: true })
    .eq("nivel_riesgo", "Alto");

  if (error) throw error;
  return count ?? 0;
}

// Vista Directorio de Clientes (sección 6): nombre, tipo, estado,
// % capacidad, rentabilidad, riesgo.
export async function getClientesDirectorio(
  supabase: SupabaseClient<Database>,
) {
  const { data, error } = await supabase
    .from("v_clientes_metricas")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getClientesParaSelect(
  supabase: SupabaseClient<Database>,
) {
  const { data, error } = await supabase
    .from("clientes")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getClienteById(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}
