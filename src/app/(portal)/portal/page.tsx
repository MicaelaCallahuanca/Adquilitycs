import { requireProfile } from "@/lib/auth";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IMPACT_VARIANT: Record<string, "destructive" | "default" | "secondary"> = {
  alto: "destructive",
  medio: "default",
  bajo: "secondary",
};

export default async function PortalPage() {
  const profile = await requireProfile();

  if (!profile.organization_id) {
    return (
      <p className="text-muted-foreground">
        Tu cuenta todavia no esta asociada a ningun proyecto. Contactá a tu
        equipo de Adquilitycs.
      </p>
    );
  }

  const supabase = await createClient();

  const { data: organization } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("id", profile.organization_id)
    .single();

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, status, started_at")
    .eq("organization_id", profile.organization_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!project) {
    return (
      <p className="text-muted-foreground">
        Todavia no hay un proyecto activo para {organization?.name}.
      </p>
    );
  }

  const [{ data: scopeItems }, { data: activities }, { data: findings }, { data: reports }] =
    await Promise.all([
      supabase
        .from("scope_items")
        .select("id, description, owner, status")
        .eq("project_id", project.id)
        .order("created_at"),
      supabase
        .from("activities")
        .select("id, title, description, week_of, status")
        .eq("project_id", project.id)
        .order("week_of"),
      supabase
        .from("growth_findings")
        .select("id, area, problema, consecuencia, solucion, impacto, prioridad, status")
        .eq("project_id", project.id)
        .order("prioridad"),
      supabase
        .from("monthly_reports")
        .select("id, period_month, period_year, summary, metrics")
        .eq("project_id", project.id)
        .order("period_year", { ascending: false })
        .order("period_month", { ascending: false }),
    ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{organization?.name}</h1>
        <p className="text-sm text-muted-foreground">
          {project.name} · <Badge variant="secondary">{project.status}</Badge>
        </p>
      </div>

      <Tabs defaultValue="scope">
        <TabsList>
          <TabsTrigger value="scope">Scope of work</TabsTrigger>
          <TabsTrigger value="activities">Actividades</TabsTrigger>
          <TabsTrigger value="findings">Oportunidades priorizadas</TabsTrigger>
          <TabsTrigger value="reports">Reportes mensuales</TabsTrigger>
        </TabsList>

        <TabsContent value="scope">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripcion</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(scopeItems ?? []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Badge variant={item.owner === "agency" ? "default" : "outline"}>
                        {item.owner === "agency" ? "Agencia" : "Vos"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {(scopeItems ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                      Sin items de scope todavia.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="activities">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actividad</TableHead>
                  <TableHead>Semana</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(activities ?? []).map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="font-medium">{activity.title}</div>
                      {activity.description && (
                        <div className="text-sm text-muted-foreground">
                          {activity.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {activity.week_of
                        ? new Date(activity.week_of).toLocaleDateString("es-AR")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{activity.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {(activities ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                      Sin actividades todavia.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="findings" className="flex flex-col gap-3">
          {(findings ?? []).map((finding) => (
            <div key={finding.id} className="rounded-md border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary">{finding.area}</Badge>
                <Badge variant={IMPACT_VARIANT[finding.impacto]}>
                  Impacto {finding.impacto}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Prioridad {finding.prioridad}
                </span>
                <Badge variant="outline">{finding.status}</Badge>
              </div>
              <dl className="grid gap-1 text-sm">
                <div>
                  <dt className="font-medium">Problema</dt>
                  <dd className="text-muted-foreground">{finding.problema}</dd>
                </div>
                {finding.consecuencia && (
                  <div>
                    <dt className="font-medium">Consecuencia</dt>
                    <dd className="text-muted-foreground">{finding.consecuencia}</dd>
                  </div>
                )}
                {finding.solucion && (
                  <div>
                    <dt className="font-medium">Solucion</dt>
                    <dd className="text-muted-foreground">{finding.solucion}</dd>
                  </div>
                )}
              </dl>
            </div>
          ))}
          {(findings ?? []).length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              Sin hallazgos todavia.
            </p>
          )}
        </TabsContent>

        <TabsContent value="reports" className="flex flex-col gap-3">
          {(reports ?? []).map((report) => {
            const metrics = (report.metrics ?? {}) as {
              leads?: number;
              customers?: number;
            };
            return (
              <div key={report.id} className="rounded-md border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">
                    {report.period_month}/{report.period_year}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {metrics.leads ?? 0} leads · {metrics.customers ?? 0} clientes
                  </span>
                </div>
                {report.summary && (
                  <p className="text-sm text-muted-foreground">{report.summary}</p>
                )}
              </div>
            );
          })}
          {(reports ?? []).length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              Sin reportes todavia.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
