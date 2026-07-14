-- Datos de ejemplo para probar el panel interno y el portal del cliente.
-- Correr despues de 0001_init.sql. No crea usuarios (eso se hace desde
-- Authentication > Users en el dashboard de Supabase, ver README).

with new_org as (
  insert into organizations (name) values ('Cliente Demo')
  returning id
),
new_project as (
  insert into projects (organization_id, name, status, started_at)
  select id, 'Auditoria de Crecimiento - Cliente Demo', 'active', current_date - interval '30 days'
  from new_org
  returning id, organization_id
),
new_content as (
  insert into content_items (organization_id, title, platform, url, published_at)
  select organization_id, v.title, v.platform, v.url, v.published_at
  from new_project,
    lateral (values
      ('Como generar leads con TikTok Ads', 'tiktok', 'https://tiktok.com/@demo/video/1', current_date - interval '20 days'),
      ('Guia SEO para landing pages', 'landing', 'https://cliente-demo.com/blog/seo-landing', current_date - interval '15 days')
    ) as v(title, platform, url, published_at)
  returning id, organization_id, title
)
insert into leads (organization_id, name, email, utm_source, utm_medium, utm_campaign, content_id, status)
select organization_id, v.name, v.email, v.utm_source, v.utm_medium, v.utm_campaign, id, v.status
from new_content,
  lateral (values
    ('Lead TikTok 1', 'lead1@example.com', 'tiktok', 'video', 'leads-organicos', 'new'),
    ('Lead TikTok 2', 'lead2@example.com', 'tiktok', 'video', 'leads-organicos', 'customer')
  ) as v(name, email, utm_source, utm_medium, utm_campaign, status)
where new_content.title = 'Como generar leads con TikTok Ads';

insert into scope_items (project_id, description, owner, status)
select id, v.description, v.owner, v.status
from projects,
  lateral (values
    ('Implementar eventos y conversiones en GA4/GTM', 'agency', 'in_progress'),
    ('Dar acceso a Google Ads y Meta Business Manager', 'client', 'pending')
  ) as v(description, owner, status)
where projects.name = 'Auditoria de Crecimiento - Cliente Demo';

insert into activities (project_id, title, description, week_of, status)
select id, v.title, v.description, v.week_of::date, v.status
from projects,
  lateral (values
    ('Kick off y solicitud de accesos', 'Llamada inicial + brief de comunicacion', current_date - interval '28 days', 'done'),
    ('Auditoria de tracking', 'Revisar GA4, GTM y formularios', current_date - interval '14 days', 'in_progress')
  ) as v(title, description, week_of, status)
where projects.name = 'Auditoria de Crecimiento - Cliente Demo';

insert into growth_findings (project_id, area, problema, consecuencia, solucion, impacto, prioridad, status)
select id, 'tracking', 'No existe medicion de formularios.', 'No se puede calcular el coste por lead.', 'Implementar eventos y conversiones en GA4 y GTM.', 'alto', 1, 'en_progreso'
from projects
where projects.name = 'Auditoria de Crecimiento - Cliente Demo';

insert into monthly_reports (project_id, period_month, period_year, summary, metrics)
select id, extract(month from current_date)::int, extract(year from current_date)::int,
  'Primer mes: kickoff completado, auditoria de tracking en curso.',
  '{"leads": 2, "customers": 1, "cost_per_lead": null}'::jsonb
from projects
where projects.name = 'Auditoria de Crecimiento - Cliente Demo';
