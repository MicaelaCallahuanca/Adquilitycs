"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createOrganization(name: string) {
  if (!name.trim()) throw new Error("El nombre es obligatorio.");

  const supabase = await createClient();
  const { error } = await supabase.from("organizations").insert({ name: name.trim() });

  if (error) throw new Error(error.message);
  revalidatePath("/clients");
}

export async function createProject(input: {
  organizationId: string;
  name: string;
  startedAt: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert({
    organization_id: input.organizationId,
    name: input.name,
    started_at: input.startedAt || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/clients/${input.organizationId}`);
}
