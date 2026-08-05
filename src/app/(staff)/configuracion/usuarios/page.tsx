import { requireRol } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { NuevoUsuarioForm } from "./nuevo-usuario-form";
import { UsuarioRow } from "./usuario-row";

export default async function UsuariosPage() {
  await requireRol(["admin"]);

  const supabase = await createClient();
  const { data: perfiles } = await supabase
    .from("core_profiles")
    .select("id, nombre, email, rol, activo")
    .order("nombre");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Usuarios del staff</h1>
        <p className="text-sm text-muted-foreground">
          Alta y gestión del equipo con acceso a la plataforma.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          El primer admin se crea a mano en Supabase (bootstrap, ver{" "}
          <code>docs/07_OPERACIONES.md</code>). Desde aquí ya puedes dar de
          alta a cualquier otro miembro del staff, incluido otro admin.
        </p>
      </div>

      <NuevoUsuarioForm />

      <div className="rounded-lg border border-border bg-card p-4">
        {perfiles?.length ? (
          perfiles.map((perfil) => (
            <UsuarioRow key={perfil.id} profile={perfil} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No hay usuarios todavía.</p>
        )}
      </div>
    </div>
  );
}
