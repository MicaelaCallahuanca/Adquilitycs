import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type TareaMetricas = Pick<
  Database["public"]["Tables"]["tareas"]["Row"],
  | "estado"
  | "categoria"
  | "subtipo"
  | "sop_id"
  | "cliente_id"
  | "esfuerzo_horas"
  | "deadline_interno"
  | "fecha_cierre"
>;

const CATEGORIAS = ["Producción", "Comercial", "Gestión", "Formación"] as const;

function sumEsfuerzo(tareas: TareaMetricas[]) {
  return tareas.reduce((sum, t) => sum + (t.esfuerzo_horas ?? 0), 0);
}

// Rentabilidad por cliente (4.3), ascendente — los que hay que revisar primero.
export async function getRentabilidadClientes(
  supabase: SupabaseClient<Database>,
) {
  const { data, error } = await supabase
    .from("v_negocios_metricas")
    .select("id, nombre, rentabilidad, horas_consumidas_mes")
    .not("rentabilidad", "is", null)
    .order("rentabilidad", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// KPIs de negocio (sección 7), derivados de un único fetch de tareas para
// no multiplicar round-trips: eficiencia comercial, cumplimiento de
// deadlines, distribución por categoría, y candidatas a documentar como SOP.
export async function getKpisOperativos(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("tareas")
    .select(
      "estado, categoria, subtipo, sop_id, cliente_id, esfuerzo_horas, deadline_interno, fecha_cierre",
    );

  if (error) throw error;
  const tareas = (data ?? []) as TareaMetricas[];
  const hechas = tareas.filter((t) => t.estado === "Hecho");

  const horasTotales = sumEsfuerzo(hechas);
  const horasFacturables = sumEsfuerzo(hechas.filter((t) => t.cliente_id));
  const pctFacturable =
    horasTotales > 0 ? Math.round((horasFacturables / horasTotales) * 100) : null;

  const conDeadline = hechas.filter((t) => t.deadline_interno);
  const cumplidas = conDeadline.filter(
    (t) => t.fecha_cierre && t.fecha_cierre.slice(0, 10) <= t.deadline_interno!,
  );
  const pctCumplimiento =
    conDeadline.length > 0
      ? Math.round((cumplidas.length / conDeadline.length) * 100)
      : null;

  const distribucion = CATEGORIAS.map((categoria) => ({
    categoria,
    horas: sumEsfuerzo(hechas.filter((t) => t.categoria === categoria)),
  }));

  const porSubtipo = new Map<
    string,
    { subtipo: string; total: number; conSop: number }
  >();
  for (const t of tareas) {
    if (!t.subtipo) continue;
    const entry = porSubtipo.get(t.subtipo) ?? {
      subtipo: t.subtipo,
      total: 0,
      conSop: 0,
    };
    entry.total += 1;
    if (t.sop_id) entry.conSop += 1;
    porSubtipo.set(t.subtipo, entry);
  }
  const tareasRecurrentesSinSop = [...porSubtipo.values()]
    .filter((c) => c.total >= 2 && c.conSop === 0)
    .sort((a, b) => b.total - a.total);

  return {
    horasTotales,
    horasFacturables,
    pctFacturable,
    pctCumplimiento,
    totalConDeadline: conDeadline.length,
    distribucion,
    tareasRecurrentesSinSop,
  };
}
