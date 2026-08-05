import { createClient } from "@/lib/supabase/server";
import { SeguimientoForm } from "./seguimiento-form";

const TIPO_LABEL: Record<string, string> = {
  nota: "Nota",
  llamada: "Llamada",
  incidencia: "Incidencia",
  revision: "Revisión",
};

export default async function SeguimientoPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: seguimientos } = await supabase
    .from("crm_seguimientos")
    .select("id, tipo, texto, created_at, autor_id")
    .eq("cliente_id", params.id)
    .order("created_at", { ascending: false });

  const autorIds = Array.from(new Set((seguimientos ?? []).map((s) => s.autor_id)));
  const { data: autores } = autorIds.length
    ? await supabase.from("core_profiles").select("id, nombre").in("id", autorIds)
    : { data: [] as { id: string; nombre: string }[] };
  const autorPorId = new Map((autores ?? []).map((a) => [a.id, a.nombre]));

  return (
    <div className="space-y-4">
      <SeguimientoForm clienteId={params.id} />

      <div className="space-y-2">
        {seguimientos?.length ? (
          seguimientos.map((s) => (
            <div key={s.id} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {TIPO_LABEL[s.tipo] ?? s.tipo}
                </span>
                <span>
                  {autorPorId.get(s.autor_id) ?? "—"} ·{" "}
                  {new Date(s.created_at).toLocaleDateString("es-ES")}
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm">{s.texto}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Todavía no hay notas de seguimiento.
          </p>
        )}
      </div>
    </div>
  );
}
