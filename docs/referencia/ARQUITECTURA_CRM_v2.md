# Arquitectura CRM Zincuenta v2 — Plan Completo

## Visión general

El CRM combina **dos fuentes de datos** que conviven en el mismo perfil de cliente, con **acceso diferenciado por rol** para recepción y entrenadores.

---

## Las dos fuentes de datos

### Fuente 1 — Formulario de alta (en tiempo real)
**Tabla:** `onb_clientes`
- Nombre, email, teléfono, fecha de nacimiento
- Cuestionario de salud: patologías, medicación, objetivos, nivel de actividad
- Datos de contacto de emergencia
- Consentimientos firmados
- **Se crea automáticamente** cuando el cliente rellena el formulario en recepción o online

### Fuente 2 — Excel mensual de Rezetabox (importación manual)
**Tabla:** `zin_payments`
- Email, tarifa contratada, fecha de pago
- Importe, forma de pago, factura
- Fecha de vencimiento del bono
- **Se importa una vez al mes** desde el Excel de Rezetabox

### La clave de cruce
`email` — es el campo que une ambas fuentes. Cuando un cliente entra por formulario y también aparece en el Excel, su perfil queda **completo y unificado automáticamente**.

---

## Tablas nuevas a crear en Supabase

### `crm_usuarios` — Usuarios del CRM con roles
```
id, email, nombre, rol (admin|recepcion|entrenador), activo, created_at
```
- Permite login diferenciado para cada empleado
- admin: acceso total + gestión de usuarios
- recepcion: acceso a todos los paneles excepto gestión de usuarios
- entrenador: solo perfil de cliente (sin datos de pago)

### `zin_mediciones` — Bioimpedancia por cliente
```
id, cliente_email, fecha, peso, grasa_corporal, masa_muscular,
imc, agua_corporal, metabolismo_basal, grasa_visceral, notas, entrenador_email
```
- Un registro por medición mensual
- Permite gráfica de evolución en el perfil del cliente

### `zin_notificaciones` — Notificaciones para entrenadores
```
id, tipo, cliente_email, cliente_nombre, mensaje,
destinatario_email (null=todos), leida, prioridad (alta|normal|baja), created_at
```
**Tipos de notificación:**
- `nuevo_cliente` — nuevo alta que necesita medición inicial
- `patologia` — cliente con condición especial (revisar antes del entreno)
- `revision` — recordatorio de seguimiento programado
- `evolucion` — tiempo para hacer medición mensual
- `mensaje_animo` — recordatorio de enviar WhatsApp de apoyo
- `renovacion` — cliente próximo a vencer bono

### `zin_notas` — Notas del entrenador por cliente
```
id, cliente_email, entrenador_email, nota,
tipo (general|salud|rendimiento|actitud|objetivo), created_at
```

---

## Estructura de roles y vistas

### Vista RECEPCIÓN / ADMIN
```
Sidebar:
  GENERAL
    ├── 📊 Dashboard       → KPIs financieros + semáforos retención
    ├── 🔔 Alertas         → Clientes sin pagar (urgente/aviso/nuevo)
    └── 👥 Clientes        → Lista completa con segmento y pago
  GESTIÓN
    ├── ✉  Mensajes        → Plantillas WhatsApp
    └── 📋 Protocolo       → Protocolo de retención Zincuenta
  DATOS
    └── ↑  Importar Excel  → Subida mensual desde Rezetabox
```

**Lo que ve de cada cliente:**
- Datos de contacto + cuestionario de salud
- Estado de pago + tarifa + días sin pagar
- Historial de pagos + importe total
- Bioimpedancia + evolución
- Notas del entrenador

---

### Vista ENTRENADOR
```
Sidebar:
  GENERAL
    ├── 🔔 Notificaciones  → Badge con pendientes (nuevo/patología/revisión)
    └── 👥 Mis Clientes    → Lista de clientes CON datos de salud (sin pagos)
```

**Lo que ve de cada cliente:**
- Datos de contacto básicos
- Cuestionario inicial completo (salud, objetivos, patologías)
- Bioimpedancia: gráfica de evolución + tabla de mediciones
- Sus propias notas + añadir nueva nota
- ❌ NO ve datos de pago, tarifas ni importes

**Notificaciones que recibe:**
- 🆕 "Nuevo cliente: Ana García — pendiente medición inicial"
- ⚠️ "Ojo: Carlos López tiene lumbalgia crónica — próxima sesión hoy"
- 📏 "Llevas 32 días sin medir a María Sánchez — toca revisión"
- 💪 "María lleva 90 días activa — envíale un mensaje de ánimo"

---

## El Perfil Unificado del Cliente

Cuando cualquier usuario (recepción o entrenador) hace clic en un cliente, se abre el perfil con pestañas adaptadas al rol:

```
┌─────────────────────────────────────────────────────────┐
│ [Avatar] ANA GARCÍA LÓPEZ                               │
│ ana@email.com  ·  +34 612 345 678  ·  ● Fiel            │
│ Tarifa: Zincuenta Avanzada  ·  Desde: 01/02/2025        │
└─────────────────────────────────────────────────────────┘

Pestañas:
[Salud] [Bioimpedancia] [Pagos*] [Notas] [Actividad]
                                 *solo para admin/recepción

Tab SALUD:
  - Datos del cuestionario: objetivos, patologías, medicación
  - Nivel de actividad previo, disponibilidad, preferencias

Tab BIOIMPEDANCIA:
  - Gráfica de evolución (peso, grasa, músculo últimos 12 meses)
  - Tabla con todas las mediciones
  - Botón "Añadir medición" (entrenadores y admin)

Tab PAGOS (solo recepción/admin):
  - Estado semáforo + días sin pagar
  - Historial de pagos importados desde Excel
  - Tarifa, importe, fechas, forma de pago

Tab NOTAS:
  - Notas del entrenador (tipo: general/salud/rendimiento/actitud/objetivo)
  - Cada nota con fecha y autor

Tab ACTIVIDAD:
  - Timeline de eventos: alta, pagos, mediciones, notas, alertas
```

---

## Flujo de datos integrado

```
Cliente rellena formulario
         ↓
  onb_clientes (form data)
         ↓
  Sistema detecta email nuevo
         ↓
  ¿Existe en zin_payments?
    SÍ → Perfil completo inmediato
    NO → Perfil parcial (solo form), se completa al importar Excel
         ↓
  Sistema genera notificación automática
    → "Nuevo cliente: [nombre] — pendiente medición inicial"
    → Enviada a todos los entrenadores

Admin importa Excel mensual
         ↓
  zin_payments (payment data)
         ↓
  Sistema cruza con onb_clientes por email
         ↓
  Perfiles actualizados con nuevo estado de pago
         ↓
  Semáforos de retención actualizados en Dashboard
```

---

## Implementación por fases

### FASE 1 — Inmediata (estos prompts)
- [ ] SQL: crear tablas nuevas en Supabase
- [ ] Login con roles (modificar sistema auth actual)
- [ ] Dashboard recepción: negro/dorado, datos completos
- [ ] Vista entrenador: mis clientes + perfil cliente
- [ ] Perfil unificado: cruce form + pagos

### FASE 2 — Siguiente sprint
- [ ] Sistema de notificaciones automáticas
- [ ] Registro de mediciones bioimpedancia desde CRM
- [ ] Gráficas de evolución por cliente
- [ ] Asignación de entrenador a cliente

### FASE 3 — Futuro
- [ ] App móvil entrenador (PWA)
- [ ] Integración WhatsApp Business API
- [ ] Dashboard de entrenador con carga de trabajo
- [ ] Exportación de informes de evolución

---

## Archivos a crear/modificar en Replit

### Nuevos archivos API
```
app/api/crm/auth/login/route.ts          → login con roles
app/api/crm/clientes/[email]/route.ts    → perfil unificado
app/api/crm/mediciones/route.ts          → CRUD bioimpedancia
app/api/crm/notificaciones/route.ts      → CRUD notificaciones
app/api/crm/usuarios/route.ts            → gestión usuarios (admin)
```

### Archivos a modificar
```
app/crm/page.tsx          → vista completa según rol
app/crm/login/page.tsx    → login con selector de rol
lib/crm-auth.ts           → añadir verificación de rol
```
