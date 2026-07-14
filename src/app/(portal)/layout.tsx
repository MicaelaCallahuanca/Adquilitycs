import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { SiteNav } from "@/components/site-nav";

const LINKS = [{ href: "/portal", label: "Mi proyecto" }];

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();
  if (profile.role !== "client") redirect("/leads");

  return (
    <div className="flex flex-1 flex-col">
      <SiteNav title="Adquilitycs · Portal" links={LINKS} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
