# Adquilitycs OS — Sistema Operativo de Productividad

**Versión 1.0 — Diseño de producto para Notion**
Diseñado para escalar de 2 a 20+ clientes sin reorganizar la estructura base.

---

## 0. Filosofía del sistema

Antes de la arquitectura, tres decisiones de diseño que condicionan todo lo demás:

**Decisión 1 — El sistema no organiza clientes, organiza tiempo.**
La mayoría de sistemas de gestión de clientes fallan al escalar porque cada cliente nuevo es una carpeta nueva, una vista nueva, un proceso nuevo. Adquilitycs OS invierte la lógica: existe **una sola base de Tareas y una sola base de Clientes**, y el cliente es un *atributo* de la tarea, no un contenedor de ella. Esto significa que agregar el cliente #20 no crea ninguna estructura nueva — solo una fila nueva en una tabla. Esta es la decisión que permite el escalado real.

**Decisión 2 — La semana es la unidad atómica de planificación, el día es la unidad atómica de ejecución.**
No se planifica cliente por cliente. Se planifica la semana completa como un solo bloque de capacidad, y luego se asigna. Esto es lo que reduce la carga mental: en vez de preguntarte "¿qué necesita el Cliente A hoy? ¿y el Cliente B?", el sistema te pregunta una sola vez por semana "¿qué entra esta semana?" y una sola vez por día "¿qué hago ahora?".

**Decisión 3 — Ninguna vista debe requerir más de 2 clics desde el Dashboard.**
Esto es un principio de UX no negociable, tomado de Raycast: todo lo importante debe estar a un comando o un clic de distancia. Si una acción frecuente necesita 4 clics, el sistema está mal diseñado, no el usuario.

---

## 1. Arquitectura general

Arquitectura rediseñada respecto al ejemplo del brief. La diferencia clave: los clientes **no tienen sub-páginas propias** — todo cliente vive dentro de bases de datos centrales, filtradas. Solo existen 6 páginas de nivel superior.

```
Adquilitycs OS
│
├── 🏠 Home (Dashboard maestro)
│
├── 📅 Semana (motor operativo diario/semanal)
│   ├── Vista Hoy
│   ├── Vista Semana (Kanban)
│   └── Revisión de viernes
│
├── 🗂️ Backlog Maestro
│   ├── Backlog general
│   ├── Próxima semana
│   ├── En espera
│   └── Algún día
│
├── 👥 Clientes (base central, no páginas individuales)
│   ├── Vista Directorio
│   ├── Vista Ficha (por cliente, generada dinámicamente)
│   └── Vista Rentabilidad
│
├── 📚 Conocimiento
│   ├── SOPs (biblioteca de procesos)
│   ├── Templates
│   └── Documentación técnica por servicio
│
├── 📊 Métricas
│   ├── KPIs de negocio
│   ├── Capacidad semanal
│   └── Revisión mensual
│
└── ⚙️ Configuración
    ├── Horario laboral
    ├── Tipos de trabajo
    └── Reglas del sistema
```

**Por qué esta arquitectura y no la del brief:**
La estructura "Cliente > Dashboard > Semana > Backlog > SOPs > KPIs" que proponías originalmente duplica una sub-arquitectura completa por cada cliente. Con 2 clientes es manejable. Con 20, son 20 dashboards, 20 backlogs, 20 bibliotecas de SOPs que hay que mantener sincronizadas — es exactamente la reorganización que querías evitar. Al centralizar en bases de datos con propiedad `Cliente` como filtro, la "ficha de cliente" se genera con una vista filtrada, no con una página mantenida a mano.

---

## 2. Bases de datos (Data Model)

Seis bases de datos son el esqueleto de todo el sistema. Todo lo demás son vistas sobre ellas.

### 2.1 `Tareas` (la base central)

| Propiedad | Tipo | Notas |
|---|---|---|
| Nombre | Título | — |
| Cliente | Relación → `Clientes` | Puede estar vacío (tarea interna) |
| Categoría | Select | Producción / Comercial / Gestión / Formación |
| Subtipo | Select | SEO, Ads, Tracking, Automatización, Auditoría, Reporte, Propuesta, Onboarding, etc. |
| Estado | Select | Backlog · Esta semana · Hoy · En progreso · Esperando cliente · En revisión · Hecho |
| Impacto | Select | Alto / Medio / Bajo |
| Urgencia | Select | Hoy / Esta semana / Próxima semana |
| Esfuerzo | Select | 30min / 1h / 2h / 4h / n horas (número si es mayor) |
| Esfuerzo (horas) | Número | Valor numérico usado por fórmulas, aunque Esfuerzo sea select |
| Deadline real | Fecha | Fecha comprometida con el cliente |
| Deadline interno | Fórmula | `dateSubtract(prop("Deadline real"), 1 or 2, "days")` — ver 4.1 |
| Prioridad (score) | Fórmula | Ver 4.2 |
| Semana | Relación → `Semanas` (o fórmula basada en fecha) | Ancla la tarea a una semana calendario |
| SOP vinculado | Relación → `SOPs` | Si la tarea sigue un proceso estándar |
| Tiempo estimado vs real | Número / Rollup | Para medir precisión de estimación |
| Bloqueada por | Relación → `Tareas` (self-relation) | Dependencias |
| Notas | Texto enriquecido | — |

**Por qué "Esfuerzo" es select Y número:** el select te da fricción cero al cargar la tarea (eliges una etiqueta), pero las fórmulas de capacidad necesitan un número. Se resuelve con una fórmula que traduce el select a horas automáticamente.

### 2.2 `Clientes`

| Propiedad | Tipo | Notas |
|---|---|---|
| Nombre | Título | — |
| Tipo | Select | Empresa fija / Freelance / Nuevo |
| Servicios activos | Multi-select | SEO, Ads, Tracking, CRO, Automatizaciones, IA |
| Estado | Select | Activo / Onboarding / En pausa / Cerrado |
| Horas contratadas/mes | Número | — |
| Horas consumidas (mes) | Rollup | Suma de `Esfuerzo (horas)` de tareas del mes, vía `Tareas` |
| Rentabilidad | Fórmula | Ver 4.3 |
| Fee mensual | Número | — |
| Fecha de inicio | Fecha | — |
| Próxima fecha clave | Fecha | Renovación, revisión trimestral, etc. |
| Contacto principal | Texto | — |
| Documentación | Relación → `Conocimiento` | Docs específicos del cliente |
| Nivel de riesgo | Select | Bajo / Medio / Alto (churn risk, deuda de tareas, etc.) |

### 2.3 `SOPs`

| Propiedad | Tipo | Notas |
|---|---|---|
| Nombre | Título | — |
| Servicio | Select | SEO, Ads, Tracking, Auditoría, Onboarding, Reportes, Cierre mensual, Facturación, QA |
| Tipo | Select | Proceso / Checklist / Plantilla |
| Pasos | Sub-ítems o checklist embebido | Reutilizable como checklist en tareas |
| Última actualización | Fecha | — |
| Usado en (tareas) | Rollup ← `Tareas` | Cuántas veces se usó — mide qué tan crítico es el SOP |
| Dueño | Persona | Quién lo mantiene actualizado |
| Estado | Select | Vigente / Necesita revisión / Obsoleto |

### 2.4 `Semanas`

Base pequeña, una fila por semana calendario. Existe para poder hacer rollups agregados (capacidad, revisión de viernes) sin recalcular todo desde `Tareas` cada vez.

| Propiedad | Tipo | Notas |
|---|---|---|
| Semana (rango) | Fecha (rango) | Lunes a domingo |
| Tareas asignadas | Relación ← `Tareas` | — |
| Capacidad disponible (h) | Fórmula | Basada en `Configuración > Horario laboral` |
| Capacidad asignada (h) | Rollup | Suma de esfuerzo de tareas de la semana |
| % Capacidad usada | Fórmula | Ver 4.4 |
| Revisión de viernes hecha | Checkbox | — |
| Notas de revisión | Texto | Qué se aprendió, qué se movió |

### 2.5 `Tiempo` (registro de tiempo, opcional pero recomendado)

Permite que "tiempo estimado vs real" no sea una ilusión. Puede alimentarse manualmente o integrarse a futuro con un timer.

| Propiedad | Tipo |
|---|---|
| Tarea | Relación → `Tareas` |
| Fecha | Fecha |
| Horas registradas | Número |
| Tipo de trabajo | Select (heredado de la tarea) |

### 2.6 `Conocimiento`

Documentación técnica y de cliente, separada de los SOPs (los SOPs son *procesos repetibles*; Conocimiento es *contexto y referencia*).

| Propiedad | Tipo |
|---|---|
| Nombre | Título |
| Tipo | Select — Técnico / Cliente / Estratégico |
| Cliente (si aplica) | Relación → `Clientes` |
| Servicio | Select |
| Última actualización | Fecha |
| Confianza | Select — Verificado / Inferido / Borrador (ver nota abajo) |

> Nota de transparencia: cuando conviertas contenido de cursos/videos a documentación (como en el playbook que ya venís armando), la propiedad `Confianza` te permite marcar explícitamente qué quedó inferido vs. verificado contra la fuente — la misma práctica de transparencia que ya aplicás en tus playbooks se vuelve parte permanente del sistema, en vez de una nota puntual en un documento.

---

## 3. Relaciones entre bases de datos

```
Clientes ──┬─< Tareas >──┬── Semanas
           │             │
           ├─< Conocimiento
           │             │
           └─< Tiempo    └── SOPs (vía Tareas)

Tareas ── self-relation "Bloqueada por"
Tareas ──< Tiempo (registro real de horas)
SOPs ──< Tareas (cuántas tareas siguieron este proceso)
```

Todo el grafo converge en `Tareas`. Es la única base que se relaciona con las otras cinco — esto es intencional: significa que cualquier pregunta ("¿qué cliente consume más tiempo?", "¿qué SOP se usa más?") se responde con un rollup de una o dos saltos, nunca con una consulta manual.

---

## 4. Fórmulas recomendadas

### 4.1 Deadline interno automático
```
dateSubtract(prop("Deadline real"), if(prop("Impacto") == "Alto", 2, 1), "days")
```
Alto impacto se protege con 2 días de colchón; el resto, con 1 — coincide con tu regla pero la refina: cuanto más importa la tarea, más margen de error necesita.

### 4.2 Score de prioridad
Objetivo: una sola cifra que combine Impacto, Urgencia y Esfuerzo para poder **ordenar** el backlog sin pensar caso por caso.

```
(if(prop("Impacto") == "Alto", 3, if(prop("Impacto") == "Medio", 2, 1)) * 3
+ if(prop("Urgencia") == "Hoy", 3, if(prop("Urgencia") == "Esta semana", 2, 1)) * 3)
/ (1 + prop("Esfuerzo (horas)") / 4)
```
Lógica: impacto y urgencia suman puntos (peso igual, x3 cada uno); el esfuerzo divide el resultado — a igual impacto/urgencia, la tarea más corta gana. Esto favorece automáticamente "ganancias rápidas" sin que tengas que decidirlo manualmente cada vez. Ordenás cualquier vista por esta propiedad, de mayor a menor, y tenés tu lista de "qué hacer primero" sin negociar con vos mismo.

### 4.3 Rentabilidad por cliente
```
prop("Fee mensual") / (1 + prop("Horas consumidas (mes)"))
```
Fee por hora efectiva. Bajo → cliente que consume desproporcionadamente tiempo respecto a lo que paga. Es el número que responde directamente tu pregunta de revisión mensual "¿qué servicios son más rentables?" sin tener que cruzar tablas a mano.

### 4.4 % Capacidad usada
```
round(prop("Capacidad asignada (h)") / prop("Capacidad disponible (h)") * 100)
```
Con formato condicional: verde <80%, ámbar 80–100%, rojo >100% (sobrecarga). Este es el semáforo que evita que aceptes una tarea nueva sin darte cuenta de que ya estás al límite.

### 4.5 Alerta de sobrecarga de cliente (flag automático)
```
if(prop("Horas consumidas (mes)") > prop("Horas contratadas/mes") * 1.15, "🔴 Excede contrato", if(prop("Horas consumidas (mes)") > prop("Horas contratadas/mes"), "🟡 En el límite", "🟢 OK"))
```

---

## 5. Automatizaciones (Notion Automations / botones)

| Trigger | Acción |
|---|---|
| Tarea cambia a "Hecho" | Timestamp de cierre + notificación si tenía SOP vinculado, sugerir actualizar el SOP si tardó mucho más de lo estimado |
| Nueva tarea creada sin `Semana` asignada | Se agrega automáticamente al `Backlog general` |
| Es viernes 16:00 | Botón/recordatorio dispara la plantilla de Revisión Semanal (ver sección 8) |
| `% Capacidad usada` de la semana > 100% | Banner rojo en el Dashboard: "Semana sobrecargada — revisar antes de aceptar tareas nuevas" |
| Cliente cambia de "Onboarding" a "Activo" | Genera automáticamente el set de tareas iniciales según el SOP de Onboarding |
| Tarea con Deadline interno = hoy y Estado ≠ "Hecho" | Aparece destacada arriba de la Vista Hoy |
| Fin de mes | Botón dispara plantilla de Revisión Mensual con los rollups ya calculados |
| Tarea marcada "Esperando cliente" por más de 5 días | Flag automático para seguimiento — evita que se pierdan tareas colgadas |

Notion no permite lógica condicional compleja en sus automatizaciones nativas más allá de esto; para reglas más finas (como la alerta de sobrecarga de cliente) se recomienda una vista filtrada + formato condicional en vez de intentar forzar una automatización nativa.

---

## 6. Vistas por sección

**Vista Hoy** (Tareas, filtrada `Semana = actual` AND (`Estado` = Hoy o En progreso) OR `Deadline interno` = hoy)
Agrupada por Cliente, ordenada por Score de prioridad. Layout tipo lista, no Kanban — en "hoy" no necesitás ver columnas, necesitás ver una secuencia.

**Vista Semana** (Kanban por Estado)
Columnas: Backlog → Esta semana → Hoy → En progreso → Esperando cliente → En revisión → Hecho.
Cada card muestra: Cliente (color), Impacto (ícono), Esfuerzo, Deadline interno.

**Vista Backlog Maestro** (Tabla o Board por sub-bucket: General / Próxima semana / En espera / Algún día)
Ordenada por Score de prioridad descendente — así el backlog nunca es una lista caótica, siempre está pre-rankeado.

**Vista Directorio de Clientes** (Tabla/Galería)
Columnas visibles: Nombre, Tipo, Estado, % capacidad consumida del contrato, Rentabilidad, Riesgo.

**Vista Ficha de Cliente** (Linked view filtrada, no página independiente)
Al abrir un cliente desde el Directorio: sus tareas activas (linked view de `Tareas` filtrada), su documentación (linked view de `Conocimiento`), sus horas del mes. Se siente como una página dedicada sin serlo — es una vista.

**Vista SOPs** (Galería agrupada por Servicio)
Cada SOP como card con su checklist embebido, listo para duplicar dentro de una tarea.

**Vista Capacidad** (dentro de Métricas)
Barra de progreso por semana (actual + próximas 2), con el semáforo de la fórmula 4.4.

---

## 7. Dashboards, KPIs y widgets

### Dashboard maestro (Home)
Layout en 3 franjas, de arriba a abajo — inspirado en la jerarquía de YouTube Music (un elemento dominante arriba, contenido secundario debajo, nunca todo al mismo nivel):

1. **Franja superior — "Ahora"**: Vista Hoy embebida (linked view), 3-5 tareas máximo visibles sin scroll.
2. **Franja media — "Estado del sistema"**: 4 widgets en fila — % Capacidad usada (semana actual), tareas venciendo en 48h, clientes en riesgo (rollup de `Nivel de riesgo` = Alto), tareas "Esperando cliente" hace +5 días.
3. **Franja inferior — "Semana"**: Kanban compacto de la semana actual.

### KPIs de negocio (Métricas)
- Horas facturables vs. horas totales trabajadas (ratio de eficiencia comercial)
- Rentabilidad por cliente (fórmula 4.3), ordenado ascendente — para ver primero los que hay que revisar
- Tasa de cumplimiento de deadline interno (tareas cerradas antes del deadline interno / total)
- Distribución de tiempo por categoría (Producción / Comercial / Gestión / Formación) — gráfico de torta, detecta si la administración se está comiendo el tiempo de producción
- Tareas recurrentes sin SOP (candidatas a documentar)

### Widgets recomendados
- Reloj/fecha (contexto rápido, cero función)
- Botón "Nueva tarea rápida" con template pre-cargado (Categoría y Estado por defecto)
- Contador regresivo a la Revisión de Viernes
- Buscador embebido de SOPs

---

## 8. Flujo diario, semanal y mensual

### Flujo diario
1. Abrís Home → Franja "Ahora" te muestra qué hacer, ya ordenado. Cero decisión de "por dónde empiezo".
2. Marcás "En progreso" la tarea activa (una a la vez — el sistema no te impide tener varias, pero la UI premia el trabajo profundo mostrando solo una destacada).
3. Al cerrar, `Estado = Hecho` dispara timestamp y (si aplica) sugerencia de actualizar el SOP.
4. Cualquier tarea nueva que surge en el día entra directo al Backlog general — nunca directo a "Hoy", para forzar que compita con lo ya priorizado en vez de saltar la fila.

### Flujo semanal — Revisión de viernes (30–45 min)
Checklist fija (puede ser un SOP en sí mismo):
1. Revisar Vista Semana — mover lo no terminado a Próxima semana o Backlog general (nunca dejarlo "flotando" en Esta semana).
2. Inbox zero: toda tarea sin `Estado` definido se clasifica.
3. Revisar `% Capacidad usada` de la semana que cierra vs. lo real trabajado — ¿la estimación fue razonable?
4. Pre-armar la semana próxima: mover del Backlog Maestro (ya ordenado por Score) las tareas que entran, hasta llenar ~80% de la capacidad disponible (dejando el 20% de colchón para imprevistos, tal como pediste).
5. Marcar `Revisión de viernes hecha = true` en la base `Semanas`.

### Flujo mensual — Revisión mensual
Se apoya casi enteramente en rollups ya calculados, no en armar nada desde cero:
- ¿Qué cliente consume más tiempo? → ordenar `Clientes` por `Horas consumidas (mes)` descendente.
- ¿Qué tareas se repiten? → agrupar `Tareas` por Subtipo, contar.
- ¿Qué puedo automatizar/delegar? → cruzar "tareas recurrentes" con "sin SOP asociado" — esas son las candidatas.
- ¿Qué servicios son más rentables? → `Rentabilidad` (4.3) ordenado ascendente, revisar los más bajos primero.

---

## 9. Sistema de capacidad semanal

Configuración base (`Configuración > Horario laboral`), editable con botón "agregar día":

| Día | Bloques | Horas |
|---|---|---|
| Lunes | 06:30–12:30, 15:00–17:00 | 8h |
| Martes | 06:30–14:00, 16:00–18:00 | 9.5h |
| Miércoles | 06:30–12:30, 15:00–17:00 | 8h |
| Jueves | 06:30–12:30, 15:00–17:00 | 8h |
| Viernes | 06:30–12:30, 15:00–17:00 | 8h |

Capacidad semanal bruta ≈ 41.5h. Se recomienda reservar automáticamente:
- 15% para imprevistos (≈6h)
- Resto (≈35.5h) distribuible entre Producción / Comercial / Gestión / Formación

La distribución sugerida por categoría no es fija en el sistema (varía según la carga real de clientes), pero el Dashboard muestra la distribución real vs. una referencia editable, para detectar desvíos — por ejemplo, si Gestión empieza a superar el 20-25% de la semana, es señal de que algo debería automatizarse o delegarse.

---

## 10. Sistema de conocimiento y SOPs

Separación clave: **SOP = cómo se hace algo repetible. Conocimiento = qué necesitás saber sobre algo específico.**

- Un SOP de "Auditoría SEO" es un proceso: los mismos 12 pasos para cualquier cliente.
- Un documento en `Conocimiento` sobre "Cliente X — accesos y particularidades de su CMS" es contexto: no se repite en otro lado.

Esta separación evita el error común de mezclar procesos genéricos con notas específicas de cliente, que es lo que hace que las bibliotecas de conocimiento se vuelvan inmantenibles al escalar.

Cada SOP, al vincularse a una tarea, se puede duplicar como checklist embebido dentro de esa tarea — así la tarea "hereda" el proceso sin que tengas que tipearlo de nuevo, y el rollup `Usado en (tareas)` te dice objetivamente qué SOPs son realmente críticos (los más usados) vs. cuáles podrían no valer el mantenimiento.

---

## 11. UI / Branding aplicado a Notion

Notion tiene límites de personalización (no podés inyectar CSS custom nativo sin herramientas de terceros), así que la identidad de marca se traduce a las herramientas que Notion sí ofrece:

- **Fondos oscuros**: activar el modo oscuro nativo de Notion como base — se aproxima al `#0F1117`/`#161A22` mejor que el modo claro.
- **Accent naranja (#FF6B35)**: reservado exclusivamente para 3 usos, replicando la regla del "10% de la interfaz" — (1) el ícono/emoji de las páginas de nivel superior más importantes (Home, Semana), (2) los botones de acción rápida, (3) el color de tag para `Impacto = Alto` y `Urgencia = Hoy`. En ningún otro lugar.
- **Jerarquía tipográfica**: Notion no permite elegir Sora/Inter nativamente sin una extensión de navegador (ej. Notion Enhancer u otras — con las salvedades de estabilidad que eso implica). Si se prioriza estabilidad nativa, la jerarquía se logra con tamaño de encabezado (H1/H2/H3 nativos) + peso, no con la tipografía en sí.
- **Reducción de ruido visual**: nada de emojis decorativos en propiedades secundarias; solo en páginas de nivel superior (máximo 6, ya definidas en la arquitectura). Evitar cover images decorativas — usar color plano oscuro como cover, coherente con `#0F1117`.
- **Espacio en blanco**: usar toggles para contenido secundario (notas largas, contexto histórico) en vez de mostrarlo expandido — mantiene las páginas limpias por defecto, expandible bajo demanda.

---

## 12. Roadmap de implementación sugerido

No se recomienda montar las 6 bases y todas las automatizaciones el primer día — eso reintroduce la fricción que el sistema busca eliminar.

**Semana 1:** `Tareas` + `Clientes` + Vista Hoy + Vista Semana. Suficiente para operar.
**Semana 2:** `Semanas` + fórmulas de capacidad + Dashboard maestro.
**Semana 3:** `SOPs` migrando los procesos que ya existen (empezar por los 2-3 más usados, no los 20).
**Semana 4:** `Conocimiento` + `Tiempo` (si se decide llevar registro real) + Revisión mensual.

Este orden prioriza tener el motor operativo diario funcionando primero, y añade las capas de inteligencia (capacidad, SOPs, métricas) una vez que el uso diario ya es un hábito — es más fácil adoptar complejidad progresiva que abandonar un sistema que empezó siendo demasiado.
