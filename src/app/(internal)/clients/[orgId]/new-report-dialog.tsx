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
import { createMonthlyReport } from "./actions";

const now = new Date();

export function NewReportDialog({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        const leads = formData.get("leads");
        const customers = formData.get("customers");
        await createMonthlyReport({
          organizationId,
          projectId,
          periodMonth: Number(formData.get("period_month")),
          periodYear: Number(formData.get("period_year")),
          summary: String(formData.get("summary") ?? ""),
          leads: leads ? Number(leads) : null,
          customers: customers ? Number(customers) : null,
        });
        setOpen(false);
      } catch {
        toast.error("No se pudo guardar el reporte.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>Nuevo reporte</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reporte mensual de crecimiento</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="period_month">Mes</Label>
              <Input
                id="period_month"
                name="period_month"
                type="number"
                min={1}
                max={12}
                defaultValue={now.getMonth() + 1}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="period_year">Año</Label>
              <Input
                id="period_year"
                name="period_year"
                type="number"
                defaultValue={now.getFullYear()}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="leads">Leads del mes</Label>
              <Input id="leads" name="leads" type="number" min={0} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="customers">Clientes generados</Label>
              <Input id="customers" name="customers" type="number" min={0} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="summary">Resumen</Label>
            <Textarea id="summary" name="summary" rows={4} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
