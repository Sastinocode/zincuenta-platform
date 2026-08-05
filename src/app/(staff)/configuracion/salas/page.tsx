import { requireRol } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { NuevaSalaForm } from "./nueva-sala-form";
import { SalaRow } from "./sala-row";

export default async function SalasPage() {
  await requireRol(["admin"]);

  const supabase = await createClient();
  const { data: salas } = await supabase
    .from("core_salas")
    .select("id, nombre, pin, activa")
    .order("nombre");

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Salas</h1>
        <p className="text-sm text-muted-foreground">
          Nombre y PIN de emparejamiento para la pantalla de cada sala.
        </p>
      </div>

      <NuevaSalaForm />

      <div className="rounded-lg border border-border bg-card p-4">
        {salas?.length ? (
          salas.map((sala) => <SalaRow key={sala.id} sala={sala} />)
        ) : (
          <p className="text-sm text-muted-foreground">No hay salas todavía.</p>
        )}
      </div>
    </div>
  );
}
