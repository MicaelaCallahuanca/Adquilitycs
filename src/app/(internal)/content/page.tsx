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
import { NewContentDialog } from "./new-content-dialog";
import type { ContentPlatform } from "@/lib/supabase/types";

interface ContentRow {
  id: string;
  title: string;
  platform: ContentPlatform;
  url: string | null;
  published_at: string | null;
  organization: { name: string } | null;
}

export default async function ContentPage() {
  const supabase = await createClient();

  const [{ data: organizations }, { data: contentData, error }, { data: leads }] =
    await Promise.all([
      supabase.from("organizations").select("id, name").order("name"),
      supabase
        .from("content_items")
        .select("id, title, platform, url, published_at, organization:organizations(name)")
        .order("published_at", { ascending: false }),
      supabase.from("leads").select("content_id, status"),
    ]);

  const content = (contentData ?? []) as unknown as ContentRow[];

  const attribution = new Map<string, { leads: number; customers: number }>();
  for (const lead of leads ?? []) {
    if (!lead.content_id) continue;
    const current = attribution.get(lead.content_id) ?? { leads: 0, customers: 0 };
    current.leads += 1;
    if (lead.status === "customer") current.customers += 1;
    attribution.set(lead.content_id, current);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Contenido</h1>
        <NewContentDialog organizations={organizations ?? []} />
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titulo</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Publicado</TableHead>
              <TableHead>Leads generados</TableHead>
              <TableHead>Clientes generados</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.map((item) => {
              const stats = attribution.get(item.id) ?? { leads: 0, customers: 0 };
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium hover:underline"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <span className="font-medium">{item.title}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.platform}</Badge>
                  </TableCell>
                  <TableCell>{item.organization?.name ?? "-"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString("es-AR")
                      : "-"}
                  </TableCell>
                  <TableCell>{stats.leads}</TableCell>
                  <TableCell>{stats.customers}</TableCell>
                </TableRow>
              );
            })}
            {content.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  Todavia no hay contenido cargado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
