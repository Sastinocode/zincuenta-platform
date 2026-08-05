import Link from "next/link";

import { getStaffProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientesFiltros } from "./clientes-filtros";
import { EstadoBadge } from "./estado-badge";

interface Props {
  searchParams: { q?: string; estado?: string; entrenador?: string };
}

export default async function CrmPage({ searchParams }: Props) {
  const profile = await getStaffProfile();
  if (!profile) return null;

  const supabase = await createClient();

  const { data: entrenadores } = await supabase
    .from("core_profiles")
    .select("id, nombre")
    .eq("rol", "entrenador")
    .eq("activo", true)
    .order("nombre");

  const entrenadorPorId = new Map((entrenadores ?? []).map((e) => [e.id, e.nombre]));

  let query = supabase
    .from("core_clientes")
    .select("id, nombre, apellidos, email, estado, entrenador_id")
    .order("nombre");

  const q = searchParams.q?.trim();
  if (q) {
    query = query.or(`nombre.ilike.%${q}%,apellidos.ilike.%${q}%,email.ilike.%${q}%`);
  }
  const ESTADOS = ["activo", "pausado", "baja"] as const;
  if (searchParams.estado && (ESTADOS as readonly string[]).includes(searchParams.estado)) {
    query = query.eq("estado", searchParams.estado as (typeof ESTADOS)[number]);
  }
  if (searchParams.entrenador) {
    query = query.eq("entrenador_id", searchParams.entrenador);
  }

  const { data: clientes } = await query;

  let misClientesCount: number | null = null;
  if (profile.rol === "entrenador") {
    const { count } = await supabase
      .from("core_clientes")
      .select("id", { count: "exact", head: true })
      .eq("entrenador_id", profile.id);
    misClientesCount = count ?? 0;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {profile.rol === "entrenador" && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href={`/crm?entrenador=${profile.id}`}>
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader className="space-y-1 p-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Mis clientes
                </CardTitle>
                <p className="text-2xl font-semibold">{misClientesCount}</p>
              </CardHeader>
            </Card>
          </Link>
          <Card className="h-full">
            <CardHeader className="space-y-1 p-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sin sesión en 14 días
              </CardTitle>
              <p className="text-2xl font-semibold text-muted-foreground">—</p>
              <p className="text-xs text-muted-foreground">Disponible en MP-7</p>
            </CardHeader>
          </Card>
          <Card className="h-full">
            <CardHeader className="space-y-1 p-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                BodyMAP sin revisar
              </CardTitle>
              <p className="text-2xl font-semibold text-muted-foreground">—</p>
              <p className="text-xs text-muted-foreground">Disponible en MP-3</p>
            </CardHeader>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Clientes</h1>
        {(profile.rol === "admin" || profile.rol === "gestion") && (
          <Button asChild size="sm">
            <Link href="/crm/nuevo">Nuevo cliente</Link>
          </Button>
        )}
      </div>

      <ClientesFiltros entrenadores={entrenadores ?? []} />

      <div className="space-y-2">
        {clientes?.length ? (
          clientes.map((cliente) => (
            <Link
              key={cliente.id}
              href={`/crm/${cliente.id}`}
              className="block rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {cliente.nombre} {cliente.apellidos ?? ""}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {cliente.email ?? "sin email"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <EstadoBadge estado={cliente.estado} />
                  {cliente.entrenador_id && (
                    <span className="text-xs text-muted-foreground">
                      {entrenadorPorId.get(cliente.entrenador_id) ?? "—"}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay clientes que coincidan con la búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}
