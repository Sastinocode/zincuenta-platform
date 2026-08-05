import Link from "next/link";

import { requireRol } from "@/lib/auth/profile";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ConfiguracionPage() {
  await requireRol(["admin"]);

  return (
    <div className="mx-auto grid max-w-lg gap-4">
      <Link href="/configuracion/usuarios">
        <Card className="transition-colors hover:border-primary">
          <CardHeader>
            <CardTitle>Usuarios del staff</CardTitle>
            <CardDescription>Alta, rol y estado del equipo.</CardDescription>
          </CardHeader>
        </Card>
      </Link>
      <Link href="/configuracion/salas">
        <Card className="transition-colors hover:border-primary">
          <CardHeader>
            <CardTitle>Salas</CardTitle>
            <CardDescription>
              Nombre y PIN de emparejamiento de cada sala.
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
}
