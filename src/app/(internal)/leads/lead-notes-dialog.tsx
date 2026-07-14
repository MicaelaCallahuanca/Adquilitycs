"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addLeadNote } from "./actions";

interface Note {
  id: string;
  body: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
}

export function LeadNotesDialog({ leadId }: { leadId: string }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, startTransition] = useTransition();

  async function loadNotes() {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${leadId}/notes`);
      const json = await res.json();
      setNotes(json.notes ?? []);
    } catch {
      toast.error("No se pudieron cargar las notas.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) loadNotes();
  }

  function handleAddNote() {
    if (!draft.trim()) return;
    startTransition(async () => {
      try {
        await addLeadNote(leadId, draft);
        setDraft("");
        await loadNotes();
      } catch {
        toast.error("No se pudo guardar la nota.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Notas
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notas del lead</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Agregar una nota..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button
            size="sm"
            className="self-end"
            disabled={pending || !draft.trim()}
            onClick={handleAddNote}
          >
            {pending ? "Guardando..." : "Guardar nota"}
          </Button>
        </div>

        <div className="flex max-h-72 flex-col gap-3 overflow-y-auto border-t pt-3">
          {loading && (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          )}
          {!loading && notes.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Todavia no hay notas.
            </p>
          )}
          {notes.map((note) => (
            <div key={note.id} className="text-sm">
              <p>{note.body}</p>
              <p className="text-xs text-muted-foreground">
                {note.profiles?.full_name ?? "Equipo"} ·{" "}
                {new Date(note.created_at).toLocaleString("es-AR")}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
