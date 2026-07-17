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
