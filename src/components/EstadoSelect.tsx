"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTareaEstado } from "@/app/actions";
import type { Database } from "@/lib/supabase/database.types";

type TareaEstado = Database["public"]["Enums"]["tarea_estado"];

const ESTADOS: TareaEstado[] = [
  "Backlog",
  "Esta semana",
  "Hoy",
  "En progreso",
  "Esperando cliente",
  "En revisión",
  "Hecho",
];

export function EstadoSelect({
  tareaId,
  estado,
}: {
  tareaId: string;
  estado: TareaEstado;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      value={estado}
      disabled={isPending}
      onChange={(e) => {
        const nuevoEstado = e.target.value as TareaEstado;
        startTransition(async () => {
          await updateTareaEstado(tareaId, nuevoEstado);
          router.refresh();
        });
      }}
      className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground outline-none focus:border-accent disabled:opacity-50"
    >
      {ESTADOS.map((e) => (
        <option key={e} value={e}>
          {e}
        </option>
      ))}
    </select>
  );
}
