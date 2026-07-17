import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function getSemanaActual(supabase: SupabaseClient<Database>) {
  const hoy = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("v_semanas_metricas")
    .select("*")
    .lte("semana_inicio", hoy)
    .gte("semana_fin", hoy)
    .maybeSingle();

  if (error) throw error;
  return data;
}
