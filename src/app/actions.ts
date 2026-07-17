"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOrCrearSemanaActual } from "@/lib/data/semanas";
import type { Database } from "@/lib/supabase/database.types";

type TareaEstado = Database["public"]["Enums"]["tarea_estado"];

// Estados que anclan la tarea a la semana en curso (sección 2.1: "Semana
// ancla la tarea a una semana calendario"). Backlog queda fuera a propósito:
// una tarea en backlog todavía no fue asignada a ninguna semana.
const ESTADOS_ACTIVOS: TareaEstado[] = [
  "Esta semana",
  "Hoy",
  "En progreso",
  "Esperando cliente",
  "En revisión",
];

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

function optionalString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

function optionalNumber(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? Number(value) : null;
}

function tareaFieldsFromForm(formData: FormData) {
  return {
    nombre: String(formData.get("nombre") ?? ""),
    cliente_id: optionalString(formData, "cliente_id"),
    categoria: optionalString(
      formData,
      "categoria",
    ) as Database["public"]["Enums"]["tarea_categoria"] | null,
    subtipo: optionalString(formData, "subtipo"),
    impacto: optionalString(
      formData,
      "impacto",
    ) as Database["public"]["Enums"]["tarea_impacto"] | null,
    urgencia: optionalString(
      formData,
      "urgencia",
    ) as Database["public"]["Enums"]["tarea_urgencia"] | null,
    esfuerzo: optionalString(formData, "esfuerzo"),
    esfuerzo_horas: optionalNumber(formData, "esfuerzo_horas"),
    deadline_real: optionalString(formData, "deadline_real"),
    notas: optionalString(formData, "notas"),
    sop_id: optionalString(formData, "sop_id"),
  };
}

// Toda tarea nueva entra a Backlog (sección 8: nunca directo a "Hoy",
// para forzar que compita con lo ya priorizado en vez de saltar la fila).
export async function createTarea(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tareas")
    .insert({ ...tareaFieldsFromForm(formData), estado: "Backlog" });

  if (error) {
    redirect(`/tareas/nueva?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/hoy");
}

export async function updateTarea(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tareas")
    .update(tareaFieldsFromForm(formData))
    .eq("id", id);

  if (error) {
    redirect(`/tareas/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/hoy");
}

export async function deleteTarea(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tareas").delete().eq("id", id);

  if (error) throw error;

  revalidatePath("/", "layout");
  redirect("/hoy");
}

export async function updateTareaEstado(id: string, estado: TareaEstado) {
  const supabase = await createClient();

  const updates: Database["public"]["Tables"]["tareas"]["Update"] = { estado };

  if (ESTADOS_ACTIVOS.includes(estado)) {
    const { data: tarea } = await supabase
      .from("tareas")
      .select("semana_id")
      .eq("id", id)
      .single();

    if (tarea && !tarea.semana_id) {
      const semana = await getOrCrearSemanaActual(supabase);
      if (semana?.id) updates.semana_id = semana.id;
    }
  }

  const { error } = await supabase.from("tareas").update(updates).eq("id", id);

  if (error) throw error;

  revalidatePath("/", "layout");
}

// Revisión de viernes (sección 8, paso 5): marca la semana como revisada
// y guarda qué se aprendió / qué se movió.
export async function marcarRevisionViernes(formData: FormData) {
  const supabase = await createClient();
  const semanaId = String(formData.get("semana_id") ?? "");

  const { error } = await supabase
    .from("semanas")
    .update({
      revision_viernes_hecha: true,
      notas_revision: optionalString(formData, "notas_revision"),
    })
    .eq("id", semanaId);

  if (error) throw error;

  revalidatePath("/", "layout");
  redirect("/semana");
}

function clienteFieldsFromForm(formData: FormData) {
  const servicios = formData
    .getAll("servicios_activos")
    .map(String)
    .filter(Boolean);

  return {
    nombre: String(formData.get("nombre") ?? ""),
    tipo: optionalString(
      formData,
      "tipo",
    ) as Database["public"]["Enums"]["cliente_tipo"] | null,
    estado:
      (optionalString(
        formData,
        "estado",
      ) as Database["public"]["Enums"]["cliente_estado"] | null) ??
      "Onboarding",
    servicios_activos: servicios,
    horas_contratadas_mes: optionalNumber(formData, "horas_contratadas_mes"),
    fee_mensual: optionalNumber(formData, "fee_mensual"),
    contacto_principal: optionalString(formData, "contacto_principal"),
    nivel_riesgo:
      (optionalString(
        formData,
        "nivel_riesgo",
      ) as Database["public"]["Enums"]["nivel_riesgo"] | null) ?? "Bajo",
  };
}

export async function createCliente(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("clientes")
    .insert(clienteFieldsFromForm(formData));

  if (error) {
    redirect(`/clientes/nuevo?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/clientes");
}

export async function updateCliente(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("clientes")
    .update(clienteFieldsFromForm(formData))
    .eq("id", id);

  if (error) {
    redirect(`/clientes/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/clientes");
}

export async function deleteCliente(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("clientes").delete().eq("id", id);

  if (error) throw error;

  revalidatePath("/", "layout");
  redirect("/clientes");
}

// Los pasos se cargan como una lista de texto (una línea por paso) y se
// guardan como checklist embebido reutilizable (sección 2.3).
export async function createSop(formData: FormData) {
  const supabase = await createClient();

  const pasos = String(formData.get("pasos") ?? "")
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean)
    .map((texto) => ({ texto, hecho: false }));

  const { error } = await supabase.from("sops").insert({
    nombre: String(formData.get("nombre") ?? ""),
    servicio: optionalString(
      formData,
      "servicio",
    ) as Database["public"]["Enums"]["sop_servicio"] | null,
    tipo:
      (optionalString(
        formData,
        "tipo",
      ) as Database["public"]["Enums"]["sop_tipo"] | null) ?? "Proceso",
    pasos,
    dueño: optionalString(formData, "dueño"),
    estado:
      (optionalString(
        formData,
        "estado",
      ) as Database["public"]["Enums"]["sop_estado"] | null) ?? "Vigente",
  });

  if (error) {
    redirect(`/sops/nuevo?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/sops");
}
