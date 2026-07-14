# Adquilitycs — Plataforma interna

Next.js (App Router) + Supabase (Postgres + Auth). Conecta contenido → leads →
tracking → ventas para el equipo interno, y expone un portal de solo lectura
para cada cliente sobre su propio proyecto.

## 1. Crear el proyecto de Supabase (gratis)

1. Andá a [supabase.com](https://supabase.com), creá una cuenta y un proyecto nuevo.
2. En **Project Settings → API** copiá `Project URL`, `anon public key` y
   `service_role key`.
3. Copiá `.env.local.example` a `.env.local` y completá esos tres valores, mas
   un `LEADS_WEBHOOK_SECRET` (cualquier string aleatorio).

## 2. Cargar el esquema

En el **SQL Editor** de Supabase, corré en orden:

1. `supabase/migrations/0001_init.sql` — tablas, RLS, triggers.
2. (opcional) `supabase/seed.sql` — datos de ejemplo para probar la UI.

## 3. Crear tu primer usuario interno

1. En **Authentication → Users**, click "Add user" y creá un usuario con
   email/contraseña (esto ya crea automaticamente una fila en `profiles` via
   trigger, con `role = 'client'` por default).
2. En el **SQL Editor**, promovelo a interno:

   ```sql
   update profiles set role = 'internal' where id = '<user-id>';
   ```

3. Para crear un usuario de cliente (que solo debe ver su organizacion), creá
   el usuario de la misma forma y despues:

   ```sql
   update profiles set role = 'client', organization_id = '<organization-id>'
   where id = '<user-id>';
   ```

No hay todavia una UI de invitacion de usuarios — se gestiona a mano desde el
dashboard de Supabase hasta que se justifique construirla.

## 4. Correr la app

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). Redirige a `/login`, y
segun el rol del usuario que ingrese, a `/leads` (equipo interno) o `/portal`
(cliente).

## Estructura

- `/leads`, `/content`, `/clients` — panel interno (requiere `role = internal`).
- `/portal` — vista de solo lectura para clientes (requiere `role = client`).
- `/api/webhooks/leads` — endpoint publico para conectar formularios de
  landings. Requiere header `x-webhook-secret` igual a `LEADS_WEBHOOK_SECRET`.
  Body JSON: `{ organization_id, name, email, utm_source, utm_medium, utm_campaign, content_id }`.

## Pendiente (fuera del alcance de esta primera version)

- Automatizaciones por email (nuevo lead / lead sin responder) via
  [Resend](https://resend.com) (free tier) + Vercel Cron.
- UI de invitacion de usuarios (hoy se hace a mano en Supabase).

## Deploy

Vercel free tier. Configurar las mismas variables de `.env.local` en
Project Settings → Environment Variables.
