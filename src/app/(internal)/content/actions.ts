"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ContentPlatform } from "@/lib/supabase/types";

export async function createContentItem(input: {
  organizationId: string;
  title: string;
  platform: ContentPlatform;
  url: string;
  publishedAt: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("content_items").insert({
    organization_id: input.organizationId,
    title: input.title,
    platform: input.platform,
    url: input.url || null,
    published_at: input.publishedAt || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/content");
}
