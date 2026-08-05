"use server";

import { revalidatePath } from "next/cache";

import { requireRol } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

export async function crearSala(formData: FormData) {
  await requireRol(["admin"]);

  const nombre = String(formData.get("nombre") ?? "").trim();
  const pin = String(formData.get("pin") ?? "").trim();

  if (!nombre || !/^\d{4,6}$/.test(pin)) {
    return { error: "Nombre obligatorio y PIN de 4 a 6 dígitos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("core_salas").insert({ nombre, pin });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/configuracion/salas");
  return { success: true as const };
}

export async function actualizarSala(
  id: string,
  cambios: { nombre?: string; pin?: string; activa?: boolean }
) {
  await requireRol(["admin"]);

  if (cambios.pin !== undefined && !/^\d{4,6}$/.test(cambios.pin)) {
    return { error: "El PIN debe tener de 4 a 6 dígitos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("core_salas")
    .update(cambios)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/configuracion/salas");
  return { success: true as const };
}
