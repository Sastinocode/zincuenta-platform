"use server";

import { revalidatePath } from "next/cache";

import { requireRol, type Rol } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ROLES: Rol[] = ["admin", "gestion", "entrenador"];

function generarPasswordTemporal() {
  return (
    Math.random().toString(36).slice(-6) + Math.random().toString(36).slice(-6)
  );
}

export async function crearUsuarioStaff(formData: FormData) {
  await requireRol(["admin"]);

  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const rol = String(formData.get("rol") ?? "") as Rol;

  if (!nombre || !email || !ROLES.includes(rol)) {
    return { error: "Rellena nombre, email y rol." };
  }

  const password = generarPasswordTemporal();
  const admin = createAdminClient();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre },
  });

  if (createError || !created.user) {
    return { error: createError?.message ?? "No se pudo crear el usuario." };
  }

  const { error: profileError } = await admin.from("core_profiles").insert({
    id: created.user.id,
    nombre,
    email,
    rol,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { error: profileError.message };
  }

  revalidatePath("/configuracion/usuarios");
  return { success: true as const, password };
}

export async function actualizarUsuarioStaff(
  id: string,
  cambios: { rol?: Rol; activo?: boolean }
) {
  await requireRol(["admin"]);

  const supabase = await createClient();
  const { error } = await supabase
    .from("core_profiles")
    .update(cambios)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/configuracion/usuarios");
  return { success: true as const };
}
