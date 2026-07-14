"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/lib/supabase/types";

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", leadId);

  if (error) throw new Error(error.message);
  revalidatePath("/leads");
}

export async function addLeadNote(leadId: string, body: string) {
  if (!body.trim()) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("lead_notes").insert({
    lead_id: leadId,
    author_id: user?.id ?? null,
    body: body.trim(),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/leads");
}
