import { getStaffProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { ClienteForm } from "../cliente-form";
import { actualizarCliente } from "../actions";
import { getCliente } from "./get-cliente";

export default async function ClienteDatosPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await getStaffProfile();
  if (!profile) return null;

  const cliente = await getCliente(params.id);
  if (!cliente) return null;

  const supabase = await createClient();
  const { data: entrenadores } = await supabase
    .from("core_profiles")
    .select("id, nombre")
    .eq("rol", "entrenador")
    .eq("activo", true)
    .order("nombre");

  const readOnly =
    profile.rol === "entrenador" && cliente.entrenador_id !== profile.id;

  return (
    <ClienteForm
      entrenadores={entrenadores ?? []}
      defaultValues={{
        nombre: cliente.nombre,
        apellidos: cliente.apellidos ?? "",
        email: cliente.email ?? "",
        telefono: cliente.telefono ?? "",
        fecha_nacimiento: cliente.fecha_nacimiento ?? "",
        sexo: cliente.sexo ?? "",
        entrenador_id: cliente.entrenador_id ?? "",
        estado: cliente.estado,
        notas: cliente.notas ?? "",
      }}
      onSubmit={(formData) => actualizarCliente(cliente.id, formData)}
      submitLabel="Guardar cambios"
      readOnly={readOnly}
    />
  );
}
