import { getStaffProfile } from "@/lib/auth/profile";
import { ROL_LABEL } from "@/lib/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StaffHomePage() {
  const profile = await getStaffProfile();

  if (!profile) return null;

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Hola, {profile.nombre}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          Conectado como {profile.email} · {ROL_LABEL[profile.rol]}.
        </p>
        <p>
          Los módulos (CRM, Ejercicioteca, Sesiones, BodyMAP) todavía no están
          implementados.
        </p>
      </CardContent>
    </Card>
  );
}
