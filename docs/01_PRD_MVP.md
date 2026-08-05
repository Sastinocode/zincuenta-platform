# PRD — MVP Plataforma Zincuenta (v1.0)

**Proyecto:** `zincuenta-platform` · **Fecha:** 22 julio 2026 · **Para construir con:** Claude Code

---

## 1. Visión en una frase

Una sola plataforma interna para Clínica Zincuenta donde los entrenadores gestionan a sus clientes (CRM), evalúan su estado con BodyMAP, crean sesiones de entrenamiento desde la ejercicioteca, y las lanzan en vivo en la pantalla de sala — todo sobre una única base de datos Supabase.

## 2. Decisiones cerradas (no reabrir)

| Decisión | Elección |
|---|---|
| Base de datos | Proyecto Supabase **NUEVO** limpio (eu-west, misma región que los antiguos). Los datos útiles de proyectos viejos se migran vía seeds. |
| Código | **Monorepo nuevo** `zincuenta-platform`: una sola app Next.js 14 con 4 módulos por rutas. Un solo despliegue en Vercel. |
| BodyMAP | **Integrado en flujo entrenador**: cuestionario en tablet/enlace → resultado con semáforo en ficha CRM → avisos de contraindicación en creador de sesiones. |
| Pantalla | **En vivo con mando remoto**: TV/tablet con PIN de sala, entrenador controla desde su móvil vía Supabase Realtime. |

## 3. Usuarios y roles

| Rol | Quién | Qué hace en el MVP |
|---|---|---|
| `admin` | Sebas | Todo: usuarios, ejercicioteca, clientes, sesiones, configuración salas |
| `gestion` | Maribel | Alta de clientes, lanzar cuestionario BodyMAP, ver agenda de sesiones. No edita ejercicioteca, no ve datos clínicos detallados |
| `entrenador` | Rogelio, Daniel, resto staff | Sus clientes, crear/lanzar sesiones, ver BodyMAP de sus clientes, registrar seguimiento. No ve datos de pago |
| Pantalla de sala | Dispositivo (TV/tablet) | Sin login personal. Acceso por PIN de sala + token de dispositivo. Solo muestra la sesión en vivo |

## 4. Los 4 módulos del MVP

### Módulo A — CRM de gestión (ruta `/crm`)
- Listado de clientes con búsqueda y filtros (estado, entrenador asignado, semáforo BodyMAP).
- Ficha de cliente: datos personales, entrenador asignado, patologías activas, último BodyMAP con semáforo D1–D8, historial de sesiones, notas de seguimiento.
- Alta/edición de cliente (gestión y admin). El **email es la clave de cruce** con el resto del ecosistema (mismo criterio que zincuenta-onboarding).
- Notas de seguimiento por cliente (autor, fecha, texto).
- Panel de entrenador: "mis clientes", clientes sin sesión reciente, BodyMAPs en rojo/amarillo pendientes de revisar.

### Módulo B — Ejercicioteca (ruta `/ejercicios`)
- Importa los **137 ejercicios rescatados** (28 campos: zona corporal, músculo principal/secundarios, patrón de movimiento, dificultad, riesgo técnico, apto para / evitar si…).
- Buscar y filtrar por zona corporal, familia, dificultad, material, patología.
- CRUD de ejercicios (admin y entrenador); cada ficha admite vídeo/GIF/foto (Supabase Storage).
- Tabla de contraindicaciones: ejercicio ↔ patología con nivel `evitar` o `precaucion`.

### Módulo C — Sesiones + Pantalla de sala (rutas `/sesiones` y `/pantalla`)
**Creador (el corazón del MVP):**
- Sesión por bloques: calentamiento → bloque principal → vuelta a la calma.
- Añadir ejercicios de la ejercicioteca con series, repeticiones, tiempo, descanso, peso y orden.
- Asignar a cliente individual o grupo; programar fecha/hora/sala; guardar como plantilla (propia o de clínica).
- **Aviso de contraindicación**: si un participante tiene una patología con contraindicación sobre un ejercicio añadido, aviso visual (no bloqueo — el criterio final es del profesional).

**Pantalla de sala:**
- PWA a pantalla completa: ejercicio actual en grande + media en bucle, cronómetro trabajo/descanso, siguiente ejercicio, progreso de la sesión.
- El entrenador controla desde su móvil: iniciar, pausar, avanzar, retroceder, saltar. Sincronización < 1 s vía Supabase Realtime.
- Acceso del dispositivo por PIN de sala; se mantiene emparejado con token.

**Historial:**
- Cada sesión finalizada queda registrada: participantes, ejercicios realizados, RPE (0–10) y notas por cliente.
- Buscable por cliente, fecha, entrenador. Visible en la ficha CRM del cliente.

### Módulo D — BodyMAP (ruta `/bodymap`)
- Cuestionario musculoesquelético D1–D8 (mismo modelo del Rezeta 50 original: mapa corporal, ZoneScore/GlobalScore ponderado, detección de red flags).
- Se lanza desde gestión (tablet) o por enlace de un solo uso enviado al cliente.
- Resultado: semáforo verde/amarillo/rojo por dominio + global, guardado en la ficha del cliente.
- Red flag → alerta destacada al entrenador asignado y admin (patrón semáforo del proyecto Rezeta 50).
- Las patologías detectadas/confirmadas alimentan los avisos de contraindicación del creador de sesiones.

## 5. Fuera del MVP (roadmap posterior — el diseño lo deja preparado)

| Fase | Qué | Base ya preparada en el MVP |
|---|---|---|
| F2 | Gamificación clientes (puntos/rachas/medallas) | `ses_registros` alimenta el motor; seeds de badges rescatados; prefijo `gam_` reservado |
| F2 | QR en pantalla para que el cliente siga la sesión en su móvil | La pantalla ya emite estado por Realtime; solo falta la vista cliente |
| F3 | App cliente Rezeta 50 (retos, ejercicioteca pública) | Misma BBDD, mismas tablas `ejer_` |
| F3 | Migración datos onboarding de Maribel (`onb_`) | Cruce por email ya establecido |
| F4 | Move/marketplace, prehab por deporte, wearables, análisis de movimiento (MediaPipe) | Arquitectura modular por prefijos |

## 6. Criterios de éxito del MVP

1. Maribel da de alta un cliente y le lanza el BodyMAP en tablet en < 5 minutos.
2. Un entrenador monta una sesión de 8 ejercicios desde plantilla en < 3 minutos.
3. La pantalla de sala refleja los cambios del mando en menos de 1 segundo.
4. Un cliente con patología de hombro genera aviso al añadir press militar a su sesión.
5. Toda sesión impartida queda en el historial y visible en la ficha CRM.
6. Cero datos en proyectos Supabase distintos del nuevo: una sola base.
