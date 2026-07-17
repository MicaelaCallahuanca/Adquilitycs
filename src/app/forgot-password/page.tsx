"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-foreground">
          <span className="text-accent">Adquilitycs</span> OS
        </h1>
        <p className="mt-1 text-sm text-muted">
          Ingresá tu email y te mandamos un enlace para fijar tu contraseña.
        </p>

        {status === "sent" ? (
          <p className="mt-6 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground">
            Listo — revisá {email} y seguí el enlace para elegir tu
            contraseña.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-xs text-muted"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </div>

            {status === "error" && (
              <p className="text-xs text-danger">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === "sending" ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        )}

        <Link
          href="/login"
          className="mt-4 inline-block text-xs text-muted hover:text-foreground"
        >
          ← Volver a iniciar sesión
        </Link>
      </div>
    </div>
  );
}
