import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type PasoSop = { texto: string; hecho: boolean };

// Vista SOPs (sección 6): galería agrupada por servicio.
export async function getSopsGaleria(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("v_sops_metricas")
    .select("*")
    .order("servicio", { ascending: true })
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getSopsParaSelect(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("sops")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
