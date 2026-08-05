# Rescate y descarte — qué se aprovecha y qué se archiva

## ✅ SE RESCATA (ya copiado o localizado)

| Activo | De dónde | A dónde | Estado |
|---|---|---|---|
| 137 ejercicios (28 campos) | Repo REZETA50_REPO_READY → `supabase/seed/seed_exercises.csv` | `08_MVP_BUILD_PACK/seeds/` → tabla `ejer_ejercicios` en MP-4 | ✅ Copiado al pack |
| Aliases de ejercicios | mismo repo | `seeds/seed_exercise_aliases.csv` (útil para el buscador) | ✅ Copiado |
| 6 medallas + reglas de desbloqueo | mismo repo → `seed_badges.csv` | `seeds/` — se usará en Fase 2 (`gam_`) | ✅ Copiado |
| Motor de gamificación (esquema puntos/rachas/medallas) | mismo repo → `REZETA50_SUPABASE_SQL_SCHEMA.sql` + `docs/REZETA50_GAMIFICATION_SYSTEM.md` | Referencia para Fase 2 | Localizado |
| Especificación BodyMAP (D1–D8, scoring, semáforo, red flags) | `02_BODYMAP_ONBOARDING/BodyMAP_Zincuenta_Spec_v1.0.docx` | Copiar a `docs/` del repo antes de MP-3 | Localizado |
| 17 fichas de patología | Documentación Rezeta 50 (knowledge del proyecto) | Seed de `ejer_patologias` en MP-4 | Localizado |
| Roles admin/gestión/entrenador | Diseño CRM Zincuenta v2 | Incorporado al PRD y al esquema | ✅ Integrado |
| Patrón pantalla + PIN/firma | Z50Sing (Replit) | Patrón de interacción de `/pantalla` (no código) | ⚠️ Exportar el proyecto de Replit antes de que caduque |
| Protocolo onboarding 6 semanas + datos de Maribel | zincuenta-onboarding (`onb_`) | Migración en Fase 3, cruce por email | Sigue en producción — NO tocar |

## 🗄️ SE ARCHIVA (no borrar hasta terminar migración)

| Qué | Motivo | Acción |
|---|---|---|
| rezeta50.vercel.app (marzo) + Supabase "Rezeta 50" | Sustituido | Antes de archivar: comprobar si tiene usuarios reales (Decisión 1 del Plan Maestro) y exportar backup |
| Supabase "Rezeta50-miniapp" (mayo) | Vacío; el valor estaba en el repo, ya rescatado | Archivar tras backup |
| rezeta50-mvp (NextAuth + Prisma) | Arquitectura partida descartada; sus conceptos (coach/programa/RPE) ya están en el nuevo esquema `ses_` | Guardar ZIP y archivar |
| Z50Sing (Replit) | Es control horario, no sesiones | Exportar código fuente desde Replit y archivar |
| Resto de proyectos Supabase pausados | Fragmentación | Restaurar → backup → archivar |
| `_ARCHIVo_VERSIONES_ANTIGUAS` y docs superseded | Ya integrados en este pack | Nada que hacer |

## ⚠️ Pendientes manuales del Plan Maestro (siguen vigentes)

1. Comprobar que el CRM de Maribel (zincuenta-onboarding) sigue guardando datos — es producción real.
2. Pedir a soporte de Supabase la restauración de los proyectos pausados → exportar backup de cada uno.
3. Exportar Z50Sing desde Replit.
4. El nuevo proyecto Supabase del MVP NO depende de nada de esto: se puede arrancar hoy.
