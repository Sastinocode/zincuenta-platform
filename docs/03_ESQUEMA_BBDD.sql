-- ============================================================
-- ZINCUENTA PLATFORM — Esquema BBDD MVP v1.0
-- Proyecto Supabase NUEVO. Ejecutar Sebas manualmente, por bloques y en orden.
-- Prefijos: core_ crm_ ejer_ ses_ bm_   (reservados: gam_ onb_ move_)
-- ============================================================

-- ========== BLOQUE 1 · CORE ==========

create table public.core_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  email text not null unique,
  rol text not null check (rol in ('admin','gestion','entrenador')),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.core_clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellidos text,
  email text unique,                -- CLAVE DE CRUCE con todo el ecosistema
  telefono text,
  fecha_nacimiento date,
  sexo text check (sexo in ('M','F','otro')),
  entrenador_id uuid references public.core_profiles(id),
  estado text not null default 'activo' check (estado in ('activo','pausado','baja')),
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.core_salas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  pin text not null,                          -- PIN de emparejamiento
  device_token uuid not null default gen_random_uuid(),  -- token del dispositivo emparejado
  activa boolean not null default true
);

-- ========== BLOQUE 2 · CRM ==========

create table public.crm_seguimientos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.core_clientes(id) on delete cascade,
  autor_id uuid not null references public.core_profiles(id),
  tipo text not null default 'nota' check (tipo in ('nota','llamada','incidencia','revision')),
  texto text not null,
  created_at timestamptz not null default now()
);

-- ========== BLOQUE 3 · EJERCICIOTECA ==========
-- Columnas espejo del CSV rescatado (seed_exercises.csv, 137 filas, 28 campos)

create table public.ejer_ejercicios (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique,
  name_client text not null,
  name_technical text,
  short_description text,
  visual_description text,
  initial_position text,
  final_position text,
  key_action text,
  recommended_view text,
  exercise_family text,
  category text,
  body_zone text,
  primary_muscle text,
  secondary_muscles text,
  movement_pattern text,
  material_required text,
  difficulty text,
  intensity text,
  impact_level text,
  technical_risk text,
  space_needed text,
  duration_estimate_seconds int,
  reps_estimate text,
  suitable_for text,
  avoid_if text,
  status text not null default 'activo',
  source text,
  notes text,
  video_url text,                   -- Supabase Storage (bucket: ejercicios-media)
  imagen_url text,
  created_by uuid references public.core_profiles(id),
  created_at timestamptz not null default now()
);

create table public.ejer_patologias (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,      -- de las 17 fichas de patología Rezeta 50
  nombre text not null,
  descripcion text,
  zonas text[],                     -- zonas corporales afectadas
  recomendaciones text
);

create table public.ejer_contraindicaciones (
  ejercicio_id uuid not null references public.ejer_ejercicios(id) on delete cascade,
  patologia_id uuid not null references public.ejer_patologias(id) on delete cascade,
  nivel text not null check (nivel in ('evitar','precaucion')),
  motivo text,
  primary key (ejercicio_id, patologia_id)
);

-- ========== BLOQUE 4 · SESIONES ==========

create table public.ses_plantillas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  creador_id uuid not null references public.core_profiles(id),
  es_clinica boolean not null default false,   -- true = plantilla compartida de la clínica
  created_at timestamptz not null default now()
);

create table public.ses_sesiones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  plantilla_id uuid references public.ses_plantillas(id),
  entrenador_id uuid not null references public.core_profiles(id),
  sala_id uuid references public.core_salas(id),
  fecha_programada timestamptz,
  tipo text not null default 'individual' check (tipo in ('individual','grupo')),
  estado text not null default 'borrador'
    check (estado in ('borrador','programada','en_vivo','finalizada','cancelada')),
  created_at timestamptz not null default now()
);

-- Un bloque pertenece a una sesión O a una plantilla (exactamente una de las dos)
create table public.ses_bloques (
  id uuid primary key default gen_random_uuid(),
  sesion_id uuid references public.ses_sesiones(id) on delete cascade,
  plantilla_id uuid references public.ses_plantillas(id) on delete cascade,
  tipo text not null check (tipo in ('calentamiento','principal','vuelta_calma')),
  orden int not null default 0,
  check (num_nonnulls(sesion_id, plantilla_id) = 1)
);

create table public.ses_items (
  id uuid primary key default gen_random_uuid(),
  bloque_id uuid not null references public.ses_bloques(id) on delete cascade,
  ejercicio_id uuid not null references public.ejer_ejercicios(id),
  orden int not null default 0,
  series int,
  repeticiones int,
  tiempo_trabajo_seg int,
  descanso_seg int,
  peso text,
  notas text
);

create table public.ses_participantes (
  sesion_id uuid not null references public.ses_sesiones(id) on delete cascade,
  cliente_id uuid not null references public.core_clientes(id) on delete cascade,
  primary key (sesion_id, cliente_id)
);

create table public.ses_registros (
  id uuid primary key default gen_random_uuid(),
  sesion_id uuid not null references public.ses_sesiones(id),
  cliente_id uuid not null references public.core_clientes(id),
  completado boolean not null default true,
  rpe int check (rpe between 0 and 10),
  notas text,
  created_at timestamptz not null default now(),
  unique (sesion_id, cliente_id)
);

-- Estado en vivo: una fila por sesión, publicada por Realtime
create table public.ses_estado_vivo (
  sesion_id uuid primary key references public.ses_sesiones(id) on delete cascade,
  bloque_actual_id uuid references public.ses_bloques(id),
  item_actual_id uuid references public.ses_items(id),
  timer_estado text not null default 'parado'
    check (timer_estado in ('parado','trabajo','descanso','pausado')),
  timer_inicio timestamptz,
  timer_duracion_seg int,
  updated_at timestamptz not null default now()
);

alter publication supabase_realtime add table public.ses_estado_vivo;

-- ========== BLOQUE 5 · BODYMAP ==========

create table public.bm_evaluaciones (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.core_clientes(id) on delete cascade,
  token_acceso uuid unique default gen_random_uuid(), -- enlace de un solo uso
  estado text not null default 'pendiente' check (estado in ('pendiente','completada','caducada')),
  respuestas jsonb,
  zone_scores jsonb,          -- {"D1": 82, ... "D8": 45}
  global_score numeric,
  semaforo text check (semaforo in ('verde','amarillo','rojo')),
  red_flags jsonb,            -- [{codigo, descripcion}]
  notas_profesional text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.bm_cliente_patologias (
  cliente_id uuid not null references public.core_clientes(id) on delete cascade,
  patologia_id uuid not null references public.ejer_patologias(id) on delete cascade,
  origen text not null default 'manual' check (origen in ('bodymap','manual')),
  activa boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (cliente_id, patologia_id)
);

-- ========== BLOQUE 6 · RLS ==========

create or replace function public.core_rol() returns text
language sql stable security definer set search_path = public as
$$ select rol from public.core_profiles where id = auth.uid() $$;

-- Endurecimiento (aplicado en producción el 28-07-2026): solo usuarios logueados pueden llamarla
revoke execute on function public.core_rol() from anon;
revoke execute on function public.core_rol() from public;
grant execute on function public.core_rol() to authenticated;

alter table public.core_profiles enable row level security;
alter table public.core_clientes enable row level security;
alter table public.core_salas enable row level security;
alter table public.crm_seguimientos enable row level security;
alter table public.ejer_ejercicios enable row level security;
alter table public.ejer_patologias enable row level security;
alter table public.ejer_contraindicaciones enable row level security;
alter table public.ses_plantillas enable row level security;
alter table public.ses_sesiones enable row level security;
alter table public.ses_bloques enable row level security;
alter table public.ses_items enable row level security;
alter table public.ses_participantes enable row level security;
alter table public.ses_registros enable row level security;
alter table public.ses_estado_vivo enable row level security;
alter table public.bm_evaluaciones enable row level security;
alter table public.bm_cliente_patologias enable row level security;

-- Perfiles: cada uno ve el suyo; admin ve todos
create policy prof_self on public.core_profiles for select using (id = auth.uid() or public.core_rol() = 'admin');
create policy prof_admin on public.core_profiles for all using (public.core_rol() = 'admin');

-- Lectura general para staff autenticado
create policy staff_read_clientes on public.core_clientes for select using (public.core_rol() is not null);
create policy staff_read_ejercicios on public.ejer_ejercicios for select using (public.core_rol() is not null);
create policy staff_read_patologias on public.ejer_patologias for select using (public.core_rol() is not null);
create policy staff_read_contra on public.ejer_contraindicaciones for select using (public.core_rol() is not null);
create policy staff_read_plantillas on public.ses_plantillas for select using (public.core_rol() is not null);
create policy staff_read_sesiones on public.ses_sesiones for select using (public.core_rol() is not null);
create policy staff_read_bloques on public.ses_bloques for select using (public.core_rol() is not null);
create policy staff_read_items on public.ses_items for select using (public.core_rol() is not null);
create policy staff_read_participantes on public.ses_participantes for select using (public.core_rol() is not null);
create policy staff_read_registros on public.ses_registros for select using (public.core_rol() is not null);
create policy staff_read_vivo on public.ses_estado_vivo for select using (public.core_rol() is not null);
create policy staff_read_seguimientos on public.crm_seguimientos for select using (public.core_rol() is not null);
create policy staff_read_bm on public.bm_evaluaciones for select using (public.core_rol() in ('admin','entrenador'));
create policy staff_read_cliente_pat on public.bm_cliente_patologias for select using (public.core_rol() is not null);

-- Escritura clientes: admin y gestión; entrenador solo actualiza los suyos
create policy clientes_write on public.core_clientes for insert with check (public.core_rol() in ('admin','gestion'));
create policy clientes_update on public.core_clientes for update using (
  public.core_rol() in ('admin','gestion') or entrenador_id = auth.uid()
);

-- Ejercicioteca: escriben admin y entrenador
create policy ejer_write on public.ejer_ejercicios for insert with check (public.core_rol() in ('admin','entrenador'));
create policy ejer_update on public.ejer_ejercicios for update using (public.core_rol() = 'admin' or created_by = auth.uid());
create policy contra_write on public.ejer_contraindicaciones for all using (public.core_rol() in ('admin','entrenador'));
create policy patologias_admin on public.ejer_patologias for all using (public.core_rol() = 'admin');

-- Sesiones y plantillas: crea admin/entrenador; gestión puede programar (update fecha vía app)
create policy plantillas_write on public.ses_plantillas for all using (
  public.core_rol() = 'admin' or creador_id = auth.uid()
);
create policy sesiones_write on public.ses_sesiones for all using (
  public.core_rol() = 'admin' or entrenador_id = auth.uid()
);
create policy bloques_write on public.ses_bloques for all using (public.core_rol() in ('admin','entrenador'));
create policy items_write on public.ses_items for all using (public.core_rol() in ('admin','entrenador'));
create policy participantes_write on public.ses_participantes for all using (public.core_rol() in ('admin','entrenador','gestion'));
create policy registros_write on public.ses_registros for all using (public.core_rol() in ('admin','entrenador'));
create policy vivo_write on public.ses_estado_vivo for all using (public.core_rol() in ('admin','entrenador'));

-- CRM seguimientos
create policy seguimientos_write on public.crm_seguimientos for insert with check (public.core_rol() is not null);

-- BodyMAP: crean gestión/admin/entrenador; el cliente responde vía API (service role) con token
create policy bm_write on public.bm_evaluaciones for all using (public.core_rol() in ('admin','gestion','entrenador'));
create policy cliente_pat_write on public.bm_cliente_patologias for all using (public.core_rol() in ('admin','entrenador'));

-- Salas: solo admin (la pantalla accede vía API con service role + device_token)
create policy salas_admin on public.core_salas for all using (public.core_rol() = 'admin');

-- ========== BLOQUE 7 · ÍNDICES Y STORAGE ==========

create index idx_clientes_entrenador on public.core_clientes(entrenador_id);
create index idx_clientes_email on public.core_clientes(email);
create index idx_sesiones_entrenador on public.ses_sesiones(entrenador_id, fecha_programada);
create index idx_registros_cliente on public.ses_registros(cliente_id);
create index idx_bm_cliente on public.bm_evaluaciones(cliente_id, created_at desc);
create index idx_seguimientos_cliente on public.crm_seguimientos(cliente_id, created_at desc);

-- Crear en el panel de Storage: bucket "ejercicios-media" (público de lectura, escritura staff)
