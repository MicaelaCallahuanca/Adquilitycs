import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type TareaConCliente =
  Database["public"]["Tables"]["tareas"]["Row"] & {
    negocios: { nombre: string } | null;
  };

const TAREA_CON_CLIENTE_SELECT = "*, negocios ( nombre )";

export async function getTareaById(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { data, error } = await supabase
    .from("tareas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Vista Hoy (sección 6): estado activo hoy, o con deadline interno vencido hoy.
export async function getTareasHoy(supabase: SupabaseClient<Database>) {
  const hoy = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("tareas")
    .select(TAREA_CON_CLIENTE_SELECT)
    .neq("estado", "Hecho")
    .or(`estado.in.(Hoy,En progreso),deadline_interno.eq.${hoy}`)
    .order("prioridad_score", { ascending: false, nullsFirst: false });

  if (error) throw error;
  return (data ?? []) as unknown as TareaConCliente[];
}

export async function getTareasVenciendo48h(supabase: SupabaseClient<Database>) {
  const hoy = new Date();
  const en48h = new Date(hoy.getTime() + 48 * 60 * 60 * 1000);
  const hoyStr = hoy.toISOString().slice(0, 10);
  const en48hStr = en48h.toISOString().slice(0, 10);

  const { count, error } = await supabase
    .from("tareas")
    .select("id", { count: "exact", head: true })
    .neq("estado", "Hecho")
    .gte("deadline_interno", hoyStr)
    .lte("deadline_interno", en48hStr);

  if (error) throw error;
  return count ?? 0;
}

export async function getTareasEsperandoClienteLargo(
  supabase: SupabaseClient<Database>,
) {
  const hace5dias = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("tareas")
    .select("id", { count: "exact", head: true })
    .eq("estado", "Esperando cliente")
    .lt("updated_at", hace5dias);

  if (error) throw error;
  return count ?? 0;
}

const KANBAN_ESTADOS = [
  "Backlog",
  "Esta semana",
  "Hoy",
  "En progreso",
  "Esperando cliente",
  "En revisión",
  "Hecho",
] as const;

async function getTareasKanban(
  supabase: SupabaseClient<Database>,
  estados: readonly (typeof KANBAN_ESTADOS)[number][],
) {
  const { data, error } = await supabase
    .from("tareas")
    .select(TAREA_CON_CLIENTE_SELECT)
    .in("estado", estados)
    .order("prioridad_score", { ascending: false, nullsFirst: false });

  if (error) throw error;
  const tareas = (data ?? []) as unknown as TareaConCliente[];

  return estados.map((estado) => ({
    estado,
    tareas: tareas.filter((t) => t.estado === estado),
  }));
}

// Kanban compacto de Home (franja "Semana"): trabajo activo, sin Backlog.
export function getTareasSemanaKanban(supabase: SupabaseClient<Database>) {
  return getTareasKanban(
    supabase,
    KANBAN_ESTADOS.filter((estado) => estado !== "Backlog"),
  );
}

// Vista Semana (sección 6): las 7 columnas completas, incluyendo Backlog.
export function getTareasKanbanCompleto(supabase: SupabaseClient<Database>) {
  return getTareasKanban(supabase, KANBAN_ESTADOS);
}

const BACKLOG_BUCKETS = [
  "General",
  "Próxima semana",
  "En espera",
  "Algún día",
] as const;

// Vista Backlog Maestro (secciones 1 y 6): tareas en Backlog, agrupadas por
// sub-bucket, ordenadas por score de prioridad descendente.
export async function getBacklogMaestro(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("tareas")
    .select(TAREA_CON_CLIENTE_SELECT)
    .eq("estado", "Backlog")
    .order("prioridad_score", { ascending: false, nullsFirst: false });

  if (error) throw error;
  const tareas = (data ?? []) as unknown as TareaConCliente[];

  return BACKLOG_BUCKETS.map((bucket) => ({
    bucket,
    tareas: tareas.filter((t) => t.backlog_bucket === bucket),
  }));
}
