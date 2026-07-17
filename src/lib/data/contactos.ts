import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

// Para elegir un contacto ya existente al asociarlo a otro negocio
// (un contacto puede pertenecer a más de un negocio).
export async function getContactosParaSelect(
  supabase: SupabaseClient<Database>,
) {
  const { data, error } = await supabase
    .from("contactos")
    .select("id, nombre, email")
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
