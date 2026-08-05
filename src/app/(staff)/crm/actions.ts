"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRol } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import type { Database, TipoSeguimiento } from "@/lib/types";

type EstadoCliente = Database["public"]["Tables"]["core_clientes"]["Row"]["estado"];
type ClientePayload = Database["public"]["Tables"]["core_clientes"]["Insert"];

function parseClienteForm(
  formData: FormData
): { ok: true; value: ClientePayload } | { ok: false; error: string } {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!nombre || !email) {
    return { ok: false, error: "Nombre y email son obligatorios." };
  }

  const estado = String(formData.get("estado") ?? "activo").trim();
  if (!["activo", "pausado", "baja"].includes(estado)) {
    return { ok: false, error: "Estado no válido." };
  }

  const sexo = String(formData.get("sexo") ?? "").trim();
  const apellidos = String(formData.get("apellidos") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const fechaNacimiento = String(formData.get("fecha_nacimiento") ?? "").trim();
  const entrenadorId = String(formData.get("entrenador_id") ?? "").trim();
  const notas = String(formData.get("notas") ?? "").trim();

  return {
    ok: true,
    value: {
      nombre,
      apellidos: apellidos || null,
      email,
      telefono: telefono || null,
      fecha_nacimiento: fechaNacimiento || null,
      sexo: sexo === "M" || sexo === "F" || sexo === "otro" ? sexo : null,
      entrenador_id: entrenadorId || null,
      estado: estado as EstadoCliente,
      notas: notas || null,
    },
  };
}

function mensajeErrorGuardado(error: { code?: string; message: string }) {
  return error.code === "23505"
    ? "Ya existe un cliente con ese email."
    : error.message;
}

export async function crearCliente(formData: FormData) {
  await requireRol(["admin", "gestion"]);

  const parsed = parseClienteForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("core_clientes")
    .insert(parsed.value)
    .select("id")
    .single();

  if (error || !data) {
    return {
      error: mensajeErrorGuardado(error ?? { message: "No se pudo crear el cliente." }),
    };
  }

  revalidatePath("/crm");
  redirect(`/crm/${data.id}`);
}

export async function actualizarCliente(id: string, formData: FormData) {
  const profile = await requireRol(["admin", "gestion", "entrenador"]);
  const supabase = await createClient();

  if (profile.rol === "entrenador") {
    const { data: existing } = await supabase
      .from("core_clientes")
      .select("entrenador_id")
      .eq("id", id)
      .maybeSingle();

    if (!existing || existing.entrenador_id !== profile.id) {
      return { error: "No tienes permiso para editar este cliente." };
    }
  }

  const parsed = parseClienteForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const { error } = await supabase
    .from("core_clientes")
    .update(parsed.value)
    .eq("id", id);

  if (error) {
    return { error: mensajeErrorGuardado(error) };
  }

  revalidatePath(`/crm/${id}`);
  revalidatePath("/crm");
  return { success: true as const };
}

export async function crearSeguimiento(clienteId: string, formData: FormData) {
  const profile = await requireRol(["admin", "gestion", "entrenador"]);

  const tipo = String(formData.get("tipo") ?? "nota").trim();
  const texto = String(formData.get("texto") ?? "").trim();

  if (!texto) {
    return { error: "Escribe una nota antes de guardar." };
  }
  if (!["nota", "llamada", "incidencia", "revision"].includes(tipo)) {
    return { error: "Tipo no válido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("crm_seguimientos").insert({
    cliente_id: clienteId,
    autor_id: profile.id,
    tipo: tipo as TipoSeguimiento,
    texto,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/crm/${clienteId}/seguimiento`);
  return { success: true as const };
}
