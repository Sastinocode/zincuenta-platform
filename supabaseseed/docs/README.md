# zincuenta-onboarding

> Plataforma de captación, evaluación musculoesquelética y retención de clientes de **Zincuenta Sport Club**.

Proyecto complementario al ecosistema [Rezeta 50](https://github.com/rezeta50), centrado en el embudo de ventas: captura de lead → cuestionario BodyMAP → informe visual → recomendación de servicio → seguimiento CRM.

---

## ¿Qué hace este proyecto?

1. **Captura de lead** — el cliente rellena nombre, apellido, teléfono, email y cómo nos conoció.
2. **Cuestionario BodyMAP** — 5 bloques (Actividad Física, Lesiones previas, Dolor actual, Recuperación, Bienestar general) + mapa corporal interactivo con 14 zonas.
3. **Informe personalizado** — score global con semáforo verde/amarillo/rojo, radar de 5 dominios y recomendación de servicio (Readaptación, Entrenamiento Personal, Funcional, Pilates).
4. **Reevaluación** — enlace único por token que permite comparar progreso.
5. **CRM Maribel** — panel interno en `/crm` con pipeline de estado, registro de pago, recordatorios WhatsApp y log de acciones.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Estilos | Tailwind CSS (tokens personalizados) |
| Base de datos | Supabase (proyecto compartido ecosistema Rezeta) |
| Gráficos | Chart.js / react-chartjs-2 |
| Iconos | Lucide React |
| Tipografía | Plus Jakarta Sans + JetBrains Mono |
| Deploy | Vercel |
| UI dev | Replit |

---

## Estructura de carpetas

```
zincuenta-onboarding/
├── app/
│   ├── page.tsx                  # Bienvenida + captura de lead
│   ├── cuestionario/
│   │   └── page.tsx              # Bloques A–D + mapa corporal
│   ├── loading/
│   │   └── page.tsx              # Animación de análisis
│   ├── informe/
│   │   └── [token]/page.tsx      # Informe visual personalizado
│   ├── reevaluacion/
│   │   └── [token]/page.tsx      # Reevaluación comparativa
│   ├── crm/
│   │   ├── login/page.tsx        # Login protegido por contraseña
│   │   └── page.tsx              # Panel CRM Maribel
│   └── api/
│       ├── score/route.ts        # Cálculo scoring BodyMAP
│       └── crm/route.ts          # Endpoints CRUD CRM
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── ProgressBar.tsx
│   │   └── OptionCard.tsx
│   ├── BodyMap.tsx               # SVG interactivo 14 zonas
│   ├── RadarChart.tsx            # Gráfico radar 5 dominios
│   └── ScoreCircle.tsx           # Círculo animado score global
├── lib/
│   ├── supabase.ts               # Cliente Supabase
│   ├── scoring.ts                # Algoritmo BodyMAP + cascade
│   └── types.ts                  # Interfaces TypeScript
├── middleware.ts                  # Protección ruta /crm
├── .replit                        # Config Replit
├── replit.nix                     # Entorno Nix (Node 20)
└── .env.local                     # Variables de entorno (no subir a git)
```

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz con estas variables. En Replit, añádelas como **Secrets**.

```env
# Supabase (proyecto compartido ecosistema Rezeta 50)
NEXT_PUBLIC_SUPABASE_URL=https://cqvtbpyzdclhfxoyrstv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# CRM — contraseña de acceso para Maribel
CRM_PASSWORD=zincuenta2025

# URL pública del proyecto (para generar enlaces de informe)
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app
```

> ⚠️ Nunca subas `.env.local` a GitHub. Está incluido en `.gitignore`.

---

## Base de datos (Supabase)

Las tablas se crean con el SQL del prompt **R7b** de `PROMPTS_REPLIT_CRM_ADDENDUM.md`.

| Tabla | Descripción |
|---|---|
| `onb_clientes` | Lead + campos CRM (estado, pago, notas) |
| `bm_assessments` | Resultados BodyMAP por evaluación |
| `crm_acciones` | Log de acciones de Maribel |

Prefijo de tablas: `onb_` / `bm_` para convivir con el resto del ecosistema Rezeta.

---

## Cómo arrancar en Replit

1. Importa el repositorio GitHub en Replit (**Import from GitHub**).
2. Añade las variables de entorno en **Secrets**.
3. Replit detecta automáticamente Next.js y ejecuta `npm run dev`.
4. Usa los prompts de `PROMPTS_REPLIT_MVP.md` y `PROMPTS_REPLIT_CRM_ADDENDUM.md` para construir cada módulo.

### Orden de prompts recomendado

| Prompt | Módulo |
|---|---|
| R1b | Tipos TypeScript (LeadData, ClienteCRM…) |
| R2 | Componentes UI base |
| R3 | Cuestionario bloques A–D |
| R4 | Mapa corporal SVG |
| R5 | API de scoring |
| R6 | Informe visual |
| R7b | SQL Supabase + RLS |
| R8b | Pantalla de bienvenida + captura de lead |
| R9 | Panel CRM Maribel |

---

## Deploy en Vercel

```bash
# Conecta el repositorio en vercel.com
# Añade las variables de entorno en Settings > Environment Variables
# Vercel detecta Next.js automáticamente
```

El proyecto comparte el mismo proyecto Supabase (`cqvtbpyzdclhfxoyrstv`) con:
- `rezeta-prehab`
- `rezeta-move`
- `rezeta-movemarket`

Cada proyecto usa prefijos de tabla distintos para evitar colisiones.

---

## Compatibilidad con el ecosistema Rezeta 50

Este proyecto es **complementario, no dependiente**. Comparte:
- Mismo proyecto Supabase (base de datos compartida)
- Mismos tokens de diseño (colores, tipografía)
- Mismo workflow GitHub → Replit → Vercel

No importa código de otros proyectos Rezeta. La comunicación futura entre proyectos se hará vía Supabase (tablas compartidas) o Make.com (webhooks).

---

## Licencia

Proyecto privado — Zincuenta Sport Club © 2025
