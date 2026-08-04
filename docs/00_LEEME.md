# 08_MVP_BUILD_PACK — Cómo usar este paquete

**Qué es:** todo lo necesario para construir el MVP de la plataforma Zincuenta con Claude Code, en orden, sin volver a mirar los documentos antiguos. Sustituye como guía de construcción a los roadmaps anteriores (el Plan Maestro sigue vigente solo para el rescate de cuentas viejas).

## Contenido

| Archivo | Qué es |
|---|---|
| `01_PRD_MVP.md` | Qué construimos: 4 módulos, roles, criterios de éxito, roadmap futuro |
| `02_ARQUITECTURA.md` | Cómo: stack, estructura de repo, auth, realtime, reglas anti-fragmentación |
| `03_ESQUEMA_BBDD.sql` | La BBDD completa en 7 bloques — **la ejecutas tú a mano en Supabase** |
| `04_CLAUDE.md` | Memoria de proyecto → copiar a la **raíz del repo** |
| `05_MASTER_PROMPTS.md` | Los 9 prompts (MP-0 → MP-8) para Claude Code, con validación tras cada uno |
| `06_RESCATE_Y_DESCARTE.md` | Qué se aprovecha de lo viejo y qué se archiva |
| `seeds/` | Los 137 ejercicios, aliases y medallas rescatados del repo antiguo |

## Pasos para arrancar (tu parte manual, ~30 min)

1. **Supabase**: crear proyecto nuevo `zincuenta-platform` (org Sastinocode, región eu-west). Ejecutar `03_ESQUEMA_BBDD.sql` por bloques (1→7) en el SQL Editor. Crear bucket Storage `ejercicios-media`.
2. **GitHub**: crear repo `zincuenta-platform` vacío.
3. **Preparar el repo**: copiar `04_CLAUDE.md` como `CLAUDE.md` en la raíz + esta carpeta entera como `docs/` + `seeds/` a `supabase/seed/`. Añadir también la spec BodyMAP (`02_BODYMAP_ONBOARDING/BodyMAP_Zincuenta_Spec_v1.0.docx` convertida a md o pegada) a `docs/`.
4. **Claude Code**: abrir el repo y lanzar **MP-0** de `05_MASTER_PROMPTS.md`. Seguir en orden, validando cada MP antes del siguiente.
5. **Vercel**: al terminar MP-0, conectar el repo (cuenta sebasnocode) y poner las 3 env vars de `02_ARQUITECTURA.md`.

## Regla de oro

Una BBDD, un repo, una cuenta Vercel. Cualquier idea nueva → tabla nueva con prefijo en la misma BBDD, nunca un proyecto nuevo. Si dudas: `06_RESCATE_Y_DESCARTE.md` y las reglas de `02_ARQUITECTURA.md`.
