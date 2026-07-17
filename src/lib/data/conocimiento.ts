import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type ConocimientoConCliente =
  Database["public"]["Tables"]["conocimiento"]["Row"] & {
    clientes: { nombre: string } | null;
  };

export async function getConocimientoLista(
  supabase: SupabaseClient<Database>,
) {
  const { data, error } = await supabase
    .from("conocimiento")
    .select("*, clientes ( nombre )")
    .order("ultima_actualizacion", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as ConocimientoConCliente[];
}

export async function getConocimientoById(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { data, error } = await supabase
    .from("conocimiento")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}
