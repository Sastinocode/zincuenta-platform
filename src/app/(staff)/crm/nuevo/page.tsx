import { requireRol } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { ClienteForm } from "../cliente-form";
import { crearCliente } from "../actions";

export default async function NuevoClientePage() {
  await requireRol(["admin", "gestion"]);

  const supabase = await createClient();
  const { data: entrenadores } = await supabase
    .from("core_profiles")
    .select("id, nombre")
    .eq("rol", "entrenador")
    .eq("activo", true)
    .order("nombre");

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-lg font-semibold">Nuevo cliente</h1>
      <ClienteForm
        entrenadores={entrenadores ?? []}
        onSubmit={crearCliente}
        submitLabel="Crear cliente"
      />
    </div>
  );
}
