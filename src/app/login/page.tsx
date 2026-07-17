import { signIn } from "@/app/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-foreground">
          <span className="text-accent">Adquilitycs</span> OS
        </h1>
        <p className="mt-1 text-sm text-muted">
          Iniciá sesión para entrar al sistema.
        </p>

        <form action={signIn} className="mt-6 flex flex-col gap-3">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs text-muted"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}

          <button
            type="submit"
            className="mt-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
