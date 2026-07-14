import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeadsFilters } from "./leads-filters";
import { LeadStatusSelect } from "./lead-status-select";
import { LeadNotesDialog } from "./lead-notes-dialog";
import type { LeadStatus } from "@/lib/supabase/types";

interface LeadRow {
  id: string;
  name: string | null;
  email: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: LeadStatus;
  created_at: string;
  organization: { name: string } | null;
  content: { title: string } | null;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; organization_id?: string }>;
}) {
  const { status, organization_id } = await searchParams;
  const supabase = await createClient();

  const { data: organizations } = await supabase
    .from("organizations")
    .select("id, name")
    .order("name");

  let query = supabase
    .from("leads")
    .select(
      "id, name, email, utm_source, utm_medium, utm_campaign, status, created_at, organization:organizations(name), content:content_items(title)"
    )
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status as LeadStatus);
  if (organization_id) query = query.eq("organization_id", organization_id);

  const { data, error } = await query;
  const leads = (data ?? []) as unknown as LeadRow[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <LeadsFilters organizations={organizations ?? []} />
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fuente / UTM</TableHead>
              <TableHead>Contenido</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="font-medium">{lead.name ?? "Sin nombre"}</div>
                  <div className="text-sm text-muted-foreground">
                    {lead.email}
                  </div>
                </TableCell>
                <TableCell>{lead.organization?.name ?? "-"}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{lead.utm_source ?? "-"}</span>
                    <span className="text-muted-foreground">
                      {[lead.utm_medium, lead.utm_campaign]
                        .filter(Boolean)
                        .join(" / ")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{lead.content?.title ?? "-"}</TableCell>
                <TableCell>
                  <LeadStatusSelect leadId={lead.id} status={lead.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(lead.created_at).toLocaleDateString("es-AR")}
                </TableCell>
                <TableCell>
                  <LeadNotesDialog leadId={lead.id} />
                </TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  No hay leads todavia.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
