import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

// Fila única (sección 9): capacidad semanal por defecto para semanas nuevas.
export async function getConfiguracion(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("configuracion")
    .select("*")
    .eq("id", true)
    .single();

  if (error) throw error;
  return data;
}
