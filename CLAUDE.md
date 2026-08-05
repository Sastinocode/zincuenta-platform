# CLAUDE.md — zincuenta-platform

> Copiar este archivo a la raíz del repositorio antes del primer prompt de Claude Code.

## Qué es este proyecto

Plataforma interna única de Clínica Zincuenta (Cabezo de Torres, Murcia). MVP con 4 módulos: CRM de clientes para entrenadores, ejercicioteca (137 ejercicios), creador de sesiones + pantalla de sala en vivo, y cuestionario BodyMAP con semáforo. Idioma de toda la UI: **español**.

## Stack y reglas fijas

- Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui. Supabase (Postgres/Auth/Realtime/Storage). Vercel.
- **Prohibido**: Prisma, NextAuth, crear proyectos Supabase nuevos, crear tablas sin prefijo (`core_`, `crm_`, `ejer_`, `ses_`, `bm_`; reservados `gam_`, `onb_`, `move_`).
- **El SQL lo ejecuta Sebas a mano** en el editor de Supabase. Claude Code escribe los archivos en `supabase/migrations/` numerados y AVISA, nunca ejecuta migraciones ni asume que ya están aplicadas sin confirmación.
- Variables de entorno las gestiona Sebas en Vercel/.env.local. No inventar claves.
- Mobile-first en todo el área staff (los entrenadores usan el móvil); la pantalla de sala se diseña para TV (texto enorme, alto contraste, visible a 5 metros).

## Roles y accesos

- `admin` (Sebas): todo. `gestion` (Maribel): clientes, agenda, lanzar BodyMAP; no edita ejercicioteca. `entrenador`: sus clientes, sesiones, BodyMAP de sus clientes; nunca datos de pago.
- Pantalla de sala: sin login; emparejado por PIN → `device_token` guardado en localStorage; lecturas vía `/api/pantalla/*` con service role.
- El **email del cliente es la clave de cruce** con el resto del ecosistema Zincuenta.

## Patrones del dominio

- Sesión = bloques (`calentamiento` | `principal` | `vuelta_calma`) → items (ejercicio + series/reps/tiempo/descanso/peso).
- Estado en vivo en `ses_estado_vivo` (una fila por sesión) vía Supabase Realtime; el cronómetro corre en el cliente desde `timer_inicio + timer_duracion_seg`.
- Contraindicaciones: al añadir un ejercicio a una sesión con participantes, comprobar `bm_cliente_patologias` × `ejer_contraindicaciones` → aviso visual (`evitar` rojo, `precaucion` ámbar). Nunca bloquear: decide el profesional.
- BodyMAP: dominios D1–D8, ZoneScore/GlobalScore ponderado, semáforo verde/amarillo/rojo, red flags destacadas. Scoring en `src/lib/bodymap/scoring.ts`.
- Gamificación, QR cliente y app cliente son FASE 2+: no implementar, pero no cerrar puertas (los registros de sesión ya guardan lo necesario).

## Flujo de trabajo

- Construir siguiendo los Master Prompts (docs/05_MASTER_PROMPTS.md) en orden MP-0 → MP-8. No adelantar módulos.
- Al terminar cada MP: listar qué se creó, qué SQL debe ejecutar Sebas y cómo probarlo a mano.
- No recrear nada ya hecho; si algo existe, ampliarlo.
