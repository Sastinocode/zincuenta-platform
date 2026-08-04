# Arquitectura técnica — zincuenta-platform (v1.0)

## 1. Stack (estándar del ecosistema, sin excepciones)

- **Next.js 14** (App Router, TypeScript) + **Tailwind CSS** + shadcn/ui
- **Supabase**: Postgres + Auth + Realtime + Storage — proyecto NUEVO único, región eu-west
- **Vercel**: un solo proyecto, cuenta única (sebasnocode)
- **GitHub**: un solo repo `zincuenta-platform`
- Nada de Prisma/NextAuth: se abandona la arquitectura partida de rezeta50-mvp. Supabase Auth + SQL directo en todo.

## 2. Estructura del repositorio

```
zincuenta-platform/
├── CLAUDE.md                  # memoria de proyecto (copiar de 04_CLAUDE.md)
├── src/
│   ├── app/
│   │   ├── (auth)/login/            # login staff (Supabase Auth email+password)
│   │   ├── (staff)/                 # layout con navegación por rol
│   │   │   ├── crm/                 # Módulo A: listado, ficha, seguimiento
│   │   │   ├── ejercicios/          # Módulo B: ejercicioteca
│   │   │   ├── sesiones/            # Módulo C: creador, agenda, historial
│   │   │   │   └── [id]/mando/      # mando remoto del entrenador (móvil)
│   │   │   └── bodymap/             # Módulo D: lanzar y revisar evaluaciones
│   │   ├── pantalla/                # PWA pantalla de sala (SIN login, PIN+token)
│   │   ├── q/[token]/               # cuestionario BodyMAP por enlace (cliente)
│   │   └── api/
│   │       ├── pantalla/            # endpoints con service role validando device_token
│   │       └── bodymap/             # scoring y enlaces de un solo uso
│   ├── components/                  # ui/ (shadcn), crm/, ejercicios/, sesiones/, pantalla/, bodymap/
│   ├── lib/
│   │   ├── supabase/                # client.ts, server.ts, middleware.ts
│   │   ├── bodymap/scoring.ts       # ZoneScore/GlobalScore D1–D8, red flags
│   │   └── types.ts                 # tipos generados de la BBDD
│   └── middleware.ts                # protección de rutas por rol
├── supabase/
│   ├── migrations/                  # SQL numerado — LO EJECUTA SEBAS A MANO
│   └── seed/                        # seed_exercises.csv (137), badges, patologías
└── docs/                            # este build pack copiado dentro del repo
```

**Por qué una sola app y no varias:** un despliegue, una config, cero fricción para Claude Code. Los módulos están separados por rutas y carpetas de componentes; si algún día hace falta separar la pantalla de sala o la app cliente, se extrae a otro proyecto Vercel apuntando a la misma Supabase (regla del ecosistema: la BBDD es una).

## 3. Autenticación y permisos

- **Staff**: Supabase Auth (email+password). El rol vive en `core_profiles.rol` (`admin` | `recepcion` | `entrenador`). Middleware redirige según rol; RLS refuerza en BBDD (defensa en dos capas).
- **Pantalla de sala**: sin login personal. Emparejado del dispositivo: se introduce el PIN de la sala una vez → el servidor entrega el `device_token` → queda guardado en el dispositivo. Las lecturas de la pantalla pasan por `/api/pantalla/*` con service role, validando el token. Así la RLS del resto de tablas se mantiene estricta.
- **Cliente (BodyMAP por enlace)**: token de un solo uso en `/q/[token]`, sin cuenta. El registro de cuentas de cliente llega en Fase 3 (app Rezeta 50).

## 4. Tiempo real (pantalla de sala)

- Tabla `ses_estado_vivo` (una fila por sesión en vivo) publicada en Supabase Realtime.
- Mando del entrenador → `UPDATE` de la fila → la pantalla (suscrita al canal) refleja el cambio al instante.
- El cronómetro corre **en el cliente** (pantalla) a partir de `timer_inicio + timer_duracion_seg`; la BBDD solo guarda transiciones. Así no hay tráfico por segundo y una reconexión recupera el estado exacto.

## 5. Reglas anti-fragmentación (del Plan Maestro — obligatorias)

1. **Una cuenta Vercel**, un proyecto para esta plataforma.
2. **Un solo Supabase de producción.** Nuevas funcionalidades = nuevas tablas con prefijo, jamás un proyecto Supabase nuevo.
3. Prefijos de tabla: `core_` (identidad/clientes/salas), `crm_`, `ejer_`, `ses_`, `bm_`. Reservados para el futuro: `gam_`, `onb_`, `move_`.
4. Antes de crear cualquier proyecto/repo/BBDD: comprobación de 30 segundos — "¿ya existe uno para esto?".
5. Los proyectos antiguos se **archivan, no se borran**, hasta terminar la migración (ver 06_RESCATE_Y_DESCARTE.md).
6. Nombres descriptivos: el proyecto se llama por lo que hace.

## 6. Variables de entorno (Vercel — las gestiona Sebas)

```
NEXT_PUBLIC_SUPABASE_URL=          # del proyecto NUEVO
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # solo server-side (API pantalla, seeds)
```

## 7. División de trabajo (patrón fijo del ecosistema)

- **Claude Code**: todo el código de la app, componentes, API routes.
- **Sebas (manual)**: crear el proyecto Supabase, ejecutar cada SQL de `supabase/migrations/` en el editor SQL, variables de entorno en Vercel, crear el repo GitHub, importar seeds CSV, validación humana de cada fase.
