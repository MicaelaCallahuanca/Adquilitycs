"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createScopeItem } from "./actions";
import type { ScopeOwner } from "@/lib/supabase/types";

export function NewScopeItemDialog({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [owner, setOwner] = useState<ScopeOwner>("agency");

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createScopeItem({
          organizationId,
          projectId,
          description: String(formData.get("description") ?? ""),
          owner,
        });
        setOpen(false);
      } catch {
        toast.error("No se pudo agregar el item de scope.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>Agregar</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo item de scope of work</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <Textarea
            name="description"
            placeholder="Que se va a hacer..."
            required
          />
          <Select value={owner} onValueChange={(v) => v && setOwner(v as ScopeOwner)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agency">Responsable: agencia</SelectItem>
              <SelectItem value="client">Responsable: cliente</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Guardando..." : "Agregar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
