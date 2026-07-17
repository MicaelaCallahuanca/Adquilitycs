"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type TareaEstado = Database["public"]["Enums"]["tarea_estado"];

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

// Toda tarea nueva entra a Backlog (sección 8: nunca directo a "Hoy",
// para forzar que compita con lo ya priorizado en vez de saltar la fila).
export async function createTarea(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("tareas").insert({
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
    estado: "Backlog",
  });

  if (error) {
    redirect(`/tareas/nueva?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/hoy");
}

export async function updateTareaEstado(id: string, estado: TareaEstado) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tareas")
    .update({ estado })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function createCliente(formData: FormData) {
  const supabase = await createClient();

  const servicios = formData
    .getAll("servicios_activos")
    .map(String)
    .filter(Boolean);

  const { error } = await supabase.from("clientes").insert({
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
  });

  if (error) {
    redirect(`/clientes/nuevo?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/clientes");
}
