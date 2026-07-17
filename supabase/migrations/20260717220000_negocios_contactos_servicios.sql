-- Refactor del modelo de clientes:
--   * clientes -> negocios
--   * contacto_principal (text plano) -> contactos + negocio_contactos (N:N)
--   * servicios_activos[] + fee/horas planos -> negocio_servicios (1 fila por servicio contratado)

-- 1. Rename de tabla base -------------------------------------------------
alter table clientes rename to negocios;

-- 2. Tabla contactos -------------------------------------------------------
create table contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text,
  telefono text,
  rol text,
  created_at timestamptz not null default now()
);

alter table contactos enable row level security;

create policy authenticated_full_access on contactos
  for all to authenticated using (true) with check (true);

-- 3. Tabla puente negocio_contactos ----------------------------------------
create table negocio_contactos (
  negocio_id uuid not null references negocios(id) on delete cascade,
  contacto_id uuid not null references contactos(id) on delete cascade,
  es_principal boolean not null default false,
  primary key (negocio_id, contacto_id)
);

alter table negocio_contactos enable row level security;

create policy authenticated_full_access on negocio_contactos
  for all to authenticated using (true) with check (true);

-- 4. Tabla negocio_servicios -------------------------------------------------
create table negocio_servicios (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios(id) on delete cascade,
  servicio text not null,
  fecha_inicio date,
  fee_mensual numeric,
  horas_contratadas_mes numeric,
  created_at timestamptz not null default now()
);

alter table negocio_servicios enable row level security;

create policy authenticated_full_access on negocio_servicios
  for all to authenticated using (true) with check (true);

-- 5. Migración de datos existentes ------------------------------------------

-- contacto_principal (texto) -> contactos (dedupe por nombre) + negocio_contactos
insert into contactos (nombre)
select distinct contacto_principal
from negocios
where contacto_principal is not null and contacto_principal <> '';

insert into negocio_contactos (negocio_id, contacto_id, es_principal)
select n.id, c.id, true
from negocios n
join contactos c on c.nombre = n.contacto_principal
where n.contacto_principal is not null and n.contacto_principal <> '';

-- servicios_activos[] -> negocio_servicios (una fila por servicio).
-- fee_mensual/horas_contratadas_mes originales (globales por negocio) se
-- conservan enteros solo en la primera fila de cada negocio para que la
-- suma agregada por negocio_id no cambie el total respecto al modelo viejo.
insert into negocio_servicios (negocio_id, servicio, fecha_inicio, fee_mensual, horas_contratadas_mes)
select
  n.id,
  s.servicio,
  n.fecha_inicio,
  case when s.rn = 1 then n.fee_mensual else null end,
  case when s.rn = 1 then n.horas_contratadas_mes else null end
from negocios n
cross join lateral (
  select servicio, row_number() over () as rn
  from unnest(n.servicios_activos) as servicio
) s;

-- 6. Drop de la vista vieja (depende de las columnas que vamos a tirar) ------
drop view if exists v_clientes_metricas;

-- 7. Drop de columnas viejas ya migradas -------------------------------------
alter table negocios
  drop column contacto_principal,
  drop column servicios_activos;

-- 8. Recrear vista de métricas sobre el nuevo modelo -------------------------
create view v_negocios_metricas
with (security_invoker = true) as
select
  n.id,
  n.nombre,
  n.tipo,
  n.estado,
  n.fecha_inicio,
  n.proxima_fecha_clave,
  n.nivel_riesgo,
  n.created_at,
  n.updated_at,
  coalesce(s.servicios, '{}') as servicios_activos,
  coalesce(s.fee_mensual_total, 0) as fee_mensual,
  coalesce(s.horas_contratadas_mes_total, 0) as horas_contratadas_mes,
  coalesce(sum(t.esfuerzo_horas) filter (
    where date_trunc('month', t.created_at) = date_trunc('month', now())
  ), 0) as horas_consumidas_mes,
  round(
    coalesce(s.fee_mensual_total, 0)
    / (1 + coalesce(sum(t.esfuerzo_horas) filter (
        where date_trunc('month', t.created_at) = date_trunc('month', now())
      ), 0)),
    2
  ) as rentabilidad,
  case
    when coalesce(sum(t.esfuerzo_horas) filter (
      where date_trunc('month', t.created_at) = date_trunc('month', now())
    ), 0) > coalesce(s.horas_contratadas_mes_total, 0) * 1.15
      then '🔴 Excede contrato'
    when coalesce(sum(t.esfuerzo_horas) filter (
      where date_trunc('month', t.created_at) = date_trunc('month', now())
    ), 0) > coalesce(s.horas_contratadas_mes_total, 0)
      then '🟡 En el límite'
    else '🟢 OK'
  end as alerta_capacidad
from negocios n
left join lateral (
  select
    sum(ns.fee_mensual) as fee_mensual_total,
    sum(ns.horas_contratadas_mes) as horas_contratadas_mes_total,
    array_agg(ns.servicio) as servicios
  from negocio_servicios ns
  where ns.negocio_id = n.id
) s on true
left join tareas t on t.cliente_id = n.id
group by n.id, s.servicios, s.fee_mensual_total, s.horas_contratadas_mes_total;
