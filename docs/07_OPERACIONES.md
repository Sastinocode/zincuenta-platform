# 07_OPERACIONES — Notas operativas manuales

## Bootstrap del primer admin

Configuración → Usuarios (donde se da de alta al staff) solo es accesible para
quien ya tiene `rol='admin'` en `core_profiles`. El primer admin no puede
salir de ahí porque ese rol todavía no existe la primera vez — no es un bug
de la app, es la razón por la que este paso se hace a mano, una única vez:

1. Crear el usuario en Supabase → Authentication → Users (email + contraseña).
2. Insertar su fila en `core_profiles` desde el SQL Editor, con ese mismo
   `id` y `rol='admin'`.

Desde ahí, ese admin ya puede dar de alta a todo el resto del staff (incluido
otro admin) desde Configuración → Usuarios, sin volver a tocar Supabase a
mano.
