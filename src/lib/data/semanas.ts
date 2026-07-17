import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { getConfiguracion } from "@/lib/data/configuracion";

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Lunes a domingo (sección 9), calculado en UTC para que sea determinístico
// sin importar dónde corra el server.
export function getRangoSemana(referencia: Date = new Date()) {
  const dia = referencia.getUTCDay(); // 0 (dom) .. 6 (sáb)
  const diffALunes = dia === 0 ? -6 : 1 - dia;

  const lunes = new Date(referencia);
  lunes.setUTCDate(referencia.getUTCDate() + diffALunes);

  const domingo = new Date(lunes);
  domingo.setUTCDate(lunes.getUTCDate() + 6);

  return { inicio: toISODate(lunes), fin: toISODate(domingo) };
}

export async function getSemanaActual(supabase: SupabaseClient<Database>) {
  const { inicio } = getRangoSemana();

  const { data, error } = await supabase
    .from("v_semanas_metricas")
    .select("*")
    .eq("semana_inicio", inicio)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Crea la fila de la semana actual si todavía no existe, usando la capacidad
// por defecto de Configuración (sección 9) — cero fricción: el Dashboard
// siempre tiene una semana activa sobre la que calcular capacidad, sin que
// haya que crearla a mano.
export async function getOrCrearSemanaActual(supabase: SupabaseClient<Database>) {
  const existente = await getSemanaActual(supabase);
  if (existente) return existente;

  const { inicio, fin } = getRangoSemana();
  const configuracion = await getConfiguracion(supabase);

  // upsert + ignoreDuplicates: si dos requests concurrentes llegan a crear
  // la misma semana, la segunda no rompe por el unique de semana_inicio.
  const { error } = await supabase
    .from("semanas")
    .upsert(
      {
        semana_inicio: inicio,
        semana_fin: fin,
        capacidad_disponible_h: configuracion.capacidad_semanal_horas,
      },
      { onConflict: "semana_inicio", ignoreDuplicates: true },
    );

  if (error) throw error;

  return getSemanaActual(supabase);
}

export async function getProximasSemanas(
  supabase: SupabaseClient<Database>,
  cantidad = 3,
) {
  const { inicio } = getRangoSemana();

  const { data, error } = await supabase
    .from("v_semanas_metricas")
    .select("*")
    .gte("semana_inicio", inicio)
    .order("semana_inicio", { ascending: true })
    .limit(cantidad);

  if (error) throw error;
  return data ?? [];
}
