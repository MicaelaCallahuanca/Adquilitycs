import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { SiteNav } from "@/components/site-nav";

const LINKS = [
  { href: "/leads", label: "Leads" },
  { href: "/content", label: "Contenido" },
  { href: "/clients", label: "Clientes" },
];

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();
  if (profile.role !== "internal") redirect("/portal");

  return (
    <div className="flex flex-1 flex-col">
      <SiteNav title="Adquilitycs · Interno" links={LINKS} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
