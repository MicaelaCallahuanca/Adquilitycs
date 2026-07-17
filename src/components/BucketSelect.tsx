"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTareaBacklogBucket } from "@/app/actions";
import type { Database } from "@/lib/supabase/database.types";

type TareaBacklogBucket = Database["public"]["Enums"]["tarea_backlog_bucket"];

const BUCKETS: TareaBacklogBucket[] = [
  "General",
  "Próxima semana",
  "En espera",
  "Algún día",
];

export function BucketSelect({
  tareaId,
  bucket,
}: {
  tareaId: string;
  bucket: TareaBacklogBucket;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      value={bucket}
      disabled={isPending}
      onChange={(e) => {
        const nuevoBucket = e.target.value as TareaBacklogBucket;
        startTransition(async () => {
          await updateTareaBacklogBucket(tareaId, nuevoBucket);
          router.refresh();
        });
      }}
      className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground outline-none focus:border-accent disabled:opacity-50"
    >
      {BUCKETS.map((b) => (
        <option key={b} value={b}>
          {b}
        </option>
      ))}
    </select>
  );
}
