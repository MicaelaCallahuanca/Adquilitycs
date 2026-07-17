import Link from "next/link";
import { signOut } from "@/app/actions";

const LINKS = [
  { href: "/", label: "🏠 Home" },
  { href: "/hoy", label: "📅 Hoy" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <nav className="flex items-center gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={signOut}>
          <button
            type="submit"
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </header>
  );
}
