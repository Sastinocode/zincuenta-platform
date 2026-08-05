import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Rol } from "@/lib/types";

export type { Rol };

export interface StaffProfile {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
}

/**
 * Perfil del usuario logueado (core_profiles). Memoizado por request con
 * cache() para que layout y page no dupliquen la consulta.
 */
export const getStaffProfile = cache(async (): Promise<StaffProfile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("core_profiles")
    .select("id, nombre, email, rol, activo")
    .eq("id", user.id)
    .maybeSingle();

  return data;
});

/**
 * Para páginas restringidas a ciertos roles. Redirige a "/" si el perfil
 * no existe, está desactivado, o no tiene uno de los roles permitidos.
 */
export async function requireRol(roles: Rol[]): Promise<StaffProfile> {
  const profile = await getStaffProfile();

  if (!profile || !profile.activo || !roles.includes(profile.rol)) {
    redirect("/");
  }

  return profile;
}
