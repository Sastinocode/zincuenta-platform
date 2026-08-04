# Master Prompts — zincuenta-platform (MP-0 → MP-8)

> Copiar cada prompt en Claude Code **en orden**. No pasar al siguiente hasta validar el anterior.
> Antes de MP-0: repo GitHub creado, proyecto Supabase creado, CLAUDE.md en la raíz, este build pack copiado a `docs/`.

---

## MP-0 · Scaffold del proyecto

```
Lee CLAUDE.md y docs/02_ARQUITECTURA.md. Crea el scaffold de zincuenta-platform:
Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui, con la estructura de
carpetas exacta de la arquitectura. Configura los clientes Supabase
(browser/server/middleware) leyendo las env vars. Crea layout base con la
identidad visual: fondo claro profesional, acento verde Zincuenta, tipografía
legible; la pantalla de sala usará modo oscuro. Añade página de login por email
y contraseña con Supabase Auth y un middleware que proteja todo (staff) y
redirija a /login. No implementes módulos todavía. Termina listando cómo probar.
```

**Validación Sebas:** `npm run dev` arranca, login redirige, deploy inicial en Vercel funciona.

## MP-1 · Roles, perfiles y navegación

```
Implementa core_profiles (el SQL del Bloque 1 de docs/03_ESQUEMA_BBDD.sql ya
está aplicado — confírmame que lo he ejecutado antes de seguir). Al hacer
login, carga el perfil y su rol. Crea la navegación del área (staff) según rol:
admin ve todo (CRM, Ejercicios, Sesiones, BodyMAP, Configuración), recepcion ve
CRM/Agenda/BodyMAP, entrenador ve CRM/Ejercicios/Sesiones/BodyMAP. Añade en
Configuración (solo admin) la gestión de usuarios del staff y de salas
(core_salas: nombre y PIN). Páginas de módulos como placeholders.
```

**Validación:** crear los 4 usuarios reales (Sebas admin, Maribel recepción, Rogelio y Daniel entrenadores) y ver menús distintos.

## MP-2 · CRM de clientes

```
Implementa el módulo /crm completo según docs/01_PRD_MVP.md módulo A:
listado de clientes con búsqueda por nombre/email y filtros (estado, entrenador,
semáforo del último BodyMAP), alta y edición de cliente (email único como clave
de cruce), ficha de cliente con pestañas: Datos, BodyMAP (placeholder), Sesiones
(placeholder), Seguimiento (crm_seguimientos: añadir y listar notas). Panel
inicial del entrenador: mis clientes, clientes sin sesión en 14 días, BodyMAPs
rojo/amarillo sin revisar (estas dos últimas tarjetas pueden quedar preparadas
con datos vacíos). Mobile-first.
```

**Validación:** Maribel da de alta 3 clientes reales de prueba y los asigna a entrenadores.

## MP-3 · BodyMAP

```
Implementa el módulo /bodymap según el PRD módulo D. Cuestionario D1–D8 con mapa
corporal (usa la especificación de dominios y ponderación de
docs/BodyMAP_Zincuenta_Spec si está en docs/, si no, pídemela). Flujos: (1)
recepción lanza cuestionario en tablet para un cliente, (2) enlace de un solo
uso /q/[token] enviado al cliente. Scoring en src/lib/bodymap/scoring.ts:
ZoneScore por dominio, GlobalScore ponderado, semáforo verde/amarillo/rojo y
detección de red flags. Guardar en bm_evaluaciones vía API con service role
(el cliente no tiene login). Resultado visible en la pestaña BodyMAP de la ficha
CRM con semáforo por dominio y evolución si hay varias evaluaciones. Red flag →
banner rojo destacado en la ficha y en el panel del entrenador asignado.
Al confirmar patologías, escribir bm_cliente_patologias.
```

**Validación:** un cliente de prueba completa el cuestionario desde el enlace y el semáforo aparece en su ficha.

## MP-4 · Ejercicioteca

```
Implementa /ejercicios según el PRD módulo B. Importador inicial: página de admin
que lee supabase/seed/seed_exercises.csv (137 ejercicios, columnas espejo de
ejer_ejercicios) — o dame el SQL de importación para ejecutarlo yo. Listado con
buscador y filtros (zona corporal, familia, dificultad, material). Ficha de
ejercicio completa con subida de vídeo/GIF/foto a Storage (bucket
ejercicios-media). CRUD para admin/entrenador. Gestión de patologías (17 fichas,
seed en docs/) y de contraindicaciones ejercicio↔patología con nivel
evitar/precaucion desde la ficha del ejercicio.
```

**Validación:** los 137 ejercicios visibles y filtrables; subir un vídeo a un ejercicio; crear 2-3 contraindicaciones reales con criterio de Rogelio.

## MP-5 · Creador de sesiones y plantillas

```
Implementa el creador de sesiones en /sesiones según el PRD módulo C (parte
creador): nueva sesión con bloques calentamiento/principal/vuelta a la calma;
añadir ejercicios desde un buscador lateral de la ejercicioteca; por item:
series, repeticiones, tiempo de trabajo, descanso, peso, orden (drag & drop o
botones subir/bajar); asignar participantes (individual o grupo), fecha/hora y
sala; guardar como borrador, programar, o guardar como plantilla (propia o de
clínica con es_clinica). Crear sesión desde plantilla. AVISO DE
CONTRAINDICACIÓN: al añadir un ejercicio, cruzar patologías activas de los
participantes con ejer_contraindicaciones y mostrar aviso rojo (evitar) o ámbar
(precaución) sin bloquear. Agenda: vista de sesiones programadas por día.
```

**Validación:** Rogelio monta una sesión real de 8 ejercicios en menos de 3 minutos y el aviso de contraindicación salta con el cliente de prueba.

## MP-6 · Pantalla de sala + mando remoto

```
Implementa la pantalla de sala y el mando según el PRD módulo C (parte pantalla):

/pantalla: PWA instalable a pantalla completa, modo oscuro, SIN login. Primera
vez: pide PIN de sala → /api/pantalla/pair valida contra core_salas (service
role) y devuelve device_token que se guarda en localStorage. Estados: reposo
(logo + próximas sesiones de esa sala), y sesión en vivo: nombre del ejercicio
enorme, vídeo/imagen en bucle, series×reps o cronómetro trabajo/descanso
gigante con color (verde trabajo, rojo descanso), siguiente ejercicio, progreso
de bloques. Suscripción Realtime a ses_estado_vivo; el cronómetro corre en
cliente desde timer_inicio + timer_duracion_seg (una reconexión recupera el
estado exacto).

/sesiones/[id]/mando: vista móvil para el entrenador: iniciar sesión en vivo
(crea fila en ses_estado_vivo y pone estado en_vivo), avanzar/retroceder
ejercicio, iniciar/pausar cronómetro, saltar a descanso, finalizar sesión.
Cada acción actualiza ses_estado_vivo.

Al finalizar: formulario rápido de registro por participante (RPE 0–10 y notas)
→ ses_registros, y la sesión pasa a finalizada.
```

**Validación:** TV o tablet en sala con la pantalla emparejada; Rogelio lanza una sesión desde el móvil y los cambios se ven en menos de 1 segundo.

## MP-7 · Historial y cierre del círculo

```
Implementa el historial según el PRD módulo C (parte historial): en /sesiones,
pestaña Historial con filtros por cliente, entrenador y rango de fechas; detalle
de sesión finalizada (ejercicios, participantes, RPE, notas). En la ficha CRM
del cliente, pestaña Sesiones con su historial y RPE medio. Completa las
tarjetas del panel de entrenador de MP-2 con datos reales (clientes sin sesión
en 14 días, BodyMAPs sin revisar). Exportar historial de un cliente a CSV.
```

**Validación:** la sesión de prueba de MP-6 aparece en el historial y en la ficha del cliente.

## MP-8 · Pulido, seeds finales y despliegue

```
Revisión final: estados vacíos con textos claros en español, loading y errores
amables, favicon e iconos PWA, manifest de la pantalla de sala, revisión
mobile de todos los flujos, y un smoke test escrito en docs/QA_CHECKLIST.md con
los 6 criterios de éxito del PRD. Verifica que ninguna ruta staff es accesible
sin sesión y que /pantalla solo funciona emparejada. Prepara README con puesta
en marcha. Lista final de todo lo pendiente manual (env vars, buckets, seeds)
para que lo confirme antes del despliegue de producción.
```

**Validación:** los 6 criterios de éxito del PRD se cumplen con usuarios reales. → **MVP terminado.**

---

## Después del MVP (no prompts todavía — orden previsto)

F2: gamificación (`gam_`, motor rescatado + seed_badges.csv) · QR cliente en pantalla · F3: app cliente Rezeta 50 · migración datos `onb_` de Maribel · F4: Move, prehab, wearables.
