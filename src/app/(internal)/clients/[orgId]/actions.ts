"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  FindingArea,
  FindingImpact,
  FindingStatus,
  ScopeOwner,
  TaskStatus,
} from "@/lib/supabase/types";

export async function createScopeItem(input: {
  organizationId: string;
  projectId: string;
  description: string;
  owner: ScopeOwner;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("scope_items").insert({
    project_id: input.projectId,
    description: input.description,
    owner: input.owner,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/clients/${input.organizationId}`);
}

export async function updateScopeItemStatus(
  organizationId: string,
  id: string,
  status: TaskStatus
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("scope_items")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/clients/${organizationId}`);
}

export async function createActivity(input: {
  organizationId: string;
  projectId: string;
  title: string;
  description: string;
  weekOf: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("activities").insert({
    project_id: input.projectId,
    title: input.title,
    description: input.description || null,
    week_of: input.weekOf || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/clients/${input.organizationId}`);
}

export async function updateActivityStatus(
  organizationId: string,
  id: string,
  status: TaskStatus
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("activities")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/clients/${organizationId}`);
}

export async function createFinding(input: {
  organizationId: string;
  projectId: string;
  area: FindingArea;
  problema: string;
  consecuencia: string;
  solucion: string;
  impacto: FindingImpact;
  prioridad: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("growth_findings").insert({
    project_id: input.projectId,
    area: input.area,
    problema: input.problema,
    consecuencia: input.consecuencia || null,
    solucion: input.solucion || null,
    impacto: input.impacto,
    prioridad: input.prioridad,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/clients/${input.organizationId}`);
}

export async function updateFindingStatus(
  organizationId: string,
  id: string,
  status: FindingStatus
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("growth_findings")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/clients/${organizationId}`);
}

export async function createMonthlyReport(input: {
  organizationId: string;
  projectId: string;
  periodMonth: number;
  periodYear: number;
  summary: string;
  leads: number | null;
  customers: number | null;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("monthly_reports").insert({
    project_id: input.projectId,
    period_month: input.periodMonth,
    period_year: input.periodYear,
    summary: input.summary || null,
    metrics: { leads: input.leads, customers: input.customers },
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/clients/${input.organizationId}`);
}
