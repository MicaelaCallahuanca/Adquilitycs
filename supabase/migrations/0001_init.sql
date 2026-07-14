-- Adquilitycs platform schema
-- Correr en el SQL editor de Supabase (o via `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'client' check (role in ('internal', 'client')),
  organization_id uuid references organizations (id) on delete set null,
  created_at timestamptz not null default now()
);

create table content_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  title text not null,
  platform text not null check (platform in ('tiktok', 'instagram', 'youtube', 'landing', 'other')),
  url text,
  published_at date,
  created_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text,
  email text,
  phone text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  content_id uuid references content_items (id) on delete set null,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'customer', 'lost')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads (id) on delete cascade,
  author_id uuid references profiles (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  status text not null default 'kickoff' check (status in ('kickoff', 'active', 'paused', 'completed')),
  started_at date,
  created_at timestamptz not null default now()
);

create table scope_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  description text not null,
  owner text not null check (owner in ('agency', 'client')),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'done')),
  created_at timestamptz not null default now()
);

create table activities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  title text not null,
  description text,
  week_of date,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'done')),
  created_at timestamptz not null default now()
);

create table growth_findings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  area text not null check (area in ('adquisicion', 'tracking', 'analytics', 'embudo', 'landing_pages', 'conversiones')),
  problema text not null,
  consecuencia text,
  solucion text,
  impacto text not null check (impacto in ('alto', 'medio', 'bajo')),
  prioridad int not null default 0,
  status text not null default 'identificado' check (status in ('identificado', 'en_progreso', 'resuelto')),
  created_at timestamptz not null default now()
);

create table monthly_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  period_month int not null check (period_month between 1 and 12),
  period_year int not null,
  summary text,
  metrics jsonb,
  created_at timestamptz not null default now(),
  unique (project_id, period_month, period_year)
);

create index leads_organization_id_idx on leads (organization_id);
create index leads_content_id_idx on leads (content_id);
create index content_items_organization_id_idx on content_items (organization_id);
create index projects_organization_id_idx on projects (organization_id);
create index scope_items_project_id_idx on scope_items (project_id);
create index activities_project_id_idx on activities (project_id);
create index growth_findings_project_id_idx on growth_findings (project_id);
create index monthly_reports_project_id_idx on monthly_reports (project_id);
create index lead_notes_lead_id_idx on lead_notes (lead_id);

-- ---------------------------------------------------------------------------
-- Helpers (security definer para evitar recursion de RLS sobre profiles)
-- ---------------------------------------------------------------------------

create or replace function is_internal()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'internal'
  );
$$;

create or replace function current_org_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select organization_id from profiles where id = auth.uid();
$$;

-- Crea automaticamente un profile (rol 'client' por default) cuando se crea
-- un usuario en auth.users. El rol/organizacion se ajustan a mano despues
-- (ver README) hasta que exista una UI de invitacion de usuarios.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table content_items enable row level security;
alter table leads enable row level security;
alter table lead_notes enable row level security;
alter table projects enable row level security;
alter table scope_items enable row level security;
alter table activities enable row level security;
alter table growth_findings enable row level security;
alter table monthly_reports enable row level security;

-- profiles: cada quien ve/edita el propio; interno ve todos (para asignar notas, etc.)
create policy "profiles_select" on profiles for select
  using (id = auth.uid() or is_internal());
create policy "profiles_update_own" on profiles for update
  using (id = auth.uid());
create policy "profiles_internal_manage" on profiles for all
  using (is_internal()) with check (is_internal());

-- organizations: interno todo, cliente solo la propia
create policy "organizations_select" on organizations for select
  using (is_internal() or id = current_org_id());
create policy "organizations_internal_write" on organizations for all
  using (is_internal()) with check (is_internal());

-- content_items
create policy "content_items_select" on content_items for select
  using (is_internal() or organization_id = current_org_id());
create policy "content_items_internal_write" on content_items for all
  using (is_internal()) with check (is_internal());

-- leads
create policy "leads_select" on leads for select
  using (is_internal() or organization_id = current_org_id());
create policy "leads_internal_write" on leads for all
  using (is_internal()) with check (is_internal());

-- lead_notes: uso interno unicamente (no visibles en el portal del cliente)
create policy "lead_notes_internal_only" on lead_notes for all
  using (is_internal()) with check (is_internal());

-- projects
create policy "projects_select" on projects for select
  using (is_internal() or organization_id = current_org_id());
create policy "projects_internal_write" on projects for all
  using (is_internal()) with check (is_internal());

-- scope_items / activities / growth_findings / monthly_reports:
-- visibles para el cliente via el organization_id de su project
create policy "scope_items_select" on scope_items for select
  using (
    is_internal()
    or exists (
      select 1 from projects p
      where p.id = scope_items.project_id and p.organization_id = current_org_id()
    )
  );
create policy "scope_items_internal_write" on scope_items for all
  using (is_internal()) with check (is_internal());

create policy "activities_select" on activities for select
  using (
    is_internal()
    or exists (
      select 1 from projects p
      where p.id = activities.project_id and p.organization_id = current_org_id()
    )
  );
create policy "activities_internal_write" on activities for all
  using (is_internal()) with check (is_internal());

create policy "growth_findings_select" on growth_findings for select
  using (
    is_internal()
    or exists (
      select 1 from projects p
      where p.id = growth_findings.project_id and p.organization_id = current_org_id()
    )
  );
create policy "growth_findings_internal_write" on growth_findings for all
  using (is_internal()) with check (is_internal());

create policy "monthly_reports_select" on monthly_reports for select
  using (
    is_internal()
    or exists (
      select 1 from projects p
      where p.id = monthly_reports.project_id and p.organization_id = current_org_id()
    )
  );
create policy "monthly_reports_internal_write" on monthly_reports for all
  using (is_internal()) with check (is_internal());
