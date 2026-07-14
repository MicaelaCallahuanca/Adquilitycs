"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { createContentItem } from "./actions";
import type { ContentPlatform } from "@/lib/supabase/types";

const PLATFORM_OPTIONS: { value: ContentPlatform; label: string }[] = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "landing", label: "Landing page" },
  { value: "other", label: "Otro" },
];

export function NewContentDialog({
  organizations,
}: {
  organizations: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [organizationId, setOrganizationId] = useState("");
  const [platform, setPlatform] = useState<ContentPlatform>("tiktok");

  function handleSubmit(formData: FormData) {
    if (!organizationId) {
      toast.error("Elegi un cliente.");
      return;
    }

    startTransition(async () => {
      try {
        await createContentItem({
          organizationId,
          title: String(formData.get("title") ?? ""),
          platform,
          url: String(formData.get("url") ?? ""),
          publishedAt: String(formData.get("published_at") ?? ""),
        });
        setOpen(false);
      } catch {
        toast.error("No se pudo crear el contenido.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>Nuevo contenido</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo contenido</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Cliente</Label>
            <Select
              value={organizationId}
              onValueChange={(v) => setOrganizationId(v ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Elegi un cliente" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Titulo</Label>
            <Input id="title" name="title" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Plataforma</Label>
            <Select
              value={platform}
              onValueChange={(v) => v && setPlatform(v as ContentPlatform)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" name="url" type="url" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="published_at">Fecha de publicacion</Label>
            <Input id="published_at" name="published_at" type="date" />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Guardando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
