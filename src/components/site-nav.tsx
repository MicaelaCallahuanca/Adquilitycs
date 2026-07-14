import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/sign-out";

export function SiteNav({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="font-semibold">{title}</span>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={signOut}>
          <Button variant="ghost" size="sm" type="submit">
            Salir
          </Button>
        </form>
      </div>
    </header>
  );
}
