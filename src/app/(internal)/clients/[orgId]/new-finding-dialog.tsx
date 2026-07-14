"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { createFinding } from "./actions";
import type { FindingArea, FindingImpact } from "@/lib/supabase/types";

const AREA_OPTIONS: { value: FindingArea; label: string }[] = [
  { value: "adquisicion", label: "Adquisicion" },
  { value: "tracking", label: "Tracking" },
  { value: "analytics", label: "Analytics" },
  { value: "embudo", label: "Embudo" },
  { value: "landing_pages", label: "Landing Pages" },
  { value: "conversiones", label: "Conversiones" },
];

const IMPACT_OPTIONS: { value: FindingImpact; label: string }[] = [
  { value: "alto", label: "Alto" },
  { value: "medio", label: "Medio" },
  { value: "bajo", label: "Bajo" },
];

export function NewFindingDialog({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [area, setArea] = useState<FindingArea>("adquisicion");
  const [impacto, setImpacto] = useState<FindingImpact>("alto");

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createFinding({
          organizationId,
          projectId,
          area,
          problema: String(formData.get("problema") ?? ""),
          consecuencia: String(formData.get("consecuencia") ?? ""),
          solucion: String(formData.get("solucion") ?? ""),
          impacto,
          prioridad: Number(formData.get("prioridad") ?? 0),
        });
        setOpen(false);
      } catch {
        toast.error("No se pudo agregar el hallazgo.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>Agregar hallazgo</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo hallazgo (formula Adquilytics)</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Area</Label>
            <Select value={area} onValueChange={(v) => v && setArea(v as FindingArea)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AREA_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="problema">Problema</Label>
            <Textarea id="problema" name="problema" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="consecuencia">Consecuencia</Label>
            <Textarea id="consecuencia" name="consecuencia" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="solucion">Solucion</Label>
            <Textarea id="solucion" name="solucion" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Impacto estimado</Label>
              <Select
                value={impacto}
                onValueChange={(v) => v && setImpacto(v as FindingImpact)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IMPACT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prioridad">Prioridad</Label>
              <Input
                id="prioridad"
                name="prioridad"
                type="number"
                min={1}
                defaultValue={1}
              />
            </div>
          </div>

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
