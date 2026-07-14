import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NewOrganizationDialog } from "./new-organization-dialog";
import type { ProjectStatus } from "@/lib/supabase/types";

interface OrganizationRow {
  id: string;
  name: string;
  created_at: string;
  projects: { status: ProjectStatus }[];
}

export default async function ClientsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, created_at, projects(status)")
    .order("name");

  const organizations = (data ?? []) as unknown as OrganizationRow[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <NewOrganizationDialog />
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Alta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell>
                  <Link
                    href={`/clients/${org.id}`}
                    className="font-medium hover:underline"
                  >
                    {org.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {org.projects.length > 0 ? (
                    <Badge variant="secondary">{org.projects[0].status}</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Sin proyecto
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(org.created_at).toLocaleDateString("es-AR")}
                </TableCell>
              </TableRow>
            ))}
            {organizations.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-8 text-center text-muted-foreground"
                >
                  Todavia no hay clientes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
