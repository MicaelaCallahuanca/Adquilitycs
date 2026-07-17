import Link from "next/link";
import { signOut } from "@/app/actions";

const LINKS_PRIMARIOS = [
  { href: "/", label: "🏠 Home" },
  { href: "/hoy", label: "📅 Hoy" },
  { href: "/semana", label: "🗂️ Semana" },
  { href: "/backlog", label: "📥 Backlog" },
  { href: "/clientes", label: "👥 Clientes" },
];

const LINKS_SECUNDARIOS = [
  { href: "/sops", label: "📚 SOPs" },
  { href: "/conocimiento", label: "🧠 Conocimiento" },
  { href: "/metricas", label: "📊 Métricas" },
  { href: "/configuracion", label: "⚙️ Configuración" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <nav className="flex items-center gap-1">
          {LINKS_PRIMARIOS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors">
              ···
            </summary>
            <div className="absolute left-0 top-full z-20 mt-1 flex w-44 flex-col gap-0.5 rounded-md border border-border bg-surface p-1 shadow-lg">
              {LINKS_SECUNDARIOS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-1.5 text-sm text-foreground hover:bg-surface-hover transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </details>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/tareas/nueva"
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            + Nueva tarea
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
