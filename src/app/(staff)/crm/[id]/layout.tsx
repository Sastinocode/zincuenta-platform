import { notFound } from "next/navigation";

import { StaffNav } from "@/components/staff/nav";
import { EstadoBadge } from "../estado-badge";
import { getCliente } from "./get-cliente";

export default async function ClienteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const cliente = await getCliente(params.id);
  if (!cliente) notFound();

  const base = `/crm/${params.id}`;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          {cliente.nombre} {cliente.apellidos ?? ""}
        </h1>
        <EstadoBadge estado={cliente.estado} />
      </div>

      <StaffNav
        items={[
          { href: base, label: "Datos", exact: true },
          { href: `${base}/bodymap`, label: "BodyMAP" },
          { href: `${base}/sesiones`, label: "Sesiones" },
          { href: `${base}/seguimiento`, label: "Seguimiento" },
        ]}
      />

      <div className="pt-2">{children}</div>
    </div>
  );
}
